"""
Live alerts API — powers the EOC CommandPage LiveThreatBanner.

Provides:

- GET /api/v1/alerts/live
    Returns active (is_active=True) alerts from the emergency_alerts table,
    most-recent first.  The frontend polls this every ~30 s as a fallback
    when the WebSocket is disconnected; the WebSocket delivers the same
    data in real time via EMERGENCY_BROADCAST frames.
"""

from __future__ import annotations

import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db_session
from app.models.alert import EmergencyAlert
from app.schemas.alert import EmergencyAlertResponse

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
) -> list[EmergencyAlertResponse]:
    """
    Return the most-recent ``limit`` active alerts.

    The ``severity`` filter matches the ``severity`` field of the CAP alert
    (Extreme / Severe / Moderate / Minor).  If omitted, all active alerts are
    returned.

    This endpoint is polled by the CommandPage when the WebSocket is not
    connected.  Real-time delivery uses the EMERGENCY_BROADCAST frame
    delivered over the WebSocket connection.
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

    return [
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

    Called when a CommandPage operator clicks "Acknowledge" on the
    LiveThreatBanner.
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
