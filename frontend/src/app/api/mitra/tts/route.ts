import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";
import dns from "dns";

if (typeof dns.setDefaultResultOrder === "function") {
  dns.setDefaultResultOrder("ipv4first");
}

export const runtime = "nodejs";

const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000").replace(/\/$/, "");

/**
 * Try Microsoft Neural TTS via node-edge-tts.
 * Hard 4-second timeout — if it can't finish in time, return null so the backend fallback kicks in.
 */
async function synthesizeEdgeTTS(text: string, lang = "en-in"): Promise<Buffer | null> {
  try {
    const { EdgeTTS } = await import("node-edge-tts");
    const voice = lang.toLowerCase().includes("in") ? "en-IN-NeerjaNeural" : "en-US-JennyNeural";
    const tts = new EdgeTTS({
      voice,
      lang: lang.toLowerCase().includes("in") ? "en-IN" : "en-US",
      outputFormat: "audio-24khz-96kbitrate-mono-mp3",
      timeout: 4000,
    });
    const filename = `neerja_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.mp3`;
    const tmpPath = path.join(os.tmpdir(), filename);

    // Race against a 4-second hard deadline
    const result = await Promise.race([
      tts.ttsPromise(text, tmpPath).then(() => "ok" as const),
      new Promise<"timeout">((resolve) => setTimeout(() => resolve("timeout"), 4000)),
    ]);

    if (result === "timeout") {
      console.warn("[TTS] Edge TTS timed out at 4s, falling back to backend");
      try { fs.unlinkSync(tmpPath); } catch { /* ignore */ }
      return null;
    }

    const buffer = fs.readFileSync(tmpPath);
    try { fs.unlinkSync(tmpPath); } catch { /* ignore */ }
    return buffer.length > 512 ? buffer : null;
  } catch (err) {
    console.warn("[TTS] Edge TTS synthesis failed:", err);
    return null;
  }
}

/**
 * Fetch TTS audio from the Python backend (edge-tts or chime fallback).
 * 5-second timeout via AbortController. No caching.
 */
async function fetchBackendTTS(text: string, lang: string, method: "GET" | "POST" = "GET"): Promise<NextResponse | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);

    let res: Response;
    if (method === "POST") {
      res = await fetch(`${BACKEND_URL}/api/v1/mitra/tts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, lang }),
        signal: controller.signal,
        cache: "no-store",
      });
    } else {
      res = await fetch(
        `${BACKEND_URL}/api/v1/mitra/tts?text=${encodeURIComponent(text)}&lang=${encodeURIComponent(lang)}`,
        { method: "GET", signal: controller.signal, cache: "no-store" }
      );
    }

    clearTimeout(timer);

    if (res.ok) {
      const audioBuffer = await res.arrayBuffer();
      if (audioBuffer.byteLength > 256) {
        const contentType = res.headers.get("content-type") || "audio/mpeg";
        return new NextResponse(audioBuffer, {
          status: 200,
          headers: {
            "Content-Type": contentType,
            "Content-Disposition": 'inline; filename="mitra_speech.mp3"',
            "Cache-Control": "public, max-age=3600",
          },
        });
      }
    }
  } catch (err) {
    console.warn("[TTS] Backend fallback failed:", err);
  }
  return null;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const text = (searchParams.get("text") || "Attention cadet.").slice(0, 1000);
  const lang = searchParams.get("lang") || "en-in";

  // 1. Primary: Microsoft Neural TTS (4s timeout)
  const edgeBuffer = await synthesizeEdgeTTS(text, lang);
  if (edgeBuffer) {
    return new NextResponse(new Uint8Array(edgeBuffer), {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": 'inline; filename="mitra_neerja.mp3"',
        "Cache-Control": "public, max-age=3600",
      },
    });
  }

  // 2. Fallback: Backend Python TTS (5s timeout, no-store cache)
  const backendResponse = await fetchBackendTTS(text, lang, "GET");
  if (backendResponse) return backendResponse;

  return new NextResponse("TTS Service unavailable", { status: 503 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const text = (body.text || "Attention cadet.").slice(0, 1000);
    const lang = body.lang || "en-in";

    // 1. Primary: Microsoft Neural TTS (4s timeout)
    const edgeBuffer = await synthesizeEdgeTTS(text, lang);
    if (edgeBuffer) {
      return new NextResponse(new Uint8Array(edgeBuffer), {
        status: 200,
        headers: {
          "Content-Type": "audio/mpeg",
          "Content-Disposition": 'inline; filename="mitra_neerja.mp3"',
          "Cache-Control": "public, max-age=3600",
        },
      });
    }

    // 2. Fallback: Backend Python TTS (5s timeout, no-store cache)
    const backendResponse = await fetchBackendTTS(text, lang, "POST");
    if (backendResponse) return backendResponse;

    return new NextResponse("Backend TTS generation failed", { status: 502 });
  } catch (err) {
    console.error("[TTS] POST /api/mitra/tts error:", err);
    return new NextResponse("TTS Service unavailable", { status: 503 });
  }
}
