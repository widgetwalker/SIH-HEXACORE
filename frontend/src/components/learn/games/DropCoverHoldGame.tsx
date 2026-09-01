"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./games.module.css";

const STEPS = ["DROP", "COVER", "HOLD ON"] as const;
const ROUNDS = 3;

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

type Phase = "ready" | "waiting" | "playing" | "gameResult";

export default function DropCoverHoldGame({ onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>("ready");
  const [round, setRound] = useState(0);
  const [step, setStep] = useState(0);
  const [buttons, setButtons] = useState<string[]>(() => shuffle(STEPS));
  const [flash, setFlash] = useState<{ label: string; ok: boolean } | null>(null);
  const [times, setTimes] = useState<number[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const alertAt = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }, []);

  const startRound = () => {
    setPhase("waiting");
    setStep(0);
    setButtons(shuffle(STEPS));
    const delay = 900 + Math.random() * 1600;
    timeoutRef.current = setTimeout(() => {
      alertAt.current = Date.now();
      setPhase("playing");
    }, delay);
  };

  const tap = (label: string) => {
    if (phase !== "playing") return;
    const correct = label === STEPS[step];
    setFlash({ label, ok: correct });
    setTimeout(() => setFlash(null), 220);

    if (!correct) {
      setMistakes((m) => m + 1);
      return;
    }
    if (step + 1 < STEPS.length) {
      setStep((s) => s + 1);
      return;
    }
    // round complete
    const elapsed = Date.now() - alertAt.current;
    const nextTimes = [...times, elapsed];
    setTimes(nextTimes);
    if (round + 1 < ROUNDS) {
      setRound((r) => r + 1);
      setTimeout(startRound, 500);
    } else {
      const avg = nextTimes.reduce((a, b) => a + b, 0) / nextTimes.length;
      const speedScore = Math.max(0, 100 - Math.round(avg / 40) - mistakes * 8);
      const score = Math.max(20, Math.min(100, speedScore));
      setPhase("gameResult");
      onComplete(score);
    }
  };

  if (phase === "gameResult") {
    const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
    const score = Math.max(20, Math.min(100, Math.max(0, 100 - Math.round(avg / 40) - mistakes * 8)));
    const stars = score >= 90 ? 3 : score >= 70 ? 2 : 1;
    return (
      <div className={styles.resultBox}>
        <span style={{ fontSize: "2rem" }}>{"⭐".repeat(stars)}{"☆".repeat(3 - stars)}</span>
        <span className={styles.resultScore}>{score}%</span>
        <p style={{ color: "var(--text-muted)" }}>
          Avg reaction: {avg}ms across {ROUNDS} rounds · {mistakes} misstep{mistakes === 1 ? "" : "s"}
        </p>
        <div className={styles.resultActions}>
          <button
            className="btn btn-primary"
            onClick={() => {
              setRound(0);
              setTimes([]);
              setMistakes(0);
              startRound();
            }}
          >
            Retry Drill
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dchPrompt}>
      <p style={{ color: "var(--text-muted)", marginBottom: 14 }}>
        When the alert fires, tap <b>Drop</b>, then <b>Cover</b>, then <b>Hold On</b> — in that
        order, as fast as you can. Button positions shuffle every round.
      </p>
      <p className={styles.dchStepLabel}>Round {Math.min(round + 1, ROUNDS)} / {ROUNDS}</p>

      {phase === "ready" && (
        <button className="btn btn-primary" onClick={startRound} style={{ marginTop: 14 }}>
          Start Drill
        </button>
      )}

      {phase === "waiting" && (
        <p style={{ marginTop: 24, color: "var(--text-faint)" }}>Stay alert…</p>
      )}

      {phase === "playing" && (
        <>
          <p className={styles.dchAlert} style={{ marginTop: 10 }}>⚠ EARTHQUAKE DETECTED</p>
          <div className={styles.dchButtons} style={{ marginTop: 16 }}>
            {buttons.map((label) => (
              <button
                key={label}
                className={`${styles.dchBtn} ${
                  flash?.label === label ? (flash.ok ? styles.dchBtnCorrect : styles.dchBtnWrong) : ""
                }`}
                onClick={() => tap(label)}
              >
                {label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
