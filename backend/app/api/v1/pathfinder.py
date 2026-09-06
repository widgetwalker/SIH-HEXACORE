"""
Real-time pathfinding API for evacuation routes.

Exposes ``POST /api/v1/pathfinder/route`` which takes a ``PathRequest``
and returns a ``PathResult`` computed by the ``DynamicPathfinder`` service.

The endpoint is intentionally lightweight — the heavy lifting (A* with
dynamic hazard weights) is done synchronously in the service layer so
the request completes in < 15 ms even under load.
"""

import math
from fastapi import APIRouter
from fastapi.responses import JSONResponse

from app.schemas.pathfinder import HazardState, PathRequest, PathResult
from app.services.pathfinder import DynamicPathfinder, pathfinder

router = APIRouter(prefix="/pathfinder", tags=["pathfinder"])


def _sanitise_result(result: PathResult) -> dict:
    """
    Convert a PathResult to a dict, replacing any ``math.inf`` floats
    with a JSON-safe sentinel so FastAPI's JSON encoder doesn't crash.
    """
    d = result.model_dump()
    cost = d.get("total_cost")
    # Replace inf/-inf with None (JSON-safe, frontend can treat as "unreachable")
    # Guard against None first — math.isinf(None) raises TypeError.
    if cost is not None and (cost == float("inf") or math.isinf(cost)):
        d["total_cost"] = None
    return d


@router.post(
    "/route",
    response_model=PathResult,
    tags=["pathfinder"],
    summary="Compute evacuation path",
)
async def compute_route(request: PathRequest) -> JSONResponse:
    """
    Compute an evacuation path from the given start position.

    The path avoids fire cells and penalises smoke exposure.  If a path
    cannot be found within ``max_time_ms`` milliseconds, a partial result
    is returned with ``found=False``.

    Typical use: a frontend simulation needing a safe exit route during
    a live drill, or a warden dashboard planning an egress route.
    """
    result = pathfinder.find_path(request)
    return JSONResponse(content=_sanitise_result(result))


@router.post(
    "/re-route",
    response_model=PathResult,
    tags=["pathfinder"],
    summary="Incremental re-route from current position",
)
async def re_route(request: PathRequest, current_path: list[list[int]]) -> JSONResponse:
    """
    Incrementally re-route from a partial path when conditions change
    (e.g., a corridor blocks mid-drill).

    ``current_path`` is the path computed so far; the service will
    re-route from its midpoint, preserving the already-computed prefix.
    """
    result = pathfinder.re_route(current_path, request)
    return JSONResponse(content=_sanitise_result(result))


# ── start-up initialisation ────────────────────────────────────────────

async def init_pathfinder() -> None:
    """
    Initialise the global pathfinder with floor data from the database.

    Call this from ``main.py`` lifespan or app-startup hook so the
    A* grid has floor / exit information before any requests arrive.

    If the database is unavailable (cold start, dev environment without
    Postgres, etc.) we log a warning and continue — the pathfinder
    falls back to its "no floor data" mode and returns ``found=False``
    for every request instead of preventing the whole app from booting.
    """
    import logging
    logger = logging.getLogger(__name__)
    try:
        await pathfinder.initialize()
    except Exception as exc:  # noqa: BLE001
        logger.warning(
            "Pathfinder could not load floor data at startup: %s. "
            "The API will start in degraded mode (all routes return "
            "found=False) until the database is reachable.",
            exc,
        )