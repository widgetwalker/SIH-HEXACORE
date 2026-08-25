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

  return (
    <nav
      className={`${styles.navbar} ${scrolled ? styles.scrolled : ""} ${
        mode === "emergency" ? styles.emergency : ""
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
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1.5L1.5 13h13L8 1.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M8 6v3.5M8 11.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span>{mode === "emergency" ? "SACHET ALERT" : "No Alerts"}</span>
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
