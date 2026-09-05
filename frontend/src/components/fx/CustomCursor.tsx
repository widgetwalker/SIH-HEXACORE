"use client";

import { useEffect, useRef, useState } from "react";

/** Glowing dot + trailing ring cursor. Disabled on touch devices and during SSR. */
export default function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.body.classList.add("fx-cursor");
    let x = -100, y = -100, rx = -100, ry = -100, raf = 0, hover = false;

    const onMove = (e: globalThis.MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
    };

    const onOver = (e: globalThis.MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && target.closest?.("a,button,[data-cursor],[role='button'],input,select")) {
        hover = true;
      } else {
        hover = false;
      }
    };

    const tick = () => {
      rx += (x - rx) * 0.2;
      ry += (y - ry) * 0.2;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      ring.style.transform = `translate3d(${rx.toFixed(1)}px, ${ry.toFixed(1)}px, 0) scale(${hover ? 1.75 : 1})`;
      ring.style.borderColor = hover ? "rgba(0,212,170,0.9)" : "rgba(0,212,170,0.45)";
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      document.body.classList.remove("fx-cursor");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(raf);
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        suppressHydrationWarning
        style={{
          position: "fixed",
          top: -3,
          left: -3,
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "#00D4AA",
          boxShadow: "0 0 10px rgba(0,212,170,0.9)",
          zIndex: 9999,
          pointerEvents: "none",
          mixBlendMode: "screen",
        }}
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        suppressHydrationWarning
        style={{
          position: "fixed",
          top: -17,
          left: -17,
          width: 34,
          height: 34,
          borderRadius: "50%",
          border: "1.5px solid rgba(0,212,170,0.45)",
          zIndex: 9999,
          pointerEvents: "none",
          transition: "border-color .2s",
        }}
      />
    </>
  );
}
