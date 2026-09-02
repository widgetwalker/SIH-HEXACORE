"use client";

import { useEffect, useMemo, useState } from "react";
import type { DecisionCheckpoint, TierModuleContent } from "./types";
import { moduleCompletionPct } from "./types";
import RouteMapChoice from "./RouteMapChoice";
import SimGameModal from "./SimGameModal";
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
  const [drillOpen, setDrillOpen] = useState(false);

  const section = module.sections[sectionIdx];
  const isLast = sectionIdx === module.sections.length - 1;
  const pct = moduleCompletionPct(module, sectionsRead);
  const simScenario = LEARN_SCENARIOS[module.id];

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
              module.type === "simulation" && simScenario ? (
                <SimCheckpointPrompt
                  checkpoint={section.checkpoint}
                  choice={choice}
                  onOpenDrill={() => setDrillOpen(true)}
                />
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
            <button
              className="btn btn-primary"
              onClick={goNext}
              disabled={!!section.checkpoint && !choice}
            >
              {isLast ? "Finish Module" : "Continue →"}
            </button>
          </div>
        </div>
      </div>

      {drillOpen && simScenario && section.checkpoint && (
        <SimGameModal
          scenario={simScenario}
          checkpoint={section.checkpoint}
          onClose={() => setDrillOpen(false)}
          onFinish={(won) => {
            setChoice(won ? "correct" : "wrong");
            setDrillOpen(false);
          }}
        />
      )}
    </>
  );
}

function SimCheckpointPrompt({
  checkpoint,
  choice,
  onOpenDrill,
}: {
  checkpoint: DecisionCheckpoint;
  choice: "correct" | "wrong" | null;
  onOpenDrill: () => void;
}) {
  const answered = choice !== null;
  return (
    <div>
      <p className={styles.scenario}>{checkpoint.scenario}</p>
      {!answered ? (
        <button className={`btn btn-danger ${styles.drillBtn}`} onClick={onOpenDrill}>
          Enter the Drill →
        </button>
      ) : (
        <div className={`${styles.feedback} ${choice === "correct" ? styles.feedbackGood : styles.feedbackBad}`}>
          <strong>{choice === "correct" ? "Drill cleared — nice work." : "Drill failed — here's what to remember."}</strong>
          <p>{choice === "correct" ? checkpoint.correct.explanation : checkpoint.wrong.explanation}</p>
          {checkpoint.keyRule && <p className={styles.keyRule}>{checkpoint.keyRule}</p>}
          <button className={`btn btn-ghost ${styles.drillBtn}`} onClick={onOpenDrill}>
            Replay Drill
          </button>
        </div>
      )}
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
  /* randomize left/right position each time a checkpoint mounts, so the
     correct answer isn't always in the same slot */
  const correctFirst = useMemo(() => Math.random() < 0.5, [checkpoint.scenario]);

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
