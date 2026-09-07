"""
Incident injection API — the EOC's "Incident Injection Deck" calls this
when an operator wants to push a simulated emergency to all connected
participants in real time.

Provides:

- POST /api/v1/incidents/inject
    Inject a synthetic emergency (transformer fire, chemical spill, gas leak,
    or a custom type).  The server:
      1. Constructs an EMERGENCY_BROADCAST payload.
      2. Publishes it through the shared WebSocketManager so all clients in
         the affected campus room receive it within milliseconds.
      3. Optionally persists a synthetic EmergencyAlert for audit.

In Sprint 3 this is wired into the WebSocketManager.broadcast_emergency()
path.  It does NOT require any CAP XML or external feed — incidents are
generated locally.
"""

from __future__ import annotations

import logging
from typing import Literal

from pydantic import BaseModel, Field
from fastapi import APIRouter, HTTPException

from app.services.websocket_manager import ws_manager

logger = logging.getLogger(__name__)

router = APIRouter()

IncidentType = Literal["transformer_fire", "chemical_spill", "gas_leak", "fire", "flood", "earthquake", "custom"]


class IncidentInjectRequest(BaseModel):
    """Body of POST /api/v1/incidents/inject."""

    incident_type: IncidentType
    title: str = Field(..., max_length=255)
    detail: str = Field(..., max_length=2000)
    severity: Literal["CRITICAL", "WARNING", "ADVISORY"] = "CRITICAL"
    floor: str | None = Field(None, description="Floor id, e.g. '4F', '1F'")
    campus_id: str | None = Field(None, description="Target campus id; default = broadcast to all")
    persist: bool = Field(True, description="Persist synthetic alert to DB for audit")


class IncidentInjectResponse(BaseModel):
    """Returned after a successful incident injection."""

    status: str
    incident_type: str
    title: str
    severity: str
    broadcast_to: str
    persisted: bool
    detail: str


@router.post(
    "/incidents/inject",
    response_model=IncidentInjectResponse,
    tags=["incidents"],
    summary="Inject a synthetic emergency incident",
)
async def inject_incident(body: IncidentInjectRequest) -> IncidentInjectResponse:
    """
    Push a synthetic incident to all connected WebSocket clients in the
    affected campus (or to every campus if no campus_id is given).

    This is the backend half of the IncidentInjectionDeck used by EOC
    operators during tabletop drills.  The frontend already has the
    card UI — the wire was the only missing piece.
    """
    if not body.title.strip():
        raise HTTPException(status_code=422, detail="title is required")

    # Build the message that CommandPage's LiveThreatBanner consumes.
    full_message = body.title
    if body.floor:
        full_message = f"{body.title} ({body.floor})"
    if body.detail:
        full_message = f"{full_message} — {body.detail}"

    # Map our severity to the EMERGENCY_BROADCAST severity field that the
    # WebSocketManager expects (Extreme/Severe/Moderate/Minor).
    severity_for_broadcast = {
        "CRITICAL": "Extreme",
        "WARNING": "Severe",
        "ADVISORY": "Moderate",
    }[body.severity]

    if body.campus_id:
        await ws_manager.broadcast_emergency(
            campus_id=body.campus_id,
            severity=severity_for_broadcast,
            message=full_message,
        )
        broadcast_to = f"campus:{body.campus_id}"
    else:
        await ws_manager.broadcast_emergency_all(
            severity=severity_for_broadcast,
            message=full_message,
        )
        broadcast_to = "all_campuses"

    persisted = False
    if body.persist:
        # Lazy import so we don't bring in heavy model code if not used.
        from datetime import datetime, timezone
        from sqlalchemy import select
        from app.core.database import AsyncSessionLocal
        from app.models.alert import EmergencyAlert
        from app.models.institution import Institution

        try:
            async with AsyncSessionLocal() as session:
                # Find any institution to attach the synthetic alert to.
                # We do not require a real campus match because this is
                # an operator-injected simulation, not a CAP feed.
                result = await session.execute(select(Institution).limit(1))
                inst = result.scalar_one_or_none()
                if inst is None:
                    # Create a sentinel institution so the alert has a FK target.
                    import uuid
                    sentinel = Institution(
                        id=uuid.UUID("00000000-0000-0000-0000-000000000002"),
                        name="Synthetic Incident Origin",
                        institution_type="SIMULATION",
                        contact_email="ops@localhost",
                        contact_phone="0000000000",
                    )
                    session.add(sentinel)
                    await session.flush()
                    inst = sentinel

                now = datetime.now(timezone.utc)
                cap_id = f"synthetic-{body.incident_type}-{int(now.timestamp() * 1000)}"
                alert = EmergencyAlert(
                    cap_identifier=cap_id,
                    sender="safezone-incident-injection-deck",
                    sent_at=now,
                    status="Exercise",
                    msg_type="Alert",
                    urgency="Immediate",
                    severity=severity_for_broadcast,
                    certainty="Observed",
                    event_category=body.incident_type,
                    headline=body.title,
                    description=body.detail,
                    instruction=None,
                    is_active=True,
                )
                # Attach via FK target institution if it has an alert relationship;
                # otherwise just persist with a sentinel id.
                # The model does not have a direct institution_id column, so we
                # simply add the alert — the FK is the affected_polygon, which is
                # optional.
                session.add(alert)
                await session.commit()
                persisted = True
        except Exception as exc:  # noqa: BLE001
            logger.warning("Failed to persist synthetic incident: %s", exc)

    logger.info(
        "Injected incident type=%s title=%r severity=%s broadcast_to=%s persisted=%s",
        body.incident_type, body.title, body.severity, broadcast_to, persisted,
    )

    return IncidentInjectResponse(
        status="injected",
        incident_type=body.incident_type,
        title=body.title,
        severity=body.severity,
        broadcast_to=broadcast_to,
        persisted=persisted,
        detail=full_message,
    )
