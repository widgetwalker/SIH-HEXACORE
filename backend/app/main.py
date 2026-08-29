"""
Application entry point.

This file only wires things together: it creates the FastAPI app and
registers routers. Actual logic (endpoints, database queries, etc.)
lives in the api/ and core/ modules — keeping main.py thin means
anyone opening it can see the whole shape of the API at a glance.
"""

from fastapi import FastAPI

from app.core.config import settings
from app.core.redis_client import redis_client  # noqa: F401 - initializes Redis on startup

# Importing models registers every SQLAlchemy ORM class on Base.metadata,
# so alembic's --autogenerate can see them.  The import has no runtime
# side effects on the API itself.
import app.models  # noqa: F401  - register ORM models with Base.metadata

from app.api.v1 import buildings, health
from app.services.websocket_manager import ws_manager

app = FastAPI(
    title=settings.APP_NAME,
    debug=settings.DEBUG,
)


@app.on_event("startup")
async def on_startup() -> None:
    """
    App-wide startup hook.

    Currently no-op for the API itself - the websocket manager and
    CAP poller are imported as singletons but not started. They will
    be started here in Sprint 3 when the WebSocket route and the
    /api/v1/webhooks/sachet endpoint are added.
    """
    # Touch the singleton so connection state is visible in logs.
    _ = ws_manager
    _ = redis_client


@app.on_event("shutdown")
async def on_shutdown() -> None:
    """Close the shared Redis connection cleanly on app shutdown."""
    try:
        await redis_client.aclose()
    except Exception:  # noqa: BLE001 - intentional: best-effort cleanup
        pass


# Every new group of endpoints gets registered here as a router.
# Keeping this list in one place makes it obvious what the API exposes,
# instead of having to search through the codebase for route definitions.
app.include_router(health.router, prefix="/api/v1", tags=["health"])
app.include_router(buildings.router, prefix="/api/v1", tags=["buildings"])
