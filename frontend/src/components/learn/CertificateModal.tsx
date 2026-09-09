"use client";

import React, { useRef } from "react";
import type { CadetProfile } from "@/lib/cadetProfile";
import styles from "./CertificateModal.module.css";

interface Props {
  profile: CadetProfile;
  moduleName: string;
  moduleType: string;
  onClose: () => void;
}

export default function CertificateModal({ profile, moduleName, moduleType, onClose }: Props) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (printRef.current) {
      window.print();
    }
  };

  const today = new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.actions}>
          <button className="btn btn-ghost" onClick={handlePrint}>🖨️ Print Certificate</button>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">×</button>
        </div>
        
        <div className={styles.certificateBody} ref={printRef} id="printable-certificate">
          <div className={styles.borderInner}>
            <div className={styles.header}>
              <div className={styles.logos}>
                <span className={styles.logoIcon}>🧭</span>
                <span>SafeZone Academy</span>
              </div>
            </div>
            
            <h1 className={styles.title}>Hero&apos;s Certificate</h1>
            <p className={styles.subtitle}>This legendary scroll certifies that</p>
            <h2 className={styles.cadetName}>{profile.name}</h2>
            
            <div className={styles.details}>
              <p>of the mighty <strong>{profile.school}</strong></p>
              <p>has successfully conquered the following mission:</p>
              <h3 className={styles.tierHighlight}>✨ {moduleName} ✨<br/>({moduleType})</h3>
              <p>demonstrating exceptional bravery, survival skills, and disaster readiness!</p>
            </div>
            
            <div className={styles.footer}>
              <div className={styles.signatureBlock}>
                <div className={styles.signatureLine}>Apex</div>
                <p>Commander Apex</p>
              </div>
              
              <div className={styles.seal}>
                <div className={styles.sealInner}>
                  <span>NDMA</span>
                  <span>HERO</span>
                </div>
              </div>
              
              <div className={styles.dateBlock}>
                <p>{today}</p>
                <p>Mission Date</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.celebration}>
          <button className="btn btn-primary" onClick={onClose}>Awesome!</button>
        </div>
      </div>
    </div>
  );
}
