import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { Globe, Wifi, Smartphone, MapPin, Clock, Check, Star, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

  const handlePurchase = (planId: string, planName: string, price: number) => {
    setSelectedPlan(planId);
    toast({
      title: "Redirecting to Checkout",
      description: `Processing ${planName} for $${price}...`,
    });
    
    // Here you would integrate with payment processing
    setTimeout(() => {
      setSelectedPlan(null);
      toast({
        title: "Success!",
        description: "Your eSIM will be delivered instantly via email.",
      });
    }, 2000);
  };

  const PlanCard = ({ plan, isGlobal = false }: { plan: any, isGlobal?: boolean }) => (
    <Card className={`relative transition-all duration-300 hover:shadow-lg ${plan.popular ? 'ring-2 ring-primary scale-105' : ''}`}>
      {plan.popular && (
        <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gradient-primary text-white">
          <Star className="w-3 h-3 mr-1" />
          Most Popular
        </Badge>
      )}
      
      <CardHeader className="text-center pb-4">
        <div className="text-2xl mb-2">{plan.flag}</div>
        <CardTitle className="text-xl">{plan.name}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {plan.subtitle}
        </CardDescription>
        
        <div className="flex items-center justify-center space-x-2 mt-4">
          <span className="text-3xl font-bold text-primary">${plan.price}</span>
          {plan.originalPrice && (
            <span className="text-lg text-muted-foreground line-through">
              ${plan.originalPrice}
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-center space-x-4 mt-2 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Wifi className="w-4 h-4 mr-1" />
            {plan.data}
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {plan.duration}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <ul className="space-y-2 mb-6">
          {plan.features.map((feature: string, index: number) => (
            <li key={index} className="flex items-center text-sm">
              <Check className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
        
        <Button 
          className="w-full bg-gradient-primary hover:bg-gradient-primary/90"
          onClick={() => handlePurchase(plan.id, plan.name, plan.price)}
          disabled={selectedPlan === plan.id}
        >
          {selectedPlan === plan.id ? (
            <div className="flex items-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Processing...
            </div>
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2" />
              Get Instant eSIM
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <div className={`inline-flex items-center px-4 py-2 rounded-full mb-6 ${
            apiStatus === 'connected' ? 'bg-green-100 text-green-700' : 
            apiStatus === 'checking' ? 'bg-yellow-100 text-yellow-700' : 
            'bg-red-100 text-red-700'
          }`}>
            <Globe className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">
              {apiStatus === 'connected' ? 'RoamBuddy API Connected ✓' : 
               apiStatus === 'checking' ? 'Checking RoamBuddy API...' : 
               'API Connection Failed - Using Demo Data'}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Stay Connected on Your
            <br />
            Wellness Journey
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Premium eSIM data plans designed for conscious travelers. Instant activation, 
            global coverage, and seamless connectivity for your transformative experiences.
          </p>
          
          <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Smartphone className="w-5 h-5 mr-2 text-primary" />
              Instant Activation
            </div>
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-primary" />
              200+ Countries
            </div>
            <div className="flex items-center">
              <Wifi className="w-5 h-5 mr-2 text-primary" />
              5G Speeds
            </div>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <Tabs defaultValue="regional" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
              <TabsTrigger value="regional" className="flex items-center">
                <span className="mr-2">🇿🇦</span>
                South Africa & Regional
              </TabsTrigger>
              <TabsTrigger value="global" className="flex items-center">
                <span className="mr-2">🌍</span>
                Global Plans
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="regional" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">South Africa & Africa Regional</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Perfect for wellness retreats, safari adventures, and cultural immersions 
                  across the rainbow nation and neighboring countries.
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {esimPlans.map((plan) => (
                  <PlanCard key={plan.id} plan={plan} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="global" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Global Wellness Plans</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  For the conscious nomad exploring spiritual destinations worldwide. 
                  Stay connected across continents on your transformative journey.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {globalPlans.map((plan) => (
                  <PlanCard key={plan.id} plan={plan} isGlobal />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">Why Choose Our eSIM Data?</h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold">Instant Activation</h3>
              <p className="text-sm text-muted-foreground">
                Receive your eSIM within minutes via email. No waiting, no shipping delays.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold">Global Coverage</h3>
              <p className="text-sm text-muted-foreground">
                Stay connected in 200+ countries with premium local carrier networks.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Wifi className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold">5G Speeds</h3>
              <p className="text-sm text-muted-foreground">
                Experience blazing-fast internet speeds for streaming, sharing, and staying connected.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold">No Contracts</h3>
              <p className="text-sm text-muted-foreground">
                Flexible plans with no long-term commitments. Pay only for what you need.
              </p>
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