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
}

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
    return {
      ...floor,
      safe: nextSafe,
      missing: nextMissing,
      status: (floor.trapped > 0 ? "danger" : "warning") as FloorStatus,
    };
  });

  return { ...previous, floors, receivedAt: Date.now(), source: "mock" };
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
