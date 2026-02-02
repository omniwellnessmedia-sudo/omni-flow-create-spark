-- Fix RLS policies for newsletter_subscribers to allow upsert
CREATE POLICY "Allow public update on newsletter_subscribers" 
ON public.newsletter_subscribers 
FOR UPDATE 
USING (true) 
WITH CHECK (true);

-- Fix RLS policies for chatbot_conversations to allow upsert
CREATE POLICY "Allow public update on chatbot_conversations" 
ON public.chatbot_conversations 
FOR UPDATE 
USING (true);

-- Create discount_codes table for coupon system
CREATE TABLE public.discount_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  discount_type TEXT NOT NULL DEFAULT 'percentage' CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC NOT NULL DEFAULT 0,
  min_order_amount NUMERIC DEFAULT 0,
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT now(),
  valid_until TIMESTAMP WITH TIME ZONE,
  applicable_products TEXT[],
  wellcoins_bonus INTEGER DEFAULT 0,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on discount_codes
ALTER TABLE public.discount_codes ENABLE ROW LEVEL SECURITY;

-- Allow public read for discount code validation
CREATE POLICY "Allow public read on discount_codes"
ON public.discount_codes
FOR SELECT
USING (is_active = true);

-- Allow admins to manage discount codes
CREATE POLICY "Allow admin manage discount_codes"
ON public.discount_codes
FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.user_roles ur
  WHERE ur.user_id = auth.uid()
  AND ur.role IN ('admin', 'super_admin')
));

-- Insert default discount codes
INSERT INTO public.discount_codes (code, discount_type, discount_value, wellcoins_bonus, description, valid_until) VALUES
('ROAM10', 'percentage', 10, 5, 'General 10% off eSIM purchases', now() + interval '1 year'),
('WELCOME', 'fixed', 5, 10, 'Welcome $5 off for new customers', now() + interval '1 year'),
('WELLNESS', 'percentage', 15, 15, 'Wellness community special discount', now() + interval '1 year'),
('OMNI25', 'percentage', 25, 25, 'VIP/launch discount code', now() + interval '6 months'),
('FIRSTTRIP', 'percentage', 20, 20, 'First-time travelers discount', now() + interval '1 year');

-- Create trigger for updating updated_at
CREATE TRIGGER update_discount_codes_updated_at
BEFORE UPDATE ON public.discount_codes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();