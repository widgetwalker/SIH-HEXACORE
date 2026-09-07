"use client";

import { useEffect, useState } from "react";
import { loadCadetProfile, type CadetProfile } from "@/lib/cadetProfile";
import CadetProfileForm from "./CadetProfileForm";
import styles from "./OnboardingGate.module.css";

/**
 * Blocks every functional route (/learn, /simulate, /command, /profile)
 * behind a mandatory cadet-identity form until a profile is saved to
 * localStorage. The home page never renders this. Starts in a "loading"
 * state so the gate check happens after mount (avoids a hydration
 * mismatch between the server's stateless render and the client's
 * localStorage-backed one).
 */
export default function OnboardingGate({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<CadetProfile | null | "loading">("loading");

  useEffect(() => {
    setProfile(loadCadetProfile());
  }, []);

  if (profile === "loading") return null;

  if (profile === null) {
    return (
      <div className={styles.overlay}>
        <div className={styles.card}>
          <span className={styles.badge}>🛡️ SafeZone Cadet ID</span>
          <h1 className={styles.title}>Before you begin...</h1>
          <p className={styles.subtitle}>Tell us who you are so we can set up your NDMA training tier.</p>
          <CadetProfileForm submitLabel="Start Training →" onSaved={setProfile} />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
