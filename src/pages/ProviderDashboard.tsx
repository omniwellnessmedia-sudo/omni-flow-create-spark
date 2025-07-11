
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import MegaNavigation from "@/components/MegaNavigation";
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
  MessageSquare,
  Settings,
  Bot,
  DollarSign,
  Heart,
  Award,
  Globe,
  Image as ImageIcon,
  FileText,
  Upload
} from "lucide-react";
import WebsiteBuilder from "@/components/WebsiteBuilder";

const ProviderDashboard = () => {
  const { user } = useAuth();
  const [wellCoinBalance, setWellCoinBalance] = useState(0);
  const [zarEarnings, setZarEarnings] = useState(0);
  const [activeListings, setActiveListings] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [rating, setRating] = useState(0);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [providerProfile, setProviderProfile] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [upcomingBookings, setUpcomingBookings] = useState<any[]>([]);
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

      // Calculate profile completion
      const completionFields = [
        profile?.business_name,
        profile?.description,
        profile?.location,
        profile?.phone,
        profile?.specialties?.length > 0,
        profile?.certifications?.length > 0
      ];
      const filledFields = completionFields.filter(Boolean).length;
      setProfileCompletion(Math.round((filledFields / completionFields.length) * 100));

      // Fetch provider's services
      const { data: servicesData } = await supabase
        .from('services')
        .select('*')
        .eq('provider_id', user.id)
        .order('created_at', { ascending: false });

      setServices(servicesData || []);
      setActiveListings(servicesData?.filter(s => s.active).length || 0);

      // Fetch recent transactions
      const { data: transactionsData } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      setRecentTransactions(transactionsData || []);

      // Calculate ZAR earnings for this month
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyEarnings = transactionsData?.filter(t => {
        const transactionDate = new Date(t.created_at);
        return transactionDate.getMonth() === currentMonth && 
               transactionDate.getFullYear() === currentYear &&
               t.transaction_type === 'earning' &&
               t.amount_zar > 0;
      }).reduce((sum, t) => sum + (t.amount_zar || 0), 0) || 0;
      
      setZarEarnings(monthlyEarnings);

      // Fetch upcoming bookings
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select(`
          *,
          services(title),
          consumer_profiles!bookings_consumer_id_fkey(
            id,
            profiles!consumer_profiles_id_fkey(full_name)
          )
        `)
        .eq('provider_id', user.id)
        .gte('booking_date', new Date().toISOString())
        .order('booking_date', { ascending: true })
        .limit(5);

      setUpcomingBookings(bookingsData || []);
      setTotalBookings(bookingsData?.length || 0);

      // Fetch reviews to calculate rating
      const { data: reviewsData } = await supabase
        .from('reviews')
        .select('rating')
        .eq('reviewee_id', user.id);

      if (reviewsData && reviewsData.length > 0) {
        const avgRating = reviewsData.reduce((sum, review) => sum + review.rating, 0) / reviewsData.length;
        setRating(Math.round(avgRating * 10) / 10);
      }

    } catch (error) {
      console.error('Error fetching provider data:', error);
    } finally {
      setLoading(false);
    }
  };


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

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return date.toLocaleDateString();
  };

  // Helper function to format transaction date
  const formatTransactionDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

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
      <MegaNavigation />
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
              <TabsList className="grid w-full grid-cols-8 overflow-x-auto">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
                <TabsTrigger value="website">Website</TabsTrigger>
                <TabsTrigger value="testimonials">Reviews</TabsTrigger>
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
                         {recentTransactions.length > 0 ? recentTransactions.slice(0, 4).map((transaction) => (
                           <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                             <div className="flex-1">
                               <p className="font-medium text-sm">{transaction.description}</p>
                               <p className="text-xs text-gray-500">{formatTransactionDate(transaction.created_at)}</p>
                             </div>
                             <div className="text-right">
                               {transaction.amount_wellcoins > 0 && (
                                 <p className="text-sm font-medium text-omni-orange">
                                   +{transaction.amount_wellcoins} WC
                                 </p>
                               )}
                               {transaction.amount_zar > 0 && (
                                 <p className="text-sm font-medium text-green-600">
                                   +R{transaction.amount_zar}
                                 </p>
                               )}
                             </div>
                           </div>
                         )) : (
                           <div className="text-center py-8 text-gray-500">
                             <p>No transactions yet</p>
                             <p className="text-sm">Your transaction history will appear here</p>
                           </div>
                         )}
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
                       {upcomingBookings.length > 0 ? upcomingBookings.map((booking: any) => (
                         <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                           <div className="flex-1">
                             <h4 className="font-medium">{booking.services?.title || 'Service'}</h4>
                             <p className="text-sm text-gray-600">
                               Client: {booking.consumer_profiles?.profiles?.full_name || 'Anonymous'}
                             </p>
                             <p className="text-sm text-gray-600">{formatDate(booking.booking_date)}</p>
                           </div>
                           <div className="text-right">
                             <p className="font-medium text-sm">
                               {booking.amount_wellcoins > 0 ? `${booking.amount_wellcoins} WC` : ''}
                               {booking.amount_wellcoins > 0 && booking.amount_zar > 0 ? ' + ' : ''}
                               {booking.amount_zar > 0 ? `R${booking.amount_zar}` : ''}
                             </p>
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
                       )) : (
                         <div className="text-center py-8 text-gray-500">
                           <p>No upcoming bookings</p>
                           <p className="text-sm">Your scheduled appointments will appear here</p>
                         </div>
                       )}
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
                       {recentTransactions.length > 0 ? recentTransactions.map((transaction) => (
                         <div key={transaction.id} className="flex items-center justify-between p-3 border-b">
                           <div className="flex-1">
                             <p className="font-medium text-sm">{transaction.description}</p>
                             <p className="text-xs text-gray-500">{formatTransactionDate(transaction.created_at)}</p>
                           </div>
                           <div className="text-right">
                             {transaction.amount_wellcoins > 0 && (
                               <p className="text-sm font-medium text-omni-orange">
                                 +{transaction.amount_wellcoins} WellCoins
                               </p>
                             )}
                             {transaction.amount_zar > 0 && (
                               <p className="text-sm font-medium text-green-600">
                                 +R{transaction.amount_zar}
                               </p>
                             )}
                             <Badge className="bg-green-100 text-green-800 text-xs mt-1">
                               {transaction.status}
                             </Badge>
                           </div>
                         </div>
                       )) : (
                         <div className="text-center py-8 text-gray-500">
                           <p>No transactions yet</p>
                           <p className="text-sm">Complete your first service to see your earnings here</p>
                         </div>
                       )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="media" className="mt-6">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ImageIcon className="w-5 h-5" />
                        Media Library
                      </CardTitle>
                      <CardDescription>
                        Upload and manage images, videos, and audio content for your profile
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Upload Your Media</h3>
                        <p className="text-gray-600 mb-4">
                          Share videos of your sessions, showcase your workspace, or upload testimonial clips
                        </p>
                        <div className="space-y-3">
                          <Button className="bg-omni-orange hover:bg-omni-orange/90 text-white">
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Video
                          </Button>
                          <div className="flex gap-2 justify-center">
                            <Button variant="outline" size="sm">
                              <ImageIcon className="w-4 h-4 mr-2" />
                              Upload Images
                            </Button>
                            <Button variant="outline" size="sm">
                              <FileText className="w-4 h-4 mr-2" />
                              Audio Files
                            </Button>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-4">
                          Supported formats: MP4, JPG, PNG, MP3. Max file size: 50MB
                        </p>
                      </div>
                      
                      {/* Sample media items */}
                      <div className="mt-8">
                        <h4 className="font-semibold mb-4">Your Media</h4>
                        <div className="text-center py-8 text-gray-500">
                          <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm">No media uploaded yet</p>
                          <p className="text-xs">Upload your first video or image to get started</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="website" className="mt-6">
                <WebsiteBuilder />
              </TabsContent>

              <TabsContent value="testimonials" className="mt-6">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5" />
                        Client Testimonials
                      </CardTitle>
                      <CardDescription>
                        Collect and manage testimonials from your clients
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold">Request Testimonials</h3>
                            <p className="text-sm text-gray-600">Send requests to clients who have completed sessions</p>
                          </div>
                          <Button>
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Send Request
                          </Button>
                        </div>
                        
                        <div className="border-t pt-4">
                          <h4 className="font-semibold mb-4">Recent Testimonials</h4>
                          <div className="text-center py-8 text-gray-500">
                            <Star className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm">No testimonials yet</p>
                            <p className="text-xs">Client testimonials will appear here once you start receiving them</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
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
                       <div className="text-center py-8 text-gray-500">
                         <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                         <p>AI insights coming soon</p>
                         <p className="text-sm">Personalized recommendations will appear here once you have more activity</p>
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
