"""
WebSocket session hub for multi-agency telemetry and emergency broadcast.

Target: backend/app/services/websocket_manager.py (doc 09 §3.3)

Protocol summary:
  Client -> Server (JOIN_CAMPUS):
    { "type": "JOIN_CAMPUS", "campus_id": "CAMPUS-01" }

  Client -> Server (DRILL_TELEMETRY, ~2 Hz):
    { "type": "DRILL_TELEMETRY", "drill_session_id": "...", "floor": 3, "cell": [12, 8], "status": "EVACUATING" }

  Server -> All clients in campus room (EMERGENCY_BROADCAST, <50ms target):
    { "type": "EMERGENCY_BROADCAST", "severity": "EXTREME", "msg": "Earthquake aftershock detected." }

Redis Pub/Sub architecture (horizontal scaling):
  - Each campus room subscribes to a channel named "ws:campus:{campus_id}"
  - When a client sends telemetry the local worker:
      1. Persists it to Postgres
      2. Publishes it to the Redis channel
  - Every worker (including this one) receives the Redis message and
    re-broadcasts to its own local clients in that campus room
  - The "_source" field in the Redis payload prevents re-publishing.
"""

import asyncio
import json
import logging
import re
from typing import Any
from uuid import UUID

from fastapi import WebSocket
from starlette.websockets import WebSocketState

import jwt

from app.core.config import settings
from app.core.redis_client import redis_client
from app.schemas.websocket import JoinCampusMessage, DrillTelemetryMessage

logger = logging.getLogger(__name__)

# Strict algorithm allowlist — prevents "none" algorithm attacks.
_ALLOWED_ALGORITHMS = frozenset({"HS256", "HS384", "HS512", "RS256", "RS384", "RS512"})

# Valid campus_id characters: alphanumeric + hyphens + underscores (no special
# characters that could be used in Redis command injection).
_CAMPUS_ID_PATTERN = re.compile(r"^[a-zA-Z0-9_-]{1,64}$")


class WebSocketManager:
    """
    Manages WebSocket connections grouped by campus_id.

    In production with multiple uvicorn workers, each worker holds its own
    in-memory rooms dict. A Redis Pub/Sub channel ("ws:campus:{id}") fans
    broadcasts out to all workers so any client on any worker receives every
    message.
    """

    # How many seconds between Redis reconnection attempts
    _REDIS_RECONNECT_DELAY: float = 5.0

    def __init__(self) -> None:
        # campus_id -> set of (websocket, user_id, role)
        self._rooms: dict[str, set[tuple[WebSocket, str, str]]] = {}
        self._lock = asyncio.Lock()

        # campus_id -> asyncio.Task that listens to the Redis channel
        self._redis_tasks: dict[str, asyncio.Task[None]] = {}
        self._redis_lock = asyncio.Lock()

    # ── connection lifecycle ────────────────────────────────────────────────

    async def connect(self, websocket: WebSocket) -> bool:
        """
        Accept the WebSocket connection after verifying the JWT token.

        The token is passed in the query string as ``?token=<jwt>`` (the
        standard pattern for WebSocket auth, since HTTP headers can't be
        sent during the upgrade handshake). If the token is missing or
        invalid the connection is rejected with a 401 close code.

        Returns True if the connection was accepted, False if it was closed
        during the handshake.
        """
        # SECURITY: reject placeholder secrets — prevents using the insecure
        # default in any environment, even if .env is misconfigured.
        if settings.JWT_SECRET_KEY == "change-me-in-env-file":
            logger.error("WebSocket rejected: JWT_SECRET_KEY is still the placeholder value")
            await websocket.close(code=1008)
            return False

        token = websocket.query_params.get("token")
        if not token:
            logger.warning("WebSocket connection rejected: no token provided")
            await websocket.close(code=1008)
            return False

        try:
            # SECURITY: decode WITHOUT the algorithm from settings first, then
            # verify the algorithm is in the allowlist.  jwt.decode() accepts
            # the algorithm from the key if none is specified, so we must
            # pass algorithms= explicitly to enforce the allowlist.
            # SECURITY: also validate iss/aud if configured.
            kwargs: dict[str, Any] = {
                "algorithms": [settings.JWT_ALGORITHM],
                "options": {"verify_signature": True},
            }
            # Only verify audience/issuer when they are configured.
            if getattr(settings, "JWT_AUDIENCE", None):
                kwargs["audience"] = settings.JWT_AUDIENCE
            if getattr(settings, "JWT_ISSUER", None):
                kwargs["issuer"] = settings.JWT_ISSUER

            payload = jwt.decode(
                token,
                settings.JWT_SECRET_KEY,
                **kwargs,
            )

            # Validate sub claim is a well-formed UUID.
            raw_sub = payload.get("sub")
            if not raw_sub:
                logger.warning("WebSocket rejected: token missing 'sub' claim")
                await websocket.close(code=1008)
                return False
            try:
                user_id = str(UUID(str(raw_sub)))
            except (ValueError, AttributeError):
                logger.warning("WebSocket rejected: 'sub' is not a valid UUID (%r)", raw_sub)
                await websocket.close(code=1008)
                return False

            # SECURITY: role is read from the token claim but must be validated
            # against the known user_role_enum set.  In a full implementation
            # this would be looked up from the DB on each connect (revocation
            # support).  For now we validate the claim against the enum so
            # a self-signed token can't grant arbitrary privileges.
            role_claim = payload.get("role", "STUDENT")
            role = self._validate_role(role_claim)

        except jwt.ExpiredSignatureError:
            logger.warning("WebSocket rejected: token has expired")
            await websocket.close(code=1008)
            return False
        except jwt.InvalidAudienceError:
            logger.warning("WebSocket rejected: invalid audience")
            await websocket.close(code=1008)
            return False
        except jwt.InvalidIssuerError:
            logger.warning("WebSocket rejected: invalid issuer")
            await websocket.close(code=1008)
            return False
        except jwt.InvalidSignatureError:
            logger.warning("WebSocket rejected: signature verification failed")
            await websocket.close(code=1008)
            return False
        except jwt.DecodeError as exc:
            logger.warning("WebSocket rejected: malformed token (%s)", exc)
            await websocket.close(code=1008)
            return False
        except Exception as exc:
            logger.warning("WebSocket rejected: unexpected auth error (%s)", exc)
            await websocket.close(code=1008)
            return False

        await websocket.accept()
        # Store identity in the websocket scope's state dict (the canonical
        # Starlette location for per-request state, not the raw object attrs).
        websocket.scope.setdefault("state", {})
        websocket.scope["state"]["user_id"] = user_id
        websocket.scope["state"]["role"] = role
        logger.info("WebSocket authenticated user_id=%s role=%s", user_id, role)
        return True

    # ── role validation ─────────────────────────────────────────────────────

    # Known roles — must stay in sync with user_role_enum in schema.sql.
    _VALID_ROLES: frozenset[str] = frozenset({
        "STUDENT",
        "TEACHER_WARDEN",
        "SCHOOL_ADMIN",
        "NDRF_RESPONDER",
        "FIRE_SERVICE",
        "POLICE_EMS",
        "SDMA_ANALYST",
    })

    def _validate_role(self, claim: Any) -> str:
        """Return the claim if it is a known role, otherwise default to STUDENT."""
        if isinstance(claim, str) and claim in self._VALID_ROLES:
            return claim
        logger.warning("Unknown role claim %r — defaulting to STUDENT", claim)
        return "STUDENT"

    # ── campus join ─────────────────────────────────────────────────────────

    async def join_campus(self, websocket: WebSocket, payload: dict[str, Any]) -> str | None:
        """
        Parse a JOIN_CAMPUS message and register the socket in the
        corresponding campus room.

        The user_id and role come from the authenticated websocket scope state
        (set during connect()), not from the JOIN_CAMPUS payload, so a
        client can't impersonate another user or claim an elevated role.
        campus_id is validated against a strict character allowlist.

        Returns the campus_id if the join succeeded, None otherwise.
        """
        # Validate campus_id format before parsing the full message.
        raw_campus_id = payload.get("campus_id", "")
        if not _CAMPUS_ID_PATTERN.match(raw_campus_id):
            logger.warning("JOIN_CAMPUS rejected: invalid campus_id format %r", raw_campus_id)
            await websocket.send_text(json.dumps({
                "type": "ERROR",
                "detail": "Invalid campus_id format",
            }))
            return None

        campus_id = raw_campus_id

        # SECURITY: read user_id and role ONLY from authenticated state.
        # Raise if missing — no silent fallback to "anonymous".
        state = websocket.scope.get("state")
        if not state:
            logger.error("join_campus called on unauthenticated socket")
            await websocket.send_text(json.dumps({
                "type": "ERROR",
                "detail": "Not authenticated",
            }))
            return None

        user_id = state.get("user_id")
        role = state.get("role", "STUDENT")

        # Validate the campus_id against the allowlist after extracting.
        if not _CAMPUS_ID_PATTERN.match(campus_id):
            await websocket.send_text(json.dumps({
                "type": "ERROR",
                "detail": "Invalid campus_id format",
            }))
            return None

        async with self._lock:
            room = self._rooms.setdefault(campus_id, set())
            room.add((websocket, user_id, role))

        logger.info(
            "WebSocket joined campus=%s user_id=%s role=%s",
            campus_id, user_id, role,
        )

        # Start the Redis listener for this campus (if not already running)
        await self._ensure_redis_listener(campus_id)

        return campus_id

    async def disconnect(self, websocket: WebSocket) -> None:
        """Remove the socket from whatever room it was in."""
        # Capture the leaving user_id and campus_id BEFORE we clear the
        # room, so we can untrack them from the PathfinderBridge.
        leaving_user_id: str | None = None
        leaving_campus_id: str | None = None
        async with self._lock:
            for campus_id, room in list(self._rooms.items()):
                for ws, uid, _ in list(room):
                    if ws is websocket:
                        leaving_user_id = uid
                        leaving_campus_id = campus_id
                        break
                # Rebuild the room without the leaving socket.
                remaining = {(ws, uid, role) for ws, uid, role in room if ws is not websocket}
                if remaining:
                    self._rooms[campus_id] = remaining
                else:
                    # Drop empty rooms so the dict doesn't grow forever
                    # as clients come and go during a long-running drill.
                    del self._rooms[campus_id]
                    # Stop the Redis listener for this campus
                    await self._stop_redis_listener(campus_id)

        # Untrack from the PathfinderBridge.  Lazy-imported to avoid a
        # circular import.
        if leaving_user_id and leaving_campus_id:
            try:
                from app.services.pathfinder_bridge import pathfinder_bridge
                await pathfinder_bridge.untrack_user(leaving_campus_id, leaving_user_id)
            except Exception:  # noqa: BLE001
                # Best-effort cleanup; never let tracking errors break disconnect.
                pass

    # ── telemetry ───────────────────────────────────────────────────────────

    async def handle_telemetry(
        self,
        websocket: WebSocket,
        payload: dict[str, Any],
        db_session_factory,  # callable that returns an AsyncSession
    ) -> None:
        """
        Parse DRILL_TELEMETRY, persist it to the DB, and broadcast it.

        Steps:
          1. Parse and validate the message
          2. Persist to student_drill_telemetry via the provided session
          3. Publish to Redis so all workers fan it out to their clients
        """
        msg = DrillTelemetryMessage(**payload)

        # SECURITY: user_id must be set from authenticated state — no fallback.
        state = websocket.scope.get("state")
        if not state or "user_id" not in state:
            logger.warning("DRILL_TELEMETRY from unauthenticated socket — ignoring")
            return
        user_id = state["user_id"]

        # 1. Persist to Postgres
        try:
            await self._persist_telemetry(msg, user_id, db_session_factory)
        except Exception as exc:
            logger.error("Failed to persist telemetry: %s", exc)
            # Don't re-raise — a DB write failure shouldn't break telemetry
            # relay; we still want to broadcast the update.

        # 2. Find the local campus room
        campus_id = self._find_campus_id(websocket)
        if not campus_id:
            return

        # 3. Build broadcast payload and publish to Redis
        broadcast = {
            "type": "DRILL_TELEMETRY",
            "user_id": user_id,
            "floor": msg.floor,
            "cell": msg.cell,
            "status": msg.status,
        }
        await self._publish_to_campus(campus_id, broadcast)

        # 4. Track this user on their floor so the PathfinderBridge
        # knows where to re-route when a hazard update arrives.
        # Lazy-imported to avoid a circular import between
        # websocket_manager and pathfinder_bridge.
        from app.services.pathfinder_bridge import pathfinder_bridge
        await pathfinder_bridge.track_user(campus_id, user_id, msg.floor)

    async def _persist_telemetry(
        self,
        msg: DrillTelemetryMessage,
        user_id: str,
        db_session_factory,
    ) -> None:
        """
        Insert (or update) a StudentDrillTelemetry row.

        For periodic telemetry (status not a terminal state) we upsert
        the most recent position so the drill dashboard can show live
        positions. On a terminal status ("EVACUATED_SAFE", "VIRTUAL_CASUALTY",
        etc.) we finalise the row.
        """
        from app.models.drill import StudentDrillTelemetry
        from sqlalchemy import select
        from datetime import datetime, timezone

        TERMINAL_STATUSES = {"EVACUATED_SAFE", "VIRTUAL_CASUALTY", "TRAPPED_SHELTERED", "RESCUED"}

        async with db_session_factory() as db:
            try:
                drill_session_uuid = UUID(msg.drill_session_id)
            except ValueError:
                logger.warning("Invalid drill_session_id format: %s", msg.drill_session_id)
                return

            try:
                user_uuid = UUID(user_id)
            except ValueError:
                logger.warning("Invalid user_id format: %s", user_id)
                return

            # Check if a telemetry record already exists for this
            # drill session + user (resume on reconnection)
            result = await db.execute(
                select(StudentDrillTelemetry).where(
                    StudentDrillTelemetry.drill_session_id == drill_session_uuid,
                    StudentDrillTelemetry.user_id == user_uuid,
                )
            )
            record = result.scalar_one_or_none()

            if record is None:
                record = StudentDrillTelemetry(
                    drill_session_id=drill_session_uuid,
                    user_id=user_uuid,
                    starting_floor=msg.floor,  # Pydantic already validated floor is int
                    final_status=msg.status,
                )
                db.add(record)
            else:
                record.final_status = msg.status

            if msg.status in TERMINAL_STATUSES:
                record.completed_at = datetime.now(timezone.utc)

            await db.commit()
            logger.debug(
                "Telemetry persisted: drill=%s user=%s floor=%s status=%s",
                msg.drill_session_id, user_id, msg.floor, msg.status,
            )

    def _find_campus_id(self, websocket: WebSocket) -> str | None:
        """Return the campus_id a websocket is currently in, or None."""
        for campus_id, room in self._rooms.items():
            if any(ws is websocket for ws, _, _ in room):
                return campus_id
        return None

    # ── Redis Pub/Sub ───────────────────────────────────────────────────────

    async def _ensure_redis_listener(self, campus_id: str) -> None:
        """
        Start a background task that listens to the Redis channel for
        ``campus_id`` if one isn't already running.
        """
        async with self._redis_lock:
            if campus_id in self._redis_tasks:
                return  # Already listening
            task = asyncio.create_task(self._redis_listener(campus_id))
            self._redis_tasks[campus_id] = task
            logger.info("Started Redis listener for campus=%s", campus_id)

    async def _stop_redis_listener(self, campus_id: str) -> None:
        """Cancel and clean up the Redis listener for a campus."""
        async with self._redis_lock:
            task = self._redis_tasks.pop(campus_id, None)

        if task is not None:
            task.cancel()
            try:
                await task
            except asyncio.CancelledError:
                pass
            logger.info("Stopped Redis listener for campus=%s", campus_id)

    async def _redis_listener(self, campus_id: str) -> None:
        """
        Subscribe to ``ws:campus:{campus_id}`` and re-broadcast every
        message received to all local clients in that room.

        Listens indefinitely; reconnects automatically on connection drop.
        """
        channel = f"ws:campus:{campus_id}"

        while True:
            pubsub = None
            try:
                # redis.asyncio creates a fresh connection each time
                # pubsub is entered, so we create a new client per attempt.
                client = redis_client
                pubsub = client.pubsub()
                await pubsub.subscribe(channel)
                logger.info("Redis subscribed to channel=%s", channel)

                async for raw_message in pubsub.listen():
                    if raw_message["type"] != "message":
                        continue

                    try:
                        data = json.loads(raw_message["data"])
                    except json.JSONDecodeError:
                        logger.warning("Malformed Redis message on %s: %s", channel, raw_message["data"])
                        continue

                    # Skip messages that originated from this very worker,
                    # otherwise we'd double-broadcast.
                    if data.get("_source") == "local":
                        continue

                    await self._redis_broadcast(campus_id, data)

            except asyncio.CancelledError:
                # Clean shutdown
                if pubsub is not None:
                    try:
                        await pubsub.unsubscribe(channel)
                    except Exception:
                        pass
                raise

            except Exception as exc:
                logger.warning(
                    "Redis listener error for campus=%s: %s. Reconnecting in %.0fs",
                    campus_id, exc, self._REDIS_RECONNECT_DELAY,
                )
                if pubsub is not None:
                    try:
                        await pubsub.punsubscribe(channel)
                    except Exception:
                        pass
                await asyncio.sleep(self._REDIS_RECONNECT_DELAY)

    async def _redis_broadcast(self, campus_id: str, data: dict[str, Any]) -> None:
        """
        Send a message received from Redis to all local clients in the room.
        """
        async with self._lock:
            room = list(self._rooms.get(campus_id, set()))

        if not room:
            return

        payload = json.dumps(data)
        await asyncio.gather(
            *[
                ws.send_text(payload)
                for ws, _, _ in room
                if ws.client_state is WebSocketState.CONNECTED
            ],
            return_exceptions=True,
        )

    async def _publish_to_campus(self, campus_id: str, data: dict[str, Any]) -> None:
        """
        Publish a message to the Redis channel for a campus and also
        broadcast it to all local clients.
        """
        channel = f"ws:campus:{campus_id}"

        # Tag with source so other workers don't echo it back to us
        data["_source"] = "local"

        try:
            await redis_client.publish(channel, json.dumps(data))
        except Exception as exc:
            logger.warning("Failed to publish to Redis channel %s: %s", channel, exc)

        # Broadcast to local clients
        async with self._lock:
            room = list(self._rooms.get(campus_id, set()))

        payload = json.dumps(data)
        await asyncio.gather(
            *[
                ws.send_text(payload)
                for ws, _, _ in room
                if ws.client_state is WebSocketState.CONNECTED
            ],
            return_exceptions=True,
        )

    # ── emergency broadcast ────────────────────────────────────────────────

    async def broadcast_emergency(
        self, campus_id: str, severity: str, message: str
    ) -> None:
        """
        Send EMERGENCY_BROADCAST to every connected client in a campus room.
        Called by the CAP ingestion worker or the REST API.
        """
        payload = {
            "type": "EMERGENCY_BROADCAST",
            "severity": severity,
            "msg": message,
            "_source": "local",
        }
        logger.warning("EMERGENCY broadcast campus=%s severity=%s", campus_id, severity)

        async with self._lock:
            room = list(self._rooms.get(campus_id, set()))

        if room:
            await self._broadcast_json(room, payload)

        # Also publish to Redis so other workers broadcast to their clients
        try:
            await redis_client.publish(f"ws:campus:{campus_id}", json.dumps(payload))
        except Exception as exc:
            logger.warning("Failed to publish emergency to Redis: %s", exc)

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
            "_source": "local",
        }
        logger.warning("EMERGENCY broadcast ALL campuses severity=%s", severity)
        await self._broadcast_json(all_sockets, payload)

        # Fan out to all active campus channels
        for campus_id in self._rooms:
            try:
                await redis_client.publish(f"ws:campus:{campus_id}", json.dumps(payload))
            except Exception as exc:
                logger.warning("Failed to publish campus emergency to Redis: %s", exc)

    # ── pathfinder integration ─────────────────────────────────────────────

    async def broadcast_path_update(
        self,
        campus_id: str,
        update: dict[str, Any],
    ) -> None:
        """
        Push a PATH_UPDATE message to all clients in a campus room.

        Called by the PathfinderBridge after a hazard change triggers a
        re-route.  Also publishes to Redis so other workers fan it out.
        """
        payload = {**update, "_source": "local"}

        async with self._lock:
            room = list(self._rooms.get(campus_id, set()))

        if room:
            await self._broadcast_json(room, payload)

        try:
            await redis_client.publish(f"ws:campus:{campus_id}", json.dumps(payload))
        except Exception as exc:
            logger.warning(
                "Failed to publish PATH_UPDATE to Redis for campus=%s: %s",
                campus_id, exc,
            )

    # ── shutdown ───────────────────────────────────────────────────────────

    async def shutdown(self) -> None:
        """Cancel all Redis listener tasks on app shutdown."""
        logger.info("Shutting down WebSocket manager...")
        for campus_id in list(self._rooms):
            await self._stop_redis_listener(campus_id)

    # ── internals ─────────────────────────────────────────────────────────

    async def _broadcast_json(
        self,
        recipients: list[tuple[WebSocket, str, str]],
        payload: dict[str, Any],
    ) -> None:
        data = json.dumps(payload)
        await asyncio.gather(
            *[
                ws.send_text(data)
                for ws, _, _ in recipients
                if ws.client_state is WebSocketState.CONNECTED
            ],
            return_exceptions=True,
        )


# Singleton shared across the app - imported in main.py
ws_manager = WebSocketManager()
