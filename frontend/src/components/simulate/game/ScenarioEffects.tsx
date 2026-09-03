"use client";

import { useEffect, useRef, useMemo, useCallback } from "react";
import { motion, useSpring, useMotionValue, AnimatePresence } from "framer-motion";
import type { GameState } from "./EvacuationGame";
import type { Scenario } from "./floorplan";

/*
 * ScenarioEffects — per-hazard screen overlays layered between the Three.js
 * canvas and the HUD. Each hazard type gets a distinct material language:
 *
 *   EARTHQUAKE  → screen shake, debris particles, warm vignette, crack lines
 *   FIRE        → expanding fire glow, floating embers, smoke veil, heat haze
 *   TOXIC GAS   → green gas clouds, visibility reduction, chromatic aberration
 *   BLACKOUT    → flashlight cone, flickering emergency lights, oppressive dark
 *
 * Design principles (stitch taste + emil):
 *   - One decisive motion per effect, not spin-soup
 *   - Transform/opacity only, never layout properties
 *   - Custom easing: cubic-bezier(0.23, 1, 0.32, 1) for exits
 *   - No neon purple, no generic blur — warm fire / cold smoke / sick green only
 *   - prefers-reduced-motion: disable all transforms, keep color shifts only
 */

interface Props {
  scenario: Scenario;
  gs: GameState | null;
  phase: "briefing" | "running" | "ended";
}

/* quake-style shake/wobble applies to the original compound scenario plus the
   tier-game multi-hazard drills, which are also earthquake-triggered fires */
const QUAKE_SCENARIO_IDS = new Set([
  "quake-compound",
  "guardians-multihazard",
  "sentinels-multihazard",
  "wardens-multihazard",
]);

/* ── Deterministic seeded random for particle positions ── */
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/* ── Ember particle (fire scenarios) ── */
function EmberParticles({ intensity, color }: { intensity: number; color: string }) {
  const count = Math.floor(12 + intensity * 24);
  const particles = useMemo(() => {
    const rng = seededRandom(42);
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: rng() * 100,
      delay: rng() * 4,
      duration: 2.5 + rng() * 3,
      size: 2 + rng() * 3,
      drift: (rng() - 0.5) * 30,
    }));
  }, []);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {particles.slice(0, count).map((p) => (
        <motion.div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            bottom: "-5%",
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: color,
            boxShadow: `0 0 ${p.size * 2}px ${color}`,
          }}
          animate={{
            y: [0, -window.innerHeight * 1.1],
            x: [0, p.drift],
            opacity: [0, 0.9, 0.9, 0],
            scale: [1, 1.2, 0.6],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

/* ── Gas cloud particles (chemical spill) ── */
function GasClouds({ intensity }: { intensity: number }) {
  const clouds = useMemo(() => {
    const rng = seededRandom(77);
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: 20 + rng() * 60,
      y: 10 + rng() * 80,
      size: 80 + rng() * 160,
      delay: rng() * 3,
      duration: 4 + rng() * 4,
    }));
  }, []);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {clouds.map((c) => (
        <motion.div
          key={c.id}
          style={{
            position: "absolute",
            left: `${c.x}%`,
            top: `${c.y}%`,
            width: c.size,
            height: c.size,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(34,197,94,0.25) 0%, rgba(34,197,94,0.05) 60%, transparent 100%)",
            filter: "blur(20px)",
          }}
          animate={{
            scale: [0.8, 1.3, 0.9],
            opacity: [0.15 * intensity, 0.4 * intensity, 0.15 * intensity],
            x: [0, 30, -20, 0],
          }}
          transition={{
            duration: c.duration,
            delay: c.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ── Debris particles (earthquake) ── */
function DebrisParticles({ intensity }: { intensity: number }) {
  const pieces = useMemo(() => {
    const rng = seededRandom(13);
    return Array.from({ length: 16 }, (_, i) => ({
      id: i,
      x: rng() * 100,
      delay: rng() * 2,
      duration: 1.5 + rng() * 2,
      size: 3 + rng() * 6,
      rotate: rng() * 360,
      drift: (rng() - 0.5) * 40,
    }));
  }, []);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {pieces.slice(0, Math.floor(6 + intensity * 10)).map((p) => (
        <motion.div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: "-5%",
            width: p.size,
            height: p.size * 0.6,
            background: "rgba(120,110,95,0.7)",
            borderRadius: 1,
          }}
          animate={{
            y: [0, window.innerHeight * 1.1],
            x: [0, p.drift],
            rotate: [0, p.rotate],
            opacity: [0.8, 0.8, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeIn",
          }}
        />
      ))}
    </div>
  );
}

export default function ScenarioEffects({ scenario, gs, phase }: Props) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const reduced = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const isRunning = phase === "running" && gs?.status === "running";
  const time = gs?.time ?? 0;
  const panic = gs?.panic ?? 0;
  const oxygen = gs?.oxygen ?? 100;

  /* ── detect hazard category ── */
  const isQuake = QUAKE_SCENARIO_IDS.has(scenario.id);
  const isChemical = scenario.hazardLabel === "TOXIC GAS";
  const isBlackout = scenario.id === "blackout-fire";
  const isFire = !isQuake && !isChemical && scenario.colors.flame.startsWith("#f");

  /* ── screen shake spring (earthquake) ── */
  const shakeX = useMotionValue(0);
  const shakeY = useMotionValue(0);
  const springX = useSpring(shakeX, { stiffness: 300, damping: 12 });
  const springY = useSpring(shakeY, { stiffness: 300, damping: 12 });

  useEffect(() => {
    if (!isQuake || !isRunning || reduced) return;
    let raf: number;
    let lastShake = 0;
    const tick = () => {
      const now = performance.now() / 1000;
      // constant micro-tremor + aftershock bursts at t~35-45
      const inAftershock = time > 32 && time < 48;
      const baseAmp = inAftershock ? 6 : 1.5;
      const freq = inAftershock ? 25 : 8;
      if (now - lastShake > 1 / freq) {
        lastShake = now;
        shakeX.set((Math.random() - 0.5) * baseAmp * 2);
        shakeY.set((Math.random() - 0.5) * baseAmp * 2);
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => { cancelAnimationFrame(raf); shakeX.set(0); shakeY.set(0); };
  }, [isQuake, isRunning, time > 32 && time < 48, reduced, shakeX, shakeY]);

  /* ── apply shake to stage container ── */
  useEffect(() => {
    if (!isQuake || !isRunning || reduced) return;
    const stage = wrapperRef.current?.parentElement as HTMLElement | null;
    if (!stage) return;

    const unsubX = springX.on("change", (v) => {
      stage.style.transform = `translate3d(${v}px, ${springY.get()}px, 0)`;
    });
    const unsubY = springY.on("change", (v) => {
      stage.style.transform = `translate3d(${springX.get()}px, ${v}px, 0)`;
    });
    return () => {
      unsubX();
      unsubY();
      stage.style.transform = "";
    };
  }, [isQuake, isRunning, reduced, springX, springY]);

  /* ── fire spread intensity (0→1 over scenario time) ── */
  const fireProgress = isRunning ? Math.min(time / scenario.timeLimit, 1) : 0;
  const fireIntensity = isFire || isQuake ? fireProgress : 0;

  /* ── gas intensity (spreads faster than fire per scenario) ── */
  const gasIntensity = isChemical && isRunning
    ? Math.min(time / (scenario.timeLimit * 0.6), 1) * (1 - oxygen / 200)
    : 0;

  /* ── blackout visibility ── */
  const blackoutDarkness = isBlackout && isRunning
    ? 0.85 + Math.sin(time * 0.3) * 0.05
    : 0;

  /* ── common fade spring ── */
  const fadeTransition = { duration: 0.4, ease: [0.23, 1, 0.32, 1] as const };

  return (
    <div
      ref={wrapperRef}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 6,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <AnimatePresence>
        {/* ═══════════════ EARTHQUAKE ═══════════════ */}
        {isQuake && isRunning && (
          <motion.div
            key="quake"
            style={{ position: "absolute", inset: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={fadeTransition}
          >
            {/* warm vignette — dust-choked amber, not generic dark red */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `radial-gradient(ellipse at center,
                  transparent 20%,
                  rgba(180,120,50,${0.08 + fireIntensity * 0.15}) 55%,
                  rgba(120,60,20,${0.2 + fireIntensity * 0.3}) 85%,
                  rgba(80,30,10,${0.35 + fireIntensity * 0.35}) 100%)`,
                transition: "background 2s ease",
              }}
            />
            {/* falling debris */}
            {!reduced && <DebrisParticles intensity={isRunning ? 1 : 0} />}
            {/* crack lines — CSS pseudo via SVG filter */}
            {time > 30 && time < 50 && (
              <svg
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.15 }}
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <line x1="25" y1="0" x2="35" y2="45" stroke="rgba(180,140,80,0.6)" strokeWidth="0.3" />
                <line x1="35" y1="45" x2="28" y2="100" stroke="rgba(180,140,80,0.4)" strokeWidth="0.2" />
                <line x1="70" y1="0" x2="62" y2="55" stroke="rgba(180,140,80,0.5)" strokeWidth="0.25" />
                <line x1="62" y1="55" x2="75" y2="100" stroke="rgba(180,140,80,0.35)" strokeWidth="0.2" />
              </svg>
            )}
          </motion.div>
        )}

        {/* ═══════════════ FIRE ═══════════════ */}
        {(isFire || (isQuake && fireIntensity > 0.1)) && isRunning && (
          <motion.div
            key="fire"
            style={{ position: "absolute", inset: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={fadeTransition}
          >
            {/* expanding fire glow — warm radial from bottom, grows with spread */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `radial-gradient(ellipse at 50% 110%,
                  rgba(255,100,20,${fireIntensity * 0.35}) 0%,
                  rgba(200,50,10,${fireIntensity * 0.2}) 30%,
                  rgba(120,20,5,${fireIntensity * 0.12}) 55%,
                  transparent 80%)`,
                transition: "background 3s ease",
              }}
            />
            {/* embers floating up */}
            {!reduced && <EmberParticles intensity={fireIntensity} color={scenario.colors.flame} />}
            {/* smoke veil — thickens with panic */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(to top,
                  rgba(40,40,45,${panic > 50 ? (panic - 50) / 100 : 0}) 0%,
                  rgba(30,30,35,${panic > 70 ? (panic - 70) / 80 : 0}) 40%,
                  transparent 75%)`,
                transition: "background 1.5s ease",
              }}
            />
            {/* heat haze — subtle CSS filter pulse */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backdropFilter: fireIntensity > 0.4 ? `blur(${fireIntensity * 1.5}px)` : undefined,
                WebkitBackdropFilter: fireIntensity > 0.4 ? `blur(${fireIntensity * 1.5}px)` : undefined,
                transition: "backdrop-filter 4s ease",
              }}
            />
          </motion.div>
        )}

        {/* ═══════════════ CHEMICAL / TOXIC GAS ═══════════════ */}
        {isChemical && isRunning && (
          <motion.div
            key="chemical"
            style={{ position: "absolute", inset: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={fadeTransition}
          >
            {/* green gas tint — scenario colors.flame = #7cfc00 */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `radial-gradient(ellipse at 50% 60%,
                  rgba(34,197,94,${gasIntensity * 0.12}) 0%,
                  rgba(22,101,52,${gasIntensity * 0.2}) 40%,
                  rgba(10,60,30,${gasIntensity * 0.35}) 70%,
                  rgba(5,30,15,${gasIntensity * 0.5}) 100%)`,
                transition: "background 2.5s ease",
              }}
            />
            {/* gas cloud particles */}
            {!reduced && <GasClouds intensity={gasIntensity} />}
            {/* visibility reduction — opacity overlay darkens with exposure */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `rgba(10,40,20,${gasIntensity * 0.3 * (1 - oxygen / 120)})`,
                transition: "background 2s ease",
              }}
            />
            {/* chromatic aberration on high panic — red/cyan channel shift via text-shadow trick */}
            {panic > 65 && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  boxShadow: `inset ${(panic - 65) * 0.12}px 0 0 rgba(255,60,60,0.12), inset ${-(panic - 65) * 0.12}px 0 0 rgba(60,255,200,0.12)`,
                  transition: "box-shadow 0.8s ease",
                }}
              />
            )}
            {/* toxic pulse ring — inner glow when gas is heavy */}
            {gasIntensity > 0.5 && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  border: `2px solid rgba(34,197,94,${(gasIntensity - 0.5) * 0.3})`,
                  borderRadius: 0,
                  animation: reduced ? "none" : "toxicPulse 3s ease-in-out infinite",
                }}
              />
            )}
          </motion.div>
        )}

        {/* ═══════════════ BLACKOUT ═══════════════ */}
        {isBlackout && isRunning && (
          <motion.div
            key="blackout"
            style={{ position: "absolute", inset: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={fadeTransition}
          >
            {/* oppressive darkness — near-total coverage */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `radial-gradient(circle at 50% 50%,
                  transparent 5%,
                  rgba(5,8,16,${blackoutDarkness * 0.6}) 25%,
                  rgba(5,8,16,${blackoutDarkness * 0.85}) 50%,
                  rgba(5,8,16,${blackoutDarkness}) 100%)`,
                transition: "background 2s ease",
              }}
            />
            {/* flickering emergency light */}
            <div
              style={{
                position: "absolute",
                top: "15%",
                right: "20%",
                width: 120,
                height: 120,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(255,140,40,0.15) 0%, transparent 70%)",
                animation: reduced ? "none" : "flickerLight 0.15s steps(2) infinite",
                opacity: 0.7,
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "25%",
                left: "15%",
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(255,100,20,0.1) 0%, transparent 70%)",
                animation: reduced ? "none" : "flickerLight 0.12s steps(3) infinite 0.05s",
                opacity: 0.5,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════ GLOBAL: PANIC VIGNETTE ═══════════════ */}
      {/* Replaces the old GSAP-driven vignette — now per-hazard colored */}
      {isRunning && panic > 50 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: isChemical
              ? `radial-gradient(ellipse at center, transparent 30%, rgba(20,80,40,${(panic - 50) / 80}) 75%, rgba(10,50,25,${(panic - 50) / 60}) 100%)`
              : isBlackout
              ? `radial-gradient(ellipse at center, transparent 25%, rgba(5,8,16,${(panic - 50) / 70}) 70%, rgba(2,4,8,${(panic - 50) / 50}) 100%)`
              : `radial-gradient(ellipse at center, transparent 34%, rgba(120,30,0,${(panic - 50) / 80}) 78%, rgba(60,10,0,${(panic - 50) / 60}) 100%)`,
            transition: "background 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
}
