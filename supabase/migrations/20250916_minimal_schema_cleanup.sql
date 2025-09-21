-- Migration: Optimize schema by removing unused research fields
-- Date: 2025-09-15
-- Description: Streamline ki_tricks table to keep only essential fields

BEGIN;

-- Drop unused indexes first
DROP INDEX IF EXISTS idx_tricks_role;
DROP INDEX IF EXISTS idx_tricks_tool_vendor;
DROP INDEX IF EXISTS idx_tricks_evidence_level;
DROP INDEX IF EXISTS idx_tricks_risk_level;

-- Remove research-related columns that were added in 20250909_add_research_fields.sql
ALTER TABLE public.ki_tricks
  DROP COLUMN IF EXISTS role,
  DROP COLUMN IF EXISTS industries,
  DROP COLUMN IF EXISTS tool_vendor,
  DROP COLUMN IF EXISTS integrations,
  DROP COLUMN IF EXISTS estimated_time_minutes,
  DROP COLUMN IF EXISTS estimated_savings_minutes,
  DROP COLUMN IF EXISTS risk_level,
  DROP COLUMN IF EXISTS evidence_level,
  DROP COLUMN IF EXISTS prerequisites,
  DROP COLUMN IF EXISTS privacy_notes,
  DROP COLUMN IF EXISTS sources,
  DROP COLUMN IF EXISTS prompt_examples,
  DROP COLUMN IF EXISTS kpi_suggestions;

-- Also remove fields not in the minimal spec
ALTER TABLE public.ki_tricks
  DROP COLUMN IF EXISTS quality_category,
  DROP COLUMN IF EXISTS like_count,
  DROP COLUMN IF EXISTS created_by,
  DROP COLUMN IF EXISTS reviewed_by;

-- Ensure all required fields exist with proper types
-- Most already exist, but let's ensure they have the right constraints
ALTER TABLE public.ki_tricks
  ALTER COLUMN title SET NOT NULL,
  ALTER COLUMN description SET NOT NULL,
  ALTER COLUMN category SET NOT NULL,
  ALTER COLUMN slug SET NOT NULL,
  ALTER COLUMN why_it_works SET NOT NULL;

-- Add any missing required fields (most should already exist)
ALTER TABLE public.ki_tricks
  ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;

-- Recreate optimized indexes
DROP INDEX IF EXISTS idx_tricks_slug;
DROP INDEX IF EXISTS idx_tricks_category;
DROP INDEX IF EXISTS idx_tricks_status;
DROP INDEX IF EXISTS idx_tricks_published_at;
DROP INDEX IF EXISTS idx_tricks_created_at;

CREATE UNIQUE INDEX IF NOT EXISTS idx_tricks_slug ON public.ki_tricks(slug);
CREATE INDEX IF NOT EXISTS idx_tricks_category ON public.ki_tricks(category);
CREATE INDEX IF NOT EXISTS idx_tricks_status ON public.ki_tricks(status) WHERE status IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tricks_published_at ON public.ki_tricks(published_at DESC) WHERE published_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tricks_created_at ON public.ki_tricks(created_at DESC);

-- Add GiST index for full-text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX IF NOT EXISTS idx_tricks_search
  ON public.ki_tricks
  USING gin(
    (setweight(to_tsvector('german', coalesce(title, '')), 'A') ||
     setweight(to_tsvector('german', coalesce(description, '')), 'B'))
  );

-- Clean up unused enums (if safe to do so)
DO $$
DECLARE
  company_role_type oid := to_regtype('company_role_enum');
  evidence_level_type oid := to_regtype('evidence_level_enum');
  risk_level_type oid := to_regtype('risk_level_enum');
BEGIN
  IF company_role_type IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM pg_attribute WHERE atttypid = company_role_type
  ) THEN
    EXECUTE 'DROP TYPE IF EXISTS company_role_enum';
  END IF;

  IF evidence_level_type IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM pg_attribute WHERE atttypid = evidence_level_type
  ) THEN
    EXECUTE 'DROP TYPE IF EXISTS evidence_level_enum';
  END IF;

  IF risk_level_type IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM pg_attribute WHERE atttypid = risk_level_type
  ) THEN
    EXECUTE 'DROP TYPE IF EXISTS risk_level_enum';
  END IF;
END $$;

-- Update trigger remains the same
-- View count function remains the same

-- Add comment documenting the final schema
COMMENT ON TABLE public.ki_tricks IS 'Minimal schema with core fields: id, title, description, category, tools[], steps[], examples[], slug, why_it_works, status, quality_score, created_at, updated_at, published_at, view_count';

COMMIT;
