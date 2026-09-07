import { EXPLORERS_MODULE_1, EXPLORERS_MODULE_2, EXPLORERS_MODULE_3, EXPLORERS_MODULE_4 } from "./content/explorers";
import { RANGERS_MODULE_1, RANGERS_MODULE_2, RANGERS_MODULE_3, RANGERS_MODULE_4, RANGERS_MODULE_5, RANGERS_MODULE_6 } from "./content/rangers";
import { GUARDIANS_MODULE_1, GUARDIANS_MODULE_2, GUARDIANS_MODULE_3, GUARDIANS_MODULE_4, GUARDIANS_MODULE_5, GUARDIANS_MODULE_6 } from "./content/guardians";
import { SENTINELS_MODULE_1, SENTINELS_MODULE_2, SENTINELS_MODULE_3, SENTINELS_MODULE_4, SENTINELS_MODULE_5, SENTINELS_MODULE_6 } from "./content/sentinels";
import { WARDENS_MODULE_1, WARDENS_MODULE_2, WARDENS_MODULE_3, WARDENS_MODULE_4, WARDENS_MODULE_5, WARDENS_MODULE_6 } from "./content/wardens";
import type { TierModuleContent } from "./types";

export const EXPLORERS_TIER_ID = 1;
export const RANGERS_TIER_ID = 2;
export const GUARDIANS_TIER_ID = 3;
export const SENTINELS_TIER_ID = 4;
export const WARDENS_TIER_ID = 5;
export const ALL_TIER_IDS = [EXPLORERS_TIER_ID, RANGERS_TIER_ID, GUARDIANS_TIER_ID, SENTINELS_TIER_ID, WARDENS_TIER_ID];

export const TIER_NAMES: Record<number, string> = {
  [EXPLORERS_TIER_ID]: "Explorers",
  [RANGERS_TIER_ID]: "Rangers",
  [GUARDIANS_TIER_ID]: "Guardians",
  [SENTINELS_TIER_ID]: "Sentinels",
  [WARDENS_TIER_ID]: "Wardens",
};

/* Real content per tier, in unlock order, keyed by tier id. `prefix` matches
   each module's own id prefix (e.g. "guardians-m1") so it can be matched
   against the mock MODULES list's plain ids ("m1"). All 5 tiers are wired
   up (49/49 modules): Explorers/Rangers verbatim from
   safezone-explorers-rangers-modules.pdf, Guardians/Sentinels/Wardens from
   docs/10_TIER_GAMES_SPECIFICATION.md. */
export const TIER_GAME_CONFIG: Record<number, { prefix: string; modules: TierModuleContent[] }> = {
  [EXPLORERS_TIER_ID]: {
    prefix: "explorers",
    modules: [EXPLORERS_MODULE_1, EXPLORERS_MODULE_2, EXPLORERS_MODULE_3, EXPLORERS_MODULE_4],
  },
  [RANGERS_TIER_ID]: {
    prefix: "rangers",
    modules: [RANGERS_MODULE_1, RANGERS_MODULE_2, RANGERS_MODULE_3, RANGERS_MODULE_4, RANGERS_MODULE_5, RANGERS_MODULE_6],
  },
  [GUARDIANS_TIER_ID]: {
    prefix: "guardians",
    modules: [GUARDIANS_MODULE_1, GUARDIANS_MODULE_2, GUARDIANS_MODULE_3, GUARDIANS_MODULE_4, GUARDIANS_MODULE_5, GUARDIANS_MODULE_6],
  },
  [SENTINELS_TIER_ID]: {
    prefix: "sentinels",
    modules: [SENTINELS_MODULE_1, SENTINELS_MODULE_2, SENTINELS_MODULE_3, SENTINELS_MODULE_4, SENTINELS_MODULE_5, SENTINELS_MODULE_6],
  },
  [WARDENS_TIER_ID]: {
    prefix: "wardens",
    modules: [WARDENS_MODULE_1, WARDENS_MODULE_2, WARDENS_MODULE_3, WARDENS_MODULE_4, WARDENS_MODULE_5, WARDENS_MODULE_6],
  },
};

export function getRealModule(tierId: number, moduleId: string): TierModuleContent | undefined {
  const cfg = TIER_GAME_CONFIG[tierId];
  if (!cfg) return undefined;
  return cfg.modules.find((m) => m.id === `${cfg.prefix}-${moduleId}`);
}

export function shortId(tierId: number, fullModuleId: string): string {
  const cfg = TIER_GAME_CONFIG[tierId];
  return cfg ? fullModuleId.replace(`${cfg.prefix}-`, "") : fullModuleId;
}

/* Reverse-lookup: given a full module id (e.g. "guardians-m2"), find which
   tier owns it and its short id ("m2"). Used by the /simulate round trip and
   by the standalone module reading page (which only has the full id from
   the URL). */
export function findModuleTier(fullModuleId: string): { tierId: number; shortId: string; module: TierModuleContent } | undefined {
  for (const [tierIdStr, cfg] of Object.entries(TIER_GAME_CONFIG)) {
    const mod = cfg.modules.find((m) => m.id === fullModuleId);
    if (mod) return { tierId: Number(tierIdStr), shortId: mod.id.replace(`${cfg.prefix}-`, ""), module: mod };
  }
  return undefined;
}
