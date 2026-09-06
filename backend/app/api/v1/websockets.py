"""
WebSocket API route — /api/v1/ws

Upgrades the HTTP connection to a WebSocket and delegates message
routing to the shared WebSocketManager singleton.

The route is intentionally thin: it only handles the connection lifecycle
and dispatches incoming messages to the manager. All business logic
(telemetry persistence, Redis fan-out, campus room management) lives in
``app.services.websocket_manager``.

Auth: the JWT must be presented in the ``?token=`` query string.  Auth
is enforced in ``WebSocketManager.connect()`` before this handler takes
over — failed auth closes the socket with code 1008 (Policy Violation).
"""

import asyncio
import json
import logging
from typing import Any

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.core.database import AsyncSessionLocal
from app.schemas.websocket import DrillTelemetryMessage, JoinCampusMessage
from app.services.websocket_manager import ws_manager

logger = logging.getLogger(__name__)

router = APIRouter()

# Limit incoming payload size (defence against slow-loris / DoS).
# 16 KB covers the largest legitimate telemetry message.
_MAX_MESSAGE_BYTES = 16 * 1024


@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket) -> None:
    """
    Main WebSocket endpoint.

    Lifecycle:
      1. Client connects with ``?token=<jwt>`` query param.
      2. Manager verifies the token and accepts the connection.
      3. Client sends JSON messages (JOIN_CAMPUS, DRILL_TELEMETRY).
      4. Manager broadcasts to other clients in the same campus room.
      5. On disconnect, the manager cleans up the room.
    """
    accepted = await ws_manager.connect(websocket)
    if not accepted:
        # connect() already closed the socket; nothing more to do
        return

    try:
        while True:
            # Bounded receive prevents an attacker from filling memory by
            # sending huge frames.
            raw = await websocket.receive_text()
            if len(raw) > _MAX_MESSAGE_BYTES:
                logger.warning("WebSocket message too large (%d bytes) — closing", len(raw))
                await websocket.close(code=1009)  # 1009 = Message Too Big
                return

            try:
                message: dict[str, Any] = json.loads(raw)
            except json.JSONDecodeError:
                logger.warning("Received non-JSON WebSocket message: %s", raw[:200])
                await _send_error(websocket, "Invalid JSON")
                continue

            if not isinstance(message, dict):
                await _send_error(websocket, "Expected JSON object")
                continue

            msg_type = message.get("type")
            try:
                if msg_type == "JOIN_CAMPUS":
                    # Validate before handing to the manager so we don't
                    # waste a roundtrip on a malformed message.
                    JoinCampusMessage(**message)
                    await ws_manager.join_campus(websocket, message)
                elif msg_type == "DRILL_TELEMETRY":
                    # Same — Pydantic validation up front.
                    DrillTelemetryMessage(**message)
                    await ws_manager.handle_telemetry(
                        websocket, message, AsyncSessionLocal
                    )
                else:
                    logger.warning("Unknown WebSocket message type: %s", msg_type)
                    await _send_error(websocket, f"Unknown message type: {msg_type}")
            except Exception as exc:
                # Pydantic validation or any other per-message error.
                logger.warning("Invalid %s message: %s", msg_type, exc)
                await _send_error(websocket, f"Invalid {msg_type} payload")

    except WebSocketDisconnect:
        logger.info("WebSocket disconnected (client side)")
    except asyncio.CancelledError:
        logger.info("WebSocket task cancelled")
    except Exception as exc:
        logger.error("WebSocket error: %s", exc, exc_info=True)
    finally:
        await ws_manager.disconnect(websocket)


async def _send_error(websocket: WebSocket, detail: str) -> None:
    """Best-effort error message back to the client."""
    try:
        await websocket.send_text(json.dumps({"type": "ERROR", "detail": detail}))
    except Exception:
        pass
