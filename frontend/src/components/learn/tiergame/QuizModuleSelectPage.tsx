"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { TIER_NAMES } from "./moduleRegistry";
import { loadQuizScores, QUIZ_PASS_PCT } from "./quizRegistry";
import type { QuizModule } from "./types";
import styles from "./QuizModuleSelectPage.module.css";

interface Props {
  tierId: number;
  modules: QuizModule[];
}

export default function QuizModuleSelectPage({ tierId, modules }: Props) {
  const router = useRouter();
  const [scores, setScores] = useState<Record<string, Record<number, number>>>({});

  useEffect(() => {
    setScores(loadQuizScores());
  }, []);

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
          <p className={styles.subtitle}>Pick a hazard topic — each one has 5 levels of 5 questions</p>
        </header>

        <div className={styles.moduleGrid}>
          {modules.map((mod) => {
            const modScores = scores[mod.moduleId] ?? {};
            const levelsPassed = mod.levels.filter((l) => (modScores[l.level] ?? 0) >= QUIZ_PASS_PCT).length;
            return (
              <button
                key={mod.moduleId}
                className={styles.moduleCard}
                onClick={() => router.push(`/learn/quiz/${tierId}/${mod.moduleId}`)}
              >
                <span className={styles.moduleIcon}>{mod.icon}</span>
                <div className={styles.moduleInfo}>
                  <span className={styles.moduleName}>{mod.name}</span>
                  <span className={styles.moduleMeta}>{mod.levels.length} levels · 5 questions each</span>
                </div>
                <span className={`${styles.levelBadge} ${levelsPassed === mod.levels.length ? styles.levelBadgeDone : ""}`}>
                  {levelsPassed}/{mod.levels.length}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
