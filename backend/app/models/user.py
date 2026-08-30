"""
User model and role enum.

Maps to:
  - user_role_enum
  - users

in database/schema.sql
"""

import uuid
import enum
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import String, Integer, Boolean, ForeignKey, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.institution import Institution, Building
    from app.models.drill import DrillSession, StudentDrillTelemetry


class UserRole(str, enum.Enum):
    """Enumeration mirroring the PostgreSQL user_role_enum."""

    STUDENT = "STUDENT"
    TEACHER_WARDEN = "TEACHER_WARDEN"
    SCHOOL_ADMIN = "SCHOOL_ADMIN"
    NDRF_RESPONDER = "NDRF_RESPONDER"
    FIRE_SERVICE = "FIRE_SERVICE"
    POLICE_EMS = "POLICE_EMS"
    SDMA_ANALYST = "SDMA_ANALYST"


class User(Base):
    """A user account (student, warden, admin, or responder)."""

    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    institution_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("institutions.id", ondelete="SET NULL"), nullable=True
    )
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[UserRole] = mapped_column(
        SAEnum(UserRole, name="user_role_enum", create_type=False),
        default=UserRole.STUDENT,
        nullable=False,
    )
    age: Mapped[int | None] = mapped_column(Integer, nullable=True)
    age_cohort: Mapped[str | None] = mapped_column(String(30), nullable=True)
    assigned_building_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("buildings.id"), nullable=True
    )
    assigned_floor_number: Mapped[int | None] = mapped_column(Integer, nullable=True)
    qr_badge_code: Mapped[str | None] = mapped_column(String(100), unique=True)
    nfc_card_id: Mapped[str | None] = mapped_column(String(100), unique=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True), default=datetime.utcnow
    )

    institution: Mapped["Institution | None"] = relationship(
        "Institution", foreign_keys=[institution_id]
    )
    telemetry: Mapped[list["StudentDrillTelemetry"]] = relationship(
        "StudentDrillTelemetry", back_populates="user"
    )
