"""
Drill-run telemetry schemas (frontend ➔ backend contract).

Matches the RunTelemetry interface defined in
docs/09_BACKEND_IMPLEMENTATION.md §Data Contracts.
"""

from datetime import datetime
from typing import Literal
from pydantic import BaseModel, Field, ConfigDict


class CellCoord(BaseModel):
    """A single grid cell coordinate (column, row)."""

    c: int = Field(..., ge=0)
    r: int = Field(..., ge=0)


class ViolationSchema(BaseModel):
    """A single recorded protocol violation during a run."""

    t: float = Field(..., ge=0, description="Time in seconds since drill start")
    type: Literal[
        "entered_fire",
        "smoke_exposure",
        "panic_freeze",
        "route_blocked",
        "breathed",
        "exit_reached",
    ]
    cell: CellCoord | None = None
    detail: str | None = None


class ExitCellSchema(BaseModel):
    """Grid cell where the user reached the exit."""

    c: int = Field(..., ge=0)
    r: int = Field(..., ge=0)


class RunTelemetryRequest(BaseModel):
    """
    POST /api/v1/telemetry/runs payload.

    Sent by the frontend simulation when a drill ends, replacing the
    earlier browser-localStorage persistence.
    """

    runId: str
    scenarioId: str
    scenarioName: str
    status: Literal["won", "lost"]
    time: float
    oxygenLeft: float
    panicPeak: float
    panicFreezeSeconds: float
    score: float
    smokeStandingSeconds: float
    smokeCrouchSeconds: float
    breathCount: int
    distanceTraveled: float
    fireCellEntries: int
    exitUsed: ExitCellSchema | None = None
    deathCell: CellCoord | None = None
    violations: list[ViolationSchema] = Field(default_factory=list)
    routeHeat: list[float] = Field(..., description="Flat rows*cols visit counts")
    cols: int = Field(..., ge=1)
    rows: int = Field(..., ge=1)
    createdAt: int = Field(..., description="Client-side millisecond timestamp")


class RunTelemetryResponse(BaseModel):
    """Return value after persisting a run - currently just echoes server-side state."""

    run_id: str
    persisted: bool
    server_received_at: datetime

    model_config = ConfigDict(from_attributes=True)
