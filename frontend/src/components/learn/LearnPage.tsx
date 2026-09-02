"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import ModuleViewer from "./tiergame/ModuleViewer";
import { GUARDIANS_MODULE_1, GUARDIANS_MODULE_2, GUARDIANS_MODULE_3 } from "./tiergame/content/guardians";
import type { TierModuleContent } from "./tiergame/types";
import styles from "./LearnPage.module.css";

const GUARDIANS_TIER_ID = 3;
/* real module content, in unlock order — only Guardians is wired up so far;
   extend this list as more tiers/modules from docs/10_TIER_GAMES_SPECIFICATION.md land */
const GUARDIANS_REAL_MODULES: TierModuleContent[] = [GUARDIANS_MODULE_1, GUARDIANS_MODULE_2, GUARDIANS_MODULE_3];
const GUARDIANS_MODULE_BY_ID: Record<string, TierModuleContent> = {
  m1: GUARDIANS_MODULE_1,
  m2: GUARDIANS_MODULE_2,
  m3: GUARDIANS_MODULE_3,
};

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

const BADGES = [
  { name: "First Responder", earned: true, icon: "🏅" },
  { name: "Fire Marshal", earned: true, icon: "🔥" },
  { name: "Quake Survivor", earned: false, icon: "🌍" },
  { name: "Floor Warden", earned: false, icon: "🛡️" },
  { name: "Crisis Commander", earned: false, icon: "⭐" },
  { name: "NDMA Certified", earned: false, icon: "🎖️" },
];

export default function LearnPage() {
  const [activeTier, setActiveTier] = useState(2);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [selectedModule, setSelectedModule] = useState<string | null>("m1");
  const [toast, setToast] = useState<string | null>(null);
  const [viewerModuleId, setViewerModuleId] = useState<string | null>(null);
  const [guardiansScores, setGuardiansScores] = useState<Record<string, number>>({});

  /* first module in the list is always unlocked; each next one unlocks once
     the previous is completed - real sequential progression, not mock data */
  const guardiansStatus = (moduleId: string): "locked" | "in-progress" | "completed" => {
    if (guardiansScores[moduleId] !== undefined) return "completed";
    const idx = GUARDIANS_REAL_MODULES.findIndex((m) => m.id === `guardians-${moduleId}`);
    if (idx <= 0) return "in-progress";
    const prevId = GUARDIANS_REAL_MODULES[idx - 1].id.replace("guardians-", "");
    return guardiansScores[prevId] !== undefined ? "in-progress" : "locked";
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

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
                  strokeDashoffset={`${2 * Math.PI * 42 * (1 - 0.35)}`}
                  strokeLinecap="round" transform="rotate(-90 50 50)" style={{ filter: "drop-shadow(0 0 6px rgba(0,212,170,0.5))" }} />
              </svg>
              <div className={styles.ringCenter}>
                <span className={styles.ringValue}>35%</span>
                <span className={styles.ringLabel}>Overall</span>
              </div>
            </div>
          </div>

          <div className="divider" style={{ margin: "16px 0" }} />

          <div className={styles.sidebarSection}>
            <span className="label" style={{ color: "var(--text-faint)", padding: "0 12px" }}>Quick Stats</span>
            <div className={styles.quickStats}>
              <div className={styles.quickStat}><span className={styles.qsVal}>5</span><span className={styles.qsLbl}>Lessons Done</span></div>
              <div className={styles.quickStat}><span className={styles.qsVal} style={{ color: "var(--accent-amber)" }}>91%</span><span className={styles.qsLbl}>Avg Score</span></div>
              <div className={styles.quickStat}><span className={styles.qsVal} style={{ color: "var(--accent-blue)" }}>2h</span><span className={styles.qsLbl}>Study Time</span></div>
              <div className={styles.quickStat}><span className={styles.qsVal} style={{ color: "var(--accent-violet)" }}>3</span><span className={styles.qsLbl}>Drills Run</span></div>
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
              {TIERS.map((t) => (
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
                      <div className="progress-bar" style={{ width: `${(t.completed / t.modules) * 100}%`, background: `var(--accent-${t.color})` }} />
                    </div>
                    <span className={styles.tierCount}>{t.completed}/{t.modules}</span>
                  </div>
                </button>
              ))}
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
                const isRealGuardians = activeTier === GUARDIANS_TIER_ID && base.id in GUARDIANS_MODULE_BY_ID;
                const m = isRealGuardians
                  ? { ...base, status: guardiansStatus(base.id), score: guardiansScores[base.id] ?? null }
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
                    if (isRealGuardians) {
                      setViewerModuleId(m.id);
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

      {viewerModuleId && GUARDIANS_MODULE_BY_ID[viewerModuleId] && (
        <ModuleViewer
          module={GUARDIANS_MODULE_BY_ID[viewerModuleId]}
          onClose={() => setViewerModuleId(null)}
          onComplete={(scorePct) => {
            setGuardiansScores((prev) => ({ ...prev, [viewerModuleId]: scorePct }));
            setViewerModuleId(null);
            showToast(scorePct === 100 ? "✅ Module complete — nice work!" : "Module complete — review the checkpoint next time.");
          }}
        />
      )}
    </div>
  );
}
