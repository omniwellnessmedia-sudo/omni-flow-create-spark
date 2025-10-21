import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { Globe, Wifi, Smartphone, MapPin, Clock, Check, Star, Zap, ArrowLeft, Search, Shield, CreditCard, Lock, Users, Headphones } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { PriceDisplay } from "@/components/ui/price-display";
import { IMAGES } from "@/lib/images";

const DataProducts = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<string>('checking');
  const [realTimeServices, setRealTimeServices] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  // Test RoamBuddy API connection and fetch real products
  useEffect(() => {
    const initializeRoamBuddyAPI = async () => {
      try {
        console.log('Initializing RoamBuddy API...');
        
        // First test the connection
        const testResult = await supabase.functions.invoke('roambuddy-api', {
          body: { action: 'test' }
        });
        
        console.log('API Test Result:', testResult);
        
        if (testResult.data?.success) {
          setApiStatus('connected');
          toast({
            title: "✅ RoamBuddy Connected",
            description: "Live API integration active with real eSIM products",
          });
          
          // Fetch real products from RoamBuddy API
          const productsResult = await supabase.functions.invoke('roambuddy-api', {
            body: { action: 'getAllProducts' }
          });
          
          console.log('Products Result:', productsResult);
          
          if (productsResult.data?.success && productsResult.data?.data) {
            setRealTimeServices(productsResult.data.data);
            console.log('Real RoamBuddy products loaded:', productsResult.data.data);
          }
        } else {
          setApiStatus('disconnected');
          console.log('API test failed:', testResult);
          
          // Try authentication
          const authResult = await supabase.functions.invoke('roambuddy-api', {
            body: { action: 'authenticate' }
          });
          
          console.log('Auth Result:', authResult);
          
          if (authResult.data?.success) {
            setApiStatus('connected');
            toast({
              title: "🔑 RoamBuddy Authenticated",
              description: "Successfully connected to RoamBuddy partner API",
            });
          }
        }
      } catch (error) {
        console.error('API initialization error:', error);
        setApiStatus('error');
        toast({
          title: "⚠️ API Connection Issue",
          description: "Using demo data while troubleshooting connection",
          variant: "destructive"
        });
      }
    };

    initializeRoamBuddyAPI();
  }, []);

  const esimPlans = [
    {
      id: "sa-explorer",
      name: "South Africa Explorer",
      subtitle: "Perfect for wellness retreats",
      data: "10GB",
      duration: "30 days",
      price: 49,
      originalPrice: 65,
      features: ["High-speed 4G/5G", "Instant activation", "No roaming charges", "24/7 support"],
      popular: true,
      flag: "🇿🇦"
    },
    {
      id: "sa-essential",
      name: "Cape Town Essential",
      subtitle: "City breaks & day tours",
      data: "5GB",
      duration: "14 days",
      price: 29,
      originalPrice: 39,
      features: ["4G/5G speeds", "Instant setup", "Local rates", "Multi-device"],
      popular: false,
      flag: "🇿🇦"
    },
    {
      id: "africa-nomad",
      name: "Africa Nomad",
      subtitle: "Multi-country adventures",
      data: "15GB",
      duration: "45 days",
      price: 89,
      originalPrice: 120,
      features: ["20+ African countries", "Premium speeds", "Unlimited sharing", "Concierge support"],
      popular: false,
      flag: "🌍"
    }
  ];

  const globalPlans = [
    {
      id: "global-wellness",
      name: "Global Wellness",
      subtitle: "Worldwide spiritual journeys",
      data: "20GB",
      duration: "60 days",
      price: 149,
      originalPrice: 199,
      features: ["180+ countries", "Premium 5G", "Unlimited hotspot", "Priority support"],
      popular: true,
      flag: "🌐"
    },
    {
      id: "global-starter",
      name: "Global Starter",
      subtitle: "Short international trips",
      data: "8GB",
      duration: "30 days",
      price: 79,
      originalPrice: 99,
      features: ["120+ countries", "4G/5G speeds", "Multi-device", "Easy activation"],
      popular: false,
      flag: "🌐"
    }
  ];

  const handlePurchase = async (planId: string, planName: string, price: number) => {
    setSelectedPlan(planId);
    
    try {
      // Find the plan details
      const allPlans = [...esimPlans, ...globalPlans];
      const plan = allPlans.find(p => p.id === planId);
      
      if (!plan) {
        throw new Error('Plan not found');
      }

      // Create Stripe payment session
      const paymentResult = await supabase.functions.invoke('create-payment', {
        body: {
          productData: {
            id: planId,
            name: planName,
            price: price,
            currency: 'USD',
            category: 'esim',
            data_amount: plan.data,
            validity_days: parseInt(plan.duration.split(' ')[0]),
            coverage: plan.flag === '🇿🇦' ? ['South Africa'] : plan.flag === '🌍' ? ['Africa Multi-Country'] : ['Global'],
            destination: plan.flag === '🇿🇦' ? 'South Africa' : plan.flag === '🌍' ? 'Africa' : 'Global'
          },
          customerData: {
            email: 'customer@omniwellnessmedia.com', // In production, get from auth
            name: 'Wellness Traveler'
          },
          successUrl: `${window.location.origin}/payment-success`,
          cancelUrl: `${window.location.origin}/data-products`
        }
      });
      
      if (paymentResult.data?.url) {
        toast({
          title: "🔒 Secure Checkout",
          description: `Redirecting to secure payment for ${planName}...`,
        });
        
        // Open Stripe checkout in a new tab
        window.open(paymentResult.data.url, '_blank');
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
      setSelectedPlan(null);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      toast({
        title: "🔍 Searching destinations...",
        description: `Looking for eSIM plans for "${searchQuery}". Redirecting to browse all plans.`,
      });
      
      // Redirect to the browse all plans page with search query
      setTimeout(() => {
        window.location.href = `/roambuddy-store?search=${encodeURIComponent(searchQuery)}`;
      }, 1500);
    } else {
      toast({
        title: "Enter a destination",
        description: "Please enter a destination to search for eSIM plans.",
        variant: "destructive"
      });
    }
  };

  const PlanCard = ({ plan, isGlobal = false }: { plan: any, isGlobal?: boolean }) => (
    <Card className={`relative transition-all duration-300 hover:shadow-xl hover:scale-105 ${
      plan.popular ? 'ring-2 ring-blue-500 shadow-xl scale-105' : 'hover:shadow-lg'
    } bg-white overflow-hidden group`}>
      {plan.popular && (
        <div className="absolute -top-1 left-0 right-0">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-center py-2 text-sm font-medium">
            ⭐ Most Popular Choice
          </div>
        </div>
      )}
      
      <CardHeader className="text-center pb-4 pt-6">
        <div className="text-4xl mb-4">{plan.flag}</div>
        <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
        <CardDescription className="text-muted-foreground">
          {plan.subtitle}
        </CardDescription>
        
        <div className="flex items-baseline justify-center space-x-2 mt-6">
          <div className="text-4xl font-bold text-center">
            ${plan.price.toLocaleString()}
            <span className="text-lg text-muted-foreground">/month</span>
          </div>
          {plan.originalPrice && (
            <div className="space-y-1">
              <span className="text-lg text-muted-foreground line-through">
                ${plan.originalPrice.toLocaleString()}
              </span>
              <div className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-medium">
                Save ${(plan.originalPrice - plan.price).toLocaleString()}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
          <div className="flex items-center text-blue-600">
            <Wifi className="w-4 h-4 mr-1" />
            <span className="font-medium">{plan.data}</span>
          </div>
          <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
          <div className="flex items-center text-blue-600">
            <Clock className="w-4 h-4 mr-1" />
            <span className="font-medium">{plan.duration}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 px-6 pb-6">
        <ul className="space-y-3 mb-8">
          {plan.features.map((feature: string, index: number) => (
            <li key={index} className="flex items-start text-sm">
              <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
        
        <Button 
          className={`w-full h-12 text-base font-medium transition-all duration-200 ${
            plan.popular 
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg' 
              : 'bg-gray-900 hover:bg-gray-800 text-white'
          }`}
          onClick={() => handlePurchase(plan.id, plan.name, plan.price)}
          disabled={selectedPlan === plan.id}
        >
          {selectedPlan === plan.id ? (
            <div className="flex items-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Processing order...
            </div>
          ) : (
            <>
              <Zap className="w-5 h-5 mr-2" />
              Get instant eSIM
            </>
          )}
        </Button>
        
        <div className="flex items-center justify-center mt-3 space-x-4 text-xs text-muted-foreground">
          <div className="flex items-center">
            <Shield className="w-3 h-3 mr-1" />
            Secure
          </div>
          <div className="flex items-center">
            <CreditCard className="w-3 h-3 mr-1" />
            Instant
          </div>
          <div className="flex items-center">
            <Check className="w-3 h-3 mr-1" />
            No commitment
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header with Navigation */}
      <header className="relative z-10 flex items-center justify-between p-4 lg:p-6 bg-white/80 backdrop-blur-sm">
        <Link to="/" className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
        <div className="text-sm text-gray-500">
          By the creators of <span className="font-semibold text-blue-600">Omni Wellness Media</span>
        </div>
      </header>

      {/* Hero Section - Saily-inspired with Omni branding */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-teal-500 to-cyan-400 min-h-[85vh] flex items-center">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-white/10 rounded-lg"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 lg:px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white space-y-8">
            {/* Special Offer Badge */}
            <div className="inline-flex items-center bg-orange-400 text-orange-900 px-4 py-2 rounded-full text-sm font-medium shadow-lg">
              ⚡ Wellness Traveler Special: 25% OFF
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
              Stay connected on your 
              <span className="block text-yellow-300">wellness journey</span>
            </h1>
            
            <div className="space-y-4">
              <div className="flex items-center text-lg">
                <Check className="w-6 h-6 mr-3 text-green-300 bg-green-600/20 rounded-full p-1" />
                Get <strong className="text-yellow-300">25% off</strong> all wellness eSIM plans
              </div>
              <div className="flex items-center text-lg">
                <Check className="w-6 h-6 mr-3 text-green-300 bg-green-600/20 rounded-full p-1" />
                Plus earn <strong className="text-yellow-300">wellness credits</strong> for future bookings!
              </div>
            </div>
            
            {/* Destination Search */}
            <div className="space-y-4">
              <h3 className="text-xl font-medium">Where are you traveling for wellness?</h3>
              <div className="flex max-w-md">
                <div className="relative flex-1">
                  <Input 
                    placeholder="Search destination (e.g., Cape Town, Bali)"
                    className="bg-white text-gray-900 pr-12 h-14 text-lg border-0 shadow-xl"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <Button 
                    size="sm"
                    className="absolute right-1 top-1 h-12 w-12 bg-orange-400 hover:bg-orange-500 text-orange-900 shadow-lg"
                    onClick={handleSearch}
                  >
                    <Search className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              <p className="text-sm opacity-90">
                Instant activation • No roaming fees • 24/7 wellness support
              </p>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="relative">
            <div className="relative z-10 overflow-hidden rounded-3xl shadow-2xl">
              <img 
                src={IMAGES.wellness.deals} 
                alt="Wellness traveler staying connected with eSIM"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              
              {/* Floating UI Elements */}
              <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">Connected</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">5G • 45ms ping</div>
              </div>
              
              <div className="absolute bottom-6 left-6 bg-orange-400 text-orange-900 rounded-xl p-4 shadow-lg">
                <div className="text-sm font-medium">Save 75% vs roaming</div>
                <div className="text-xs opacity-80">No bill shock • Instant setup</div>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-400/30 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-orange-300/40 rounded-full animate-bounce"></div>
          </div>
        </div>
        
        {/* API Status Indicator */}
        <div className="absolute top-4 right-4 lg:top-6 lg:right-6">
          <div className={`flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            apiStatus === 'connected' ? 'bg-green-500/20 text-green-100' : 
            apiStatus === 'checking' ? 'bg-yellow-500/20 text-yellow-100' : 
            'bg-red-500/20 text-red-100'
          }`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${
              apiStatus === 'connected' ? 'bg-green-300' : 
              apiStatus === 'checking' ? 'bg-yellow-300' : 
              'bg-red-300'
            }`}></div>
            {apiStatus === 'connected' ? 'Live Data' : 
             apiStatus === 'checking' ? 'Connecting...' : 
             'Demo Mode'}
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Choose your perfect data plan</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transparent pricing, instant activation, and coverage that works wherever your wellness journey takes you.
            </p>
          </div>

          <Tabs defaultValue="regional" className="w-full">
            <TabsList className="grid w-full max-w-lg mx-auto grid-cols-2 mb-16 h-14">
              <TabsTrigger value="regional" className="flex items-center text-lg">
                <span className="mr-2">🇿🇦</span>
                South Africa & Regional
              </TabsTrigger>
              <TabsTrigger value="global" className="flex items-center text-lg">
                <span className="mr-2">🌍</span>
                Global Plans
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="regional" className="space-y-12">
              <div className="text-center mb-12">
                <h3 className="text-2xl font-bold mb-4 text-gray-900">South Africa & Africa Regional</h3>
                <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                  Perfect for wellness retreats, safari adventures, and cultural immersions 
                  across the rainbow nation and neighboring countries.
                </p>
              </div>
              
              <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
                {esimPlans.map((plan) => (
                  <PlanCard key={plan.id} plan={plan} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="global" className="space-y-12">
              <div className="text-center mb-12">
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Global Wellness Plans</h3>
                <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                  For the conscious nomad exploring spiritual destinations worldwide. 
                  Stay connected across continents on your transformative journey.
                </p>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {globalPlans.map((plan) => (
                  <PlanCard key={plan.id} plan={plan} isGlobal />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Why eSIM Benefits Section - Redesigned */}
      <section className="py-20 px-4 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">Why eSIM is the Future of Travel</h2>
            <p className="text-xl lg:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
              Avoid roaming bill shock and save over 75% with our premium eSIM solutions. 
              Join millions of smart travelers who've switched to instant, affordable connectivity.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-8 mb-16">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h3 className="font-bold text-xl mb-4 text-green-300">Instant Activation</h3>
              <p className="text-blue-100 leading-relaxed">
                Get connected in seconds. QR code delivered to your email immediately after purchase. 
                No physical SIM cards, no shipping delays, no waiting.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Globe className="w-10 h-10 text-white" />
              </div>
              <h3 className="font-bold text-xl mb-4 text-blue-300">200+ Countries</h3>
              <p className="text-blue-100 leading-relaxed">
                Seamless coverage across 6 continents. Premium partnerships with local carriers 
                ensure reliable, high-speed connectivity wherever your journey takes you.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Wifi className="w-10 h-10 text-white" />
              </div>
              <h3 className="font-bold text-xl mb-4 text-purple-300">5G Premium Speeds</h3>
              <p className="text-blue-100 leading-relaxed">
                Access the fastest networks available. Stream 4K videos, video call family, 
                share memories instantly, and stay productive on the go.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="font-bold text-xl mb-4 text-orange-300">Save Up to 75%</h3>
              <p className="text-blue-100 leading-relaxed">
                Eliminate expensive roaming charges. Pay only for what you need with transparent, 
                upfront pricing. No hidden fees, no bill shock surprises.
              </p>
            </div>
          </div>

          {/* Complete Solution Cards */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-2xl p-8 border border-green-400/30">
              <div className="flex items-center mb-6">
                <Lock className="w-8 h-8 text-green-400 mr-3" />
                <h3 className="text-2xl font-bold text-green-300">🔒 Secure & Private</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-green-100">End-to-end encrypted connections</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-green-100">No public WiFi security risks</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-green-100">Your data stays protected</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl p-8 border border-blue-400/30">
              <div className="flex items-center mb-6">
                <Smartphone className="w-8 h-8 text-blue-400 mr-3" />
                <h3 className="text-2xl font-bold text-blue-300">📱 Easy Setup</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-blue-100">Scan QR code to install</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-blue-100">Works with all eSIM devices</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-blue-100">Keep your regular number active</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl p-8 border border-purple-400/30">
              <div className="flex items-center mb-6">
                <Headphones className="w-8 h-8 text-purple-400 mr-3" />
                <h3 className="text-2xl font-bold text-purple-300">🌟 Premium Support</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-purple-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-purple-100">24/7 multilingual support</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-purple-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-purple-100">Real-time usage monitoring</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-purple-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-purple-100">Easy top-up options</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* CTA Section */}
          <div className="text-center mt-16">
            <h3 className="text-3xl font-bold mb-6 text-white">Ready to Stay Connected?</h3>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Join thousands of conscious travelers who trust our eSIM solutions for their wellness journeys worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/roambuddy-store">
                <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 text-lg font-medium shadow-xl">
                  Browse All Plans
                </Button>
              </Link>
              <Link to="/device-compatibility">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-medium">
                  Check Compatibility
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DataProducts;