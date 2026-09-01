# 08. Current Implementation Status

> **Last updated:** September 1, 2026 · Branch `feature/backend-websocket`
>
> This document tracks what is **actually built and working** versus what remains
> spec-only. It complements docs 01–07 (the design blueprint) - nothing here changes
> the blueprint; it reports progress against it.

---

## 1. Status Snapshot by Pillar

| Pillar / Module | Status | Notes |
| :--- | :--- | :--- |
| Landing & navigation shell | ✅ Built | `LandingPage` immersive 3D scroll (ImmersiveScene, parallax, tilt cards, ripple links), `Navbar` mode switcher with prefetched routes |
| Pillar I - Pedagogical Engine | ✅ UI built | `LearnPage` with age-tiered curriculum, interactive sidebar nav, module selection with toast feedback, achievement badges |
| Pillar II - Simulation Engine | ✅ Built | Playable 3D evacuation drills, 4 JSON-driven scenarios, fire/smoke/door/blockage systems, NPC crowd (18 agents, BFS pathfinding), synthesized WebAudio, full run telemetry |
| Pillar II - Admin Analytics | ✅ Built | `/admin` dashboard: KPIs (drills/success rate/avg escape/avg panic/top failure), canvas route & casualty heatmap, drill log table |
| Pillar III - Command Hub | ⚠️ UI built, not live | `/command` page: live clock, floor status matrix, campus blueprint SVG, CAP alert feed, connected agencies, 3 action buttons; **not yet wired to live WebSocket telemetry** |
| Global FX Layer | ✅ Built | Custom GPU-accelerated cursor, constellation field, RippleLink with magnetic pull & prefetch, parallax/tilt/reveal animations |
| "Mitra" Crisis Companion | ⚠️ Rule-based | Reads live game state and coaches contextually (panic, smoke, oxygen, crouch, breathing); real LLM engine not yet wired |
| Backend — FastAPI + DB scaffold | ✅ Built | `backend/` scaffold with `app/main.py`, `core/config.py`, `core/database.py`, `core/redis_client.py`, `core/__init__.py` |
| Backend — REST endpoints | ✅ Built | `GET /api/v1/health`, `GET /api/v1/health/ready`, `GET /api/v1/buildings/{id}`, `GET /api/v1/buildings/{id}/floors`, `GET /api/v1/scenarios` |
| Backend — WebSocket Hub | ✅ Built | `POST /api/v1/ws` (WS upgrade), JWT auth via `?token=` query param, `JOIN_CAMPUS` / `DRILL_TELEMETRY` message handling, Redis Pub/Sub per-campus rooms, `StudentDrillTelemetry` persistence |
| Backend — NDMA CAP ingestion | ⚠️ Stub | `cap_ingestion.py` stub ready for Sprint 3; poll/ingest logic not yet implemented |
| Multiplayer drill battles | ❌ Not started | Frontend 3D sim not yet wired to WebSocket |
| Mobile / touch controls | ❌ Not started | Current game is keyboard-only (WASD/arrows + SHIFT/B) |
| Offline-first / PWA service worker | ❌ Not started | No Workbox / IndexedDB caching yet |
| GenAI scenario synthesis | ❌ Not started | Scenarios are JSON-only; no LLM generation pipeline |
| GNN dynamic evacuation routing | ❌ Not started | NPCs use BFS; no real-time weight-penalty re-routing |
| CV "Drop-Cover-Hold" posture validator | ❌ Not started | No MediaPipe / YOLOv8 integration |

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
- **Synthesized WebAudio (zero assets):** evacuation alarm beeps (760Hz square wave @2.2s), bandpass-filtered white noise fire crackle (proximity-driven loudness), panic-scaled heartbeat thuds (55–140 BPM)
- **Panic vignette overlay:** screen-edge red vignette intensifies when panic > 60
- **Collision system:** player corner-sampled AABB against wall cells; NPCs use flow-field + walls

### 2.2 Data-Driven Scenarios (`frontend/src/data/scenarios.json`)

Scenarios are fully data-driven - maps are ASCII grids (`#` wall, `.` floor, `P` spawn,
`E` exit, `F` fire seed, `D` door) parsed by `game/floorplan.ts`, which pads ragged
rows so malformed JSON cannot crash the sim. Four scenarios ship today:

| ID | Name | Hazard | Difficulty | Time Limit | Distinctive mechanics |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `lab-fire-east-wing` | Lab Fire | 🔥 Fire | ●○○ | 120s | Original baseline map, standard orange fire |
| `quake-compound` | Quake + Fire | 🔥 Fire | ●●○ | 140s | Doors, 2 exits, mid-run aftershock blockage seals NE wing |
| `chem-spill` | Chemical Spill | ☠️ Toxic Gas | ●●● | 100s | Fast green gas spread (0.55 chance), 2 exits, storage-closet obstacles |
| `blackout-fire` | Blackout Drill | 🔥 Fire | ●●○ | 150s | Near-zero visibility (fog density 0.055), slow spread, long time limit |

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

### 2.5 Simulate Page UX (`SimulatePage.tsx`)

- **Briefing phase:** scenario picker with name, hazard label, difficulty dots (●/○), control keys reference (WASD, SHIFT, B), "Start Drill" + "Command Analytics" link
- **Running phase:** live HUD panel (time countdown, oxygen meter, panic meter, score, CRAWLING/BREATHING badges), message ticker, panic vignette overlay
- **Ended phase:** generated debrief (✓/✗ lines from `generateDebrief()`), result stats (time, O₂, peak panic, score), "Retry Drill", "View Analytics", "Back to Briefing"
- **Mitra dock:** floating button → panel showing context-aware coaching derived from live `GameState` (panic, oxygen, crouching, breathing, time)

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
- Action bar: ⚡ Emergency Broadcast, 📱 QR Headcount Scan, 📊 Generate NDMA Report - all with simulated feedback toasts

### 2.9 Navigation & Performance

- **Prefetched routes:** all `<Link>` tags across Navbar, RippleLink, and mobile menu use `prefetch={true}` for instant page transitions
- **GPU-accelerated cursor:** `translate3d` transforms, `mouseover` event delegation (no `.closest()` on every `mousemove`), `will-change: transform`
- **Tactile active states:** `:active { transform: scale(0.95–0.98) }` on all buttons, cards, nav tabs, floor rows, badges, avatar
- **Zero tap delay:** `touch-action: manipulation` + `-webkit-tap-highlight-color: transparent` globally
- **No blocking scroll:** removed `scroll-behavior: smooth` from `html` to allow instant App Router transitions

### 2.10 Backend — FastAPI + WebSocket Stack (`backend/`)

**Architecture** (matches docs 03 §2 tech stack blueprint):

```
backend/
├── app/
│   ├── main.py                  # App factory, router wiring, startup/shutdown hooks
│   ├── core/
│   │   ├── config.py            # Pydantic BaseSettings (DB URL, Redis URL, JWT config)
│   │   ├── database.py          # SQLAlchemy 2.0 async engine + AsyncSessionLocal
│   │   └── redis_client.py      # redis.asyncio client (decode_responses=True)
│   ├── models/
│   │   ├── base.py              # SQLAlchemy declarative Base
│   │   ├── institution.py       # Institution, Building, Floor models (PostGIS-aware)
│   │   ├── user.py              # User model + UserRole enum
│   │   ├── drill.py             # DrillSession, StudentDrillTelemetry models
│   │   └── alert.py             # EmergencyAlert model (CAP wire format)
│   ├── schemas/
│   │   ├── websocket.py          # JoinCampusMessage, DrillTelemetryMessage (Pydantic v2)
│   │   ├── drill.py             # RunTelemetryRequest/Response, ViolationSchema
│   │   ├── institution.py        # BuildingResponse, FloorGraphData, etc.
│   │   ├── scenarios.py          # Scenario list schemas
│   │   └── analytics.py         # Analytics aggregation schemas
│   ├── api/v1/
│   │   ├── __init__.py
│   │   ├── health.py            # GET /health, GET /health/ready (DB + Redis checks)
│   │   ├── buildings.py         # GET /buildings/{id}, GET /buildings/{id}/floors
│   │   ├── scenarios.py          # GET /scenarios (in-memory embedded JSON)
│   │   └── websockets.py        # WS /ws endpoint
│   └── services/
│       ├── websocket_manager.py  # WebSocketManager singleton (rooms, JWT, Redis, DB)
│       └── cap_ingestion.py     # NDMA SACHET CAP v1.2 stub (Sprint 3)
├── alembic/                     # Migrations (baseline from schema.sql + floor_grid)
├── scripts/                     # gen_floor_grids.py, seed_floor_grids.py
└── tests/
    ├── conftest.py              # pytest fixtures (jwt_secret, ws_url, event_loop)
    ├── test_websockets.py       # Schema + manager unit tests, integration tests
    └── load_test_client.py      # Standalone WS load test script (10–100 clients)
```

**Database schema** (`database/schema.sql`): PostgreSQL 16 + PostGIS 3.4
- `institutions`, `buildings`, `floors` (with `floor_grid JSONB` for canvas pathfinding)
- `users` with `user_role_enum` (STUDENT, TEACHER_WARDEN, SCHOOL_ADMIN, NDRF_RESPONDER, FIRE_SERVICE, POLICE_EMS, SDMA_ANALYST)
- `drill_sessions`, `student_drill_telemetry` (per-run positional data)
- `emergency_alerts` (CAP wire: identifier, severity, urgency, affected_polygon PostGIS geometry)
- Spatial indexes on geofence columns; B-tree indexes on telemetry FKs

**WebSocket protocol** (matches doc 09 data contracts):

| Direction | Type | Payload |
|---|---|---|
| Client → Server | `JOIN_CAMPUS` | `{ "type": "JOIN_CAMPUS", "campus_id": "C-01" }` |
| Client → Server | `DRILL_TELEMETRY` | `{ "type": "DRILL_TELEMETRY", "drill_session_id": "...", "floor": 3, "cell": [12, 8], "status": "EVACUATING" }` |
| Server → Client | `EMERGENCY_BROADCAST` | `{ "type": "EMERGENCY_BROADCAST", "severity": "EXTREME", "msg": "..." }` |
| Server → Client | `ERROR` | `{ "type": "ERROR", "detail": "..." }` |

**Auth flow:**
1. Client connects with `?token=<jwt>` query param (standard WS pattern — headers unavailable at upgrade)
2. `WebSocketManager.connect()` decodes JWT with `settings.JWT_SECRET_KEY` + `HS256`
3. `sub` claim → `websocket.state.user_id`; `role` claim → `websocket.state.role`
4. `ExpiredSignatureError` → close 1008; `PyJWTError` → close 1008; missing `sub` → close 1008
5. All downstream handlers read identity from `websocket.state`, never from the client payload

**Redis Pub/Sub** (horizontal scaling):
- Each campus room subscribes to `ws:campus:{campus_id}` via an `asyncio.Task`
- `handle_telemetry()` publishes to Redis + broadcasts locally; `_source: "local"` tag prevents echo
- Listeners auto-reconnect with 5 s back-off on connection drop
- Empty room → listener cancelled on `disconnect()`

**Telemetry persistence:**
- `handle_telemetry()` calls `_persist_telemetry()` which upserts `StudentDrillTelemetry` rows
- Terminal statuses (`EVACUATED_SAFE`, `VIRTUAL_CASUALTY`, `TRAPPED_SHELTERED`, `RESCUED`) set `completed_at`
- DB failures are logged but do not block telemetry relay

**Verified:** No token → 403; Bad token → 403; Valid token → connected; 10 concurrent clients → all succeeded in 60 ms.

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
│       ├── ImmersiveScene.tsx → Landing 3D scene
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

backend/
├── app/
│   ├── main.py                # FastAPI app factory, router wiring
│   ├── core/                  # config, database, redis_client
│   ├── models/                # SQLAlchemy 2.0 ORM (institution, user, drill, alert)
│   ├── schemas/               # Pydantic v2 (websocket, drill, institution, scenarios)
│   ├── api/v1/                # health, buildings, scenarios, websockets
│   ├── services/              # websocket_manager, cap_ingestion
│   └── scripts/               # gen_floor_grids, seed_floor_grids
├── alembic/                   # migrations
└── tests/                     # conftest, test_websockets, load_test_client
```

---

## 4. Actual Tech Stack (as built)

| Layer | Blueprint (docs 03) | As built today |
| :--- | :--- | :--- |
| Framework (frontend) | Next.js 15 PWA | Next.js 16.3.2 (App Router, Turbopack), React 19 |
| Framework (backend) | FastAPI Python 3.12 | FastAPI 0.115.0 + Uvicorn 0.30.6 + Pydantic v2 |
| 3D | React Three Fiber + Rapier | Plain Three.js r149 (imperative scene in one component) |
| State | Zustand + TanStack Query | Local React state + `useState` |
| Persistence (frontend) | IndexedDB (Workbox) | Browser localStorage (`safezone_drill_runs_v1`) |
| Persistence (backend) | PostgreSQL 16 + PostGIS 3.4 | ✅ Implemented — async SQLAlchemy 2.0, models match `schema.sql`, Alembic migrations applied |
| Cache / pub-sub | Redis 7 (Cluster) | ✅ Implemented — `redis.asyncio` client, per-campus `ws:campus:{id}` channels, auto-reconnect listener tasks |
| Real-time transport | python-socketio + Redis Pub/Sub | ✅ Native FastAPI WebSocket + Redis Pub/Sub (socketio not needed; one protocol only) |
| Auth | Stateless JWT + RBAC | ✅ PyJWT HS256, `?token=` query param, 7-role enum from `user_role_enum` |
| AI services | GenAI scenarios, GNN routing, CV posture | None yet; Mitra is rule-based |
| Audio | Asset-based | Fully synthesized WebAudio (zero external assets) |
| Styling | Design system (var tokens) | CSS Modules + global design tokens (vars, utilities, animations) |
| Build | - | Turbopack dev, Next.js production build; Uvicorn dev for FastAPI |
| Container | Docker Compose | docker-compose.yml wires backend + Postgres/PostGIS + Redis |

---

## 5. Known Gaps vs. Blueprint

- **Vertical multi-floor evacuation** (Ground–5th hierarchy, doc 02 §2.3) — current drills are single-floor grids
- **Frontend 3D sim not wired to WebSocket Hub** — telemetry still flows only through `/api/v1/telemetry/runs` (when that endpoint ships); the `DRILL_TELEMETRY` 2 Hz stream from `EvacuationGame.tsx` is not yet sending to `/api/v1/ws`
- **Command Hub `/command` not wired to live WS** — UI mock only; no live floor status update from real drill sessions yet
- **NDMA SACHET / CAP v1.2 ingestion** — `cap_ingestion.py` is a stub; no XML/JSON poller or webhook receiver, no geofenced automatic mode switch (doc 02 §3.1)
- **Multiplayer drill battles** — spec-only; needs 3D sim to publish + receive telemetry
- **GenAI scenario synthesis** — scenarios are JSON-only; no LLM generation pipeline
- **GNN dynamic rerouting** — NPCs use BFS; no real-time weight-penalty re-routing on hazard change
- **DDA adaptive difficulty** — not started
- **CV "Drop-Cover-Hold" posture validation** — no MediaPipe / YOLOv8 integration
- **Offline-first service worker / IndexedDB** — no Workbox caching
- **Mobile / touch input for simulation** — keyboard-only currently
- **Mitra as LLM** — currently rule-based

---

## 6. Routes

### Frontend Routes

| Route | Page | Description |
| :--- | :--- | :--- |
| `/` | Landing | Immersive hero, stats, pillars, emergency CTA |
| `/learn` | Learning Portal | Age tiers, modules, badges, sidebar nav |
| `/simulate` | Simulation | Scenario picker → playable drill → generated debrief |
| `/command` | Command Hub | Floor matrix, campus map, alerts, agencies, action bar (UI mock, not live yet) |
| `/admin` | Admin Analytics | KPIs, heatmap, drill log (Pillar 2→3 telemetry) |

### Backend API Routes (FastAPI)

| Route | Method | Description |
| :--- | :--- | :--- |
| `/api/v1/health` | GET | Liveness check (no deps) |
| `/api/v1/health/ready` | GET | Readiness check (DB ping, Redis ping) |
| `/api/v1/buildings/{id}` | GET | Building metadata |
| `/api/v1/buildings/{id}/floors` | GET | Floor graph nodes/edges + grid for pathfinding |
| `/api/v1/scenarios` | GET | All 4 embedded drill scenarios with map + config |
| `/api/v1/ws` | WS | WebSocket upgrade — JWT auth, JOIN_CAMPUS, DRILL_TELEMETRY, EMERGENCY_BROADCAST |

---

## 7. Next Steps & Developer Task Breakdown

### 👨‍💻 Frontend Dev 1 (Sravya / Manha): Touch / Mobile Controls, Curriculum Mini-Games & PWA
1. **Mobile Virtual Touch Joystick:** Add virtual on-screen joystick and touch buttons (Crouch / Box-Breathe) to `EvacuationGame.tsx` so 3D drills are 100% playable on smartphones and tablets.
2. **Interactive Curriculum Mini-Games:** Implement Tier 1 "Drop, Cover, Hold On" reflex game, Tier 2 "Go-Bag Builder" drag-and-drop, and Tier 3 "Fire Extinguisher PASS Protocol" sequence simulator in `/learn`.
3. **PWA Offline Service Worker:** Set up Web App Manifest and Service Worker caching (IndexedDB + Workbox) so lessons, 3D assets, and scenarios function fully offline during school lab network disconnects.

### 👨‍💻 Frontend Dev 2 (Sravya / Manha): Incident Command Hub, 3D Multi-Floor & Mitra AI
1. **Live Telemetry in `/command`:** Wire `CommandPage.tsx` to real-time WebSocket events from active student drill sessions to update the Floor Status Matrix (safe/trapped/missing) live.
2. **Isometric Multi-Floor 3D Visualizer:** Upgrade the 2D SVG campus blueprint into an interactive Three.js 3D stacked floor viewer (Ground-5th Floor) with real-time hazard markers and evacuation paths.
3. **Voice-Enabled "Mitra" Crisis Assistant:** Connect browser Web Speech API (SpeechRecognition + SpeechSynthesis) to the Mitra assistant drawer for hands-free voice coaching during evacuation drills.
4. **Frontend ↔ WebSocket integration:** Open a `WebSocket("/api/v1/ws?token=...")` in `EvacuationGame.tsx` after a drill starts and emit a `DRILL_TELEMETRY` message every 500 ms with `floor` + `cell` + `status`. On the `EMERGENCY_BROADCAST` message, switch the 3D sim into "real emergency" mode (doc 02 §3.1).

### ⚙️ Backend Dev (Venkat): FastAPI Server, WebSockets & NDMA SACHET Ingestion
1. **FastAPI & PostgreSQL Backend** — ✅ **Built**: REST endpoints (`/health`, `/buildings/{id}`, `/buildings/{id}/floors`, `/scenarios`) with SQLAlchemy models, Alembic migrations applied, embedding PostGIS-aware geometry columns.
2. **WebSocket Session Hub** — ✅ **Built**: `/api/v1/ws` with JWT auth (PyJWT HS256), room broker, Redis Pub/Sub (`ws:campus:{id}`), `DRILL_TELEMETRY` persistence to `student_drill_telemetry`, `EMERGENCY_BROADCAST` fan-out. Load test client (`tests/load_test_client.py`) verified with 10 concurrent clients in 60 ms.
3. **NDMA SACHET / CAP v1.2 Ingestion Engine** — ❌ **Not started**: Build the async XML feed poller/webhook receiver in `app/services/cap_ingestion.py`, parse CAP fields (`<identifier>`, `<sender>`, `<sent>`, `<info>`, `<headline>`, `<area>`), run the geofence polygon match, and call `ws_manager.broadcast_emergency()` for affected campuses (doc 02 §3.1).
4. **`POST /api/v1/telemetry/runs`** — ❌ Not started: REST endpoint to persist `RunTelemetry` payloads (replaces browser `localStorage`). Schema already defined in `app/schemas/drill.py` (`RunTelemetryRequest` / `RunTelemetryResponse`).
5. **`GET /api/v1/telemetry/analytics`** — ❌ Not started: Aggregated KPIs and route heatmap matrix for the `/admin` dashboard.
6. **Multi-tenant RBAC on REST endpoints** — ❌ Not started: JWT verification helper that decodes a Bearer token and returns the current `User`; FastAPI dependency for role-based access. (Already on WS endpoint, needs to be extracted for reuse.)
7. **5k concurrent load test** — ❌ Not started: Run `load_test_client.py` against a full docker compose stack (backend + Postgres + Redis) with 1,000 → 5,000 connections; measure broadcast latency.

