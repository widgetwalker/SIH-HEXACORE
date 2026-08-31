"""
Drill scenario endpoints.

Serves scenario metadata and drill configuration parameters
that were previously loaded from scenarios.json.

Data is embedded in the module — no external file dependency,
making deployment a single-step operation.
"""

from typing import List

from fastapi import APIRouter

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
