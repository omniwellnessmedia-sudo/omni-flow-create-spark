-- ================================================
-- Tour Booking Stabilization Schema
-- Implements OCTO/GSTC sustainable travel standards
-- ================================================

-- Add booking configuration columns to tours table
ALTER TABLE tours ADD COLUMN IF NOT EXISTS booking_mode TEXT DEFAULT 'request' CHECK (booking_mode IN ('instant', 'request'));
ALTER TABLE tours ADD COLUMN IF NOT EXISTS min_notice_hours INTEGER DEFAULT 48;
ALTER TABLE tours ADD COLUMN IF NOT EXISTS requires_deposit BOOLEAN DEFAULT true;
ALTER TABLE tours ADD COLUMN IF NOT EXISTS deposit_amount_zar NUMERIC DEFAULT 500;
ALTER TABLE tours ADD COLUMN IF NOT EXISTS deposit_percentage INTEGER DEFAULT 25;
ALTER TABLE tours ADD COLUMN IF NOT EXISTS max_participants INTEGER DEFAULT 20;
ALTER TABLE tours ADD COLUMN IF NOT EXISTS operator_id UUID;
ALTER TABLE tours ADD COLUMN IF NOT EXISTS cancellation_policy TEXT DEFAULT 'flexible';

-- ================================================
-- Tour Operator Availability Table
-- Tracks when each operator is available for tours
-- ================================================
CREATE TABLE IF NOT EXISTS tour_operator_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operator_id UUID NOT NULL,
  tour_id UUID REFERENCES tours(id) ON DELETE CASCADE,
  available_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  max_capacity INTEGER DEFAULT 10,
  booked_capacity INTEGER DEFAULT 0,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'blocked', 'tentative', 'fully_booked')),
  external_calendar_sync TEXT CHECK (external_calendar_sync IN ('cal.com', 'calendly', 'google', 'manual')),
  external_event_id TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tour_id, available_date)
);

-- Enable RLS
ALTER TABLE tour_operator_availability ENABLE ROW LEVEL SECURITY;

-- Policies for operator availability
CREATE POLICY "Anyone can view available dates" 
ON tour_operator_availability FOR SELECT 
USING (status IN ('available', 'tentative'));

CREATE POLICY "Operators can manage their availability" 
ON tour_operator_availability FOR ALL 
USING (operator_id = auth.uid());

CREATE POLICY "Admins can manage all availability" 
ON tour_operator_availability FOR ALL 
USING (is_admin(auth.uid()));

-- ================================================
-- Booking Requests Table (Request-to-Book pattern)
-- For flexible operators who need to confirm bookings
-- ================================================
CREATE TABLE IF NOT EXISTS booking_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id UUID NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
  consumer_id UUID,
  preferred_dates JSONB NOT NULL DEFAULT '[]', -- Array of preferred date options
  flexibility TEXT DEFAULT 'specific' CHECK (flexibility IN ('specific', 'flexible_week', 'any_weekend', 'any_weekday', 'fully_flexible')),
  participants INTEGER NOT NULL CHECK (participants > 0),
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  special_requirements TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending', 
    'operator_reviewing', 
    'confirmed', 
    'alternative_offered', 
    'user_reviewing_alternative',
    'declined', 
    'expired', 
    'cancelled'
  )),
  operator_id UUID,
  operator_response_deadline TIMESTAMPTZ,
  operator_response_at TIMESTAMPTZ,
  alternative_dates_offered JSONB,
  alternative_message TEXT,
  confirmed_date DATE,
  confirmed_time TIME,
  deposit_captured BOOLEAN DEFAULT false,
  deposit_amount_zar NUMERIC,
  stripe_payment_intent_id TEXT,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE booking_requests ENABLE ROW LEVEL SECURITY;

-- Policies for booking requests
CREATE POLICY "Users can view their own requests" 
ON booking_requests FOR SELECT 
USING (consumer_id = auth.uid() OR contact_email = (SELECT email FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can create booking requests" 
ON booking_requests FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own requests" 
ON booking_requests FOR UPDATE 
USING (consumer_id = auth.uid());

CREATE POLICY "Operators can view requests for their tours" 
ON booking_requests FOR SELECT 
USING (operator_id = auth.uid() OR is_admin(auth.uid()));

CREATE POLICY "Operators can update requests for their tours" 
ON booking_requests FOR UPDATE 
USING (operator_id = auth.uid() OR is_admin(auth.uid()));

CREATE POLICY "Admins can manage all requests" 
ON booking_requests FOR ALL 
USING (is_admin(auth.uid()));

-- ================================================
-- Booking Leases Table (Temporary holds)
-- Prevents double-booking during checkout process
-- ================================================
CREATE TABLE IF NOT EXISTS booking_leases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id UUID NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
  selected_date DATE NOT NULL,
  selected_time TIME,
  participants INTEGER NOT NULL CHECK (participants > 0),
  consumer_session_id TEXT NOT NULL,
  consumer_id UUID,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'converted', 'expired', 'released')),
  converted_to_booking_id UUID,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE booking_leases ENABLE ROW LEVEL SECURITY;

-- Policies for booking leases
CREATE POLICY "Anyone can create leases" 
ON booking_leases FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can view their own leases" 
ON booking_leases FOR SELECT 
USING (consumer_session_id = current_setting('request.headers', true)::json->>'x-session-id' OR consumer_id = auth.uid());

CREATE POLICY "System can update leases" 
ON booking_leases FOR UPDATE 
USING (true);

CREATE POLICY "Admins can manage all leases" 
ON booking_leases FOR ALL 
USING (is_admin(auth.uid()));

-- ================================================
-- Add tour_bookings table if not exists
-- ================================================
CREATE TABLE IF NOT EXISTS tour_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id UUID NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
  booking_request_id UUID REFERENCES booking_requests(id),
  user_id UUID,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  booking_date DATE NOT NULL,
  booking_time TIME,
  participants INTEGER NOT NULL CHECK (participants > 0),
  total_price NUMERIC NOT NULL,
  deposit_paid NUMERIC DEFAULT 0,
  balance_due NUMERIC,
  special_requirements TEXT,
  roambuddy_services JSONB DEFAULT '[]',
  roambuddy_booking_id TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending', 
    'deposit_paid', 
    'confirmed', 
    'balance_paid', 
    'completed', 
    'cancelled', 
    'no_show',
    'refunded'
  )),
  confirmation_code TEXT,
  stripe_payment_intent_id TEXT,
  operator_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on tour_bookings if not already
ALTER TABLE tour_bookings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate
DROP POLICY IF EXISTS "Users can view their own tour bookings" ON tour_bookings;
DROP POLICY IF EXISTS "Users can create tour bookings" ON tour_bookings;
DROP POLICY IF EXISTS "Admins can manage all tour bookings" ON tour_bookings;

CREATE POLICY "Users can view their own tour bookings" 
ON tour_bookings FOR SELECT 
USING (user_id = auth.uid() OR contact_email = (SELECT email FROM profiles WHERE id = auth.uid()) OR is_admin(auth.uid()));

CREATE POLICY "Users can create tour bookings" 
ON tour_bookings FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can manage all tour bookings" 
ON tour_bookings FOR ALL 
USING (is_admin(auth.uid()));

-- ================================================
-- Helper Functions
-- ================================================

-- Function to check available capacity for a tour on a date
CREATE OR REPLACE FUNCTION get_tour_availability(
  p_tour_id UUID,
  p_date DATE
) RETURNS TABLE (
  available_capacity INTEGER,
  total_capacity INTEGER,
  status TEXT,
  start_time TIME,
  end_time TIME
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    GREATEST(0, COALESCE(toa.max_capacity, 10) - COALESCE(toa.booked_capacity, 0)) as available_capacity,
    COALESCE(toa.max_capacity, 10) as total_capacity,
    COALESCE(toa.status, 'available') as status,
    toa.start_time,
    toa.end_time
  FROM tour_operator_availability toa
  WHERE toa.tour_id = p_tour_id 
    AND toa.available_date = p_date
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up expired leases
CREATE OR REPLACE FUNCTION cleanup_expired_leases() RETURNS void AS $$
BEGIN
  UPDATE booking_leases 
  SET status = 'expired'
  WHERE status = 'active' 
    AND expires_at < now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate confirmation code
CREATE OR REPLACE FUNCTION generate_confirmation_code() RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := 'OWM-';
  i INTEGER;
BEGIN
  FOR i IN 1..6 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate confirmation code
CREATE OR REPLACE FUNCTION set_confirmation_code() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.confirmation_code IS NULL THEN
    NEW.confirmation_code := generate_confirmation_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_confirmation_code ON tour_bookings;
CREATE TRIGGER trigger_set_confirmation_code
  BEFORE INSERT ON tour_bookings
  FOR EACH ROW
  EXECUTE FUNCTION set_confirmation_code();

-- Trigger to update timestamps
CREATE OR REPLACE FUNCTION update_tour_booking_timestamp() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_tour_booking_timestamp ON tour_bookings;
CREATE TRIGGER trigger_update_tour_booking_timestamp
  BEFORE UPDATE ON tour_bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_tour_booking_timestamp();

DROP TRIGGER IF EXISTS trigger_update_booking_request_timestamp ON booking_requests;
CREATE TRIGGER trigger_update_booking_request_timestamp
  BEFORE UPDATE ON booking_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_tour_booking_timestamp();

DROP TRIGGER IF EXISTS trigger_update_availability_timestamp ON tour_operator_availability;
CREATE TRIGGER trigger_update_availability_timestamp
  BEFORE UPDATE ON tour_operator_availability
  FOR EACH ROW
  EXECUTE FUNCTION update_tour_booking_timestamp();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tour_availability_tour_date ON tour_operator_availability(tour_id, available_date);
CREATE INDEX IF NOT EXISTS idx_tour_availability_operator ON tour_operator_availability(operator_id);
CREATE INDEX IF NOT EXISTS idx_booking_requests_tour ON booking_requests(tour_id);
CREATE INDEX IF NOT EXISTS idx_booking_requests_status ON booking_requests(status);
CREATE INDEX IF NOT EXISTS idx_booking_requests_operator ON booking_requests(operator_id);
CREATE INDEX IF NOT EXISTS idx_booking_leases_tour_date ON booking_leases(tour_id, selected_date);
CREATE INDEX IF NOT EXISTS idx_booking_leases_expires ON booking_leases(expires_at) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_tour_bookings_tour ON tour_bookings(tour_id);
CREATE INDEX IF NOT EXISTS idx_tour_bookings_date ON tour_bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_tour_bookings_user ON tour_bookings(user_id);