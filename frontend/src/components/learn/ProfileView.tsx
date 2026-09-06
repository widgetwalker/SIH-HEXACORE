"use client";

import React from "react";
import type { CadetProfile } from "@/types/profile";
import ProfileAvatar from "@/components/profile/ProfileAvatar";
import styles from "./LearnPage.module.css";

interface ProfileViewProps {
  profile: CadetProfile | null;
  onOpenEdit: () => void;
}

interface Certificate {
  id: string;
  title: string;
  issuedDate: string;
  issuer: string;
  badge: string;
  status: "verified" | "pending";
}

const CERTIFICATES: Certificate[] = [
  {
    id: "CERT-NDMA-2026-01",
    title: "NDMA School Disaster Preparedness & PASS Method",
    issuedDate: "August 28, 2026",
    issuer: "National Disaster Management Authority (NDMA)",
    badge: "🔥",
    status: "verified",
  },
  {
    id: "CERT-SDRF-2026-04",
    title: "Earthquake Drop-Cover-Hold Reflex Specialist",
    issuedDate: "September 02, 2026",
    issuer: "State Disaster Response Force & SafeZone Campus",
    badge: "🌍",
    status: "verified",
  },
  {
    id: "CERT-EOC-2026-09",
    title: "Campus Emergency Floor Warden & Crowd Egress",
    issuedDate: "In Progress (Module 5 Required)",
    issuer: "SafeZone Multi-Agency EOC",
    badge: "🛡️",
    status: "pending",
  },
];

interface ProfileViewProps {
  profile?: CadetProfile | null;
  onOpenEdit?: () => void;
}

export default function ProfileView({ profile, onOpenEdit }: ProfileViewProps) {
  const handlePrintCertificate = (title: string) => {
    window.print();
  };

  // Calculate readiness score based on tier (mock for now)
  const readinessScore = profile ? Math.min(50 + (profile.tierId * 8), 95) : 0;
  const tierColors: Record<number, string> = {
    1: "#00D4AA", // teal
    2: "#3B82F6", // blue
    3: "#8B5CF6", // violet
    4: "#F59E0B", // amber
    5: "#EF4444", // red
  };
  const tierColor = profile ? tierColors[profile.tierId] || "#00D4AA" : "#00D4AA";

  return (
    <div className={styles.subViewContainer}>
      <div className={styles.subViewHeader}>
        <div>
          <h2 className="heading-lg" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span>🎓</span> Cadet Profile & Certificates
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: "4px" }}>
            Official student emergency credentials, preparedness assessment, and accredited disaster response certificates.
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <span className="badge badge-teal">NDMA Accredited</span>
          {profile && (
            <button
              className="btn-secondary"
              onClick={onOpenEdit}
              style={{ padding: "6px 12px", fontSize: "0.8125rem" }}
            >
              ✏️ Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Profile Overview Card */}
      {profile ? (
        <div className={styles.profileOverviewCard}>
          <div className={styles.profileOverviewLeft}>
            <ProfileAvatar profile={profile} size="large" />
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 700 }}>Cadet {profile.name}</h3>
                <span className="badge badge-teal">Tier {profile.tierId}: {profile.tierName}</span>
              </div>
              <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                {profile.school} • {profile.grade}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-faint)", marginTop: "2px", fontFamily: "var(--font-mono)" }}>
                Age: {profile.age} • NDMA Cohort: {profile.tierName}
              </div>
            </div>
          </div>

          <div className={styles.readinessMeter}>
            <div className={styles.readinessTop}>
              <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)", fontWeight: 600 }}>DISASTER READINESS</span>
              <span style={{ fontSize: "1.25rem", color: tierColor, fontWeight: 800, fontFamily: "var(--font-mono)" }}>{readinessScore}%</span>
            </div>
            <div className="progress-track" style={{ height: "8px" }}>
              <div className="progress-bar" style={{ width: `${readinessScore}%`, background: `linear-gradient(90deg, ${tierColor}, #3B82F6)` }} />
            </div>
            <span style={{ fontSize: "0.6875rem", color: "var(--text-faint)" }}>
              {readinessScore >= 70 ? "Exceeds 70% threshold required for Campus Junior Warden" : "Continue learning to reach 70% threshold"}
            </span>
          </div>
        </div>
      ) : (
        <div style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)" }}>
          <p>No profile found. Please complete onboarding to view your cadet profile.</p>
        </div>
      )}

      {/* Certificates Section */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "12px" }}>
        <h3 className="heading-md" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span>📜</span> Earned Certifications
        </h3>

        <div className={styles.certificateGrid}>
          {CERTIFICATES.map((cert) => (
            <div key={cert.id} className={`${styles.certificateCard} ${cert.status === "pending" ? styles.certPending : ""}`}>
              <div className={styles.certIcon}>{cert.badge}</div>
              <div className={styles.certBody}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                  <span className={styles.certId}>{cert.id}</span>
                  {cert.status === "verified" ? (
                    <span className="badge badge-teal">Verified ✓</span>
                  ) : (
                    <span className="badge badge-amber">Locked</span>
                  )}
                </div>
                <h4 className={styles.certTitle}>{cert.title}</h4>
                <div className={styles.certMeta}>
                  <span>Issuer: {cert.issuer}</span>
                  <span>Issued: {cert.issuedDate}</span>
                </div>
              </div>
              <div className={styles.certAction}>
                {cert.status === "verified" ? (
                  <button
                    className={styles.certBtn}
                    onClick={() => handlePrintCertificate(cert.title)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Download PDF
                  </button>
                ) : (
                  <button className={styles.certBtnDisabled} disabled>
                    Complete Modules
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
