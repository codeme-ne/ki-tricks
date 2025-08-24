-- Migration: Remove difficulty, impact, and time_to_implement columns
-- Date: 2025-08-24
-- Description: These columns are being removed as part of the DACH-focused refactoring
-- to simplify the data model and focus on business-relevant categories

-- Drop columns from ki_tricks table
ALTER TABLE public.ki_tricks 
DROP COLUMN IF EXISTS difficulty,
DROP COLUMN IF EXISTS impact,
DROP COLUMN IF EXISTS time_to_implement;

-- Drop columns from trick_submissions table if they exist
ALTER TABLE public.trick_submissions 
DROP COLUMN IF EXISTS difficulty,
DROP COLUMN IF EXISTS impact,
DROP COLUMN IF EXISTS time_to_implement;

-- Add comment to document the change
COMMENT ON TABLE public.ki_tricks IS 'KI tricks table - simplified to focus on DACH business categories without difficulty/impact/time metrics';