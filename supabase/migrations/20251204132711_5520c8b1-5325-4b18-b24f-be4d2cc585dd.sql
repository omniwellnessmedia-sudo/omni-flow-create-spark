-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Authenticated users can manage Viator tours" ON public.viator_tours;

-- Create a policy that allows service role (used by edge functions) to manage tours
CREATE POLICY "Service role can manage Viator tours"
ON public.viator_tours
FOR ALL
USING (true)
WITH CHECK (true);

-- Keep the public read policy for active tours
-- (Already exists: "Anyone can view active Viator tours")