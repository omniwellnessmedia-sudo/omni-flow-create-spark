import { useState, useEffect, useCallback, useMemo, lazy, Suspense } from "react";
import { toast } from "sonner";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Plus, Eye, MessageCircle, FileText, Edit, Package, Zap } from "lucide-react";
import ProviderHeader from "@/components/provider-dashboard/ProviderHeader";
import StatsGrid from "@/components/provider-dashboard/StatsGrid";
import ProfileCompletionBar from "@/components/provider-dashboard/ProfileCompletionBar";
import ServiceCard from "@/components/provider-dashboard/ServiceCard";
import SmartGreeting from "@/components/dashboard/SmartGreeting";
import AnalyticsDashboard from "@/components/provider-dashboard/AnalyticsDashboard";
import CRMDashboard from "@/components/provider-dashboard/CRMDashboard";
import FinancialDashboard from "@/components/provider-dashboard/FinancialDashboard";
import ProUpgradeCard from "@/components/provider-dashboard/ProUpgradeCard";
import { useProSubscription } from "@/hooks/useProSubscription";

const ProviderMediaUpload = lazy(() => import("@/components/ProviderMediaUpload"));

const TABS = [
  { value: "overview", label: "Overview" },
  { value: "services", label: "Services" },
  { value: "bookings", label: "Bookings" },
  { value: "transactions", label: "Earnings" },
  { value: "analytics", label: "Analytics" },
  { value: "clients", label: "Clients" },
  { value: "financial", label: "Financial" },
  { value: "media", label: "Media" },
  { value: "blog", label: "Blog" },
  { value: "reviews", label: "Reviews" },
] as const;

const ProviderDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";
  const setActiveTab = (value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value === "overview") next.delete("tab"); else next.set("tab", value);
      return next;
    }, { replace: true });
  };

  const [wellCoinBalance, setWellCoinBalance] = useState(0);
  const [zarEarnings, setZarEarnings] = useState(0);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [providerProfile, setProviderProfile] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [upcomingBookings, setUpcomingBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  const { isPro } = useProSubscription(providerProfile?.pricing_info);

  const loadDashboardData = useCallback(async (userId: string, showLoader = true) => {
    if (showLoader) setLoading(true);
    setDashboardError(null);
    try {
      const [profileRes, servicesRes, bookingsRes, transactionsRes, blogPostsRes] = await Promise.all([
        supabase.from("provider_profiles").select("*").eq("id", userId).maybeSingle(),
        supabase.from("services").select("*").eq("provider_id", userId).order("created_at", { ascending: false }),
        supabase.from("bookings").select("*, services(title)").eq("provider_id", userId).order("created_at", { ascending: false }).limit(50),
        supabase.from("transactions").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(50),
        supabase.from("blog_posts").select("id,title,slug,status,updated_at,published_at,views_count,likes_count,comments_count").eq("user_id", userId).order("updated_at", { ascending: false }).limit(10),
      ]);

      const firstError = profileRes.error || servicesRes.error || bookingsRes.error || transactionsRes.error || blogPostsRes.error;
      if (firstError) throw firstError;

      const profile = profileRes.data;
      setProviderProfile(profile);
      setWellCoinBalance(profile?.wellcoin_balance || 0);
      setServices(servicesRes.data || []);
      setUpcomingBookings(bookingsRes.data || []);
      setRecentTransactions(transactionsRes.data || []);
      setBlogPosts(blogPostsRes.data || []);

      const fields = [profile?.business_name, profile?.description, profile?.location, profile?.phone, profile?.specialties?.length > 0, profile?.certifications?.length > 0, profile?.profile_image_url];
      setProfileCompletion(Math.round((fields.filter(Boolean).length / fields.length) * 100));

      const now = new Date();
      const monthlyEarnings = (transactionsRes.data || [])
        .filter((t: any) => {
          const d = new Date(t.created_at);
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && t.transaction_type === "earning" && t.amount_zar > 0;
        })
        .reduce((sum: number, t: any) => sum + (t.amount_zar || 0), 0);
      setZarEarnings(monthlyEarnings);
      setLastSyncedAt(new Date().toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" }));
    } catch (error: any) {
      console.error("Dashboard load error:", error);
      setDashboardError(error?.message || "Some dashboard data could not load.");
    } finally {
      if (showLoader) setLoading(false);
    }
  }, []);

  useEffect(() => {
    let initialised = false;
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/auth"); return; }
      await loadDashboardData(session.user.id);
      initialised = true;
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      // Only reload on real auth transitions, not the initial-session replay that fires alongside checkAuth above
      if (initialised && (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "USER_UPDATED")) {
        loadDashboardData(session.user.id, false);
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate, loadDashboardData]);

  useEffect(() => {
    if (!user?.id) return;

    let refreshTimer: ReturnType<typeof setTimeout> | null = null;
    const refreshDashboard = () => {
      if (refreshTimer) clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => loadDashboardData(user.id, false), 350);
    };

    const channel = supabase
      .channel(`provider-dashboard-${user.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "provider_profiles", filter: `id=eq.${user.id}` }, refreshDashboard)
      .on("postgres_changes", { event: "*", schema: "public", table: "services", filter: `provider_id=eq.${user.id}` }, refreshDashboard)
      .on("postgres_changes", { event: "*", schema: "public", table: "bookings", filter: `provider_id=eq.${user.id}` }, refreshDashboard)
      .on("postgres_changes", { event: "*", schema: "public", table: "transactions", filter: `user_id=eq.${user.id}` }, refreshDashboard)
      .on("postgres_changes", { event: "*", schema: "public", table: "blog_posts", filter: `user_id=eq.${user.id}` }, refreshDashboard)
      .subscribe();

    return () => {
      if (refreshTimer) clearTimeout(refreshTimer);
      supabase.removeChannel(channel);
    };
  }, [user?.id, loadDashboardData]);

  const toggleServiceStatus = useCallback(async (serviceId: string, currentStatus: boolean) => {
    const { error } = await supabase.from("services").update({ active: !currentStatus }).eq("id", serviceId);
    if (error) { toast.error(error.message); return; }
    setServices((prev) => prev.map((s) => (s.id === serviceId ? { ...s, active: !currentStatus } : s)));
    toast.success(`Service ${!currentStatus ? "activated" : "deactivated"}`);
  }, []);

  const deleteService = useCallback(async (serviceId: string) => {
    if (!confirm("Delete this service? This cannot be undone.")) return;
    const { error } = await supabase.from("services").delete().eq("id", serviceId);
    if (error) { toast.error(error.message); return; }
    setServices((prev) => prev.filter((s) => s.id !== serviceId));
    toast.success("Service deleted");
  }, []);

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    navigate("/");
  }, [navigate]);

  const activeServices = useMemo(() => services.filter((s) => s.active).length, [services]);
  // Real reviews aren't wired up yet — show "New" via the StatsGrid falsy-value fallback rather than a fake 4.9
  const avgRating = 0;

  const handleMediaUpdate = useCallback(() => {
    if (user) loadDashboardData(user.id);
  }, [user, loadDashboardData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ProviderHeader hasProfile={!!providerProfile} onLogout={handleLogout} providerId={providerProfile?.id ?? null} />

      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <SmartGreeting
            userName={providerProfile?.business_name || user?.email?.split("@")[0]}
            role="provider"
            alerts={[
              ...(profileCompletion < 100 ? [{ type: "info" as const, message: `Profile ${profileCompletion}% complete` }] : []),
              ...(upcomingBookings.filter(b => b.status === "pending").length > 0 ? [{ type: "warning" as const, message: `${upcomingBookings.filter(b => b.status === "pending").length} pending booking${upcomingBookings.filter(b => b.status === "pending").length > 1 ? "s" : ""}` }] : []),
            ]}
            subtitle={providerProfile?.location}
          />
          <div className="flex gap-2 shrink-0">
            {!isPro && (
              <Button
                size="sm"
                variant="outline"
                className="h-8 text-xs rounded-full border-primary/30 text-primary hover:bg-primary/5 gap-1"
                onClick={() => navigate("/upgrade")}
              >
                <Zap className="h-3 w-3" />
                Upgrade to Pro
              </Button>
            )}
            {isPro && (
              <Badge className="h-8 px-3 text-xs bg-primary/10 text-primary border-primary/20 gap-1">
                <Zap className="h-3 w-3" />
                Provider Pro
              </Badge>
            )}
            <Button size="sm" onClick={() => navigate("/wellness-exchange/add-service")} className="h-8 text-xs rounded-full">
              <Plus className="h-3 w-3 mr-1" /> New Service
            </Button>
            <Button size="sm" variant="outline" onClick={() => navigate("/blog/editor/new")} className="h-8 text-xs rounded-full">
              <FileText className="h-3 w-3 mr-1" /> Write Post
            </Button>
          </div>
        </div>

        {(dashboardError || lastSyncedAt) && (
          <div className="mt-3 rounded-lg border border-border/50 bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
            {dashboardError ? `Some live data could not load: ${dashboardError}` : `Live data synced ${lastSyncedAt}`}
          </div>
        )}

        <StatsGrid
          wellCoinBalance={wellCoinBalance}
          zarEarnings={zarEarnings}
          activeServices={activeServices}
          totalServices={services.length}
          bookingsCount={upcomingBookings.length}
          avgRating={avgRating}
          profileCompletion={profileCompletion}
        />

        <ProfileCompletionBar profileCompletion={profileCompletion} providerProfile={providerProfile} />

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <ScrollArea className="w-full">
            <TabsList className="inline-flex w-max gap-0.5 p-1 h-9 bg-muted/50">
              {TABS.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value} className="text-xs px-3 h-7 rounded-md relative">
                  {tab.label}
                  {(tab.value === "analytics" || tab.value === "clients" || tab.value === "financial") && !isPro && (
                    <span className="ml-1 text-[9px] text-primary">Pro</span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          {/* ── Overview ── */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Add Service", icon: Plus, onClick: () => navigate("/wellness-exchange/add-service"), primary: true },
                { label: "Write Blog Post", icon: FileText, onClick: () => navigate("/blog/editor/new") },
                { label: "View Public Profile", icon: Eye, onClick: () => window.open(providerProfile?.id ? `/provider/${providerProfile.id}` : "/provider/sandy-mitchell", "_blank") },
                { label: "Browse Community", icon: MessageCircle, onClick: () => navigate("/blog/community") },
              ].map((action) => (
                <Card
                  key={action.label}
                  className={`cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 ${action.primary ? "border-primary/30 bg-primary/5" : "border-border/50"}`}
                  onClick={action.onClick}
                >
                  <CardContent className="p-4 flex items-center gap-3">
                    <action.icon className={`h-5 w-5 shrink-0 ${action.primary ? "text-primary" : "text-muted-foreground"}`} />
                    <span className="text-sm font-medium">{action.label}</span>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Recent Activity */}
              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Recent Activity</CardTitle>
                  <CardDescription className="text-xs">Latest transactions and earnings</CardDescription>
                </CardHeader>
                <CardContent>
                  {recentTransactions.length > 0 ? (
                    <div className="space-y-3">
                      {recentTransactions.slice(0, 5).map((t) => (
                        <div key={t.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium truncate">{t.description}</p>
                            <p className="text-[10px] text-muted-foreground">{new Date(t.created_at).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right shrink-0 ml-2">
                            {t.amount_zar > 0 && <p className="text-sm font-medium text-green-600">+R{t.amount_zar}</p>}
                            {t.amount_wellcoins > 0 && <p className="text-xs text-primary">+{t.amount_wellcoins} WC</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8 text-sm">No activity yet — create a service to get started</p>
                  )}
                </CardContent>
              </Card>

              {/* Pro upgrade teaser or services summary */}
              {!isPro ? (
                <ProUpgradeCard />
              ) : (
                <Card className="border-border/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">Your Services</CardTitle>
                        <CardDescription className="text-xs">{activeServices} active of {services.length} total</CardDescription>
                      </div>
                      <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => navigate("/wellness-exchange/add-service")}>
                        <Plus className="h-3 w-3 mr-1" /> Add
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {services.length > 0 ? (
                      <div className="space-y-2">
                        {services.slice(0, 5).map((svc) => (
                          <div key={svc.id} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                              <div className={`w-2 h-2 rounded-full shrink-0 ${svc.active ? "bg-green-500" : "bg-gray-300"}`} />
                              <div className="min-w-0">
                                <p className="text-sm font-medium truncate">{svc.title}</p>
                                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                  {svc.price_zar != null && <span>R{svc.price_zar}</span>}
                                  {svc.duration_minutes && <span>{svc.duration_minutes}min</span>}
                                  {svc.is_online && <span>Online</span>}
                                </div>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 shrink-0" onClick={() => navigate(`/wellness-exchange/edit-service/${svc.id}`)}>
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                        {services.length > 5 && (
                          <p className="text-xs text-center text-muted-foreground pt-1">+{services.length - 5} more — see Services tab</p>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Package className="h-10 w-10 mx-auto mb-3 text-muted-foreground/30" />
                        <p className="text-sm text-muted-foreground mb-3">No services yet</p>
                        <Button size="sm" onClick={() => navigate("/wellness-exchange/add-service")}>
                          <Plus className="h-3.5 w-3.5 mr-1.5" /> Create First Service
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* ── Services ── */}
          <TabsContent value="services" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading text-lg">Your Services</h3>
                <p className="text-xs text-muted-foreground">{activeServices} active, {services.length - activeServices} inactive</p>
              </div>
              <Button size="sm" className="h-8 text-xs" onClick={() => navigate("/wellness-exchange/add-service")}>
                <Plus className="h-3 w-3 mr-1" /> Add Service
              </Button>
            </div>

            {services.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service) => (
                  <ServiceCard key={service.id} service={service} onToggle={toggleServiceStatus} onDelete={deleteService} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-16 text-center">
                  <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
                  <h3 className="font-heading text-lg mb-2">No services yet</h3>
                  <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                    Create your first wellness service to start appearing on the marketplace and accepting bookings.
                  </p>
                  <Button onClick={() => navigate("/wellness-exchange/add-service")}>
                    <Plus className="h-4 w-4 mr-2" /> Create Your First Service
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ── Bookings ── */}
          <TabsContent value="bookings">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Bookings</CardTitle>
                <CardDescription className="text-xs">Client sessions and reservations</CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingBookings.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingBookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{booking.services?.title || "Session"}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(booking.booking_date).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={booking.status === "confirmed" ? "default" : "secondary"} className="text-[10px]">
                          {booking.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-12 text-sm">No bookings yet. Share your profile to get started.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Earnings ── */}
          <TabsContent value="transactions">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Earnings & Transactions</CardTitle>
                <CardDescription className="text-xs">Your WellCoin and ZAR transaction history</CardDescription>
              </CardHeader>
              <CardContent>
                {recentTransactions.length > 0 ? (
                  <div className="space-y-3">
                    {recentTransactions.map((t) => (
                      <div key={t.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{t.description}</p>
                          <p className="text-xs text-muted-foreground">{new Date(t.created_at).toLocaleDateString()} &middot; {t.transaction_type}</p>
                        </div>
                        <div className="text-right shrink-0">
                          {t.amount_zar > 0 && <p className="text-sm font-medium text-green-600">+R{t.amount_zar}</p>}
                          {t.amount_wellcoins > 0 && <p className="text-xs text-primary">+{t.amount_wellcoins} WC</p>}
                          <Badge variant="outline" className="text-[10px]">{t.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-12 text-sm">No transactions yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Analytics (Pro) ── */}
          <TabsContent value="analytics">
            <AnalyticsDashboard
              transactions={recentTransactions}
              bookings={upcomingBookings}
              services={services}
              isPro={isPro}
            />
          </TabsContent>

          {/* ── Clients / CRM (Pro) ── */}
          <TabsContent value="clients">
            <CRMDashboard bookings={upcomingBookings} isPro={isPro} />
          </TabsContent>

          {/* ── Financial Suite (Pro) ── */}
          <TabsContent value="financial">
            <FinancialDashboard transactions={recentTransactions} isPro={isPro} />
          </TabsContent>

          {/* ── Media ── */}
          <TabsContent value="media">
            <Suspense fallback={<div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>}>
              <ProviderMediaUpload onMediaUpdate={handleMediaUpdate} />
            </Suspense>
          </TabsContent>

          {/* ── Blog ── */}
          <TabsContent value="blog" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading text-lg">Community Blog</h3>
                <p className="text-xs text-muted-foreground">Share wellness insights and grow your audience</p>
              </div>
              <Button size="sm" className="h-8 text-xs" onClick={() => navigate("/blog/editor/new")}>
                <Plus className="h-3 w-3 mr-1" /> Write Post
              </Button>
            </div>
            {blogPosts.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Your latest posts</CardTitle>
                  <CardDescription className="text-xs">Drafts and published stories stay synced here</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {blogPosts.slice(0, 5).map((post) => (
                    <button
                      key={post.id}
                      type="button"
                      onClick={() => navigate(`/blog/editor/${post.id}`)}
                      className="w-full min-h-[44px] rounded-lg border px-3 py-2 text-left transition-colors hover:bg-muted/50"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="truncate text-sm font-medium">{post.title}</span>
                        <Badge variant={post.status === "published" ? "default" : "secondary"} className="shrink-0 text-[10px]">
                          {post.status}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {post.views_count || 0} views · {post.likes_count || 0} likes · {post.comments_count || 0} comments
                      </p>
                    </button>
                  ))}
                </CardContent>
              </Card>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5 border-primary/20 bg-primary/5" onClick={() => navigate("/blog/editor/new")}>
                <CardContent className="p-6 text-center">
                  <FileText className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <h4 className="font-medium mb-1">Write Your Story</h4>
                  <p className="text-xs text-muted-foreground">Share your wellness journey with the community</p>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5" onClick={() => navigate("/blog/community")}>
                <CardContent className="p-6 text-center">
                  <MessageCircle className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                  <h4 className="font-medium mb-1">Browse Community</h4>
                  <p className="text-xs text-muted-foreground">Read and engage with other practitioners</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ── Reviews ── */}
          <TabsContent value="reviews">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Reviews & Testimonials</CardTitle>
                <CardDescription className="text-xs">Client feedback from completed sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-12 text-sm">
                  Reviews will appear here after clients complete sessions.
                  <br />
                  <span className="text-xs">Share your profile link to start getting bookings and reviews.</span>
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProviderDashboard;
