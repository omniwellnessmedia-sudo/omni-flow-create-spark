import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookingCalendar } from "@/components/booking/BookingCalendar";
import MegaNavigation from "@/components/MegaNavigation";
import Footer from "@/components/Footer";
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Coins, 
  PiggyBank, 
  Star, 
  User,
  Globe
} from "lucide-react";
import { toast } from "sonner";

interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  price_zar: number;
  price_wellcoins: number;
  duration_minutes: number;
  location: string;
  is_online: boolean;
  images: string[] | null;
  provider_profiles: {
    id: string;
    business_name: string;
    description: string;
    location: string;
    specialties: string[];
    verified: boolean;
  };
}

const ServiceDetail = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    if (serviceId) {
      fetchService();
    }
  }, [serviceId]);

  const fetchService = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          provider_profiles (
            id,
            business_name,
            description,
            location,
            specialties,
            verified
          )
        `)
        .eq('id', serviceId)
        .eq('active', true)
        .single();

      if (error) throw error;
      setService(data);
    } catch (error: any) {
      console.error("Failed to fetch service:", error);
      toast.error("Service not found");
      navigate('/wellness-exchange/marketplace');
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSelect = async (date: Date, time: string) => {
    if (!user || !service) {
      toast.error("Please sign in to book services");
      return;
    }

    try {
      const bookingData = {
        provider_id: service.provider_profiles.id,
        consumer_id: user.id,
        service_id: service.id,
        booking_date: `${date.toISOString().split('T')[0]} ${time}:00`,
        amount_zar: service.price_zar,
        amount_wellcoins: service.price_wellcoins,
        payment_method: 'wellcoins',
        status: 'pending',
        notes: `Booking for ${service.title}`
      };

      const { error } = await supabase
        .from('bookings')
        .insert(bookingData);

      if (error) throw error;

      toast.success("Booking confirmed! You'll receive an email with details.");
      setShowBooking(false);
    } catch (error: any) {
      console.error("Booking failed:", error);
      toast.error("Booking failed: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <MegaNavigation />
        <div className="pt-24 pb-12">
          <div className="max-w-4xl mx-auto px-4">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-64 bg-gray-200 rounded mb-6"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-background">
        <MegaNavigation />
        <div className="pt-24 pb-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold mb-4">Service Not Found</h1>
            <Button onClick={() => navigate('/wellness-exchange/marketplace')}>
              Back to Marketplace
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const defaultImage = "/lovable-uploads/590721a1-f529-47d4-b7f1-8e856b424bb9.png";

  return (
    <div className="min-h-screen bg-background">
      <MegaNavigation />
      
      <main className="pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Back Navigation */}
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Marketplace
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Service Details */}
            <div>
              <div className="aspect-video rounded-lg overflow-hidden mb-6">
                <img 
                  src={service.images?.[0] || defaultImage}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{service.category}</Badge>
                  {service.is_online && (
                    <Badge className="bg-green-100 text-green-800">
                      <Globe className="h-3 w-3 mr-1" />
                      Online Available
                    </Badge>
                  )}
                </div>
                
                <h1 className="text-3xl font-bold mb-4">{service.title}</h1>
                
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {service.location}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {service.duration_minutes} min
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed">{service.description}</p>
              </div>

              {/* Provider Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    About Your Provider
                    {service.provider_profiles.verified && (
                      <Badge className="bg-blue-100 text-blue-800">Verified</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold mb-2">{service.provider_profiles.business_name}</h3>
                  <p className="text-gray-600 mb-3">{service.provider_profiles.description}</p>
                  
                  {service.provider_profiles.specialties && service.provider_profiles.specialties.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Specialties:</p>
                      <div className="flex flex-wrap gap-1">
                        {service.provider_profiles.specialties.map((specialty) => (
                          <Badge key={specialty} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Booking Section */}
            <div className="space-y-6">
              {/* Pricing Card */}
              <Card className="border-2 border-primary/20">
                <CardHeader>
                  <CardTitle>Book This Service</CardTitle>
                  <CardDescription>
                    Choose your preferred payment method and book instantly
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium">Price:</span>
                      <div className="text-right">
                        {service.price_zar > 0 && (
                          <div className="flex items-center text-green-600">
                            <PiggyBank className="h-4 w-4 mr-1" />
                            <span className="font-bold text-lg">R{service.price_zar}</span>
                          </div>
                        )}
                        {service.price_wellcoins > 0 && (
                          <div className="flex items-center text-orange-600">
                            <Coins className="h-4 w-4 mr-1" />
                            <span className="font-bold text-lg">{service.price_wellcoins} WC</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      {user ? (
                        <Button 
                          onClick={() => setShowBooking(true)}
                          className="w-full bg-rainbow-gradient hover:opacity-90 text-white font-semibold py-3"
                          size="lg"
                        >
                          Book This Service
                        </Button>
                      ) : (
                        <Button 
                          onClick={() => navigate('/auth')}
                          className="w-full bg-rainbow-gradient hover:opacity-90 text-white font-semibold py-3"
                          size="lg"
                        >
                          Sign In to Book
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Booking Calendar */}
              {showBooking && user && (
                <BookingCalendar
                  serviceTitle={service.title}
                  duration={service.duration_minutes}
                  price_zar={service.price_zar}
                  price_wellcoins={service.price_wellcoins}
                  onBookingSelect={handleBookingSelect}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ServiceDetail;