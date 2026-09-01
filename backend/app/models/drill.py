"""
Drill session and telemetry models.

Maps to:
  - drill_mode_enum
  - drill_status_enum
  - drill_sessions
  - student_drill_telemetry

in database/schema.sql
"""

import uuid
import enum
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import String, Integer, ForeignKey, Numeric, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy import Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.institution import Institution
    from app.models.user import User


class DrillMode(str, enum.Enum):
    VIRTUAL_SIMULATION = "VIRTUAL_SIMULATION"
    PHYSICAL_CLASSROOM_DRILL = "PHYSICAL_CLASSROOM_DRILL"
    CAMPUS_WIDE_SIMULATION = "CAMPUS_WIDE_SIMULATION"
    REAL_EMERGENCY = "REAL_EMERGENCY"


class DrillStatus(str, enum.Enum):
    SCHEDULED = "SCHEDULED"
    ACTIVE = "ACTIVE"
    COMPLETED = "COMPLETED"
    ABORTED = "ABORTED"


class DrillSession(Base):
    """
    A single drill event, belonging to one institution and
    driven by a particular scenario.
    """

    __tablename__ = "drill_sessions"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    institution_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("institutions.id", ondelete="CASCADE"), nullable=False
    )
    mode: Mapped[DrillMode] = mapped_column(
        SAEnum(DrillMode, name="drill_mode_enum", create_type=False), nullable=False
    )
    status: Mapped[DrillStatus] = mapped_column(
        SAEnum(DrillStatus, name="drill_status_enum", create_type=False),
        default=DrillStatus.SCHEDULED,
        nullable=False,
    )
    scenario_id: Mapped[str] = mapped_column(String(100), nullable=False)
    primary_hazard: Mapped[str] = mapped_column(String(100), nullable=False)
    cascading_hazards: Mapped[list] = mapped_column(JSONB, default=list)
    started_at: Mapped[datetime | None] = mapped_column(TIMESTAMP(timezone=True), nullable=True)
    ended_at: Mapped[datetime | None] = mapped_column(TIMESTAMP(timezone=True), nullable=True)
    total_participants: Mapped[int] = mapped_column(Integer, default=0)
    evacuated_count: Mapped[int] = mapped_column(Integer, default=0)
    unaccounted_count: Mapped[int] = mapped_column(Integer, default=0)
    average_evacuation_time_sec: Mapped[float | None] = mapped_column(Numeric(8, 2), nullable=True)
    aggregate_score: Mapped[float | None] = mapped_column(Numeric(5, 2), nullable=True)

    institution: Mapped["Institution"] = relationship("Institution")
    telemetry: Mapped[list["StudentDrillTelemetry"]] = relationship(
        "StudentDrillTelemetry", back_populates="drill_session", cascade="all, delete-orphan"
    )


class StudentDrillTelemetry(Base):
    """
    Per-student telemetry from a single drill run.

    Mirrors the RunTelemetry interface from the frontend
    (docs/09_BACKEND_IMPLEMENTATION.md §Data Contracts).
    """

    __tablename__ = "student_drill_telemetry"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    drill_session_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("drill_sessions.id", ondelete="CASCADE"), nullable=False
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    starting_floor: Mapped[int] = mapped_column(Integer, nullable=False)
    final_status: Mapped[str] = mapped_column(String(50), nullable=False)
    evacuation_time_sec: Mapped[float | None] = mapped_column(Numeric(8, 2), nullable=True)
    panic_peak_score: Mapped[float | None] = mapped_column(Numeric(5, 2), nullable=True)
    cv_posture_compliance_score: Mapped[float | None] = mapped_column(Numeric(5, 2), nullable=True)
    prohibitions_violated: Mapped[list] = mapped_column(JSONB, default=list)
    escape_route_taken: Mapped[list] = mapped_column(JSONB, default=list)
    completed_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True), default=datetime.utcnow
    )

    drill_session: Mapped["DrillSession"] = relationship("DrillSession", back_populates="telemetry")
    user: Mapped["User"] = relationship("User", back_populates="telemetry")
