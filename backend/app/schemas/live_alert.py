"""
Live external hazard alert schema - Open-Meteo severe weather/flood signals
and USGS earthquake events, normalized to one shape. Distinct from
EmergencyAlertResponse (app/schemas/alert.py), which represents a persisted
NDMA SACHET/CAP alert row; these are transient, fetched fresh on each
request, never written to the database.
"""

from pydantic import BaseModel


class LiveAlert(BaseModel):
    id: str
    source: str
    category: str  # "flood" | "severe-weather" | "earthquake"
    severity: str  # "Warning" | "Extreme"
    headline: str
    detail: str
    occurred_at: str
