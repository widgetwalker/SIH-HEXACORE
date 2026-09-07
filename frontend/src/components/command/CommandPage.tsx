"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import { createMockTelemetryStream, getInitialCommandTelemetry, type CommandTelemetry } from "./telemetry";
import {
  fetchLiveAlerts,
  injectIncident,
  INCIDENT_PRESETS,
  PRESET_LOCATIONS,
  DEFAULT_COORDS,
  type LiveAlert,
  type IncidentType,
} from "@/lib/liveAlerts";
import { useEmergencyBroadcasts } from "@/lib/useEmergencyBroadcasts";
import { playSirenBeep } from "@/lib/siren";
import { loadCadetSettings } from "@/lib/cadetSettings";
import LiveThreatBanner, { type LiveThreatAlert } from "./LiveThreatBanner";

import { announceMitraEmergency } from "@/components/shared/speech";

const MultiFloorVisualizer = dynamic(
  () => import("./MultiFloorVisualizer"),
  { ssr: false }
);


const ConstellationField = dynamic(
  () => import("@designcodeio/threeui/components/ConstellationField").then((mod) => mod.ConstellationField),
  { ssr: false }
);

import styles from "./CommandPage.module.css";

/* Backend API URL */
const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000").replace(/\/$/, "");

const ALERTS = [
  { id: 1, time: "22:41:03", severity: "Extreme", source: "SACHET", msg: "Earthquake M5.2 - Epicenter 12km NW of campus. Aftershocks expected.", color: "red" },
  { id: 2, time: "22:41:18", severity: "Warning", source: "IMD", msg: "Flash flood warning - Heavy rainfall 80mm/hr forecast next 2 hours.", color: "amber" },
  { id: 3, time: "22:42:05", severity: "Alert", source: "Campus IoT", msg: "Smoke detector triggered - Building A, Floor 4, Room 402.", color: "amber" },
  { id: 4, time: "22:42:30", severity: "Info", source: "System", msg: "Automatic mode switch: Learning → Emergency Mode activated.", color: "blue" },
];

const AGENCIES = [
  { name: "Campus EOC", status: "Active", role: "Principal / Wardens", color: "teal" },
  { name: "NDRF Unit", status: "Dispatched", role: "Search & Rescue", color: "blue" },
  { name: "Fire Station #4", status: "En Route", role: "Fire Suppression", color: "amber" },
  { name: "Ambulance EMS", status: "Standby", role: "Medical Triage", color: "violet" },
];

const LIVE_ALERT_POLL_MS = 20_000;

function liveAlertColor(severity: string): string {
  const s = severity.toLowerCase();
  if (s.includes("extreme") || s.includes("critical")) return "red";
  if (s.includes("warn") || s.includes("severe")) return "amber";
  return "blue";
}

export default function CommandPage() {
  const [clock, setClock] = useState("22:42:30");
  const [toast, setToast] = useState<string | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<string | null>("4F");
  const [telemetry, setTelemetry] = useState<CommandTelemetry>(getInitialCommandTelemetry);
  const [liveAlerts, setLiveAlerts] = useState<LiveAlert[]>([]);
  const [liveAlertsLoading, setLiveAlertsLoading] = useState(true);
  const [injecting, setInjecting] = useState<IncidentType | null>(null);
  const { broadcasts, connected } = useEmergencyBroadcasts();
  const [activeAlertId, setActiveAlertId] = useState<string | null>(null);
  const [dismissedAlertIds, setDismissedAlertIds] = useState<Set<string>>(new Set());

  // Geolocation & Sector coordinates (Defaults to Puducherry / Pondicherry)
  const [selectedPreset, setSelectedPreset] = useState<string>("puducherry");
  const [coords, setCoords] = useState<{ lat: number; lon: number; name: string }>({
    lat: DEFAULT_COORDS.lat,
    lon: DEFAULT_COORDS.lon,
    name: DEFAULT_COORDS.name,
  });
  const [customLat, setCustomLat] = useState<string>(String(DEFAULT_COORDS.lat));
  const [customLon, setCustomLon] = useState<string>(String(DEFAULT_COORDS.lon));
  const [isLocating, setIsLocating] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleSelectPreset = (presetId: string) => {
    setSelectedPreset(presetId);
    if (presetId === "custom") return;
    const preset = PRESET_LOCATIONS.find((p) => p.id === presetId);
    if (preset) {
      setCoords({ lat: preset.lat, lon: preset.lon, name: preset.name });
      setCustomLat(String(preset.lat));
      setCustomLon(String(preset.lon));
      showToast(`📍 Sector coordinates set to: ${preset.name}`);
    }
  };

  const handleApplyCustomCoords = () => {
    const lat = parseFloat(customLat);
    const lon = parseFloat(customLon);
    if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      showToast("⚠️ Invalid coordinates (Lat: -90..90, Lon: -180..180)");
      return;
    }
    setSelectedPreset("custom");
    setCoords({ lat, lon, name: `Sector (${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E)` });
    showToast(`📍 Sector calibrated to (${lat.toFixed(4)}, ${lon.toFixed(4)})`);
  };

  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      showToast("⚠️ Geolocation API not supported by browser");
      return;
    }
    setIsLocating(true);
    showToast("🛰️ Acquiring GPS telemetry from device sensors...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(4));
        const lon = Number(pos.coords.longitude.toFixed(4));
        setIsLocating(false);
        setSelectedPreset("custom");
        setCustomLat(String(lat));
        setCustomLon(String(lon));
        setCoords({ lat, lon, name: `Live GPS (${lat}°N, ${lon}°E)` });
        showToast(`📍 Live GPS Locked: ${lat}°N, ${lon}°E`);
      },
      (err) => {
        setIsLocating(false);
        showToast(`⚠️ GPS locked failed (${err.message}). Sector remains Puducherry.`);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Compute highest-priority active threat for LiveThreatBanner
  // STRICT RULE: Only active if there is a real CRITICAL or WARNING threat, or an injected drill.
  // Calm baseline telemetry will NEVER display an emergency threat banner.
  const activeBannerThreat: LiveThreatAlert | null = (() => {
    if (broadcasts.length > 0) {
      const b = broadcasts[0];
      const timeStr = new Date(b.receivedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      return {
        id: `drill-${b.receivedAt}`,
        source: "Campus-IoT",
        severity: "CRITICAL",
        title: "Campus Emergency Drill: " + b.msg,
        detail: `Dispatched across campus network at ${timeStr}. Drill protocol active.`,
        timestamp: timeStr,
      };
    }

    const available = liveAlerts.filter((a) => !dismissedAlertIds.has(a.id));
    if (available.length === 0) return null;

    // Filter strictly to severe threats
    const critical = available.find((a) => {
      const s = a.severity.toLowerCase();
      return s.includes("extreme") || s.includes("critical");
    });
    const warning = available.find((a) => {
      const s = a.severity.toLowerCase();
      return s.includes("warn") || s.includes("severe");
    });

    let target = critical || warning;

    // If operator clicked a specific alert in the list, prioritize it only if it's a real warning/threat
    if (activeAlertId && !dismissedAlertIds.has(activeAlertId)) {
      const selected = available.find((a) => a.id === activeAlertId);
      if (selected && selected.severity.toLowerCase() !== "normal" && selected.severity.toLowerCase() !== "info") {
        target = selected;
      }
    }

    // If no critical or warning threats exist, do NOT show an emergency threat banner
    if (!target) return null;

    const isCrit = target.severity.toLowerCase().includes("extreme") || target.severity.toLowerCase().includes("critical");
    const isWarn = target.severity.toLowerCase().includes("warn") || target.severity.toLowerCase().includes("severe");

    return {
      id: target.id,
      source: target.source,
      severity: isCrit ? "CRITICAL" : isWarn ? "WARNING" : "ADVISORY",
      title: target.headline,
      detail: target.detail,
      timestamp: new Date(target.occurred_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    };
  })();

  const handleAcknowledgeAlert = async () => {
    if (!activeBannerThreat) return;
    const targetId = activeBannerThreat.id ?? activeAlertId;
    if (targetId) {
      setDismissedAlertIds((prev) => new Set(prev).add(targetId));
      showToast("✓ Alert acknowledged — logged to NDMA incident report");
      try {
        await fetch(`${BACKEND_URL}/api/v1/alerts/${targetId}/acknowledge`, { method: "PATCH" });
      } catch {
        /* best-effort acknowledgement */
      }
    }
    setActiveAlertId(null);
  };

  const handleTriggerProtocol = () => {
    const title = activeBannerThreat?.title ?? "Campus Emergency";
    showToast(`⚡ Emergency Protocol Activated: [${title}] — All buildings notified`);
    announceMitraEmergency(
      `Campus Emergency Protocol Activated for ${title}`,
      "All sectors proceed to designated assembly zones immediately.",
      `trigger-${Date.now()}`
    );
  };

  const handleInject = async (type: IncidentType) => {
    setInjecting(type);
    const preset = INCIDENT_PRESETS.find((p) => p.type === type);
    if (preset) {
      announceMitraEmergency(
        `Emergency drill triggered: ${preset.label}`,
        `Location: ${preset.location}. Initiate emergency protocols immediately.`,
        `drill-${type}-${Date.now()}`
      );
    }
    const ok = await injectIncident(type);
    showToast(ok ? "📡 Incident injected — broadcasting to all clients" : "⚠️ Injection failed — is the backend running?");
    setInjecting(null);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const d = new Date();
      setClock(`${d.getHours().toString().padStart(2,"0")}:${d.getMinutes().toString().padStart(2,"0")}:${d.getSeconds().toString().padStart(2,"0")}`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => createMockTelemetryStream(setTelemetry), []);

  useEffect(() => {
    let cancelled = false;
    setLiveAlertsLoading(true);
    const poll = async () => {
      const alerts = await fetchLiveAlerts(coords.lat, coords.lon);
      if (!cancelled) {
        setLiveAlerts(alerts);
        setLiveAlertsLoading(false);
      }
    };
    poll();
    const interval = setInterval(poll, LIVE_ALERT_POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [coords.lat, coords.lon]);

  // Mitra voice announcement on incoming WebSocket broadcasts
  useEffect(() => {
    if (broadcasts.length === 0) return;
    const latest = broadcasts[0];
    showToast(`🚨 ${latest.msg}`);
    announceMitraEmergency(
      `Campus Emergency Drill: ${latest.msg}`,
      "All personnel initiate emergency safety protocols immediately and proceed to safety.",
      `drill-${latest.receivedAt}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [broadcasts.length]);

  // Mitra voice shoutout on real critical hazard detection (storm, flood, cyclone, earthquake)
  useEffect(() => {
    if (liveAlerts.length === 0) return;
    const severeHazard = liveAlerts.find(
      (a) =>
        !dismissedAlertIds.has(a.id) &&
        (a.severity.toLowerCase().includes("extreme") ||
          a.severity.toLowerCase().includes("critical") ||
          a.severity.toLowerCase().includes("warn"))
    );
    if (severeHazard) {
      announceMitraEmergency(
        `${severeHazard.severity} Hazard: ${severeHazard.headline}`,
        severeHazard.detail,
        severeHazard.id
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveAlerts]);

  const totalStudents = telemetry.floors.reduce((a, f) => a + f.students, 0);
  const totalSafe = telemetry.floors.reduce((a, f) => a + f.safe, 0);
  const totalTrapped = telemetry.floors.reduce((a, f) => a + f.trapped, 0);
  const totalMissing = telemetry.floors.reduce((a, f) => a + f.missing, 0);

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

        {/* Live Threat Banner */}
        <LiveThreatBanner
          alert={activeBannerThreat}
          onAcknowledge={handleAcknowledgeAlert}
          onTriggerProtocol={handleTriggerProtocol}
        />

        {/* Sector Geolocation & Telemetry Control */}
        <div className={styles.locationToolbar}>
          <div className={styles.locationInfo}>
            <span className={styles.locationPulse} />
            <div className={styles.locationTextGroup}>
              <div className={styles.locationTitleRow}>
                <span className="hud-label">📍 MONITORED SECTOR:</span>
                <span className={styles.locationName}>{coords.name}</span>
              </div>
              <span className={`mono caption ${styles.locationCoords}`}>
                LAT: {coords.lat.toFixed(4)}°N · LON: {coords.lon.toFixed(4)}°E · REGIONAL EOC RADAR
              </span>
            </div>
          </div>

          <div className={styles.locationControls}>
            <div className={styles.presetSelectWrapper}>
              <label htmlFor="sector-preset" className="sr-only">Sector Preset</label>
              <select
                id="sector-preset"
                className={styles.presetSelect}
                value={selectedPreset}
                onChange={(e) => handleSelectPreset(e.target.value)}
              >
                {PRESET_LOCATIONS.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} ({loc.state})
                  </option>
                ))}
                <option value="custom">⚙️ Custom Coordinates…</option>
              </select>
            </div>

            <button
              type="button"
              className={styles.gpsBtn}
              onClick={handleDetectGPS}
              disabled={isLocating}
              title="Acquire device coordinates via GPS"
            >
              {isLocating ? "🛰️ SCANNING…" : "🛰️ DETECT GPS"}
            </button>

            {selectedPreset === "custom" && (
              <div className={styles.customCoordsBar}>
                <input
                  type="text"
                  className={styles.coordInput}
                  placeholder="Lat (11.9416)"
                  value={customLat}
                  onChange={(e) => setCustomLat(e.target.value)}
                  aria-label="Latitude"
                />
                <input
                  type="text"
                  className={styles.coordInput}
                  placeholder="Lon (79.8083)"
                  value={customLon}
                  onChange={(e) => setCustomLon(e.target.value)}
                  aria-label="Longitude"
                />
                <button
                  type="button"
                  className={styles.applyCoordsBtn}
                  onClick={handleApplyCustomCoords}
                >
                  CALIBRATE
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Live Disaster Early Warning + Incident Injector */}
        <div className={styles.liveWarningRow}>
          <div className={`${styles.panel} ${styles.liveWarningPanel} crt-effect`}>
            <div className={styles.panelHeader}>
              <span className="hud-label">🌐 LIVE DISASTER EARLY WARNING</span>
              <span className={`mono caption ${styles.liveStatus}`}>
                {liveAlertsLoading ? "SCANNING…" : `${liveAlerts.length} ACTIVE`} · {connected ? "WS LINKED" : "WS OFFLINE"}
              </span>
            </div>
            <div className={styles.liveAlertList}>
              {!liveAlertsLoading && liveAlerts.length === 0 && (
                <div className={styles.liveAlertEmpty}>No active severe-weather or regional earthquake threats in sector.</div>
              )}
              {liveAlerts.map((a) => (
                <div
                  key={a.id}
                  className={`${styles.alertItem} ${styles[`alert-${liveAlertColor(a.severity)}`]} ${activeAlertId === a.id ? styles.alertItemActive : ""}`}
                  onClick={() => {
                    setActiveAlertId(a.id);
                    showToast(`Active hazard focus: [${a.source}] ${a.headline}`);
                  }}
                  role="button"
                  tabIndex={0}
                  style={{ cursor: "pointer" }}
                >
                  <div className={styles.alertItemHeader}>
                    <span className={`badge badge-${liveAlertColor(a.severity)} ${styles.alertSev}`}>{a.severity}</span>
                    <span className={styles.alertSrc}>{a.source}</span>
                    <span className={`mono caption ${styles.alertTimeTag}`}>
                      {new Date(a.occurred_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <p className={styles.alertMsg}>{a.headline}</p>
                  <p className={styles.liveAlertDetail}>{a.detail}</p>
                </div>
              ))}
              {broadcasts.map((b, i) => (
                <div key={`${b.receivedAt}-${i}`} className={`${styles.alertItem} ${styles["alert-red"]}`}>
                  <span className={`badge badge-red ${styles.alertSev}`}>{b.severity}</span>
                  <span className={styles.alertSrc}>Injected Drill</span>
                  <p className={styles.alertMsg}>{b.msg}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={`${styles.panel} ${styles.injectorPanel}`}>
            <div className={styles.panelHeader}>
              <span className="hud-label">⚡ INCIDENT INJECTOR</span>
              <span className="mono caption" style={{ color: "var(--text-faint)" }}>DRILL / EVAL</span>
            </div>
            <div className={styles.injectorList}>
              {INCIDENT_PRESETS.map((p) => (
                <button
                  key={p.type}
                  className={styles.injectorBtn}
                  disabled={injecting !== null}
                  onClick={() => handleInject(p.type)}
                >
                  <span className={styles.injectorIcon}>{p.icon}</span>
                  <div className={styles.injectorInfo}>
                    <span className={styles.injectorLabel}>{p.label}</span>
                    <span className={styles.injectorLocation}>{p.location}</span>
                  </div>
                  {injecting === p.type && <span className={styles.injectorSpinner}>…</span>}
                </button>
              ))}
            </div>
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
          <div className={`${styles.panel} ${styles.floorMatrixPanel} crt-effect`}>
            <div className={styles.panelHeader}>
              <span className="hud-label">FLOOR STATUS MATRIX</span>
              <span className="mono caption" style={{ color: "var(--accent-teal)" }}>{telemetry.source.toUpperCase()} LINK</span>
            </div>
            <div className={styles.floorList}>
              {telemetry.floors.map((f) => (
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

          <div className={`${styles.panel} ${styles.visualizerPanel}`}>
            <div className={styles.panelHeader}>
              <span className="hud-label">MULTI-FLOOR 3D VIEW</span>
              <span className="mono caption" style={{ color: "var(--text-faint)" }}>GROUND - 5F</span>
            </div>
            <MultiFloorVisualizer
              floors={telemetry.floors}
              selectedFloor={selectedFloor}
              onSelectFloor={(floorId) => setSelectedFloor(floorId)}
            />
          </div>

          {/* Center: Campus map placeholder */}
          <div className={`${styles.panel} ${styles.blueprintPanel}`}>
            <div className={styles.panelHeader}>
              <span className="hud-label">CAMPUS BLUEPRINT - LIVE</span>
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

        </div>

        {/* Bottom: Alert feed + Agencies */}
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
            onClick={() => showToast("📱 QR Scanner Initiated - 48 Verified Safe on 2F")}
          >
            📱 QR Headcount Scan
          </button>
          <Link
            href="/admin"
            className="btn btn-ghost"
            id="cmd-report"
            title="Open EOC Analytics & NDMA Incident Compliance Export"
          >
            📊 EOC Analytics & NDMA Report →
          </Link>
        </div>
      </div>
    </div>
  );
}
