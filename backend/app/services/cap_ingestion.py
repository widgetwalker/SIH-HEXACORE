"""
CAP v1.2 / NDMA SACHET alert ingestion service.

Target: backend/app/services/cap_ingestion.py (doc 09 §3.4)

Implementation:
  - Async poller for OASIS CAP v1.2 XML feeds from NDMA SACHET / IMD.
  - Webhook receiver (POST /api/v1/webhooks/sachet) for push-based delivery.
  - Parses: <identifier>, <sender>, <sent>, <status>, <info>, <headline>,
    <description>, <area>.
  - Auto-triggers EMERGENCY_BROADCAST to affected campuses via PostGIS
    geofence matching (ST_DWithin) once the DB is populated.

This stub implements the XML parser and the webhook endpoint. The
poller and the geofence-matching broadcast trigger are wired as
placeholders ready to be expanded in Sprint 3.
"""

import asyncio
import logging
import re
from datetime import datetime
from typing import Any
from xml.etree import ElementTree as ET

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

try:
    import httpx  # noqa: F401
    _HTTPX_AVAILABLE = True
except ImportError:  # pragma: no cover
    _HTTPX_AVAILABLE = False
    httpx = None  # type: ignore[assignment]

from app.core.database import AsyncSessionLocal
from app.models.alert import EmergencyAlert
from app.services.websocket_manager import ws_manager

logger = logging.getLogger(__name__)

# NDMA SACHET / OASIS CAP feed endpoint - placeholder, replace with real URL
CAP_FEED_URL = "https://example.gov.in/sachet/cap/feed"

# Namespace used in NDMA SACHET CAP XML documents
NS = {"cap": "urn:oasis:names:tc:emergency:cap:1.2"}


def parse_cap_xml(raw_xml: str) -> dict[str, Any] | None:
    """
    Parse a CAP v1.2 XML string into a flat dict.

    Returns None if the XML is malformed or missing required fields.
    """
    try:
        root = ET.fromstring(raw_xml)
    except ET.ParseError:
        logger.warning("CAP XML failed to parse")
        return None

    def text(el: ET.Element | None, tag: str) -> str | None:
        if el is None:
            return None
        found = el.find(f"cap:{tag}", NS)
        return found.text.strip() if found is not None and found.text else None

    alert = root.find("cap:alert", NS)
    if alert is None:
        # Fallback for feeds without namespace
        alert = root

    identifier = text(alert, "identifier")
    sender = text(alert, "sender")
    sent_str = text(alert, "sent")
    status = text(alert, "status")
    msg_type = text(alert, "msgType")

    # <info> block contains urgency, severity, certainty, headline, etc.
    info_block = alert.find("cap:info", NS)
    if info_block is None:
        info_block = alert  # fallback

    urgency = text(info_block, "urgency")
    severity = text(info_block, "severity")
    certainty = text(info_block, "certainty")
    headline = text(info_block, "headline")
    description = text(info_block, "description")
    instruction = text(info_block, "instruction")

    # <area> block for polygon geofence
    area_block = info_block.find("cap:area", NS)
    geofence_wkt: str | None = None
    if area_block is not None:
        circle = area_block.find("cap:circle", NS)
        if circle is not None and circle.text:
            # Convert "lat,lon radius km" to WKT POLYGON (placeholder conversion)
            geofence_wkt = _circle_to_wkt(circle.text.strip())

    event_category = text(info_block, "category") or "Unknown"

    if not all([identifier, sender, sent_str, headline]):
        logger.warning("CAP XML missing required fields")
        return None

    try:
        sent_at = datetime.fromisoformat(sent_str.replace("Z", "+00:00"))
    except ValueError:
        sent_at = datetime.utcnow()

    return {
        "cap_identifier": identifier,
        "sender": sender,
        "sent_at": sent_at,
        "status": status or "Unknown",
        "msg_type": msg_type or "Alert",
        "urgency": urgency or "Unknown",
        "severity": severity or "Unknown",
        "certainty": certainty or "Unknown",
        "event_category": event_category,
        "headline": headline,
        "description": description,
        "instruction": instruction,
        "affected_polygon_wkt": geofence_wkt,
    }


def _circle_to_wkt(circle_text: str) -> str:
    """
    Convert a CAP 1.2 <circle> value ("lat,lon radius_km") into a WKT POLYGON.

    Produces a 16-point approximation of the circle centered at the given
    lat/lon.  This is an approximation only - a full implementation would
    use PostGIS ST_Buffer on the server side.
    """
    import math

    parts = circle_text.split()
    if len(parts) < 2:
        return "POLYGON EMPTY"

    try:
        lat, lon = map(float, parts[0].split(","))
        radius_km = float(parts[1])
    except (ValueError, IndexError):
        return "POLYGON EMPTY"

    # Rough conversion: 1 degree lat ≈ 111 km, 1 degree lon ≈ 111 * cos(lat) km
    radius_lat = radius_km / 111.0
    radius_lon = radius_km / (111.0 * math.cos(math.radians(lat)))

    points = []
    for i in range(16):
        angle = 2 * math.pi * i / 16
        px = lon + radius_lon * math.cos(angle)
        py = lat + radius_lat * math.sin(angle)
        points.append(f"{px} {py}")

    # Close the polygon
    points.append(points[0])
    return f"POLYGON(({', '.join(points)}))"


async def persist_alert(parsed: dict[str, Any]) -> EmergencyAlert | None:
    """
    Store a parsed CAP alert in the database, skipping duplicates
    (cap_identifier is UNIQUE).
    """
    async with AsyncSessionLocal() as session:
        # Check for duplicate
        existing = await session.execute(
            select(EmergencyAlert).where(
                EmergencyAlert.cap_identifier == parsed["cap_identifier"]
            )
        )
        if existing.scalar_one_or_none():
            logger.info("Skipping duplicate alert %s", parsed["cap_identifier"])
            return None

        alert = EmergencyAlert(**{k: v for k, v in parsed.items() if k != "affected_polygon_wkt"})
        session.add(alert)
        await session.commit()
        await session.refresh(alert)
        logger.info("Persisted alert %s", alert.cap_identifier)
        return alert


async def trigger_geofenced_broadcast(alert: EmergencyAlert) -> None:
    """
    Query all institutions whose PostGIS boundary_geofence intersects the
    alert's affected_polygon and push EMERGENCY_BROADCAST to their rooms.

    Placeholder - the PostGIS ST_DWithin query is stubbed for Sprint 3.
    """
    # TODO (Sprint 3): ST_DWithin(geofence, affected_polygon, 0)
    campus_ids: list[str] = []  # will come from DB query in Sprint 3

    if not campus_ids:
        # No campus matched the geofence - broadcast to all for safety
        await ws_manager.broadcast_emergency_all(
            severity=alert.severity,
            message=alert.headline or "Emergency Alert",
        )
    else:
        for campus_id in campus_ids:
            await ws_manager.broadcast_emergency(
                campus_id=campus_id,
                severity=alert.severity,
                message=alert.headline or "Emergency Alert",
            )


async def ingest_alert_xml(raw_xml: str) -> EmergencyAlert | None:
    """
    End-to-end ingest: parse → persist → trigger geofenced broadcast.
    Called by both the webhook receiver and the background poller.
    """
    parsed = parse_cap_xml(raw_xml)
    if parsed is None:
        return None

    alert = await persist_alert(parsed)
    if alert is None:
        return None

    # Fire and forget the broadcast (don't block on it)
    asyncio.create_task(trigger_geofenced_broadcast(alert))
    return alert


# ── Background CAP feed poller ─────────────────────────────────────────

async def _poll_loop(poll_interval_seconds: float = 60.0) -> None:
    """
    Background loop that polls the SACHET CAP feed and ingests new alerts.

    Uses a local cache file to track the last-seen alert identifier so
    repeated entries are skipped without a database round-trip.
    """
    last_id_file = "data/.last_cap_alert_id"
    last_id: str | None = None

    try:
        with open(last_id_file) as f:
            last_id = f.read().strip() or None
    except FileNotFoundError:
        pass

    if not _HTTPX_AVAILABLE:
        logger.warning("httpx not installed - CAP poller disabled")
        return
    async with httpx.AsyncClient(timeout=30.0) as client:
        while True:
            try:
                response = await client.get(CAP_FEED_URL)
                response.raise_for_status()
                alerts_raw = response.text

                # Simple splitting - NDMA SACHET typically sends one <alert> per document
                for chunk in re.split(r"(?=<alert\b)", alerts_raw):
                    if not chunk.strip():
                        continue
                    parsed = parse_cap_xml(chunk)
                    if parsed and parsed["cap_identifier"] != last_id:
                        await ingest_alert_xml(chunk)
                        last_id = parsed["cap_identifier"]
                        with open(last_id_file, "w") as f:
                            f.write(last_id)

            except httpx.HTTPError as e:
                logger.error("CAP feed poll failed: %s", e)

            await asyncio.sleep(poll_interval_seconds)


def start_cap_poller(poll_interval: float = 60.0) -> asyncio.Task:
    """Start the background CAP feed poller as an asyncio task."""
    return asyncio.create_task(_poll_loop(poll_interval))
