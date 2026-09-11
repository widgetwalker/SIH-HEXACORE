/*
 * Run telemetry + debrief generation (doc 02 §2 outcome resolution):
 *  - every run records decisions, violations and route heat
 *  - the post-run debrief is GENERATED from what the player actually did,
 *    replacing the old static WIN/LOSE text arrays
 *  - runs persist to backend (via src/lib/telemetry.ts) so the /admin analytics dashboard can
 *    aggregate them (heatmap, compliance, common failures)
 */

// ── Re-export everything from the new lib/telemetry.ts (API-backed) ──

export type {
  TelemetryEvent,
  RunTelemetry,
  DebriefLine,
} from "@/lib/telemetry";

export {
  saveRun,
  loadRuns,
  loadRunsFromAPI,
  loadAnalyticsFromAPI,
  generateDebrief,
  fmtTime,
  topViolation,
  VIOLATION_LABELS,
  type RunTelemetry,
} from "@/lib/telemetry";