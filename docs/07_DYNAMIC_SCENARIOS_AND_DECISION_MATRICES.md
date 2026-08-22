# 07. Dynamic Scenarios, Floor-Wise Response Matrices & Universal Decision Trees

This document establishes the comprehensive disaster scenario definitions, floor-wise evacuation rules (Ground to 5th Floor), compound multi-hazard protocols, and universal decision trees codified from official guidelines issued by the **National Disaster Management Authority (NDMA)**, **NFPA**, **OSHA**, **USGS**, **NOAA**, and **CDC**.

---

## 1. Universal Life-Safety Principles (Do's & Don'ts)

```
+--------------------------------------------------------------------------------------------------+
|                                    CRITICAL UNIVERSAL PROHIBITIONS                               |
+--------------------------------------------------------------------------------------------------+
| 1. ELECTRICAL FIRE  --> NEVER USE WATER. Water conducts high voltage causing fatal electrocution. |
| 2. OIL / GREASE FIRE --> NEVER USE WATER. Water causes violent explosive vapor and fire spread.  |
| 3. FIRE EVACUATION  --> NEVER USE PASSENGER LIFTS. Elevators fail, lose power, or act as chimneys.|
| 4. EARTHQUAKE       --> NEVER RUN DOWN STAIRS DURING SHAKING. Drop, Cover, and Hold On first.   |
| 5. FLOOD HAZARD     --> NEVER WALK OR DRIVE THROUGH FAST/MURKY WATER. 15cm can sweep a person.   |
| 6. GAS LEAK         --> NEVER OPERATE ELECTRICAL SWITCHES OR OPEN FLAMES. Arcs ignite explosions.|
| 7. SMOKE CORRIDOR   --> NEVER ENTER DENSE SMOKE. Crawl low (<50cm) or shelter and seal door.     |
| 8. DAMAGED BUILDING --> NEVER RE-ENTER until official NDMA / Structural Engineer all-clear.      |
+--------------------------------------------------------------------------------------------------+
```

---

## 2. Floor-Wise Evacuation Logic (Ground to 5th Floor)

```
[ Floor 5: Longest Descent | High Smoke Accumulation | Vertical Trap Danger ]
       │
       ▼ (Via Safe Secondary Stair B)
[ Floor 4: Intermediate Landing | Blocked Stair Isolation | Shelter Decision Point ]
       │
       ▼ (Via Safe Secondary Stair B)
[ Floor 3: Mid-Building Transition | Library/Labs | Secondary Stair Access ]
       │
       ▼ (Via Safe Secondary Stair B)
[ Floor 2: Science Wing Hazmat | Rapid Smoke Funnel | Quick Stair Clearance ]
       │
       ▼ (Via Safe Secondary Stair B)
[ Floor 1: Main Corridor Confluence | High Foot-Traffic | Avoid Stair Bottlenecks ]
       │
       ▼ (Via Safe Secondary Stair B)
[ Ground Floor: Primary Exits vs Blocked Panels | Direct Courtyard Evacuation ]
       │
       ▼
[ SAFE ASSEMBLY REFUGE ZONE (Open Ground Outside Campus) ]
```

| Floor Level | Baseline Safe Response | Procedure if Primary Stair is Blocked | Procedure if ALL Stairs are Blocked |
| :--- | :--- | :--- | :--- |
| **Ground Floor** | Use nearest unobstructed exterior exit directly into open courtyard assembly area. | Divert immediately to secondary rear or side emergency exit. Do not pass through fire/smoke. | Move to a protected room away from fire, call EOC/112, signal through safe exterior window. |
| **1st Floor** | Evacuate calmly via designated primary staircase. Keep handrails clear. | Divert to alternate designated fire stairwell. Do not jump from balconies. | Shelter in classroom; seal bottom door gaps with damp coats; signal location. |
| **2nd Floor** | Descend via clear fire staircase. Verify door temperature with back of hand before opening. | Use secondary fire staircase. Isolate chemical labs by keeping lab fire doors shut. | Shelter in exterior-facing room; close doors; post brightly colored signal at window. |
| **3rd Floor** | Evacuate early upon alarm confirmation. Maintain steady pace; avoid crowd crush. | Switch immediately to alternate stairwell. Do not stop for backpacks or laptops. | Retreat to protected safe room; place damp towels under door; call emergency dispatch. |
| **4th Floor** | Descend via designated enclosed fire stairs. Never assume lifts are operational or safe. | Descend via secondary fire stair. Do not ascend to roof unless vertical rescue is ordered. | Shelter in place; seal ventilation ducts; keep low to floor; transmit room ID to EOC. |
| **5th Floor** | Longest evacuation time. Move immediately upon alarm; maintain orderly single file. | Use secondary stairwell. If smoke rises through stairwell, do not enter it. | Shelter in safe room; stay below smoke layer (<50cm); signal emergency responders. |

---

## 3. Dynamic Fire Scenarios & Multi-Hazard Matrices

```
+--------------------------------------------------------------------------------------------------+
|                                    FIRE RESPONSE DECISION FLOW                                   |
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
|   [ FIRE ALARM / SMOKE DETECTED ]                                                                |
|                  │                                                                               |
|                  ▼                                                                               |
|   Check Door Handle with Back of Hand                                                            |
|         │                                                                                        |
|         ├───► HOT / SMOKE SEEPING ────► [ DO NOT OPEN DOOR ] ────────────────────────┐           |
|         │                                                                            │           |
|         └───► COOL & NO SMOKE     ────► Open Carefully & Check Corridor              │           |
|                                                │                                     │           |
|                                                ├───► Designated Stair Safe?          │           |
|                                                │        │                            │           |
|                                                │        ├──► YES: Descend to Ground  │           |
|                                                │        │                            │           |
|                                                │        └──► NO: Alternate Stair?    │           |
|                                                │                 │                   │           |
|                                                │                 ├──► YES: Descend   │           |
|                                                │                 │                   │           |
|                                                │                 └──► NO: Blocked ───┤           |
|                                                │                                     │           |
|                                                ▼                                     ▼           |
|                                  [ EXECUTE SHELTER-IN-PLACE ] ◄──────────────────────┘           |
|                                  1. Close Door & Seal Bottom Gaps with Damp Cloths               |
|                                  2. Stay Low (<50cm) Below Toxic Smoke Layer                     |
|                                  3. Transmit Room Number to 112 / Campus EOC                     |
|                                  4. Signal Location from Safe Window                             |
|                                                                                                  |
+--------------------------------------------------------------------------------------------------+
```

### 3.1 Exhaustive Fire Scenario Walkthroughs:

| Scenario Condition | Immediate DO's | Critical DON'Ts | Vital Life-Safety Rationale |
| :--- | :--- | :--- | :--- |
| **Fire on Ground Floor; You are on 5th Floor** | Check fire stair temperature; descend via confirmed clear fire stair; alert others calmly. | **DO NOT use passenger lift.** DO NOT enter smoke-filled stair shaft. | Smoke funnels upwards like a chimney; lifts can stall between floors or open directly into fire. |
| **Fire on Your Floor; Staircase 1 Blocked** | Move away from fire; use alternate Staircase 2; close doors behind you to compartmentalize smoke. | **DO NOT test or inspect blocked stair.** DO NOT hold doors open. | Compartmentation starves fire of oxygen and prevents flashover down corridors. |
| **Both Staircases Blocked with Heavy Smoke** | Retreat to room furthest from fire; close door; seal edges with wet fabrics; call 112 with exact room number. | **DO NOT attempt to run through smoke.** **DO NOT jump from windows.** | Two breaths of toxic carbon monoxide / hydrogen cyanide cause immediate loss of consciousness. |
| **Lift Appears Operational During Fire** | Ignore the lift; proceed directly to designated fire stairs. | **DO NOT enter lift.** | Power failure can trap occupants inside shaft; lift sensors can call elevator to the fire floor. |
| **Lift Trapped Between Floors** | Press emergency call button / intercom; sit on floor; conserve energy; await trained rescue. | **DO NOT pry doors open.** DO NOT attempt to climb out into elevator shaft. | Untrained escape attempts from stalled lifts lead to fatal falls down elevator shafts. |
| **Electrical Panel Fire** | Raise alarm; isolate power if trained and safe; use Class E CO₂ or dry chemical extinguisher. | **NEVER THROW WATER.** | Water is an electrical conductor; touching wet stream causes lethal high-voltage shock. |
| **Cooking Oil / Cafeteria Fire** | Turn off heat source if safe; smother flames with fire blanket or metal lid; use Class K/F extinguisher. | **NEVER THROW WATER.** DO NOT move burning pan. | Water vaporizes instantly, causing an explosive fireball spreading boiling oil across room. |
| **Unknown Chemical Fire in Laboratory** | Trigger fire alarm; evacuate laboratory immediately; close lab doors; assemble upwind. | **DO NOT attempt to fight unknown chemical fires.** | Chemical reactions can emit invisible lethal neurotoxins or explode upon water contact. |

---

## 4. Natural Disaster Scenarios & Decision Matrices

```
+--------------------------------------------------------------------------------------------------+
|                                    NATURAL HAZARD ACTION SUITE                                   |
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
|   1. EARTHQUAKE ──► DROP, COVER, HOLD ON ──────► Evacuate via safe stairs AFTER shaking ceases    |
|   2. TSUNAMI    ──► MOVE INLAND / HIGH GROUND  ──────► Beware consecutive waves 2, 3 & 4         |
|   3. CYCLONE    ──► SHELTER IN CORE INTERIOR   ──────► Stay away from windows & glass facades    |
|   4. FLOOD      ──► VERTICAL EVAC TO UPPER FLR ──────► Never walk/drive through fast floodwater  |
|   5. HEATWAVE   ──► CONTINUOUS HYDRATION (ORS) ──────► Shaded areas & restrict midday exposure   |
|                                                                                                  |
+--------------------------------------------------------------------------------------------------+
```

### 4.1 Natural Hazard Protocols:

| Disaster Type | Before Impact (Preparedness) | During Event (Immediate Survival Action) | Post-Event (Evacuation & Recovery) |
| :--- | :--- | :--- | :--- |
| **Earthquake** | Identify sturdy furniture; anchor heavy overhead shelves; participate in regular drills. | **DROP, COVER, HOLD ON.** Protect cervical spine. Stay away from glass windows and facades. | Evacuate calmly via safe stairs once shaking stops. Watch for damaged stairs and falling bricks. Expect aftershocks. |
| **Tsunami** | Memorize coastal evacuation routes and inland high-ground assembly zones. | If strong tremor felt or sea recedes rapidly: **MOVE INLAND / HIGHER GROUND IMMEDIATELY.** | **DO NOT return after first wave.** Tsunamis are a series of waves arriving over several hours. |
| **Cyclone** | Secure loose roof sheets and outdoor equipment; charge emergency lights and power banks. | Stay indoors in interior room without windows. **DO NOT go outside during eye of storm (lull).** | Wait for official IMD/NDMA "All-Clear" bulletin before leaving shelter. Beware live fallen power cables. |
| **Flood** | Store institutional records and electronics on upper floors; identify safe vertical escape routes. | Move to designated upper floor. **Never walk, swim, or drive through moving floodwaters.** | Avoid contact with contaminated floodwaters (leptospirosis risk). Do not touch submerged electrical panels. |
| **Heatwave** | Schedule outdoor physical education before 9:00 AM; ensure clean ORS / water hydration points. | Stay in shaded, well-ventilated areas. Wear loose light cotton clothes. | Recognize heatstroke symptoms (confusion, cessation of sweating); apply cold packs and call EMS. |

---

## 5. Compound & Dynamic Disaster Scenarios

Real-world disasters rarely occur in isolation. The platform dynamically simulates cascading multi-hazard compounding events:

```
+--------------------------------------------------------------------------------------------------+
|                                  DYNAMIC COMPOUND HAZARDS MATRIX                                 |
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
|   [ COMPOUND 1: EARTHQUAKE + ELECTRICAL FIRE ]                                                   |
|   1. Drop, Cover, Hold On during active shaking.                                                 |
|   2. Shaking ceases -> Electrical panel sparks on Ground Floor.                                  |
|   3. Isolate main breaker if safe -> Do not use water.                                           |
|   4. Evacuate via South Stair B (Stair A smoke-blocked).                                         |
|                                                                                                  |
|   [ COMPOUND 2: EARTHQUAKE + STRUCTURAL STAIR COLLAPSE ]                                         |
|   1. Assess Staircase A -> Severe diagonal shear cracks detected.                                |
|   2. DO NOT test damaged stairs.                                                                 |
|   3. Immediate dynamic rerouting of 100% floor occupants to Staircase B.                         |
|                                                                                                  |
|   [ COMPOUND 3: FLOOD + ENERGIZED CAMPUS SUBSTATION ]                                            |
|   1. Rapid floodwater ingress approaching ground transformer.                                    |
|   2. Maintain 15-meter buffer zone to prevent electrical arc step-potential.                    |
|   3. Execute vertical evacuation to 2nd Floor & await rescue boats.                              |
|                                                                                                  |
|   [ COMPOUND 4: CHEMICAL LAB SPILL + FIRE ESCALATION ]                                           |
|   1. Evacuate chemistry wing immediately.                                                        |
|   2. Seal fire-rated laboratory doors to contain toxic vapor plume.                              |
|   3. Verify wind vane direction -> Assemble UPWIND in courtyard.                                 |
|                                                                                                  |
+--------------------------------------------------------------------------------------------------+
```

---

## 6. Master Decision Tree: "Which Exit Should I Use?"

```
                                  [ EMERGENCY DETECTED ]
                                             │
                            Is there an immediate local hazard?
                                    /                 \
                              (YES)/                   \(NO)
                                  /                     \
                      [ Move Away Immediately ]    [ Proceed to Evacuation Plan ]
                                  \                     /
                                   \                   /
                                    ▼                 ▼
                                 [ Is Normal Exit Door Safe? ]
                                    /                 \
                              (YES)/                   \(NO: Hot / Smoke / Debris)
                                  /                     \
                    [ Open Carefully & Descend ]    [ DO NOT ENTER - KEEP SHUT ]
                                                                │
                                                 [ Is Alternate Stair Safe? ]
                                                    /                 \
                                              (YES)/                   \(NO: Both Blocked)
                                                  /                     \
                                  [ Use Alternate Fire Stair ]     [ EXECUTE SHELTER-IN-PLACE ]
                                                                        │
                                                           1. Close Door & Seal Gaps
                                                           2. Stay Low (<50cm)
                                                           3. Signal Responders from Window
                                                           4. Transmit Location via Mitra / 112
```

---

## 7. Authoritative Standards & References

1. **National Disaster Management Authority (NDMA), India** — *National Disaster Management Guidelines - School Safety Policy*. [ndma.gov.in](https://ndma.gov.in/)
2. **SACHET Portal, NDMA** — *National Disaster Alert Portal & Standard Operating Dos and Don'ts*. [sachet.ndma.gov.in](https://sachet.ndma.gov.in/DosDont)
3. **U.S. Geological Survey (USGS)** — *Earthquake Safety: Drop, Cover, and Hold On Protocol*. [usgs.gov](https://store.usgs.gov/assets/yimages/PDF/205515.pdf)
4. **National Oceanic and Atmospheric Administration (NOAA)** — *Tsunami Preparedness & Vertical Evacuation Guide*. [noaa.gov](https://repository.library.noaa.gov/view/noaa/36038/noaa_36038_DS2.pdf)
5. **Occupational Safety and Health Administration (OSHA)** — *Standard 1910.157: Portable Fire Extinguishers & Chemical Hygiene in Laboratories*. [osha.gov](https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.1450AppA)
6. **National Fire Protection Association (NFPA)** — *NFPA 10: Standard for Portable Fire Extinguishers & NFPA 101: Life Safety Code*. [nfpa.org](https://www.nfpa.org/)
7. **Centers for Disease Control and Prevention (CDC)** — *Heat-Related Illness Warning Signs and Emergency Management*. [cdc.gov](https://www.cdc.gov/disasters/extremeheat/pdf/Heat_Related_Illness.pdf)
8. **Environmental Studies (EVS) Institute** — *Disaster Preparedness Plan: Key Steps and Components*. [evs.institute](https://evs.institute/disaster-management/disaster-preparedness-plan-key-steps-components)
9. **Semantic Scholar Academic Research** — *Disaster Preparedness: Relationships Among Prior Experience, Personal Characteristics, and Distress (Sattler & Kaiser)*. [semanticscholar.org](https://www.semanticscholar.org/paper/Disaster-Preparedness%3A-Relationships-Among-Prior-Sattler-Kaiser/eae68e35084a99b308ee4c38efbbb62ec3f94238)
