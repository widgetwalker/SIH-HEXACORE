export interface CadetProfile {
  id: string;
  name: string;
  age: number;
  grade: string;
  school: string;
  tierId: number;
  tierName: string;
  createdAt: number;
}

const STORAGE_KEY = "safezone_cadet_profile";
export const CADET_PROFILE_EVENT = "safezone-cadet-profile-updated";

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

export function loadCadetProfile(): CadetProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return null;
    return parsed as CadetProfile;
  } catch {
    return null;
  }
}

function generateCadetId(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `CADET-${year}-${rand}`;
}

export function saveCadetProfile(input: { name: string; age: number; grade: string; school: string }): CadetProfile {
  const { tierId, tierName } = mapAgeToTier(input.age);
  const existing = loadCadetProfile();
  const profile: CadetProfile = {
    id: existing?.id ?? generateCadetId(),
    name: input.name.trim(),
    age: input.age,
    grade: input.grade.trim(),
    school: input.school.trim(),
    tierId,
    tierName,
    createdAt: existing?.createdAt ?? Date.now(),
  };
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      window.dispatchEvent(new Event(CADET_PROFILE_EVENT));
    } catch {
      /* storage unavailable - non-fatal, profile just won't persist */
    }
  }
  return profile;
}
