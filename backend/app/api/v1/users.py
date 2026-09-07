"""
User profile and account management API.

Provides:
- POST /api/v1/users/
    Create a new user account with tier & quiz tracking.
- GET /api/v1/users/leaderboard
    Global leaderboard calculated from user module completion scores.
- POST /api/v1/users/profile
    Upsert a CadetProfile (idempotent on UUID).
- GET /api/v1/users/profile/{id}
    Fetch a CadetProfile by UUID.
- GET /api/v1/users/{user_id}
    Fetch a User account by UUID.
- PUT /api/v1/users/{user_id}
    Update User account details or tier/quiz scores.
"""

from __future__ import annotations

import uuid
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db_session
from app.models.user import User
from app.models.user_profile import UserProfile
from app.schemas.user import UserCreate, UserUpdate, UserOut, LeaderboardUser
from app.schemas.user_profile import CadetProfile, CadetProfileUpsert

router = APIRouter()


# ── POST /api/v1/users ────────────────────────────────────────────────────


@router.post(
    "/users",
    response_model=UserOut,
    status_code=status.HTTP_201_CREATED,
    tags=["users"],
    summary="Create user account",
)
@router.post(
    "/",
    response_model=UserOut,
    status_code=status.HTTP_201_CREATED,
    tags=["users"],
    include_in_schema=False,
)
async def create_user(user_in: UserCreate, db: AsyncSession = Depends(get_db_session)):
    new_user = User(
        full_name=user_in.full_name,
        email=user_in.email,
        role=user_in.role,
        grade=user_in.grade,
        school=user_in.school,
        avatar_id=user_in.avatar_id,
        avatar_image=user_in.avatar_image,
        age=user_in.age,
        tier_scores=user_in.tier_scores,
        quiz_scores=user_in.quiz_scores,
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user


# ── GET /api/v1/users/leaderboard ─────────────────────────────────────────


@router.get(
    "/users/leaderboard",
    response_model=List[LeaderboardUser],
    tags=["users"],
    summary="Global leaderboard",
)
@router.get(
    "/leaderboard",
    response_model=List[LeaderboardUser],
    tags=["users"],
    include_in_schema=False,
)
async def get_leaderboard(db: AsyncSession = Depends(get_db_session)):
    result = await db.execute(select(User).where(User.tier_scores != None))
    users = result.scalars().all()

    leaderboard = []
    TOTAL_MODULES = 22  # Hardcoded based on frontend MOCK_TIERS

    for user in users:
        completed = 0
        if user.tier_scores:
            for tier_id, modules in user.tier_scores.items():
                if isinstance(modules, dict):
                    for module_id, data in modules.items():
                        if isinstance(data, dict) and data.get("completed"):
                            completed += 1

        score_percentage = (completed / TOTAL_MODULES) * 100 if TOTAL_MODULES > 0 else 0

        leaderboard.append(
            LeaderboardUser(
                id=user.id,
                full_name=user.full_name,
                grade=user.grade,
                school=user.school,
                avatar_id=user.avatar_id,
                avatar_image=user.avatar_image,
                score_percentage=score_percentage,
                completed_modules=completed,
                total_modules=TOTAL_MODULES,
            )
        )

    leaderboard.sort(key=lambda x: x.completed_modules, reverse=True)
    return leaderboard


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
    try:
        profile_uuid = uuid.UUID(body.id)
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

    stmt = pg_insert(UserProfile).values(**values)
    stmt = stmt.on_conflict_do_update(
        index_elements=["user_id"],
        set_={k: v for k, v in values.items() if k != "user_id"},
    )
    await db.execute(stmt)
    await db.commit()

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
    try:
        profile_uuid = uuid.UUID(id)
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
        full_name="",
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


# ── GET /api/v1/users/{user_id} ──────────────────────────────────────────


@router.get(
    "/users/{user_id}",
    response_model=UserOut,
    tags=["users"],
    summary="Get user account by ID",
)
@router.get(
    "/{user_id}",
    response_model=UserOut,
    tags=["users"],
    include_in_schema=False,
)
async def get_user(user_id: uuid.UUID, db: AsyncSession = Depends(get_db_session)):
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


# ── PUT /api/v1/users/{user_id} ──────────────────────────────────────────


@router.put(
    "/users/{user_id}",
    response_model=UserOut,
    tags=["users"],
    summary="Update user account by ID",
)
@router.put(
    "/{user_id}",
    response_model=UserOut,
    tags=["users"],
    include_in_schema=False,
)
async def update_user(
    user_id: uuid.UUID,
    user_update: UserUpdate,
    db: AsyncSession = Depends(get_db_session),
):
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    update_data = user_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(user, field, value)

    await db.commit()
    await db.refresh(user)
    return user
