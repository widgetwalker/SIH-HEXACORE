"""
Application entry point.

This file only wires things together: it creates the FastAPI app and
registers routers. Actual logic (endpoints, database queries, etc.)
lives in the api/ and core/ modules — keeping main.py thin means
anyone opening it can see the whole shape of the API at a glance.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.redis_client import redis_client  # noqa: F401 - initializes Redis on startup

# Importing models registers every SQLAlchemy ORM class on Base.metadata,
# so alembic's --autogenerate can see them.  The import has no runtime
# side effects on the API itself.
import app.models  # noqa: F401  - register ORM models with Base.metadata

from app.api.v1 import buildings, health, pathfinder, scenarios, webhooks, websockets
from app.services.pathfinder_bridge import pathfinder_bridge
from app.services.websocket_manager import ws_manager

app = FastAPI(
    title=settings.APP_NAME,
    debug=settings.DEBUG,
)

# CORS — allow the Next.js dev server to reach the FastAPI backend.
# Restrictive by default: only GET (and OPTIONS for preflight) since
# all current endpoints are read-only.  Credentials allowed because the
# JWT auth cookie will need to flow cross-origin.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["GET", "OPTIONS"],
    allow_headers=["Content-Type", "Accept", "Authorization", "Cookie"],
)


@app.on_event("startup")
async def on_startup() -> None:
    """
    App-wide startup hook.

    Loads the pathfinder's floor data before any request arrives, so the
    first POST /pathfinder/route call is sub-millisecond instead of
    waiting on a cold DB query.  Also boots the pathfinder bridge so
    hazard updates automatically re-route escape paths.

    Both initializers are wrapped to log-and-continue: a missing DB or
    Redis must not prevent the app from booting, because the rest of
    the API (health, scenarios, buildings, websockets) is still useful
    even when the pathfinder is in degraded mode.
    """
    import logging
    logger = logging.getLogger(__name__)

    # Touch the singletons so connection state is visible in logs.
    _ = ws_manager
    _ = redis_client
    try:
        await pathfinder.init_pathfinder()
    except Exception as exc:  # noqa: BLE001
        logger.warning("pathfinder init_pathfinder failed: %s", exc)
    try:
        await pathfinder_bridge.init_pathfinder_bridge()
    except Exception as exc:  # noqa: BLE001
        logger.warning("pathfinder_bridge init failed: %s", exc)


@app.on_event("shutdown")
async def on_shutdown() -> None:
    """Close the shared Redis connection cleanly on app shutdown."""
    try:
        await ws_manager.shutdown()
    except Exception:  # noqa: BLE001 - intentional: best-effort cleanup
        pass
    try:
        await pathfinder_bridge.shutdown()
    except Exception:  # noqa: BLE001 - intentional: best-effort cleanup
        pass
    try:
        await redis_client.aclose()
    except Exception:  # noqa: BLE001 - intentional: best-effort cleanup
        pass


# Every new group of endpoints gets registered here as a router.
# Keeping this list in one place makes it obvious what the API exposes,
# instead of having to search through the codebase for route definitions.
app.include_router(health.router, prefix="/api/v1", tags=["health"])
app.include_router(buildings.router, prefix="/api/v1", tags=["buildings"])
app.include_router(pathfinder.router, prefix="/api/v1", tags=["pathfinder"])
app.include_router(scenarios.router, prefix="/api/v1", tags=["scenarios"])
app.include_router(webhooks.router, prefix="/api/v1", tags=["webhooks"])
app.include_router(websockets.router, prefix="/api/v1", tags=["websockets"])
