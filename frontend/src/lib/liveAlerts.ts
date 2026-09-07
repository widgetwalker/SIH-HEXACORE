export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";

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

export async function injectIncident(incidentType: IncidentType): Promise<boolean> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/webhooks/inject-incident`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ incident_type: incidentType }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
