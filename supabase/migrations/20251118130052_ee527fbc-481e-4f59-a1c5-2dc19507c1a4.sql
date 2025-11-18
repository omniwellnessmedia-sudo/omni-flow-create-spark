-- Create conscious_media_interactions table
CREATE TABLE IF NOT EXISTS public.conscious_media_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('view_product', 'click_link', 'conversion')),
  product_name TEXT NOT NULL,
  channel TEXT NOT NULL,
  consciousness_intent TEXT,
  wellness_category TEXT,
  retreat_id UUID,
  practitioner_id UUID,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT
);

-- Create conscious_partner_values table
CREATE TABLE IF NOT EXISTS public.conscious_partner_values (
  partner_id TEXT PRIMARY KEY,
  partner_name TEXT NOT NULL,
  partner_website TEXT NOT NULL,
  south_african_commitment TEXT,
  conscious_values TEXT[],
  values_alignment_score INTEGER CHECK (values_alignment_score >= 0 AND values_alignment_score <= 100),
  logo_url TEXT,
  partner_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.conscious_media_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conscious_partner_values ENABLE ROW LEVEL SECURITY;

-- RLS Policies for conscious_media_interactions
CREATE POLICY "Anyone can insert interactions"
ON public.conscious_media_interactions
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Users can view their own interactions"
ON public.conscious_media_interactions
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all interactions"
ON public.conscious_media_interactions
FOR SELECT
TO authenticated
USING (is_admin(auth.uid()));

-- RLS Policies for conscious_partner_values
CREATE POLICY "Anyone can view partner values"
ON public.conscious_partner_values
FOR SELECT
TO public
USING (true);

CREATE POLICY "Admins can manage partner values"
ON public.conscious_partner_values
FOR ALL
TO authenticated
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- Create indexes for better performance
CREATE INDEX idx_conscious_media_interactions_user_id ON public.conscious_media_interactions(user_id);
CREATE INDEX idx_conscious_media_interactions_channel ON public.conscious_media_interactions(channel);
CREATE INDEX idx_conscious_media_interactions_timestamp ON public.conscious_media_interactions(timestamp DESC);
CREATE INDEX idx_conscious_media_interactions_interaction_type ON public.conscious_media_interactions(interaction_type);

-- Insert CameraStuff partner data
INSERT INTO public.conscious_partner_values (
  partner_id,
  partner_name,
  partner_website,
  south_african_commitment,
  conscious_values,
  values_alignment_score,
  partner_description
) VALUES (
  'camerastuff',
  'CameraStuff',
  'https://www.camerastuff.co.za',
  'Founded 2006. Proudly South African Godox authorized distributor with local warranty, fast nationwide delivery, supporting local creative economy',
  ARRAY[
    'Local capacity building',
    'Ethical visual documentation',
    'South African economic sovereignty',
    'Values-aligned practitioner support',
    'Professional quality accessible pricing'
  ],
  95,
  'CameraStuff is South Africa''s creative partner for photographers and videographers. Authorized Godox distributor with 2-year local warranty.'
) ON CONFLICT (partner_id) DO UPDATE SET
  partner_name = EXCLUDED.partner_name,
  partner_website = EXCLUDED.partner_website,
  south_african_commitment = EXCLUDED.south_african_commitment,
  conscious_values = EXCLUDED.conscious_values,
  values_alignment_score = EXCLUDED.values_alignment_score,
  partner_description = EXCLUDED.partner_description,
  updated_at = NOW();