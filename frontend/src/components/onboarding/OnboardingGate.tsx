"use client";

import { useEffect, useState } from "react";
import { loadCadetProfile, loadAllUsers, switchToUser, type CadetProfile } from "@/lib/cadetProfile";
import CadetProfileForm from "./CadetProfileForm";
import styles from "./OnboardingGate.module.css";

/**
 * Blocks every functional route (/learn, /simulate, /command, /profile)
 * behind a mandatory cadet-identity form until a profile is saved to
 * localStorage. The home page never renders this. Starts in a "loading"
 * state so the gate check happens after mount (avoids a hydration
 * mismatch between the server's stateless render and the client's
 * localStorage-backed one).
 *
 * When previously registered users exist, shows a "Returning user?"
 * selector so they can pick their profile instead of re-registering.
 */
export default function OnboardingGate({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<CadetProfile | null | "loading">("loading");
  const [showReturning, setShowReturning] = useState(false);
  const [existingUsers, setExistingUsers] = useState<CadetProfile[]>([]);

  useEffect(() => {
    const loaded = loadCadetProfile();
    setProfile(loaded);
    if (!loaded) {
      const all = loadAllUsers();
      setExistingUsers(all);
    }
  }, []);

  if (profile === "loading") return null;

  if (profile === null) {
    return (
      <div className={styles.overlay}>
        <div className={styles.card}>
          <span className={styles.badge}>🛡️ SafeZone Cadet ID</span>
          <h1 className={styles.title}>Before you begin...</h1>
          <p className={styles.subtitle}>Tell us who you are so we can set up your NDMA training tier.</p>

          {showReturning && existingUsers.length > 0 ? (
            <div className={styles.returningList}>
              <p className={styles.returningLabel}>Select your profile:</p>
              {existingUsers.map((user) => (
                <button
                  key={user.id}
                  className={styles.returningBtn}
                  onClick={() => {
                    const p = switchToUser(user.id);
                    if (p) setProfile(p);
                  }}
                >
                  <span className={styles.returningAvatar}>{user.name.charAt(0).toUpperCase()}</span>
                  <span className={styles.returningInfo}>
                    <span className={styles.returningName}>{user.name}</span>
                    <span className={styles.returningMeta}>Tier {user.tierId} · {user.tierName}</span>
                  </span>
                </button>
              ))}
              <button
                className={styles.returningNewBtn}
                onClick={() => setShowReturning(false)}
              >
                ← Register as new user instead
              </button>
            </div>
          ) : (
            <>
              <CadetProfileForm submitLabel="Start Training →" onSaved={setProfile} />
              {existingUsers.length > 0 && (
                <button
                  className={styles.returningToggle}
                  onClick={() => setShowReturning(true)}
                >
                  Returning user? Select your profile →
                </button>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
