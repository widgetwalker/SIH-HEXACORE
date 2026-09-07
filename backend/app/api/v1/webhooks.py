"""
Incident injection webhook for drills and evaluation.

Lets a coordinator simulate an active campus emergency (fire, chemical
spill, gas leak) from the /command control panel. Broadcasts an
EMERGENCY_BROADCAST over the WebSocket hub to every connected /simulate
and /command client. This is a live drill signal, not a permanent alert
record, so it deliberately doesn't write to the database - the same
pattern real SACHET/CAP ingestion (app/services/cap_ingestion.py) will
use once that's wired to `ws_manager.broadcast_emergency*` too.
"""

from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, status

from app.schemas.incident import INCIDENT_PRESETS, IncidentInjectRequest
from app.services.websocket_manager import ws_manager

router = APIRouter()

# In-memory storage of active drill injections so GET /api/v1/alerts/live serves them
ACTIVE_INJECTED_INCIDENTS: dict[str, dict] = {}


@router.post("/webhooks/inject-incident", status_code=status.HTTP_202_ACCEPTED)
async def inject_incident(payload: IncidentInjectRequest) -> dict:
    preset = INCIDENT_PRESETS.get(payload.incident_type)
    if preset is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unknown incident_type")

    message = f"{preset['label']} — {preset['location']}"
    alert_id = f"drill-{payload.incident_type}"

    ACTIVE_INJECTED_INCIDENTS[alert_id] = {
        "id": alert_id,
        "cap_identifier": alert_id,
        "sender": "Campus-EOC-Drill",
        "sent_at": datetime.now(timezone.utc),
        "severity": preset["severity"],
        "urgency": "Immediate",
        "event_category": payload.incident_type,
        "headline": f"DRILL ALERT: {preset['label']}",
        "description": f"Simulated crisis in {preset['location']}. Execute emergency safety protocols immediately.",
        "instruction": "Follow NDMA safety protocols and proceed to the designated assembly zone.",
        "is_active": True,
    }

    # Broadcast to every connected socket regardless of room
    await ws_manager.broadcast_emergency_all(preset["severity"], message)

    return {"status": "broadcast", "incident_type": payload.incident_type, "message": message, "alert_id": alert_id}

