from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Dict, Any
from uuid import UUID
from datetime import datetime

class UserBase(BaseModel):
    full_name: str
    email: Optional[str] = None
    role: str = "STUDENT"
    grade: Optional[str] = None
    school: Optional[str] = None
    avatar_id: Optional[str] = None
    avatar_image: Optional[str] = None
    age: Optional[int] = None
    tier_scores: Optional[Dict[str, Any]] = Field(default_factory=dict)
    quiz_scores: Optional[Dict[str, Any]] = Field(default_factory=dict)

class UserCreate(UserBase):
    pass

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    grade: Optional[str] = None
    school: Optional[str] = None
    avatar_id: Optional[str] = None
    avatar_image: Optional[str] = None
    age: Optional[int] = None
    tier_scores: Optional[Dict[str, Any]] = None
    quiz_scores: Optional[Dict[str, Any]] = None

class UserOut(UserBase):
    id: UUID
    created_at: datetime
    
    class Config:
        from_attributes = True

class LeaderboardUser(BaseModel):
    id: UUID
    full_name: str
    grade: Optional[str] = None
    school: Optional[str] = None
    avatar_id: Optional[str] = None
    avatar_image: Optional[str] = None
    score_percentage: float
    completed_modules: int
    total_modules: int

    class Config:
        from_attributes = True
