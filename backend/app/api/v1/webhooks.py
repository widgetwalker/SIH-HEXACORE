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

from fastapi import APIRouter, HTTPException, status

from app.schemas.incident import INCIDENT_PRESETS, IncidentInjectRequest
from app.services.websocket_manager import ws_manager

router = APIRouter()


@router.post("/webhooks/inject-incident", status_code=status.HTTP_202_ACCEPTED)
async def inject_incident(payload: IncidentInjectRequest) -> dict:
    preset = INCIDENT_PRESETS.get(payload.incident_type)
    if preset is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unknown incident_type")

    message = f"{preset['label']} — {preset['location']}"

    # Broadcast to every connected socket regardless of room. The app has
    # exactly one campus today, and everyone who connects auto-joins it
    # (see useEmergencyBroadcasts.ts), so a room-scoped broadcast would
    # just double-deliver this to the same clients broadcast_emergency_all
    # already reaches.
    await ws_manager.broadcast_emergency_all(preset["severity"], message)

    return {"status": "broadcast", "incident_type": payload.incident_type, "message": message}
