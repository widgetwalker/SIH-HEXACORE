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

from app.api.v1 import alerts, buildings, health, scenarios, webhooks, ws
from app.services.websocket_manager import ws_manager

app = FastAPI(
    title=settings.APP_NAME,
    debug=settings.DEBUG,
)

# CORS — allow the Next.js dev server to reach the FastAPI backend.
# POST is now needed alongside GET: the /command incident-injection
# webhook (app/api/v1/webhooks.py) writes, everything else still reads.
# Credentials allowed because the JWT auth cookie will need to flow
# cross-origin.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3001", "http://127.0.0.1:3001"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Accept", "Authorization", "Cookie"],
)


@app.on_event("startup")
async def on_startup() -> None:
    """
    App-wide startup hook.

    The WebSocket route (app/api/v1/ws.py) and the incident-injection
    webhook (app/api/v1/webhooks.py) both drive the ws_manager singleton
    directly on each request/connection - nothing needs to be started
    eagerly here. The NDMA SACHET CAP poller (app/services/cap_ingestion.py)
    still points at a placeholder feed URL and stays unstarted until a
    real feed URL is configured.
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
app.include_router(scenarios.router, prefix="/api/v1", tags=["scenarios"])
app.include_router(alerts.router, prefix="/api/v1", tags=["alerts"])
app.include_router(webhooks.router, prefix="/api/v1", tags=["webhooks"])
app.include_router(ws.router, prefix="/api/v1", tags=["websocket"])
