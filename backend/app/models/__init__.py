"""
SQLAlchemy ORM models.

Every table that exists in database/schema.sql must have a class here.
This file's only job is to collect them all into one place so that
SQLAlchemy's `Base.metadata` is fully populated - that metadata is what
`alembic revision --autogenerate` compares against the live database
to detect drift, and what FastAPI dependencies use to map rows to
Python objects.
"""

from app.models.base import Base
from app.models.institution import Institution, Building, Floor
from app.models.user import User, UserRole
from app.models.drill import DrillSession, StudentDrillTelemetry, DrillMode, DrillStatus
from app.models.alert import EmergencyAlert

__all__ = [
    "Base",
    "Institution",
    "Building",
    "Floor",
    "User",
    "UserRole",
    "DrillSession",
    "StudentDrillTelemetry",
    "DrillMode",
    "DrillStatus",
    "EmergencyAlert",
]