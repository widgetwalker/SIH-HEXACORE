"""
Pydantic schemas for institution, building, and floor API responses.
"""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class FloorGraphData(BaseModel):
    """Floor-level graph data for canvas rendering / pathfinding."""

    floor_id: UUID
    floor_number: int
    graph_nodes_json: list
    graph_edges_json: list
    grid: list[str] = Field(default_factory=list)
    is_accessible: bool
    risk_level: str

    model_config = ConfigDict(from_attributes=True)


class BuildingResponse(BaseModel):
    """GET /api/v1/buildings/{building_id}."""

    building_id: UUID
    institution_id: UUID
    name: str
    total_floors: int
    has_fire_sprinklers: bool
    has_alarm_system: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class BuildingFloorsResponse(BaseModel):
    """GET /api/v1/buildings/{building_id}/floors — list of floors with graph data."""

    building_id: UUID
    floors: list[FloorGraphData]
