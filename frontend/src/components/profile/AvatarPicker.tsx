"use client";

import { useRef, useState } from "react";
import { PROFILE_AVATARS, type CadetProfile } from "@/types/profile";
import ProfileAvatar from "./ProfileAvatar";
import styles from "./AvatarPicker.module.css";

interface AvatarPickerProps {
  profile: Pick<CadetProfile, "avatarId" | "avatarImage">;
  onChange: (next: Pick<CadetProfile, "avatarId" | "avatarImage">) => void;
}

const MAX_UPLOAD_BYTES = 1_500_000;

export default function AvatarPicker({ profile, onChange }: AvatarPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const chooseBuiltIn = (avatarId: string) => {
    setError(null);
    onChange({ avatarId, avatarImage: undefined });
  };

  const handleUpload = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Choose an image file such as PNG, JPG, or WEBP.");
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      setError("Please choose an image smaller than 1.5 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setError(null);
        onChange({ avatarId: "upload", avatarImage: reader.result });
      }
    };
    reader.onerror = () => setError("That image could not be read. Try another file.");
    reader.readAsDataURL(file);
  };

  return (
    <section className={styles.wrapper} aria-labelledby="avatar-picker-title">
      <div className={styles.heading}>
        <div>
          <p className={styles.kicker}>Cadet identity</p>
          <h3 id="avatar-picker-title">Choose your profile mark</h3>
          <p className={styles.description}>Select a SafeZone icon or upload an image from this device.</p>
        </div>
        <ProfileAvatar profile={profile} size="large" />
      </div>

      <div className={styles.choices} role="radiogroup" aria-label="Profile avatars">
        {PROFILE_AVATARS.map((avatar) => (
          <button
            key={avatar.id}
            type="button"
            className={`${styles.choice} ${profile.avatarId === avatar.id && !profile.avatarImage ? styles.selected : ""}`}
            onClick={() => chooseBuiltIn(avatar.id)}
            role="radio"
            aria-checked={profile.avatarId === avatar.id && !profile.avatarImage}
            aria-label={`${avatar.label} avatar`}
          >
            <ProfileAvatar profile={{ avatarId: avatar.id }} size="medium" />
            <span>{avatar.label}</span>
          </button>
        ))}
        <button
          type="button"
          className={`${styles.choice} ${profile.avatarImage ? styles.selected : ""}`}
          onClick={() => inputRef.current?.click()}
          role="radio"
          aria-checked={Boolean(profile.avatarImage)}
          aria-label="Upload a profile image"
        >
          <span className={styles.uploadIcon} aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M5 14v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" strokeLinecap="round" />
            </svg>
          </span>
          <span>Upload</span>
        </button>
      </div>

      <input ref={inputRef} className={styles.fileInput} type="file" accept="image/*" onChange={(event) => handleUpload(event.target.files?.[0])} />
      {error && <p className={styles.error} role="alert">{error}</p>}
    </section>
  );
}
