"""
WebSocket message schemas for the multi-agency telemetry hub.

Wire format matches docs/09_BACKEND_IMPLEMENTATION.md §3.3.
"""

from typing import Literal
from pydantic import BaseModel, Field


class JoinCampusMessage(BaseModel):
    """Client -> Server: a user has joined a campus room."""

    type: Literal["JOIN_CAMPUS"] = "JOIN_CAMPUS"
    campus_id: str
    role: str = Field(..., description="User role joining (STUDENT, WARDEN, etc.)")


class DrillTelemetryMessage(BaseModel):
    """Client -> Server: periodic drill state, ~2 Hz."""

    type: Literal["DRILL_TELEMETRY"] = "DRILL_TELEMETRY"
    user_id: str
    floor: str
    cell: list[int] = Field(..., min_length=2, max_length=2)
    status: str


class WebSocketMessage(BaseModel):
    """Discriminated union base for incoming messages."""

    type: str
