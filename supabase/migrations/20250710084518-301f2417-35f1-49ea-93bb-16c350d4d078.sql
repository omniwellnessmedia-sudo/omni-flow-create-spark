-- Update Sandy's user metadata
UPDATE auth.users 
SET raw_user_meta_data = '{"user_type": "provider", "full_name": "Sandy Mitchell"}'::jsonb
WHERE email = 'sandy@sandymitchell.co.za';