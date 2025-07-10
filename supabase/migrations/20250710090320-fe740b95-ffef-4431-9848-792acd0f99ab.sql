-- Create table for provider media (videos, images)
CREATE TABLE public.provider_media (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID NOT NULL REFERENCES provider_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  media_type TEXT NOT NULL CHECK (media_type IN ('video', 'image', 'audio')),
  media_url TEXT NOT NULL,
  thumbnail_url TEXT,
  file_size INTEGER,
  duration_seconds INTEGER, -- for videos/audio
  tags TEXT[],
  featured BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for provider website pages
CREATE TABLE public.provider_websites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID NOT NULL REFERENCES provider_profiles(id) ON DELETE CASCADE,
  page_title TEXT NOT NULL DEFAULT 'My Wellness Practice',
  page_subtitle TEXT,
  custom_domain TEXT,
  hero_image_url TEXT,
  hero_video_url TEXT,
  about_section TEXT,
  services_section_title TEXT DEFAULT 'My Services',
  testimonials_section_title TEXT DEFAULT 'Client Testimonials',
  contact_section_title TEXT DEFAULT 'Get In Touch',
  theme_color TEXT DEFAULT '#f97316', -- omni-orange
  custom_css TEXT,
  seo_meta_title TEXT,
  seo_meta_description TEXT,
  google_analytics_id TEXT,
  facebook_pixel_id TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(provider_id)
);

-- Create table for provider testimonials
CREATE TABLE public.provider_testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID NOT NULL REFERENCES provider_profiles(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  client_image_url TEXT,
  testimonial_text TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  service_type TEXT,
  featured BOOLEAN DEFAULT false,
  approved BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for provider blog posts
CREATE TABLE public.provider_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID NOT NULL REFERENCES provider_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image_url TEXT,
  category TEXT,
  tags TEXT[],
  published BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(provider_id, slug)
);

-- Enable RLS
ALTER TABLE public.provider_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_websites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for provider_media
CREATE POLICY "Anyone can view active media" 
ON public.provider_media 
FOR SELECT 
USING (active = true);

CREATE POLICY "Providers can manage their own media" 
ON public.provider_media 
FOR ALL 
USING (provider_id IN (SELECT id FROM provider_profiles WHERE id = auth.uid()));

-- RLS Policies for provider_websites
CREATE POLICY "Anyone can view published websites" 
ON public.provider_websites 
FOR SELECT 
USING (published = true);

CREATE POLICY "Providers can manage their own website" 
ON public.provider_websites 
FOR ALL 
USING (provider_id = auth.uid());

-- RLS Policies for provider_testimonials
CREATE POLICY "Anyone can view approved testimonials" 
ON public.provider_testimonials 
FOR SELECT 
USING (approved = true);

CREATE POLICY "Providers can manage their own testimonials" 
ON public.provider_testimonials 
FOR ALL 
USING (provider_id = auth.uid());

-- RLS Policies for provider_posts
CREATE POLICY "Anyone can view published posts" 
ON public.provider_posts 
FOR SELECT 
USING (published = true);

CREATE POLICY "Providers can manage their own posts" 
ON public.provider_posts 
FOR ALL 
USING (provider_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX idx_provider_media_provider_id ON provider_media(provider_id);
CREATE INDEX idx_provider_media_active ON provider_media(active);
CREATE INDEX idx_provider_media_featured ON provider_media(featured);
CREATE INDEX idx_provider_websites_provider_id ON provider_websites(provider_id);
CREATE INDEX idx_provider_testimonials_provider_id ON provider_testimonials(provider_id);
CREATE INDEX idx_provider_testimonials_featured ON provider_testimonials(featured);
CREATE INDEX idx_provider_posts_provider_id ON provider_posts(provider_id);
CREATE INDEX idx_provider_posts_published ON provider_posts(published);

-- Update triggers for updated_at fields
CREATE TRIGGER update_provider_media_updated_at
  BEFORE UPDATE ON provider_media
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_provider_websites_updated_at
  BEFORE UPDATE ON provider_websites
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_provider_testimonials_updated_at
  BEFORE UPDATE ON provider_testimonials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_provider_posts_updated_at
  BEFORE UPDATE ON provider_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();