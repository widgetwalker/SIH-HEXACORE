# Gamified Disaster Preparedness & Response Education System (SIH MVP)

[![Smart India Hackathon](https://img.shields.io/badge/SIH-2024%2F2026-orange.svg)](https://sih.gov.in)
[![Target MVP Date](https://img.shields.io/badge/Target%20MVP-September%209th-green.svg)]()
[![Architecture](https://img.shields.io/badge/Architecture-Next.js%2015%20%7C%20FastAPI%20%7C%20Three.js%20%7C%20PostGIS-blue.svg)]()
[![Compliance](https://img.shields.io/badge/Compliance-NDMA%20%7C%20NFPA%20%7C%20CAP%20v1.2-red.svg)]()

> **Project Title:** Gamified Disaster Preparedness and Response Education System for Schools and Colleges  
> **Core Objective:** A unified dual-engine platform combining pedagogical education, immersive 3D/2.5D simulation gaming, and real-time disaster tracking with multi-agency incident command (NDMA SACHET, NDRF, SDMA, Campus Wardens).

---

## 📚 Master Documentation Index (in `/docs/`)

| Section Document | Key Topics Covered |
| :--- | :--- |
| **[01. Executive Summary & Vision](file:///home/widget/REQUIREMENTS/sih/docs/01_EXECUTIVE_SUMMARY_AND_VISION.md)** | Problem Statement, India Campus Vulnerabilities, Strategic Triad, KPIs & SIH Hackathon Evaluation Edge. |
| **[02. Feature Specification Duality](file:///home/widget/REQUIREMENTS/sih/docs/02_FEATURE_SPECIFICATION_DUALITY.md)** | Pedagogical Learning Engine (5 Age Tiers: 5–18+), Immersive 3D Simulation Engine, Unified Multi-Agency EOC Command Hub. |
| **[03. Technical Architecture & Tech Stack](file:///home/widget/REQUIREMENTS/sih/docs/03_TECHNICAL_ARCHITECTURE_AND_TECH_STACK.md)** | Web App (PWA) vs Website Rationale, Next.js 15, Three.js / WebGPU, FastAPI, PostGIS, Sub-50ms WebSockets, Offline-First PWA. |
| **[04. Frontier AI / ML Systems](file:///home/widget/REQUIREMENTS/sih/docs/04_FRONTIER_AI_ML_SYSTEMS.md)** | GenAI Dynamic Scenario Generator, GNN Evacuation Routing, CV "Drop-Cover-Hold" Posture Validator, "Mitra" Crisis NLP Bot, Adaptive DDA. |
| **[05. Knowledge Graph & Ontology](file:///home/widget/REQUIREMENTS/sih/docs/05_KNOWLEDGE_GRAPH_AND_ONTOLOGY.md)** | Master Domain Ontology, Semantic Triples, Ground-5th Floor Spatial Knowledge Graph, JSON-LD Schemas & Cypher Queries. |
| **[06. Team Role Allocation & Sprint Roadmap](file:///home/widget/REQUIREMENTS/sih/docs/06_ROLE_ALLOCATION_AND_SPRINT_ROADMAP.md)** | 6-Member Work Breakdown (Dheeraj, Venkataraman C.V, Manha AK, I.Sravya, Trinayani D, Rahul Nayak), RACI Matrix & Day-by-Day Sprint to Sept 9. |
| **[07. Dynamic Scenarios & Decision Matrices](file:///home/widget/REQUIREMENTS/sih/docs/07_DYNAMIC_SCENARIOS_AND_DECISION_MATRICES.md)** | Universal Prohibitions, Floor-by-Floor (Gnd-5th) Rules, Dynamic Fire & Natural Hazards, Compound Disasters, Exit Decision Trees & NDMA/NFPA References. |

---

## 🏛️ High-Level System Architecture

```
+--------------------------------------------------------------------------------------------------+
|                                  SYSTEM ARCHITECTURE TOPOLOGY                                    |
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
|   [ CLIENT LAYER (PWA / WEB APP) ]                                                               |
|   • Next.js 15 + React 19 UI Portal                                                             |
|   • Three.js / React Three Fiber (3D WebGPU Simulation Canvas)                                   |
|   • MapLibre GL / Canvas Campus EOC Dashboard                                                    |
|   • Workbox 7 Offline Service Worker + IndexedDB                                                 |
|                                       │                                                          |
|                      Sub-50ms WebSockets + REST API                                              |
|                                       ▼                                                          |
|   [ REAL-TIME TRANSPORT & GATEWAY LAYER ]                                                        |
|   • FastAPI Async REST Service (Python 3.12)                                                     |
|   • WebSocket Hub (python-socketio + Redis Pub/Sub)                                             |
|   • CAP v1.2 Ingestion Engine (NDMA SACHET / IMD Webhook & Poller)                               |
|                     ┌─────────────────┴─────────────────┐                                        |
|                     ▼                                   ▼                                        |
|   [ DATA & CACHING LAYER ]               [ FRONTIER AI / ML SERVICES ]                           |
|   • PostgreSQL 16 + PostGIS 3.4          • GenAI Dynamic Scenario Synthesizer                    |
|   • Redis 7 In-Memory Cache              • GNN Dynamic A* Evacuation Pathfinding                 |
|   • IndexedDB Local Client Storage       • Edge CV MediaPipe Posture Validator                   |
|                                          • "Mitra" Crisis Multilingual Voice/Text Bot            |
|                                                                                                  |
+--------------------------------------------------------------------------------------------------+
```

---

## 👥 Core Development Team & Roles

| Member | Primary Role | Core Ownership Area |
| :--- | :--- | :--- |
| **Dheeraj** | **Lead AI & Product Design Engineer (AI + Design)** | GenAI Scenario Synthesis, GNN Dynamic Pathfinding, CV Posture Validator, UI/UX Design System, 3D Level Aesthetics & Pitch Visuals |
| **Venkataraman C.V** | **Lead Backend & Cloud Architect** | FastAPI Async Services, PostGIS Spatial Schema, WebSocket Telemetry, CAP/SACHET Live Feed, Redis Pub/Sub |
| **Manha AK** | **AI & Frontend Full-Stack Engineer** | Three.js / React Three Fiber 3D Simulation Canvas, Smoke/Fire GLSL Shaders, "Mitra" AI Crisis Chatbot UI |
| **I.Sravya** | **Lead Frontend & PWA Engineer** | Next.js 15 PWA Core, Student Learning Portal, Campus EOC Incident Command Hub, QR Headcount Scanner |
| **Trinayani D** | **Lead Pedagogy & Research Specialist** | NDMA/NFPA Curriculum Codification, 5-Tier Age Progression Lessons, Question Bank, Certification Rubrics |
| **Rahul Nayak** | **Lead Multi-Agency & Systems Specialist** | Multi-Agency SOPs (NDRF, SDMA, Fire), CAP Protocol Standards, Exit Decision Matrices, SIH Pitch & Demo |

---

## ⏱️ Target Sprint Timeline (August 23 – September 9, 2026)

- **Sprint 1 (Aug 23 – Aug 27):** UI/UX Design System, Scaffolding, Data Schemas, PostGIS Database, NDMA Ingestion.
- **Sprint 2 (Aug 28 – Sep 1):** Three.js 3D Simulator, FastAPI Gateway, PWA Student Portal, AI Baselines.
- **Sprint 3 (Sep 2 – Sep 5):** Multi-Agency EOC Command Dashboard, CAP/SACHET Alert Ingestion, "Mitra" AI Bot.
- **Sprint 4 (Sep 6 – Sep 8):** End-to-End Integration, Offline PWA Testing, Load Testing, Pitch Video & Slide Deck.
- **September 9th, 2026:** **Final MVP Submission & Code Freeze.**

---
*Maintained as a living architecture blueprint for Smart India Hackathon 2024/2026 in `/docs/`.*
