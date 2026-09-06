# 06. Team Role Allocation, RACI Matrix & Sprint Roadmap (Target: Sept 9 MVP)

> **📋 Implementation Status:** This document describes the full design blueprint. For what is currently built and working, see [08_CURRENT_IMPLEMENTATION_STATUS.md](./08_CURRENT_IMPLEMENTATION_STATUS.md).


Based on the core research document and team composition, this blueprint specifies the **Role Allocation, Task Ownership, RACI Matrix, and Day-by-Day Sprint Execution Roadmap** to deliver the Smart India Hackathon (SIH) MVP by **September 9th, 2026**.

```text
+--------------------------------------------------------------------------------------------------+
|                                      CORE TEAM STRUCTURE & ROLES                                 |
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
|   1. DHEERAJ            ──► AI + Design                                                          |
|                             • GenAI Scenarios, GNN Pathfinding, CV Model, UI/UX Design System    |
|                                                                                                  |
|   2. VENKATARAMAN C.V   ──► Backend                                                              |
|                             • FastAPI Microservices, PostGIS DB, WebSockets, CAP Alert Feed      |
|                                                                                                  |
|   3. MANHA AK           ──► AI + Frontend                                                        |
|                             • Three.js / R3F 3D Simulation Canvas, "Mitra" AI Voice/Text UI      |
|                                                                                                  |
|   4. I.SRAVYA           ──► Frontend                                                             |
|                             • Next.js 15 PWA Core, EOC Dashboard, Floor Map UI, Gamification     |
|                                                                                                  |
|   5. TRINAYANI D        ──► Research                                                             |
|                             • NDMA Curriculum, 5 Age Tiers, 150+ Question Bank, Badging          |
|                                                                                                  |
|   6. RAHUL NAYAK        ──► Research                                                             |
|                             • Multi-Agency SOPs (NDRF/SDMA/Fire), CAP Protocols, Pitch Deck     |
|                                                                                                  |
+--------------------------------------------------------------------------------------------------+
```

---

## 1. Individual Member Work Breakdown Structure (WBS) - Final Stretch

> **🚨 CRITICAL DEADLINE:** All tasks listed below must be completed by the **7th night**.

### 1. Dheeraj - AI + Design

- **Task 1.1: Mobile UI/UX Fixes & Component Hierarchy**
  - **Mobile Menu Clashing:** Define the CSS styling for `Navbar.module.css` so the mobile menu has a solid opaque backdrop (`background: rgba(10, 15, 30, 0.98); backdrop-filter: blur(16px); z-index: 9999; height: 100dvh;`), completely hiding underlying page text.
  - **Redesign /learn on Mobile:** Provide the design layout so the large 35% progress ring, quick stats, and navigation tabs collapse into a drawer/hamburger menu on screens < 768px, allowing "Select Your Tier" and Interactive Modules to show directly above the fold.
  - **Design System Consistency:** Ensure the new Settings, Profile, and Leaderboard views follow the unified dark-mode design tokens (Geist/Space Grotesk typography, cyan `#00D4AA`, amber `#F59E0B`).

- **Task 1.2: Scenario Generation & A* Rerouting Visuals**
  - **Validate Benchmarks:** Validate sub-15ms reroute benchmarks in `backend/app/api/v1/pathfinder.py`.
  - **Visual Assets:** Export clean SVG/PNG architecture flowcharts of the GNN/A* dynamic routing for Rahul and Trinayani to place into the pitch deck.

### 2. I. Sravya - Frontend Core

- **Task 2.1: Implement Mobile Navigation & Backdrop Blur**
  - **Files:** `frontend/src/components/Navbar.tsx`, `frontend/src/components/Navbar.module.css`
  - **Action:** Update `.mobileMenu` in `Navbar.module.css` to be a fixed full-screen overlay (`position: fixed; inset: 0;`). Lock body scroll when the mobile menu is open (`document.body.style.overflow = mobileOpen ? "hidden" : "unset"`).

- **Task 2.2: Re-layout /learn for Mobile (Modules-First)**
  - **Files:** `frontend/src/components/learn/LearnPage.tsx`, `frontend/src/components/learn/LearnPage.module.css`
  - **Action:** On mobile (`@media (max-width: 768px)`), hide the top quick stats card and sub-tabs from the main scroll flow and place them behind a compact slide-over sidebar or modal triggered by a "View My Progress" button. Make the main page display the Tier cards and teaching modules immediately.

- **Task 2.3: Build Settings, Profile & Leaderboard Views**
  - **Files:** `frontend/src/components/learn/LeaderboardView.tsx`, new `SettingsView.tsx`, new `ProfileView.tsx`
  - **Action:** 
    - **Settings View:** Toggles for audio/SFX, text-to-speech voice, reduced motion, and emergency contacts.
    - **Profile View:** Student badge showcase, preparedness level, school name, and earned certificates.
    - **Leaderboard View:** Top evacuation scores, drill speeds, and points ranking across grades.

*(Note: Task 2.4 Connect /command to Live WebSocket was completed in PR #15!)*

### 3. Venkataraman C.V - Backend Lead

- **Task 3.1: Implement Persistent Telemetry API**
  - **Files:** `backend/app/api/v1/telemetry.py` (new), `backend/app/main.py`
  - **Action:** 
    - Create `POST /api/v1/telemetry/runs`: Ingest run telemetry (student ID, run ID, completion time, peak panic index, oxygen level, route taken, survival result) and store in PostgreSQL/PostGIS.
    - Create `GET /api/v1/telemetry/analytics`: Aggregate statistics (average exit times, bottlenecks, safe headcount percentages).

- **Task 3.2: Multi-User WebSocket Load Test**
  - **Files:** `backend/tests/load_test_client.py`
  - **Action:** Run load test simulating 50–100 concurrent WebSocket clients emitting drill updates. Validate message fan-out and ensure server latency stays below 50ms without dropped packets.

### 4. Manha AK - AI + 3D Frontend

- **Task 4.1: Interactive 3D Multi-Floor Stack in /command**
  - **Files:** `frontend/src/components/command/` (new `FloorStack3D.tsx`), `frontend/src/components/command/CommandPage.tsx`
  - **Action:** Replace the 2D blueprint with an isometric 3D stacked floor viewer (Ground to 3rd Floor) built with Three.js. Add floor separation animation on click (exploded floor view). Render live 3D hazard pins (fire, smoke) and student dot positions on the active floor.

- **Task 4.2: Replace localStorage with Backend Telemetry Dispatch**
  - **Files:** `frontend/src/components/command/telemetry.ts`, `frontend/src/components/simulate/SimulatePage.tsx`, `frontend/src/app/admin/page.tsx` (or AdminDashboard)
  - **Action:** Update `saveRun()` to `POST` run telemetry to the backend API (`/api/v1/telemetry/runs`), keeping `localStorage` as an offline fallback. Point the Admin Dashboard to read real KPIs from `GET /api/v1/telemetry/analytics`.

### 5. Trinayani D & Rahul Nayak (Combined) - Pitch & Orchestration

- **Task 5.1: Live Pitch Demo Script & Multi-Device Orchestration**
  - **Action:** Orchestrate the 3-Minute Live Hackathon Pitch Flow across 3 devices:
    - **Device 1 (Mobile - Student):** Student navigates redesigned `/learn` modules and triggers an interactive drill.
    - **Device 2 (Laptop - 3D Sim):** Show 3D escape simulation in `/simulate` with real-time smoke physics and Mitra AI.
    - **Device 3 (Main Screen - Command Hub):** Show `/command` updating live via WebSocket, displaying the 3D floor stack, panic gauges, and NDMA alerts.
    - *Prepare cached demo states in case of venue network instability.*

- **Task 5.2: SIH Submission Deck & Presentation Slides**
  - **Action:** Build the official SIH pitch deck covering Problem Statement, Solution, Tech Stack/Architecture, and Impact. Rehearse the judging Q&A.

- **Task 5.3: Verification of Demo Seed Data & Multi-Agency SOPs**
  - **Action:** Verify the school seed database (campus layout, classroom labels, extinguishers) reflects Indian school blueprints. Finalize the Multi-Agency SOP documentation linking the Command Hub to NDRF, SDMA, and Fire Services.

---

## 2. RACI Governance Matrix

| Core System Milestone / Deliverable | Dheeraj (AI+Design) | Venkataraman (Backend) | Manha AK (AI+Frontend) | I.Sravya (Frontend) | Trinayani D (Research) | Rahul Nayak (Research) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **UI/UX Design System & Brand Identity** | **A / R** | I | C | C | C | C |
| **Curriculum & Age-Tiered Matrices** | I | I | C | C | **A / R** | C |
| **Multi-Agency SOPs & CAP Standards** | I | C | I | I | C | **A / R** |
| **Next.js 15 PWA & UI Implementation** | C | C | C | **A / R** | C | I |
| **Three.js 3D Simulation Canvas** | C | I | **A / R** | C | I | I |
| **FastAPI, PostGIS & WebSocket Hub** | C | **A / R** | C | C | I | I |
| **GenAI Dynamic Scenario Synthesizer** | **A / R** | C | C | I | C | C |
| **GNN Real-Time Dynamic Route Optimizer** | **A / R** | C | C | I | I | C |
| **CV Edge "Drop-Cover-Hold" Posture Model** | **A / R** | I | C | C | C | I |
| **"Mitra" Conversational Crisis Bot** | C | C | **A / R** | C | I | C |
| **Campus EOC Multi-Agency Dashboard** | C | C | C | **A / R** | I | C |
| **End-to-End System Integration & Testing** | R | R | R | R | R | **A** |
| **SIH Pitch Deck & Demo Visual Production** | **A / R** | C | C | C | R | **A / R** |

*Legend: **A** = Accountable (Final Owner), **R** = Responsible (Doer), **C** = Consulted, **I** = Informed.*

---

## 3. Day-by-Day Sprint Roadmap (August 23 – September 9, 2026)

```text
+--------------------------------------------------------------------------------------------------+
|                                    4-SPRINT TIMELINE OVERVIEW                                    |
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
|   [ SPRINT 1: FOUNDATION & DESIGN ] (Aug 23 - Aug 27)                                            |
|   • UI/UX Design Tokens & Wireframes, Next.js 15 + FastAPI Scaffolding, PostGIS, NDMA Ingestion  |
|                                                                                                  |
|   [ SPRINT 2: CORE ENGINES ] (Aug 28 - Sep 1)                                                    |
|   • Three.js 3D Simulation, WebSocket Gateway, Student Learning Portal, AI Baselines            |
|                                                                                                  |
|   [ SPRINT 3: ADVANCED FEATURES ] (Sep 2 - Sep 5)                                                |
|   • Campus EOC Command Dashboard, CAP/SACHET Alert Ingestion, "Mitra" AI Crisis Bot              |
|                                                                                                  |
|   [ SPRINT 4: HARDENING & FREEZE ] (Sep 6 - Sep 8)                                               |
|   • Full System Integration, Offline PWA Testing, 5k User Load Testing, Pitch Video Production  |
|                                                                                                  |
|   [ SEPTEMBER 9TH, 2026: FINAL SIH SUBMISSION & CODE FREEZE ]                                    |
|                                                                                                  |
+--------------------------------------------------------------------------------------------------+
```

### Detailed Daily Milestone Schedule

#### Sprint 1: Foundations, Design & Architecture (Aug 23 – Aug 27)

- **Day 1 (Aug 23):** Repository initialization, CI/CD setup, Next.js 15 + FastAPI scaffolding, Tailwind design tokens & Figma theme (Dheeraj, I.Sravya, Venkataraman).
- **Day 2 (Aug 24):** Database ERD implementation in PostgreSQL 16 + PostGIS extension; Redis cache configuration (Venkataraman).
- **Day 3 (Aug 25):** Ingest NDMA/NFPA curriculum data and question bank into structured JSON fixtures (Trinayani, Rahul).
- **Day 4 (Aug 26):** Basic 2D floorplan coordinate schema and graph node adjacency definitions (Venkataraman, Dheeraj).
- **Day 5 (Aug 27):** Sprint 1 Review & Architecture sync: Verify all local development environments run seamlessly.

#### Sprint 2: Core Dual-Engine Development (Aug 28 – Sep 1)

- **Day 6 (Aug 28):** Scaffold Three.js multi-floor building canvas and Rapier physics character controller (Manha, Dheeraj).
- **Day 7 (Aug 29):** Build PWA student learning modules (5 age cohorts) with PASS simulator (I.Sravya, Trinayani).
- **Day 8 (Aug 30):** Implement WebSocket bidirectional event stream for multiplayer drill synchronization (Venkataraman).
- **Day 9 (Aug 31):** Build LLM scenario generator with JSON schema validation & baseline GNN pathfinding (Dheeraj).
- **Day 10 (Sep 1):** Connect frontend 3D simulation to backend WebSocket hazard events (Manha, Venkataraman).

#### Sprint 3: Command Hub & AI Frontier Systems (Sep 2 – Sep 5)

- **Day 11 (Sep 2):** Develop Campus EOC Dashboard with real-time floor status visualizer and QR scanner (I.Sravya, Dheeraj).
- **Day 12 (Sep 3):** Implement CAP v1.2 SACHET alert parser and geofenced automatic emergency mode switch (Venkataraman, Rahul).
- **Day 13 (Sep 4):** Integrate "Mitra" multilingual crisis chatbot and WebAssembly MediaPipe posture detector (Manha, Dheeraj).
- **Day 14 (Sep 5):** Multi-tenant role authentication test (Admin, Warden, Student, NDRF responder) (Venkataraman, I.Sravya).

#### Sprint 4: Hardening, Polish & MVP Submission (Sep 6 – Sep 9)

- **Day 15 (Sep 6):** End-to-end full system drill test: Simulate compound earthquake + fire on 4th floor with 100 virtual students.
- **Day 16 (Sep 7):** Offline PWA stress test: Simulate complete network disconnect; verify cached lessons and WebRTC mesh sync.
- **Day 17 (Sep 8):** Record 3-minute high-impact video demonstration, produce SIH presentation deck, and finalize documentation (Dheeraj, Rahul).
- **Day 18 (Sep 9):** **FINAL SIH SUBMISSION & CODE FREEZE.**

---
*Next Section: [07_DYNAMIC_SCENARIOS_AND_DECISION_MATRICES.md](./07_DYNAMIC_SCENARIOS_AND_DECISION_MATRICES.md)*