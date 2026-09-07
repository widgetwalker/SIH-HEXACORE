"""
Campus emergency incident-injection schema, used by the /command drill
control panel (POST /api/v1/webhooks/inject-incident).
"""

from typing import Literal

from pydantic import BaseModel

IncidentType = Literal[
    "electrical-fire",
    "chemical-spill",
    "gas-leak",
    "storm-cyclone",
    "flash-flood",
    "earthquake-drill",
    "tsunami-warning",
]

INCIDENT_PRESETS: dict[str, dict[str, str]] = {
    "electrical-fire": {
        "label": "Electrical Transformer Fire",
        "location": "Ground Floor Lobby",
        "severity": "Extreme",
    },
    "chemical-spill": {
        "label": "Chemical Lab Spill",
        "location": "Science Block, Floor 2",
        "severity": "Warning",
    },
    "gas-leak": {
        "label": "Gas Leak Hazard",
        "location": "Near Staircase B",
        "severity": "Extreme",
    },
    "storm-cyclone": {
        "label": "Severe Cyclone / Gale Surge",
        "location": "Coastal Campus Perimeter",
        "severity": "Extreme",
    },
    "flash-flood": {
        "label": "Torrential Flash Flood / Cloudburst",
        "location": "Campus Ground & Drainage Corridor",
        "severity": "Extreme",
    },
    "earthquake-drill": {
        "label": "M6.2 Seismic Tremor & Structural Risk",
        "location": "Academic Blocks A & B",
        "severity": "Extreme",
    },
    "tsunami-warning": {
        "label": "Tsunami Inundation Warning",
        "location": "Bay of Bengal Coastal Sector",
        "severity": "Extreme",
    },
}


class IncidentInjectRequest(BaseModel):
    incident_type: IncidentType
    campus_id: str = "CAMPUS-01"
