import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const GEMINI_MODEL = "gemini-1.5-flash";

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

/* ── Local rule-based Mitra (no API key needed) ── */
function localMitraReply(message: string, context?: MitraContext): string {
  const q = message.toLowerCase();

  /* Emergency state responses */
  if (context?.gameState) {
    const gs = context.gameState;
    if (gs.oxygen < 25) return "Oxygen is critical — crouch low and move toward the nearest exit now.";
    if (gs.panic > 75) return "Hold B to box-breathe: 4 seconds in, 4 hold, 4 out. Stay calm.";
    if (gs.oxygen < 40) return "The smoke is thick — crouch down with SHIFT and keep moving.";
    if (gs.panic > 50) return "You're panicking. Stop, hold B for box-breathing, then continue.";
  }

  /* Earthquake */
  if (q.includes("earthquake") || q.includes("quake") || q.includes("shake") || q.includes("tremor")) {
    if (q.includes("after") || q.includes("stop")) return "After shaking stops: check for injuries, move to open ground, avoid damaged buildings.";
    return "Drop, Cover, and Hold On under a sturdy table. Protect your head and neck.";
  }

  /* Fire */
  if (q.includes("fire") || q.includes("smoke") || q.includes("burn")) {
    if (q.includes("smoke")) return "Stay low where the air is clearer. Crawl to the nearest exit.";
    if (q.includes("door")) return "Feel the door with the back of your hand. If it's hot, find another way out.";
    return "Get low, cover your mouth, and crawl to the nearest exit. Never use elevators.";
  }

  /* Flood */
  if (q.includes("flood") || q.includes("water") || q.includes("rain")) {
    if (q.includes("inside") || q.includes("stay")) return "Move to the highest floor. Never go into floodwater — 6 inches can knock you down.";
    return "Move to higher ground immediately. Avoid walking or driving through floodwater.";
  }

  /* Cyclone / storm */
  if (q.includes("cyclone") || q.includes("storm") || q.includes("wind") || q.includes("hurricane")) {
    return "Get to an interior room with no windows. Stay away from glass and exterior walls.";
  }

  /* Gas leak */
  if (q.includes("gas") || q.includes("leak") || q.includes("smell")) {
    return "Do NOT turn on lights or use matches. Open windows, evacuate, and call emergency services.";
  }

  /* Chemical spill */
  if (q.includes("chemical") || q.includes("spill") || q.includes("toxic")) {
    return "Move upwind and uphill. Remove contaminated clothing. Do not touch the substance.";
  }

  /* Evacuation */
  if (q.includes("exit") || q.includes("evacuate") || q.includes("escape") || q.includes("leave")) {
    return "Follow the nearest marked exit. Use stairs, never elevators. Stay low if there's smoke.";
  }

  /* Assembly point */
  if (q.includes("assembly") || q.includes("meeting") || q.includes("rally")) {
    return "Go to your designated assembly point. Do a headcount and report to the coordinator.";
  }

  /* Help / what to do */
  if (q.includes("help") || q.includes("what") || q.includes("do")) {
    return "Stay calm. Follow your drill plan. If you're unsure, crouch low and move toward the nearest exit.";
  }

  /* Greetings */
  if (q.includes("hello") || q.includes("hi") || q.includes("hey")) {
    return "Hey! I'm Mitra, your safety buddy. Ask me about earthquakes, fires, floods, or any drill question.";
  }

  /* Default */
  return "I'm Mitra — I help with disaster safety. Ask me about fire, earthquake, flood, cyclone, gas leak, or evacuation.";
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;

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

  /* ── Local fallback: rule-based Mitra when no API key is set ── */
  if (!apiKey) {
    const reply = localMitraReply(message, body.context);
    return NextResponse.json({ text: reply });
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
