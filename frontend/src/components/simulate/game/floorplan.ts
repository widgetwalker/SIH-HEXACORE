import scenarioData from "@/data/scenarios.json";

/*
 * Floorplan loader: turns JSON scenario definitions into the runtime grid
 * the Three.js drill consumes. Map legend:
 *   #  wall          .  open floor      P  player spawn
 *   E  exit beacon   F  fire seed       D  door (blocks fire/smoke until opened)
 */

export interface BlockageEvent {
  t: number;
  warnT?: number;
  cells: [number, number][];
  warnMessage?: string;
  message: string;
}

export interface ScenarioColors {
  flame: string;
  glow: string;
  smoke: string;
}

export interface Scenario {
  id: string;
  name: string;
  badge: string;
  hazardLabel: string;
  difficulty: number;
  brief: string;
  timeLimit: number;
  spreadInterval: number;
  spreadChance: number;
  fogDensity: number;
  colors: ScenarioColors;
  map: string[];
  blockages?: BlockageEvent[];
}

const raw = scenarioData as { scenarios: Scenario[] };
export const SCENARIOS: Scenario[] = raw.scenarios;

export function getScenario(id: string): Scenario | undefined {
  return SCENARIOS.find((s) => s.id === id);
}

/* ── parsed runtime grid ──────────────────────────────────────────── */

export interface ExitCell {
  c: number;
  r: number;
  idx: number;
}

export interface ParsedFloorplan {
  rows: number;
  cols: number;
  /** grid[r][c] character */
  at: (c: number, r: number) => string;
  walls: Set<number>;
  doors: Set<number>;
  fireSeeds: number[];
  exits: ExitCell[];
  spawn: { c: number; r: number };
  idxOf: (c: number, r: number) => number;
}

export function parseFloorplan(scenario: Scenario): ParsedFloorplan {
  /* pad ragged rows with walls so a typo in JSON can never crash the sim */
  const rows = scenario.map.length;
  const cols = Math.max(...scenario.map.map((row) => row.length));

  const grid: string[][] = [];
  const walls = new Set<number>();
  const doors = new Set<number>();
  const fireSeeds: number[] = [];
  const exits: ExitCell[] = [];
  let spawn = { c: 1, r: 1 };

  const idxOf = (c: number, r: number) => r * cols + c;

  for (let r = 0; r < rows; r++) {
    const padded = scenario.map[r].padEnd(cols, "#");
    grid.push(padded.split(""));
    for (let c = 0; c < cols; c++) {
      switch (padded[c]) {
        case "#":
          walls.add(idxOf(c, r));
          break;
        case "D":
          doors.add(idxOf(c, r));
          break;
        case "F":
          fireSeeds.push(idxOf(c, r));
          break;
        case "E":
          exits.push({ c, r, idx: idxOf(c, r) });
          break;
        case "P":
          spawn = { c, r };
          break;
      }
    }
  }

  return { rows, cols, at: (c, r) => grid[r]?.[c] ?? "#", walls, doors, fireSeeds, exits, spawn, idxOf };
}
