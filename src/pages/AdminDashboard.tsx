import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ProductManagement from "@/pages/admin/ProductManagement";
import AdminTools from "@/pages/admin/AdminTools";
import AdminLeads from "@/pages/admin/AdminLeads";
import AdminInvites from "@/pages/admin/AdminInvites";
import AdminTasks from "@/pages/admin/AdminTasks";
import AdminContent from "@/pages/admin/AdminContent";
import AdminUWCRecruitment from "@/pages/admin/AdminUWCRecruitment";
import AdminViatorTours from "@/pages/admin/AdminViatorTours";
import AdminSettings from "@/pages/admin/AdminSettings";
import AdminSchedule from "@/pages/admin/AdminSchedule";
import AdminTeamManagement from "@/pages/admin/AdminTeamManagement";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  ShoppingCart, 
  Calendar, 
  FileText, 
  DollarSign,
  Package,
  Settings,
  LogOut,
  Plus,
  Home
} from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { IMAGES } from "@/lib/images";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    orders: [] as any[],
    bookings: [] as any[],
    blogPosts: [] as any[],
    services: [] as any[],
    tours: [] as any[],
    recentActivity: [] as any[],
    stats: {
      totalRevenue: 0,
      totalOrders: 0,
      totalBookings: 0,
      totalUsers: 0,
      totalProviders: 0,
      activeProviders: 0,
      wellcoinCirculation: 0,
      pendingOrders: 0,
      activeServices: 0,
      totalProducts: 0,
      affiliateProducts: 0,
      omniProducts: 0,
      totalBlogPosts: 0,
      publishedBlogPosts: 0
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
    
    const { data: isAdmin, error } = await supabase.rpc('is_admin', { 
      user_id: user.id 
    });
    
    if (error || !isAdmin) {
      toast({
        title: 'Access Denied',
        description: 'You do not have admin privileges.',
        variant: 'destructive',
      });
      navigate('/');
      return;
    }
  };

  const fetchDashboardData = async () => {
    try {
      // Parallel fetch all data
      const [
        ordersResult,
        bookingsResult,
        blogPostsResult,
        usersCountResult,
        servicesResult,
        toursResult,
        totalProductsResult,
        affiliateResult,
        omniResult,
        providerResult,
        consumerResult
      ] = await Promise.all([
        supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(10),
        supabase.from('tour_bookings').select('*, tours(title)').order('created_at', { ascending: false }).limit(10),
        supabase.from('blog_posts').select('*').order('created_at', { ascending: false }).limit(10),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('services').select('*').eq('active', true),
        supabase.from('tours').select('*').eq('active', true),
        supabase.from('affiliate_products').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('affiliate_products').select('*', { count: 'exact', head: true }).eq('is_active', true).in('affiliate_program_id', ['cj', 'awin', 'viator']),
        supabase.from('affiliate_products').select('*', { count: 'exact', head: true }).eq('is_active', true).eq('affiliate_program_id', 'omni'),
        supabase.from('provider_profiles').select('*').eq('verified', true),
        supabase.from('consumer_profiles').select('wellcoin_balance')
      ]);

      const orders = ordersResult.data || [];
      const bookings = bookingsResult.data || [];
      const blogPosts = blogPostsResult.data || [];
      const services = servicesResult.data || [];
      const tours = toursResult.data || [];
      const providers = providerResult.data || [];

      // Calculate stats
      const totalRevenue = orders.reduce((sum, order) => sum + (order.amount || 0), 0);
      const pendingOrders = orders.filter(order => order.status === 'pending').length;
      const wellcoinTotal = consumerResult.data?.reduce((sum, c) => sum + (c.wellcoin_balance || 0), 0) || 0;
      const publishedPosts = blogPosts.filter(p => p.status === 'published').length;

      // Build recent activity from real data
      const recentActivity = [
        ...(orders.slice(0, 3).map(o => ({
          type: 'order',
          description: `New order: ${o.product_name}`,
          time: new Date(o.created_at).toLocaleString(),
          amount: o.amount
        }))),
        ...(bookings.slice(0, 2).map(b => ({
          type: 'booking',
          description: `Tour booking: ${b.tours?.title || 'Tour'}`,
          time: new Date(b.created_at).toLocaleString(),
          amount: b.total_price
        })))
      ];

      setDashboardData({
        orders,
        bookings,
        blogPosts,
        services,
        tours,
        recentActivity,
        stats: {
          totalRevenue,
          totalOrders: orders.length,
          totalBookings: bookings.length,
          totalUsers: usersCountResult.count || 0,
          totalProviders: providers.length,
          activeProviders: providers.filter(p => p.verified).length,
          wellcoinCirculation: wellcoinTotal,
          pendingOrders,
          activeServices: services.length,
          totalProducts: totalProductsResult.count || 0,
          affiliateProducts: affiliateResult.count || 0,
          omniProducts: omniResult.count || 0,
          totalBlogPosts: blogPosts.length,
          publishedBlogPosts: publishedPosts
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
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex h-14 items-center justify-between px-4 md:px-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-3 min-w-0">
            <Link to="/" className="shrink-0">
              <img
                src={IMAGES.logos.omniHorizontal}
                alt="Omni"
                className="h-7 md:h-8 w-auto object-contain"
              />
            </Link>
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-border">/</span>
              <span className="text-sm font-medium">Admin</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <Button variant="ghost" size="sm" asChild className="h-8 px-2.5">
              <Link to="/">
                <Home className="h-3.5 w-3.5 md:mr-1.5" />
                <span className="hidden md:inline text-xs">Site</span>
              </Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="h-8 px-2.5 text-muted-foreground">
              <LogOut className="h-3.5 w-3.5 md:mr-1.5" />
              <span className="hidden sm:inline text-xs">Logout</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-heading text-2xl">Dashboard</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Omni Wellness Media — Admin</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => navigate('/blog-editor')} className="h-8 text-xs rounded-full">
              <Plus className="h-3 w-3 mr-1" />
              New Post
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {[
            { label: 'Revenue', value: `R${dashboardData.stats.totalRevenue.toLocaleString()}`, sub: 'Total', icon: DollarSign },
            { label: 'Products', value: dashboardData.stats.totalProducts, sub: `${dashboardData.stats.affiliateProducts} affiliate`, icon: Package },
            { label: 'Providers', value: dashboardData.stats.totalProviders, sub: `${dashboardData.stats.activeProviders} verified`, icon: Users },
            { label: 'Users', value: dashboardData.stats.totalUsers, sub: 'Registered', icon: Users },
            { label: 'Orders', value: dashboardData.stats.totalOrders, sub: `${dashboardData.stats.pendingOrders} pending`, icon: ShoppingCart },
            { label: 'Content', value: dashboardData.stats.totalBlogPosts, sub: `${dashboardData.stats.publishedBlogPosts} published`, icon: FileText },
          ].map((stat) => (
            <Card key={stat.label} className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] text-muted-foreground font-medium">{stat.label}</span>
                  <stat.icon className="h-3.5 w-3.5 text-muted-foreground/50" />
                </div>
                <div className="text-lg md:text-xl font-heading">{stat.value}</div>
                <p className="text-[10px] text-muted-foreground mt-0.5">{stat.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <ScrollArea className="w-full">
            <TabsList className="inline-flex w-max gap-0.5 p-1 h-9 bg-muted/50">
              {[
                { value: 'overview', label: 'Overview' },
                { value: 'content', label: 'Content' },
                { value: 'tasks', label: 'Tasks' },
                { value: 'products', label: 'Products' },
                { value: 'leads', label: 'Leads' },
                { value: 'team', label: 'Team' },
                { value: 'orders', label: 'Orders' },
                { value: 'bookings', label: 'Bookings' },
                { value: 'tours', label: 'Viator' },
                { value: 'uwc', label: 'UWC' },
                { value: 'tools', label: 'Tools' },
              ].map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value} className="text-xs px-3 h-7 rounded-md">
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Recent Activity */}
              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="font-heading text-base">Recent Activity</CardTitle>
                  <CardDescription className="text-xs">Latest orders and bookings</CardDescription>
                </CardHeader>
                <CardContent>
                  {dashboardData.recentActivity.length === 0 ? (
                    <p className="text-center text-muted-foreground py-6 text-sm">No recent activity</p>
                  ) : (
                    <div className="space-y-3">
                      {dashboardData.recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium truncate">{activity.description}</p>
                            <p className="text-xs text-muted-foreground">{activity.time}</p>
                          </div>
                          {activity.amount && (
                            <Badge variant="secondary" className="shrink-0 ml-2">
                              R{activity.amount.toLocaleString()}
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Platform Stats */}
              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="font-heading text-base">Platform Metrics</CardTitle>
                  <CardDescription className="text-xs">Key performance indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">WellCoins in Circulation</span>
                      <span className="font-bold text-primary">{dashboardData.stats.wellcoinCirculation.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Active Services</span>
                      <span className="font-bold">{dashboardData.stats.activeServices}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Active Tours</span>
                      <span className="font-bold">{dashboardData.tours.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Omni Products</span>
                      <span className="font-bold">{dashboardData.stats.omniProducts}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Affiliate Products</span>
                      <span className="font-bold">{dashboardData.stats.affiliateProducts}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="content">
            <AdminContent />
          </TabsContent>

          <TabsContent value="tasks">
            <AdminTasks />
          </TabsContent>

          <TabsContent value="products">
            <ProductManagement />
          </TabsContent>

          <TabsContent value="leads">
            <AdminLeads />
          </TabsContent>

          <TabsContent value="team">
            <AdminInvites />
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Recent Orders</CardTitle>
                <CardDescription className="text-xs">Latest customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                {dashboardData.orders.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8 text-sm">No orders yet</p>
                ) : (
                  <div className="space-y-3">
                    {dashboardData.orders.map((order: any) => (
                      <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm truncate">{order.customer_name || 'Customer'}</p>
                          <p className="text-xs text-muted-foreground truncate">{order.customer_email}</p>
                          <p className="text-xs truncate">{order.product_name}</p>
                        </div>
                        <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
                          <p className="font-bold text-sm">R{order.amount?.toLocaleString() || 0}</p>
                          <Badge variant={order.status === 'completed' ? 'default' : 'secondary'} className="text-[10px]">
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Tour Bookings</CardTitle>
                <CardDescription className="text-xs">Manage tour reservations</CardDescription>
              </CardHeader>
              <CardContent>
                {dashboardData.bookings.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8 text-sm">No bookings yet</p>
                ) : (
                  <div className="space-y-3">
                    {dashboardData.bookings.map((booking: any) => (
                      <div key={booking.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm truncate">{booking.contact_name || 'Guest'}</p>
                          <p className="text-xs text-muted-foreground truncate">{booking.contact_email}</p>
                          <p className="text-xs truncate">{booking.tours?.title || 'Tour'}</p>
                          <p className="text-[10px] text-muted-foreground">
                            {booking.participants} guests • {booking.booking_date ? new Date(booking.booking_date).toLocaleDateString() : 'TBD'}
                          </p>
                        </div>
                        <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
                          <p className="font-bold text-sm">R{booking.total_price?.toLocaleString() || 0}</p>
                          <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'} className="text-[10px]">
                            {booking.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tours">
            <AdminViatorTours />
          </TabsContent>

          <TabsContent value="tools">
            <AdminTools />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
