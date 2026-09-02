# SafeZone — Guardians/Sentinels/Wardens Tier Games Specification

Source of truth: `guardians-age-11-13.pdf`, `sentinels-age-14-17.pdf`, `wardens-age-18-plus.pdf` (all three read in full, all pages). Legend: **[PDF]** = explicit requirement in a PDF · **[REC]** = recommendation, not required · **[GAP]** = NOT SPECIFIED IN PDF, needs team decision.

**NOT SPECIFIED**: content for Explorers (5–7) and Rangers (8–10) tiers — no PDFs provided for them. Everything below covers only Guardians/Sentinels/Wardens.

---

## PART 1 — Product Overview

All three tiers teach the **same 6 hazard categories** in the **same order**, each as its own module, each ending in exactly one Decision Checkpoint section. Only the *role* and *scope of responsibility* change — this is the core progression mechanic, not the hazards themselves.

| Tier | Age | Learning Path [PDF] | Modules | Sections | Est. time | Core skill added |
|---|---|---|---|---|---|---|
| Guardians | 11–13 | Floor-Wise Disaster Response | 6 | 23 | ~66 min | Self-evacuation decisions, by floor |
| Sentinels | 14–17 | Multi-Hazard Decision-Making & Peer Communication | 6 | 25 | ~69 min | + directing/reassuring 1 nearby peer, precise verbal reporting |
| Wardens | 18+ | Leadership, Evacuation Planning & Responder Coordination | 6 | 26 | ~69 min | + commanding a group, sequencing a whole floor, headcount accountability, responder handoff |

**Progression logic [PDF, explicit in each tier's intro note]:** Guardians = "what do *I* do." Sentinels = same judgment + "what do I say to the person next to me." Wardens = same judgment + "how do I sequence/command a whole floor and hand off to responders." Each tier's Module 1–6 content assumes and briefly restates the tier-below's rule before adding its own layer (e.g. Sentinels M1 opens by re-stating Drop-Cover-Hold, then adds aftershock awareness + peer direction).

**Shared engine: YES [REC]** — the 1:1 module-shape match (same 6 hazards, same type per module number, every module ending in one checkpoint) is strong evidence this was authored as one data set for one engine, not three separate designs.

Shared across all tiers: section reader/tracker, decision-checkpoint mechanic, module list UI, progress %, type badge rendering (Interactive/Simulation/Video+Quiz).
Tier-specific: prose content, role-framing, "communication" fields (Sentinels), "planning/accountability" fields (Wardens).
Module-specific: hazard content, checkpoint scenario.
Section-specific: lesson text, timing.

---

## PART 2 — Module Matrix (all 18)

Type/timing/section-count/name are exact **[PDF]**. Purpose is a 1-line summary of that module's content.

| Tier | # | Module Name | Type | Time | Sections | Purpose |
|---|---|---|---|---|---|---|
| Guardians | 1 | Earthquake: Drop, Cover, Hold On | Interactive | 11m | 4 | Drop-Cover-Hold, post-shake checks, floor-specific stair judgment |
| Guardians | 2 | Fire Evacuation: The PASS Method & Smart Exits | Simulation | 12m | 5 | Door-heat check, smoke behavior, floor-specific timing, PASS (trained-only) |
| Guardians | 3 | Floor-by-Floor Hazard Mapping | Interactive | 10m | 3 | Know your 2 exits + assembly point; what makes a route "blocked" |
| Guardians | 4 | Chemical Spill: Lab Safety Protocol | Video+Quiz | 10m | 3 | Don't ID/lean into a spill; use alternate exit even if longer |
| Guardians | 5 | Cyclone & Flood Shelter Procedures | Interactive | 11m | 4 | Stay-inside default; never wade moving water; combined cyclone+flood |
| Guardians | 6 | Multi-Hazard Compound Drill | Simulation | 12m | 4 | Earthquake+gas, fire+blocked-stair+lift-temptation, re-check-as-you-go |
| Sentinels | 1 | Earthquake: Beyond Drop-Cover-Hold | Interactive | 12m | 4 | Why not run (physics), aftershocks, giving 1-line direction to a Ranger |
| Sentinels | 2 | Fire: Reading a Building Under Stress | Simulation | 12m | 5 | Fire-type ≠ same reaction, compound fire scenarios, precise verbal reports, calming a panicking peer |
| Sentinels | 3 | Floor-by-Floor Hazard Mapping & Route Judgment | Interactive | 11m | 4 | Mental map from memory, real-time route judgment, choosing between two imperfect routes |
| Sentinels | 4 | Chemical & Lab Incident Response | Video+Quiz | 11m | 4 | Isolate+evacuate, correct eyewash/shower use, fumes-in-route judgment |
| Sentinels | 5 | Cyclone & Flood: Judgment Over Panic | Interactive | 11m | 4 | Lull ≠ all-clear, flood depth/current danger, using slow-disaster time to communicate |
| Sentinels | 6 | Multi-Hazard Compound Drill & Leading Under Pressure | Simulation | 12m | 4 | Sequencing (protect→assess→check secondary→act), coordinating a group's decision |
| Wardens | 1 | Earthquake: Command Decisions Under Shaking | Interactive | 12m | 4 | Self-safety-first-still, rapid triage, directive (not explanatory) instructions |
| Wardens | 2 | Fire: Coordinating a Multi-Group Evacuation | Simulation | 12m | 5 | Extinguish-vs-evacuate call, sequencing a building floor-by-floor, mid-evac redirect, sheltering-in-place as valid command decision |
| Wardens | 3 | Evacuation Planning & Building Hazard Mapping | Interactive | 11m | 4 | Pre-emergency floor knowledge, signaling hazards outward, headcount/roll-call accountability |
| Wardens | 4 | Chemical Incidents & First-Aid-Adjacent Response | Video+Quiz | 11m | 4 | Containment not identification, equipment coordination, first-aid-awareness boundaries |
| Wardens | 5 | Cyclone & Flood: Shelter Command | Interactive | 11m | 4 | Shelter-vs-relocate call, managing a group over hours, hard electrical/water rule |
| Wardens | 6 | Multi-Hazard Compound Command & Responder Handoff | Simulation | 12m | 5 | Capstone: sequencing + delegating to Sentinels/wardens + responder handoff |

**Fields common to every module [PDF, stated once in each tier's intro note, applies globally — not repeated per module]:**
- Completion requirement: all sections opened/read (see Part 8 progress rule).
- Feedback requirement: every Decision Checkpoint shows ✅ Right / ❌ Wrong with a 1–2 sentence explanation, plus (Guardians M1 only, explicitly) a "Key rule to remember" callout — **[REC]** to generalize this callout to all checkpoints for consistency, since only one PDF instance has it labeled.
- UI requirement: module card shows name, type badge, estimated time, section count, lock state (locked until prior module/tier unlocked — **[GAP]**: unlock *order* within a tier not specified, only that Sentinels can reference "Ranger tier" as below it).
- State tracked: which sections have been opened (drives %), which checkpoint choice was made (right/wrong), per-module completion flag.
- Player role: Guardians = self; Sentinels = self + one nearby peer; Wardens = commander of an unspecified-size group.
- Safety rules: never contradict or soften the PDF's stated rule (e.g. never suggest testing a damaged stair, never suggest holding breath through smoke, never suggest shutting off a flooded electrical panel yourself).
- Assets/content required: all lesson text is in the PDFs verbatim (usable as-is); **[GAP]** no illustrations/diagrams/audio specified — text-only content confirmed sufficient by the PDFs' own format.

---

## PART 3 — Section-by-Section Content

Full lesson prose is in the PDFs; reproduced condensed here (every section, none skipped) so a developer has the real content to key into data files. Each row: **Section — key content**. Checkpoint sections give scenario/correct/wrong (also captured fully in Part 4's master table, so not duplicated field-by-field twenty times here).

### Guardians (23 sections)
**M1 Earthquake** — 1: Drop/Cover/Hold On; don't run for stairs mid-shake. 2: after shaking, check injuries/damage/instruction before moving; use marked-safe stair, never lift. 3: ground/middle/top-floor differences (debris, crack-checking, aftershock pacing). 4: **Checkpoint** — cracked main stair vs. clear second stair → use the clear one, never "test" visible damage.
**M2 Fire** — 1: alarm sounds, move toward exit, don't hunt for the fire. 2: hand-on-door heat check; smoke → stay low, find 2nd route; never hold-breath-through smoke. 3: ground/1st–2nd/4th–5th floor–specific timing and stair-switch rules. 4: PASS method, only for small trained-fires, else evacuate. 5: **Checkpoint** — warm stair door → don't open, use alternate or shelter+call.
**M3 Hazard Mapping** — 1: know both exits + assembly point + a shelter spot, before you need to. 2: what counts as "blocked" (fire/smoke/water/structural damage/stalled crowd). 3: **Checkpoint** — Stair A clear, Stair B smoke under door → use A, don't "check" B.
**M4 Chemical Spill** — 1: smell/see something wrong → alert adult, move away, don't lean in. 2: don't walk through spill fumes to save time, use alternate exit. 3: **Checkpoint** — usual stair has fumes, alternate is 2 floors further → take the longer clear one.
**M5 Cyclone & Flood** — 1: cyclone = stay inside, interior room, never go out "to see." 2: never wade moving water; rising water on ground floor → go higher, don't try to exit through it. 3: combined cyclone+flood = stay in + be ready to move up; follow official instructions. 4: **Checkpoint** — ground floor, water seeping under door during cyclone → move to higher floor, don't step out to check.
**M6 Multi-Hazard** — 1: why real emergencies stack (earthquake→gas, fire during flood evac). 2: post-quake gas smell → no light switches/flames, evacuate via a route avoiding the smell. 3: fire + blocked stair + working lift → lift stays off-limits unless a responder says otherwise, use 2nd stair. 4: **Checkpoint** — post-quake gas smell near stairwell, alarm hasn't sounded → avoid switches, different route, alert adult now; don't flip the light on to see better.

### Sentinels (25 sections)
**M1 Earthquake** — 1: physics of why running is worse (unpredictable floor/falling objects). 2: aftershocks can hit later and finish off weakened structures — don't linger once clear. 3: your job near a Ranger (8–10) = one short clear instruction, not a lecture; tone matters. 4: **Checkpoint** — younger student frozen near cracked wall → give a short direction and physically lead them; don't assume they'll self-correct.
**M2 Fire** — 1: fire source changes the right reaction (electrical/oil/unknown); if unknown, treat as unknown — alarm, evacuate, don't improvise. 2: one-stair-blocked → use other, don't go back to check; both-smoke-filled → shelter+signal+call is legitimate, not failure; working lift ≠ safe lift. 3: report precisely (which stair, headcount, exact room) not vaguely. 4: short sentences with a panicking peer, no mid-evac "why" debates, guide don't push. 5: **Checkpoint** — peer wants to go back for a bag near the fire's origin → firmly redirect ("Leave it, we go now"), keep the group moving; don't let them go back "for a second."
**M3 Hazard Mapping** — 1: sketch your floor's 2 exits/assembly/1 shelter room from memory — faster under stress than reading a map. 2: a route is unsafe the moment it *currently* shows a hazard, no confirmation needed. 3: comparing two imperfect routes: fire/smoke > water > crowding for lethality; extra distance beats visible smoke. 4: **Checkpoint** — Stair A light haze, Stair B clear but +2 floors → take B, the extra distance is worth it.
**M4 Chemical** — 1: alert, isolate, evacuate per plan; never ID by smell/proximity. 2: eyewash/shower stations are for real direct exposure only, per training, not general precaution. 3: don't push through fume-filled stairwell — same logic as smoke, plus health risk. 4: **Checkpoint** — classmate got a chemical splash → direct them to eyewash/shower per protocol, get a trained adult; don't guess a home remedy.
**M5 Cyclone & Flood** — 1: "get somewhere else" instinct is often wrong for cyclones; a lull ≠ all-clear (storm eye). 2: floodwater hides depth/current/live-wire risk; even 15cm moving water can knock someone down; go higher and wait rather than cross unknown water. 3: slow disasters give you time — use it to confirm headcount and relay your location, don't assume others know. 4: **Checkpoint** — wind suddenly quiet, students want to check the courtyard → stay inside, wait for official all-clear; don't step out because it "seems calm."
**M6 Multi-Hazard** — 1: compound scenarios are the norm — keep re-evaluating, don't lock into your first plan. 2: sequence: protect self during shake → assess → check secondary hazard (gas) → THEN choose path; skipping the sequence is how people walk into worse hazards. 3: as senior-present, state hazard + state action + move ("Stair B has smoke — we're using Stair A, follow me"); confident tone prevents crowd freeze. 4: **Checkpoint** — post-quake, gas smell + cracked wall, younger students looking to you → redirect the group to the alternate stair with one clear instruction, report the gas smell once safe; don't debate whether it's "really gas" while standing near it.

### Wardens (26 sections)
**M1 Earthquake** — 1: Drop-Cover-Hold applies to you first — you can't lead injured. 2: post-shake rapid triage (injuries/damage/route-usability) within ~1 minute. 3: directive not explanatory instructions ("This way, other stairs"); position yourself to see group+route; redirect loudly if a route turns unsafe mid-evac. 4: **Checkpoint** — cracked stair base, people heading there out of habit → physically position yourself there and redirect immediately; don't assume they'll notice and self-correct.
**M2 Fire** — 1: warden may decide extinguish-vs-evacuate; electrical/oil fires never get water; any doubt = evacuate, no heroics. 2: sequence a building evacuation by hazard proximity (fire floor + floor above first); prevent bottlenecks, not just point at exits. 3: staircase fails mid-evac → redirect people already in motion (verbal/relay/physically block), don't wait for them to discover it themselves. 4: sheltering-in-place (closed door, exact location relayed, keep calm) is a legitimate command decision, not a failure. 5: **Checkpoint** — radio says a stair you already sent 15 people toward now has smoke → immediately relay redirect and personally verify the alternate is clear; don't assume they'll notice themselves.
**M3 Evacuation Planning** — 1: pre-emergency knowledge required: both exits, assembly point, nearest shelter room, typical headcount by time-of-day. 2: same hazard signals as other tiers, but your job is communicating them outward (to wardens, responders, the people you direct). 3: evacuation isn't complete until everyone's accounted for — headcount/roll-call/check-in, flag missing immediately. 4: **Checkpoint** — floor evacuated, headcount short by 2 → report missing + last-known location to responders immediately; don't re-enter to search yourself.
**M4 Chemical/First-Aid-Adjacent** — 1: your role is containment+evacuation, not ID/cleanup unless trained; relay location/labels/exposed-count to responders. 2: guide exposed person to eyewash/shower per protocol, get medical help — keep it orderly, don't substitute your own judgment. 3: you're not expected to diagnose/treat beyond training — calm the person, keep crowd back, relay accurate info, stay within certification. 4: **Checkpoint** — exposed person refuses eyewash station ("it's probably fine") → insist calmly, escort per protocol, call medical regardless of protest; don't respect the refusal and move on.
**M5 Cyclone & Flood Command** — 1: shelter-vs-relocate decision under incomplete information; default to the more conservative option, update as info arrives. 2: long-duration event = conserve supplies, check on vulnerable individuals, keep calm communication. 3: hard rule — never let anyone near an electrical panel/outlet floodwater has reached or may reach; isolate and wait for trained personnel. 4: **Checkpoint** — floodwater rising toward a ground-floor panel while group awaits transport → move the group fully away, wait for trained personnel; don't try to shut it off yourself.
**M6 Multi-Hazard Command (capstone)** — 1: converges personal safety + group direction + hazard judgment + accountability. 2: sequencing example (quake→damaged stair→gas leak): protect self → reassess → identify secondary hazard → THEN act, never "get out" as one undifferentiated instinct. 3: delegate to Sentinels/fellow wardens with clear bounded instructions ("You take the west stair group, report at north assembly"); vague delegation wastes the resource. 4: when responders arrive, shift from command to information-transfer (headcount, hazards, missing/injured), then follow their direction. 5: **Checkpoint** — responders arrive after a 10-minute multi-hazard event you've been managing → brief them concisely and transition to following their direction; don't keep running your own plan in parallel.

---

## PART 4 — Decision Checkpoints Master Table (all 18, one per module)

| Tier | Module | Scenario | ✅ Correct | ❌ Wrong |
|---|---|---|---|---|
| Guardians | 1 Earthquake | 3rd floor, main stair cracked, 2nd stair clear | Use the undamaged 2nd stair | Step carefully over the crack on the closer stair |
| Guardians | 2 Fire | Staircase door warm to touch | Don't open; use alternate or shelter+call | Open it quickly to see how bad it is |
| Guardians | 3 Hazard Mapping | Stair A clear, Stair B smoke under door | Use A, tell others B is unsafe | Check B "just to see" before deciding |
| Guardians | 4 Chemical | Usual stair has fumes, alternate is 2 floors further | Take the longer clear stair | Hold breath and go through the short way |
| Guardians | 5 Cyclone/Flood | Ground floor, water seeping under door, cyclone active | Move to higher floor, away from windows | Step outside to check how bad the flooding is |
| Guardians | 6 Multi-Hazard | Post-quake gas smell near stairwell, alarm not sounded | Avoid switches, different route, alert adult now | Flip the hallway light on to see better |
| Sentinels | 1 Earthquake | Younger student frozen near cracked wall | Short direction + physically lead them | Assume they'll figure it out alone |
| Sentinels | 2 Fire | Peer wants to go back for a bag near fire origin | Firmly redirect, "we go now," keep moving | Let them go back "for a second" |
| Sentinels | 3 Hazard Mapping | Stair A light haze, Stair B clear but +2 floors | Take B — extra distance worth it | Take A, "smoke isn't that bad yet" |
| Sentinels | 4 Chemical | Classmate got a chemical splash on hand | Eyewash/shower per protocol + trained adult | Guess a home remedy / ignore it |
| Sentinels | 5 Cyclone/Flood | Wind suddenly quiet, students want to check courtyard | Stay inside, wait for official all-clear | Go outside briefly, "seems calm now" |
| Sentinels | 6 Multi-Hazard | Post-quake gas smell + cracked wall, group looking to you | Redirect to alternate stair, one instruction, report gas after safe | Debate whether it's "really gas" near it |
| Wardens | 1 Earthquake | Cracked stair base, people heading there from habit | Physically block/redirect immediately | Assume they'll notice and self-correct |
| Wardens | 2 Fire | Radio: stair you sent 15 people toward now has smoke | Relay redirect immediately, verify alternate clear | Assume the group will notice themselves |
| Wardens | 3 Evac Planning | Floor evacuated, headcount short by 2 | Report missing + last-known location to responders | Re-enter the building to search yourself |
| Wardens | 4 Chemical/First-Aid | Exposed person refuses eyewash, "it's probably fine" | Insist calmly, escort, call medical regardless | Respect refusal, move on |
| Wardens | 5 Cyclone/Flood | Floodwater rising toward ground-floor electrical panel | Move group fully away, wait for trained personnel | Try to shut the panel off yourself |
| Wardens | 6 Multi-Hazard Command | Responders arrive after 10-min event you managed | Brief concisely, transition to following their direction | Keep running your own plan in parallel |

**Suggested game mechanic [REC]:** every checkpoint is structurally identical — a scenario paragraph + exactly 2 tappable choice cards (no more, no fewer, per the PDFs' consistent binary ✅/❌ format). Do not add a 3rd "partially correct" option; the source material is deliberately binary.

```
Scenario text renders
        ↓
Player taps one of exactly 2 choice cards
        ↓
Card locks, both cards reveal ✅/❌ styling
        ↓
Explanation text shown (the "why", drawn from the PDF sentence after the choice)
        ↓
"Continue" unlocks → section marked read → module completion % updates
```
Do not alter or soften any right/wrong pairing above — these are copied verbatim from the PDFs.

---

## PART 5/10/11 — Data Architecture & Types

**[REC]** Everything below the tier/module/section/checkpoint level should be **data, not hardcoded**: tier list, module list, section content, checkpoint scenario/choices/feedback, durations, types. This is what avoids 18 separate codebases — one `TierGameRenderer` component tree, driven entirely by JSON/TS-object content files (e.g. `content/guardians.ts`, `content/sentinels.ts`, `content/wardens.ts`), mirroring how `SCENARIOS` already drives the existing `/simulate` drill.

```typescript
export type ModuleType = "interactive" | "simulation" | "video-quiz";
export type TierId = "explorers" | "rangers" | "guardians" | "sentinels" | "wardens"; // explorers/rangers: GAP, no PDF

export interface DecisionCheckpoint {
  scenario: string;
  correct: { label: string; explanation: string };
  wrong: { label: string; explanation: string };
  keyRule?: string; // optional extra callout, e.g. Guardians M1
}

export interface Section {
  id: string;          // `${tierId}-m${moduleNum}-s${sectionNum}`
  number: number;
  title: string;
  estMinutes: number;
  body: string[];      // paragraphs / bullet groups, plain text or light markdown
  checkpoint?: DecisionCheckpoint; // only the last section of each module has this
}

export interface TierModule {
  id: string;           // `${tierId}-m${moduleNum}`
  number: number;        // 1-6
  name: string;
  type: ModuleType;
  estMinutes: number;
  sections: Section[];
}

export interface TierConfig {
  id: TierId;
  ageRange: string;      // "11-13"
  displayName: string;   // "Guardians"
  learningPath: string;  // "Floor-Wise Disaster Response"
  modules: TierModule[]; // always 6, per current PDFs
}

// per-user progress, keyed by section id
export interface TierProgress {
  sectionsRead: Set<string>;
  checkpointChoices: Record<string, "correct" | "wrong">; // moduleId -> choice made
}

export function moduleCompletionPct(mod: TierModule, progress: TierProgress): number {
  const read = mod.sections.filter(s => progress.sectionsRead.has(s.id)).length;
  return Math.round((read / mod.sections.length) * 100); // PDF's exact formula
}
```

`ModuleType` maps to a render component: `interactive` → `<InteractiveSectionEngine>` (scrollable prose + checkpoint), `simulation` → same engine, framed with more scenario/branching prose (PDFs use "Simulation" for the modules with the most compound/multi-step content — **[GAP]**: PDFs never specify a mechanically different simulation *interaction*, only richer content; treat as content-only distinction unless team decides otherwise), `video-quiz` → `<VideoQuizEngine>` (**[GAP]**: no actual video asset or quiz question bank specified in any PDF — only "Video + Quiz" as a type label; the 3 Chemical modules' content is prose identical in shape to the Interactive ones. Needs clarification: is there real video content coming, or should Chemical modules render as Interactive until video assets exist?).

---

## PART 6 — Game Types, As Actually Specified

- **Interactive [PDF]**: sequential text sections, ending in one binary Decision Checkpoint. No PDF content implies drag-and-drop, dragging, or spatial interaction for any Interactive module — it's a reading + 1 tap-choice format.
- **Simulation [PDF]**: same section/checkpoint structure; content is denser/more branching in prose ("Floor-Specific Scenarios," "Compound Fire Scenarios") but the PDFs do not specify a distinct simulation *engine* (no physics, no timer, no fail-state beyond the checkpoint). **[REC]**: could reuse the existing `/simulate` 3D EvacuationGame for these specifically, since the content (fire spread, staircase choice, smoke) already matches that engine's mechanics closely — worth a product decision, not assumed here.
- **Video + Quiz [PDF]**: label only. No video script, no quiz question bank, no pass threshold specified anywhere in any of the 3 PDFs. **[GAP — needs clarification before building]**: what plays in the video, how many quiz questions, what's the pass mark.

---

## PART 7 — Age Progression, Same Hazard Across Tiers

| Hazard | Guardians (11–13) | Sentinels (14–17) | Wardens (18+) |
|---|---|---|---|
| Earthquake | Drop-Cover-Hold; check-before-move; floor-specific stair judgment | + aftershock awareness; give 1 short instruction to a Ranger nearby | + self-safety-first-still; rapid triage; directive command instructions to a group |
| Fire | Door-heat/smoke check; floor-specific timing; PASS if trained | + fire-source-type judgment; precise verbal reporting; calming a panicking peer | + extinguish-vs-evacuate authority call; sequencing a whole building's evacuation; mid-evac redirect of people already in motion |
| Hazard Mapping | Know your 2 exits + assembly point; what "blocked" means | + mental map from memory; judging between 2 imperfect routes | + pre-emergency floor knowledge; signaling hazards *outward*; headcount/roll-call accountability |
| Chemical | Don't ID a spill; use the longer clear exit | + correct eyewash/shower use; fumes-in-route judgment | + containment without contact; coordinating equipment use; first-aid-boundary awareness |
| Cyclone/Flood | Stay-inside default; never wade moving water | + lull-≠-all-clear judgment; using slow-disaster time to communicate | + shelter-vs-relocate command call; managing a group over hours; hard electrical/water rule enforcement |
| Multi-Hazard | Re-check plan as conditions change (quake+gas, fire+lift-temptation) | + explicit sequencing model (protect→assess→check secondary→act); coordinating a group's decision | + capstone: sequencing + delegating to Sentinels/wardens + responder handoff |

---

## PART 8 — User Flow & Progress Tracking

```
Tier select → Tier home (module list + %) → Module intro → Section 1..N
  → (each section: read → auto-marked read → % updates live)
  → final section = Decision Checkpoint → choice → feedback → Continue
  → Module marked complete → back to Tier home → next module
```

**[PDF, explicit, Guardians]**: *"Track completion % as (sections read / total sections in module) × 100, updated live as the student scrolls/opens each section — not only on final 'Mark Complete.'"* This is stated once in Guardians and the other two tiers say only *"sections track completion the same way as other tiers"* — so this exact live-update rule is confirmed to apply to Sentinels and Wardens too, by their own cross-reference, not by inference.

**[GAP]**: no PDF specifies overall-tier completion %, cross-module unlock gating, retry rules for a wrong checkpoint answer, or whether a wrong answer blocks progress or just shows feedback and continues.

---

## PART 9 — Screens

| Screen | Purpose | Required [PDF] | Recommended [REC] |
|---|---|---|---|
| Tier selection | Pick age tier | Tier cards exist (already built in current `/learn`) | Progress ring per tier |
| Tier dashboard | Module list + progress | Module cards w/ type, time, section count, % | Streaks/stats (already present in current build, not from these 3 PDFs) |
| Module intro | Set expectations | Name, type, time, section count | — |
| Section/content | Deliver lesson prose | Numbered section, title, time, body text | Progress bar showing N/total read |
| Decision checkpoint | The graded moment | Scenario + exactly 2 choices + explanation | Locked choice after tap, can't change answer |
| Module completion | Close the loop | All sections read = complete | Badge/checkmark (existing badge system) |
| Overall progress | Tier-wide view | **[GAP]** no formula specified beyond per-module % | Aggregate = avg of module % |

---

## PART 12 — Development Phases

| Phase | Task | Priority | Depends on | Output |
|---|---|---|---|---|
| 1 Foundation | `TierConfig`/`Section`/`Checkpoint` types + content-loading | Must | — | Typed, empty-content-ready engine |
| 2 Shared UI | Module card, section reader, progress bar | Must | 1 | Reusable components |
| 3 Content | Transcribe all 74 sections from Part 3 into 3 content files | Must | 1 | `content/guardians.ts` etc. |
| 4 Interactive engine | Section sequencing + live % | Must | 2,3 | Working reader |
| 5 Checkpoint engine | 2-choice tap, lock, feedback | Must | 4 | Working checkpoint |
| 6 Simulation | Decide: reuse `/simulate` engine or same as Interactive | **[GAP — clarify first]** | 5 | — |
| 7 Video+Quiz engine | Needs video/question content first | **[GAP — clarify first]** | 5 | — |
| 8 Guardians tier | Wire content file 3 into engine | Must | 5 | Playable tier |
| 9 Sentinels tier | Same | Must | 5 | Playable tier |
| 10 Wardens tier | Same | Must | 5 | Playable tier |
| 11 Progress/analytics | Persist `TierProgress`, wire into existing badge/leaderboard UI | Must | 8,9,10 | Saved progress |
| 12 Polish/deploy | QA pass on all 18 modules against Part 4 table | Must | 11 | Shippable |

---

## PART 13 — Must Build vs Nice to Have vs Needs Clarification

**MUST BUILD [PDF-required]:** all 18 modules, all 74 sections' real content, all 18 checkpoints exactly as written, live % tracking, module type badges.

**NICE TO HAVE [REC]:** retry-on-wrong-answer, per-tier aggregate progress ring, illustrations per section, audio narration, badge-per-module.

**NEEDS CLARIFICATION [GAP]:**
1. Video+Quiz: what video, what questions, what pass mark.
2. Simulation modules: genuinely different engine (e.g. reuse 3D `/simulate`) or same reader as Interactive with denser text?
3. Wrong checkpoint answer: block progress, or show feedback and allow continue?
4. Cross-module unlock order within a tier.
5. Explorers (5–7) / Rangers (8–10) content — no PDFs exist yet.

---

## FINAL — First 15 Dev Tasks, In Order

1. Add `TierConfig`/`TierModule`/`Section`/`DecisionCheckpoint` types (Part 5).
2. Build `content/guardians.ts` from Part 3's Guardians section — full text, not summaries.
3. Build a single `<SectionReader>` component (title, body, live-read-tracking on mount).
4. Build `<CheckpointCard>` (2 choices, lock-on-tap, ✅/❌ reveal, explanation).
5. Wire `moduleCompletionPct()` and confirm it matches the PDF's live-update rule.
6. Build `<ModuleIntro>` + `<ModuleCard>` (list screen).
7. Get Guardians Module 1 fully playable end-to-end as the first vertical slice.
8. QA Module 1 against its row in Part 4 — scenario/choices/explanations must match verbatim.
9. Repeat 2–8 for Guardians Modules 2–6.
10. Build `content/sentinels.ts`, reusing the same components — confirms the engine is genuinely shared.
11. Build `content/wardens.ts`.
12. Wire tier completion into the existing badge system already in `LearnPage.tsx`.
13. Resolve the Video+Quiz clarification (Part 13 #1) before touching those 3 modules per tier.
14. Resolve the Simulation-engine clarification (Part 13 #2) before touching those modules.
15. Full pass: open every one of the 18 checkpoints, verify against Part 4 table exactly.

**Don't start coding yet:** Video+Quiz modules (9 of 74 sections — 3 per tier) and Simulation-specific mechanics, until Part 13's clarifications land — building against a guess here is the most likely source of rework.

**Best first prototype: Guardians Module 1** — shortest (4 sections), simplest type (Interactive), and its checkpoint is the cleanest binary example in the whole set. Getting it fully right proves the entire shared engine.
