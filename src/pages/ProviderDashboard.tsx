import React, { useState, useEffect, useCallback, useMemo, lazy, Suspense } from "react";
import { toast } from "sonner";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Plus, Eye, MessageCircle, FileText, Edit, Package, Zap, Share2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  { value: "profile", label: "Profile" },
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

  const [wellCoinBalance, setWellCoinBalance] = useState(0);
  const [zarEarnings, setZarEarnings] = useState(0);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [providerProfile, setProviderProfile] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [upcomingBookings, setUpcomingBookings] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  const { isPro } = useProSubscription(providerProfile?.pricing_info);

  const loadDashboardData = useCallback(async (userId: string, showLoader = true) => {
    if (showLoader) setLoading(true);
    setDashboardError(null);
    try {
      const [profileRes, servicesRes, bookingsRes, transactionsRes, blogPostsRes, testimonialsRes] = await Promise.all([
        supabase.from("provider_profiles").select("*").eq("id", userId).maybeSingle(),
        supabase.from("services").select("*").eq("provider_id", userId).order("created_at", { ascending: false }),
        supabase.from("bookings").select("*, services(title), profiles!consumer_id(full_name, email)").eq("provider_id", userId).order("created_at", { ascending: false }).limit(50),
        supabase.from("transactions").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(50),
        supabase.from("blog_posts").select("id,title,slug,status,updated_at,published_at,views_count,likes_count,comments_count").eq("user_id", userId).order("updated_at", { ascending: false }).limit(10),
        supabase.from("provider_testimonials").select("*").eq("provider_id", userId).order("created_at", { ascending: false }),
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
      setTestimonials(testimonialsRes.data || []);

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
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/auth"); return; }
      await loadDashboardData(session.user.id);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) navigate("/auth");
      else loadDashboardData(session.user.id);
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
  const avgRating = useMemo(() => (upcomingBookings.length > 0 ? 4.9 : 0), [upcomingBookings.length]);

  const handleMediaUpdate = useCallback(() => {
    if (user) loadDashboardData(user.id);
  }, [user, loadDashboardData]);

  const [profileForm, setProfileForm] = useState({
    business_name: '',
    description: '',
    location: '',
    phone: '',
    specialties: '',
    certifications: '',
  });
  const [profileSaving, setProfileSaving] = useState(false);

  useEffect(() => {
    if (providerProfile) {
      setProfileForm({
        business_name: providerProfile.business_name || '',
        description: providerProfile.description || '',
        location: providerProfile.location || '',
        phone: providerProfile.phone || '',
        specialties: (providerProfile.specialties || []).join(', '),
        certifications: (providerProfile.certifications || []).join(', '),
      });
    }
  }, [providerProfile]);

  const saveProviderProfile = async () => {
    if (!user) return;
    setProfileSaving(true);
    try {
      const { error } = await supabase.from('provider_profiles').update({
        business_name: profileForm.business_name.trim() || null,
        description: profileForm.description.trim() || null,
        location: profileForm.location.trim() || null,
        phone: profileForm.phone.trim() || null,
        specialties: profileForm.specialties ? profileForm.specialties.split(',').map(s => s.trim()).filter(Boolean) : [],
        certifications: profileForm.certifications ? profileForm.certifications.split(',').map(s => s.trim()).filter(Boolean) : [],
      }).eq('id', user.id);
      if (error) throw error;
      setProviderProfile((p: any) => p ? {
        ...p,
        ...profileForm,
        specialties: profileForm.specialties ? profileForm.specialties.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
        certifications: profileForm.certifications ? profileForm.certifications.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
      } : p);
      toast.success('Profile saved');
    } catch {
      toast.error('Failed to save profile');
    } finally {
      setProfileSaving(false);
    }
  };

  const updateBookingStatus = useCallback(async (bookingId: string, status: string) => {
    const { error } = await supabase.from('bookings').update({ status }).eq('id', bookingId);
    if (error) { toast.error(error.message); return; }
    setUpcomingBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status } : b));
    toast.success(`Booking ${status}`);
  }, []);

  // ── Availability ──────────────────────────────────────────────
  const WEEKDAYS = [
    { key: 'mon', label: 'Mon' }, { key: 'tue', label: 'Tue' },
    { key: 'wed', label: 'Wed' }, { key: 'thu', label: 'Thu' },
    { key: 'fri', label: 'Fri' }, { key: 'sat', label: 'Sat' },
    { key: 'sun', label: 'Sun' },
  ];
  const [availabilityForm, setAvailabilityForm] = useState({
    days: ['mon', 'tue', 'wed', 'thu', 'fri'] as string[],
    startTime: '09:00',
    endTime: '17:30',
  });
  const [availabilitySaving, setAvailabilitySaving] = useState(false);

  useEffect(() => {
    if (providerProfile?.availability && typeof providerProfile.availability === 'object') {
      const av = providerProfile.availability as any;
      setAvailabilityForm({
        days: av.days || ['mon', 'tue', 'wed', 'thu', 'fri'],
        startTime: av.startTime || '09:00',
        endTime: av.endTime || '17:30',
      });
    }
  }, [providerProfile?.availability]);

  const saveAvailability = async () => {
    if (!user) return;
    setAvailabilitySaving(true);
    try {
      const { error } = await supabase.from('provider_profiles').update({
        availability: availabilityForm as any,
      }).eq('id', user.id);
      if (error) throw error;
      setProviderProfile((p: any) => p ? { ...p, availability: availabilityForm } : p);
      toast.success('Availability saved');
    } catch {
      toast.error('Failed to save availability');
    } finally {
      setAvailabilitySaving(false);
    }
  };

  const toggleDay = (day: string) => {
    setAvailabilityForm(prev => ({
      ...prev,
      days: prev.days.includes(day) ? prev.days.filter(d => d !== day) : [...prev.days, day],
    }));
  };

  // ── Profile photo upload ──────────────────────────────────────
  const [photoUploading, setPhotoUploading] = useState(false);
  const photoInputRef = React.useRef<HTMLInputElement>(null);

  const uploadProfilePhoto = async (file: File) => {
    if (!user) return;
    setPhotoUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `${user.id}/profile-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from('provider-profiles').upload(path, file, { upsert: true });
      if (upErr) throw upErr;
      const { data: { publicUrl } } = supabase.storage.from('provider-profiles').getPublicUrl(path);
      const { error: dbErr } = await supabase.from('provider_profiles').update({ profile_image_url: publicUrl }).eq('id', user.id);
      if (dbErr) throw dbErr;
      setProviderProfile((p: any) => p ? { ...p, profile_image_url: publicUrl } : p);
      toast.success('Profile photo updated');
    } catch {
      toast.error('Failed to upload photo');
    } finally {
      setPhotoUploading(false);
    }
  };

  // ── Packages ──────────────────────────────────────────────────
  const packages: any[] = (providerProfile?.pricing_info as any)?.packages || [];
  const [newPackage, setNewPackage] = useState({ title: '', description: '', price_zar: '', includes: '' });
  const [addingPackage, setAddingPackage] = useState(false);
  const [packageSaving, setPackageSaving] = useState(false);

  const savePackage = async () => {
    if (!user || !newPackage.title.trim()) return;
    setPackageSaving(true);
    try {
      const pkg = {
        id: crypto.randomUUID(),
        title: newPackage.title.trim(),
        description: newPackage.description.trim(),
        price_zar: newPackage.price_zar ? parseFloat(newPackage.price_zar) : 0,
        includes: newPackage.includes ? newPackage.includes.split(',').map(s => s.trim()).filter(Boolean) : [],
      };
      const updatedPackages = [...packages, pkg];
      const currentPricingInfo = (providerProfile?.pricing_info as any) || {};
      const { error } = await supabase.from('provider_profiles').update({
        pricing_info: { ...currentPricingInfo, packages: updatedPackages } as any,
      }).eq('id', user.id);
      if (error) throw error;
      setProviderProfile((p: any) => p ? { ...p, pricing_info: { ...currentPricingInfo, packages: updatedPackages } } : p);
      setNewPackage({ title: '', description: '', price_zar: '', includes: '' });
      setAddingPackage(false);
      toast.success('Package added');
    } catch {
      toast.error('Failed to save package');
    } finally {
      setPackageSaving(false);
    }
  };

  const deletePackage = async (pkgId: string) => {
    if (!user) return;
    const updatedPackages = packages.filter((p: any) => p.id !== pkgId);
    const currentPricingInfo = (providerProfile?.pricing_info as any) || {};
    try {
      const { error } = await supabase.from('provider_profiles').update({
        pricing_info: { ...currentPricingInfo, packages: updatedPackages } as any,
      }).eq('id', user.id);
      if (error) throw error;
      setProviderProfile((p: any) => p ? { ...p, pricing_info: { ...currentPricingInfo, packages: updatedPackages } } : p);
      toast.success('Package removed');
    } catch {
      toast.error('Failed to remove package');
    }
  };

  // ── Testimonials / Reviews ────────────────────────────────────
  const [addingReview, setAddingReview] = useState(false);
  const [reviewForm, setReviewForm] = useState({ client_name: '', testimonial_text: '', rating: 5, service_type: '' });
  const [reviewSaving, setReviewSaving] = useState(false);

  const saveReview = async () => {
    if (!user || !reviewForm.client_name.trim() || !reviewForm.testimonial_text.trim()) return;
    setReviewSaving(true);
    try {
      const { data, error } = await supabase.from('provider_testimonials').insert({
        provider_id: user.id,
        client_name: reviewForm.client_name.trim(),
        testimonial_text: reviewForm.testimonial_text.trim(),
        rating: reviewForm.rating,
        service_type: reviewForm.service_type.trim() || null,
        approved: true,
      }).select().single();
      if (error) throw error;
      setTestimonials(prev => [data, ...prev]);
      setReviewForm({ client_name: '', testimonial_text: '', rating: 5, service_type: '' });
      setAddingReview(false);
      toast.success('Testimonial added');
    } catch {
      toast.error('Failed to save testimonial');
    } finally {
      setReviewSaving(false);
    }
  };

  const deleteReview = async (id: string) => {
    if (!user) return;
    const { error } = await supabase.from('provider_testimonials').delete().eq('id', id);
    if (error) { toast.error(error.message); return; }
    setTestimonials(prev => prev.filter(t => t.id !== id));
    toast.success('Testimonial removed');
  };

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
      <ProviderHeader hasProfile={!!providerProfile} onLogout={handleLogout} providerSlug={providerProfile?.id} />

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
        <Tabs defaultValue="overview" className="space-y-4">
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
                { label: "View Public Profile", icon: Eye, onClick: () => window.open(`/provider/${providerProfile?.id || ""}`, "_blank") },
                { label: "Share Profile", icon: Share2, onClick: () => { const url = `${window.location.origin}/provider/${providerProfile?.id || ""}`; navigator.clipboard?.writeText(url).then(() => toast.success("Profile link copied!")).catch(() => toast.info(url)); } },
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

          {/* ── Profile Edit ── */}
          <TabsContent value="profile" className="space-y-4">
            <div>
              <h3 className="font-heading text-lg">Edit Your Profile</h3>
              <p className="text-xs text-muted-foreground">This information appears on your public provider page</p>
            </div>
            <Card>
              <CardContent className="pt-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="pf-name">Business / Practice Name</Label>
                    <Input id="pf-name" value={profileForm.business_name} onChange={e => setProfileForm(p => ({ ...p, business_name: e.target.value }))} placeholder="e.g. Sandy Mitchell – Dru Yoga" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="pf-location">Location</Label>
                    <Input id="pf-location" value={profileForm.location} onChange={e => setProfileForm(p => ({ ...p, location: e.target.value }))} placeholder="e.g. Cape Town, South Africa" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pf-phone">Phone (optional)</Label>
                  <Input id="pf-phone" value={profileForm.phone} onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))} placeholder="+27..." />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pf-desc">Bio / Description</Label>
                  <Textarea id="pf-desc" value={profileForm.description} onChange={e => setProfileForm(p => ({ ...p, description: e.target.value }))} placeholder="Tell clients about your background, approach and what makes your work unique…" rows={5} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pf-spec">Specialties <span className="text-muted-foreground font-normal">(comma-separated)</span></Label>
                  <Input id="pf-spec" value={profileForm.specialties} onChange={e => setProfileForm(p => ({ ...p, specialties: e.target.value }))} placeholder="Dru Yoga, Buteyko Breathing, Back Care…" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pf-cert">Certifications <span className="text-muted-foreground font-normal">(comma-separated)</span></Label>
                  <Input id="pf-cert" value={profileForm.certifications} onChange={e => setProfileForm(p => ({ ...p, certifications: e.target.value }))} placeholder="Certified Dru Yoga Instructor, Buteyko Facilitator…" />
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setProfileForm({ business_name: providerProfile?.business_name || '', description: providerProfile?.description || '', location: providerProfile?.location || '', phone: providerProfile?.phone || '', specialties: (providerProfile?.specialties || []).join(', '), certifications: (providerProfile?.certifications || []).join(', ') })}>
                    Reset
                  </Button>
                  <Button onClick={saveProviderProfile} disabled={profileSaving}>
                    {profileSaving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving…</> : 'Save Profile'}
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Profile Photo</CardTitle>
                <CardDescription className="text-xs">Upload a photo that appears on your public profile</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    {providerProfile?.profile_image_url ? (
                      <img src={providerProfile.profile_image_url} alt="Profile" className="h-20 w-20 rounded-full object-cover border-2 border-border" />
                    ) : (
                      <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-border">
                        <span className="text-xs text-muted-foreground">No photo</span>
                      </div>
                    )}
                    {photoUploading && (
                      <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
                        <Loader2 className="h-5 w-5 text-white animate-spin" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <input
                      ref={photoInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => { const f = e.target.files?.[0]; if (f) uploadProfilePhoto(f); e.target.value = ''; }}
                    />
                    <Button variant="outline" size="sm" disabled={photoUploading} onClick={() => photoInputRef.current?.click()}>
                      {photoUploading ? 'Uploading…' : providerProfile?.profile_image_url ? 'Change Photo' : 'Upload Photo'}
                    </Button>
                    <p className="text-xs text-muted-foreground">JPEG, PNG or WebP, max 10MB</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Availability</CardTitle>
                <CardDescription className="text-xs">Set which days and hours clients can book with you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-xs mb-2 block">Available Days</Label>
                  <div className="flex flex-wrap gap-2">
                    {WEEKDAYS.map(({ key, label }) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => toggleDay(key)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                          availabilityForm.days.includes(key)
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-background border-border text-muted-foreground hover:border-primary/50'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="av-start" className="text-xs">Start Time</Label>
                    <Input id="av-start" type="time" value={availabilityForm.startTime} onChange={e => setAvailabilityForm(p => ({ ...p, startTime: e.target.value }))} className="h-8 text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="av-end" className="text-xs">End Time</Label>
                    <Input id="av-end" type="time" value={availabilityForm.endTime} onChange={e => setAvailabilityForm(p => ({ ...p, endTime: e.target.value }))} className="h-8 text-sm" />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button size="sm" onClick={saveAvailability} disabled={availabilitySaving}>
                    {availabilitySaving ? <><Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />Saving…</> : 'Save Availability'}
                  </Button>
                </div>
              </CardContent>
            </Card>
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

            {/* ── Packages ── */}
            <div className="pt-4 border-t border-border/50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-heading text-base">Packages & Bundles</h3>
                  <p className="text-xs text-muted-foreground">Multi-session offers or bundled programmes</p>
                </div>
                <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => setAddingPackage(true)}>
                  <Plus className="h-3 w-3 mr-1" /> New Package
                </Button>
              </div>

              {addingPackage && (
                <Card className="border-primary/30 mb-4">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">New Package</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="pkg-title" className="text-xs">Package Name *</Label>
                        <Input id="pkg-title" value={newPackage.title} onChange={e => setNewPackage(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Beginner 8-Week Journey" className="h-8" />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="pkg-price" className="text-xs">Price (ZAR)</Label>
                        <Input id="pkg-price" type="number" value={newPackage.price_zar} onChange={e => setNewPackage(p => ({ ...p, price_zar: e.target.value }))} placeholder="e.g. 2200" className="h-8" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="pkg-desc" className="text-xs">Description</Label>
                      <Textarea id="pkg-desc" value={newPackage.description} onChange={e => setNewPackage(p => ({ ...p, description: e.target.value }))} placeholder="What's included in this package?" rows={2} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="pkg-includes" className="text-xs">Includes <span className="text-muted-foreground font-normal">(comma-separated)</span></Label>
                      <Input id="pkg-includes" value={newPackage.includes} onChange={e => setNewPackage(p => ({ ...p, includes: e.target.value }))} placeholder="8 yoga sessions, Breathing intro, Resource pack…" className="h-8" />
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button variant="outline" size="sm" onClick={() => setAddingPackage(false)}>Cancel</Button>
                      <Button size="sm" onClick={savePackage} disabled={packageSaving || !newPackage.title.trim()}>
                        {packageSaving ? <><Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />Saving…</> : 'Create Package'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {packages.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {packages.map((pkg: any) => (
                    <Card key={pkg.id} className="border-border/50">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <p className="text-sm font-semibold">{pkg.title}</p>
                            {pkg.price_zar > 0 && <p className="text-xs text-primary font-medium">R{pkg.price_zar}</p>}
                          </div>
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive shrink-0" onClick={() => deletePackage(pkg.id)}>
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        {pkg.description && <p className="text-xs text-muted-foreground mb-2">{pkg.description}</p>}
                        {pkg.includes?.length > 0 && (
                          <ul className="space-y-0.5">
                            {pkg.includes.map((item: string, i: number) => (
                              <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                                <span className="text-primary mt-0.5">✓</span>{item}
                              </li>
                            ))}
                          </ul>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="border-dashed">
                  <CardContent className="py-8 text-center">
                    <p className="text-sm text-muted-foreground">No packages yet. Create a bundle to offer clients more value at a better price point.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* ── Bookings ── */}
          <TabsContent value="bookings" className="space-y-4">
            <div>
              <h3 className="font-heading text-lg">Bookings</h3>
              <p className="text-xs text-muted-foreground">
                {upcomingBookings.filter(b => b.status === 'pending').length} pending · {upcomingBookings.filter(b => b.status === 'confirmed').length} confirmed
              </p>
            </div>
            {upcomingBookings.length > 0 ? (
              <div className="space-y-3">
                {upcomingBookings.map((booking) => (
                  <Card key={booking.id} className={`border-l-4 ${booking.status === 'confirmed' ? 'border-l-green-500' : booking.status === 'cancelled' ? 'border-l-red-400' : 'border-l-amber-400'}`}>
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-semibold">{booking.services?.title || "Session"}</p>
                            <Badge variant={booking.status === 'confirmed' ? 'default' : booking.status === 'cancelled' ? 'destructive' : 'secondary'} className="text-[10px]">
                              {booking.status}
                            </Badge>
                          </div>
                          {booking.booking_date && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {new Date(booking.booking_date).toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                          )}
                          {(booking.profiles?.full_name || booking.client_name) && (
                            <p className="text-xs text-muted-foreground">Client: {booking.profiles?.full_name || booking.client_name}</p>
                          )}
                          {booking.notes && <p className="text-xs text-muted-foreground mt-1 italic">"{booking.notes}"</p>}
                        </div>
                        <div className="flex flex-wrap gap-2 shrink-0">
                          {booking.status === 'pending' && (
                            <>
                              <Button size="sm" className="h-7 text-xs bg-green-600 hover:bg-green-700 text-white" onClick={() => updateBookingStatus(booking.id, 'confirmed')}>
                                Confirm
                              </Button>
                              <Button size="sm" variant="outline" className="h-7 text-xs border-red-300 text-red-600 hover:bg-red-50" onClick={() => updateBookingStatus(booking.id, 'cancelled')}>
                                Decline
                              </Button>
                            </>
                          )}
                          {booking.status === 'confirmed' && (
                            <>
                              <Button size="sm" variant="outline" className="h-7 text-xs border-red-300 text-red-600 hover:bg-red-50" onClick={() => updateBookingStatus(booking.id, 'cancelled')}>
                                Cancel
                              </Button>
                              {(booking.profiles?.email || booking.client_email) && (
                                <Button size="sm" variant="outline" className="h-7 text-xs" asChild>
                                  <a href={`mailto:${booking.profiles?.email || booking.client_email}?subject=Your review for ${encodeURIComponent(booking.services?.title || 'your session')}&body=Hi ${encodeURIComponent(booking.profiles?.full_name || 'there')},%0A%0AI'd love to hear your feedback on our recent session.%0A%0AIf you enjoyed it, would you be happy to leave a short review? It means a lot and helps other clients find me.%0A%0AThank you so much! 🙏`}>
                                    Request Review
                                  </a>
                                </Button>
                              )}
                            </>
                          )}
                          {(booking.profiles?.email || booking.client_email) && (
                            <Button size="sm" variant="ghost" className="h-7 text-xs" asChild>
                              <a href={`mailto:${booking.profiles?.email || booking.client_email}`}>Email</a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground text-sm">No bookings yet.</p>
                  <p className="text-xs text-muted-foreground mt-1">Share your profile link to start receiving booking requests.</p>
                  <Button size="sm" variant="outline" className="mt-4" onClick={() => { const url = `${window.location.origin}/provider/${providerProfile?.id || ""}`; navigator.clipboard?.writeText(url).then(() => toast.success("Profile link copied!")); }}>
                    <Share2 className="h-3.5 w-3.5 mr-1.5" /> Copy Profile Link
                  </Button>
                </CardContent>
              </Card>
            )}
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
          <TabsContent value="reviews" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading text-lg">Reviews & Testimonials</h3>
                <p className="text-xs text-muted-foreground">{testimonials.length} testimonial{testimonials.length !== 1 ? 's' : ''} · avg {testimonials.length > 0 ? (testimonials.reduce((s: number, t: any) => s + (t.rating || 0), 0) / testimonials.length).toFixed(1) : '–'} ★</p>
              </div>
              <Button size="sm" className="h-8 text-xs" onClick={() => setAddingReview(true)}>
                <Plus className="h-3 w-3 mr-1" /> Add Testimonial
              </Button>
            </div>

            {addingReview && (
              <Card className="border-primary/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Add a Testimonial</CardTitle>
                  <CardDescription className="text-xs">Capture verbal or written feedback from a client</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="rv-name" className="text-xs">Client Name *</Label>
                      <Input id="rv-name" value={reviewForm.client_name} onChange={e => setReviewForm(p => ({ ...p, client_name: e.target.value }))} placeholder="e.g. Sarah M." className="h-8" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="rv-service" className="text-xs">Service / Context</Label>
                      <Input id="rv-service" value={reviewForm.service_type} onChange={e => setReviewForm(p => ({ ...p, service_type: e.target.value }))} placeholder="e.g. Dru Yoga Class" className="h-8" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Rating</Label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(n => (
                        <button key={n} type="button" onClick={() => setReviewForm(p => ({ ...p, rating: n }))} className={`text-xl transition-colors ${n <= reviewForm.rating ? 'text-amber-400' : 'text-muted-foreground/30'}`}>★</button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="rv-text" className="text-xs">Testimonial *</Label>
                    <Textarea id="rv-text" value={reviewForm.testimonial_text} onChange={e => setReviewForm(p => ({ ...p, testimonial_text: e.target.value }))} placeholder="What did this client say about their experience?" rows={3} />
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" size="sm" onClick={() => setAddingReview(false)}>Cancel</Button>
                    <Button size="sm" onClick={saveReview} disabled={reviewSaving || !reviewForm.client_name.trim() || !reviewForm.testimonial_text.trim()}>
                      {reviewSaving ? <><Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />Saving…</> : 'Save Testimonial'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {testimonials.length > 0 ? (
              <div className="space-y-3">
                {testimonials.map((t: any) => (
                  <Card key={t.id} className="border-border/50">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-sm font-semibold">{t.client_name}</span>
                            {t.service_type && <span className="text-xs text-muted-foreground">· {t.service_type}</span>}
                            {t.rating && (
                              <span className="text-xs text-amber-500">{'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}</span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground italic">"{t.testimonial_text}"</p>
                          <p className="text-xs text-muted-foreground mt-1">{new Date(t.created_at).toLocaleDateString('en-ZA')}</p>
                        </div>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive shrink-0" onClick={() => deleteReview(t.id)}>
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-dashed">
                <CardContent className="py-12 text-center">
                  <p className="text-sm text-muted-foreground">No testimonials yet.</p>
                  <p className="text-xs text-muted-foreground mt-1">Add verbal feedback manually, or send a review request from the Bookings tab after confirmed sessions.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProviderDashboard;
