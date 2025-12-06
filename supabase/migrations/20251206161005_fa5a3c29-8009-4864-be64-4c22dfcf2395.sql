-- Make business-documents bucket private
UPDATE storage.buckets 
SET public = false 
WHERE id = 'business-documents';

-- Create RLS policies for business-documents bucket
-- Allow authenticated users to view their own uploaded documents
CREATE POLICY "Users can view their own business documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'business-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow authenticated users to upload to their own folder
CREATE POLICY "Users can upload their own business documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'business-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow authenticated users to update their own documents
CREATE POLICY "Users can update their own business documents"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'business-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow authenticated users to delete their own documents
CREATE POLICY "Users can delete their own business documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'business-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow admins to access all business documents
CREATE POLICY "Admins can access all business documents"
ON storage.objects FOR ALL
USING (
  bucket_id = 'business-documents' 
  AND public.is_admin(auth.uid())
);