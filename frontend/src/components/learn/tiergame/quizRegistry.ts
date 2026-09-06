import { EXPLORERS_QUIZ_MODULES } from "./content/quizzes/explorers";
import { RANGERS_QUIZ_MODULES } from "./content/quizzes/rangers";
import { GUARDIANS_QUIZ_MODULES } from "./content/quizzes/guardians";
import { SENTINELS_QUIZ_MODULES } from "./content/quizzes/sentinels";
import { WARDENS_QUIZ_MODULES } from "./content/quizzes/wardens";
import type { QuizLevel, QuizModule } from "./types";

export const QUIZ_PASS_PCT = 60;

export const QUIZ_MODULES_BY_TIER: Record<number, QuizModule[]> = {
  1: EXPLORERS_QUIZ_MODULES,
  2: RANGERS_QUIZ_MODULES,
  3: GUARDIANS_QUIZ_MODULES,
  4: SENTINELS_QUIZ_MODULES,
  5: WARDENS_QUIZ_MODULES,
};

export function getQuizModule(tierId: number, moduleId: string): QuizModule | undefined {
  return QUIZ_MODULES_BY_TIER[tierId]?.find((m) => m.moduleId === moduleId);
}

export function getQuizLevel(tierId: number, moduleId: string, level: number): QuizLevel | undefined {
  return getQuizModule(tierId, moduleId)?.levels.find((l) => l.level === level);
}

const QUIZ_SCORES_KEY = "safezone_quiz_scores_v1";

/** moduleId -> level -> best score pct. Keyed by full module id (e.g.
 *  "guardians-m1"), which already encodes the tier, so no extra tier nesting
 *  is needed. */
export function loadQuizScores(): Record<string, Record<number, number>> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(QUIZ_SCORES_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return {};
    return parsed as Record<string, Record<number, number>>;
  } catch {
    return {};
  }
}

export function saveQuizScore(moduleId: string, level: number, scorePct: number) {
  if (typeof window === "undefined") return;
  try {
    const all = loadQuizScores();
    const moduleScores = all[moduleId] ?? {};
    const best = Math.max(moduleScores[level] ?? 0, scorePct);
    const next = { ...all, [moduleId]: { ...moduleScores, [level]: best } };
    window.localStorage.setItem(QUIZ_SCORES_KEY, JSON.stringify(next));
  } catch {
    /* storage full or unavailable - non-fatal, score just won't persist */
  }
}

export function isLevelUnlocked(moduleId: string, level: number, scores: Record<string, Record<number, number>>): boolean {
  if (level <= 1) return true;
  const moduleScores = scores[moduleId] ?? {};
  return (moduleScores[level - 1] ?? 0) >= QUIZ_PASS_PCT;
}
