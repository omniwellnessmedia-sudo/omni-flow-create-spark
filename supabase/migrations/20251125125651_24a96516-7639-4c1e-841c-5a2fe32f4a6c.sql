-- Create viator_tours table for caching Viator tour data
CREATE TABLE IF NOT EXISTS public.viator_tours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  viator_product_code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  duration TEXT,
  price_from NUMERIC,
  currency TEXT DEFAULT 'USD',
  location TEXT,
  category TEXT,
  rating NUMERIC,
  review_count INTEGER DEFAULT 0,
  image_url TEXT,
  booking_url TEXT,
  availability TEXT,
  highlights JSONB,
  inclusions JSONB,
  exclusions JSONB,
  cancellation_policy TEXT,
  last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_viator_tours_product_code ON public.viator_tours(viator_product_code);
CREATE INDEX IF NOT EXISTS idx_viator_tours_active ON public.viator_tours(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_viator_tours_category ON public.viator_tours(category);

-- Enable RLS
ALTER TABLE public.viator_tours ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view active tours
CREATE POLICY "Anyone can view active Viator tours"
  ON public.viator_tours
  FOR SELECT
  USING (is_active = true);

-- Only authenticated users can manage tours (for admin sync)
CREATE POLICY "Authenticated users can manage Viator tours"
  ON public.viator_tours
  FOR ALL
  USING (auth.role() = 'authenticated');

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_viator_tours_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_viator_tours_updated_at_trigger
  BEFORE UPDATE ON public.viator_tours
  FOR EACH ROW
  EXECUTE FUNCTION update_viator_tours_updated_at();