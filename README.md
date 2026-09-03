# Gamified Disaster Preparedness & Response Education System (SIH MVP)

[![Smart India Hackathon](https://img.shields.io/badge/SIH-2024%2F2026-orange.svg)](https://sih.gov.in)
[![Target MVP Date](https://img.shields.io/badge/Target%20MVP-September%209th-green.svg)]()
[![Architecture](https://img.shields.io/badge/Architecture-Next.js%2016%20%7C%20Three.js%20%7C%20FastAPI-blue.svg)]()
[![Compliance](https://img.shields.io/badge/Compliance-NDMA%20%7C%20NFPA%20%7C%20CAP%20v1.2-red.svg)]()

> **Project Title:** Gamified Disaster Preparedness and Response Education System for Schools and Colleges  
> **Core Objective:** A unified dual-engine platform combining pedagogical education, immersive 3D simulation gaming, and real-time disaster tracking with multi-agency incident command (NDMA SACHET, NDRF, SDMA, Campus Wardens).

---

## ⚡ Quick Start & Setup Instructions

The frontend is fully self-contained: **no database, no backend, and no API keys are required** to install, build, or run it. Everything in `/`, `/learn`, `/simulate`, `/command`, and `/admin` works out of the box on a bare clone — verified with a clean `npm run build` and zero environment variables set.

### 1. Prerequisites
- **Node.js**: v18.17+ or v20+ recommended (`node -v`)
- **npm**: v9+ (`npm -v`)
- **Git**

### 2. Clone and run

**macOS / Linux / Git Bash:**
```bash
git clone https://github.com/widgetwalker/SIH-HEXACORE.git && cd SIH-HEXACORE/frontend && npm install && npm run dev
```

**Windows PowerShell** (`&&` isn't a valid separator there — use `;`, or just run each line separately):
```powershell
git clone https://github.com/widgetwalker/SIH-HEXACORE.git; cd SIH-HEXACORE/frontend; npm install; npm run dev
```

Either way this installs every dependency and starts the dev server (Turbopack) at **`http://localhost:3000`**. If you already cloned it, just run the last two commands from inside `frontend/` — and make sure you're actually *inside* `frontend/` (where `package.json` lives) before running any `npm` command, not the repo root.

### 3. Production Build & Verification
```bash
npm run build
npm run start
```
This must stay green with zero TypeScript/build errors — that's the actual CI/submission bar, not just `npm run dev` working.

### 4. Optional: enabling Mitra (AI crisis companion)
Everything works without this. The only feature that needs it is Mitra's chat replies inside `/simulate` — without a key it just shows "Mitra is offline right now" instead of crashing anything. To enable it, create `frontend/.env.local`:
```bash
GEMINI_API_KEY=your-key-here
```

---

## 🌐 Application Routes & Core Pages

| Route | Page Name | Core Functionality |
| :--- | :--- | :--- |
| **`/`** | **Landing Experience** | Immersive 3D wireframe campus tower, interactive hazard selector, pillars showcase, and emergency live CTA. |
| **`/learn`** | **Pedagogical Portal** | 5 Age-Tiered safety curriculums (Explorers to Wardens), interactive module cards, progress gauges, and badges. |
| **`/simulate`** | **3D Evacuation Drill** | Playable Three.js WebGL simulation with dynamic fire spread, smoke oxygen depletion, panic cognitive freeze, door firebreaks, NPC crowd, and synthesized WebAudio. |
| **`/command`** | **Incident Command Hub** | Live campus blueprint, real-time floor matrix (safe/trapped/missing), CAP alert feed, agency pings, and emergency action bar. |
| **`/admin`** | **Command Analytics** | Aggregated KPI cards, canvas route and casualty heatmap, and recent drill telemetry logs. |

---

## 🎮 Simulation Controls (in `/simulate`)

| Key | Action |
| :--- | :--- |
| <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd> / <kbd>Arrows</kbd> | Move Cadet |
| <kbd>SHIFT</kbd> | Crawl low under smoke layer to preserve oxygen |
| <kbd>B</kbd> | Hold to Box-Breathe (4s in, 4s hold, 4s out) to recover panic |
| *Doors* | Push through amber doors (they act as firebreaks until opened) |
| *Beacon* | Reach any green assembly beacon to successfully evacuate |

---

## 📚 Master Documentation Index (in `/docs/`)

| Document | Key Topics Covered |
| :--- | :--- |
| **[01. Executive Summary & Vision](./docs/01_EXECUTIVE_SUMMARY_AND_VISION.md)** | Problem Statement, India Campus Vulnerabilities, Strategic Triad, KPIs & SIH Hackathon Evaluation Edge. |
| **[02. Feature Specification Duality](./docs/02_FEATURE_SPECIFICATION_DUALITY.md)** | Pedagogical Learning Engine (5 Age Tiers: 5-18+), Immersive 3D Simulation Engine, Unified Multi-Agency EOC Command Hub. |
| **[03. Technical Architecture & Tech Stack](./docs/03_TECHNICAL_ARCHITECTURE_AND_TECH_STACK.md)** | Web App (PWA) vs Website Rationale, Next.js, Three.js / WebGPU, FastAPI, PostGIS, Sub-50ms WebSockets, Offline PWA. |
| **[04. Frontier AI / ML Systems](./docs/04_FRONTIER_AI_ML_SYSTEMS.md)** | GenAI Dynamic Scenario Generator, GNN Evacuation Routing, CV "Drop-Cover-Hold" Posture Validator, "Mitra" Crisis NLP Bot. |
| **[05. Knowledge Graph & Ontology](./docs/05_KNOWLEDGE_GRAPH_AND_ONTOLOGY.md)** | Master Domain Ontology, Semantic Triples, Ground-5th Floor Spatial Knowledge Graph, JSON-LD Schemas. |
| **[06. Team Role Allocation & Roadmap](./docs/06_ROLE_ALLOCATION_AND_SPRINT_ROADMAP.md)** | 6-Member Work Breakdown, RACI Matrix & Day-by-Day Sprint to Sept 9. |
| **[07. Dynamic Scenarios & Decision Matrices](./docs/07_DYNAMIC_SCENARIOS_AND_DECISION_MATRICES.md)** | Universal Prohibitions, Floor-by-Floor (Gnd-5th) Rules, Dynamic Fire & Hazards, Compound Disasters, Exit Trees. |
| **[08. Current Implementation Status](./docs/08_CURRENT_IMPLEMENTATION_STATUS.md)** | **Live Ground-Truth Status**: 5 live routes, Three.js drill engine, 4 data-driven scenarios, telemetry, admin dashboard, next steps. |

---

## 👥 Core Development Team & Roles

| Member | Role | Core Ownership Area |
| :--- | :--- | :--- |
| **I.Sravya** | **Frontend Dev 1** | Touch & mobile virtual joystick, pedagogical mini-games, PWA offline service worker |
| **Manha AK** | **Frontend Dev 2** | Command hub real-time telemetry, 3D multi-floor visualizer, voice Mitra AI integration |
| **Venkataraman C.V (Venkat)** | **Backend Dev** | FastAPI async services, PostgreSQL/PostGIS schemas, WebSocket session hub, NDMA SACHET CAP v1.2 poller |
| **Trinayani D** | **Research & Curriculum** | NDMA/NFPA curriculum codification, 5-tier age progression lessons, question bank, rubrics |
| **Rahul Nayak** | **Research & Protocol** | Multi-agency SOPs (NDRF, SDMA, Fire), CAP protocol standards, exit decision matrices, pitch deck |

---

## ⏱️ Target Sprint Timeline (August 23 - September 9, 2026)

- **Sprint 1 (Aug 23 - Aug 27):** UI/UX Foundation, 3D Simulation Engine, Data-Driven Scenarios, Admin Analytics, Telemetry.
- **Sprint 2 (Aug 28 - Sep 1):** Touch Joysticks, FastAPI Backend Gateway, PostgreSQL Persistence, Interactive Learn Games.
- **Sprint 3 (Sep 2 - Sep 5):** Multi-Agency EOC Command Dashboard, WebSocket Broadcast, CAP/SACHET Alert Ingestion, Mitra Voice.
- **Sprint 4 (Sep 6 - Sep 8):** End-to-End Integration, Offline PWA Testing, Load Testing, Pitch Video & Slide Deck.
- **September 9th, 2026:** **Final MVP Submission & Code Freeze.**
