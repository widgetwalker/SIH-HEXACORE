import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const GEMINI_MODEL = "gemini-3.6-flash";

const SYSTEM_PROMPT = `You are "Mitra" (Hindi for "friend"), an AI crisis companion embedded in a disaster-preparedness training simulator used by Indian school and college students. You are grounded in NDMA, NFPA, and NDRF safety protocols.

You are supporting a student inside a live evacuation DRILL SIMULATION (a training game, not a real emergency). You will be given the current drill state before each message — use it to ground your answers:
- Doors act as firebreaks until a student pushes through them.
- Holding SHIFT makes the student crouch/crawl, which slows oxygen loss under smoke.
- Holding B triggers box-breathing (4s in, 4s hold, 4s out), which lowers panic.

Rules:
- Keep every reply as SHORT as possible: normally just 1 sentence, 2 only if genuinely needed. Plain text, no markdown, no lists, no headers — this renders inside a small chat panel and every extra word costs real money, so never pad or repeat yourself.
- Tone: calm, direct, authoritative, never alarmist.
- Always ground advice in the live numbers you're given (oxygen %, panic %, elapsed time, crouching/breathing state) when they're relevant.
- If oxygen or panic is critical, give exactly ONE clear next action.
- You ONLY discuss: this drill/simulation, disaster safety and preparedness (fire, earthquake, gas leak, etc.), and NDMA/NFPA/NDRF protocols. You have no other knowledge to offer here.
- If the student asks anything outside that scope (general knowledge, news, people, opinions, coding, etc.), refuse in a SINGLE short sentence (e.g. "I only help with safety and this drill.") and stop there — no explanation, no restating the topic, no follow-up offer. Never supply the requested off-topic information in any form.
- Never claim to know their real GPS location or to have dispatched real responders — always be clear this is a training simulation, not a real emergency channel.`;

interface MitraTurn {
  role: "user" | "mitra";
  text: string;
}

interface MitraGameState {
  status: "running" | "won" | "lost";
  time: number;
  oxygen: number;
  panic: number;
  crouching: boolean;
  breathing: boolean;
  score: number;
}

interface MitraContext {
  phase: "briefing" | "running" | "ended";
  scenario?: { name: string; hazardLabel: string; brief: string };
  gameState?: MitraGameState | null;
}

function formatContext(context: MitraContext | undefined): string {
  if (!context) return "[DRILL STATE]\nNo drill state available.";

  const lines = [`[DRILL STATE]`, `Phase: ${context.phase}`];

  if (context.scenario) {
    lines.push(`Scenario: ${context.scenario.name} (${context.scenario.hazardLabel}) — ${context.scenario.brief}`);
  }

  if (context.gameState) {
    const gs = context.gameState;
    lines.push(
      `Status: ${gs.status} | Elapsed: ${gs.time}s | Oxygen: ${gs.oxygen}% | Panic: ${gs.panic}% | Crouching: ${gs.crouching ? "yes" : "no"} | Box-breathing: ${gs.breathing ? "yes" : "no"} | Score: ${gs.score}`
    );
  } else {
    lines.push("Drill has not started yet.");
  }

  return lines.join("\n");
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Mitra isn't configured yet — missing GEMINI_API_KEY on the server." },
      { status: 500 }
    );
  }

  let body: { message?: string; history?: MitraTurn[]; context?: MitraContext };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const message = body.message?.trim();
  if (!message) {
    return NextResponse.json({ error: "message is required" }, { status: 400 });
  }

  const history = Array.isArray(body.history) ? body.history.slice(-8) : [];
  const contextBlock = formatContext(body.context);

  const contents = [
    ...history.map((turn) => ({
      role: turn.role === "user" ? "user" : "model",
      parts: [{ text: turn.text }],
    })),
    { role: "user", parts: [{ text: `${contextBlock}\n\nStudent: ${message}` }] },
  ];

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { role: "system", parts: [{ text: SYSTEM_PROMPT }] },
          contents,
          generationConfig: {
            temperature: 0.6,
            maxOutputTokens: 1024,
            thinkingConfig: { thinkingLevel: "low" },
          },
        }),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("Mitra/Gemini error:", res.status, errText);
      return NextResponse.json({ error: "Mitra is temporarily unreachable." }, { status: 502 });
    }

    const data = await res.json();
    const text: string | undefined = data?.candidates?.[0]?.content?.parts
      ?.map((p: { text?: string }) => p.text ?? "")
      .join("")
      .trim();

    if (!text) {
      return NextResponse.json({ error: "Mitra couldn't form a response — try again." }, { status: 502 });
    }

    return NextResponse.json({ text });
  } catch (err) {
    console.error("Mitra route error:", err);
    return NextResponse.json({ error: "Mitra is temporarily unreachable." }, { status: 502 });
  }
}
