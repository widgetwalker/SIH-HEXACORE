"""
Campus emergency incident-injection schema, used by the /command drill
control panel (POST /api/v1/webhooks/inject-incident).
"""

from typing import Literal

from pydantic import BaseModel

IncidentType = Literal["electrical-fire", "chemical-spill", "gas-leak"]

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
        "label": "Gas Leak",
        "location": "Near Staircase B",
        "severity": "Extreme",
    },
}


class IncidentInjectRequest(BaseModel):
    incident_type: IncidentType
    campus_id: str = "CAMPUS-01"
