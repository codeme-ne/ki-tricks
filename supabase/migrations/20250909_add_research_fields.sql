-- Ensure enums exist
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'company_role_enum') THEN
    CREATE TYPE company_role_enum AS ENUM (
      'general','sales','marketing','hr','finance','it','procurement',
      'operations','customer-service','legal','product','consulting'
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'evidence_level_enum') THEN
    CREATE TYPE evidence_level_enum AS ENUM ('A','B','C');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'risk_level_enum') THEN
    CREATE TYPE risk_level_enum AS ENUM ('low','medium','high');
  END IF;
END $$;

-- Add columns (no-ops if present)
ALTER TABLE public.ki_tricks
  ADD COLUMN IF NOT EXISTS role public.company_role_enum,
  ADD COLUMN IF NOT EXISTS industries TEXT[] DEFAULT '{}'::TEXT[],
  ADD COLUMN IF NOT EXISTS tool_vendor TEXT,
  ADD COLUMN IF NOT EXISTS integrations TEXT[] DEFAULT '{}'::TEXT[],
  ADD COLUMN IF NOT EXISTS estimated_time_minutes INTEGER,
  ADD COLUMN IF NOT EXISTS estimated_savings_minutes INTEGER,
  ADD COLUMN IF NOT EXISTS risk_level public.risk_level_enum,
  ADD COLUMN IF NOT EXISTS evidence_level public.evidence_level_enum,
  ADD COLUMN IF NOT EXISTS prerequisites TEXT,
  ADD COLUMN IF NOT EXISTS privacy_notes TEXT,
  ADD COLUMN IF NOT EXISTS sources JSONB,
  ADD COLUMN IF NOT EXISTS prompt_examples TEXT[],
  ADD COLUMN IF NOT EXISTS kpi_suggestions TEXT[];

-- Useful indexes
CREATE INDEX IF NOT EXISTS idx_tricks_role ON public.ki_tricks(role);
CREATE INDEX IF NOT EXISTS idx_tricks_tool_vendor ON public.ki_tricks(tool_vendor);
CREATE INDEX IF NOT EXISTS idx_tricks_evidence_level ON public.ki_tricks(evidence_level);
CREATE INDEX IF NOT EXISTS idx_tricks_risk_level ON public.ki_tricks(risk_level);

