import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Footer from "@/components/Footer";
import { 
  Search, Filter, MapPin, Clock, Coins, Star, Globe, Calendar, 
  ShoppingBag, Sparkles, Mountain, Gift, Users, ArrowRight,
  Heart, Share2, Eye
} from "lucide-react";
import { toast } from "sonner";
import sandyMitchellData from "@/data/sandyMitchellProfile";
import { IMAGES, getImageWithFallback, getSandyImage } from "@/lib/images";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import type { WellnessMarketplaceItem } from "@/types/marketplace";

const UnifiedMarketplace = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [activeTab, setActiveTab] = useState(searchParams.get('type') || 'all');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [items, setItems] = useState<WellnessMarketplaceItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<WellnessMarketplaceItem[]>([]);

  // Convert Sandy's services to unified format
  const convertToUnifiedFormat = () => {
    const unifiedItems: WellnessMarketplaceItem[] = sandyMitchellData.services.map(service => ({
      ...service,
      content_type: 'service' as const,
      provider_id: sandyMitchellData.profile.id,
      provider_name: sandyMitchellData.profile.business_name,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      rating: 4.9,
      review_count: 47,
      tags: service.category ? [service.category.toLowerCase()] : [],
      benefits: service.benefits || [],
      requirements: service.requirements || [],
      suitable_for: service.suitableFor || [],
      booking_type: 'appointment' as const,
      max_participants: 1,
      cancellation_policy: '24 hours notice required'
    }));

    // Add sample products for 2BeWell
    const sampleProducts: WellnessMarketplaceItem[] = [
      {
        id: 'wellness-journal-deluxe',
        content_type: 'product',
        title: 'Mindful Wellness Journal - Deluxe Edition',
        description: 'Premium guided journal for tracking wellness journey with daily prompts',
        provider_id: '2bewell-official',
        provider_name: '2BeWell Wellness Store',
        category: 'Wellness Tools',
        images: [IMAGES.products.wellness],
        location: 'South Africa',
        is_online: true,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        rating: 4.7,
        review_count: 234,
        tags: ['journal', 'mindfulness', 'wellness'],
        price_zar: 299,
        price_wellcoins: 250,
        product_type: 'physical',
        stock_quantity: 150,
        is_unlimited_stock: false,
        shipping_required: true,
        product_specifications: {
          pages: 365,
          material: 'Eco-friendly recycled paper',
          dimensions: '15cm x 21cm',
          weight: '350g'
        },
        variants: []
      }
    ];

    // Add sample experiences for tours/retreats
    const sampleExperiences: WellnessMarketplaceItem[] = [
      {
        id: 'table-mountain-wellness-retreat',
        content_type: 'experience',
        title: 'Table Mountain Wellness Retreat',
        description: '3-day transformative wellness experience with yoga, meditation, and nature connection',
        provider_id: 'mountain-wellness-co',
        provider_name: 'Mountain Wellness Co',
        category: 'Retreats',
        images: [IMAGES.tours.mountain],
        location: 'Table Mountain, Cape Town',
        is_online: false,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        rating: 4.8,
        review_count: 67,
        tags: ['retreat', 'mountains', 'yoga'],
        price_zar: 2499,
        price_wellcoins: 2000,
        experience_type: 'retreat',
        start_date: '2025-01-15',
        end_date: '2025-01-17',
        duration_days: 3,
        max_participants: 12,
        current_participants: 7,
        includes: ['Accommodation', 'All meals', 'Yoga classes', 'Guided hikes'],
        accommodation_included: true,
        meals_included: true,
        transport_included: false,
        difficulty_level: 'all_levels'
      }
    ];

    return [...unifiedItems, ...sampleProducts, ...sampleExperiences];
  };

  useEffect(() => {
    setLoading(true);
    const unified = convertToUnifiedFormat();
    setItems(unified);
    setFilteredItems(unified);
    setLoading(false);
    toast.success(`Loaded ${unified.length} wellness offerings`);
  }, []);

  useEffect(() => {
    let filtered = items;

    // Filter by content type
    if (activeTab !== 'all') {
      filtered = filtered.filter(item => item.content_type === activeTab);
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category.toLowerCase().includes(selectedCategory.toLowerCase()));
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredItems(filtered);
  }, [items, activeTab, selectedCategory, searchTerm]);

  const handleItemClick = (item: WellnessMarketplaceItem) => {
    // Navigate based on content type
    switch (item.content_type) {
      case 'service':
        navigate(`/wellness-exchange/service/${item.id}`);
        break;
      case 'product':
        navigate(`/product/${item.id}`);
        break;
      case 'experience':
        navigate(`/experience/${item.id}`);
        break;
      default:
        navigate(`/item/${item.id}`);
    }
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'service': return <Calendar className="h-4 w-4" />;
      case 'product': return <ShoppingBag className="h-4 w-4" />;
      case 'experience': return <Mountain className="h-4 w-4" />;
      case 'deal': return <Gift className="h-4 w-4" />;
      default: return <Sparkles className="h-4 w-4" />;
    }
  };

  const getContentTypeColor = (type: string) => {
    switch (type) {
      case 'service': return 'bg-blue-100 text-blue-800';
      case 'product': return 'bg-green-100 text-green-800';
      case 'experience': return 'bg-purple-100 text-purple-800';
      case 'deal': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const categories = [...new Set(items.map(item => item.category))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Ambient Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-60 right-20 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-teal-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-purple-200/50 rounded-full px-4 py-2 mb-6">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-800">Unified Wellness Marketplace</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
                Everything Wellness
              </span>
              <br />
              <span className="text-gray-800">In One Place</span>
            </h1>
            
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover services, products, experiences, and exclusive deals from verified wellness practitioners across South Africa.
            </p>
          </div>

          {/* Featured Provider - Sandy Mitchell */}
          <div className="mb-12">
            <Card className="bg-gradient-to-r from-purple-50 via-blue-50 to-teal-50 border-2 border-purple-200/50 shadow-xl">
              <CardContent className="p-8">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-purple-600 text-white">Featured Provider</Badge>
                      <Badge variant="outline" className="border-purple-300">
                        <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                        4.9 Rating
                      </Badge>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">Sandy Mitchell</h2>
                    <p className="text-lg text-purple-600 font-semibold">Dru Yoga & Wellness Specialist</p>
                    <p className="text-gray-600">
                      Experience transformative wellness with Sandy's gentle yet powerful Dru Yoga practices. 
                      15+ years of expertise in holistic wellness and conscious movement.
                    </p>
                    <div className="flex gap-3">
                      <Button 
                        onClick={() => navigate('/provider/sandy-mitchell')}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        <Users className="h-4 w-4 mr-2" />
                        View Profile
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setSearchTerm('sandy mitchell')}
                        className="border-purple-300"
                      >
                        <Search className="h-4 w-4 mr-2" />
                        View Services
                      </Button>
                    </div>
                  </div>
                  <div className="relative">
                    <img 
                      src={getSandyImage('profile').src}
                      alt="Sandy Mitchell - Dru Yoga Specialist"
                      className="w-full h-64 object-cover rounded-2xl shadow-lg"
                    />
                    <div className="absolute -bottom-4 -right-4 bg-purple-600 text-white p-3 rounded-xl shadow-lg">
                      <div className="text-center">
                        <div className="text-lg font-bold">127+</div>
                        <div className="text-xs">Happy Clients</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search wellness offerings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="md:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">All ({items.length})</TabsTrigger>
                <TabsTrigger value="service">Services ({items.filter(i => i.content_type === 'service').length})</TabsTrigger>
                <TabsTrigger value="product">Products ({items.filter(i => i.content_type === 'product').length})</TabsTrigger>
                <TabsTrigger value="experience">Experiences ({items.filter(i => i.content_type === 'experience').length})</TabsTrigger>
                <TabsTrigger value="deal">Deals ({items.filter(i => i.content_type === 'deal').length})</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <Card key={item.id} className="bg-white/80 backdrop-blur-sm border-2 border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                <div className="aspect-video relative overflow-hidden rounded-t-xl">
                  <img 
                    src={item.images[0] || IMAGES.wellness.marketplace}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = IMAGES.wellness.marketplace;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  
                  {/* Content Type Badge */}
                  <div className="absolute top-3 left-3">
                    <Badge className={`${getContentTypeColor(item.content_type)} border-0 flex items-center gap-1`}>
                      {getContentTypeIcon(item.content_type)}
                      {item.content_type}
                    </Badge>
                  </div>

                  {/* Online/Location Badge */}
                  <div className="absolute top-3 right-3">
                    {item.is_online && (
                      <Badge className="bg-green-500/90 text-white">
                        <Globe className="h-3 w-3 mr-1" />
                        Online
                      </Badge>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/50 px-2 py-1 rounded-full">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-white text-xs font-medium">{item.rating}</span>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg font-bold line-clamp-2 group-hover:text-purple-600 transition-colors">
                      {item.title}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-sm text-purple-600 font-medium">
                    {item.provider_name}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span className="truncate">{item.location}</span>
                    </div>
                    {'duration_minutes' in item && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{item.duration_minutes}min</span>
                      </div>
                    )}
                  </div>

                  {/* Pricing */}
                  <div className="space-y-2">
                    {'price_zar' in item && item.price_zar > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-lg text-gray-900">R{item.price_zar}</span>
                        <span className="text-sm text-gray-500">ZAR</span>
                      </div>
                    )}
                    {'price_wellcoins' in item && item.price_wellcoins > 0 && (
                      <div className="flex items-center justify-between text-orange-600">
                        <div className="flex items-center gap-1">
                          <Coins className="h-4 w-4" />
                          <span className="font-bold">{item.price_wellcoins} WellCoins</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-1"
                        onClick={() => handleItemClick(item)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm" className="px-3">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="px-3">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {/* Add to Cart Button for Products */}
                    {item.content_type === 'product' && 'price_zar' in item && (
                      <AddToCartButton 
                        item={{
                          id: item.id,
                          title: item.title,
                          price: item.price_zar,
                          wellcoinPrice: 'price_wellcoins' in item ? item.price_wellcoins : 0,
                          image: item.images[0] || IMAGES.wellness.marketplace,
                          category: item.category,
                          provider: item.provider_name,
                          location: item.location
                        }}
                        variant="default"
                        size="sm"
                        className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white"
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No results found</h3>
              <p className="text-gray-500">Try adjusting your search terms or filters</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UnifiedMarketplace;