"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import { SCENARIOS } from "./game/floorplan";
import { generateDebrief, saveRun, fmtTime, type DebriefLine, type RunTelemetry } from "./game/telemetry";
import type { GameState } from "./game/EvacuationGame";
import styles from "./SimulatePage.module.css";

const EvacuationGame = dynamic(() => import("./game/EvacuationGame"), { ssr: false });

type Phase = "briefing" | "running" | "ended";

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

export default function SimulatePage() {
  const [phase, setPhase] = useState<Phase>("briefing");
  const [runId, setRunId] = useState(0);
  const [selIdx, setSelIdx] = useState(0);
  const [gs, setGs] = useState<GameState | null>(null);
  const [debrief, setDebrief] = useState<DebriefLine[] | null>(null);
  const [lastRun, setLastRun] = useState<RunTelemetry | null>(null);
  const [mitraOpen, setMitraOpen] = useState(false);

  const scenario = SCENARIOS[selIdx];

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
  const vignette = gs && gs.panic > 60 ? Math.min((gs.panic - 60) / 40, 1) : 0;

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

        {/* panic vignette */}
        <div className={styles.vignette} style={{ opacity: vignette }} aria-hidden="true" />

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
          <div className={`hud-panel ${styles.mitraPanel}`}>
            <span className="hud-label">Mitra · Crisis Companion</span>
            <p className={styles.mitraMsg}>{getMitraTip(gs)}</p>
            {phase === "running" && <div className={styles.typing}><span /><span /><span /></div>}
          </div>
        )}
      </div>
    </div>
  );
}
