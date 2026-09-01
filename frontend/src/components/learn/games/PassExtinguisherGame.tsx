"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./games.module.css";

const STEPS = [
  { key: "pull", letter: "P", label: "PULL", desc: "the safety pin" },
  { key: "aim", letter: "A", label: "AIM", desc: "at the base of the fire" },
  { key: "squeeze", letter: "S", label: "SQUEEZE", desc: "the handle slowly" },
  { key: "sweep", letter: "S", label: "SWEEP", desc: "side to side" },
] as const;

function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface Props {
  onComplete: (score: number) => void;
}

export default function PassExtinguisherGame({ onComplete }: Props) {
  const [order] = useState(() => shuffle(STEPS));
  const [step, setStep] = useState(0);
  const [fire, setFire] = useState(100);
  const [mistakes, setMistakes] = useState(0);
  const [wrongKey, setWrongKey] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const startedAt = useRef(Date.now());
  const reportedRef = useRef(false);

  useEffect(() => {
    if (fire <= 0 && !reportedRef.current) {
      reportedRef.current = true;
      const elapsedS = (Date.now() - startedAt.current) / 1000;
      const score = Math.max(30, Math.min(100, 100 - mistakes * 12 - Math.max(0, Math.round(elapsedS - 8))));
      setDone(true);
      onComplete(score);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fire]);

  const tap = (key: string) => {
    if (done) return;
    const expected = STEPS[step].key;
    if (key === expected) {
      setFire((f) => Math.max(0, f - 25));
      setStep((s) => Math.min(STEPS.length - 1, s + 1));
    } else {
      setMistakes((m) => m + 1);
      setFire((f) => Math.min(100, f + 5));
      setWrongKey(key);
      setTimeout(() => setWrongKey(null), 250);
    }
  };

  if (done) {
    const elapsedS = Math.round((Date.now() - startedAt.current) / 1000);
    const score = Math.max(30, Math.min(100, 100 - mistakes * 12 - Math.max(0, elapsedS - 8)));
    return (
      <div className={styles.resultBox}>
        <span style={{ fontSize: "3rem" }}>✅</span>
        <span className={styles.resultScore}>{score}%</span>
        <p style={{ color: "var(--text-muted)" }}>
          Fire extinguished in {elapsedS}s · {mistakes} misstep{mistakes === 1 ? "" : "s"}
        </p>
      </div>
    );
  }

  return (
    <div className={styles.passLayout}>
      <p style={{ color: "var(--text-muted)", textAlign: "center" }}>
        Tap the steps in the correct <b>P-A-S-S</b> order to extinguish the fire. Buttons are
        shuffled — read the instruction, not the position.
      </p>

      <div className={styles.fireWrap}>
        <span
          className={styles.fireEmoji}
          style={{ transform: `scale(${0.5 + fire / 130})`, opacity: fire > 0 ? 1 : 0 }}
          aria-hidden="true"
        >
          🔥
        </span>
      </div>

      <div className={styles.passProgressTrack}>
        <div className={styles.passProgressFill} style={{ width: `${fire}%` }} />
      </div>

      <div className={styles.passSteps}>
        {order.map((s) => {
          const isDone = STEPS.findIndex((x) => x.key === s.key) < step;
          return (
            <button
              key={s.key}
              className={`${styles.passStepBtn} ${isDone ? styles.passStepDone : ""} ${
                wrongKey === s.key ? styles.dchBtnWrong : ""
              }`}
              onClick={() => tap(s.key)}
              disabled={isDone}
            >
              <span className={styles.passStepLetter}>{s.letter}</span>
              <span style={{ fontWeight: 700 }}>{s.label}</span>
              <span style={{ fontSize: "0.7rem", color: "var(--text-faint)" }}>{s.desc}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
