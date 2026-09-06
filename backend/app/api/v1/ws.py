"""
WebSocket route for the multi-agency telemetry/emergency hub.

Wires the HTTP-level route to the WebSocketManager singleton in
app/services/websocket_manager.py - see that file for the full message
protocol (JOIN_CAMPUS, DRILL_TELEMETRY, EMERGENCY_BROADCAST). This route
was the missing piece: the manager and its schemas already existed, but
nothing ever called `.accept()` on an incoming connection.
"""

import json
import logging

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from pydantic import ValidationError

from app.services.websocket_manager import ws_manager

logger = logging.getLogger(__name__)
router = APIRouter()


@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket) -> None:
    await ws_manager.connect(websocket)
    try:
        while True:
            raw = await websocket.receive_text()
            try:
                payload = json.loads(raw)
            except ValueError:
                continue

            msg_type = payload.get("type")
            try:
                if msg_type == "JOIN_CAMPUS":
                    await ws_manager.join_campus(websocket, payload)
                elif msg_type == "DRILL_TELEMETRY":
                    await ws_manager.handle_telemetry(websocket, payload)
            except ValidationError as e:
                logger.warning("Rejected malformed %s message: %s", msg_type, e)
    except WebSocketDisconnect:
        pass
    finally:
        await ws_manager.disconnect(websocket)
