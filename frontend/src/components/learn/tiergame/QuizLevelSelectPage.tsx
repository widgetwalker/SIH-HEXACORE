"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { TIER_NAMES } from "./moduleRegistry";
import { isLevelUnlocked, loadQuizScores, QUIZ_PASS_PCT } from "./quizRegistry";
import type { QuizLevel } from "./types";
import styles from "./QuizLevelSelectPage.module.css";

interface Props {
  tierId: number;
  levels: QuizLevel[];
}

export default function QuizLevelSelectPage({ tierId, levels }: Props) {
  const router = useRouter();
  const [scores, setScores] = useState<Record<number, Record<number, number>>>({});

  useEffect(() => {
    setScores(loadQuizScores());
  }, []);

  const tierScores = scores[tierId] ?? {};

  return (
    <div className={styles.page}>
      <Navbar mode="learning" />
      <div className={styles.container}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <button onClick={() => router.push("/learn")}>SafeZone Learn</button>
          <span>›</span>
          <span className={styles.breadcrumbCurrent}>{TIER_NAMES[tierId] ?? "Quiz"} Arena</span>
        </nav>

        <button className="btn btn-ghost" onClick={() => router.push("/learn")}>
          ← Back to Modules
        </button>

        <header className={styles.header}>
          <span className={styles.badge}>🎯 Quiz Arena</span>
          <h1 className={styles.title}>{TIER_NAMES[tierId] ?? "Quiz"} Knowledge Quiz</h1>
          <p className={styles.subtitle}>
            5 levels · 5 questions each · score {QUIZ_PASS_PCT}%+ to unlock the next level
          </p>
        </header>

        <div className={styles.levelGrid}>
          {levels.map((level) => {
            const unlocked = isLevelUnlocked(tierId, level.level, scores);
            const best = tierScores[level.level];
            const passed = best !== undefined && best >= QUIZ_PASS_PCT;
            return (
              <button
                key={level.level}
                className={`${styles.levelCard} ${!unlocked ? styles.levelLocked : ""} ${passed ? styles.levelPassed : ""}`}
                disabled={!unlocked}
                onClick={() => router.push(`/learn/quiz/${tierId}/${level.level}`)}
              >
                <span className={styles.levelNum}>{unlocked ? level.level : "🔒"}</span>
                <div className={styles.levelInfo}>
                  <span className={styles.levelName}>
                    Level {level.level}: {level.title}
                  </span>
                  <span className={styles.levelMeta}>{level.questions.length} questions</span>
                </div>
                {best !== undefined && (
                  <span className={`${styles.scoreBadge} ${passed ? styles.scoreBadgePass : ""}`}>{best}%</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
