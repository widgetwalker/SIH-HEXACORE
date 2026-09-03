"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { DecisionCheckpoint, TierModuleContent } from "./types";
import { moduleCompletionPct } from "./types";
import RouteMapChoice from "./RouteMapChoice";
import { LEARN_SCENARIOS } from "./content/simScenarios";
import styles from "./ModuleViewer.module.css";

interface Props {
  module: TierModuleContent;
  onClose: () => void;
  onComplete: (scorePct: number) => void;
}

export default function ModuleViewer({ module, onClose, onComplete }: Props) {
  const [sectionIdx, setSectionIdx] = useState(0);
  const [sectionsRead, setSectionsRead] = useState<Set<string>>(new Set());
  const [choice, setChoice] = useState<"correct" | "wrong" | null>(null);

  const section = module.sections[sectionIdx];
  const isLast = sectionIdx === module.sections.length - 1;
  const pct = moduleCompletionPct(module, sectionsRead);
  const simScenario = LEARN_SCENARIOS[module.id];
  const isSimCheckpoint = module.type === "simulation" && !!simScenario && !!section.checkpoint;

  useEffect(() => {
    setSectionsRead((prev) => (prev.has(section.id) ? prev : new Set(prev).add(section.id)));
    setChoice(null);
  }, [section.id]);

  const goNext = () => {
    if (isLast) {
      onComplete(choice === "correct" ? 100 : 60);
      return;
    }
    setSectionIdx((i) => i + 1);
  };

  return (
    <>
      <div className={styles.overlay} onClick={onClose}>
        <div className={`hud-panel ${styles.panel}`} onClick={(e) => e.stopPropagation()}>
          <div className={styles.header}>
            <div className={styles.headerText}>
              <span className="hud-label">{module.name}</span>
              <div className={styles.progressTrack}>
                <div className={styles.progressFill} style={{ width: `${pct}%` }} />
              </div>
            </div>
            <button className={styles.closeBtn} onClick={onClose} aria-label="Close module">
              ×
            </button>
          </div>

          <div className={styles.sectionNav}>
            Section {section.number} of {module.sections.length} · {section.title}
          </div>

          <div className={styles.body}>
            {section.checkpoint ? (
              isSimCheckpoint ? (
                <SimCheckpointPrompt checkpoint={section.checkpoint} moduleId={module.id} />
              ) : module.type === "interactive" ? (
                <RouteMapChoice checkpoint={section.checkpoint} choice={choice} onChoose={setChoice} />
              ) : (
                <CheckpointCard checkpoint={section.checkpoint} choice={choice} onChoose={setChoice} />
              )
            ) : (
              section.body.map((p, i) => (
                <p key={i} className={styles.paragraph}>
                  {p}
                </p>
              ))
            )}
          </div>

          <div className={styles.footer}>
            <button
              className="btn btn-ghost"
              onClick={() => setSectionIdx((i) => Math.max(0, i - 1))}
              disabled={sectionIdx === 0}
            >
              ← Back
            </button>
            {!isSimCheckpoint && (
              <button
                className="btn btn-primary"
                onClick={goNext}
                disabled={!!section.checkpoint && !choice}
              >
                {isLast ? "Finish Module" : "Continue →"}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function SimCheckpointPrompt({ checkpoint, moduleId }: { checkpoint: DecisionCheckpoint; moduleId: string }) {
  const router = useRouter();
  return (
    <div>
      <p className={styles.scenario}>{checkpoint.scenario}</p>
      <button
        className={`btn btn-danger ${styles.drillBtn}`}
        onClick={() => router.push(`/simulate?learnModule=${moduleId}`)}
      >
        Enter the Drill →
      </button>
    </div>
  );
}

function CheckpointCard({
  checkpoint,
  choice,
  onChoose,
}: {
  checkpoint: DecisionCheckpoint;
  choice: "correct" | "wrong" | null;
  onChoose: (c: "correct" | "wrong") => void;
}) {
  const answered = choice !== null;
  /* Randomize left/right position each time a checkpoint mounts, so the
     correct answer isn't always in the same slot. Starts at a fixed value
     (not Math.random()) so server and client render the same markup on
     first paint, then re-randomizes client-side right after mount - this
     component is only ever mounted from a client-side click in the first
     place, so there's no visible flash, just no hydration-mismatch risk. */
  const [correctFirst, setCorrectFirst] = useState(true);
  useEffect(() => {
    setCorrectFirst(Math.random() < 0.5);
  }, [checkpoint.scenario]);

  const correctBtn = (
    <button
      key="correct"
      className={`${styles.choiceBtn} ${answered ? styles.choiceCorrect : ""}`}
      disabled={answered}
      onClick={() => onChoose("correct")}
    >
      {answered && <span className={styles.mark}>✅</span>}
      {checkpoint.correct.label}
    </button>
  );
  const wrongBtn = (
    <button
      key="wrong"
      className={`${styles.choiceBtn} ${answered ? styles.choiceWrong : ""}`}
      disabled={answered}
      onClick={() => onChoose("wrong")}
    >
      {answered && <span className={styles.mark}>❌</span>}
      {checkpoint.wrong.label}
    </button>
  );

  return (
    <div>
      <p className={styles.scenario}>{checkpoint.scenario}</p>
      <div className={styles.choices}>{correctFirst ? [correctBtn, wrongBtn] : [wrongBtn, correctBtn]}</div>
      {answered && (
        <div className={`${styles.feedback} ${choice === "correct" ? styles.feedbackGood : styles.feedbackBad}`}>
          <strong>{choice === "correct" ? "Nice work — that's right." : "Not quite."}</strong>
          <p>{choice === "correct" ? checkpoint.correct.explanation : checkpoint.wrong.explanation}</p>
          {checkpoint.keyRule && <p className={styles.keyRule}>{checkpoint.keyRule}</p>}
        </div>
      )}
    </div>
  );
}
