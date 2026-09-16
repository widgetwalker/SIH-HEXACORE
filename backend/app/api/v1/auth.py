from fastapi import APIRouter, Depends, HTTPException, Response, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db_session
from app.models.user import User
from app.schemas.user import UserOut
from app.utils.security import verify_password, get_password_hash
from app.dependencies.auth import create_access_token, set_auth_cookie, get_current_user

router = APIRouter()

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    full_name: str
    role: str = "STUDENT"
    grade: str | None = None
    school: str | None = None
    avatar_id: str | None = None
    avatar_image: str | None = None
    age: int | None = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

@router.post("/auth/register", response_model=dict, tags=["auth"], status_code=status.HTTP_201_CREATED)
async def register(user_in: RegisterRequest, db: AsyncSession = Depends(get_db_session)):
    result = await db.execute(select(User).where(User.email == user_in.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    new_user = User(
        email=user_in.email,
        full_name=user_in.full_name,
        role=user_in.role,
        grade=user_in.grade,
        school=user_in.school,
        avatar_id=user_in.avatar_id,
        avatar_image=user_in.avatar_image,
        age=user_in.age,
        password_hash=get_password_hash(user_in.password),
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return {"id": str(new_user.id)}

@router.post("/auth/login", response_model=dict, tags=["auth"])
async def login(data: LoginRequest, db: AsyncSession = Depends(get_db_session)):
    result = await db.execute(select(User).where(User.email == data.email))
    user: User | None = result.scalar_one_or_none()
    if not user or not verify_password(data.password, user.password_hash or ""):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    access_token = create_access_token({"sub": str(user.id)})
    response = JSONResponse(content={
        "msg": "login successful",
        "user": {
            "id": str(user.id),
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
        },
        "access_token": access_token
    })
    set_auth_cookie(response, access_token)
    return response

@router.get("/auth/me", response_model=UserOut, tags=["auth"])
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/auth/logout", response_model=dict, tags=["auth"])
async def logout(response: Response):
    response.delete_cookie(key="access_token", httponly=True, samesite="lax")
    return {"msg": "logout successful"}

