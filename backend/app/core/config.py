"""
Application configuration.

All values are read from environment variables, never hardcoded.
Locally these come from a `.env` file (see .env.example). In CI or on
a server, they come from actual environment variables set there.

This means a real database password never has to appear in code that
gets pushed to GitHub.
"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # General
    APP_NAME: str = "SIH Disaster Preparedness Backend"
    ENVIRONMENT: str = "development"  # development | staging | production
    DEBUG: bool = True

    # Database - not connected yet, this is here so Day 2 (DB setup)
    # doesn't require touching this file again.
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/sih_db"

    # Redis - same reasoning, wired up on Day 2.
    REDIS_URL: str = "redis://localhost:6379/0"

    # JWT auth - not used until Sprint 3, placeholder for now.
    JWT_SECRET_KEY: str = "change-me-in-env-file"
    JWT_ALGORITHM: str = "HS256"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


# Import this single instance everywhere else instead of creating new
# Settings() objects, so the whole app reads from the same values.
settings = Settings()
