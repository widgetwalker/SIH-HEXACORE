# Backend Setup

## Option A: Run without Docker (fastest for today, Day 1)

```bash
cd backend
python3.12 -m venv venv
source venv/bin/activate        # on Windows: venv\Scripts\activate
pip install -r requirements.txt
cp ../.env.example ../.env
uvicorn app.main:app --reload
```

Visit http://localhost:8000/api/v1/health — you should see `{"status": "ok"}`.

## Option B: Run with Docker Compose (needed from Day 2, once the database is used)

Run this from the REPO ROOT, not from inside `backend/` — the compose file
needs to reach `database/schema.sql` which sits outside this folder.

```bash
cp .env.example .env
docker compose up
```

This starts the backend, Postgres (with PostGIS, auto-loaded from
`database/schema.sql` on first run), and Redis together.

## Project layout

```
backend/
  alembic/              # database migration files
    versions/
  app/
    main.py           # wires the FastAPI app together
    core/
      config.py        # all environment-based settings
      database.py      # database connection setup
      redis_client.py  # Redis connection setup
    api/
      v1/
        health.py       # health check endpoint
  requirements.txt
  Dockerfile
  docker-compose.yml
  .env.example          # copy to .env, never commit the real .env
```
