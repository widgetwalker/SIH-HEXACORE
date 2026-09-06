"use client";
/* eslint-disable @next/next/no-img-element */

import type { CSSProperties } from "react";
import { DEFAULT_AVATAR_ID, PROFILE_AVATARS, type CadetProfile } from "@/types/profile";
import styles from "./ProfileAvatar.module.css";

interface ProfileAvatarProps {
  profile?: Pick<CadetProfile, "avatarId" | "avatarImage"> | null;
  size?: "small" | "medium" | "large";
  className?: string;
}

export default function ProfileAvatar({ profile, size = "medium", className = "" }: ProfileAvatarProps) {
  const avatarId = profile?.avatarId || DEFAULT_AVATAR_ID;
  const definition = PROFILE_AVATARS.find((avatar) => avatar.id === avatarId) || PROFILE_AVATARS[0];
  const style = {
    "--avatar-accent": definition.accent,
    "--avatar-secondary": definition.secondary,
  } as CSSProperties;

  return (
    <span className={`${styles.avatar} ${styles[size]} ${className}`} style={style} aria-hidden="true">
      {profile?.avatarImage ? (
        <img className={styles.image} src={profile.avatarImage} alt="" />
      ) : (
        <svg viewBox="0 0 48 48" fill="none" className={styles.svg}>
          <defs>
            <linearGradient id={`avatar-${avatarId}`} x1="8" y1="6" x2="40" y2="42" gradientUnits="userSpaceOnUse">
              <stop stopColor="var(--avatar-accent)" />
              <stop offset="1" stopColor="var(--avatar-secondary)" />
            </linearGradient>
          </defs>
          {avatarId === "compass" && (
            <>
              <circle cx="24" cy="24" r="15" fill={`url(#avatar-${avatarId})`} opacity=".22" stroke="currentColor" strokeWidth="1.5" />
              <path d="m30 18-4.6 9.4L16 32l4.6-9.4L30 18Z" fill={`url(#avatar-${avatarId})`} stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              <circle cx="24" cy="24" r="2" fill="currentColor" />
            </>
          )}
          {avatarId === "summit" && (
            <>
              <path d="m8 35 10.5-16 6 8 4-6L40 35H8Z" fill={`url(#avatar-${avatarId})`} opacity=".9" />
              <path d="m18.5 19 2.6 4h-5.2l2.6-4Z" fill="white" opacity=".85" />
              <path d="M8 35h32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </>
          )}
          {avatarId === "signal" && (
            <>
              <path d="M24 34V14M17 34V22M31 34V9" stroke={`url(#avatar-${avatarId})`} strokeWidth="4" strokeLinecap="round" />
              <path d="M10 38h28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <circle cx="31" cy="9" r="3" fill="currentColor" />
            </>
          )}
          {avatarId === "ember" && (
            <>
              <path d="M25.5 8c1.8 7.2-3.6 8.2-2.5 13.1.5 2.4 2.7 3.8 4.5 2.2 1.5-1.3 1.8-3.2 1-5.8 6.7 4.4 7.5 12.8 1.5 17.4-5.6 4.3-15.8 1-16.7-6.1-.7-5.6 3.3-9.5 6-12.2.1 3.6 1.4 5.1 2.7 4.8C24.2 20.7 20.7 14.7 25.5 8Z" fill={`url(#avatar-${avatarId})`} />
              <path d="M24 29c2.6 2.1 2.6 4.6 0 6.2-2.6-1.6-2.6-4.1 0-6.2Z" fill="white" opacity=".75" />
            </>
          )}
          {avatarId === "orbit" && (
            <>
              <circle cx="24" cy="24" r="6" fill={`url(#avatar-${avatarId})`} />
              <ellipse cx="24" cy="24" rx="17" ry="8" stroke="currentColor" strokeWidth="1.5" transform="rotate(-28 24 24)" />
              <circle cx="38" cy="16" r="2.5" fill="currentColor" />
            </>
          )}
          {avatarId === "shield" && (
            <>
              <path d="M24 6 37 11v9.2c0 8-5.4 13.8-13 17.2-7.6-3.4-13-9.2-13-17.2V11l13-5Z" fill={`url(#avatar-${avatarId})`} opacity=".95" />
              <path d="m17.5 23.5 4.3 4.3 8.9-9" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            </>
          )}
        </svg>
      )}
    </span>
  );
}
