"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import ModuleViewer from "./tiergame/ModuleViewer";
import { EXPLORERS_MODULE_1, EXPLORERS_MODULE_2, EXPLORERS_MODULE_3, EXPLORERS_MODULE_4 } from "./tiergame/content/explorers";
import { RANGERS_MODULE_1, RANGERS_MODULE_2, RANGERS_MODULE_3, RANGERS_MODULE_4, RANGERS_MODULE_5, RANGERS_MODULE_6 } from "./tiergame/content/rangers";
import { GUARDIANS_MODULE_1, GUARDIANS_MODULE_2, GUARDIANS_MODULE_3, GUARDIANS_MODULE_4, GUARDIANS_MODULE_5, GUARDIANS_MODULE_6 } from "./tiergame/content/guardians";
import { SENTINELS_MODULE_1, SENTINELS_MODULE_2, SENTINELS_MODULE_3, SENTINELS_MODULE_4, SENTINELS_MODULE_5, SENTINELS_MODULE_6 } from "./tiergame/content/sentinels";
import { WARDENS_MODULE_1, WARDENS_MODULE_2, WARDENS_MODULE_3, WARDENS_MODULE_4, WARDENS_MODULE_5, WARDENS_MODULE_6 } from "./tiergame/content/wardens";
import type { TierModuleContent } from "./tiergame/types";
import GameModal from "./games/GameModal";
import DropCoverHoldGame from "./games/DropCoverHoldGame";
import GoBagBuilder from "./games/GoBagBuilder";
import PassExtinguisherGame from "./games/PassExtinguisherGame";
import styles from "./LearnPage.module.css";

const EXPLORERS_TIER_ID = 1;
const RANGERS_TIER_ID = 2;
const GUARDIANS_TIER_ID = 3;
const SENTINELS_TIER_ID = 4;
const WARDENS_TIER_ID = 5;

/* Real content per tier, in unlock order, keyed by tier id. `prefix` matches
   each module's own id prefix (e.g. "guardians-m1") so it can be matched
   against the mock MODULES list's plain ids ("m1"). All 5 tiers from
   docs/10_TIER_GAMES_SPECIFICATION.md are now wired up. */
const TIER_GAME_CONFIG: Record<number, { prefix: string; modules: TierModuleContent[] }> = {
  [EXPLORERS_TIER_ID]: {
    prefix: "explorers",
    modules: [EXPLORERS_MODULE_1, EXPLORERS_MODULE_2, EXPLORERS_MODULE_3, EXPLORERS_MODULE_4],
  },
  [RANGERS_TIER_ID]: {
    prefix: "rangers",
    modules: [RANGERS_MODULE_1, RANGERS_MODULE_2, RANGERS_MODULE_3, RANGERS_MODULE_4, RANGERS_MODULE_5, RANGERS_MODULE_6],
  },
  [GUARDIANS_TIER_ID]: {
    prefix: "guardians",
    modules: [GUARDIANS_MODULE_1, GUARDIANS_MODULE_2, GUARDIANS_MODULE_3, GUARDIANS_MODULE_4, GUARDIANS_MODULE_5, GUARDIANS_MODULE_6],
  },
  [SENTINELS_TIER_ID]: {
    prefix: "sentinels",
    modules: [SENTINELS_MODULE_1, SENTINELS_MODULE_2, SENTINELS_MODULE_3, SENTINELS_MODULE_4, SENTINELS_MODULE_5, SENTINELS_MODULE_6],
  },
  [WARDENS_TIER_ID]: {
    prefix: "wardens",
    modules: [WARDENS_MODULE_1, WARDENS_MODULE_2, WARDENS_MODULE_3, WARDENS_MODULE_4, WARDENS_MODULE_5, WARDENS_MODULE_6],
  },
};

function getRealModule(tierId: number, moduleId: string): TierModuleContent | undefined {
  const cfg = TIER_GAME_CONFIG[tierId];
  if (!cfg) return undefined;
  return cfg.modules.find((m) => m.id === `${cfg.prefix}-${moduleId}`);
}

/* Reverse-lookup for the /simulate round trip: given a full module id
   (e.g. "guardians-m2"), find which tier owns it and its short id ("m2"). */
function findModuleTier(fullModuleId: string): { tierId: number; shortId: string; module: TierModuleContent } | undefined {
  for (const [tierIdStr, cfg] of Object.entries(TIER_GAME_CONFIG)) {
    const mod = cfg.modules.find((m) => m.id === fullModuleId);
    if (mod) return { tierId: Number(tierIdStr), shortId: mod.id.replace(`${cfg.prefix}-`, ""), module: mod };
  }
  return undefined;
}

const TIERS = [
  { id: 1, age: "5–7", label: "Explorers", color: "teal", icon: "🌱", modules: 4, completed: 2 },
  { id: 2, age: "8–10", label: "Rangers", color: "blue", icon: "🛡️", modules: 6, completed: 3 },
  { id: 3, age: "11–13", label: "Guardians", color: "violet", icon: "⚡", modules: 8, completed: 1 },
  { id: 4, age: "14–17", label: "Sentinels", color: "amber", icon: "🔥", modules: 10, completed: 0 },
  { id: 5, age: "18+", label: "Wardens", color: "red", icon: "🎖️", modules: 12, completed: 0 },
];

type GameKey = "dch" | "pass" | "gobag";

interface Module {
  id: string;
  title: string;
  type: string;
  duration: string;
  status: "completed" | "in-progress" | "locked";
  score: number | null;
  icon: string;
  game?: GameKey;
}

const MODULES: Module[] = [
  { id: "m1", title: "Earthquake: Drop, Cover, Hold On", type: "Interactive", duration: "12 min", status: "completed", score: 94, icon: "🌍", game: "dch" },
  { id: "m2", title: "Fire Evacuation: PASS Method", type: "Simulation", duration: "18 min", status: "completed", score: 88, icon: "🔥", game: "pass" },
  { id: "m3", title: "Floor-by-Floor Hazard Mapping", type: "Interactive", duration: "15 min", status: "in-progress", score: null, icon: "🗺️" },
  { id: "m4", title: "Chemical Spill: Lab Safety Protocol", type: "Video + Quiz", duration: "10 min", status: "locked", score: null, icon: "🧪" },
  { id: "m5", title: "Cyclone & Flood Shelter Procedures", type: "Interactive", duration: "14 min", status: "locked", score: null, icon: "🌊" },
  { id: "m6", title: "Multi-Hazard Compound Drill", type: "Simulation", duration: "25 min", status: "locked", score: null, icon: "⚠️" },
  { id: "m7", title: "Emergency Go-Bag Builder", type: "Interactive", duration: "8 min", status: "in-progress", score: null, icon: "🎒", game: "gobag" },
];

const GAME_META: Record<GameKey, { title: string; icon: string }> = {
  dch: { title: "Drop, Cover, Hold On — Reflex Drill", icon: "🌍" },
  pass: { title: "Fire Extinguisher — PASS Method", icon: "🔥" },
  gobag: { title: "Emergency Go-Bag Builder", icon: "🎒" },
};

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

export default function LearnPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTier, setActiveTier] = useState(2);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [selectedModule, setSelectedModule] = useState<string | null>("m1");
  const [toast, setToast] = useState<string | null>(null);
  const [viewer, setViewer] = useState<{ tierId: number; moduleId: string } | null>(null);
  const [tierScores, setTierScores] = useState<Record<number, Record<string, number>>>(loadTierScores);
  const [activeGameModule, setActiveGameModule] = useState<string | null>(null);

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
                    if (isRealTierModule) {
                      setViewer({ tierId: activeTier, moduleId: m.id });
                    } else if (m.game) {
                      setActiveGameModule(m.id);
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
                    {m.status === "in-progress" && <span className="badge badge-amber">In Progress</span>}
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

      {viewer && getRealModule(viewer.tierId, viewer.moduleId) && (
        <ModuleViewer
          key={`${viewer.tierId}-${viewer.moduleId}`}
          module={getRealModule(viewer.tierId, viewer.moduleId)!}
          onClose={() => setViewer(null)}
          onComplete={(scorePct) => {
            const { tierId, moduleId } = viewer;
            setTierScores((prev) => ({
              ...prev,
              [tierId]: { ...(prev[tierId] ?? {}), [moduleId]: scorePct },
            }));
            setViewer(null);
            showToast(scorePct === 100 ? "✅ Module complete — nice work!" : "Module complete — review the checkpoint next time.");
          }}
        />
      )}

      {activeGameModule && (() => {
        const mod = MODULES.find((m) => m.id === activeGameModule);
        if (!mod || !mod.game) return null;
        const meta = GAME_META[mod.game];
        const finishGame = (score: number) => {
          setTierScores((prev) => ({
            ...prev,
            [activeTier]: { ...(prev[activeTier] ?? {}), [mod.id]: score },
          }));
          setActiveGameModule(null);
          showToast(`✓ "${mod.title}" complete — scored ${score}%`);
        };
        return (
          <GameModal title={meta.title} icon={meta.icon} onClose={() => setActiveGameModule(null)}>
            {mod.game === "dch" && <DropCoverHoldGame onComplete={finishGame} />}
            {mod.game === "pass" && <PassExtinguisherGame onComplete={finishGame} />}
            {mod.game === "gobag" && <GoBagBuilder onComplete={finishGame} />}
          </GameModal>
        );
      })()}
    </div>
  );
}
