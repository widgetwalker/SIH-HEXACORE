"use client";

import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import { SCENARIOS } from "./game/floorplan";
import { generateDebrief, saveRun, fmtTime, type DebriefLine, type RunTelemetry } from "./game/telemetry";
import type { GameState } from "./game/EvacuationGame";

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

const EvacuationGame = dynamic(() => import("./game/EvacuationGame"), { ssr: false });

type Phase = "briefing" | "running" | "ended";

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  }

  interface SpeechRecognitionLike {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    start: () => void;
    stop: () => void;
    onstart: (() => void) | null;
    onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
    onerror: ((event: { error?: string }) => void) | null;
    onend: (() => void) | null;
  }
}

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
  const [phase, setPhase] = useState<Phase>("briefing");
  const [runId, setRunId] = useState(0);
  const [selIdx, setSelIdx] = useState(0);
  const [gs, setGs] = useState<GameState | null>(null);
  const [debrief, setDebrief] = useState<DebriefLine[] | null>(null);
  const [lastRun, setLastRun] = useState<RunTelemetry | null>(null);
  const [mitraOpen, setMitraOpen] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState("Voice ready");
  const [mitraMessages, setMitraMessages] = useState<MitraTurn[]>([]);
  const [mitraInput, setMitraInput] = useState("");
  const [mitraLoading, setMitraLoading] = useState(false);
  const [mitraBubble, setMitraBubble] = useState<MitraBubble | null>(null);
  const mitraPanelRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const lastCoachRef = useRef<string | null>(null);
  const lastCoachTimeRef = useRef(0);

  const speak = (text: string) => {
    if (typeof window === "undefined") return;
    const synth = window.speechSynthesis;
    if (!synth || !text) return;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    synth.speak(utterance);
  };
  const mitraLogRef = useRef<HTMLDivElement>(null);
  const lastDistRef = useRef<number | null>(null);
  const nextBubbleAtRef = useRef(0);
  const lastUrgentAtRef = useRef(0);
  const bubbleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const goodLineIdxRef = useRef(0);

  useEffect(() => {
    return () => {
      if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
    };
  }, []);

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
    if (phase !== "running" || !gs) return;
    const tip = getMitraTip(gs);
    const now = Date.now();
    if (tip !== lastCoachRef.current && now - lastCoachTimeRef.current > 5000) {
      lastCoachRef.current = tip;
      lastCoachTimeRef.current = now;
      speak(tip);
    }
  }, [phase, gs]);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined") {
        window.speechSynthesis?.cancel();
      }
      recognitionRef.current?.stop();
    };
  }, []);

  useEffect(() => {
    if (mitraLogRef.current) {
      mitraLogRef.current.scrollTop = mitraLogRef.current.scrollHeight;
    }
  }, [mitraMessages, mitraLoading]);

  const scenario = SCENARIOS[selIdx];

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

  const sendMitra = async (raw: string, opts?: { speakReply?: boolean }) => {
    const text = raw.trim();
    if (!text || mitraLoading) return;
    const history = [...mitraMessages, { role: "user" as const, text }];
    setMitraMessages(history);
    setMitraInput("");
    setMitraLoading(true);
    try {
      const res = await fetch("/api/mitra", {
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
      if (opts?.speakReply) speak(replyText);
    } catch {
      const failText = "Connection lost — try again once you're back online.";
      setMitraMessages((m) => [...m, { role: "mitra", text: failText }]);
      if (opts?.speakReply) speak(failText);
    } finally {
      setMitraLoading(false);
    }
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

  const handleVoiceQuery = (query: string) => {
    const cleaned = query.trim();
    if (!cleaned) return;
    setVoiceStatus(`Heard: "${cleaned}" — asking Mitra…`);
    if (!mitraOpen) setMitraOpen(true);
    sendMitra(cleaned, { speakReply: true }).then(() => setVoiceStatus("Voice ready"));
  };

  const startListening = () => {
    if (typeof window === "undefined") return;
    const RecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!RecognitionCtor) {
      setVoiceStatus("Voice input is not supported in this browser.");
      return;
    }

    if (!recognitionRef.current) {
      const recognition = new RecognitionCtor();
      recognition.lang = "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setVoiceEnabled(true);
        setVoiceStatus("Listening...");
      };

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0]?.transcript ?? "")
          .join(" ")
          .trim();

        if (transcript) {
          handleVoiceQuery(transcript);
        }
      };

      recognition.onerror = (event) => {
        setVoiceStatus(`Voice input error: ${event.error ?? "microphone unavailable"}`);
      };

      recognition.onend = () => {
        setVoiceEnabled(false);
        setVoiceStatus("Voice ready");
      };

      recognitionRef.current = recognition;
    }

    if (phase !== "running") {
      setVoiceStatus("Start a live drill before using voice commands.");
      return;
    }

    recognitionRef.current.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setVoiceEnabled(false);
    setVoiceStatus("Voice ready");
  };

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
              <h1 className={styles.cardTitle}>{scenario.hazardLabel} DRILL</h1>
              <p className={styles.cardDesc}>{scenario.brief}</p>

              {/* scenario selector */}
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
                <button className="btn btn-primary" onClick={start}>Retry Drill</button>
                <Link href="/admin" className={`btn btn-ghost ${styles.adminLink}`}>View Analytics ↗</Link>
                <button className="btn btn-ghost" onClick={() => setPhase("briefing")}>Back to Briefing</button>
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
            <span className="hud-label">Mitra · Crisis Companion</span>
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
            <div className={styles.voiceControls}>
              <button
                className={`${styles.voiceBtn} ${voiceEnabled ? styles.voiceBtnActive : ""}`}
                onClick={voiceEnabled ? stopListening : startListening}
                type="button"
              >
                {voiceEnabled ? "Stop listening" : "Listen"}
              </button>
              <button
                className={styles.voiceBtnSecondary}
                onClick={() => speak(mitraMessages[mitraMessages.length - 1]?.text ?? getMitraTip(gs))}
                type="button"
              >
                Play coaching
              </button>
            </div>
            <span className={styles.voiceStatus}>{voiceStatus}</span>
            <form
              className={styles.mitraInputRow}
              onSubmit={(e) => {
                e.preventDefault();
                sendMitra(mitraInput);
              }}
            >
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
