"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import RouteMapChoice from "./RouteMapChoice";
import { CheckpointCard, SimCheckpointPrompt } from "./CheckpointComponents";
import { LEARN_SCENARIOS } from "./content/simScenarios";
import type { TierModuleContent } from "./types";
import styles from "./ModuleReaderPage.module.css";

const TIER_SCORES_KEY = "safezone_tier_scores_v1";

function saveScore(tierId: number, moduleShortId: string, scorePct: number) {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(TIER_SCORES_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : {};
    const base = typeof parsed === "object" && parsed !== null && !Array.isArray(parsed) ? (parsed as Record<number, Record<string, number>>) : {};
    const next = { ...base, [tierId]: { ...(base[tierId] ?? {}), [moduleShortId]: scorePct } };
    window.localStorage.setItem(TIER_SCORES_KEY, JSON.stringify(next));
  } catch {
    /* storage full or unavailable - non-fatal, progress just won't persist */
  }
}

const TYPE_LABEL: Record<TierModuleContent["type"], string> = {
  interactive: "Interactive",
  simulation: "Simulation",
  "video-quiz": "Video + Quiz",
};

interface Props {
  module: TierModuleContent;
  tierId: number;
  moduleShortId: string;
}

/*
 * Full page, Khan-Academy style: every section reads top-to-bottom on one
 * scrollable page (no modal, no one-section-at-a-time pagination), with the
 * PDF-accurate decision checkpoint as the "quiz" at the bottom. Replaces the
 * old popup ModuleViewer.
 */
export default function ModuleReaderPage({ module, tierId, moduleShortId }: Props) {
  const router = useRouter();
  const [choice, setChoice] = useState<"correct" | "wrong" | null>(null);

  const readingSections = module.sections.filter((s) => !s.checkpoint);
  const checkpointSection = module.sections.find((s) => s.checkpoint);
  const checkpoint = checkpointSection?.checkpoint;
  const simScenario = LEARN_SCENARIOS[module.id];
  const isSimCheckpoint = module.type === "simulation" && !!simScenario && !!checkpoint;

  const finish = () => {
    saveScore(tierId, moduleShortId, choice === "correct" ? 100 : 60);
    router.push("/learn");
  };

  return (
    <div className={styles.page}>
      <Navbar mode="learning" />

      <div className={styles.container}>
        <button className={`btn btn-ghost ${styles.backBtn}`} onClick={() => router.push("/learn")}>
          ← Back to Modules
        </button>

        <header className={styles.header}>
          <div className={styles.headerMeta}>
            <span className="badge badge-teal">{TYPE_LABEL[module.type]}</span>
            <span className={styles.duration}>{module.estMinutes} min · {module.sections.length} sections</span>
          </div>
          <h1 className={styles.title}>
            <span aria-hidden="true">{module.icon}</span> {module.name}
          </h1>
        </header>

        <article className={styles.article}>
          {readingSections.map((section) => (
            <section key={section.id} className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionNum}>{section.number}</span>
                {section.title}
              </h2>
              {section.body.map((p, i) => (
                <p key={i} className={styles.paragraph}>
                  {p}
                </p>
              ))}
            </section>
          ))}
        </article>

        {checkpoint && (
          <section className={styles.quizSection}>
            <h2 className={styles.quizHeading}>
              <span aria-hidden="true">📝</span> Check Your Understanding
            </h2>
            {isSimCheckpoint ? (
              <SimCheckpointPrompt checkpoint={checkpoint} moduleId={module.id} />
            ) : module.type === "interactive" ? (
              <RouteMapChoice checkpoint={checkpoint} choice={choice} onChoose={setChoice} />
            ) : (
              <CheckpointCard checkpoint={checkpoint} choice={choice} onChoose={setChoice} />
            )}
          </section>
        )}

        {!isSimCheckpoint && (
          <div className={styles.footer}>
            <button className="btn btn-primary" onClick={finish} disabled={!!checkpoint && !choice}>
              Finish Module →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
