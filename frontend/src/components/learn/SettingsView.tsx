"use client";

import React, { useState } from "react";
import styles from "./LearnPage.module.css";

interface SettingsState {
  sfxEnabled: boolean;
  voiceTts: string;
  drillSirens: boolean;
  reducedMotion: boolean;
  emergencyContactName: string;
  emergencyContactPhone: string;
  autoSosAlert: boolean;
  haptics: boolean;
}

const DEFAULT_SETTINGS: SettingsState = {
  sfxEnabled: true,
  voiceTts: "mitra-en-calm",
  drillSirens: true,
  reducedMotion: false,
  emergencyContactName: "Dr. K. Sharma (Parent)",
  emergencyContactPhone: "+91 98765 43210",
  autoSosAlert: true,
  haptics: true,
};

export default function SettingsView() {
  const [settings, setSettings] = useState<SettingsState>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("safezone_settings");
        if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      } catch {
        /* fallback to defaults */
      }
    }
    return DEFAULT_SETTINGS;
  });

  const [savedNotice, setSavedNotice] = useState(false);

  const updateSetting = <K extends keyof SettingsState>(key: K, val: SettingsState[K]) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: val };
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("safezone_settings", JSON.stringify(next));
        } catch {
          /* ignore */
        }
      }
      return next;
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  return (
    <div className={styles.subViewContainer}>
      <div className={styles.subViewHeader}>
        <div>
          <h2 className="heading-lg" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span>⚙️</span> Drill & Audio Settings
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: "4px" }}>
            Configure simulation audio, Mitra voice AI assistance, accessibility modes, and emergency contacts.
          </p>
        </div>
        {savedNotice && (
          <span className="badge badge-teal" style={{ animation: "fade-in-up 0.2s ease" }}>
            ✓ Saved
          </span>
        )}
      </div>

      <div className={styles.settingsGrid}>
        {/* Audio & Immersion Section */}
        <div className={styles.settingsCard}>
          <div className={styles.settingsCardHeader}>
            <span className={styles.settingsCardIcon}>🔊</span>
            <div>
              <h3 className={styles.settingsCardTitle}>Audio & Voice Immersion</h3>
              <p className={styles.settingsCardDesc}>Control simulated disaster sound effects and voice guidance.</p>
            </div>
          </div>

          <div className={styles.settingRow}>
            <div>
              <div className={styles.settingName}>Simulation Sound Effects (SFX)</div>
              <div className={styles.settingDesc}>Fire crackle, earthquake rumble, and door physics.</div>
            </div>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={settings.sfxEnabled}
                onChange={(e) => updateSetting("sfxEnabled", e.target.checked)}
              />
              <span className={styles.slider} />
            </label>
          </div>

          <div className={styles.settingRow}>
            <div>
              <div className={styles.settingName}>Emergency Drill Sirens</div>
              <div className={styles.settingDesc}>Play campus NDMA alarm tones when an evacuation drill triggers.</div>
            </div>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={settings.drillSirens}
                onChange={(e) => updateSetting("drillSirens", e.target.checked)}
              />
              <span className={styles.slider} />
            </label>
          </div>

          <div className={styles.settingRow}>
            <div>
              <div className={styles.settingName}>Mitra AI Voice Guidance</div>
              <div className={styles.settingDesc}>Choose the voice profile used for real-time calming evacuation prompts.</div>
            </div>
            <select
              value={settings.voiceTts}
              onChange={(e) => updateSetting("voiceTts", e.target.value)}
              className={styles.settingSelect}
            >
              <option value="mitra-en-calm">Mitra English (Calm & Clear)</option>
              <option value="mitra-hi-direct">Mitra Hindi (शांत और स्पष्ट)</option>
              <option value="mitra-ta-emergency">Mitra Tamil (அமைதியான வழிகாட்டி)</option>
              <option value="mitra-te-soothing">Mitra Telugu (స్పష్టమైన మార్గదర్శి)</option>
            </select>
          </div>
        </div>

        {/* Accessibility & Device Feedback */}
        <div className={styles.settingsCard}>
          <div className={styles.settingsCardHeader}>
            <span className={styles.settingsCardIcon}>♿</span>
            <div>
              <h3 className={styles.settingsCardTitle}>Accessibility & Performance</h3>
              <p className={styles.settingsCardDesc}>Customize motion intensity and device haptic vibrations.</p>
            </div>
          </div>

          <div className={styles.settingRow}>
            <div>
              <div className={styles.settingName}>Reduced Motion</div>
              <div className={styles.settingDesc}>Disable screen shaking during earthquake simulation for vestibular comfort.</div>
            </div>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={settings.reducedMotion}
                onChange={(e) => updateSetting("reducedMotion", e.target.checked)}
              />
              <span className={styles.slider} />
            </label>
          </div>

          <div className={styles.settingRow}>
            <div>
              <div className={styles.settingName}>Mobile Haptic Feedback</div>
              <div className={styles.settingDesc}>Vibrate device when crossing hazardous smoke or fire zones.</div>
            </div>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={settings.haptics}
                onChange={(e) => updateSetting("haptics", e.target.checked)}
              />
              <span className={styles.slider} />
            </label>
          </div>
        </div>

        {/* Emergency Contacts & SOS */}
        <div className={styles.settingsCard}>
          <div className={styles.settingsCardHeader}>
            <span className={styles.settingsCardIcon}>🚨</span>
            <div>
              <h3 className={styles.settingsCardTitle}>Emergency Contacts & SOS</h3>
              <p className={styles.settingsCardDesc}>Configured numbers to notify upon active incident declaration.</p>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.inputLabel}>Guardian / Emergency Contact Name</label>
            <input
              type="text"
              value={settings.emergencyContactName}
              onChange={(e) => updateSetting("emergencyContactName", e.target.value)}
              className={styles.settingInput}
              placeholder="Full Name"
            />
          </div>

          <div className={styles.formGroup} style={{ marginTop: "12px" }}>
            <label className={styles.inputLabel}>Emergency Phone Number (SMS Alert)</label>
            <input
              type="tel"
              value={settings.emergencyContactPhone}
              onChange={(e) => updateSetting("emergencyContactPhone", e.target.value)}
              className={styles.settingInput}
              placeholder="+91 XXXXX XXXXX"
            />
          </div>

          <div className={styles.settingRow} style={{ marginTop: "16px" }}>
            <div>
              <div className={styles.settingName}>Automated SOS Dispatch</div>
              <div className={styles.settingDesc}>Send real-time safe muster location to guardian when drill ends.</div>
            </div>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={settings.autoSosAlert}
                onChange={(e) => updateSetting("autoSosAlert", e.target.checked)}
              />
              <span className={styles.slider} />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
