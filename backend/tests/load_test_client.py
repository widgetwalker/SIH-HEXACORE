#!/usr/bin/env python3
"""
Multi-User WebSocket Load Test — SafeZone Disaster Preparedness Backend.

Simulates 50–100 concurrent WebSocket clients emitting drill telemetry
updates, then validates:
  1. All clients connect and join their campus room successfully.
  2. Message fan-out: every OTHER client receives a DRILL_TELEMETRY broadcast.
  3. Server latency stays below 50 ms per broadcast round-trip.
  4. Zero dropped packets (every sent message appears in the fan-out).

Usage:
    # 50 clients (default)
    python tests/load_test_client.py

    # 100 clients
    python tests/load_test_client.py --clients 100

    # 75 clients with custom WS URL
    python tests/load_test_client.py --clients 75 --ws-url ws://localhost:8000/api/v1/ws

Requirements:
    pip install websockets pyjwt

Environment variables:
    WS_URL          : WebSocket URL  (default: ws://localhost:8000/api/v1/ws)
    JWT_SECRET_KEY  : Must match the backend's JWT_SECRET_KEY
"""

from __future__ import annotations

import argparse
import asyncio
import json
import os
import sys
import time
from dataclasses import dataclass, field
from datetime import datetime, timedelta, timezone
from typing import Any
from uuid import uuid4

# Allow the script to be run from repo root or backend/
import importlib.util

# Load PyJWT lazily so we get a clear error if it's missing
if importlib.util.find_spec("jwt") is None:
    print("ERROR: PyJWT is not installed.", file=sys.stderr)
    print("Run: pip install pyjwt", file=sys.stderr)
    sys.exit(1)

import jwt  # noqa: E402  (imported above conditionally, but linter needs this)

# ── Configuration ────────────────────────────────────────────────────────────

_WS_URL = os.getenv("WS_URL", "ws://localhost:8000/api/v1/ws")
_JWT_ALGORITHM = "HS256"
_JWT_SECRET = os.getenv("JWT_SECRET_KEY")

if not _JWT_SECRET:
    print("ERROR: JWT_SECRET_KEY env var must be set.", file=sys.stderr)
    sys.exit(1)

if _JWT_SECRET in {"change-me-in-env-file", "replace-this-with-a-long-random-string"}:
    print(
        "WARNING: JWT_SECRET_KEY is a placeholder — tokens will be accepted by the\n"
        "        backend only if its own secret matches.  Results may be unreliable.",
        file=sys.stderr,
    )


def _make_jwt(user_uuid: str, role: str = "STUDENT") -> str:
    payload = {
        "sub": user_uuid,
        "role": role,
        "iat": datetime.now(timezone.utc),
        "exp": datetime.now(timezone.utc) + timedelta(hours=1),
    }
    return jwt.encode(payload, _JWT_SECRET, algorithm=_JWT_ALGORITHM)


# ── Client dataclass ────────────────────────────────────────────────────────

@dataclass
class LoadClient:
    user_uuid: str
    user_id: str        # display name
    campus_id: str
    drill_session_id: str
    url: str
    token: str

    # Metrics
    connected_at: float = 0.0
    joined_at: float = 0.0
    connect_latency_ms: float = 0.0
    join_latency_ms: float = 0.0

    # Received messages (populated during listen)
    received: list[dict[str, Any]] = field(default_factory=list)

    # Internal WebSocket handle
    _ws: Any = field(default=None, repr=False)

    async def connect(self, ws_module: Any) -> None:
        t0 = time.perf_counter()
        self._ws = await ws_module.connect(self.url)
        self.connected_at = time.perf_counter()
        self.connect_latency_ms = (self.connected_at - t0) * 1000

    async def join(self) -> None:
        t0 = time.perf_counter()
        await self._ws.send(json.dumps({
            "type": "JOIN_CAMPUS",
            "campus_id": self.campus_id,
        }))
        # The backend does NOT send an explicit JOIN acknowledgement —
        # it just registers the socket and returns silently. We measure
        # join latency as the round-trip of the send+flush.  Small sleep
        # ensures the server has time to process the JOIN before
        # subsequent telemetry is sent (avoids race conditions where the
        # first telemetry races the room registration).
        await asyncio.sleep(0.05)
        self.joined_at = time.perf_counter()
        self.join_latency_ms = (self.joined_at - t0) * 1000

    async def send_telemetry(self, floor: int, cell: list[int], status: str) -> None:
        await self._ws.send(json.dumps({
            "type": "DRILL_TELEMETRY",
            "drill_session_id": self.drill_session_id,
            "floor": floor,
            "cell": cell,
            "status": status,
        }))

    async def recv(self, timeout: float = 2.0) -> dict[str, Any] | None:
        try:
            raw = await asyncio.wait_for(self._ws.recv(), timeout=timeout)
            return json.loads(raw)
        except asyncio.TimeoutError:
            return None

    async def close(self) -> None:
        if self._ws:
            await self._ws.close()


# ── Test phases ─────────────────────────────────────────────────────────────

async def _connect_all(
    clients: list[LoadClient], ws_module: Any
) -> tuple[int, int]:
    """Phase 1: connect all clients concurrently. Returns (ok, fail)."""
    tasks = [c.connect(ws_module) for c in clients]
    results = await asyncio.gather(*tasks, return_exceptions=True)
    ok = sum(1 for r in results if r is None)
    fail = sum(1 for r in results if isinstance(r, Exception))
    return ok, fail


async def _join_all(clients: list[LoadClient]) -> tuple[int, int]:
    """Phase 2: JOIN_CAMPUS on all clients. Returns (ok, fail)."""
    tasks = [c.join() for c in clients]
    results = await asyncio.gather(*tasks, return_exceptions=True)
    ok = sum(1 for r in results if r is None)
    fail = sum(1 for r in results if isinstance(r, Exception))
    return ok, fail


async def _run_fanout_test(
    sender: LoadClient,
    receivers: list[LoadClient],
    expected_msg_count: int,
    timeout: float = 5.0,
) -> dict[str, Any]:
    """
    Phase 3: sender emits one DRILL_TELEMETRY message.
    Every receiver must get exactly one DRILL_TELEMETRY broadcast.
    Returns fan-out metrics.
    """
    results: dict[str, Any] = {
        "sender_connect_latency_ms": sender.connect_latency_ms,
        "sender_join_latency_ms": sender.join_latency_ms,
        "fan_out_received": 0,
        "fan_out_latencies_ms": [],   # per-receiver latency in ms
        "fan_out_errors": [],
        "unexpected_messages": [],
        "timeout_count": 0,
    }

    # Per-listener timestamp lock — set once, immediately before send.
    sent_at_ref: list[float] = [0.0]  # mutable container so nested closure sees updates

    # Start one recv task per receiver — each records its own wall-clock at recv
    async def listen_for_fanout(client: LoadClient) -> None:
        while True:
            msg = await client.recv(timeout=timeout)
            if msg is None:
                results["timeout_count"] += 1
                return
            if msg.get("type") == "DRILL_TELEMETRY":
                # Latency = wall-clock when received minus when SENT.
                # sent_at_ref[0] is set to 0.0 until the sender fires,
                # so the first message after send gets a real latency.
                recv_at = time.perf_counter()
                t_sent = sent_at_ref[0]
                if t_sent > 0:
                    results["fan_out_latencies_ms"].append((recv_at - t_sent) * 1000)
                results["fan_out_received"] += 1
                return  # stop listening after one fan-out message
            else:
                results["unexpected_messages"].append(msg)

    # Start all listeners BEFORE sending so they are ready
    listen_tasks = [asyncio.create_task(listen_for_fanout(r)) for r in receivers]

    # Let listeners settle (this delay is NOT included in latency measurement
    # because we set sent_at AFTER the sleep, at the send call site)
    await asyncio.sleep(0.05)

    # Set the global sent timestamp RIGHT AT the send call — before await.
    # This is what each listener uses to compute its own round-trip.
    sent_at_ref[0] = time.perf_counter()
    await sender.send_telemetry(
        floor=3,
        cell=[12, 8],
        status="EVACUATING",
    )

    # Wait for all listeners to receive one DRILL_TELEMETRY message
    await asyncio.gather(*listen_tasks)

    results["fan_out_total"] = expected_msg_count
    results["fan_out_missing"] = expected_msg_count - results["fan_out_received"]
    return results


# ── Latency percentiles ─────────────────────────────────────────────────────

def _pct(values: list[float], pctile: float) -> float:
    if not values:
        return 0.0
    s = sorted(values)
    idx = int(len(s) * pctile / 100)
    idx = min(idx, len(s) - 1)
    return round(s[idx], 2)


# ── Main load test ──────────────────────────────────────────────────────────

async def run_load_test(
    num_clients: int,
    ws_url: str,
) -> dict[str, Any]:
    """
    Full load test pipeline:

    1. Connect + JOIN_CAMPUS with N clients in one campus room.
    2. Fan-out test: one client emits → all others receive within 50 ms.
    3. Emit N-1 telemetry messages and verify each appears in the fan-out.
    4. Report latency percentiles (p50, p95, p99) and dropped-packet count.
    """
    campus_id = f"LOAD-TEST-{int(time.time())}"
    drill_session_id = str(uuid4())
    test_id = str(uuid4())[:8]

    print(f"\n{'='*70}")
    print(f"  WebSocket Load Test  [{test_id}]")
    print(f"  Clients : {num_clients}")
    print(f"  Campus  : {campus_id}")
    print(f"  WS URL  : {ws_url}")
    print(f"{'='*70}\n")

    # Build client objects
    clients: list[LoadClient] = []
    for i in range(num_clients):
        uid = str(uuid4())
        token = _make_jwt(uid)
        c = LoadClient(
            user_uuid=uid,
            user_id=f"lt-{test_id}-{i}",
            campus_id=campus_id,
            drill_session_id=drill_session_id,
            url=f"{ws_url}?token={token}",
            token=token,
        )
        clients.append(c)

    import websockets
    ws_module = websockets

    # ── Phase 1: Connect ────────────────────────────────────────────────────
    t0 = time.perf_counter()
    print(f"[Phase 1] Connecting {num_clients} clients …")
    ok_conn, fail_conn = await _connect_all(clients, ws_module)
    t_conn = time.perf_counter() - t0
    connect_latencies = [c.connect_latency_ms for c in clients if c.connected_at]
    print(
        f"  Connected : {ok_conn}/{num_clients}  ({t_conn*1000:.1f} ms total)\n"
        f"  p50 connect latency : {_pct(connect_latencies, 50)} ms\n"
        f"  p95 connect latency : {_pct(connect_latencies, 95)} ms"
    )

    # ── Phase 2: Join ───────────────────────────────────────────────────────
    t0 = time.perf_counter()
    print(f"\n[Phase 2] JOIN_CAMPUS on {num_clients} clients …")
    ok_join, fail_join = await _join_all(clients)
    t_join = time.perf_counter() - t0
    join_latencies = [c.join_latency_ms for c in clients if c.joined_at]
    print(
        f"  Joined   : {ok_join}/{num_clients}  ({t_join*1000:.1f} ms total)\n"
        f"  p50 join latency   : {_pct(join_latencies, 50)} ms\n"
        f"  p95 join latency   : {_pct(join_latencies, 95)} ms"
    )

    if ok_join == 0:
        print("\n[FATAL] No clients joined — aborting fan-out test.")
        return {
            "phase1_connected": ok_conn,
            "phase2_joined": ok_join,
            "phase3_fanout": None,
        }

    # ── Phase 3: Fan-out ────────────────────────────────────────────────────
    sender = clients[0]
    receivers = clients[1:]
    num_receivers = len(receivers)

    print(f"\n[Phase 3] Fan-out test: 1 sender → {num_receivers} receivers …")
    t0 = time.perf_counter()
    fanout = await _run_fanout_test(sender, receivers, num_receivers)
    t_fanout = time.perf_counter() - t0

    fanout_latencies = fanout["fan_out_latencies_ms"]
    p50 = _pct(fanout_latencies, 50)
    p95 = _pct(fanout_latencies, 95)
    p99 = _pct(fanout_latencies, 99)

    print(
        f"  Received : {fanout['fan_out_received']}/{num_receivers}\n"
        f"  Missing  : {fanout['fan_out_missing']}\n"
        f" Timeouts  : {fanout['timeout_count']}\n"
        f"  Total time: {t_fanout*1000:.1f} ms\n"
        f"  Fan-out p50: {p50} ms\n"
        f"  Fan-out p95: {p95} ms\n"
        f"  Fan-out p99: {p99} ms"
    )
    if fanout["unexpected_messages"]:
        print(f"  Unexpected messages: {len(fanout['unexpected_messages'])}")

    # ── Phase 4: Multi-emitter stress ───────────────────────────────────────
    print(f"\n[Phase 4] Stress: {num_receivers} concurrent emitters …")
    stress_t0 = time.perf_counter()

    # Each client (except sender) sends one telemetry and the sender
    # listens for all of them. We collect what sender receives.
    sender.received.clear()
    sender_latencies: list[float] = []
    t_stress_send = time.perf_counter()

    async def stress_send(client: LoadClient) -> None:
        try:
            await client.send_telemetry(floor=4, cell=[5, 3], status="ACTIVE")
        except Exception:
            pass

    async def stress_recv() -> None:
        deadline = time.perf_counter() + 5.0
        while time.perf_counter() < deadline:
            msg = await sender.recv(timeout=1.0)
            if msg is None:
                break
            sender.received.append(msg)

    # Start recv task, then fire all sends concurrently
    recv_task = asyncio.create_task(stress_recv())
    await asyncio.gather(*[stress_send(c) for c in receivers])
    await recv_task

    t_stress = time.perf_counter() - stress_t0
    received_stress = [m for m in sender.received if m.get("type") == "DRILL_TELEMETRY"]
    print(
        f"  Emitted  : {num_receivers}\n"
        f"  Received : {len(received_stress)}/{num_receivers}\n"
        f"  Drop rate: {(num_receivers - len(received_stress)) / num_receivers * 100:.1f}%\n"
        f"  Wall time: {t_stress*1000:.1f} ms"
    )

    # ── Cleanup ─────────────────────────────────────────────────────────────
    await asyncio.gather(*[c.close() for c in clients], return_exceptions=True)

    # ── Summary ─────────────────────────────────────────────────────────────
    all_latencies = connect_latencies + join_latencies + fanout_latencies
    print(f"\n{'='*70}")
    print("  LOAD TEST SUMMARY")
    print(f"{'='*70}")
    print(f"  Clients              : {num_clients}")
    print(f"  Connected            : {ok_conn}/{num_clients}  (fail: {fail_conn})")
    print(f"  Joined               : {ok_join}/{num_clients}  (fail: {fail_join})")
    print(f"  Fan-out received     : {fanout['fan_out_received']}/{num_receivers}")
    print(f"  Fan-out p50 latency  : {p50} ms  {'✓' if p50 <= 50 else '✗ OVER 50ms'}")
    print(f"  Fan-out p95 latency  : {p95} ms")
    print(f"  Fan-out p99 latency  : {p99} ms")
    print(f"  Stress dropped msgs   : {num_receivers - len(received_stress)}/{num_receivers}")
    print(f"  Unexpected msgs      : {len(fanout['unexpected_messages'])}")
    print(f"{'='*70}\n")

    return {
        "num_clients": num_clients,
        "campus_id": campus_id,
        "phase1_connected": ok_conn,
        "phase1_connect_failures": fail_conn,
        "phase2_joined": ok_join,
        "phase2_join_failures": fail_join,
        "phase3_fanout": {
            "sent": num_receivers,
            "received": fanout["fan_out_received"],
            "missing": fanout["fan_out_missing"],
            "timeouts": fanout["timeout_count"],
            "p50_ms": p50,
            "p95_ms": p95,
            "p99_ms": p99,
            "p50_under_50ms": p50 <= 50,
        },
        "phase4_stress": {
            "emitted": num_receivers,
            "received": len(received_stress),
            # dropped can be negative if we received acknowledgement echoes —
            # clamp to 0 for the pass/fail check (more is not a failure)
            "dropped": max(0, num_receivers - len(received_stress)),
            "drop_rate_pct": round(
                max(0, num_receivers - len(received_stress)) / num_receivers * 100, 2
            ),
        },
    }


# ── CLI entrypoint ─────────────────────────────────────────────────────────

def _main() -> None:
    parser = argparse.ArgumentParser(
        description="WebSocket multi-user load test for SafeZone backend.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument(
        "--clients", "-n", type=int, default=50,
        help="Number of concurrent clients (default: 50, max: 200)",
    )
    parser.add_argument(
        "--ws-url", type=str, default=_WS_URL,
        help=f"WebSocket URL (default: {_WS_URL})",
    )
    args = parser.parse_args()

    n = min(max(args.clients, 1), 200)
    print(f"\nStarting WebSocket load test with {n} clients …")

    result = asyncio.run(run_load_test(n, args.ws_url))

    # Exit code: 0 = all good, 1 = issues detected
    if (
        result["phase1_connected"] == result["num_clients"]
        and result["phase2_joined"] == result["num_clients"]
        and result["phase3_fanout"] is not None
        and result["phase3_fanout"]["p50_under_50ms"]
        and result["phase3_fanout"]["missing"] == 0
        and result["phase4_stress"]["dropped"] == 0
    ):
        print("RESULT: PASS")
        sys.exit(0)
    else:
        print("RESULT: FAIL — see summary above.")
        sys.exit(1)


if __name__ == "__main__":
    _main()
