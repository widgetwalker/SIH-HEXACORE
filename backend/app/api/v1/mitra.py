"""
Mitra crisis-companion chat endpoint.

This used to live entirely in the Next.js frontend (frontend/src/app/api/mitra/route.ts),
which meant every developer needed their own GEMINI_API_KEY in frontend/.env.local
just to see Mitra respond. Moved here so the key lives once, on whoever runs
this backend - the frontend just calls this endpoint, no key required on
their machine at all.

Logic (system prompt, context formatting, Gemini request shape) is a direct
port of the removed Next.js route - unchanged behavior, different runtime.
"""

from __future__ import annotations

import logging

import httpx
from fastapi import APIRouter, HTTPException

from app.core.config import settings
from app.schemas.mitra import MitraChatRequest, MitraChatResponse, MitraContext

logger = logging.getLogger(__name__)

router = APIRouter()

GEMINI_MODEL = "gemini-3.6-flash"
GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent"

SYSTEM_PROMPT = """You are "Mitra" (Hindi for "friend"), an AI crisis companion embedded in a disaster-preparedness training simulator used by Indian school and college students. You are grounded in NDMA, NFPA, and NDRF safety protocols.

You are supporting a student inside a live evacuation DRILL SIMULATION (a training game, not a real emergency). You will be given the current drill state before each message - use it to ground your answers:
- Doors act as firebreaks until a student pushes through them.
- Holding SHIFT makes the student crouch/crawl, which slows oxygen loss under smoke.
- Holding B triggers box-breathing (4s in, 4s hold, 4s out), which lowers panic.

Rules:
- Keep every reply as SHORT as possible: normally just 1 sentence, 2 only if genuinely needed. Plain text, no markdown, no lists, no headers - this renders inside a small chat panel and every extra word costs real money, so never pad or repeat yourself.
- Tone: calm, direct, authoritative, never alarmist.
- Always ground advice in the live numbers you're given (oxygen %, panic %, elapsed time, crouching/breathing state) when they're relevant.
- If oxygen or panic is critical, give exactly ONE clear next action.
- You ONLY discuss: this drill/simulation, disaster safety and preparedness (fire, earthquake, gas leak, etc.), and NDMA/NFPA/NDRF protocols. You have no other knowledge to offer here.
- If the student asks anything outside that scope (general knowledge, news, people, opinions, coding, etc.), refuse in a SINGLE short sentence (e.g. "I only help with safety and this drill.") and stop there - no explanation, no restating the topic, no follow-up offer. Never supply the requested off-topic information in any form.
- Never claim to know their real GPS location or to have dispatched real responders - always be clear this is a training simulation, not a real emergency channel."""


def _format_context(context: MitraContext | None) -> str:
    if context is None:
        return "[DRILL STATE]\nNo drill state available."

    lines = ["[DRILL STATE]", f"Phase: {context.phase}"]

    if context.scenario:
        s = context.scenario
        lines.append(f"Scenario: {s.name} ({s.hazardLabel}) — {s.brief}")

    if context.gameState:
        gs = context.gameState
        lines.append(
            f"Status: {gs.status} | Elapsed: {gs.time}s | Oxygen: {gs.oxygen}% | Panic: {gs.panic}% | "
            f"Crouching: {'yes' if gs.crouching else 'no'} | Box-breathing: {'yes' if gs.breathing else 'no'} | "
            f"Score: {gs.score}"
        )
    else:
        lines.append("Drill has not started yet.")

    return "\n".join(lines)


@router.post(
    "/mitra/chat",
    response_model=MitraChatResponse,
    tags=["mitra"],
    summary="Mitra crisis-companion chat",
)
async def mitra_chat(body: MitraChatRequest) -> MitraChatResponse:
    if not settings.GEMINI_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="Mitra isn't configured yet — missing GEMINI_API_KEY on the server.",
        )

    message = body.message.strip()
    if not message:
        raise HTTPException(status_code=400, detail="message is required")

    history = body.history[-8:]
    context_block = _format_context(body.context)

    contents = [
        {"role": "user" if turn.role == "user" else "model", "parts": [{"text": turn.text}]}
        for turn in history
    ]
    contents.append({"role": "user", "parts": [{"text": f"{context_block}\n\nStudent: {message}"}]})

    payload = {
        "systemInstruction": {"role": "system", "parts": [{"text": SYSTEM_PROMPT}]},
        "contents": contents,
        "generationConfig": {
            "temperature": 0.6,
            "maxOutputTokens": 1024,
            "thinkingConfig": {"thinkingLevel": "low"},
        },
    }

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            res = await client.post(GEMINI_URL, params={"key": settings.GEMINI_API_KEY}, json=payload)
    except httpx.HTTPError as exc:
        logger.error("Mitra/Gemini request failed: %s", exc)
        raise HTTPException(status_code=502, detail="Mitra is temporarily unreachable.") from exc

    try:
        data = res.json()
    except ValueError as exc:
        logger.error("Mitra/Gemini returned invalid JSON: %s", res.text[:200])
        raise HTTPException(status_code=502, detail="Mitra is temporarily unreachable.") from exc

    candidates = data.get("candidates") or []
    parts = candidates[0].get("content", {}).get("parts", []) if candidates else []
    text = "".join(p.get("text", "") for p in parts).strip()

    if not text:
        raise HTTPException(status_code=502, detail="Mitra couldn't form a response — try again.")

    return MitraChatResponse(text=text)
