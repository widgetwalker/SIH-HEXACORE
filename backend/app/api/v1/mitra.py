"""
Mitra crisis-companion chat endpoint.

The Gemini key lives once on the backend. When GEMINI_API_KEY is set, Mitra
uses Gemini for smart contextual replies. When it's not set, a local
rule-based fallback kicks in so the entire app works out of the box — no
key, no external API, no errors.
"""

from __future__ import annotations

import asyncio
import io
import logging
import math
import re
import shutil
import struct
import wave

import httpx
from fastapi import APIRouter, HTTPException, Query, Response
from pydantic import BaseModel, Field

from app.core.config import settings
from app.schemas.mitra import MitraChatRequest, MitraChatResponse, MitraContext

logger = logging.getLogger(__name__)

router = APIRouter()

class MitraTTSRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=1000, description="Text to synthesize to speech audio")
    lang: str = Field("en-in", description="Voice language/accent code (e.g. en-in, en)")

GEMINI_MODEL = "gemini-1.5-flash"
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


# ── Local rule-based fallback (no API key needed) ──────────────────────

_LOCAL_RULES: list[tuple[list[str], str]] = [
    # Emergency state — checked first if context has live game state
    (["oxygen", "critical"], "Oxygen is critical — crouch low and move toward the nearest exit now."),
    (["panic", "high"], "You're panicking. Stop, hold B for box-breathing, then continue."),
    (["oxygen", "low"], "The smoke is thick — crouch down with SHIFT and keep moving."),
    (["panic", "check"], "Take a breath. Hold B for box-breathing: 4s in, 4 hold, 4 out."),

    # Earthquake
    (["earthquake", "after"], "After shaking stops: check for injuries, move to open ground, avoid damaged buildings."),
    (["earthquake"], "Drop, Cover, and Hold On under a sturdy table. Protect your head and neck."),

    # Fire
    (["fire", "smoke"], "Stay low where the air is clearer. Crawl to the nearest exit."),
    (["fire", "door"], "Feel the door with the back of your hand. If it's hot, find another way out."),
    (["fire"], "Get low, cover your mouth, and crawl to the nearest exit. Never use elevators."),

    # Flood
    (["flood", "stay"], "Move to the highest floor. Never go into floodwater — 6 inches can knock you down."),
    (["flood"], "Move to higher ground immediately. Avoid walking or driving through floodwater."),

    # Cyclone / storm
    (["cyclone"], "Get to an interior room with no windows. Stay away from glass and exterior walls."),
    (["storm"], "Get to an interior room with no windows. Stay away from glass and exterior walls."),

    # Gas leak
    (["gas"], "Do NOT turn on lights or use matches. Open windows, evacuate, and call emergency services."),

    # Chemical spill
    (["chemical"], "Move upwind and uphill. Remove contaminated clothing. Do not touch the substance."),

    # Evacuation
    (["exit"], "Follow the nearest marked exit. Use stairs, never elevators. Stay low if there's smoke."),
    (["evacuate"], "Follow the nearest marked exit. Use stairs, never elevators. Stay low if there's smoke."),

    # Assembly
    (["assembly"], "Go to your designated assembly point. Do a headcount and report to the coordinator."),

    # Greetings
    (["hello"], "Hey! I'm Mitra, your safety buddy. Ask me about earthquakes, fires, floods, or any drill question."),
    (["hi"], "Hey! I'm Mitra, your safety buddy. Ask me about earthquakes, fires, floods, or any drill question."),
]


def _local_reply(message: str, context: MitraContext | None) -> str:
    """Return a local rule-based reply when no Gemini key is available."""
    q = message.lower()

    # Check live drill state first
    if context and context.gameState:
        gs = context.gameState
        if gs.oxygen < 25:
            return "Oxygen is critical — crouch low and move toward the nearest exit now."
        if gs.panic > 75:
            return "Hold B to box-breathe: 4 seconds in, 4 hold, 4 out. Stay calm."
        if gs.oxygen < 40:
            return "The smoke is thick — crouch down with SHIFT and keep moving."
        if gs.panic > 50:
            return "You're panicking. Stop, hold B for box-breathing, then continue."

    # Match keywords against rules
    for keywords, reply in _LOCAL_RULES:
        if all(k in q for k in keywords):
            return reply

    return "I'm Mitra — I help with disaster safety. Ask me about fire, earthquake, flood, cyclone, gas leak, or evacuation."


@router.post(
    "/mitra/chat",
    response_model=MitraChatResponse,
    tags=["mitra"],
    summary="Mitra crisis-companion chat",
)
async def mitra_chat(body: MitraChatRequest) -> MitraChatResponse:
    message = body.message.strip()
    if not message:
        raise HTTPException(status_code=400, detail="message is required")

    # ── Local fallback when no API key is configured ──
    if not settings.GEMINI_API_KEY:
        text = _local_reply(message, body.context)
        return MitraChatResponse(text=text)

    # ── Gemini API path ──
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


def _synthesize_fallback_chime(duration_s: float = 0.5, freq: float = 660.0) -> bytes:
    """Generate a clean 16-bit PCM WAV audio chime if OS speech synthesizer is unavailable."""
    sample_rate = 22050
    n_samples = int(sample_rate * duration_s)
    buf = io.BytesIO()
    with wave.open(buf, "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sample_rate)
        data = bytearray()
        for i in range(n_samples):
            t = i / sample_rate
            # 2-tone melodic chime: 660Hz -> 880Hz
            f = freq if t < 0.2 else freq * 1.333
            val = int(18000.0 * math.sin(2.0 * math.pi * f * t) * (1.0 - i / n_samples))
            data.extend(struct.pack("<h", max(-32767, min(32767, val))))
        wf.writeframes(data)
    return buf.getvalue()


async def _generate_tts_wav(text: str, lang: str = "en-in") -> bytes:
    """Synthesize speech audio into WAV format using espeak-ng/espeak, or fallback to chime."""
    tts_bin = shutil.which("espeak-ng") or shutil.which("espeak")
    safe_text = re.sub(r"[\r\n\t]+", " ", text).strip()[:500]
    if not safe_text:
        safe_text = "Attention cadet."

    if tts_bin:
        try:
            voice = "en-in" if "in" in lang.lower() else "en"
            cmd = [tts_bin, "--stdout", "-v", voice, "-s", "150", "-p", "50", safe_text]
            proc = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
            )
            stdout, _ = await asyncio.wait_for(proc.communicate(), timeout=6.0)
            if proc.returncode == 0 and len(stdout) > 44:
                return stdout
        except Exception as exc:
            logger.warning("espeak TTS generation error: %s; using fallback chime", exc)

    return _synthesize_fallback_chime()


@router.get(
    "/mitra/tts",
    summary="Mitra TTS audio synthesis (WAV stream)",
    tags=["mitra"],
    responses={200: {"content": {"audio/wav": {}}}},
)
async def get_mitra_tts(
    text: str = Query(..., min_length=1, max_length=1000, description="Text to synthesize to speech audio"),
    lang: str = Query("en-in", description="Voice language code (e.g. en-in, en)"),
) -> Response:
    """Convert text directly into a playable WAV audio stream for clients without native speech synthesis."""
    audio_bytes = await _generate_tts_wav(text, lang)
    return Response(
        content=audio_bytes,
        media_type="audio/wav",
        headers={
            "Content-Disposition": "inline; filename=mitra_speech.wav",
            "Cache-Control": "public, max-age=3600",
        },
    )


@router.post(
    "/mitra/tts",
    summary="Mitra TTS audio synthesis via POST",
    tags=["mitra"],
    responses={200: {"content": {"audio/wav": {}}}},
)
async def post_mitra_tts(body: MitraTTSRequest) -> Response:
    """Convert text into a playable WAV audio stream via JSON body."""
    audio_bytes = await _generate_tts_wav(body.text, body.lang)
    return Response(
        content=audio_bytes,
        media_type="audio/wav",
        headers={
            "Content-Disposition": "inline; filename=mitra_speech.wav",
            "Cache-Control": "public, max-age=3600",
        },
    )

