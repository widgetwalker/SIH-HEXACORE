export const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000").replace(/\/$/, "");

export interface LiveAlert {
  id: string;
  source: string;
  category: string;
  severity: string;
  headline: string;
  detail: string;
  occurred_at: string;
}

export async function fetchLiveAlerts(): Promise<LiveAlert[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/alerts/live`);
    if (!res.ok) return [];
    const data: unknown = await res.json();
    return Array.isArray(data) ? (data as LiveAlert[]) : [];
  } catch {
    return [];
  }
}

export type IncidentType = "electrical-fire" | "chemical-spill" | "gas-leak";

export const INCIDENT_PRESETS: { type: IncidentType; label: string; location: string; icon: string }[] = [
  { type: "electrical-fire", label: "Electrical Transformer Fire", location: "Ground Floor Lobby", icon: "🔥" },
  { type: "chemical-spill", label: "Chemical Lab Spill", location: "Science Block, Floor 2", icon: "🧪" },
  { type: "gas-leak", label: "Gas Leak", location: "Near Staircase B", icon: "☢️" },
];

/** Map frontend incident types to backend incident types */
const BACKEND_INCIDENT_TYPE: Record<IncidentType, string> = {
  "electrical-fire": "transformer_fire",
  "chemical-spill": "chemical_spill",
  "gas-leak": "gas_leak",
};

/**
 * Inject an incident via the backend Incident Injection Deck API.
 * Sends full payload to /api/v1/incidents/inject which broadcasts
 * via WebSocket and optionally persists to the database.
 */
export async function injectIncident(incidentType: IncidentType): Promise<boolean> {
  try {
    const preset = INCIDENT_PRESETS.find((p) => p.type === incidentType);
    if (!preset) return false;

    const campusId = process.env.NEXT_PUBLIC_CAMPUS_ID ?? "campus-123";
    const backendType = BACKEND_INCIDENT_TYPE[incidentType];

    const res = await fetch(`${BACKEND_URL}/api/v1/incidents/inject`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        incident_type: backendType,
        title: preset.label,
        detail: preset.location,
        severity: "CRITICAL",
        floor: null,
        campus_id: campusId,
        persist: true,
      }),
    });

    return res.ok;
  } catch {
    return false;
  }
}
