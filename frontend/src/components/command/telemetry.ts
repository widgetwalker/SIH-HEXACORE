export type FloorStatus = "safe" | "clear" | "warning" | "danger";

export interface FloorTelemetry {
  id: string;
  students: number;
  safe: number;
  trapped: number;
  missing: number;
  status: FloorStatus;
}

export type AlertSeverity = "Extreme" | "Warning" | "Alert" | "Info";

export interface CommandAlert {
  id: number;
  time: string;
  severity: AlertSeverity;
  source: string;
  message: string;
  color: "red" | "amber" | "blue";
}

export interface AgencyTelemetry {
  name: string;
  status: "Active" | "Dispatched" | "En Route" | "Standby";
  role: string;
  color: "teal" | "blue" | "amber" | "violet";
}

export interface CommandTelemetry {
  floors: FloorTelemetry[];
  alerts: CommandAlert[];
  agencies: AgencyTelemetry[];
  emergencyMode: boolean;
  receivedAt: number;
  source: "mock" | "websocket";
  liveParticipants?: Record<string, { floorId: string; category: "safe" | "trapped" | "missing"; lastSeen: number }>;
}

export interface DrillTelemetryMessage {
  type: "DRILL_TELEMETRY";
  user_id: string;
  floor: number;
  cell: [number, number];
  status: string;
}

export interface EmergencyBroadcastMessage {
  type: "EMERGENCY_BROADCAST";
  severity: string;
  msg: string;
}

export type WebSocketTelemetryMessage = DrillTelemetryMessage | EmergencyBroadcastMessage;

export type WebSocketConnectionStatus = "connected" | "disconnected";

const initialFloors: FloorTelemetry[] = [
  { id: "5F", students: 45, safe: 38, trapped: 2, missing: 5, status: "warning" },
  { id: "4F", students: 52, safe: 12, trapped: 8, missing: 32, status: "danger" },
  { id: "3F", students: 60, safe: 55, trapped: 0, missing: 5, status: "warning" },
  { id: "2F", students: 48, safe: 48, trapped: 0, missing: 0, status: "clear" },
  { id: "1F", students: 55, safe: 55, trapped: 0, missing: 0, status: "clear" },
  { id: "GF", students: 40, safe: 40, trapped: 0, missing: 0, status: "safe" },
];

export function getInitialCommandTelemetry(): CommandTelemetry {
  return {
    floors: initialFloors,
    alerts: [
      { id: 1, time: "22:41:03", severity: "Extreme", source: "SACHET", message: "Earthquake M5.2 - Epicenter 12km NW of campus. Aftershocks expected.", color: "red" },
      { id: 2, time: "22:41:18", severity: "Warning", source: "IMD", message: "Flash flood warning - Heavy rainfall 80mm/hr forecast next 2 hours.", color: "amber" },
      { id: 3, time: "22:42:05", severity: "Alert", source: "Campus IoT", message: "Smoke detector triggered - Building A, Floor 4, Room 402.", color: "amber" },
      { id: 4, time: "22:42:30", severity: "Info", source: "System", message: "Automatic mode switch: Learning → Emergency Mode activated.", color: "blue" },
    ],
    agencies: [
      { name: "Campus EOC", status: "Active", role: "Principal / Wardens", color: "teal" },
      { name: "NDRF Unit", status: "Dispatched", role: "Search & Rescue", color: "blue" },
      { name: "Fire Station #4", status: "En Route", role: "Fire Suppression", color: "amber" },
      { name: "Ambulance EMS", status: "Standby", role: "Medical Triage", color: "violet" },
    ],
    emergencyMode: true,
    receivedAt: Date.now(),
    source: "mock",
  };
}

function nextSnapshot(previous: CommandTelemetry): CommandTelemetry {
  const floors = previous.floors.map((floor) => {
    if (floor.id !== "4F" || floor.missing === 0) return floor;

    const movedToSafe = floor.missing > 0 && floor.safe < floor.students ? 1 : 0;
    const nextMissing = floor.missing - movedToSafe;
    const nextSafe = floor.safe + movedToSafe;
    const nextStatus: FloorStatus = floor.trapped > 0 ? "danger" : "warning";
    return {
      ...floor,
      safe: nextSafe,
      missing: nextMissing,
      status: nextStatus,
    };
  });

  return {
    ...previous,
    floors,
    receivedAt: Date.now(),
    source: "mock",
  };
}

export function createMockTelemetryStream(onUpdate: (snapshot: CommandTelemetry) => void): () => void {
  let snapshot: CommandTelemetry = {
    ...getInitialCommandTelemetry(),
  };

  const interval = window.setInterval(() => {
    snapshot = nextSnapshot(snapshot);
    onUpdate(snapshot);
  }, 3500);

  return () => window.clearInterval(interval);
}

function floorIdForNumber(floor: number): string {
  return floor === 0 ? "GF" : `${floor}F`;
}

function categoryForStatus(status: string): "safe" | "trapped" | "missing" {
  if (["EVACUATED_SAFE", "SAFE", "EVACUATED"].includes(status)) return "safe";
  if (["VIRTUAL_CASUALTY", "CASUALTY", "TRAPPED"].includes(status)) return "trapped";
  return "missing";
}

// Participants that haven't sent telemetry in this window are considered stale.
const STALE_PARTICIPANT_MS = 10_000;

export function applyWebSocketTelemetry(
  previous: CommandTelemetry,
  message: WebSocketTelemetryMessage,
): CommandTelemetry {
  const floorId = floorIdForNumber(message.floor);
  const category = categoryForStatus(message.status);
  const participants = { ...(previous.liveParticipants ?? {}) };
  const prior = participants[message.user_id];
  const now = Date.now();
  participants[message.user_id] = { floorId, category, lastSeen: now };

  // Prune participants that haven't reported in STALE_PARTICIPANT_MS
  for (const [uid, info] of Object.entries(participants)) {
    if (now - info.lastSeen > STALE_PARTICIPANT_MS) {
      delete participants[uid];
    }
  }

  const floors = previous.floors.map((floor) => {
    let next = { ...floor };
    if (prior && prior.floorId === floor.id) {
      next[prior.category] = Math.max(0, next[prior.category] - 1);
    }
    if (floor.id === floorId) {
      next[category] = Math.min(next.students, next[category] + 1);
    }
    const accounted = next.safe + next.trapped + next.missing;
    next.missing += Math.max(0, next.students - accounted);
    next.status = next.trapped > 0 ? "danger" : next.missing > 0 ? "warning" : "clear";
    return next;
  });

  return { ...previous, floors, liveParticipants: participants, receivedAt: now, source: "websocket" };
}

function severityToColor(severity: string): "red" | "amber" | "blue" {
  const s = severity.toUpperCase();
  if (s === "EXTREME" || s === "SEVERE") return "red";
  if (s === "WARNING" || s === "MODERATE") return "amber";
  return "blue";
}

let _alertIdCounter = 100;

export function applyEmergencyBroadcast(
  previous: CommandTelemetry,
  message: EmergencyBroadcastMessage,
): CommandTelemetry {
  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
  const alert: CommandAlert = {
    id: ++_alertIdCounter,
    time: timeStr,
    severity: message.severity as AlertSeverity,
    source: "CAP",
    message: message.msg,
    color: severityToColor(message.severity),
  };
  return {
    ...previous,
    alerts: [alert, ...previous.alerts].slice(0, 20),
    emergencyMode: true,
    receivedAt: Date.now(),
    source: "websocket",
  };
}

export function createWebSocketTelemetryStream(
  onMessage: (message: WebSocketTelemetryMessage) => void,
  options: { url?: string; token?: string; campusId?: string } = {},
  onConnectionChange?: (status: WebSocketConnectionStatus) => void,
): (() => void) | null {
  const url = options.url ?? process.env.NEXT_PUBLIC_WS_URL;
  const token = options.token ?? process.env.NEXT_PUBLIC_WS_TOKEN;
  const campusId = options.campusId ?? process.env.NEXT_PUBLIC_CAMPUS_ID ?? "CAMPUS-01";
  if (!url || !token || typeof window === "undefined" || !window.WebSocket) return null;

  let socket: WebSocket | null = null;
  let cancelled = false;

  // Defer socket creation by one tick so React Strict Mode's
  // cleanup-before-open doesn't close a half-open socket.
  const timer = setTimeout(() => {
    if (cancelled) return;
    socket = new WebSocket(`${url.replace(/\/$/, "")}?token=${encodeURIComponent(token)}`);
    socket.addEventListener("open", () => {
      onConnectionChange?.("connected");
      socket?.send(JSON.stringify({ type: "JOIN_CAMPUS", campus_id: campusId }));
    });
    socket.addEventListener("close", () => onConnectionChange?.("disconnected"));
    socket.addEventListener("message", (event) => {
      try {
        const message = JSON.parse(event.data) as Partial<WebSocketTelemetryMessage>;
        if (
          message.type === "DRILL_TELEMETRY" &&
          typeof message.user_id === "string" &&
          typeof message.floor === "number" &&
          Array.isArray(message.cell) &&
          message.cell.length === 2 &&
          typeof message.status === "string"
        ) {
          onMessage(message as WebSocketTelemetryMessage);
        } else if (
          message.type === "EMERGENCY_BROADCAST" &&
          typeof message.severity === "string" &&
          typeof message.msg === "string"
        ) {
          onMessage(message as WebSocketTelemetryMessage);
        }
      } catch {
        // Ignore malformed frames; the backend validates client messages.
      }
    });
  }, 0);

  return () => {
    cancelled = true;
    clearTimeout(timer);
    socket?.close();
  };
}
