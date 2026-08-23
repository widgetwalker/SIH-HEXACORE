"use client";

import { useState, useEffect } from "react";
import { EmberStorm } from "@designcodeio/threeui";
import Navbar from "@/components/Navbar";
import styles from "./SimulatePage.module.css";

export default function SimulatePage() {
  const [timer, setTimer] = useState(90);
  const [panicLevel, setPanicLevel] = useState(42);
  const [oxygenLevel, setOxygenLevel] = useState(78);
  const [currentFloor, setCurrentFloor] = useState(4);
  const [drillActive, setDrillActive] = useState(false);
  const [mitraOpen, setMitraOpen] = useState(false);

  // Simulate countdown + degrading conditions
  useEffect(() => {
    if (!drillActive) return;
    const interval = setInterval(() => {
      setTimer((t) => Math.max(0, t - 1));
      setPanicLevel((p) => Math.min(100, p + Math.random() * 2));
      setOxygenLevel((o) => Math.max(0, o - Math.random() * 0.8));
    }, 1000);
    return () => clearInterval(interval);
  }, [drillActive]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const floorStatus = [
    { floor: "5F", status: "clear", label: "Clear" },
    { floor: "4F", status: "danger", label: "🔥 Active Fire" },
    { floor: "3F", status: "warning", label: "Smoke" },
    { floor: "2F", status: "clear", label: "Clear" },
    { floor: "1F", status: "clear", label: "Clear" },
    { floor: "GF", status: "safe", label: "✓ Exit" },
  ];

  return (
    <div className={styles.page}>
      <Navbar mode="simulation" />

      {/* 3D Canvas area (EmberStorm background + placeholder for Three.js scene) */}
      <div className={styles.canvasArea}>
        <div className={styles.embers}>
          <EmberStorm style={{ width: "100%", height: "100%" }} />
        </div>

        {/* Placeholder 3D building viewport */}
        <div className={styles.viewport}>
          <div className={styles.buildingPlaceholder}>
            <div className={styles.buildingWire}>
              {[5, 4, 3, 2, 1, 0].map((f) => (
                <div key={f} className={`${styles.wireFloor} ${f === currentFloor ? styles.wireFloorActive : ""} ${f === 4 ? styles.wireFloorFire : ""}`}>
                  <span className={styles.wireLabel}>{f === 0 ? "GF" : `${f}F`}</span>
                  {f === 4 && <span className={styles.fireIndicator}>🔥</span>}
                  {f === currentFloor && <span className={styles.playerDot} />}
                </div>
              ))}
            </div>
            <div className={styles.viewportOverlay}>
              {!drillActive ? (
                <div className={styles.startOverlay}>
                  <h2 className="display-lg" style={{ marginBottom: 8 }}>Crisis Simulation</h2>
                  <p className="body-md" style={{ color: "var(--text-muted)", marginBottom: 24, maxWidth: 400, textAlign: "center" }}>
                    Fire detected on Floor 4. Navigate to safety. You have 90 seconds.
                  </p>
                  <button className="btn btn-primary" onClick={() => setDrillActive(true)} id="start-drill-btn" style={{ padding: "16px 40px", fontSize: "1rem" }}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><polygon points="5,2 17,10 5,18" fill="currentColor"/></svg>
                    Launch Drill
                  </button>
                </div>
              ) : (
                <p className={`mono ${styles.simRunning}`}>SIMULATION ACTIVE — NAVIGATE TO EXIT</p>
              )}
            </div>
          </div>
        </div>

        {/* ── HUD OVERLAYS ── */}
        {drillActive && (
          <>
            {/* Top-left: Timer + Panic */}
            <div className={`${styles.hudTopLeft} hud-panel`}>
              <div className={styles.hudBlock}>
                <span className="hud-label">TIME LEFT</span>
                <span className={`hud-value ${styles.hudTimer} ${timer <= 15 ? styles.hudCritical : ""}`}>{formatTime(timer)}</span>
              </div>
              <div className="hud-separator" />
              <div className={styles.hudBlock}>
                <span className="hud-label">PANIC LEVEL</span>
                <div className={styles.panicBar}>
                  <div className={styles.panicFill} style={{ width: `${panicLevel}%`, background: panicLevel > 70 ? "var(--accent-red)" : panicLevel > 40 ? "var(--accent-amber)" : "var(--accent-teal)" }} />
                </div>
                <span className={`mono caption ${panicLevel > 70 ? styles.hudCritical : ""}`}>{Math.round(panicLevel)}%</span>
              </div>
            </div>

            {/* Top-right: Oxygen + Floor */}
            <div className={`${styles.hudTopRight} hud-panel`}>
              <div className={styles.hudBlock}>
                <span className="hud-label">O₂ LEVEL</span>
                <div className={styles.oxygenGauge}>
                  <svg viewBox="0 0 60 60" className={styles.gaugeSvg}>
                    <circle cx="30" cy="30" r="24" fill="none" stroke="var(--border-subtle)" strokeWidth="4" />
                    <circle cx="30" cy="30" r="24" fill="none"
                      stroke={oxygenLevel > 50 ? "var(--accent-teal)" : oxygenLevel > 25 ? "var(--accent-amber)" : "var(--accent-red)"}
                      strokeWidth="4" strokeDasharray={`${2 * Math.PI * 24}`}
                      strokeDashoffset={`${2 * Math.PI * 24 * (1 - oxygenLevel / 100)}`}
                      strokeLinecap="round" transform="rotate(-90 30 30)"
                      style={{ transition: "stroke-dashoffset 1s ease, stroke 0.5s" }} />
                  </svg>
                  <span className={`mono ${styles.gaugeVal}`}>{Math.round(oxygenLevel)}%</span>
                </div>
              </div>
              <div className="hud-separator" />
              <div className={styles.hudBlock}>
                <span className="hud-label">CURRENT FLOOR</span>
                <span className="hud-value" style={{ fontSize: "1.5rem", color: "var(--accent-amber)" }}>{currentFloor === 0 ? "GF" : `${currentFloor}F`}</span>
              </div>
            </div>

            {/* Bottom: Floor status strip */}
            <div className={`${styles.hudBottom} hud-panel`}>
              {floorStatus.map((f) => (
                <div key={f.floor} className={`${styles.floorChip} ${styles[`floor-${f.status}`]}`}>
                  <span className={styles.floorId}>{f.floor}</span>
                  <span className={styles.floorLabel}>{f.label}</span>
                </div>
              ))}
            </div>

            {/* Heartbeat line */}
            <div className={styles.heartbeatWrap}>
              {[...Array(12)].map((_, i) => (
                <div key={i} className={styles.heartbeatBar} style={{ animationDelay: `${i * 80}ms` }} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Floor navigation controls */}
      {drillActive && (
        <div className={styles.floorNav}>
          <button className={styles.floorBtn} onClick={() => setCurrentFloor((f) => Math.min(5, f + 1))} disabled={currentFloor >= 5}>↑ Up</button>
          <span className="mono" style={{ color: "var(--text-muted)" }}>Floor {currentFloor === 0 ? "G" : currentFloor}</span>
          <button className={`${styles.floorBtn} ${styles.floorBtnDown}`} onClick={() => setCurrentFloor((f) => Math.max(0, f - 1))} disabled={currentFloor <= 0}>↓ Down</button>
        </div>
      )}

      {/* Mitra AI Chat */}
      <button className={styles.mitraFab} onClick={() => setMitraOpen(!mitraOpen)} id="mitra-fab" aria-label="Open Mitra AI assistant">
        <div className={styles.mitraOrb} />
        <span className={styles.mitraLabel}>Mitra</span>
      </button>

      {mitraOpen && (
        <div className={styles.mitraDrawer}>
          <div className={styles.mitraHeader}>
            <div className={styles.mitraOrb} style={{ width: 28, height: 28 }} />
            <div>
              <span className={styles.mitraName}>Mitra AI</span>
              <span className={styles.mitraStatus}>Crisis Companion</span>
            </div>
            <button className="btn-icon" onClick={() => setMitraOpen(false)} style={{ marginLeft: "auto" }}>✕</button>
          </div>
          <div className={styles.mitraMessages}>
            <div className={styles.mitraMsgBot}>
              <p>🔥 Fire detected on <strong>Floor 4</strong>. Do NOT use the main staircase — it is blocked by smoke.</p>
            </div>
            <div className={styles.mitraMsgBot}>
              <p>📍 Your safest route: <strong>East service stairwell → Floor 1 → Main courtyard exit</strong>.</p>
            </div>
            <div className={styles.mitraMsgBot}>
              <p>Remember: <strong>Stay low, cover your mouth</strong>. I&apos;ve sent your location to the campus EOC.</p>
            </div>
          </div>
          <div className={styles.mitraInput}>
            <input type="text" className="input-base" placeholder="Ask Mitra for help..." />
            <button className="btn btn-primary" style={{ padding: "10px 16px" }}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}
