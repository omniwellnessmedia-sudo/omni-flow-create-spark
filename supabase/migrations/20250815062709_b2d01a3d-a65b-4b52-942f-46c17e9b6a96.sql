-- Remove insecure calendly_config table that stores secrets in database
-- Secrets should be stored in environment variables instead

-- Drop the table entirely as it's a security risk
DROP TABLE IF EXISTS public.calendly_config;