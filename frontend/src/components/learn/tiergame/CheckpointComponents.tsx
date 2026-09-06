"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import type { DecisionCheckpoint } from "./types";
import styles from "./CheckpointComponents.module.css";

/* Shared quiz-style checkpoint pieces used by ModuleReaderPage - split out
   so both the reader page and (previously) the modal viewer could reuse the
   exact same PDF-accurate checkpoint content/styling without duplication. */

export function CheckpointCard({
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

export function SimCheckpointPrompt({ checkpoint, moduleId }: { checkpoint: DecisionCheckpoint; moduleId: string }) {
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
