"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import { applyWebSocketTelemetry, applyEmergencyBroadcast, createMockTelemetryStream, createWebSocketTelemetryStream, getInitialCommandTelemetry, type CommandTelemetry, type CommandAlert, type DrillTelemetryMessage, type WebSocketConnectionStatus, type WebSocketTelemetryMessage, type EmergencyBroadcastMessage } from "./telemetry";
import { subscribeDrillEvents, type DrillTelemetryFrame } from "./drillEventBus";
import { speak, speakAlert, stopSpeaking, isSpeechSupported } from "@/components/shared/speech";

const FloorStack3D = dynamic(
  () => import("./FloorStack3D"),
  { ssr: false }
);

import styles from "./CommandPage.module.css";

const ALERTS: CommandAlert[] = [
  { id: 1, time: "22:41:03", severity: "Extreme", source: "SACHET", message: "Earthquake M5.2 - Epicenter 12km NW of campus. Aftershocks expected.", color: "red" },
  { id: 2, time: "22:41:18", severity: "Warning", source: "IMD", message: "Flash flood warning - Heavy rainfall 80mm/hr forecast next 2 hours.", color: "amber" },
  { id: 3, time: "22:42:05", severity: "Alert", source: "Campus IoT", message: "Smoke detector triggered - Building A, Floor 4, Room 402.", color: "amber" },
  { id: 4, time: "22:42:30", severity: "Info", source: "System", message: "Automatic mode switch: Learning → Emergency Mode activated.", color: "blue" },
];

const AGENCIES = [
  { name: "Campus EOC", status: "Active", role: "Principal / Wardens", color: "teal" },
  { name: "NDRF Unit", status: "Dispatched", role: "Search & Rescue", color: "blue" },
  { name: "Fire Station #4", status: "En Route", role: "Fire Suppression", color: "amber" },
  { name: "Ambulance EMS", status: "Standby", role: "Medical Triage", color: "violet" },
];

const FLOOR_INSPECTOR_DATA: Record<string, {
  label: string;
  summary: string;
  rooms: Array<{ room: string; hazard: string; trapped: number; agency: string; status: "critical" | "warning" | "clear" }>;
  assignments: Array<{ name: string; role: string; status: string }>;
}> = {
  "5F": {
    label: "Fifth Floor",
    summary: "Low occupancy, smoke pockets, and one blocked stairwell near the library wing.",
    rooms: [
      { room: "501 Lab", hazard: "Smoke drift", trapped: 2, agency: "NDRF Unit", status: "warning" },
      { room: "510 Studio", hazard: "Clear", trapped: 0, agency: "Campus EOC", status: "clear" },
      { room: "514 Hall", hazard: "Blocked exit", trapped: 3, agency: "Fire Station #4", status: "critical" },
    ],
    assignments: [
      { name: "Campus EOC", role: "Wardens", status: "Active" },
      { name: "Fire Station #4", role: "Suppression", status: "En Route" },
    ],
  },
  "4F": {
    label: "Fourth Floor",
    summary: "Highest risk floor: heat buildup, trapped students concentrated in the east wing, and a narrow evacuation route.",
    rooms: [
      { room: "402 Lab", hazard: "Fire plume", trapped: 12, agency: "Fire Station #4", status: "critical" },
      { room: "410 Corridor B", hazard: "Smoke-heavy", trapped: 8, agency: "NDRF Unit", status: "warning" },
      { room: "418 Seminar", hazard: "Clear", trapped: 0, agency: "Campus EOC", status: "clear" },
    ],
    assignments: [
      { name: "NDRF Unit", role: "Rescue team", status: "Dispatched" },
      { name: "Fire Station #4", role: "Fire suppression", status: "En Route" },
      { name: "Ambulance EMS", role: "Triage", status: "Standby" },
    ],
  },
  "3F": {
    label: "Third Floor",
    summary: "Stable occupancy, minor smoke trace, and available alternate route near the service stairs.",
    rooms: [
      { room: "302 Admin", hazard: "Clear", trapped: 0, agency: "Campus EOC", status: "clear" },
      { room: "311 Workshop", hazard: "Smoke trace", trapped: 1, agency: "Campus EOC", status: "warning" },
      { room: "316 Lounge", hazard: "Clear", trapped: 0, agency: "NDRF Unit", status: "clear" },
    ],
    assignments: [
      { name: "Campus EOC", role: "Wardens", status: "Active" },
      { name: "NDRF Unit", role: "Sweep", status: "Dispatched" },
    ],
  },
  "2F": {
    label: "Second Floor",
    summary: "Nearly clear. Student movement is steady; no blocked primary exits.",
    rooms: [
      { room: "205 Lecture", hazard: "Clear", trapped: 0, agency: "Campus EOC", status: "clear" },
      { room: "213 Library", hazard: "Clear", trapped: 0, agency: "Campus EOC", status: "clear" },
      { room: "220 Hall", hazard: "Minor congestion", trapped: 2, agency: "NDRF Unit", status: "warning" },
    ],
    assignments: [
      { name: "Campus EOC", role: "Wardens", status: "Active" },
      { name: "Ambulance EMS", role: "Triage", status: "Standby" },
    ],
  },
  "1F": {
    label: "First Floor",
    summary: "Public areas are stable; evacuation volume is manageable with the side exit open.",
    rooms: [
      { room: "105 Atrium", hazard: "Clear", trapped: 0, agency: "Campus EOC", status: "clear" },
      { room: "116 Canteen", hazard: "Congestion", trapped: 3, agency: "Campus EOC", status: "warning" },
      { room: "120 Lobby", hazard: "Clear", trapped: 0, agency: "NDRF Unit", status: "clear" },
    ],
    assignments: [
      { name: "Campus EOC", role: "Traffic control", status: "Active" },
      { name: "NDRF Unit", role: "Sweep", status: "Dispatched" },
    ],
  },
  GF: {
    label: "Ground Floor",
    summary: "Entry control active; most occupants are already routed to assembly zones.",
    rooms: [
      { room: "G02 Main Gate", hazard: "Clear", trapped: 0, agency: "Campus EOC", status: "clear" },
      { room: "G07 Assembly", hazard: "Clear", trapped: 0, agency: "Campus EOC", status: "clear" },
      { room: "G11 Service", hazard: "Blocked", trapped: 2, agency: "Fire Station #4", status: "warning" },
    ],
    assignments: [
      { name: "Campus EOC", role: "Assembly control", status: "Active" },
      { name: "Fire Station #4", role: "Support", status: "En Route" },
    ],
  },
};

export default function CommandPage() {
  const [clock, setClock] = useState("22:42:30");
  const [toast, setToast] = useState<string | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<string | null>("4F");
  const [telemetry, setTelemetry] = useState<CommandTelemetry>(() => ({
    ...getInitialCommandTelemetry(),
    alerts: ALERTS.map((a) => ({ ...a, source: a.source })),
  }));
  const [connectionStatus, setConnectionStatus] = useState<WebSocketConnectionStatus>("disconnected");
  const [voiceOn, setVoiceOn] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const lastSpokenAlertRef = useRef<number | null>(null);

  useEffect(() => {
    setSpeechSupported(isSpeechSupported());
  }, []);

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

  useEffect(() => {
    if (!voiceOn || !telemetry.alerts.length) return;
    const newest = telemetry.alerts[0];
    if (newest.id !== lastSpokenAlertRef.current) {
      lastSpokenAlertRef.current = newest.id;
      speakAlert(newest.id, `${newest.severity} from ${newest.source}: ${newest.message}`);
    }
  }, [voiceOn, telemetry.alerts]);

  useEffect(() => {
    return () => stopSpeaking();
  }, []);

  useEffect(() => {
    // Try real WebSocket first; fall back to BroadcastChannel bus + mock seed.
    const liveStream = createWebSocketTelemetryStream((raw) => {
      const message = raw as WebSocketTelemetryMessage;
      if (message.type === "EMERGENCY_BROADCAST") {
        setTelemetry((previous) => applyEmergencyBroadcast(previous, message as EmergencyBroadcastMessage));
      } else if (message.type === "DRILL_TELEMETRY") {
        setTelemetry((previous) => applyWebSocketTelemetry(previous, message as DrillTelemetryMessage));
      }
    }, {}, setConnectionStatus);

    if (liveStream) return liveStream;

    // Subscribe to client-side BroadcastChannel bus (cross-tab drill telemetry)
    const unsubBus = subscribeDrillEvents((frame: DrillTelemetryFrame) => {
      setTelemetry((previous) =>
        applyWebSocketTelemetry(previous, {
          type: "DRILL_TELEMETRY",
          user_id: frame.user_id,
          floor: frame.floor,
          cell: frame.cell,
          status: frame.status,
        }),
      );
    });

    // Seed with mock data so the dashboard isn't empty before a drill starts
    const unsubMock = createMockTelemetryStream(setTelemetry);

    return () => {
      unsubBus();
      unsubMock();
    };
  }, []);

  const totalStudents = telemetry.floors.reduce((a, f) => a + f.students, 0);
  const totalSafe = telemetry.floors.reduce((a, f) => a + f.safe, 0);
  const totalTrapped = telemetry.floors.reduce((a, f) => a + f.trapped, 0);
  const totalMissing = telemetry.floors.reduce((a, f) => a + f.missing, 0);
  const selectedFloorData = telemetry.floors.find((f) => f.id === selectedFloor) ?? telemetry.floors[0];
  const selectedInspector = FLOOR_INSPECTOR_DATA[selectedFloorData.id] ?? FLOOR_INSPECTOR_DATA["4F"];

  return (
    <div className={styles.page}>
      <Navbar mode="command" />

      {toast && (
        <div className={styles.toast}>
          <span>{toast}</span>
        </div>
      )}

      <div className={styles.dashboard}>
        {/* Top bar */}
        <div className={styles.topBar}>
          <div className={styles.topLeft}>
            <span className={`badge badge-red badge-pulse`}>EMERGENCY MODE</span>
            <span className="mono caption" style={{ color: "var(--text-faint)" }}>Campus Emergency Operations Center</span>
          </div>
          <div className={styles.topRight}>
            <span className={styles.connectionStatus} data-status={telemetry.liveParticipants && Object.keys(telemetry.liveParticipants).length > 0 ? "live" : connectionStatus === "connected" ? "connected" : "mock"}>
              {telemetry.liveParticipants && Object.keys(telemetry.liveParticipants).length > 0 ? "WEBSOCKET LIVE" : connectionStatus === "connected" ? "WEBSOCKET CONNECTED" : "MOCK LINK"}
            </span>
            {speechSupported && (
              <button
                type="button"
                className={`${styles.voiceToggle} ${voiceOn ? styles.voiceToggleOn : ""}`}
                onClick={() => {
                  const next = !voiceOn;
                  setVoiceOn(next);
                  if (!next) {
                    stopSpeaking();
                    lastSpokenAlertRef.current = null;
                  } else if (telemetry.alerts.length) {
                    const a = telemetry.alerts[0];
                    lastSpokenAlertRef.current = a.id;
                    speakAlert(a.id, `${a.severity} from ${a.source}: ${a.message}`);
                  }
                }}
                title={voiceOn ? "Mute emergency voice alerts" : "Enable voice alerts for emergency broadcasts"}
                aria-label={voiceOn ? "Mute emergency voice alerts" : "Enable voice alerts for emergency broadcasts"}
              >
                {voiceOn ? "🔊" : "🔈"}
              </button>
            )}
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
          <div className={`${styles.panel} ${styles.floorMatrixPanel} crt-effect`}>
            <div className={styles.panelHeader}>
              <span className="hud-label">FLOOR STATUS MATRIX</span>
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

          {/* Center: 3D Floor Stack */}
          <div className={`${styles.panel} ${styles.blueprintPanel}`}>
            <div className={styles.panelHeader}>
              <span className="hud-label">FLOOR STACK — LIVE</span>
              <span className="badge badge-red badge-pulse" style={{ fontSize: "0.6rem" }}>LIVE</span>
            </div>
            <FloorStack3D
              telemetry={telemetry}
              selectedFloor={selectedFloor}
              onSelectFloor={(floorId) => {
                setSelectedFloor(floorId);
                showToast(`Floor ${floorId} selected`);
              }}
            />
          </div>

        </div>

        {/* Bottom: floor inspector + alert feed + agencies */}
        <div className={styles.rightCol}>
            <div className={`${styles.panel} ${styles.floorInspector}`}>
              <div className={styles.panelHeader}>
                <span className="hud-label">FLOOR INSPECTOR</span>
                <span className="mono caption" style={{ color: "var(--accent-teal)" }}>{selectedFloorData.id}</span>
              </div>

              <div className={styles.inspectorBody}>
                <div className={styles.inspectorSummary}>
                  <div>
                    <span className="hud-label">Selected zone</span>
                    <h3>{selectedInspector.label}</h3>
                  </div>
                  <div className={styles.summaryBadge}>
                    {selectedFloorData.trapped} trapped
                  </div>
                </div>

                <p className={styles.inspectorText}>{selectedInspector.summary}</p>

                <div className={styles.roomList}>
                  {selectedInspector.rooms.map((room) => (
                    <div key={room.room} className={`${styles.roomCard} ${styles[`room-${room.status}`]}`}>
                      <div className={styles.roomHeader}>
                        <span className={styles.roomName}>{room.room}</span>
                        <span className={styles.roomHazard}>{room.hazard}</span>
                      </div>
                      <div className={styles.roomMeta}>
                        <span>{room.trapped} trapped students</span>
                        <span>{room.agency}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className={styles.assignmentWrap}>
                  <span className="hud-label">Active agency assignments</span>
                  <div className={styles.assignmentList}>
                    {selectedInspector.assignments.map((assignment) => (
                      <div key={assignment.name} className={styles.assignmentItem}>
                        <div>
                          <span className={styles.assignmentName}>{assignment.name}</span>
                          <span className={styles.assignmentRole}>{assignment.role}</span>
                        </div>
                        <span className={`badge badge-${assignment.status === "Active" ? "teal" : assignment.status === "Dispatched" ? "blue" : assignment.status === "En Route" ? "amber" : "violet"}`}>
                          {assignment.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className={`${styles.panel} ${styles.alertPanel}`}>
              <div className={styles.panelHeader}>
                <span className="hud-label">CAP ALERT FEED</span>
              </div>
              <div className={styles.alertFeed}>
                {telemetry.alerts.map((a) => (
                  <div
                    key={a.id}
                    className={`${styles.alertItem} ${styles[`alert-${a.color}`]}`}
                    onClick={() => showToast(`[${a.source}] ${a.message}`)}
                    role="button"
                    tabIndex={0}
                    style={{ cursor: "pointer" }}
                  >
                    <span className={`mono ${styles.alertTime}`}>{a.time}</span>
                    <span className={`badge badge-${a.color} ${styles.alertSev}`}>{a.severity}</span>
                    <span className={styles.alertSrc}>{a.source}</span>
                    <p className={styles.alertMsg}>{a.message}</p>
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
