"""
CAP v1.2 / NDMA SACHET alert schemas.
"""

from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class EmergencyAlertCreate(BaseModel):
    """Payload sent by the SACHET ingestion worker when a new alert arrives."""

    cap_identifier: str = Field(..., max_length=255)
    sender: str = Field(..., max_length=255)
    sent_at: datetime
    status: str = Field(..., description="'Actual' | 'Exercise' | 'Test'")
    msg_type: str = Field(..., description="'Alert' | 'Update' | 'Cancel'")
    urgency: str
    severity: str
    certainty: str
    event_category: str
    headline: str
    description: str | None = None
    instruction: str | None = None
    affected_polygon_wkt: str | None = Field(
        None, description="Well-Known Text for the affected polygon (optional)"
    )


class EmergencyAlertResponse(BaseModel):
    """Returned from GET /api/v1/alerts/active."""

    id: str
    cap_identifier: str
    sender: str
    sent_at: datetime
    severity: str
    urgency: str
    event_category: str
    headline: str
    description: str | None
    instruction: str | None
    is_active: bool

    model_config = ConfigDict(from_attributes=True)


class EmergencyBroadcast(BaseModel):
    """Server -> All clients WebSocket broadcast payload (<50ms target)."""

    type: str = "EMERGENCY_BROADCAST"
    severity: str
    msg: str
    affected_campus_ids: list[str] = Field(default_factory=list)
