"""
User profile schemas — frontend ``safezone_cadet_profile_v1`` mirror.

The frontend (ProfilePage, CadetOnboardingModal, EditProfileDrawer)
already keeps a rich profile in localStorage.  These schemas let the
same shape round-trip to the backend so the user's profile survives
clearing their browser storage and (eventually) syncs across devices.
"""

from __future__ import annotations

from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class CadetProfile(BaseModel):
    """A single cadet / student / warden profile."""

    model_config = ConfigDict(from_attributes=True)

    id: str = Field(..., description="Profile id (client-generated UUID)")
    full_name: str = Field(..., max_length=255)
    email: str | None = Field(None, max_length=255)
    age: int | None = Field(None, ge=0, le=150)
    age_cohort: str | None = Field(None, max_length=30)
    institution_id: str | None = None
    assigned_building_id: str | None = None
    assigned_floor_number: int | None = Field(None, ge=-5, le=200)
    avatar_seed: str | None = Field(None, max_length=100)
    avatar_image_url: str | None = Field(None, max_length=2048)
    role: str = Field("STUDENT", max_length=30)
    rank: str | None = Field(None, max_length=50, description="e.g. 'Cadet Captain'")
    squad: str | None = Field(None, max_length=50)
    training_level: int = Field(1, ge=1, le=10)
    drills_completed: int = Field(0, ge=0)
    total_score: int = Field(0, ge=0)
    badges: list[str] = Field(default_factory=list)
    preferred_language: str | None = Field(None, max_length=10)
    emergency_contact_name: str | None = Field(None, max_length=255)
    emergency_contact_phone: str | None = Field(None, max_length=20)
    medical_notes: str | None = Field(None, max_length=2000)
    created_at: datetime | None = None
    updated_at: datetime | None = None


class CadetProfileUpsert(BaseModel):
    """Request body for POST /api/v1/users/profile (idempotent on id)."""

    model_config = ConfigDict(extra="ignore")

    id: str = Field(..., max_length=255)
    full_name: str = Field(..., max_length=255)
    email: str | None = Field(None, max_length=255)
    age: int | None = Field(None, ge=0, le=150)
    age_cohort: str | None = Field(None, max_length=30)
    institution_id: str | None = None
    assigned_building_id: str | None = None
    assigned_floor_number: int | None = Field(None, ge=-5, le=200)
    avatar_seed: str | None = Field(None, max_length=100)
    avatar_image_url: str | None = Field(None, max_length=2048)
    role: str = Field("STUDENT", max_length=30)
    rank: str | None = Field(None, max_length=50)
    squad: str | None = Field(None, max_length=50)
    training_level: int = Field(1, ge=1, le=10)
    drills_completed: int = Field(0, ge=0)
    total_score: int = Field(0, ge=0)
    badges: list[str] = Field(default_factory=list)
    preferred_language: str | None = Field(None, max_length=10)
    emergency_contact_name: str | None = Field(None, max_length=255)
    emergency_contact_phone: str | None = Field(None, max_length=20)
    medical_notes: str | None = Field(None, max_length=2000)
