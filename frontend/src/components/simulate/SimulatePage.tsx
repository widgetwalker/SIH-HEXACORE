"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import type { GameState } from "./game/EvacuationGame";
import styles from "./SimulatePage.module.css";

const EvacuationGame = dynamic(() => import("./game/EvacuationGame"), { ssr: false });

type Phase = "briefing" | "running" | "ended";

const WIN_DEBRIEF = [
  "✓ Crawled under smoke and conserved oxygen (NDMA 4.2)",
  "✓ Rerouted around spreading fire cells",
  "✓ Box-breathing kept panic below cognitive freeze",
  "Next: attempt the compound Quake + Fire scenario",
];

const LOSE_DEBRIEF = [
  "✗ Oxygen depleted — hold SHIFT to crawl low in smoke",
  "Never cross a burning cell; reroute via the alternate corridor",
  "When vision tunnels (panic > 70), stop and hold B to box-breathe",
  "Fire roughly doubles every minute — commit to a route early",
];

export default function SimulatePage() {
  const [phase, setPhase] = useState<Phase>("briefing");
  const [runId, setRunId] = useState(0);
  const [gs, setGs] = useState<GameState | null>(null);
  const [mitraOpen, setMitraOpen] = useState(false);

  const onState = (s: GameState) => {
    setGs(s);
    if (s.status !== "running") setPhase("ended");
  };

  const start = () => {
    setGs(null);
    setRunId((r) => r + 1);
    setPhase("running");
  };

  const fmt = (s: number) => `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
  const vignette = gs && gs.panic > 60 ? Math.min((gs.panic - 60) / 40, 1) : 0;

  return (
    <div className={styles.page}>
      <Navbar mode="simulation" />

      <div className={styles.stage}>
        {(phase === "running" || phase === "ended") && (
          <EvacuationGame key={runId} onState={onState} />
        )}

        {/* panic vignette */}
        <div className={styles.vignette} style={{ opacity: vignette }} aria-hidden="true" />

        {/* ── BRIEFING ── */}
        {phase === "briefing" && (
          <div className={styles.overlay}>
            <div className={`hud-panel ${styles.card}`}>
              <span className="badge badge-red badge-pulse">SCENARIO 07 · LAB FIRE · EAST WING</span>
              <h1 className={styles.cardTitle}>EVACUATION DRILL</h1>
              <p className={styles.cardDesc}>
                A fire has ignited somewhere in the building and is spreading cell by
                cell. Smoke drains your oxygen. Panic slows your legs. Reach the green
                assembly beacon before conditions overwhelm you.
              </p>
              <div className={styles.controls}>
                <div className={styles.controlItem}><kbd>W A S D</kbd><span>Move</span></div>
                <div className={styles.controlItem}><kbd>SHIFT</kbd><span>Crawl low under smoke</span></div>
                <div className={styles.controlItem}><kbd>B</kbd><span>Box-breathe (recover panic)</span></div>
              </div>
              <button className="btn btn-danger" onClick={start}>Start Drill →</button>
            </div>
          </div>
        )}

        {/* ── LIVE HUD ── */}
        {phase !== "briefing" && gs && (
          <>
            <div className={`hud-panel ${styles.hudTop}`}>
              <div className={styles.hudBlock}>
                <span className="hud-label">Time</span>
                <span className={`hud-value ${styles.hudTime}`}>{fmt(Math.max(0, 120 - gs.time))}</span>
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

        {/* ── DEBRIEF ── */}
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
                <div><span className="hud-label">Panic</span><b>{Math.round(gs.panic)}%</b></div>
                <div><span className="hud-label">Score</span><b>{gs.status === "won" ? gs.score : 0}</b></div>
              </div>
              <ul className={styles.debrief}>
                {(gs.status === "won" ? WIN_DEBRIEF : LOSE_DEBRIEF).map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
              <div className={styles.resultActions}>
                <button className="btn btn-primary" onClick={start}>Retry Drill</button>
                <button className="btn btn-ghost" onClick={() => setPhase("briefing")}>Back to Briefing</button>
              </div>
            </div>
          </div>
        )}

        {/* ── MITRA DOCK (UI stub — conversational engine is Manha's module) ── */}
        <button className={styles.mitraBtn} onClick={() => setMitraOpen(!mitraOpen)} data-cursor>
          🎙 Mitra
        </button>
        {mitraOpen && (
          <div className={`hud-panel ${styles.mitraPanel}`}>
            <span className="hud-label">Mitra · Crisis Companion</span>
            <p className={styles.mitraMsg}>Stay low and keep moving. I&apos;m tracking your route.</p>
            <div className={styles.typing}><span /><span /><span /></div>
          </div>
        )}
      </div>
    </div>
  );
}
