-- Content Generation Pipeline Extensions
-- This migration adds the required tables and fields for AI content generation

-- Create content_generation_jobs table for tracking generation jobs
CREATE TABLE content_generation_jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Job status and metadata
  status TEXT DEFAULT 'pending' CHECK (
    status IN ('pending', 'processing', 'completed', 'failed')
  ),

  -- Configuration for the generation job
  config JSONB NOT NULL,

  -- Results from the generation process
  result JSONB,

  -- Error information if job failed
  error_message TEXT,
  error_details JSONB,

  -- Timing information
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,

  -- Job metadata
  created_by UUID REFERENCES auth.users(id),
  total_tricks_requested INTEGER DEFAULT 1,
  tricks_generated INTEGER DEFAULT 0,

  -- Cost tracking
  api_calls INTEGER DEFAULT 0,
  input_tokens INTEGER DEFAULT 0,
  output_tokens INTEGER DEFAULT 0
);

-- Add new fields to ki_tricks table for generation tracking
ALTER TABLE ki_tricks
ADD COLUMN generated_by TEXT DEFAULT 'human' CHECK (
  generated_by IN ('human', 'ai', 'hybrid')
);

ALTER TABLE ki_tricks
ADD COLUMN generation_job_id UUID REFERENCES content_generation_jobs(id);

ALTER TABLE ki_tricks
ADD COLUMN generation_metadata JSONB DEFAULT '{}'::JSONB;

ALTER TABLE ki_tricks
ADD COLUMN seo_score INTEGER CHECK (seo_score >= 0 AND seo_score <= 100);

ALTER TABLE ki_tricks
ADD COLUMN duplicate_check_hash TEXT;

ALTER TABLE ki_tricks
ADD COLUMN content_template TEXT;

-- Create indexes for performance
CREATE INDEX idx_generation_jobs_status ON content_generation_jobs(status);
CREATE INDEX idx_generation_jobs_created_at ON content_generation_jobs(created_at DESC);
CREATE INDEX idx_tricks_generated_by ON ki_tricks(generated_by);
CREATE INDEX idx_tricks_generation_job ON ki_tricks(generation_job_id);
CREATE INDEX idx_tricks_duplicate_hash ON ki_tricks(duplicate_check_hash);
CREATE INDEX idx_tricks_seo_score ON ki_tricks(seo_score DESC);

-- Enable RLS on new table
ALTER TABLE content_generation_jobs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for content_generation_jobs
-- Authenticated users can manage generation jobs (admin access)
CREATE POLICY "Authenticated users can manage generation jobs"
  ON content_generation_jobs FOR ALL
  USING (auth.role() = 'authenticated');

-- Function to update job status and timing
CREATE OR REPLACE FUNCTION update_generation_job_status(
  job_id UUID,
  new_status TEXT,
  error_msg TEXT DEFAULT NULL,
  result_data JSONB DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  UPDATE content_generation_jobs
  SET
    status = new_status,
    error_message = COALESCE(error_msg, error_message),
    result = COALESCE(result_data, result),
    started_at = CASE
      WHEN new_status = 'processing' AND started_at IS NULL
      THEN NOW()
      ELSE started_at
    END,
    completed_at = CASE
      WHEN new_status IN ('completed', 'failed')
      THEN NOW()
      ELSE completed_at
    END
  WHERE id = job_id;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate duplicate hash for content
CREATE OR REPLACE FUNCTION generate_duplicate_hash(
  title_text TEXT,
  description_text TEXT
)
RETURNS TEXT AS $$
BEGIN
  RETURN encode(
    digest(
      lower(trim(title_text)) || '|' ||
      lower(trim(substring(description_text, 1, 200))),
      'sha256'
    ),
    'hex'
  );
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically set duplicate hash on insert/update
CREATE OR REPLACE FUNCTION set_duplicate_hash()
RETURNS TRIGGER AS $$
BEGIN
  NEW.duplicate_check_hash = generate_duplicate_hash(NEW.title, NEW.description);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_ki_tricks_duplicate_hash
  BEFORE INSERT OR UPDATE OF title, description ON ki_tricks
  FOR EACH ROW
  EXECUTE FUNCTION set_duplicate_hash();

-- Function to check for duplicates
CREATE OR REPLACE FUNCTION check_duplicate_content(
  title_text TEXT,
  description_text TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  hash_value TEXT;
  existing_count INTEGER;
BEGIN
  hash_value := generate_duplicate_hash(title_text, description_text);

  SELECT COUNT(*) INTO existing_count
  FROM ki_tricks
  WHERE duplicate_check_hash = hash_value;

  RETURN existing_count > 0;
END;
$$ LANGUAGE plpgsql;

-- Update existing tricks to have duplicate hashes
UPDATE ki_tricks
SET duplicate_check_hash = generate_duplicate_hash(title, description)
WHERE duplicate_check_hash IS NULL;;
