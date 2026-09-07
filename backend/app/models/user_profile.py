"""
Extended user profile model — stores cadet / warden / admin profile
fields beyond the core users table.

Maps to: user_profiles

Extra fields (avatar, badges, training progress, emergency contacts)
are kept here so the base users table stays lean and auth-compatible.
"""

import uuid
from datetime import datetime

from sqlalchemy import String, Integer, JSON, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class UserProfile(Base):
    """
    Extended profile fields for cadets and wardens.

    The core User row holds identity + auth (email, password_hash, role).
    This row holds everything the frontend CadetOnboardingModal and
    ProfilePage need that isn't appropriate in the auth table.
    """

    __tablename__ = "user_profiles"

    # user_id is the primary key — one profile per user.
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True
    )
    avatar_seed: Mapped[str | None] = mapped_column(String(100), nullable=True)
    avatar_image_url: Mapped[str | None] = mapped_column(String(2048), nullable=True)
    rank: Mapped[str | None] = mapped_column(String(50), nullable=True)
    squad: Mapped[str | None] = mapped_column(String(50), nullable=True)
    training_level: Mapped[int] = mapped_column(Integer, default=1)
    drills_completed: Mapped[int] = mapped_column(Integer, default=0)
    total_score: Mapped[int] = mapped_column(Integer, default=0)
    badges: Mapped[list] = mapped_column(JSON, default=list)
    preferred_language: Mapped[str | None] = mapped_column(String(10), nullable=True)
    emergency_contact_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    emergency_contact_phone: Mapped[str | None] = mapped_column(String(20), nullable=True)
    medical_notes: Mapped[str | None] = mapped_column(String(2000), nullable=True)
    extra: Mapped[dict] = mapped_column(JSON, default=dict)  # forward-compat
    updated_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow
    )
