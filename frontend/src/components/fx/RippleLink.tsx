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
    const el = ref.current;
    const rect = el.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    el.style.transform = `translate3d(${(dx * 0.14).toFixed(1)}px, ${(dy * 0.14).toFixed(1)}px, 0)`;
  };

  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "translate3d(0, 0, 0)";
  };

  return (
    <Link
      href={href}
      ref={ref}
      prefetch={true}
      className={className}
      onMouseDown={spawnRipple}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        position: "relative",
        overflow: "hidden",
        willChange: "transform",
        transition: "transform .2s cubic-bezier(.16,1,.3,1), box-shadow .2s",
      }}
    >
      {children}
    </Link>
  );
}
