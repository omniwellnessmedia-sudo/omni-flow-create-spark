
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WellnessExchangeNavigation from "@/components/WellnessExchangeNavigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Coins, 
  TrendingUp, 
  Users, 
  Calendar, 
  Star, 
  Plus, 
  Eye, 
  MessageCircle, 
  Settings,
  Bot,
  DollarSign,
  Heart,
  Award
} from "lucide-react";

const ProviderDashboard = () => {
  const { user } = useAuth();
  const [wellCoinBalance, setWellCoinBalance] = useState(0);
  const [zarEarnings] = useState(15640);
  const [activeListings, setActiveListings] = useState(0);
  const [totalBookings] = useState(156);
  const [rating] = useState(4.8);
  const [profileCompletion] = useState(85);
  const [providerProfile, setProviderProfile] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProviderData();
    }
  }, [user]);

  const fetchProviderData = async () => {
    if (!user) return;
    
    try {
      // Fetch provider profile with WellCoin balance
      const { data: profile } = await supabase
        .from('provider_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      setProviderProfile(profile);
      setWellCoinBalance(profile?.wellcoin_balance || 0);

      // Fetch provider's services
      const { data: servicesData } = await supabase
        .from('services')
        .select('*')
        .eq('provider_id', user.id)
        .order('created_at', { ascending: false });

      setServices(servicesData || []);
      setActiveListings(servicesData?.filter(s => s.active).length || 0);
    } catch (error) {
      console.error('Error fetching provider data:', error);
    } finally {
      setLoading(false);
    }
  };

  const recentTransactions = [
    {
      id: 1,
      type: "earning",
      description: "Holistic Nutrition Consultation - Sarah M.",
      amount: { wellcoins: 320, zar: 380 },
      date: "2 hours ago",
      status: "completed"
    },
    {
      id: 2,
      type: "earning",
      description: "Yoga Class - Group Session",
      amount: { wellcoins: 150, zar: 180 },
      date: "1 day ago",
      status: "completed"
    },
    {
      id: 3,
      type: "bonus",
      description: "Community Engagement Bonus",
      amount: { wellcoins: 50, zar: 0 },
      date: "3 days ago",
      status: "completed"
    },
    {
      id: 4,
      type: "referral",
      description: "Referral Bonus - New Provider",
      amount: { wellcoins: 100, zar: 0 },
      date: "1 week ago",
      status: "completed"
    }
  ];

  // Function to toggle service active status
  const toggleServiceStatus = async (serviceId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('services')
        .update({ active: !currentStatus })
        .eq('id', serviceId);

      if (error) throw error;

      // Refresh services data
      fetchProviderData();
      toast.success(`Service ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // Function to delete service
  const deleteService = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId);

      if (error) throw error;

      fetchProviderData();
      toast.success('Service deleted successfully');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const upcomingBookings = [
    {
      id: 1,
      service: "Holistic Nutrition Consultation",
      client: "Emma Thompson",
      date: "Today, 2:00 PM",
      payment: "280 WellCoins + R170",
      status: "confirmed"
    },
    {
      id: 2,
      service: "Yoga Class",
      client: "Michael Brown",
      date: "Tomorrow, 9:00 AM",
      payment: "R180",
      status: "confirmed"
    },
    {
      id: 3,
      service: "Mindfulness Workshop",
      client: "Lisa Garcia",
      date: "Friday, 6:00 PM",
      payment: "280 WellCoins",
      status: "pending"
    }
  ];

  const aiSuggestions = [
    {
      type: "optimization",
      title: "Boost Your Nutrition Service",
      description: "Your nutrition consultation has high views but low bookings. Consider reducing the WellCoin price by 10% to increase conversions.",
      action: "Optimize Pricing"
    },
    {
      type: "content",
      title: "Add Video Introduction",
      description: "Services with video introductions get 40% more bookings. Add a 2-minute video to your yoga classes.",
      action: "Add Video"
    },
    {
      type: "engagement",
      title: "Community Opportunity",
      description: "There are 3 new 'Wants' in your category. Respond to build your reputation and earn WellCoins.",
      action: "View Wants"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-omni-blue mx-auto mb-4"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <WellnessExchangeNavigation />
      <main className="pt-0">
        {/* Header */}
        <section className="py-8 bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="font-heading font-bold text-3xl sm:text-4xl mb-2">
                  Provider <span className="bg-rainbow-gradient bg-clip-text text-transparent">Dashboard</span>
                </h1>
                <p className="text-gray-600">Welcome back, {providerProfile?.business_name || user?.email}</p>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  className="bg-rainbow-gradient hover:opacity-90 text-white"
                  onClick={() => window.location.href = '/wellness-exchange/add-service'}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Service
                </Button>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* AI Assistant Banner */}
        <section className="py-4 bg-gradient-to-r from-omni-violet/10 to-omni-blue/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Bot className="h-6 w-6 text-omni-violet mr-3" />
                <div>
                  <p className="font-medium">AI Assistant has 3 new suggestions to improve your performance</p>
                  <p className="text-sm text-gray-600">Implementing these could increase your earnings by 25%</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                View Suggestions
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Overview */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">WellCoin Balance</CardTitle>
                  <Coins className="h-4 w-4 text-omni-orange" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-omni-orange">{wellCoinBalance.toLocaleString()}</div>
                  <p className="text-xs text-gray-600">≈ R{wellCoinBalance.toLocaleString()} value</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">ZAR Earnings</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">R{zarEarnings.toLocaleString()}</div>
                  <p className="text-xs text-gray-600">This month</p>
                </CardContent>
              </Card>

               <Card className="hover:shadow-lg transition-shadow">
                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                   <CardTitle className="text-sm font-medium">Active Services</CardTitle>
                   <Calendar className="h-4 w-4 text-omni-blue" />
                 </CardHeader>
                 <CardContent>
                   <div className="text-2xl font-bold text-omni-blue">{activeListings}</div>
                   <p className="text-xs text-gray-600">Live on marketplace</p>
                 </CardContent>
               </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Rating</CardTitle>
                  <Star className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{rating}</div>
                  <p className="text-xs text-gray-600">Based on 67 reviews</p>
                </CardContent>
              </Card>
            </div>

            {/* Profile Completion */}
            <Card className="mb-8 border-omni-orange/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 text-omni-orange mr-2" />
                  Profile Completion
                </CardTitle>
                <CardDescription>
                  Complete your profile to increase bookings by up to 60%
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Profile Progress</span>
                    <span className="text-sm text-gray-600">{profileCompletion}%</span>
                  </div>
                  <Progress value={profileCompletion} className="w-full" />
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="outline" className="text-xs">Add Video ✓</Badge>
                    <Badge variant="outline" className="text-xs">Portfolio Images ✓</Badge>
                    <Badge variant="secondary" className="text-xs">Certifications Pending</Badge>
                    <Badge variant="secondary" className="text-xs">Bio Expansion Needed</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="bookings">Bookings</TabsTrigger>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="insights">AI Insights</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Activity */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>Your latest bookings and earnings</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentTransactions.slice(0, 4).map((transaction) => (
                          <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <p className="font-medium text-sm">{transaction.description}</p>
                              <p className="text-xs text-gray-500">{transaction.date}</p>
                            </div>
                            <div className="text-right">
                              {transaction.amount.wellcoins > 0 && (
                                <p className="text-sm font-medium text-omni-orange">
                                  +{transaction.amount.wellcoins} WC
                                </p>
                              )}
                              {transaction.amount.zar > 0 && (
                                <p className="text-sm font-medium text-green-600">
                                  +R{transaction.amount.zar}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Performance Metrics */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Metrics</CardTitle>
                      <CardDescription>This month vs last month</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Service Views</span>
                          <div className="flex items-center">
                            <span className="text-sm font-medium mr-2">1,247</span>
                            <Badge className="bg-green-100 text-green-800 text-xs">+18%</Badge>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Conversion Rate</span>
                          <div className="flex items-center">
                            <span className="text-sm font-medium mr-2">12.3%</span>
                            <Badge className="bg-green-100 text-green-800 text-xs">+5%</Badge>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Repeat Clients</span>
                          <div className="flex items-center">
                            <span className="text-sm font-medium mr-2">34%</span>
                            <Badge className="bg-green-100 text-green-800 text-xs">+8%</Badge>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Response Time</span>
                          <div className="flex items-center">
                            <span className="text-sm font-medium mr-2">2.1 hrs</span>
                            <Badge className="bg-green-100 text-green-800 text-xs">-15%</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="services" className="mt-6">
                <div className="space-y-4">
                  {services.length > 0 ? (
                    services.map((service) => (
                      <Card key={service.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg">{service.title}</CardTitle>
                              <div className="flex items-center gap-4 mt-2">
                                <Badge variant="secondary">{service.category}</Badge>
                                <Badge className={service.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                  {service.active ? 'active' : 'inactive'}
                                </Badge>
                                {service.is_online && (
                                  <Badge variant="outline">Online</Badge>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">
                                {service.price_zar ? `R${service.price_zar}` : ''} 
                                {service.price_zar && service.price_wellcoins ? ' / ' : ''}
                                {service.price_wellcoins ? `${service.price_wellcoins} WC` : ''}
                              </p>
                              <p className="text-sm text-gray-600">{service.location}</p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 mb-4">{service.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant={service.active ? "outline" : "default"}
                                onClick={() => toggleServiceStatus(service.id, service.active)}
                              >
                                {service.active ? 'Deactivate' : 'Activate'}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => window.location.href = `/wellness-exchange/edit-service/${service.id}`}
                              >
                                <Settings className="h-4 w-4 mr-2" />
                                Edit
                              </Button>
                            </div>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteService(service.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="text-center py-12">
                        <Plus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="font-medium text-lg mb-2">No services yet</h3>
                        <p className="text-gray-600 mb-6">Start by creating your first wellness service</p>
                        <Button 
                          className="bg-rainbow-gradient hover:opacity-90 text-white"
                          onClick={() => window.location.href = '/wellness-exchange/add-service'}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Create Your First Service
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="bookings" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Bookings</CardTitle>
                    <CardDescription>Manage your scheduled appointments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {upcomingBookings.map((booking) => (
                        <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium">{booking.service}</h4>
                            <p className="text-sm text-gray-600">Client: {booking.client}</p>
                            <p className="text-sm text-gray-600">{booking.date}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-sm">{booking.payment}</p>
                            <Badge className={booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                              {booking.status}
                            </Badge>
                          </div>
                          <div className="ml-4">
                            <Button size="sm" variant="outline">
                              <MessageCircle className="h-4 w-4 mr-1" />
                              Contact
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="transactions" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>All your earnings and WellCoin transactions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentTransactions.map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-3 border-b">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{transaction.description}</p>
                            <p className="text-xs text-gray-500">{transaction.date}</p>
                          </div>
                          <div className="text-right">
                            {transaction.amount.wellcoins > 0 && (
                              <p className="text-sm font-medium text-omni-orange">
                                +{transaction.amount.wellcoins} WellCoins
                              </p>
                            )}
                            {transaction.amount.zar > 0 && (
                              <p className="text-sm font-medium text-green-600">
                                +R{transaction.amount.zar}
                              </p>
                            )}
                            <Badge className="bg-green-100 text-green-800 text-xs mt-1">
                              {transaction.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="insights" className="mt-6">
                <div className="space-y-6">
                  <Card className="border-omni-violet/20">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Bot className="h-6 w-6 text-omni-violet mr-2" />
                        AI-Powered Insights
                      </CardTitle>
                      <CardDescription>
                        Personalized recommendations to grow your wellness business
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {aiSuggestions.map((suggestion, index) => (
                          <div key={index} className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium mb-2">{suggestion.title}</h4>
                                <p className="text-sm text-gray-600 mb-3">{suggestion.description}</p>
                                <Button size="sm" className="bg-omni-violet hover:bg-omni-violet/90 text-white">
                                  {suggestion.action}
                                </Button>
                              </div>
                              <Badge className="ml-4 bg-omni-violet/10 text-omni-violet">
                                {suggestion.type}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ProviderDashboard;
