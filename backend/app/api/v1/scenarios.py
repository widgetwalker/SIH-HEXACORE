"""
Drill scenario endpoints.

Serves scenario metadata and drill configuration parameters
that were previously loaded from scenarios.json.

Data is embedded in the module — no external file dependency,
making deployment a single-step operation.
"""

from typing import List, Optional

from fastapi import APIRouter, HTTPException

from app.schemas.scenarios import Scenario, ScenarioListResponse

router = APIRouter()


# Embedded scenarios — mirrors the original frontend/src/data/scenarios.json
# shape so the existing TypeScript Scenario interface works unchanged when
# the frontend migrates to fetch("/api/v1/scenarios").  Field accessors
# (scen.timeLimit, scen.colors.flame, scen.id, etc.) stay flat.
#
# Note: em-dashes (U+2014) in the brief text have been kept as-is since
# the original scenarios.json already uses them.
SCENARIOS_DB: List[Scenario] = [
    {
        "id": "lab-fire-east-wing",
        "name": "Lab Fire",
        "badge": "SCENARIO 07 \xb7 LAB FIRE \xb7 EAST WING",
        "hazardLabel": "FIRE",
        "difficulty": 1,
        "brief": "A fire has ignited somewhere in the building and is spreading cell by cell. Smoke drains your oxygen. Panic slows your legs. Reach the green assembly beacon before conditions overwhelm you.",
        "timeLimit": 120,
        "spreadInterval": 2.6,
        "spreadChance": 0.45,
        "fogDensity": 0.02,
        "colors": {"flame": "#ff7a1a", "glow": "#ef4444", "smoke": "#30363f"},
        "map": [
            "########################",
            "#P........#........#...#",
            "#.........#........#...#",
            "#.....##..#..##....#.F.#",
            "####.###########.###.###",
            "#......................#",
            "#......................#",
            "###.#######.#######.####",
            "#.....#........#.......#",
            "#..F..#........#.......#",
            "#.....#...##...#...#####",
            "#.....#........#...#..E#",
            "###.###.....##.#...#...#",
            "#.......#......#.......#",
            "#.......#..F...........#",
            "########################",
        ],
        "blockages": [],
    },
    {
        "id": "quake-compound",
        "name": "Quake + Fire",
        "badge": "SCENARIO 12 \xb7 COMPOUND QUAKE + FIRE \xb7 NORTH BLOCK",
        "hazardLabel": "FIRE",
        "difficulty": 2,
        "brief": "An earthquake has triggered fires across the north block. Amber doorways slow the flames - but aftershocks will seal the north-east wing mid-drill. Two assembly beacons are active; pick your exit early and stay flexible.",
        "timeLimit": 140,
        "spreadInterval": 2.8,
        "spreadChance": 0.42,
        "fogDensity": 0.02,
        "colors": {"flame": "#ff7a1a", "glow": "#ef4444", "smoke": "#30363f"},
        "map": [
            "########################",
            "#P.....#........#.....E#",
            "#......#...F....#......#",
            "#......D........D......#",
            "#......#........#......#",
            "####D############D######",
            "#......................#",
            "#........####..........#",
            "#......................#",
            "#####D########D####D####",
            "#......#........#......#",
            "#..F...#........D......#",
            "#......D........#......#",
            "#......#........#...F..#",
            "#E.....#........#......#",
            "########################",
        ],
        "blockages": [
            {
                "t": 40,
                "warnT": 30,
                "cells": [[17, 5], [16, 3]],
                "warnMessage": "Structural groaning - NE wing unstable, brace for aftershock!",
                "message": "AFTERSHOCK! North-east wing sealed - reroute to the south-west beacon!",
            }
        ],
    },
    {
        "id": "chem-spill",
        "name": "Chemical Spill",
        "badge": "SCENARIO 19 \xb7 TOXIC GAS RELEASE \xb7 SCIENCE WING",
        "hazardLabel": "TOXIC GAS",
        "difficulty": 3,
        "brief": "A chemical reaction in the prep room is venting toxic gas that spreads faster than fire. Gas masks are not available - minimize exposure time, keep moving, and use either the east or south assembly point.",
        "timeLimit": 100,
        "spreadInterval": 2.0,
        "spreadChance": 0.55,
        "fogDensity": 0.03,
        # Toxic gas: amber warning / sickly green gas plane; avoids fire-red connotation.
        "colors": {"flame": "#f59e0b", "glow": "#a3e635", "smoke": "#3f4e1f"},
        "map": [
            "########################",
            "#..P...#......#........#",
            "#......D..F...#...E....#",
            "#......#......D........#",
            "###D########D#######D###",
            "#......................#",
            "#...####......####.....#",
            "#...#..D......D..#.....#",
            "#...####......####.....#",
            "#......................#",
            "####D##########D####D###",
            "#......#.......#.......#",
            "#..F...#...F...D....E..#",
            "#......#.......#.......#",
            "########################",
        ],
        "blockages": [],
    },
    {
        "id": "blackout-fire",
        "name": "Blackout Drill",
        "badge": "SCENARIO 23 \xb7 NIGHT FIRE \xb7 POWER FAILURE",
        "hazardLabel": "FIRE",
        "difficulty": 2,
        "brief": "Night shift. The fire has tripped the mains - visibility is near zero and the fire moves slowly but steadily in the dark. Memorize landmarks fast: you cannot see the smoke until you are inside it.",
        "timeLimit": 150,
        "spreadInterval": 3.2,
        "spreadChance": 0.38,
        "fogDensity": 0.055,
        "colors": {"flame": "#ff9d3a", "glow": "#f59e0b", "smoke": "#1c222c"},
        "map": [
            "########################",
            "#P........#........#...#",
            "#.........#........#...#",
            "#.....##..#..##....#.F.#",
            "####.###########.###.###",
            "#......................#",
            "#......................#",
            "###.#######.#######.####",
            "#.....#........#.......#",
            "#..F..#........#.......#",
            "#.....#...##...#...#####",
            "#.....#........#...#..E#",
            "###.###.....##.#...#...#",
            "#.......#......#.......#",
            "#.......#..F...........#",
            "########################",
        ],
        "blockages": [],
    },
]


@router.get(
    "/scenarios",
    response_model=ScenarioListResponse,
    tags=["scenarios"],
    summary="List all drill scenarios",
)
def list_scenarios() -> ScenarioListResponse:
    """
    Return all drill scenarios with their parameters.

    Each scenario contains:
    - id, name, badge, hazardLabel, difficulty, brief
    - timeLimit, spreadInterval, spreadChance, fogDensity, colors
    - map: ASCII floor-plan rows (walls, doors, exits, fire seeds)
    - blockages: optional timed corridor-sealing events
    """
    return ScenarioListResponse(scenarios=SCENARIOS_DB)


# ── Dynamic scenario generation ─────────────────────────────────────────

# Hazard templates: each one is a complete, valid floor-plan with seed
# fire cells (F), a player start (P), and at least one exit (E).  The
# generator varies the *parameters* (spread rate, fog, difficulty, etc.)
# per request rather than the map itself, which keeps the drill
# deterministic and fair while still giving the frontend variety.
_HAZARD_TEMPLATES = {
    "FIRE": {
        "name": "Lab Fire",
        "badge": "SCENARIO GEN \xb7 LAB FIRE",
        "hazardLabel": "FIRE",
        "colors": {"flame": "#ff7a1a", "glow": "#ef4444", "smoke": "#30363f"},
        "map": [
            "########################",
            "#P........#........#...#",
            "#.........#........#...#",
            "#.....##..#..##....#.F.#",
            "####.###########.###.###",
            "#......................#",
            "#......................#",
            "###.#######.#######.####",
            "#.....#........#.......#",
            "#..F..#........#.......#",
            "#.....#...##...#...#####",
            "#.....#........#...#..E#",
            "###.###.....##.#...#...#",
            "#.......#......#.......#",
            "#.......#..F...........#",
            "########################",
        ],
    },
    "TOXIC GAS": {
        "name": "Chemical Spill",
        "badge": "SCENARIO GEN \xb7 TOXIC GAS RELEASE",
        "hazardLabel": "TOXIC GAS",
        "colors": {"flame": "#f59e0b", "glow": "#a3e635", "smoke": "#3f4e1f"},
        "map": [
            "########################",
            "#..P...#......#........#",
            "#......D..F...#...E....#",
            "#......#......D........#",
            "###D########D#######D###",
            "#......................#",
            "#...####......####.....#",
            "#...#..D......D..#.....#",
            "#...####......####.....#",
            "#......................#",
            "####D##########D####D###",
            "#......#.......#.......#",
            "#..F...#...F...D....E..#",
            "#......#.......#.......#",
            "########################",
        ],
    },
    "QUAKE": {
        "name": "Quake + Fire",
        "badge": "SCENARIO GEN \xb7 COMPOUND QUAKE + FIRE",
        "hazardLabel": "FIRE",
        "colors": {"flame": "#ff7a1a", "glow": "#ef4444", "smoke": "#30363f"},
        "map": [
            "########################",
            "#P.....#........#.....E#",
            "#......#...F....#......#",
            "#......D........D......#",
            "#......#........#......#",
            "####D############D######",
            "#......................#",
            "#........####..........#",
            "#......................#",
            "#####D########D####D####",
            "#......#........#......#",
            "#..F...#........D......#",
            "#......D........#......#",
            "#......#........#...F..#",
            "#E.....#........#......#",
            "########################",
        ],
    },
    "BLACKOUT": {
        "name": "Blackout Drill",
        "badge": "SCENARIO GEN \xb7 NIGHT FIRE",
        "hazardLabel": "FIRE",
        "colors": {"flame": "#ff9d3a", "glow": "#f59e0b", "smoke": "#1c222c"},
        "map": [
            "########################",
            "#P........#........#...#",
            "#.........#........#...#",
            "#.....##..#..##....#.F.#",
            "####.###########.###.###",
            "#......................#",
            "#......................#",
            "###.#######.#######.####",
            "#.....#........#.......#",
            "#..F..#........#.......#",
            "#.....#...##...#...#####",
            "#.....#........#...#..E#",
            "###.###.....##.#...#...#",
            "#.......#......#.......#",
            "#.......#..F...........#",
            "########################",
        ],
    },
}


def _generate_scenario(hazard_label: str, seed: int) -> Scenario:
    """
    Deterministic parameter variation for a given hazard template.

    The seed is mixed into every numeric parameter so the same request
    always produces the same scenario — useful for replay and grading.
    """
    template = _HAZARD_TEMPLATES.get(hazard_label.upper(), _HAZARD_TEMPLATES["FIRE"])

    # Mix the seed into a pseudo-random but deterministic parameter set.
    # Using a simple LCG keeps the generator dependency-free (no numpy).
    state = seed
    def _rng() -> float:
        nonlocal state
        state = (state * 1664525 + 1013904223) & 0xFFFFFFFF
        return state / 0xFFFFFFFF

    difficulty = 1 + int(_rng() * 4)  # 1..5
    time_limit = 90 + int(_rng() * 90)  # 90..180 s
    spread_interval = round(2.0 + _rng() * 1.6, 2)  # 2.0..3.6 s
    spread_chance = round(0.35 + _rng() * 0.25, 2)  # 0.35..0.60
    fog_density = round(0.01 + _rng() * 0.05, 3)  # 0.01..0.06

    return Scenario(
        id=f"gen-{hazard_label.lower()}-{seed}",
        name=template["name"],
        badge=template["badge"],
        hazardLabel=template["hazardLabel"],
        difficulty=difficulty,
        brief=(
            f"Generated drill: {template['name'].lower()} with "
            f"difficulty {difficulty}/5 and a {time_limit}s limit."
        ),
        timeLimit=time_limit,
        spreadInterval=spread_interval,
        spreadChance=spread_chance,
        fogDensity=fog_density,
        colors=template["colors"],
        map=template["map"],
        blockages=[],
    )


@router.post(
    "/scenarios/generate",
    response_model=Scenario,
    tags=["scenarios"],
    summary="Generate a dynamic drill scenario",
)
async def generate_scenario(
    hazard_label: str = "FIRE",
    seed: Optional[int] = None,
) -> Scenario:
    """
    Generate a fresh drill scenario on demand.

    The scenario is built from a hazard template (FIRE, TOXIC GAS,
    QUAKE, BLACKOUT) with parameters varied deterministically by ``seed``.
    If no seed is supplied, one is derived from the current time so the
    drill feels different each run, while still being reproducible if the
    caller records the returned scenario's ``id``.

    Planned Sprint 3 enhancement: route the request through an LLM
    service for narrative-driven, fully custom maps.  The current
    implementation is a pure-Python generator with no external calls.
    """
    if seed is None:
        import time as _time
        seed = int(_time.time() * 1000) & 0xFFFFFFFF
    if not (0 <= seed <= 0xFFFFFFFF):
        raise HTTPException(
            status_code=422,
            detail="seed must be a non-negative 32-bit integer",
        )
    return _generate_scenario(hazard_label, seed)
