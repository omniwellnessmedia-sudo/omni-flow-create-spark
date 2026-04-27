
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import UnifiedNavigation from "@/components/navigation/UnifiedNavigation";
import Footer from "@/components/Footer";
import { Section } from "@/components/ui/section";
import { TwoBeWellCTA } from "@/components/sections/TwoBeWellCTA";
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  Coins, 
  Clock,
  Eye,
  Heart,
  Plus,
  PiggyBank
} from "lucide-react";

// Import service images from centralized IMAGES library
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
    specialties: string[];
  };
}

const WellnessMarketplace = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [wellCoinBalance, setWellCoinBalance] = useState(0);

  const categories = [
    "Yoga", "Meditation", "Nutrition Counseling", "Massage Therapy", "Acupuncture",
    "Life Coaching", "Personal Training", "Reiki", "Aromatherapy", "Herbalism",
    "Breathwork", "Sound Healing", "Crystal Healing", "Energy Healing", "Pilates"
  ];

  useEffect(() => {
    fetchServices();
    if (user) {
      fetchWellCoinBalance();
    }
  }, [user]);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select(`
          id,
          title,
          description,
          category,
          price_zar,
          price_wellcoins,
          duration_minutes,
          location,
          is_online,
          images,
          provider_profiles (
            id,
            business_name,
            specialties
          )
        `)
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Services fetch error:", error);
        throw error;
      }
      
      console.log("Fetched services:", data);
      setServices(data || []);
    } catch (error: any) {
      console.error("Failed to load services:", error);
      toast.error("Failed to load services: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchWellCoinBalance = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('consumer_profiles')
        .select('wellcoin_balance')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setWellCoinBalance(data?.wellcoin_balance || 0);
    } catch (error: any) {
      console.error("Failed to fetch WellCoin balance:", error);
    }
  };

  // Use only real services from database - deduplicate by ID
  const displayServices = Array.from(
    new Map(services.map(s => [s.id, s])).values()
  );

  // Helper function to get valid service image (filters out blob URLs)
  const getValidServiceImage = (images: string[] | null) => {
    // Filter out blob URLs and invalid URLs
    if (images && images.length > 0) {
      const validImage = images.find(img =>
        img &&
        typeof img === 'string' &&
        !img.startsWith('blob:') &&
        !img.includes('lovable.app') &&
        !img.includes('placeholder') &&
        (img.startsWith('/') || img.startsWith('http'))
      );
      if (validImage) {
        console.log('✓ Using service-provided image:', validImage);
        return validImage;
      }
    }
    console.log('→ No valid images in array, using fallback');
    return null;
  };

  // Helper function to get service image fallback with variety
  const getServiceImage = (title: string, category: string, serviceId?: string, providerId?: string) => {
    const lowerTitle = title.toLowerCase();
    console.log(`🎨 Getting image for: "${title}" (${category})`);

    // Check if this is Sandy's service and use her actual photos
    if (providerId === 'ec7887f9-e0bc-494d-afd6-3779f85021ff') {
      console.log('  → Sandy\'s service - using professional photos');
      const sandyImages = [
        IMAGES.sandy.yoga,
        IMAGES.sandy.outdoor,
        IMAGES.sandy.meditation,
        IMAGES.sandy.wellness,
        IMAGES.sandy.consultation
      ];
      // Use service ID hash to distribute images
      const hash = serviceId ? serviceId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0;
      return sandyImages[hash % sandyImages.length];
    }

    // Title-based matching (most specific)
    if (lowerTitle.includes('yoga')) {
      console.log('  → Matched title: yoga');
      return IMAGES.sandy.yoga;
    }
    if (lowerTitle.includes('pilates')) return IMAGES.sandy.teaching;
    if (lowerTitle.includes('qigong')) return IMAGES.sandy.meditation;
    if (lowerTitle.includes('meditation')) return IMAGES.sandy.meditation;
    if (lowerTitle.includes('breath')) return IMAGES.sandy.portrait1;
    if (lowerTitle.includes('cave') || lowerTitle.includes('indigenous')) return IMAGES.wellness.landmark;
    if (lowerTitle.includes('mountain') || lowerTitle.includes('hiking')) return IMAGES.tours.mountain;
    if (lowerTitle.includes('surf') || lowerTitle.includes('beach')) return IMAGES.wellness.beachLions;
    if (lowerTitle.includes('healing')) return IMAGES.wellness.retreat;
    if (lowerTitle.includes('retreat')) return IMAGES.wellness.retreat2;
    if (lowerTitle.includes('massage')) return IMAGES.sandy.nature;
    if (lowerTitle.includes('coaching') || lowerTitle.includes('counseling')) return IMAGES.sandy.teaching;

    // Category-based fallback (more variety)
    console.log('  → No title match, trying category match...');
    if (category === 'Yoga') {
      console.log('  → Matched category: Yoga');
      return IMAGES.sandy.yoga;
    }
    if (category === 'Pilates') return IMAGES.sandy.teaching;
    if (category === 'Meditation') return IMAGES.sandy.meditation;
    if (category === 'QiGong' || category === 'Breathwork') return IMAGES.sandy.portrait2;
    if (category === 'Personal Training') return IMAGES.tours.hiking;
    if (category === 'Fitness') return IMAGES.wellness.beachLions2;
    if (category === 'Life Coaching') return IMAGES.sandy.teaching;
    if (category === 'Health Coaching') return IMAGES.sandy.portrait1;
    if (category === 'Massage Therapy') return IMAGES.sandy.nature;
    if (category === 'Wellness Products') return IMAGES.wellness.wellness;
    if (category === 'Nutrition Counseling') return IMAGES.wellness.marketplace;
    if (category === 'Acupuncture') return IMAGES.sandy.closeup;
    if (category === 'Reiki' || category === 'Energy Healing') return IMAGES.sandy.meditation;
    if (category === 'Aromatherapy') return IMAGES.wellness.wellness;
    if (category === 'Herbalism') return IMAGES.wellness.communityProject1;
    if (category === 'Sound Healing') return IMAGES.sandy.portrait3;
    if (category === 'Crystal Healing') return IMAGES.sandy.action1;

    // Final fallback - rotate through different images to add variety
    console.log('  → No category match, using hash-based rotation');
    // Use serviceId for better distribution if available, otherwise use title + category
    const hashString = serviceId || (title + category);
    const hash = hashString.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const fallbacks = [
      IMAGES.sandy.yoga,
      IMAGES.sandy.meditation,
      IMAGES.sandy.teaching,
      IMAGES.sandy.nature,
      IMAGES.sandy.portrait1,
      IMAGES.sandy.portrait2,
      IMAGES.sandy.action1,
      IMAGES.sandy.closeup,
      IMAGES.wellness.retreat,
      IMAGES.wellness.retreat2,
      IMAGES.wellness.wellness,
      IMAGES.wellness.beachLions
    ];
    const selectedImage = fallbacks[hash % fallbacks.length];
    console.log(`  → Selected fallback image #${hash % fallbacks.length} from ${fallbacks.length} options`);
    return selectedImage;
  };

  const filteredServices = displayServices.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.provider_profiles?.business_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || service.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleBookService = async (serviceId: string, priceZar: number, priceWellcoins: number) => {
    if (!user) {
      toast.error("Please sign in to book services");
      return;
    }
    
    // Navigate to service detail page
    navigate(`/wellness-exchange/service/${serviceId}`);
  };

  const handleViewService = (serviceId: string) => {
    navigate(`/wellness-exchange/service/${serviceId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UnifiedNavigation />
        <div className="pt-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="animate-pulse space-y-4">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="h-48 bg-gray-200" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedNavigation />
      
      <Section size="large" background="white" id="hero">
        <div className="py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="heading-secondary text-gradient-hero no-faded-text text-center">
                  Wellness <span className="text-primary">Marketplace</span>
                </h1>
                <p className="text-gray-600 mt-1">Discover and book wellness services</p>
              </div>
              
              {/* WellCoin Balance - Only show for authenticated users */}
              {user && (
                <Card className="p-3 bg-gradient-to-r from-omni-orange/10 to-omni-yellow/10">
                  <div className="flex items-center">
                    <Coins className="h-5 w-5 text-primary mr-2" />
                    <div>
                      <p className="text-xs text-gray-600">Your Balance</p>
                      <p className="font-bold text-primary">{wellCoinBalance} WC</p>
                    </div>
                  </div>
                </Card>
              )}
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search services, providers, or specialties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 7-Day Trial Promotion Banner */}
          <Card className="mb-8 bg-gradient-to-r from-omni-blue/10 via-omni-purple/10 to-omni-pink/10 border-omni-blue/20">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="text-center md:text-left mb-4 md:mb-0">
                  <h3 className="font-bold text-xl mb-2">
                    🎯 Welcome to Our <span className="text-primary">Wellness Marketplace</span>
                  </h3>
                  <p className="text-gray-600 max-w-2xl">
                    Discover verified wellness practitioners and holistic services designed to support your journey to optimal health and consciousness.
                  </p>
                </div>
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-3 whitespace-nowrap"
                  onClick={() => navigate('/wellness-exchange/provider-signup')}
                >
                  Become a Partner
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <Button 
              variant="outline"
              className="h-16 flex-col"
              onClick={() => navigate('/wellness-exchange/provider-signup')}
            >
              <Plus className="h-5 w-5 mb-1" />
              <span className="text-xs">Become Partner</span>
            </Button>
            <Button 
              variant="outline"
              className="h-16 flex-col"
              onClick={() => navigate('/wellness-exchange/wants')}
            >
              <Heart className="h-5 w-5 mb-1" />
              <span className="text-xs">Browse Wants</span>
            </Button>
            <Button 
              variant="outline"
              className="h-16 flex-col"
              onClick={() => navigate('/wellness-exchange/directory')}
            >
              <Search className="h-5 w-5 mb-1" />
              <span className="text-xs">Find Partners</span>
            </Button>
            <Button 
              variant="outline"
              className="h-16 flex-col"
              onClick={() => navigate('/wellness-exchange/community')}
            >
              <Coins className="h-5 w-5 mb-1" />
              <span className="text-xs">Community</span>
            </Button>
          </div>

          {/* Services Grid */}
          {services.length === 0 ? (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-omni-blue/20 to-omni-purple/20 rounded-full flex items-center justify-center">
                  <Plus className="h-12 w-12 text-primary" />
                </div>
                <h3 className="font-bold text-xl mb-4">Welcome to the Wellness Marketplace!</h3>
                <p className="text-gray-600 mb-8">
                  This is where wellness providers will showcase their services. Ready to join our community of conscious practitioners?
                </p>
                <div className="space-y-3">
                  <Button 
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-white w-full"
                    onClick={() => navigate('/wellness-exchange/provider-signup')}
                  >
                    Become a Wellness Partner
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="w-full"
                    onClick={() => navigate('/wellness-exchange/wants')}
                  >
                    Browse Community Wants
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="grid-marketplace">
                {filteredServices.map((service) => (
                <Card key={service.id} className="card-service hover:shadow-lg transition-shadow animate-fade-in overflow-hidden">
                    {/* Service Image */}
                    <div
                      className="overflow-hidden cursor-pointer"
                      onClick={() => handleViewService(service.id)}
                    >
                      <img
                        src={getValidServiceImage(service.images) || getServiceImage(service.title, service.category, service.id, service.provider_profiles?.id)}
                        alt={service.title}
                        className="img-card hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = getServiceImage(service.title, service.category, service.id, service.provider_profiles?.id);
                        }}
                      />
                    </div>
                    
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start">
                        <Badge variant="secondary" className="mb-2">
                          {service.category}
                        </Badge>
                        {service.is_online && (
                          <Badge className="bg-green-100 text-green-800">Online</Badge>
                        )}
                      </div>
                      <CardTitle
                        className="text-lg leading-tight cursor-pointer hover:text-primary transition-colors"
                        onClick={() => handleViewService(service.id)}
                      >
                        {service.title}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        by {service.provider_profiles?.business_name || 'Wellness Provider'}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {service.description}
                      </p>
                      
                      <div className="space-y-3">
                        {/* Location and Duration */}
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span className="flex-1">{service.location}</span>
                          {service.duration_minutes && (
                            <>
                              <Clock className="h-4 w-4 ml-4 mr-1" />
                              <span>{service.duration_minutes}min</span>
                            </>
                          )}
                        </div>
                        
                        {/* Pricing */}
                        <div className="flex items-center justify-between">
                          <div className="space-y-1 min-w-0 flex-1 pr-3">
                            {service.price_zar > 0 && (
                              <div className="flex items-center text-green-600">
                                <PiggyBank className="h-4 w-4 mr-1 flex-shrink-0" />
                                <span className="font-medium text-sm sm:text-base">R{service.price_zar}</span>
                              </div>
                            )}
                            {service.price_wellcoins > 0 && (
                              <div className="flex items-center text-primary">
                                <Coins className="h-4 w-4 mr-1 flex-shrink-0" />
                                <span className="font-medium text-sm sm:text-base">{service.price_wellcoins} WC</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleViewService(service.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm"
                              className="bg-primary hover:bg-primary/90 text-white"
                              onClick={() => handleBookService(
                                service.id, 
                                service.price_zar, 
                                service.price_wellcoins
                              )}
                            >
                              Book Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredServices.length === 0 && services.length > 0 && (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="font-medium text-lg mb-2">No services found</h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your search criteria or browse all categories
                  </p>
                  <Button onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                  }}>
                    Clear Filters
                  </Button>
                </div>
              )}
            </>
          )}

          {/* 2BeWell CTA */}
          {services.length > 0 && (
            <div className="mt-16">
              <TwoBeWellCTA />
            </div>
          )}
        </div>
      </Section>
      <Footer />
    </div>
  );
};

export default WellnessMarketplace;
