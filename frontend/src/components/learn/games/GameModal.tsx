"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import styles from "./games.module.css";

interface Props {
  title: string;
  icon: string;
  onClose: () => void;
  children: ReactNode;
}

export default function GameModal({ title, icon, onClose, children }: Props) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={`hud-panel ${styles.modal}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className={styles.modalHeader}>
          <span className={styles.modalTitle}>
            <span aria-hidden="true">{icon}</span> {title}
          </span>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <div className={styles.modalBody}>{children}</div>
      </div>
    </div>
  );
}
