"use client";

import React, { useState, useEffect } from "react";
import { mapAgeToTier, type CadetProfile } from "@/lib/cadetProfile";
import styles from "./EditProfileDrawer.module.css";

export interface EditProfileDrawerProps {
  isOpen: boolean;
  initialData?: {
    name: string;
    age: number;
    grade: string;
    school: string;
  };
  onSave: (data: { name: string; age: number; grade: string; school: string; tierId: number; tierName: string }) => void;
  onClose: () => void;
  isSaving?: boolean;
}

export default function EditProfileDrawer({
  isOpen,
  initialData,
  onSave,
  onClose,
  isSaving = false,
}: EditProfileDrawerProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [age, setAge] = useState<number | "">(initialData?.age ?? 12);
  const [grade, setGrade] = useState(initialData?.grade || "");
  const [school, setSchool] = useState(initialData?.school || "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset the controlled form when the parent supplies a different profile.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setAge(initialData.age ?? 12);
      setGrade(initialData.grade || "");
      setSchool(initialData.school || "");
    }
  }, [initialData]);
  /* eslint-enable react-hooks/set-state-in-effect */

  if (!isOpen) return null;

  const numericAge = typeof age === "number" && !isNaN(age) ? age : 12;
  const { tierId, tierName } = mapAgeToTier(numericAge);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = "Name is required";
    if (age === "" || isNaN(Number(age)) || Number(age) < 5 || Number(age) > 99) {
      newErrors.age = "Age must be between 5 and 99";
    }
    if (!grade.trim()) newErrors.grade = "Grade or role is required";
    if (!school.trim()) newErrors.school = "School name is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      name: name.trim(),
      age: Number(age),
      grade: grade.trim(),
      school: school.trim(),
      tierId,
      tierName,
    });
  };

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div>
            <h3 className={styles.title}>Edit Cadet Credentials</h3>
            <p className={styles.subtitle}>Update your academy enrollment record</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close drawer">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="edit-name">
              Full Name
            </label>
            <input
              id="edit-name"
              type="text"
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            {errors.name && <span style={{ color: "#EF4444", fontSize: "0.75rem" }}>{errors.name}</span>}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="edit-age">
              Age (5–99)
            </label>
            <input
              id="edit-age"
              type="number"
              min="5"
              max="99"
              className={styles.input}
              value={age}
              onChange={(e) => setAge(e.target.value === "" ? "" : Number(e.target.value))}
              required
            />
            {errors.age && <span style={{ color: "#EF4444", fontSize: "0.75rem" }}>{errors.age}</span>}
          </div>

          <div className={styles.tierNotice}>
            <span className={styles.tierNoticeLabel}>Updated NDMA Learning Cohort</span>
            <span className={styles.tierNoticeValue}>
              Tier {tierId} · {tierName}
            </span>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="edit-grade">
              Grade / Standard / Role
            </label>
            <input
              id="edit-grade"
              type="text"
              className={styles.input}
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              required
            />
            {errors.grade && <span style={{ color: "#EF4444", fontSize: "0.75rem" }}>{errors.grade}</span>}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="edit-school">
              School or Institution Name
            </label>
            <input
              id="edit-school"
              type="text"
              className={styles.input}
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              required
            />
            {errors.school && <span style={{ color: "#EF4444", fontSize: "0.75rem" }}>{errors.school}</span>}
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose} disabled={isSaving}>
              Cancel
            </button>
            <button type="submit" className={styles.saveBtn} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes ✓"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
