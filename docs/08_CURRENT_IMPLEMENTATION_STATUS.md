# 08. Current Implementation Status

> **Last updated:** September 6, 2026 v5 · Branch `main` · **Build green (Next 16.3.2 + TS + framer-motion + GSAP)**
>
> This document tracks what is **actually built and working** versus what remains
> spec-only. It complements docs 01-07 (the design blueprint) - nothing here changes
> the blueprint; it reports progress against it.
> **Sept 6 v5 delta:** Mobile navigation overhaul and /learn mobile drawer (Task 1.1), sub-15ms dynamic A* reroute benchmarks across 6 floors and architecture assets (Task 1.2), live WebSocket & drill event bus integration (Task 2.4). Active issues documented for verbatim curriculum full-page reader (Issue 2.5), mandatory cadet onboarding & /profile route (Issue 2.6), live disaster ingestion & injection (Issue 3.3), and Mitra voice alert verbalization (Issue 4.3).

---

## 1. Status Snapshot by Pillar

| Pillar / Module | Status | Notes |
| :--- | :--- | :--- |
| Landing & navigation shell | Built | `LandingPage` HazardScrollScene slow 360-degree scroll collapse, ImmersiveScene fallback, parallax/tilt/ripple, `Navbar` prefetch, mobile menu full-screen overlay with opaque backdrop and scroll-lock (Task 1.1) |
| Pillar I - Pedagogical Engine | Built / Active Issue | `LearnPage` with age-tiered curriculum, interactive sidebar nav, mobile quick bar and slide-over drawer, Settings/Profile/Leaderboard subviews built (Task 1.1). In Progress: Verbatim NDMA curriculum ingestion (103 sections across 28 modules), full-page scroll reader replacing modal popups, dynamic progress ring (Issue 2.5). |
| User Identity & Profile | Active Issue | In Progress: Mandatory Cadet Onboarding gate blocking non-home routes (Name, Age, Grade, School), age-to-tier NDMA mapping, dedicated `/profile` route, avatar link to profile (Issue 2.6). |
| Pillar II - Simulation Engine | Built | Playable 3D evacuation drills, 4 JSON scenarios, fire/smoke/door/blockages, NPC crowd, synthesized WebAudio, full run telemetry, per-hazard overlays. Dynamic A* rerouting benchmarked at sub-15ms (0.18ms initial, 0.12ms dynamic reroute across 6 floors to stairwell portals) with automated pytest and profiler (Task 1.2). |
| Pillar II - Admin Analytics | Built | `/admin` dashboard: KPIs, canvas route & casualty heatmap, drill log table |
| Pillar III - Command Hub | Built / Active Issue | `/command` page wired to live WebSocket & local drillEventBus for real-time telemetry updates (Task 2.4). In Progress: Live critical disaster alert ingestion (Open-Meteo flood/severe weather, USGS earthquake) and emergency incident injection panel (Issue 3.3). |
| Global FX Layer | Built | Custom cursor, RippleLink, parallax/tilt/reveal, framer-motion, ScenarioEffects, Geist font |
| "Mitra" Crisis Companion | Rule-based + GSAP | Contextual coaching in sim. In Progress: Web Speech API voice alert verbalization for active emergency events (Issue 4.3). |
| Backend / persistence | Built / Active Task | DynamicPathfinder service running with sub-millisecond graph routing. FastAPI WebSocket hub. In Progress: Telemetry run persistence endpoints (Task 3.1). |
| Multiplayer drill battles | Not started | Spec-only (docs 01/02) |
| Mobile / touch controls | Not started | Current 3D game is keyboard-only (WASD/arrows + SHIFT/B) |

---

## 2. What's Implemented in Detail

### 2.1 Immersive Simulation Engine (`frontend/src/components/simulate/`)

**Playable evacuation drill** (`game/EvacuationGame.tsx`, 856 lines, Three.js WebGL):

- Third-person follow camera with quake-shake intro; WASD/arrow movement
- Procedural fire ignition + cell-to-cell spread; smoke layer that drains oxygen unless crawling (SHIFT); panic meter with cognitive freeze above 70; box-breathing recovery (B)
- **Door-aware propagation:** amber door tiles (glyph `D`) block fire & smoke until the player pushes through them - doors act as player-controlled firebreaks; visually flatten to teal threshold when opened
- **Multiple exits:** any green assembly beacon (glyph `E`) completes the run; beacons animate with pulsing rings
- **Scripted mid-run blockages:** compound-disaster events collapse corridors mid-drill with rubble meshes, with a pre-warning banner (e.g., Quake+Fire scenario seals NE wing at T+40s after structural groaning warning at T+30s)
- **NPC crowd (~18 agents):** BFS distance-field pathing toward nearest reachable exit, separation forces prevent stacking, slowed in smoke, become red casualties in fire, fade out upon evacuation
- **Synthesized WebAudio (zero assets):** evacuation alarm beeps (760Hz square wave @2.2s), bandpass-filtered white noise fire crackle (proximity-driven loudness), panic-scaled heartbeat thuds (55-140 BPM)
- **Panic vignette overlay:** screen-edge red vignette intensifies when panic > 60 -- now **GSAP-driven** (`gsap.to` 0.3s power2.inOut, `killTweensOf` on update, `useRef` target) instead of instant style jump
- **Cinematic materials (Aug 26 v2, not blocks):** `MeshStandardMaterial` PBR walls (`0x1a2544` roughness 0.88), metal doors (emissive 0.45), concrete floor grid, player capsule emissive 0.65 + point light, beacons with `emissiveIntensity 1.15` + `PointLight`, NPC hue variance, rubble PBR -- feels like simulation not Lego
- **Hyper-real fire/smoke:** flame `CanvasTexture` radial gradient (white→flame→glow→transparent) on 3-plane cross + core + additive `Points`, 4 pooled `PointLight`s flicker-moved to nearest fires each tick, smoke soft puff `CanvasTexture` with drift `y = 1.7+sin(t+drift)*0.12` and `opacity 0.36+0.08*sin`
- **HUD spring meters:** oxygen/panic bars use **700ms `cubic-bezier(0.16,1,0.3,1)` width transition** (motion.dev spring preset) + 300ms background lerp -- avoids per-tick JS cost, stays 60fps
- **Collision system:** player corner-sampled AABB against wall cells; NPCs use flow-field + walls

### 2.2 Data-Driven Scenarios (`frontend/src/data/scenarios.json`)

Scenarios are fully data-driven - maps are ASCII grids (`#` wall, `.` floor, `P` spawn,
`E` exit, `F` fire seed, `D` door) parsed by `game/floorplan.ts`, which pads ragged
rows so malformed JSON cannot crash the sim. Four scenarios ship today:

| ID | Name | Hazard | Difficulty | Time Limit | Distinctive mechanics |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `lab-fire-east-wing` | Lab Fire | Fire | ●○○ | 120s | Original baseline map, standard orange fire |
| `quake-compound` | Quake + Fire | Fire | ●●○ | 140s | Doors, 2 exits, mid-run aftershock blockage seals NE wing |
| `chem-spill` | Chemical Spill | Toxic Gas | ●●● | 100s | Fast green gas spread (0.55 chance), 2 exits, storage-closet obstacles |
| `blackout-fire` | Blackout Drill | Fire | ●●○ | 150s | Near-zero visibility (fog density 0.055), slow spread, long time limit |

Each scenario defines: `id`, `name`, `badge`, `hazardLabel`, `difficulty`, `brief`, `timeLimit`, `spreadInterval`, `spreadChance`, `fogDensity`, `colors` (flame/glow/smoke hex), `map[]`, and optional `blockages[]` with `t`, `warnT`, `cells`, `warnMessage`, `message`.

**New scenarios require no code changes** - only a new JSON entry.

### 2.3 Run Telemetry & Generated Debriefs (`game/telemetry.ts`)

Every run records: route heat (4 Hz grid sampling), fire-cell entries, standing vs.
crawling smoke exposure seconds, panic freeze duration, breath count, distance moved,
violations with timestamps, death/exit cells, scenario ID, and creation timestamp.

- Post-run debriefs are **generated from actual behavior** (e.g., "Spent 14s standing in smoke (lost ~63% O₂) - hold SHIFT to crawl low") instead of static text arrays
- Violation types tracked: `entered_fire`, `smoke_exposure`, `panic_freeze`, `route_blocked`, `breathed`, `exit_reached`
- Runs persist to `localStorage` (`safezone_drill_runs_v1`, capped at 500) via two
  functions - `saveRun()` / `loadRuns()` - deliberately isolated so a backend can
  replace storage without touching game or dashboard code

### 2.4 Admin Analytics Dashboard (`frontend/src/app/admin/`)

`AdminDashboard.tsx` - Pillar 2 → Pillar 3 telemetry flow:

- **KPI cards:** total drills, success rate (color-coded ≥70% teal, <70% amber), avg escape time, avg peak panic (red if >70), top failure mode with count
- **Canvas route & casualty heatmap:** teal traffic density (aggregated per-cell visit heat across runs), red casualty dots at death cells, green exit markers, amber spawn marker; per-scenario filter dropdown
- **Recent drills table:** scenario, result (EVACUATED/CASUALTY), time, O₂ left, peak panic, violation count, timestamp; last 12 runs shown
- **Empty state:** link to run first drill when no data exists

### 2.5 Simulate Page UX (`SimulatePage.tsx` -- upgraded Aug 26, build green)

- **Briefing phase:** scenario picker with name, hazard label, difficulty dots (●/○), control keys reference (WASD, SHIFT, B), "Start Drill" + "Command Analytics" link
- **Running phase:** live HUD panel (time countdown, oxygen meter, panic meter, score, CRAWLING/BREATHING badges), message ticker, panic vignette overlay -- **meters now spring-animated (CSS 700ms), vignette GSAP-smoothed**
- **Ended phase:** generated debrief (✓/✗ lines from `generateDebrief()`), result stats (time, O₂, peak panic, score), "Retry Drill", "View Analytics", "Back to Briefing"
- **Mitra dock:** floating button → panel showing context-aware coaching derived from live `GameState` (panic, oxygen, crouching, breathing, time) -- **GSAP `fromTo` opacity/y on toggle, `mitraPanelRef` target**

### 2.6 Landing Page (`LandingPage.tsx`)

- Immersive 3D parallax scene (`ImmersiveScene.tsx`): wireframe campus tower, procedural terrain waves, icosahedron core, pulsing hazard rings, particle field, mouse parallax + scroll depth
- Hero with rotating hazard words (EARTHQUAKE/FIRE/FLOOD/CYCLONE/TSUNAMI)
- Stat counter cards with tilt effect, three-pillar navigation cards with ripple links
- Emergency mode CTA with radar animation, tech stack marquee, footer

### 2.7 Learn Page (`LearnPage.tsx`)

- Sidebar: profile avatar, SVG progress ring (35%), quick stats grid (lessons/score/time/drills), interactive nav tabs (Dashboard/Certificates/Leaderboard/Settings) with toast on switch
- Age-tier selector: 5 tiers (Explorers 6-9, Rangers 10-13, Guardians 14-16, Sentinels 17-20, Wardens 21+) with progress bars, active selection state
- Module cards: selectable with teal glow, locked modules show toast, completion scores
- Achievement badges: clickable with earned/locked states, toast feedback

### 2.8 Command Hub (`CommandPage.tsx`)

- Live clock (real-time HH:MM:SS), status strip (students/safe/trapped/unaccounted/safe rate)
- Floor status matrix: selectable rows with teal left border, detailed toast per floor
- Campus blueprint SVG: interactive floor labels, animated fire indicator on 4F, animated evac route dashes
- CAP alert feed: clickable alerts with source detail toast
- Connected agencies: clickable rows with ping feedback toast
- Action bar: Emergency Broadcast, QR Headcount Scan, Generate NDMA Report - all with simulated feedback toasts

### 2.9 Navigation & Performance

- **Prefetched routes:** all `<Link>` tags across Navbar, RippleLink, and mobile menu use `prefetch={true}` for instant page transitions
- **GPU-accelerated cursor:** `translate3d` transforms, `mouseover` event delegation (no `.closest()` on every `mousemove`), `will-change: transform`
- **Tactile active states:** `:active { transform: scale(0.95-0.98) }` on all buttons, cards, nav tabs, floor rows, badges, avatar
- **Zero tap delay:** `touch-action: manipulation` + `-webkit-tap-highlight-color: transparent` globally
- **No blocking scroll:** removed `scroll-behavior: smooth` from `html` to allow instant App Router transitions
- **Animation perf (Aug 26):** vignette & Mitra use GSAP `killTweensOf` + 0.3s tweens (no layout thrash); HUD bars use GPU-composited `width` + `cubic-bezier(0.16,1,0.3,1)` (motion.dev) -- 700ms, no JS per tick; ImmersiveScene tint throttled to ~10 Hz and respects `prefers-reduced-motion`

### 2.10 Home Architecture / ImmersiveScene Upgrade (Aug 26 -- why & what)

**Why upgrade?** Landing is the 5-second credibility test for judges. The previous backdrop was time-only (`t * 0.015` etc.) -- it felt alive but not *responsive*. As users scroll through pillars → emergency → final CTA, a static scene flattens the narrative. Inspired by `design.inspo` entries **scrolltide.co, neuform.io, horizonX, GSAP timelines, motion.dev springs**, the upgrade makes depth *read* the scroll position.

**What changed -- `frontend/src/components/fx/ImmersiveScene.tsx:50-210` (non-breaking, build green):**
- **Per-particle `mixFactors[]` (2400)** stored at init; base colors `lerpColors(accent, secondary, u)` -- enables scroll tint without reallocating buffers.
- **Scroll-tint + opacity fade in `tick`:** `pMat.opacity = 0.75 - scrollP*0.18`; tint re-lints `col` buffer at ~10 Hz (`Math.floor(t*10)%3`) with `bias = u + tint*(1-u)*0.6` toward secondary -- subtle shift to deeper blue as you reach Emergency Mode, foreground stays legible.
- **Terrain wave is scroll-aware:** `sin(x*0.28 + t*0.7 + scrollP*2) * cos(y*0.24 + t*0.5 - scrollP*1.5)` with amplitude `*(1+scrollP*0.2)` -- waves crest a bit higher near the bottom, hinting at urgency.
- **Distant orbit ring:** new `RingGeometry(25,27)` at y=-10, opacity 0.04, rotates `y = t*0.08 + scrollP*0.3` -- adds atmospheric depth, draws the eye toward the tower.
- **Core & tower scale with scroll:** `core.rotation.x = t*(0.4+scrollP*0.1)` · `core.rotation.y = t*(0.55+scrollP*0.2)` -- rotation subtly accelerates as you commit, echoing rising stakes.
- **Hazard rings pulsate organically:** `scale = 1 + sin(t*2+i)*0.3 + p*12`, `opacity = 0.45*(1-p)*(0.7+sin(t*3+i)*0.3)` -- less metronomic, more “breathing”.

**Cost:** +1 `RingGeometry`, +2400 float `mixFactors`, ~7k float writes at 10 Hz (negligible). Respects `prefers-reduced-motion` (no `requestAnimationFrame` when `reduced`).

### 2.11 HazardScrollScene v3 -- 360° slow + full-screen cover (Aug 26 late, per user + emil/impeccable/taste)

**User ask:** too many rotations → one very slow 360° while building collapses (complete by tsunami), tsunami lifts particles, fire covers entire screen before hero.

**Applied per skills:**
- **emilkowalski:** *Frequency* (orbit once → delight; dust/tower/core spins seen constantly → removed), *Purpose* (orbit = spatial explanation, cover = prevent jarring hero pop), *Easing* `power2.out` for cover enter, `transform/opacity` only.
- **tasteskill:** Read as SIH landing for judges, variance 8/motion purposeful → single orbit vs spin-soup, anti-default (no AI purple, no 3 equal cards).
- **impeccable:** One decisive motion, perpetual micro only where needed (water Gerstner, ember flicker) -- craft-floor respected.

**Code `frontend/src/components/fx/HazardScrollScene.tsx`:**
- Orbit `477-492`: `orbitProgress=min(scrollP/0.33,1)*2PI`, `radius 17`, lerped 0.06, `lookAt 1.2+scrollP*1.8` -- 360° completes exactly at 0.33.
- Removed `dust.rotation`, `tower.rotation`, `coreGroup` spin, `halo`, `flameField` sway -- `tick 496` now only `dust.position.y` barely breathing, `terrain 0.45→0.18` amplitude.
- Water `236`: `Plane 140×140 ShaderMaterial` Gerstner `uTime/uScroll` + foam, `140×140` high-poly vs 96² low-poly.
- Fire `256`: `EMBER 1400 ShaderMaterial size+flicker` + `flameField 5 planes` + curtain `Plane 36×36 ShaderMaterial smoke+fire` child of `camera z -9.5` (`395`), timeline `0.74→1` `uCover/uOpacity` → covers lens before hero (`484`).
- Debris lift `498`: `scrollP 0.34-0.68 y+=sin*0.0012` floats with tide.
- Curtain holds `0.82-0.96` then fades `0.96→0` as pin releases → hero reveals.

### 2.12 Mobile Navigation Overhaul & Learn Slide-Over (Task 1.1 / Task 2.1 - 2.3)

Implemented mobile UX fixes and component hierarchy improvements across the portal:
- **Navbar Mobile Full-Screen Overlay:** Updated `Navbar.module.css` and `Navbar.tsx` so the mobile drawer acts as an opaque full-screen modal (`position: fixed; inset: 0; background: rgba(10, 15, 30, 0.98); backdrop-filter: blur(16px); z-index: 9999; height: 100dvh;`). Body scroll is locked during open state (`document.body.style.overflow = mobileOpen ? "hidden" : "unset"`), preventing underlying text from bleeding through.
- **Learn Page Mobile Redesign:** Added a top stats bar on mobile (`@media (max-width: 768px)`) and moved the SVG progress ring and navigation buttons into an off-canvas slide-over drawer triggered by "View My Progress". This brings the NDMA Tier Selector and interactive module cards directly above the fold.
- **Unified Sub-Views:** Added `LeaderboardView.tsx`, `SettingsView.tsx`, and `ProfileView.tsx` within `frontend/src/components/learn/` styled with dark-mode design tokens (Geist typography, cyan `#00D4AA`, amber `#F59E0B`, emerald `#10B981`).

### 2.13 Sub-15ms Dynamic A* Multi-Floor Rerouting Engine & Architecture Assets (Task 1.2)

Completed backend pathfinder validation and architectural visualization:
- **Sub-15ms Rerouting Benchmark:** Validated graph pathfinding performance in `backend/app/services/pathfinder.py` using `tests/test_pathfinder_benchmark.py` (4/4 passing) and a standalone profiler `benchmarks/benchmark_pathfinder.py` over 300 runs.
  - Initial search latency: 0.18ms average (p95: 0.41ms).
  - Dynamic reroute around hazard blockages: 0.12ms average (p95: 0.25ms).
  - All benchmarks well within the strict SIH 15ms target.
- **Multi-Floor Egress Logic:** Added dynamic stairwell egress portal discovery on upper floors (Floors 1-5). Ground floor (Floor 0) directs to exterior assembly exits (`E`), while upper floors route to nearest accessible stairwell columns (`[5, 10, 15, 20]`).
- **Production Architecture Diagrams:** Generated vector SVG flowchart at `docs/assets/gnn_astar_routing_architecture.svg` and `frontend/public/assets/gnn_astar_routing_architecture.svg` detailing the Dual-Engine Hybrid Pipeline (FastAPI, NetworkX, GNN Edge Weights, A* Dynamic Search).

### 2.14 Real-Time WebSocket Telemetry & Drill Event Bus (Task 2.4)

Integrated live telemetry transport for the Command Hub:
- Connected `/command` to FastAPI WebSockets (`/ws/command`) and implemented a local fallback event bus (`drillEventBus.ts`).
- Active simulation runs and casualty events in `/simulate` broadcast updates to the Floor Status Matrix and live student count on `/command` with zero manual refresh.
- Handled `EMERGENCY_BROADCAST` dispatching for simulated campus crisis alerts.

### 2.15 Active Sprint Issues (September 6 - September 9)

- **Issue 2.5: Verbatim Curriculum Ingestion & Full-Page Scroll Reader:**
  - Ingest verbatim NDMA curriculum across all 5 tiers (Explorers 11 sections, Rangers 18 sections, Guardians 23 sections, Sentinels 25 sections, Wardens 26 sections - total 103 sections across 28 modules) without truncation.
  - Eliminate modal popups (`ModuleViewer.tsx`) and build a dedicated full-page scroll layout (`/learn/[tierId]/[moduleId]` or inline reader with `<- Back to Modules`).
  - Top sticky neon-teal progress bar reflecting vertical scroll percentage.
  - Mid-lesson progress persistence in `localStorage` (`safezone_module_progress_v1`) to resume reading at exact scroll positions.
  - Real-time aggregate progress ring calculation on `/learn` sidebar based on completed sections.
- **Issue 2.6: Mandatory Cadet Onboarding Gate & Dedicated /profile Route:**
  - Route interceptor: Visiting any page beyond the home page (`/`) requires an active cadet profile. If missing, a mandatory onboarding modal prompts for Cadet Name, Age, Grade / Standard, and School.
  - Automated NDMA tier assignment based on age (5-7 Explorers, 8-10 Rangers, 11-13 Guardians, 14-17 Sentinels, 18+ Wardens).
  - Dedicated `/profile` route (`frontend/src/app/profile/page.tsx`) with Cadet Identity card, Tier badge, Earned Certificates, Drill History, Leaderboard Standings, and Edit Profile drawer.
  - Navbar avatar link updated to route directly to `/profile` displaying user initial.
- **Issue 3.3: Real-Time Disaster Ingestion & WebSocket Incident Injection:**
  - Automated ingestion of critical disaster feeds: Open-Meteo Severe Weather / Flood API and USGS Earthquake GeoJSON feed.
  - Strict filtering: Surface only critical incidents (flood alerts, gale winds > 65 km/h, regional earthquakes > M4.5) to avoid notification fatigue.
  - Prominent emergency ticker on `/command` displaying alert level, affected region, and immediate safety protocols.
  - Incident injection control panel for campus safety officers to simulate localized emergencies (electrical fire, chemical spill, gas leak).
- **Issue 4.3: Mitra AI Voice Crisis Alert Verbalization:**
  - Automatic voice broadcast via Web Speech API (`window.speechSynthesis`) when an emergency alert or incident injection is active, guiding occupants on `/simulate` and `/command`.

---

## 3. File Architecture

```
frontend/src/
├── app/
│   ├── page.tsx              → Landing (/)
│   ├── learn/page.tsx        → Learn (/learn)
│   ├── simulate/page.tsx     → Simulate (/simulate)
│   ├── command/page.tsx      → Command Hub (/command)
│   ├── admin/page.tsx        → Admin Analytics (/admin)
│   ├── layout.tsx            → Root layout + fonts
│   └── globals.css           → Design system tokens + utilities
├── components/
│   ├── Navbar.tsx             → Mode switcher, alert, avatar, mobile menu
│   ├── landing/               → LandingPage + module CSS
│   ├── learn/                 → LearnPage + module CSS
│   ├── simulate/
│   │   ├── SimulatePage.tsx   → Briefing/HUD/debrief shell
│   │   ├── SimulatePage.module.css
│   │   └── game/
│   │       ├── EvacuationGame.tsx  → 856-line Three.js game
│   │       ├── floorplan.ts       → ASCII map parser + scenario loader
│   │       └── telemetry.ts       → Run recording + generated debriefs
│   ├── command/               → CommandPage + module CSS
│   ├── admin/                 → AdminDashboard + module CSS
│   └── fx/
│       ├── ImmersiveScene.tsx → Landing fallback wireframe (kept intact)
│       ├── HazardScrollScene.tsx → Cinematic sci-fi 3-act scroll (GSAP ScrollTrigger, PBR glass tower, water/fire)
│       ├── CustomCursor.tsx   → GPU-accelerated cursor
│       ├── RippleLink.tsx     → Magnetic prefetch links
│       ├── Parallax.tsx       → Scroll parallax wrapper
│       ├── TiltCard.tsx       → Mouse-following tilt
│       ├── Reveal.tsx         → Intersection-observer fade-in
│       ├── CountUp.tsx        → Animated number counter
│       └── ConstellationField.tsx → Canvas particle system
├── data/
│   └── scenarios.json         → 4 scenario definitions (maps + configs)
└── ...
```

---

## 4. Actual Tech Stack (as built)

| Layer | Blueprint (docs 03) | As built today |
| :--- | :--- | :--- |
| Framework | Next.js 15 PWA | Next.js 16.3.2 (App Router, Turbopack), React 19 |
| 3D | React Three Fiber + Rapier | Plain Three.js r149 + **HazardScrollScene** (PBR glass, ScrollTrigger 300% pin, water/fire shaders) + fallback `ImmersiveScene` |
| Motion | framer-motion | **GSAP 3.13 + ScrollTrigger** (vignette `to`, Mitra `fromTo`, 3-act pin scrub) + CSS spring `cubic-bezier(0.16,1,0.3,1)` (HUD) + `react-spring` asset |
| State | Zustand + TanStack Query | Local React state + `useState` |
| Persistence | PostgreSQL + PostGIS, Redis | Browser localStorage (`safezone_drill_runs_v1`) |
| AI services | GenAI scenarios, GNN routing, CV posture | None yet; Mitra is rule-based |
| Audio | Asset-based | Fully synthesized WebAudio (zero external assets) |
| Styling | Design system (var tokens) | CSS Modules + global design tokens (vars, utilities, animations) |
| Build | - | Turbopack dev, Next.js production build |

---

## 5. Known Gaps vs. Blueprint

- Vertical multi-floor evacuation (Ground-5th hierarchy, doc 02 §2.3) - current drills are single-floor grids
- Multiplayer drill battles, WebSocket transport, CAP/SACHET ingestion, EOC headcount - spec-only
- GenAI scenario synthesis, GNN dynamic rerouting, DDA adaptive difficulty, CV posture validation - spec-only
- Offline-first service worker / IndexedDB caching - not started
- Backend API, database, authentication - not started (telemetry in localStorage)
- Mobile / touch input for simulation - keyboard-only currently

---

## 6. Routes

| Route | Page | Description |
| :--- | :--- | :--- |
| `/` | Landing | Immersive hero, stats, pillars, emergency CTA |
| `/learn` | Learning Portal | Age tiers, modules, badges, sidebar nav, full-page reader |
| `/simulate` | Simulation | Scenario picker -> playable drill -> generated debrief |
| `/command` | Command Hub | Floor matrix, campus map, live alerts, incident injection, action bar |
| `/admin` | Admin Analytics | KPIs, heatmap, drill log (Pillar 2->3 telemetry) |
| `/profile` | Cadet Profile | Cadet identity card, tier badge, certificates, leaderboard, settings |

---

## 7. Next Steps & Developer Task Breakdown (Active Sprint)

### Dheeraj: AI & Design Lead
1. **Cadet Onboarding Gate & Modal UX (Issue 1.3 / 2.6):** Design and implement the modal overlay interceptor that blocks non-home routes until Cadet Name, Age, Grade, and School are entered.
2. **Profile View & Settings Polish:** Complete the `/profile` page hierarchy and ensure dark-mode token alignment across all interactive components.
3. **Live Alert Card & Injection Panel Design (Issue 1.3 / 3.3):** Design the Command Hub emergency warning ticker and drill incident injection controls.

### I. Sravya: Frontend Core
1. **Verbatim Curriculum Ingestion (Issue 2.5):** Ingest verbatim NDMA curriculum across all 5 age tiers (103 sections across 28 modules) from the approved source blueprints.
2. **Full-Page Scroll Reader (Issue 2.5):** Replace modal popups (`ModuleViewer.tsx`) with a full-page scroll layout featuring a top neon-teal progress bar, `localStorage` mid-lesson progress persistence, and dynamic aggregate progress calculation for the `/learn` sidebar progress ring.
3. **Mandatory Onboarding Gate Interception & /profile Route (Issue 2.6):** Implement route guard in `frontend/src/` for `/learn`, `/simulate`, `/command`, and build `frontend/src/app/profile/page.tsx`. Link the Navbar avatar directly to `/profile`.

### Venkataraman C.V: Backend Lead
1. **Live Disaster Feed Ingestion API (Issue 3.3):** Create `GET /api/v1/alerts/live` in FastAPI integrating Open-Meteo Severe Weather / Flood API and USGS Earthquake GeoJSON feed, strictly filtered for critical severity incidents.
2. **Campus Incident Injection & WebSocket Broadcast (Issue 3.3):** Implement API endpoints to trigger manual school emergency simulations (fire, chemical spill, gas leak) and broadcast `EMERGENCY_BROADCAST` to all active WebSocket clients.
3. **Persistent Telemetry Endpoints (Task 3.1):** Build `POST /api/v1/telemetry/runs` and `GET /api/v1/telemetry/analytics` to persist simulation runs to PostgreSQL.

### Manha AK: AI & 3D Frontend
1. **Mitra AI Crisis Voice Alert Verbalization (Issue 4.3):** Connect Web Speech API (`window.speechSynthesis`) to Mitra on `/simulate` and `/command` to automatically verbalize emergency warning protocols during active crisis drills or ingested alerts.
2. **Interactive 3D Multi-Floor Stack (Task 4.1):** Replace the 2D blueprint on `/command` with an isometric 3D stacked floor viewer (Ground to 3rd Floor) with interactive floor separation and live hazard/student markers.
3. **Backend Telemetry Dispatch (Task 4.2):** Connect `saveRun()` in `telemetry.ts` to `POST /api/v1/telemetry/runs` with offline `localStorage` fallback.

### Trinayani D & Rahul Nayak: Pitch & Multi-Agency Orchestration
1. **Live Pitch Multi-Device Script (Task 5.1):** Coordinate 3-device live demonstration (Mobile student `/learn`, Laptop 3D sim `/simulate`, Main Screen Command Hub `/command`).
2. **SIH Pitch Deck (Task 5.2):** Finalize problem statement, dual-engine hybrid architecture, and national deployment roadmap slides.
3. **Multi-Agency SOP Documentation (Task 5.3):** Verify NDRF/SDMA/Fire SOP protocols and Indian school floorplan seed data.

