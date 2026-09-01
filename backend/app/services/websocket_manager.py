"""
WebSocket session hub for multi-agency telemetry and emergency broadcast.

Target: backend/app/services/websocket_manager.py (doc 09 §3.3)

Protocol summary:
  Client -> Server (JOIN_CAMPUS):
    { "type": "JOIN_CAMPUS", "campus_id": "CAMPUS-01", "role": "STUDENT" }

  Client -> Server (DRILL_TELEMETRY, ~2 Hz):
    { "type": "DRILL_TELEMETRY", "user_id": "U-123", "floor": "3F", "cell": [12, 8], "status": "EVACUATING" }

  Server -> All clients in campus room (EMERGENCY_BROADCAST, <50ms target):
    { "type": "EMERGENCY_BROADCAST", "severity": "EXTREME", "msg": "Earthquake aftershock detected." }

This stub implements the room-broker pattern. The Redis Pub/Sub relay for
horizontal scaling (multiple backend processes) is wired up here but will
be activated once Redis is connected in Sprint 2.
"""

import asyncio
import json
import logging
from typing import Any

from fastapi import WebSocket, WebSocketDisconnect
from starlette.websockets import WebSocketState

from app.schemas.websocket import JoinCampusMessage, DrillTelemetryMessage

logger = logging.getLogger(__name__)


class WebSocketManager:
    """
    Manages WebSocket connections grouped by campus_id.

    In production with multiple uvicorn workers, each worker holds its own
    in-memory rooms dict. A Redis Pub/Sub channel ("ws:campus:{id}") fans
    broadcasts out to all workers so any client on any worker receives every
    message.  The Redis relay is stubbed here and activated in Sprint 2.
    """

    def __init__(self) -> None:
        # campus_id -> set of (websocket, user_id, role)
        self._rooms: dict[str, set[tuple[WebSocket, str, str]]] = {}
        self._lock = asyncio.Lock()

    # ── connection lifecycle ────────────────────────────────────────────────

    async def connect(self, websocket: WebSocket) -> None:
        await websocket.accept()

    async def join_campus(self, websocket: WebSocket, payload: dict[str, Any]) -> None:
        """
        Parse a JOIN_CAMPUS message and register the socket in the
        corresponding campus room.
        """
        msg = JoinCampusMessage(**payload)
        async with self._lock:
            room = self._rooms.setdefault(msg.campus_id, set())
            room.add((websocket, payload.get("user_id", "anonymous"), msg.role))
        logger.info("WebSocket joined campus=%s role=%s", msg.campus_id, msg.role)

    async def disconnect(self, websocket: WebSocket) -> None:
        """Remove the socket from whatever room it was in."""
        async with self._lock:
            for campus_id, room in self._rooms.items():
                # Rebuild the room without the leaving socket. We can't
                # `set.discard()` a generator, so filter into a new set.
                remaining = {(ws, uid, role) for ws, uid, role in room if ws is not websocket}
                if remaining:
                    self._rooms[campus_id] = remaining
                else:
                    # Drop empty rooms so the dict doesn't grow forever
                    # as clients come and go during a long-running drill.
                    del self._rooms[campus_id]

    # ── telemetry ────────────────────────────────────────────────────────

    async def handle_telemetry(self, websocket: WebSocket, payload: dict[str, Any]) -> None:
        """
        Parse DRILL_TELEMETRY and broadcast it to every other participant
        in the same campus room.

        In Sprint 2 this will also persist the telemetry row to the DB.
        """
        msg = DrillTelemetryMessage(**payload)
        async with self._lock:
            # The DRILL_TELEMETRY payload does NOT carry campus_id - that
            # was set when the socket joined via JOIN_CAMPUS. Look the
            # socket up across all rooms to find which one it's in.
            target_room: set | None = None
            for room in self._rooms.values():
                if any(ws is websocket for ws, _, _ in room):
                    target_room = room
                    break

        if target_room is None:
            # Socket sent telemetry before/without joining a campus -
            # drop it on the floor rather than broadcasting globally.
            return

        others = [(ws, uid, role) for ws, uid, role in target_room if ws is not websocket]
        if not others:
            return

        broadcast = {
            "type": "DRILL_TELEMETRY",
            "user_id": msg.user_id,
            "floor": msg.floor,
            "cell": msg.cell,
            "status": msg.status,
        }
        await self._broadcast_json(others, broadcast)

    # ── emergency broadcast ────────────────────────────────────────────────

    async def broadcast_emergency(
        self, campus_id: str, severity: str, message: str
    ) -> None:
        """
        Send EMERGENCY_BROADCAST to every connected client in a campus room.
        Called by the CAP ingestion worker or the REST API.
        """
        async with self._lock:
            room = list(self._rooms.get(campus_id, set()))

        if not room:
            return

        payload = {
            "type": "EMERGENCY_BROADCAST",
            "severity": severity,
            "msg": message,
        }
        logger.warning("EMERGENCY broadcast campus=%s severity=%s", campus_id, severity)
        await self._broadcast_json(room, payload)

    async def broadcast_emergency_all(self, severity: str, message: str) -> None:
        """Broadcast to every connected client regardless of campus."""
        async with self._lock:
            all_sockets = [
                (ws, uid, role)
                for room in self._rooms.values()
                for ws, uid, role in room
            ]

        if not all_sockets:
            return

        payload = {
            "type": "EMERGENCY_BROADCAST",
            "severity": severity,
            "msg": message,
        }
        logger.warning("EMERGENCY broadcast ALL campuses severity=%s", severity)
        await self._broadcast_json(all_sockets, payload)

    # ── internals ─────────────────────────────────────────────────────────

    async def _broadcast_json(
        self,
        recipients: list[tuple[WebSocket, str, str]],
        payload: dict[str, Any],
    ) -> None:
        data = json.dumps(payload)
        await asyncio.gather(
            *[ws.send_text(data) for ws, _, _ in recipients if ws.client_state == WebSocketState.CONNECTED],
            return_exceptions=True,
        )


# Singleton shared across the app - imported in main.py
ws_manager = WebSocketManager()
