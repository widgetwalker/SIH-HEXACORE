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
  map?: string[];
  floors?: string[][];
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
  label?: string;
  kind?: "stairs" | "window" | "door";
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
  const mapData = scenario.map ?? scenario.floors?.[0] ?? [];
  const rows = mapData.length;
  const cols = Math.max(...mapData.map((row) => row.length));

  const grid: string[][] = [];
  const walls = new Set<number>();
  const doors = new Set<number>();
  const fireSeeds: number[] = [];
  const fireSeedSet = new Set<number>();
  const exits: ExitCell[] = [];
  let authoredSpawn: { c: number; r: number } | null = null;

  const idxOf = (c: number, r: number) => r * cols + c;

  const walkableCells: { c: number; r: number }[] = [];

  for (let r = 0; r < rows; r++) {
    const padded = (mapData[r] ?? "").padEnd(cols, "#");
    grid.push(padded.split(""));
    for (let c = 0; c < cols; c++) {
      const ch = padded[c];
      const idx = idxOf(c, r);
      switch (ch) {
        case "#":
          walls.add(idx);
          break;
        case "D":
          doors.add(idx);
          break;
        case "F":
          fireSeeds.push(idx);
          fireSeedSet.add(idx);
          break;
        case "E": {
          const exitIdx = exits.length;
          const label = exitIdx === 0
            ? "STAIRWELL A"
            : exitIdx === 1
            ? "STAIRWELL B"
            : `EXIT ${exitIdx + 1}`;
          exits.push({ c, r, idx, label, kind: "stairs" });
          break;
        }
        case "P":
          authoredSpawn = { c, r };
          walkableCells.push({ c, r });
          break;
        case ".":
          walkableCells.push({ c, r });
          break;
      }
    }
  }

  // Identify all cells that share a room/enclosure with ANY exit.
  // A room boundary is defined by walls ('#') and doorways ('D').
  // A flood fill that does not cross doors or walls determines the exit's immediate room.
  const exitRoomIndices = new Set<number>();
  for (const exit of exits) {
    const queue: { c: number; r: number }[] = [{ c: exit.c, r: exit.r }];
    exitRoomIndices.add(exit.idx);
    while (queue.length > 0) {
      const curr = queue.shift()!;
      for (const [dc, dr] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
        const nc = curr.c + dc;
        const nr = curr.r + dr;
        if (nc < 0 || nr < 0 || nc >= cols || nr >= rows) continue;
        const nidx = idxOf(nc, nr);
        if (walls.has(nidx) || doors.has(nidx) || exitRoomIndices.has(nidx)) continue;
        exitRoomIndices.add(nidx);
        queue.push({ c: nc, r: nr });
      }
    }
  }

  // Filter candidates for dynamic player spawn:
  // 1. Must not be inside an exit room/enclosure.
  // 2. Must not be directly on or immediately adjacent to a fire seed.
  // 3. Must be at a significant distance from all exits (on the opposite side or deep in a separate wing).
  let minSafeDistance = Math.max(10, Math.floor(Math.max(cols, rows) * 0.40));
  let candidateSpawns: { c: number; r: number }[] = [];

  while (minSafeDistance >= 6 && candidateSpawns.length === 0) {
    candidateSpawns = walkableCells.filter((pt) => {
      const idx = idxOf(pt.c, pt.r);
      if (exitRoomIndices.has(idx)) return false;
      if (fireSeedSet.has(idx)) return false;

      // Do not spawn next to active fire seed
      for (const [dc, dr] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
        if (fireSeedSet.has(idxOf(pt.c + dc, pt.r + dr))) return false;
      }

      // Check distance to all exits
      if (exits.length > 0) {
        const minExitDist = Math.min(...exits.map((e) => Math.abs(e.c - pt.c) + Math.abs(e.r - pt.r)));
        if (minExitDist < minSafeDistance) return false;
      }

      return true;
    });

    if (candidateSpawns.length === 0) {
      minSafeDistance -= 2;
    }
  }

  // Pick a random spawn from the valid distant candidates
  let spawn: { c: number; r: number };
  if (candidateSpawns.length > 0) {
    const chosen = candidateSpawns[Math.floor(Math.random() * candidateSpawns.length)];
    spawn = { c: chosen.c, r: chosen.r };
  } else if (authoredSpawn && !exitRoomIndices.has(idxOf(authoredSpawn.c, authoredSpawn.r))) {
    spawn = authoredSpawn;
  } else if (walkableCells.length > 0) {
    // Fallback: pick the walkable cell furthest away from all exits
    let bestCell = walkableCells[0];
    let maxDist = -1;
    for (const cell of walkableCells) {
      const d = exits.length > 0
        ? Math.min(...exits.map((e) => Math.abs(e.c - cell.c) + Math.abs(e.r - cell.r)))
        : 0;
      if (d > maxDist && !exitRoomIndices.has(idxOf(cell.c, cell.r))) {
        maxDist = d;
        bestCell = cell;
      }
    }
    spawn = bestCell;
  } else {
    spawn = { c: 1, r: 1 };
  }

  return { rows, cols, at: (c, r) => grid[r]?.[c] ?? "#", walls, doors, fireSeeds, exits, spawn, idxOf };
}
