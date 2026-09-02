export type ModuleType = "interactive" | "simulation" | "video-quiz";

export interface DecisionCheckpoint {
  scenario: string;
  correct: { label: string; explanation: string };
  wrong: { label: string; explanation: string; hazardIcon?: string };
  keyRule?: string;
  /** layout for RouteMapChoice (interactive-type modules only); default "horizontal" */
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
