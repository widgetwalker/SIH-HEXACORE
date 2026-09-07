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

export interface LocationPreset {
  id: string;
  name: string;
  lat: number;
  lon: number;
  state: string;
}

export const DEFAULT_COORDS: LocationPreset = {
  id: "puducherry",
  name: "Puducherry Campus (Default)",
  lat: 11.9416,
  lon: 79.8083,
  state: "Puducherry",
};

export const PRESET_LOCATIONS: LocationPreset[] = [
  DEFAULT_COORDS,
  { id: "karaikal", name: "Karaikal Campus", lat: 10.9254, lon: 79.8380, state: "Puducherry" },
  { id: "chennai", name: "Chennai Coastal", lat: 13.0827, lon: 80.2707, state: "Tamil Nadu" },
  { id: "bengaluru", name: "Bengaluru Tech Hub", lat: 12.9716, lon: 77.5946, state: "Karnataka" },
  { id: "mumbai", name: "Mumbai Harbor", lat: 18.9220, lon: 72.8347, state: "Maharashtra" },
  { id: "delhi", name: "New Delhi NCR", lat: 28.6139, lon: 77.2090, state: "Delhi" },
  { id: "dehradun", name: "Dehradun (Seismic Zone IV)", lat: 30.3165, lon: 78.0322, state: "Uttarakhand" },
];

export async function fetchLiveAlerts(lat: number = DEFAULT_COORDS.lat, lon: number = DEFAULT_COORDS.lon): Promise<LiveAlert[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/alerts/live?lat=${lat}&lon=${lon}`);
    if (!res.ok) return [];
    const data: unknown = await res.json();
    if (!Array.isArray(data)) return [];

    return data.map((item: Record<string, unknown>, idx: number) => {
      const id = String(item.id ?? item.cap_identifier ?? `live-alert-${idx}-${Date.now()}`);
      const source = String(item.sender ?? item.source ?? "NDMA-CAP");
      const category = String(item.event_category ?? item.category ?? "hazard");
      const severity = String(item.severity ?? "Advisory");
      const headline = String(item.headline ?? "Active Incident Notice");
      const detail = String(item.description ?? item.detail ?? "");
      const occurred_at = String(item.sent_at ?? item.occurred_at ?? new Date().toISOString());

      return {
        id,
        source,
        category,
        severity,
        headline,
        detail,
        occurred_at,
      };
    });
  } catch {
    return [];
  }
}

export type IncidentType =
  | "electrical-fire"
  | "chemical-spill"
  | "gas-leak"
  | "storm-cyclone"
  | "flash-flood"
  | "earthquake-drill"
  | "tsunami-warning";

export const CAMPUS_EMERGENCY_EVENT = "campus_emergency_alert";

export const INCIDENT_PRESETS: { type: IncidentType; label: string; location: string; icon: string }[] = [
  { type: "storm-cyclone", label: "Severe Cyclone / Gale Surge", location: "Coastal Campus Perimeter", icon: "🌀" },
  { type: "flash-flood", label: "Flash Flood / Cloudburst", location: "Campus Ground & Drainage Corridor", icon: "🌊" },
  { type: "earthquake-drill", label: "M6.2 Seismic Tremor & Structural Breach", location: "Academic Blocks A & B", icon: "⚡" },
  { type: "tsunami-warning", label: "Tsunami Inundation Warning", location: "Bay of Bengal Coastal Sector", icon: "🌊" },
  { type: "electrical-fire", label: "Electrical Transformer Fire", location: "Ground Floor Lobby", icon: "🔥" },
  { type: "chemical-spill", label: "Chemical Lab Spill", location: "Science Block, Floor 2", icon: "🧪" },
  { type: "gas-leak", label: "Gas Leak Hazard", location: "Near Staircase B", icon: "☣️" },
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
    if (res.ok) {
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent(CAMPUS_EMERGENCY_EVENT, {
            detail: {
              incidentType,
              label: preset?.label ?? incidentType,
              location: preset?.location ?? "Campus",
              severity: "Extreme",
            },
          })
        );
      }
      return true;
    }
    return false;
  } catch {
    return false;
  }
}


