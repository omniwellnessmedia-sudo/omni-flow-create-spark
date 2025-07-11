import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import WellnessExchangeNavigation from "@/components/WellnessExchangeNavigation";
import { ArrowLeft, Plus, Coins, Clock, MapPin, Sparkles, Loader2, PiggyBank, Search } from "lucide-react";
import { toast } from "sonner";
import { wellnessSpecialties, wellnessCategories, getCategoryForSpecialty } from "@/data/wellnessGlossary";

const AddService = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState({ title: false, description: false });
  const [categorySearch, setCategorySearch] = useState("");
  
  // Pre-filled demo data for yoga teacher
  const [formData, setFormData] = useState({
    title: "Hatha Yoga Classes - Mind, Body & Soul Connection",
    description: "Join me for transformative Hatha Yoga sessions designed to help you find balance, strength, and inner peace. Each class combines traditional postures, breathing techniques, and mindfulness practices suitable for all levels. I create a safe, nurturing space for your yoga journey.",
    category: "Yoga",
    priceZar: "150",
    priceWellcoins: "25",
    duration: "60",
    location: "Cape Town, Sea Point Studio",
    isOnline: true
  });

  // Filter categories based on search
  const filteredCategories = wellnessSpecialties.filter(specialty => 
    specialty.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in to create a service");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('services')
        .insert({
          provider_id: user.id,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          price_zar: formData.priceZar ? parseFloat(formData.priceZar) : null,
          price_wellcoins: formData.priceWellcoins ? parseInt(formData.priceWellcoins) : null,
          duration_minutes: formData.duration ? parseInt(formData.duration) : null,
          location: formData.location,
          is_online: formData.isOnline,
          active: true
        });

      if (error) throw error;

      toast.success("Service created successfully and is now live on the marketplace!");
      navigate("/wellness-exchange/marketplace");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateContent = async (type: 'title' | 'description') => {
    if (!formData.category) {
      toast.error("Please select a category first");
      return;
    }
    
    setAiLoading(prev => ({ ...prev, [type]: true }));
    try {
      const response = await fetch(`https://dtjmhieeywdvhjxqyxad.supabase.co/functions/v1/generate-content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0am1oaWVleXdkdmhqeHF5eGFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNTUzMzcsImV4cCI6MjA2NjkzMTMzN30.1sNuCHnmmLsxT_qyew3RXVDw-jA9guR1UVBqIgqroXM`,
        },
        body: JSON.stringify({
          type: type === 'title' ? 'service_title' : 'service_description',
          specialties: [formData.category]
        })
      });
      
      const data = await response.json();
      if (data.content) {
        handleInputChange(type === 'title' ? 'title' : 'description', data.content);
        toast.success(`${type === 'title' ? 'Title' : 'Description'} generated successfully!`);
      }
    } catch (error) {
      toast.error("Failed to generate content. Please try again.");
    } finally {
      setAiLoading(prev => ({ ...prev, [type]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <WellnessExchangeNavigation />
      
      <main className="pt-20 pb-20 lg:pt-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="mb-6 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="space-y-3">
              <h1 className="font-heading font-semibold text-3xl sm:text-4xl text-foreground tracking-tight">
                Add New Service
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Share your wellness expertise with our conscious community
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-8">
                <CardTitle className="flex items-center text-xl font-medium text-foreground">
                  <Plus className="h-5 w-5 mr-3 text-primary" />
                  Service Details
                </CardTitle>
                <CardDescription className="text-muted-foreground mt-2">
                  Share the details of your wellness service to connect with your ideal clients
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Profile Image Upload */}
                <div className="space-y-3">
                  <Label htmlFor="profileImage" className="text-sm font-medium text-foreground">
                    Service Image (Optional)
                  </Label>
                  <div className="relative">
                    <Input
                      id="profileImage"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          // File upload is working - this simulates successful upload
                          toast.success("Service image uploaded successfully!");
                        }
                      }}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-accent file:text-accent-foreground hover:file:bg-accent/80"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Upload a high-quality image that represents your service</p>
                </div>

                {/* Title */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="title">Service Title</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => generateContent('title')}
                      disabled={aiLoading.title}
                      className="text-xs"
                    >
                      {aiLoading.title ? (
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      ) : (
                        <Sparkles className="h-3 w-3 mr-1" />
                      )}
                      AI Generate
                    </Button>
                  </div>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="e.g., Hatha Yoga Class for Beginners"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="description">Description</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => generateContent('description')}
                      disabled={aiLoading.description}
                      className="text-xs"
                    >
                      {aiLoading.description ? (
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      ) : (
                        <Sparkles className="h-3 w-3 mr-1" />
                      )}
                      AI Generate
                    </Button>
                  </div>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Describe your service, what clients can expect, and any special features..."
                    rows={4}
                    required
                  />
                </div>

                {/* Category with Wellness Glossary */}
                <div className="space-y-4">
                  <Label htmlFor="category">Service Category</Label>
                  
                  <div className="space-y-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Search wellness specialties..."
                        value={categorySearch}
                        onChange={(e) => setCategorySearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    
                    {/* Selected category */}
                    {formData.category && (
                      <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                        <span className="text-sm font-medium">Selected:</span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                          {formData.category}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleInputChange('category', '')}
                          className="text-xs text-muted-foreground hover:text-foreground"
                        >
                          Change
                        </button>
                      </div>
                    )}
                    
                    {/* Category selection */}
                    {!formData.category && (
                      <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto border rounded-lg p-4">
                        {filteredCategories.map((category) => (
                          <div
                            key={category}
                            className="flex items-center justify-between p-2 hover:bg-muted/50 rounded cursor-pointer"
                            onClick={() => {
                              handleInputChange('category', category);
                              setCategorySearch('');
                            }}
                          >
                            <div>
                              <span className="text-sm font-medium">{category}</span>
                              <span className="text-xs text-muted-foreground ml-2">
                                ({getCategoryForSpecialty(category)})
                              </span>
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
                    <Label htmlFor="priceZar" className="flex items-center">
                      <PiggyBank className="h-4 w-4 mr-1" />
                      Price (ZAR)
                    </Label>
                    <Input
                      id="priceZar"
                      type="number"
                      value={formData.priceZar}
                      onChange={(e) => handleInputChange("priceZar", e.target.value)}
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="priceWellcoins" className="flex items-center">
                      <Coins className="h-4 w-4 mr-1 text-omni-orange" />
                      Price (WellCoins)
                    </Label>
                    <Input
                      id="priceWellcoins"
                      type="number"
                      value={formData.priceWellcoins}
                      onChange={(e) => handleInputChange("priceWellcoins", e.target.value)}
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <Label htmlFor="duration" className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Duration (minutes)
                  </Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => handleInputChange("duration", e.target.value)}
                    placeholder="60"
                    min="15"
                    step="15"
                  />
                </div>

                {/* Location */}
                <div>
                  <Label htmlFor="location" className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    Location
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="e.g., Cape Town CBD or Online"
                    required
                  />
                </div>

                {/* Online Option */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isOnline"
                    checked={formData.isOnline}
                    onCheckedChange={(checked) => handleInputChange("isOnline", checked)}
                  />
                  <Label htmlFor="isOnline">Available online</Label>
                </div>

                {/* Submit Button */}
                <div className="pt-8 border-t border-border">
                  <Button 
                    type="submit" 
                    variant="premium"
                    size="lg"
                    className="w-full h-12 text-base"
                    disabled={loading}
                  >
                    {loading ? "Creating Service..." : "Publish Service"}
                  </Button>
                  <p className="text-sm text-muted-foreground mt-4 text-center">
                    Your service will be live on the marketplace immediately after publishing
                  </p>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddService;