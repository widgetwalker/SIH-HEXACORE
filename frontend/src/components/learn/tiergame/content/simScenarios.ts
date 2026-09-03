import type { Scenario } from "@/components/simulate/game/floorplan";

/*
 * 3D drill scenarios for the "simulation"-type tier modules (Fire + Multi-Hazard,
 * modules 2 and 6 in every tier). These reuse the two existing floorplans from
 * /simulate's scenarios.json (lab-fire-east-wing, quake-compound) as separate,
 * independently-tuned entries — the original /simulate scenarios are untouched.
 * Difficulty scales Guardians (easiest) -> Sentinels -> Wardens (hardest),
 * matching the PDFs' own age-tier progression.
 */

const FIRE_MAP = [
  "########################",
  "#P........#........#...#",
  "#.........#........#...#",
  "#.....##..#..##....#.F.#",
  "####.###########.###.###",
  "#......................#",
  "#......................#",
  "###.#######.#######.####",
  "#.....#........#.......#",
  "#..F..#........#.......#",
  "#.....#...##...#...#####",
  "#.....#........#...#..E#",
  "###.###.....##.#...#...#",
  "#.......#......#.......#",
  "#.......#..F...........#",
  "########################",
];

const MULTIHAZARD_MAP = [
  "########################",
  "#P.....#........#.....E#",
  "#......#...F....#......#",
  "#......D........D......#",
  "#......#........#......#",
  "####D############D######",
  "#......................#",
  "#........####..........#",
  "#......................#",
  "#####D########D####D####",
  "#......#........#......#",
  "#..F...#........D......#",
  "#......D........#......#",
  "#......#........#...F..#",
  "#E.....#........#......#",
  "########################",
];

export const LEARN_SCENARIOS: Record<string, Scenario> = {
  "guardians-m2": {
    id: "guardians-fire",
    name: "Fire Evacuation Drill",
    badge: "GUARDIANS · FIRE EVACUATION",
    hazardLabel: "FIRE",
    difficulty: 1,
    brief:
      "The alarm just sounded. Touch each door before you open it — if it's warm, that route is closed, use the other one. Move calmly, and never hold your breath and push through smoke.",
    timeLimit: 130,
    spreadInterval: 3.0,
    spreadChance: 0.35,
    fogDensity: 0.02,
    colors: { flame: "#ff7a1a", glow: "#ef4444", smoke: "#30363f" },
    map: FIRE_MAP,
    blockages: [],
  },
  "guardians-m6": {
    id: "guardians-multihazard",
    name: "Multi-Hazard Compound Drill",
    badge: "GUARDIANS · MULTI-HAZARD",
    hazardLabel: "FIRE",
    difficulty: 1,
    brief:
      "An earthquake triggered fires across the block, and one route may become unstable mid-drill. Re-check your plan as conditions change — don't lock into your first route.",
    timeLimit: 150,
    spreadInterval: 3.0,
    spreadChance: 0.35,
    fogDensity: 0.02,
    colors: { flame: "#ff7a1a", glow: "#ef4444", smoke: "#30363f" },
    map: MULTIHAZARD_MAP,
    blockages: [
      {
        t: 45,
        warnT: 35,
        cells: [[17, 5], [16, 3]],
        warnMessage: "Structural groaning — a wing feels unstable, brace for aftershock!",
        message: "AFTERSHOCK! That route is sealed — reroute now!",
      },
    ],
  },
  "sentinels-m2": {
    id: "sentinels-fire",
    name: "Fire: Reading a Building Under Stress",
    badge: "SENTINELS · FIRE",
    hazardLabel: "FIRE",
    difficulty: 2,
    brief:
      "If a stairwell is smoke-filled, don't go back to check it — use the other one immediately. Move with purpose; report precisely, and keep anyone near you moving.",
    timeLimit: 110,
    spreadInterval: 2.4,
    spreadChance: 0.48,
    fogDensity: 0.02,
    colors: { flame: "#ff7a1a", glow: "#ef4444", smoke: "#30363f" },
    map: FIRE_MAP,
    blockages: [],
  },
  "sentinels-m6": {
    id: "sentinels-multihazard",
    name: "Multi-Hazard Compound Drill & Leading Under Pressure",
    badge: "SENTINELS · MULTI-HAZARD",
    hazardLabel: "FIRE",
    difficulty: 2,
    brief:
      "Protect yourself first, then assess, then check for a secondary hazard before you commit to a route. Compound scenarios are the norm — keep re-evaluating as you move.",
    timeLimit: 130,
    spreadInterval: 2.6,
    spreadChance: 0.46,
    fogDensity: 0.02,
    colors: { flame: "#ff7a1a", glow: "#ef4444", smoke: "#30363f" },
    map: MULTIHAZARD_MAP,
    blockages: [
      {
        t: 35,
        warnT: 25,
        cells: [[17, 5], [16, 3]],
        warnMessage: "Structural groaning — a wing feels unstable, brace for aftershock!",
        message: "AFTERSHOCK! That route is sealed — reroute now, and call it out to anyone near you!",
      },
    ],
  },
  "wardens-m2": {
    id: "wardens-fire",
    name: "Fire: Coordinating a Multi-Group Evacuation",
    badge: "WARDENS · FIRE COMMAND",
    hazardLabel: "FIRE",
    difficulty: 3,
    brief:
      "Any doubt is an evacuate call — no heroics. Clear your own route fast and decisively: the floor is depending on you to move first and move right so you can direct others behind you.",
    timeLimit: 100,
    spreadInterval: 2.2,
    spreadChance: 0.52,
    fogDensity: 0.02,
    colors: { flame: "#ff7a1a", glow: "#ef4444", smoke: "#30363f" },
    map: FIRE_MAP,
    blockages: [],
  },
  "wardens-m6": {
    id: "wardens-multihazard",
    name: "Multi-Hazard Compound Command & Responder Handoff",
    badge: "WARDENS · CAPSTONE",
    hazardLabel: "FIRE",
    difficulty: 3,
    brief:
      "Quake, then a secondary hazard, then a sealed route. Protect yourself first, reassess, then act — this is the sequencing capstone, and you'll need to brief responders on what you find.",
    timeLimit: 120,
    spreadInterval: 2.4,
    spreadChance: 0.52,
    fogDensity: 0.02,
    colors: { flame: "#ff7a1a", glow: "#ef4444", smoke: "#30363f" },
    map: MULTIHAZARD_MAP,
    blockages: [
      {
        t: 30,
        warnT: 20,
        cells: [[17, 5], [16, 3]],
        warnMessage: "Structural groaning — a wing feels unstable, brace for aftershock!",
        message: "AFTERSHOCK! That route is sealed — reroute now and prepare to brief responders!",
      },
    ],
  },
};
