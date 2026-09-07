"""
Live external hazard feed aggregation.

Pulls from free, unauthenticated public APIs (Open-Meteo and USGS)
calibrated for Indian coastal & urban campuses (defaulting to Puducherry / Pondicherry):

- Open-Meteo API: Real-time telemetry (temperature, wind speed, humidity, precipitation)
  and hourly forecast alerts for heavy rainfall / flood risk and high-velocity winds.
- USGS real-time earthquake GeoJSON feed: Regional seismic activity monitoring.
"""

from datetime import datetime, timezone
from math import atan2, cos, radians, sin, sqrt

import httpx

from app.schemas.live_alert import LiveAlert

# Default campus coordinates: Puducherry / Pondicherry, India
DEFAULT_LAT = 11.9416
DEFAULT_LON = 79.8083

RAINFALL_SEVERE_MM_H = 20.0
RAINFALL_ADVISORY_MM_H = 5.0
WIND_SEVERE_KMH = 45.0
WIND_ADVISORY_KMH = 25.0

EARTHQUAKE_MIN_MAGNITUDE = 3.5
EARTHQUAKE_RADIUS_KM = 3500.0  # Regional Indian Ocean / Bay of Bengal / South Asia fault zones

OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"
USGS_FEED_URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson"

_HTTP_TIMEOUT = httpx.Timeout(8.0)


async def fetch_weather_alerts(lat: float, lon: float) -> list[LiveAlert]:
    params = {
        "latitude": lat,
        "longitude": lon,
        "current": "temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code",
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

    alerts: list[LiveAlert] = []
    now_iso = datetime.now(timezone.utc).isoformat()

    # 1. Current atmospheric telemetry
    curr = data.get("current", {})
    temp = curr.get("temperature_2m")
    wind_now = curr.get("wind_speed_10m", 0)
    rain_now = curr.get("precipitation", 0)
    humidity = curr.get("relative_humidity_2m")

    # If severe right now
    if rain_now is not None and rain_now > RAINFALL_SEVERE_MM_H:
        alerts.append(
            LiveAlert(
                id=f"weather-now-rain-{int(datetime.now().timestamp())}",
                source="Open-Meteo",
                category="flood",
                severity="Extreme",
                headline=f"Flash Flood Warning: {rain_now:.1f} mm/h precipitation recorded",
                detail=f"Campus coordinates ({lat:.4f}, {lon:.4f}) exceed torrential rain threshold. Waterlogging likely.",
                occurred_at=now_iso,
            )
        )
    elif wind_now is not None and wind_now > WIND_SEVERE_KMH:
        alerts.append(
            LiveAlert(
                id=f"weather-now-wind-{int(datetime.now().timestamp())}",
                source="Open-Meteo",
                category="severe-weather",
                severity="Warning",
                headline=f"High Wind Advisory: {wind_now:.1f} km/h wind gusts",
                detail=f"Elevated wind velocity in campus corridor ({lat:.4f}, {lon:.4f}). Secure exterior fixtures.",
                occurred_at=now_iso,
            )
        )
    elif temp is not None:
        # Provide continuous live telemetric baseline for the operator
        alerts.append(
            LiveAlert(
                id=f"weather-telemetry-{int(datetime.now().timestamp() // 300)}",
                source="Open-Meteo",
                category="weather-telemetry",
                severity="Advisory",
                headline=f"Sector Telemetry: {temp:.1f}°C, Wind {wind_now:.1f} km/h ({lat:.2f}°N, {lon:.2f}°E)",
                detail=f"Relative Humidity: {humidity}% · Precipitation: {rain_now} mm/h. Live meteorological radar streaming.",
                occurred_at=now_iso,
            )
        )

    # 2. Upcoming forecast alerts
    hourly = data.get("hourly", {})
    times: list[str] = hourly.get("time", [])
    rain: list[float | None] = hourly.get("precipitation", [])
    wind: list[float | None] = hourly.get("wind_speed_10m", [])

    for i, t in enumerate(times[:12]):
        rain_val = rain[i] if i < len(rain) else None
        wind_val = wind[i] if i < len(wind) else None

        if rain_val is not None and rain_val > RAINFALL_SEVERE_MM_H:
            alerts.append(
                LiveAlert(
                    id=f"weather-rain-{t}",
                    source="Open-Meteo",
                    category="flood",
                    severity="Warning",
                    headline=f"Heavy rainfall forecast: {rain_val:.0f} mm/h at {t[-5:]}",
                    detail=f"Precipitation expected to breach {RAINFALL_SEVERE_MM_H:.0f} mm/h flood-risk threshold.",
                    occurred_at=t,
                )
            )
        if wind_val is not None and wind_val > WIND_SEVERE_KMH:
            alerts.append(
                LiveAlert(
                    id=f"weather-wind-{t}",
                    source="Open-Meteo",
                    category="severe-weather",
                    severity="Warning",
                    headline=f"Severe wind forecast: {wind_val:.0f} km/h at {t[-5:]}",
                    detail=f"Wind speed forecast to breach {WIND_SEVERE_KMH:.0f} km/h storm threshold.",
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
    features = data.get("features", [])

    for feature in features:
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
                severity="Extreme" if mag >= 6.0 else "Warning" if mag >= 4.5 else "Advisory",
                headline=f"M{mag:.1f} Seismic Event — {distance_km:.0f} km from sector",
                detail=props.get("place") or "Regional tectonic movement detected by USGS seismic sensor network.",
                occurred_at=occurred_iso,
            )
        )
        if len(alerts) >= 3:
            break

    return alerts


async def get_live_alerts(lat: float = DEFAULT_LAT, lon: float = DEFAULT_LON) -> list[LiveAlert]:
    weather = await fetch_weather_alerts(lat, lon)
    quakes = await fetch_earthquake_alerts(lat, lon)
    return weather + quakes
