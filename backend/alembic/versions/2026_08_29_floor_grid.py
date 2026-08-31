"""add floor_grid column to floors table

Revision ID: 2026_08_29_floor_grid
Revises: f06f70f9c67b
Create Date: 2026-08-29

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '2026_08_29_floor_grid'
down_revision: Union[str, None] = 'f06f70f9c67b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "floors",
        sa.Column("floor_grid", postgresql.JSONB(), nullable=False, server_default="[]"),
    )


def downgrade() -> None:
    op.drop_column("floors", "floor_grid")
