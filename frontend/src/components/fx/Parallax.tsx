"use client";

import { useEffect, useRef, ReactNode } from "react";

interface ParallaxProps {
  speed?: number;
  children: ReactNode;
  className?: string;
}

/** Translates children vertically relative to viewport center for depth. */
export default function Parallax({ speed = 0.15, children, className = "" }: ParallaxProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;
    let raf = 0;
    const update = () => {
      const r = outer.getBoundingClientRect();
      const offset = (r.top + r.height / 2 - window.innerHeight / 2) * -speed;
      inner.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [speed]);

  return (
    <div ref={outerRef} className={className}>
      <div ref={innerRef} style={{ willChange: "transform" }}>{children}</div>
    </div>
  );
}
