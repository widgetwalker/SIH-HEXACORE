"""
Health check endpoints.

Two separate endpoints, deliberately kept apart:

- /health        -> "is the process running at all". No dependencies
                     checked. This is what Docker or a hosting platform
                     should use to decide whether to restart the
                     container - if it depended on the database, a
                     database outage would look like a broken backend
                     and trigger restart loops that don't fix anything.

- /health/ready  -> "are the things this app depends on actually
                     reachable". Use this one yourself when debugging -
                     if the app is misbehaving, checking this endpoint
                     tells you whether the problem is Postgres, Redis,
                     or something else in your own code.
"""

from fastapi import APIRouter
from sqlalchemy import text

from app.core.database import engine
from app.core.redis_client import redis_client

router = APIRouter()


@router.get("/health")
async def health_check():
    return {"status": "ok"}


@router.get("/health/ready")
async def readiness_check():
    checks = {"database": "unknown", "redis": "unknown"}

    try:
        # A trivial query - just confirms we can open a connection and
        # get a response, not testing any real table or data.
        async with engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
        checks["database"] = "ok"
    except Exception as e:
        checks["database"] = f"unreachable: {e}"

    try:
        await redis_client.ping()
        checks["redis"] = "ok"
    except Exception as e:
        checks["redis"] = f"unreachable: {e}"

    all_ok = all(v == "ok" for v in checks.values())
    return {"ready": all_ok, "checks": checks}
