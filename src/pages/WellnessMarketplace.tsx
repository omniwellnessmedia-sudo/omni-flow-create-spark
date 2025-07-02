
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import MobileNavigation from "@/components/MobileNavigation";
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  Coins, 
  Clock,
  Eye,
  Heart,
  Plus,
  DollarSign
} from "lucide-react";

interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  price_zar: number;
  price_wellcoins: number;
  duration_minutes: number;
  location: string;
  is_online: boolean;
  provider_profiles: {
    business_name: string;
    specialties: string[];
  };
}

const WellnessMarketplace = () => {
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [wellCoinBalance, setWellCoinBalance] = useState(0);

  const categories = [
    "Yoga", "Meditation", "Nutrition", "Massage Therapy", "Acupuncture",
    "Life Coaching", "Personal Training", "Reiki", "Aromatherapy", "Herbalism"
  ];

  useEffect(() => {
    if (user) {
      fetchServices();
      fetchWellCoinBalance();
    }
  }, [user]);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select(`
          id,
          title,
          description,
          category,
          price_zar,
          price_wellcoins,
          duration_minutes,
          location,
          is_online,
          provider_profiles (
            business_name,
            specialties
          )
        `)
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setServices(data || []);
    } catch (error: any) {
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  const fetchWellCoinBalance = async () => {
    try {
      const { data, error } = await supabase
        .from('consumer_profiles')
        .select('wellcoin_balance')
        .eq('id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setWellCoinBalance(data?.wellcoin_balance || 0);
    } catch (error: any) {
      console.error("Failed to fetch WellCoin balance:", error);
    }
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.provider_profiles?.business_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || service.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleBookService = async (serviceId: string, priceZar: number, priceWellcoins: number) => {
    // This would open a booking modal or navigate to booking page
    toast.success("Booking functionality coming soon!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MobileNavigation />
        <div className="pt-20 pb-20 lg:pt-8">
          <div className="max-w-7xl mx-auto px-4">
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
    <div className="min-h-screen bg-gray-50">
      <MobileNavigation />
      
      <main className="pt-20 pb-20 lg:pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="font-heading font-bold text-2xl sm:text-3xl">
                  Wellness <span className="bg-rainbow-gradient bg-clip-text text-transparent">Marketplace</span>
                </h1>
                <p className="text-gray-600 mt-1">Discover and book wellness services</p>
              </div>
              
              {/* WellCoin Balance */}
              <Card className="p-3 bg-gradient-to-r from-omni-orange/10 to-omni-yellow/10">
                <div className="flex items-center">
                  <Coins className="h-5 w-5 text-omni-orange mr-2" />
                  <div>
                    <p className="text-xs text-gray-600">Your Balance</p>
                    <p className="font-bold text-omni-orange">{wellCoinBalance} WC</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search services, providers, or specialties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <Button variant="outline" className="h-16 flex-col">
              <Plus className="h-5 w-5 mb-1" />
              <span className="text-xs">Add Service</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <Heart className="h-5 w-5 mb-1" />
              <span className="text-xs">Post Want</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <Search className="h-5 w-5 mb-1" />
              <span className="text-xs">Find Users</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <Coins className="h-5 w-5 mb-1" />
              <span className="text-xs">My Transactions</span>
            </Button>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <Card key={service.id} className="hover:shadow-lg transition-shadow animate-fade-in">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <Badge variant="secondary" className="mb-2">
                      {service.category}
                    </Badge>
                    {service.is_online && (
                      <Badge className="bg-green-100 text-green-800">Online</Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg leading-tight">{service.title}</CardTitle>
                  <CardDescription className="text-sm">
                    by {service.provider_profiles?.business_name}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {service.description}
                  </p>
                  
                  <div className="space-y-3">
                    {/* Location and Duration */}
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="flex-1">{service.location}</span>
                      {service.duration_minutes && (
                        <>
                          <Clock className="h-4 w-4 ml-4 mr-1" />
                          <span>{service.duration_minutes}min</span>
                        </>
                      )}
                    </div>
                    
                    {/* Pricing */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        {service.price_zar > 0 && (
                          <div className="flex items-center text-green-600">
                            <DollarSign className="h-4 w-4 mr-1" />
                            <span className="font-medium">R{service.price_zar}</span>
                          </div>
                        )}
                        {service.price_wellcoins > 0 && (
                          <div className="flex items-center text-omni-orange">
                            <Coins className="h-4 w-4 mr-1" />
                            <span className="font-medium">{service.price_wellcoins} WC</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm"
                          className="bg-rainbow-gradient hover:opacity-90 text-white"
                          onClick={() => handleBookService(
                            service.id, 
                            service.price_zar, 
                            service.price_wellcoins
                          )}
                        >
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredServices.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="font-medium text-lg mb-2">No services found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search criteria or browse all categories
              </p>
              <Button onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default WellnessMarketplace;
