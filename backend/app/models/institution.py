"""
Institution, Building, and Floor models.

Maps to:
  - institutions
  - buildings
  - floors

in database/schema.sql
"""

import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import String, Integer, Boolean, ForeignKey, CheckConstraint, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID, JSONB
from geoalchemy2 import Geometry
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.user import User


class Institution(Base):
    """A school / college / university that owns buildings and manages drills."""

    __tablename__ = "institutions"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    institution_type: Mapped[str] = mapped_column(String(50), nullable=False)
    affiliation_code: Mapped[str | None] = mapped_column(String(100), unique=True)
    contact_email: Mapped[str] = mapped_column(String(255), nullable=False)
    contact_phone: Mapped[str] = mapped_column(String(20), nullable=False)
    # PostGIS GEOMETRY(POLYGON, 4326) - stored as raw WKB bytes
    boundary_geofence: Mapped[bytes | None] = mapped_column(Geometry("POLYGON", srid=4326))
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True), default=datetime.utcnow
    )
    updated_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow
    )

    buildings: Mapped[list["Building"]] = relationship(
        "Building", back_populates="institution", cascade="all, delete-orphan"
    )


class Building(Base):
    """A single building belonging to an institution."""

    __tablename__ = "buildings"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    institution_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("institutions.id", ondelete="CASCADE"), nullable=False
    )
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    total_floors: Mapped[int] = mapped_column(Integer, nullable=False)
    footprint_geometry: Mapped[bytes | None] = mapped_column(
        Geometry("POLYGON", srid=4326)
    )
    has_fire_sprinklers: Mapped[bool] = mapped_column(Boolean, default=False)
    has_alarm_system: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True), default=datetime.utcnow
    )

    __table_args__ = (CheckConstraint("total_floors >= 1", name="ck_buildings_floors"),)

    institution: Mapped["Institution"] = relationship("Institution", back_populates="buildings")
    floors: Mapped[list["Floor"]] = relationship(
        "Floor", back_populates="building", cascade="all, delete-orphan"
    )


class Floor(Base):
    """A single floor within a building, holding graph nodes/edges for pathfinding."""

    __tablename__ = "floors"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    building_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("buildings.id", ondelete="CASCADE"), nullable=False
    )
    floor_number: Mapped[int] = mapped_column(Integer, nullable=False)
    blueprint_svg_url: Mapped[str | None] = mapped_column(String, nullable=True)
    graph_nodes_json: Mapped[list] = mapped_column(JSONB, default=list, nullable=False)
    graph_edges_json: Mapped[list] = mapped_column(JSONB, default=list, nullable=False)
    floor_grid: Mapped[list[str]] = mapped_column(JSONB, default=list, nullable=False)
    is_accessible: Mapped[bool] = mapped_column(Boolean, default=True)
    risk_level: Mapped[str] = mapped_column(String(20), default="SAFE")
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True), default=datetime.utcnow
    )

    building: Mapped["Building"] = relationship("Building", back_populates="floors")
