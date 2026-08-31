BACKEND DEV: FastAPI Server, WebSockets & NDMA SACHET Ingestion
🎯 Primary Objectives:
Build a FastAPI backend with PostgreSQL to store runs, drill analytics, and schools.
Build a WebSocket Hub for sub-50ms multi-agency telemetry and broadcast sync.
Ingest real-time NDMA SACHET / CAP v1.2 emergency alerts.
📋 Step-by-Step Instructions:
Task 3.1: FastAPI Setup & Database Schemas
Tech Stack: Python 3.12, FastAPI, SQLAlchemy 2.0 (Async), PostgreSQL 16 + PostGIS, Alembic, Pydantic v2.
Directory Structure to Create:
backend/
├── app/
│   ├── main.py
│   ├── core/           # config, db session, security
│   ├── models/         # SQLAlchemy DB models
│   ├── schemas/        # Pydantic validation schemas
│   ├── api/v1/         # Endpoints (telemetry, scenarios, auth, sachet)
│   └── services/       # CAP parser, analytics aggregator, websocket manager
├── alembic/
└── requirements.txt
Database Tables to Implement:
drill_runs: run_id, user_id, scenario_id, status (won/lost), time_seconds, oxygen_left, panic_peak, score, route_heat (JSON/Array), violations (JSON), created_at.
scenarios: id, name, hazard_type, difficulty, map_grid (Text/JSON), config (JSON).
institutions: id, name, campus_id, geo_polygon (PostGIS), warden_contact.
emergency_alerts: id, identifier, sender, hazard, severity, headline, area_desc, raw_xml.
Task 3.2: REST Endpoints to Expose
POST   /api/v1/telemetry/runs           # Save drill run from simulation (replaces localStorage)
GET    /api/v1/telemetry/analytics      # Aggregated KPIs & heatmap matrix for /admin
GET    /api/v1/scenarios                # List all scenarios
GET    /api/v1/scenarios/{id}           # Get single scenario map & config
POST   /api/v1/reports/ndma             # Generate NDMA Incident Form PDF/JSON
POST   /api/v1/mitra/chat               # Mitra crisis guidance LLM / rule endpoint
Task 3.3: WebSocket Session & Alert Broker
Target: backend/app/services/websocket_manager.py
Protocol:
json
// Client -> Server: Join campus room
{ "type": "JOIN_CAMPUS", "campus_id": "CAMPUS-01", "role": "STUDENT" }
// Client -> Server: Periodic drill state (2 Hz)
{ "type": "DRILL_TELEMETRY", "user_id": "U-123", "floor": "3F", "cell": [12, 8], "status": "EVACUATING" }
// Server -> All Clients: Emergency broadcast (<50ms)
{ "type": "EMERGENCY_BROADCAST", "severity": "EXTREME", "msg": "Earthquake aftershock detected. Evacuate via Stair B." }
Task 3.4: NDMA SACHET / CAP v1.2 Alert Ingestion
Target: backend/app/services/cap_ingestion.py
Implementation:
Build an async poller / webhook receiver for OASIS CAP v1.2 XML alerts from NDMA SACHET / IMD.
Parse XML fields: <identifier>, <sender>, <sent>, <status>, <info>, <headline>, <description>, <area>.
Automatically trigger EMERGENCY_BROADCAST to affected campuses matching the alert's geofenced polygon.
🔗 Shared Interfaces: Data Contracts
1. Drill Run Telemetry Schema (Frontend ➔ Backend)
typescript
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
    type: "entered_fire" | "smoke_exposure" | "panic_freeze" | "route_blocked" | "breathed" | "exit_reached";
    cell?: { c: number; r: number };
    detail?: string;
  }>;
  routeHeat: number[]; // Flattened grid heat counts (rows * cols)
  cols: number;
  rows: number;
  createdAt: number;
}
