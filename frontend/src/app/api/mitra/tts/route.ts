import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000").replace(/\/$/, "");

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get("text") || "Attention cadet.";
  const lang = searchParams.get("lang") || "en-in";

  try {
    const backendRes = await fetch(`${BACKEND_URL}/api/v1/mitra/tts?text=${encodeURIComponent(text)}&lang=${encodeURIComponent(lang)}`, {
      method: "GET",
      cache: "force-cache",
    });

    if (!backendRes.ok) {
      return new NextResponse("Backend TTS generation failed", { status: backendRes.status });
    }

    const audioBuffer = await backendRes.arrayBuffer();
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/wav",
        "Content-Disposition": 'inline; filename="mitra_speech.wav"',
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err) {
    console.error("Next.js /api/mitra/tts proxy error:", err);
    return new NextResponse("TTS Service unavailable", { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const text = body.text || "Attention cadet.";
    const lang = body.lang || "en-in";

    const backendRes = await fetch(`${BACKEND_URL}/api/v1/mitra/tts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, lang }),
    });

    if (!backendRes.ok) {
      return new NextResponse("Backend TTS generation failed", { status: backendRes.status });
    }

    const audioBuffer = await backendRes.arrayBuffer();
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/wav",
        "Content-Disposition": 'inline; filename="mitra_speech.wav"',
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err) {
    console.error("Next.js POST /api/mitra/tts proxy error:", err);
    return new NextResponse("TTS Service unavailable", { status: 503 });
  }
}
