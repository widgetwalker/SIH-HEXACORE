"use client";

import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { SCENARIOS } from "./game/floorplan";
import { generateDebrief, saveRun, fmtTime, type DebriefLine, type RunTelemetry } from "@/lib/telemetry";
import type { GameState } from "./game/EvacuationGame";
import { LEARN_SCENARIOS } from "@/components/learn/tiergame/content/simScenarios";
import { useEmergencyBroadcasts } from "@/lib/useEmergencyBroadcasts";
import { loadCadetSettings } from "@/lib/cadetSettings";
import { speak, stopSpeaking, unlockAudioPlayer } from "@/components/shared/speech";
import { localMitraReply } from "@/lib/mitraFallback";

const ScenarioEffects = dynamic(
  () => import("./game/ScenarioEffects"),
  { ssr: false }
);

const ConstellationField = dynamic(
  () => import("@designcodeio/threeui/components/ConstellationField").then((mod) => mod.ConstellationField),
  { ssr: false }
);

import styles from "./SimulatePage.module.css";

const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000").replace(/\/$/, "");

const BUBBLE_TONE_CLASS = {
  warn: "mitraBubbleWarn",
  good: "mitraBubbleGood",
  info: "mitraBubbleInfo",
} as const;

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
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const mitraPanelRef = useRef<HTMLDivElement>(null);
  const mitraLogRef = useRef<HTMLDivElement>(null);
  const lastDistRef = useRef<number | null>(null);
  const nextBubbleAtRef = useRef(0);
  const lastUrgentAtRef = useRef(0);
  const bubbleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { broadcasts } = useEmergencyBroadcasts();
  const goodLineIdxRef = useRef(0);
  const scenario = learnScenario ?? SCENARIOS[selIdx];

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  const startListening = async () => {
    setMicError(null);
    const SpeechRec = typeof window !== "undefined" &&
      ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

    if (!SpeechRec) {
      setMitraInput("⚠️ Speech recognition is not supported in this browser. Please use Chrome/Edge or type.");
      return;
    }

    // Explicitly prompt for mic permission
    try {
      if (navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
      }
    } catch (permErr: any) {
      console.warn("Microphone access denied:", permErr);
      setMicError("Microphone permission was denied.");
      setMitraInput("⚠️ Microphone access denied. Please allow microphone in browser address bar.");
      return;
    }

    try {
      stopListening();

      const rec = new SpeechRec();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = "en-IN";
      rec.maxAlternatives = 1;

      rec.onstart = () => {
        setIsListening(true);
        setMitraInput("");
      };

      rec.onresult = (e: any) => {
        let interim = "";
        let final = "";
        for (let i = e.resultIndex; i < e.results.length; ++i) {
          const result = e.results[i];
          if (result.isFinal) {
            final += result[0].transcript;
          } else {
            interim += result[0].transcript;
          }
        }
        const text = final || interim;
        if (text) {
          setMitraInput(text);
        }
        if (final && final.trim()) {
          rec.stop();
          sendMitra(final.trim());
        }
      };

      rec.onerror = (e: any) => {
        console.warn("Speech recognition error:", e.error);
        setIsListening(false);
        if (e.error === "not-allowed" || e.error === "permission-denied") {
          setMicError("Mic blocked");
          setMitraInput("⚠️ Mic permission blocked. Please allow mic in browser settings.");
        } else if (e.error === "network") {
          setMitraInput("⚠️ Speech network service error. Please try again or type.");
        }
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
      rec.start();
    } catch (startErr) {
      console.warn("Failed to start speech recognition:", startErr);
      setIsListening(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const speakMitra = (text: string) => {
    if (isMuted) return;
    speak(text);
  };

  useEffect(() => {
    return () => {
      if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
      stopSpeaking();
      stopListening();
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
    if (mitraLogRef.current) {
      mitraLogRef.current.scrollTop = mitraLogRef.current.scrollHeight;
    }
  }, [mitraMessages, mitraLoading]);

  const openMitra = () => {
    unlockAudioPlayer();
    setMitraOpen((open) => {
      const next = !open;
      if (next) {
        setMitraBubble(null);
        if (mitraMessages.length === 0) {
          const initialTip = getMitraTip(gs);
          setMitraMessages([{ role: "mitra", text: initialTip }]);
          speakMitra(initialTip);
        }
      } else {
        stopSpeaking();
        stopListening();
      }
      return next;
    });
  };

  // When a campus emergency is injected/broadcast, Mitra verbalizes the
  // warning immediately - this is the one voice line that isn't gated
  // behind mitraOpen, since it's a safety announcement, not chat.
  useEffect(() => {
    if (broadcasts.length === 0) return;
    const latest = broadcasts[0];
    speakMitra(`Emergency alert. ${latest.severity} severity. ${latest.msg}`);
    setMitraMessages((m) => [...m, { role: "mitra", text: `🚨 ${latest.msg}` }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [broadcasts.length]);

  const sendMitra = async (raw: string) => {
    unlockAudioPlayer();
    const text = raw.trim();
    if (!text || mitraLoading) return;
    const history = [...mitraMessages, { role: "user" as const, text }];
    setMitraMessages(history);
    setMitraInput("");
    setMitraLoading(true);
    const contextData = {
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
    };

    // 3.5-second strict timeout before triggering instant offline safety fallback
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3500);

    try {
      // First attempt Next.js API route or backend
      const res = await fetch("/api/mitra", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          message: text,
          history: history.slice(0, -1),
          context: contextData,
        }),
      });
      clearTimeout(timer);
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data.text === "string" && data.text.trim()) {
          setMitraMessages((m) => [...m, { role: "mitra", text: data.text }]);
          speakMitra(data.text);
          return;
        }
      }
      throw new Error("Fallback required");
    } catch {
      clearTimeout(timer);
      // Automatic deterministic NDMA/NFPA crisis safety fallback (instant response)
      const fallbackReply = localMitraReply(text, contextData);
      setMitraMessages((m) => [...m, { role: "mitra", text: fallbackReply }]);
      speakMitra(fallbackReply);
    } finally {
      setMitraLoading(false);
    }
  };

  const showBubble = (text: string, tone: MitraBubble["tone"], voice = true) => {
    setMitraBubble({ text, tone });
    if (voice) {
      speakMitra(text);
    }
    if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
    bubbleTimerRef.current = setTimeout(() => setMitraBubble(null), 4500);
  };

  /* proactive live coaching — direction + urgent nudges, floated above the Mitra icon */
  const updateBubble = (s: GameState) => {
    const now = Date.now();

    if (s.panic > 75 && !s.breathing && now - lastUrgentAtRef.current > 7000) {
      lastUrgentAtRef.current = now;
      showBubble("Panic spiking — hold B to box-breathe!", "warn", true);
      return;
    }
    if (s.oxygen < 25 && !s.crouching && now - lastUrgentAtRef.current > 7000) {
      lastUrgentAtRef.current = now;
      showBubble("Oxygen critical — crawl (SHIFT) to the beacon!", "warn", true);
      return;
    }

    if (now < nextBubbleAtRef.current) return;

    const prevDist = lastDistRef.current;
    lastDistRef.current = s.distToExit;
    if (prevDist == null || s.distToExit < 0) return;

    if (s.distToExit > prevDist) {
      nextBubbleAtRef.current = now + 6000;
      showBubble(`Wrong way — head ${dirText(s.guideDir)}.`, "warn", true);
    } else if (s.distToExit < prevDist) {
      nextBubbleAtRef.current = now + 6000;
      showBubble(GOOD_LINES[goodLineIdxRef.current++ % GOOD_LINES.length], "good", false);
    }
  };

  const onState = (s: GameState) => {
    setGs(s);
    if (s.status !== "running") setPhase("ended");
    else updateBubble(s);
  };

  const onEnd = async (run: RunTelemetry) => {
    await saveRun(run);
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
      
      <div style={{ position: "fixed", inset: 0, zIndex: 0, opacity: 0.3, pointerEvents: "none" }}>
        <ConstellationField />
      </div>

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
              <button
                type="button"
                className={styles.mitraMuteBtn}
                onClick={() => {
                  if (!isMuted) stopSpeaking();
                  setIsMuted(!isMuted);
                }}
                title={isMuted ? "Unmute Mitra voice" : "Mute Mitra voice"}
              >
                {isMuted ? "🔇 Muted" : "🔊 Voice On"}
              </button>
            </div>
            <div ref={mitraLogRef} className={styles.mitraLog}>
              {mitraMessages.map((m, i) => (
                <div key={i} className={m.role === "user" ? styles.mitraMsgUserRow : styles.mitraMsgRow}>
                  <p className={m.role === "user" ? styles.mitraMsgUser : styles.mitraMsg}>
                    {m.text}
                  </p>
                  {m.role === "mitra" && (
                    <button
                      type="button"
                      className={styles.mitraReplayBtn}
                      onClick={() => speakMitra(m.text)}
                      title="Hear Mitra speak again"
                    >
                      🔊
                    </button>
                  )}
                </div>
              ))}
              {mitraLoading && (
                <div className={styles.typing}><span /><span /><span /></div>
              )}
            </div>
            <form
              className={styles.mitraInputRow}
              onSubmit={(e) => {
                e.preventDefault();
                sendMitra(mitraInput);
              }}
            >
              <button
                type="button"
                className={`${styles.mitraMic} ${isListening ? styles.listeningPulse : ""}`}
                onClick={toggleListening}
                title={isListening ? "Listening... click to stop" : "Click to speak with Mitra"}
                aria-label={isListening ? "Stop listening" : "Start microphone"}
              >
                {isListening ? "🔴" : "🎤"}
              </button>
              <input
                className={styles.mitraInput}
                value={mitraInput}
                onChange={(e) => setMitraInput(e.target.value)}
                placeholder={isListening ? "🎙️ Listening... speak now..." : "Ask Mitra... (or click 🎤 to speak)"}
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
