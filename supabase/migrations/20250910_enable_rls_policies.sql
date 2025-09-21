-- Enable RLS and ensure minimal policies for public site usage

-- Enable RLS on ki_tricks (safe if already enabled)
ALTER TABLE public.ki_tricks ENABLE ROW LEVEL SECURITY;
-- Policy: public can view published tricks
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'ki_tricks' AND policyname = 'Public can view published tricks'
  ) THEN
    CREATE POLICY "Public can view published tricks"
      ON public.ki_tricks FOR SELECT
      USING (status = 'published');
  END IF;
END $$;
-- Policy: authenticated users can manage tricks (admin usage)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'ki_tricks' AND policyname = 'Authenticated users can manage tricks'
  ) THEN
    CREATE POLICY "Authenticated users can manage tricks"
      ON public.ki_tricks FOR ALL
      USING (auth.role() = 'authenticated');
  END IF;
END $$;
