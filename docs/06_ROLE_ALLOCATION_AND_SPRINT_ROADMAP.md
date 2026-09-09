# 06. Team Role Allocation, RACI Matrix & Sprint Roadmap (Target: Sept 9 MVP)

> **Implementation Status:** This document is the ownership and task roadmap. The built-vs-planned truth is maintained in [08_CURRENT_IMPLEMENTATION_STATUS.md](./08_CURRENT_IMPLEMENTATION_STATUS.md). Last task reconciliation: September 6, 2026.


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
|                             • Next.js 16.3.2 PWA Core, EOC Dashboard, Floor Map UI, Gamification |
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

> **CRITICAL DEADLINE:** All tasks listed below must be completed by the **7th night**.

### 1. Dheeraj - AI + Design
- [x] **Task 1.1: Mobile UI/UX Fixes & Component Hierarchy (COMPLETED)**
  - Mobile Menu Clashing: Defined CSS in `Navbar.module.css` with solid opaque backdrop (`background: rgba(10, 15, 30, 0.98); backdrop-filter: blur(16px); z-index: 9999; height: 100dvh; position: fixed; inset: 0;`), completely hiding underlying page text.
  - Redesign /learn on Mobile: Added mobile stats bar and off-canvas slide-over drawer on `< 768px`, allowing "Select Your Tier" and Interactive Modules to show directly above the fold.
  - Design System Consistency: Built `LeaderboardView.tsx`, `SettingsView.tsx`, and `ProfileView.tsx` with unified dark-mode design tokens (Geist typography, cyan `#00D4AA`, amber `#F59E0B`).

- [x] **Task 1.2: Scenario Generation & A* Rerouting Visuals (COMPLETED)**
  - Validate Benchmarks: Validated sub-15ms reroute benchmarks in `backend/app/services/pathfinder.py` (`tests/test_pathfinder_benchmark.py` and `benchmarks/benchmark_pathfinder.py`): initial search avg 0.18ms (p95 0.41ms), dynamic reroute avg 0.12ms (p95 0.25ms), all passing.
  - Visual Assets: Created production-grade vector SVG architecture flowchart `docs/assets/gnn_astar_routing_architecture.svg` (and `frontend/public/assets/gnn_astar_routing_architecture.svg`) for the pitch deck.

- [x] **Issue 1.3: UI/UX for Mandatory Onboarding & Live Disaster Ingestion — frontend UI complete**
  - Cadet onboarding modal and edit drawer are implemented with responsive `100dvh` handling.
  - Profile data is bound to `safezone_cadet_profile_v1` across Learn, Navbar, and the dedicated Profile surface.
  - `/command` has the Live Threat Banner and Incident Injection Deck.
  - Built-in vector avatars and local image upload are available from Profile settings.
  - Remaining route interception and backend live-ingestion work is tracked under Issues 2.6 and 3.3.

### 2. I. Sravya - Frontend Core
- [x] **Task 2.1: Implement Mobile Navigation & Backdrop Blur (COMPLETED in Task 1.1)**
- [x] **Task 2.2: Re-layout /learn for Mobile (COMPLETED in Task 1.1)**
- [x] **Task 2.3: Build Settings, Profile & Leaderboard Views (COMPLETED in Task 1.1)**
- [x] **Task 2.4: Connect /command to Live WebSocket (COMPLETED in PR #15)**
- [x] **Task 2.5: Ingest Verbatim Curriculum & Replace Popups with Full-Page Reader (COMPLETED)**
  - Dedicated full-page reader deployed at `/learn/[moduleId]` (`ModuleReaderPage.tsx`) with `<- Back to Modules` breadcrumbs and scroll-driven progress.
  - Verbatim ingestion of all 5 age tiers without truncation (Explorers, Rangers, Guardians, Sentinels, Wardens) with interactive checkpoints, quizzes, and certificates.
  - Dynamic progress tracking and live aggregate completion percentage wired across all tiers.

- [x] **Task 2.6: Mandatory Cadet Onboarding Gate & Dedicated /profile Route (COMPLETED)**
  - Onboarding form, age-based tier assignment, local profile persistence, and LearnPage profile/edit integration.
  - Dedicated `/profile` route with Dashboard, Certificates, Settings, and Leaderboard sections.
  - Navbar profile avatar routes to `/profile`; profile/avatar updates propagate through the shared browser event.
  - Profile settings support six built-in vector avatars and local image upload.
  - Navigation gate protects `/learn`, `/simulate`, `/command`, and `/profile` until cadet registration is complete.

### 3. Venkataraman C.V - Backend Lead
- [x] **Task 3.1: Implement Persistent Telemetry API**
  - Create `POST /api/v1/telemetry/runs` and `GET /api/v1/telemetry/analytics` wired to PostgreSQL.
- [x] **Task 3.2: Multi-User WebSocket Load Test**
  - Simulate 50-100 concurrent clients on `backend/tests/load_test_client.py` (validated p50 < 23ms, 0 packet drop).
- [x] **Active Issue 3.3: Live Disaster Alert Ingestion & WebSocket Incident Injection**
  - [x] Frontend banner and incident-injection control contracts are implemented; local simulated fallback is available.
  - [x] Built `GET /api/v1/alerts/live` in FastAPI integrating Open-Meteo Severe Weather / Flood API and USGS Earthquake GeoJSON feed + DB alerts.
  - [x] Connected `incidents.py`, `webhooks.py`, and `websocket_manager.py` to broadcast manual campus emergency incident injections to all connected clients.
  - [x] Mapped backend events into the `LiveThreatAlert` and `EmergencyAlertResponse` interface.

### 4. Manha AK - AI + 3D Frontend
- [x] **Task 4.1: Interactive 3D Multi-Floor Stack in /command**
  - **Files:** `frontend/src/components/command/FloorStack3D.tsx`, `frontend/src/components/command/CommandPage.tsx`
  - **Action:** Isometric 3D stacked floor viewer (Ground to 3rd Floor) built with Three.js with floor separation animation on click (exploded floor view), live 3D hazard pins, and student dots.
- [x] **Task 4.2: Replace localStorage with Backend Telemetry Dispatch**
  - **Files:** `frontend/src/components/command/telemetry.ts`, `frontend/src/components/simulate/SimulatePage.tsx`, `frontend/src/app/admin/page.tsx`
  - **Action:** Updated `saveRun()` to `POST` run telemetry to the backend API (`/api/v1/telemetry/runs`), keeping `localStorage` as offline fallback. Admin Dashboard reads real KPIs from `GET /api/v1/telemetry/analytics`.
- [x] **Active Issue 4.3: Mitra AI Crisis Voice Verbalization for Live Ingested Alerts**
  - Mitra automatically verbalizes warning instructions aloud via Web Speech API (`window.speechSynthesis`) during emergency alerts.

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
| **Next.js 16.3.2 PWA & UI Implementation** | C | C | C | **A / R** | C | I |
| **Three.js 3D Simulation Canvas** | C | I | **A / R** | C | I | I |
| **FastAPI, PostGIS & WebSocket Hub** | C | **A / R** | C | C | I | I |
| **GenAI Dynamic Scenario Synthesizer** | **A / R** | C | C | I | C | C |
| **GNN Real-Time Dynamic Route Optimizer** | **A / R** | C | C | I | I | C |
| **Autonomous NPC Crowd Dynamics Engine** | **A / R** | I | C | C | C | I |
| **"Mitra" Conversational Crisis Bot** | C | C | **A / R** | C | I | C |
| **Campus EOC Multi-Agency Dashboard** | C | C | C | **A / R** | I | C |
| **End-to-End System Integration & Testing** | R | R | R | R | R | **A** |
| **SIH Pitch Deck & Demo Visual Production** | **A / R** | C | C | C | R | **A / R** |

*Legend: **A** = Accountable (Final Owner), **R** = Responsible (Doer), **C** = Consulted, **I** = Informed.*

---

## 3. Day-by-Day Sprint Roadmap (August 23 - September 9, 2026)

```text
+--------------------------------------------------------------------------------------------------+
|                                    4-SPRINT TIMELINE OVERVIEW                                    |
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
|   [ SPRINT 1: FOUNDATION & DESIGN ] (Aug 23 - Aug 27)                                            |
|   • UI/UX Design Tokens & Wireframes, Next.js 16.3.2 + FastAPI Scaffolding, PostGIS, NDMA Ingestion |
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

#### Sprint 1: Foundations, Design & Architecture (Aug 23 - Aug 27)

- **Day 1 (Aug 23):** Repository initialization, CI/CD setup, Next.js 16.3.2 + FastAPI scaffolding, CSS design tokens & Figma theme (Dheeraj, I.Sravya, Venkataraman).
- **Day 2 (Aug 24):** Database ERD implementation in PostgreSQL 16 + PostGIS extension; Redis cache configuration (Venkataraman).
- **Day 3 (Aug 25):** Ingest NDMA/NFPA curriculum data and question bank into structured JSON fixtures (Trinayani, Rahul).
- **Day 4 (Aug 26):** Basic 2D floorplan coordinate schema and graph node adjacency definitions (Venkataraman, Dheeraj).
- **Day 5 (Aug 27):** Sprint 1 Review & Architecture sync: Verify all local development environments run seamlessly.

## 3. Sprint Timeline & Day-by-Day Execution Matrix

The 18-day sprint leads up to the target MVP milestone on September 9th:

```
[SPRINT 1: CORE DUAL-ENGINE] ──► [SPRINT 2: SIMULATION & GAMING] ──► [SPRINT 3: EOC & AI SUITE] ──► [SPRINT 4: HARDENING]
      (Days 1 - 5)                     (Days 6 - 10)                       (Days 11 - 14)               (Days 15 - 18)
```

#### Sprint 1: Core Dual-Engine Scaffolding (Aug 23 - Aug 27)

- **Day 1 (Aug 23):** Establish mono-repo structure, PWA Next.js scaffolding, FastAPI backend, and Alembic migrations (Venkataraman, Dheeraj).
- **Day 2 (Aug 24):** Ingest 6-floor campus building CAD blueprints into GeoJSON and floorplan schemas (Rahul, Trinayani).
- **Day 3 (Aug 25):** Implement UI design system with accessible contrast tokens and high-end typography (Dheeraj, I.Sravya).
- **Day 4 (Aug 26):** Set up 5-Tier Age Curriculum database and initial lesson JSON files (I.Sravya, Trinayani).
- **Day 5 (Aug 27):** Complete Sprint 1 code review and establish CI/CD pipeline (Venkataraman, Rahul).

#### Sprint 2: 3D Simulation & Gamification (Aug 28 - Sep 1)

- **Day 6 (Aug 28):** Build Three.js 3D building viewer with multi-floor level switcher (Manha, Dheeraj).
- **Day 7 (Aug 29):** Implement hazard particle shaders (flame, smoke, gas, structural debris) (Manha, Dheeraj).
- **Day 8 (Aug 30):** Develop student player movement, collision detection, and stamina/panic meter (Manha, I.Sravya).
- **Day 9 (Aug 31):** Implement Tier 1-3 micro-learning games (PASS extinguisher sequence, hazard sorting) (I.Sravya, Trinayani).
- **Day 10 (Sep 1):** Connect WebSocket telemetry streaming for live student drill coordinates (Venkataraman, Manha).

#### Sprint 3: Command Hub & AI Frontier Systems (Sep 2 - Sep 5)

- **Day 11 (Sep 2):** Develop Campus EOC Dashboard with real-time floor status visualizer and QR scanner (I.Sravya, Dheeraj).
- **Day 12 (Sep 3):** Implement CAP v1.2 SACHET alert parser and geofenced automatic emergency mode switch (Venkataraman, Rahul).
- **Day 13 (Sep 4):** Integrate "Mitra" multilingual crisis chatbot and dynamic A* evacuation pathfinding (Manha, Dheeraj).
- **Day 14 (Sep 5):** Multi-tenant role authentication test (Admin, Warden, Student, NDRF responder) (Venkataraman, I.Sravya).

#### Sprint 4: Hardening, Polish & MVP Submission (Sep 6 - Sep 9)

- **Day 15 (Sep 6):** End-to-end full system drill test: Simulate compound earthquake + fire on 4th floor with 100 virtual students.
- **Day 16 (Sep 7):** Offline PWA stress test: Simulate complete network disconnect; verify cached lessons and WebRTC mesh sync.
- **Day 17 (Sep 8):** Record 3-minute high-impact video demonstration, produce SIH presentation deck, and finalize documentation (Dheeraj, Rahul).
- **Day 18 (Sep 9):** **FINAL SIH SUBMISSION & CODE FREEZE.**

---
*Next Section: [07_DYNAMIC_SCENARIOS_AND_DECISION_MATRICES.md](./07_DYNAMIC_SCENARIOS_AND_DECISION_MATRICES.md)*
