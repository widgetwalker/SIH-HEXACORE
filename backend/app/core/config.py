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
    JWT_ISSUER: str | None = None
    JWT_AUDIENCE: str | None = None

    # Gemini key for the /api/v1/mitra/chat endpoint. Lives here (server-side
    # only) instead of in every developer's frontend/.env.local - empty by
    # default so a fresh clone still boots, Mitra just replies with a clear
    # "not configured" error until someone sets this.
    GEMINI_API_KEY: str = ""

    # NDMA SACHET webhook secret (HMAC-SHA256 signature verification).
    # Leave empty in dev to allow loopback-only calls without a signature.
    SACHET_WEBHOOK_SECRET: str = ""

    # NDMA SACHET / OASIS CAP v1.2 XML feed URL for the background poller.
    # Leave empty to disable the poller (safe default for dev/CI).
    SACHET_FEED_URL: str = ""

    # extra="ignore": a local .env may carry keys other branches/features
    # use (e.g. GEMINI_API_KEY for the Mitra backend) that this branch's
    # Settings doesn't declare yet - ignoring them here means switching
    # branches doesn't crash the app on an unrelated env var.
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")


# Import this single instance everywhere else instead of creating new
# Settings() objects, so the whole app reads from the same values.
settings = Settings()
