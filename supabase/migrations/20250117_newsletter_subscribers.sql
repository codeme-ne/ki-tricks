-- Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'unsubscribed')),
  resend_contact_id TEXT,
  verification_token TEXT,
  verified_at TIMESTAMPTZ,
  source TEXT,
  lead_magnet TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON public.newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_status ON public.newsletter_subscribers(status);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_created_at ON public.newsletter_subscribers(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow anonymous users to subscribe
CREATE POLICY "Allow anonymous newsletter signup" ON public.newsletter_subscribers
  FOR INSERT
  WITH CHECK (true);

-- Allow service role to manage all subscribers
CREATE POLICY "Service role can manage all subscribers" ON public.newsletter_subscribers
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_newsletter_subscribers_updated_at
  BEFORE UPDATE ON public.newsletter_subscribers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create user_profiles table for dashboard functionality
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  company TEXT,
  phone TEXT,
  avatar_url TEXT,
  bio TEXT,
  website TEXT,
  newsletter_subscribed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for user_profiles
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);

-- Enable RLS for user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Policies for user_profiles
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create trigger for user_profiles updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create ad_campaigns table for monetization
CREATE TABLE IF NOT EXISTS public.ad_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  budget DECIMAL(10, 2),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'active', 'paused', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create trick_card_reservations table
CREATE TABLE IF NOT EXISTS public.trick_card_reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES public.ad_campaigns(id) ON DELETE CASCADE,
  trick_id UUID REFERENCES public.ki_tricks(id) ON DELETE CASCADE,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL CHECK (year >= 2025),
  price DECIMAL(10, 2) DEFAULT 100.00,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'active', 'expired', 'cancelled')),
  stripe_payment_intent_id TEXT,
  stripe_checkout_session_id TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(trick_id, month, year) -- Prevent double booking
);

-- Create indexes for ad tables
CREATE INDEX IF NOT EXISTS idx_ad_campaigns_user_id ON public.ad_campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_ad_campaigns_status ON public.ad_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_trick_card_reservations_user_id ON public.trick_card_reservations(user_id);
CREATE INDEX IF NOT EXISTS idx_trick_card_reservations_month_year ON public.trick_card_reservations(month, year);
CREATE INDEX IF NOT EXISTS idx_trick_card_reservations_status ON public.trick_card_reservations(status);

-- Enable RLS for ad tables
ALTER TABLE public.ad_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trick_card_reservations ENABLE ROW LEVEL SECURITY;

-- Policies for ad_campaigns
CREATE POLICY "Users can view own campaigns" ON public.ad_campaigns
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own campaigns" ON public.ad_campaigns
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own campaigns" ON public.ad_campaigns
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for trick_card_reservations
CREATE POLICY "Users can view own reservations" ON public.trick_card_reservations
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own reservations" ON public.trick_card_reservations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Public can view active reservations (for checking availability)
CREATE POLICY "Public can view active reservations" ON public.trick_card_reservations
  FOR SELECT
  USING (status IN ('confirmed', 'active'));

-- Triggers for ad tables
CREATE TRIGGER update_ad_campaigns_updated_at
  BEFORE UPDATE ON public.ad_campaigns
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_trick_card_reservations_updated_at
  BEFORE UPDATE ON public.trick_card_reservations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();