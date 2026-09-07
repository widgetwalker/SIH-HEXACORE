"""
Live external hazard alerts for the /command early-warning panel.

Read-only, no database dependency - aggregates Open-Meteo severe
weather/flood signals and the USGS earthquake feed on every request,
already filtered to life-safety-critical events by app/services/external_alerts.py.
"""

from fastapi import APIRouter, Query

from app.schemas.live_alert import LiveAlert
from app.services.external_alerts import DEFAULT_LAT, DEFAULT_LON, get_live_alerts

router = APIRouter()


@router.get("/alerts/live", response_model=list[LiveAlert])
async def get_live_disaster_alerts(
    lat: float = Query(DEFAULT_LAT, description="Campus latitude"),
    lon: float = Query(DEFAULT_LON, description="Campus longitude"),
) -> list[LiveAlert]:
    return await get_live_alerts(lat, lon)
