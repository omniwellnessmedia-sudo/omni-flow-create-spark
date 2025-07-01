
-- Create user profiles table for additional user information
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  user_type TEXT CHECK (user_type IN ('provider', 'consumer')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create provider profiles table for wellness service providers
CREATE TABLE public.provider_profiles (
  id UUID REFERENCES public.profiles ON DELETE CASCADE PRIMARY KEY,
  business_name TEXT,
  description TEXT,
  specialties TEXT[],
  location TEXT,
  phone TEXT,
  website TEXT,
  experience_years INTEGER,
  certifications TEXT[],
  pricing_info JSONB,
  availability JSONB,
  verified BOOLEAN DEFAULT false,
  wellcoin_balance INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create consumer profiles table
CREATE TABLE public.consumer_profiles (
  id UUID REFERENCES public.profiles ON DELETE CASCADE PRIMARY KEY,
  wellness_goals TEXT[],
  preferred_services TEXT[],
  location TEXT,
  wellcoin_balance INTEGER DEFAULT 10, -- New users get 10 WellCoins
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create services table for wellness services
CREATE TABLE public.services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID REFERENCES public.provider_profiles ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  price_zar DECIMAL(10,2),
  price_wellcoins INTEGER,
  duration_minutes INTEGER,
  location TEXT,
  is_online BOOLEAN DEFAULT false,
  images TEXT[],
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create onboarding_sessions table for AI-guided onboarding
CREATE TABLE public.onboarding_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles ON DELETE CASCADE NOT NULL,
  current_step INTEGER DEFAULT 1,
  total_steps INTEGER DEFAULT 5,
  session_data JSONB DEFAULT '{}',
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consumer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for provider_profiles
CREATE POLICY "Anyone can view provider profiles" ON public.provider_profiles
  FOR SELECT USING (true);

CREATE POLICY "Providers can update their own profile" ON public.provider_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Providers can insert their own profile" ON public.provider_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for consumer_profiles
CREATE POLICY "Consumers can view their own profile" ON public.consumer_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Consumers can update their own profile" ON public.consumer_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Consumers can insert their own profile" ON public.consumer_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for services
CREATE POLICY "Anyone can view active services" ON public.services
  FOR SELECT USING (active = true);

CREATE POLICY "Providers can manage their own services" ON public.services
  FOR ALL USING (provider_id IN (
    SELECT id FROM public.provider_profiles WHERE id = auth.uid()
  ));

-- Create RLS policies for onboarding_sessions
CREATE POLICY "Users can manage their own onboarding sessions" ON public.onboarding_sessions
  FOR ALL USING (user_id = auth.uid());

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
