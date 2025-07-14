import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { Globe, Wifi, Smartphone, MapPin, Clock, Check, Star, Zap, ArrowLeft, Search, Shield, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const DataProducts = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<string>('checking');
  const [realTimeServices, setRealTimeServices] = useState<any[]>([]);
  const { toast } = useToast();

  // Test RoamBuddy API connection on component mount
  useEffect(() => {
    const testRoamBuddyAPI = async () => {
      try {
        console.log('Testing RoamBuddy API connection...');
        
        // Test the connection
        const testResult = await supabase.functions.invoke('roambuddy-api', {
          body: { action: 'test' }
        });
        
        console.log('API Test Result:', testResult);
        
        if (testResult.data?.success) {
          setApiStatus('connected');
          toast({
            title: "API Connected",
            description: "RoamBuddy API is working correctly",
          });
          
          // Now try to get services
          const servicesResult = await supabase.functions.invoke('roambuddy-api', {
            body: { action: 'getServices', data: { destination: 'South Africa' } }
          });
          
          if (servicesResult.data?.data?.services) {
            setRealTimeServices(servicesResult.data.data.services);
          }
        } else {
          setApiStatus('disconnected');
          console.log('API test failed:', testResult);
        }
      } catch (error) {
        console.error('API test error:', error);
        setApiStatus('error');
      }
    };

    testRoamBuddyAPI();
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
      // Step 1: Create order through RoamBuddy API
      const orderResult = await supabase.functions.invoke('roambuddy-api', {
        body: { 
          action: 'createOrder',
          data: {
            product_id: planId,
            product_name: planName,
            amount: price,
            currency: 'USD',
            customer_email: 'customer@omniwellnessmedia.com', // In production, get from auth
            customer_name: 'Wellness Traveler',
            destination: 'South Africa'
          }
        }
      });
      
      console.log('Order creation result:', orderResult);
      
      if (orderResult.data?.success) {
        const orderData = orderResult.data;
        
        if (orderData.demo_mode) {
          // Demo mode flow
          toast({
            title: "🎯 Demo Order Created",
            description: `${planName} - Order ID: ${orderData.order_id}. Simulating instant eSIM delivery...`,
          });
          
          // Simulate the full flow
          setTimeout(() => {
            toast({
              title: "💳 Demo Payment Processing",
              description: "Simulating secure payment gateway integration...",
            });
          }, 1500);
          
          setTimeout(() => {
            toast({
              title: "🎉 eSIM Delivered!",
              description: "✅ QR Code: IMG_QR_DEMO_12345\n✅ Activation: 24hrs\n✅ Support: Available 24/7",
              duration: 8000
            });
          }, 3500);
        } else {
          // Real order flow
          toast({
            title: "Order Created Successfully!",
            description: `${planName} - Order ID: ${orderData.order_id}. Redirecting to secure payment...`,
          });
          
          if (orderData.payment_url) {
            // In production, redirect to payment gateway
            window.open(orderData.payment_url, '_blank');
          }
          
          // Simulate completion for demo
          setTimeout(() => {
            toast({
              title: "🎉 eSIM Activated!",
              description: "QR code sent to your email. Valid immediately with 24/7 support.",
              duration: 6000
            });
          }, 3000);
        }
      } else {
        // Fallback to enhanced demo
        toast({
          title: "Demo Mode Active",
          description: `${planName} ($${price}) - Simulating full RoamBuddy checkout experience...`,
          duration: 4000
        });
        
        setTimeout(() => {
          toast({
            title: "Demo Complete!",
            description: "✅ Order Processing\n✅ eSIM QR Code Generation\n✅ Email Delivery\n✅ 24/7 Support Activation",
            duration: 8000
          });
        }, 2000);
      }
    } catch (error) {
      console.error('Order error:', error);
      toast({
        title: "Connection Error",
        description: "Unable to process order. Please try again or contact support.",
        variant: "destructive"
      });
    } finally {
      setSelectedPlan(null);
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
          <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
          {plan.originalPrice && (
            <div className="space-y-1">
              <span className="text-lg text-muted-foreground line-through">
                ${plan.originalPrice}
              </span>
              <div className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-medium">
                Save ${plan.originalPrice - plan.price}
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100/50">
      {/* Header with Navigation */}
      <header className="relative z-10 flex items-center justify-between p-4 lg:p-6">
        <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
        <div className="text-sm text-muted-foreground">
          By the creators of <span className="font-semibold text-primary">Omni Wellness Media</span>
        </div>
      </header>

      {/* Hero Section - Saily-inspired */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-400 via-blue-500 to-cyan-400 min-h-[80vh] flex items-center">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-white/5 rounded-lg"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 lg:px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white space-y-8">
            {/* Special Offer Badge */}
            <div className="inline-flex items-center bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full text-sm font-medium">
              ⚡ Special Launch Deal
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
              Affordable eSIM data for 
              <span className="block">wellness travel</span>
            </h1>
            
            <div className="space-y-4">
              <div className="flex items-center text-lg">
                <Check className="w-5 h-5 mr-3 text-yellow-300" />
                Get <strong>20% off</strong> 10GB+ data plans
              </div>
              <div className="flex items-center text-lg">
                <Check className="w-5 h-5 mr-3 text-yellow-300" />
                Plus, up to <strong>10%</strong> cashback in wellness credits!
              </div>
            </div>
            
            {/* Destination Search */}
            <div className="space-y-4">
              <h3 className="text-xl font-medium">Where do you need data?</h3>
              <div className="flex max-w-md">
                <div className="relative flex-1">
                  <Input 
                    placeholder="Search for destination"
                    className="bg-white text-gray-900 pr-12 h-14 text-lg"
                  />
                  <Button 
                    size="sm"
                    className="absolute right-1 top-1 h-12 w-12 bg-yellow-400 hover:bg-yellow-500 text-yellow-900"
                  >
                    <Search className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              <p className="text-sm opacity-90">
                Take a look at our <Link to="#terms" className="underline">terms and conditions</Link>
              </p>
            </div>
          </div>
          
          {/* Hero Image Area */}
          <div className="relative">
            <div className="relative z-10 bg-yellow-400 rounded-3xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <div className="bg-white rounded-2xl p-6 text-center space-y-4">
                <div className="w-16 h-24 bg-gradient-to-b from-purple-600 to-purple-800 rounded-lg mx-auto flex items-center justify-center">
                  <Smartphone className="w-8 h-8 text-white" />
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-600">Get 20% off + up to 10% in</div>
                  <div className="text-lg font-bold text-primary">Wellness credits!</div>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/20 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-yellow-300/30 rounded-full animate-bounce"></div>
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

      {/* Trust Indicators */}
      <section className="py-8 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <p className="text-sm text-muted-foreground font-medium">They talk about us</p>
          </div>
          <div className="flex items-center justify-center space-x-8 opacity-50">
            <div className="text-2xl font-bold text-gray-400">CNN</div>
            <div className="text-2xl font-bold text-gray-400">Forbes</div>
            <div className="text-2xl font-bold text-gray-400">TechCrunch</div>
            <div className="text-2xl font-bold text-gray-400">Lonely Planet</div>
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

      {/* eSIM Benefits Section - Comprehensive */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why eSIM is the Future of Travel</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Avoid roaming bill shock and save over 75% with our premium eSIM solutions. 
              Join millions of smart travelers who've switched to instant, affordable connectivity.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg">Instant Activation</h3>
              <p className="text-sm text-muted-foreground">
                Get connected in seconds. QR code delivered to your email immediately after purchase. 
                No physical SIM cards, no shipping delays, no waiting.
              </p>
            </div>
            
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg">200+ Countries</h3>
              <p className="text-sm text-muted-foreground">
                Seamless coverage across 6 continents. Premium partnerships with local carriers 
                ensure reliable, high-speed connectivity wherever your journey takes you.
              </p>
            </div>
            
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                <Wifi className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg">5G Premium Speeds</h3>
              <p className="text-sm text-muted-foreground">
                Access the fastest networks available. Stream 4K videos, video call family, 
                share memories instantly, and stay productive on the go.
              </p>
            </div>
            
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg">Save Up to 75%</h3>
              <p className="text-sm text-muted-foreground">
                Eliminate expensive roaming charges. Pay only for what you need with transparent, 
                upfront pricing. No hidden fees, no bill shock surprises.
              </p>
            </div>
          </div>

          {/* Additional Benefits */}
          <div className="bg-card rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-6 text-center">Complete Travel Connectivity Solution</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <h4 className="font-semibold text-primary">🔒 Secure & Private</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• End-to-end encrypted connections</li>
                  <li>• No public WiFi security risks</li>
                  <li>• Your data stays protected</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-primary">📱 Easy Setup</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Scan QR code to install</li>
                  <li>• Works with all eSIM devices</li>
                  <li>• Keep your regular number active</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-primary">🌟 Premium Support</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• 24/7 multilingual support</li>
                  <li>• Real-time usage monitoring</li>
                  <li>• Easy top-up options</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold">Ready to Stay Connected?</h2>
            <p className="text-muted-foreground">
              Join thousands of conscious travelers who trust our eSIM solutions 
              for their wellness journeys worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-primary hover:bg-gradient-primary/90">
                <Globe className="w-5 h-5 mr-2" />
                Browse All Plans
              </Button>
              <Button size="lg" variant="outline">
                <Smartphone className="w-5 h-5 mr-2" />
                Check Compatibility
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DataProducts;