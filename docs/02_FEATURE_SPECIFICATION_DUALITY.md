# 02. Feature Specification: The Dual-Core Engine & Command Hub

> **📋 Implementation Status:** This document describes the full design blueprint. For what is currently built and working, see [08_CURRENT_IMPLEMENTATION_STATUS.md](./08_CURRENT_IMPLEMENTATION_STATUS.md).


This document defines the comprehensive functional specifications of the platform across its three core pillars:
1. **The Pedagogical Teaching Engine** (Theory, Curriculum, Age-Tiered Learning & Assessment)
2. **The Immersive Simulation & Gaming Engine** (Procedural Multi-Floor 3D Drills, Stress Mechanics, Branching Scenarios)
3. **The Unified Disaster Tracking & Multi-Agency Coordination Hub** (Real-Time CAP Alerts, Campus EOC, Headcount & Dispatch)

```
+--------------------------------------------------------------------------------------------------+
|                                    CORE PLATFORM ARCHITECTURE                                    |
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
|   +--------------------------+                      +--------------------------+                 |
|   |   PEDAGOGICAL TEACHING   |  Knowledge Base      |   IMMERSIVE SIMULATION   |                 |
|   |         ENGINE           | ═══════════════════► |      & GAMING ENGINE     |                 |
|   | (Theory, Rules, Tiers)   | ◄═══════════════════ | (3D WebGPU, Physics, DDA)|                 |
|   +--------------------------+  Telemetry / Stress  +--------------------------+                 |
|                ▲                                                  ▲                              |
|                ║ Automated Drill Trigger                          ║ Virtual Drill Telemetry      |
|                ▼                                                  ▼                              |
|   +----------------------------------------------------------------------------+                 |
|   |               UNIFIED DISASTER TRACKING & MULTI-AGENCY COMMAND HUB         |                 |
|   |   (NDMA SACHET Feeds, Real-Time Campus EOC, Headcount, NDRF/Fire Dispatch) |                 |
|   +----------------------------------------------------------------------------+                 |
|                                                                                                  |
+--------------------------------------------------------------------------------------------------+
```

---

## 1. Pillar I: Pedagogical Teaching Engine

The pedagogical module delivers structured, cognitive-stage-appropriate disaster safety education grounded in the National Disaster Management Authority (NDMA) guidelines and international standards (NFPA, OSHA, CDC).

### 1.1 Age-Tiered Curriculum Progression

```
[ Tier 1: Ages 5-7 ] ──► [ Tier 2: Ages 8-10 ] ──► [ Tier 3: Ages 11-13 ] ──► [ Tier 4: Ages 14-17 ] ──► [ Tier 5: Ages 18+ ]
  Sensory & Reflex         Hazard & Exit ID          Route Reasoning           Triage & Comms            Incident Leadership
```

| Age Cohort | Target Cognitive Skill | Core Disaster Modules | Interactive Learning Activity | Validation & Mastery Criteria |
| :--- | :--- | :--- | :--- | :--- |
| **Tier 1: Ages 5–7** *(Early Primary)* | Reflexive action & Adult Trust | • Earthquake: "Drop, Cover, Hold On"<br>• Fire: Sound recognition & "Stop, Drop, Roll"<br>• Flood: Water avoidance ("Stay dry, stay high") | Audio-visual animated cartoon storyboards; single-tap response mini-games ("Find the Desk"). | 100% correct single-action reflex under 3 seconds. |
| **Tier 2: Ages 8–10** *(Upper Primary)* | Hazard spotting & Emergency Kits | • Cyclone: Window hazards & Shelter kits<br>• Fire: Exit signs & Assembly points<br>• Transit: Bus crash emergency doors | Drag-and-drop "Emergency Go-Bag Builder"; 2D Hazard Spotter (find 5 unsafe items in a room). | Assemble essential 6-item kit within 45s without forbidden items. |
| **Tier 3: Ages 11–13** *(Middle School)* | Procedural logic & Exit differentiation | • Earthquake: Blocked routes & alternate stairs<br>• Fire: Electrical vs Cooking fires (No water)<br>• Chemical: Lab fume isolation | Interactive Floor Plan Navigator: Choose staircase A vs B based on smoke indicators. | Zero error on "No Water on Electrical/Oil Fires" rule; route selection accuracy > 90%. |
| **Tier 4: Ages 14–17** *(Secondary School)* | Stress decision-making & Emergency Comms | • Compound: Earthquake + Fire + Power loss<br>• Structural: Wall cracks & collapse triage<br>• Comms: 112 / NDRF precise dispatch format | Branching Decision Tree Scenarios; Voice/Text Emergency Dispatch Simulator (MITHRA AI evaluation). | Accurately transmit: Location, Hazard Type, Injured Count, Blocked Exits in < 30 seconds. |
| **Tier 5: Ages 18+ & College** *(Young Adults)* | Incident Command, Search & Rescue, Triage | • Multi-Floor Building Evacuation Command<br>• Campus Accountability & Roll Call<br>• Basic First Aid / Triage (START Protocol)<br>• Countering Disaster Misinformation | Tabletop Emergency Operations Center (EOC) Simulator; Crowd control & floor warden coordination. | Successful simulated evacuation of 500 virtual campus occupants with < 1% casualty rate. |

---

### 1.2 Interactive Micro-Learning Modules
- **Bite-Sized Lessons:** 3-to-5-minute gamified modules featuring animated explainers, audio narration in English, Hindi, and regional languages.
- **Dynamic Hazard Spotter:** 360-degree interactive classroom/lab panorama where students click to identify hazards (e.g., daisy-chained electrical plugs, blocked fire doors, unanchored lab chemical bottles).
- **Extinguisher PASS Simulator:** Interactive virtual fire extinguisher module teaching:
  - **P**ull the pin
  - **A**im at the base of the fire
  - **S**queeze the lever
  - **S**weep side to side
  - *Extinguisher Classification:* Class A (solids), Class B (flammable liquids), Class C (gases), Class D (metals), Class E/CO₂ (electrical).

---

## 2. Pillar II: Immersive Simulation & Gaming Engine

The simulation engine is designed to transform theoretical knowledge into resilient muscle memory through procedural scenarios, realistic hazard physics, and stress-inducing game mechanics.

```
+--------------------------------------------------------------------------------------------------+
|                                SIMULATION RUNTIME EXECUTION LOOP                                 |
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
|   [ STEP 1: INITIALIZATION ]                                                                     |
|   • Load School Blueprint (Ground to 5th Floor)                                                  |
|   • Spawn Procedural Hazards (Fire in Chem Lab, Smoke in Stairwell A, Debris on Floor 3)         |
|                                                                                                  |
|   [ STEP 2: REAL-TIME GAMEPLAY LOOP ]                                                            |
|   ┌────────────────────────────────────────────────────────────────────────────────────────┐     |
|   │ 1. Player State: HP Bar, Calmness/Panic Meter (0-100), Oxygen Timer                    │     |
|   │ 2. Player Decisions: Crawl low under smoke, check door temperature, choose Stair B     │     |
|   │ 3. Hazard Spread: Physics-based smoke ceiling accumulation, thermal fire spread        │     |
|   │ 4. Stress Stimuli: Tinnitus ringing, visual vignette, 2-second cognitive lag           │     |
|   │ 5. Rule Evaluation: Assess against NDMA & NFPA Life Safety Standards                   │     |
|   └────────────────────────────────────────────────────────────────────────────────────────┘     |
|                                                                                                  |
|   [ STEP 3: OUTCOME RESOLUTION ]                                                                 |
|   • Rule Violation (e.g. Took lift during fire) ═════► Virtual Casualty & Detailed Debrief       |
|   • Rule Adherence (Checked door, used Stair B) ═════► Successful Evacuation to Safe Assembly    |
|                                                                                                  |
+--------------------------------------------------------------------------------------------------+
```

### 2.1 Physics & Hazard Spread Mechanics
1. **Dynamic Smoke Inversion:**
   - Smoke rises vertically and accumulates from ceilings downward.
   - Vision is obstructed based on floor level and proximity to the fire source.
   - Mechanics: Player must toggle **"Crawl / Crouch"** mode to maintain oxygen and visibility under heavy smoke.
2. **Dynamic Structural Debris:**
   - Aftershocks trigger structural collapses (damaged stairwells, falling ceiling tiles).
   - Debris blocks primary paths, forcing the player to re-route dynamically using secondary fire stairs.
3. **Electrical & Chemical Hazard Propagation:**
   - Water contact with live wires creates high-voltage hazard zones.
   - Chemical spills in lab levels emit toxic gas plumes requiring immediate ventilation isolation and windward escape.

### 2.2 Stress & Panic Simulation Mechanics
- **The "Calmness Index" (0–100):**
  - Sudden events (alarms blaring, ceiling collapse, trapped doors) increase player heart rate and deplete the Calmness Index.
  - High panic states introduce visual tunneling (vignette effect), audio distortion (ringing tinnitus + muffled ambient sounds), and a 2-second input lag to simulate cognitive freeze.
  - **Breathing Stabilization Mini-mechanic:** When panic spikes, students must perform a 4-second box-breathing cadence to regain clear vision and rapid movement.

---

### 2.3 Floor-Wise Vertical Evacuation Hierarchy (Ground – 5th Floor)

```
[ Floor 5: Longest Descent | High Smoke Accumulation | Vertical Trap Risk ]
       │
       ▼
[ Floor 4: Intermediate Landing | Blocked Stair Isolation | Alternate Route Search ]
       │
       ▼
[ Floor 3: Mid-Building Transition | Library/Labs | Secondary Stair Access ]
       │
       ▼
[ Floor 2: Science Wing Hazmat | Rapid Smoke Funnel | Windward Evacuation ]
       │
       ▼
[ Floor 1: Main Corridor Confluence | High Foot-Traffic | Anti-Stampede Controls ]
       │
       ▼
[ Ground Floor: Direct Courtyard Access vs Main Electrical Panel Hazard ]
       │
       ▼
[ SAFE ASSEMBLY REFUGE ZONE (Open Ground Outside Campus) ]
```

*Refer to [07_DYNAMIC_SCENARIOS_AND_DECISION_MATRICES.md](./07_DYNAMIC_SCENARIOS_AND_DECISION_MATRICES.md) for full scenario walkthroughs.*

---

## 3. Pillar III: Unified Disaster Tracking & Multi-Agency Coordination Hub

The system bridges the educational environment with live operational disaster management capabilities, serving as a dual-mode platform during real emergencies.

```
+--------------------------------------------------------------------------------------------------+
|                            UNIFIED INCIDENT COMMAND & ALERT PIPELINE                             |
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
|   1. REAL-TIME DATA INGESTION                                                                    |
|      • NDMA SACHET National Alert Feed (CAP v1.2 XML/JSON)                                       |
|      • IMD Cyclone & Flood Weather Doppler Radars                                                |
|      • USGS & NCS Seismic Earthquake Telemetry                                                   |
|      • Campus IoT Optical Smoke Detectors & Thermal Sensors                                      |
|                                        │                                                         |
|                                        ▼                                                         |
|   2. COMMAND PROCESSING ENGINE                                                                   |
|      • Geofence Polygon Filter (Matches Campus Lat/Long)                                         |
|      • Campus EOC 2D/3D Interactive Blueprint Visualizer                                         |
|      • GNN Dynamic A* Evacuation Route Recalculator                                              |
|      • Real-Time Student Headcount & Accountability Matrix                                       |
|                                        │                                                         |
|                                        ▼                                                         |
|   3. MULTI-AGENCY DISSEMINATION & ACTION                                                         |
|      • Sub-500ms Emergency Broadcast to all Student Mobile & Lab Screens                         |
|      • Live Trapped Student Heatmap & 3D Blueprint Transmitted to NDRF                           |
|      • Hydrant & Hazmat Location Manifest to Fire & Rescue Service                               |
|      • Automated "Safe Status" SMS Notifications to Parents Portal                               |
|                                                                                                  |
+--------------------------------------------------------------------------------------------------+
```

### 3.1 Live Emergency Alert Protocol (CAP v1.2 Integration)
- **SACHET / NDMA Feeds:** Automated polling and WebSocket webhook listener for Common Alerting Protocol (CAP) messages across India.
- **Geofenced Threshold Filtering:** Matches alert severity (Warning, Alert, Extreme) against campus coordinates.
- **Automated Mode Switch:** When an active "Extreme Disaster" CAP alert matches the school's geofence, the platform automatically switches from **"Learning/Gamified Mode"** to **"Emergency Life-Safety Mode"**, broadcasting instant floor-specific evacuation directions.

### 3.2 Campus Emergency Operations Center (EOC)
1. **Interactive Campus GIS / Floorplan Visualizer:**
   - Displays real-time status of all 5+ floors: Green (Clear), Amber (Congested/Warning), Red (Active Hazard/Blocked).
   - Shows live locations of active hazards (smoke detectors triggered, structural cracks reported).
2. **Student Accountability & Digital Headcount:**
   - Teachers/Wardens scan student QR badges or tap NFC IDs at assembly zones.
   - Real-time tally shows: Total Enrolled, Present on Campus, Verified in Safe Zone, Trapped / Unaccounted.
   - Automatically generates a missing persons manifest with last-known floor locations for NDRF/Fire search teams.
3. **Multi-Agency Incident Command Dashboard:**
   - Multi-tenant role-based access control (RBAC):
     - **School Principal / Wardens:** Initiate drills, send campus broadcasts, verify assembly count.
     - **NDRF Commander:** Access 3D blueprint, live trapped student heatmap, structural sensor data.
     - **Fire & Rescue Service:** View fire hydrant positions, hazardous chemical storage rooms, active fire floor telemetry.
     - **Ambulance / EMS:** Pre-triage casualties by injury severity code (Red, Yellow, Green, Black).

---
*Next Section: [03_TECHNICAL_ARCHITECTURE_AND_TECH_STACK.md](./03_TECHNICAL_ARCHITECTURE_AND_TECH_STACK.md)*