-- Create contact_submissions table to store form submissions
CREATE TABLE public.contact_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  organization TEXT,
  service TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'resolved'))
);

-- Enable Row Level Security
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public submissions (anyone can submit)
CREATE POLICY "Allow public contact submissions" 
ON public.contact_submissions 
FOR INSERT 
WITH CHECK (true);

-- Create policy for admins to view all submissions (for now, let's allow authenticated users to view)
CREATE POLICY "Allow authenticated users to view submissions" 
ON public.contact_submissions 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Create service_quotes table for service-specific quote requests
CREATE TABLE public.service_quotes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  service_type TEXT NOT NULL,
  project_details TEXT NOT NULL,
  budget_range TEXT,
  timeline TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'quoted', 'accepted', 'declined'))
);

-- Enable Row Level Security
ALTER TABLE public.service_quotes ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public quote submissions
CREATE POLICY "Allow public service quote submissions" 
ON public.service_quotes 
FOR INSERT 
WITH CHECK (true);

-- Create policy for authenticated users to view quotes
CREATE POLICY "Allow authenticated users to view quotes" 
ON public.service_quotes 
FOR SELECT 
USING (auth.role() = 'authenticated');