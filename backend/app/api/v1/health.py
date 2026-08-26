"""
Health check endpoint.

Used to confirm the service is running - by you while developing, by
the CI pipeline, and later by whatever platform you deploy to.

Kept deliberately simple with no database or Redis calls for now.
Once those exist (Day 2), this can be extended to check that they are
reachable too, but a health check should never depend on something
that might itself be broken.
"""

from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
async def health_check():
    return {"status": "ok"}
