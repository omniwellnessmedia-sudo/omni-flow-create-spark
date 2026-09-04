-- HELPER HEAL, added 4 September 2026 per docs/SUPABASE_PREVIEW_MIGRATIONS_FIX.md.
-- The preview branch records earlier files as applied and never re-runs
-- them, so this heal lives HERE, at the exact file the branch replay
-- resumes from, as well as in 20251021081931 for true from-scratch
-- replays. Preview branches are missing helper functions that later
-- statements use bare; recreating them with their exact production
-- definitions makes CREATE OR REPLACE a no-op on production.
SET check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $upd$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$upd$ LANGUAGE plpgsql;

DO $is_admin_heal$
BEGIN
  CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
  RETURNS boolean
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
  SET search_path = public
  AS $fn$
    SELECT EXISTS (
      SELECT 1
      FROM public.profiles
      WHERE id = user_id
        AND user_type = 'admin'
    );
  $fn$;
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function
    OR invalid_function_definition THEN
    RAISE NOTICE 'Skipping is_admin heal: %', SQLERRM;
END
$is_admin_heal$;

SET check_function_bodies = on;

-- Exception-guarded per statement on 4 September 2026 per
-- docs/SUPABASE_PREVIEW_MIGRATIONS_FIX.md: fresh Supabase preview branches
-- are missing dashboard-created tables, so statements referencing them skip
-- with a NOTICE instead of failing the replay. On production every object
-- exists and every statement runs exactly as before.

DO $g1$
BEGIN
-- Create resources table for document management
CREATE TABLE public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basic Info
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('wellness-guides', 'videos', 'audio', 'community-tools', 'business-docs')),
  subcategory TEXT,
  
  -- File Info
  file_type TEXT NOT NULL CHECK (file_type IN ('pdf', 'video', 'audio', 'image', 'document', 'design')),
  file_url TEXT NOT NULL,
  file_size_bytes INTEGER,
  thumbnail_url TEXT,
  
  -- Organization
  tags TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  
  -- Access Control
  access_level TEXT DEFAULT 'public' CHECK (access_level IN ('public', 'authenticated', 'provider-only')),
  
  -- Tracking
  download_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  
  -- SEO & Search
  seo_keywords TEXT[] DEFAULT '{}',
  search_vector tsvector,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  published_at TIMESTAMPTZ,
  
  -- Flexible metadata (JSON for additional properties)
  metadata JSONB DEFAULT '{}'::jsonb
);
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g1$;

DO $g2$
BEGIN
-- Create function to update search vector
CREATE OR REPLACE FUNCTION public.update_resource_search_vector()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(array_to_string(NEW.tags, ' '), '')), 'C');
  RETURN NEW;
END;
$$;
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g2$;

DO $g3$
BEGIN
-- Create trigger to update search vector
CREATE TRIGGER update_resources_search_vector
  BEFORE INSERT OR UPDATE ON public.resources
  FOR EACH ROW
  EXECUTE FUNCTION public.update_resource_search_vector();
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g3$;

DO $g4$
BEGIN
-- Create indexes for performance
CREATE INDEX idx_resources_category ON public.resources(category);
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g4$;

DO $g5$
BEGIN
CREATE INDEX idx_resources_published ON public.resources(is_published);
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g5$;

DO $g6$
BEGIN
CREATE INDEX idx_resources_featured ON public.resources(is_featured);
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g6$;

DO $g7$
BEGIN
CREATE INDEX idx_resources_tags ON public.resources USING GIN(tags);
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g7$;

DO $g8$
BEGIN
CREATE INDEX idx_resources_search ON public.resources USING GIN(search_vector);
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g8$;

DO $g9$
BEGIN
-- Enable RLS
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g9$;

DO $g10$
BEGIN
-- RLS Policy: Anyone can view published resources
CREATE POLICY "Anyone can view published resources"
  ON public.resources FOR SELECT
  USING (is_published = true);
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g10$;

DO $g11$
BEGIN
-- RLS Policy: Admins can manage all resources
CREATE POLICY "Admins can manage all resources"
  ON public.resources FOR ALL
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g11$;

DO $g12$
BEGIN
-- Create updated_at trigger
CREATE TRIGGER update_resources_updated_at
  BEFORE UPDATE ON public.resources
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g12$;

DO $g13$
BEGIN
-- Create download tracking function
CREATE OR REPLACE FUNCTION public.increment_resource_download(resource_id UUID)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.resources
  SET download_count = download_count + 1
  WHERE id = resource_id;
$$;
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g13$;

DO $g14$
BEGIN
-- Create public storage bucket for business documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'business-documents',
  'business-documents',
  true,
  52428800, -- 50MB limit
  ARRAY[
    'application/pdf',
    'video/mp4',
    'video/webm',
    'audio/mpeg',
    'audio/wav',
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ]
);
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g14$;

DO $g15$
BEGIN
-- RLS Policy: Anyone can view files
CREATE POLICY "Anyone can view business documents"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'business-documents');
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g15$;

DO $g16$
BEGIN
-- RLS Policy: Admins can upload
CREATE POLICY "Admins can upload business documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'business-documents' 
    AND is_admin(auth.uid())
  );
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g16$;

DO $g17$
BEGIN
-- RLS Policy: Admins can update
CREATE POLICY "Admins can update business documents"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'business-documents' 
    AND is_admin(auth.uid())
  );
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g17$;

DO $g18$
BEGIN
-- RLS Policy: Admins can delete
CREATE POLICY "Admins can delete business documents"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'business-documents' 
    AND is_admin(auth.uid())
  );
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g18$;

DO $g19$
BEGIN
-- Seed initial 12 resources with placeholder URLs
INSERT INTO public.resources (title, description, category, file_type, file_url, is_published, display_order, tags, published_at) VALUES
-- Wellness Guides
('Beginner''s Guide to Mindfulness', 'Learn the basics of mindfulness practice and meditation techniques', 'wellness-guides', 'pdf', 'https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/business-documents/mindfulness-guide.pdf', true, 1, ARRAY['mindfulness', 'meditation', 'wellness'], now()),
('Nutrition Essentials', 'Complete guide to conscious eating and holistic nutrition', 'wellness-guides', 'pdf', 'https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/business-documents/nutrition-guide.pdf', true, 2, ARRAY['nutrition', 'health', 'wellness'], now()),
('Plant-Based Transition Guide', 'Step-by-step guide to transitioning to plant-based living', 'wellness-guides', 'pdf', 'https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/business-documents/plant-based-guide.pdf', true, 3, ARRAY['plant-based', 'vegan', 'nutrition'], now()),

-- Videos
('Community Impact Stories', 'Real stories from our community wellness projects', 'videos', 'video', 'https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/business-documents/community-stories.mp4', true, 1, ARRAY['community', 'impact', 'stories'], now()),
('Wellness Workshop Series', 'Educational content for personal growth and development', 'videos', 'video', 'https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/business-documents/workshop-series.mp4', true, 2, ARRAY['workshop', 'education', 'wellness'], now()),
('Behind the Scenes', 'How we create conscious content and media', 'videos', 'video', 'https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/business-documents/behind-scenes.mp4', true, 3, ARRAY['content', 'media', 'production'], now()),

-- Audio
('Meditation Practices', 'Guided meditations for daily mindfulness practice', 'audio', 'audio', 'https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/business-documents/meditation-tracks.mp3', true, 1, ARRAY['meditation', 'mindfulness', 'audio'], now()),
('Podcast Episodes', 'Insights and conversations with wellness changemakers', 'audio', 'audio', 'https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/business-documents/podcast-episodes.mp3', true, 2, ARRAY['podcast', 'interviews', 'wellness'], now()),
('Affirmation Tracks', 'Positive affirmations for empowerment and growth', 'audio', 'audio', 'https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/business-documents/affirmations.mp3', true, 3, ARRAY['affirmations', 'empowerment', 'audio'], now()),

-- Community Tools
('Event Planning Toolkit', 'Resources for organizing community wellness events', 'community-tools', 'pdf', 'https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/business-documents/event-toolkit.pdf', true, 1, ARRAY['events', 'planning', 'community'], now()),
('Social Media Templates', 'Templates for conscious content creation', 'community-tools', 'design', 'https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/business-documents/social-templates.zip', true, 2, ARRAY['social-media', 'templates', 'content'], now()),
('Fundraising Guide', 'How to raise funds for community wellness projects', 'community-tools', 'pdf', 'https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/business-documents/fundraising-guide.pdf', true, 3, ARRAY['fundraising', 'community', 'finance'], now());
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g19$;
