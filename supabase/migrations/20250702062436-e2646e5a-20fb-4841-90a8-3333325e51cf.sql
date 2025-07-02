-- Create transactions table for tracking all WellCoin and ZAR transactions
CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('earning', 'spending', 'bonus', 'referral', 'fee')),
  amount_wellcoins INTEGER DEFAULT 0,
  amount_zar NUMERIC(10,2) DEFAULT 0,
  description TEXT NOT NULL,
  related_service_id UUID REFERENCES services(id),
  related_user_id UUID REFERENCES profiles(id),
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bookings table for service reservations
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES provider_profiles(id),
  consumer_id UUID NOT NULL REFERENCES consumer_profiles(id),
  booking_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('wellcoins', 'zar', 'hybrid')),
  amount_wellcoins INTEGER DEFAULT 0,
  amount_zar NUMERIC(10,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reviews table for two-way feedback
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES profiles(id),
  reviewee_id UUID NOT NULL REFERENCES profiles(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  review_type TEXT NOT NULL CHECK (review_type IN ('provider_to_consumer', 'consumer_to_provider')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create wants table for service requests (like CTTE)
CREATE TABLE public.wants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT,
  location TEXT,
  budget_wellcoins INTEGER,
  budget_zar NUMERIC(10,2),
  expires_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'fulfilled', 'expired', 'cancelled')),
  responses_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create want_responses table for provider responses to wants
CREATE TABLE public.want_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  want_id UUID NOT NULL REFERENCES wants(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES provider_profiles(id),
  message TEXT NOT NULL,
  proposed_price_wellcoins INTEGER,
  proposed_price_zar NUMERIC(10,2),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create community_posts table for community engagement
CREATE TABLE public.community_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  post_type TEXT NOT NULL CHECK (post_type IN ('discussion', 'tip', 'success_story', 'event', 'announcement')),
  tags TEXT[],
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.want_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for transactions
CREATE POLICY "Users can view their own transactions" 
ON public.transactions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can insert transactions" 
ON public.transactions 
FOR INSERT 
WITH CHECK (true);

-- Create RLS policies for bookings
CREATE POLICY "Users can view bookings they're involved in" 
ON public.bookings 
FOR SELECT 
USING (
  auth.uid() IN (
    SELECT id FROM provider_profiles WHERE id = provider_id
    UNION 
    SELECT id FROM consumer_profiles WHERE id = consumer_id
  )
);

CREATE POLICY "Consumers can create bookings" 
ON public.bookings 
FOR INSERT 
WITH CHECK (
  auth.uid() IN (SELECT id FROM consumer_profiles WHERE id = consumer_id)
);

CREATE POLICY "Providers can update their bookings" 
ON public.bookings 
FOR UPDATE 
USING (
  auth.uid() IN (SELECT id FROM provider_profiles WHERE id = provider_id)
);

-- Create RLS policies for reviews
CREATE POLICY "Anyone can view reviews" 
ON public.reviews 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create reviews for their bookings" 
ON public.reviews 
FOR INSERT 
WITH CHECK (
  auth.uid() = reviewer_id AND
  EXISTS (
    SELECT 1 FROM bookings 
    WHERE id = booking_id 
    AND (provider_id = auth.uid() OR consumer_id = auth.uid())
    AND status = 'completed'
  )
);

-- Create RLS policies for wants
CREATE POLICY "Anyone can view active wants" 
ON public.wants 
FOR SELECT 
USING (status = 'active');

CREATE POLICY "Users can create their own wants" 
ON public.wants 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wants" 
ON public.wants 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for want_responses
CREATE POLICY "Want creators and responders can view responses" 
ON public.want_responses 
FOR SELECT 
USING (
  auth.uid() = provider_id OR 
  auth.uid() IN (SELECT user_id FROM wants WHERE id = want_id)
);

CREATE POLICY "Providers can create responses" 
ON public.want_responses 
FOR INSERT 
WITH CHECK (
  auth.uid() = provider_id AND
  auth.uid() IN (SELECT id FROM provider_profiles)
);

-- Create RLS policies for community_posts
CREATE POLICY "Anyone can view community posts" 
ON public.community_posts 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create posts" 
ON public.community_posts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts" 
ON public.community_posts 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create triggers for automatic timestamp updates
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON public.transactions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_wants_updated_at
    BEFORE UPDATE ON public.wants
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_community_posts_updated_at
    BEFORE UPDATE ON public.community_posts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to update WellCoin balances
CREATE OR REPLACE FUNCTION public.update_wellcoin_balance()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.transaction_type IN ('earning', 'bonus', 'referral') THEN
        -- Add to balance
        IF EXISTS (SELECT 1 FROM provider_profiles WHERE id = NEW.user_id) THEN
            UPDATE provider_profiles 
            SET wellcoin_balance = COALESCE(wellcoin_balance, 0) + NEW.amount_wellcoins
            WHERE id = NEW.user_id;
        END IF;
        
        IF EXISTS (SELECT 1 FROM consumer_profiles WHERE id = NEW.user_id) THEN
            UPDATE consumer_profiles 
            SET wellcoin_balance = COALESCE(wellcoin_balance, 0) + NEW.amount_wellcoins
            WHERE id = NEW.user_id;
        END IF;
    ELSIF NEW.transaction_type = 'spending' THEN
        -- Subtract from balance
        IF EXISTS (SELECT 1 FROM provider_profiles WHERE id = NEW.user_id) THEN
            UPDATE provider_profiles 
            SET wellcoin_balance = COALESCE(wellcoin_balance, 0) - NEW.amount_wellcoins
            WHERE id = NEW.user_id;
        END IF;
        
        IF EXISTS (SELECT 1 FROM consumer_profiles WHERE id = NEW.user_id) THEN
            UPDATE consumer_profiles 
            SET wellcoin_balance = COALESCE(wellcoin_balance, 0) - NEW.amount_wellcoins
            WHERE id = NEW.user_id;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_wellcoin_balance_trigger
    AFTER INSERT ON public.transactions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_wellcoin_balance();