"""
pytest configuration and fixtures for WebSocket tests.

pytest-asyncio is configured via pyproject.toml (or pytest.ini) using:
    [tool.pytest.ini_options]
    asyncio_mode = "auto"

No custom event_loop fixture is needed in pytest-asyncio 0.23+ — the
library manages the event loop automatically.  Using a custom fixture with
"session" scope can deadlock when multiple workers or nested loops are
created.
"""

import pytest


@pytest.fixture
def jwt_secret():
    """Return the JWT secret used for testing."""
    from app.core.config import settings

    return settings.JWT_SECRET_KEY


@pytest.fixture
def jwt_algorithm():
    """Return the JWT algorithm used for testing."""
    from app.core.config import settings

    return settings.JWT_ALGORITHM


@pytest.fixture
def ws_url():
    """Return the WebSocket URL for testing."""
    return "ws://localhost:8000/api/v1/ws"
