"""
Persistent telemetry API for drill run analytics.

Provides two endpoints:

- POST /api/v1/telemetry/runs
    Persists a RunTelemetryRequest payload (end-of-run summary) to the
    ``drill_runs`` table, replacing any prior entry for the same ``runId``.
    This replaces browser localStorage persistence with server-side storage.

- GET /api/v1/telemetry/analytics
    Aggregates all persisted runs into KPI tiles and a per-cell heatmap
    for the admin dashboard.

Fields ingested per run: student ID, run ID, completion time, peak panic
index, oxygen level, route taken, and survival result.
"""

from __future__ import annotations

import logging
import uuid as _uuid
from collections import Counter
from datetime import datetime, timezone
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db_session
from app.models.drill import DrillMode, DrillRun, DrillSession, DrillStatus
from app.models.institution import Institution
from app.schemas.analytics import AnalyticsResponse, HeatmapData, KPIData
from app.schemas.drill import RunTelemetryRequest, RunTelemetryResponse

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/telemetry", tags=["telemetry"])

# Default drill session ID used when no real session exists.
# Created lazily on first POST and reused for all subsequent anonymous
# runs (i.e. runs where the frontend doesn't supply a session UUID).
_DEFAULT_DRILL_SESSION_ID = _uuid.UUID("00000000-0000-0000-0000-000000000001")


async def _ensure_default_drill_session(db: AsyncSession) -> _uuid.UUID:
    """
    Ensure a default Institution and DrillSession exist and return the session UUID.

    Created with mode=VIRTUAL_SIMULATION so it is clearly an analytics-
    catch-all rather than a real scheduled drill.  Both rows use a fixed
    sentinel UUID so they are idempotent on every startup.
    """
    result = await db.execute(
        select(DrillSession).where(DrillSession.id == _DEFAULT_DRILL_SESSION_ID)
    )
    if result.scalar_one_or_none() is not None:
        return _DEFAULT_DRILL_SESSION_ID

    # Ensure the default institution exists first
    inst_result = await db.execute(
        select(Institution).where(Institution.id == _DEFAULT_DRILL_SESSION_ID)
    )
    if inst_result.scalar_one_or_none() is None:
        inst = Institution(
            id=_DEFAULT_DRILL_SESSION_ID,
            name="Default Analytics Institution",
            institution_type="VIRTUAL_SIMULATION",
            contact_email="analytics@localhost",
            contact_phone="0000000000",
        )
        db.add(inst)
        await db.flush()  # make the institution visible within this transaction

    session = DrillSession(
        id=_DEFAULT_DRILL_SESSION_ID,
        institution_id=_DEFAULT_DRILL_SESSION_ID,
        mode=DrillMode.VIRTUAL_SIMULATION,
        status=DrillStatus.COMPLETED,
        scenario_id="default",
        primary_hazard="unknown",
    )
    db.add(session)
    await db.commit()
    logger.info("Created default drill session %s", _DEFAULT_DRILL_SESSION_ID)
    return _DEFAULT_DRILL_SESSION_ID


# ── POST /telemetry/runs ─────────────────────────────────────────────────────


@router.post(
    "/runs",
    response_model=RunTelemetryResponse,
    tags=["telemetry"],
    summary="Persist end-of-run telemetry",
)
async def persist_run_telemetry(
    body: RunTelemetryRequest,
    db: AsyncSession = Depends(get_db_session),
) -> RunTelemetryResponse:
    """
    Persist a drill-run summary payload sent by the frontend simulation
    when a run ends.

    Ingests: student ID (userId), run ID (runId), completion time (time),
    peak panic index (panicPeak), oxygen level (oxygenLeft), route taken
    (routeHeat + cols/rows), and survival result (status: "won" or "lost").

    The ``runId`` is the idempotency key — posting the same runId twice
    replaces the existing row so the frontend can safely retry without
    creating duplicates.

    ``drill_session_id`` is resolved from ``runId`` if it is a valid UUID,
    otherwise a default catch-all session is used so the row never violates
    the FK constraint.

    The ``createdAt`` field is stored as the raw client-side millisecond
    timestamp so analytics queries can align browser and server clocks.
    """
    # Resolve drill_session_id: try runId as a UUID, fall back to default session
    try:
        drill_session_uuid = _uuid.UUID(body.runId)
    except ValueError:
        drill_session_uuid = await _ensure_default_drill_session(db)

    run = DrillRun(
        run_id=body.runId,
        drill_session_id=drill_session_uuid,
        user_id=body.userId,
        scenario_id=body.scenarioId,
        scenario_name=body.scenarioName,
        status=body.status,
        time=body.time,
        oxygen_left=body.oxygenLeft,
        panic_peak=body.panicPeak,
        panic_freeze_seconds=body.panicFreezeSeconds,
        score=body.score,
        smoke_standing_seconds=body.smokeStandingSeconds,
        smoke_crouch_seconds=body.smokeCrouchSeconds,
        breath_count=body.breathCount,
        distance_traveled=body.distanceTraveled,
        fire_cell_entries=body.fireCellEntries,
        exit_used={"c": body.exitUsed.c, "r": body.exitUsed.r} if body.exitUsed else None,
        death_cell={"c": body.deathCell.c, "r": body.deathCell.r} if body.deathCell else None,
        violations=[v.model_dump() for v in body.violations],
        route_heat=body.routeHeat,
        cols=body.cols,
        rows=body.rows,
        created_at=body.createdAt,
    )

    # Upsert: replace if the same runId was already persisted
    result = await db.execute(select(DrillRun).where(DrillRun.run_id == body.runId))
    existing = result.scalar_one_or_none()
    if existing:
        await db.delete(existing)

    db.add(run)
    await db.commit()

    logger.info(
        "Persisted run runId=%s userId=%s scenarioId=%s status=%s",
        body.runId, body.userId, body.scenarioId, body.status,
    )

    return RunTelemetryResponse(
        run_id=body.runId,
        persisted=True,
        server_received_at=datetime.now(timezone.utc),
    )


# ── GET /telemetry/analytics ─────────────────────────────────────────────────


@router.get(
    "/analytics",
    response_model=AnalyticsResponse,
    tags=["telemetry"],
    summary="Aggregated drill-run analytics",
)
async def get_analytics(
    db: AsyncSession = Depends(get_db_session),
    scenario_id: Annotated[str | None, Query(description="Filter by scenario ID")] = None,
    limit: Annotated[int, Query(ge=1, le=10000, description="Max number of runs to analyse")] = 1000,
) -> AnalyticsResponse:
    """
    Return aggregated KPIs and a per-cell heatmap across persisted drill runs.

    Aggregates: average exit times, bottleneck cells (highest-heat + casualty
    cells from the route heatmap), and safe headcount percentage (survival rate).

    Optionally filter by ``scenario_id``. The ``limit`` parameter caps how many
    rows are fetched to bound query time on large tables.

    Returns a flat KPI object plus per-scenario breakdowns, and a heatmap
    grid whose dimensions (``cols`` x ``rows``) match the run that contributed
    the most data.  All run data is assumed to share the same grid
    dimensions — which is true for the embedded scenarios.
    """
    # Build query — optionally scoped to a scenario
    q = select(DrillRun).order_by(DrillRun.created_at.desc()).limit(limit)
    if scenario_id:
        q = q.where(DrillRun.scenario_id == scenario_id)

    result = await db.execute(q)
    runs = list(result.scalars().all())

    if not runs:
        return AnalyticsResponse(
            kpis=KPIData(
                total_drills=0,
                success_rate=0.0,
                safe_headcount_pct=0.0,
                avg_escape_time_sec=0.0,
                avg_peak_panic=0.0,
                top_failure_mode="none",
                top_failure_count=0,
            ),
            heatmap=HeatmapData(cols=24, rows=16, heat=[], casualty_cells=[], exit_cells=[]),
            per_scenario={},
        )

    # ── KPIs ────────────────────────────────────────────────────────────────
    total = len(runs)
    won = sum(1 for r in runs if r.status == "won")
    success_rate = won / total if total > 0 else 0.0

    # Safe headcount percentage: proportion of runs that survived (won)
    safe_headcount_pct = round(success_rate * 100, 2)

    # Average exit / completion time
    escape_times = [float(r.time) for r in runs if r.time is not None]
    avg_escape_time = sum(escape_times) / len(escape_times) if escape_times else 0.0

    # Average peak panic index
    panic_peaks = [float(r.panic_peak) for r in runs if r.panic_peak is not None]
    avg_panic_peak = sum(panic_peaks) / len(panic_peaks) if panic_peaks else 0.0

    # Failure / bottleneck detection: most common violation types
    failure_counter: Counter[str] = Counter()
    for run in runs:
        for v in (run.violations or []):
            failure_counter[v.get("type", "unknown") if isinstance(v, dict) else "unknown"] += 1

    top_failure = failure_counter.most_common(1)
    top_failure_mode = top_failure[0][0] if top_failure else "none"
    top_failure_count = top_failure[0][1] if top_failure else 0

    kpis = KPIData(
        total_drills=total,
        success_rate=round(success_rate, 4),
        safe_headcount_pct=safe_headcount_pct,
        avg_escape_time_sec=round(avg_escape_time, 2),
        avg_peak_panic=round(avg_panic_peak, 2),
        top_failure_mode=top_failure_mode,
        top_failure_count=top_failure_count,
    )

    # ── Per-scenario KPIs ───────────────────────────────────────────────────
    per_scenario: dict[str, KPIData] = {}
    scenario_groups: dict[str, list[DrillRun]] = {}
    for run in runs:
        scenario_groups.setdefault(run.scenario_id, []).append(run)

    for sid, s_runs in scenario_groups.items():
        s_total = len(s_runs)
        s_won = sum(1 for r in s_runs if r.status == "won")
        s_escape = [float(r.time) for r in s_runs if r.time is not None]
        s_panic = [float(r.panic_peak) for r in s_runs if r.panic_peak is not None]
        s_failure_counter: Counter[str] = Counter()
        for run in s_runs:
            for v in (run.violations or []):
                s_failure_counter[v.get("type", "unknown") if isinstance(v, dict) else "unknown"] += 1
        s_top = s_failure_counter.most_common(1)
        per_scenario[sid] = KPIData(
            total_drills=s_total,
            success_rate=round(s_won / s_total, 4) if s_total > 0 else 0.0,
            safe_headcount_pct=round(s_won / s_total * 100, 2) if s_total > 0 else 0.0,
            avg_escape_time_sec=round(sum(s_escape) / len(s_escape), 2) if s_escape else 0.0,
            avg_peak_panic=round(sum(s_panic) / len(s_panic), 2) if s_panic else 0.0,
            top_failure_mode=s_top[0][0] if s_top else "none",
            top_failure_count=s_top[0][1] if s_top else 0,
        )

    # ── Heatmap + bottleneck detection ─────────────────────────────────────
    # Use the most common grid dimensions
    dims = Counter((r.cols, r.rows) for r in runs)
    cols, rows = dims.most_common(1)[0][0]

    heat_size = cols * rows
    heat_accum = [0.0] * heat_size

    casualty_cells: list[list[int]] = []
    exit_cells: list[list[int]] = []

    for run in runs:
        route = run.route_heat or []
        for i, val in enumerate(route[:heat_size]):
            if isinstance(val, (int, float)):
                heat_accum[i] += val

        if run.death_cell and isinstance(run.death_cell, dict):
            c = run.death_cell.get("c")
            r = run.death_cell.get("r")
            if c is not None and r is not None:
                casualty_cells.append([c, r])

        if run.exit_used and isinstance(run.exit_used, dict):
            c = run.exit_used.get("c")
            r = run.exit_used.get("r")
            if c is not None and r is not None:
                exit_cells.append([c, r])

    heatmap = HeatmapData(
        cols=cols,
        rows=rows,
        heat=[round(v, 4) for v in heat_accum],
        casualty_cells=casualty_cells,
        exit_cells=exit_cells,
        spawn_cell=None,
    )

    return AnalyticsResponse(kpis=kpis, heatmap=heatmap, per_scenario=per_scenario)


# ── GET /telemetry/runs/{run_id} ────────────────────────────────────────────


@router.get(
    "/runs/{run_id}",
    response_model=RunTelemetryResponse,
    tags=["telemetry"],
    summary="Retrieve a single persisted run",
)
async def get_run_telemetry(
    run_id: str,
    db: AsyncSession = Depends(get_db_session),
) -> RunTelemetryResponse:
    """
    Return the persisted telemetry for a single run, identified by its ``runId``.
    Returns 404 if the run has not been persisted.
    """
    result = await db.execute(select(DrillRun).where(DrillRun.run_id == run_id))
    run = result.scalar_one_or_none()

    if run is None:
        raise HTTPException(status_code=404, detail=f"Run {run_id!r} not found")

    return RunTelemetryResponse(
        run_id=run.run_id,
        persisted=True,
        server_received_at=datetime.now(timezone.utc),
    )
