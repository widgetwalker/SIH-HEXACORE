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

## 1. Individual Member Work Breakdown Structure (WBS)

### 1. Dheeraj - AI + Design

- **Generative Scenario Engine:** Build the LLM structured scenario generation pipeline with Pydantic JSON schemas, outputting realistic dynamic disaster scenarios (hazards, cascading triggers, room blockages).
- **GNN & Dynamic Pathfinding:** Implement real-time dynamic graph routing (Dynamic A* / Dijkstra with hazard weight penalty function) for sub-15ms recalculation during corridor blockages.
- **Computer Vision Posture Evaluator:** Implement edge MediaPipe Pose / YOLOv8-pose skeleton tracker for "Drop, Cover, Hold On" webcam posture compliance during live drills.
- **Adaptive DDA Engine:** Model student panic telemetry and reaction latency to tailor dynamic simulation difficulty.
- **UI/UX Design System & Visual Assets:** Lead the visual design identity, Figma design tokens, HUD overlay styling (Panic Meter, Oxygen gauge, Heart-rate animation), 3D level layout aesthetics, badge artwork, and visual slides for the SIH submission deck.

### 2. Venkataraman C.V - Backend

- **FastAPI Microservices:** Scaffold asynchronous REST endpoints for authentication, student progress, campus registry, and drill orchestration.
- **Real-Time WebSocket Gateway:** Build high-throughput Socket.io / Redis Pub-Sub server to broadcast sub-50ms hazard state changes to 5,000+ concurrent clients.
- **Spatial Database (PostGIS):** Design relational & spatial schemas for campus blueprints, floor corridors, geofenced hazard zones (`ST_DWithin`), and student location records.
- **CAP / SACHET Ingestion Pipeline:** Create automated polling & webhook worker to ingest NDMA SACHET / IMD CAP v1.2 XML/JSON emergency feeds.
- **Security & RBAC:** Implement JWT authentication with role-based policies (Student, Warden, Admin, NDRF, Fire/Police).

### 3. Manha AK - AI + Frontend

- **3D Simulation Canvas (Three.js / React Three Fiber):** Build procedural 3D school building renderer (Ground to 5th Floor), camera controls, and character movement physics (`@react-three/rapier`).
- **Hazard Particle Shaders:** Write custom GLSL shaders for realistic volumetric smoke dissipation, fire propagation, and thermal warning zones.
- **"Mitra" AI Crisis Companion:** Integrate speech-to-text / text-to-speech conversational frontend with low-latency AI crisis counseling agent for trapped students.
- **Canvas-to-State Bridge:** Connect real-time WebSocket telemetry to Three.js scene state for dynamic multiplayer drill rendering.

### 4. I.Sravya - Frontend

- **PWA Architecture:** Scaffold Next.js 15 App Router structure, Workbox service worker caching strategy, and IndexedDB offline lesson persistence.
- **Student Learning & Gamification Portal:** Build responsive UI for age-tiered curriculum, PASS fire extinguisher interactive module, badge showcase, and live leaderboards.
- **Campus EOC & Multi-Agency Dashboard:** Build high-density command visualizer displaying live floor plans, real-time student headcount tally, and hazard heatmaps.
- **Headcount QR/NFC Scanner:** Develop camera-based QR code scanner and manual roll-call interface for floor wardens at assembly zones.

### 5. Trinayani D - Research

- **NDMA & International Standard Mapping:** Codify NDMA School Safety Guidelines, NFPA 10/101 fire codes, OSHA lab safety rules, and CDC heatwave standards into structured lesson matrices.
- **Age-Tiered Educational Content:** Author interactive lessons, animations scripts, and storylines across all 5 age cohorts (5-7, 8-10, 11-13, 14-17, 18+).
- **Comprehensive Question & Scenario Bank:** Develop 150+ validated decision-tree questions, hazard-spotting challenges, and extinguisher identification puzzles.
- **Educational Impact Metrics:** Formulate pre-drill vs post-drill retention rubrics and certification scoring benchmarks.

### 6. Rahul Nayak - Research

- **Multi-Agency Command SOPs:** Map real-world emergency response workflows between School Administration, NDRF, SDMA, Fire Stations, and Ambulance services.
- **CAP v1.2 Protocol Schema Verification:** Validate alert data formats and geofencing parameters against official NDMA SACHET standards.
- **Decision Trees & Floor Hazard Verification:** Verify and stress-test all floor-by-floor (Ground to 5th) evacuation matrices and compound disaster rules.
- **SIH Hackathon Pitch & Documentation:** Lead the creation of the SIH submission deck, executive presentation, live demo script, and system audit reports.

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