-- Seed a couple of tricks for local testing
INSERT INTO public.ki_tricks (title, description, category, tools, steps, examples, slug, why_it_works)
VALUES
  (
    'Speed up Tailwind workflow',
    'Use class-variance-authority and tailwind-merge to simplify conditional classes.',
    'programming',
    ARRAY['tailwindcss','cva'],
    ARRAY['Install deps','Refactor components','Enjoy smaller classnames'],
    ARRAY['Header.tsx refactor'],
    'speed-up-tailwind-workflow',
    'Reduces cognitive load by centralizing variants.'
  )
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.ki_tricks (title, description, category, tools, steps, examples, slug, why_it_works)
VALUES
  (
    'Automate content ideas',
    'Generate weekly content prompts with a small script and the Supabase DB.',
    'content-creation',
    ARRAY['node','supabase'],
    ARRAY['Write script','Schedule cron','Review output'],
    ARRAY['weekly-ideas.md'],
    'automate-content-ideas',
    'Batching ideation boosts consistency.'
  )
ON CONFLICT (slug) DO NOTHING;
