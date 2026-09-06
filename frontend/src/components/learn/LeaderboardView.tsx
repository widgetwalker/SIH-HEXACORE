"use client";

import React, { useState } from "react";
import styles from "./LearnPage.module.css";

interface LeaderboardEntry {
  rank: number;
  name: string;
  grade: string;
  score: number;
  evacTime: string;
  drillsCount: number;
  badges: string[];
  isCurrentUser?: boolean;
}

const LEADERBOARD_DATA: LeaderboardEntry[] = [
  { rank: 1, name: "Aarav Sharma", grade: "Grade 10 (Sentinels)", score: 980, evacTime: "28s", drillsCount: 14, badges: ["🔥", "⚡", "🏅"] },
  { rank: 2, name: "Diya Patel", grade: "Grade 8 (Guardians)", score: 965, evacTime: "31s", drillsCount: 12, badges: ["🌍", "🛡️", "🔥"] },
  { rank: 3, name: "Rohan Varma", grade: "Grade 11 (Sentinels)", score: 950, evacTime: "34s", drillsCount: 11, badges: ["⭐", "🎖️"] },
  { rank: 4, name: "Cadet (You)", grade: "Grade 7 (Guardians)", score: 920, evacTime: "36s", drillsCount: 9, badges: ["🏅", "🔥"], isCurrentUser: true },
  { rank: 5, name: "Ananya Iyer", grade: "Grade 5 (Rangers)", score: 905, evacTime: "39s", drillsCount: 8, badges: ["🌱", "🛡️"] },
  { rank: 6, name: "Kavya Menon", grade: "Grade 9 (Sentinels)", score: 890, evacTime: "41s", drillsCount: 7, badges: ["🌍"] },
  { rank: 7, name: "Tanmay Roy", grade: "Grade 4 (Rangers)", score: 875, evacTime: "44s", drillsCount: 6, badges: ["🌱"] },
];

export default function LeaderboardView() {
  const [tierFilter, setTierFilter] = useState("all");

  const filteredData = LEADERBOARD_DATA.filter((item) => {
    if (tierFilter === "all") return true;
    if (tierFilter === "sentinels") return item.grade.includes("Sentinels");
    if (tierFilter === "guardians") return item.grade.includes("Guardians");
    if (tierFilter === "rangers") return item.grade.includes("Rangers");
    return true;
  });

  return (
    <div className={styles.subViewContainer}>
      <div className={styles.subViewHeader}>
        <div>
          <h2 className="heading-lg" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span>🏆</span> Campus Drill Leaderboard
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: "4px" }}>
            Top emergency response cadets ranked by evacuation speed, protocol accuracy, and drill readiness.
          </p>
        </div>
        <span className="badge badge-teal">Live Rankings</span>
      </div>

      {/* KPI Stats Bar */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Campus Evacuation Avg</span>
          <span className={styles.kpiValue} style={{ color: "var(--accent-teal)" }}>34.2s</span>
          <span className={styles.kpiSub}>Target: &lt; 45s</span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Safe Exit Rate</span>
          <span className={styles.kpiValue} style={{ color: "#10B981" }}>96.4%</span>
          <span className={styles.kpiSub}>+2.8% this month</span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Active Drills Completed</span>
          <span className={styles.kpiValue} style={{ color: "var(--accent-amber)" }}>1,420</span>
          <span className={styles.kpiSub}>Across 5 Age Tiers</span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Your Current Rank</span>
          <span className={styles.kpiValue} style={{ color: "var(--accent-blue)" }}>#4</span>
          <span className={styles.kpiSub}>Top 5% of School</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className={styles.filterRow}>
        {[
          { id: "all", label: "All Grades" },
          { id: "sentinels", label: "Sentinels (Grades 9-12)" },
          { id: "guardians", label: "Guardians (Grades 6-8)" },
          { id: "rangers", label: "Rangers (Grades 3-5)" },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`${styles.filterBtn} ${tierFilter === tab.id ? styles.filterBtnActive : ""}`}
            onClick={() => setTierFilter(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Leaderboard Table / Cards */}
      <div className={styles.leaderboardList}>
        {filteredData.map((cadet) => (
          <div
            key={cadet.rank}
            className={`${styles.leaderboardCard} ${cadet.isCurrentUser ? styles.leaderboardCurrentUser : ""}`}
          >
            <div className={styles.rankBadge}>
              {cadet.rank === 1 ? "🥇" : cadet.rank === 2 ? "🥈" : cadet.rank === 3 ? "🥉" : `#${cadet.rank}`}
            </div>

            <div className={styles.cadetInfo}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span className={styles.cadetName}>{cadet.name}</span>
                {cadet.isCurrentUser && <span className="badge badge-teal">You</span>}
              </div>
              <span className={styles.cadetGrade}>{cadet.grade} • {cadet.drillsCount} Drills</span>
            </div>

            <div className={styles.cadetBadges}>
              {cadet.badges.map((b, i) => (
                <span key={i} className={styles.miniBadge}>{b}</span>
              ))}
            </div>

            <div className={styles.cadetStats}>
              <div className={styles.statCol}>
                <span className={styles.statVal} style={{ color: "var(--accent-teal)" }}>{cadet.evacTime}</span>
                <span className={styles.statLbl}>Evac Time</span>
              </div>
              <div className={styles.statCol}>
                <span className={styles.statVal} style={{ color: "var(--accent-amber)" }}>{cadet.score}</span>
                <span className={styles.statLbl}>Points</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
