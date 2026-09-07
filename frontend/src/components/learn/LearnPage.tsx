"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { ALL_TIER_IDS, TIER_GAME_CONFIG, findModuleTier, shortId } from "./tiergame/moduleRegistry";
import { QUIZ_MODULES_BY_TIER, loadQuizScores, isLevelUnlocked, QUIZ_PASS_PCT } from "./tiergame/quizRegistry";
import type { ModuleType } from "./tiergame/types";
import { loadCadetProfile, type CadetProfile } from "@/lib/cadetProfile";
import styles from "./LearnPage.module.css";

const TIERS = [
  { id: 1, age: "5–7", label: "Explorers", color: "teal", icon: "🌱" },
  { id: 2, age: "8–10", label: "Rangers", color: "blue", icon: "🛡️" },
  { id: 3, age: "11–13", label: "Guardians", color: "violet", icon: "⚡" },
  { id: 4, age: "14–17", label: "Sentinels", color: "amber", icon: "🔥" },
  { id: 5, age: "18+", label: "Wardens", color: "red", icon: "🎖️" },
];

const TYPE_LABEL: Record<ModuleType, string> = { interactive: "Interactive", simulation: "Simulation", "video-quiz": "Video + Quiz" };

/* tierScores used to be in-memory only, which was fine while every module
   played out in a modal on this same page. Now "simulation"-type modules
   navigate away to /simulate and back, which unmounts LearnPage entirely -
   without persistence that round trip would wipe every other module's
   progress from the same session, not just reset the one being played. */
const TIER_SCORES_KEY = "safezone_tier_scores_v1";

function loadTierScores(): Record<number, Record<string, number>> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(TIER_SCORES_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    // Corrupted/foreign data (null, an array, a primitive) would otherwise
    // turn a "just reset progress" fallback into a hard crash the first
    // time something does tierScores[tierId] on it.
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return {};
    return parsed as Record<number, Record<string, number>>;
  } catch {
    return {};
  }
}

const BADGES = [
  { name: "First Responder", earned: true, icon: "🏅" },
  { name: "Fire Marshal", earned: true, icon: "🔥" },
  { name: "Quake Survivor", earned: false, icon: "🌍" },
  { name: "Floor Warden", earned: false, icon: "🛡️" },
  { name: "Crisis Commander", earned: false, icon: "⭐" },
  { name: "NDMA Certified", earned: false, icon: "🎖️" },
];

function tierCompletion(tierId: number, scores: Record<number, Record<string, number>>): { completed: number; total: number } {
  const cfg = TIER_GAME_CONFIG[tierId];
  if (!cfg) return { completed: 0, total: 0 };
  const tierScoreMap = scores[tierId] ?? {};
  const completed = cfg.modules.filter((m) => tierScoreMap[m.id.replace(`${cfg.prefix}-`, "")] !== undefined).length;
  return { completed, total: cfg.modules.length };
}

/* Sidebar-wide stats, computed live from real tierScores instead of the
   hardcoded 35% / "5 Lessons Done" / "91% Avg Score" placeholders that used
   to sit here regardless of actual progress. */
function overallStats(scores: Record<number, Record<string, number>>) {
  const totalModules = ALL_TIER_IDS.reduce((sum, tid) => sum + (TIER_GAME_CONFIG[tid]?.modules.length ?? 0), 0);
  const allScores = ALL_TIER_IDS.flatMap((tid) => Object.values(scores[tid] ?? {}));
  const completedCount = allScores.length;
  const overallPct = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;
  const avgScore = completedCount > 0 ? Math.round(allScores.reduce((a, b) => a + b, 0) / completedCount) : 0;

  let studyMinutes = 0;
  let drillsRun = 0;
  for (const tid of ALL_TIER_IDS) {
    const cfg = TIER_GAME_CONFIG[tid];
    if (!cfg) continue;
    const tierScoreMap = scores[tid] ?? {};
    for (const m of cfg.modules) {
      const id = m.id.replace(`${cfg.prefix}-`, "");
      if (tierScoreMap[id] === undefined) continue;
      studyMinutes += m.estMinutes;
      if (m.type === "simulation") drillsRun += 1;
    }
  }
  const studyTimeLabel = studyMinutes >= 60 ? `${(studyMinutes / 60).toFixed(1)}h` : `${studyMinutes}m`;

  return { overallPct, completedCount, avgScore, studyTimeLabel, drillsRun };
}

export default function LearnPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTier, setActiveTier] = useState(2);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [selectedModule, setSelectedModule] = useState<string | null>("m1");
  const [toast, setToast] = useState<string | null>(null);
  const [profile, setProfile] = useState<CadetProfile | null>(null);
  // Starts empty so the server-rendered markup and the client's first paint
  // match exactly (avoids a hydration mismatch) - real scores load right
  // after mount instead of during the initial render.
  const [tierScores, setTierScores] = useState<Record<number, Record<string, number>>>({});
  const [quizScores, setQuizScores] = useState<Record<string, Record<number, number>>>({});
  const skipNextSave = useRef(true);

  useEffect(() => {
    setTierScores(loadTierScores());
    setQuizScores(loadQuizScores());
    const cadet = loadCadetProfile();
    setProfile(cadet);
    if (cadet) setActiveTier(cadet.tierId);
  }, []);

  useEffect(() => {
    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }
    try {
      window.localStorage.setItem(TIER_SCORES_KEY, JSON.stringify(tierScores));
    } catch {
      /* storage full or unavailable - non-fatal, progress just won't survive a reload */
    }
  }, [tierScores]);

  /* first module in a tier's list is always unlocked; each next one unlocks
     once the previous is completed - real sequential progression, not mock data */
  const tierModuleStatus = (tierId: number, moduleId: string): "locked" | "in-progress" | "completed" => {
    const cfg = TIER_GAME_CONFIG[tierId];
    if (!cfg) return "locked";
    const scores = tierScores[tierId] ?? {};
    if (scores[moduleId] !== undefined) return "completed";
    const idx = cfg.modules.findIndex((m) => m.id === `${cfg.prefix}-${moduleId}`);
    if (idx <= 0) return "in-progress";
    const prevId = cfg.modules[idx - 1].id.replace(`${cfg.prefix}-`, "");
    return scores[prevId] !== undefined ? "in-progress" : "locked";
  };

  const stats = overallStats(tierScores);

  const showToast = (msg: string, duration = 2500) => {
    setToast(msg);
    setTimeout(() => setToast(null), duration);
  };

  /* Round trip from a "simulation"-type checkpoint's real /simulate drill:
     applies the score, jumps to the right tier, and surfaces the module's
     own PDF checkpoint explanation as a toast — since the drill happened on
     a different page, this is the only place that content can be shown. */
  useEffect(() => {
    const result = searchParams.get("moduleResult");
    if (!result) return;
    const [fullModuleId, status] = result.split(":");
    const owner = findModuleTier(fullModuleId);
    if (owner) {
      const scorePct = status === "won" ? 100 : 60;
      setActiveTier(owner.tierId);
      setTierScores((prev) => ({
        ...prev,
        [owner.tierId]: { ...(prev[owner.tierId] ?? {}), [owner.shortId]: scorePct },
      }));
      const checkpoint = owner.module.sections.find((s) => s.checkpoint)?.checkpoint;
      if (checkpoint) {
        const text = status === "won" ? checkpoint.correct.explanation : checkpoint.wrong.explanation;
        showToast(status === "won" ? `✅ Drill cleared — ${text}` : `Drill logged — ${text}`, 6000);
      }
    }
    router.replace("/learn");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.page}>
      <Navbar mode="learning" />

      {toast && (
        <div className={styles.toast}>
          <span>{toast}</span>
        </div>
      )}

      <div className={styles.layout}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div
            className={styles.sidebarProfile}
            onClick={() => router.push("/profile")}
            role="button"
            tabIndex={0}
            style={{ cursor: "pointer" }}
          >
            <div className={styles.profileAvatar}>{profile ? profile.name.charAt(0).toUpperCase() : "?"}</div>
            <div className={styles.profileInfo}>
              <span className={styles.profileName}>{profile?.name ?? "Cadet"}</span>
              <span className={styles.profileRole}>{profile?.grade ?? "Student Responder"}</span>
            </div>
          </div>

          <div className="divider" style={{ margin: "16px 0" }} />

          <div className={styles.sidebarSection}>
            <span className="label" style={{ color: "var(--text-faint)", padding: "0 12px" }}>Progress</span>
            <div className={styles.progressRing}>
              <svg viewBox="0 0 100 100" className={styles.ringsSvg}>
                <circle cx="50" cy="50" r="42" fill="none" stroke="var(--border-subtle)" strokeWidth="6" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="var(--accent-teal)" strokeWidth="6"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  strokeDashoffset={`${2 * Math.PI * 42 * (1 - stats.overallPct / 100)}`}
                  strokeLinecap="round" transform="rotate(-90 50 50)" style={{ filter: "drop-shadow(0 0 6px rgba(0,212,170,0.5))" }} />
              </svg>
              <div className={styles.ringCenter}>
                <span className={styles.ringValue}>{stats.overallPct}%</span>
                <span className={styles.ringLabel}>Overall</span>
              </div>
            </div>
          </div>

          <div className="divider" style={{ margin: "16px 0" }} />

          <div className={styles.sidebarSection}>
            <span className="label" style={{ color: "var(--text-faint)", padding: "0 12px" }}>Quick Stats</span>
            <div className={styles.quickStats}>
              <div className={styles.quickStat}><span className={styles.qsVal}>{stats.completedCount}</span><span className={styles.qsLbl}>Lessons Done</span></div>
              <div className={styles.quickStat}><span className={styles.qsVal} style={{ color: "var(--accent-amber)" }}>{stats.avgScore}%</span><span className={styles.qsLbl}>Avg Score</span></div>
              <div className={styles.quickStat}><span className={styles.qsVal} style={{ color: "var(--accent-blue)" }}>{stats.studyTimeLabel}</span><span className={styles.qsLbl}>Study Time</span></div>
              <div className={styles.quickStat}><span className={styles.qsVal} style={{ color: "var(--accent-violet)" }}>{stats.drillsRun}</span><span className={styles.qsLbl}>Drills Run</span></div>
            </div>
          </div>

          <div className="divider" style={{ margin: "16px 0" }} />

          <nav className={styles.sidebarNav}>
            {(
              [
                { label: "Dashboard", profileTab: undefined },
                { label: "My Certificates", profileTab: "my-certificates" },
                { label: "Leaderboard", profileTab: "leaderboard" },
                { label: "Settings", profileTab: "settings" },
              ] as { label: string; profileTab?: string }[]
            ).map((item) => (
              <button
                key={item.label}
                className={`${styles.navItem} ${activeTab === item.label ? styles.navItemActive : ""}`}
                onClick={() => {
                  if (item.profileTab) {
                    router.push(`/profile?tab=${item.profileTab}`);
                    return;
                  }
                  setActiveTab(item.label);
                  showToast(`Switched to ${item.label}`);
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className={styles.main}>
          {/* Tier selector */}
          <section className={styles.tierSection}>
            <h2 className="heading-lg">Select Your Tier</h2>
            <div className={styles.tierGrid}>
              {TIERS.map((t) => {
                const { completed, total } = tierCompletion(t.id, tierScores);
                return (
                <button
                  key={t.id}
                  className={`${styles.tierCard} ${activeTier === t.id ? styles.tierActive : ""}`}
                  onClick={() => setActiveTier(t.id)}
                  style={{ "--tier-color": `var(--accent-${t.color})` } as React.CSSProperties}
                >
                  <span className={styles.tierIcon}>{t.icon}</span>
                  <span className={styles.tierAge}>Ages {t.age}</span>
                  <span className={styles.tierName}>{t.label}</span>
                  <div className={styles.tierProgress}>
                    <div className="progress-track">
                      <div className="progress-bar" style={{ width: `${total > 0 ? (completed / total) * 100 : 0}%`, background: `var(--accent-${t.color})` }} />
                    </div>
                    <span className={styles.tierCount}>{completed}/{total}</span>
                  </div>
                </button>
                );
              })}
            </div>
          </section>

          {/* Modules list */}
          <section className={styles.modulesSection}>
            <div className={styles.modulesHeader}>
              <h2 className="heading-lg">Learning Modules</h2>
              <span className="badge badge-teal">Tier {activeTier}</span>
            </div>
            <div className={styles.modulesList}>
              {(TIER_GAME_CONFIG[activeTier]?.modules ?? []).map((real) => {
                const id = shortId(activeTier, real.id);
                const status = tierModuleStatus(activeTier, id);
                const score = tierScores[activeTier]?.[id] ?? null;
                const typeLabel = TYPE_LABEL[real.type];
                return (
                <div
                  key={real.id}
                  className={`${styles.moduleCard} ${selectedModule === id ? styles.moduleSelected : ""} ${status === "locked" ? styles.moduleLocked : ""}`}
                  onClick={() => {
                    if (status === "locked") {
                      showToast("🔒 Complete previous modules to unlock this drill");
                      return;
                    }
                    setSelectedModule(id);
                    router.push(`/learn/${real.id}`);
                  }}
                  role="button"
                  tabIndex={status !== "locked" ? 0 : -1}
                >
                  <span className={styles.moduleIcon}>{real.icon}</span>
                  <div className={styles.moduleInfo}>
                    <h3 className={styles.moduleTitle}>{real.name}</h3>
                    <div className={styles.moduleMeta}>
                      <span className={`badge ${typeLabel === "Simulation" ? "badge-blue" : typeLabel === "Interactive" ? "badge-teal" : "badge-violet"}`}>{typeLabel}</span>
                      <span className={styles.moduleDuration}>{real.estMinutes} min</span>
                    </div>
                  </div>
                  <div className={styles.moduleRight}>
                    {status === "completed" && (
                      <div className={styles.moduleScore}>
                        <span className={styles.scoreVal}>{score}%</span>
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="8" stroke="var(--accent-teal)" strokeWidth="1.5"/><path d="M6 9l2 2 4-4" stroke="var(--accent-teal)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                    )}
                    {status === "in-progress" && <span className="badge badge-amber badge-pulse">In Progress</span>}
                    {status === "locked" && (
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className={styles.lockIcon}>
                        <rect x="4" y="8" width="10" height="8" rx="2" stroke="var(--text-faint)" strokeWidth="1.5"/>
                        <path d="M6 8V6a3 3 0 016 0v2" stroke="var(--text-faint)" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    )}
                  </div>
                </div>
                );
              })}
            </div>
          </section>

          {/* Quiz Arena — per-module cards */}
          <section className={styles.quizArenaSection}>
            <h2 className="heading-lg">🎯 Quiz Arena</h2>
            <p style={{ color: "var(--text-faint)", fontSize: "0.9rem", marginTop: "-8px" }}>
              Test what you've learned — {TIERS.find((t) => t.id === activeTier)?.label ?? "this tier"} · Ages {TIERS.find((t) => t.id === activeTier)?.age ?? ""}
            </p>
            <div className={styles.quizModuleGrid}>
              {(QUIZ_MODULES_BY_TIER[activeTier] ?? []).map((qm) => {
                const bestLevel = qm.levels.reduce((max, l) => {
                  const s = quizScores[qm.moduleId]?.[l.level] ?? 0;
                  return s >= QUIZ_PASS_PCT ? l.level : max;
                }, 0);
                const totalLevels = qm.levels.length;
                const progressPct = Math.round((bestLevel / totalLevels) * 100);
                return (
                  <button
                    key={qm.moduleId}
                    className={styles.quizModuleCard}
                    onClick={() => router.push(`/learn/quiz/${activeTier}/${qm.moduleId}`)}
                  >
                    <span className={styles.quizModuleIcon}>{qm.icon}</span>
                    <div className={styles.quizModuleInfo}>
                      <span className={styles.quizModuleName}>{qm.name}</span>
                      <span className={styles.quizModuleMeta}>
                        {totalLevels} levels · {bestLevel > 0 ? `${bestLevel}/${totalLevels} passed` : "Not started"}
                      </span>
                      <span className={styles.quizModuleAge}>Ages {TIERS.find((t) => t.id === activeTier)?.age ?? ""}</span>
                    </div>
                    <div className={styles.quizModuleProgress}>
                      <svg width="36" height="36" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="15" fill="none" stroke="var(--border-subtle)" strokeWidth="3" />
                        <circle
                          cx="18" cy="18" r="15" fill="none"
                          stroke="var(--accent-teal)" strokeWidth="3"
                          strokeDasharray={`${progressPct * 0.942} 100`}
                          strokeLinecap="round"
                          transform="rotate(-90 18 18)"
                        />
                      </svg>
                      <span className={styles.quizModulePct}>{progressPct}%</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Badges */}
          <section className={styles.badgesSection}>
            <h2 className="heading-lg">Achievement Badges</h2>
            <div className={styles.badgesGrid}>
              {BADGES.map((b) => (
                <div
                  key={b.name}
                  className={`${styles.badgeCard} ${!b.earned ? styles.badgeLocked : ""}`}
                  onClick={() => showToast(b.earned ? `🏅 Earned: ${b.name}` : `🔒 ${b.name} (Incomplete)`)}
                  role="button"
                  tabIndex={0}
                >
                  <span className={styles.badgeEmoji}>{b.icon}</span>
                  <span className={styles.badgeName}>{b.name}</span>
                  {b.earned && <span className={styles.badgeCheck}>✓</span>}
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
