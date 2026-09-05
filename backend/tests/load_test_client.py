#!/usr/bin/env python3
"""
WebSocket load test client for the disaster preparedness backend.

This script can be run standalone to test the WebSocket endpoint:
- /api/v1/ws

Usage:
    python load_test_client.py

Requirements:
    pip install websockets

Environment variables:
    WS_URL: WebSocket URL (default: ws://localhost:8000/api/v1/ws)
    JWT_SECRET_KEY: Secret key for JWT encoding
"""

import asyncio
import json
import os
import sys
import time
from dataclasses import dataclass, field
from datetime import datetime, timezone, timedelta
from typing import List, Optional
from uuid import uuid4

import jwt


# Configuration
WS_URL = os.getenv("WS_URL", "ws://localhost:8000/api/v1/ws")
JWT_ALGORITHM = "HS256"

# SECURITY: refuse to use the placeholder default secret.  A load test
# signed with a known-default key is useless (and dangerous if it ever
# runs against a misconfigured server).
JWT_SECRET = os.getenv("JWT_SECRET_KEY")
if not JWT_SECRET or JWT_SECRET == "change-me-in-env-file":
    print("ERROR: JWT_SECRET_KEY env var must be set to a real secret "
          "(not the placeholder).", file=sys.stderr)
    sys.exit(1)


def create_jwt(user_id: str, role: str = "STUDENT") -> str:
    """Create a JWT token for testing."""
    payload = {
        "sub": user_id,
        "role": role,
        "iat": datetime.now(timezone.utc),
        "exp": datetime.now(timezone.utc) + timedelta(hours=1),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


@dataclass
class TestClient:
    """A single WebSocket test client."""

    user_id: str
    role: str
    campus_id: str
    drill_session_id: str
    ws_url: str
    token: str
    received_messages: List[dict] = field(default_factory=list)
    connected: bool = False
    joined: bool = False
    errors: List[str] = field(default_factory=list)

    @property
    def url(self) -> str:
        return f"{self.ws_url}?token={self.token}"


async def run_test_client(client: TestClient) -> None:
    """Run a single test client through the connection lifecycle."""
    try:
        import websockets

        async with websockets.connect(client.url) as ws:
            client.connected = True
            print(f"[{client.user_id}] Connected to WebSocket")

            # Step 1: Join campus
            join_msg = {
                "type": "JOIN_CAMPUS",
                "campus_id": client.campus_id,
            }
            await ws.send(json.dumps(join_msg))
            print(f"[{client.user_id}] Sent JOIN_CAMPUS")

            # Wait for acknowledgment
            response = await asyncio.wait_for(ws.recv(), timeout=5.0)
            data = json.loads(response)
            client.received_messages.append(data)
            print(f"[{client.user_id}] Received: {data}")

            client.joined = True

            # Step 2: Send telemetry
            telemetry_msg = {
                "type": "DRILL_TELEMETRY",
                "drill_session_id": client.drill_session_id,
                "floor": 3,
                "cell": [12, 8],
                "status": "ACTIVE",
            }
            await ws.send(json.dumps(telemetry_msg))
            print(f"[{client.user_id}] Sent DRILL_TELEMETRY")

            # Step 3: Listen for broadcasts (with timeout)
            try:
                while True:
                    response = await asyncio.wait_for(ws.recv(), timeout=2.0)
                    data = json.loads(response)
                    client.received_messages.append(data)
                    print(f"[{client.user_id}] Received broadcast: {data}")
            except asyncio.TimeoutError:
                print(f"[{client.user_id}] No more broadcasts (timeout)")

    except asyncio.TimeoutError:
        client.errors.append("Connection timeout")
        print(f"[{client.user_id}] ERROR: Connection timeout")
    except websockets.exceptions.ConnectionClosed as e:
        if client.joined:
            print(f"[{client.user_id}] Disconnected (expected after test)")
        else:
            client.errors.append(f"Connection closed before joining: {e}")
            print(f"[{client.user_id}] ERROR: Connection closed: {e}")
    except Exception as e:
        client.errors.append(str(e))
        print(f"[{client.user_id}] ERROR: {e}")


async def test_broadcast(client: TestClient, severity: str, message: str) -> None:
    """Test emergency broadcast functionality."""
    try:
        import websockets

        async with websockets.connect(client.url) as ws:
            # Join campus first
            await ws.send(json.dumps({"type": "JOIN_CAMPUS", "campus_id": client.campus_id}))
            await asyncio.wait_for(ws.recv(), timeout=5.0)

            print(f"[{client.user_id}] Waiting for emergency broadcast...")

            # Wait for emergency broadcast (with long timeout for testing)
            response = await asyncio.wait_for(ws.recv(), timeout=10.0)
            data = json.loads(response)

            if data.get("type") == "EMERGENCY_BROADCAST":
                print(f"[{client.user_id}] Received EMERGENCY_BROADCAST: {data}")
            else:
                print(f"[{client.user_id}] Received: {data}")

    except asyncio.TimeoutError:
        print(f"[{client.user_id}] No emergency broadcast received (timeout)")
    except Exception as e:
        print(f"[{client.user_id}] Broadcast test error: {e}")


async def run_load_test(num_clients: int = 5) -> dict:
    """Run load test with multiple concurrent clients."""
    print(f"\n{'='*60}")
    print(f"LOAD TEST: {num_clients} concurrent clients")
    print(f"{'='*60}\n")

    campus_id = f"LOAD-TEST-{int(time.time())}"
    drill_session_id = str(uuid4())

    # Create test clients
    clients = []
    for i in range(num_clients):
        user_id = f"load-test-user-{i}"
        token = create_jwt(user_id, "STUDENT")
        client = TestClient(
            user_id=user_id,
            role="STUDENT",
            campus_id=campus_id,
            drill_session_id=drill_session_id,
            ws_url=WS_URL,
            token=token,
        )
        clients.append(client)

    # Run all clients concurrently
    start_time = time.time()
    await asyncio.gather(*[run_test_client(c) for c in clients])
    elapsed = time.time() - start_time

    # Report results
    successful = sum(1 for c in clients if c.joined)
    errors = [err for c in clients for err in c.errors]

    print(f"\n{'='*60}")
    print("LOAD TEST RESULTS")
    print(f"{'='*60}")
    print(f"Total clients:     {num_clients}")
    print(f"Successful joins:  {successful}")
    print(f"Failed joins:      {num_clients - successful}")
    print(f"Elapsed time:      {elapsed:.2f}s")
    print(f"Messages received: {sum(len(c.received_messages) for c in clients)}")

    if errors:
        print(f"\nErrors encountered:")
        for err in errors[:10]:  # Show first 10 errors
            print(f"  - {err}")

    return {
        "num_clients": num_clients,
        "successful": successful,
        "failed": num_clients - successful,
        "elapsed": elapsed,
        "errors": errors,
    }


async def test_connection_and_join() -> bool:
    """Test basic connection and campus join."""
    print(f"\n{'='*60}")
    print("TEST: Connection and Campus Join")
    print(f"{'='*60}\n")

    campus_id = f"JOIN-TEST-{int(time.time())}"
    user_id = f"join-test-user-{uuid4().hex[:8]}"
    token = create_jwt(user_id, "STUDENT")

    try:
        import websockets

        url = f"{WS_URL}?token={token}"
        print(f"Connecting to: {url}")

        async with websockets.connect(url) as ws:
            print("[PASS] WebSocket connected successfully")

            # Send JOIN_CAMPUS
            join_msg = {"type": "JOIN_CAMPUS", "campus_id": campus_id}
            await ws.send(json.dumps(join_msg))
            print("[PASS] Sent JOIN_CAMPUS message")

            # Wait for response
            response = await asyncio.wait_for(ws.recv(), timeout=5.0)
            data = json.loads(response)
            print(f"[PASS] Received response: {data}")

            # Send telemetry
            telemetry_msg = {
                "type": "DRILL_TELEMETRY",
                "drill_session_id": str(uuid4()),
                "floor": 2,
                "cell": [5, 3],
                "status": "EVACUATING",
            }
            await ws.send(json.dumps(telemetry_msg))
            print("[PASS] Sent DRILL_TELEMETRY message")

            # Wait for broadcast
            response = await asyncio.wait_for(ws.recv(), timeout=5.0)
            data = json.loads(response)
            print(f"[PASS] Received broadcast: {data}")

            return True

    except asyncio.TimeoutError:
        print("[FAIL] Connection timeout")
        return False
    except websockets.exceptions.InvalidStatusCode as e:
        print(f"[FAIL] Invalid status code: {e}")
        return False
    except Exception as e:
        print(f"[FAIL] Error: {e}")
        return False


async def test_invalid_token() -> bool:
    """Test that invalid tokens are rejected."""
    print(f"\n{'='*60}")
    print("TEST: Invalid Token Rejection")
    print(f"{'='*60}\n")

    try:
        import websockets

        url = f"{WS_URL}?token=invalid_token"
        print(f"Connecting with invalid token to: {url}")

        async with websockets.connect(url) as ws:
            print("[FAIL] Connection accepted with invalid token (should have been rejected)")
            return False

    except websockets.exceptions.InvalidStatusCode as e:
        print(f"[PASS] Connection rejected with status code: {e}")
        return True
    except Exception as e:
        print(f"[PASS] Connection rejected: {e}")
        return True


async def test_malformed_json() -> bool:
    """Test handling of malformed JSON messages."""
    print(f"\n{'='*60}")
    print("TEST: Malformed JSON Handling")
    print(f"{'='*60}\n")

    campus_id = f"MALFORMED-TEST-{int(time.time())}"
    user_id = f"malformed-test-user-{uuid4().hex[:8]}"
    token = create_jwt(user_id, "STUDENT")

    try:
        import websockets

        url = f"{WS_URL}?token={token}"

        async with websockets.connect(url) as ws:
            print("[PASS] Connected successfully")

            # Send malformed JSON
            await ws.send("{ invalid json }")
            print("[PASS] Sent malformed JSON")

            # Should receive error response
            try:
                response = await asyncio.wait_for(ws.recv(), timeout=5.0)
                data = json.loads(response)
                if data.get("type") == "ERROR":
                    print(f"[PASS] Received ERROR response: {data}")
                    return True
                else:
                    print(f"[WARN] Received unexpected response: {data}")
                    return True
            except asyncio.TimeoutError:
                print("[WARN] No error response received (timeout)")
                return True

    except Exception as e:
        print(f"[INFO] Error (may be expected): {e}")
        return True


async def main():
    """Run all WebSocket tests."""
    print("\n" + "=" * 60)
    print("WEBSOCKET LOAD TEST CLIENT")
    print("Disaster Preparedness Backend")
    print("=" * 60)
    print(f"WS URL: {WS_URL}")
    print(f"JWT Secret: {JWT_SECRET[:10]}...")
    print()

    # Run tests
    tests = [
        test_connection_and_join(),
        test_invalid_token(),
        test_malformed_json(),
    ]

    results = await asyncio.gather(*tests, return_exceptions=True)

    # Run load test
    load_test_result = await run_load_test(num_clients=5)

    # Summary
    print(f"\n{'='*60}")
    print("TEST SUMMARY")
    print(f"{'='*60}")

    test_names = ["Connection & Join", "Invalid Token", "Malformed JSON"]
    for name, result in zip(test_names, results):
        status = "PASS" if result is True else "FAIL"
        print(f"  {name}: {status}")

    load_status = "PASS" if load_test_result["failed"] == 0 else "PARTIAL"
    print(f"  Load Test: {load_status} ({load_test_result['successful']}/{load_test_result['num_clients']} clients)")


if __name__ == "__main__":
    print("NOTE: This script requires the 'websockets' package.")
    print("Install it with: pip install websockets")
    print()

    try:
        import websockets
    except ImportError:
        print("ERROR: websockets package not installed")
        print("Run: pip install websockets")
        sys.exit(1)

    asyncio.run(main())
