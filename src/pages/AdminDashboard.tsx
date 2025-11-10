import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { helenAdminData } from "@/data/sandyDemoData";
import { useToast } from "@/hooks/use-toast";
import LiveDemoPresence from "@/components/collaboration/LiveDemoPresence";
import ProductManagement from "@/pages/admin/ProductManagement";
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
  LogOut
} from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    orders: [],
    bookings: [],
    blogPosts: [],
    users: [],
    services: [],
    tours: [],
    providers: helenAdminData.topProviders,
    recentActivity: helenAdminData.recentActivity,
    stats: {
      totalRevenue: helenAdminData.platformStats.totalRevenue,
      monthlyRevenue: helenAdminData.platformStats.monthlyRevenue,
      totalOrders: 0,
      totalBookings: helenAdminData.platformStats.totalBookings,
      monthlyBookings: helenAdminData.platformStats.monthlyBookings,
      totalUsers: helenAdminData.platformStats.totalUsers,
      activeUsers: helenAdminData.platformStats.monthlyActiveUsers,
      totalProviders: helenAdminData.platformStats.totalProviders,
      activeProviders: helenAdminData.platformStats.activeProviders,
      wellcoinCirculation: helenAdminData.platformStats.wellcoinCirculation,
      platformGrowth: helenAdminData.platformStats.platformGrowth,
      averageProviderRating: helenAdminData.platformStats.averageProviderRating,
      pendingOrders: 0,
      activeServices: 0
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

      // Calculate stats
      const totalRevenue = orders?.reduce((sum, order) => sum + (order.amount || 0), 0) || 0;
      const pendingOrders = orders?.filter(order => order.status === 'pending').length || 0;
      const pendingBookings = bookings?.filter(booking => booking.status === 'pending').length || 0;

      setDashboardData({
        orders: orders || [],
        bookings: bookings || [],
        blogPosts: blogPosts || [],
        users: [],
        services: services || [],
        tours: tours || [],
        providers: helenAdminData.topProviders,
        recentActivity: helenAdminData.recentActivity,
        stats: {
          totalRevenue,
          monthlyRevenue: Math.round(totalRevenue / 12), // Estimated monthly
          totalOrders: orders?.length || 0,
          totalBookings: bookings?.length || 0,
          monthlyBookings: Math.round((bookings?.length || 0) / 12), // Estimated monthly
          totalUsers: usersCount || 0,
          activeUsers: Math.round((usersCount || 0) * 0.7), // Estimated 70% active
          totalProviders: services?.length || 0,
          activeProviders: services?.filter(s => s.active).length || 0,
          wellcoinCirculation: 10000, // Placeholder
          platformGrowth: 15, // Placeholder percentage
          averageProviderRating: 4.5, // Placeholder
          pendingOrders,
          activeServices: services?.length || 0
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
      {/* Header */}
      <div className="border-b bg-white">
        <div className="flex h-16 items-center justify-between px-6">
          <h1 className="text-2xl font-bold text-primary">Omni Wellness Admin</h1>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Enhanced Stats Cards for Helen's Admin View */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Platform Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R{dashboardData.stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+{dashboardData.stats.platformGrowth}% growth</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R{dashboardData.stats.monthlyRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Providers</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.stats.totalProviders}</div>
              <p className="text-xs text-muted-foreground">{dashboardData.stats.activeProviders} active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Platform Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.stats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">{dashboardData.stats.activeUsers} monthly active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">WellCoin Circulation</CardTitle>
              <Calendar className="h-4 w-4 text-omni-orange" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-omni-orange">{dashboardData.stats.wellcoinCirculation.toLocaleString()} WC</div>
              <p className="text-xs text-muted-foreground">In circulation</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.stats.averageProviderRating}</div>
              <p className="text-xs text-muted-foreground">Provider average</p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Main Content Tabs for Helen's Admin Interface */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-9">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="providers">Top Providers</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="blog">Blog</TabsTrigger>
          </TabsList>

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

          <TabsContent value="products" className="space-y-4">
            <ProductManagement />
          </TabsContent>

          <TabsContent value="providers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Providers</CardTitle>
                <CardDescription>Leading wellness providers on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.providers.map((provider, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-omni-blue to-omni-purple rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-lg">{provider.name}</p>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>⭐ {provider.rating}</span>
                            <span>📅 {provider.bookings} bookings</span>
                            <span className="text-green-600">📈 +{provider.growth}% growth</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-omni-green">R{provider.revenue.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">Monthly revenue</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Platform Activity</CardTitle>
                <CardDescription>Latest actions and events across the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-2 h-2 rounded-full bg-omni-blue mt-2 flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {activity.type.replace('_', ' ')}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Orders</CardTitle>
                <CardDescription>Manage customer orders and payments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.orders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{order.customer_name}</p>
                        <p className="text-sm text-muted-foreground">{order.customer_email}</p>
                        <p className="text-sm">{order.product_name}</p>
                        <p className="text-xs text-muted-foreground">Order #{order.order_number}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">R{order.amount}</p>
                        <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                          {order.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
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
                  {dashboardData.bookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{booking.contact_name}</p>
                        <p className="text-sm text-muted-foreground">{booking.contact_email}</p>
                        <p className="text-sm">{booking.tours?.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {booking.participants} participant(s) • {new Date(booking.booking_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">R{booking.total_price}</p>
                        <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                          {booking.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dashboardData.services.map((service) => (
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tours" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tours & Retreats</CardTitle>
                <CardDescription>Manage tour packages and experiences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dashboardData.tours.map((tour) => (
                    <div key={tour.id} className="p-4 border rounded-lg">
                      <h3 className="font-medium">{tour.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{tour.destination}</p>
                      <p className="text-sm mt-1">{tour.duration}</p>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-sm font-medium">From R{tour.price_from}</p>
                        <Badge variant={tour.featured ? 'default' : 'secondary'}>
                          {tour.featured ? 'Featured' : 'Standard'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
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