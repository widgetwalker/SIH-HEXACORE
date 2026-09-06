import { EXPLORERS_QUIZ_LEVELS } from "./content/quizzes/explorers";
import { RANGERS_QUIZ_LEVELS } from "./content/quizzes/rangers";
import { GUARDIANS_QUIZ_LEVELS } from "./content/quizzes/guardians";
import { SENTINELS_QUIZ_LEVELS } from "./content/quizzes/sentinels";
import { WARDENS_QUIZ_LEVELS } from "./content/quizzes/wardens";
import type { QuizLevel } from "./types";

export const QUIZ_PASS_PCT = 60;

export const QUIZ_LEVELS_BY_TIER: Record<number, QuizLevel[]> = {
  1: EXPLORERS_QUIZ_LEVELS,
  2: RANGERS_QUIZ_LEVELS,
  3: GUARDIANS_QUIZ_LEVELS,
  4: SENTINELS_QUIZ_LEVELS,
  5: WARDENS_QUIZ_LEVELS,
};

export function getQuizLevel(tierId: number, level: number): QuizLevel | undefined {
  return QUIZ_LEVELS_BY_TIER[tierId]?.find((l) => l.level === level);
}

const QUIZ_SCORES_KEY = "safezone_quiz_scores_v1";

export function loadQuizScores(): Record<number, Record<number, number>> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(QUIZ_SCORES_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return {};
    return parsed as Record<number, Record<number, number>>;
  } catch {
    return {};
  }
}

export function saveQuizScore(tierId: number, level: number, scorePct: number) {
  if (typeof window === "undefined") return;
  try {
    const all = loadQuizScores();
    const tierScores = all[tierId] ?? {};
    const best = Math.max(tierScores[level] ?? 0, scorePct);
    const next = { ...all, [tierId]: { ...tierScores, [level]: best } };
    window.localStorage.setItem(QUIZ_SCORES_KEY, JSON.stringify(next));
  } catch {
    /* storage full or unavailable - non-fatal, score just won't persist */
  }
}

export function isLevelUnlocked(tierId: number, level: number, scores: Record<number, Record<number, number>>): boolean {
  if (level <= 1) return true;
  const tierScores = scores[tierId] ?? {};
  return (tierScores[level - 1] ?? 0) >= QUIZ_PASS_PCT;
}
