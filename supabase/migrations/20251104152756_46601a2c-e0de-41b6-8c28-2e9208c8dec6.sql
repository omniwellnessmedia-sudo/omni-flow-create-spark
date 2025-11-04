-- Fix services incorrectly linked to 'uthando africa' test provider
-- These services should be linked to Sandy Mitchell's provider profile

UPDATE services
SET provider_id = '351e4f5a-a27f-4fe5-957f-fa0ea1210040'
WHERE provider_id = 'ec7887f9-e0bc-494d-afd6-3779f85021ff'
  AND (
    title ILIKE '%yoga%' 
    OR title ILIKE '%breath%'
    OR title ILIKE '%hatha%'
  );

-- Log the changes for reference
COMMENT ON TABLE services IS 'Services table - Updated incorrectly linked yoga/breathwork services to Sandy Mitchell provider (2025-01-04)';