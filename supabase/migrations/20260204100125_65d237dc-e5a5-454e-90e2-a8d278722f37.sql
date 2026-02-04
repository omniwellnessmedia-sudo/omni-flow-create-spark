-- Insert AIRPORT20 discount code for Cape Town Airport campaign
INSERT INTO public.discount_codes (
  code,
  discount_type,
  discount_value,
  description,
  is_active,
  valid_from,
  valid_until,
  min_order_amount,
  max_uses,
  wellcoins_bonus
) VALUES (
  'AIRPORT20',
  'percentage',
  20,
  'Cape Town Airport Campaign - 20% off for arriving travelers. Scan QR code at CPT arrivals.',
  true,
  '2026-02-04',
  '2026-05-04',
  5,
  1000,
  20
);

-- Also insert FIRSTTRIP code if not exists
INSERT INTO public.discount_codes (
  code,
  discount_type,
  discount_value,
  description,
  is_active,
  valid_from,
  valid_until,
  min_order_amount,
  max_uses,
  wellcoins_bonus
) VALUES (
  'FIRSTTRIP',
  'percentage',
  20,
  'First-time international travelers - 20% off your first eSIM purchase.',
  true,
  '2026-02-04',
  '2026-08-04',
  5,
  500,
  20
) ON CONFLICT (code) DO NOTHING;