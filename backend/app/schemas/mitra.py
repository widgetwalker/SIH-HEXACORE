"""
Pydantic schemas for the Mitra crisis-companion chat endpoint.

Mirrors the request/response shape the frontend already sends/expects
(originally defined inline in frontend/src/app/api/mitra/route.ts, before
that route was replaced by this backend endpoint).
"""

from __future__ import annotations

from typing import List, Literal, Optional

from pydantic import BaseModel


class MitraTurn(BaseModel):
    role: Literal["user", "mitra"]
    text: str


class MitraGameState(BaseModel):
    status: Literal["running", "won", "lost"]
    time: float
    oxygen: float
    panic: float
    crouching: bool
    breathing: bool
    score: int


class MitraScenario(BaseModel):
    name: str
    hazardLabel: str
    brief: str


class MitraContext(BaseModel):
    phase: Literal["briefing", "running", "ended"]
    scenario: Optional[MitraScenario] = None
    gameState: Optional[MitraGameState] = None


class MitraChatRequest(BaseModel):
    message: str
    history: List[MitraTurn] = []
    context: Optional[MitraContext] = None


class MitraChatResponse(BaseModel):
    text: str
