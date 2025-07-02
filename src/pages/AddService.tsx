import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import MobileNavigation from "@/components/MobileNavigation";
import { ArrowLeft, Plus, DollarSign, Coins, Clock, MapPin } from "lucide-react";
import { toast } from "sonner";

const AddService = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priceZar: "",
    priceWellcoins: "",
    duration: "",
    location: "",
    isOnline: false
  });

  const categories = [
    "Yoga", "Meditation", "Nutrition", "Massage Therapy", "Acupuncture",
    "Life Coaching", "Personal Training", "Reiki", "Aromatherapy", "Herbalism",
    "QiGong", "Pilates"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Service created successfully! It will be reviewed before going live.");
    navigate("/wellness-exchange/marketplace");
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileNavigation />
      
      <main className="pt-20 pb-20 lg:pt-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="font-heading font-bold text-2xl sm:text-3xl">
              Add New <span className="bg-rainbow-gradient bg-clip-text text-transparent">Service</span>
            </h1>
            <p className="text-gray-600 mt-1">Share your wellness expertise with the community</p>
          </div>

          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="h-5 w-5 mr-2" />
                  Service Details
                </CardTitle>
                <CardDescription>
                  Provide information about your wellness service
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Title */}
                <div>
                  <Label htmlFor="title">Service Title</Label>
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
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Describe your service, what clients can expect, and any special features..."
                    rows={4}
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="priceZar" className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
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
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-rainbow-gradient hover:opacity-90 text-white"
                  >
                    Create Service
                  </Button>
                  <p className="text-sm text-gray-600 mt-2 text-center">
                    Your service will be reviewed before being published to the marketplace
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