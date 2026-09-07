"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { loadCadetProfile, CADET_PROFILE_EVENT, type CadetProfile } from "@/lib/cadetProfile";
import ProfileAvatar from "@/components/profile/ProfileAvatar";
import { fetchLiveAlerts, CAMPUS_EMERGENCY_EVENT, type LiveAlert } from "@/lib/liveAlerts";
import { useEmergencyBroadcasts } from "@/lib/useEmergencyBroadcasts";
import styles from "./Navbar.module.css";

interface NavbarProps {
  mode?: "learning" | "simulation" | "emergency" | "command";
}

export default function Navbar({ mode = "learning" }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profile, setProfile] = useState<CadetProfile | null>(null);
  const { broadcasts } = useEmergencyBroadcasts();
  const [criticalLiveAlert, setCriticalLiveAlert] = useState<LiveAlert | null>(null);
  const [manualEventAlert, setManualEventAlert] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setProfile(loadCadetProfile());
    const onProfileUpdate = () => setProfile(loadCadetProfile());
    window.addEventListener(CADET_PROFILE_EVENT, onProfileUpdate);
    return () => window.removeEventListener(CADET_PROFILE_EVENT, onProfileUpdate);
  }, []);

  // Poll for active critical hazards from backend
  useEffect(() => {
    let cancelled = false;
    const checkAlerts = async () => {
      const alerts = await fetchLiveAlerts();
      if (!cancelled) {
        const crit = alerts.find((a) => {
          const s = a.severity.toLowerCase();
          return s.includes("extreme") || s.includes("critical") || s.includes("warn");
        });
        setCriticalLiveAlert(crit ?? null);
      }
    };
    checkAlerts();
    const interval = setInterval(checkAlerts, 15_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  // Listen for instant manual incident injection events across the client
  useEffect(() => {
    const onEmergency = (e: Event) => {
      const custom = e as CustomEvent<{ label?: string; severity?: string }>;
      if (custom.detail?.label) {
        setManualEventAlert(custom.detail.label);
      }
    };
    window.addEventListener(CAMPUS_EMERGENCY_EVENT, onEmergency);
    return () => window.removeEventListener(CAMPUS_EMERGENCY_EVENT, onEmergency);
  }, []);

  const hasActiveAlert =
    mode === "emergency" ||
    broadcasts.length > 0 ||
    criticalLiveAlert !== null ||
    manualEventAlert !== null;

  const alertBadgeText = (() => {
    if (manualEventAlert) return `🚨 DRILL: ${manualEventAlert}`;
    if (broadcasts.length > 0) return `🚨 DRILL: ${broadcasts[0].msg.split("—")[0].trim()}`;
    if (criticalLiveAlert) return `🚨 ${criticalLiveAlert.severity.toUpperCase()} ALERT`;
    if (mode === "emergency") return "🚨 EMERGENCY ACTIVE";
    return "No Alerts";
  })();

  return (
    <nav
      className={`${styles.navbar} ${scrolled ? styles.scrolled : ""} ${
        hasActiveAlert ? styles.emergency : ""
      }`}
      aria-label="Main navigation"
    >
      <div className={styles.inner}>
        {/* Logo */}
        <Link href="/" prefetch={true} className={styles.logo} aria-label="SafeZone Home">
          <span className={styles.logoIcon} aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path
                d="M14 2L3 7.5V14C3 19.8 7.8 25.2 14 26.5C20.2 25.2 25 19.8 25 14V7.5L14 2Z"
                fill="url(#shield-grad)"
                stroke="url(#shield-stroke)"
                strokeWidth="0.5"
              />
              <path
                d="M10 14l3 3 5-6"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <defs>
                <linearGradient id="shield-grad" x1="3" y1="2" x2="25" y2="26.5" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#00D4AA" />
                  <stop offset="1" stopColor="#3B82F6" />
                </linearGradient>
                <linearGradient id="shield-stroke" x1="3" y1="2" x2="25" y2="26.5" gradientUnits="userSpaceOnUse">
                  <stop stopColor="rgba(0,212,170,0.5)" />
                  <stop offset="1" stopColor="rgba(59,130,246,0.5)" />
                </linearGradient>
              </defs>
            </svg>
          </span>
          <span className={styles.logoText}>
            Safe<span className={styles.logoAccent}>Zone</span>
          </span>
          {hasActiveAlert && (
            <span className={`badge badge-red badge-pulse ${styles.emergencyBadge}`}>
              LIVE ALERT
            </span>
          )}
        </Link>

        {/* Mode switcher pill */}
        <div className={styles.modeSwitcher}>
          <Link
            href="/learn"
            prefetch={true}
            className={`${styles.modeTab} ${mode === "learning" ? styles.modeTabActive : ""}`}
            id="nav-learn"
          >
            <span className={styles.modeTabDot} />
            Learn
          </Link>
          <Link
            href="/simulate"
            prefetch={true}
            className={`${styles.modeTab} ${mode === "simulation" ? styles.modeTabActive : ""}`}
            id="nav-simulate"
          >
            <span className={styles.modeTabDot} />
            Simulate
          </Link>
          <Link
            href="/command"
            prefetch={true}
            className={`${styles.modeTab} ${mode === "command" ? styles.modeTabActive : ""}`}
            id="nav-command"
          >
            <span className={styles.modeTabDot} />
            Command
          </Link>
        </div>

        {/* Right actions */}
        <div className={styles.actions}>
          <Link
            href="/command"
            prefetch={true}
            className={`${styles.alertIndicator} ${hasActiveAlert ? styles.alertActive : ""}`}
            style={{ textDecoration: "none" }}
            title={hasActiveAlert ? alertBadgeText : "No Active Hazards in Sector"}
          >
            {hasActiveAlert ? (
              <>
                <span className={styles.alertPulseDot} />
                <span className={styles.alertActiveText}>{alertBadgeText}</span>
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" suppressHydrationWarning>
                  <path d="M8 1.5L1.5 13h13L8 1.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" suppressHydrationWarning />
                  <path d="M8 6v3.5M8 11.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" suppressHydrationWarning />
                </svg>
                <span>No Alerts</span>
              </>
            )}
          </Link>

          <Link
            href="/profile"
            prefetch={true}
            className={styles.avatar}
            aria-label={profile ? `${profile.name}'s Profile` : "User Profile"}
            title={profile ? profile.name : "User Profile"}
          >
            {profile ? (
              <ProfileAvatar profile={profile} size="small" className={styles.navAvatar} />
            ) : (
              "?"
            )}
          </Link>

          <button
            className={styles.menuBtn}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className={styles.mobileMenu}>
          <Link href="/learn" prefetch={true} className={styles.mobileLink} onClick={() => setMobileOpen(false)}>Learn</Link>
          <Link href="/simulate" prefetch={true} className={styles.mobileLink} onClick={() => setMobileOpen(false)}>Simulate</Link>
          <Link href="/command" prefetch={true} className={styles.mobileLink} onClick={() => setMobileOpen(false)}>Command Hub</Link>
        </div>
      )}
    </nav>
  );
}
