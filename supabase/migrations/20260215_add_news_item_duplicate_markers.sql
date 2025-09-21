-- Migration: Add duplicate marking fields to news_items
-- Date: 2026-02-15
-- Description: Adds duplicate tracking columns and indexes for normalization pipeline.

BEGIN;

ALTER TABLE public.news_items
  ADD COLUMN IF NOT EXISTS is_duplicate BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE public.news_items
  ADD COLUMN IF NOT EXISTS duplicate_of UUID REFERENCES public.news_items(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_news_items_is_duplicate ON public.news_items(is_duplicate);
CREATE INDEX IF NOT EXISTS idx_news_items_duplicate_of ON public.news_items(duplicate_of);

COMMENT ON COLUMN public.news_items.is_duplicate IS 'Flag indicating whether this row is considered a duplicate of another item.';
COMMENT ON COLUMN public.news_items.duplicate_of IS 'Reference to the canonical news_items.id this entry duplicates.';

COMMIT;
