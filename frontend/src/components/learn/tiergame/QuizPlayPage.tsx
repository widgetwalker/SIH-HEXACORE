"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { TIER_NAMES } from "./moduleRegistry";
import { QUIZ_PASS_PCT, saveQuizScore } from "./quizRegistry";
import type { QuizLevel } from "./types";
import styles from "./QuizPlayPage.module.css";

interface Props {
  tierId: number;
  moduleId: string;
  moduleName: string;
  level: QuizLevel;
}

export default function QuizPlayPage({ tierId, moduleId, moduleName, level }: Props) {
  const router = useRouter();
  const [questionIdx, setQuestionIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);
  const [saved, setSaved] = useState(false);

  const question = level.questions[questionIdx];
  const answered = selected !== null;
  const isLast = questionIdx === level.questions.length - 1;
  const scorePct = Math.round((correctCount / level.questions.length) * 100);
  const passed = scorePct >= QUIZ_PASS_PCT;

  const choose = (i: number) => {
    if (answered) return;
    setSelected(i);
    if (question.options[i].correct) setCorrectCount((c) => c + 1);
  };

  const next = () => {
    if (isLast) {
      setDone(true);
      if (!saved) {
        saveQuizScore(moduleId, level.level, scorePct);
        setSaved(true);
      }
      return;
    }
    setQuestionIdx((i) => i + 1);
    setSelected(null);
  };

  const retry = () => {
    setQuestionIdx(0);
    setSelected(null);
    setCorrectCount(0);
    setDone(false);
    setSaved(false);
  };

  if (done) {
    return (
      <div className={styles.page}>
        <Navbar mode="learning" />
        <div className={styles.container}>
          <div className={`${styles.resultCard} ${passed ? styles.resultPass : styles.resultFail}`}>
            <span className={styles.resultEmoji}>{passed ? "🏆" : "📖"}</span>
            <h1 className={styles.resultTitle}>{passed ? "Level Passed!" : "Not Quite Yet"}</h1>
            <p className={styles.resultScore}>
              {correctCount} / {level.questions.length} correct · {scorePct}%
            </p>
            <p className={styles.resultMsg}>
              {passed
                ? "Nice work — the next level is now unlocked."
                : `You need ${QUIZ_PASS_PCT}% to pass and unlock the next level. Give it another try.`}
            </p>
            <div className={styles.resultActions}>
              <button className="btn btn-ghost" onClick={retry}>
                Retry Level
              </button>
              <button className="btn btn-primary" onClick={() => router.push(`/learn/quiz/${tierId}/${moduleId}`)}>
                Back to Levels →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Navbar mode="learning" />
      <div className={styles.container}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <button onClick={() => router.push("/learn")}>SafeZone Learn</button>
          <span>›</span>
          <button onClick={() => router.push(`/learn/quiz/${tierId}`)}>
            {TIER_NAMES[tierId] ?? "Quiz"} Arena
          </button>
          <span>›</span>
          <button onClick={() => router.push(`/learn/quiz/${tierId}/${moduleId}`)}>{moduleName}</button>
          <span>›</span>
          <span className={styles.breadcrumbCurrent}>Level {level.level}</span>
        </nav>

        <div className={styles.progressTrack}>
          <div
            className={styles.progressFill}
            style={{ width: `${(questionIdx / level.questions.length) * 100}%` }}
          />
        </div>
        <p className={styles.questionCount}>
          Question {questionIdx + 1} of {level.questions.length}
        </p>

        <h1 className={styles.levelTitle}>
          {moduleName} — Level {level.level}
        </h1>

        <div className={styles.questionCard}>
          <p className={styles.prompt}>{question.prompt}</p>
          <div className={styles.options}>
            {question.options.map((opt, i) => {
              const isChosen = selected === i;
              const showState = answered && (isChosen || opt.correct);
              return (
                <button
                  key={i}
                  className={`${styles.optionBtn} ${
                    showState ? (opt.correct ? styles.optionCorrect : styles.optionWrong) : ""
                  }`}
                  disabled={answered}
                  onClick={() => choose(i)}
                >
                  {answered && opt.correct && <span className={styles.mark}>✅</span>}
                  {answered && isChosen && !opt.correct && <span className={styles.mark}>❌</span>}
                  {opt.text}
                </button>
              );
            })}
          </div>

          {answered && (
            <div className={`${styles.feedback} ${question.options[selected].correct ? styles.feedbackGood : styles.feedbackBad}`}>
              <strong>{question.options[selected].correct ? "Correct!" : "Not quite."}</strong>
              <p>{question.explanation}</p>
            </div>
          )}
        </div>

        {answered && (
          <div className={styles.footer}>
            <button className="btn btn-primary" onClick={next}>
              {isLast ? "See Results →" : "Next Question →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
