/*
 * Run telemetry + debrief generation (doc 02 §2 outcome resolution):
 *  - every run records decisions, violations and route heat
 *  - the post-run debrief is GENERATED from what the player actually did,
 *    replacing the old static WIN/LOSE text arrays
 *  - runs persist to localStorage so the /admin analytics dashboard can
 *    aggregate them (heatmap, compliance, common failures)
 */

export interface TelemetryEvent {
  t: number; // seconds into run
  type:
    | "entered_fire"
    | "smoke_exposure"
    | "panic_freeze"
    | "route_blocked"
    | "breathed"
    | "exit_reached";
  cell?: { c: number; r: number };
  detail?: string;
}

export interface RunTelemetry {
  runId: string;
  scenarioId: string;
  scenarioName: string;
  status: "won" | "lost";
  time: number;
  oxygenLeft: number;
  panicPeak: number;
  panicFreezeSeconds: number;
  score: number;
  smokeStandingSeconds: number;
  smokeCrouchSeconds: number;
  breathCount: number;
  distanceTraveled: number;
  fireCellEntries: number;
  exitUsed?: { c: number; r: number };
  deathCell?: { c: number; r: number };
  violations: TelemetryEvent[];
  /** visits per grid cell index - powers the admin heatmap */
  routeHeat: number[];
  cols: number;
  rows: number;
  createdAt: number;
}

export interface DebriefLine {
  ok: boolean;
  text: string;
}

/* ── persistence ──────────────────────────────────────────────────── */

const STORAGE_KEY = "safezone_drill_runs_v1";
const MAX_RUNS = 500;
const BACKEND_URL = (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_BACKEND_URL) || "http://localhost:8000";

export function saveRun(run: RunTelemetry): void {
  if (typeof window === "undefined") return;
  try {
    const runs = loadRuns();
    runs.push(run);
    while (runs.length > MAX_RUNS) runs.shift();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(runs));
  } catch {
    /* storage full or unavailable - telemetry loss is non-fatal */
  }

  /* fire-and-forget POST to backend — localStorage is the source of truth */
  fetch(`${BACKEND_URL}/api/v1/telemetry/runs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...run, userId: "anonymous" }),
  }).catch(() => {
    /* backend unreachable — localStorage fallback already saved */
  });
}

export async function loadRunsFromAPI(): Promise<RunTelemetry[] | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/telemetry/runs`);
    if (!res.ok) return null;
    const data = await res.json();
    return Array.isArray(data) ? (data as RunTelemetry[]) : null;
  } catch {
    return null;
  }
}

export async function loadAnalyticsFromAPI(): Promise<{
  kpis: { total_drills: number; success_rate: number; safe_headcount_pct: number; avg_escape_time_sec: number; avg_peak_panic: number; top_failure_mode: string; top_failure_count: number };
  heatmap: { cols: number; rows: number; heat: number[]; casualty_cells: number[][]; exit_cells: number[][]; spawn_cell: number[] | null };
  per_scenario: Record<string, { total_drills: number; success_rate: number; safe_headcount_pct: number; avg_escape_time_sec: number; avg_peak_panic: number; top_failure_mode: string; top_failure_count: number }>;
} | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/telemetry/analytics`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export function loadRuns(): RunTelemetry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as RunTelemetry[]) : [];
  } catch {
    return [];
  }
}

/* ── generated debrief ────────────────────────────────────────────── */

export function generateDebrief(run: RunTelemetry): DebriefLine[] {
  const lines: DebriefLine[] = [];

  /* fire contact */
  if (run.fireCellEntries > 0) {
    lines.push({
      ok: false,
      text: `✗ Crossed ${run.fireCellEntries} burning cell${run.fireCellEntries > 1 ? "s" : ""} - never enter a flaming corridor; reroute instead`,
    });
  } else {
    lines.push({ ok: true, text: "✓ Zero fire-cell exposure - clean route discipline" });
  }

  /* smoke handling */
  const standing = Math.round(run.smokeStandingSeconds);
  if (standing > 6) {
    lines.push({
      ok: false,
      text: `✗ Spent ${standing}s standing in smoke (lost ~${Math.round(standing * 4.5)}% O₂) - hold SHIFT to crawl low`,
    });
  } else if (run.smokeCrouchSeconds > 2) {
    lines.push({ ok: true, text: `✓ Crawled low through ${Math.round(run.smokeCrouchSeconds)}s of smoke like a pro` });
  } else {
    lines.push({ ok: true, text: "✓ Avoided heavy smoke entirely" });
  }

  /* panic control */
  if (run.panicPeak > 70) {
    if (run.breathCount > 0) {
      lines.push({
        ok: false,
        text: `△ Panic peaked at ${Math.round(run.panicPeak)}% but you recovered with box-breathing (${run.breathCount}×) - keep it below 70 next time`,
      });
    } else {
      lines.push({
        ok: false,
        text: `✗ Panic hit ${Math.round(run.panicPeak)}% and froze your legs for ${Math.round(run.panicFreezeSeconds)}s - hold B to box-breathe before it spikes`,
      });
    }
  } else {
    lines.push({ ok: true, text: `✓ Kept panic controlled (peak ${Math.round(run.panicPeak)}%)` });
  }

  /* oxygen */
  if (run.status === "won") {
    lines.push({ ok: true, text: `✓ Evacuated in ${fmtTime(run.time)} with ${Math.round(run.oxygenLeft)}% O₂ remaining` });
  } else if (run.oxygenLeft <= 0) {
    lines.push({ ok: true, text: "✗ Oxygen depleted before reaching assembly - smoke exposure is the #1 killer" });
  } else {
    lines.push({ ok: true, text: `✗ Timeout at ${fmtTime(run.time)} - commit to a route early, fire roughly doubles every minute` });
  }

  /* exit choice */
  if (run.exitUsed && run.exitUsed !== null && run.exitUsed.c >= 0) {
    lines.push({
      ok: true,
      text: `✓ Used exit at grid (${run.exitUsed.c}, ${run.exitUsed.r}) after ${Math.round(run.distanceTraveled)}m of movement`,
    });
  }

  return lines.slice(0, 6);
}

export function fmtTime(s: number): string {
  return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
}

/* ── violation labels for the admin dashboard ─────────────────────── */

export const VIOLATION_LABELS: Record<string, string> = {
  entered_fire: "Entered burning cells",
  smoke_exposure: "Stood in smoke",
  panic_freeze: "Panic cognitive-freeze",
};

export function topViolation(runs: RunTelemetry[]): { type: string; count: number } | null {
  const counts = new Map<string, number>();
  for (const run of runs) {
    for (const v of run.violations) counts.set(v.type, (counts.get(v.type) ?? 0) + 1);
  }
  let best: { type: string; count: number } | null = null;
  counts.forEach((count, type) => {
    if (!best || count > best.count) best = { type, count };
  });
  return best;
}
