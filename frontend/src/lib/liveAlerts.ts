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

export const INCIDENT_PRESETS: { type: IncidentType; label: string; location: string; icon: string; voiceMessage: string }[] = [
  {
    type: "storm-cyclone",
    label: "Severe Cyclone / Gale Surge",
    location: "Coastal Campus Perimeter",
    icon: "🌀",
    voiceMessage: "Severe Cyclone Warning in Coastal Campus Perimeter. Move indoors immediately. Stay away from glass windows, exterior doors, and sheet roofing. Shelter in interior hallways.",
  },
  {
    type: "flash-flood",
    label: "Flash Flood / Cloudburst",
    location: "Campus Ground & Drainage Corridor",
    icon: "🌊",
    voiceMessage: "Torrential Flash Flood in Ground and Drainage Corridor. Move to upper floors immediately. Do not step into moving water. Avoid basement classrooms.",
  },
  {
    type: "earthquake-drill",
    label: "M6.2 Seismic Tremor & Structural Breach",
    location: "Academic Blocks A & B",
    icon: "⚡",
    voiceMessage: "Earthquake tremor detected in Academic Blocks A and B. Drop, Cover, and Hold on under sturdy desks. Protect your head. After shaking stops, evacuate using marked stairways.",
  },
  {
    type: "tsunami-warning",
    label: "Tsunami Inundation Warning",
    location: "Bay of Bengal Coastal Sector",
    icon: "🌊",
    voiceMessage: "Tsunami Inundation Warning for Coastal Sector. Evacuate immediately to designated high-ground muster points or vertical evacuation structures at least 3 stories high.",
  },
  {
    type: "electrical-fire",
    label: "Electrical Transformer Fire",
    location: "Ground Floor Lobby",
    icon: "🔥",
    voiceMessage: "Electrical Transformer Fire in Ground Floor Lobby. Evacuate through alternate stairwells immediately. Stay low beneath the smoke. Do not use elevators.",
  },
  {
    type: "chemical-spill",
    label: "Chemical Lab Spill",
    location: "Science Block, Floor 2",
    icon: "🧪",
    voiceMessage: "Hazardous Chemical Spill on Science Block Floor 2. Evacuate upwind immediately. Cover nose and mouth with a damp cloth. Do not inhale chemical fumes.",
  },
  {
    type: "gas-leak",
    label: "Gas Leak Hazard",
    location: "Near Staircase B",
    icon: "☣️",
    voiceMessage: "Combustible Gas Leak detected near Staircase B. Extinguish all open flames immediately. Do not touch electrical switches. Evacuate to outdoor assembly grounds.",
  },
];

export async function injectIncident(incidentType: IncidentType): Promise<boolean> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/webhooks/inject-incident`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        incident_type: incidentType,
        campus_id: process.env.NEXT_PUBLIC_CAMPUS_ID ?? "CAMPUS-01",
      }),
    });
    if (res.ok) {
      if (typeof window !== "undefined") {
        const preset = INCIDENT_PRESETS.find((p) => p.type === incidentType);
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

