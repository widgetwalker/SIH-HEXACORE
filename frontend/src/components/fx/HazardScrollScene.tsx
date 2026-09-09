"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface HazardScrollSceneProps {
  accent?: string;
  secondary?: string;
  className?: string;
}

/**
 * Animated Building Scroll Scene — Powered by high-resolution animated WebP asset.
 * Features scroll-driven 3D parallax, perspective tilt, dynamic hazard lighting shifts,
 * ambient particle field, and HUD scanner overlays.
 */
export default function HazardScrollScene({
  accent = "#00D4AA",
  secondary = "#3B82F6",
  className = "",
}: HazardScrollSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const buildingRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // ── Scroll & Mouse Tracking ──
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
      const currentScroll = Math.max(0, window.scrollY);
      const progress = Math.min(1, Math.max(0, currentScroll / totalScroll));
      setScrollProgress(progress);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      setMousePos({
        x: (e.clientX - centerX) / centerX,
        y: (e.clientY - centerY) / centerY,
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // ── Canvas Particle & Scanner Overlay ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Particle pool
    const PARTICLE_COUNT = 60;
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 1,
      speedY: Math.random() * -0.6 - 0.2,
      speedX: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.6 + 0.2,
    }));

    let scanLineY = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Determine color palette based on scroll progress
      // Act 1 (0-0.33): Teal/Cyan, Act 2 (0.33-0.66): Ocean Blue, Act 3 (0.66-1.0): Ember Orange
      let particleColor = "0, 212, 170"; // Teal
      if (scrollProgress > 0.33 && scrollProgress <= 0.66) {
        particleColor = "59, 130, 246"; // Ocean Blue
      } else if (scrollProgress > 0.66) {
        particleColor = "255, 106, 26"; // Ember Orange
      }

      // Draw floating particles
      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;

        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }

        ctx.fillStyle = `rgba(${particleColor}, ${p.opacity * 0.7})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw subtle tactical scan line
      scanLineY = (scanLineY + 1.2) % height;
      const scanGradient = ctx.createLinearGradient(
        0,
        scanLineY - 15,
        0,
        scanLineY + 15
      );
      scanGradient.addColorStop(0, "rgba(" + particleColor + ", 0)");
      scanGradient.addColorStop(0.5, "rgba(" + particleColor + ", 0.15)");
      scanGradient.addColorStop(1, "rgba(" + particleColor + ", 0)");

      ctx.fillStyle = scanGradient;
      ctx.fillRect(0, scanLineY - 15, width, 30);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [scrollProgress]);

  // ── Calculated 3D Transform Values ──
  const translateY = scrollProgress * -80; // Smooth parallax lift
  const scale = 1 + scrollProgress * 0.12; // Gentle zoom on scroll
  const rotateX = mousePos.y * 3.5 + scrollProgress * -4; // Tilt on mouse + scroll
  const rotateY = mousePos.x * 5.0;

  // Filter tinting per hazard act
  let filterStyle = "brightness(0.92) contrast(1.05)";
  if (scrollProgress > 0.33 && scrollProgress <= 0.66) {
    filterStyle = "brightness(0.88) contrast(1.1) hue-rotate(180deg) saturate(1.2)";
  } else if (scrollProgress > 0.66) {
    filterStyle = "brightness(0.95) contrast(1.15) sepia(0.4) hue-rotate(-20deg) saturate(1.4)";
  }

  return (
    <div
      ref={containerRef}
      className={`${className}`}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        background: "radial-gradient(circle at 50% 40%, #1a1615 0%, #0d0a09 100%)",
      }}
    >
      {/* 2D Overlay Particle & Scanner Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      {/* 3D Animated Building WebP Container */}
      <div
        ref={buildingRef}
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          perspective: "1200px",
          zIndex: 1,
        }}
      >
        <div
          style={{
            position: "relative",
            width: "85vw",
            maxWidth: "1100px",
            height: "75vh",
            maxHeight: "800px",
            transform: `translate3d(0, ${translateY}px, 0) scale(${scale}) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
            transition: "transform 0.12s ease-out",
            filter: filterStyle,
          }}
        >
          <Image
            src="/building-scroll.webp"
            alt="Campus 3D Building Scroll Scene"
            fill
            priority
            unoptimized
            style={{
              objectFit: "contain",
              objectPosition: "center",
              filter: "drop-shadow(0 20px 50px rgba(0, 0, 0, 0.7))",
            }}
          />
        </div>
      </div>

      {/* Dark Vignette Overlay for Crisp Text Readability */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 3,
          background:
            "radial-gradient(circle at center, transparent 35%, rgba(15, 12, 11, 0.75) 85%), linear-gradient(180deg, rgba(15, 12, 11, 0.6) 0%, transparent 25%, transparent 75%, #0d0a09 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
