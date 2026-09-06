"""
Pydantic schemas for drill scenarios.

These are the contract parameters that the frontend needs to configure a drill:
time limits, fire spread rates, fog density, colour palettes, and the
ASCII floor-plan map.

Schema mirrors the original frontend/src/data/scenarios.json shape so the
existing TypeScript Scenario interface works unchanged when the frontend
migrates to fetch('/api/v1/scenarios'). The buildings API
(GET /api/v1/buildings/{id}/floors) also exposes floor grids, but the
per-scenario map remains here so the drill keeps working standalone.
"""

from __future__ import annotations

from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict


class ScenarioColors(BaseModel):
    flame: str
    glow: str
    smoke: str


class BlockageEvent(BaseModel):
    t: int = Field(..., ge=0, description="Tick at which the corridor is sealed")
    warnT: Optional[int] = Field(
        None,
        description="Tick at which the player is warned; must be < t if set",
    )
    cells: List[List[int]] = Field(default_factory=list)
    warnMessage: Optional[str] = None
    message: str

    @classmethod
    def __get_validators__(cls):  # pragma: no cover - legacy hook
        yield from ()

    def model_post_init(self, __context) -> None:
        """Enforce warnT < t so the warning actually fires before sealing."""
        if self.warnT is not None and self.warnT >= self.t:
            raise ValueError(
                f"warnT ({self.warnT}) must be strictly less than t ({self.t})"
            )


class Scenario(BaseModel):
    id: str
    name: str
    badge: str
    hazardLabel: str
    difficulty: int = Field(..., ge=1, le=5, description="Difficulty tier (1-5 stars)")
    brief: str
    timeLimit: int = Field(..., ge=10, le=600, description="Drill time limit in seconds")
    spreadInterval: float = Field(..., gt=0, description="Seconds between fire spread attempts")
    spreadChance: float = Field(..., ge=0, le=1, description="Probability [0,1] that a cell ignites")
    fogDensity: float = Field(..., ge=0, le=1, description="Fog obscuration factor")
    colors: ScenarioColors
    map: List[str] = Field(default_factory=list, description="ASCII floor plan, one row per string")
    blockages: List[BlockageEvent] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)


class ScenarioListResponse(BaseModel):
    """GET /api/v1/scenarios — wraps scenarios array for forward-compat."""
    scenarios: List[Scenario]
