"use client";

import React, { useState, useEffect } from "react";
import styles from "./CadetOnboardingModal.module.css";

export interface CadetFormData {
  name: string;
  age: number;
  grade: string;
  school: string;
  tierId: number;
  tierName: string;
}

export interface CadetOnboardingModalProps {
  isOpen: boolean;
  initialData?: Partial<CadetFormData>;
  onSubmit: (data: CadetFormData) => void;
  onClose?: () => void;
  isSubmitting?: boolean;
  error?: string | null;
}

const TIER_ICONS: Record<number, string> = {
  1: "🌱",
  2: "🛡️",
  3: "⚡",
  4: "🔥",
  5: "🎖️",
};

export function getTierForAge(age: number): { tierId: number; tierName: string } {
  if (age <= 7) return { tierId: 1, tierName: "Explorers" };
  if (age <= 10) return { tierId: 2, tierName: "Rangers" };
  if (age <= 13) return { tierId: 3, tierName: "Guardians" };
  if (age <= 17) return { tierId: 4, tierName: "Sentinels" };
  return { tierId: 5, tierName: "Wardens" };
}

export default function CadetOnboardingModal({
  isOpen,
  initialData,
  onSubmit,
  onClose,
  isSubmitting = false,
  error = null,
}: CadetOnboardingModalProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [age, setAge] = useState<number | "">(initialData?.age ?? 12);
  const [grade, setGrade] = useState(initialData?.grade || "");
  const [school, setSchool] = useState(initialData?.school || "");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Reset the controlled form when the parent supplies a different profile.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (initialData) {
      if (initialData.name) setName(initialData.name);
      if (initialData.age !== undefined) setAge(initialData.age);
      if (initialData.grade) setGrade(initialData.grade);
      if (initialData.school) setSchool(initialData.school);
    }
  }, [initialData]);
  /* eslint-enable react-hooks/set-state-in-effect */

  if (!isOpen) return null;

  const numericAge = typeof age === "number" && !isNaN(age) ? age : 12;
  const { tierId, tierName } = getTierForAge(numericAge);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!name.trim()) errors.name = "Full name is required";
    if (age === "" || isNaN(Number(age)) || Number(age) < 5 || Number(age) > 99) {
      errors.age = "Age must be between 5 and 99";
    }
    if (!grade.trim()) errors.grade = "Grade, class or role is required";
    if (!school.trim()) errors.school = "School or institution name is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    onSubmit({
      name: name.trim(),
      age: Number(age),
      grade: grade.trim(),
      school: school.trim(),
      tierId,
      tierName,
    });
  };

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="cadet-onboard-title">
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.badgeRow}>
            <span className={styles.badge}>SafeZone Academy</span>
            <span className={styles.badge}>Cadet Identity Gate</span>
            {onClose && (
              <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close enrollment dialog">
                ×
              </button>
            )}
          </div>
          <h2 id="cadet-onboard-title" className={styles.title}>
            Welcome to SafeZone
          </h2>
          <p className={styles.subtitle}>
            Please enroll your cadet identity to access interactive learning modules, 3D evacuation simulations, and the emergency command hub.
          </p>
        </div>

        {error && <div className={styles.error} style={{ marginBottom: "12px" }}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="cadet-name-input">
              Full Name
            </label>
            <input
              id="cadet-name-input"
              type="text"
              className={styles.input}
              placeholder="e.g. Aarav Sharma"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (formErrors.name) setFormErrors((prev) => ({ ...prev, name: "" }));
              }}
              autoFocus
            />
            {formErrors.name && <span className={styles.error}>{formErrors.name}</span>}
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="cadet-age-input">
                Age
              </label>
              <input
                id="cadet-age-input"
                type="number"
                min="5"
                max="99"
                className={styles.input}
                value={age}
                onChange={(e) => {
                  const val = e.target.value === "" ? "" : Number(e.target.value);
                  setAge(val);
                  if (formErrors.age) setFormErrors((prev) => ({ ...prev, age: "" }));
                }}
              />
              {formErrors.age && <span className={styles.error}>{formErrors.age}</span>}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="cadet-grade-input">
                Grade / Standard / Role
              </label>
              <input
                id="cadet-grade-input"
                type="text"
                className={styles.input}
                placeholder="e.g. Grade 7, Staff Warden"
                value={grade}
                onChange={(e) => {
                  setGrade(e.target.value);
                  if (formErrors.grade) setFormErrors((prev) => ({ ...prev, grade: "" }));
                }}
              />
              {formErrors.grade && <span className={styles.error}>{formErrors.grade}</span>}
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="cadet-school-input">
              School or Institution Name
            </label>
            <input
              id="cadet-school-input"
              type="text"
              className={styles.input}
              placeholder="e.g. Kendriya Vidyalaya No. 1"
              value={school}
              onChange={(e) => {
                setSchool(e.target.value);
                if (formErrors.school) setFormErrors((prev) => ({ ...prev, school: "" }));
              }}
            />
            {formErrors.school && <span className={styles.error}>{formErrors.school}</span>}
          </div>

          {/* Real-time NDMA Tier Preview */}
          <div className={styles.tierPreview}>
            <div className={styles.tierInfo}>
              <span className={styles.tierLabel}>Assigned NDMA Learning Cohort</span>
              <span className={styles.tierName}>
                Tier {tierId} · {tierName}
              </span>
              <span className={styles.tierBand}>
                {tierId === 1 && "Ages 5–7 · My First Safety Steps"}
                {tierId === 2 && "Ages 8–10 · Building & Exit Mapping"}
                {tierId === 3 && "Ages 11–13 · Floor-Wise Disaster Response"}
                {tierId === 4 && "Ages 14–17 · Multi-Hazard & Peer Direction"}
                {tierId === 5 && "Ages 18+ · Evacuation Leadership & Command"}
              </span>
            </div>
            <span className={styles.tierIcon}>{TIER_ICONS[tierId]}</span>
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Enrolling Cadet..." : "Save & Enter Cadet Academy →"}
          </button>

          <p className={styles.footerNotice}>
            Your profile is stored on your device and customizes curriculum difficulty, certificate issuance, and drill debriefs. No password required for evaluation.
          </p>
        </form>
      </div>
    </div>
  );
}
