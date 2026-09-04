"""
Webhook receiver for NDMA SACHET / OASIS CAP v1.2 alerts.

NDMA SACHET (and other CAP producers) push alerts to subscribers via
HTTP POST.  This module exposes the receiver endpoint and hands the raw
XML to the ingestion service for parsing, persistence, and geofenced
broadcast.

Authentication: shared HMAC header (``X-SACHET-Signature``) — the
secret is configured via ``settings.SACHET_WEBHOOK_SECRET``.  In
dev / local mode the secret may be empty, in which case the endpoint
refuses anything coming from a non-loopback source.
"""

from __future__ import annotations

import hashlib
import hmac
import logging
import os
from typing import Annotated

from fastapi import APIRouter, Header, HTTPException, Request

from app.core.config import settings
from app.services import cap_ingestion
from app.services.websocket_manager import ws_manager

logger = logging.getLogger(__name__)

router = APIRouter()

# DoS guard: refuse any payload over 64 KB.  A CAP v1.2 alert is a few
# hundred bytes of XML; anything larger is almost certainly abuse.
_MAX_PAYLOAD_BYTES = 64 * 1024


def _is_loopback(client_host: str | None) -> bool:
    if not client_host:
        return False
    return client_host in {"127.0.0.1", "::1", "localhost"}


async def _verify_signature(body: bytes, provided: str | None) -> None:
    """
    Constant-time HMAC check against ``X-SACHET-Signature``.

    - If a secret is configured, the header is required and must match.
    - If no secret is configured, allow only loopback callers (dev mode).
    """
    secret = settings.SACHET_WEBHOOK_SECRET
    if secret:
        if not provided:
            raise HTTPException(
                status_code=401,
                detail="missing X-SACHET-Signature header",
            )
        expected = hmac.new(
            secret.encode("utf-8"),
            body,
            hashlib.sha256,
        ).hexdigest()
        if not hmac.compare_digest(expected, provided):
            raise HTTPException(
                status_code=401,
                detail="invalid SACHET signature",
            )


@router.post(
    "/webhooks/sachet",
    tags=["webhooks"],
    summary="Receive CAP v1.2 alert from NDMA SACHET",
)
async def receive_sachet(
    request: Request,
    x_sachet_signature: Annotated[str | None, Header(alias="X-SACHET-Signature")] = None,
) -> dict:
    """
    Push-based entry point for CAP v1.2 alerts.

    The request body is the raw XML ``<alert>`` document.  We
    deliberately parse it ourselves instead of letting Pydantic
    deserialize it — CAP has a recursive <info> structure with
    optional <area> + <circle> that doesn't map cleanly to a flat
    schema, and ElementTree keeps us in control of namespace handling.

    Returns a small JSON envelope so the SACHET client can confirm
    acceptance without polling the broadcast.
    """
    body = await request.body()
    if len(body) > _MAX_PAYLOAD_BYTES:
        raise HTTPException(
            status_code=413,
            detail=f"payload exceeds {_MAX_PAYLOAD_BYTES} bytes",
        )
    if not body:
        raise HTTPException(status_code=400, detail="empty body")

    secret = settings.SACHET_WEBHOOK_SECRET
    if not secret and not _is_loopback(request.client.host if request.client else None):
        # Production-style mode without a secret = refuse remote callers.
        raise HTTPException(status_code=401, detail="webhook secret not configured")

    await _verify_signature(body, x_sachet_signature)

    alert = await cap_ingestion.ingest_alert_xml(body.decode("utf-8", errors="replace"))
    if alert is None:
        # Either the XML was malformed or it was a duplicate cap_identifier
        # (handled silently by persist_alert).  Both are 200 OK to the
        # producer so they don't retry-storm us.
        return {"status": "rejected_or_duplicate"}

    return {
        "status": "ingested",
        "cap_identifier": alert.cap_identifier,
        "severity": alert.severity,
        "headline": alert.headline,
    }


# Sentinel to silence "imported but unused" warnings; ws_manager is
# kept available so future filters (e.g. severity gating) can hook in.
_ = ws_manager
