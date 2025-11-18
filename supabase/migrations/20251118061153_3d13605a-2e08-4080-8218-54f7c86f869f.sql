-- Grant admin role to omniwellnessmedia@gmail.com
INSERT INTO public.user_roles (user_id, role)
VALUES ('ec7887f9-e0bc-494d-afd6-3779f85021ff', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;