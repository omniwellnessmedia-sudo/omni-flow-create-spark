import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Users,
  Plus,
  Search,
  CheckCircle,
  XCircle,
  Edit,
  Eye,
  Trash2,
  RefreshCw,
  Globe,
  MapPin,
  Phone,
  Mail,
  Star,
  Package,
  ExternalLink,
  UserPlus,
  Shield,
} from "lucide-react";

interface Provider {
  id: string;
  business_name: string;
  description: string | null;
  specialties: string[] | null;
  location: string | null;
  phone: string | null;
  website: string | null;
  experience_years: number | null;
  certifications: string[] | null;
  profile_image_url: string | null;
  verified: boolean;
  wellcoin_balance: number;
  created_at: string;
}

interface Service {
  id: string;
  provider_id: string;
  title: string;
  description: string | null;
  category: string | null;
  price_zar: number | null;
  price_wellcoins: number | null;
  duration_minutes: number | null;
  location: string | null;
  is_online: boolean;
  active: boolean;
  created_at: string;
}

const AdminProviders = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [addingProvider, setAddingProvider] = useState(false);
  const [newProvider, setNewProvider] = useState({
    business_name: "",
    description: "",
    location: "",
    phone: "",
    website: "",
    specialties: "",
    email: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [providersResult, servicesResult] = await Promise.all([
        supabase.from("provider_profiles").select("*").order("created_at", { ascending: false }),
        supabase.from("services").select("*").order("created_at", { ascending: false }),
      ]);

      setProviders(providersResult.data || []);
      setServices(servicesResult.data || []);
    } catch (error) {
      console.error("Error fetching provider data:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleVerified = async (providerId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("provider_profiles")
      .update({ verified: !currentStatus })
      .eq("id", providerId);

    if (error) {
      toast({ title: "Error", description: "Failed to update verification", variant: "destructive" });
    } else {
      toast({ title: currentStatus ? "Unverified" : "Verified", description: `Provider ${currentStatus ? "unverified" : "verified"} successfully` });
      setProviders((prev) => prev.map((p) => (p.id === providerId ? { ...p, verified: !currentStatus } : p)));
    }
  };

  const toggleServiceActive = async (serviceId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("services")
      .update({ active: !currentStatus })
      .eq("id", serviceId);

    if (error) {
      toast({ title: "Error", description: "Failed to update service", variant: "destructive" });
    } else {
      setServices((prev) => prev.map((s) => (s.id === serviceId ? { ...s, active: !currentStatus } : s)));
    }
  };

  const deleteService = async (serviceId: string) => {
    const { error } = await supabase.from("services").delete().eq("id", serviceId);
    if (error) {
      toast({ title: "Error", description: "Failed to delete service", variant: "destructive" });
    } else {
      setServices((prev) => prev.filter((s) => s.id !== serviceId));
      toast({ title: "Deleted", description: "Service removed" });
    }
  };

  const handleAddProvider = async () => {
    if (!newProvider.business_name.trim()) {
      toast({ title: "Required", description: "Business name is required", variant: "destructive" });
      return;
    }

    setAddingProvider(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Save as a contact submission / lead for now
      // The provider will be fully created when they sign up
      const { error } = await supabase.from("contact_submissions").insert({
        name: newProvider.business_name,
        email: newProvider.email || "pending@provider.signup",
        message: `New Provider Onboarding Request\nBusiness: ${newProvider.business_name}\nLocation: ${newProvider.location}\nPhone: ${newProvider.phone}\nWebsite: ${newProvider.website}\nSpecialties: ${newProvider.specialties}\n\n${newProvider.description}`,
        service: "Provider Onboarding",
        status: "pending",
      });

      if (error) throw error;

      toast({ title: "Provider Lead Created", description: `${newProvider.business_name} added as a provider lead. Send them the signup link to complete onboarding.` });
      setShowAddDialog(false);
      setNewProvider({ business_name: "", description: "", location: "", phone: "", website: "", specialties: "", email: "" });
    } catch (error) {
      console.error("Add provider error:", error);
      toast({ title: "Error", description: "Failed to add provider", variant: "destructive" });
    } finally {
      setAddingProvider(false);
    }
  };

  const getServicesForProvider = (providerId: string) => services.filter((s) => s.provider_id === providerId);

  const filteredProviders = providers.filter(
    (p) =>
      p.business_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.specialties?.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const stats = {
    total: providers.length,
    verified: providers.filter((p) => p.verified).length,
    totalServices: services.length,
    activeServices: services.filter((s) => s.active).length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
        <span>Loading providers...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-heading text-lg">Providers & Services</h3>
          <p className="text-xs text-muted-foreground">Manage wellness service providers and their offerings</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8" onClick={fetchData}>
            <RefreshCw className="h-3 w-3 mr-1" /> Refresh
          </Button>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-8">
                <UserPlus className="h-3 w-3 mr-1" /> Add Provider
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Onboard New Provider</DialogTitle>
                <DialogDescription>
                  Add a provider lead. They'll complete signup via the provider registration form.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 py-2">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Business Name *</Label>
                    <Input value={newProvider.business_name} onChange={(e) => setNewProvider((p) => ({ ...p, business_name: e.target.value }))} placeholder="e.g., Dru Yoga Cape Town" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Email</Label>
                    <Input type="email" value={newProvider.email} onChange={(e) => setNewProvider((p) => ({ ...p, email: e.target.value }))} placeholder="provider@email.com" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Location</Label>
                    <Input value={newProvider.location} onChange={(e) => setNewProvider((p) => ({ ...p, location: e.target.value }))} placeholder="Cape Town" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Phone</Label>
                    <Input value={newProvider.phone} onChange={(e) => setNewProvider((p) => ({ ...p, phone: e.target.value }))} placeholder="+27..." />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Specialties (comma-separated)</Label>
                  <Input value={newProvider.specialties} onChange={(e) => setNewProvider((p) => ({ ...p, specialties: e.target.value }))} placeholder="Yoga, Meditation, Breathwork" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Website</Label>
                  <Input value={newProvider.website} onChange={(e) => setNewProvider((p) => ({ ...p, website: e.target.value }))} placeholder="https://..." />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Description</Label>
                  <Textarea value={newProvider.description} onChange={(e) => setNewProvider((p) => ({ ...p, description: e.target.value }))} placeholder="About this provider..." rows={3} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
                <Button onClick={handleAddProvider} disabled={addingProvider}>
                  {addingProvider ? "Saving..." : "Add Provider Lead"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-muted-foreground">Providers</span>
              <Users className="h-3.5 w-3.5 text-muted-foreground/50" />
            </div>
            <div className="text-xl font-heading">{stats.total}</div>
            <p className="text-[10px] text-muted-foreground">{stats.verified} verified</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-muted-foreground">Services</span>
              <Package className="h-3.5 w-3.5 text-muted-foreground/50" />
            </div>
            <div className="text-xl font-heading">{stats.totalServices}</div>
            <p className="text-[10px] text-muted-foreground">{stats.activeServices} active</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-muted-foreground">Avg Services</span>
              <Star className="h-3.5 w-3.5 text-muted-foreground/50" />
            </div>
            <div className="text-xl font-heading">{stats.total > 0 ? (stats.totalServices / stats.total).toFixed(1) : 0}</div>
            <p className="text-[10px] text-muted-foreground">per provider</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-muted-foreground">Pending</span>
              <Shield className="h-3.5 w-3.5 text-muted-foreground/50" />
            </div>
            <div className="text-xl font-heading">{stats.total - stats.verified}</div>
            <p className="text-[10px] text-muted-foreground">unverified</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search providers by name, location, or specialty..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 h-9 text-sm" />
      </div>

      {/* Tabs: Providers / All Services */}
      <Tabs defaultValue="providers" className="space-y-4">
        <TabsList className="h-9">
          <TabsTrigger value="providers" className="text-xs">
            <Users className="h-3.5 w-3.5 mr-1.5" />
            Providers ({filteredProviders.length})
          </TabsTrigger>
          <TabsTrigger value="services" className="text-xs">
            <Package className="h-3.5 w-3.5 mr-1.5" />
            All Services ({services.length})
          </TabsTrigger>
        </TabsList>

        {/* Providers List */}
        <TabsContent value="providers" className="space-y-4">
          {filteredProviders.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p className="mb-2">No providers found</p>
                <p className="text-sm">Add a provider using the button above or seed from Admin Tools</p>
              </CardContent>
            </Card>
          ) : (
            filteredProviders.map((provider) => {
              const providerServices = getServicesForProvider(provider.id);
              return (
                <Card key={provider.id} className="border-border/50">
                  <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                      {/* Provider Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          {provider.profile_image_url && (
                            <img src={provider.profile_image_url} alt="" className="w-10 h-10 rounded-full object-cover" />
                          )}
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-sm truncate">{provider.business_name}</h4>
                              <Badge variant={provider.verified ? "default" : "secondary"} className="text-[10px] shrink-0">
                                {provider.verified ? "Verified" : "Pending"}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-0.5">
                              {provider.location && (
                                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{provider.location}</span>
                              )}
                              {provider.experience_years && (
                                <span>{provider.experience_years}yr exp</span>
                              )}
                              <span>{providerServices.length} services</span>
                            </div>
                          </div>
                        </div>

                        {provider.description && (
                          <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{provider.description}</p>
                        )}

                        {provider.specialties && provider.specialties.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {provider.specialties.slice(0, 5).map((s) => (
                              <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>
                            ))}
                            {provider.specialties.length > 5 && (
                              <Badge variant="outline" className="text-[10px]">+{provider.specialties.length - 5}</Badge>
                            )}
                          </div>
                        )}

                        {/* Services summary */}
                        {providerServices.length > 0 && (
                          <div className="mt-3 p-2 bg-muted/50 rounded-lg">
                            <p className="text-[10px] text-muted-foreground font-medium mb-1.5">Services:</p>
                            <div className="space-y-1">
                              {providerServices.map((svc) => (
                                <div key={svc.id} className="flex items-center justify-between text-xs">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${svc.active ? "bg-green-500" : "bg-gray-300"}`} />
                                    <span className="truncate">{svc.title}</span>
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0 ml-2">
                                    {svc.price_zar != null && <span className="text-[10px] text-muted-foreground">R{svc.price_zar}</span>}
                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => toggleServiceActive(svc.id, svc.active)}>
                                      {svc.active ? <CheckCircle className="h-3 w-3 text-green-600" /> : <XCircle className="h-3 w-3 text-gray-400" />}
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => navigate(`/wellness-exchange/edit-service/${svc.id}`)}>
                                      <Edit className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex lg:flex-col gap-2 shrink-0">
                        <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => toggleVerified(provider.id, provider.verified)}>
                          {provider.verified ? <XCircle className="h-3 w-3 mr-1" /> : <CheckCircle className="h-3 w-3 mr-1" />}
                          {provider.verified ? "Unverify" : "Verify"}
                        </Button>
                        <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => navigate(`/provider-dashboard`)}>
                          <Eye className="h-3 w-3 mr-1" /> Dashboard
                        </Button>
                        {provider.website && (
                          <Button variant="outline" size="sm" className="h-7 text-xs" asChild>
                            <a href={provider.website} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-3 w-3 mr-1" /> Website
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>

        {/* All Services List */}
        <TabsContent value="services" className="space-y-3">
          {services.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p>No services yet</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {services.map((svc) => {
                    const provider = providers.find((p) => p.id === svc.provider_id);
                    return (
                      <div key={svc.id} className="flex items-center justify-between p-3 hover:bg-muted/30">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full shrink-0 ${svc.active ? "bg-green-500" : "bg-gray-300"}`} />
                            <span className="text-sm font-medium truncate">{svc.title}</span>
                          </div>
                          <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-0.5 ml-4">
                            <span>{provider?.business_name || "Unknown"}</span>
                            {svc.category && <span>{svc.category}</span>}
                            {svc.duration_minutes && <span>{svc.duration_minutes}min</span>}
                            {svc.is_online && <span>Online</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          {svc.price_zar != null && <span className="text-sm font-medium">R{svc.price_zar}</span>}
                          <Badge variant={svc.active ? "default" : "secondary"} className="text-[10px]">
                            {svc.active ? "Active" : "Inactive"}
                          </Badge>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => toggleServiceActive(svc.id, svc.active)}>
                            {svc.active ? <CheckCircle className="h-3.5 w-3.5 text-green-600" /> : <XCircle className="h-3.5 w-3.5 text-gray-400" />}
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => navigate(`/wellness-exchange/edit-service/${svc.id}`)}>
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => deleteService(svc.id)}>
                            <Trash2 className="h-3.5 w-3.5 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminProviders;
