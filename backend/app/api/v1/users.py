"""
User profile API — mirrors the frontend ``safezone_cadet_profile_v1`` shape.

Provides:

- POST /api/v1/users/profile
    Upserts a CadetProfile (idempotent on ``id``).  If the row already
    exists it is updated; otherwise a new row is created.

- GET /api/v1/users/profile/{id}
    Returns one profile by its client-generated UUID string.

Auth note: both endpoints are currently open (no JWT guard).  They will
gain auth in a later sprint.  For now the frontend sends a client-generated
UUID as the profile id so there's no collision risk.
"""

from __future__ import annotations

import uuid as _uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.dialects.postgresql import insert as pg_insert

from app.core.database import get_db_session
from app.models.user_profile import UserProfile
from app.schemas.user_profile import CadetProfile, CadetProfileUpsert

router = APIRouter()


# ── POST /api/v1/users/profile ────────────────────────────────────────────


@router.post(
    "/users/profile",
    response_model=CadetProfile,
    tags=["users"],
    summary="Upsert cadet / user profile",
)
async def upsert_profile(
    body: CadetProfileUpsert,
    db: AsyncSession = Depends(get_db_session),
) -> CadetProfile:
    """
    Create or update a CadetProfile.

    The ``id`` field is the client-generated UUID that the frontend
    CadetOnboardingModal and EditProfileDrawer store in localStorage.
    This endpoint persists the same profile server-side so it survives
    storage clearing and (eventually) syncs across devices.
    """
    try:
        profile_uuid = _uuid.UUID(body.id)
    except ValueError:
        raise HTTPException(status_code=422, detail="id must be a valid UUID")

    values = {
        "user_id": profile_uuid,
        "avatar_seed": body.avatar_seed,
        "avatar_image_url": body.avatar_image_url,
        "rank": body.rank,
        "squad": body.squad,
        "training_level": body.training_level,
        "drills_completed": body.drills_completed,
        "total_score": body.total_score,
        "badges": body.badges,
        "preferred_language": body.preferred_language,
        "emergency_contact_name": body.emergency_contact_name,
        "emergency_contact_phone": body.emergency_contact_phone,
        "medical_notes": body.medical_notes,
    }

    # PostgreSQL upsert: ON CONFLICT (user_id) DO UPDATE
    stmt = pg_insert(UserProfile).values(**values)
    stmt = stmt.on_conflict_do_update(
        index_elements=["user_id"],
        set_={
            k: v for k, v in values.items() if k != "user_id"
        },
    )
    await db.execute(stmt)
    await db.commit()

    # Fetch and return the canonical row
    result = await db.execute(
        select(UserProfile).where(UserProfile.user_id == profile_uuid)
    )
    row = result.scalar_one_or_none()

    if row is None:
        raise HTTPException(status_code=500, detail="Upsert failed")

    return CadetProfile(
        id=str(row.user_id),
        full_name=body.full_name,
        email=body.email,
        age=body.age,
        age_cohort=body.age_cohort,
        institution_id=body.institution_id,
        assigned_building_id=body.assigned_building_id,
        assigned_floor_number=body.assigned_floor_number,
        avatar_seed=row.avatar_seed,
        avatar_image_url=row.avatar_image_url,
        role=body.role,
        rank=row.rank,
        squad=row.squad,
        training_level=row.training_level,
        drills_completed=row.drills_completed,
        total_score=row.total_score,
        badges=row.badges,
        preferred_language=row.preferred_language,
        emergency_contact_name=row.emergency_contact_name,
        emergency_contact_phone=row.emergency_contact_phone,
        medical_notes=row.medical_notes,
        created_at=row.updated_at,
        updated_at=row.updated_at,
    )


# ── GET /api/v1/users/profile/{id} ───────────────────────────────────────


@router.get(
    "/users/profile/{id}",
    response_model=CadetProfile,
    tags=["users"],
    summary="Get a single profile by id",
)
async def get_profile(
    id: str,
    db: AsyncSession = Depends(get_db_session),
) -> CadetProfile:
    """
    Return one profile by its client-generated UUID.

    Raises 404 if the profile has not been persisted yet (the frontend
    creates it in localStorage first; the server only has it after the
    first POST).
    """
    try:
        profile_uuid = _uuid.UUID(id)
    except ValueError:
        raise HTTPException(status_code=422, detail="id must be a valid UUID")

    result = await db.execute(
        select(UserProfile).where(UserProfile.user_id == profile_uuid)
    )
    row = result.scalar_one_or_none()

    if row is None:
        raise HTTPException(status_code=404, detail=f"Profile {id!r} not found")

    return CadetProfile(
        id=str(row.user_id),
        full_name="",  # not stored in user_profiles — caller should POST with full_name
        email=None,
        age=None,
        age_cohort=None,
        institution_id=None,
        assigned_building_id=None,
        assigned_floor_number=None,
        avatar_seed=row.avatar_seed,
        avatar_image_url=row.avatar_image_url,
        role="STUDENT",
        rank=row.rank,
        squad=row.squad,
        training_level=row.training_level,
        drills_completed=row.drills_completed,
        total_score=row.total_score,
        badges=row.badges,
        preferred_language=row.preferred_language,
        emergency_contact_name=row.emergency_contact_name,
        emergency_contact_phone=row.emergency_contact_phone,
        medical_notes=row.medical_notes,
        created_at=row.updated_at,
        updated_at=row.updated_at,
    )
