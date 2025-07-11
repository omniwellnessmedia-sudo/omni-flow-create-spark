import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
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
  PiggyBank,
  Heart,
  Award,
  Globe,
  Image as ImageIcon,
  FileText,
  Upload,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight
} from "lucide-react";
import WebsiteBuilder from "@/components/WebsiteBuilder";
import ProviderMediaUpload from "@/components/ProviderMediaUpload";

const ProviderDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
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
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      await loadDashboardData(session.user.id);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        loadDashboardData(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadDashboardData = async (userId: string) => {
    setLoading(true);
    try {
      // Load provider profile
      const { data: profile } = await supabase
        .from('provider_profiles')
        .select('*')
        .eq('id', userId)
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

      // Load services
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .eq('provider_id', userId)
        .order('created_at', { ascending: false });

      if (servicesError) throw servicesError;
      setServices(servicesData || []);
      setActiveListings(servicesData?.filter(s => s.active).length || 0);

      // Load bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          *,
          consumer_profiles!bookings_consumer_id_fkey(
            id,
            profiles!consumer_profiles_id_fkey(full_name)
          ),
          services (
            title
          )
        `)
        .eq('provider_id', userId)
        .order('created_at', { ascending: false });

      if (bookingsError) throw bookingsError;
      setUpcomingBookings(bookingsData || []);
      setTotalBookings(bookingsData?.length || 0);

      // Load transactions
      const { data: transactionsData } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      setRecentTransactions(transactionsData || []);

      // Calculate ZAR earnings
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

      // Load reviews
      const { data: reviewsData } = await supabase
        .from('reviews')
        .select('rating')
        .eq('reviewee_id', userId);

      if (reviewsData && reviewsData.length > 0) {
        const avgRating = reviewsData.reduce((sum, review) => sum + review.rating, 0) / reviewsData.length;
        setRating(Math.round(avgRating * 10) / 10);
      }

    } catch (error: any) {
      toast.error("Failed to load dashboard data: " + error.message);
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
      loadDashboardData(user!.id);
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

      loadDashboardData(user!.id);
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MegaNavigation />
      <WellnessExchangeNavigation />
      <main className="pt-0">
        {/* Header */}
        <section className="py-8 bg-card border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="heading-secondary no-faded-text text-center">
                  Provider <span className="bg-rainbow-gradient bg-clip-text text-transparent">Dashboard</span>
                </h1>
                <p className="text-muted-foreground">Welcome back, {providerProfile?.business_name || user?.email}</p>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  className="bg-rainbow-gradient hover:opacity-90 text-white"
                  onClick={() => navigate('/wellness-exchange/add-service')}
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

        {/* Quick Actions Banner */}
        <section className="py-4 bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Bot className="h-6 w-6 text-primary mr-3" />
                <div>
                  <p className="font-medium">Welcome to your wellness provider dashboard</p>
                  <p className="text-sm text-muted-foreground">Manage your services, track earnings, and grow your practice</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/wellness-exchange/add-service')}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Service
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
                  <p className="text-xs text-muted-foreground">≈ R{wellCoinBalance.toLocaleString()} value</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">ZAR Earnings</CardTitle>
                  <PiggyBank className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">R{zarEarnings.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>

               <Card className="hover:shadow-lg transition-shadow">
                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                   <CardTitle className="text-sm font-medium">Active Services</CardTitle>
                   <Calendar className="h-4 w-4 text-primary" />
                 </CardHeader>
                 <CardContent>
                   <div className="text-2xl font-bold text-primary">{activeListings}</div>
                   <p className="text-xs text-muted-foreground">Live on marketplace</p>
                 </CardContent>
               </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Rating</CardTitle>
                  <Star className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{rating || 'New'}</div>
                  <p className="text-xs text-muted-foreground">Average rating</p>
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
                    <span className="text-sm text-muted-foreground">{profileCompletion}%</span>
                  </div>
                  <Progress value={profileCompletion} className="w-full" />
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant={providerProfile?.business_name ? "default" : "secondary"} className="text-xs">
                      Business Name {providerProfile?.business_name ? '✓' : ''}
                    </Badge>
                    <Badge variant={providerProfile?.description ? "default" : "secondary"} className="text-xs">
                      Description {providerProfile?.description ? '✓' : ''}
                    </Badge>
                    <Badge variant={providerProfile?.location ? "default" : "secondary"} className="text-xs">
                      Location {providerProfile?.location ? '✓' : ''}
                    </Badge>
                    <Badge variant={providerProfile?.specialties?.length > 0 ? "default" : "secondary"} className="text-xs">
                      Specialties {providerProfile?.specialties?.length > 0 ? '✓' : ''}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 overflow-x-auto">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="bookings">Bookings</TabsTrigger>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
                <TabsTrigger value="website">Website</TabsTrigger>
                <TabsTrigger value="testimonials">Reviews</TabsTrigger>
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
                           <div key={transaction.id} className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                             <div className="flex-1">
                               <p className="font-medium text-sm">{transaction.description}</p>
                               <p className="text-xs text-muted-foreground">{formatTransactionDate(transaction.created_at)}</p>
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
                           <div className="text-center py-8 text-muted-foreground">
                             <p>No transactions yet</p>
                             <p className="text-sm">Your transaction history will appear here</p>
                           </div>
                         )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Upcoming Bookings */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Upcoming Bookings</CardTitle>
                      <CardDescription>Your scheduled sessions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {upcomingBookings.length > 0 ? upcomingBookings.slice(0, 4).map((booking) => (
                          <div key={booking.id} className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                            <div className="flex-1">
                              <p className="font-medium text-sm">{booking.services?.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {booking.consumer_profiles?.profiles?.full_name || 'Client'} • {formatDate(booking.booking_date)}
                              </p>
                            </div>
                            <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                              {booking.status}
                            </Badge>
                          </div>
                        )) : (
                          <div className="text-center py-8 text-muted-foreground">
                            <p>No upcoming bookings</p>
                            <p className="text-sm">Your bookings will appear here</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="services" className="mt-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Your Services</CardTitle>
                      <CardDescription>Manage your wellness service offerings</CardDescription>
                    </div>
                    <Button onClick={() => navigate('/wellness-exchange/add-service')}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Service
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {services.length > 0 ? (
                      <div className="space-y-4">
                        {services.map((service) => (
                          <div key={service.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="font-medium">{service.title}</h3>
                                  <Badge variant={service.active ? "default" : "secondary"}>
                                    {service.active ? "Active" : "Inactive"}
                                  </Badge>
                                  {service.category && (
                                    <Badge variant="outline">{service.category}</Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                  {service.description}
                                </p>
                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                  {service.price_zar && (
                                    <span>R{service.price_zar}</span>
                                  )}
                                  {service.price_wellcoins && (
                                    <span>{service.price_wellcoins} WC</span>
                                  )}
                                  {service.duration_minutes && (
                                    <span>{service.duration_minutes} min</span>
                                  )}
                                  {service.location && (
                                    <span>{service.location}</span>
                                  )}
                                  {service.is_online && (
                                    <span>🌐 Online</span>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-2 ml-4">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleServiceStatus(service.id, service.active)}
                                >
                                  {service.active ? (
                                    <ToggleRight className="h-4 w-4 text-green-600" />
                                  ) : (
                                    <ToggleLeft className="h-4 w-4 text-gray-400" />
                                  )}
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => deleteService(service.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="mb-2">No services created yet</p>
                        <p className="text-sm mb-4">Create your first wellness service to start accepting bookings</p>
                        <Button onClick={() => navigate('/wellness-exchange/add-service')}>
                          <Plus className="h-4 w-4 mr-2" />
                          Create Your First Service
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="bookings" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>All Bookings</CardTitle>
                    <CardDescription>Manage your client bookings and sessions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {upcomingBookings.length > 0 ? (
                      <div className="space-y-4">
                        {upcomingBookings.map((booking) => (
                          <div key={booking.id} className="border rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="font-medium">{booking.services?.title}</h3>
                                <p className="text-sm text-muted-foreground">
                                  Client: {booking.consumer_profiles?.profiles?.full_name || 'Unknown'}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Date: {new Date(booking.booking_date).toLocaleDateString()} at {new Date(booking.booking_date).toLocaleTimeString()}
                                </p>
                                {booking.notes && (
                                  <p className="text-sm text-muted-foreground mt-2">
                                    Notes: {booking.notes}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant={
                                  booking.status === 'confirmed' ? 'default' : 
                                  booking.status === 'pending' ? 'secondary' : 
                                  'outline'
                                }>
                                  {booking.status}
                                </Badge>
                                <div className="text-right text-sm">
                                  {booking.amount_zar > 0 && (
                                    <p className="font-medium">R{booking.amount_zar}</p>
                                  )}
                                  {booking.amount_wellcoins > 0 && (
                                    <p className="text-omni-orange">{booking.amount_wellcoins} WC</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No bookings yet</p>
                        <p className="text-sm">Your client bookings will appear here</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="transactions" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>Your earnings and WellCoin transactions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {recentTransactions.length > 0 ? (
                      <div className="space-y-4">
                        {recentTransactions.map((transaction) => (
                          <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex-1">
                              <p className="font-medium text-sm">{transaction.description}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(transaction.created_at).toLocaleDateString()} • {transaction.transaction_type}
                              </p>
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
                              <Badge variant="outline" className="text-xs">
                                {transaction.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <PiggyBank className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No transactions yet</p>
                        <p className="text-sm">Your transaction history will appear here</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="website" className="mt-6">
                <WebsiteBuilder />
              </TabsContent>

              <TabsContent value="media" className="mt-6">
                <ProviderMediaUpload onMediaUpdate={() => loadDashboardData(user!.id)} />
              </TabsContent>

              <TabsContent value="testimonials" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Reviews & Testimonials</CardTitle>
                    <CardDescription>Manage your client feedback and reviews</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12 text-muted-foreground">
                      <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No reviews yet</p>
                      <p className="text-sm">Client reviews will appear here after completed sessions</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="insights" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>AI-Powered Insights</CardTitle>
                    <CardDescription>Get personalized recommendations to grow your practice</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12 text-muted-foreground">
                      <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>AI insights coming soon</p>
                      <p className="text-sm">Get personalized recommendations based on your performance</p>
                    </div>
                  </CardContent>
                </Card>
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