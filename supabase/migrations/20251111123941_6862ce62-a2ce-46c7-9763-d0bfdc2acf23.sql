-- Fix search_path for review helpful count function with CASCADE
DROP TRIGGER IF EXISTS trigger_update_helpful_count ON public.review_helpfulness CASCADE;
DROP FUNCTION IF EXISTS update_review_helpful_count() CASCADE;

CREATE OR REPLACE FUNCTION update_review_helpful_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.product_reviews
  SET helpful_count = (
    SELECT COUNT(*)
    FROM public.review_helpfulness
    WHERE review_id = NEW.review_id AND is_helpful = true
  )
  WHERE id = NEW.review_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public';

-- Recreate trigger
CREATE TRIGGER trigger_update_helpful_count
AFTER INSERT OR UPDATE OR DELETE ON public.review_helpfulness
FOR EACH ROW
EXECUTE FUNCTION update_review_helpful_count();