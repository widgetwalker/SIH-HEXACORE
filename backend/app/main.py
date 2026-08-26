"""
Application entry point.

This file only wires things together: it creates the FastAPI app and
registers routers. Actual logic (endpoints, database queries, etc.)
lives in the api/ and core/ modules — keeping main.py thin means
anyone opening it can see the whole shape of the API at a glance.
"""

from fastapi import FastAPI

from app.core.config import settings
from app.api.v1 import health

app = FastAPI(
    title=settings.APP_NAME,
    debug=settings.DEBUG,
)

# Every new group of endpoints gets registered here as a router.
# Keeping this list in one place makes it obvious what the API exposes,
# instead of having to search through the codebase for route definitions.
app.include_router(health.router, prefix="/api/v1", tags=["health"])
