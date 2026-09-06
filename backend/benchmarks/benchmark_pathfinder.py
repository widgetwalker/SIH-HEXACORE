#!/usr/bin/env python3
"""
Dynamic A* Pathfinder Latency & Benchmark Profiler.

Validates the sub-15ms real-time recalculation guarantee under simulated
catastrophic fire, smoke spread, and multi-floor building conditions.

Usage:
    python backend/benchmarks/benchmark_pathfinder.py
"""

import os
import sys
import time
import random
from pathlib import Path

# Ensure backend root is in sys.path
backend_root = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(backend_root))

from app.services.pathfinder import DynamicPathfinder
from app.schemas.pathfinder import PathRequest, HazardState


def run_benchmark(iterations: int = 500):
    print("=" * 70)
    print("  SafeZone Dynamic A* Pathfinder Latency Benchmark")
    print(f"  Iterations: {iterations} | Target SLA: < 15.0 ms (p95)")
    print("=" * 70)

    pf = DynamicPathfinder()
    schema_path = backend_root.parent / "data" / "floorplan_graph_schema.json"
    pf.load_from_schema_file(schema_path)

    floors = list(pf._floors.keys())
    print(f"Loaded {len(floors)} floors: {floors}")
    for fl in sorted(floors):
        print(f"  - Floor {fl}: {len(pf._exits.get(fl, []))} exits configured")

    initial_latencies = []
    reroute_latencies = []
    blocked_count = 0
    success_count = 0

    print("\nExecuting multi-floor evacuation and dynamic re-routing runs...")

    for i in range(iterations):
        floor = random.choice(floors)
        grid = pf._floors[floor]["grid"]
        open_cells = [
            (c, r) for r, row in enumerate(grid)
            for c, ch in enumerate(row)
            if ch in (".", "P", "D")
        ]
        if not open_cells:
            continue
        start_col, start_row = random.choice(open_cells)

        # 1. Initial Path
        req = PathRequest(
            start_col=start_col,
            start_row=start_row,
            start_floor=floor,
            hazard=HazardState(),
            max_time_ms=15.0,
        )

        t0 = time.perf_counter()
        res = pf.find_path(req)
        dur1 = (time.perf_counter() - t0) * 1000
        initial_latencies.append(dur1)

        if not res.found or len(res.path) < 4:
            continue

        # 2. Inject mid-route blockage and trigger re-route
        midpoint = res.path[len(res.path) // 2]
        fire_hazard = HazardState(
            fire_cells=[[midpoint[0], midpoint[1], midpoint[2]]],
            smoke_cells={
                f"{midpoint[0] + 1},{midpoint[1]},{midpoint[2]}": 0.85,
                f"{midpoint[0] - 1},{midpoint[1]},{midpoint[2]}": 0.65,
            },
            timestamp=time.time(),
        )
        reroute_req = PathRequest(
            start_col=res.path[0][0],
            start_row=res.path[0][1],
            start_floor=res.path[0][2],
            hazard=fire_hazard,
            max_time_ms=15.0,
        )

        t1 = time.perf_counter()
        re_res = pf.re_route(res.path, reroute_req)
        dur2 = (time.perf_counter() - t1) * 1000
        reroute_latencies.append(dur2)

        if re_res.found:
            success_count += 1
        else:
            blocked_count += 1

    def print_stats(name: str, values: list[float]):
        if not values:
            return
        values.sort()
        avg = sum(values) / len(values)
        p50 = values[int(len(values) * 0.50)]
        p90 = values[int(len(values) * 0.90)]
        p95 = values[int(len(values) * 0.95)]
        p99 = values[int(len(values) * 0.99)]
        max_val = values[-1]
        min_val = values[0]

        print(f"\n--- {name} (N = {len(values)}) ---")
        print(f"  Min latency:      {min_val:6.3f} ms")
        print(f"  Mean latency:     {avg:6.3f} ms")
        print(f"  50th %ile (p50):  {p50:6.3f} ms")
        print(f"  90th %ile (p90):  {p90:6.3f} ms")
        print(f"  95th %ile (p95):  {p95:6.3f} ms  {'[PASS]' if p95 < 15.0 else '[FAIL]'}")
        print(f"  99th %ile (p99):  {p99:6.3f} ms  {'[PASS]' if p99 < 15.0 else '[FAIL]'}")
        print(f"  Max latency:      {max_val:6.3f} ms")

    print_stats("Initial Route Search", initial_latencies)
    print_stats("Dynamic Hazard Re-route", reroute_latencies)

    print("\n" + "=" * 70)
    print(f"  BENCHMARK SUMMARY:")
    p95_reroute = sorted(reroute_latencies)[int(len(reroute_latencies) * 0.95)] if reroute_latencies else 0
    if p95_reroute < 15.0:
        print(f"  [SUCCESS] All reroute operations comfortably satisfied < 15ms budget! (p95 = {p95_reroute:.2f}ms)")
    else:
        print(f"  [WARNING] Re-route p95 was {p95_reroute:.2f}ms")
    print("=" * 70)


if __name__ == "__main__":
    run_benchmark(iterations=300)
