-- Migration: Add difficulty, prompt_template, and structured steps to ki_tricks
-- Date: 2025-09-30
-- Purpose: Transform schema to support non-technical audience with better UX
--
-- MUST-HAVE Changes from Gemini 2.5 Pro Analysis:
-- 1. Difficulty level for better filtering/onboarding
-- 2. Prompt template field (highest value-add for users)
-- 3. Structured steps (JSONB) for richer content (images, code snippets, etc.)

-- ============================================================
-- 1. ADD DIFFICULTY LEVEL
-- ============================================================
-- Create ENUM type for difficulty levels
CREATE TYPE trick_difficulty AS ENUM ('beginner', 'intermediate', 'advanced');

-- Add difficulty column with default 'beginner' for existing tricks
ALTER TABLE ki_tricks
ADD COLUMN difficulty trick_difficulty DEFAULT 'beginner';

COMMENT ON COLUMN ki_tricks.difficulty IS 'Difficulty level for filtering and progressive disclosure. Most tricks should be beginner-friendly for non-technical audience.';

-- ============================================================
-- 2. ADD PROMPT TEMPLATE FIELD
-- ============================================================
-- This is the highest-value addition according to analysis
-- Users want ready-to-use prompts, not just concepts
ALTER TABLE ki_tricks
ADD COLUMN prompt_template TEXT;

COMMENT ON COLUMN ki_tricks.prompt_template IS 'Ready-to-use prompt template with [PLACEHOLDERS] for users to fill in. Main value proposition of each trick.';

-- ============================================================
-- 3. MIGRATE STEPS TO STRUCTURED FORMAT (JSONB)
-- ============================================================
-- Rename existing steps column to deprecated (preserve data for migration)
ALTER TABLE ki_tricks
RENAME COLUMN steps TO _steps_deprecated;

-- Add new structured steps column
ALTER TABLE ki_tricks
ADD COLUMN steps_structured JSONB;

COMMENT ON COLUMN ki_tricks.steps_structured IS 'Structured steps in JSONB format. Each step can contain: {step: string, description?: string, image_url?: string, code_snippet?: string, warning?: string}. Allows richer, more flexible content than TEXT[] array.';

-- ============================================================
-- 4. MIGRATION HELPER: Convert old steps to new format
-- ============================================================
-- For existing tricks, convert TEXT[] to basic JSONB structure
-- This preserves data but can be enhanced later with images/snippets
UPDATE ki_tricks
SET steps_structured = (
  SELECT jsonb_agg(
    jsonb_build_object(
      'step', elem,
      'description', NULL,
      'image_url', NULL,
      'code_snippet', NULL,
      'warning', NULL
    )
  )
  FROM unnest(_steps_deprecated) AS elem
)
WHERE _steps_deprecated IS NOT NULL AND array_length(_steps_deprecated, 1) > 0;

-- ============================================================
-- 5. UPDATE INDEXES FOR NEW COLUMNS
-- ============================================================
-- Add index on difficulty for filtering
CREATE INDEX idx_ki_tricks_difficulty ON ki_tricks(difficulty);

-- Add GIN index on steps_structured for JSONB queries
CREATE INDEX idx_ki_tricks_steps_structured ON ki_tricks USING GIN (steps_structured);

-- ============================================================
-- ROLLBACK INSTRUCTIONS (if needed)
-- ============================================================
-- To rollback this migration:
-- 1. DROP INDEX idx_ki_tricks_steps_structured;
-- 2. DROP INDEX idx_ki_tricks_difficulty;
-- 3. ALTER TABLE ki_tricks RENAME COLUMN _steps_deprecated TO steps;
-- 4. ALTER TABLE ki_tricks DROP COLUMN steps_structured;
-- 5. ALTER TABLE ki_tricks DROP COLUMN prompt_template;
-- 6. ALTER TABLE ki_tricks DROP COLUMN difficulty;
-- 7. DROP TYPE trick_difficulty;