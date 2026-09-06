/**
 * Shared cadet profile types used across onboarding, profile view, and learn page.
 * Reuses CadetFormData from the onboarding modal to ensure consistency.
 */

export interface CadetProfile {
  name: string;
  age: number;
  grade: string;
  school: string;
  tierId: number;
  tierName: string;
  avatarId: string;
  avatarImage?: string;
}

export const CADET_PROFILE_KEY = "safezone_cadet_profile_v1";
export const CADET_PROFILE_UPDATED_EVENT = "safezone:cadet-profile-updated";
export const DEFAULT_AVATAR_ID = "shield";

export interface ProfileAvatarDefinition {
  id: string;
  label: string;
  accent: string;
  secondary: string;
}

/** Built-in vector avatars. They stay crisp at every size and require no asset download. */
export const PROFILE_AVATARS: ProfileAvatarDefinition[] = [
  { id: "shield", label: "Shield", accent: "#00D4AA", secondary: "#3B82F6" },
  { id: "compass", label: "Compass", accent: "#F59E0B", secondary: "#EF4444" },
  { id: "summit", label: "Summit", accent: "#8B5CF6", secondary: "#3B82F6" },
  { id: "signal", label: "Signal", accent: "#22D3EE", secondary: "#2563EB" },
  { id: "ember", label: "Ember", accent: "#FB7185", secondary: "#F59E0B" },
  { id: "orbit", label: "Orbit", accent: "#A78BFA", secondary: "#00D4AA" },
];

/**
 * Load cadet profile from localStorage.
 * Returns null if no profile exists or data is corrupted.
 */
export function loadCadetProfile(): CadetProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CADET_PROFILE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return null;
    }
    const profile = parsed as Partial<CadetProfile>;
    // Validate required fields
    if (!profile.name || !profile.age || !profile.grade || !profile.school || !profile.tierId || !profile.tierName) {
      return null;
    }
    return {
      ...profile,
      avatarId: profile.avatarId || DEFAULT_AVATAR_ID,
    } as CadetProfile;
  } catch {
    return null;
  }
}

/**
 * Save cadet profile to localStorage.
 */
export function saveCadetProfile(profile: CadetProfile): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CADET_PROFILE_KEY, JSON.stringify(profile));
    window.dispatchEvent(new CustomEvent<CadetProfile>(CADET_PROFILE_UPDATED_EVENT, { detail: profile }));
  } catch {
    // Storage full or unavailable - non-fatal
    console.warn("Failed to save cadet profile to localStorage");
  }
}
