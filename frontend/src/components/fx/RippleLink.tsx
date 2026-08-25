"use client";

import Link from "next/link";
import { useRef, ReactNode, MouseEvent } from "react";

interface RippleLinkProps {
  href: string;
  className?: string;
  children: ReactNode;
  magnetic?: boolean;
}

/** Next.js Link with a material click-ripple and magnetic hover pull. */
export default function RippleLink({
  href,
  className = "",
  children,
  magnetic = true,
}: RippleLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null);

  const spawnRipple = (e: MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const d = Math.max(rect.width, rect.height);
    const span = document.createElement("span");
    span.className = "fx-ripple";
    span.style.width = span.style.height = `${d}px`;
    span.style.left = `${e.clientX - rect.left - d / 2}px`;
    span.style.top = `${e.clientY - rect.top - d / 2}px`;
    el.appendChild(span);
    setTimeout(() => span.remove(), 700);
  };

  const onMove = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!magnetic || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    ref.current.style.transform = `translate(${(dx * 0.18).toFixed(1)}px, ${(dy * 0.18).toFixed(1)}px)`;
  };

  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <Link
      href={href}
      ref={ref}
      className={className}
      onMouseDown={spawnRipple}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        position: "relative",
        overflow: "hidden",
        transition: "transform .25s cubic-bezier(.16,1,.3,1), box-shadow .25s",
      }}
    >
      {children}
    </Link>
  );
}
