import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Signal,
  Shield,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Users,
  Award
} from "lucide-react";
import { Link } from "react-router-dom";
import UnifiedNavigation from "@/components/navigation/UnifiedNavigation";
import Footer from "@/components/Footer";

interface RoamBuddyProduct {
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
  speed?: string;
  rating?: number;
}

const RoamBuddyStore = () => {
  const [products, setProducts] = useState<RoamBuddyProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<RoamBuddyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [apiStatus, setApiStatus] = useState<string>('checking');
  const [purchaseLoading, setPurchaseLoading] = useState<string | null>(null);
  const [testingConnection, setTestingConnection] = useState(false);
  
  const { toast } = useToast();
  const { addItem } = useCart();

  const testApiConnection = async () => {
    try {
      setTestingConnection(true);
      console.log('Testing RoamBuddy API connection...');
      
      const result = await supabase.functions.invoke('roambuddy-api', {
        body: { action: 'test' }
      });
      
      console.log('API Test Result:', result);
      
      if (result.data?.success) {
        setApiStatus('connected');
        toast({
          title: "✅ API Connected",
          description: "RoamBuddy API is configured and ready!",
        });
      } else {
        setApiStatus('error');
        toast({
          title: "⚠️ API Configuration Issue",
          description: result.data?.message || "API credentials need attention",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('API test error:', error);
      setApiStatus('error');
      toast({
        title: "❌ Connection Failed",
        description: "Could not reach RoamBuddy API",
        variant: "destructive"
      });
    } finally {
      setTestingConnection(false);
    }
  };

  const categories = [
    { value: "all", label: "All Products", icon: "🌐" },
    { value: "esim", label: "eSIM Data Plans", icon: "📱" },
    { value: "wifi", label: "Pocket WiFi", icon: "📶" },
    { value: "accessories", label: "Travel Accessories", icon: "🎒" },
    { value: "services", label: "Travel Services", icon: "✈️" }
  ];

  const destinations = [
    { value: "all", label: "All Destinations", flag: "🌍" },
    { value: "south-africa", label: "South Africa", flag: "🇿🇦" },
    { value: "africa", label: "Africa Regional", flag: "🌍" },
    { value: "global", label: "Global Coverage", flag: "🗺️" },
    { value: "europe", label: "Europe", flag: "🇪🇺" },
    { value: "asia", label: "Asia", flag: "🌏" },
    { value: "americas", label: "Americas", flag: "🌎" }
  ];

  // Handle URL search parameters
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

  // Fetch products from RoamBuddy API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        console.log('Fetching RoamBuddy products...');
        
        const result = await supabase.functions.invoke('roambuddy-api', {
          body: { action: 'getServices' }
        });
        
        if (result.data?.success && result.data?.data?.services) {
          setApiStatus('connected');
          const roamBuddyProducts = result.data.data.services.map((service: any) => ({
            id: service.id || Math.random().toString(),
            name: service.name || service.title || 'Unnamed Product',
            description: service.description || 'Stay connected on your travels',
            price: service.price || 0,
            currency: service.currency || 'USD',
            data_amount: service.data_amount || service.data,
            validity_days: service.validity_days || service.duration,
            coverage: service.coverage || service.countries || [],
            category: service.category || 'esim',
            features: service.features || [],
            popular: service.popular || false,
            speed: service.speed || '5G',
            rating: service.rating || 4.8
          }));
          setProducts(roamBuddyProducts);
          setFilteredProducts(roamBuddyProducts);
          } else {
            console.log('RoamBuddy API did not return services, using demo mode');
            setApiStatus('fallback');
            toast({
              title: "Demo Mode Active",
              description: "Showing sample products. API connection needs configuration.",
            });
            const demoProducts: RoamBuddyProduct[] = [
            {
              id: 'rb-sa-explorer',
              name: 'South Africa Explorer eSIM',
              description: 'Perfect for wellness retreats and safari adventures across South Africa',
              price: 49,
              currency: 'USD',
              data_amount: '10GB',
              validity_days: 30,
              coverage: ['South Africa'],
              category: 'esim',
              features: ['5G Speed', 'Instant Activation', 'No Roaming Charges', '24/7 Support'],
              popular: true,
              speed: '5G',
              rating: 4.9
            },
            {
              id: 'rb-africa-nomad',
              name: 'Africa Regional eSIM',
              description: 'Multi-country coverage for African adventures and business travel',
              price: 89,
              currency: 'USD',
              data_amount: '15GB',
              validity_days: 45,
              coverage: ['South Africa', 'Kenya', 'Tanzania', 'Botswana', 'Zimbabwe'],
              category: 'esim',
              features: ['20+ Countries', 'Premium Speed', 'Unlimited Sharing', 'Free Top-ups'],
              popular: false,
              speed: '4G/5G',
              rating: 4.7
            },
            {
              id: 'rb-pocket-wifi',
              name: 'Premium Pocket WiFi',
              description: 'Share high-speed connection with multiple devices on the go',
              price: 12,
              currency: 'USD',
              data_amount: 'Unlimited',
              validity_days: 1,
              coverage: ['South Africa'],
              category: 'wifi',
              features: ['Up to 10 devices', 'Long battery', 'Express delivery', 'Free setup'],
              popular: false,
              speed: '4G',
              rating: 4.6
            },
            {
              id: 'rb-global-unlimited',
              name: 'Global Unlimited eSIM',
              description: 'Worldwide coverage for digital nomads and frequent travelers',
              price: 149,
              currency: 'USD',
              data_amount: '20GB',
              validity_days: 60,
              coverage: ['180+ Countries'],
              category: 'esim',
              features: ['Global Coverage', '5G Speed', 'Priority Support', 'No Speed Limits'],
              popular: true,
              speed: '5G',
              rating: 5.0
            },
            {
              id: 'rb-europe-traveler',
              name: 'Europe Traveler eSIM',
              description: 'Seamless connectivity across all European destinations',
              price: 69,
              currency: 'USD',
              data_amount: '12GB',
              validity_days: 30,
              coverage: ['40+ European Countries'],
              category: 'esim',
              features: ['EU Coverage', 'High Speed', 'Data Sharing', 'Auto-renewal'],
              popular: false,
              speed: '4G/5G',
              rating: 4.8
            },
            {
              id: 'rb-asia-explorer',
              name: 'Asia Explorer eSIM',
              description: 'Stay connected throughout Asia with high-speed data',
              price: 79,
              currency: 'USD',
              data_amount: '15GB',
              validity_days: 30,
              coverage: ['Japan', 'Thailand', 'Singapore', 'Vietnam', 'Malaysia'],
              category: 'esim',
              features: ['15+ Countries', 'Fast Activation', 'Video Streaming', 'Hotspot Ready'],
              popular: false,
              speed: '4G/5G',
              rating: 4.7
            }
          ];
          setProducts(demoProducts);
          setFilteredProducts(demoProducts);
        }
      } catch (error) {
        console.error('Error fetching RoamBuddy products:', error);
        setApiStatus('error');
        toast({
          title: "⚠️ Connection Error",
          description: "Could not connect to RoamBuddy API. Showing demo products for browsing.",
          variant: "destructive"
        });
        
        // Load demo products as fallback
        const demoProducts: RoamBuddyProduct[] = [
          {
            id: 'rb-sa-explorer',
            name: 'South Africa Explorer eSIM',
            description: 'Perfect for wellness retreats and safari adventures across South Africa',
            price: 49,
            currency: 'USD',
            data_amount: '10GB',
            validity_days: 30,
            coverage: ['South Africa'],
            category: 'esim',
            features: ['5G Speed', 'Instant Activation', 'No Roaming Charges', '24/7 Support'],
            popular: true,
            speed: '5G',
            rating: 4.9
          },
          {
            id: 'rb-global-unlimited',
            name: 'Global Unlimited eSIM',
            description: 'Worldwide coverage for digital nomads and frequent travelers',
            price: 149,
            currency: 'USD',
            data_amount: '20GB',
            validity_days: 60,
            coverage: ['180+ Countries'],
            category: 'esim',
            features: ['Global Coverage', '5G Speed', 'Priority Support', 'No Speed Limits'],
            popular: true,
            speed: '5G',
            rating: 5.0
          },
        ];
        setProducts(demoProducts);
        setFilteredProducts(demoProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products
  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    if (selectedCountry !== "all") {
      filtered = filtered.filter(product => {
        if (selectedCountry === "global") {
          return product.coverage?.some(country => 
            country.toLowerCase().includes('global') || 
            country.toLowerCase().includes('worldwide') ||
            country.includes('180+') ||
            country.includes('200+')
          );
        }
        return product.coverage?.some(country => 
          country.toLowerCase().includes(selectedCountry.replace('-', ' '))
        );
      });
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, selectedCountry]);

  const handlePurchase = async (product: RoamBuddyProduct) => {
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
            destination: product.coverage?.[0] || 'Global'
          },
          customerData: {
            email: 'customer@omniwellnessmedia.com',
            name: 'Wellness Traveler'
          },
          successUrl: `${window.location.origin}/payment-success`,
          cancelUrl: `${window.location.origin}/roambuddy-store`
        }
      });
      
      if (paymentResult.data?.url) {
        toast({
          title: "🔒 Secure Checkout",
          description: `Redirecting to secure payment for ${product.name}...`,
        });
        
        window.open(paymentResult.data.url, '_blank');
        
        addItem({
          id: product.id,
          title: product.name,
          price_zar: product.price,
          price_wellcoins: Math.floor(product.price * 10),
          provider_name: 'RoamBuddy',
          image: IMAGES.tours.nature,
          category: 'roambuddy'
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

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedCountry("all");
  };

  const ProductCard = ({ product }: { product: RoamBuddyProduct }) => (
    <Card className={`group relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${product.popular ? 'ring-2 ring-primary' : ''}`}>
      {product.popular && (
        <div className="absolute -right-12 top-6 w-40 text-center bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold py-1 rotate-45 shadow-lg z-10">
          <Star className="w-3 h-3 inline mr-1" />
          POPULAR
        </div>
      )}
      
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <CardHeader className="text-center pb-4 relative">
        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center text-4xl">
          {product.category === 'esim' ? '📱' : 
           product.category === 'wifi' ? '📶' : 
           product.category === 'accessories' ? '🎒' : '🌐'}
        </div>
        
        <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
          {product.name}
        </CardTitle>
        
        <CardDescription className="text-sm text-muted-foreground leading-relaxed">
          {product.description}
        </CardDescription>
        
        <div className="flex items-center justify-center gap-1 mt-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating || 4.8) ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`} />
          ))}
          <span className="text-xs text-muted-foreground ml-1">({product.rating || 4.8})</span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 relative">
        <div className="text-center py-4 bg-muted/50 rounded-xl">
          <div className="text-4xl font-bold text-foreground">
            ${product.price}
            <span className="text-base text-muted-foreground font-normal ml-1">USD</span>
          </div>
          {product.data_amount && product.validity_days && (
            <div className="flex items-center justify-center gap-4 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Wifi className="w-4 h-4" />
                <span className="font-medium">{product.data_amount}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span className="font-medium">{product.validity_days} days</span>
              </div>
            </div>
          )}
          {product.speed && (
            <Badge variant="secondary" className="mt-2">
              <Signal className="w-3 h-3 mr-1" />
              {product.speed}
            </Badge>
          )}
        </div>
        
        {product.coverage && product.coverage.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" />
              Coverage
            </div>
            <div className="flex flex-wrap gap-2">
              {product.coverage.slice(0, 3).map((country, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  <MapPin className="w-3 h-3 mr-1" />
                  {country}
                </Badge>
              ))}
              {product.coverage.length > 3 && (
                <Badge variant="outline" className="text-xs font-semibold">
                  +{product.coverage.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
        
        {product.features && product.features.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-semibold text-foreground">Features</div>
            <ul className="space-y-2">
              {product.features.slice(0, 4).map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <Button 
          className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg"
          onClick={() => handlePurchase(product)}
          disabled={purchaseLoading === product.id}
          size="lg"
        >
          {purchaseLoading === product.id ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Buy Now
              <ArrowRight className="w-4 h-4" />
            </div>
          )}
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <UnifiedNavigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-background pt-24 pb-16">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="flex flex-col items-center gap-3">
              <Badge className={`${
                apiStatus === 'connected' ? 'bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30' : 
                apiStatus === 'fallback' ? 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30' :
                apiStatus === 'checking' ? 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30' : 
                'bg-blue-500/20 text-blue-700 border-blue-500/30'
              } backdrop-blur-sm px-4 py-2`}>
                <Globe className="w-4 h-4 mr-2" />
                {apiStatus === 'connected' ? 'Live RoamBuddy Products ✓' : 
                 apiStatus === 'checking' ? 'Loading RoamBuddy Store...' : 
                 'RoamBuddy Demo Store'}
              </Badge>
              
              <Button
                variant="outline"
                size="sm"
                onClick={testApiConnection}
                disabled={testingConnection}
                className="gap-2"
              >
                {testingConnection ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Testing Connection...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Test API Connection
                  </>
                )}
              </Button>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Travel Connected<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">Stay Unlimited</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Premium eSIM data plans and connectivity solutions for modern travelers. 
              Instant activation, global coverage, unbeatable prices.
            </p>
            
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">180+</div>
                <div className="text-sm text-muted-foreground">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">50K+</div>
                <div className="text-sm text-muted-foreground">Happy Travelers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">4.9★</div>
                <div className="text-sm text-muted-foreground">User Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-8 bg-muted/30 border-y">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <span>Secure Payments</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              <span>Instant Activation</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <span>24/7 Support</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              <span>Best Price Guarantee</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-background sticky top-0 z-10 border-b shadow-sm">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search" className="text-sm font-medium">Search Products</Label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name or destination..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium">Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      <span className="flex items-center gap-2">
                        <span>{category.icon}</span>
                        {category.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="country" className="text-sm font-medium">Destination</Label>
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {destinations.map(dest => (
                    <SelectItem key={dest.value} value={dest.value}>
                      <span className="flex items-center gap-2">
                        <span>{dest.flag}</span>
                        {dest.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={clearFilters}
              >
                <Filter className="w-4 h-4 mr-2" />
                Clear All Filters
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
              <p className="text-lg text-muted-foreground">Loading premium connectivity solutions...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold mb-2">No Products Found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your filters or search criteria</p>
              <Button onClick={clearFilters}>Clear Filters</Button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold">Available Products</h2>
                  <p className="text-muted-foreground">Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}</p>
                </div>
                <Badge variant="outline" className="text-sm">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Best Sellers
                </Badge>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Need Help Choosing?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Our travel connectivity experts are here to help you find the perfect plan for your journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              <Users className="w-5 h-5 mr-2" />
              Talk to an Expert
            </Button>
            <Button size="lg" variant="outline">
              <Shield className="w-5 h-5 mr-2" />
              View All Plans
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default RoamBuddyStore;
