-- Migration: Remove department/industry tags and legacy fields
-- Date: 2025-08-25

-- 1) Drop legacy columns if present (idempotent)
ALTER TABLE IF EXISTS public.ki_tricks 
  DROP COLUMN IF EXISTS difficulty,
  DROP COLUMN IF EXISTS impact,
  DROP COLUMN IF EXISTS time_to_implement,
  DROP COLUMN IF EXISTS department_tags,
  DROP COLUMN IF EXISTS industry_tags;

ALTER TABLE IF EXISTS public.trick_submissions 
  DROP COLUMN IF EXISTS difficulty,
  DROP COLUMN IF EXISTS impact,
  DROP COLUMN IF EXISTS time_to_implement;

-- 2) Drop any indexes created for the removed tag columns
DROP INDEX IF EXISTS public.idx_department_tags;
DROP INDEX IF EXISTS public.idx_industry_tags;

-- 3) Ensure essential columns exist with correct types/defaults
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema='public' AND table_name='ki_tricks' AND column_name='tools'
  ) THEN
    ALTER TABLE public.ki_tricks ADD COLUMN tools TEXT[] DEFAULT '{}'::TEXT[] NOT NULL;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema='public' AND table_name='ki_tricks' AND column_name='steps'
  ) THEN
    ALTER TABLE public.ki_tricks ADD COLUMN steps TEXT[];
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema='public' AND table_name='ki_tricks' AND column_name='examples'
  ) THEN
    ALTER TABLE public.ki_tricks ADD COLUMN examples TEXT[];
  END IF;
END $$;

-- 4) Reset category CHECK constraint to slim set (idempotent)
DO $$
DECLARE
  cons_name text;
BEGIN
  SELECT conname INTO cons_name
  FROM pg_constraint
  WHERE conrelid = 'public.ki_tricks'::regclass
    AND contype = 'c'
    AND conname LIKE 'ki_tricks_category_check%';
  IF cons_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE public.ki_tricks DROP CONSTRAINT %I', cons_name);
  END IF;
  ALTER TABLE public.ki_tricks
    ADD CONSTRAINT ki_tricks_category_check 
    CHECK (category IN (
      'productivity', 'content-creation', 'programming', 'design', 'data-analysis', 'learning', 'business', 'marketing'
    ));
END $$;

-- 5) Document the expected JSON keys for trick_submissions.trick_data
COMMENT ON COLUMN public.trick_submissions.trick_data IS 'Expected keys: id,title,description,category,tools[],steps[],examples[],slug,why_it_works,createdAt,updatedAt';
