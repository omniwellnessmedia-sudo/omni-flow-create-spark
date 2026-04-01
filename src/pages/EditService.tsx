import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import UnifiedNavigation from "@/components/navigation/UnifiedNavigation";
import Footer from "@/components/Footer";
import { ArrowLeft, Save, Coins, Clock, MapPin, Sparkles, Loader2, PiggyBank, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { wellnessSpecialties, getCategoryForSpecialty } from "@/data/wellnessGlossary";

const EditService = () => {
  const { user } = useAuth();
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [aiLoading, setAiLoading] = useState({ title: false, description: false });
  const [categorySearch, setCategorySearch] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priceZar: "",
    priceWellcoins: "",
    duration: "",
    location: "",
    isOnline: false,
    imageUrl: "",
    active: true,
  });

  useEffect(() => {
    if (serviceId) fetchService();
  }, [serviceId]);

  const fetchService = async () => {
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("id", serviceId)
        .single();

      if (error) throw error;

      setFormData({
        title: data.title || "",
        description: data.description || "",
        category: data.category || "",
        priceZar: data.price_zar?.toString() || "",
        priceWellcoins: data.price_wellcoins?.toString() || "",
        duration: data.duration_minutes?.toString() || "",
        location: data.location || "",
        isOnline: data.is_online || false,
        imageUrl: data.images?.[0] || "",
        active: data.active ?? true,
      });
    } catch (error) {
      console.error("Error fetching service:", error);
      toast.error("Service not found");
      navigate(-1);
    } finally {
      setFetching(false);
    }
  };

  const filteredCategories = wellnessSpecialties.filter((s) =>
    s.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !serviceId) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("services")
        .update({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          price_zar: formData.priceZar ? parseFloat(formData.priceZar) : null,
          price_wellcoins: formData.priceWellcoins ? parseInt(formData.priceWellcoins) : null,
          duration_minutes: formData.duration ? parseInt(formData.duration) : null,
          location: formData.location,
          is_online: formData.isOnline,
          images: formData.imageUrl ? [formData.imageUrl] : null,
          active: formData.active,
        })
        .eq("id", serviceId);

      if (error) throw error;

      toast.success("Service updated successfully!");
      navigate(-1);
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update service");
    } finally {
      setLoading(false);
    }
  };

  const generateContent = async (type: "title" | "description") => {
    if (!formData.category) {
      toast.error("Please select a category first");
      return;
    }
    setAiLoading((prev) => ({ ...prev, [type]: true }));
    try {
      const response = await fetch(
        `https://dtjmhieeywdvhjxqyxad.supabase.co/functions/v1/generate-content`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            type: type === "title" ? "service_title" : "service_description",
            specialties: [formData.category],
          }),
        }
      );
      const data = await response.json();
      if (data.content) {
        handleInputChange(type === "title" ? "title" : "description", data.content);
        toast.success(`${type === "title" ? "Title" : "Description"} regenerated!`);
      }
    } catch {
      toast.error("Failed to generate content");
    } finally {
      setAiLoading((prev) => ({ ...prev, [type]: false }));
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <UnifiedNavigation />

      <main className="pt-20 pb-20 lg:pt-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 text-muted-foreground">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="font-heading font-semibold text-3xl sm:text-4xl tracking-tight">Edit Service</h1>
            <p className="text-muted-foreground text-lg mt-2">Update your service details — changes sync immediately</p>
          </div>

          <form onSubmit={handleSubmit}>
            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-8">
                <CardTitle className="flex items-center text-xl font-medium">
                  <Save className="h-5 w-5 mr-3 text-primary" />
                  Service Details
                </CardTitle>
                <CardDescription>
                  Changes will be live on your profile and the marketplace instantly
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Active Toggle */}
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <Label className="font-medium">Service Status</Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formData.active ? "Visible on marketplace" : "Hidden from marketplace"}
                    </p>
                  </div>
                  <Switch
                    checked={formData.active}
                    onCheckedChange={(checked) => handleInputChange("active", checked)}
                  />
                </div>

                {/* Image */}
                <div className="space-y-3">
                  <Label>Service Image</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleInputChange("imageUrl", URL.createObjectURL(file));
                        toast.success("Image updated!");
                      }
                    }}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-accent"
                  />
                  {formData.imageUrl && (
                    <img src={formData.imageUrl} alt="Preview" className="w-32 h-24 object-cover rounded-md border" />
                  )}
                </div>

                {/* Title */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="title">Service Title</Label>
                    <Button type="button" variant="outline" size="sm" onClick={() => generateContent("title")} disabled={aiLoading.title} className="text-xs">
                      {aiLoading.title ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Sparkles className="h-3 w-3 mr-1" />}
                      AI Generate
                    </Button>
                  </div>
                  <Input id="title" value={formData.title} onChange={(e) => handleInputChange("title", e.target.value)} required />
                </div>

                {/* Description */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="description">Description</Label>
                    <Button type="button" variant="outline" size="sm" onClick={() => generateContent("description")} disabled={aiLoading.description} className="text-xs">
                      {aiLoading.description ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Sparkles className="h-3 w-3 mr-1" />}
                      AI Generate
                    </Button>
                  </div>
                  <Textarea id="description" value={formData.description} onChange={(e) => handleInputChange("description", e.target.value)} rows={4} required />
                </div>

                {/* Category */}
                <div className="space-y-4">
                  <Label>Service Category</Label>
                  <div className="space-y-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input placeholder="Search wellness specialties..." value={categorySearch} onChange={(e) => setCategorySearch(e.target.value)} className="pl-10" />
                    </div>
                    {formData.category && (
                      <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                        <span className="text-sm font-medium">Selected:</span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground">{formData.category}</span>
                        <button type="button" onClick={() => handleInputChange("category", "")} className="text-xs text-muted-foreground hover:text-foreground">Change</button>
                      </div>
                    )}
                    {!formData.category && (
                      <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto border rounded-lg p-4">
                        {filteredCategories.map((category) => (
                          <div key={category} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded cursor-pointer" onClick={() => { handleInputChange("category", category); setCategorySearch(""); }}>
                            <div>
                              <span className="text-sm font-medium">{category}</span>
                              <span className="text-xs text-muted-foreground ml-2">({getCategoryForSpecialty(category)})</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="flex items-center"><PiggyBank className="h-4 w-4 mr-1" />Price (ZAR)</Label>
                    <Input type="number" value={formData.priceZar} onChange={(e) => handleInputChange("priceZar", e.target.value)} min="0" />
                  </div>
                  <div>
                    <Label className="flex items-center"><Coins className="h-4 w-4 mr-1 text-omni-orange" />Price (WellCoins)</Label>
                    <Input type="number" value={formData.priceWellcoins} onChange={(e) => handleInputChange("priceWellcoins", e.target.value)} min="0" />
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <Label className="flex items-center"><Clock className="h-4 w-4 mr-1" />Duration (minutes)</Label>
                  <Input type="number" value={formData.duration} onChange={(e) => handleInputChange("duration", e.target.value)} min="15" step="15" />
                </div>

                {/* Location */}
                <div>
                  <Label className="flex items-center"><MapPin className="h-4 w-4 mr-1" />Location</Label>
                  <Input value={formData.location} onChange={(e) => handleInputChange("location", e.target.value)} required />
                </div>

                {/* Online */}
                <div className="flex items-center space-x-2">
                  <Switch checked={formData.isOnline} onCheckedChange={(checked) => handleInputChange("isOnline", checked)} />
                  <Label>Available online</Label>
                </div>

                {/* Submit */}
                <div className="pt-8 border-t flex gap-3">
                  <Button type="submit" size="lg" className="flex-1 h-12 text-base" disabled={loading}>
                    {loading ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</>
                    ) : (
                      <><Save className="h-4 w-4 mr-2" />Save Changes</>
                    )}
                  </Button>
                  <Button type="button" variant="outline" size="lg" className="h-12" onClick={() => navigate(-1)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EditService;
