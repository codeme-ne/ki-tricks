-- Migration: Add enhanced content fields for thegrowthlist.co-style content
-- Date: 2025-09-15
-- Description: Add fields to support richer, more detailed trick content

BEGIN;

-- Add new content fields to support enhanced article structure
ALTER TABLE public.ki_tricks
  -- Full article content (rich text/markdown)
  ADD COLUMN IF NOT EXISTS full_content TEXT,

  -- Implementation section (detailed steps)
  ADD COLUMN IF NOT EXISTS implementation_guide TEXT,

  -- Real-world examples section
  ADD COLUMN IF NOT EXISTS practical_examples TEXT,

  -- Difficulty level (1-5, like complexity)
  ADD COLUMN IF NOT EXISTS difficulty_level INTEGER CHECK (difficulty_level >= 1 AND difficulty_level <= 5),

  -- Estimated time to implement (in minutes)
  ADD COLUMN IF NOT EXISTS time_estimate INTEGER,

  -- Success metrics/outcomes
  ADD COLUMN IF NOT EXISTS success_metrics TEXT,

  -- Author attribution
  ADD COLUMN IF NOT EXISTS author_name TEXT,

  -- Content version for tracking updates
  ADD COLUMN IF NOT EXISTS content_version INTEGER DEFAULT 1,

  -- Content approval workflow
  ADD COLUMN IF NOT EXISTS content_status TEXT DEFAULT 'draft'
    CHECK (content_status IN ('draft', 'review', 'published', 'archived'));

-- Create indexes for new fields
CREATE INDEX IF NOT EXISTS idx_tricks_difficulty ON public.ki_tricks(difficulty_level) WHERE difficulty_level IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tricks_time_estimate ON public.ki_tricks(time_estimate) WHERE time_estimate IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tricks_content_status ON public.ki_tricks(content_status);

-- Add full-text search for enhanced content fields
DROP INDEX IF EXISTS idx_tricks_search;
CREATE INDEX idx_tricks_enhanced_search
  ON public.ki_tricks
  USING gin(
    (setweight(to_tsvector('german', coalesce(title, '')), 'A') ||
     setweight(to_tsvector('german', coalesce(description, '')), 'B') ||
     setweight(to_tsvector('german', coalesce(full_content, '')), 'C') ||
     setweight(to_tsvector('german', coalesce(implementation_guide, '')), 'C') ||
     setweight(to_tsvector('german', coalesce(practical_examples, '')), 'C'))
  );

-- Update the comment to reflect new schema
COMMENT ON TABLE public.ki_tricks IS 'Enhanced schema supporting thegrowthlist.co-style detailed content with full_content, implementation_guide, practical_examples, difficulty_level, time_estimate, and enhanced search';

-- Add column comments for documentation
COMMENT ON COLUMN public.ki_tricks.full_content IS 'Rich markdown content for detailed article view (1500-2500 words)';
COMMENT ON COLUMN public.ki_tricks.implementation_guide IS 'Step-by-step implementation instructions section';
COMMENT ON COLUMN public.ki_tricks.practical_examples IS 'Real-world examples and use cases section';
COMMENT ON COLUMN public.ki_tricks.difficulty_level IS 'Implementation difficulty from 1 (beginner) to 5 (expert)';
COMMENT ON COLUMN public.ki_tricks.time_estimate IS 'Estimated implementation time in minutes';
COMMENT ON COLUMN public.ki_tricks.success_metrics IS 'Expected outcomes and success criteria';
COMMENT ON COLUMN public.ki_tricks.content_status IS 'Content review workflow status (draft/review/published/archived)';

COMMIT;