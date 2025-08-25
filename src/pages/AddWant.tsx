import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import MobileNavigation from "@/components/MobileNavigation";
import { ArrowLeft, Heart, DollarSign, Coins, MapPin, Calendar } from "lucide-react";
import { toast } from "sonner";

const AddWant = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    budgetZar: "",
    budgetWellcoins: "",
    location: "",
    expiresAt: ""
  });

  const categories = [
    "Yoga", "Meditation", "Nutrition", "Massage Therapy", "Acupuncture",
    "Life Coaching", "Personal Training", "Reiki", "Aromatherapy", "Herbalism",
    "QiGong", "Pilates", "Other"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Want posted successfully! Providers will start responding soon.");
    navigate("/wellness-exchange/wants");
  };

  const handleInputChange = (field: string, value: string) => {
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
            <h1 className="heading-secondary text-gradient-hero no-faded-text text-center">
              Post a <span className="text-gradient-rainbow">Want</span>
            </h1>
            <p className="text-gray-600 mt-1">Tell the community what wellness service you're looking for</p>
          </div>

          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-omni-pink" />
                  What Are You Looking For?
                </CardTitle>
                <CardDescription>
                  Describe the wellness service you need and let providers come to you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Title */}
                <div>
                  <Label htmlFor="title">What do you need?</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="e.g., Looking for a prenatal yoga instructor"
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
                    placeholder="Provide more details about what you're looking for, your experience level, preferences, schedule, etc..."
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

                {/* Budget */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="budgetZar" className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      Budget (ZAR)
                    </Label>
                    <Input
                      id="budgetZar"
                      type="number"
                      value={formData.budgetZar}
                      onChange={(e) => handleInputChange("budgetZar", e.target.value)}
                      placeholder="Maximum you're willing to pay"
                      min="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="budgetWellcoins" className="flex items-center">
                      <Coins className="h-4 w-4 mr-1 text-omni-orange" />
                      Budget (WellCoins)
                    </Label>
                    <Input
                      id="budgetWellcoins"
                      type="number"
                      value={formData.budgetWellcoins}
                      onChange={(e) => handleInputChange("budgetWellcoins", e.target.value)}
                      placeholder="Alternative budget in WellCoins"
                      min="0"
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <Label htmlFor="location" className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    Preferred Location
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="e.g., Cape Town CBD, Stellenbosch, or Online"
                  />
                </div>

                {/* Expires At */}
                <div>
                  <Label htmlFor="expiresAt" className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Expires On (optional)
                  </Label>
                  <Input
                    id="expiresAt"
                    type="date"
                    value={formData.expiresAt}
                    onChange={(e) => handleInputChange("expiresAt", e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Leave empty for no expiration date
                  </p>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-rainbow hover:opacity-90 text-white"
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Post My Want
                  </Button>
                  <p className="text-sm text-gray-600 mt-2 text-center">
                    Your want will be visible to all providers in the marketplace
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">💡 Tips for Better Responses</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Be specific about your needs and preferences</li>
                  <li>• Mention your experience level (beginner, intermediate, advanced)</li>
                  <li>• Include any scheduling requirements or constraints</li>
                  <li>• Set a realistic budget to attract quality providers</li>
                  <li>• Specify if you prefer in-person or online sessions</li>
                </ul>
              </CardContent>
            </Card>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddWant;