"""
Redis connection setup.

Same idea as database.py - one shared client for the whole app,
instead of every file that needs Redis creating its own connection.

This client isn't used by anything yet. It gets used starting Sprint 2/3
for two separate purposes:
  1. Caching fast-changing data (e.g. the live CAP/SACHET alert feed)
     so it doesn't hit Postgres on every read.
  2. As the message broker for the WebSocket hub (python-socketio),
     so a broadcast sent from one backend process reaches clients
     connected to a different backend process.
"""

import redis.asyncio as redis

from app.core.config import settings

# decode_responses=True means values come back as normal Python strings
# instead of raw bytes - simpler to work with, and fine for our use case
# since we're not storing binary data in Redis.
redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)