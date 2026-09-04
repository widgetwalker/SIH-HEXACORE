"""
API v1 — all registered routers.

Each router is imported here so that ``app.main`` can register them
in a single ``include_router`` loop.  The submodules also expose any
startup helpers needed by the app factory (e.g. ``init_pathfinder``).
"""

from app.api.v1 import buildings, health, pathfinder, scenarios, webhooks, websockets

__all__ = [
    "buildings",
    "health",
    "pathfinder",
    "scenarios",
    "webhooks",
    "websockets",
]
