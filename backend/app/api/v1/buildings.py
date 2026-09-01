"""
Building and floor endpoints.

Provides read-only access to building metadata and floor graph data so the
canvas frontend can fetch floor plans and register them for pathfinding.
"""

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db_session
from app.models.institution import Building, Floor
from app.schemas.institution import (
    BuildingResponse,
    BuildingFloorsResponse,
    FloorGraphData,
)

router = APIRouter()


@router.get("/buildings/{building_id}", response_model=BuildingResponse)
async def get_building(
    building_id: UUID,
    db: AsyncSession = Depends(get_db_session),
) -> BuildingResponse:
    """
    Return metadata for a single building.

    Raises 404 if the building does not exist.
    """
    result = await db.execute(
        select(Building).where(Building.id == building_id)
    )
    building = result.scalar_one_or_none()
    if building is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Building {building_id} not found",
        )

    return BuildingResponse(
        building_id=building.id,
        institution_id=building.institution_id,
        name=building.name,
        total_floors=building.total_floors,
        has_fire_sprinklers=building.has_fire_sprinklers,
        has_alarm_system=building.has_alarm_system,
        created_at=building.created_at,
    )


@router.get("/buildings/{building_id}/floors", response_model=BuildingFloorsResponse)
async def get_building_floors(
    building_id: UUID,
    db: AsyncSession = Depends(get_db_session),
) -> BuildingFloorsResponse:
    """
    Return all floors for a building, including graph_nodes_json and graph_edges_json.

    The canvas frontend uses this to fetch floor data and register it for
    pathfinding / visualisation.  Raises 404 if the building does not exist.
    """
    result = await db.execute(
        select(Building).where(Building.id == building_id)
    )
    building = result.scalar_one_or_none()
    if building is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Building {building_id} not found",
        )

    floors_result = await db.execute(
        select(Floor)
        .where(Floor.building_id == building_id)
        .order_by(Floor.floor_number)
    )
    floors = floors_result.scalars().all()

    floor_data = [
        FloorGraphData(
            floor_id=floor.id,
            floor_number=floor.floor_number,
            graph_nodes_json=floor.graph_nodes_json,
            graph_edges_json=floor.graph_edges_json,
            grid=floor.floor_grid,
            is_accessible=floor.is_accessible,
            risk_level=floor.risk_level,
        )
        for floor in floors
    ]

    return BuildingFloorsResponse(building_id=building_id, floors=floor_data)
