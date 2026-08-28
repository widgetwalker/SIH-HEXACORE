"""baseline schema from schema.sql

This migration is a direct, byte-for-byte copy of database/schema.sql
as it was reviewed and agreed on. From this point forward, schema.sql
at the repo root is a REFERENCE snapshot only - it does not get hand
edited again. Any future schema change (new table, new column, etc.)
must be made as a new Alembic revision, generated with:

    alembic revision -m "describe the change"

This keeps one single source of truth for "what does the database
actually look like right now" - the sequence of migration files -
instead of a raw SQL file that can silently drift out of sync with
what's actually been applied to the database.

Revision ID: f06f70f9c67b
Revises:
Create Date: 2026-08-27 12:40:40.293802

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f06f70f9c67b'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Executed as individual statements rather than one big multi-statement
    # string, because not every database driver reliably supports running
    # several SQL statements in a single execute() call.
    statements = [
        'CREATE EXTENSION IF NOT EXISTS "uuid-ossp"',
        'CREATE EXTENSION IF NOT EXISTS "postgis"',

        """
        CREATE TABLE institutions (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name VARCHAR(255) NOT NULL,
            institution_type VARCHAR(50) NOT NULL,
            affiliation_code VARCHAR(100) UNIQUE,
            contact_email VARCHAR(255) NOT NULL,
            contact_phone VARCHAR(20) NOT NULL,
            boundary_geofence GEOMETRY(POLYGON, 4326),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
        """,

        """
        CREATE TABLE buildings (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
            name VARCHAR(100) NOT NULL,
            total_floors INTEGER NOT NULL CHECK (total_floors >= 1),
            footprint_geometry GEOMETRY(POLYGON, 4326),
            has_fire_sprinklers BOOLEAN DEFAULT FALSE,
            has_alarm_system BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
        """,

        """
        CREATE TABLE floors (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            building_id UUID NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
            floor_number INTEGER NOT NULL,
            blueprint_svg_url TEXT,
            graph_nodes_json JSONB NOT NULL DEFAULT '[]'::jsonb,
            graph_edges_json JSONB NOT NULL DEFAULT '[]'::jsonb,
            is_accessible BOOLEAN DEFAULT TRUE,
            risk_level VARCHAR(20) DEFAULT 'SAFE',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
        """,

        """
        CREATE TYPE user_role_enum AS ENUM (
            'STUDENT',
            'TEACHER_WARDEN',
            'SCHOOL_ADMIN',
            'NDRF_RESPONDER',
            'FIRE_SERVICE',
            'POLICE_EMS',
            'SDMA_ANALYST'
        )
        """,

        """
        CREATE TABLE users (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            institution_id UUID REFERENCES institutions(id) ON DELETE SET NULL,
            full_name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            role user_role_enum NOT NULL DEFAULT 'STUDENT',
            age INTEGER,
            age_cohort VARCHAR(30),
            assigned_building_id UUID REFERENCES buildings(id),
            assigned_floor_number INTEGER,
            qr_badge_code VARCHAR(100) UNIQUE,
            nfc_card_id VARCHAR(100) UNIQUE,
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
        """,

        """
        CREATE TYPE drill_mode_enum AS ENUM (
            'VIRTUAL_SIMULATION', 'PHYSICAL_CLASSROOM_DRILL',
            'CAMPUS_WIDE_SIMULATION', 'REAL_EMERGENCY'
        )
        """,

        "CREATE TYPE drill_status_enum AS ENUM ('SCHEDULED', 'ACTIVE', 'COMPLETED', 'ABORTED')",

        """
        CREATE TABLE drill_sessions (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
            mode drill_mode_enum NOT NULL,
            status drill_status_enum NOT NULL DEFAULT 'SCHEDULED',
            scenario_id VARCHAR(100) NOT NULL,
            primary_hazard VARCHAR(100) NOT NULL,
            cascading_hazards JSONB DEFAULT '[]'::jsonb,
            started_at TIMESTAMP WITH TIME ZONE,
            ended_at TIMESTAMP WITH TIME ZONE,
            total_participants INTEGER DEFAULT 0,
            evacuated_count INTEGER DEFAULT 0,
            unaccounted_count INTEGER DEFAULT 0,
            average_evacuation_time_sec NUMERIC(8,2),
            aggregate_score NUMERIC(5,2)
        )
        """,

        """
        CREATE TABLE student_drill_telemetry (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            drill_session_id UUID NOT NULL REFERENCES drill_sessions(id) ON DELETE CASCADE,
            user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            starting_floor INTEGER NOT NULL,
            final_status VARCHAR(50) NOT NULL,
            evacuation_time_sec NUMERIC(8,2),
            panic_peak_score NUMERIC(5,2),
            cv_posture_compliance_score NUMERIC(5,2),
            prohibitions_violated JSONB DEFAULT '[]'::jsonb,
            escape_route_taken JSONB DEFAULT '[]'::jsonb,
            completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
        """,

        """
        CREATE TABLE emergency_alerts (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            cap_identifier VARCHAR(255) UNIQUE NOT NULL,
            sender VARCHAR(255) NOT NULL,
            sent_at TIMESTAMP WITH TIME ZONE NOT NULL,
            status VARCHAR(50) NOT NULL,
            msg_type VARCHAR(50) NOT NULL,
            urgency VARCHAR(50) NOT NULL,
            severity VARCHAR(50) NOT NULL,
            certainty VARCHAR(50) NOT NULL,
            event_category VARCHAR(100) NOT NULL,
            headline TEXT NOT NULL,
            description TEXT,
            instruction TEXT,
            affected_polygon GEOMETRY(POLYGON, 4326),
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
        """,

        "CREATE INDEX idx_institutions_geofence ON institutions USING GIST (boundary_geofence)",
        "CREATE INDEX idx_emergency_alerts_polygon ON emergency_alerts USING GIST (affected_polygon)",
        "CREATE INDEX idx_users_institution ON users (institution_id)",
        "CREATE INDEX idx_drill_telemetry_user ON student_drill_telemetry (user_id)",
        "CREATE INDEX idx_drill_telemetry_session ON student_drill_telemetry (drill_session_id)",
    ]

    for statement in statements:
        op.execute(statement)


def downgrade() -> None:
    # Drops everything this migration created, in reverse dependency
    # order (tables that reference other tables must go first).
    # This is a destructive baseline downgrade - fine for local
    # development, but never run this against real collected data.
    op.execute("DROP TABLE IF EXISTS student_drill_telemetry")
    op.execute("DROP TABLE IF EXISTS drill_sessions")
    op.execute("DROP TABLE IF EXISTS emergency_alerts")
    op.execute("DROP TABLE IF EXISTS users")
    op.execute("DROP TABLE IF EXISTS floors")
    op.execute("DROP TABLE IF EXISTS buildings")
    op.execute("DROP TABLE IF EXISTS institutions")
    op.execute("DROP TYPE IF EXISTS drill_status_enum")
    op.execute("DROP TYPE IF EXISTS drill_mode_enum")
    op.execute("DROP TYPE IF EXISTS user_role_enum")