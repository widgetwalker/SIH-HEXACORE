"use client";

import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import { SCENARIOS } from "./game/floorplan";
import { generateDebrief, saveRun, fmtTime, type DebriefLine, type RunTelemetry } from "./game/telemetry";
import type { GameState } from "./game/EvacuationGame";
import ScenarioEffects from "./game/ScenarioEffects";
import styles from "./SimulatePage.module.css";

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

/* Mitra: live context-aware coaching driven by real game state */
function getMitraTip(gs: GameState | null): string {
  if (!gs) return "I'm tracking your route. Amber doorways block fire & smoke until you push through them.";
  if (gs.status === "won") return "Clean evacuation logged ✓ Your run is on the command analytics dashboard.";
  if (gs.status === "lost") return "Run logged. Check your debrief - smoke exposure and panic are the usual killers.";
  if (gs.panic > 70) return "Panic spiking! Stop and hold B - box-breathe: 4s in, 4s hold, 4s out.";
  if (gs.breathing) return "Good. Move again once panic drops below 40.";
  if (gs.oxygen < 35 && !gs.crouching) return "Oxygen critical. Crawl (SHIFT) straight to the nearest beacon - no detours.";
  if (gs.crouching) return "Smart crawling. Doorways slow the spread - use them as firebreaks.";
  if (gs.time > 60) return "Fire doubles roughly every minute. Commit to an exit and go.";
  return "Stay low, keep moving. I'm tracking your route and logging every decision.";
}

function getVoiceAnswer(query: string, gs: GameState | null, scenario: { name: string; hazardLabel: string }): string {
  const lower = query.toLowerCase();

  if (lower.includes("exit") || lower.includes("escape") || lower.includes("route")) {
    return `The primary escape route is the marked beacon path. Stay low and move toward the nearest open exit on this floor.`;
  }

  if (lower.includes("corridor") || lower.includes("blocked") || lower.includes("obstacle") || lower.includes("hazard")) {
    if (gs && gs.oxygen < 35) {
      return "The corridor is compromised by smoke. use the low crawl route and move toward the nearest beacon.";
    }
    return "The safe route remains the beaconed corridor. Avoid any smoke-heavy choke points and keep moving.";
  }

  if (lower.includes("oxygen") || lower.includes("air")) {
    const value = gs ? Math.round(gs.oxygen) : 100;
    return `Oxygen level is ${value} percent. ${value < 35 ? "This is critical. Crawl to the nearest beacon now." : "You are in a healthy breathing window."}`;
  }

  if (lower.includes("panic") || lower.includes("stress")) {
    const value = gs ? Math.round(gs.panic) : 0;
    return `Panic is ${value} percent. ${value > 70 ? "Stop, breathe, and recover before moving again." : "Stay deliberate and keep your pace steady."}`;
  }

  if (lower.includes("help") || lower.includes("what do i do") || lower.includes("advice")) {
    return "Follow the beacon, stay low, keep your head down, and move toward the nearest marked exit. Avoid smoke and keep breathing steady.";
  }

  if (lower.includes("safe") || lower.includes("status")) {
    return `${scenario.hazardLabel} drill status is active. Keep moving toward the safe corridor and monitor oxygen and panic.`;
  }

  return `I heard: ${query}. Keep following the beacon and move toward the nearest marked exit.`;
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

  const scenario = SCENARIOS[selIdx];

  const handleVoiceQuery = (query: string) => {
    const cleaned = query.trim();
    if (!cleaned) return;
    const answer = getVoiceAnswer(cleaned, gs, scenario);
    setVoiceStatus(`Heard: "${cleaned}"`);
    speak(answer);
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

        {/* ── MITRA DOCK - live crisis companion, reads real game state ── */}
        <button className={styles.mitraBtn} onClick={() => setMitraOpen(!mitraOpen)} data-cursor>
          🎙 Mitra
        </button>
        {mitraOpen && (
          <div ref={mitraPanelRef} className={`hud-panel ${styles.mitraPanel}`}>
            <span className="hud-label">Mitra · Crisis Companion</span>
            <p className={styles.mitraMsg}>{getMitraTip(gs)}</p>
            <div className={styles.voiceControls}>
              <button
                className={`${styles.voiceBtn} ${voiceEnabled ? styles.voiceBtnActive : ""}`}
                onClick={voiceEnabled ? stopListening : startListening}
                type="button"
              >
                {voiceEnabled ? "Stop listening" : "Listen"}
              </button>
              <button className={styles.voiceBtnSecondary} onClick={() => speak(getMitraTip(gs))} type="button">
                Play coaching
              </button>
            </div>
            <span className={styles.voiceStatus}>{voiceStatus}</span>
            {phase === "running" && <div className={styles.typing}><span /><span /><span /></div>}
          </div>
        )}
      </div>
    </div>
  );
}
