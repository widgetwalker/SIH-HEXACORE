from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
import uuid

from app.core.database import get_db_session
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate, UserOut, LeaderboardUser

router = APIRouter()

@router.post("/", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def create_user(user_in: UserCreate, db: AsyncSession = Depends(get_db_session)):
    # Simple hackathon auth: if email isn't provided, use a random one to satisfy any constraints if they exist,
    # though we made it nullable.
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

@router.get("/leaderboard", response_model=List[LeaderboardUser])
async def get_leaderboard(db: AsyncSession = Depends(get_db_session)):
    result = await db.execute(select(User).where(User.tier_scores != None))
    users = result.scalars().all()
    
    leaderboard = []
    TOTAL_MODULES = 22 # Hardcoded based on frontend MOCK_TIERS
    
    for user in users:
        completed = 0
        if user.tier_scores:
            for tier_id, modules in user.tier_scores.items():
                if isinstance(modules, dict):
                    for module_id, data in modules.items():
                        if isinstance(data, dict) and data.get("completed"):
                            completed += 1
        
        score_percentage = (completed / TOTAL_MODULES) * 100 if TOTAL_MODULES > 0 else 0
        
        leaderboard.append(LeaderboardUser(
            id=user.id,
            full_name=user.full_name,
            grade=user.grade,
            school=user.school,
            avatar_id=user.avatar_id,
            avatar_image=user.avatar_image,
            score_percentage=score_percentage,
            completed_modules=completed,
            total_modules=TOTAL_MODULES
        ))
    
    # Sort by completed modules descending
    leaderboard.sort(key=lambda x: x.completed_modules, reverse=True)
    return leaderboard

@router.get("/{user_id}", response_model=UserOut)
async def get_user(user_id: uuid.UUID, db: AsyncSession = Depends(get_db_session)):
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/{user_id}", response_model=UserOut)
async def update_user(user_id: uuid.UUID, user_update: UserUpdate, db: AsyncSession = Depends(get_db_session)):
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    update_data = user_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(user, field, value)
        
    await db.commit()
    await db.refresh(user)
    return user
