export interface CadetSettings {
  drillSiren: boolean;
  mitraVoiceLang: string;
  reducedMotion: boolean;
  emergencyContactName: string;
  emergencyContactPhone: string;
}

const STORAGE_KEY = "safezone_settings_v1";

export const DEFAULT_SETTINGS: CadetSettings = {
  drillSiren: true,
  mitraVoiceLang: "en-IN",
  reducedMotion: false,
  emergencyContactName: "",
  emergencyContactPhone: "",
};

export const MITRA_VOICE_LANGUAGES = [
  { code: "en-IN", label: "English (India)" },
  { code: "hi-IN", label: "Hindi" },
  { code: "en-US", label: "English (US)" },
  { code: "ta-IN", label: "Tamil" },
  { code: "te-IN", label: "Telugu" },
  { code: "bn-IN", label: "Bengali" },
];

export function loadCadetSettings(): CadetSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...(parsed as Partial<CadetSettings>) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveCadetSettings(settings: CadetSettings) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    /* storage unavailable - non-fatal */
  }
  applyReducedMotion(settings.reducedMotion);
}

export function applyReducedMotion(enabled: boolean) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.reducedMotion = enabled ? "true" : "false";
}
