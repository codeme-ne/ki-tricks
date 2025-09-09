-- Minimal, high-value research fields for ki_tricks
-- Focus: role targeting, sources, privacy, and measurable impact

-- Roles commonly found in DACH enterprises (extend as needed)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'company_role_enum'
  ) THEN
    CREATE TYPE company_role_enum AS ENUM (
      'general',
      'sales',
      'marketing',
      'hr',
      'finance',
      'it',
      'procurement',
      'operations',
      'customer-service',
      'legal',
      'product',
      'consulting'
    );
  END IF;
END $$;

-- Evidence and risk levels
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'evidence_level_enum') THEN
    CREATE TYPE evidence_level_enum AS ENUM ('A', 'B', 'C');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'risk_level_enum') THEN
    CREATE TYPE risk_level_enum AS ENUM ('low', 'medium', 'high');
  END IF;
END $$;

-- Add columns (kept nullable for backward-compatibility)
ALTER TABLE ki_tricks
  ADD COLUMN IF NOT EXISTS role company_role_enum,
  ADD COLUMN IF NOT EXISTS industries TEXT[] DEFAULT '{}'::TEXT[],
  ADD COLUMN IF NOT EXISTS tool_vendor TEXT,
  ADD COLUMN IF NOT EXISTS integrations TEXT[] DEFAULT '{}'::TEXT[],
  ADD COLUMN IF NOT EXISTS estimated_time_minutes INTEGER,
  ADD COLUMN IF NOT EXISTS estimated_savings_minutes INTEGER,
  ADD COLUMN IF NOT EXISTS risk_level risk_level_enum,
  ADD COLUMN IF NOT EXISTS evidence_level evidence_level_enum,
  ADD COLUMN IF NOT EXISTS prerequisites TEXT,
  ADD COLUMN IF NOT EXISTS privacy_notes TEXT,
  ADD COLUMN IF NOT EXISTS sources JSONB,
  ADD COLUMN IF NOT EXISTS prompt_examples TEXT[],
  ADD COLUMN IF NOT EXISTS kpi_suggestions TEXT[];

-- Indexes for common filters
CREATE INDEX IF NOT EXISTS idx_tricks_role ON ki_tricks(role);
CREATE INDEX IF NOT EXISTS idx_tricks_tool_vendor ON ki_tricks(tool_vendor);
CREATE INDEX IF NOT EXISTS idx_tricks_evidence_level ON ki_tricks(evidence_level);
CREATE INDEX IF NOT EXISTS idx_tricks_risk_level ON ki_tricks(risk_level);

