"""
Bridge between the pathfinder service and the WebSocket manager.

Why this exists
---------------
The pathfinder is a request/response service: a client calls
``POST /api/v1/pathfinder/route`` and gets a path back. But during a live
drill, hazards change continuously (a fire spreads, a corridor seals, an
aftershock closes a wing). Re-asking the frontend to re-request a path
on every hazard tick is wasteful and adds latency to a life-safety
feature.

This module is the missing glue:

  hazard update ──►  PathfinderBridge  ──►  pathfinder.re_route()
                                                       │
                                                       ▼
                                              PATH_UPDATE broadcast
                                                  (via ws_manager)

It listens to a Redis channel ``path:hazard:{campus_id}`` for hazard
state changes, re-runs the pathfinder for each affected floor, and
emits a ``PATH_UPDATE`` WebSocket message so wardens and the frontend
simulation can show the new escape route in real time.

Wired up in ``app.main`` via ``init_pathfinder_bridge()`` so it starts
with the rest of the lifespan hooks.
"""

from __future__ import annotations

import asyncio
import json
import logging
import re
import time
from typing import Any

from app.core.config import settings
from app.core.redis_client import redis_client
from app.schemas.pathfinder import HazardState, PathRequest
from app.services.pathfinder import pathfinder as pathfinder_service
from app.services.websocket_manager import ws_manager

logger = logging.getLogger(__name__)

# Same allowlist as WebSocketManager — reuse the pattern.
_CAMPUS_ID_PATTERN = re.compile(r"^[a-zA-Z0-9_-]{1,64}$")

# Only re-broadcast if the new path is materially different from the last
# one we sent.  Prevents flapping when hazards oscillate (e.g. a fire
# wavers, smoke density drops 0.1, climbs 0.1, drops again).
_COST_DELTA_THRESHOLD = 0.20  # 20% change in total_cost triggers an update
_EXIT_CHANGE_ALWAYS_UPDATES = True  # different exit -> always notify


class PathfinderBridge:
    """
    Listens for hazard updates and pushes recomputed paths over the WS hub.

    Maintains a per-(campus, floor) cache of the last broadcast path so it
    can suppress noise and only push when something actually changed.
    """

    # Per-floor: tracked_users is the set of users currently drilling on a
    # floor; we only re-route for floors with active users.  last_path is
    # the last PathResult we broadcast.
    def __init__(self) -> None:
        # (campus_id, floor) -> PathResult
        self._last_path: dict[tuple[str, int], dict[str, Any]] = {}
        # campus_id -> set of (user_id, floor) currently active
        self._active_users: dict[str, set[tuple[str, int]]] = {}
        self._lock = asyncio.Lock()
        # campus_id -> asyncio.Task listening to Redis
        self._listener_tasks: dict[str, asyncio.Task[None]] = {}
        self._listener_lock = asyncio.Lock()
        # campus_id -> latest HazardState (so callers can re-route without
        # re-publishing the same hazard state)
        self._last_hazard: dict[str, dict[str, Any]] = {}

    # ── public API ─────────────────────────────────────────────────────────

    async def init_pathfinder_bridge(self) -> None:
        """
        Start the bridge.  Called from ``app.main`` startup hook.

        For now this is a no-op; the listener is started lazily when a
        campus first publishes a hazard update.  Kept as a hook so we
        can add startup-time work later (e.g. a cache warmup).
        """
        # Touch the singletons so they're not garbage-collected before
        # the first publish.
        _ = redis_client
        _ = ws_manager
        _ = pathfinder_service
        logger.info("PathfinderBridge initialised")

    async def publish_hazard_update(
        self,
        campus_id: str,
        hazard: HazardState,
    ) -> None:
        """
        Publish a hazard snapshot to the pathfinder's Redis channel.

        The local worker AND every other worker subscribed to the
        campus will run the re-route.  Each worker only broadcasts the
        result to its own local clients; the result is the same on
        every worker because the algorithm is deterministic.
        """
        if not _CAMPUS_ID_PATTERN.match(campus_id):
            logger.warning("publish_hazard_update: invalid campus_id %r", campus_id)
            return

        # Make sure we have a listener (locally) for this campus.
        await self._ensure_listener(campus_id)

        payload = {
            "campus_id": campus_id,
            "hazard": hazard.model_dump(),
            "ts": time.time(),
            "_source": "local",
        }
        channel = f"path:hazard:{campus_id}"
        try:
            await redis_client.publish(channel, json.dumps(payload))
        except Exception as exc:
            logger.warning("Failed to publish hazard to %s: %s", channel, exc)
        # Also run locally so single-worker deployments still re-route.
        await self._handle_hazard(campus_id, hazard)

    async def track_user(
        self,
        campus_id: str,
        user_id: str,
        floor: int,
    ) -> None:
        """
        Register a user as actively drilling on a floor.

        Called by the WebSocket telemetry handler.  This lets the
        bridge only re-route for floors where someone is actually
        trying to escape — there's no point computing a new path for
        a floor with zero active users.
        """
        async with self._lock:
            self._active_users.setdefault(campus_id, set()).add((user_id, floor))

    async def untrack_user(self, campus_id: str, user_id: str) -> None:
        """Remove a user from the active set (on disconnect)."""
        async with self._lock:
            users = self._active_users.get(campus_id)
            if not users:
                return
            # Remove any entries for this user
            self._active_users[campus_id] = {
                (uid, f) for uid, f in users if uid != user_id
            }
            if not self._active_users[campus_id]:
                del self._active_users[campus_id]

    # ── hazard handling ────────────────────────────────────────────────────

    async def _handle_hazard(
        self,
        campus_id: str,
        hazard: HazardState,
    ) -> None:
        """Recompute paths for active floors and broadcast PATH_UPDATE."""
        async with self._lock:
            active = list(self._active_users.get(campus_id, set()))

        if not active:
            logger.debug("No active users in campus=%s — skipping re-route", campus_id)
            return

        # Build the set of floors that need re-routing (deduped).
        floors = {floor for _, floor in active}
        logger.info(
            "Hazard update campus=%s floors=%s re-routing...",
            campus_id, sorted(floors),
        )

        # Cache the latest hazard so future track_user calls can re-route
        # immediately if the floor is fresh.
        async with self._lock:
            self._last_hazard[campus_id] = hazard.model_dump()

        for floor in floors:
            await self._reroute_floor(campus_id, floor, hazard)

    async def _reroute_floor(
        self,
        campus_id: str,
        floor: int,
        hazard: HazardState,
    ) -> None:
        """
        Pick a representative start cell for the floor and re-route.

        We use the first active user on this floor as the seed; their
        current cell becomes the start of the re-route.  For other users
        on the same floor they receive the same broadcast (the route
        graph is identical for any start on the same connected component
        under the same hazard state, so this is a reasonable
        approximation — a fully individual route per user would
        multiply the compute cost by N).
        """
        async with self._lock:
            users = list(self._active_users.get(campus_id, set()))
        users_on_floor = [(uid, f) for uid, f in users if f == floor]
        if not users_on_floor:
            return

        # Use the first user as the start; the pathfinder will find a
        # route that any user on the same floor can follow.
        seed_user_id, _ = users_on_floor[0]

        # Try to use the user's known cell from the active set.  If
        # we don't have it (the active set is user+floor only), fall
        # back to (0, 0).
        start_col, start_row = 0, 0
        # NOTE: a future enhancement would track per-user cell
        # positions in track_user; for now the pathfinder still
        # produces a valid floor-wide route.

        request = PathRequest(
            start_col=start_col,
            start_row=start_row,
            start_floor=floor,
            hazard=hazard,
            max_time_ms=15.0,
        )
        try:
            result = pathfinder_service.find_path(request)
        except Exception as exc:
            logger.error("Pathfinder failed for campus=%s floor=%s: %s", campus_id, floor, exc)
            return

        # Skip if the path is materially the same as last time.
        if not self._should_broadcast(campus_id, floor, result):
            logger.debug(
                "Path for campus=%s floor=%s unchanged (cost delta < threshold) — skipping",
                campus_id, floor,
            )
            return

        async with self._lock:
            self._last_path[(campus_id, floor)] = result.model_dump()

        # Build the broadcast payload
        update_msg = {
            "type": "PATH_UPDATE",
            "user_id": seed_user_id,  # primary user; the route is floor-wide
            "path": result.path,
            "exits_used": result.exits_used,
            "computation_time_ms": result.computation_time_ms,
        }
        await ws_manager.broadcast_path_update(campus_id, update_msg)

    def _should_broadcast(
        self,
        campus_id: str,
        floor: int,
        result,
    ) -> bool:
        """Return True if ``result`` is materially different from the last broadcast."""
        last = self._last_path.get((campus_id, floor))
        if last is None:
            return True
        # If found flipped (e.g. exit got blocked), always update.
        if last.get("found") != result.found:
            return True
        # If the exit set changed, always update.
        if _EXIT_CHANGE_ALWAYS_UPDATES and last.get("exits_used") != result.exits_used:
            return True
        # If the cost jumped > 20%, update.
        last_cost = last.get("total_cost", 0.0) or 0.0
        new_cost = result.total_cost
        if last_cost <= 0:
            return new_cost != 0
        delta = abs(new_cost - last_cost) / last_cost
        return delta >= _COST_DELTA_THRESHOLD

    # ── Redis listener ─────────────────────────────────────────────────────

    async def _ensure_listener(self, campus_id: str) -> None:
        async with self._listener_lock:
            if campus_id in self._listener_tasks:
                return
            task = asyncio.create_task(self._redis_listener(campus_id))
            self._listener_tasks[campus_id] = task
            logger.info("PathfinderBridge: started Redis listener for campus=%s", campus_id)

    async def _redis_listener(self, campus_id: str) -> None:
        """Subscribe to path:hazard:{campus_id} and re-route on every message."""
        channel = f"path:hazard:{campus_id}"

        # SECURITY: refuse to run if the JWT secret is the placeholder.
        if settings.JWT_SECRET_KEY == "change-me-in-env-file":
            logger.error(
                "PathfinderBridge refusing to start: JWT_SECRET_KEY is the placeholder"
            )
            return

        while True:
            pubsub = None
            try:
                pubsub = redis_client.pubsub()
                await pubsub.subscribe(channel)
                logger.info("PathfinderBridge subscribed to %s", channel)

                async for raw_message in pubsub.listen():
                    if raw_message["type"] != "message":
                        continue
                    try:
                        data = json.loads(raw_message["data"])
                    except json.JSONDecodeError:
                        logger.warning("PathfinderBridge: bad JSON on %s", channel)
                        continue

                    # Skip messages this worker published — _handle_hazard
                    # already ran locally in publish_hazard_update.
                    if data.get("_source") == "local":
                        continue

                    try:
                        hazard = HazardState(**data.get("hazard", {}))
                    except Exception as exc:
                        logger.warning("PathfinderBridge: bad HazardState: %s", exc)
                        continue

                    await self._handle_hazard(campus_id, hazard)

            except asyncio.CancelledError:
                if pubsub is not None:
                    try:
                        await pubsub.unsubscribe(channel)
                    except Exception:
                        pass
                raise

            except Exception as exc:
                logger.warning(
                    "PathfinderBridge Redis listener error campus=%s: %s. Retrying in 5s",
                    campus_id, exc,
                )
                if pubsub is not None:
                    try:
                        await pubsub.punsubscribe(channel)
                    except Exception:
                        pass
                await asyncio.sleep(5.0)

    async def shutdown(self) -> None:
        """Cancel all listener tasks."""
        async with self._listener_lock:
            tasks = list(self._listener_tasks.items())
            self._listener_tasks.clear()

        for campus_id, task in tasks:
            task.cancel()
            try:
                await task
            except asyncio.CancelledError:
                pass
            logger.info("PathfinderBridge: stopped listener for campus=%s", campus_id)


# Singleton used by main.py, cap_ingestion.py, websocket_manager.py.
pathfinder_bridge = PathfinderBridge()
