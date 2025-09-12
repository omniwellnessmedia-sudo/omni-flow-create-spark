import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import UnifiedNavigation from "@/components/navigation/UnifiedNavigation";
import Footer from "@/components/Footer";
import sandyMitchellData from "@/data/sandyMitchellProfile";
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Coins, 
  Star, 
  Globe,
  Heart,
  Share2,
  Calendar,
  Check
} from "lucide-react";
import { toast } from "sonner";

interface SimpleService {
  id: string;
  title: string;
  description: string;
  category: string;
  price_zar: number;
  price_wellcoins: number;
  duration_minutes: number;
  location: string;
  is_online: boolean;
  images?: string[];
  provider_name: string;
  benefits?: string[];
  suitableFor?: string[];
  requirements?: string[];
}

const ServiceDetailFixed = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [service, setService] = useState<SimpleService | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    fetchService();
  }, [serviceId]);

  const fetchService = () => {
    if (!serviceId) {
      setLoading(false);
      toast.error("No service ID provided");
      navigate('/wellness-exchange/marketplace');
      return;
    }

    // Find Sandy's service
    const sandyService = sandyMitchellData.services.find(s => s.id === serviceId);
    
    if (sandyService) {
      const simpleService: SimpleService = {
        id: sandyService.id,
        title: sandyService.title,
        description: sandyService.longDescription || sandyService.description,
        category: sandyService.category,
        price_zar: sandyService.price_zar,
        price_wellcoins: sandyService.price_wellcoins,
        duration_minutes: sandyService.duration_minutes,
        location: sandyService.location,
        is_online: sandyService.is_online,
        images: sandyService.images,
        provider_name: sandyMitchellData.profile.business_name,
        benefits: sandyService.benefits,
        suitableFor: sandyService.suitableFor,
        requirements: sandyService.requirements
      };
      
      setService(simpleService);
      setLoading(false);
      return;
    }

    // Service not found
    toast.error("Service not found");
    navigate('/wellness-exchange/marketplace');
    setLoading(false);
  };

  const getServiceImage = (images?: string[]) => {
    if (images && images.length > 0 && !images[0].startsWith('blob:')) {
      return images[0];
    }
    return "/lovable-uploads/590721a1-f529-47d4-b7f1-8e856b424bb9.png";
  };

  const handleBookNow = () => {
    if (!user) {
      toast.error("Please sign in to book services");
      return;
    }
    setShowBooking(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <UnifiedNavigation />
        <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <UnifiedNavigation />
        <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Service Not Found</h1>
            <p className="text-gray-600 mb-8">The service you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/wellness-exchange/marketplace')}>
              Back to Marketplace
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <UnifiedNavigation />
      
      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate('/wellness-exchange/marketplace')}
            className="mb-6 hover:bg-white/80"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Marketplace
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Service Details */}
            <div className="space-y-6">
              {/* Service Image */}
              <Card className="overflow-hidden bg-white/80 backdrop-blur-sm border-2 border-white/50 shadow-xl rounded-3xl">
                <div className="aspect-video relative">
                  <img 
                    src={getServiceImage(service.images)}
                    alt={service.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/lovable-uploads/590721a1-f529-47d4-b7f1-8e856b424bb9.png";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0">
                      {service.category}
                    </Badge>
                  </div>

                  {/* Status Badges */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    {service.is_online && (
                      <Badge className="bg-green-500/90 text-white">
                        <Globe className="h-3 w-3 mr-1" />
                        Online
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>

              {/* Service Information */}
              <Card className="bg-white/80 backdrop-blur-sm border-2 border-white/50 shadow-xl rounded-3xl">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      {service.title}
                    </CardTitle>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">4.9</span>
                    </div>
                  </div>
                  <CardDescription className="text-lg font-semibold text-purple-600">
                    {service.provider_name}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <p className="text-gray-700 text-base leading-relaxed">
                    {service.description}
                  </p>

                  {/* Service Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">Location</p>
                        <p className="text-sm text-gray-600">{service.location}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                      <Clock className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium text-gray-900">Duration</p>
                        <p className="text-sm text-gray-600">{service.duration_minutes} minutes</p>
                      </div>
                    </div>
                  </div>

                  {/* Benefits */}
                  {service.benefits && service.benefits.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-lg mb-3">Benefits</h3>
                      <div className="space-y-2">
                        {service.benefits.map((benefit, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-600" />
                            <span className="text-gray-700">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* What to Bring */}
                  {service.requirements && service.requirements.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-lg mb-3">What to Bring</h3>
                      <div className="space-y-2">
                        {service.requirements.map((req, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                            <span className="text-gray-700">{req}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Booking */}
            <div className="space-y-6">
              <Card className="sticky top-24 bg-white/80 backdrop-blur-sm border-2 border-white/50 shadow-xl rounded-3xl">
                <CardHeader>
                  <CardTitle className="text-xl">Book This Service</CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Pricing */}
                  <div className="space-y-3">
                    {service.price_zar > 0 && (
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                        <div>
                          <p className="text-2xl font-bold text-gray-900">R{service.price_zar}</p>
                          <p className="text-sm text-gray-600">per session</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">ZAR</Badge>
                      </div>
                    )}
                    
                    {service.price_wellcoins > 0 && (
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl">
                        <div className="flex items-center gap-2">
                          <Coins className="h-5 w-5 text-orange-500" />
                          <div>
                            <p className="text-xl font-bold text-orange-600">{service.price_wellcoins} WellCoins</p>
                            <p className="text-sm text-gray-600">alternative payment</p>
                          </div>
                        </div>
                        <Badge className="bg-orange-100 text-orange-800">WC</Badge>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button 
                      onClick={handleBookNow}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Calendar className="h-5 w-5 mr-2" />
                      Book Now
                    </Button>

                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" className="rounded-xl">
                        <Heart className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button variant="outline" className="rounded-xl">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="p-4 bg-purple-50 rounded-xl">
                    <h4 className="font-semibold mb-2">Need Help?</h4>
                    <p className="text-sm text-gray-600 mb-3">Contact the provider directly</p>
                    <Button variant="outline" size="sm" className="w-full">
                      Send Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {showBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="max-w-md w-full m-4">
            <CardHeader>
              <CardTitle>Book {service.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Booking functionality will be implemented here.</p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowBooking(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1"
                  onClick={() => {
                    toast.success("Booking request sent!");
                    setShowBooking(false);
                  }}
                >
                  Confirm
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ServiceDetailFixed;