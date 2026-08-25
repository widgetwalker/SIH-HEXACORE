# 05. Enterprise Knowledge Graph & Disaster Domain Ontology

> **📋 Implementation Status:** This document describes the full design blueprint. For what is currently built and working, see [08_CURRENT_IMPLEMENTATION_STATUS.md](./08_CURRENT_IMPLEMENTATION_STATUS.md).


This document specifies the formal **Knowledge Graph (KG) and Domain Ontology** powering the platform. The knowledge graph encodes the semantic relationships between disasters, campus physical infrastructure, dynamic hazards, safety procedures, critical prohibitions (Do's & Don'ts), age-tiered pedagogical cohorts, multi-agency response hierarchies, and real-time alert protocols.

```
+--------------------------------------------------------------------------------------------------+
|                                MASTER DOMAIN ONTOLOGY TOPOLOGY                                   |
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
|   [ DISASTER HAZARD ] ────────► CLASSIFIED UNDER ───────► [ HAZARD CATEGORY ]                    |
|          │                                                                                       |
|          ├────────────────────► OCCURS IN ──────────────► [ BUILDING FLOOR ZONE ]                |
|          │                                                        │                              |
|          │                                                        ├──► CONTAINS ──► [ CORRIDORS ]|
|          │                                                        │                              |
|          │                                                        └──► HOUSES   ──► [ COHORTS ]  |
|          │                                                                                       |
|          ├────────────────────► MANDATES ───────────────► [ SAFETY PROCEDURE ]                  |
|          │                                                        │                              |
|          │                                                        └──► TAILORED ──► [ COHORTS ]  |
|          │                                                                                       |
|          └────────────────────► ENFORCES ───────────────► [ CRITICAL PROHIBITIONS (DON'TS) ]    |
|                                                                                                  |
|   [ ALERT STREAM (CAP v1.2) ] ─► GEOFENCED TO ──────────► [ CAMPUS ENTITY ]                      |
|          │                                                                                       |
|          └────────────────────► DISPATCHES TO ──────────► [ MULTI-AGENCY ROLES ]                 |
|                                                                                                  |
+--------------------------------------------------------------------------------------------------+
```

---

## 1. Core Ontology Schema & Entity Definitions

```
+--------------------------------------------------------------------------------------------------+
|                                  ENTITY ATTRIBUTE DEFINITIONS                                    |
+--------------------------------------------------------------------------------------------------+
| 1. DisasterHazard:      hazard_id, name, category, severity_level, ndma_guideline_ref            |
| 2. BuildingFloorZone:   zone_id, floor_number (0 to 5), building_id, risk_level, is_accessible   |
| 3. SafetyProcedure:     procedure_id, action_name, execution_steps, standard, min_age_tier       |
| 4. CriticalProhibition: prohibition_id, forbidden_action, fatal_consequence, safe_alternative    |
| 5. StudentCohort:       cohort_id, age_range (5-7, 8-10, 11-13, 14-17, 18+), cognitive_stage     |
| 6. MultiAgencyRole:     agency_id, agency_name (NDRF, SDMA, Fire, Police, Warden), authority_lvl|
| 7. AlertStream:         alert_id, cap_identifier, urgency, severity, certainty, geofence_poly   |
+--------------------------------------------------------------------------------------------------+
```

---

## 2. Master Semantic Triples Table (Entity-Relationship Mappings)

| Subject Entity | Predicate (Relationship) | Object Entity | Semantic Context & Real-World Rule |
| :--- | :--- | :--- | :--- |
| `Electrical_Fire` | `ENFORCES_PROHIBITION` | `Use_Water_Extinguisher` | **CRITICAL:** Water conducts electricity causing lethal shock; use Class E CO₂/Dry Powder only. |
| `Cooking_Oil_Fire` | `ENFORCES_PROHIBITION` | `Use_Water_Extinguisher` | **CRITICAL:** Water causes violent explosive vapor flash spread; smother with fire blanket. |
| `Fire_Incident` | `ENFORCES_PROHIBITION` | `Use_Passenger_Elevator` | Elevators fail, lose power, or open directly into smoke shafts; use designated fire staircases. |
| `Earthquake_Tremor` | `MANDATES_PROCEDURE` | `Drop_Cover_Hold_On` | Drop to knees, cover head/neck under sturdy furniture, hold legs until shaking ceases. |
| `Earthquake_Tremor` | `ENFORCES_PROHIBITION` | `Run_Down_Stairs_During_Shaking` | Falling debris and violent stair movement cause fatal falls; evacuate only AFTER shaking stops. |
| `Dense_Smoke_Corridor` | `MANDATES_PROCEDURE` | `Crawl_Low_Under_Smoke` | Toxic carbon monoxide and heated gases rise to ceiling; clean breathable air stays near floor. |
| `Blocked_Staircase_A` | `TRIGGERS_RE_ROUTING` | `Secondary_Staircase_B` | GNN pathfinding reroutes floor occupants to the alternate designated fire exit. |
| `All_Exits_Blocked` | `MANDATES_PROCEDURE` | `Shelter_In_Place_And_Signal` | Seal door gaps with wet fabrics, signal from safe window, communicate exact room ID to EOC/112. |
| `Gas_Leak_Suspected` | `ENFORCES_PROHIBITION` | `Toggle_Electrical_Switches` | Electrical arcing inside switches triggers gas cloud explosion; evacuate immediately into fresh air. |
| `Flood_Water_Rising` | `MANDATES_PROCEDURE` | `Vertical_Evacuation_Higher_Floor` | Move to structurally sound upper floors; never wade or drive through fast-moving murky floodwaters. |
| `NDMA_SACHET_Extreme` | `TRIGGERS_OVERRIDE` | `Campus_Emergency_Broadcast` | Instantly interrupts simulation games and displays live evacuation corridors on all campus screens. |

---

## 3. Floor-by-Floor Spatial Knowledge Graph (Ground to 5th Floor)

```
+--------------------------------------------------------------------------------------------------+
|                              SPATIAL CAMPUS GRAPH (GROUND TO 5TH FLOOR)                          |
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
|   [ FLOOR 5: Penthouse / Terrace ]                                                               |
|   • Rooms 501-502 ──► Corridor 5 ──┬──► Stair 5A (North) ──┐                                    |
|                                    └──► Stair 5B (South) ──┼──┐                                 |
|                                                            │  │                                  |
|   [ FLOOR 4: Secondary Classrooms ]                        │  │                                  |
|   • Rooms 401-402 ──► Corridor 4 ──┬──► Stair 4A (North) ◄─┘  │                                  |
|                                    └──► Stair 4B (South) ◄────┘                                  |
|                                                            │  │                                  |
|   [ FLOOR 3: Central Library & Computer Labs ]             │  │                                  |
|   • Library / Comp Lab ──► Corridor 3 ──┬──► Stair 3A ◄────┘  │                                  |
|                                         └──► Stair 3B ◄───────┘                                  |
|                                                            │  │                                  |
|   [ FLOOR 2: Science & Chemistry Labs ]                    │  │                                  |
|   • Chem / Physics Labs ──► Corridor 2 ──┬──► Stair 2A ◄───┘  │                                  |
|                                          └──► Stair 2B ◄──────┘                                  |
|                                                            │  │                                  |
|   [ FLOOR 1: Junior Classrooms & Staffroom ]               │  │                                  |
|   • Rooms 101 / Staff ──► Corridor 1 ──┬──► Stair 1A ◄─────┘  │                                  |
|                                        └──► Stair 1B ◄────────┘                                  |
|                                                            │  │                                  |
|   [ GROUND FLOOR: Lobby, Panels & Courtyard ]              │  │                                  |
|   • Ground Lobby & Transformer ────────┬──► Exit Gate 1 (North) ◄───┘                            |
|                                        └──► Emergency Gate 2 (South) ◄───┘                       |
|                                                            │                                     |
|                                                            ▼                                     |
|   [ SAFE ASSEMBLY REFUGE ZONE ] ◄──────────────────────────┘                                     |
|                                                                                                  |
+--------------------------------------------------------------------------------------------------+
```

---

## 4. Formal JSON-LD & RDF Schema Representation

Below is the machine-readable JSON-LD ontology definition used by the system's semantic reasoning engine and graph database:

```json
{
  "@context": {
    "schema": "https://schema.org/",
    "sih": "https://sih.gov.in/disaster-ontology#",
    "ndma": "https://ndma.gov.in/standards#",
    "Hazard": "sih:DisasterHazard",
    "Procedure": "sih:SafetyProcedure",
    "Prohibition": "sih:CriticalProhibition",
    "FloorZone": "sih:BuildingFloorZone",
    "Cohort": "sih:StudentCohort",
    "mandates": { "@id": "sih:mandatesProcedure", "@type": "@id" },
    "prohibits": { "@id": "sih:enforcesProhibition", "@type": "@id" },
    "appliesTo": { "@id": "sih:appliesToCohort", "@type": "@id" }
  },
  "@graph": [
    {
      "@id": "sih:Hazard_ElectricalFire",
      "@type": "Hazard",
      "sih:name": "Electrical Panel Fire",
      "sih:category": "Fire & Chemical Hazards",
      "sih:mandates": [
        "sih:Proc_RaiseAlarm",
        "sih:Proc_UseCO2ExtinguisherIfTrained",
        "sih:Proc_EvacuateViaSafeStairs"
      ],
      "sih:prohibits": [
        "sih:Prohib_NoWaterOnElectricalFire",
        "sih:Prohib_NoPassengerLiftUsage"
      ],
      "ndma:standardRef": "NDMA Fire Safety Guidelines Sec 4.2"
    },
    {
      "@id": "sih:Prohib_NoWaterOnElectricalFire",
      "@type": "Prohibition",
      "sih:forbiddenAction": "Pouring or spraying water on energized electrical wiring",
      "sih:fatalConsequence": "Lethal electric shock / electrocution and explosive arc flash",
      "sih:correctiveAlternative": "Use Class E CO2 / Dry Chemical Powder extinguisher or isolate power switch if safe"
    },
    {
      "@id": "sih:Cohort_Tier3_MiddleSchool",
      "@type": "Cohort",
      "sih:ageRange": "11-13",
      "sih:targetSkill": "Procedural exit differentiation and fire extinguisher classification",
      "sih:eligibleProcedures": [
        "sih:Proc_DropCoverHold",
        "sih:Proc_IdentifyBlockedStairs",
        "sih:Proc_DistinguishExtinguishers"
      ]
    }
  ]
}
```

---

## 5. Cypher Query Templates for Graph Database (Neo4j / Memgraph)

### Dynamic Evacuation Route Extraction Query:
```cypher
// Find safest path from Room 402 to Safe Assembly Zone avoiding active hazards
MATCH path = (start:FloorZone {zone_id: 'ROOM_402'})-[:CONNECTED_TO*1..10]->(dest:SafeZone {name: 'MAIN_GROUND_ASSEMBLY'})
WHERE NONE(node IN nodes(path) WHERE node.status = 'BLOCKED_BY_FIRE' OR node.status = 'BLOCKED_BY_SMOKE' OR node.status = 'STRUCTURAL_COLLAPSE')
RETURN path, reduce(cost = 0, edge IN relationships(path) | cost + edge.traversal_weight) AS total_risk_cost
ORDER BY total_risk_cost ASC
LIMIT 1;
```

---
*Next Section: [06_ROLE_ALLOCATION_AND_SPRINT_ROADMAP.md](./06_ROLE_ALLOCATION_AND_SPRINT_ROADMAP.md)*