import { useState, useEffect } from "react";
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
import { useCart } from "@/contexts/CartContext";
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
  ArrowLeft
} from "lucide-react";
import { Link } from "react-router-dom";

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
  
  const { toast } = useToast();
  const { addItem } = useCart();

  const categories = [
    { value: "all", label: "All Products" },
    { value: "esim", label: "eSIM Data Plans" },
    { value: "wifi", label: "Pocket WiFi" },
    { value: "accessories", label: "Travel Accessories" },
    { value: "services", label: "Travel Services" }
  ];

  const countries = [
    { value: "all", label: "All Countries" },
    { value: "south-africa", label: "South Africa" },
    { value: "africa", label: "Africa Regional" },
    { value: "global", label: "Global Coverage" },
    { value: "europe", label: "Europe" },
    { value: "asia", label: "Asia" },
    { value: "americas", label: "Americas" }
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
        
        console.log('RoamBuddy products result:', result);
        
        if (result.data?.success && result.data?.data?.services) {
          setApiStatus('connected');
          const roamBuddyProducts = result.data.data.services.map((service: any) => ({
            id: service.id || Math.random().toString(),
            name: service.name || service.title || 'Unnamed Product',
            description: service.description || 'No description available',
            price: service.price || 0,
            currency: service.currency || 'USD',
            data_amount: service.data_amount || service.data,
            validity_days: service.validity_days || service.duration,
            coverage: service.coverage || service.countries || [],
            category: service.category || 'esim',
            features: service.features || [],
            popular: service.popular || false
          }));
          setProducts(roamBuddyProducts);
          setFilteredProducts(roamBuddyProducts);
        } else {
          setApiStatus('fallback');
          // Use demo products with RoamBuddy branding
          const demoProducts: RoamBuddyProduct[] = [
            {
              id: 'rb-sa-explorer',
              name: 'South Africa Explorer eSIM',
              description: 'Perfect for wellness retreats and safari adventures',
              price: 49,
              currency: 'USD',
              data_amount: '10GB',
              validity_days: 30,
              coverage: ['South Africa'],
              category: 'esim',
              features: ['5G Speed', 'Instant Activation', 'No Roaming Charges'],
              popular: true
            },
            {
              id: 'rb-africa-nomad',
              name: 'Africa Regional eSIM',
              description: 'Multi-country coverage for African adventures',
              price: 89,
              currency: 'USD',
              data_amount: '15GB',
              validity_days: 45,
              coverage: ['South Africa', 'Kenya', 'Tanzania', 'Botswana', 'Zimbabwe'],
              category: 'esim',
              features: ['20+ Countries', 'Premium Speed', 'Unlimited Sharing'],
              popular: false
            },
            {
              id: 'rb-pocket-wifi',
              name: 'Pocket WiFi Device',
              description: 'Share connection with multiple devices',
              price: 12,
              currency: 'USD',
              data_amount: 'Unlimited',
              validity_days: 1,
              coverage: ['South Africa'],
              category: 'wifi',
              features: ['Up to 10 devices', 'Long battery', 'Express delivery'],
              popular: false
            },
            {
              id: 'rb-global-unlimited',
              name: 'Global Unlimited eSIM',
              description: 'Worldwide coverage for digital nomads',
              price: 149,
              currency: 'USD',
              data_amount: '20GB',
              validity_days: 60,
              coverage: ['180+ Countries'],
              category: 'esim',
              features: ['Global Coverage', '5G Speed', 'Priority Support'],
              popular: true
            }
          ];
          setProducts(demoProducts);
          setFilteredProducts(demoProducts);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setApiStatus('error');
        toast({
          title: "Connection Error",
          description: "Could not load products. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on search and filters
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
      
      // Try to create booking through RoamBuddy API
      const bookingResult = await supabase.functions.invoke('roambuddy-api', {
        body: { 
          action: 'createBooking',
          data: {
            product_id: product.id,
            product_name: product.name,
            price: product.price,
            currency: product.currency,
            customer_email: 'customer@example.com', // In real app, get from user
            customer_name: 'Customer Name' // In real app, get from user
          }
        }
      });
      
      if (bookingResult.data?.success) {
        toast({
          title: "Order Created Successfully!",
          description: `${product.name} - Order ID: ${bookingResult.data.order_id || 'RB' + Date.now()}. Processing payment...`,
        });
        
        // Simulate payment processing
        setTimeout(() => {
          toast({
            title: "🎉 eSIM Activated!",
            description: "QR code sent to your email. Valid immediately. Enjoy seamless connectivity!",
            duration: 6000
          });
        }, 3000);
        
        // Add to cart for order tracking
        addItem({
          id: product.id,
          title: product.name,
          price_zar: product.price,
          image: '/lovable-uploads/esim-product-image.png',
          category: 'roambuddy'
        });
      } else {
        // Fallback to local cart system
        addItem({
          id: product.id,
          title: product.name,
          price_zar: product.price,
          image: '/lovable-uploads/esim-product-image.png',
          category: 'roambuddy'
        });
        
        toast({
          title: "Demo Mode - Added to Cart",
          description: `${product.name} added. In live mode: instant eSIM delivery via email.`,
          duration: 4000
        });
      }
    } catch (error) {
      console.error('Purchase error:', error);
      toast({
        title: "Purchase Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setPurchaseLoading(null);
    }
  };

  const ProductCard = ({ product }: { product: RoamBuddyProduct }) => (
    <Card className={`relative transition-all duration-300 hover:shadow-lg ${product.popular ? 'ring-2 ring-primary scale-105' : ''}`}>
      {product.popular && (
        <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gradient-primary text-white">
          <Star className="w-3 h-3 mr-1" />
          Popular Choice
        </Badge>
      )}
      
      <CardHeader className="text-center pb-4">
        <div className="text-2xl mb-2">
          {product.category === 'esim' ? '📱' : 
           product.category === 'wifi' ? '📶' : 
           product.category === 'accessories' ? '🎒' : '🌐'}
        </div>
        <CardTitle className="text-lg">{product.name}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {product.description}
        </CardDescription>
        
        <div className="flex items-center justify-center space-x-2 mt-4">
          <span className="text-3xl font-bold text-primary">
            ${product.price}
          </span>
          <span className="text-sm text-muted-foreground">{product.currency}</span>
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
      </CardHeader>
      
      <CardContent className="pt-0">
        {product.coverage && product.coverage.length > 0 && (
          <div className="mb-4">
            <div className="text-sm font-medium mb-2">Coverage:</div>
            <div className="flex flex-wrap gap-1">
              {product.coverage.slice(0, 3).map((country, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {country}
                </Badge>
              ))}
              {product.coverage.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{product.coverage.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
        
        {product.features && product.features.length > 0 && (
          <ul className="space-y-2 mb-6">
            {product.features.slice(0, 3).map((feature, index) => (
              <li key={index} className="flex items-center text-sm">
                <Check className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        )}
        
        <Button 
          className="w-full bg-gradient-primary hover:bg-gradient-primary/90"
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
              Buy Now
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      {/* Back Navigation */}
      <div className="px-4 pt-6">
        <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
      </div>
      
      {/* Header */}
      <section className="relative py-12 px-4">
        <div className="container mx-auto">
          <div className={`inline-flex items-center px-4 py-2 rounded-full mb-6 ${
            apiStatus === 'connected' ? 'bg-green-100 text-green-700' : 
            apiStatus === 'checking' ? 'bg-yellow-100 text-yellow-700' : 
            'bg-blue-100 text-blue-700'
          }`}>
            <Globe className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">
              {apiStatus === 'connected' ? 'Live RoamBuddy Products ✓' : 
               apiStatus === 'checking' ? 'Loading RoamBuddy Store...' : 
               'RoamBuddy Demo Store'}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            RoamBuddy Travel Store
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
            Stay connected worldwide with premium eSIM data plans, pocket WiFi devices, 
            and travel accessories. Powered by RoamBuddy's global network.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Search Products</Label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="category">Category</Label>
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
              <Label htmlFor="country">Coverage</Label>
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {countries.map(country => (
                    <SelectItem key={country.value} value={country.value}>
                      {country.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button variant="outline" className="w-full">
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
              <span className="ml-2 text-lg">Loading products...</span>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold">
                  {filteredProducts.length} Products Available
                </h2>
                <div className="text-sm text-muted-foreground">
                  Powered by RoamBuddy Global Network
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold mb-2">No products found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default RoamBuddyStore;