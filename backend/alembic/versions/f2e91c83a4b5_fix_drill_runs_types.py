"""fix drill_runs column types for telemetry API

- created_at: INTEGER → BIGINT so client millisecond timestamps (10+ digits)
  don't overflow int32 in asyncpg.
- No schema change needed for death_cell (JSONB handles None), but the ORM
  model needs to pass Python None explicitly.

Revision ID: f2e91c83a4b5
Revises: f0c4a8e91d23
Create Date: 2026-09-06 22:50:00.000000

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = "f2e91c83a4b5"
down_revision: Union[str, None] = "f0c4a8e91d23"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Change created_at from INTEGER to BIGINT so 13-digit ms timestamps fit
    op.execute("ALTER TABLE drill_runs ALTER COLUMN created_at TYPE BIGINT")


def downgrade() -> None:
    op.execute("ALTER TABLE drill_runs ALTER COLUMN created_at TYPE INTEGER")
