# 04. Frontier AI/ML Systems & Innovations

To ensure the solution leads in technical innovation during the Smart India Hackathon (SIH) evaluation, the platform integrates five cutting-edge AI/ML modules. These systems shift disaster preparedness from static memorization to intelligent, adaptive, and real-time responsive education.

```
+--------------------------------------------------------------------------------------------------+
|                                    FRONTIER AI / ML SUITE                                        |
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
|   1. GENERATIVE SCENARIO SYNTHESIZER ──────► Generates unscripted procedural disaster blueprints |
|   2. GNN DYNAMIC ROUTE OPTIMIZER     ──────► Recalculates safe escape paths in <15ms             |
|   3. EDGE CV POSTURE VALIDATOR       ──────► Verifies physical "Drop-Cover-Hold" via webcam      |
|   4. "MITRA" CRISIS NLP COMPANION    ──────► Calms trapped students with multilingual voice AI   |
|   5. ADAPTIVE LEARNING & DDA ENGINE  ──────► Tailors simulation stress to student weaknesses     |
|                                                                                                  |
+--------------------------------------------------------------------------------------------------+
```

---

## 1. Generative Scenario Synthesis Engine (GenAI)

### 1.1 Objective & Architecture
Traditional disaster drills fail because students memorize fixed paths (e.g., "always run down Staircase A"). The **Generative Scenario Engine** dynamically generates millions of unique, realistic, and unscripted compound disaster scenarios using a fine-tuned LLM with structured JSON output schema enforcement.

```
+--------------------------------------------------------------------------------------------------+
|                              GENERATIVE SCENARIO PIPELINE                                        |
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
|   [ INPUT METADATA ]                                                                             |
|   • School Blueprint JSON (Floors 0 to 5)                                                        |
|   • Live Weather Bulletin (IMD Doppler API)                                                      |
|   • Campus Occupancy Count & Target Age Cohort                                                   |
|                                       │                                                          |
|                                       ▼                                                          |
|   [ LLM GENERATION & NDMA VALIDATOR AGENT ]                                                      |
|   • Generates dynamic ignition points & spreading smoke vectors                                  |
|   • Applies NDMA & NFPA life safety physical constraints                                         |
|                                       │                                                          |
|                                       ▼                                                          |
|   [ GENERATED RUNTIME SCENARIO OBJECT ]                                                          |
|   • Primary Hazard: Richter 6.4 Seismic Shock                                                    |
|   • Secondary Hazard: Electrical Panel Arc on Ground Floor at T+18s                              |
|   • Obstacle: North Staircase A blocked by smoke at T+35s                                        |
|   • Escape Solution: Reroute via South Staircase B to Courtyard Gate 3                           |
|                                                                                                  |
+--------------------------------------------------------------------------------------------------+
```

### 1.2 Structured Schema Generation Example:
```json
{
  "scenario_id": "SCEN_2026_EQ_FIRE_092",
  "name": "Compound Seismic-Electrical Escalation",
  "primary_hazard": {
    "type": "EARTHQUAKE",
    "intensity_richter": 6.4,
    "initial_impact_time_sec": 0
  },
  "cascading_hazards": [
    {
      "type": "ELECTRICAL_FIRE",
      "floor": 0,
      "room_id": "MAIN_TRANSFORMER_ROOM",
      "trigger_time_sec": 18,
      "spread_rate_m_per_min": 2.4,
      "suppression_rule": "CLASS_E_CO2_ONLY_NO_WATER"
    },
    {
      "type": "STRUCTURAL_COLLAPSE",
      "floor": 2,
      "zone_id": "NORTH_STAIRWELL_A",
      "trigger_time_sec": 35,
      "passable": false
    }
  ],
  "environmental_factors": {
    "grid_power_status": "FAILED",
    "emergency_lighting": "ACTIVE",
    "ambient_smoke_density_ppm": 450
  },
  "optimal_solution_path": ["ROOM_302", "SOUTH_STAIRWELL_B", "GROUND_COURTYARD_GATE_3"]
}
```

---

## 2. Graph Neural Network (GNN) & Dynamic A* Evacuation Routing

### 2.1 Problem & Mathematical Formulation
During an active disaster, standard static exit signs lead people directly into lethal traps (e.g., smoke-filled corridors or collapsed stairs). Our **Dynamic Pathfinding Engine** models the building as a time-varying weighted graph `G_t = (V, E, W_t)` where:
- **Vertices (V):** Rooms, hallway intersections, staircases, exits, assembly areas.
- **Edges (E):** Corridors, doors, stairs, windows.
- **Edge Cost Function:** Time-varying traversal cost influenced by smoke density `S`, thermal heat `H`, crowd congestion `C`, and structural integrity `I`:

```
Traversal Cost = Distance(u, v) * [ 1 + (α * Smoke) + (β * Heat) + (γ * Crowd) + (δ / Integrity) ]
```

```
[ Room 301 ] ──► [ Hallway 3 ] ──┬──► [ Stair A: BLOCKED BY SMOKE ❌ ] ──► (Lethal Trap)
                                 │
                                 └──► [ Stair B: CLEAR & SAFE ✅ ]    ──► [ Ground Exit ] ──► [ SAFE ZONE ]
```

### 2.2 Sub-15ms Real-Time Recalculation:
- Whenever an IoT sensor triggers (or a user reports a blockage), the backend GNN updates node hazard weights.
- The pathfinding algorithm instantly recalculates the safest (not necessarily the shortest) escape route and pushes the updated path vector to student client HUDs in **< 15 ms**.

---

## 3. Computer Vision (CV) Drill Compliance & Posture Validator

### 3.1 Edge-Based "Drop, Cover, Hold On" Pose Verification
During classroom physical drills, our lightweight edge Computer Vision model (MediaPipe Pose + YOLOv8-pose running via WebAssembly in the student's browser or classroom webcam) verifies physical drill posture in real time with **zero server video streaming (100% privacy-compliant)**.

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

## 4. "Mitra" — Conversational Crisis Companion (Multilingual NLP)

### 4.1 Crisis Psychological Support & Triage Chatbot
When students or individuals are isolated or trapped during a drill or emergency, panic induces hyperventilation and erratic actions. **"Mitra" (Friend)** is an ultra-low-latency, multi-lingual conversational agent (Hindi, English, Tamil, Telugu, Bengali, Marathi, etc.) embedded directly into the PWA.

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

### 4.2 Core NLP Capabilities:
- **Speech-to-Text & Text-to-Speech:** Low-bandwidth streaming audio for hands-free guidance in low-visibility environments.
- **Stress-Level Sentiment Analysis:** Detects panic levels from voice pitch and sentence structure; modulates tone to remain calm, direct, and authoritative.
- **Automated Emergency SOS Triage:** Automatically extracts structured crisis facts (Floor number, room number, injury severity, presence of fire) and submits them directly to the NDRF/EOC triage queue.

---

## 5. Adaptive Learning & Dynamic Difficulty Adjustment (DDA)

### 5.1 Personalized Pedagogical Reinforcement
The platform tracks each student's response patterns across micro-learning quizzes and simulation runs.

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

### 5.2 Dynamic Difficulty Adjustment (DDA) in Simulations:
- **Novice Mode:** Clear visual waypoint paths, low smoke spread rate, guided prompt cues.
- **Proficient Mode:** Waypoints hidden, primary staircase blocked after 20 seconds, dynamic power failure.
- **Mastery / Warden Mode:** Compound hazards (Earthquake + Chemical Spill + Trapped Peer), dynamic crowd panic pushing against exits, unassisted decision making.

---
*Next Section: [05_KNOWLEDGE_GRAPH_AND_ONTOLOGY.md](./05_KNOWLEDGE_GRAPH_AND_ONTOLOGY.md)*
