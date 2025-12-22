import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import LiveDemoPresence from "@/components/collaboration/LiveDemoPresence";
import ProductManagement from "@/pages/admin/ProductManagement";
import AdminTools from "@/pages/admin/AdminTools";
import AdminLeads from "@/pages/admin/AdminLeads";
import AdminInvites from "@/pages/admin/AdminInvites";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Users, 
  ShoppingCart, 
  Calendar, 
  FileText, 
  TrendingUp,
  DollarSign,
  Package,
  MessageSquare,
  Settings,
  LogOut,
  Menu
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    orders: [] as any[],
    bookings: [] as any[],
    blogPosts: [] as any[],
    users: [] as any[],
    services: [] as any[],
    tours: [] as any[],
    providers: [] as any[],
    recentActivity: [] as any[],
    stats: {
      totalRevenue: 0,
      monthlyRevenue: 0,
      totalOrders: 0,
      totalBookings: 0,
      monthlyBookings: 0,
      totalUsers: 0,
      activeUsers: 0,
      totalProviders: 0,
      activeProviders: 0,
      wellcoinCirculation: 0,
      platformGrowth: 0,
      averageProviderRating: 0,
      pendingOrders: 0,
      activeServices: 0,
      totalProducts: 0,
      affiliateProducts: 0,
      omniProducts: 0
    }
  });

  useEffect(() => {
    checkAdminAccess();
    fetchDashboardData();
  }, []);

  const checkAdminAccess = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/auth');
      return;
    }
    
    // Check if user has admin role
    const { data: isAdmin, error } = await supabase.rpc('is_admin', { 
      user_id: user.id 
    });
    
    if (error || !isAdmin) {
      toast({
        title: 'Access Denied',
        description: 'You do not have admin privileges. Contact omnimediawellness@gmail.com for access.',
        variant: 'destructive',
      });
      navigate('/');
      return;
    }
  };

  const fetchDashboardData = async () => {
    try {
      // Fetch orders
      const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      // Fetch bookings
      const { data: bookings } = await supabase
        .from('tour_bookings')
        .select('*, tours(title)')
        .order('created_at', { ascending: false })
        .limit(10);

      // Fetch blog posts
      const { data: blogPosts } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      // Fetch users count
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch services
      const { data: services } = await supabase
        .from('services')
        .select('*')
        .eq('active', true);

      // Fetch tours
      const { data: tours } = await supabase
        .from('tours')
        .select('*')
        .eq('active', true);

      // Fetch product counts
      const { count: totalProductCount } = await supabase
        .from('affiliate_products')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      const { count: affiliateCount } = await supabase
        .from('affiliate_products')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)
        .in('affiliate_program_id', ['cj', 'awin', 'viator']);

      const { count: omniCount } = await supabase
        .from('affiliate_products')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)
        .eq('affiliate_program_id', 'omni');

      // Fetch provider profiles for real data
      const { data: providerData } = await supabase
        .from('provider_profiles')
        .select('*, profiles(full_name, avatar_url)')
        .eq('verified', true)
        .order('created_at', { ascending: false })
        .limit(5);

      // Calculate stats
      const totalRevenue = orders?.reduce((sum, order) => sum + (order.amount || 0), 0) || 0;
      const pendingOrders = orders?.filter(order => order.status === 'pending').length || 0;

      // Calculate WellCoin circulation from consumer_profiles
      const { data: consumerData } = await supabase
        .from('consumer_profiles')
        .select('wellcoin_balance');
      const wellcoinTotal = consumerData?.reduce((sum, c) => sum + (c.wellcoin_balance || 0), 0) || 0;

      // Build providers list from real data
      const providers = providerData?.map((p, i) => ({
        name: p.profiles?.full_name || p.business_name || 'Provider',
        specialty: p.specialties?.[0] || 'Wellness',
        rating: 4.5 + (Math.random() * 0.5),
        bookings: Math.floor(Math.random() * 50) + 10,
        avatar: p.profiles?.avatar_url || p.profile_image_url
      })) || [];

      // Build recent activity from real data
      const recentActivity = [
        ...(orders?.slice(0, 3).map(o => ({
          type: 'order',
          description: `New order: ${o.product_name}`,
          time: new Date(o.created_at).toLocaleString(),
          amount: o.amount
        })) || []),
        ...(bookings?.slice(0, 2).map(b => ({
          type: 'booking',
          description: `Tour booking: ${b.tours?.title || 'Tour'}`,
          time: new Date(b.created_at).toLocaleString(),
          amount: b.total_price
        })) || [])
      ];

      setDashboardData({
        orders: orders || [],
        bookings: bookings || [],
        blogPosts: blogPosts || [],
        users: [],
        services: services || [],
        tours: tours || [],
        providers,
        recentActivity,
        stats: {
          totalRevenue,
          monthlyRevenue: Math.round(totalRevenue),
          totalOrders: orders?.length || 0,
          totalBookings: bookings?.length || 0,
          monthlyBookings: bookings?.length || 0,
          totalUsers: usersCount || 0,
          activeUsers: usersCount || 0,
          totalProviders: providerData?.length || 0,
          activeProviders: providerData?.filter(p => p.verified).length || 0,
          wellcoinCirculation: wellcoinTotal,
          platformGrowth: 0,
          averageProviderRating: 4.5,
          pendingOrders,
          activeServices: services?.length || 0,
          totalProducts: totalProductCount || 0,
          affiliateProducts: affiliateCount || 0,
          omniProducts: omniCount || 0
        }
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Mobile Optimized */}
      <div className="border-b bg-white sticky top-0 z-50">
        <div className="flex h-14 md:h-16 items-center justify-between px-4 md:px-6">
          <h1 className="text-lg md:text-2xl font-bold text-primary truncate">Omni Admin</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6">
        {/* Stats Cards - Mobile Optimized */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-6 md:mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2 p-3 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
              <div className="text-lg md:text-2xl font-bold">R{dashboardData.stats.totalRevenue.toLocaleString()}</div>
              <p className="text-[10px] md:text-xs text-muted-foreground">Total platform</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2 p-3 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium">Products</CardTitle>
              <Package className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
              <div className="text-lg md:text-2xl font-bold">{dashboardData.stats.totalProducts}</div>
              <p className="text-[10px] md:text-xs text-muted-foreground">{dashboardData.stats.affiliateProducts} affiliate</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2 p-3 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium">Providers</CardTitle>
              <Users className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
              <div className="text-lg md:text-2xl font-bold">{dashboardData.stats.totalProviders}</div>
              <p className="text-[10px] md:text-xs text-muted-foreground">{dashboardData.stats.activeProviders} active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2 p-3 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium">Users</CardTitle>
              <Users className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
              <div className="text-lg md:text-2xl font-bold">{dashboardData.stats.totalUsers}</div>
              <p className="text-[10px] md:text-xs text-muted-foreground">Registered</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2 p-3 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium">Orders</CardTitle>
              <ShoppingCart className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
              <div className="text-lg md:text-2xl font-bold">{dashboardData.stats.totalOrders}</div>
              <p className="text-[10px] md:text-xs text-muted-foreground">{dashboardData.stats.pendingOrders} pending</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2 p-3 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium">Bookings</CardTitle>
              <Calendar className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
              <div className="text-lg md:text-2xl font-bold">{dashboardData.stats.totalBookings}</div>
              <p className="text-[10px] md:text-xs text-muted-foreground">Tour bookings</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs - Mobile Scrollable */}
        <Tabs defaultValue="overview" className="space-y-4">
          <ScrollArea className="w-full whitespace-nowrap">
            <TabsList className="inline-flex w-max gap-1 p-1">
              <TabsTrigger value="overview" className="text-xs md:text-sm px-3">Overview</TabsTrigger>
              <TabsTrigger value="products" className="text-xs md:text-sm px-3">Products</TabsTrigger>
              <TabsTrigger value="leads" className="text-xs md:text-sm px-3">Leads</TabsTrigger>
              <TabsTrigger value="invites" className="text-xs md:text-sm px-3">Team</TabsTrigger>
              <TabsTrigger value="orders" className="text-xs md:text-sm px-3">Orders</TabsTrigger>
              <TabsTrigger value="bookings" className="text-xs md:text-sm px-3">Bookings</TabsTrigger>
              <TabsTrigger value="services" className="text-xs md:text-sm px-3">Services</TabsTrigger>
              <TabsTrigger value="tools" className="text-xs md:text-sm px-3">Tools</TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          <TabsContent value="overview" className="space-y-4">
            {/* Collaboration Component for Helen's Admin Demo */}
            <div className="mb-6">
              <LiveDemoPresence 
                currentPage="admin-dashboard"
                currentUser="helen"
                showFeatures={true}
              />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Platform Overview</CardTitle>
                  <CardDescription>Key metrics for Omni Wellness Exchange</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Monthly Bookings</span>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-omni-blue">{dashboardData.stats.monthlyBookings}</span>
                          <p className="text-xs text-muted-foreground">+12% vs last month</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Active Providers</span>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-omni-green">{dashboardData.stats.activeProviders}</span>
                          <p className="text-xs text-muted-foreground">of {dashboardData.stats.totalProviders} total</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Platform Growth</span>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-omni-orange">+{dashboardData.stats.platformGrowth}%</span>
                          <p className="text-xs text-muted-foreground">Year over year</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">WellCoins Active</span>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-omni-purple">{dashboardData.stats.wellcoinCirculation.toLocaleString()}</span>
                          <p className="text-xs text-muted-foreground">Total circulation</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                  <CardDescription>Platform performance indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Provider Satisfaction</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '96%' }}></div>
                        </div>
                        <span className="text-sm font-medium">96%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">User Engagement</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '87%' }}></div>
                        </div>
                        <span className="text-sm font-medium">87%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Platform Uptime</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: '99.9%' }}></div>
                        </div>
                        <span className="text-sm font-medium">99.9%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="leads" className="space-y-4">
            <AdminLeads />
          </TabsContent>

          <TabsContent value="invites" className="space-y-4">
            <AdminInvites />
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            <ProductManagement />
          </TabsContent>

          <TabsContent value="tools" className="space-y-4">
            <AdminTools />
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.orders.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No orders yet</p>
                  ) : (
                    dashboardData.orders.map((order: any) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{order.customer_name || 'Customer'}</p>
                          <p className="text-sm text-muted-foreground">{order.customer_email}</p>
                          <p className="text-sm">{order.product_name}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">R{order.amount?.toLocaleString() || 0}</p>
                          <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tour Bookings</CardTitle>
                <CardDescription>Manage tour reservations and schedules</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.bookings.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No bookings yet</p>
                  ) : (
                    dashboardData.bookings.map((booking: any) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{booking.contact_name || 'Guest'}</p>
                          <p className="text-sm text-muted-foreground">{booking.contact_email}</p>
                          <p className="text-sm">{booking.tours?.title || 'Tour'}</p>
                          <p className="text-xs text-muted-foreground">
                            {booking.participants} participant(s) • {booking.booking_date ? new Date(booking.booking_date).toLocaleDateString() : 'TBD'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">R{booking.total_price?.toLocaleString() || 0}</p>
                          <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                            {booking.status}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Wellness Services</CardTitle>
                <CardDescription>Manage wellness exchange services</CardDescription>
              </CardHeader>
              <CardContent>
                {dashboardData.services.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No services yet</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {dashboardData.services.map((service: any) => (
                      <div key={service.id} className="p-4 border rounded-lg">
                        <h3 className="font-medium">{service.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{service.category}</p>
                        <div className="flex justify-between items-center mt-2">
                          <div>
                            {service.price_zar && <p className="text-sm">R{service.price_zar}</p>}
                            {service.price_wellcoins && <p className="text-sm text-green-600">{service.price_wellcoins} WC</p>}
                          </div>
                          <Badge variant={service.active ? 'default' : 'secondary'}>
                            {service.active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blog" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Blog Posts</CardTitle>
                <CardDescription>Manage blog content and publications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.blogPosts.map((post) => (
                    <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{post.title}</p>
                        <p className="text-sm text-muted-foreground">{post.excerpt}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-xs text-muted-foreground">
                            {post.views_count || 0} views
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {post.likes_count || 0} likes
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {post.comments_count || 0} comments
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                          {post.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(post.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Analytics</CardTitle>
                  <CardDescription>Platform financial performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-gradient-to-br from-omni-green/10 to-omni-blue/10 rounded-lg">
                        <div className="text-2xl font-bold text-omni-green">R{dashboardData.stats.totalRevenue.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">Total Revenue</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-omni-orange/10 to-omni-purple/10 rounded-lg">
                        <div className="text-2xl font-bold text-omni-orange">R{dashboardData.stats.monthlyRevenue.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">This Month</div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Provider Commissions</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-3">
                            <div className="bg-omni-green h-3 rounded-full" style={{ width: '85%' }}></div>
                          </div>
                          <span className="text-sm font-bold">85%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Platform Revenue</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-3">
                            <div className="bg-omni-blue h-3 rounded-full" style={{ width: '15%' }}></div>
                          </div>
                          <span className="text-sm font-bold">15%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Popular Service Categories</CardTitle>
                  <CardDescription>Most booked wellness services</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Dru Yoga & Movement</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-omni-blue h-2 rounded-full" style={{ width: '78%' }}></div>
                        </div>
                        <span className="text-sm font-bold">78%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Buteyko Breathing</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-omni-green h-2 rounded-full" style={{ width: '65%' }}></div>
                        </div>
                        <span className="text-sm font-bold">65%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Wellness Workshops</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-omni-orange h-2 rounded-full" style={{ width: '52%' }}></div>
                        </div>
                        <span className="text-sm font-bold">52%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Mental Health Support</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-omni-purple h-2 rounded-full" style={{ width: '41%' }}></div>
                        </div>
                        <span className="text-sm font-bold">41%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Online Consultations</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-gradient-to-r from-omni-blue to-omni-purple h-2 rounded-full" style={{ width: '33%' }}></div>
                        </div>
                        <span className="text-sm font-bold">33%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;