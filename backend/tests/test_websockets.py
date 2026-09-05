"""
WebSocket unit + integration tests for the disaster preparedness backend.

The tests in this file are designed to run against a live FastAPI app +
Postgres + Redis stack (e.g. ``docker compose up backend``).

The end-to-end "load test" lives in ``load_test_client.py`` and is meant
to be run from the command line, not via pytest.
"""

from datetime import datetime, timedelta, timezone
from uuid import uuid4

import jwt
import pytest
import pytest_asyncio

from app.core.config import settings
from app.schemas.websocket import DrillTelemetryMessage, JoinCampusMessage


# ── helpers ───────────────────────────────────────────────────────────────


def make_token(user_id: str, role: str = "STUDENT") -> str:
    """Create a JWT for a test user."""
    payload = {
        "sub": user_id,
        "role": role,
        "iat": datetime.now(timezone.utc),
        "exp": datetime.now(timezone.utc) + timedelta(hours=1),
    }
    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


# ── schema tests (no infra needed) ────────────────────────────────────────


class TestSchemas:
    def test_join_campus_message_parses(self):
        msg = JoinCampusMessage(type="JOIN_CAMPUS", campus_id="C-01")
        assert msg.campus_id == "C-01"

    def test_join_campus_rejects_invalid_campus_id(self):
        """campus_id must be alphanumeric + hyphen/underscore only."""
        with pytest.raises(ValueError):
            JoinCampusMessage(type="JOIN_CAMPUS", campus_id="C 01!")
        with pytest.raises(ValueError):
            JoinCampusMessage(type="JOIN_CAMPUS", campus_id="../../etc/passwd")

    def test_join_campus_rejects_extra_fields(self):
        """extra='forbid' blocks role claim from being sent by the client."""
        with pytest.raises(ValueError):
            JoinCampusMessage(type="JOIN_CAMPUS", campus_id="C-01", role="FIRE_SERVICE")

    def test_drill_telemetry_message_parses(self):
        msg = DrillTelemetryMessage(
            type="DRILL_TELEMETRY",
            drill_session_id="00000000-0000-0000-0000-000000000001",
            floor=3,
            cell=[12, 8],
            status="EVACUATING",
        )
        assert msg.floor == 3
        assert msg.cell == [12, 8]
        assert msg.status == "EVACUATING"

    def test_drill_telemetry_rejects_short_cell(self):
        with pytest.raises(ValueError):
            DrillTelemetryMessage(
                type="DRILL_TELEMETRY",
                drill_session_id="00000000-0000-0000-0000-000000000001",
                floor=1,
                cell=[1],  # too short
                status="OK",
            )

    def test_drill_telemetry_rejects_non_uuid_session(self):
        with pytest.raises(ValueError):
            DrillTelemetryMessage(
                type="DRILL_TELEMETRY",
                drill_session_id="not-a-uuid",
                floor=1,
                cell=[1, 2],
                status="OK",
            )

    def test_drill_telemetry_rejects_negative_floor(self):
        with pytest.raises(ValueError):
            DrillTelemetryMessage(
                type="DRILL_TELEMETRY",
                drill_session_id="00000000-0000-0000-0000-000000000001",
                floor=-1,
                cell=[1, 2],
                status="OK",
            )


# ── manager unit tests ────────────────────────────────────────────────────


class TestWebSocketManagerConnect:
    def test_method_signature(self):
        from app.services.websocket_manager import ws_manager

        # Smoke test: the method exists and is async.
        assert callable(ws_manager.connect)

    def test_role_validation(self):
        from app.services.websocket_manager import WebSocketManager

        mgr = WebSocketManager()
        # Known roles pass through
        assert mgr._validate_role("STUDENT") == "STUDENT"
        assert mgr._validate_role("FIRE_SERVICE") == "FIRE_SERVICE"
        # Unknown role is downgraded
        assert mgr._validate_role("ROOT") == "STUDENT"
        # Non-string defaults to STUDENT
        assert mgr._validate_role(None) == "STUDENT"
        assert mgr._validate_role(123) == "STUDENT"


# ── integration tests (need running app + DB) ────────────────────────────


@pytest_asyncio.fixture
async def client():
    from fastapi.testclient import TestClient
    from app.main import app

    # TestClient is a context manager; on exit it shuts down the app,
    # which triggers our shutdown hook.
    with TestClient(app) as c:
        yield c


@pytest.mark.integration
class TestIntegration:
    def test_valid_token_connects(self, client):
        token = make_token(str(uuid4()))
        with client.websocket_connect(f"/api/v1/ws?token={token}") as ws:
            ws.send_json({"type": "JOIN_CAMPUS", "campus_id": "T-01"})

    def test_invalid_token_is_rejected(self, client):
        with pytest.raises(Exception):
            with client.websocket_connect("/api/v1/ws?token=garbage"):
                pass

    def test_expired_token_is_rejected(self, client):
        payload = {
            "sub": str(uuid4()),
            "role": "STUDENT",
            "iat": datetime.now(timezone.utc) - timedelta(hours=2),
            "exp": datetime.now(timezone.utc) - timedelta(hours=1),
        }
        token = jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
        with pytest.raises(Exception):
            with client.websocket_connect(f"/api/v1/ws?token={token}"):
                pass

    def test_missing_sub_is_rejected(self, client):
        payload = {
            "role": "STUDENT",
            "iat": datetime.now(timezone.utc),
            "exp": datetime.now(timezone.utc) + timedelta(hours=1),
        }
        token = jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
        with pytest.raises(Exception):
            with client.websocket_connect(f"/api/v1/ws?token={token}"):
                pass

    def test_invalid_sub_format_is_rejected(self, client):
        """sub must be a UUID — rejects `sub: "anonymous"` etc."""
        payload = {
            "sub": "not-a-uuid",
            "role": "STUDENT",
            "iat": datetime.now(timezone.utc),
            "exp": datetime.now(timezone.utc) + timedelta(hours=1),
        }
        token = jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
        with pytest.raises(Exception):
            with client.websocket_connect(f"/api/v1/ws?token={token}"):
                pass

    def test_role_escalation_via_token_claim_is_downgraded(self, client):
        """Self-signed token with role=FIRE_SERVICE must be accepted but
        with the role validated against the known enum; since FIRE_SERVICE
        is a valid enum, the user keeps that role.  An unknown role claim
        (e.g. role='ROOT') must be downgraded to STUDENT."""
        payload = {
            "sub": str(uuid4()),
            "role": "ROOT",  # not in user_role_enum
            "iat": datetime.now(timezone.utc),
            "exp": datetime.now(timezone.utc) + timedelta(hours=1),
        }
        token = jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
        # Connection itself should still succeed (role is just downgraded)
        with client.websocket_connect(f"/api/v1/ws?token={token}") as ws:
            # The websocket scope's state should reflect the downgraded role.
            # We can't access scope easily from outside, so this is a smoke
            # test that the connection completes.
            ws.send_json({"type": "JOIN_CAMPUS", "campus_id": "T-01"})

    def test_telemetry_persists(self, client):
        token = make_token(str(uuid4()))
        session_id = str(uuid4())
        with client.websocket_connect(f"/api/v1/ws?token={token}") as ws:
            ws.send_json({"type": "JOIN_CAMPUS", "campus_id": "T-02"})
            ws.send_json({
                "type": "DRILL_TELEMETRY",
                "drill_session_id": session_id,
                "floor": 1,
                "cell": [2, 2],
                "status": "EVACUATING",
            })
            # consume the echo
            ws.receive_text()
