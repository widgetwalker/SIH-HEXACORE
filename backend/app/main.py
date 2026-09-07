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

from app.api.v1 import (
    alerts,
    buildings,
    health,
    incidents,
    mitra,
    pathfinder,
    reports,
    scenarios,
    telemetry,
    users,
    webhooks,
    websockets,
    ws,
)
from app.services.pathfinder_bridge import pathfinder_bridge  # noqa: F401
from app.services.websocket_manager import ws_manager

app = FastAPI(
    title=settings.APP_NAME,
    debug=settings.DEBUG,
)

# CORS — allow the Next.js dev server to reach the FastAPI backend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3001", "http://127.0.0.1:3001"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "OPTIONS"],
    allow_headers=["Content-Type", "Accept", "Authorization", "Cookie"],
)


@app.on_event("startup")
async def on_startup() -> None:
    """
    App-wide startup hook.
    """
    # Touch the singletons so connection state is visible in logs.
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
app.include_router(health.router, prefix="/api/v1", tags=["health"])
app.include_router(buildings.router, prefix="/api/v1", tags=["buildings"])
app.include_router(scenarios.router, prefix="/api/v1", tags=["scenarios"])
app.include_router(mitra.router, prefix="/api/v1", tags=["mitra"])
app.include_router(telemetry.router, prefix="/api/v1", tags=["telemetry"])
app.include_router(alerts.router, prefix="/api/v1", tags=["alerts"])
app.include_router(incidents.router, prefix="/api/v1", tags=["incidents"])
app.include_router(users.router, prefix="/api/v1", tags=["users"])
app.include_router(reports.router, prefix="/api/v1", tags=["reports"])
app.include_router(pathfinder.router, prefix="/api/v1", tags=["pathfinder"])
app.include_router(webhooks.router, prefix="/api/v1", tags=["webhooks"])
app.include_router(websockets.router, prefix="/api/v1", tags=["websockets"])
app.include_router(ws.router, prefix="/api/v1", tags=["websocket"])
