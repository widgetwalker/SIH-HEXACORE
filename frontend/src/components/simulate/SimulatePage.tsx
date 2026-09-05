"use client";

import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { SCENARIOS } from "./game/floorplan";
import { generateDebrief, saveRun, fmtTime, type DebriefLine, type RunTelemetry } from "./game/telemetry";
import type { GameState } from "./game/EvacuationGame";
import { LEARN_SCENARIOS } from "@/components/learn/tiergame/content/simScenarios";

const ScenarioEffects = dynamic(
  () => import("./game/ScenarioEffects"),
  { ssr: false }
);

import styles from "./SimulatePage.module.css";

const BUBBLE_TONE_CLASS = {
  warn: "mitraBubbleWarn",
  good: "mitraBubbleGood",
  info: "mitraBubbleInfo",
} as const;

/* Mitra now lives on the FastAPI backend (POST /api/v1/mitra/chat) so the
   Gemini key only has to exist on whoever runs that server, not in every
   developer's own frontend/.env.local. Override via NEXT_PUBLIC_BACKEND_URL
   if the backend isn't on the default local port. */
const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000").replace(/\/$/, "");

const EvacuationGame = dynamic(() => import("./game/EvacuationGame"), { ssr: false });

type Phase = "briefing" | "running" | "ended";

/* Mitra: deterministic opening line, seeded from real game state before the AI takes over */
function getMitraTip(gs: GameState | null): string {
  if (!gs) return "I'm tracking your route. Amber doorways block fire & smoke until you push through them.";
  if (gs.status === "won") return "Clean evacuation logged ✓ Your run is on the command analytics dashboard.";
  if (gs.status === "lost") return "Run logged. Check your debrief - smoke exposure and panic are the usual killers.";
  if (gs.panic > 70) return "Panic spiking! Stop and hold B - box-breathe: 4s in, 4s hold, 4s out.";
  if (gs.breathing) return "Good. Move again once panic drops below 40.";
  if (gs.oxygen < 35 && !gs.crouching) return "Oxygen critical. Crawl (SHIFT) straight to the nearest beacon - no detours.";
  if (gs.crouching) return "Smart crawling. Doorways slow the spread - use them as firebreaks.";
  if (gs.time > 60) return "Fire doubles roughly every minute. Commit to an exit and go.";
  return "Stay low, keep moving. I'm tracking your route and logging every decision. Ask me anything.";
}

interface MitraTurn {
  role: "user" | "mitra";
  text: string;
}

interface MitraBubble {
  text: string;
  tone: "warn" | "good" | "info";
}

const GOOD_LINES = [
  "Nice — you're getting closer!",
  "Good instincts, keep going!",
  "That's the way — you're doing great!",
];

function dirText(dir: GameState["guideDir"]): string {
  switch (dir) {
    case "forward": return "forward";
    case "back": return "back the way you came";
    case "left": return "left";
    case "right": return "right";
    default: return "toward the beacon";
  }
}

export default function SimulatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const learnModuleId = searchParams.get("learnModule");
  const learnScenario = learnModuleId ? LEARN_SCENARIOS[learnModuleId] : undefined;

  const [phase, setPhase] = useState<Phase>("briefing");
  const [runId, setRunId] = useState(0);
  const [selIdx, setSelIdx] = useState(0);
  const [gs, setGs] = useState<GameState | null>(null);
  const [debrief, setDebrief] = useState<DebriefLine[] | null>(null);
  const [lastRun, setLastRun] = useState<RunTelemetry | null>(null);
  const [mitraOpen, setMitraOpen] = useState(false);
  const [mitraMessages, setMitraMessages] = useState<MitraTurn[]>([]);
  const [mitraInput, setMitraInput] = useState("");
  const [mitraLoading, setMitraLoading] = useState(false);
  const [mitraBubble, setMitraBubble] = useState<MitraBubble | null>(null);
  const mitraPanelRef = useRef<HTMLDivElement>(null);
  const mitraLogRef = useRef<HTMLDivElement>(null);
  const lastDistRef = useRef<number | null>(null);
  const nextBubbleAtRef = useRef(0);
  const lastUrgentAtRef = useRef(0);
  const bubbleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const goodLineIdxRef = useRef(0);
  const scenario = learnScenario ?? SCENARIOS[selIdx];

  useEffect(() => {
    return () => {
      if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
    };
  }, []);

  /* ── Mitra voice — Web Speech API (doc 08 §7, Frontend Dev 2 task 3) ── */
  const [voiceOn, setVoiceOn] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [speechSupported, setSpeechSupported] = useState({ tts: false, stt: false });
  const recognitionRef = useRef<InstanceType<NonNullable<typeof window.SpeechRecognition>> | null>(null);
  const lastSpokenRef = useRef("");
  // SpeechRecognition's onresult closure is set once per toggleListening()
  // call and can fire well after gs has moved on - a ref kept in sync with
  // the latest gs lets that handler read the current value instead of the
  // one captured when listening started.
  const gsRef = useRef<GameState | null>(null);
  useEffect(() => {
    gsRef.current = gs;
  }, [gs]);

  useEffect(() => {
    setSpeechSupported({
      tts: typeof window !== "undefined" && "speechSynthesis" in window,
      stt: typeof window !== "undefined" && !!(window.SpeechRecognition || window.webkitSpeechRecognition),
    });
  }, []);

  // Recognition keeps running (and its onend/onerror keep firing setState)
  // after navigating away unless explicitly stopped; detach the handlers
  // first so a stop-triggered onend can't touch state post-unmount.
  useEffect(() => {
    return () => {
      const rec = recognitionRef.current;
      if (rec) {
        rec.onresult = null;
        rec.onerror = null;
        rec.onend = null;
        rec.stop();
      }
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = (text: string) => {
    if (!("speechSynthesis" in window) || !text) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1.02;
    utter.pitch = 1.0;
    window.speechSynthesis.speak(utter);
  };

  const sendMitra = async (raw: string) => {
    const text = raw.trim();
    if (!text || mitraLoading) return;
    const history = [...mitraMessages, { role: "user" as const, text }];
    setMitraMessages(history);
    setMitraInput("");
    setMitraLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/mitra/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: history.slice(0, -1),
          context: {
            phase,
            scenario: { name: scenario.name, hazardLabel: scenario.hazardLabel, brief: scenario.brief },
            gameState: gs
              ? {
                  status: gs.status,
                  time: Math.round(gs.time),
                  oxygen: Math.round(gs.oxygen),
                  panic: Math.round(gs.panic),
                  crouching: gs.crouching,
                  breathing: gs.breathing,
                  score: gs.score,
                }
              : null,
          },
        }),
      });
      const data = await res.json();
      const replyText: string = res.ok ? data.text : data.error ?? "Mitra is offline right now.";
      setMitraMessages((m) => [...m, { role: "mitra", text: replyText }]);
      if (voiceOn) speak(replyText);
    } catch {
      const failText = "Connection lost — try again once you're back online.";
      setMitraMessages((m) => [...m, { role: "mitra", text: failText }]);
      if (voiceOn) speak(failText);
    } finally {
      setMitraLoading(false);
    }
  };

  const toggleListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }
    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = "en-IN";
    rec.onresult = (e: SpeechRecognitionEvent) => {
      const text = Array.from(e.results)
        .map((r) => r[0].transcript)
        .join(" ");
      setTranscript(text);
      const last = e.results[e.results.length - 1];
      if (last.isFinal) {
        const lower = text.toLowerCase();
        if (/help|status|repeat|mitra/.test(lower)) {
          speak(getMitraTip(gsRef.current));
        } else {
          setMitraInput(text);
          sendMitra(text);
        }
      }
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recognitionRef.current = rec;
    rec.start();
    setListening(true);
    setTranscript("");
  };

  useEffect(() => {
    if (!mitraPanelRef.current) return;
    const el = mitraPanelRef.current;
    if (mitraOpen) {
      gsap.fromTo(el, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" });
    } else {
      gsap.to(el, { opacity: 0, duration: 0.2, ease: "power2.in" });
    }
  }, [mitraOpen]);

  useEffect(() => {
    if (mitraLogRef.current) {
      mitraLogRef.current.scrollTop = mitraLogRef.current.scrollHeight;
    }
  }, [mitraMessages, mitraLoading]);

  const openMitra = () => {
    setMitraOpen((open) => {
      const next = !open;
      if (next) {
        setMitraBubble(null);
        if (mitraMessages.length === 0) {
          setMitraMessages([{ role: "mitra", text: getMitraTip(gs) }]);
        }
      }
      return next;
    });
  };

  const showBubble = (text: string, tone: MitraBubble["tone"]) => {
    setMitraBubble({ text, tone });
    if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
    bubbleTimerRef.current = setTimeout(() => setMitraBubble(null), 4500);
  };

  /* proactive live coaching — direction + urgent nudges, floated above the Mitra icon */
  const updateBubble = (s: GameState) => {
    const now = Date.now();

    if (s.panic > 75 && !s.breathing && now - lastUrgentAtRef.current > 6000) {
      lastUrgentAtRef.current = now;
      showBubble("Panic spiking — hold B to box-breathe!", "warn");
      return;
    }
    if (s.oxygen < 25 && !s.crouching && now - lastUrgentAtRef.current > 6000) {
      lastUrgentAtRef.current = now;
      showBubble("Oxygen critical — crawl (SHIFT) to the beacon!", "warn");
      return;
    }

    if (now < nextBubbleAtRef.current) return;

    const prevDist = lastDistRef.current;
    lastDistRef.current = s.distToExit;
    if (prevDist == null || s.distToExit < 0) return;

    if (s.distToExit > prevDist) {
      nextBubbleAtRef.current = now + 3500;
      showBubble(`Wrong way — head ${dirText(s.guideDir)}.`, "warn");
    } else if (s.distToExit < prevDist) {
      nextBubbleAtRef.current = now + 4000;
      showBubble(GOOD_LINES[goodLineIdxRef.current++ % GOOD_LINES.length], "good");
    }
  };

  /* hands-free coaching: speak Mitra's tip whenever it changes, while voice is on */
  useEffect(() => {
    if (!voiceOn || phase === "briefing") return;
    const tip = getMitraTip(gs);
    if (tip === lastSpokenRef.current) return;
    lastSpokenRef.current = tip;
    speak(tip);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voiceOn, gs, phase]);

  const onState = (s: GameState) => {
    setGs(s);
    if (s.status !== "running") setPhase("ended");
    else updateBubble(s);
  };

  const onEnd = (run: RunTelemetry) => {
    saveRun(run);
    setLastRun(run);
    setDebrief(generateDebrief(run));
  };

  const start = () => {
    setGs(null);
    setDebrief(null);
    setLastRun(null);
    setRunId((r) => r + 1);
    setPhase("running");
    setMitraBubble(null);
    if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
    lastDistRef.current = null;
    nextBubbleAtRef.current = 0;
    lastUrgentAtRef.current = 0;
  };

  const fmt = fmtTime;

  return (
    <div className={styles.page}>
      <Navbar mode="simulation" />

      <div className={styles.stage}>
        {(phase === "running" || phase === "ended") && (
          <EvacuationGame
            key={`${runId}-${scenario.id}`}
            scenario={scenario}
            onState={onState}
            onEnd={onEnd}
          />
        )}

        {/* scenario-specific effects — per-hazard visual language */}
        <ScenarioEffects scenario={scenario} gs={gs} phase={phase} />

        {/* ── BRIEFING ── */}
        {phase === "briefing" && (
          <div className={styles.overlay}>
            <div className={`hud-panel ${styles.card}`}>
              <span className="badge badge-red badge-pulse">{scenario.badge}</span>
              {learnScenario && <span className="badge badge-teal">📘 Lesson Drill</span>}
              <h1 className={styles.cardTitle}>{scenario.hazardLabel} DRILL</h1>
              <p className={styles.cardDesc}>{scenario.brief}</p>

              {/* scenario selector — hidden when arriving from a lesson checkpoint, since the scenario is fixed */}
              {!learnScenario && (
                <div className={styles.scenarioRow} role="tablist" aria-label="Scenario selection">
                  {SCENARIOS.map((s, i) => (
                    <button
                      key={s.id}
                      role="tab"
                      aria-selected={i === selIdx}
                      className={`${styles.scenarioCard} ${i === selIdx ? styles.scenarioCardActive : ""}`}
                      onClick={() => setSelIdx(i)}
                    >
                      <span className={styles.scenarioName}>{s.name}</span>
                      <span className={styles.scenarioMeta}>
                        {s.hazardLabel} · {"●".repeat(s.difficulty)}{"○".repeat(3 - s.difficulty)}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              <div className={styles.controls}>
                <div className={styles.controlItem}><kbd>W A S D</kbd><span>Move</span></div>
                <div className={styles.controlItem}><kbd>SHIFT</kbd><span>Crawl low under smoke</span></div>
                <div className={styles.controlItem}><kbd>B</kbd><span>Box-breathe (recover panic)</span></div>
              </div>
              <div className={styles.resultActions}>
                <button className="btn btn-danger" onClick={start}>Start Drill →</button>
                <Link href="/admin" className={`btn btn-ghost ${styles.adminLink}`}>
                  Command Analytics ↗
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ── LIVE HUD ── */}
        {phase !== "briefing" && gs && (
          <>
            <div className={`hud-panel ${styles.hudTop}`}>
              <div className={styles.hudBlock}>
                <span className="hud-label">Time</span>
                <span className={`hud-value ${styles.hudTime}`}>{fmt(Math.max(0, scenario.timeLimit - gs.time))}</span>
              </div>
<div className="hud-separator" />
              <div className={styles.hudBlock}>
                <span className="hud-label">Oxygen</span>
                <div className={styles.meter}>
                  <div
                    className={styles.meterFill}
                    style={{
                      width: `${gs.oxygen}%`,
                      background: gs.oxygen > 50 ? "var(--accent-teal)" : gs.oxygen > 25 ? "var(--accent-amber)" : "var(--accent-red)",
                      transition: "width 400ms cubic-bezier(0.23, 1, 0.32, 1), background 200ms ease",
                    }}
                  />
                </div>
              </div>
              <div className="hud-separator" />
              <div className={styles.hudBlock}>
                <span className="hud-label">Panic</span>
                <div className={styles.meter}>
                  <div
                    className={styles.meterFill}
                    style={{
                      width: `${gs.panic}%`,
                      background: gs.panic < 40 ? "var(--accent-blue)" : gs.panic < 70 ? "var(--accent-amber)" : "var(--accent-red)",
                      transition: "width 220ms cubic-bezier(0.23, 1, 0.32, 1), background 180ms ease",
                    }}
                  />
                </div>
              </div>
              <div className="hud-separator" />
              <div className={styles.hudBlock}>
                <span className="hud-label">Score</span>
                <span className="hud-value" style={{ color: "var(--accent-teal)" }}>{gs.score}</span>
              </div>
              {gs.crouching && <span className="badge badge-blue">CRAWLING</span>}
              {gs.breathing && <span className="badge badge-teal badge-pulse">BREATHING</span>}
            </div>

            <div className={`hud-panel ${styles.ticker}`}>{gs.message}</div>
          </>
        )}

        {/* ── DEBRIEF (generated from actual run telemetry) ── */}
        {phase === "ended" && gs && (
          <div className={styles.overlay}>
            <div className={`hud-panel ${styles.card}`}>
              {gs.status === "won" ? (
                <span className="badge badge-teal">DRILL COMPLETE</span>
              ) : (
                <span className="badge badge-red badge-pulse">VIRTUAL CASUALTY</span>
              )}
              <h1
                className={styles.cardTitle}
                style={{ color: gs.status === "won" ? "var(--accent-teal)" : "var(--accent-red)" }}
              >
                {gs.status === "won" ? "EVACUATED ✓" : "DRILL FAILED ✗"}
              </h1>
              <div className={styles.resultStats}>
                <div><span className="hud-label">Time</span><b>{fmt(gs.time)}</b></div>
                <div><span className="hud-label">O₂ left</span><b>{Math.round(gs.oxygen)}%</b></div>
                <div><span className="hud-label">Peak panic</span><b>{lastRun ? Math.round(lastRun.panicPeak) : Math.round(gs.panic)}%</b></div>
                <div><span className="hud-label">Score</span><b>{gs.score}</b></div>
              </div>
              <ul className={styles.debrief}>
                {(debrief ?? [{ ok: true, text: "Run complete." }]).map((d, i) => (
                  <li key={i} style={{ color: d.ok ? undefined : "var(--accent-red)" }}>{d.text}</li>
                ))}
              </ul>
              <div className={styles.resultActions}>
                {learnScenario ? (
                  <>
                    <button
                      className="btn btn-primary"
                      onClick={() => router.push(`/learn?moduleResult=${learnModuleId}:${gs.status}`)}
                    >
                      Return to Lesson ✓
                    </button>
                    <button className="btn btn-ghost" onClick={start}>Retry Drill</button>
                  </>
                ) : (
                  <>
                    <button className="btn btn-primary" onClick={start}>Retry Drill</button>
                    <Link href="/admin" className={`btn btn-ghost ${styles.adminLink}`}>View Analytics ↗</Link>
                    <button className="btn btn-ghost" onClick={() => setPhase("briefing")}>Back to Briefing</button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── MITRA DOCK - AI crisis companion (Gemini), grounded in real game state ── */}
        {mitraBubble && !mitraOpen && (
          <div key={mitraBubble.text} className={`${styles.mitraBubble} ${styles[BUBBLE_TONE_CLASS[mitraBubble.tone]]}`}>
            {mitraBubble.text}
          </div>
        )}
        <button className={styles.mitraBtn} onClick={openMitra} data-cursor>
          🎙 Mitra
        </button>
        {mitraOpen && (
          <div ref={mitraPanelRef} className={`hud-panel ${styles.mitraPanel}`}>
            <div className={styles.mitraHeader}>
              <span className="hud-label">Mitra · Crisis Companion</span>
              <div className={styles.mitraVoiceControls}>
                {speechSupported.tts && (
                  <button
                    type="button"
                    className={`${styles.mitraIconBtn} ${voiceOn ? styles.mitraIconBtnActive : ""}`}
                    onClick={() => {
                      const next = !voiceOn;
                      setVoiceOn(next);
                      if (!next) window.speechSynthesis.cancel();
                      else speak(mitraMessages[mitraMessages.length - 1]?.text ?? getMitraTip(gs));
                    }}
                    title={voiceOn ? "Mute Mitra" : "Speak Mitra's coaching aloud"}
                    aria-label={voiceOn ? "Mute Mitra" : "Speak Mitra's coaching aloud"}
                    aria-pressed={voiceOn}
                  >
                    {voiceOn ? "🔊" : "🔈"}
                  </button>
                )}
                {speechSupported.stt && (
                  <button
                    type="button"
                    className={`${styles.mitraIconBtn} ${listening ? styles.mitraIconBtnActive : ""}`}
                    onClick={toggleListening}
                    title={listening ? "Stop listening" : "Say \"help\" or \"status\" for hands-free coaching"}
                    aria-label={listening ? "Stop listening" : "Say help or status for hands-free coaching"}
                    aria-pressed={listening}
                  >
                    {listening ? "🎙️" : "🎤"}
                  </button>
                )}
              </div>
            </div>
            <div ref={mitraLogRef} className={styles.mitraLog}>
              {mitraMessages.map((m, i) => (
                <p key={i} className={m.role === "user" ? styles.mitraMsgUser : styles.mitraMsg}>
                  {m.text}
                </p>
              ))}
              {mitraLoading && (
                <div className={styles.typing}><span /><span /><span /></div>
              )}
            </div>
            {listening && (
              <p className={styles.mitraTranscript}>{transcript || "Listening… try “help” or “status”"}</p>
            )}
            <form
              className={styles.mitraInputRow}
              onSubmit={(e) => {
                e.preventDefault();
                sendMitra(mitraInput);
              }}
            >
              <button
                type="button"
                className={`${styles.mitraMic} ${listening ? styles.listeningPulse : ""}`}
                onClick={toggleListening}
                title={listening ? "Stop listening" : "Use voice"}
                aria-label={listening ? "Stop listening" : "Use voice"}
              >
                🎤
              </button>
              <input
                className={styles.mitraInput}
                value={mitraInput}
                onChange={(e) => setMitraInput(e.target.value)}
                placeholder="Ask Mitra..."
                disabled={mitraLoading}
                data-cursor
              />
              <button
                type="submit"
                className={styles.mitraSend}
                disabled={mitraLoading || !mitraInput.trim()}
                data-cursor
              >
                →
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
