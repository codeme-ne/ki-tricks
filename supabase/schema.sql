-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist
DROP TABLE IF EXISTS trick_analytics CASCADE;
DROP TABLE IF EXISTS trick_submissions CASCADE;
DROP TABLE IF EXISTS ki_tricks CASCADE;

-- Create ki_tricks table
CREATE TABLE ki_tricks (
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
  difficulty TEXT NOT NULL CHECK (
    difficulty IN ('beginner', 'intermediate', 'advanced')
  ),
  tools TEXT[] NOT NULL,
  time_to_implement TEXT NOT NULL,
  impact TEXT NOT NULL CHECK (
    impact IN ('low', 'medium', 'high')
  ),
  -- New tags for DACH-focused business usage
  department_tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  industry_tags TEXT[] DEFAULT ARRAY[]::TEXT[],
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  reviewed_by UUID REFERENCES auth.users(id)
);

-- Create trick_submissions table
CREATE TABLE trick_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trick_data JSONB NOT NULL,
  submitter_email TEXT,
  submitter_name TEXT,
  status TEXT DEFAULT 'pending' CHECK (
    status IN ('pending', 'approved', 'rejected')
  ),
  review_notes TEXT,
  quality_score INTEGER,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id)
);

-- Create trick_analytics table
CREATE TABLE trick_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trick_id UUID REFERENCES ki_tricks(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (
    event_type IN ('view', 'like', 'share', 'implement')
  ),
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT,
  metadata JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_tricks_slug ON ki_tricks(slug);
CREATE INDEX idx_tricks_category ON ki_tricks(category);
CREATE INDEX idx_tricks_status ON ki_tricks(status);
CREATE INDEX idx_tricks_published_at ON ki_tricks(published_at DESC);
-- Indexes for array tag filtering
CREATE INDEX IF NOT EXISTS idx_tricks_department_tags ON ki_tricks USING GIN (department_tags);
CREATE INDEX IF NOT EXISTS idx_tricks_industry_tags ON ki_tricks USING GIN (industry_tags);
CREATE INDEX idx_analytics_trick ON trick_analytics(trick_id);
CREATE INDEX idx_analytics_event ON trick_analytics(event_type);
CREATE INDEX idx_submissions_status ON trick_submissions(status);

-- Enable Row Level Security
ALTER TABLE ki_tricks ENABLE ROW LEVEL SECURITY;
ALTER TABLE trick_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE trick_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Public can view published tricks
CREATE POLICY "Public can view published tricks" 
  ON ki_tricks FOR SELECT 
  USING (status = 'published');

-- Authenticated users can do everything (for admin)
CREATE POLICY "Authenticated users can manage tricks" 
  ON ki_tricks FOR ALL 
  USING (auth.role() = 'authenticated');

-- Anyone can submit tricks
CREATE POLICY "Anyone can submit tricks" 
  ON trick_submissions FOR INSERT 
  WITH CHECK (true);

-- Authenticated users can view and manage submissions
CREATE POLICY "Authenticated users can manage submissions" 
  ON trick_submissions FOR ALL 
  USING (auth.role() = 'authenticated');

-- Anyone can track analytics
CREATE POLICY "Public can track analytics" 
  ON trick_analytics FOR INSERT 
  WITH CHECK (true);

-- Public can view analytics
CREATE POLICY "Public can view analytics" 
  ON trick_analytics FOR SELECT 
  USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_ki_tricks_updated_at 
  BEFORE UPDATE ON ki_tricks 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_view_count(trick_slug TEXT)
RETURNS void AS $$
BEGIN
  UPDATE ki_tricks 
  SET view_count = view_count + 1 
  WHERE slug = trick_slug;
END;
$$ LANGUAGE plpgsql;

-- Function to increment like count
CREATE OR REPLACE FUNCTION increment_like_count(trick_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE ki_tricks 
  SET like_count = like_count + 1 
  WHERE id = trick_id;
END;
$$ LANGUAGE plpgsql;