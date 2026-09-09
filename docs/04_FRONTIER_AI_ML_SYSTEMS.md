# 04. Frontier AI/ML Systems & Innovations

> **📋 Implementation & Vision Document:**  
> This document tracks both the **active AI & algorithmic systems currently running in the codebase** and the **Next-Gen Frontier AI/ML models & predictive architectures** designed for the platform's national deployment and SIH hackathon evaluation.

---

## 🏛️ Executive Summary: The AI/ML Ecosystem

To lead in technical innovation during the Smart India Hackathon (SIH) evaluation, the platform departs from static memorization, replacing it with an intelligent, adaptive, and real-time responsive disaster preparedness ecosystem.

```
+---------------------------------------------------------------------------------------------------------------+
|                                            FRONTIER AI / ML SUITE                                             |
+---------------------------------------------------------------------------------------------------------------+
|                                                                                                               |
|   1. GENERATIVE SCENARIO SYNTHESIZER (Gemini 3.6 Flash) ──► Dynamic procedural disaster blueprints (JSON)     |
|   2. DYNAMIC A* GRAPH ROUTE OPTIMIZER                   ──► Sub-15ms escape recalculation under active hazard  |
|   3. "MITRA" CRISIS NLP & VOICE COMPANION               ──► Context-grounded triage & voice coaching (Gemini)  |
|   4. AUTONOMOUS NPC CROWD SIMULATOR                     ──► BFS distance-field & Boids flocking agents         |
|   5. BEHAVIORAL TELEMETRY & ROOT-CAUSE DEBRIEF          ──► 4Hz panic, breathing & smoke discipline analytics  |
|   6. POSTGIS GEO-SPATIAL THREAT CORRELATOR              ──► Real-time NDMA SACHET / USGS campus geofence match |
|   7. NEXT-HORIZON PREDICTIVE MODELS (PINN, GNN, MARL)   ──► Smoke dispersion, collapse risk, stampede forecast |
|                                                                                                               |
+---------------------------------------------------------------------------------------------------------------+
```

---

## ⚡ Matrix: Implemented vs. Roadmap AI Capabilities

| Capability | Module / Layer | Model / Algorithm | Active in Codebase? | Implementation Reference |
| :--- | :--- | :--- | :--- | :--- |
| **Procedural Scenario Generation** | Simulation Backend | **Google Gemini 3.6 Flash** + Structured JSON Schema | ✅ **Live** | [`backend/app/api/v1/scenarios.py`](../backend/app/api/v1/scenarios.py) |
| **Dynamic Evacuation Routing** | Routing Engine | **Modified A\* with Hazard Penalties** | ✅ **Live (<15ms)** | [`backend/app/services/pathfinder.py`](../backend/app/services/pathfinder.py) |
| **Conversational Crisis Triage** | Mitra Companion | **Gemini 1.5 Flash** + Local Rule Engine | ✅ **Live** | [`backend/app/api/v1/mitra.py`](../backend/app/api/v1/mitra.py) |
| **Tactical Voice Alert Dispatch** | Audio FX Layer | **Web Speech API** + Synthesized WebAudio | ✅ **Live** | [`frontend/src/components/shared/speech.ts`](../frontend/src/components/shared/speech.ts) |
| **Autonomous NPC Crowd Dynamics** | Simulation Engine | **BFS Flow-Field + Boids Separation** | ✅ **Live** | [`frontend/src/components/simulate/game/EvacuationGame.tsx`](../frontend/src/components/simulate/game/EvacuationGame.tsx) |
| **Cellular Automata Hazards** | Physics Engine | **2D Grid Cellular Automata** with Door Firebreaks | ✅ **Live** | [`frontend/src/components/simulate/game/EvacuationGame.tsx`](../frontend/src/components/simulate/game/EvacuationGame.tsx) |
| **Diagnostic Debrief Engine** | Telemetry / Analytics | **Rule-based Diagnostic Classifier** | ✅ **Live** | [`frontend/src/components/simulate/game/telemetry.ts`](../frontend/src/components/simulate/game/telemetry.ts) |
| **Geo-Spatial Alert Matching** | Command Center | **PostGIS Geofencing & Intersects** | ✅ **Live** | [`backend/app/services/cap_ingestion.py`](../backend/app/services/cap_ingestion.py) |
| **Physical Posture Verification** | Edge Vision Minigames | **MediaPipe Pose + YOLOv8-pose Wasm** | 🟡 *Spec / Roadmap* | Described in §3 below |
| **Physics-Informed Smoke Spread** | Environmental Prediction| **PINN / Fourier Neural Operator (FNO)** | 🚀 *Next-Gen Proposal* | Described in §6.1 below |
| **Progressive Structural Collapse**| Sensor Analytics | **Graph Neural Network (GNN) + XGBoost**| 🚀 *Next-Gen Proposal* | Described in §6.2 below |
| **Stampede & Choke Prediction** | Crowd Intelligence | **Multi-Agent RL (MARL - PPO)** | 🚀 *Next-Gen Proposal* | Described in §6.4 below |
| **Voice Acoustic Stress Scorer** | Mitra NLP | **Wav2Vec 2.0 / HuBERT Acoustic Biometrics** | 🚀 *Next-Gen Proposal* | Described in §6.5 below |
| **Autonomous Incident Commander** | EOC Command Deck | **LangGraph Multi-Agent Orchestration** | 🚀 *Next-Gen Proposal* | Described in §6.6 below |

---

## 1. Generative Scenario Synthesis Engine (GenAI)

### 1.1 Objective & Architecture
Traditional disaster drills fail because students memorize static paths (e.g., "always run down Staircase A"). The **Generative Scenario Engine** dynamically generates millions of unique, realistic, and unscripted compound disaster scenarios using **Gemini 3.6 Flash** with strict JSON schema enforcement.

```
+--------------------------------------------------------------------------------------------------+
|                              GENERATIVE SCENARIO PIPELINE                                        |
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
|   [ INPUT METADATA ]                                                                             |
|   • Hazard Type (FIRE, EARTHQUAKE, CHEMICAL SPILL, FLOOD)                                        |
|   • Campus Floor Topology (16 rows x 24 cols)                                                    |
|   • Target Difficulty (1 to 5) & Seed Integer                                                    |
|                                       │                                                          |
|                                       ▼                                                          |
|   [ GEMINI 3.6 FLASH + STRUCTURED JSON SCHEMA ]                                                  |
|   • Generates dynamic ignition points & spreading smoke vectors                                  |
|   • Enforces NDMA & NFPA life-safety constraints (#=Wall, .=Corridor, D=Door, P=Start, E=Exit)  |
|   • Embeds timed compound corridor collapses (blockages with warning countdowns)                 |
|                                       │                                                          |
|                                       ▼                                                          |
|   [ AIR-GAP / OFFLINE FALLBACK ]                                                                 |
|   • Linear Congruential Generator (LCG) fallback ensures zero-crash offline execution             |
|                                                                                                  |
+--------------------------------------------------------------------------------------------------+
```

### 1.2 Live Implementation Details
- **Endpoint:** `POST /api/v1/scenarios/generate` in [`backend/app/api/v1/scenarios.py`](../backend/app/api/v1/scenarios.py).
- **Prompt & Schema Enforcement:** Gemini outputs valid JSON strictly conforming to the `Scenario` Pydantic model (`timeLimit`, `spreadInterval`, `spreadChance`, `fogDensity`, `colors`, `floors`, `blockages`).
- **Compound Obstacles:** If difficulty > 2, the LLM injects timed blockages (e.g. structural failure at T+40s with a pre-warning groaning sound at T+30s) forcing mid-drill re-routing.

---

## 2. Graph Neural Network (GNN) & Dynamic A* Evacuation Routing

### 2.1 Problem & Mathematical Formulation
During an active disaster, static exit signs lead people directly into lethal traps (e.g., smoke-filled corridors or collapsed stairs). Our **Dynamic Pathfinding Engine** models the building as a time-varying weighted graph $G_t = (V, E, W_t)$ where:
- **Vertices ($V$):** Rooms, hallway intersections, staircases, exits, assembly areas.
- **Edges ($E$):** Corridors, doors, stairs, windows.
- **Dynamic Edge Cost Function:**
  $$W_t(u, v) = \text{Dist}(u, v) \times \left[ 1 + \alpha \cdot \text{Smoke}(v, t) + \beta \cdot \text{Heat}(v, t) + \gamma \cdot \text{Crowd}(v, t) + \frac{\delta}{\text{Integrity}(v, t)} \right]$$
  *(Where $\text{Fire} = \infty$, rendering burned cells strictly impassable)*

```
[ Room 301 ] ──► [ Hallway 3 ] ──┬──► [ Stair A: BLOCKED BY SMOKE ❌ ] ──► (Lethal Trap)
                                 │
                                 └──► [ Stair B: CLEAR & SAFE ✅ ]    ──► [ Ground Exit ] ──► [ SAFE ZONE ]
```

### 2.2 Live Implementation Details
- **File:** [`backend/app/services/pathfinder.py`](../backend/app/services/pathfinder.py).
- **Algorithm:** Modified multi-floor A* with dynamic hazard matrices.
- **Performance:** First path calculation in **< 5ms**, dynamic re-route in **< 15ms** across a 25×14 grid × 6 floors.
- **Heuristic:** 3D Manhattan distance to nearest safe exit + vertical staircase height penalty ($1.5\times$).

---

## 3. Computer Vision (CV) Drill Compliance & Posture Validator

### 3.1 Edge-Based "Drop, Cover, Hold On" Pose Verification
During classroom physical drills, lightweight edge Computer Vision (MediaPipe Pose + YOLOv8-pose via WebAssembly in the browser) verifies physical drill posture in real time with **zero server video transmission (100% privacy-compliant)**.

```
+--------------------------------------------------------------------------------------------------+
|                            COMPUTER VISION POSTURE PIPELINE                                      |
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
|   1. Video Stream ──► MediaPipe 33-Point Skeletal Landmark Tracker (Browser Wasm)                |
|                                                                                                  |
|   2. Compute Keypoint Biometrics:                                                                |
|      • Knee Flexion Angle: Drop below 40% standing height within 2.5 seconds                     |
|      • Torso / Neck Angle: Hands positioned over posterior cervical spine                        |
|      • Anchor Proximity: Hand keypoints anchored to sturdy table leg                             |
|                                                                                                  |
|   3. Instant HUD Feedback:                                                                       |
|      • [ COMPLIANT ✅ ]  ➔ "Perfect Drop, Cover & Hold! Score: 100/100"                          |
|      • [ WARNING   ⚠️ ]  ➔ "Alert: Neck uncovered! Protect cervical spine immediately."          |
|                                                                                                  |
+--------------------------------------------------------------------------------------------------+
```

---

## 4. "Mitra" - Conversational Crisis Companion (Multilingual NLP)

### 4.1 Crisis Psychological Support & Triage Chatbot
When students are isolated or trapped during a drill or real disaster, panic induces cognitive freeze and erratic actions. **"Mitra" (Friend)** is an ultra-low-latency, context-aware conversational agent embedded directly into the simulation and mobile PWA.

```
+--------------------------------------------------------------------------------------------------+
|                                "MITRA" CRISIS TRIAGE INTERACTION                                 |
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
|   STUDENT (Panicked):                                                                            |
|   "I'm trapped on the 4th floor, smoke is coming under the door, I can't breathe!"               |
|                                                                                                  |
|   "MITRA" AI (Calm, Direct, Authoritative Voice):                                                |
|   "Stay calm, Rahul. I have logged your location in Room 402, Floor 4.                           |
|    DO NOT open that door. Put a damp cloth or jacket at the bottom gap.                          |
|    Sit on the floor where air is clean. Responders have your exact room location."               |
|                                                                                                  |
|   AUTOMATED EOC DISPATCH TRIGGER:                                                                |
|   ➔ Priority Red Manifest generated: Student ID #4089 | Room 402 | Smoke Trapped Confirmed       |
|                                                                                                  |
+--------------------------------------------------------------------------------------------------+
```

### 4.2 Live Implementation Details
- **File:** [`backend/app/api/v1/mitra.py`](../backend/app/api/v1/mitra.py) (`POST /api/v1/mitra/chat`).
- **Model:** **Gemini 1.5 Flash** with strict anti-hallucination system prompt:
  - Ingests live telemetry context (oxygen %, panic %, elapsed time, crouching state, box-breathing state).
  - Constrained strictly to NDMA/NFPA/NDRF protocols.
  - Length-bounded (1-2 sentences maximum) to minimize cognitive burden on panicked students.
  - **Zero-Dependency Fallback:** When `GEMINI_API_KEY` is not set, a local rule-based safety expert system automatically steps in with zero latency.
- **Voice Verbalization:** Web Speech API synthesis provides spoken coaching in an authoritative, calm dispatcher cadence.

---

## 5. Adaptive Learning & Dynamic Difficulty Adjustment (DDA)

### 5.1 Personalized Pedagogical Reinforcement
The platform tracks each student's response patterns across micro-learning quizzes and simulation runs:

```
[ Student Drill Telemetry ] (Reaction time, extinguisher errors, panic spikes)
             │
             ▼
[ Adaptive Learning Profiler ] ──► Identifies Knowledge Gaps
             │
             ├───► Confused on Extinguishers ──► Serves 90-sec Micro-Lesson on CO2 vs Water
             │
             └───► High Panic Under Smoke    ──► Adjusts next 3D sim with gradual smoke build-up
```

---

## 🚀 6. Next-Horizon AI Innovations: Models, Predictions & Advanced ML

To push the state of the art for smart disaster resilience, the following frontier models and predictive algorithms are architected for integration:

```
+---------------------------------------------------------------------------------------------------------------+
|                                    NEXT-HORIZON PREDICTIVE & ML ARCHITECTURE                                   |
+---------------------------------------------------------------------------------------------------------------+
|                                                                                                               |
|  [ 1. PINN / FNO HAZARD SURROGATE ]    [ 2. GNN SEISMIC VULNERABILITY ]    [ 3. EDGE CV THERMAL SEARCH ]      |
|  • Navier-Stokes Smoke Dispersion       • Pillar-Beam Stress Graph          • Low-light YOLOv9 Smoke Vision    |
|  • Flashover & CO Plume < 10ms          • Progressive Collapse Risk (0-100) • Courtyard Drone Roll-Call Count |
|                                                                                                               |
|  [ 4. MARL CROWD CHOKE FORECASTER ]    [ 5. VOCAL BIOMARKER STRESS AI ]    [ 6. AGENTIC EOC COMMAND TEAM ]    |
|  • Social Force + PPO Agents            • Wav2Vec 2.0 Acoustic Jitter       • LangGraph Incident Commander    |
|  • Stairwell Stampede Prediction        • Autonomic Panic Escalation        • Automated NDMA Form-IV Filing   |
|                                                                                                               |
+---------------------------------------------------------------------------------------------------------------+
```

### 6.1 Physics-Informed Neural Networks (PINNs) for Real-Time Smoke & Gas Dispersion
- **Limitation of Traditional CFD:** Computational Fluid Dynamics (CFD) packages (like NIST FDS) require hours to simulate smoke, thermal buoyancy, and carbon monoxide (CO) plumes.
- **The Solution:** A 3D **Physics-Informed Neural Network (PINN)** or **Fourier Neural Operator (FNO)** trained on Navier-Stokes fluid equations and building geometry.
- **Capability:** Ingests fire origin coordinates and campus HVAC airflow rates, outputting a complete 3D smoke density, visibility, and temperature gradient field across all floors in **< 10ms**.
- **Impact:** Allows the Incident Command Hub to predict flashover conditions and unbreathable zones *5 minutes into the future*, redirecting evacuation before corridors become lethal.

### 6.2 Structural Vulnerability & Progressive Collapse Prediction (GNN + XGBoost)
- **Model:** Graph Neural Network operating over a structural blueprint graph (nodes = columns/load-bearing walls, edges = floor slabs/crossbeams).
- **Inputs:** Ingests live USGS Peak Ground Acceleration (PGA), earthquake depth, building age, construction class (RCC vs. unreinforced masonry), and historical tremor data.
- **Prediction:** Outputs a continuous **Progressive Structural Collapse Probability Index (0 to 100%)** per wing.
- **Action:** Triggers pre-emptive evacuation orders for high-risk wings even if visible cracks have not yet appeared.

### 6.3 Edge Computer Vision Search & Rescue (YOLOv9-Dense / RT-DETR)
1. **Thermal Smoke-Penetration Detection:**
   - Deployed on warden thermal imaging cameras or indoor inspection drones.
   - Detects trapped victims through dense smoke using infrared spectrum bounding boxes and classifies victim mobility posture (`standing`, `crawling`, `prone/unconscious`).
2. **Instant Assembly Courtyard Drone Roll-Call:**
   - Drone camera sweeps the outdoor assembly ground post-evacuation.
   - Automatically counts students, cross-references physical headcount with classroom attendance rosters, and isolates the exact names and sections of unaccounted cadets in under 30 seconds.
3. **Webcam Fire Extinguisher PASS Technique Tracker:**
   - MediaPipe hand and object tracking validates the correct 4-step fire extinguisher sequence: **P**ull pin, **A**im at base, **S**queeze handle, **S**weep side-to-side.

### 6.4 Multi-Agent Reinforcement Learning (MARL) for Stampede & Choke-Point Prediction
- **Algorithm:** Multi-Agent Proximal Policy Optimization (MAPPO) fused with Helbing’s Social Force Model.
- **Prediction:** Simulates hundreds of panicking agents fleeing simultaneous classroom exits into narrow stairwells.
- **Choke-Point Forecaster:** Predicts arching and crowd crushing at doorways when exit throughput exceeds critical density ($\rho > 4 \text{ persons/m}^2$).
- **EOC Advisory:** Generates dynamic staggered egress directives (e.g., "Hold 3rd Floor East Wing for 45 seconds while 2nd Floor clears Stairwell B") to prevent stampedes.

### 6.5 Acoustic Vocal Biomarker & Speech Stress Classifier
- **Model:** Fine-tuned `Wav2Vec 2.0` / `HuBERT` lightweight acoustic model running on Mitra's audio stream.
- **Features Extracted:** Pitch variability ($F_0$), micro-tremors, vocal jitter, shimmer, speaking rate, and respiratory hyperventilation markers.
- **Biometric Output:** Real-time **Panic Index (0-100%)**.
- **Adaptive Escalation:**
  - If Panic $> 80\%$: Mitra immediately ceases multi-word sentences and commands repetitive, rhythmic pacing cues (*"Inhale 1-2-3-4... Hold... Exhale"*).
  - Automatically flags the student's room coordinates as **Priority-1 Critical Rescue** on the Command Hub tactical map.

### 6.6 Autonomous Multi-Agent Incident Commander (LangGraph Orchestration)
- **Architecture:** Specialized hierarchical multi-agent LLM framework running at the EOC level:
  1. **Triage Agent:** Continuously synthesizes incoming Mitra SOS texts, IoT smoke alerts, and structural health sensors into a real-time casualty matrix.
  2. **Logistics & Dispatch Agent:** Optimizes resource allocation (ambulances, fire tenders, NDRF rescue teams) based on travel distance and severity.
  3. **NDMA Compliance Scribe:** Automatically aggregates drill/incident telemetry and drafts standard **NDMA Form-IV Incident Reports** for human officer sign-off.
  4. **Public Broadcast Agent:** Generates instant, vernacular SMS and siren alert bulletins formatted according to ITU-T X.1303 CAP specifications.

### 6.7 Reinforcement Learning Dynamic Difficulty Adjustment (RL-DDA)
- **Model:** Contextual Multi-Armed Bandit / Deep Q-Network (DQN) for pedagogical gaming.
- **Objective:** Maintain the learner inside the **Flow Channel** (balancing anxiety and boredom per Csikszentmihalyi's psychological theory).
- **Adaptation:**
  - If a student demonstrates high spatial recall and low panic, the agent injects surprise electrical fires, blackout conditions, and blocked stairwells.
  - If a student experiences panic freeze, the agent introduces NPC guide-cadets and visual breadcrumb waypoints to scaffold competency.

---
*Reference Blueprint Docs: [01_EXECUTIVE_SUMMARY_AND_VISION.md](./01_EXECUTIVE_SUMMARY_AND_VISION.md) | [08_CURRENT_IMPLEMENTATION_STATUS.md](./08_CURRENT_IMPLEMENTATION_STATUS.md)*