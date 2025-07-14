-- Create tour categories table
CREATE TABLE public.tour_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tours table
CREATE TABLE public.tours (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES public.tour_categories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  subtitle TEXT,
  overview TEXT,
  duration TEXT NOT NULL,
  max_participants INTEGER NOT NULL DEFAULT 12,
  price_from DECIMAL(10,2) NOT NULL,
  destination TEXT NOT NULL,
  hero_image_url TEXT,
  image_gallery TEXT[],
  highlights TEXT[],
  inclusions TEXT[],
  exclusions TEXT[],
  difficulty_level TEXT DEFAULT 'moderate',
  active BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tour itineraries table
CREATE TABLE public.tour_itineraries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tour_id UUID NOT NULL REFERENCES public.tours(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT,
  activities TEXT[],
  meals_included TEXT[],
  accommodation TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tour bookings table
CREATE TABLE public.tour_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tour_id UUID NOT NULL REFERENCES public.tours(id),
  user_id UUID NOT NULL,
  booking_date DATE NOT NULL,
  participants INTEGER NOT NULL DEFAULT 1,
  total_price DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  special_requirements TEXT,
  roambuddy_services JSONB DEFAULT '[]'::jsonb,
  roambuddy_booking_id TEXT,
  payment_status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tour testimonials table
CREATE TABLE public.tour_testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tour_id UUID NOT NULL REFERENCES public.tours(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  title TEXT,
  testimonial_text TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  image_url TEXT,
  approved BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create roambuddy services table
CREATE TABLE public.roambuddy_services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT,
  destination TEXT,
  active BOOLEAN DEFAULT true,
  last_synced TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.tour_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tour_itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tour_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tour_testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roambuddy_services ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for tour categories
CREATE POLICY "Anyone can view active tour categories" ON public.tour_categories FOR SELECT USING (active = true);
CREATE POLICY "Authenticated users can manage categories" ON public.tour_categories FOR ALL USING (auth.role() = 'authenticated');

-- Create RLS policies for tours
CREATE POLICY "Anyone can view active tours" ON public.tours FOR SELECT USING (active = true);
CREATE POLICY "Authenticated users can manage tours" ON public.tours FOR ALL USING (auth.role() = 'authenticated');

-- Create RLS policies for tour itineraries
CREATE POLICY "Anyone can view itineraries for active tours" ON public.tour_itineraries FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.tours WHERE tours.id = tour_itineraries.tour_id AND tours.active = true)
);
CREATE POLICY "Authenticated users can manage itineraries" ON public.tour_itineraries FOR ALL USING (auth.role() = 'authenticated');

-- Create RLS policies for tour bookings
CREATE POLICY "Users can view their own bookings" ON public.tour_bookings FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Authenticated users can create bookings" ON public.tour_bookings FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update their own bookings" ON public.tour_bookings FOR UPDATE USING (auth.uid()::text = user_id::text);
CREATE POLICY "Staff can view all bookings" ON public.tour_bookings FOR SELECT USING (auth.role() = 'authenticated');

-- Create RLS policies for testimonials
CREATE POLICY "Anyone can view approved testimonials" ON public.tour_testimonials FOR SELECT USING (approved = true);
CREATE POLICY "Authenticated users can manage testimonials" ON public.tour_testimonials FOR ALL USING (auth.role() = 'authenticated');

-- Create RLS policies for roambuddy services
CREATE POLICY "Anyone can view active services" ON public.roambuddy_services FOR SELECT USING (active = true);
CREATE POLICY "Authenticated users can manage services" ON public.roambuddy_services FOR ALL USING (auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX idx_tours_category_id ON public.tours(category_id);
CREATE INDEX idx_tours_slug ON public.tours(slug);
CREATE INDEX idx_tours_active_featured ON public.tours(active, featured);
CREATE INDEX idx_tour_itineraries_tour_id ON public.tour_itineraries(tour_id);
CREATE INDEX idx_tour_bookings_tour_id ON public.tour_bookings(tour_id);
CREATE INDEX idx_tour_bookings_user_id ON public.tour_bookings(user_id);
CREATE INDEX idx_tour_testimonials_tour_id ON public.tour_testimonials(tour_id);
CREATE INDEX idx_roambuddy_services_destination ON public.roambuddy_services(destination);

-- Create updated_at triggers
CREATE TRIGGER update_tour_categories_updated_at BEFORE UPDATE ON public.tour_categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tours_updated_at BEFORE UPDATE ON public.tours FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tour_bookings_updated_at BEFORE UPDATE ON public.tour_bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tour_testimonials_updated_at BEFORE UPDATE ON public.tour_testimonials FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_roambuddy_services_updated_at BEFORE UPDATE ON public.roambuddy_services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();