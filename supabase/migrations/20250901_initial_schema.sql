-- Initial schema for local development: base tables and helpers
-- Ensures later migrations (like add_research_fields) can ALTER these tables.

-- Extensions used by this schema
CREATE EXTENSION IF NOT EXISTS "pgcrypto";      -- provides gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";     -- optional; many environments already have it

-- Create ki_tricks table
CREATE TABLE IF NOT EXISTS public.ki_tricks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (
    category IN (
      'productivity', 'content-creation', 'programming', 
      'design', 'data-analysis', 'learning', 
      'business', 'marketing'
    )
  ),
  tools TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
  steps TEXT[],
  examples TEXT[],
  slug TEXT UNIQUE NOT NULL,
  why_it_works TEXT NOT NULL,

  -- Status management
  status TEXT DEFAULT 'published' CHECK (
    status IN ('draft', 'pending', 'published', 'rejected')
  ),
  quality_score INTEGER,
  quality_category TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,

  -- Metadata
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  reviewed_by UUID REFERENCES auth.users(id)
);

-- Create trick_submissions table
CREATE TABLE IF NOT EXISTS public.trick_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trick_data JSONB NOT NULL,
  submitter_email TEXT,
  submitter_name TEXT,
  status TEXT DEFAULT 'pending' CHECK (
    status IN ('pending', 'approved', 'rejected')
  ),
  review_notes TEXT,
  quality_score INTEGER,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id)
);

-- Create trick_analytics table
CREATE TABLE IF NOT EXISTS public.trick_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trick_id UUID REFERENCES public.ki_tricks(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (
    event_type IN ('view', 'share', 'implement')
  ),
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT,
  metadata JSONB,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_tricks_slug ON public.ki_tricks(slug);
CREATE INDEX IF NOT EXISTS idx_tricks_category ON public.ki_tricks(category);
CREATE INDEX IF NOT EXISTS idx_tricks_status ON public.ki_tricks(status);
CREATE INDEX IF NOT EXISTS idx_tricks_published_at ON public.ki_tricks(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_trick ON public.trick_analytics(trick_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event ON public.trick_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON public.trick_submissions(status);

-- Helper to maintain updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_ki_tricks_updated_at ON public.ki_tricks;
CREATE TRIGGER update_ki_tricks_updated_at 
  BEFORE UPDATE ON public.ki_tricks 
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();

-- Helper to increment view count by slug
CREATE OR REPLACE FUNCTION public.increment_view_count(trick_slug TEXT)
RETURNS void AS $$
BEGIN
  UPDATE public.ki_tricks 
  SET view_count = view_count + 1 
  WHERE slug = trick_slug;
END;
$$ LANGUAGE plpgsql;
