-- Clear old Viator tour data so it can be refreshed with correct booking URLs
DELETE FROM viator_tours WHERE viator_product_code IS NOT NULL;