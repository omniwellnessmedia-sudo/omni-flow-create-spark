import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookingCalendar } from "@/components/booking/BookingCalendar";
import UnifiedNavigation from "@/components/navigation/UnifiedNavigation";
import Footer from "@/components/Footer";
import sandyMitchellData from "@/data/sandyMitchellProfile";
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Coins, 
  PiggyBank, 
  Star, 
  User,
  Globe,
  Heart,
  Share2,
  Phone,
  Mail,
  Award,
  CheckCircle,
  Shield,
  Zap,
  Flower2,
  Sparkles,
  Calendar,
  Users,
  Target,
  Leaf,
  Sun
} from "lucide-react";
import { toast } from "sonner";
import { IMAGES } from "@/lib/images";

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
  benefits?: string[];
  suitableFor?: string[];
  requirements?: string[];
  specialFeatures?: string[];
}

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      fetchService();
    }
  }, [id]);

  const fetchService = async () => {
    if (!serviceId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // First check if it's one of Sandy's services
      const sandyService = sandyMitchellData.services.find(service => service.id === serviceId);
      
      if (sandyService) {
        // Transform Sandy's service to match the expected format
        const transformedService: Service = {
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
          provider_profiles: {
            id: sandyMitchellData.profile.id,
            business_name: sandyMitchellData.profile.business_name,
            description: sandyMitchellData.profile.description,
            location: sandyMitchellData.profile.location,
            specialties: sandyMitchellData.profile.specialties,
            verified: sandyMitchellData.profile.verified
          },
          benefits: sandyService.benefits,
          suitableFor: sandyService.suitableFor,
          requirements: sandyService.requirements,
          specialFeatures: sandyService.specialFeatures
        };
        setService(transformedService);
        setLoading(false);
        return;
      }

      // If not Sandy's service, try database
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
        .eq('id', id)
        .eq('active', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          toast.error("Service not found");
          navigate('/wellness-exchange/marketplace');
        } else {
          throw error;
        }
        return;
      }
      
      setService(data);
    } catch (error: any) {
      console.error("Failed to fetch service:", error);
      toast.error("Failed to load service. Please try again.");
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

  // Enhanced loading state with better mobile responsiveness and modern design
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <UnifiedNavigation />
        <main className="pt-16 sm:pt-20 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-6">
              {/* Back button skeleton */}
              <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
                {/* Image skeleton */}
                <div className="space-y-4">
                  <div className="aspect-video bg-gray-200 rounded-2xl"></div>
                  <div className="flex gap-2">
                    <div className="w-16 h-16 bg-gray-200 rounded-xl"></div>
                    <div className="w-16 h-16 bg-gray-200 rounded-xl"></div>
                    <div className="w-16 h-16 bg-gray-200 rounded-xl"></div>
                  </div>
                </div>
                
                {/* Content skeleton */}
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                      <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
                    </div>
                    <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                  
                  {/* Booking card skeleton */}
                  <div className="bg-white/50 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-12 bg-gray-200 rounded-xl"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Enhanced error state with modern design
  if (!service) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <UnifiedNavigation />
        <main className="pt-16 sm:pt-20 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center">
                <Sparkles className="w-12 h-12 text-red-500" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Service Not Found</h1>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                The service you're looking for doesn't exist or may have been removed.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => navigate('/wellness-exchange/marketplace')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
                >
                  Browse All Services
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-xl font-semibold transition-all duration-200 hover:border-gray-400"
                >
                  Go Back
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const getServiceImage = (title: string, category: string, images?: string[], index: number = 0) => {
    if (images && images.length > index && !images[index].startsWith('blob:')) {
      return images[index];
    }

    // Enhanced fallback logic based on category and title
    const lowerTitle = title.toLowerCase();
    const lowerCategory = category.toLowerCase();

    if (lowerTitle.includes('yoga') || lowerCategory.includes('yoga') || lowerTitle.includes('pilates')) {
      return IMAGES.sandy.yoga;
    }
    if (lowerTitle.includes('meditation') || lowerCategory.includes('meditation') || lowerTitle.includes('breathing')) {
      return IMAGES.sandy.meditation;
    }
    if (lowerTitle.includes('healing') || lowerCategory.includes('healing') || lowerTitle.includes('energy')) {
      return IMAGES.sandy.teaching;
    }
    if (lowerTitle.includes('massage') || lowerCategory.includes('massage')) {
      return IMAGES.sandy.action1;
    }
    if (lowerTitle.includes('nutrition') || lowerCategory.includes('nutrition')) {
      return IMAGES.wellness.community;
    }

    return IMAGES.wellness.retreat;
  };

  const getCategoryIcon = (category: string) => {
    const lowerCategory = category.toLowerCase();
    if (lowerCategory.includes('yoga')) return Flower2;
    if (lowerCategory.includes('meditation')) return Sun;
    if (lowerCategory.includes('nutrition')) return Leaf;
    if (lowerCategory.includes('coaching')) return Target;
    if (lowerCategory.includes('energy') || lowerCategory.includes('healing')) return Zap;
    return Sparkles;
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
    toast.success(isLiked ? "Removed from favorites" : "Added to favorites");
  };

  const shareService = () => {
    if (navigator.share) {
      navigator.share({
        title: service?.title || 'Wellness Service',
        text: service?.description || 'Check out this wellness service',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const CategoryIcon = getCategoryIcon(service.category);
  const serviceImages = service.images && service.images.length > 0 ? service.images : [getServiceImage(service.title, service.category)];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <UnifiedNavigation />
      
      <main className="pt-16 sm:pt-20 pb-12">
        {/* Hero Section with Back Navigation */}
        <div className="px-4 sm:px-6 lg:px-8 mb-8">
          <div className="max-w-7xl mx-auto">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="mb-6 hover:bg-white/50 backdrop-blur-sm transition-all duration-200 group"
            >
              <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
              Back to Marketplace
            </Button>
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Left Column - Service Images and Details */}
              <div className="space-y-8">
                {/* Image Gallery */}
                <div className="space-y-4">
                  <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                    <img 
                      src={imageError ? getServiceImage(service.title, service.category, undefined, activeImageIndex) : getServiceImage(service.title, service.category, service.images, activeImageIndex)}
                      alt={service.title}
                      className="w-full h-full object-cover transition-all duration-500"
                      onError={handleImageError}
                    />
                  </div>
                  
                  {/* Image thumbnails */}
                  {serviceImages.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {serviceImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveImageIndex(index)}
                          className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                            index === activeImageIndex 
                              ? 'border-blue-500 shadow-lg scale-105' 
                              : 'border-gray-200 hover:border-gray-300 hover:scale-102'
                          }`}
                        >
                          <img 
                            src={getServiceImage(service.title, service.category, service.images, index)}
                            alt={`${service.title} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Service Header */}
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge 
                        variant="secondary" 
                        className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-0 font-medium px-3 py-1"
                      >
                        <CategoryIcon className="w-3 h-3 mr-1" />
                        {service.category}
                      </Badge>
                      {service.is_online && (
                        <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-0 font-medium px-3 py-1">
                          <Globe className="h-3 w-3 mr-1" />
                          Online Available
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleLike}
                        className={`rounded-full border-2 transition-all duration-200 ${
                          isLiked 
                            ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' 
                            : 'border-gray-200 text-gray-600 hover:border-red-200 hover:text-red-600'
                        }`}
                      >
                        <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={shareService}
                        className="rounded-full border-2 border-gray-200 text-gray-600 hover:border-blue-200 hover:text-blue-600 transition-all duration-200"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                      {service.title}
                    </h1>
                    
                    <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
                      <div className="flex items-center bg-white/50 backdrop-blur-sm px-3 py-2 rounded-full">
                        <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                        <span className="font-medium">{service.location}</span>
                      </div>
                      <div className="flex items-center bg-white/50 backdrop-blur-sm px-3 py-2 rounded-full">
                        <Clock className="h-4 w-4 mr-2 text-green-500" />
                        <span className="font-medium">{service.duration_minutes} min</span>
                      </div>
                    </div>

                    <p className="text-gray-700 text-lg leading-relaxed">{service.description}</p>
                  </div>
                </div>

                {/* Benefits & Features */}
                {(service.benefits || service.specialFeatures || service.suitableFor) && (
                  <div className="space-y-6">
                    {service.benefits && service.benefits.length > 0 && (
                      <div className="bg-white/50 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                        <h3 className="font-semibold text-lg mb-4 flex items-center">
                          <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                          Benefits
                        </h3>
                        <ul className="space-y-2">
                          {service.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-start">
                              <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                              <span className="text-gray-700">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {service.suitableFor && service.suitableFor.length > 0 && (
                      <div className="bg-white/50 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                        <h3 className="font-semibold text-lg mb-4 flex items-center">
                          <Users className="h-5 w-5 mr-2 text-blue-500" />
                          Perfect For
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {service.suitableFor.map((item, index) => (
                            <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Provider Info */}
                <Card className="glass-morphism border-white/20 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span>Your Wellness Provider</span>
                          {service.provider_profiles.verified && (
                            <Badge className="bg-gradient-to-r from-blue-100 to-green-100 text-blue-800 border-0">
                              <Shield className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <h3 className="font-semibold text-xl mb-2">{service.provider_profiles.business_name}</h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">{service.provider_profiles.description}</p>
                    
                    {service.provider_profiles.specialties && service.provider_profiles.specialties.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-3 text-gray-700">Specialties:</p>
                        <div className="flex flex-wrap gap-2">
                          {service.provider_profiles.specialties.map((specialty) => (
                            <Badge key={specialty} variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                              <Award className="h-3 w-3 mr-1" />
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Contact Options */}
                    <div className="mt-6 pt-6 border-t border-gray-100 flex gap-3">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Mail className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Booking Section */}
              <div className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
                {/* Pricing & Booking Card */}
                <Card className="glass-morphism-strong border-white/30 shadow-2xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Book This Service
                    </CardTitle>
                    <CardDescription className="text-base text-gray-600">
                      Transform your wellness journey today
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Pricing Display */}
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
                      <div className="text-center space-y-2">
                        <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Investment</p>
                        <div className="space-y-2">
                          {service.price_zar > 0 && (
                            <div className="flex items-center justify-center text-green-600">
                              <PiggyBank className="h-5 w-5 mr-2" />
                              <span className="font-bold text-2xl">R{service.price_zar}</span>
                            </div>
                          )}
                          {service.price_wellcoins > 0 && (
                            <div className="flex items-center justify-center text-orange-600">
                              <Coins className="h-5 w-5 mr-2" />
                              <span className="font-bold text-xl">{service.price_wellcoins} WellCoins</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Requirements */}
                    {service.requirements && service.requirements.length > 0 && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
                        <h4 className="font-medium text-yellow-800 mb-2 flex items-center">
                          <Star className="h-4 w-4 mr-2" />
                          What to bring
                        </h4>
                        <ul className="text-sm text-yellow-700 space-y-1">
                          {service.requirements.map((req, index) => (
                            <li key={index} className="flex items-start">
                              <span className="mr-2">•</span>
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Booking Button */}
                    <div className="space-y-4">
                      {user ? (
                        <Button 
                          onClick={() => setShowBooking(true)}
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                          size="lg"
                        >
                          <Calendar className="h-5 w-5 mr-2" />
                          Book This Service
                        </Button>
                      ) : (
                        <Button 
                          onClick={() => navigate('/auth')}
                          className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                          size="lg"
                        >
                          <User className="h-5 w-5 mr-2" />
                          Sign In to Book
                        </Button>
                      )}
                      
                      <p className="text-xs text-gray-500 text-center">
                        Secure booking • Instant confirmation • 24/7 support
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Booking Calendar */}
                {showBooking && user && (
                  <div className="glass-morphism border-white/20 rounded-2xl p-6 shadow-xl">
                    <BookingCalendar
                      serviceTitle={service.title}
                      duration={service.duration_minutes}
                      price_zar={service.price_zar}
                      price_wellcoins={service.price_wellcoins}
                      onBookingSelect={handleBookingSelect}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ServiceDetail;