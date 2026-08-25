"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { loadRuns, fmtTime, topViolation, VIOLATION_LABELS, type RunTelemetry } from "@/components/simulate/game/telemetry";
import { parseFloorplan, SCENARIOS } from "@/components/simulate/game/floorplan";
import styles from "./AdminDashboard.module.css";

/*
 * Command Analytics dashboard (Pillar 2 → Pillar 3 telemetry flow):
 * aggregates every persisted drill run from localStorage into
 * compliance stats, violation breakdowns and a route/death heatmap.
 */

export default function AdminDashboard() {
  const [runs, setRuns] = useState<RunTelemetry[] | null>(null);
  const [heatScenarioId, setHeatScenarioId] = useState<string>(SCENARIOS[0].id);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setRuns(loadRuns());
  }, []);

  const scenarioRuns = useMemo(
    () => (runs ?? []).filter((r) => r.scenarioId === heatScenarioId),
    [runs, heatScenarioId]
  );

  /* ── aggregate KPIs ── */
  const kpis = useMemo(() => {
    if (!runs || runs.length === 0) return null;
    const won = runs.filter((r) => r.status === "won");
    const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);
    return {
      total: runs.length,
      successRate: Math.round((won.length / runs.length) * 100),
      avgEscape: avg(won.map((r) => r.time)),
      avgPeakPanic: avg(runs.map((r) => r.panicPeak)),
      worstViolation: topViolation(runs),
    };
  }, [runs]);

  const recent = useMemo(() => [...(runs ?? [])].slice(-12).reverse(), [runs]);

  /* ── heatmap render ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const scenario = SCENARIOS.find((s) => s.id === heatScenarioId);
    if (!scenario) return;
    const fp = parseFloorplan(scenario);
    const CS = 26; // cell size px
    canvas.width = fp.cols * CS;
    canvas.height = fp.rows * CS;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#0a0f1e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let r = 0; r < fp.rows; r++) {
      for (let c = 0; c < fp.cols; c++) {
        const idx = fp.idxOf(c, r);
        if (fp.walls.has(idx)) {
          ctx.fillStyle = "#1c2a4d";
          ctx.fillRect(c * CS, r * CS, CS - 1, CS - 1);
        } else if (fp.doors.has(idx)) {
          ctx.fillStyle = "rgba(245, 158, 11, 0.25)";
          ctx.fillRect(c * CS + 3, r * CS + 3, CS - 7, CS - 7);
        }
      }
    }

    /* route frequency → teal heat */
    let maxHeat = 1;
    for (const run of scenarioRuns) {
      for (const v of run.routeHeat) if (v > maxHeat) maxHeat = v;
    }
    const heatSum = new Array<number>(fp.rows * fp.cols).fill(0);
    for (const run of scenarioRuns) {
      run.routeHeat.forEach((v, i) => { heatSum[i] += v; });
    }
    for (let i = 0; i < heatSum.length; i++) {
      if (heatSum[i] === 0) continue;
      const a = Math.min(1, heatSum[i] / (maxHeat * Math.max(1, scenarioRuns.length)) * 6);
      const c = i % fp.cols;
      const r = Math.floor(i / fp.cols);
      ctx.fillStyle = `rgba(0, 212, 170, ${0.08 + a * 0.55})`;
      ctx.fillRect(c * CS, r * CS, CS - 1, CS - 1);
    }

    /* exits green, deaths red */
    for (const e of fp.exits) {
      ctx.fillStyle = "#10b981";
      ctx.fillRect(e.c * CS + 4, e.r * CS + 4, CS - 9, CS - 9);
    }
    for (const run of scenarioRuns) {
      if (!run.deathCell) continue;
      ctx.beginPath();
      ctx.arc(run.deathCell.c * CS + CS / 2, run.deathCell.r * CS + CS / 2, 5, 0, Math.PI * 2);
      ctx.fillStyle = "#ef4444";
      ctx.fill();
    }

    /* spawn marker */
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 2;
    ctx.strokeRect(fp.spawn.c * CS + 2, fp.spawn.r * CS + 2, CS - 5, CS - 5);
  }, [heatScenarioId, scenarioRuns]);

  return (
    <div className={styles.page}>
      <Navbar mode="command" />
      <div className={styles.inner}>
        <header className={styles.header}>
          <span className="badge badge-teal">PILLAR 2 → PILLAR 3 TELEMETRY</span>
          <h1 className="heading-xl">Command Analytics</h1>
          <p className={styles.sub}>
            Aggregated drill performance across all local runs - the evidence base admins pay for.
          </p>
        </header>

        {runs === null ? (
          <p className={styles.empty}>Loading drill data…</p>
        ) : runs.length === 0 ? (
          <div className={styles.empty}>
            <p>No drills recorded yet.</p>
            <Link href="/simulate" className={`btn btn-primary ${styles.cta}`}>Run your first drill →</Link>
          </div>
        ) : (
          <>
            {/* ── KPI cards ── */}
            <section className={styles.kpiRow}>
              <div className={`hud-panel ${styles.kpi}`}>
                <span className="hud-label">Total Drills</span>
                <b className={styles.kpiValue}>{kpis!.total}</b>
              </div>
              <div className={`hud-panel ${styles.kpi}`}>
                <span className="hud-label">Success Rate</span>
                <b className={styles.kpiValue} style={{ color: kpis!.successRate >= 70 ? "var(--accent-teal)" : "var(--accent-amber)" }}>
                  {kpis!.successRate}%
                </b>
              </div>
              <div className={`hud-panel ${styles.kpi}`}>
                <span className="hud-label">Avg Escape Time</span>
                <b className={styles.kpiValue}>{fmtTime(kpis!.avgEscape)}</b>
              </div>
              <div className={`hud-panel ${styles.kpi}`}>
                <span className="hud-label">Avg Peak Panic</span>
                <b className={styles.kpiValue} style={{ color: kpis!.avgPeakPanic > 70 ? "var(--accent-red)" : undefined }}>
                  {Math.round(kpis!.avgPeakPanic)}%
                </b>
              </div>
              <div className={`hud-panel ${styles.kpi}`}>
                <span className="hud-label">Top Failure Mode</span>
                <b className={`${styles.kpiValue} ${styles.kpiSmall}`}>
                  {kpis!.worstViolation ? `${VIOLATION_LABELS[kpis!.worstViolation.type] ?? kpis!.worstViolation.type} (${kpis!.worstViolation.count})` : "None recorded"}
                </b>
              </div>
            </section>

            {/* ── heatmap ── */}
            <section className={`hud-panel ${styles.panel}`}>
              <div className={styles.panelHead}>
                <h2 className="heading-md">Route &amp; Casualty Heatmap</h2>
                <select
                  className={styles.select}
                  value={heatScenarioId}
                  onChange={(e) => setHeatScenarioId(e.target.value)}
                  aria-label="Scenario"
                >
                  {SCENARIOS.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div className={styles.canvasWrap}>
                <canvas ref={canvasRef} className={styles.heatmap} />
              </div>
              <div className={styles.legend}>
                <span><i style={{ background: "rgba(0,212,170,0.6)" }} /> Traffic</span>
                <span><i style={{ background: "#ef4444" }} /> Casualty</span>
                <span><i style={{ background: "#10b981" }} /> Exit</span>
                <span><i style={{ background: "rgba(245,158,11,0.8)" }} /> Spawn</span>
                <span>{scenarioRuns.length} run{scenarioRuns.length === 1 ? "" : "s"} aggregated</span>
              </div>
            </section>

            {/* ── recent runs ── */}
            <section className={`hud-panel ${styles.panel}`}>
              <h2 className="heading-md">Recent Drills</h2>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Scenario</th>
                    <th>Result</th>
                    <th>Time</th>
                    <th>O₂</th>
                    <th>Panic</th>
                    <th>Violations</th>
                    <th>When</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((run) => (
                    <tr key={run.runId}>
                      <td>{run.scenarioName}</td>
                      <td className={run.status === "won" ? styles.ok : styles.bad}>
                        {run.status === "won" ? "EVACUATED" : "CASUALTY"}
                      </td>
                      <td>{fmtTime(run.time)}</td>
                      <td>{Math.round(run.oxygenLeft)}%</td>
                      <td>{Math.round(run.panicPeak)}%</td>
                      <td>{run.violations.length}</td>
                      <td>{new Date(run.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
