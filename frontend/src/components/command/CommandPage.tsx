"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import styles from "./CommandPage.module.css";

const ConstellationField = dynamic(
  () => import("@designcodeio/threeui/components/ConstellationField").then((mod) => mod.ConstellationField),
  { ssr: false }
);

const ALERTS = [
  { id: 1, time: "22:41:03", severity: "Extreme", source: "SACHET", msg: "Earthquake M5.2 — Epicenter 12km NW of campus. Aftershocks expected.", color: "red" },
  { id: 2, time: "22:41:18", severity: "Warning", source: "IMD", msg: "Flash flood warning — Heavy rainfall 80mm/hr forecast next 2 hours.", color: "amber" },
  { id: 3, time: "22:42:05", severity: "Alert", source: "Campus IoT", msg: "Smoke detector triggered — Building A, Floor 4, Room 402.", color: "amber" },
  { id: 4, time: "22:42:30", severity: "Info", source: "System", msg: "Automatic mode switch: Learning → Emergency Mode activated.", color: "blue" },
];

const FLOORS = [
  { id: "5F", students: 45, safe: 38, trapped: 2, missing: 5, status: "warning" },
  { id: "4F", students: 52, safe: 12, trapped: 8, missing: 32, status: "danger" },
  { id: "3F", students: 60, safe: 55, trapped: 0, missing: 5, status: "warning" },
  { id: "2F", students: 48, safe: 48, trapped: 0, missing: 0, status: "clear" },
  { id: "1F", students: 55, safe: 55, trapped: 0, missing: 0, status: "clear" },
  { id: "GF", students: 40, safe: 40, trapped: 0, missing: 0, status: "safe" },
];

const AGENCIES = [
  { name: "Campus EOC", status: "Active", role: "Principal / Wardens", color: "teal" },
  { name: "NDRF Unit", status: "Dispatched", role: "Search & Rescue", color: "blue" },
  { name: "Fire Station #4", status: "En Route", role: "Fire Suppression", color: "amber" },
  { name: "Ambulance EMS", status: "Standby", role: "Medical Triage", color: "violet" },
];

export default function CommandPage() {
  const [clock, setClock] = useState("22:42:30");
  const [toast, setToast] = useState<string | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<string | null>("4F");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const d = new Date();
      setClock(`${d.getHours().toString().padStart(2,"0")}:${d.getMinutes().toString().padStart(2,"0")}:${d.getSeconds().toString().padStart(2,"0")}`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const totalStudents = FLOORS.reduce((a, f) => a + f.students, 0);
  const totalSafe = FLOORS.reduce((a, f) => a + f.safe, 0);
  const totalTrapped = FLOORS.reduce((a, f) => a + f.trapped, 0);
  const totalMissing = FLOORS.reduce((a, f) => a + f.missing, 0);

  return (
    <div className={styles.page}>
      <Navbar mode="command" />

      {toast && (
        <div className={styles.toast}>
          <span>{toast}</span>
        </div>
      )}

      {/* Background */}
      <div className={styles.bgLayer}>
        <ConstellationField variant="defense-lines" style={{ width: "100%", height: "100%" }} />
      </div>

      <div className={styles.dashboard}>
        {/* Top bar */}
        <div className={styles.topBar}>
          <div className={styles.topLeft}>
            <span className={`badge badge-red badge-pulse`}>EMERGENCY MODE</span>
            <span className="mono caption" style={{ color: "var(--text-faint)" }}>Campus Emergency Operations Center</span>
          </div>
          <div className={styles.topRight}>
            <span className={`mono ${styles.clock}`}>{clock}</span>
          </div>
        </div>

        {/* Stat strip */}
        <div className={styles.statStrip}>
          <div className={styles.statChip}><span className={styles.statNum}>{totalStudents}</span><span className={styles.statLbl}>Total Enrolled</span></div>
          <div className={`${styles.statChip} ${styles.statSafe}`}><span className={styles.statNum}>{totalSafe}</span><span className={styles.statLbl}>Verified Safe</span></div>
          <div className={`${styles.statChip} ${styles.statDanger}`}><span className={styles.statNum}>{totalTrapped}</span><span className={styles.statLbl}>Trapped</span></div>
          <div className={`${styles.statChip} ${styles.statWarning}`}><span className={styles.statNum}>{totalMissing}</span><span className={styles.statLbl}>Unaccounted</span></div>
          <div className={styles.statChip}><span className={styles.statNum} style={{ color: "var(--accent-blue)" }}>{Math.round((totalSafe / totalStudents) * 100)}%</span><span className={styles.statLbl}>Safe Rate</span></div>
        </div>

        {/* 3-column grid */}
        <div className={styles.grid}>
          {/* Left: Floor status */}
          <div className={`${styles.panel} crt-effect`}>
            <div className={styles.panelHeader}>
              <span className="hud-label">FLOOR STATUS MATRIX</span>
            </div>
            <div className={styles.floorList}>
              {FLOORS.map((f) => (
                <div
                  key={f.id}
                  className={`${styles.floorRow} ${styles[`row-${f.status}`]} ${selectedFloor === f.id ? styles.floorRowSelected : ""}`}
                  onClick={() => {
                    setSelectedFloor(f.id);
                    showToast(`Floor ${f.id} selected: ${f.safe} safe, ${f.trapped} trapped, ${f.missing} missing`);
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <span className={`mono ${styles.floorId}`}>{f.id}</span>
                  <div className={styles.floorBars}>
                    <div className={styles.barGroup}>
                      <div className={`${styles.bar} ${styles.barSafe}`} style={{ width: `${(f.safe / f.students) * 100}%` }} />
                      {f.trapped > 0 && <div className={`${styles.bar} ${styles.barTrapped}`} style={{ width: `${(f.trapped / f.students) * 100}%` }} />}
                      {f.missing > 0 && <div className={`${styles.bar} ${styles.barMissing}`} style={{ width: `${(f.missing / f.students) * 100}%` }} />}
                    </div>
                  </div>
                  <span className={`mono caption ${styles.floorCount}`}>{f.safe}/{f.students}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Center: Campus map placeholder */}
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <span className="hud-label">CAMPUS BLUEPRINT — LIVE</span>
              <span className="badge badge-red badge-pulse" style={{ fontSize: "0.6rem" }}>LIVE</span>
            </div>
            <div className={styles.mapArea}>
              <div className={styles.mapPlaceholder}>
                {/* Simplified building outline */}
                <svg viewBox="0 0 400 300" className={styles.mapSvg}>
                  <rect x="80" y="40" width="240" height="220" rx="4" fill="none" stroke="var(--border-default)" strokeWidth="1" />
                  {/* Floors */}
                  {[0,1,2,3,4,5].map((i) => (
                    <g key={i} onClick={() => setSelectedFloor(`${5-i}F`)} style={{ cursor: "pointer" }}>
                      <line x1="80" y1={40 + i * 36.67} x2="320" y2={40 + i * 36.67} stroke="var(--border-subtle)" strokeWidth="0.5" />
                      <text x="75" y={40 + i * 36.67 + 20} fill={selectedFloor === `${5-i}F` ? "var(--accent-teal)" : "var(--text-faint)"} fontSize="8" fontFamily="var(--font-mono)" textAnchor="end">{5-i}F</text>
                    </g>
                  ))}
                  {/* Fire indicator on 4F */}
                  <circle cx="200" cy={40 + 36.67 + 18} r="14" fill="rgba(239,68,68,0.15)" stroke="var(--accent-red)" strokeWidth="1">
                    <animate attributeName="r" values="14;18;14" dur="1.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                  <text x="200" y={40 + 36.67 + 22} fill="var(--accent-red)" fontSize="10" textAnchor="middle" fontWeight="bold">🔥</text>
                  {/* Evac route arrow */}
                  <path d="M200,95 L200,260 L340,260" fill="none" stroke="var(--accent-teal)" strokeWidth="2" strokeDasharray="6 3" opacity="0.7">
                    <animate attributeName="stroke-dashoffset" values="0;-18" dur="1s" repeatCount="indefinite" />
                  </path>
                  <text x="345" y="264" fill="var(--accent-teal)" fontSize="8" fontFamily="var(--font-mono)">EXIT →</text>
                </svg>
              </div>
            </div>
          </div>

          {/* Right: Alert feed + Agencies */}
          <div className={styles.rightCol}>
            <div className={`${styles.panel} ${styles.alertPanel}`}>
              <div className={styles.panelHeader}>
                <span className="hud-label">CAP ALERT FEED</span>
              </div>
              <div className={styles.alertFeed}>
                {ALERTS.map((a) => (
                  <div
                    key={a.id}
                    className={`${styles.alertItem} ${styles[`alert-${a.color}`]}`}
                    onClick={() => showToast(`[${a.source}] ${a.msg}`)}
                    role="button"
                    tabIndex={0}
                    style={{ cursor: "pointer" }}
                  >
                    <span className={`mono ${styles.alertTime}`}>{a.time}</span>
                    <span className={`badge badge-${a.color} ${styles.alertSev}`}>{a.severity}</span>
                    <span className={styles.alertSrc}>{a.source}</span>
                    <p className={styles.alertMsg}>{a.msg}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <span className="hud-label">CONNECTED AGENCIES</span>
              </div>
              <div className={styles.agencyList}>
                {AGENCIES.map((a) => (
                  <div
                    key={a.name}
                    className={styles.agencyRow}
                    onClick={() => showToast(`Pinging ${a.name} (${a.role})... Status: ${a.status}`)}
                    role="button"
                    tabIndex={0}
                    style={{ cursor: "pointer" }}
                  >
                    <div className={`${styles.agencyDot}`} style={{ background: `var(--accent-${a.color})`, boxShadow: `0 0 8px var(--accent-${a.color})` }} />
                    <div className={styles.agencyInfo}>
                      <span className={styles.agencyName}>{a.name}</span>
                      <span className={styles.agencyRole}>{a.role}</span>
                    </div>
                    <span className={`badge badge-${a.color}`} style={{ fontSize: "0.6rem" }}>{a.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom action bar */}
        <div className={styles.actionBar}>
          <button
            className="btn btn-danger"
            id="cmd-broadcast"
            onClick={() => showToast("📢 Emergency CAP v1.2 Broadcast Dispatched to 239 Connected Nodes!")}
          >
            ⚡ Emergency Broadcast
          </button>
          <button
            className="btn btn-ghost"
            id="cmd-scan"
            onClick={() => showToast("📱 QR Scanner Initiated — 48 Verified Safe on 2F")}
          >
            📱 QR Headcount Scan
          </button>
          <button
            className="btn btn-ghost"
            id="cmd-report"
            onClick={() => showToast("📊 NDMA Incident Report #2026-08 Exported (PDF/JSON)")}
          >
            📊 Generate NDMA Report
          </button>
        </div>
      </div>
    </div>
  );
}
