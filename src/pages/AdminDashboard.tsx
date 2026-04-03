import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut, Plus, Home, ChevronDown, FileText, Mic, Video, Menu } from "lucide-react";
import { IMAGES } from "@/lib/images";
import SmartGreeting from "@/components/dashboard/SmartGreeting";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import AdminHome from "@/components/dashboard/AdminHome";

// Lazy load section components
const ProductManagement = lazy(() => import("@/pages/admin/ProductManagement"));
const AdminTools = lazy(() => import("@/pages/admin/AdminTools"));
const AdminLeads = lazy(() => import("@/pages/admin/AdminLeads"));
const AdminInvites = lazy(() => import("@/pages/admin/AdminInvites"));
const AdminTasks = lazy(() => import("@/pages/admin/AdminTasks"));
const AdminContent = lazy(() => import("@/pages/admin/AdminContent"));
const AdminUWCRecruitment = lazy(() => import("@/pages/admin/AdminUWCRecruitment"));
const AdminViatorTours = lazy(() => import("@/pages/admin/AdminViatorTours"));
const AdminAnalytics = lazy(() => import("@/pages/admin/AdminAnalytics"));
const AdminAccounting = lazy(() => import("@/pages/admin/AdminAccounting"));
const SocialScheduler = lazy(() => import("@/pages/admin/SocialScheduler"));
const NewsletterEditor = lazy(() => import("@/pages/admin/NewsletterEditor"));
const AdminProviders = lazy(() => import("@/pages/admin/AdminProviders"));

const SectionLoader = () => (
  <div className="flex items-center justify-center py-16">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
  </div>
);

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("home");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    orders: [] as any[],
    bookings: [] as any[],
    serviceBookings: [] as any[],
    recentActivity: [] as any[],
    alerts: [] as { type: "warning" | "info"; message: string }[],
    alertCounts: {} as Record<string, number>,
    stats: {
      totalRevenue: 0, totalOrders: 0, totalBookings: 0, totalServiceBookings: 0,
      totalUsers: 0, totalProviders: 0, activeProviders: 0, wellcoinCirculation: 0,
      pendingOrders: 0, activeServices: 0, totalProducts: 0, affiliateProducts: 0,
      omniProducts: 0, totalBlogPosts: 0, publishedBlogPosts: 0, activeTours: 0,
    },
  });

  useEffect(() => {
    const init = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) { navigate("/auth"); return; }
      const { data: isAdmin, error } = await supabase.rpc("is_admin", { user_id: authUser.id });
      if (error || !isAdmin) {
        toast({ title: "Access Denied", description: "You do not have admin privileges.", variant: "destructive" });
        navigate("/");
        return;
      }
      await fetchDashboardData();
    };
    init();
  }, []);

  const fetchDashboardData = useCallback(async () => {
    try {
      const [
        ordersResult, bookingsResult, serviceBookingsResult,
        usersCountResult, servicesResult, toursResult,
        totalProductsResult, affiliateResult, omniResult,
        providerResult, consumerResult,
        ordersCountResult, bookingsCountResult, serviceBookingsCountResult,
        blogCountResult, publishedBlogCountResult, pendingOrdersCountResult,
        revenueResult, allProvidersResult,
      ] = await Promise.all([
        supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(10),
        supabase.from("tour_bookings").select("*, tours(title)").order("created_at", { ascending: false }).limit(10),
        supabase.from("contact_submissions").select("*").order("created_at", { ascending: false }).limit(10),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("services").select("*", { count: "exact", head: true }).eq("active", true),
        supabase.from("tours").select("*", { count: "exact", head: true }).eq("active", true),
        supabase.from("affiliate_products").select("*", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("affiliate_products").select("*", { count: "exact", head: true }).eq("is_active", true).in("affiliate_program_id", ["cj", "awin", "viator"]),
        supabase.from("affiliate_products").select("*", { count: "exact", head: true }).eq("is_active", true).eq("affiliate_program_id", "omni"),
        supabase.from("provider_profiles").select("*", { count: "exact", head: true }).eq("verified", true),
        supabase.from("consumer_profiles").select("wellcoin_balance"),
        supabase.from("orders").select("*", { count: "exact", head: true }),
        supabase.from("tour_bookings").select("*", { count: "exact", head: true }),
        supabase.from("contact_submissions").select("*", { count: "exact", head: true }),
        supabase.from("blog_posts").select("*", { count: "exact", head: true }),
        supabase.from("blog_posts").select("*", { count: "exact", head: true }).eq("status", "published"),
        supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("orders").select("amount"),
        supabase.from("provider_profiles").select("*", { count: "exact", head: true }),
      ]);

      const orders = ordersResult.data || [];
      const bookings = bookingsResult.data || [];
      const serviceBookings = serviceBookingsResult.data || [];
      const totalRevenue = (revenueResult.data || []).reduce((sum: number, o: any) => sum + (o.amount || 0), 0);
      const wellcoinTotal = consumerResult.data?.reduce((sum, c) => sum + (c.wellcoin_balance || 0), 0) || 0;

      const recentActivity = [
        ...orders.slice(0, 3).map(o => ({ type: "order", description: `New order: ${o.product_name}`, time: new Date(o.created_at).toLocaleString(), amount: o.amount })),
        ...bookings.slice(0, 2).map(b => ({ type: "booking", description: `Tour booking: ${b.tours?.title || "Tour"}`, time: new Date(b.created_at).toLocaleString(), amount: b.total_price })),
        ...serviceBookings.slice(0, 3).map(s => ({ type: "lead", description: `${s.service ? `${s.service} lead` : "New inquiry"}: ${s.name}`, time: new Date(s.created_at).toLocaleString(), amount: null })),
      ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 8);

      // Alerts
      const alerts: { type: "warning" | "info"; message: string }[] = [];
      const alertCounts: Record<string, number> = {};
      const pendingBookings = bookings.filter((b: any) => b.status === "pending");
      if (pendingBookings.length > 0) {
        alerts.push({ type: "warning", message: `${pendingBookings.length} pending booking${pendingBookings.length > 1 ? "s" : ""}` });
        alertCounts.bookings = pendingBookings.length;
      }
      const pendingLeads = serviceBookings.filter((s: any) => s.status === "pending");
      if (pendingLeads.length > 0) {
        alerts.push({ type: "warning", message: `${pendingLeads.length} unanswered lead${pendingLeads.length > 1 ? "s" : ""}` });
        alertCounts.leads = pendingLeads.length;
      }
      if ((pendingOrdersCountResult.count || 0) > 0) {
        alerts.push({ type: "info", message: `${pendingOrdersCountResult.count} pending order${(pendingOrdersCountResult.count || 0) > 1 ? "s" : ""}` });
        alertCounts.orders = pendingOrdersCountResult.count || 0;
      }
      const unverified = (allProvidersResult.count || 0) - (providerResult.count || 0);
      if (unverified > 0) {
        alerts.push({ type: "info", message: `${unverified} unverified provider${unverified > 1 ? "s" : ""}` });
        alertCounts.providers = unverified;
      }

      setDashboardData({
        orders, bookings, serviceBookings, recentActivity, alerts, alertCounts,
        stats: {
          totalRevenue,
          totalOrders: ordersCountResult.count || 0,
          totalBookings: bookingsCountResult.count || 0,
          totalServiceBookings: serviceBookingsCountResult.count || 0,
          totalUsers: usersCountResult.count || 0,
          totalProviders: allProvidersResult.count || 0,
          activeProviders: providerResult.count || 0,
          wellcoinCirculation: wellcoinTotal,
          pendingOrders: pendingOrdersCountResult.count || 0,
          activeServices: servicesResult.count || 0,
          totalProducts: totalProductsResult.count || 0,
          affiliateProducts: affiliateResult.count || 0,
          omniProducts: omniResult.count || 0,
          totalBlogPosts: blogCountResult.count || 0,
          publishedBlogPosts: publishedBlogCountResult.count || 0,
          activeTours: toursResult.count || 0,
        },
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    navigate("/");
  }, [navigate]);

  const handleSectionChange = useCallback((section: string) => {
    setActiveSection(section);
    setMobileNavOpen(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const renderSection = () => {
    switch (activeSection) {
      case "home":
        return <AdminHome stats={dashboardData.stats} recentActivity={dashboardData.recentActivity} alerts={dashboardData.alerts} onNavigate={handleSectionChange} />;
      case "analytics":
        return <Suspense fallback={<SectionLoader />}><AdminAnalytics /></Suspense>;
      case "leads":
        return <Suspense fallback={<SectionLoader />}><AdminLeads /></Suspense>;
      case "bookings":
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Service Bookings & Leads</CardTitle>
                <CardDescription className="text-xs">Session requests and inquiries ({dashboardData.stats.totalServiceBookings} total)</CardDescription>
              </CardHeader>
              <CardContent>
                {dashboardData.serviceBookings.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8 text-sm">No service bookings yet</p>
                ) : (
                  <div className="space-y-3">
                    {dashboardData.serviceBookings.map((lead: any) => (
                      <div key={lead.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm truncate">{lead.name || "Anonymous"}</p>
                          <p className="text-xs text-muted-foreground truncate">{lead.email}</p>
                          {lead.service && <p className="text-xs text-primary truncate">{lead.service}</p>}
                          <p className="text-[10px] text-muted-foreground truncate">{lead.message?.substring(0, 80)}{lead.message?.length > 80 ? "..." : ""}</p>
                        </div>
                        <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
                          <p className="text-[10px] text-muted-foreground">{new Date(lead.created_at).toLocaleDateString()}</p>
                          <Badge variant={lead.status === "responded" ? "default" : lead.status === "in_progress" ? "outline" : "secondary"} className="text-[10px]">{lead.status || "pending"}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Tour Bookings</CardTitle>
                <CardDescription className="text-xs">Manage tour reservations ({dashboardData.stats.totalBookings} total)</CardDescription>
              </CardHeader>
              <CardContent>
                {dashboardData.bookings.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8 text-sm">No tour bookings yet</p>
                ) : (
                  <div className="space-y-3">
                    {dashboardData.bookings.map((booking: any) => (
                      <div key={booking.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm truncate">{booking.contact_name || "Guest"}</p>
                          <p className="text-xs text-muted-foreground truncate">{booking.contact_email}</p>
                          <p className="text-xs truncate">{booking.tours?.title || "Tour"}</p>
                          <p className="text-[10px] text-muted-foreground">{booking.participants} guests &middot; {booking.booking_date ? new Date(booking.booking_date).toLocaleDateString() : "TBD"}</p>
                        </div>
                        <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
                          <p className="font-bold text-sm">R{booking.total_price?.toLocaleString() || 0}</p>
                          <Badge variant={booking.status === "confirmed" ? "default" : "secondary"} className="text-[10px]">{booking.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );
      case "orders":
        return (
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
                        <p className="font-medium text-sm truncate">{order.customer_name || "Customer"}</p>
                        <p className="text-xs text-muted-foreground truncate">{order.customer_email}</p>
                        <p className="text-xs truncate">{order.product_name}</p>
                      </div>
                      <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
                        <p className="font-bold text-sm">R{order.amount?.toLocaleString() || 0}</p>
                        <Badge variant={order.status === "completed" ? "default" : "secondary"} className="text-[10px]">{order.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );
      case "providers":
        return <Suspense fallback={<SectionLoader />}><AdminProviders /></Suspense>;
      case "products":
        return <Suspense fallback={<SectionLoader />}><ProductManagement /></Suspense>;
      case "content":
        return <Suspense fallback={<SectionLoader />}><AdminContent /></Suspense>;
      case "newsletter":
        return <Suspense fallback={<SectionLoader />}><NewsletterEditor /></Suspense>;
      case "social":
        return <Suspense fallback={<SectionLoader />}><SocialScheduler /></Suspense>;
      case "accounting":
        return <Suspense fallback={<SectionLoader />}><AdminAccounting /></Suspense>;
      case "team":
        return <Suspense fallback={<SectionLoader />}><AdminInvites /></Suspense>;
      case "tasks":
        return <Suspense fallback={<SectionLoader />}><AdminTasks /></Suspense>;
      case "tours":
        return <Suspense fallback={<SectionLoader />}><AdminViatorTours /></Suspense>;
      case "uwc":
        return <Suspense fallback={<SectionLoader />}><AdminUWCRecruitment /></Suspense>;
      case "tools":
        return <Suspense fallback={<SectionLoader />}><AdminTools /></Suspense>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex h-14 items-center justify-between px-4 md:px-6 max-w-[1400px] mx-auto">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile menu */}
            <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden h-8 w-8 p-0">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-56 p-4">
                <div className="mt-4">
                  <AdminSidebar activeSection={activeSection} onSectionChange={handleSectionChange} alerts={dashboardData.alertCounts} />
                </div>
              </SheetContent>
            </Sheet>
            <Link to="/" className="shrink-0">
              <img src={IMAGES.logos.omniHorizontal} alt="Omni" className="h-7 md:h-8 w-auto object-contain" />
            </Link>
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-border">/</span>
              <span className="text-sm font-medium">Admin</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" className="h-8 text-xs rounded-full">
                  <Plus className="h-3 w-3 mr-1" />
                  <span className="hidden sm:inline">Create</span>
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate("/blog/editor/new")}>
                  <FileText className="h-3.5 w-3.5 mr-2" /> Blog Post
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  <Mic className="h-3.5 w-3.5 mr-2" /> Podcast <Badge variant="outline" className="ml-2 text-[9px]">Soon</Badge>
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  <Video className="h-3.5 w-3.5 mr-2" /> Video <Badge variant="outline" className="ml-2 text-[9px]">Soon</Badge>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="sm" asChild className="h-8 px-2.5">
              <Link to="/"><Home className="h-3.5 w-3.5 md:mr-1.5" /><span className="hidden md:inline text-xs">Site</span></Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="h-8 px-2.5 text-muted-foreground">
              <LogOut className="h-3.5 w-3.5 md:mr-1.5" /><span className="hidden sm:inline text-xs">Logout</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex max-w-[1400px] mx-auto">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block border-r border-border/50 min-h-[calc(100vh-3.5rem)] p-4">
          <AdminSidebar activeSection={activeSection} onSectionChange={handleSectionChange} alerts={dashboardData.alertCounts} />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-6 min-w-0">
          <SmartGreeting
            userName={user?.user_metadata?.full_name || user?.email?.split("@")[0]}
            role="admin"
            alerts={activeSection === "home" ? dashboardData.alerts : []}
            subtitle="Omni Wellness Media"
          />
          {renderSection()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
