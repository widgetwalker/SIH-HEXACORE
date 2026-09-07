"""
Live alerts API — powers the EOC CommandPage LiveThreatBanner.

Provides:

- GET /api/v1/alerts/live
    Returns active alerts from the emergency_alerts table (persisted incidents/CAP),
    combined with real-time external hazard feeds (USGS earthquakes + Open-Meteo weather).
    Polled by CommandPage and broadcasted over WebSockets.

- GET /api/v1/alerts/{alert_id}
    Fetch a single alert by UUID.

- PATCH /api/v1/alerts/{alert_id}/acknowledge
    Acknowledge and deactivate an alert.
"""

from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db_session
from app.models.alert import EmergencyAlert
from app.schemas.alert import EmergencyAlertResponse
from app.services.external_alerts import DEFAULT_LAT, DEFAULT_LON, get_live_alerts as get_external_live_alerts

router = APIRouter()


@router.get(
    "/alerts/live",
    response_model=list[EmergencyAlertResponse],
    tags=["alerts"],
    summary="Active emergency alerts",
)
async def get_live_alerts(
    db: AsyncSession = Depends(get_db_session),
    limit: Annotated[int, Query(ge=1, le=200, description="Max alerts to return")] = 20,
    severity: Annotated[str | None, Query(description="Filter by severity (Extreme/Severe/Moderate/Minor)")] = None,
    lat: float = Query(DEFAULT_LAT, description="Campus latitude"),
    lon: float = Query(DEFAULT_LON, description="Campus longitude"),
) -> list[EmergencyAlertResponse]:
    """
    Return active alerts from the database and external real-time feeds.
    """
    q = (
        select(EmergencyAlert)
        .where(EmergencyAlert.is_active == True)  # noqa: E712
        .order_by(EmergencyAlert.sent_at.desc())
        .limit(limit)
    )
    if severity:
        q = q.where(EmergencyAlert.severity.ilike(f"%{severity}%"))

    result = await db.execute(q)
    alerts = result.scalars().all()

    responses: list[EmergencyAlertResponse] = [
        EmergencyAlertResponse(
            id=str(alert.id),
            cap_identifier=alert.cap_identifier,
            sender=alert.sender,
            sent_at=alert.sent_at,
            severity=alert.severity,
            urgency=alert.urgency,
            event_category=alert.event_category,
            headline=alert.headline,
            description=alert.description,
            instruction=alert.instruction,
            is_active=alert.is_active,
        )
        for alert in alerts
    ]

    # Also augment with live USGS / Open-Meteo feeds if under limit
    try:
        external = await get_external_live_alerts(lat, lon)
        for ext in external:
            if len(responses) >= limit:
                break
            try:
                sent_dt = datetime.fromisoformat(ext.occurred_at)
            except Exception:
                sent_dt = datetime.now(timezone.utc)

            responses.append(
                EmergencyAlertResponse(
                    id=ext.id,
                    cap_identifier=ext.id,
                    sender=ext.source,
                    sent_at=sent_dt,
                    severity=ext.severity,
                    urgency="Immediate",
                    event_category=ext.category,
                    headline=ext.headline,
                    description=ext.detail,
                    instruction="Follow NDMA safety protocols and evacuate or shelter as instructed.",
                    is_active=True,
                )
            )
    except Exception:
        pass

    return responses


# ── GET /api/v1/alerts/{alert_id} ────────────────────────────────────────


@router.get(
    "/alerts/{alert_id}",
    response_model=EmergencyAlertResponse,
    tags=["alerts"],
    summary="Single alert by ID",
)
async def get_alert(
    alert_id: uuid.UUID,
    db: AsyncSession = Depends(get_db_session),
) -> EmergencyAlertResponse:
    """Return one alert by its UUID, or raise 404."""
    result = await db.execute(select(EmergencyAlert).where(EmergencyAlert.id == alert_id))
    alert = result.scalar_one_or_none()
    if alert is None:
        raise HTTPException(status_code=404, detail="Alert not found")

    return EmergencyAlertResponse(
        id=str(alert.id),
        cap_identifier=alert.cap_identifier,
        sender=alert.sender,
        sent_at=alert.sent_at,
        severity=alert.severity,
        urgency=alert.urgency,
        event_category=alert.event_category,
        headline=alert.headline,
        description=alert.description,
        instruction=alert.instruction,
        is_active=alert.is_active,
    )


# ── PATCH /api/v1/alerts/{alert_id}/acknowledge ───────────────────────────


@router.patch(
    "/alerts/{alert_id}/acknowledge",
    response_model=EmergencyAlertResponse,
    tags=["alerts"],
    summary="Acknowledge / deactivate an alert",
)
async def acknowledge_alert(
    alert_id: uuid.UUID,
    db: AsyncSession = Depends(get_db_session),
) -> EmergencyAlertResponse:
    """
    Mark an alert as inactive (acknowledged by an EOC operator).
    """
    result = await db.execute(select(EmergencyAlert).where(EmergencyAlert.id == alert_id))
    alert = result.scalar_one_or_none()
    if alert is None:
        raise HTTPException(status_code=404, detail="Alert not found")

    alert.is_active = False
    await db.commit()
    await db.refresh(alert)

    return EmergencyAlertResponse(
        id=str(alert.id),
        cap_identifier=alert.cap_identifier,
        sender=alert.sender,
        sent_at=alert.sent_at,
        severity=alert.severity,
        urgency=alert.urgency,
        event_category=alert.event_category,
        headline=alert.headline,
        description=alert.description,
        instruction=alert.instruction,
        is_active=alert.is_active,
    )
