"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import styles from "./LandingPage.module.css";

const ConstellationField = dynamic(
  () => import("@designcodeio/threeui/components/ConstellationField").then((mod) => mod.ConstellationField),
  { ssr: false }
);

const DISASTER_TYPES = ["Earthquake.", "Fire.", "Flood.", "Heatwave.", "Chemical Spill.", "Cyclone."];

const STATS = [
  { value: "315M", label: "Students Protected", accent: "teal", delay: 0 },
  { value: "6", label: "Disaster Scenarios", accent: "blue", delay: 100 },
  { value: "<6s", label: "Target Response Time", accent: "amber", delay: 200 },
  { value: "5", label: "Age-Tier Curricula", accent: "violet", delay: 300 },
];

const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2l9 4.5V12c0 5.25-3.75 10.15-9 11.5C6.75 22.15 3 17.25 3 12V6.5L12 2z" strokeLinejoin="round"/>
        <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    tag: "Pedagogy",
    title: "Age-Tiered Learning Engine",
    desc: "5 curriculum tiers from age 5 to 18+, mapped to NDMA, NFPA 10/101, and CDC safety standards. Lessons, quizzes, and micro-certifications that stick.",
    accent: "teal",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="7" height="7" rx="1.5"/>
        <rect x="14" y="3" width="7" height="7" rx="1.5"/>
        <rect x="3" y="14" width="7" height="7" rx="1.5"/>
        <path d="M17.5 14v7M14 17.5h7" strokeLinecap="round"/>
      </svg>
    ),
    tag: "Simulation",
    title: "Immersive 3D Crisis Simulator",
    desc: "Procedural multi-floor 3D building rendered in WebGPU. Dynamic fire, smoke, and earthquake hazards. Your decisions have real consequences.",
    accent: "blue",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    tag: "Command",
    title: "Multi-Agency EOC Dashboard",
    desc: "Real-time NDMA SACHET alert ingestion, campus geofencing, live student headcount, and AI evacuation route recalculation. All agencies. One screen.",
    accent: "amber",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="9"/>
        <path d="M9 10c0-1.66 1.34-3 3-3s3 1.34 3 3-1.34 3-3 3v2" strokeLinecap="round"/>
        <circle cx="12" cy="18" r=".5" fill="currentColor"/>
      </svg>
    ),
    tag: "AI",
    title: '"Mitra" Crisis AI Companion',
    desc: "Multilingual voice + text AI guide. Walks you through the right action in real-time, analyzes panic levels, and auto-dispatches your location to NDRF teams.",
    accent: "violet",
  },
];

export default function LandingPage() {
  const [disasterIndex, setDisasterIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setDisasterIndex((i) => (i + 1) % DISASTER_TYPES.length);
        setVisible(true);
      }, 400);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.page}>
      <Navbar mode="learning" />

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className={styles.hero} aria-label="Hero section">
        {/* ThreeUI Background */}
        <div className={styles.heroBg}>
          <ConstellationField
            variant="constellation-field"
            style={{ width: "100%", height: "100%" }}
          />
        </div>

        {/* Gradient fades */}
        <div className={styles.heroFadeBottom} />
        <div className={styles.heroFadeRadial} />

        <div className={`${styles.heroContent} content-layer`}>
          {/* Top badge */}
          <div className={`badge badge-teal badge-pulse animate-fade-in-up ${styles.heroBadge}`}>
            Smart India Hackathon 2026
          </div>

          {/* Main headline */}
          <h1 className={`display-2xl ${styles.heroHeadline} animate-fade-in-up delay-100`}>
            Train today.
            <br />
            <span className="text-gradient-teal">Survive</span>{" "}
            <span className="text-gradient-white">tomorrow.</span>
          </h1>

          {/* Dynamic disaster type */}
          <div className={`${styles.heroTypewriter} animate-fade-in-up delay-200`}>
            <span className={styles.typewriterPrefix}>Ready for</span>
            <span
              className={`${styles.typewriterWord} ${visible ? styles.typewriterIn : styles.typewriterOut}`}
            >
              {DISASTER_TYPES[disasterIndex]}
            </span>
          </div>

          {/* Sub-copy */}
          <p className={`body-lg ${styles.heroSub} animate-fade-in-up delay-300`}>
            A unified AI-powered platform combining gamified education, immersive 3D
            simulation, and real-time multi-agency emergency command — built for
            India&apos;s 315 million students.
          </p>

          {/* CTA row */}
          <div className={`${styles.heroCtas} animate-fade-in-up delay-400`}>
            <Link href="/simulate" className="btn btn-primary" id="hero-start-drill">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <polygon points="5,2 15,9 5,16" fill="currentColor"/>
              </svg>
              Start Drill
            </Link>
            <Link href="/learn" className="btn btn-ghost" id="hero-learn">
              Explore Platform
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>

          {/* Compliance chips */}
          <div className={`${styles.heroCompliance} animate-fade-in-up delay-500`}>
            {["NDMA Certified", "NFPA 10 / 101", "CAP v1.2", "OSHA", "CDC"].map((chip) => (
              <span key={chip} className={styles.complianceChip}>{chip}</span>
            ))}
          </div>
        </div>

        {/* Floating stat cards */}
        <div className={`${styles.heroStats} content-layer`}>
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className={`${styles.heroStatCard} animate-fade-in-up`}
              style={{ animationDelay: `${500 + stat.delay}ms` }}
            >
              <span className={`${styles.statValue} ${styles[`accent-${stat.accent}`]}`}>
                {stat.value}
              </span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── MARQUEE STRIP ──────────────────────────────────────────── */}
      <div className={styles.marqueeWrap} aria-hidden="true">
        <div className={styles.marqueeTrack}>
          {[...Array(3)].flatMap(() =>
            ["EARTHQUAKE", "FIRE EVACUATION", "FLOOD PROTOCOL", "CHEMICAL SPILL", "CYCLONE RESPONSE", "HEATWAVE", "NDMA GUIDELINES", "NFPA 101", "REAL-TIME DRILLS"]
          ).map((item, i) => (
            <span key={i} className={styles.marqueeItem}>
              <span className={styles.marqueeDot} />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── FEATURES SECTION ───────────────────────────────────────── */}
      <section className={styles.features} aria-label="Platform features">
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className="label" style={{ color: "var(--accent-teal)" }}>The Platform</span>
            <h2 className={`display-lg ${styles.sectionTitle}`}>
              One platform.<br />
              <span className="text-gradient-teal">Three pillars.</span>
            </h2>
            <p className={`body-lg ${styles.sectionSub}`}>
              No silo. No compromise. Every layer talks to the next — from your first lesson
              to the moment a real SACHET alert fires.
            </p>
          </div>

          <div className={styles.featuresGrid}>
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className={`${styles.featureCard} glass-card`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={`${styles.featureIcon} ${styles[`icon-${f.accent}`]}`}>
                  {f.icon}
                </div>
                <span className={`badge badge-${f.accent} ${styles.featureTag}`}>{f.tag}</span>
                <h3 className={`heading-md ${styles.featureTitle}`}>{f.title}</h3>
                <p className={`body-sm ${styles.featureDesc}`}>{f.desc}</p>
                <div className={styles.featureArrow}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────────── */}
      <section className={styles.howItWorks} aria-label="How the platform works">
        <div className="container-narrow">
          <div className={styles.sectionHeader}>
            <span className="label" style={{ color: "var(--accent-amber)" }}>Flow</span>
            <h2 className={`display-lg ${styles.sectionTitle}`}>
              From <span className="text-gradient-fire">classroom</span> to crisis.
            </h2>
          </div>

          <ol className={styles.steps}>
            {[
              { n: "01", title: "Learn the Rules", desc: "Age-appropriate interactive lessons with NDMA-certified safety protocols.", color: "teal" },
              { n: "02", title: "Run the Simulation", desc: "Enter the 3D building. Fire breaks out on Floor 3. You have 90 seconds.", color: "blue" },
              { n: "03", title: "AI Grades Your Response", desc: "Mitra analyzes your decisions, posture, and exit time. Instant feedback.", color: "amber" },
              { n: "04", title: "Real Alert? Real Response.", desc: "SACHET alert fires. The app switches to Emergency Mode. Your training kicks in.", color: "red" },
            ].map((step) => (
              <li key={step.n} className={styles.step}>
                <div className={`${styles.stepNum} ${styles[`stepNum-${step.color}`]}`}>{step.n}</div>
                <div className={styles.stepContent}>
                  <h3 className="heading-md">{step.title}</h3>
                  <p className={`body-sm ${styles.stepDesc}`}>{step.desc}</p>
                </div>
                <div className={`${styles.stepLine} ${styles[`stepLine-${step.color}`]}`} />
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── FINAL CTA BANNER ───────────────────────────────────────── */}
      <section className={styles.ctaBanner} aria-label="Call to action">
        <div className={styles.ctaBannerBg}>
          <ConstellationField
            variant="defense-lines"
            style={{ width: "100%", height: "100%" }}
          />
        </div>
        <div className={`${styles.ctaBannerContent} content-layer container`}>
          <h2 className={`display-lg ${styles.ctaTitle}`}>
            India&apos;s next-generation
            <br />
            <span className="text-gradient-teal">safety infrastructure</span>
            <br />
            starts here.
          </h2>
          <p className={`body-lg ${styles.ctaSub}`}>
            Built for SIH 2026. Designed for real schools. Engineered for real disasters.
          </p>
          <div className={styles.ctaButtons}>
            <Link href="/simulate" className="btn btn-primary" id="cta-start-drill">
              Launch Simulation
            </Link>
            <Link href="/command" className="btn btn-ghost" id="cta-command">
              View Command Hub
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────── */}
      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerInner}>
            <div className={styles.footerBrand}>
              <span className={styles.footerLogo}>
                Safe<span style={{ color: "var(--accent-teal)" }}>Zone</span>
              </span>
              <span className="body-sm" style={{ color: "var(--text-faint)" }}>
                Smart India Hackathon 2026 — Disaster Management &amp; EdTech
              </span>
            </div>
            <div className={styles.footerLinks}>
              {["NDMA", "NFPA", "SACHET", "NDRF"].map((l) => (
                <span key={l} className={styles.footerLink}>{l}</span>
              ))}
            </div>
          </div>
          <div className={styles.footerDivider} />
          <p className={`caption ${styles.footerCopy}`}>
            © 2026 SafeZone Team — Dheeraj · Venkataraman · Manha · Sravya · Trinayani · Rahul
          </p>
        </div>
      </footer>
    </div>
  );
}
