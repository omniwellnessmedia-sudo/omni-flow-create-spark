
import { useState, useEffect } from "react";
import UnifiedNavigation from "@/components/navigation/UnifiedNavigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/components/CartProvider";
import { IMAGES } from "@/lib/images";
import { 
  Globe, 
  Wifi, 
  Smartphone, 
  MapPin, 
  Clock, 
  Check, 
  Star, 
  Zap, 
  ShoppingCart,
  Search,
  Filter,
  Loader2,
  CreditCard,
  Download,
  ArrowLeft,
  Heart,
  Shield,
  Users,
  Headphones,
  Award,
  CheckCircle,
  Phone
} from "lucide-react";
import { Link } from "react-router-dom";
import { PriceDisplay } from "@/components/ui/price-display";

interface TravelWellConnectedProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  data_amount?: string;
  validity_days?: number;
  coverage?: string[];
  category: string;
  features?: string[];
  popular?: boolean;
  wellness_features?: string[];
  peace_of_mind_score?: number;
}

interface Country {
  id: string;
  name: string;
  code: string;
  wellness_rating?: number;
  popular_wellness_activities?: string[];
}

const TravelWellConnectedStore = () => {
  const [products, setProducts] = useState<TravelWellConnectedProduct[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<TravelWellConnectedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedWellnessType, setSelectedWellnessType] = useState("all");
  const [apiStatus, setApiStatus] = useState<string>('checking');
  const [purchaseLoading, setPurchaseLoading] = useState<string | null>(null);
  
  const { toast } = useToast();
  const { addItem } = useCart();

  const categories = [
    { value: "all", label: "All Packages" },
    { value: "esim", label: "eSIM Data Plans" },
    { value: "wifi", label: "Pocket WiFi" },
    { value: "wellness", label: "Wellness Focused" },
    { value: "retreat", label: "Retreat Packages" }
  ];

  const wellnessTypes = [
    { value: "all", label: "All Wellness Types" },
    { value: "meditation", label: "Meditation & Mindfulness" },
    { value: "yoga", label: "Yoga & Movement" },
    { value: "spa", label: "Spa & Relaxation" },
    { value: "nature", label: "Nature & Eco-Wellness" },
    { value: "digital_detox", label: "Digital Detox" }
  ];

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    if (searchParam) {
      setSearchTerm(searchParam);
      toast({
        title: "🔍 Search Applied",
        description: `Showing results for "${searchParam}"`,
      });
    }
  }, []);

  useEffect(() => {
    fetchTravelWellConnectedData();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, selectedCategory, selectedCountry, selectedWellnessType]);

  const fetchTravelWellConnectedData = async () => {
    try {
      setLoading(true);
      console.log('Fetching Travel Well Connected data...');
      
      // Fetch products
      const productsResult = await supabase.functions.invoke('roambuddy-api', {
        body: { action: 'getWellnessPackages', data: { wellness_type: 'all' } }
      });
      
      // Fetch countries
      const countriesResult = await supabase.functions.invoke('roambuddy-api', {
        body: { action: 'getCountries' }
      });
      
      console.log('Products result:', productsResult);
      console.log('Countries result:', countriesResult);
      
      if (productsResult.data?.success && productsResult.data?.data?.packages) {
        setApiStatus('connected');
        setProducts(productsResult.data.data.packages);
        setFilteredProducts(productsResult.data.data.packages);
      } else {
        setApiStatus('fallback');
        const demoProducts = getDemoWellnessProducts();
        setProducts(demoProducts);
        setFilteredProducts(demoProducts);
      }

      if (countriesResult.data?.success && countriesResult.data?.data) {
        setCountries(countriesResult.data.data);
      } else {
        setCountries(getDemoCountries());
      }
      
    } catch (error) {
      console.error('Error fetching Travel Well Connected data:', error);
      setApiStatus('error');
      const demoProducts = getDemoWellnessProducts();
      setProducts(demoProducts);
      setFilteredProducts(demoProducts);
      setCountries(getDemoCountries());
      
      toast({
        title: "Connection Info",
        description: "Showing demo wellness connectivity packages.",
      });
    } finally {
      setLoading(false);
    }
  };

  const getDemoWellnessProducts = (): TravelWellConnectedProduct[] => [
    {
      id: 'twc-peace-basic',
      name: 'Peace of Mind - Essential',
      description: 'Stay connected with confidence. Includes wellness app data and 24/7 support.',
      price: 39,
      currency: 'USD',
      data_amount: '5GB',
      validity_days: 30,
      coverage: ['South Africa'],
      category: 'esim',
      features: ['Instant Activation', '5G Speed', 'Wellness App Optimized'],
      wellness_features: ['meditation_apps_optimized', 'wellness_support_24_7', 'peace_of_mind_guarantee'],
      peace_of_mind_score: 90,
      popular: true
    },
    {
      id: 'twc-retreat-pro',
      name: 'Wellness Retreat Pro',
      description: 'Perfect for wellness retreats with meditation app allowances and emergency support.',
      price: 79,
      currency: 'USD',
      data_amount: '15GB',
      validity_days: 45,
      coverage: ['South Africa', 'Botswana', 'Namibia'],
      category: 'wellness',
      features: ['Multi-Country', 'Retreat Optimized', 'Wellness Concierge'],
      wellness_features: ['retreat_ready', 'wellness_concierge', 'meditation_allowance'],
      peace_of_mind_score: 95,
      popular: true
    },
    {
      id: 'twc-global-zen',
      name: 'Global Zen Connectivity',
      description: 'Worldwide wellness connectivity with premium support and digital wellness features.',
      price: 149,
      currency: 'USD',
      data_amount: '25GB',
      validity_days: 60,
      coverage: ['Global - 180+ Countries'],
      category: 'esim',
      features: ['Global Coverage', 'Wellness Priority', 'Premium Support'],
      wellness_features: ['global_wellness', 'digital_wellness_coach', 'premium_support'],
      peace_of_mind_score: 100,
      popular: false
    },
    {
      id: 'twc-digital-detox',
      name: 'Mindful Digital Detox',
      description: 'Balanced connectivity for digital wellness and mindful technology use.',
      price: 59,
      currency: 'USD',
      data_amount: '8GB',
      validity_days: 30,
      coverage: ['South Africa', 'Thailand', 'Costa Rica'],
      category: 'wellness',
      features: ['Mindful Usage Tracking', 'Wellness Apps Only', 'Nature Content Priority'],
      wellness_features: ['digital_detox_mode', 'mindful_usage', 'nature_priority'],
      peace_of_mind_score: 88,
      popular: false
    }
  ];

  const getDemoCountries = (): Country[] => [
    {
      id: 'ZA',
      name: 'South Africa',
      code: 'ZA',
      wellness_rating: 85,
      popular_wellness_activities: ['Safari Meditation', 'Wine Country Yoga', 'Cape Town Wellness']
    },
    {
      id: 'TH',
      name: 'Thailand',
      code: 'TH',
      wellness_rating: 95,
      popular_wellness_activities: ['Buddhist Meditation', 'Thai Massage', 'Yoga Retreats']
    },
    {
      id: 'CR',
      name: 'Costa Rica',
      code: 'CR',
      wellness_rating: 90,
      popular_wellness_activities: ['Eco-Wellness', 'Forest Bathing', 'Yoga in Nature']
    }
  ];

  const filterProducts = () => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.wellness_features?.some(feature => 
          feature.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    if (selectedCountry !== "all") {
      filtered = filtered.filter(product => {
        return product.coverage?.some(country => 
          country.toLowerCase().includes(selectedCountry.toLowerCase()) ||
          selectedCountry === "global" && country.toLowerCase().includes('global')
        );
      });
    }

    if (selectedWellnessType !== "all") {
      filtered = filtered.filter(product => 
        product.wellness_features?.some(feature => 
          feature.toLowerCase().includes(selectedWellnessType.toLowerCase())
        )
      );
    }

    setFilteredProducts(filtered);
  };

  const handlePurchase = async (product: TravelWellConnectedProduct) => {
    try {
      setPurchaseLoading(product.id);
      
      const paymentResult = await supabase.functions.invoke('create-payment', {
        body: {
          productData: {
            id: product.id,
            name: product.name,
            price: product.price,
            currency: product.currency,
            category: product.category,
            data_amount: product.data_amount,
            validity_days: product.validity_days,
            coverage: product.coverage,
            wellness_features: product.wellness_features,
            peace_of_mind_score: product.peace_of_mind_score,
            destination: product.coverage?.[0] || 'Global'
          },
          customerData: {
            email: 'customer@travelwellconnected.com',
            name: 'Wellness Traveler'
          },
          successUrl: `${window.location.origin}/payment-success`,
          cancelUrl: `${window.location.origin}/travel-well-connected-store`
        }
      });
      
      if (paymentResult.data?.url) {
        toast({
          title: "🌟 Secure Wellness Checkout",
          description: `Redirecting to secure payment for ${product.name}...`,
        });
        
        window.open(paymentResult.data.url, '_blank');
        
        addItem({
          id: product.id,
          title: product.name,
          price_zar: product.price,
          price_wellcoins: Math.floor(product.price * 10),
          provider_name: 'Travel Well Connected',
          image: IMAGES.tours.coastal,
          category: 'travel-well-connected'
        });
      } else {
        throw new Error('Failed to create payment session');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      toast({
        title: "Purchase Error",
        description: "Failed to create payment session. Please try again.",
        variant: "destructive"
      });
    } finally {
      setPurchaseLoading(null);
    }
  };

  const getPeaceOfMindBadge = (score: number) => {
    if (score >= 95) return { text: "Ultimate Peace", color: "bg-green-600" };
    if (score >= 85) return { text: "High Peace", color: "bg-blue-600" };
    return { text: "Peace Assured", color: "bg-purple-600" };
  };

  const ProductCard = ({ product }: { product: TravelWellConnectedProduct }) => {
    const peaceOfMindBadge = getPeaceOfMindBadge(product.peace_of_mind_score || 0);
    
    return (
      <Card className={`relative transition-all duration-300 hover:shadow-xl ${product.popular ? 'ring-2 ring-primary scale-105 shadow-lg' : ''}`}>
        {product.popular && (
          <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-primary to-secondary text-white shadow-lg">
            <Star className="w-3 h-3 mr-1 fill-current" />
            Most Popular
          </Badge>
        )}
        
        <CardHeader className="text-center pb-4">
          <div className="text-3xl mb-3">
            {product.category === 'wellness' ? '🧘‍♀️' : 
             product.category === 'esim' ? '📱' : 
             product.category === 'wifi' ? '📶' : '🌿'}
          </div>
          <CardTitle className="text-xl mb-2">{product.name}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            {product.description}
          </CardDescription>
          
          <div className="flex items-center justify-center space-x-2 mt-4">
            <div className="text-3xl font-bold text-center">
              ${product.price}
              <span className="text-sm text-muted-foreground">/{product.currency}</span>
            </div>
          </div>
          
          {product.data_amount && product.validity_days && (
            <div className="flex items-center justify-center space-x-4 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Wifi className="w-4 h-4 mr-1" />
                {product.data_amount}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {product.validity_days} days
              </div>
            </div>
          )}

          {product.peace_of_mind_score && (
            <div className="mt-3">
              <Badge className={`${peaceOfMindBadge.color} text-white`}>
                <Heart className="w-3 h-3 mr-1" />
                {peaceOfMindBadge.text} {product.peace_of_mind_score}%
              </Badge>
            </div>
          )}
        </CardHeader>
        
        <CardContent className="pt-0">
          {product.coverage && product.coverage.length > 0 && (
            <div className="mb-4">
              <div className="text-sm font-medium mb-2 flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                Coverage:
              </div>
              <div className="flex flex-wrap gap-1">
                {product.coverage.slice(0, 2).map((country, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {country}
                  </Badge>
                ))}
                {product.coverage.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{product.coverage.length - 2} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {product.wellness_features && product.wellness_features.length > 0 && (
            <div className="mb-4">
              <div className="text-sm font-medium mb-2 text-green-700 flex items-center">
                <Heart className="w-4 h-4 mr-1" />
                Wellness Features:
              </div>
              <div className="flex flex-wrap gap-1">
                {product.wellness_features.slice(0, 3).map((feature, index) => (
                  <Badge key={index} variant="secondary" className="text-xs bg-green-100 text-green-800">
                    {feature.replace(/_/g, ' ')}
                  </Badge>
                ))}
                {product.wellness_features.length > 3 && (
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                    +{product.wellness_features.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}
          
          {product.features && product.features.length > 0 && (
            <ul className="space-y-2 mb-6">
              {product.features.slice(0, 3).map((feature, index) => (
                <li key={index} className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          )}
          
          <Button 
            className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg"
            onClick={() => handlePurchase(product)}
            disabled={purchaseLoading === product.id}
          >
            {purchaseLoading === product.id ? (
              <div className="flex items-center">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </div>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Connect with Peace of Mind
              </>
            )}
          </Button>

          <div className="mt-3 flex items-center justify-center text-xs text-muted-foreground">
            <Shield className="w-3 h-3 mr-1" />
            24/7 Wellness Support Included
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-green-50/30 to-blue-50/30">
      {/* Back Navigation */}
      <div className="px-4 pt-6">
        <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
      </div>
      
      {/* Hero Section */}
      <section className="relative py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 via-blue-400/10 to-purple-400/10"></div>
        <div className="container mx-auto relative">
          <div className={`inline-flex items-center px-6 py-3 rounded-full mb-8 shadow-lg ${
            apiStatus === 'connected' ? 'bg-green-100 text-green-700 border border-green-200' : 
            apiStatus === 'checking' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' : 
            'bg-blue-100 text-blue-700 border border-blue-200'
          }`}>
            <Globe className="w-5 h-5 mr-2" />
            <span className="font-medium">
              {apiStatus === 'connected' ? 'Live Travel Well Connected Store ✓' : 
               apiStatus === 'checking' ? 'Loading Travel Well Connected...' : 
               'Travel Well Connected Demo Store'}
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
            Travel Well Connected
          </h1>
          <p className="text-2xl text-muted-foreground mb-4 max-w-3xl">
            Stay Connected with Peace of Mind
          </p>
          <p className="text-lg text-muted-foreground mb-8 max-w-4xl">
            Premium global connectivity designed for wellness travelers. Featuring meditation app optimization, 
            24/7 wellness support, and peace of mind guarantees for your mindful journeys.
          </p>

          <div className="flex flex-wrap gap-4 mb-8">
            <Badge variant="secondary" className="text-base px-6 py-3 bg-green-100 text-green-800">
              <Heart className="w-4 h-4 mr-2" />
              Wellness Optimized
            </Badge>
            <Badge variant="outline" className="text-base px-6 py-3">
              <Shield className="w-4 h-4 mr-2" />
              Peace of Mind Guarantee
            </Badge>
            <Badge variant="outline" className="text-base px-6 py-3">
              <Headphones className="w-4 h-4 mr-2" />
              24/7 Wellness Support
            </Badge>
          </div>

          {/* Trust Indicators */}
          <div className="grid md:grid-cols-4 gap-6 mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">180+</div>
              <div className="text-sm text-muted-foreground">Countries Covered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime Guarantee</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">Wellness Support</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">Peace of Mind</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 px-4 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="search">Search Packages</Label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search wellness packages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="category">Package Type</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="wellness">Wellness Focus</Label>
              <Select value={selectedWellnessType} onValueChange={setSelectedWellnessType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {wellnessTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="country">Destination</Label>
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Destinations</SelectItem>
                  <SelectItem value="global">Global Coverage</SelectItem>
                  {countries.map(country => (
                    <SelectItem key={country.id} value={country.name.toLowerCase()}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedCountry('all');
                  setSelectedWellnessType('all');
                }}
              >
                <Filter className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-2 text-lg">Loading wellness connectivity packages...</span>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold">
                  {filteredProducts.length} Wellness Connectivity Packages
                </h2>
                <div className="text-sm text-muted-foreground flex items-center">
                  <Award className="w-4 h-4 mr-1" />
                  Travel Well Connected Certified
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              {filteredProducts.length === 0 && (
                <div className="text-center py-16">
                  <div className="text-6xl mb-6">🧘‍♀️</div>
                  <h3 className="text-2xl font-semibold mb-4">No wellness packages found</h3>
                  <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                    Try adjusting your search or filter criteria to find the perfect wellness connectivity package for your journey.
                  </p>
                  <Button onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setSelectedCountry('all');
                    setSelectedWellnessType('all');
                  }}>
                    Show All Packages
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Travel Well Connected?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of wellness travelers who choose peace of mind with every connection.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="secondary" className="bg-white text-green-600 hover:bg-gray-100">
              <Phone className="w-5 h-5 mr-2" />
              Speak to Wellness Expert
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
              <Download className="w-5 h-5 mr-2" />
              Download Travel Guide
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TravelWellConnectedStore;
