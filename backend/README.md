# Backend Services — SIH 2026 (HEXACORE)

> FastAPI backend providing persistent telemetry, sub-50ms WebSocket broadcast, multi-hazard live alerts, Gemini 3.6 Flash scenario generation, and Microsoft Neural TTS streaming.

---

## Quick Start

### Option A: Full Docker Stack (Recommended)
Run from the repository root:
```bash
docker compose up -d
```
This automatically boots all 4 tiers with healthchecks:
- **FastAPI Backend:** http://localhost:8000/docs
- **Next.js Frontend:** http://localhost:3000
- **PostgreSQL 16 (PostGIS 3.4):** localhost:5432 (auto-seeds `database/schema.sql`)
- **Redis 7:** localhost:6379

### Option B: Local Python Development
```bash
cd backend
python3.12 -m venv venv
source venv/bin/activate        # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp ../.env.example .env
PYTHONPATH=. uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
Visit http://localhost:8000/api/v1/health — should return `{"status": "ok"}`.
Interactive OpenAPI docs are available at http://localhost:8000/docs.

---

## Built API Endpoints

| Group | Route | Methods | Description |
| :--- | :--- | :--- | :--- |
| **Health** | `/api/v1/health` | GET | Liveness probe (zero dependencies) |
| | `/api/v1/health/ready` | GET | Readiness probe (verifies PostgreSQL + Redis connections) |
| **Telemetry** | `/api/v1/telemetry/runs` | POST | Persists 4Hz drill runs, heatmaps, and violations |
| | `/api/v1/telemetry/analytics` | GET | Aggregated KPIs and route visit frequency heatmap for `/admin` |
| **Scenarios** | `/api/v1/scenarios` | GET | Returns static and built-in 32x18 evacuation drills |
| | `/api/v1/scenarios/generate`| POST | Procedurally generates new 32x18 drills via **Gemini 3.6 Flash** (LCG fallback) |
| **Mitra AI** | `/api/v1/mitra/chat` | POST | Conversational safety AI via **Gemini 3.6 Flash** (with thought-token stripping) |
| | `/api/v1/mitra/tts` | GET, HEAD, POST | Streams studio-grade Microsoft Neural TTS MP3 (`en-IN-NeerjaNeural`) |
| **Alerts** | `/api/v1/alerts/live` | GET | Multi-hazard live feeds (USGS Earthquake GeoJSON + Open-Meteo Weather) |
| | `/api/v1/alerts/{id}/acknowledge` | PATCH | Operator acknowledgment and alert deactivation |
| | `/api/v1/webhooks/inject-incident`| POST | Campus incident drill injector & WebSocket broadcast |
| **Users** | `/api/v1/users/profile` | POST | Persists cadet identity, tier level, and stats |
| | `/api/v1/users/leaderboard` | GET | Global multi-user leaderboard |
| **WebSocket** | `/ws` | WS | Real-time 2Hz drill telemetry sync & sub-50ms emergency broadcasts |

---

## Project Layout

```
backend/
├── alembic/              # Database migration versions
├── app/
│   ├── main.py           # FastAPI app factory, CORS, and lifespan hooks
│   ├── core/
│   │   ├── config.py     # Pydantic BaseSettings (GEMINI_API_KEY, DB URLs)
│   │   ├── database.py   # Async SQLAlchemy engine & session factory
│   │   └── redis_client.py # Async Redis Pub/Sub client
│   ├── models/           # SQLAlchemy ORM entities (institutions, users, drills, alerts)
│   ├── schemas/          # Pydantic v2 validation contracts (scenarios, telemetry, etc.)
│   ├── api/v1/           # Modular REST routers (health, telemetry, scenarios, mitra, etc.)
│   └── services/         # Business logic (pathfinder, websocket_manager, cap_ingestion)
├── tests/                # Pytest suites (test_mitra_tts, load_test_client, test_websockets)
├── Dockerfile            # Container build specification
└── requirements.txt      # Python dependencies (FastAPI, SQLAlchemy, edge-tts, etc.)
```
