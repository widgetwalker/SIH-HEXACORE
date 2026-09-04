"""
Pydantic schemas for the dynamic pathfinder service.

These are the contracts used by:
  - POST /api/v1/pathfinder/route  (request/response)
  - The WebSocket manager when it pushes path updates to clients
"""

from __future__ import annotations

from typing import Optional
from pydantic import BaseModel, Field


class HazardState(BaseModel):
    """Snapshot of the current hazard state affecting path weights."""

    fire_cells: list[list[int]] = Field(
        default_factory=list,
        description="Cells that are on fire: [col, row, floor]",
    )
    smoke_cells: dict[str, float] = Field(
        default_factory=dict,
        description="Key 'col,row,floor' -> smoke density [0,1]",
    )
    blocked_doors: list[str] = Field(
        default_factory=list,
        description="Door node IDs that are currently impassable",
    )
    blocked_corridors: list[str] = Field(
        default_factory=list,
        description="Corridor node IDs currently blocked by debris",
    )
    timestamp: float = Field(
        default_factory=float,
        description="When this hazard snapshot was taken (epoch seconds)",
    )


class PathRequest(BaseModel):
    """Request to compute an evacuation path."""

    start_col: int = Field(..., ge=0, le=24, description="Starting column")
    start_row: int = Field(..., ge=0, le=13, description="Starting row")
    start_floor: int = Field(..., ge=0, le=5, description="Starting floor")
    hazard: HazardState = Field(
        default_factory=HazardState,
        description="Current hazard state affecting path weights",
    )
    max_time_ms: float = Field(
        15.0, ge=1.0, le=1000.0, description="Hard time budget for the search"
    )


class PathResult(BaseModel):
    """Result of a pathfinding request."""

    path: list[list[int]] = Field(
        default_factory=list,
        description="Sequence of [col, row, floor] waypoints",
    )
    # total_cost is None when the pathfinder cannot reach any exit
    # (found=False).  We keep it as Optional[float] (rather than
    # serialising math.inf) so the JSON response is valid and the
    # frontend can detect "unreachable" without parsing infinity.
    total_cost: Optional[float] = Field(
        None,
        description="Total path cost in weighted units, or None if unreachable",
    )
    computation_time_ms: float = Field(
        ..., description="Time taken to compute the path"
    )
    exits_used: list[str] = Field(
        default_factory=list, description="Exit node IDs reached"
    )
    found: bool = Field(..., description="Whether a path was found")


class PathUpdateMessage(BaseModel):
    """Server -> Client: push a path update during a live drill."""

    type: str = "PATH_UPDATE"
    user_id: str
    path: list[list[int]] = Field(default_factory=list)
    exits_used: list[str] = Field(default_factory=list)
    computation_time_ms: float = 0.0