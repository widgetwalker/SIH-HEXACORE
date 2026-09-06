"""add drill_runs table for persistent run telemetry

Persists end-of-run telemetry from POST /api/v1/telemetry/runs, replacing
browser localStorage persistence with server-side storage.

Revision ID: dr9c123d59bb0
Revises: 2026_08_29_floor_grid
Create Date: 2026-09-06 22:10:00.000000

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = "dr9c123d59bb0"
down_revision: Union[str, None] = "2026_08_29_floor_grid"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("""
        CREATE TABLE drill_runs (
            run_id VARCHAR(255) PRIMARY KEY,
            drill_session_id UUID NOT NULL REFERENCES drill_sessions(id) ON DELETE CASCADE,
            scenario_id VARCHAR(100) NOT NULL,
            scenario_name VARCHAR(255) NOT NULL,
            status VARCHAR(20) NOT NULL,
            time NUMERIC(8, 2) NOT NULL,
            oxygen_left NUMERIC(5, 2) NOT NULL,
            panic_peak NUMERIC(5, 2) NOT NULL,
            panic_freeze_seconds NUMERIC(5, 2),
            score NUMERIC(8, 2),
            smoke_standing_seconds NUMERIC(5, 2),
            smoke_crouch_seconds NUMERIC(5, 2),
            breath_count INTEGER NOT NULL DEFAULT 0,
            distance_traveled NUMERIC(8, 2),
            fire_cell_entries INTEGER,
            exit_used JSONB DEFAULT '{}'::jsonb,
            death_cell JSONB DEFAULT '{}'::jsonb,
            violations JSONB DEFAULT '[]'::jsonb,
            route_heat JSONB DEFAULT '[]'::jsonb,
            cols INTEGER NOT NULL DEFAULT 1,
            rows INTEGER NOT NULL DEFAULT 1,
            created_at BIGINT NOT NULL
        )
    """)

    op.execute("""
        CREATE INDEX idx_drill_runs_session ON drill_runs (drill_session_id)
    """)

    op.execute("""
        CREATE INDEX idx_drill_runs_scenario ON drill_runs (scenario_id)
    """)


def downgrade() -> None:
    op.execute("DROP INDEX IF EXISTS idx_drill_runs_scenario")
    op.execute("DROP INDEX IF EXISTS idx_drill_runs_session")
    op.execute("DROP TABLE IF EXISTS drill_runs")
