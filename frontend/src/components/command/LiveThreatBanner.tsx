"use client";

import React from "react";
import styles from "./LiveThreatBanner.module.css";

export interface LiveThreatAlert {
  id?: string;
  source: "Open-Meteo" | "USGS" | "NDMA-CAP" | "Campus-IoT" | string;
  severity: "CRITICAL" | "WARNING" | "ADVISORY";
  title: string;
  detail: string;
  timestamp: string;
}

export interface LiveThreatBannerProps {
  alert: LiveThreatAlert | null;
  onAcknowledge?: () => void;
  onTriggerProtocol?: () => void;
  onDismiss?: () => void;
  isAcknowledged?: boolean;
}

const SEVERITY_CONFIG = {
  CRITICAL: {
    color: "#EF4444",
    bgColor: "rgba(239, 68, 68, 0.12)",
    icon: "🚨",
    label: "EXTREME THREAT",
  },
  WARNING: {
    color: "#F59E0B",
    bgColor: "rgba(245, 158, 11, 0.12)",
    icon: "⚠️",
    label: "WARNING",
  },
  ADVISORY: {
    color: "#00D4AA",
    bgColor: "rgba(0, 212, 170, 0.10)",
    icon: "📡",
    label: "LIVE TELEMETRY",
  },
} as const;

export default function LiveThreatBanner({
  alert,
  onAcknowledge,
  onTriggerProtocol,
  onDismiss,
  isAcknowledged = false,
}: LiveThreatBannerProps) {
  if (!alert) return null;

  const sevKey = (alert.severity.toUpperCase() in SEVERITY_CONFIG)
    ? (alert.severity.toUpperCase() as keyof typeof SEVERITY_CONFIG)
    : "ADVISORY";
  const config = SEVERITY_CONFIG[sevKey];

  return (
    <div
      className={styles.banner}
      data-severity={alert.severity.toLowerCase()}
      style={
        {
          "--severity-color": isAcknowledged ? "#10B981" : config.color,
          "--severity-background": isAcknowledged ? "rgba(16, 185, 129, 0.10)" : config.bgColor,
        } as React.CSSProperties
      }
    >
      <div
        className={styles.severityBadge}
        style={{ backgroundColor: isAcknowledged ? "#10B981" : config.color }}
      >
        <span className={styles.severityIcon}>{isAcknowledged ? "✓" : config.icon}</span>
        <span className={styles.severityLabel}>
          {isAcknowledged ? "ACKNOWLEDGED" : config.label}
        </span>
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.title}>{alert.title}</h3>
          <span className={styles.source}>{alert.source}</span>
          {isAcknowledged && (
            <span className="badge badge-green" style={{ fontSize: "0.6875rem", padding: "2px 8px" }}>
              Voice Silenced · Auto-Clearing
            </span>
          )}
        </div>
        <p className={styles.detail}>{alert.detail}</p>
        <span className={styles.timestamp}>Received: {alert.timestamp}</span>
      </div>

      <div className={styles.actions}>
        {onAcknowledge && (
          <button
            className={`${styles.btn} ${isAcknowledged ? styles.btnAcknowledged : styles.btnSecondary}`}
            onClick={isAcknowledged ? undefined : onAcknowledge}
            disabled={isAcknowledged}
            title={isAcknowledged ? "Voice silenced. Alert logged to NDMA." : "Acknowledge alert and silence voice immediately"}
          >
            {isAcknowledged ? "✓ Acknowledged (Silenced)" : "✓ Acknowledge"}
          </button>
        )}
        {onTriggerProtocol && (
          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={onTriggerProtocol}
            style={{ backgroundColor: config.color }}
            title="Broadcast emergency protocol across campus"
          >
            ⚡ Trigger Protocol
          </button>
        )}
        {onDismiss && (
          <button
            className={styles.btnDismiss}
            onClick={onDismiss}
            title="Dismiss banner"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
