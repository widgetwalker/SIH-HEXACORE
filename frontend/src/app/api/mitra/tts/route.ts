import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";

export const runtime = "nodejs";

const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000").replace(/\/$/, "");

async function synthesizeEdgeTTS(text: string, lang = "en-in"): Promise<Buffer | null> {
  try {
    const { EdgeTTS } = await import("node-edge-tts");
    const voice = lang.toLowerCase().includes("in") ? "en-IN-NeerjaNeural" : "en-US-JennyNeural";
    const tts = new EdgeTTS({
      voice,
      lang: lang.toLowerCase().includes("in") ? "en-IN" : "en-US",
      outputFormat: "audio-24khz-96kbitrate-mono-mp3",
      timeout: 8000,
    });
    const filename = `neerja_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.mp3`;
    const tmpPath = path.join(os.tmpdir(), filename);
    await tts.ttsPromise(text, tmpPath);
    const buffer = fs.readFileSync(tmpPath);
    try {
      fs.unlinkSync(tmpPath);
    } catch {
      /* ignore */
    }
    return buffer;
  } catch (err) {
    console.warn("Direct node-edge-tts synthesis warning:", err);
    return null;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const text = (searchParams.get("text") || "Attention cadet.").slice(0, 1000);
  const lang = searchParams.get("lang") || "en-in";

  // 1. Primary: Direct Microsoft Neural TTS (en-IN-NeerjaNeural studio female voice)
  const edgeBuffer = await synthesizeEdgeTTS(text, lang);
  if (edgeBuffer && edgeBuffer.length > 512) {
    return new NextResponse(new Uint8Array(edgeBuffer), {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": 'inline; filename="mitra_neerja.mp3"',
        "Cache-Control": "public, max-age=3600",
      },
    });
  }

  // 2. Secondary: Fallback to backend TTS if running
  try {
    const backendRes = await fetch(
      `${BACKEND_URL}/api/v1/mitra/tts?text=${encodeURIComponent(text)}&lang=${encodeURIComponent(lang)}`,
      { method: "GET", cache: "force-cache" }
    );
    if (backendRes.ok) {
      const audioBuffer = await backendRes.arrayBuffer();
      const contentType = backendRes.headers.get("content-type") || "audio/mpeg";
      return new NextResponse(audioBuffer, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Content-Disposition": 'inline; filename="mitra_speech.mp3"',
          "Cache-Control": "public, max-age=3600",
        },
      });
    }
  } catch {
    /* ignore */
  }

  return new NextResponse("TTS Service unavailable", { status: 503 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const text = (body.text || "Attention cadet.").slice(0, 1000);
    const lang = body.lang || "en-in";

    const edgeBuffer = await synthesizeEdgeTTS(text, lang);
    if (edgeBuffer && edgeBuffer.length > 512) {
      return new NextResponse(new Uint8Array(edgeBuffer), {
        status: 200,
        headers: {
          "Content-Type": "audio/mpeg",
          "Content-Disposition": 'inline; filename="mitra_neerja.mp3"',
          "Cache-Control": "public, max-age=3600",
        },
      });
    }

    const backendRes = await fetch(`${BACKEND_URL}/api/v1/mitra/tts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, lang }),
    });

    if (backendRes.ok) {
      const audioBuffer = await backendRes.arrayBuffer();
      const contentType = backendRes.headers.get("content-type") || "audio/mpeg";
      return new NextResponse(audioBuffer, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Content-Disposition": 'inline; filename="mitra_speech.mp3"',
          "Cache-Control": "public, max-age=3600",
        },
      });
    }

    return new NextResponse("Backend TTS generation failed", { status: 502 });
  } catch (err) {
    console.error("Next.js POST /api/mitra/tts error:", err);
    return new NextResponse("TTS Service unavailable", { status: 503 });
  }
}
