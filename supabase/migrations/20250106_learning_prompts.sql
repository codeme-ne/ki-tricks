-- Migration: Add Learning Prompts Feature
-- Description: Tables for user-submitted study/learning prompts with favorites functionality
-- Date: 2025-01-06

-- ===========================
-- LEARNING PROMPTS TABLES
-- ===========================

-- Main learning prompts table
CREATE TABLE learning_prompts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  prompt_text TEXT NOT NULL, -- The actual prompt content
  description TEXT, -- Optional description of when/how to use it
  category TEXT NOT NULL CHECK (
    category IN (
      'note-taking', 'memory-techniques', 'comprehension',
      'essay-writing', 'exam-prep', 'research',
      'language-learning', 'math-problem-solving', 'coding-practice',
      'general-learning'
    )
  ),

  -- Metadata
  difficulty_level TEXT CHECK (
    difficulty_level IN ('beginner', 'intermediate', 'advanced')
  ),
  subject_areas TEXT[] DEFAULT '{}'::TEXT[], -- e.g., ['mathematics', 'history', 'programming']
  ai_tools TEXT[] DEFAULT '{}'::TEXT[], -- Compatible AI tools: ['ChatGPT', 'Claude', 'Gemini']
  use_cases TEXT[], -- Specific use cases or scenarios
  example_output TEXT, -- Example of what the prompt produces
  tips TEXT[], -- Usage tips for best results

  slug TEXT UNIQUE NOT NULL,

  -- Status management
  status TEXT DEFAULT 'published' CHECK (
    status IN ('draft', 'pending', 'published', 'rejected')
  ),
  quality_score INTEGER,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE,

  -- Engagement metrics
  view_count INTEGER DEFAULT 0,
  favorite_count INTEGER DEFAULT 0,
  use_count INTEGER DEFAULT 0, -- How many times users clicked "use this prompt"

  -- Author tracking
  created_by UUID REFERENCES auth.users(id),
  submitter_name TEXT, -- For anonymous submissions
  submitter_email TEXT, -- For anonymous submissions
  reviewed_by UUID REFERENCES auth.users(id)
);

-- Prompt submissions (pending review)
CREATE TABLE prompt_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  prompt_data JSONB NOT NULL,
  submitter_email TEXT,
  submitter_name TEXT,
  submitter_user_id UUID REFERENCES auth.users(id), -- If authenticated

  status TEXT DEFAULT 'pending' CHECK (
    status IN ('pending', 'approved', 'rejected')
  ),
  review_notes TEXT,
  quality_score INTEGER,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id)
);

-- User favorites (users can save prompts to their account)
CREATE TABLE user_prompt_favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  prompt_id UUID REFERENCES learning_prompts(id) ON DELETE CASCADE NOT NULL,

  -- Optional notes for personal reference
  personal_notes TEXT,
  tags TEXT[], -- User's own tags for organization

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Ensure one favorite per user per prompt
  UNIQUE(user_id, prompt_id)
);

-- User collections (users can organize prompts into collections)
CREATE TABLE user_prompt_collections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  slug TEXT NOT NULL,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Ensure unique slug per user
  UNIQUE(user_id, slug)
);

-- Junction table for collection items
CREATE TABLE collection_prompts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  collection_id UUID REFERENCES user_prompt_collections(id) ON DELETE CASCADE NOT NULL,
  prompt_id UUID REFERENCES learning_prompts(id) ON DELETE CASCADE NOT NULL,
  order_index INTEGER DEFAULT 0,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(collection_id, prompt_id)
);

-- Analytics for prompts
CREATE TABLE prompt_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  prompt_id UUID REFERENCES learning_prompts(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (
    event_type IN ('view', 'favorite', 'unfavorite', 'copy', 'use', 'share')
  ),
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT,
  metadata JSONB,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User profiles (extended user information)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,

  -- Learning preferences
  preferred_ai_tools TEXT[],
  learning_goals TEXT[],

  -- Privacy settings
  profile_visibility TEXT DEFAULT 'public' CHECK (
    profile_visibility IN ('public', 'private')
  ),
  show_favorites BOOLEAN DEFAULT true,
  show_collections BOOLEAN DEFAULT true,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================
-- INDEXES FOR PERFORMANCE
-- ===========================

CREATE INDEX idx_prompts_slug ON learning_prompts(slug);
CREATE INDEX idx_prompts_category ON learning_prompts(category);
CREATE INDEX idx_prompts_status ON learning_prompts(status);
CREATE INDEX idx_prompts_published_at ON learning_prompts(published_at DESC);
CREATE INDEX idx_prompts_created_by ON learning_prompts(created_by);
CREATE INDEX idx_prompts_favorite_count ON learning_prompts(favorite_count DESC);

CREATE INDEX idx_prompt_submissions_status ON prompt_submissions(status);
CREATE INDEX idx_prompt_submissions_user ON prompt_submissions(submitter_user_id);

CREATE INDEX idx_favorites_user ON user_prompt_favorites(user_id);
CREATE INDEX idx_favorites_prompt ON user_prompt_favorites(prompt_id);
CREATE INDEX idx_favorites_created ON user_prompt_favorites(created_at DESC);

CREATE INDEX idx_collections_user ON user_prompt_collections(user_id);
CREATE INDEX idx_collections_slug ON user_prompt_collections(slug);
CREATE INDEX idx_collections_public ON user_prompt_collections(is_public);

CREATE INDEX idx_collection_prompts_collection ON collection_prompts(collection_id);
CREATE INDEX idx_collection_prompts_prompt ON collection_prompts(prompt_id);

CREATE INDEX idx_prompt_analytics_prompt ON prompt_analytics(prompt_id);
CREATE INDEX idx_prompt_analytics_event ON prompt_analytics(event_type);
CREATE INDEX idx_prompt_analytics_user ON prompt_analytics(user_id);

CREATE INDEX idx_profiles_username ON user_profiles(username);

-- ===========================
-- ROW LEVEL SECURITY
-- ===========================

ALTER TABLE learning_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_prompt_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_prompt_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- ===========================
-- RLS POLICIES - PROMPTS
-- ===========================

-- Public can view published prompts
CREATE POLICY "Public can view published prompts"
  ON learning_prompts FOR SELECT
  USING (status = 'published');

-- Authenticated users can manage all prompts (admin)
CREATE POLICY "Authenticated users can manage prompts"
  ON learning_prompts FOR ALL
  USING (auth.role() = 'authenticated');

-- Users can view their own draft prompts
CREATE POLICY "Users can view own drafts"
  ON learning_prompts FOR SELECT
  USING (created_by = auth.uid() AND status = 'draft');

-- ===========================
-- RLS POLICIES - SUBMISSIONS
-- ===========================

-- Anyone can submit prompts
CREATE POLICY "Anyone can submit prompts"
  ON prompt_submissions FOR INSERT
  WITH CHECK (true);

-- Users can view their own submissions
CREATE POLICY "Users can view own submissions"
  ON prompt_submissions FOR SELECT
  USING (submitter_user_id = auth.uid());

-- Authenticated admins can manage all submissions
CREATE POLICY "Authenticated users can manage submissions"
  ON prompt_submissions FOR ALL
  USING (auth.role() = 'authenticated');

-- ===========================
-- RLS POLICIES - FAVORITES
-- ===========================

-- Users can view their own favorites
CREATE POLICY "Users can view own favorites"
  ON user_prompt_favorites FOR SELECT
  USING (user_id = auth.uid());

-- Users can manage their own favorites
CREATE POLICY "Users can manage own favorites"
  ON user_prompt_favorites FOR ALL
  USING (user_id = auth.uid());

-- ===========================
-- RLS POLICIES - COLLECTIONS
-- ===========================

-- Users can view public collections or their own
CREATE POLICY "Users can view public or own collections"
  ON user_prompt_collections FOR SELECT
  USING (is_public = true OR user_id = auth.uid());

-- Users can manage their own collections
CREATE POLICY "Users can manage own collections"
  ON user_prompt_collections FOR ALL
  USING (user_id = auth.uid());

-- ===========================
-- RLS POLICIES - COLLECTION PROMPTS
-- ===========================

-- Users can view items in public collections or their own
CREATE POLICY "Users can view collection items"
  ON collection_prompts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_prompt_collections
      WHERE id = collection_prompts.collection_id
      AND (is_public = true OR user_id = auth.uid())
    )
  );

-- Users can manage items in their own collections
CREATE POLICY "Users can manage own collection items"
  ON collection_prompts FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_prompt_collections
      WHERE id = collection_prompts.collection_id
      AND user_id = auth.uid()
    )
  );

-- ===========================
-- RLS POLICIES - ANALYTICS
-- ===========================

-- Anyone can track analytics
CREATE POLICY "Public can track analytics"
  ON prompt_analytics FOR INSERT
  WITH CHECK (true);

-- Public can view analytics
CREATE POLICY "Public can view analytics"
  ON prompt_analytics FOR SELECT
  USING (true);

-- ===========================
-- RLS POLICIES - USER PROFILES
-- ===========================

-- Public can view public profiles
CREATE POLICY "Public can view public profiles"
  ON user_profiles FOR SELECT
  USING (profile_visibility = 'public');

-- Users can view their own profile regardless of visibility
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (id = auth.uid());

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (id = auth.uid());

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (id = auth.uid());

-- ===========================
-- FUNCTIONS
-- ===========================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_learning_prompts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for learning_prompts
CREATE TRIGGER update_learning_prompts_updated_at
  BEFORE UPDATE ON learning_prompts
  FOR EACH ROW
  EXECUTE FUNCTION update_learning_prompts_updated_at();

-- Trigger for user_prompt_favorites
CREATE TRIGGER update_favorites_updated_at
  BEFORE UPDATE ON user_prompt_favorites
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for user_prompt_collections
CREATE TRIGGER update_collections_updated_at
  BEFORE UPDATE ON user_prompt_collections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for user_profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to increment favorite count when user favorites a prompt
CREATE OR REPLACE FUNCTION increment_favorite_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE learning_prompts
    SET favorite_count = favorite_count + 1
    WHERE id = NEW.prompt_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE learning_prompts
    SET favorite_count = GREATEST(0, favorite_count - 1)
    WHERE id = OLD.prompt_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update favorite_count
CREATE TRIGGER update_prompt_favorite_count
  AFTER INSERT OR DELETE ON user_prompt_favorites
  FOR EACH ROW
  EXECUTE FUNCTION increment_favorite_count();

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_prompt_view_count(prompt_slug TEXT)
RETURNS void AS $$
BEGIN
  UPDATE learning_prompts
  SET view_count = view_count + 1
  WHERE slug = prompt_slug;
END;
$$ LANGUAGE plpgsql;

-- Function to increment use count
CREATE OR REPLACE FUNCTION increment_prompt_use_count(prompt_slug TEXT)
RETURNS void AS $$
BEGIN
  UPDATE learning_prompts
  SET use_count = use_count + 1
  WHERE slug = prompt_slug;
END;
$$ LANGUAGE plpgsql;

-- ===========================
-- SEED DATA (Optional)
-- ===========================

-- Insert sample learning prompts
INSERT INTO learning_prompts (
  title,
  prompt_text,
  description,
  category,
  difficulty_level,
  subject_areas,
  ai_tools,
  slug,
  status,
  published_at
) VALUES
(
  'Feynman-Technik für komplexe Themen',
  'Ich möchte [THEMA] besser verstehen. Erkläre es mir, als wäre ich ein Schüler der 5. Klasse. Verwende einfache Beispiele und Analogien. Wenn du fertig bist, stelle mir Verständnisfragen, um meine Wissenslücken zu identifizieren.',
  'Nutzt die Feynman-Methode zum Vereinfachen komplexer Konzepte und Identifizieren von Wissenslücken',
  'comprehension',
  'beginner',
  ARRAY['Wissenschaft', 'Mathematik', 'Philosophie'],
  ARRAY['ChatGPT', 'Claude', 'Gemini'],
  'feynman-technik-komplexe-themen',
  'published',
  NOW()
),
(
  'Aktive Recall-Fragengeneration',
  'Erstelle 10 anspruchsvolle Fragen zu folgendem Lernmaterial: [TEXT ODER THEMA EINFÜGEN]. Die Fragen sollten verschiedene Schwierigkeitsstufen haben und kritisches Denken fördern. Gib nach jeder Frage Platz für meine Antwort, bevor du die richtige Lösung zeigst.',
  'Generiert Testfragen für aktives Abrufen von Wissen aus Lernmaterial',
  'exam-prep',
  'intermediate',
  ARRAY['Alle Fächer'],
  ARRAY['ChatGPT', 'Claude'],
  'aktive-recall-fragengeneration',
  'published',
  NOW()
),
(
  'Spaced Repetition Lernplan',
  'Erstelle einen Wiederholungsplan für [THEMA/PRÜFUNG] mit der Spaced-Repetition-Methode. Ich habe [ANZAHL] Tage bis zur Prüfung. Teile den Stoff in tägliche Lerneinheiten auf und plane Wiederholungen nach 1, 3, 7 und 14 Tagen ein.',
  'Erstellt einen wissenschaftlich fundierten Wiederholungsplan nach der Spaced-Repetition-Methode',
  'exam-prep',
  'advanced',
  ARRAY['Prüfungsvorbereitung'],
  ARRAY['ChatGPT', 'Claude', 'Gemini'],
  'spaced-repetition-lernplan',
  'published',
  NOW()
),
(
  'Cornell-Notizen Optimierung',
  'Hier sind meine Notizen zu [THEMA]: [NOTIZEN EINFÜGEN]. Strukturiere sie nach der Cornell-Methode: Erstelle Hauptfragen/Stichworte in der linken Spalte, Details in der rechten Spalte und eine Zusammenfassung am Ende.',
  'Optimiert unstrukturierte Notizen mit der bewährten Cornell-Note-Taking-Methode',
  'note-taking',
  'beginner',
  ARRAY['Alle Fächer'],
  ARRAY['ChatGPT', 'Claude'],
  'cornell-notizen-optimierung',
  'published',
  NOW()
),
(
  'Code-Debugging mit Erklärungen',
  'Hier ist mein Code mit einem Fehler: [CODE EINFÜGEN]. Hilf mir, den Fehler zu finden und zu beheben. Erkläre dabei Schritt für Schritt: 1) Was der Code machen soll, 2) Was das Problem ist, 3) Warum es auftritt, 4) Wie man es behebt, 5) Wie man solche Fehler in Zukunft vermeidet.',
  'Strukturierter Debugging-Prozess mit pädagogischem Fokus auf Lernen und Verstehen',
  'coding-practice',
  'intermediate',
  ARRAY['Programmierung', 'Python', 'JavaScript'],
  ARRAY['ChatGPT', 'Claude', 'GitHub Copilot'],
  'code-debugging-mit-erklaerungen',
  'published',
  NOW()
);

-- ===========================
-- COMMENTS FOR DOCUMENTATION
-- ===========================

COMMENT ON TABLE learning_prompts IS 'Main table for published learning/study prompts';
COMMENT ON TABLE prompt_submissions IS 'User-submitted prompts pending review';
COMMENT ON TABLE user_prompt_favorites IS 'Users favorites/saved prompts';
COMMENT ON TABLE user_prompt_collections IS 'User-created collections of prompts';
COMMENT ON TABLE collection_prompts IS 'Junction table linking prompts to collections';
COMMENT ON TABLE prompt_analytics IS 'Event tracking for prompt engagement';
COMMENT ON TABLE user_profiles IS 'Extended user profile information';

COMMENT ON COLUMN learning_prompts.prompt_text IS 'The actual AI prompt to use';
COMMENT ON COLUMN learning_prompts.use_count IS 'Tracks how many times users clicked "use this prompt"';
COMMENT ON COLUMN user_prompt_favorites.personal_notes IS 'User personal notes about how they use this prompt';
COMMENT ON COLUMN user_prompt_collections.is_public IS 'Whether other users can view this collection';
