"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { DecisionCheckpoint } from "./types";
import styles from "./RouteMapChoice.module.css";

interface Props {
  checkpoint: DecisionCheckpoint;
  choice: "correct" | "wrong" | null;
  onChoose: (c: "correct" | "wrong") => void;
}

const START = { x: 200, y: 34 };
const LEFT_END = { x: 90, y: 170 };
const RIGHT_END = { x: 310, y: 170 };

interface Side {
  key: "correct" | "wrong";
  label: string;
  end: { x: number; y: number };
  path: string;
}

/*
 * Clickable branching-path map that replaces the two text buttons for
 * "interactive"-type checkpoints. The hazard is deliberately NOT shown until
 * after the player answers — same read-the-scenario-then-decide mechanic as
 * before, just spatial instead of two stacked buttons.
 */
export default function RouteMapChoice({ checkpoint, choice, onChoose }: Props) {
  const answered = choice !== null;
  // Fixed on first paint (server and client agree, no hydration mismatch),
  // then re-randomized client-side right after mount - this component only
  // ever mounts from a client-side click, so there's no visible flash.
  const [correctFirst, setCorrectFirst] = useState(true);
  useEffect(() => {
    setCorrectFirst(Math.random() < 0.5);
  }, [checkpoint.scenario]);
  const hazardIcon = checkpoint.wrong.hazardIcon ?? "🔥";
  const vertical = checkpoint.mapOrientation === "vertical";

  const sides: Side[] = [
    {
      key: correctFirst ? "correct" : "wrong",
      label: correctFirst ? checkpoint.correct.label : checkpoint.wrong.label,
      end: LEFT_END,
      path: `M${START.x},${START.y} C140,112 108,148 ${LEFT_END.x},${LEFT_END.y}`,
    },
    {
      key: correctFirst ? "wrong" : "correct",
      label: correctFirst ? checkpoint.wrong.label : checkpoint.correct.label,
      end: RIGHT_END,
      path: `M${START.x},${START.y} C260,112 292,148 ${RIGHT_END.x},${RIGHT_END.y}`,
    },
  ];

  const chosenSide = sides.find((s) => s.key === choice);

  const choose = (key: "correct" | "wrong") => {
    if (!answered) onChoose(key);
  };

  return (
    <div>
      <p className={styles.scenario}>{checkpoint.scenario}</p>
      <svg viewBox="0 0 400 300" className={styles.map} role="group" aria-label="Choose a route">
        <text x={START.x} y={START.y - 14} textAnchor="middle" className={styles.youAreHere}>
          {vertical ? "Your floor" : "You are here"}
        </text>
        <circle cx={START.x} cy={START.y} r="9" className={styles.playerDot} />

        {sides.map((side) => {
          const isChosen = choice === side.key;
          const isDimmed = answered && !isChosen;
          return (
            <g
              key={side.key}
              className={`${styles.route} ${answered ? styles.routeAnswered : ""} ${isDimmed ? styles.routeDimmed : ""}`}
              onClick={() => choose(side.key)}
              tabIndex={answered ? -1 : 0}
              role="button"
              aria-label={side.label}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  choose(side.key);
                }
              }}
            >
              <path d={side.path} className={styles.routeHit} />
              <path
                d={side.path}
                className={`${styles.routeLine} ${
                  isChosen ? (side.key === "correct" ? styles.routeCorrect : styles.routeWrong) : ""
                }`}
              />
              {answered && side.key === "wrong" && (
                <text
                  x={(side.end.x + START.x) / 2}
                  y={(side.end.y + START.y) / 2}
                  textAnchor="middle"
                  className={styles.hazardIcon}
                >
                  {hazardIcon}
                </text>
              )}
              <circle cx={side.end.x} cy={side.end.y} r="15" className={styles.doorDot} />
              <text x={side.end.x} y={side.end.y + 5} textAnchor="middle" className={styles.doorIcon}>
                {answered ? (side.key === "correct" ? "✅" : "❌") : "🚪"}
              </text>
              <foreignObject x={side.end.x - 90} y={side.end.y + 18} width="180" height="96">
                <div className={styles.routeLabel}>{side.label}</div>
              </foreignObject>
            </g>
          );
        })}

        {answered && chosenSide && (
          <motion.circle
            r="6"
            className={styles.walker}
            initial={{ cx: START.x, cy: START.y }}
            animate={{ cx: chosenSide.end.x, cy: chosenSide.end.y }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          />
        )}
      </svg>

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
