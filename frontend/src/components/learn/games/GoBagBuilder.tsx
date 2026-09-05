"use client";

import { useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import styles from "./games.module.css";

interface Item {
  id: string;
  label: string;
  essential: boolean;
}

const ITEMS: Item[] = [
  { id: "water", label: "💧 Water Bottle", essential: true },
  { id: "flashlight", label: "🔦 Flashlight", essential: true },
  { id: "firstaid", label: "🩹 First-Aid Kit", essential: true },
  { id: "whistle", label: "📯 Whistle", essential: true },
  { id: "idcopies", label: "🪪 ID Copies", essential: true },
  { id: "powerbank", label: "🔋 Power Bank", essential: true },
  { id: "meds", label: "💊 Medicines", essential: true },
  { id: "mask", label: "😷 Face Mask", essential: true },
  { id: "console", label: "🎮 Game Console", essential: false },
  { id: "nailpolish", label: "💅 Nail Polish", essential: false },
  { id: "textbook", label: "📚 Heavy Textbook", essential: false },
  { id: "football", label: "⚽ Football", essential: false },
];
const CAPACITY = 8;
const TOTAL_ESSENTIALS = ITEMS.filter((i) => i.essential).length;

interface Props {
  onComplete: (score: number) => void;
}

type DragInfo = { id: string; from: "pool" | "bag"; moved: number; lastX: number; lastY: number };

export default function GoBagBuilder({ onComplete }: Props) {
  const [bag, setBag] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [overBag, setOverBag] = useState(false);
  const bagZoneRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragInfo | null>(null);

  const pool = ITEMS.filter((i) => !bag.includes(i.id));

  const isOverBagZone = (x: number, y: number) => {
    const el = bagZoneRef.current;
    if (!el) return false;
    const r = el.getBoundingClientRect();
    return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
  };

  const addToBag = (id: string) =>
    setBag((b) => (b.includes(id) || b.length >= CAPACITY ? b : [...b, id]));
  const removeFromBag = (id: string) => setBag((b) => b.filter((x) => x !== id));

  const onItemPointerDown = (id: string, from: "pool" | "bag") => (e: ReactPointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { id, from, moved: 0, lastX: e.clientX, lastY: e.clientY };
    if (ghostRef.current) {
      const item = ITEMS.find((i) => i.id === id);
      ghostRef.current.textContent = item?.label ?? "";
      ghostRef.current.style.display = "flex";
      ghostRef.current.style.left = `${e.clientX}px`;
      ghostRef.current.style.top = `${e.clientY}px`;
    }
  };
  const onLayoutPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (!d) return;
    // clientX/Y deltas instead of movementX/Y - movement is often 0 for
    // touch-derived pointer events in some browsers, which was making real
    // drags register as taps on mobile.
    d.moved += Math.abs(e.clientX - d.lastX) + Math.abs(e.clientY - d.lastY);
    d.lastX = e.clientX;
    d.lastY = e.clientY;
    if (ghostRef.current) {
      ghostRef.current.style.left = `${e.clientX}px`;
      ghostRef.current.style.top = `${e.clientY}px`;
    }
    setOverBag(isOverBagZone(e.clientX, e.clientY));
  };
  const onLayoutPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    dragRef.current = null;
    setOverBag(false);
    if (ghostRef.current) ghostRef.current.style.display = "none";
    if (!d) return;

    if (d.moved < 6) {
      // treated as a tap, not a drag
      if (d.from === "pool") addToBag(d.id);
      else removeFromBag(d.id);
      return;
    }
    const overBagNow = isOverBagZone(e.clientX, e.clientY);
    if (d.from === "pool" && overBagNow) addToBag(d.id);
    else if (d.from === "bag" && !overBagNow) removeFromBag(d.id);
  };

  const scoreFor = (finalBag: string[]) => {
    const essentialsInBag = finalBag.filter((id) => ITEMS.find((i) => i.id === id)?.essential).length;
    const distractorsInBag = finalBag.length - essentialsInBag;
    return {
      score: Math.max(0, Math.min(100, Math.round((essentialsInBag / TOTAL_ESSENTIALS) * 100) - distractorsInBag * 15)),
      essentialsInBag,
      distractorsInBag,
    };
  };

  const submit = () => {
    if (submitted) return;
    setSubmitted(true);
    onComplete(scoreFor(bag).score);
  };

  if (submitted) {
    const { score, essentialsInBag, distractorsInBag } = scoreFor(bag);
    const missed = ITEMS.filter((i) => i.essential && !bag.includes(i.id));
    return (
      <div className={styles.resultBox}>
        <span style={{ fontSize: "2.4rem" }}>🎒</span>
        <span className={styles.resultScore}>{score}%</span>
        <p style={{ color: "var(--text-muted)" }}>
          {essentialsInBag}/{TOTAL_ESSENTIALS} essentials packed
          {distractorsInBag > 0
            ? ` · ${distractorsInBag} non-essential item${distractorsInBag === 1 ? "" : "s"} wasted space`
            : ""}
        </p>
        {missed.length > 0 && (
          <p style={{ fontSize: "0.8rem", color: "var(--accent-amber)" }}>
            Missed: {missed.map((m) => m.label).join(", ")}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={styles.bagLayout} onPointerMove={onLayoutPointerMove} onPointerUp={onLayoutPointerUp}>
      <p style={{ color: "var(--text-muted)" }}>
        Drag (or tap) the items you would actually need in a 72-hour emergency go-bag. You have{" "}
        <b>{CAPACITY} slots</b> — choose wisely.
      </p>

      <div>
        <span className={styles.bagCapacity}>
          YOUR GO-BAG · {bag.length}/{CAPACITY}
        </span>
        <div ref={bagZoneRef} className={`${styles.bagZone} ${overBag ? styles.bagZoneOver : ""}`}>
          {bag.length === 0 && (
            <span style={{ color: "var(--text-faint)", fontSize: "0.8rem" }}>Drop items here</span>
          )}
          {bag.map((id) => {
            const item = ITEMS.find((i) => i.id === id)!;
            return (
              <div
                key={id}
                className={`${styles.itemChip} ${styles.itemChipInBag}`}
                onPointerDown={onItemPointerDown(id, "bag")}
              >
                {item.label}
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <span className={styles.bagCapacity}>SUPPLY POOL</span>
        <div className={styles.itemPool}>
          {pool.map((item) => (
            <div key={item.id} className={styles.itemChip} onPointerDown={onItemPointerDown(item.id, "pool")}>
              {item.label}
            </div>
          ))}
        </div>
      </div>

      <button className="btn btn-primary" onClick={submit} disabled={bag.length === 0}>
        Pack Bag →
      </button>

      <div
        ref={ghostRef}
        className={`${styles.itemChip} ${styles.itemChipDragging}`}
        style={{ display: "none", transform: "translate(-50%, -50%)" }}
      />
    </div>
  );
}
