"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { GameState } from "@/components/simulate/game/EvacuationGame";
import type { Scenario } from "@/components/simulate/game/floorplan";
import { generateDebrief, fmtTime, type RunTelemetry } from "@/components/simulate/game/telemetry";
import type { DecisionCheckpoint } from "./types";
import styles from "./SimGameModal.module.css";

const EvacuationGame = dynamic(() => import("@/components/simulate/game/EvacuationGame"), { ssr: false });

interface Props {
  scenario: Scenario;
  checkpoint: DecisionCheckpoint;
  onFinish: (won: boolean) => void;
  onClose: () => void;
}

type Phase = "intro" | "running" | "ended";

/*
 * Embeds the real 3D evacuation drill (same engine as /simulate) inside a
 * modal over the module reader, for "simulation"-type tier modules. Trimmed
 * vs. SimulatePage: no scenario picker (scenario is fixed per module), no
 * Mitra dock, no admin link.
 */
export default function SimGameModal({ scenario, checkpoint, onFinish, onClose }: Props) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [runId, setRunId] = useState(0);
  const [gs, setGs] = useState<GameState | null>(null);
  const [lastRun, setLastRun] = useState<RunTelemetry | null>(null);

  const start = () => {
    setGs(null);
    setLastRun(null);
    setRunId((r) => r + 1);
    setPhase("running");
  };

  const onState = (s: GameState) => {
    setGs(s);
    if (s.status !== "running") setPhase("ended");
  };

  const won = lastRun?.status === "won";

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={`hud-panel ${styles.panel}`} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close drill">
          ×
        </button>

        <div className={styles.stage}>
          {(phase === "running" || phase === "ended") && (
            <EvacuationGame
              key={`${runId}-${scenario.id}`}
              scenario={scenario}
              onState={onState}
              onEnd={setLastRun}
            />
          )}

          {phase === "intro" && (
            <div className={styles.intro}>
              <span className="badge badge-red badge-pulse">{scenario.badge}</span>
              <h2 className={styles.introTitle}>{scenario.name}</h2>
              <p className={styles.introBrief}>{scenario.brief}</p>
              <div className={styles.controls}>
                <div className={styles.controlItem}><kbd>W A S D</kbd><span>Move</span></div>
                <div className={styles.controlItem}><kbd>SHIFT</kbd><span>Crawl low under smoke</span></div>
                <div className={styles.controlItem}><kbd>B</kbd><span>Box-breathe (recover panic)</span></div>
                <div className={styles.controlItem}><kbd>Drag</kbd><span>Look around</span></div>
              </div>
              <button className="btn btn-danger" onClick={start}>
                Start Drill →
              </button>
            </div>
          )}

          {phase !== "intro" && gs && (
            <div className={`hud-panel ${styles.hud}`}>
              <div className={styles.hudBlock}>
                <span className="hud-label">Time</span>
                <span className="hud-value">{fmtTime(Math.max(0, scenario.timeLimit - gs.time))}</span>
              </div>
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
              <div className={styles.hudBlock}>
                <span className="hud-label">Score</span>
                <span className="hud-value" style={{ color: "var(--accent-teal)" }}>{gs.score}</span>
              </div>
            </div>
          )}
          {phase !== "intro" && gs && <div className={`hud-panel ${styles.ticker}`}>{gs.message}</div>}

          {phase === "ended" && lastRun && (
            <div className={styles.resultOverlay} onClick={(e) => e.stopPropagation()}>
              <div className={`hud-panel ${styles.resultCard}`}>
                <span className={`badge ${won ? "badge-teal" : "badge-red badge-pulse"}`}>
                  {won ? "DRILL COMPLETE" : "VIRTUAL CASUALTY"}
                </span>
                <h2 className={styles.resultTitle} style={{ color: won ? "var(--accent-teal)" : "var(--accent-red)" }}>
                  {won ? "EVACUATED ✓" : "DRILL FAILED ✗"}
                </h2>
                <ul className={styles.debrief}>
                  {generateDebrief(lastRun).map((d, i) => (
                    <li key={i} style={{ color: d.ok ? undefined : "var(--accent-red)" }}>
                      {d.text}
                    </li>
                  ))}
                </ul>
                <div className={`${styles.takeaway} ${won ? styles.takeawayGood : styles.takeawayBad}`}>
                  <strong>Key takeaway</strong>
                  <p>{won ? checkpoint.correct.explanation : checkpoint.wrong.explanation}</p>
                  {checkpoint.keyRule && <p className={styles.keyRule}>{checkpoint.keyRule}</p>}
                </div>
                <div className={styles.resultActions}>
                  <button className="btn btn-ghost" onClick={start}>
                    Retry Drill
                  </button>
                  <button className="btn btn-primary" onClick={() => onFinish(won)}>
                    Continue →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
