-- ====================================================================
-- PostgreSQL 16 + PostGIS 3.4 Schema Definition
-- SIH Gamified Disaster Preparedness and Response System
-- ====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 1. INSTITUTION & CAMPUS INFRASTRUCTURE
CREATE TABLE institutions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    institution_type VARCHAR(50) NOT NULL, -- 'PRIMARY_SCHOOL', 'HIGH_SCHOOL', 'COLLEGE', 'UNIVERSITY'
    affiliation_code VARCHAR(100) UNIQUE,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    boundary_geofence GEOMETRY(POLYGON, 4326),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE buildings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    total_floors INTEGER NOT NULL CHECK (total_floors >= 1),
    footprint_geometry GEOMETRY(POLYGON, 4326),
    has_fire_sprinklers BOOLEAN DEFAULT FALSE,
    has_alarm_system BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE floors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    building_id UUID NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
    floor_number INTEGER NOT NULL, -- 0 (Ground), 1, 2, 3, 4, 5
    blueprint_svg_url TEXT,
    graph_nodes_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    graph_edges_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_accessible BOOLEAN DEFAULT TRUE,
    risk_level VARCHAR(20) DEFAULT 'SAFE', -- 'SAFE', 'WARNING', 'CRITICAL', 'BLOCKED'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. USERS, ROLES & COHORTS
CREATE TYPE user_role_enum AS ENUM (
    'STUDENT', 
    'TEACHER_WARDEN', 
    'SCHOOL_ADMIN', 
    'NDRF_RESPONDER', 
    'FIRE_SERVICE', 
    'POLICE_EMS', 
    'SDMA_ANALYST'
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID REFERENCES institutions(id) ON DELETE SET NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role_enum NOT NULL DEFAULT 'STUDENT',
    age INTEGER,
    age_cohort VARCHAR(30), -- 'TIER_1_EARLY_PRIMARY', 'TIER_2_UPPER_PRIMARY', 'TIER_3_MIDDLE', 'TIER_4_SECONDARY', 'TIER_5_COLLEGE'
    assigned_building_id UUID REFERENCES buildings(id),
    assigned_floor_number INTEGER,
    qr_badge_code VARCHAR(100) UNIQUE,
    nfc_card_id VARCHAR(100) UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. DRILL SESSIONS & REAL-TIME TELEMETRY
CREATE TYPE drill_mode_enum AS ENUM ('VIRTUAL_SIMULATION', 'PHYSICAL_CLASSROOM_DRILL', 'CAMPUS_WIDE_SIMULATION', 'REAL_EMERGENCY');
CREATE TYPE drill_status_enum AS ENUM ('SCHEDULED', 'ACTIVE', 'COMPLETED', 'ABORTED');

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
);

CREATE TABLE student_drill_telemetry (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    drill_session_id UUID NOT NULL REFERENCES drill_sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    starting_floor INTEGER NOT NULL,
    final_status VARCHAR(50) NOT NULL, -- 'EVACUATED_SAFE', 'TRAPPED_SHELTERED', 'VIRTUAL_CASUALTY'
    evacuation_time_sec NUMERIC(8,2),
    panic_peak_score NUMERIC(5,2),
    cv_posture_compliance_score NUMERIC(5,2), -- From webcam Drop-Cover-Hold check
    prohibitions_violated JSONB DEFAULT '[]'::jsonb,
    escape_route_taken JSONB DEFAULT '[]'::jsonb,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. SACHET / CAP v1.2 EMERGENCY ALERTS
CREATE TABLE emergency_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cap_identifier VARCHAR(255) UNIQUE NOT NULL,
    sender VARCHAR(255) NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50) NOT NULL, -- 'Actual', 'Exercise', 'Test'
    msg_type VARCHAR(50) NOT NULL, -- 'Alert', 'Update', 'Cancel'
    urgency VARCHAR(50) NOT NULL, -- 'Immediate', 'Expected', 'Future'
    severity VARCHAR(50) NOT NULL, -- 'Extreme', 'Severe', 'Moderate', 'Minor'
    certainty VARCHAR(50) NOT NULL, -- 'Observed', 'Likely', 'Possible'
    event_category VARCHAR(100) NOT NULL, -- 'Geo', 'Met', 'Safety', 'Fire'
    headline TEXT NOT NULL,
    description TEXT,
    instruction TEXT,
    affected_polygon GEOMETRY(POLYGON, 4326),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. SPATIAL & INDEX PERFORMANCE OPTIMIZATIONS
CREATE INDEX idx_institutions_geofence ON institutions USING GIST (boundary_geofence);
CREATE INDEX idx_emergency_alerts_polygon ON emergency_alerts USING GIST (affected_polygon);
CREATE INDEX idx_users_institution ON users (institution_id);
CREATE INDEX idx_drill_telemetry_user ON student_drill_telemetry (user_id);
CREATE INDEX idx_drill_telemetry_session ON student_drill_telemetry (drill_session_id);
