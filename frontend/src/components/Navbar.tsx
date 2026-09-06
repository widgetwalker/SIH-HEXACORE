"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./Navbar.module.css";

interface NavbarProps {
  mode?: "learning" | "simulation" | "emergency" | "command";
}

export default function Navbar({ mode = "learning" }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll and handle Escape key when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setMobileOpen(false);
      };
      window.addEventListener("keydown", onKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", onKeyDown);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [mobileOpen]);

  return (
    <nav
      className={`${styles.navbar} ${scrolled ? styles.scrolled : ""} ${
        mode === "emergency" ? styles.emergency : ""
      }`}
      aria-label="Main navigation"
      suppressHydrationWarning
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
          {mode === "emergency" && (
            <span className={`badge badge-red badge-pulse ${styles.emergencyBadge}`}>
              LIVE
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
            className={`${styles.alertIndicator} ${mode === "emergency" ? styles.alertActive : ""}`}
            style={{ textDecoration: "none" }}
            suppressHydrationWarning
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" suppressHydrationWarning>
              <path d="M8 1.5L1.5 13h13L8 1.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" suppressHydrationWarning />
              <path d="M8 6v3.5M8 11.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" suppressHydrationWarning />
            </svg>
            <span suppressHydrationWarning>{mode === "emergency" ? "SACHET ALERT" : "No Alerts"}</span>
          </Link>

          <Link
            href="/learn"
            prefetch={true}
            className={styles.avatar}
            aria-label="User Profile"
            title="User Profile"
            style={{ textDecoration: "none" }}
          >
            D
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

      {/* Full-screen Mobile Menu Overlay */}
      {mobileOpen && (
        <div className={styles.mobileMenu} role="dialog" aria-modal="true" aria-label="Mobile Navigation">
          <div className={styles.mobileMenuHeader}>
            <div className={styles.logo}>
              <span className={styles.logoText}>
                Safe<span className={styles.logoAccent}>Zone</span>
              </span>
              {mode === "emergency" && (
                <span className={`badge badge-red badge-pulse ${styles.emergencyBadge}`}>
                  LIVE
                </span>
              )}
            </div>
            <button
              className={styles.mobileCloseBtn}
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className={styles.mobileNavLinks}>
            <Link
              href="/learn"
              prefetch={true}
              className={`${styles.mobileLink} ${mode === "learning" ? styles.mobileLinkActive : ""}`}
              onClick={() => setMobileOpen(false)}
            >
              <span>🎓 Learn & Modules</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
            <Link
              href="/simulate"
              prefetch={true}
              className={`${styles.mobileLink} ${mode === "simulation" ? styles.mobileLinkActive : ""}`}
              onClick={() => setMobileOpen(false)}
            >
              <span>🎮 3D Simulation</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
            <Link
              href="/command"
              prefetch={true}
              className={`${styles.mobileLink} ${mode === "command" ? styles.mobileLinkActive : ""}`}
              onClick={() => setMobileOpen(false)}
            >
              <span>📡 Command Hub</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          </div>

          <div className={styles.mobileMenuFooter}>
            <Link
              href="/command"
              prefetch={true}
              className={styles.mobileAlertBanner}
              onClick={() => setMobileOpen(false)}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1.5L1.5 13h13L8 1.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M8 6v3.5M8 11.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span>{mode === "emergency" ? "SACHET EMERGENCY ALERT ACTIVE" : "NDMA System Normal — No Active Alerts"}</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
