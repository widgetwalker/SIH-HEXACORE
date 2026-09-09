/**
 * Multi-user cadet profile system.
 *
 * Every registered user gets their own localStorage namespace so progress,
 * settings, and quiz scores are fully isolated. The "active" user is tracked
 * by a single key; logging out just clears that pointer without deleting any
 * data, so returning users can pick their profile back up.
 *
 * Storage layout:
 *   safezone_all_users          → CadetProfile[]   (every registered user)
 *   safezone_active_user_id     → string | null     (cadet-ID of the signed-in user)
 *   safezone_user_{id}_scores   → Record<number, Record<string, number>>
 *   safezone_user_{id}_settings → CadetSettings
 *   safezone_user_{id}_quiz     → Record<string, Record<number, number>>
 */

export interface CadetProfile {
  id: string;
  name: string;
  age: number;
  grade: string;
  school: string;
  tierId: number;
  tierName: string;
  avatarId: string;
  avatarImage?: string;
  createdAt: number;
}

export const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000").replace(/\/$/, "");

export function isUuid(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

// ── Keys ──────────────────────────────────────────────────────────────────

const ALL_USERS_KEY = "safezone_all_users";
const ACTIVE_USER_KEY = "safezone_active_user_id";

/** Per-user storage key helpers */
export function userScoresKey(id: string): string {
  return `safezone_user_${id}_scores`;
}
export function userSettingsKey(id: string): string {
  return `safezone_user_${id}_settings`;
}
export function userQuizKey(id: string): string {
  return `safezone_user_${id}_quiz`;
}

// ── Events ────────────────────────────────────────────────────────────────

export const CADET_PROFILE_EVENT = "safezone-cadet-profile-updated";

// ── Tier mapping ──────────────────────────────────────────────────────────

const TIER_BANDS: { maxAge: number; tierId: number; tierName: string }[] = [
  { maxAge: 7, tierId: 1, tierName: "Explorers" },
  { maxAge: 10, tierId: 2, tierName: "Rangers" },
  { maxAge: 13, tierId: 3, tierName: "Guardians" },
  { maxAge: 17, tierId: 4, tierName: "Sentinels" },
  { maxAge: Infinity, tierId: 5, tierName: "Wardens" },
];

export function mapAgeToTier(age: number): { tierId: number; tierName: string } {
  const band = TIER_BANDS.find((b) => age <= b.maxAge) ?? TIER_BANDS[TIER_BANDS.length - 1];
  return { tierId: band.tierId, tierName: band.tierName };
}

// ── Read helpers ──────────────────────────────────────────────────────────

export function getActiveUserId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACTIVE_USER_KEY) || null;
}

export function loadAllUsers(): CadetProfile[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(ALL_USERS_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as CadetProfile[];
  } catch {
    return [];
  }
}

export function loadCadetProfile(): CadetProfile | null {
  const activeId = getActiveUserId();
  if (!activeId) return null;
  const users = loadAllUsers();
  return users.find((u) => u.id === activeId) ?? null;
}

export interface LeaderboardUser {
  id: string;
  full_name: string;
  grade?: string | null;
  school?: string | null;
  avatar_id?: string | null;
  avatar_image?: string | null;
  score_percentage: number;
  completed_modules: number;
  total_modules: number;
}

export async function fetchLeaderboard(): Promise<LeaderboardUser[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/users/leaderboard`);
    if (res.ok) {
      return (await res.json()) as LeaderboardUser[];
    }
  } catch (err) {
    console.error("Failed to fetch leaderboard from backend:", err);
  }
  return [];
}

// ── Write helpers ─────────────────────────────────────────────────────────

function generateCadetId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Register or update a cadet profile.
 *
 * - If no active user exists, creates a new one and sets them active.
 * - If an active user exists, updates their record in-place.
 * - Adds to the global user list if the ID is new.
 * - Syncs to the FastAPI backend database.
 */
export async function saveCadetProfile(input: {
  name: string;
  age: number;
  grade: string;
  school: string;
  avatarId?: string;
  avatarImage?: string;
}): Promise<CadetProfile> {
  const { tierId, tierName } = mapAgeToTier(input.age);
  const existing = loadCadetProfile();
  const profile: CadetProfile = {
    id: existing?.id ?? generateCadetId(), // Always a standard UUID
    name: input.name.trim(),
    age: input.age,
    grade: input.grade.trim(),
    school: input.school.trim(),
    tierId,
    tierName,
    avatarId: input.avatarId ?? existing?.avatarId ?? "shield",
    avatarImage: input.avatarImage ?? existing?.avatarImage,
    createdAt: existing?.createdAt ?? Date.now(),
  };

  try {
    const payload = {
      full_name: profile.name,
      role: "STUDENT",
      grade: profile.grade,
      school: profile.school,
      avatar_id: profile.avatarId,
      avatar_image: profile.avatarImage,
      age: profile.age,
      tier_scores: loadActiveTierScores(), // Send current scores if updating
    };

    if (existing && isUuid(existing.id)) {
      // It's a UUID, so update existing user
      await fetch(`${BACKEND_URL}/api/v1/users/${existing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      // New user or legacy CADET-xxxx ID
      const res = await fetch(`${BACKEND_URL}/api/v1/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        profile.id = data.id; // Use DB UUID
        profile.createdAt = new Date(data.created_at).getTime();
      }
    }
  } catch (err) {
    console.error("Failed to sync profile to backend", err);
  }

  if (typeof window !== "undefined") {
    try {
      // Update global user list (local cache)
      const users = loadAllUsers();
      // Remove legacy ID if we just got a UUID
      const cleanUsers = users.filter((u) => u.id !== existing?.id);
      const idx = cleanUsers.findIndex((u) => u.id === profile.id);
      if (idx >= 0) {
        cleanUsers[idx] = profile;
      } else {
        cleanUsers.push(profile);
      }
      window.localStorage.setItem(ALL_USERS_KEY, JSON.stringify(cleanUsers));

      // Set as active user
      window.localStorage.setItem(ACTIVE_USER_KEY, profile.id);

      window.dispatchEvent(new Event(CADET_PROFILE_EVENT));
    } catch {
      /* storage unavailable - non-fatal */
    }
  }
  return profile;
}

/**
 * Update only avatar fields for the active user.
 */
export async function updateAvatar(avatarId: string, avatarImage?: string): Promise<CadetProfile | null> {
  const profile = loadCadetProfile();
  if (!profile) return null;
  return await saveCadetProfile({
    ...profile,
    avatarId,
    avatarImage,
  });
}

// ── User switching ────────────────────────────────────────────────────────

/**
 * Log out the current user. Does NOT delete any data — just clears the
 * active-user pointer so the onboarding gate reappears.
 */
export function logoutUser(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ACTIVE_USER_KEY);
  window.dispatchEvent(new Event(CADET_PROFILE_EVENT));
}

/**
 * Switch to a previously registered user by their cadet ID.
 */
export function switchToUser(id: string): CadetProfile | null {
  const users = loadAllUsers();
  const match = users.find((u) => u.id === id);
  if (!match) return null;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(ACTIVE_USER_KEY, id);
    window.dispatchEvent(new Event(CADET_PROFILE_EVENT));
  }
  return match;
}

// ── Per-user data helpers (used by LearnPage, ProfilePage, etc.) ──────────

/**
 * Load tier scores for a specific user. Falls back to empty object.
 */
export function loadUserTierScores(userId: string): Record<number, Record<string, number>> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(userScoresKey(userId));
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return {};
    return parsed as Record<number, Record<string, number>>;
  } catch {
    return {};
  }
}

/**
 * Save tier scores for a specific user.
 */
export async function saveUserTierScores(userId: string, scores: Record<number, Record<string, number>>): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(userScoresKey(userId), JSON.stringify(scores));
    if (isUuid(userId)) {
      await fetch(`${BACKEND_URL}/api/v1/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier_scores: scores }),
      });
    }
  } catch (err) {
    console.error("Failed to sync tier scores", err);
  }
}

/**
 * Load tier scores for the currently active user.
 */
export function loadActiveTierScores(): Record<number, Record<string, number>> {
  const id = getActiveUserId();
  if (!id) return {};
  return loadUserTierScores(id);
}

/**
 * Save tier scores for the currently active user.
 */
export async function saveActiveTierScores(scores: Record<number, Record<string, number>>): Promise<void> {
  const id = getActiveUserId();
  if (!id) return;
  await saveUserTierScores(id, scores);
}
