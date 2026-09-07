"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import RouteMapChoice from "./RouteMapChoice";
import { CheckpointCard, SimCheckpointPrompt } from "./CheckpointComponents";
import { LEARN_SCENARIOS } from "./content/simScenarios";
import { TIER_NAMES } from "./moduleRegistry";
import { loadActiveTierScores, saveActiveTierScores } from "@/lib/cadetProfile";
import type { TierModuleContent } from "./types";
import styles from "./ModuleReaderPage.module.css";

const PROGRESS_KEY_PREFIX = "safezone_progress_";

function loadReadingProgress(moduleId: string): { progress: number; scrollY: number } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PROGRESS_KEY_PREFIX + moduleId);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return null;
    const { progress, scrollY } = parsed as { progress?: unknown; scrollY?: unknown };
    if (typeof progress !== "number" || typeof scrollY !== "number") return null;
    return { progress, scrollY };
  } catch {
    return null;
  }
}

function saveReadingProgress(moduleId: string, progress: number, scrollY: number) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PROGRESS_KEY_PREFIX + moduleId, JSON.stringify({ progress, scrollY }));
  } catch {
    /* storage full or unavailable - non-fatal, scroll position just won't resume */
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
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSectionIdx, setCurrentSectionIdx] = useState(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const resumedRef = useRef(false);

  const readingSections = module.sections.filter((s) => !s.checkpoint);
  const checkpointSection = module.sections.find((s) => s.checkpoint);
  const checkpoint = checkpointSection?.checkpoint;
  const simScenario = LEARN_SCENARIOS[module.id];
  const isSimCheckpoint = module.type === "simulation" && !!simScenario && !!checkpoint;

  const totalSections = module.sections.length;
  const minutesRemaining = useMemo(
    () => module.sections.slice(currentSectionIdx).reduce((sum, s) => sum + s.estMinutes, 0),
    [module.sections, currentSectionIdx]
  );

  // Resume mid-lesson scroll position from a prior visit, then start tracking
  // live progress. Runs once per module - re-mounts (a fresh moduleId) get a
  // fresh resume.
  useEffect(() => {
    resumedRef.current = false;
    setScrollProgress(0);
    setCurrentSectionIdx(0);
    const saved = loadReadingProgress(module.id);
    const restore = () => {
      if (saved && saved.scrollY > 0) window.scrollTo(0, saved.scrollY);
      resumedRef.current = true;
    };
    const raf = requestAnimationFrame(restore);

    let debounceTimer: ReturnType<typeof setTimeout> | null = null;
    const computeProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.min(100, Math.max(0, Math.round((window.scrollY / max) * 100))) : 0;
      setScrollProgress(pct);

      let idx = 0;
      sectionRefs.current.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top <= 140) idx = i;
      });
      setCurrentSectionIdx(idx);

      if (resumedRef.current) {
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => saveReadingProgress(module.id, pct, window.scrollY), 400);
      }
    };

    computeProgress();
    window.addEventListener("scroll", computeProgress, { passive: true });
    window.addEventListener("resize", computeProgress);
    return () => {
      cancelAnimationFrame(raf);
      if (debounceTimer) clearTimeout(debounceTimer);
      window.removeEventListener("scroll", computeProgress);
      window.removeEventListener("resize", computeProgress);
    };
  }, [module.id]);

const saveScore = async (tierId: number, moduleShortId: string, scorePct: number) => {
  const scores = loadActiveTierScores();
  const next = { ...scores, [tierId]: { ...(scores[tierId] ?? {}), [moduleShortId]: scorePct } };
  await saveActiveTierScores(next);
};

// ... inside ModuleReaderPage
  const finish = async () => {
    await saveScore(tierId, moduleShortId, choice === "correct" ? 100 : 60);
    router.push("/learn");
  };

  return (
    <div className={styles.page}>
      <Navbar mode="learning" />

      <div className={styles.scrollBar} style={{ width: `${scrollProgress}%` }} aria-hidden="true" />
      <div className={styles.sectionPill}>
        Section {Math.min(currentSectionIdx + 1, totalSections)} of {totalSections} · {minutesRemaining} min remaining
      </div>

      <div className={styles.container}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <button onClick={() => router.push("/learn")}>SafeZone Learn</button>
          <span>›</span>
          <span>Tier {tierId} · {TIER_NAMES[tierId] ?? ""}</span>
          <span>›</span>
          <span className={styles.breadcrumbCurrent}>{module.name}</span>
        </nav>

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
          {readingSections.map((section, i) => (
            <section
              key={section.id}
              ref={(el) => {
                sectionRefs.current[i] = el;
              }}
              className={styles.section}
            >
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
          <section
            className={styles.quizSection}
            ref={(el) => {
              sectionRefs.current[readingSections.length] = el;
            }}
          >
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
