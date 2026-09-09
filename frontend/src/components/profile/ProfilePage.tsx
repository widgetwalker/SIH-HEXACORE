"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import ProfileAvatar from "@/components/profile/ProfileAvatar";
import AvatarPicker from "@/components/profile/AvatarPicker";
import EditProfileDrawer from "@/components/profile/EditProfileDrawer";
import {
  loadCadetProfile,
  loadAllUsers,
  loadUserTierScores,
  loadActiveTierScores,
  logoutUser,
  saveCadetProfile,
  updateAvatar,
  type CadetProfile,
} from "@/lib/cadetProfile";
import { ALL_TIER_IDS, TIER_GAME_CONFIG, TIER_NAMES } from "@/components/learn/tiergame/moduleRegistry";
import { DEFAULT_SETTINGS, MITRA_VOICE_LANGUAGES, loadCadetSettings, saveCadetSettings, type CadetSettings } from "@/lib/cadetSettings";
import CertificateModal from "@/components/learn/CertificateModal";
import styles from "./ProfilePage.module.css";

const TABS = ["Overview", "My Certificates", "Leaderboard", "Settings"] as const;
type Tab = (typeof TABS)[number];

/** Compute readiness % for a given user's tier scores */
function computeReadiness(tierScores: Record<number, Record<string, number>>): { pct: number; completed: number; total: number } {
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
    pct: total > 0 ? Math.round((completed / total) * 100) : 0,
    completed,
    total,
  };
}

export default function ProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [profile, setProfile] = useState<CadetProfile | null>(null);
  const [tierScores, setTierScores] = useState<Record<number, Record<string, number>>>({});
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [editing, setEditing] = useState(false);
  const [settings, setSettings] = useState<CadetSettings>(DEFAULT_SETTINGS);
  const [selectedCert, setSelectedCert] = useState<{ id: string; name: string; type: string } | null>(null);

  useEffect(() => {
    setProfile(loadCadetProfile());
    setTierScores(loadActiveTierScores());
    setSettings(loadCadetSettings());
    const tabParam = searchParams.get("tab");
    const match = TABS.find((t) => t.toLowerCase().replace(/\s+/g, "-") === tabParam);
    if (match) setActiveTab(match);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { pct: readinessPct, completed: completedCount, total: totalCount } = useMemo(() => {
    return computeReadiness(tierScores);
  }, [tierScores]);

  const certifiedModules = useMemo(() => {
    const modules: { id: string; name: string; type: string }[] = [];
    for (const tierId of ALL_TIER_IDS) {
      const cfg = TIER_GAME_CONFIG[tierId];
      if (!cfg) continue;
      const scores = tierScores[tierId] ?? {};
      for (const m of cfg.modules) {
        if (scores[m.id.replace(`${cfg.prefix}-`, "")] !== undefined) {
          modules.push({ id: m.id, name: m.name, type: m.type === "simulation" ? "Simulation" : m.type === "interactive" ? "Interactive" : "Video + Quiz" });
        }
      }
    }
    return modules;
  }, [tierScores]);

  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    // Fallback: build from local storage until backend answers
    const localUsers = loadAllUsers();
    const localRows = localUsers.map((user) => {
      const userScores = loadUserTierScores(user.id);
      const { pct } = computeReadiness(userScores);
      return {
        id: user.id,
        name: user.name,
        avatarId: user.avatarId,
        avatarImage: user.avatarImage,
        score: pct,
        isYou: profile ? user.id === profile.id : false,
      };
    });
    setLeaderboard(localRows.sort((a, b) => b.score - a.score));

    // Fetch from backend
    import("@/lib/cadetProfile").then(({ fetchLeaderboard }) => {
      fetchLeaderboard().then((dbLeaderboard) => {
        if (dbLeaderboard && dbLeaderboard.length > 0) {
          const remoteRows = dbLeaderboard.map((u) => ({
            id: u.id,
            name: u.full_name,
            avatarId: u.avatar_id ?? undefined,
            avatarImage: u.avatar_image ?? undefined,
            score: Math.round(u.score_percentage ?? 0),
            isYou: profile ? u.id === profile.id : false,
          }));
          setLeaderboard(remoteRows.sort((a, b) => b.score - a.score));
        }
      });
    });
  }, [profile]);

  const updateSetting = <K extends keyof CadetSettings>(key: K, value: CadetSettings[K]) => {
    const next = { ...settings, [key]: value };
    setSettings(next);
    saveCadetSettings(next);
  };

  const handleLogout = () => {
    logoutUser();
    router.push("/");
  };

  const handleEditSave = async (data: { name: string; age: number; grade: string; school: string; tierId: number; tierName: string }) => {
    const saved = await saveCadetProfile({
      name: data.name,
      age: data.age,
      grade: data.grade,
      school: data.school,
      avatarId: profile?.avatarId,
      avatarImage: profile?.avatarImage,
    });
    setProfile(saved);
    setEditing(false);
  };

  const handleAvatarChange = async (next: { avatarId: string; avatarImage?: string }) => {
    const updated = await updateAvatar(next.avatarId, next.avatarImage);
    if (updated) setProfile(updated);
  };

  if (!profile) return null;

  return (
    <div className={styles.page}>
      <Navbar mode="learning" />
      <div className={styles.layout}>
        <header className={styles.header}>
          <ProfileAvatar profile={profile} size="large" />
          <div className={styles.headerInfo}>
            <h1 className={styles.name}>{profile.name}</h1>
            <p className={styles.meta}>
              {profile.grade} · {profile.school}
            </p>
            <span className="badge badge-teal">Tier {profile.tierId} · {profile.tierName}</span>
          </div>
          <div className={styles.headerActions}>
            <button className="btn btn-ghost" onClick={() => setEditing(true)}>
              Edit Details
            </button>
            <button className={styles.logoutBtn} onClick={handleLogout}>
              Switch User
            </button>
          </div>
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
            {certifiedModules.length === 0 ? (
              <p className={styles.emptyState}>Complete a module to earn your first certificate.</p>
            ) : (
              <div className={styles.certGrid}>
                {certifiedModules.map((m) => (
                  <div key={m.id} className={styles.certCard} style={{ cursor: "pointer" }} onClick={() => setSelectedCert(m)}>
                    <span className={styles.certBadge}>🎖️</span>
                    <h3 className={styles.certTitle}>Certificate of Completion</h3>
                    <p className={styles.certName}>{profile.name}</p>
                    <p className={styles.certMeta}>{profile.school}</p>
                    <p className={styles.certTier}>{m.name} ({m.type})</p>
                  </div>
                ))}
              </div>
            )}
            
            {selectedCert && profile && (
              <CertificateModal
                profile={profile}
                moduleName={selectedCert.name}
                moduleType={selectedCert.type}
                onClose={() => setSelectedCert(null)}
              />
            )}
          </section>
        )}

        {activeTab === "Leaderboard" && (
          <section className={styles.section}>
            {leaderboard.length === 0 ? (
              <p className={styles.leaderEmpty}>No users registered yet. Be the first!</p>
            ) : (
              <div className={styles.leaderboardList}>
                {leaderboard.map((row, i) => (
                  <div key={row.id} className={`${styles.leaderRow} ${row.isYou ? styles.leaderRowYou : ""}`}>
                    <span className={styles.leaderRank}>#{i + 1}</span>
                    <ProfileAvatar
                      profile={{ avatarId: row.avatarId, avatarImage: row.avatarImage }}
                      size="small"
                      className={styles.leaderAvatar}
                    />
                    <span className={styles.leaderName}>{row.isYou ? `${row.name} (You)` : row.name}</span>
                    <span className={styles.leaderScore}>{row.score}%</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === "Settings" && (
          <section className={styles.section}>
            <div className={styles.settingsList}>
              <AvatarPicker
                profile={{ avatarId: profile.avatarId, avatarImage: profile.avatarImage }}
                onChange={handleAvatarChange}
              />
              <hr style={{ margin: "2rem 0", border: "none", borderTop: "1px solid var(--border-subtle)" }} />
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
                  <span className={styles.settingDesc}>Who to notify if you&#39;re marked unaccounted for during a drill.</span>
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

      {/* Edit Drawer */}
      <EditProfileDrawer
        isOpen={editing}
        initialData={profile ? { name: profile.name, age: profile.age, grade: profile.grade, school: profile.school } : undefined}
        onSave={handleEditSave}
        onClose={() => setEditing(false)}
      />

      {/* Avatar Picker — shows inside drawer */}
      {editing && profile && (
        <div className={styles.drawerOverlay} onClick={() => setEditing(false)} style={{ zIndex: 997 }}>
          <div className={styles.drawer} onClick={(e) => e.stopPropagation()} style={{ zIndex: 999 }}>
            <AvatarPicker
              profile={{ avatarId: profile.avatarId, avatarImage: profile.avatarImage }}
              onChange={handleAvatarChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}
