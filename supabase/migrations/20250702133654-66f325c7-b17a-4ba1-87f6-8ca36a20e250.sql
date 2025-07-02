-- Create storage bucket for provider profile pictures
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('provider-profiles', 'provider-profiles', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

-- Create storage policies for provider profile pictures
CREATE POLICY "Provider profile images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'provider-profiles');

CREATE POLICY "Providers can upload their own profile images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'provider-profiles' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Providers can update their own profile images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'provider-profiles' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Providers can delete their own profile images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'provider-profiles' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Add profile_image_url column to provider_profiles table
ALTER TABLE public.provider_profiles 
ADD COLUMN profile_image_url TEXT;