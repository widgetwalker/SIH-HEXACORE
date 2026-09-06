"use client";

import React, { useState } from "react";
import styles from "./IncidentInjectionDeck.module.css";

export type IncidentType = "transformer_fire" | "chemical_spill" | "gas_leak";

export interface IncidentInjectionDeckProps {
  onInjectIncident: (incidentType: IncidentType, floor: string) => void;
  isInjecting?: boolean;
}

const INCIDENT_TYPES = [
  {
    id: "transformer_fire" as IncidentType,
    label: "Transformer Fire",
    icon: "🔥",
    color: "#EF4444",
    description: "Electrical fire, power failure",
  },
  {
    id: "chemical_spill" as IncidentType,
    label: "Chemical Spill",
    icon: "🧪",
    color: "#F59E0B",
    description: "Hazmat containment required",
  },
  {
    id: "gas_leak" as IncidentType,
    label: "Gas Leak",
    icon: "⚠️",
    color: "#8B5CF6",
    description: "Immediate evacuation",
  },
] as const;

const FLOOR_OPTIONS = [
  "Ground",
  "1F",
  "2F",
  "3F",
  "4F",
  "5F",
  "Basement",
] as const;

export default function IncidentInjectionDeck({
  onInjectIncident,
  isInjecting = false,
}: IncidentInjectionDeckProps) {
  const [selectedIncident, setSelectedIncident] = useState<IncidentType | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<string>("Ground");

  const handleInject = () => {
    if (selectedIncident) {
      onInjectIncident(selectedIncident, selectedFloor);
    }
  };

  return (
    <div className={styles.deck}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>
            <span className={styles.icon}>⚡</span>
            Incident Injection Deck
          </h3>
          <p className={styles.subtitle}>
            Simulate emergency scenarios for drill testing
          </p>
        </div>
        <span className="badge badge-amber" style={{ fontSize: "0.625rem" }}>
          SIMULATION MODE
        </span>
      </div>

      <div className={styles.content}>
        {/* Incident Type Selection */}
        <div className={styles.section}>
          <label className={styles.label}>
            <span>Select Incident Type</span>
            <span className={styles.required}>*</span>
          </label>
          <div className={styles.incidentGrid}>
            {INCIDENT_TYPES.map((incident) => (
              <button
                key={incident.id}
                className={`${styles.incidentCard} ${
                  selectedIncident === incident.id ? styles.incidentCardSelected : ""
                }`}
                onClick={() => setSelectedIncident(incident.id)}
                disabled={isInjecting}
                style={
                  selectedIncident === incident.id
                    ? { borderColor: incident.color, boxShadow: `0 0 12px ${incident.color}33` }
                    : undefined
                }
              >
                <span className={styles.incidentIcon}>{incident.icon}</span>
                <span className={styles.incidentLabel}>{incident.label}</span>
                <span className={styles.incidentDesc}>{incident.description}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Floor Selection */}
        <div className={styles.section}>
          <label className={styles.label} htmlFor="floor-select">
            <span>Target Floor</span>
            <span className={styles.required}>*</span>
          </label>
          <select
            id="floor-select"
            className={styles.floorSelect}
            value={selectedFloor}
            onChange={(e) => setSelectedFloor(e.target.value)}
            disabled={isInjecting}
          >
            {FLOOR_OPTIONS.map((floor) => (
              <option key={floor} value={floor}>
                {floor}
              </option>
            ))}
          </select>
        </div>

        {/* Inject Button */}
        <div className={styles.actionRow}>
          <div className={styles.warningNote}>
            <span>⚠️</span>
            <span>
              This will trigger a simulated emergency event and notify all connected drill participants.
            </span>
          </div>
          <button
            className={`${styles.injectBtn} ${isInjecting ? styles.injectBtnLoading : ""}`}
            onClick={handleInject}
            disabled={!selectedIncident || isInjecting}
          >
            {isInjecting ? (
              <>
                <span className={styles.spinner}></span>
                Injecting...
              </>
            ) : (
              <>
                <span>⚡</span>
                Inject Incident
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
