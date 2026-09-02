"""
Application entry point.

This file only wires things together: it creates the FastAPI app and
registers routers. Actual logic (endpoints, database queries, etc.)
lives in the api/ and core/ modules — keeping main.py thin means
anyone opening it can see the whole shape of the API at a glance.
"""

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.redis_client import redis_client  # noqa: F401 - initializes Redis on startup

# Importing models registers every SQLAlchemy ORM class on Base.metadata,
# so alembic's --autogenerate can see them.  The import has no runtime
# side effects on the API itself.
import app.models  # noqa: F401  - register ORM models with Base.metadata

from app.api.v1 import buildings, health, mitra, scenarios
from app.services.websocket_manager import ws_manager

app = FastAPI(
    title=settings.APP_NAME,
    debug=settings.DEBUG,
)

# CORS — allow the Next.js dev server to reach the FastAPI backend.
# POST is needed for /api/v1/mitra/chat; everything else is still read-only.
# Both common Next.js dev ports are allowed since it auto-picks 3001+ when
# 3000 is already taken. Credentials allowed because the JWT auth cookie
# will need to flow cross-origin.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", "http://127.0.0.1:3000",
        "http://localhost:3001", "http://127.0.0.1:3001",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Accept", "Authorization", "Cookie"],
)


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
    """
    Reshape every HTTPException to {"error": "..."} instead of FastAPI's
    default {"detail": "..."} - the frontend's Mitra client already reads
    `data.error` on a failed response (a holdover from when this endpoint
    was a Next.js route), so this keeps that call site unchanged.
    """
    return JSONResponse(status_code=exc.status_code, content={"error": exc.detail})


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
app.include_router(scenarios.router, prefix="/api/v1", tags=["scenarios"])
app.include_router(mitra.router, prefix="/api/v1", tags=["mitra"])
