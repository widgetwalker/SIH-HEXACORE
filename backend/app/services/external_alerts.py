"""
Live external hazard feed aggregation.

Pulls from two free, unauthenticated public APIs and filters both down to
only life-safety-critical events - routine weather (temperature, humidity,
cloud cover) is never surfaced, only conditions that clear a severe
threshold:

- Open-Meteo forecast API: hourly rainfall and wind speed near a campus,
  filtered to rainfall > 30mm/h or wind > 60km/h.
- USGS real-time earthquake GeoJSON feed: regional seismic events,
  filtered to magnitude >= 4.5 within EARTHQUAKE_RADIUS_KM of the campus.

Both calls degrade to an empty list on any network/parse failure rather
than raising - a live-alerts panel should never break the rest of
/command just because an upstream feed is briefly unreachable.
"""

from datetime import datetime, timezone
from math import atan2, cos, radians, sin, sqrt

import httpx

from app.schemas.live_alert import LiveAlert

# Default campus coordinates (New Delhi) - used when the caller doesn't
# supply lat/lon query params.
DEFAULT_LAT = 28.6139
DEFAULT_LON = 77.2090

RAINFALL_THRESHOLD_MM_H = 30.0
WIND_THRESHOLD_KMH = 60.0
EARTHQUAKE_MIN_MAGNITUDE = 4.5
EARTHQUAKE_RADIUS_KM = 300.0

OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"
USGS_FEED_URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson"

_HTTP_TIMEOUT = httpx.Timeout(8.0)


async def fetch_weather_alerts(lat: float, lon: float) -> list[LiveAlert]:
    params = {
        "latitude": lat,
        "longitude": lon,
        "hourly": "precipitation,wind_speed_10m",
        "forecast_days": 1,
        "timezone": "auto",
    }
    try:
        async with httpx.AsyncClient(timeout=_HTTP_TIMEOUT) as client:
            res = await client.get(OPEN_METEO_URL, params=params)
            res.raise_for_status()
            data = res.json()
    except (httpx.HTTPError, ValueError):
        return []

    hourly = data.get("hourly", {})
    times: list[str] = hourly.get("time", [])
    rain: list[float | None] = hourly.get("precipitation", [])
    wind: list[float | None] = hourly.get("wind_speed_10m", [])

    alerts: list[LiveAlert] = []
    for i, t in enumerate(times):
        rain_val = rain[i] if i < len(rain) else None
        wind_val = wind[i] if i < len(wind) else None

        if rain_val is not None and rain_val > RAINFALL_THRESHOLD_MM_H:
            alerts.append(
                LiveAlert(
                    id=f"weather-rain-{t}",
                    source="Open-Meteo",
                    category="flood",
                    severity="Warning",
                    headline=f"Heavy rainfall forecast: {rain_val:.0f}mm/h",
                    detail=f"Rainfall exceeds the {RAINFALL_THRESHOLD_MM_H:.0f}mm/h flood-risk threshold at {t}.",
                    occurred_at=t,
                )
            )
        if wind_val is not None and wind_val > WIND_THRESHOLD_KMH:
            alerts.append(
                LiveAlert(
                    id=f"weather-wind-{t}",
                    source="Open-Meteo",
                    category="severe-weather",
                    severity="Warning",
                    headline=f"Severe wind forecast: {wind_val:.0f}km/h",
                    detail=f"Wind speed exceeds the {WIND_THRESHOLD_KMH:.0f}km/h severe-weather threshold at {t}.",
                    occurred_at=t,
                )
            )
    return alerts


def _haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    earth_radius_km = 6371.0
    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)
    a = sin(dlat / 2) ** 2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon / 2) ** 2
    return 2 * earth_radius_km * atan2(sqrt(a), sqrt(1 - a))


async def fetch_earthquake_alerts(lat: float, lon: float) -> list[LiveAlert]:
    try:
        async with httpx.AsyncClient(timeout=_HTTP_TIMEOUT) as client:
            res = await client.get(USGS_FEED_URL)
            res.raise_for_status()
            data = res.json()
    except (httpx.HTTPError, ValueError):
        return []

    alerts: list[LiveAlert] = []
    for feature in data.get("features", []):
        props = feature.get("properties", {})
        mag = props.get("mag")
        coords = feature.get("geometry", {}).get("coordinates", [])
        if mag is None or mag < EARTHQUAKE_MIN_MAGNITUDE or len(coords) < 2:
            continue

        quake_lon, quake_lat = coords[0], coords[1]
        distance_km = _haversine_km(lat, lon, quake_lat, quake_lon)
        if distance_km > EARTHQUAKE_RADIUS_KM:
            continue

        occurred_ms = props.get("time")
        occurred_iso = (
            datetime.fromtimestamp(occurred_ms / 1000, tz=timezone.utc).isoformat()
            if occurred_ms
            else datetime.now(timezone.utc).isoformat()
        )
        alerts.append(
            LiveAlert(
                id=f"usgs-{feature.get('id')}",
                source="USGS",
                category="earthquake",
                severity="Extreme" if mag >= 6 else "Warning",
                headline=f"M{mag:.1f} earthquake {distance_km:.0f}km from campus",
                detail=props.get("place") or "Regional seismic event - structural check protocol advised.",
                occurred_at=occurred_iso,
            )
        )
    return alerts


async def get_live_alerts(lat: float = DEFAULT_LAT, lon: float = DEFAULT_LON) -> list[LiveAlert]:
    weather = await fetch_weather_alerts(lat, lon)
    quakes = await fetch_earthquake_alerts(lat, lon)
    return weather + quakes
