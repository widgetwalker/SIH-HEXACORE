import pytest
from app.utils.security import get_password_hash, verify_password
from app.dependencies.auth import create_access_token
import jwt
from app.core.config import settings

def test_password_hashing():
    raw_password = "SecretPassword123!"
    hashed = get_password_hash(raw_password)
    assert hashed != raw_password
    assert verify_password(raw_password, hashed) is True
    assert verify_password("WrongPassword", hashed) is False
    assert verify_password(raw_password, "") is False

def test_create_access_token():
    token = create_access_token({"sub": "test-user-id"})
    payload = jwt.decode(
        token,
        settings.JWT_SECRET_KEY,
        algorithms=[settings.JWT_ALGORITHM],
        audience=settings.JWT_AUDIENCE,
        issuer=settings.JWT_ISSUER,
    )
    assert payload.get("sub") == "test-user-id"
    assert "exp" in payload
    assert "iat" in payload
