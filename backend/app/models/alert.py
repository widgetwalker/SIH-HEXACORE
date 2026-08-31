"""
Emergency alert model (CAP v1.2 / NDMA SACHET).

Maps to the emergency_alerts table in database/schema.sql
"""

import uuid
from datetime import datetime

from sqlalchemy import String, Boolean, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID
from geoalchemy2 import Geometry
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class EmergencyAlert(Base):
    """
    Ingested Common Alerting Protocol v1.2 alert from NDMA SACHET / IMD.

    The raw XML is not persisted; only the parsed fields are stored so
    the EOC dashboard can query by sender, severity, or affected polygon.
    """

    __tablename__ = "emergency_alerts"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    cap_identifier: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    sender: Mapped[str] = mapped_column(String(255), nullable=False)
    sent_at: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True), nullable=False)
    status: Mapped[str] = mapped_column(String(50), nullable=False)
    msg_type: Mapped[str] = mapped_column(String(50), nullable=False)
    urgency: Mapped[str] = mapped_column(String(50), nullable=False)
    severity: Mapped[str] = mapped_column(String(50), nullable=False)
    certainty: Mapped[str] = mapped_column(String(50), nullable=False)
    event_category: Mapped[str] = mapped_column(String(100), nullable=False)
    headline: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str | None] = mapped_column(String, nullable=True)
    instruction: Mapped[str | None] = mapped_column(String, nullable=True)
    affected_polygon: Mapped[bytes | None] = mapped_column(
        Geometry("POLYGON", srid=4326), nullable=True
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True), default=datetime.utcnow
    )
