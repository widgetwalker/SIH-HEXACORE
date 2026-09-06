"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import CadetProfileForm from "@/components/onboarding/CadetProfileForm";
import { loadCadetProfile, type CadetProfile } from "@/lib/cadetProfile";
import { ALL_TIER_IDS, TIER_GAME_CONFIG, TIER_NAMES } from "@/components/learn/tiergame/moduleRegistry";
import { DEFAULT_SETTINGS, MITRA_VOICE_LANGUAGES, loadCadetSettings, saveCadetSettings, type CadetSettings } from "@/lib/cadetSettings";
import styles from "./ProfilePage.module.css";

const TIER_SCORES_KEY = "safezone_tier_scores_v1";
const TABS = ["Overview", "My Certificates", "Leaderboard", "Settings"] as const;
type Tab = (typeof TABS)[number];

function loadTierScores(): Record<number, Record<string, number>> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(TIER_SCORES_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return {};
    return parsed as Record<number, Record<string, number>>;
  } catch {
    return {};
  }
}

const MOCK_LEADERBOARD = [
  { name: "Aarav Mehta", score: 96 },
  { name: "Diya Kapoor", score: 91 },
  { name: "Kabir Singh", score: 87 },
  { name: "Ishita Rao", score: 82 },
  { name: "Rohan Iyer", score: 74 },
  { name: "Sneha Nair", score: 68 },
];

export default function ProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [profile, setProfile] = useState<CadetProfile | null>(null);
  const [tierScores, setTierScores] = useState<Record<number, Record<string, number>>>({});
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [editing, setEditing] = useState(false);
  const [settings, setSettings] = useState<CadetSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    setProfile(loadCadetProfile());
    setTierScores(loadTierScores());
    setSettings(loadCadetSettings());
    const tabParam = searchParams.get("tab");
    const match = TABS.find((t) => t.toLowerCase().replace(/\s+/g, "-") === tabParam);
    if (match) setActiveTab(match);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { readinessPct, completedCount, totalCount } = useMemo(() => {
    let completed = 0;
    let total = 0;
    for (const tierId of ALL_TIER_IDS) {
      const cfg = TIER_GAME_CONFIG[tierId];
      if (!cfg) continue;
      total += cfg.modules.length;
      const scores = tierScores[tierId] ?? {};
      completed += cfg.modules.filter((m) => scores[m.id.replace(`${cfg.prefix}-`, "")] !== undefined).length;
    }
    return {
      readinessPct: total > 0 ? Math.round((completed / total) * 100) : 0,
      completedCount: completed,
      totalCount: total,
    };
  }, [tierScores]);

  const certifiedTiers = useMemo(() => {
    return ALL_TIER_IDS.filter((tierId) => {
      const cfg = TIER_GAME_CONFIG[tierId];
      if (!cfg || cfg.modules.length === 0) return false;
      const scores = tierScores[tierId] ?? {};
      return cfg.modules.every((m) => scores[m.id.replace(`${cfg.prefix}-`, "")] !== undefined);
    }).map((tierId) => ({ tierId, name: TIER_NAMES[tierId] ?? "" }));
  }, [tierScores]);

  const leaderboard = useMemo(() => {
    const rows = MOCK_LEADERBOARD.map((r) => ({ ...r, isYou: false }));
    if (profile) rows.push({ name: profile.name, score: readinessPct, isYou: true });
    return rows.sort((a, b) => b.score - a.score);
  }, [profile, readinessPct]);

  const updateSetting = <K extends keyof CadetSettings>(key: K, value: CadetSettings[K]) => {
    const next = { ...settings, [key]: value };
    setSettings(next);
    saveCadetSettings(next);
  };

  if (!profile) return null;

  return (
    <div className={styles.page}>
      <Navbar mode="learning" />
      <div className={styles.layout}>
        <header className={styles.header}>
          <div className={styles.avatarLarge}>{profile.name.charAt(0).toUpperCase()}</div>
          <div className={styles.headerInfo}>
            <h1 className={styles.name}>{profile.name}</h1>
            <p className={styles.meta}>
              {profile.grade} · {profile.school}
            </p>
            <span className="badge badge-teal">Tier {profile.tierId} · {profile.tierName}</span>
          </div>
          <button className="btn btn-ghost" onClick={() => setEditing(true)}>
            Edit Details
          </button>
        </header>

        <nav className={styles.tabs}>
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`${styles.tabBtn} ${activeTab === tab ? styles.tabBtnActive : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </nav>

        {activeTab === "Overview" && (
          <section className={styles.section}>
            <div className={styles.readinessCard}>
              <div className={styles.readinessRing}>
                <svg viewBox="0 0 100 100" className={styles.ringSvg}>
                  <circle cx="50" cy="50" r="42" fill="none" stroke="var(--border-subtle)" strokeWidth="8" />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="var(--accent-teal)"
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 42}
                    strokeDashoffset={2 * Math.PI * 42 * (1 - readinessPct / 100)}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className={styles.ringCenter}>
                  <span className={styles.ringValue}>{readinessPct}%</span>
                  <span className={styles.ringLabel}>Ready</span>
                </div>
              </div>
              <div className={styles.readinessInfo}>
                <h2 className="heading-lg">Disaster Readiness</h2>
                <p className={styles.readinessSub}>
                  {completedCount} of {totalCount} modules completed across every tier.
                </p>
                <button className="btn btn-primary" onClick={() => router.push("/learn")}>
                  Continue Training →
                </button>
              </div>
            </div>
          </section>
        )}

        {activeTab === "My Certificates" && (
          <section className={styles.section}>
            {certifiedTiers.length === 0 ? (
              <p className={styles.emptyState}>Complete every module in a tier to earn your first certificate.</p>
            ) : (
              <div className={styles.certGrid}>
                {certifiedTiers.map((t) => (
                  <div key={t.tierId} className={styles.certCard}>
                    <span className={styles.certBadge}>🎖️</span>
                    <h3 className={styles.certTitle}>Certificate of Completion</h3>
                    <p className={styles.certName}>{profile.name}</p>
                    <p className={styles.certMeta}>{profile.school}</p>
                    <p className={styles.certTier}>{t.name} Tier — All Modules Verified</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === "Leaderboard" && (
          <section className={styles.section}>
            <div className={styles.leaderboardList}>
              {leaderboard.map((row, i) => (
                <div key={row.name} className={`${styles.leaderRow} ${row.isYou ? styles.leaderRowYou : ""}`}>
                  <span className={styles.leaderRank}>#{i + 1}</span>
                  <span className={styles.leaderName}>{row.isYou ? `${row.name} (You)` : row.name}</span>
                  <span className={styles.leaderScore}>{row.score}%</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === "Settings" && (
          <section className={styles.section}>
            <div className={styles.settingsList}>
              <label className={styles.settingRow}>
                <div>
                  <span className={styles.settingName}>Drill Sirens</span>
                  <span className={styles.settingDesc}>Play an audible siren when a campus emergency is injected.</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.drillSiren}
                  onChange={(e) => updateSetting("drillSiren", e.target.checked)}
                />
              </label>

              <label className={styles.settingRow}>
                <div>
                  <span className={styles.settingName}>Mitra Voice Language</span>
                  <span className={styles.settingDesc}>Language Mitra speaks in during simulations.</span>
                </div>
                <select
                  className={styles.select}
                  value={settings.mitraVoiceLang}
                  onChange={(e) => updateSetting("mitraVoiceLang", e.target.value)}
                >
                  {MITRA_VOICE_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className={styles.settingRow}>
                <div>
                  <span className={styles.settingName}>Reduced Motion</span>
                  <span className={styles.settingDesc}>Turn off animations and transitions across the app.</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.reducedMotion}
                  onChange={(e) => updateSetting("reducedMotion", e.target.checked)}
                />
              </label>

              <div className={styles.settingRow}>
                <div>
                  <span className={styles.settingName}>Emergency Contact</span>
                  <span className={styles.settingDesc}>Who to notify if you're marked unaccounted for during a drill.</span>
                </div>
                <div className={styles.contactFields}>
                  <input
                    placeholder="Contact name"
                    value={settings.emergencyContactName}
                    onChange={(e) => updateSetting("emergencyContactName", e.target.value)}
                  />
                  <input
                    placeholder="Phone number"
                    value={settings.emergencyContactPhone}
                    onChange={(e) => updateSetting("emergencyContactPhone", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {editing && (
        <div className={styles.drawerOverlay} onClick={() => setEditing(false)}>
          <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
            <h2 className="heading-lg">Edit Details</h2>
            <CadetProfileForm
              initial={profile}
              submitLabel="Save Changes"
              onSaved={(p) => {
                setProfile(p);
                setEditing(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
