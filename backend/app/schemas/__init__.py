"""
Pydantic v2 schemas for API request/response payloads.

These are the contracts exposed by the HTTP layer. They are deliberately
separate from the SQLAlchemy ORM models so:
  - the database shape can evolve without breaking clients
  - the response shape can hide internal columns (e.g. password_hash)
  - validation rules are expressed in one place per payload
"""

from app.schemas.drill import (
    RunTelemetryRequest,
    RunTelemetryResponse,
    ViolationSchema,
    ExitCellSchema,
)
from app.schemas.analytics import AnalyticsResponse, KPIData, HeatmapData
from app.schemas.alert import (
    EmergencyAlertCreate,
    EmergencyAlertResponse,
    EmergencyBroadcast,
)
from app.schemas.websocket import (
    JoinCampusMessage,
    DrillTelemetryMessage,
    WebSocketMessage,
)
from app.schemas.scenarios import Scenario, ScenarioListResponse
from app.schemas.pathfinder import (
    HazardState,
    PathRequest,
    PathResult,
    PathUpdateMessage,
)

__all__ = [
    "RunTelemetryRequest",
    "RunTelemetryResponse",
    "ViolationSchema",
    "ExitCellSchema",
    "AnalyticsResponse",
    "KPIData",
    "HeatmapData",
    "EmergencyAlertCreate",
    "EmergencyAlertResponse",
    "EmergencyBroadcast",
    "JoinCampusMessage",
    "DrillTelemetryMessage",
    "WebSocketMessage",
    "Scenario",
    "ScenarioListResponse",
    "HazardState",
    "PathRequest",
    "PathResult",
    "PathUpdateMessage",
]