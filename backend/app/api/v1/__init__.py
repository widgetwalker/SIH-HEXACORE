"""
API v1 — all registered routers.

Each router is imported here so that ``app.main`` can register them
in a single ``include_router`` loop.  The submodules also expose any
startup helpers needed by the app factory (e.g. ``init_pathfinder``).
"""

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
)

__all__ = [
    "alerts",
    "buildings",
    "health",
    "incidents",
    "mitra",
    "pathfinder",
    "reports",
    "scenarios",
    "telemetry",
    "users",
    "webhooks",
    "websockets",
]
