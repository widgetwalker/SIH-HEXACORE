"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { ALL_TIER_IDS, TIER_GAME_CONFIG, findModuleTier, getRealModule } from "./tiergame/moduleRegistry";
import styles from "./LearnPage.module.css";

const TIERS = [
  { id: 1, age: "5–7", label: "Explorers", color: "teal", icon: "🌱", modules: 4, completed: 2 },
  { id: 2, age: "8–10", label: "Rangers", color: "blue", icon: "🛡️", modules: 6, completed: 3 },
  { id: 3, age: "11–13", label: "Guardians", color: "violet", icon: "⚡", modules: 8, completed: 1 },
  { id: 4, age: "14–17", label: "Sentinels", color: "amber", icon: "🔥", modules: 10, completed: 0 },
  { id: 5, age: "18+", label: "Wardens", color: "red", icon: "🎖️", modules: 12, completed: 0 },
];

const MODULES = [
  { id: "m1", title: "Earthquake: Drop, Cover, Hold On", type: "Interactive", duration: "12 min", status: "completed", score: 94, icon: "🌍" },
  { id: "m2", title: "Fire Evacuation: PASS Method", type: "Simulation", duration: "18 min", status: "completed", score: 88, icon: "🔥" },
  { id: "m3", title: "Floor-by-Floor Hazard Mapping", type: "Interactive", duration: "15 min", status: "in-progress", score: null, icon: "🗺️" },
  { id: "m4", title: "Chemical Spill: Lab Safety Protocol", type: "Video + Quiz", duration: "10 min", status: "locked", score: null, icon: "🧪" },
  { id: "m5", title: "Cyclone & Flood Shelter Procedures", type: "Interactive", duration: "14 min", status: "locked", score: null, icon: "🌊" },
  { id: "m6", title: "Multi-Hazard Compound Drill", type: "Simulation", duration: "25 min", status: "locked", score: null, icon: "⚠️" },
];

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

/* Real completed/total for a tier with wired content (Guardians/Sentinels/
   Wardens); tiers with no real content yet (Explorers/Rangers - no PDFs
   exist for them) fall back to their placeholder counts instead of 0/0. */
function tierCompletion(
  tierId: number,
  scores: Record<number, Record<string, number>>,
  fallback: { completed: number; total: number }
): { completed: number; total: number } {
  const cfg = TIER_GAME_CONFIG[tierId];
  if (!cfg) return fallback;
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
  const [tierScores, setTierScores] = useState<Record<number, Record<string, number>>>(loadTierScores);

  useEffect(() => {
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
          <div className={styles.sidebarProfile}>
            <div className={styles.profileAvatar}>D</div>
            <div className={styles.profileInfo}>
              <span className={styles.profileName}>Cadet</span>
              <span className={styles.profileRole}>Student Responder</span>
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
            {[
              { label: "Dashboard" },
              { label: "My Certificates" },
              { label: "Leaderboard" },
              { label: "Settings" },
            ].map((item) => (
              <button
                key={item.label}
                className={`${styles.navItem} ${activeTab === item.label ? styles.navItemActive : ""}`}
                onClick={() => {
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
                const { completed, total } = tierCompletion(t.id, tierScores, { completed: t.completed, total: t.modules });
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
              {MODULES.map((base) => {
                const real = getRealModule(activeTier, base.id);
                const isRealTierModule = !!real;
                const m = real
                  ? {
                      ...base,
                      title: real.name,
                      icon: real.icon,
                      duration: `${real.estMinutes} min`,
                      status: tierModuleStatus(activeTier, base.id),
                      score: tierScores[activeTier]?.[base.id] ?? null,
                    }
                  : base;
                return (
                <div
                  key={m.id}
                  className={`${styles.moduleCard} ${selectedModule === m.id ? styles.moduleSelected : ""} ${m.status === "locked" ? styles.moduleLocked : ""}`}
                  onClick={() => {
                    if (m.status === "locked") {
                      showToast("🔒 Complete previous modules to unlock this drill");
                      return;
                    }
                    setSelectedModule(m.id);
                    if (isRealTierModule && real) {
                      router.push(`/learn/${real.id}`);
                    } else {
                      showToast(`Loaded "${m.title}"`);
                    }
                  }}
                  role="button"
                  tabIndex={m.status !== "locked" ? 0 : -1}
                >
                  <span className={styles.moduleIcon}>{m.icon}</span>
                  <div className={styles.moduleInfo}>
                    <h3 className={styles.moduleTitle}>{m.title}</h3>
                    <div className={styles.moduleMeta}>
                      <span className={`badge ${m.type === "Simulation" ? "badge-blue" : m.type === "Interactive" ? "badge-teal" : "badge-violet"}`}>{m.type}</span>
                      <span className={styles.moduleDuration}>{m.duration}</span>
                    </div>
                  </div>
                  <div className={styles.moduleRight}>
                    {m.status === "completed" && (
                      <div className={styles.moduleScore}>
                        <span className={styles.scoreVal}>{m.score}%</span>
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="8" stroke="var(--accent-teal)" strokeWidth="1.5"/><path d="M6 9l2 2 4-4" stroke="var(--accent-teal)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                    )}
                    {m.status === "in-progress" && <span className="badge badge-amber badge-pulse">In Progress</span>}
                    {m.status === "locked" && (
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
