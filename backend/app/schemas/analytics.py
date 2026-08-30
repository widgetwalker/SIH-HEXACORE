"""
Analytics schemas - the responses that power /admin.
"""

from pydantic import BaseModel, Field


class KPIData(BaseModel):
    """Top-line KPIs shown as stat tiles on the admin dashboard."""

    total_drills: int
    success_rate: float = Field(..., ge=0.0, le=1.0)
    avg_escape_time_sec: float
    avg_peak_panic: float
    top_failure_mode: str
    top_failure_count: int


class HeatmapData(BaseModel):
    """Aggregated route heatmap as a flat grid + dimensions."""

    cols: int
    rows: int
    heat: list[float]
    casualty_cells: list[list[int]] = Field(default_factory=list)
    exit_cells: list[list[int]] = Field(default_factory=list)
    spawn_cell: list[int] | None = None


class AnalyticsResponse(BaseModel):
    """Combined analytics payload served by GET /api/v1/telemetry/analytics."""

    kpis: KPIData
    heatmap: HeatmapData
    per_scenario: dict[str, KPIData] = Field(default_factory=dict)
