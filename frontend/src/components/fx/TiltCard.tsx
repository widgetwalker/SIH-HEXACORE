"use client";

import { useRef, ReactNode, MouseEvent } from "react";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  max?: number;
}

/** 3D perspective tilt on hover with a moving glare highlight. */
export default function TiltCard({ children, className = "", max = 8 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.transform = `perspective(900px) rotateX(${((0.5 - py) * max).toFixed(2)}deg) rotateY(${((px - 0.5) * max).toFixed(2)}deg) translateY(-4px)`;
    if (glareRef.current) {
      glareRef.current.style.background = `radial-gradient(circle at ${px * 100}% ${py * 100}%, rgba(255,255,255,0.14) 0%, transparent 60%)`;
      glareRef.current.style.opacity = "1";
    }
  };

  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "";
    if (glareRef.current) glareRef.current.style.opacity = "0";
  };

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      data-cursor
      style={{
        position: "relative",
        transition: "transform .35s cubic-bezier(.16,1,.3,1), border-color .35s, box-shadow .35s",
        willChange: "transform",
        transformStyle: "preserve-3d",
      }}
    >
      {children}
      <div
        ref={glareRef}
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          opacity: 0,
          transition: "opacity .3s",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
