"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import CadetOnboardingModal, { type CadetFormData } from "@/components/onboarding/CadetOnboardingModal";
import EditProfileDrawer from "./EditProfileDrawer";
import AvatarPicker from "./AvatarPicker";
import ProfileAvatar from "./ProfileAvatar";
import ProfileView from "@/components/learn/ProfileView";
import SettingsView from "@/components/learn/SettingsView";
import LeaderboardView from "@/components/learn/LeaderboardView";
import {
  CADET_PROFILE_UPDATED_EVENT,
  DEFAULT_AVATAR_ID,
  loadCadetProfile,
  saveCadetProfile,
  type CadetProfile,
} from "@/types/profile";
import styles from "./ProfilePage.module.css";

type ProfileTab = "Dashboard" | "Certificates" | "Settings" | "Leaderboard";

const TABS: Array<{ id: ProfileTab; label: string; description: string }> = [
  { id: "Dashboard", label: "Dashboard", description: "Identity and readiness" },
  { id: "Certificates", label: "Certificates", description: "Credentials earned" },
  { id: "Settings", label: "Settings", description: "Preferences and contacts" },
  { id: "Leaderboard", label: "Leaderboard", description: "Campus rankings" },
];

function getTab(value: string | null): ProfileTab {
  const match = TABS.find((tab) => tab.id.toLowerCase() === value?.toLowerCase());
  return match?.id || "Dashboard";
}

export default function ProfilePage() {
  const searchParams = useSearchParams();
  const [profile, setProfile] = useState<CadetProfile | null>(null);
  const [selectedTab, setSelectedTab] = useState<ProfileTab | null>(null);
  const [showEditDrawer, setShowEditDrawer] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    const savedProfile = loadCadetProfile();
    setProfile(savedProfile);
    setShowOnboarding(!savedProfile);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    const onProfileUpdated = (event: Event) => {
      const nextProfile = (event as CustomEvent<CadetProfile>).detail || loadCadetProfile();
      setProfile(nextProfile);
      setShowOnboarding(!nextProfile);
    };
    window.addEventListener(CADET_PROFILE_UPDATED_EVENT, onProfileUpdated);
    return () => window.removeEventListener(CADET_PROFILE_UPDATED_EVENT, onProfileUpdated);
  }, []);

  useEffect(() => {
    /* Query links in the global Navbar should reset any in-page tab selection. */
    /* eslint-disable react-hooks/set-state-in-effect */
    setSelectedTab(null);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [searchParams]);

  const readinessScore = useMemo(() => (profile ? Math.min(50 + profile.tierId * 8, 95) : 0), [profile]);
  const activeTab = selectedTab || getTab(searchParams.get("tab"));

  const commitProfile = (nextProfile: CadetProfile, notice: string) => {
    setProfile(nextProfile);
    saveCadetProfile(nextProfile);
    setSavedNotice(notice);
    window.setTimeout(() => setSavedNotice(null), 2200);
  };

  const handleOnboarding = (data: CadetFormData) => {
    commitProfile({ ...data, avatarId: DEFAULT_AVATAR_ID }, "Cadet identity created");
    setShowOnboarding(false);
  };

  const handleProfileEdit = (data: Omit<CadetProfile, "avatarId" | "avatarImage">) => {
    if (!profile) return;
    commitProfile({ ...data, avatarId: profile.avatarId || DEFAULT_AVATAR_ID, avatarImage: profile.avatarImage }, "Profile details saved");
    setShowEditDrawer(false);
  };

  const handleAvatarChange = (avatar: Pick<CadetProfile, "avatarId" | "avatarImage">) => {
    if (!profile) return;
    commitProfile({ ...profile, ...avatar }, "Profile mark updated");
  };

  return (
    <div className={styles.page}>
      <Navbar mode="learning" />
      <main className={styles.shell}>
        <header className={styles.header}>
          <div>
            <p className={styles.kicker}>SafeZone identity console</p>
            <h1>Cadet profile</h1>
            <p className={styles.lede}>Your progress, emergency preferences, credentials, and campus standing in one place.</p>
          </div>
          {savedNotice && <span className={styles.notice}>{savedNotice}</span>}
        </header>

        <section className={styles.profileStrip}>
          <div className={styles.identity}>
            <ProfileAvatar profile={profile} size="large" />
            <div>
              <p className={styles.identityLabel}>Active cadet</p>
              <h2>{profile ? profile.name : "Complete your identity"}</h2>
              <p className={styles.identityMeta}>
                {profile ? `${profile.tierName} · ${profile.school}` : "Enroll to unlock your profile dashboard"}
              </p>
            </div>
          </div>
          <div className={styles.identityActions}>
            {profile && <span className={styles.status}><span className={styles.statusDot} /> Profile synced</span>}
            {profile && <button className="btn-secondary" onClick={() => setShowEditDrawer(true)}>Edit profile</button>}
          </div>
        </section>

        <nav className={styles.tabs} aria-label="Profile sections">
          {TABS.map((tab, index) => (
            <button
              key={tab.id}
              type="button"
              className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ""}`}
              onClick={() => setSelectedTab(tab.id)}
              aria-current={activeTab === tab.id ? "page" : undefined}
            >
              <span className={styles.tabIndex}>0{index + 1}</span>
              <span>
                <strong>{tab.label}</strong>
                <small>{tab.description}</small>
              </span>
            </button>
          ))}
        </nav>

        <div className={styles.content}>
          {activeTab === "Dashboard" && (
            <div className={styles.dashboard}>
              <section className={styles.dashboardHero}>
                <div>
                  <p className={styles.kicker}>Readiness overview</p>
                  <h2>{profile ? `Good to see you, ${profile.name.split(" ")[0]}.` : "Build your cadet profile."}</h2>
                  <p>{profile ? "Keep your identity current so every learning surface reflects the right cadet." : "Start with your name, age, grade, and institution to personalize SafeZone."}</p>
                </div>
                <div className={styles.readinessValue}>
                  <strong>{readinessScore}%</strong>
                  <span>readiness</span>
                </div>
              </section>

              {profile ? (
                <>
                  <div className={styles.metricGrid}>
                    <div><span>Tier</span><strong>{profile.tierId} · {profile.tierName}</strong></div>
                    <div><span>Age band</span><strong>{profile.age} years</strong></div>
                    <div><span>Learning status</span><strong>Active cadet</strong></div>
                    <div><span>Institution</span><strong>{profile.school}</strong></div>
                  </div>
                  <AvatarPicker profile={profile} onChange={handleAvatarChange} />
                </>
              ) : (
                <button className="btn-primary" onClick={() => setShowOnboarding(true)}>Create cadet identity</button>
              )}
            </div>
          )}
          {activeTab === "Certificates" && <ProfileView profile={profile} onOpenEdit={() => setShowEditDrawer(true)} />}
          {activeTab === "Settings" && (
            <div className={styles.settingsLayout}>
              {profile && <AvatarPicker profile={profile} onChange={handleAvatarChange} />}
              <SettingsView />
            </div>
          )}
          {activeTab === "Leaderboard" && <LeaderboardView />}
        </div>
      </main>

      <CadetOnboardingModal isOpen={showOnboarding} onSubmit={handleOnboarding} onClose={() => profile && setShowOnboarding(false)} />
      <EditProfileDrawer
        isOpen={showEditDrawer}
        initialData={profile || undefined}
        onSave={handleProfileEdit}
        onClose={() => setShowEditDrawer(false)}
      />
    </div>
  );
}
