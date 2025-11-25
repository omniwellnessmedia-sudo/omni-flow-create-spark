-- Fix search_path for update_viator_tours_updated_at function
CREATE OR REPLACE FUNCTION update_viator_tours_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;