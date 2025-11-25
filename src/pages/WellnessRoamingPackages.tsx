import React, { useState, useEffect } from 'react';
import { ShoppingCart, MapPin, Star, Clock, Users, Wifi, Car, Plane, Camera, Shield, Phone, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { IMAGES } from '@/lib/images';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';

interface RoamBuddyService {
  id: string;
  service_id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  destination: string;
  features: string[];
  rating: number;
  image_url?: string;
  duration?: string;
  includes?: string[];
}

const WellnessRoamingPackages = () => {
  const [services, setServices] = useState<RoamBuddyService[]>([]);
  const [filteredServices, setFilteredServices] = useState<RoamBuddyService[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<RoamBuddyService[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [destinationFilter, setDestinationFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchTravelWellConnectedServices();
  }, []);

  useEffect(() => {
    filterServices();
  }, [services, searchTerm, categoryFilter, priceFilter, destinationFilter]);

  const fetchTravelWellConnectedServices = async () => {
    try {
      setLoading(true);
      
      // Try to fetch from Travel Well Connected API
      const { data, error } = await supabase.functions.invoke('roambuddy-api', {
        body: {
          action: 'getServices',
          data: { destination: 'Cape Town' }
        }
      });

      if (data?.success && data?.data?.services) {
        setServices(data.data.services);
      } else {
        // Fallback to comprehensive mock data showcasing Travel Well Connected services
        const mockServices: RoamBuddyService[] = [
          // Transportation Services with Wellness Focus
          {
            id: '1',
            service_id: 'wellness-airport-transfer',
            name: 'Mindful Airport Transfer',
            description: 'Peaceful luxury transfer with meditation music and wellness amenities',
            price: 1400,
            category: 'Transportation',
            destination: 'Cape Town',
            features: ['Meditation music', 'Aromatherapy', 'Healthy refreshments', 'Mindful driver'],
            rating: 4.9,
            duration: '1 hour',
            includes: ['Door-to-door service', 'Wellness kit', 'Peace of mind guarantee'],
            image_url: 'https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/community%20outing%202.jpg'
          },
          {
            id: '2',
            service_id: 'car-rental-4x4',
            name: '4x4 Safari Vehicle Rental',
            description: 'Fully equipped 4x4 vehicle for adventure tours and safaris',
            price: 2250,
            category: 'Transportation',
            destination: 'Cape Town',
            features: ['4WD capability', 'GPS navigation', 'Camping equipment', 'Emergency kit'],
            rating: 4.7,
            duration: 'Per day',
            includes: ['Insurance', 'Unlimited mileage', 'Roadside assistance'],
            image_url: 'https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/Tours/muizenberg%20cave%20tours/muizenberg%20cave%20%20view%201.jpg'
          },
          
          // Accommodation Services
          {
            id: '3',
            service_id: 'eco-lodge-booking',
            name: 'Sustainable Eco-Lodge Stay',
            description: 'Environmentally conscious accommodation with wellness focus',
            price: 3400,
            category: 'Accommodation',
            destination: 'Cape Town',
            features: ['Solar powered', 'Organic meals', 'Spa services', 'Yoga classes'],
            rating: 4.8,
            duration: 'Per night',
            includes: ['Breakfast', 'Wi-Fi', 'Airport shuttle'],
            image_url: 'https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/Wellness%20retreat3%20portrait.jpg'
          },
          {
            id: '4',
            service_id: 'wellness-retreat-center',
            name: 'Holistic Wellness Retreat Center',
            description: 'Complete wellness facility with healing and meditation spaces',
            price: 4700,
            category: 'Accommodation',
            destination: 'Cape Town',
            features: ['Meditation halls', 'Healing gardens', 'Spa treatments', 'Healthy cuisine'],
            rating: 5.0,
            duration: 'Per night',
            includes: ['All meals', 'Daily yoga', 'Spa access', 'Healing sessions'],
            image_url: 'https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/Wellness%20retreat%202.jpg'
          },

          // Experience Services
          {
            id: '5',
            service_id: 'wine-tour-premium',
            name: 'Premium Wine & Wellness Tour',
            description: 'Curated wine tasting experience with wellness elements',
            price: 1780,
            category: 'Experiences',
            destination: 'Cape Town',
            features: ['Private guide', 'Organic wineries', 'Healthy lunch', 'Transportation'],
            rating: 4.6,
            duration: '6 hours',
            includes: ['Wine tastings', 'Gourmet lunch', 'Transportation', 'Guide'],
            image_url: 'https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/wellness%20group%20tour.jpg'
          },
          {
            id: '6',
            service_id: 'table-mountain-hiking',
            name: 'Guided Table Mountain Wellness Hike',
            description: 'Mindful hiking experience with meditation and breathwork',
            price: 1220,
            category: 'Experiences',
            destination: 'Cape Town',
            features: ['Certified guide', 'Meditation session', 'Healthy snacks', 'Photography'],
            rating: 4.8,
            duration: '4 hours',
            includes: ['Professional guide', 'Snacks', 'Water', 'First aid'],
            image_url: 'https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/group%20tour%20amazing%20cave%20view%20muizenberg.jpg'
          },

          // Technology Services
          {
            id: '7',
            service_id: 'wellness-app-package',
            name: 'Digital Wellness Travel Companion',
            description: 'Comprehensive app with local wellness guides and booking',
            price: 470,
            category: 'Technology',
            destination: 'Cape Town',
            features: ['Offline maps', 'Wellness directory', 'Booking system', 'Emergency contacts'],
            rating: 4.5,
            duration: '30 days access',
            includes: ['App license', 'Premium features', 'Customer support'],
            image_url: 'https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/khoe%20indigenous%20language%20heritage%20experience%206.jpg'
          },
          {
            id: '8',
            service_id: 'local-sim-unlimited',
            name: 'Unlimited Data SIM Card',
            description: 'High-speed internet access for wellness app and navigation',
            price: 660,
            category: 'Technology',
            destination: 'Cape Town',
            features: ['Unlimited data', '5G network', 'Hotspot capable', 'International calls'],
            rating: 4.3,
            duration: '30 days',
            includes: ['SIM card', 'Activation', 'Customer support'],
            image_url: 'https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/khoe%20indigenous%20language%20heritage%20experience%207.jpg'
          },

          // Insurance & Safety
          {
            id: '9',
            service_id: 'comprehensive-travel-insurance',
            name: 'Wellness Travel Insurance',
            description: 'Comprehensive coverage including adventure activities and wellness treatments',
            price: 1600,
            category: 'Insurance',
            destination: 'Cape Town',
            features: ['Adventure coverage', 'Medical expenses', 'Trip cancellation', 'Equipment protection'],
            rating: 4.9,
            duration: 'Trip duration',
            includes: ['24/7 support', 'Emergency evacuation', 'Pre-existing conditions'],
            image_url: 'https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/indigenous%20tour%20chief%20kingsley%20explaining.jpg'
          },
          {
            id: '10',
            service_id: 'personal-safety-device',
            name: 'Personal Safety & Wellness Tracker',
            description: 'GPS tracking device with emergency features and wellness monitoring',
            price: 850,
            category: 'Safety',
            destination: 'Cape Town',
            features: ['GPS tracking', 'Emergency button', 'Health monitoring', 'Weather alerts'],
            rating: 4.4,
            duration: 'Trip duration',
            includes: ['Device rental', 'Emergency monitoring', 'Mobile app'],
            image_url: 'https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/Chief%20Kingsley%20amazing%20portrait.jpg'
          },

          // Wellness Specific Services
          {
            id: '11',
            service_id: 'traditional-healing-session',
            name: 'Traditional African Healing Experience',
            description: 'Authentic healing session with certified traditional healers',
            price: 2800,
            category: 'Wellness',
            destination: 'Cape Town',
            features: ['Certified healer', 'Sacred ceremony', 'Herbal remedies', 'Cultural education'],
            rating: 5.0,
            duration: '3 hours',
            includes: ['Healing session', 'Herbal kit', 'Cultural guide', 'Certificate'],
            image_url: 'https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/feroza%20begg%20-%20portrait.jpg'
          },
          {
            id: '12',
            service_id: 'sound-healing-retreat',
            name: 'Sound Healing & Meditation Retreat',
            description: 'Transformative sound healing experience in natural settings',
            price: 2250,
            category: 'Wellness',
            destination: 'Cape Town',
            features: ['Crystal bowls', 'Nature setting', 'Guided meditation', 'Energy work'],
            rating: 4.9,
            duration: '2 hours',
            includes: ['Sound session', 'Meditation guide', 'Herbal tea', 'Take-home audio'],
            image_url: 'https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/chad%20cupido%20portrait.jpg'
          }
        ];

        setServices(mockServices);
      }
    } catch (error) {
      console.error('Error fetching Travel Well Connected services:', error);
      toast({
        title: "Connection Info",
        description: "Showing Travel Well Connected demo services.",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterServices = () => {
    let filtered = services;

    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(service => service.category === categoryFilter);
    }

    if (priceFilter !== 'all') {
      switch (priceFilter) {
        case 'under-50':
          filtered = filtered.filter(service => service.price < 950);
          break;
        case '50-100':
          filtered = filtered.filter(service => service.price >= 950 && service.price <= 1900);
          break;
        case 'over-100':
          filtered = filtered.filter(service => service.price > 1900);
          break;
      }
    }

    if (destinationFilter !== 'all') {
      filtered = filtered.filter(service => service.destination === destinationFilter);
    }

    setFilteredServices(filtered);
  };

  const addToCart = (service: RoamBuddyService) => {
    if (!cart.find(item => item.id === service.id)) {
      setCart([...cart, service]);
      toast({
        title: "Added to Cart",
        description: `${service.name} has been added to your cart.`,
      });
    } else {
      toast({
        title: "Already in Cart",
        description: `${service.name} is already in your cart.`,
        variant: "destructive",
      });
    }
  };

  const removeFromCart = (serviceId: string) => {
    setCart(cart.filter(item => item.id !== serviceId));
    toast({
      title: "Removed from Cart",
      description: "Service has been removed from your cart.",
    });
  };

  const getCartTotal = () => {
    return cart.reduce((total, service) => total + service.price, 0);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add services to your cart before checkout.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Here you would typically create a Stripe checkout session
      toast({
        title: "Checkout Coming Soon",
        description: "Checkout functionality will be available shortly.",
      });
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout Error",
        description: "Unable to process checkout. Please try again.",
        variant: "destructive",
      });
    }
  };

  const categories = [...new Set(services.map(service => service.category))];
  const destinations = [...new Set(services.map(service => service.destination))];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Transportation': return <Car className="h-5 w-5" />;
      case 'Accommodation': return <MapPin className="h-5 w-5" />;
      case 'Experiences': return <Camera className="h-5 w-5" />;
      case 'Technology': return <Wifi className="h-5 w-5" />;
      case 'Insurance': return <Shield className="h-5 w-5" />;
      case 'Safety': return <Shield className="h-5 w-5" />;
      case 'Wellness': return <Star className="h-5 w-5" />;
      default: return <MapPin className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <UnifiedNavigation />
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Travel Well Connected Services
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Comprehensive wellness travel services curated for your mindful journey. 
            From peaceful transportation to transformative experiences - all with peace of mind.
          </p>
          <div className="flex justify-center gap-4">
            <Badge variant="secondary" className="text-sm px-4 py-2">
              Wellness-Optimized Services
            </Badge>
            <Badge variant="outline" className="text-sm px-4 py-2">
              Peace of Mind Guaranteed
            </Badge>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Search Services</label>
                  <Input
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Price Range</label>
                  <Select value={priceFilter} onValueChange={setPriceFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Prices" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Prices</SelectItem>
                      <SelectItem value="under-50">Under R950</SelectItem>
                      <SelectItem value="50-100">R950 - R1,900</SelectItem>
                      <SelectItem value="over-100">Over R1,900</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Destination</label>
                  <Select value={destinationFilter} onValueChange={setDestinationFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Destinations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Destinations</SelectItem>
                      {destinations.map(destination => (
                        <SelectItem key={destination} value={destination}>
                          {destination}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Cart Summary */}
                {cart.length > 0 && (
                  <div className="border-t pt-6">
                    <h3 className="font-semibold mb-3">Cart Summary</h3>
                    <div className="space-y-2 mb-4">
                      {cart.map(item => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="truncate mr-2">{item.name}</span>
                          <div className="flex items-center">
                            <span>R{item.price}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeFromCart(item.id)}
                              className="ml-1 h-6 w-6 p-0"
                            >
                              ×
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-2 mb-4">
                      <div className="flex justify-between font-semibold">
                        <span>Total:</span>
                        <span>R{getCartTotal()}</span>
                      </div>
                    </div>
                    <Button onClick={handleCheckout} className="w-full">
                      Checkout ({cart.length} items)
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Services Grid */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                {filteredServices.length} Services Available
              </h2>
              <div className="text-sm text-muted-foreground">
                Powered by RoamBuddy API
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredServices.map(service => (
                <ServiceCard 
                  key={service.id} 
                  service={service} 
                  onAddToCart={addToCart}
                  isInCart={cart.some(item => item.id === service.id)}
                  getCategoryIcon={getCategoryIcon}
                />
              ))}
            </div>

            {filteredServices.length === 0 && (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                    <MapPin className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">No services found</h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your filters to find the perfect wellness services for your journey.
                  </p>
                  <Button onClick={() => {
                    setSearchTerm('');
                    setCategoryFilter('all');
                    setPriceFilter('all');
                    setDestinationFilter('all');
                  }}>
                    Clear All Filters
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ServiceCard = ({ 
  service, 
  onAddToCart, 
  isInCart, 
  getCategoryIcon 
}: { 
  service: RoamBuddyService; 
  onAddToCart: (service: RoamBuddyService) => void;
  isInCart: boolean;
  getCategoryIcon: (category: string) => React.ReactNode;
}) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300">
      <div className="relative overflow-hidden rounded-t-lg h-48 bg-gradient-to-br from-primary/10 to-secondary/10">
        {service.image_url ? (
          <img 
            src={service.image_url} 
            alt={service.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-primary/20 flex items-center justify-center">
                {getCategoryIcon(service.category)}
              </div>
              <Badge variant="secondary">{service.category}</Badge>
            </div>
          </div>
        )}
        <div className="absolute top-4 left-4">
          <Badge variant="secondary" className="bg-background/90">
            {service.category}
          </Badge>
        </div>
        <div className="absolute top-4 right-4">
          <div className="flex items-center space-x-1 bg-background/90 rounded-full px-2 py-1">
            <Star className="h-3 w-3 text-yellow-500 fill-current" />
            <span className="text-xs font-semibold">{service.rating}</span>
          </div>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-foreground leading-tight">{service.name}</h3>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">
              R{service.price}
            </div>
            {service.duration && (
              <div className="text-xs text-muted-foreground">{service.duration}</div>
            )}
          </div>
        </div>
        
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {service.description}
        </p>

        {service.features && service.features.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {service.features.slice(0, 3).map((feature, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              ))}
              {service.features.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{service.features.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            {service.destination}
          </div>
          
          <Button 
            onClick={() => onAddToCart(service)}
            disabled={isInCart}
            size="sm"
            className={isInCart ? "bg-green-600 hover:bg-green-600" : ""}
          >
            {isInCart ? (
              <>Added ✓</>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 mr-1" />
                Add to Cart
              </>
            )}
          </Button>
        </div>

        {service.includes && service.includes.length > 0 && (
          <div className="mt-3 pt-3 border-t">
            <div className="text-xs font-medium text-foreground mb-1">Includes:</div>
            <div className="text-xs text-muted-foreground">
              {service.includes.slice(0, 2).join(', ')}
              {service.includes.length > 2 && ` +${service.includes.length - 2} more`}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WellnessRoamingPackages;
