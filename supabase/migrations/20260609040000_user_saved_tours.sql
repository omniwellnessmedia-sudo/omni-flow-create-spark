-- user_saved_tours: separate "wishlist" surface for tours.
-- We cannot reuse public.user_wishlists because its product_id column has a
-- hard FK to public.affiliate_products(id); tour IDs would violate it.
-- This table mirrors the wishlist pattern (auth.uid scoping + RLS + unique pair)
-- so the UX feels identical, while keeping the domains separate at the data layer.

CREATE TABLE IF NOT EXISTS public.user_saved_tours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tour_id uuid NOT NULL REFERENCES public.tours(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  notes text,
  UNIQUE(user_id, tour_id)
);

CREATE INDEX IF NOT EXISTS user_saved_tours_user_id_idx
  ON public.user_saved_tours(user_id);

ALTER TABLE public.user_saved_tours ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own saved tours"
  ON public.user_saved_tours FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can save tours"
  ON public.user_saved_tours FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their saved tours"
  ON public.user_saved_tours FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update notes on their saved tours"
  ON public.user_saved_tours FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
