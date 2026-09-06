export type ModuleType = "interactive" | "simulation" | "video-quiz";

export interface DecisionCheckpoint {
  scenario: string;
  correct: { label: string; explanation: string };
  wrong: { label: string; explanation: string; hazardIcon?: string };
  keyRule?: string;
  /** RouteMapChoice (interactive-type modules only): "vertical" swaps the
   *  "You are here" label to "Your floor" for floor-level decisions (e.g.
   *  move up vs. go outside) rather than a stair-choice framing. Doesn't
   *  change the map's geometry, only that label - default "horizontal". */
  mapOrientation?: "horizontal" | "vertical";
}

export interface TierSection {
  id: string;
  number: number;
  title: string;
  estMinutes: number;
  body: string[];
  checkpoint?: DecisionCheckpoint;
}

export interface TierModuleContent {
  id: string;
  number: number;
  name: string;
  type: ModuleType;
  estMinutes: number;
  icon: string;
  sections: TierSection[];
}

export function moduleCompletionPct(mod: TierModuleContent, sectionsRead: Set<string>): number {
  if (mod.sections.length === 0) return 0;
  const read = mod.sections.filter((s) => sectionsRead.has(s.id)).length;
  return Math.round((read / mod.sections.length) * 100);
}

/* Quiz Arena: a standalone, per-tier knowledge check separate from the
   per-module reading checkpoints - 5 levels per tier, 5 questions per level,
   increasing in difficulty. */
export interface QuizOption {
  text: string;
  correct: boolean;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: QuizOption[];
  explanation: string;
}

export interface QuizLevel {
  level: number;
  title: string;
  questions: QuizQuestion[];
}
