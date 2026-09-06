"""
WebSocket message schemas for the multi-agency telemetry hub.

Wire format matches docs/09_BACKEND_IMPLEMENTATION.md §3.3.

Schema invariants:
  - ``role`` is NOT a field of ``JoinCampusMessage`` because the user's role
    is determined server-side from the authenticated JWT (and ultimately
    from the DB) — accepting it from the client would allow privilege
    escalation.
  - ``drill_session_id`` and ``cell`` are typed as UUID / 2-int list to
    reject malformed input before it reaches SQL or pathfinding.
"""

from typing import Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class JoinCampusMessage(BaseModel):
    """Client -> Server: a user has joined a campus room."""

    model_config = ConfigDict(extra="forbid")  # reject unexpected fields

    type: Literal["JOIN_CAMPUS"] = "JOIN_CAMPUS"
    campus_id: str = Field(..., min_length=1, max_length=64,
                           pattern=r"^[a-zA-Z0-9_-]+$",
                           description="Campus identifier (alphanumeric, hyphen, underscore)")


class DrillTelemetryMessage(BaseModel):
    """Client -> Server: periodic drill state, ~2 Hz."""

    model_config = ConfigDict(extra="forbid")

    type: Literal["DRILL_TELEMETRY"] = "DRILL_TELEMETRY"
    drill_session_id: UUID
    floor: int = Field(..., ge=0, le=200, description="Building floor number")
    cell: list[int] = Field(..., min_length=2, max_length=2)
    status: str = Field(..., min_length=1, max_length=64)


class WebSocketMessage(BaseModel):
    """Discriminated union base for incoming messages."""

    type: str
