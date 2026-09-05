"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";

const HazardScrollScene = dynamic(
  () => import("@/components/fx/HazardScrollScene"),
  { ssr: false }
);
// Fallback: import ImmersiveScene from "@/components/fx/ImmersiveScene"; // keep as low-level fallback — see HazardScrollScene.tsx:1
import Reveal from "@/components/fx/Reveal";
import Parallax from "@/components/fx/Parallax";
import TiltCard from "@/components/fx/TiltCard";
import CountUp from "@/components/fx/CountUp";
import RippleLink from "@/components/fx/RippleLink";
import styles from "./LandingPage.module.css";

const HAZARDS = ["EARTHQUAKE", "FIRE", "FLOOD", "HEATWAVE", "CHEM SPILL", "CYCLONE"];

const MARQUEE = [
  "NDMA SACHET",
  "CAP v1.2",
  "NFPA 101",
  "NDRF SOP",
  "OSHA LAB SAFETY",
  "IMD LIVE FEED",
  "GNN ROUTING",
  "EDGE CV",
  "WEBGPU 3D",
];

const STATS = [
  { end: 315, prefix: "", suffix: "M+", label: "Students to protect", sub: "across Indian campuses" },
  { end: 6, prefix: "", suffix: "", label: "Dynamic disaster types", sub: "compound & cascading events" },
  { end: 6, prefix: "<", suffix: "s", label: "Target exit decision", sub: "down from 45+ seconds" },
  { end: 500, prefix: "<", suffix: "ms", label: "Alert broadcast", sub: "geofenced WebSocket push" },
];

const PILLARS = [
  {
    index: "01",
    tag: "PEDAGOGY",
    title: "Age-Tiered Learning",
    desc: "NDMA / NFPA-mapped curriculum for five age cohorts (5–18+). Interactive PASS extinguisher drills, micro-certifications, badges and campus leaderboards.",
    href: "/learn",
    cta: "Enter the classroom",
    accent: "teal",
  },
  {
    index: "02",
    tag: "SIMULATION",
    title: "3D Crisis Simulator",
    desc: "A procedural multi-floor campus rendered in real-time 3D. Dynamic fire, smoke and quake physics. Panic telemetry. Routes recalculated by a GNN in under 15ms.",
    href: "/simulate",
    cta: "Drop into the drill",
    accent: "blue",
  },
  {
    index: "03",
    tag: "COMMAND",
    title: "Multi-Agency EOC",
    desc: "Live SACHET / CAP v1.2 alert ingestion, floor-by-floor hazard heatmaps, real-time student headcount and one-tap NDRF / Fire / EMS dispatch.",
    href: "/command",
    cta: "Open the command hub",
    accent: "amber",
  },
];

const STACK = [
  "GenAI Scenario Synthesizer",
  "GNN Dynamic A* Routing",
  "MediaPipe Posture CV",
  "“Mitra” Crisis Companion",
  "Adaptive Difficulty Engine",
  "Offline-First PWA",
];

export default function LandingPage() {
  const [word, setWord] = useState(0);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setInterval(() => setWord((w) => (w + 1) % HAZARDS.length), 2200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      if (barRef.current) barRef.current.style.width = `${(window.scrollY / max) * 100}%`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={styles.page}>
      <div ref={barRef} className={styles.progress} aria-hidden="true" />
      <Navbar />

      <div className={styles.scene}>
        <HazardScrollScene />
        {/* Fallback (wireframe low-level) kept: src/components/fx/ImmersiveScene.tsx — switch back if ScrollTrigger pin conflicts */}
      </div>

      <main className={styles.main}>
        {/* HERO */}
        <section className={styles.hero}>
          <Reveal>
            <span className={`badge badge-teal badge-pulse ${styles.kicker}`}>
              SIH 2026 · FRONTIER AI · LIVE PROTOTYPE
            </span>
          </Reveal>
          <Reveal delay={120}>
            <h1 className={styles.title}>
              <span className={styles.titleSolid}>TRAIN TODAY.</span>
              <span className={styles.titleGhost}>SURVIVE THE</span>
              <span key={word} className={styles.word}>{HAZARDS[word]}</span>
            </h1>
          </Reveal>
          <Reveal delay={260}>
            <p className={styles.sub}>
              A gamified disaster-preparedness platform for Indian schools &amp; colleges -
              immersive 3D drills, AI-generated crisis scenarios, and a real-time
              multi-agency command hub. All in the browser.
            </p>
          </Reveal>
          <Reveal delay={380}>
            <div className={styles.ctaRow}>
              <RippleLink href="/simulate" className="btn btn-primary">
                Launch the Simulation →
              </RippleLink>
              <RippleLink href="/learn" className="btn btn-ghost">
                Explore the Curriculum
              </RippleLink>
            </div>
          </Reveal>

          <Parallax speed={0.22} className={`${styles.chip} ${styles.chipA}`}>
            <div className={`hud-panel ${styles.chipInner}`}>
              <span className="hud-label">Panic Index</span>
              <span className={`hud-value ${styles.chipValueTeal}`} suppressHydrationWarning>12% · STABLE</span>
            </div>
          </Parallax>
          <Parallax speed={0.3} className={`${styles.chip} ${styles.chipB}`}>
            <div className={`hud-panel ${styles.chipInner}`}>
              <span className="hud-label">Evac Route B</span>
              <span className={`hud-value ${styles.chipValueBlue}`} suppressHydrationWarning>RECALC 14ms ✓</span>
            </div>
          </Parallax>
          <Parallax speed={0.18} className={`${styles.chip} ${styles.chipC}`}>
            <div className={`hud-panel ${styles.chipInner}`}>
              <span className="hud-label">SACHET Feed</span>
              <span className={`hud-value ${styles.chipValueAmber}`} suppressHydrationWarning>LISTENING…</span>
            </div>
          </Parallax>

          <div className={styles.scrollCue} aria-hidden="true"><span /></div>
        </section>

        {/* MARQUEE */}
        <section className={styles.marquee} aria-hidden="true">
          <div className={styles.marqueeTrack}>
            {[...MARQUEE, ...MARQUEE].map((item, i) => (
              <span key={i} className={styles.marqueeItem}>
                {item}
                <i />
              </span>
            ))}
          </div>
        </section>

        {/* STATS */}
        <section className={styles.section}>
          <div className="container">
            <div className={styles.statsGrid}>
              {STATS.map((s, i) => (
                <Reveal key={s.label} delay={i * 100}>
                  <TiltCard className={`${styles.statCard} noise-overlay`}>
                    <span className={styles.statNum}>
                      <CountUp end={s.end} prefix={s.prefix} suffix={s.suffix} />
                    </span>
                    <span className={styles.statLabel}>{s.label}</span>
                    <span className={styles.statSub}>{s.sub}</span>
                  </TiltCard>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* PILLARS */}
        <section className={styles.section}>
          <div className="container">
            <Reveal>
              <h2 className={styles.sectionTitle}>
                ONE PLATFORM.
                <br />
                <span className="text-gradient-teal">THREE ENGINES.</span>
              </h2>
            </Reveal>
            <div className={styles.pillars}>
              {PILLARS.map((p, i) => (
                <Reveal key={p.index} delay={i * 130}>
                  <TiltCard className={`${styles.pillar} ${styles[p.accent]}`}>
                    <RippleLink href={p.href} className={styles.pillarLink} magnetic={false}>
                      <span className={styles.pillarIndex}>{p.index}</span>
                      <span className={styles.pillarTag}>{p.tag}</span>
                      <h3 className={styles.pillarTitle}>{p.title}</h3>
                      <p className={styles.pillarDesc}>{p.desc}</p>
                      <span className={styles.pillarCta}>{p.cta} →</span>
                    </RippleLink>
                  </TiltCard>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* EMERGENCY MODE */}
        <section className={styles.section}>
          <div className="container">
            <Reveal>
              <div className={styles.emergency}>
                <div className={styles.radar} aria-hidden="true" />
                <div className={styles.emergencyBody}>
                  <span className="badge badge-red badge-pulse">REAL EMERGENCY MODE</span>
                  <h2 className={styles.emergencyTitle}>THIS ISN&apos;T JUST A GAME.</h2>
                  <p className={styles.emergencyDesc}>
                    When a real NDMA SACHET alert lands inside your campus geofence,
                    SafeZone flips from simulation to life-safety mode in under 500
                    milliseconds - broadcasting floor-specific evacuation routes,
                    opening headcount telemetry, and dispatching multi-agency SOS in
                    one motion.
                  </p>
                  <div className={styles.stackRow}>
                    {STACK.map((s, i) => (
                      <Reveal key={s} delay={i * 80}>
                        <span className={styles.stackChip}>{s}</span>
                      </Reveal>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className={styles.finalCta}>
          <Parallax speed={0.08}>
            <Reveal>
              <h2 className={styles.finalTitle}>
                READY TO OUTRUN
                <br />
                THE DISASTER?
              </h2>
            </Reveal>
            <Reveal delay={150}>
              <RippleLink href="/simulate" className="btn btn-primary">
                Start Training Now
              </RippleLink>
            </Reveal>
          </Parallax>
        </section>

        {/* FOOTER */}
        <footer className={styles.footer}>
          <div className="container">
            <div className={styles.footerRow}>
              <span className={styles.footerBrand}>
                Safe<b>Zone</b> - Team HEXACORE · SIH 2026
              </span>
              <span className={styles.footerNote}>
                Built with Next.js + Three.js
              </span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
