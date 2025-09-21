-- Migration: Introduce news_items and guides tables for content pipeline MVP
-- Date: 2026-01-17
-- Description: Adds ingestion staging (news_items) and publishing (guides) tables incl. enums, indexes, triggers, and RLS.

BEGIN;

-- Ensure enums exist (may have been dropped by previous cleanup migrations)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'company_role_enum' AND n.nspname = 'public'
  ) THEN
    CREATE TYPE public.company_role_enum AS ENUM (
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
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'evidence_level_enum') THEN
    CREATE TYPE public.evidence_level_enum AS ENUM ('A', 'B', 'C');
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'risk_level_enum') THEN
    CREATE TYPE public.risk_level_enum AS ENUM ('low', 'medium', 'high');
  END IF;
END
$$;

-- news_items: staging table for fetched sources before curation
CREATE TABLE IF NOT EXISTS public.news_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id TEXT NOT NULL,
  source_type TEXT NOT NULL,
  source_category TEXT NOT NULL,
  evidence_level public.evidence_level_enum,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  published_at TIMESTAMPTZ,
  content_hash TEXT NOT NULL,
  summary TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
  raw JSONB NOT NULL,
  processed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.news_items
  ADD CONSTRAINT news_items_url_unique UNIQUE (url);

ALTER TABLE public.news_items
  ADD CONSTRAINT news_items_content_hash_unique UNIQUE (content_hash);

CREATE INDEX IF NOT EXISTS idx_news_items_processed ON public.news_items(processed);
CREATE INDEX IF NOT EXISTS idx_news_items_published_at ON public.news_items(published_at DESC) WHERE published_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_news_items_source_id ON public.news_items(source_id);
CREATE INDEX IF NOT EXISTS idx_news_items_created_at ON public.news_items(created_at DESC);

-- Auto update updated_at
DROP TRIGGER IF EXISTS update_news_items_updated_at ON public.news_items;
CREATE TRIGGER update_news_items_updated_at
  BEFORE UPDATE ON public.news_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS for news_items (admin-only access)
ALTER TABLE public.news_items ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'news_items'
      AND policyname = 'Authenticated users manage news_items'
  ) THEN
    CREATE POLICY "Authenticated users manage news_items"
      ON public.news_items
      FOR ALL
      USING (auth.role() = 'authenticated')
      WITH CHECK (auth.role() = 'authenticated');
  END IF;
END
$$;

-- guides: curated and published instructional content
CREATE TABLE IF NOT EXISTS public.guides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  steps TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
  examples TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
  role public.company_role_enum,
  industries TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
  tools TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
  hero_image_url TEXT,
  sources JSONB NOT NULL DEFAULT '[]'::JSONB,
  risk_level public.risk_level_enum,
  evidence_level public.evidence_level_enum,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'published', 'archived')),
  quality_score INTEGER,
  implement_count INTEGER NOT NULL DEFAULT 0,
  view_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

ALTER TABLE public.guides
  ADD CONSTRAINT guides_slug_unique UNIQUE (slug);

CREATE INDEX IF NOT EXISTS idx_guides_status ON public.guides(status);
CREATE INDEX IF NOT EXISTS idx_guides_published_at ON public.guides(published_at DESC) WHERE published_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_guides_role ON public.guides(role) WHERE role IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_guides_evidence_level ON public.guides(evidence_level) WHERE evidence_level IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_guides_created_at ON public.guides(created_at DESC);

-- Auto update updated_at
DROP TRIGGER IF EXISTS update_guides_updated_at ON public.guides;
CREATE TRIGGER update_guides_updated_at
  BEFORE UPDATE ON public.guides
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- RLS policies for guides: public read access to published guides, admins manage all
ALTER TABLE public.guides ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'guides'
      AND policyname = 'Public can view published guides'
  ) THEN
    CREATE POLICY "Public can view published guides"
      ON public.guides
      FOR SELECT
      USING (status = 'published');
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'guides'
      AND policyname = 'Authenticated users manage guides'
  ) THEN
    CREATE POLICY "Authenticated users manage guides"
      ON public.guides
      FOR ALL
      USING (auth.role() = 'authenticated')
      WITH CHECK (auth.role() = 'authenticated');
  END IF;
END
$$;

COMMENT ON TABLE public.news_items IS 'Fetched source items awaiting normalization/curation.';
COMMENT ON COLUMN public.news_items.content_hash IS 'Deterministic hash used for deduplication across fetch runs.';
COMMENT ON TABLE public.guides IS 'Curated guides generated from news_items with structured steps/examples.';

COMMIT;
