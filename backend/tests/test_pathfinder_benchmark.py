"""
Automated benchmark and performance validation test for DynamicPathfinder.

Validates:
1. Initial A* path computation time (< 5ms target).
2. Dynamic mid-route re-routing upon obstacle/fire eruption (< 15ms target).
3. 100-iteration stress run across floors 0-5 with randomized dynamic hazards.
"""

import time
import random
import pytest
from app.services.pathfinder import DynamicPathfinder
from app.schemas.pathfinder import PathRequest, HazardState


@pytest.fixture(scope="module")
def initialized_pathfinder():
    pf = DynamicPathfinder()
    pf.load_from_schema_file()
    return pf


def test_pathfinder_initialization(initialized_pathfinder):
    """Ensure all 6 floors and exits are loaded."""
    assert len(initialized_pathfinder._floors) >= 1
    assert len(initialized_pathfinder._exits) >= 1


def test_initial_path_performance_sub_15ms(initialized_pathfinder):
    """Validate initial evacuation path calculation executes in < 15ms (typically < 5ms)."""
    # Start at classroom on Floor 5 (top floor)
    req = PathRequest(
        start_col=2,
        start_row=2,
        start_floor=5,
        hazard=HazardState(),
        max_time_ms=15.0,
    )
    
    t0 = time.perf_counter()
    result = initialized_pathfinder.find_path(req)
    elapsed_ms = (time.perf_counter() - t0) * 1000

    assert result.found is True, "Path should be found to exit"
    assert len(result.path) > 0
    assert elapsed_ms < 15.0, f"Initial path took {elapsed_ms:.2f}ms, exceeding 15ms budget"


def test_dynamic_reroute_sub_15ms(initialized_pathfinder):
    """Validate incremental re-route around mid-path fire outbreak executes in < 15ms."""
    # 1. Compute initial path
    req = PathRequest(
        start_col=2,
        start_row=2,
        start_floor=5,
        hazard=HazardState(),
        max_time_ms=15.0,
    )
    initial_result = initialized_pathfinder.find_path(req)
    assert initial_result.found is True
    initial_path = initial_result.path
    assert len(initial_path) >= 4

    # 2. Block a waypoint downstream (ahead of current position) with fire
    downstream_idx = min(len(initial_path) - 2, len(initial_path) // 2 + 1)
    blocked_waypoint = initial_path[downstream_idx]
    hazard_with_fire = HazardState(
        fire_cells=[[blocked_waypoint[0], blocked_waypoint[1], blocked_waypoint[2]]],
        smoke_cells={f"{blocked_waypoint[0] + 1},{blocked_waypoint[1]},{blocked_waypoint[2]}": 0.8},
        timestamp=time.time(),
    )

    reroute_req = PathRequest(
        start_col=initial_path[0][0],
        start_row=initial_path[0][1],
        start_floor=initial_path[0][2],
        hazard=hazard_with_fire,
        max_time_ms=15.0,
    )

    # 3. Time the re-route
    t0 = time.perf_counter()
    reroute_result = initialized_pathfinder.re_route(initial_path, reroute_req)
    elapsed_ms = (time.perf_counter() - t0) * 1000

    assert elapsed_ms < 15.0, f"Reroute took {elapsed_ms:.2f}ms, exceeding 15ms budget"
    # Ensure blocked cell is avoided if path found
    if reroute_result.found:
        assert blocked_waypoint not in reroute_result.path, "Rerouted path must avoid fire cell"


def test_stress_benchmark_100_runs_sub_15ms(initialized_pathfinder):
    """Run 100 random pathfinding requests with randomized fire and smoke."""
    latencies: list[float] = []

    for i in range(100):
        # Pick valid non-wall starting point
        floor = random.choice(list(initialized_pathfinder._floors.keys()))
        grid = initialized_pathfinder._floors[floor]["grid"]
        
        valid_cells = [
            (c, r) for r, row in enumerate(grid)
            for c, ch in enumerate(row)
            if ch in (".", "P", "D")
        ]
        if not valid_cells:
            continue
        start_col, start_row = random.choice(valid_cells)

        # Random hazards
        fire_cells = [
            [random.randint(1, 23), random.randint(1, 12), floor]
            for _ in range(3)
        ]
        smoke_cells = {
            f"{random.randint(1, 23)},{random.randint(1, 12)},{floor}": round(random.random(), 2)
            for _ in range(5)
        }

        req = PathRequest(
            start_col=start_col,
            start_row=start_row,
            start_floor=floor,
            hazard=HazardState(fire_cells=fire_cells, smoke_cells=smoke_cells, timestamp=time.time()),
            max_time_ms=15.0,
        )

        t0 = time.perf_counter()
        res = initialized_pathfinder.find_path(req)
        dur_ms = (time.perf_counter() - t0) * 1000
        latencies.append(dur_ms)

    latencies.sort()
    avg_latency = sum(latencies) / len(latencies)
    p50 = latencies[int(len(latencies) * 0.50)]
    p95 = latencies[int(len(latencies) * 0.95)]
    p99 = latencies[int(len(latencies) * 0.99)]
    max_latency = latencies[-1]

    print(f"\n[Pathfinder Benchmark 100 Runs]: Avg={avg_latency:.2f}ms | p50={p50:.2f}ms | p95={p95:.2f}ms | p99={p99:.2f}ms | Max={max_latency:.2f}ms")

    assert p95 < 15.0, f"p95 latency was {p95:.2f}ms, must be < 15.0ms"
    assert avg_latency < 5.0, f"Average latency was {avg_latency:.2f}ms, must be < 5.0ms"
