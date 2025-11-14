import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import UnifiedNavigation from "@/components/navigation/UnifiedNavigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Footer from "@/components/Footer";
import { 
  Search, Filter, MapPin, Clock, Coins, Star, Globe, Calendar, 
  ShoppingBag, Sparkles, Gift, Users, ArrowRight, Heart, Share2, 
  Eye, Timer, Zap, Package, TrendingUp, AlertCircle, CheckCircle,
  Percent, Tag, Flame, Crown
} from "lucide-react";
import { toast } from "sonner";
import { IMAGES, getImageWithFallback } from "@/lib/images";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import type { WellnessDeal, WellnessMarketplaceItem } from "@/types/marketplace";
import { TwoBeWellCTA } from "@/components/sections/TwoBeWellCTA";
import { Skeleton } from "@/components/ui/skeleton";

// Enhanced deal data with comprehensive e-commerce features
const sampleDeals: WellnessDeal[] = [
  {
    id: 'flash-yoga-bundle',
    content_type: 'deal',
    title: 'Flash Sale: 10 Yoga Classes Bundle',
    description: 'Limited time offer - Save 40% on Sandy Mitchell\'s popular Dru Yoga classes',
    longDescription: 'Experience the gentle, flowing movements of Dru Yoga with this exclusive bundle. Perfect for beginners and experienced practitioners alike. Includes access to both in-person and online classes.',
    provider_id: 'sandy-mitchell-dru-yoga',
    provider_name: 'Sandy Mitchell - Dru Yoga Cape Town',
    category: 'Yoga',
    subcategory: 'Class Packages',
    images: [
      IMAGES.tours.mountain,
      IMAGES.wellness.yoga
    ],
    location: 'Cape Town, South Africa',
    is_online: true,
    is_active: true,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    rating: 4.9,
    review_count: 47,
    tags: ['yoga', 'bundle', 'beginner-friendly', 'dru-yoga'],
    original_price_zar: 1500,
    deal_price_zar: 899,
    original_price_wellcoins: 1200,
    deal_price_wellcoins: 720,
    discount_percentage: 40,
    deal_type: 'flash_sale',
    valid_from: new Date().toISOString(),
    valid_until: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days
    quantity_available: 25,
    quantity_claimed: 12,
    terms_conditions: [
      'Valid for 6 months from purchase date',
      'Classes can be booked online or in-person',
      'Non-transferable and non-refundable',
      '24-hour cancellation policy applies'
    ],
    related_content_ids: ['dru-yoga-beginner', 'breath-work-session']
  },
  {
    id: 'wellness-retreat-early-bird',
    content_type: 'deal',
    title: 'Early Bird: Table Mountain Wellness Retreat',
    description: 'Book now and save 30% on our transformative 3-day wellness experience',
    longDescription: 'Join us for an unforgettable journey of self-discovery and wellness in the heart of Cape Town. This retreat combines yoga, meditation, nature connection, and nourishing meals.',
    provider_id: 'mountain-wellness-co',
    provider_name: 'Mountain Wellness Co',
    category: 'Retreats',
    subcategory: 'Weekend Retreats',
    images: [
      IMAGES.tours.mountain,
      IMAGES.wellness.meditation
    ],
    location: 'Table Mountain, Cape Town',
    is_online: false,
    is_active: true,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    rating: 4.8,
    review_count: 67,
    tags: ['retreat', 'mountains', 'yoga', 'meditation', 'nature'],
    original_price_zar: 3500,
    deal_price_zar: 2450,
    original_price_wellcoins: 2800,
    deal_price_wellcoins: 1960,
    discount_percentage: 30,
    deal_type: 'early_bird',
    valid_from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    quantity_available: 12,
    quantity_claimed: 7,
    terms_conditions: [
      'Early bird pricing valid until 30 days before retreat',
      'Includes accommodation, all meals, and activities',
      'Minimum fitness level required for hiking activities',
      'Cancellation policy: 50% refund up to 14 days before'
    ],
    related_content_ids: ['table-mountain-wellness-retreat']
  },
  {
    id: 'wellness-product-bundle',
    content_type: 'deal',
    title: 'Ultimate Wellness Starter Kit',
    description: 'Everything you need to start your wellness journey - Journal, essential oils, and meditation cushion',
    longDescription: 'Perfect for beginners or as a thoughtful gift. This curated collection includes our bestselling wellness journal, premium essential oil blend, organic meditation cushion, and exclusive access to online guided meditations.',
    provider_id: '2bewell-official',
    provider_name: '2BeWell Wellness Store',
    category: 'Wellness Products',
    subcategory: 'Starter Kits',
    images: [
      IMAGES.products.wellness,
      IMAGES.wellness.marketplace
    ],
    location: 'South Africa (Nationwide Shipping)',
    is_online: true,
    is_active: true,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    rating: 4.7,
    review_count: 156,
    tags: ['bundle', 'beginner', 'meditation', 'journal', 'essential-oils'],
    original_price_zar: 850,
    deal_price_zar: 599,
    original_price_wellcoins: 680,
    deal_price_wellcoins: 479,
    discount_percentage: 29,
    deal_type: 'bundle',
    valid_from: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    valid_until: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days
    quantity_available: 50,
    quantity_claimed: 23,
    terms_conditions: [
      'Free shipping within South Africa',
      'Individual items cannot be returned separately',
      '30-day money-back guarantee',
      'Digital content access valid for 1 year'
    ],
    related_content_ids: ['wellness-journal-deluxe', 'meditation-cushion', 'essential-oil-blend']
  },
  {
    id: 'loyalty-member-exclusive',
    content_type: 'deal',
    title: 'VIP Member Exclusive: Holistic Health Package',
    description: 'Premium wellness package combining nutrition consultation, energy healing, and personalized yoga sessions',
    longDescription: 'Exclusive to our VIP members - a comprehensive 3-month wellness transformation program. Includes one-on-one sessions with certified practitioners and ongoing support.',
    provider_id: 'omni-wellness-collective',
    provider_name: 'Omni Wellness Collective',
    category: 'Health & Healing',
    subcategory: 'Comprehensive Programs',
    images: [
      IMAGES.wellness.community,
      IMAGES.business.consulting
    ],
    location: 'Cape Town & Online',
    is_online: true,
    is_active: true,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    rating: 4.9,
    review_count: 89,
    tags: ['vip', 'exclusive', 'nutrition', 'energy-healing', 'yoga'],
    original_price_zar: 4500,
    deal_price_zar: 3150,
    original_price_wellcoins: 3600,
    deal_price_wellcoins: 2520,
    discount_percentage: 30,
    deal_type: 'loyalty',
    valid_from: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    valid_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    quantity_available: 10,
    quantity_claimed: 4,
    terms_conditions: [
      'Available to VIP members only',
      'Program must be completed within 6 months',
      'Includes weekly check-ins and progress tracking',
      'Money-back guarantee if not satisfied after first month'
    ],
    related_content_ids: ['nutrition-consultation', 'energy-healing-session', 'personalized-yoga']
  },
  {
    id: 'seasonal-summer-special',
    content_type: 'deal',
    title: 'Summer Solstice Special: Beach Yoga & Meditation',
    description: 'Celebrate summer with outdoor yoga sessions and sunrise meditation on the beach',
    longDescription: 'Welcome the summer season with our special outdoor program. Join us for revitalizing beach yoga sessions and peaceful sunrise meditations. Perfect for connecting with nature and fellow wellness enthusiasts.',
    provider_id: 'coastal-wellness-collective',
    provider_name: 'Coastal Wellness Collective',
    category: 'Yoga',
    subcategory: 'Outdoor Classes',
    images: [
      IMAGES.tours.capeTown,
      IMAGES.wellness.yoga
    ],
    location: 'Camps Bay Beach, Cape Town',
    is_online: false,
    is_active: true,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    rating: 4.6,
    review_count: 134,
    tags: ['seasonal', 'beach', 'yoga', 'meditation', 'outdoor'],
    original_price_zar: 1200,
    deal_price_zar: 840,
    original_price_wellcoins: 960,
    deal_price_wellcoins: 672,
    discount_percentage: 30,
    deal_type: 'seasonal',
    valid_from: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    valid_until: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(), // 21 days
    quantity_available: 30,
    quantity_claimed: 18,
    terms_conditions: [
      'Weather dependent - indoor alternative available',
      'Bring your own yoga mat and water',
      'Package includes 5 sessions over 2 weeks',
      'Sunrise sessions start at 6:30 AM'
    ],
    related_content_ids: ['beach-yoga-session', 'sunrise-meditation']
  }
];

const WellnessDeals = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedDealType, setSelectedDealType] = useState(searchParams.get('type') || 'all');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [sortBy, setSortBy] = useState('ending_soon');
  const [deals, setDeals] = useState<WellnessDeal[]>(sampleDeals);

  // Initialize deals and simulate loading
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setDeals(sampleDeals);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Real-time countdown logic
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate time remaining for deals
  const getTimeRemaining = (validUntil: string) => {
    const endTime = new Date(validUntil);
    const now = currentTime;
    const diff = endTime.getTime() - now.getTime();
    
    if (diff <= 0) return null;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return { days, hours, minutes, seconds };
  };

  // Filter and sort deals
  const filteredDeals = useMemo(() => {
    let filtered = deals.filter(deal => deal.is_active);
    
    // Filter by deal type
    if (selectedDealType !== 'all') {
      filtered = filtered.filter(deal => deal.deal_type === selectedDealType);
    }
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(deal => deal.category.toLowerCase().includes(selectedCategory.toLowerCase()));
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(deal =>
        deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.provider_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Sort deals
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'ending_soon':
          return new Date(a.valid_until).getTime() - new Date(b.valid_until).getTime();
        case 'discount_high':
          return b.discount_percentage - a.discount_percentage;
        case 'price_low':
          return a.deal_price_zar - b.deal_price_zar;
        case 'rating':
          return b.rating - a.rating;
        case 'popularity':
          return b.quantity_claimed - a.quantity_claimed;
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });
    
    return filtered;
  }, [deals, selectedDealType, selectedCategory, searchTerm, sortBy]);

  useEffect(() => {
    setLoading(false);
    toast.success(`Loaded ${deals.length} exclusive wellness deals`);
  }, [deals]);

  const handleDealClick = (deal: WellnessDeal) => {
    navigate(`/deal/${deal.id}`, { state: { deal } });
  };

  const getDealTypeIcon = (type: string) => {
    switch (type) {
      case 'flash_sale': return <Zap className="h-4 w-4" />;
      case 'bundle': return <Package className="h-4 w-4" />;
      case 'early_bird': return <Clock className="h-4 w-4" />;
      case 'loyalty': return <Crown className="h-4 w-4" />;
      case 'seasonal': return <Sparkles className="h-4 w-4" />;
      default: return <Gift className="h-4 w-4" />;
    }
  };

  const getDealTypeColor = (type: string) => {
    switch (type) {
      case 'flash_sale': return 'bg-red-500 text-white animate-pulse';
      case 'bundle': return 'bg-green-500 text-white';
      case 'early_bird': return 'bg-blue-500 text-white';
      case 'loyalty': return 'bg-purple-500 text-white';
      case 'seasonal': return 'bg-orange-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getAvailabilityStatus = (deal: WellnessDeal) => {
    const remaining = deal.quantity_available ? deal.quantity_available - deal.quantity_claimed : null;
    if (!remaining) return null;
    
    const percentage = (remaining / deal.quantity_available!) * 100;
    
    if (percentage <= 10) return { status: 'critical', text: `Only ${remaining} left!`, color: 'text-red-600' };
    if (percentage <= 25) return { status: 'low', text: `${remaining} remaining`, color: 'text-orange-600' };
    return { status: 'available', text: `${remaining} available`, color: 'text-green-600' };
  };

  const categories = [...new Set(deals.map(deal => deal.category))];
  const dealTypes = [...new Set(deals.map(deal => deal.deal_type))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-4">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="h-64 bg-gray-200" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <UnifiedNavigation />
      {/* Ambient Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-red-200/20 to-orange-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-60 right-20 w-96 h-96 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-gradient-to-br from-blue-200/20 to-teal-200/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500/10 via-orange-500/10 to-yellow-500/10 backdrop-blur-sm border border-red-200/50 rounded-full px-4 py-2 mb-6">
              <Flame className="h-4 w-4 text-red-600 animate-pulse" />
              <span className="text-sm font-medium text-red-800">Exclusive Wellness Deals</span>
              <Flame className="h-4 w-4 text-red-600 animate-pulse" />
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-red-600 via-orange-600 to-pink-600 bg-clip-text text-transparent">
                Unbeatable Wellness
              </span>
              <br />
              <span className="text-gray-800">Deals & Offers</span>
            </h1>
            
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover exclusive discounts on premium wellness services, products, and experiences. Limited time offers from South Africa's top wellness providers.
            </p>
            
            <div className="flex justify-center items-center gap-6 mt-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Verified Providers</span>
              </div>
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4 text-orange-500" />
                <span>Time-Limited Offers</span>
              </div>
              <div className="flex items-center gap-2">
                <Percent className="h-4 w-4 text-purple-500" />
                <span>Up to 40% Savings</span>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search deals, providers, or categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 text-lg bg-white/80 backdrop-blur-sm border-2 border-white/50"
                />
              </div>
              
              <div className="flex gap-3">
                <Select value={selectedDealType} onValueChange={setSelectedDealType}>
                  <SelectTrigger className="w-48 h-12 bg-white/80 backdrop-blur-sm border-2 border-white/50">
                    <SelectValue placeholder="Deal Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Deal Types</SelectItem>
                    <SelectItem value="flash_sale">⚡ Flash Sales</SelectItem>
                    <SelectItem value="bundle">📦 Bundle Deals</SelectItem>
                    <SelectItem value="early_bird">🐦 Early Bird</SelectItem>
                    <SelectItem value="loyalty">👑 VIP Exclusive</SelectItem>
                    <SelectItem value="seasonal">✨ Seasonal</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48 h-12 bg-white/80 backdrop-blur-sm border-2 border-white/50">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48 h-12 bg-white/80 backdrop-blur-sm border-2 border-white/50">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ending_soon">⏰ Ending Soon</SelectItem>
                    <SelectItem value="discount_high">💥 Highest Discount</SelectItem>
                    <SelectItem value="price_low">💰 Price: Low to High</SelectItem>
                    <SelectItem value="rating">⭐ Highest Rated</SelectItem>
                    <SelectItem value="popularity">🔥 Most Popular</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border-2 border-white/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6 text-sm">
                  <span className="font-medium text-gray-800">
                    {filteredDeals.length} deals found
                  </span>
                  <span className="text-gray-600">
                    Average savings: {Math.round(filteredDeals.reduce((acc, deal) => acc + deal.discount_percentage, 0) / filteredDeals.length || 0)}%
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span>Best deals ending soon!</span>
                </div>
              </div>
            </div>
          </div>

          {/* Deal Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredDeals.map((deal) => {
              const timeRemaining = getTimeRemaining(deal.valid_until);
              const availability = getAvailabilityStatus(deal);
              
              return (
                <Card key={deal.id} className="bg-white/90 backdrop-blur-sm border-2 border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300 group hover:-translate-y-2 overflow-hidden">
                  <div className="aspect-video relative overflow-hidden">
                    <img 
                      src={deal.images[0] || IMAGES.wellness.deals}
                      alt={deal.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = IMAGES.wellness.deals;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    
                    {/* Deal Type Badge */}
                    <div className="absolute top-3 left-3">
                      <Badge className={`${getDealTypeColor(deal.deal_type)} border-0 flex items-center gap-1 font-bold shadow-lg`}>
                        {getDealTypeIcon(deal.deal_type)}
                        {deal.deal_type.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>

                    {/* Discount Badge */}
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-red-500 text-white text-lg font-bold px-3 py-1 shadow-lg animate-pulse">
                        -{deal.discount_percentage}%
                      </Badge>
                    </div>

                    {/* Rating */}
                    <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/70 px-3 py-1 rounded-full">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-white font-medium">{deal.rating}</span>
                      <span className="text-gray-300 text-sm">({deal.review_count})</span>
                    </div>

                    {/* Countdown Timer for Flash Sales */}
                    {deal.deal_type === 'flash_sale' && timeRemaining && (
                      <div className="absolute bottom-3 left-3 bg-red-500/90 text-white px-3 py-1 rounded-full text-sm font-bold">
                        ⏱️ {timeRemaining.hours}h {timeRemaining.minutes}m {timeRemaining.seconds}s
                      </div>
                    )}
                  </div>

                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-xl font-bold line-clamp-2 group-hover:text-purple-600 transition-colors">
                        {deal.title}
                      </CardTitle>
                    </div>
                    <CardDescription className="text-sm text-purple-600 font-medium flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      {deal.provider_name}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {deal.description}
                    </p>

                    {/* Location and Online Badge */}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span className="truncate">{deal.location}</span>
                      </div>
                      {deal.is_online && (
                        <div className="flex items-center gap-1 text-green-600">
                          <Globe className="h-4 w-4" />
                          <span>Online Available</span>
                        </div>
                      )}
                    </div>

                    {/* Pricing */}
                    <div className="space-y-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="text-2xl font-bold text-purple-600">R{deal.deal_price_zar}</span>
                            <span className="text-lg text-gray-500 line-through">R{deal.original_price_zar}</span>
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            or {deal.deal_price_wellcoins} WellCoins
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">
                            SAVE R{deal.original_price_zar - deal.deal_price_zar}
                          </div>
                          <div className="text-sm text-gray-600">
                            ({deal.discount_percentage}% off)
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Availability Status */}
                    {availability && (
                      <div className={`flex items-center gap-2 text-sm font-medium ${availability.color}`}>
                        <AlertCircle className="h-4 w-4" />
                        {availability.text}
                      </div>
                    )}

                    {/* Time Remaining */}
                    {timeRemaining && (
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <div className="text-sm font-medium text-gray-700 mb-2">Deal expires in:</div>
                        <div className="flex gap-3 text-center">
                          {timeRemaining.days > 0 && (
                            <div>
                              <div className="text-lg font-bold text-red-600">{timeRemaining.days}</div>
                              <div className="text-xs text-gray-500">days</div>
                            </div>
                          )}
                          <div>
                            <div className="text-lg font-bold text-red-600">{timeRemaining.hours}</div>
                            <div className="text-xs text-gray-500">hrs</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-red-600">{timeRemaining.minutes}</div>
                            <div className="text-xs text-gray-500">min</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-red-600">{timeRemaining.seconds}</div>
                            <div className="text-xs text-gray-500">sec</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Social Proof */}
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{deal.quantity_claimed} claimed</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{Math.floor(Math.random() * 500) + 100} views</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3 pt-2">
                      <div className="flex gap-2">
                        <Button 
                          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold"
                          onClick={() => handleDealClick(deal)}
                        >
                          <Gift className="h-4 w-4 mr-2" />
                          View Deal
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                        <Button variant="outline" size="icon" className="border-2 border-purple-200 hover:bg-purple-50">
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="border-2 border-purple-200 hover:bg-purple-50">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {/* Add to Cart for applicable deals */}
                      <AddToCartButton 
                        item={{
                          id: deal.id,
                          title: deal.title,
                          price_zar: deal.deal_price_zar,
                          price_wellcoins: deal.deal_price_wellcoins,
                          image: deal.images[0] || IMAGES.wellness.deals,
                          category: deal.category,
                          provider_name: deal.provider_name,
                          location: deal.location
                        }}
                        variant="default"
                        className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-bold"
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* No Results State */}
          {filteredDeals.length === 0 && (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <Search className="h-20 w-20 mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">No deals found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your search terms or filters</p>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedDealType('all');
                  setSelectedCategory('all');
                }}
                variant="outline"
                className="border-2 border-purple-200 hover:bg-purple-50"
              >
                Clear All Filters
              </Button>
            </div>
          )}

          {/* Newsletter Signup */}
          <div className="mt-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-4">Never Miss a Deal!</h3>
            <p className="mb-6">Subscribe to get exclusive deals and early access to flash sales.</p>
            <div className="flex max-w-md mx-auto gap-3">
              <Input 
                placeholder="Enter your email"
                className="bg-white/20 border-white/30 text-white placeholder-white/70"
              />
              <Button className="bg-white text-purple-600 hover:bg-gray-100 font-bold">
                Subscribe
              </Button>
            </div>
          </div>

          {/* 2BeWell CTA Section */}
          {!loading && filteredDeals.length > 0 && (
            <div className="mt-16">
              <TwoBeWellCTA variant="compact" />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default WellnessDeals;