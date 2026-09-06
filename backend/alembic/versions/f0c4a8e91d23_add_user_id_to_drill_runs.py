"""add user_id to drill_runs + make drill_session_id nullable

The DrillRun model now stores the student/user ID directly and the
drill_session_id FK is relaxed to nullable (a default catch-all session
is created on first POST when the frontend runId is not a valid UUID).

Revision ID: f0c4a8e91d23
Revises: dr9c123d59bb0
Create Date: 2026-09-06 22:30:00.000000

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = "f0c4a8e91d23"
down_revision: Union[str, None] = "dr9c123d59bb0"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add user_id column with default "anonymous" so existing rows still
    # satisfy NOT NULL after the migration runs.
    op.execute("""
        ALTER TABLE drill_runs
        ADD COLUMN IF NOT EXISTS user_id VARCHAR(255) NOT NULL DEFAULT 'anonymous'
    """)
    op.execute("""
        CREATE INDEX IF NOT EXISTS idx_drill_runs_user ON drill_runs (user_id)
    """)
    # Relax drill_session_id to nullable so analytics-only runs don't
    # require a real session row.
    op.execute("""
        ALTER TABLE drill_runs
        ALTER COLUMN drill_session_id DROP NOT NULL
    """)


def downgrade() -> None:
    op.execute("DROP INDEX IF EXISTS idx_drill_runs_user")
    op.execute("""
        ALTER TABLE drill_runs
        ALTER COLUMN drill_session_id SET NOT NULL
    """)
    op.execute("""
        ALTER TABLE drill_runs
        DROP COLUMN IF EXISTS user_id
    """)
