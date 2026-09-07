"use client";

import { useState } from "react";
import { mapAgeToTier, saveCadetProfile, type CadetProfile } from "@/lib/cadetProfile";
import styles from "./CadetProfileForm.module.css";

interface Props {
  initial?: CadetProfile | null;
  submitLabel: string;
  onSaved: (profile: CadetProfile) => void;
}

export default function CadetProfileForm({ initial, submitLabel, onSaved }: Props) {
  const [name, setName] = useState(initial?.name ?? "");
  const [age, setAge] = useState(initial ? String(initial.age) : "");
  const [grade, setGrade] = useState(initial?.grade ?? "");
  const [school, setSchool] = useState(initial?.school ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const ageNum = Number(age);
  const preview = age && Number.isFinite(ageNum) ? mapAgeToTier(ageNum) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = "Name is required";
    const ageNum = parseInt(age, 10);
    if (!age || isNaN(ageNum) || ageNum < 5 || ageNum > 99) {
      newErrors.age = "Valid age is required (5-99)";
    }
    if (!grade) newErrors.grade = "Grade is required";
    if (!school.trim()) newErrors.school = "School is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const saved = await saveCadetProfile({ name, age: ageNum, grade, school });
    onSaved(saved);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.field}>
        <span>Full Name</span>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ananya Sharma" required />
      </label>
      <label className={styles.field}>
        <span>Age</span>
        <input
          type="number"
          min={5}
          max={99}
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="e.g. 12"
          required
        />
      </label>
      <label className={styles.field}>
        <span>Grade / Role</span>
        <input
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          placeholder="e.g. Grade 7, College Sophomore, Staff Warden"
          required
        />
      </label>
      <label className={styles.field}>
        <span>School / Institution</span>
        <input value={school} onChange={(e) => setSchool(e.target.value)} placeholder="e.g. Delhi Public School" required />
      </label>

      {preview && (
        <div className={styles.tierPreview}>
          You&apos;ll be placed in <strong>Tier {preview.tierId} — {preview.tierName}</strong>
        </div>
      )}

      {error && <p className={styles.error}>{error}</p>}

      <button type="submit" className="btn btn-primary">
        {submitLabel}
      </button>
    </form>
  );
}
