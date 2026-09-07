import { getActiveUserId, userSettingsKey } from "./cadetProfile";

export interface CadetSettings {
  drillSiren: boolean;
  mitraVoiceLang: string;
  reducedMotion: boolean;
  emergencyContactName: string;
  emergencyContactPhone: string;
}

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
  const userId = getActiveUserId();
  if (!userId) return DEFAULT_SETTINGS;
  try {
    const raw = window.localStorage.getItem(userSettingsKey(userId));
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
  const userId = getActiveUserId();
  if (!userId) return;
  try {
    window.localStorage.setItem(userSettingsKey(userId), JSON.stringify(settings));
  } catch {
    /* storage unavailable - non-fatal */
  }
  applyReducedMotion(settings.reducedMotion);
}

export function applyReducedMotion(enabled: boolean) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.reducedMotion = enabled ? "true" : "false";
}
