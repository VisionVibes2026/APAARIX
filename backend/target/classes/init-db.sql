-- ==============================================================================
-- APAARIX - PostgreSQL Database Initialization Script
-- SIH 2026 - PS 26263: APAAR-Based Student Verification & Enrolment Intelligence
-- ==============================================================================

-- Create extension for UUID generation if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Schema creation indicator
DO $$
BEGIN
    RAISE NOTICE 'APAARIX PostgreSQL database initialized successfully.';
END $$;

