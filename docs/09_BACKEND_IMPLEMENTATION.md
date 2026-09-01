BACKEND DEV: FastAPI Server, WebSockets & NDMA SACHET Ingestion

> **📋 Last updated:** September 1, 2026 · Branch `feature/backend-websocket`
>
> This is the running playbook for the backend workstream. Sections marked
> ✅ are complete; ⚠️ are partially done; ❌ are still planned. The high-level
> roadmap (Sprints 1–4) is in [06_ROLE_ALLOCATION_AND_SPRINT_ROADMAP.md](./06_ROLE_ALLOCATION_AND_SPRINT_ROADMAP.md);
> the current built-vs-planned snapshot is in [08_CURRENT_IMPLEMENTATION_STATUS.md](./08_CURRENT_IMPLEMENTATION_STATUS.md).

🎯 Primary Objectives:
- Build a FastAPI backend with PostgreSQL to store runs, drill analytics, and schools.
- Build a WebSocket Hub for sub-50ms multi-agency telemetry and broadcast sync.
- Ingest real-time NDMA SACHET / CAP v1.2 emergency alerts.

---

## ✅ Task 3.1: FastAPI Setup & Database Schemas

**Status:** Complete (Sprint 1 Day 1–2)

**Tech Stack:** Python 3.12, FastAPI 0.115, SQLAlchemy 2.0 (Async), PostgreSQL 16 + PostGIS 3.4, Alembic, Pydantic v2.

**Directory structure (built):**
```
backend/
├── app/
│   ├── main.py                # FastAPI app factory, CORS, startup/shutdown hooks
│   ├── core/
│   │   ├── config.py          # Pydantic BaseSettings (env-driven)
│   │   ├── database.py        # async engine + AsyncSessionLocal
│   │   └── redis_client.py    # redis.asyncio client
│   ├── models/                # SQLAlchemy ORM
│   │   ├── base.py
│   │   ├── institution.py     # Institution, Building, Floor
│   │   ├── user.py            # User + UserRole enum
│   │   ├── drill.py           # DrillSession, StudentDrillTelemetry
│   │   └── alert.py           # EmergencyAlert
│   ├── schemas/               # Pydantic v2
│   │   ├── websocket.py       # JoinCampusMessage, DrillTelemetryMessage
│   │   ├── drill.py           # RunTelemetryRequest/Response, ViolationSchema
│   │   ├── institution.py
│   │   ├── scenarios.py
│   │   └── analytics.py
│   ├── api/v1/                # Routers
│   │   ├── health.py
│   │   ├── buildings.py
│   │   ├── scenarios.py
│   │   └── websockets.py      # WS /ws endpoint
│   ├── services/
│   │   ├── websocket_manager.py  # JWT auth + Redis Pub/Sub + DB persistence
│   │   └── cap_ingestion.py     # ⚠️ stub for Sprint 3
│   └── scripts/               # gen_floor_grids.py, seed_floor_grids.py
├── alembic/                   # Migrations (baseline + floor_grid)
├── tests/                     # conftest, test_websockets, load_test_client
└── requirements.txt
```

**Database tables (built) — all in `database/schema.sql`:**

| Table | Purpose | Key columns |
| :--- | :--- | :--- |
| `institutions` | Campuses (one per school) | `id`, `name`, `boundary_geofence GEOMETRY(POLYGON, 4326)` |
| `buildings` | Buildings inside a campus | `id`, `institution_id`, `total_floors`, `footprint_geometry` |
| `floors` | Floor plan + graph for pathfinding | `id`, `building_id`, `floor_number`, `graph_nodes_json`, `graph_edges_json`, `floor_grid JSONB` |
| `users` | All accounts (Student → NDRF) | `id`, `role user_role_enum`, `assigned_building_id`, `assigned_floor_number` |
| `drill_sessions` | One drill event | `id`, `institution_id`, `mode drill_mode_enum`, `status drill_status_enum`, `scenario_id` |
| `student_drill_telemetry` | Per-run positional data | `id`, `drill_session_id`, `user_id`, `starting_floor`, `final_status`, `escape_route_taken JSONB`, `prohibitions_violated JSONB` |
| `emergency_alerts` | CAP wire format | `id`, `cap_identifier`, `severity`, `affected_polygon GEOMETRY(POLYGON, 4326)` |

`drill_runs` (per the original spec) is intentionally represented by
`student_drill_telemetry` + `drill_sessions` (one row per student per
session). `scenarios` are stored as embedded Python lists in
`app/api/v1/scenarios.py` (no DB table needed — the spec is small and
rarely changes; this also lets the frontend keep its existing TypeScript
`Scenario` interface).

**Roles enum** (`user_role_enum`): `STUDENT | TEACHER_WARDEN | SCHOOL_ADMIN | NDRF_RESPONDER | FIRE_SERVICE | POLICE_EMS | SDMA_ANALYST`.

---

## ⚠️ Task 3.2: REST Endpoints

**Status:** 4 of 6 endpoints live; `POST /telemetry/runs` and `GET /telemetry/analytics` still pending.

| Method | Route | Status | Purpose |
| :--- | :--- | :--- | :--- |
| GET | `/api/v1/health` | ✅ | Liveness (no deps) |
| GET | `/api/v1/health/ready` | ✅ | Readiness (DB + Redis ping) |
| GET | `/api/v1/buildings/{id}` | ✅ | Building metadata |
| GET | `/api/v1/buildings/{id}/floors` | ✅ | Floor graph + grid for pathfinding |
| GET | `/api/v1/scenarios` | ✅ | 4 embedded scenarios (matches existing TS interface) |
| GET | `/api/v1/scenarios/{id}` | ❌ | Single scenario lookup (not needed yet — list endpoint covers it) |
| POST | `/api/v1/telemetry/runs` | ❌ | Persist `RunTelemetry` payload (replaces localStorage). Schema already in `app/schemas/drill.py::RunTelemetryRequest`. |
| GET | `/api/v1/telemetry/analytics` | ❌ | Aggregated KPIs + route heatmap matrix for `/admin` |
| POST | `/api/v1/reports/ndma` | ❌ | NDMA incident form (PDF or JSON) |
| POST | `/api/v1/mitra/chat` | ❌ | Mitra crisis guidance LLM / rule endpoint |

---

## ✅ Task 3.3: WebSocket Session & Alert Broker

**Status:** Complete (Sprint 2 Day 8 — landed early)

**Target file:** `backend/app/services/websocket_manager.py`

**Wire protocol (implemented):**
```jsonc
// Client -> Server: Join campus room (after WS auth)
{ "type": "JOIN_CAMPUS", "campus_id": "CAMPUS-01" }

// Client -> Server: Periodic drill state (2 Hz)
{ "type": "DRILL_TELEMETRY", "drill_session_id": "<uuid>",
  "floor": 3, "cell": [12, 8], "status": "EVACUATING" }

// Server -> All Clients: Emergency broadcast (<50ms target)
{ "type": "EMERGENCY_BROADCAST", "severity": "EXTREME",
  "msg": "Earthquake aftershock detected. Evacuate via Stair B." }

// Server -> Client (errors)
{ "type": "ERROR", "detail": "Invalid JSON" }
```

### Auth

- Token is passed in the query string as `?token=<jwt>` (standard WS auth pattern; headers are unavailable at the upgrade handshake).
- `WebSocketManager.connect()` decodes with `settings.JWT_SECRET_KEY` + `HS256` (PyJWT).
- Claims: `sub` (UUID, required) → `websocket.state.user_id`; `role` (string) → `websocket.state.role`.
- Bad / expired / missing token → close code `1008` (Policy Violation). Missing `sub` → close `1008`.
- `user_id` and `role` are read from `websocket.state` for all subsequent operations, never from the client payload (prevents impersonation).

### Redis Pub/Sub

- Each campus room subscribes to channel `ws:campus:{campus_id}` via an `asyncio.Task` started in `join_campus()`.
- `handle_telemetry()` publishes to Redis + broadcasts locally; messages are tagged with `_source: "local"` so the local worker doesn't re-broadcast its own publication.
- Listener tasks auto-reconnect with 5 s back-off on connection drop.
- Empty rooms → listener cancelled in `disconnect()` to avoid idle connections.

### Telemetry persistence

- `handle_telemetry()` calls `_persist_telemetry()` which upserts a `StudentDrillTelemetry` row keyed by `(drill_session_id, user_id)`.
- Terminal statuses (`EVACUATED_SAFE`, `VIRTUAL_CASUALTY`, `TRAPPED_SHELTERED`, `RESCUED`) set `completed_at` to `now()`.
- DB write failures are logged but never block the broadcast path (a Postgres hiccup shouldn't drop a live evacuation update).

### Verified

- No token → 403 rejected ✅
- Garbage token → 403 rejected ✅
- Valid token → connected, JOIN_CAMPUS works ✅
- 10 concurrent clients (each joins, sends telemetry, listens) → all succeeded in 60 ms ✅
- Load test client: `backend/tests/load_test_client.py` (runnable standalone with `WS_URL` + `JWT_SECRET_KEY` set).

---

## ❌ Task 3.4: NDMA SACHET / CAP v1.2 Alert Ingestion

**Status:** Stub only. `backend/app/services/cap_ingestion.py` is a placeholder.

**Plan:**
- Build an async poller / webhook receiver for OASIS CAP v1.2 XML alerts from NDMA SACHET / IMD.
- Parse XML fields: `<identifier>`, `<sender>`, `<sent>`, `<status>`, `<info>`, `<headline>`, `<description>`, `<area>`.
- Run geofence polygon match against `institutions.boundary_geofence` (PostGIS `ST_DWithin`).
- For each affected campus, call `ws_manager.broadcast_emergency(campus_id, severity, msg)`.
- Dedup by `cap_identifier` (`emergency_alerts.cap_identifier` has a `UNIQUE` constraint) — same alert arriving twice (poll + webhook) must not double-broadcast.

**Target:** Sprint 3 Day 12.

---

## 🔗 Shared Interfaces: Data Contracts

### 1. Drill Run Telemetry Schema (Frontend ➔ Backend)

`POST /api/v1/telemetry/runs` payload, defined in `app/schemas/drill.py::RunTelemetryRequest`:

```typescript
interface RunTelemetry {
  runId: string;
  scenarioId: string;
  scenarioName: string;
  status: "won" | "lost";
  time: number;
  oxygenLeft: number;
  panicPeak: number;
  panicFreezeSeconds: number;
  score: number;
  smokeStandingSeconds: number;
  smokeCrouchSeconds: number;
  breathCount: number;
  distanceTraveled: number;
  fireCellEntries: number;
  exitUsed?: { c: number; r: number };
  deathCell?: { c: number; r: number };
  violations: Array<{
    t: number;
    type: "entered_fire" | "smoke_exposure" | "panic_freeze"
        | "route_blocked" | "breathed" | "exit_reached";
    cell?: { c: number; r: number };
    detail?: string;
  }>;
  routeHeat: number[]; // Flattened grid heat counts (rows * cols)
  cols: number;
  rows: number;
  createdAt: number;
}
```

### 2. WebSocket Telemetry Schema (live, 2 Hz)

Defined in `app/schemas/websocket.py::DrillTelemetryMessage`:

```typescript
{
  type: "DRILL_TELEMETRY",
  drill_session_id: string,   // UUID
  floor: number,              // 0 = ground, 1, 2, ...
  cell: [number, number],     // [col, row]
  status: "OK" | "EVACUATING" | "EVACUATED_SAFE" | "VIRTUAL_CASUALTY"
        | "TRAPPED_SHELTERED" | "RESCUED" | "ACTIVE" | "SCHEDULED"
}
```

User identity is **not** in the payload — it comes from the JWT via `websocket.state.user_id`. (The previous spec mentioned `user_id` in the message; that has been removed so a compromised client can't impersonate someone else.)

### 3. Emergency Broadcast Schema (server → all clients)

```typescript
{
  type: "EMERGENCY_BROADCAST",
  severity: "Extreme" | "Severe" | "Moderate" | "Minor",
  msg: string
}
```
