"""
Seeder: populate floors from data/floorplan_graph_schema.json.

Run once, or on deploy, to upsert institution + building + floor rows.

Usage:
  python -m app.scripts.seed_floor_grids
"""

import asyncio
import json
from pathlib import Path
from uuid import UUID, uuid4

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import AsyncSessionLocal
from app.models.institution import Building, Floor, Institution

SCHEMA_PATH = Path(__file__).resolve().parents[3] / "data" / "floorplan_graph_schema.json"


async def upsert_institution(session: AsyncSession, name: str) -> Institution:
    """Upsert a placeholder institution; the buildings + floors attach to it."""
    result = await session.execute(
        select(Institution).where(Institution.name == name)
    )
    institution = result.scalar_one_or_none()
    if institution:
        return institution
    institution = Institution(
        id=uuid4(),
        name=name,
        institution_type="HIGH_SCHOOL",
        contact_email="seed@sih.local",
        contact_phone="0000000000",
    )
    session.add(institution)
    await session.flush()
    return institution


async def upsert_building(
    session: AsyncSession,
    institution_id: UUID,
    name: str,
) -> Building:
    """Upsert a building under the given institution; return the row."""
    result = await session.execute(
        select(Building).where(Building.name == name)
    )
    building = result.scalar_one_or_none()
    if building:
        return building
    building = Building(
        id=uuid4(),
        institution_id=institution_id,
        name=name,
        total_floors=1,  # Minimum; updated to actual count after floors are seeded
        has_fire_sprinklers=True,
        has_alarm_system=True,
    )
    session.add(building)
    await session.flush()
    return building


async def upsert_floor(
    session: AsyncSession,
    building_id: UUID,
    floor_number: int,
    nodes: list,
    edges: list,
    grid: list[str],
) -> Floor:
    """Upsert a floor; return the row."""
    result = await session.execute(
        select(Floor).where(
            Floor.building_id == building_id,
            Floor.floor_number == floor_number,
        )
    )
    floor = result.scalar_one_or_none()
    if floor:
        floor.graph_nodes_json = nodes
        floor.graph_edges_json = edges
        floor.floor_grid = grid
        return floor
    floor = Floor(
        id=uuid4(),
        building_id=building_id,
        floor_number=floor_number,
        graph_nodes_json=nodes,
        graph_edges_json=edges,
        floor_grid=grid,
        is_accessible=True,
        risk_level="SAFE",
    )
    session.add(floor)
    return floor


async def main() -> None:
    with open(SCHEMA_PATH) as f:
        data = json.load(f)

    async with AsyncSessionLocal() as session:
        building_name = data["building_name"]
        total_floors = data["total_floors"]
        floors_data = data["floors"]

        institution = await upsert_institution(session, building_name)
        print(f"Upserted institution: {building_name} (id={institution.id})")

        building = await upsert_building(session, institution.id, building_name)
        print(f"Upserted building:   {building_name} (id={building.id})")

        for floor_data in floors_data:
            floor_number = floor_data["floor_number"]
            nodes = floor_data.get("nodes", [])
            edges = floor_data.get("edges", [])
            grid = floor_data.get("grid", [])

            floor = await upsert_floor(
                session,
                building.id,
                floor_number,
                nodes,
                edges,
                grid,
            )
            print(
                f"  Floor {floor_number}: {len(nodes)} nodes, "
                f"{len(edges)} edges, grid {len(grid)}x{len(grid[0]) if grid else 0}"
            )

        # Update building's total_floors
        building.total_floors = total_floors
        await session.commit()
        print(f"\nSeed complete: building_id={building.id}")


if __name__ == "__main__":
    asyncio.run(main())
