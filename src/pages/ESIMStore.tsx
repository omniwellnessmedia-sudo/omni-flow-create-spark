import { useState, useEffect } from 'react';
import UnifiedNavigation from "@/components/navigation/UnifiedNavigation";
import Footer from "@/components/Footer";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Shield, Sparkles, HeadphonesIcon, Globe, Check, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ESIMProduct {
  id: string;
  name: string;
  dataAmount: string;
  validity: string;
  price: number;
  destination: string;
  coverage: string[];
  peaceOfMindScore: number;
  wellnessFeatures: string[];
}

const curators = [
  {
    name: "Zenith",
    role: "Retreat Coordination",
    expertise: "Wellness Travel",
    avatar: "/placeholder.svg",
    recommendation: "Best for Retreat Travelers",
    quote: "Perfect connectivity for transformative journeys"
  },
  {
    name: "Chad",
    role: "Content & Strategy",
    expertise: "Cultural Exploration",
    avatar: "/placeholder.svg",
    recommendation: "Best for Cultural Explorers",
    quote: "Stay connected while documenting authentic experiences"
  },
  {
    name: "Abbi",
    role: "Content Development",
    expertise: "Digital Nomad Life",
    avatar: "/placeholder.svg",
    recommendation: "Best for Digital Nomads",
    quote: "Reliable connectivity for remote wellness work"
  }
];

export default function ESIMStore() {
  const [products, setProducts] = useState<ESIMProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDestination, setSelectedDestination] = useState<string>('south-africa');
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('roambuddy-api', {
        body: { action: 'getAllProducts' }
      });

      if (error) throw error;

      if (data?.success && data?.data) {
        const formattedProducts = data.data.map((p: any) => ({
          id: p.id,
          name: p.name || p.productName,
          dataAmount: p.data || '1GB',
          validity: `${p.validity || 30} days`,
          price: p.price || 0,
          destination: getDestinationFromProduct(p),
          coverage: p.countries || [],
          peaceOfMindScore: calculatePeaceScore(p),
          wellnessFeatures: getWellnessFeatures(p)
        }));
        setProducts(formattedProducts);
      }
    } catch (error) {
      console.error('Error fetching eSIM products:', error);
      toast({
        title: "Error loading products",
        description: "Using demo products for now",
        variant: "destructive",
      });
      // Load demo products
      setProducts(getDemoProducts());
    } finally {
      setLoading(false);
    }
  };

  const getDestinationFromProduct = (product: any): string => {
    const name = product.name?.toLowerCase() || '';
    if (name.includes('south africa')) return 'south-africa';
    if (name.includes('africa')) return 'africa';
    if (name.includes('europe')) return 'europe';
    if (name.includes('asia')) return 'asia';
    return 'global';
  };

  const calculatePeaceScore = (product: any): number => {
    let score = 70;
    if (product.validity >= 30) score += 10;
    if (product.countries?.length > 5) score += 10;
    if (product.support24x7) score += 10;
    return Math.min(score, 100);
  };

  const getWellnessFeatures = (product: any): string[] => {
    const features = [
      "Instant activation",
      "No physical SIM needed",
      "24/7 wellness support"
    ];
    if (product.validity >= 30) features.push("Extended retreat coverage");
    if (product.countries?.length > 1) features.push("Multi-country coverage");
    return features;
  };

  const getDemoProducts = (): ESIMProduct[] => [
    {
      id: 'za-1gb',
      name: 'South Africa Wellness Plan',
      dataAmount: '1GB',
      validity: '7 days',
      price: 149,
      destination: 'south-africa',
      coverage: ['South Africa'],
      peaceOfMindScore: 85,
      wellnessFeatures: ['Instant activation', 'Retreat-ready', 'Local support']
    },
    {
      id: 'za-3gb',
      name: 'South Africa Extended Stay',
      dataAmount: '3GB',
      validity: '30 days',
      price: 399,
      destination: 'south-africa',
      coverage: ['South Africa'],
      peaceOfMindScore: 90,
      wellnessFeatures: ['Extended coverage', 'Perfect for retreats', 'Wellness app optimized']
    },
    {
      id: 'africa-5gb',
      name: 'Africa Regional Wellness',
      dataAmount: '5GB',
      validity: '30 days',
      price: 799,
      destination: 'africa',
      coverage: ['South Africa', 'Kenya', 'Tanzania', 'Morocco', 'Egypt'],
      peaceOfMindScore: 95,
      wellnessFeatures: ['Multi-country', 'Cultural exploration', 'Full retreat support']
    }
  ];

  const filteredProducts = products.filter(p => p.destination === selectedDestination);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/20">
      <UnifiedNavigation />
      
      {/* Hero Section - ROAM Branding */}
      <Section size="large" className="pt-32 pb-16">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
            🧭 ROAM by Omni
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground">
            🧭 Stay Connected to Your Wellness Journey
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connectivity curated for mindful explorers, retreat attendees, and wellness professionals
          </p>
        </div>
      </Section>


      {/* Trust Badges - ROAM Wellness Focus */}
      <Section size="breathable" background="white">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: '🧘', label: 'Retreat-Ready' },
            { icon: '🌿', label: 'Wellness Optimized' },
            { icon: '🧭', label: 'Curator Picks' },
            { icon: '✨', label: 'Peace of Mind' }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-3xl">{item.icon}</span>
              </div>
              <p className="text-sm font-medium text-foreground">{item.label}</p>
            </div>
          ))}
        </div>
      </Section>


      {/* Meet Your Curators - ROAM Branding */}
      <Section size="large" background="gradient">
        <div className="text-center mb-8">
          <Badge className="mb-4 bg-primary/10 text-primary">🧭 Guided by Roam & Our Wellness Team</Badge>
        </div>
        <h2 className="text-4xl font-bold text-center mb-12 text-foreground">
          Your Wellness Connectivity Curators
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {curators.map((curator, idx) => (
            <Card key={idx} className="hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-8 text-center space-y-6">
                {/* Enlarged Avatar with Gradient Ring */}
                <div className="relative mx-auto w-40 h-40">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-primary rounded-full opacity-75 group-hover:opacity-100 blur-sm transition-opacity duration-500" />
                  <Avatar className="relative w-40 h-40 border-4 border-background shadow-xl group-hover:scale-105 transition-transform duration-500">
                    <AvatarImage src={curator.avatar} alt={curator.name} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-4xl font-bold">
                      {curator.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-foreground">{curator.name}</h3>
                  <p className="text-sm font-medium text-primary">{curator.role}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    {curator.expertise}
                  </p>
                </div>
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  {curator.recommendation}
                </Badge>
                <p className="text-sm text-muted-foreground italic">"{curator.quote}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* Why Travel Well Connected */}
      <Section size="large" background="white">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-4xl font-bold text-foreground">Why Travel Well Connected?</h2>
          <p className="text-lg text-muted-foreground">
            Stay present, stay connected, stay well. Our eSIM plans are designed with wellness travelers in mind.
          </p>
          <div className="grid md:grid-cols-2 gap-6 mt-8 text-left">
            {[
              "No roaming charges or hidden fees",
              "Wellness app optimization (meditation, fitness)",
              "Instant setup - no physical SIM swap",
              "24/7 support for peace of mind",
              "Multi-country coverage for explorers",
              "Eco-friendly digital solution"
            ].map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <span className="text-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Destination Selector & Products */}
      <Section size="large" background="gradient">
        <Tabs value={selectedDestination} onValueChange={setSelectedDestination} className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-5 mb-12">
            <TabsTrigger value="south-africa">South Africa</TabsTrigger>
            <TabsTrigger value="africa">Africa</TabsTrigger>
            <TabsTrigger value="europe">Europe</TabsTrigger>
            <TabsTrigger value="asia">Asia</TabsTrigger>
            <TabsTrigger value="global">Global</TabsTrigger>
          </TabsList>

          {['south-africa', 'africa', 'europe', 'asia', 'global'].map(dest => (
            <TabsContent key={dest} value={dest}>
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4 text-muted-foreground">Loading wellness plans...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No plans available for this destination yet.</p>
                  <p className="text-sm text-muted-foreground mt-2">Check back soon or contact us for custom plans.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-3 gap-6">
                  {filteredProducts.map(product => (
                    <Card key={product.id} className="hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-6 space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-lg text-foreground">{product.name}</h3>
                            <Badge className="mt-2 bg-primary/10 text-primary">
                              Peace Score: {product.peaceOfMindScore}%
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Data:</span>
                            <span className="font-medium text-foreground">{product.dataAmount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Validity:</span>
                            <span className="font-medium text-foreground">{product.validity}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Coverage:</span>
                            <span className="font-medium text-foreground">
                              {product.coverage.length} {product.coverage.length === 1 ? 'country' : 'countries'}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-xs font-medium text-muted-foreground">Wellness Features:</p>
                          <div className="flex flex-wrap gap-1">
                            {product.wellnessFeatures.map((feature, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="pt-4 border-t">
                          <div className="flex items-baseline justify-between mb-3">
                            <span className="text-2xl font-bold text-foreground">R{product.price}</span>
                            <span className="text-xs text-muted-foreground">ZAR</span>
                          </div>
                          <Button className="w-full" variant="premium">
                            Get This Plan
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </Section>

      {/* Consultation CTA */}
      <Section size="large" background="white">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <MessageCircle className="w-16 h-16 text-primary mx-auto" />
          <h2 className="text-3xl font-bold text-foreground">Not Sure Which Plan Is Right?</h2>
          <p className="text-lg text-muted-foreground">
            Our wellness travel team is here to help you find the perfect connectivity solution for your journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="premium">
              Talk to Omni Wellness Team
            </Button>
            <Button size="lg" variant="outline">
              View Coverage Map
            </Button>
          </div>
        </div>
      </Section>

      <Footer />
    </div>
  );
}
