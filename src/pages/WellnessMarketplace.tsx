
import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Star, Coins, Heart, Filter, Bot } from "lucide-react";

const WellnessMarketplace = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [location, setLocation] = useState("all");

  const categories = [
    { id: "all", name: "All Services", count: 156 },
    { id: "yoga", name: "Yoga & Movement", count: 34 },
    { id: "nutrition", name: "Nutrition & Wellness", count: 28 },
    { id: "therapy", name: "Therapy & Healing", count: 22 },
    { id: "coaching", name: "Life Coaching", count: 18 },
    { id: "massage", name: "Massage & Bodywork", count: 16 },
    { id: "meditation", name: "Meditation & Mindfulness", count: 14 },
    { id: "natural-products", name: "Natural Products", count: 24 }
  ];

  const services = [
    {
      id: 1,
      title: "Holistic Nutrition Consultation",
      provider: "Dr. Sarah Mitchell",
      category: "Nutrition & Wellness",
      rating: 4.9,
      reviews: 47,
      price: { zar: 450, wellcoins: 380 },
      location: "Cape Town City Bowl",
      image: "/lovable-uploads/9d51151d-b05c-4392-9f83-9e301a4f790d.png",
      description: "Personalized nutrition plan focusing on whole foods and sustainable lifestyle changes.",
      tags: ["Certified Nutritionist", "Plant-Based", "Holistic Health"],
      featured: true
    },
    {
      id: 2,
      title: "Vinyasa Flow Yoga Classes",
      provider: "Amara Wellness Studio",
      category: "Yoga & Movement",
      rating: 4.8,
      reviews: 89,
      price: { zar: 180, wellcoins: 150 },
      location: "Stellenbosch",
      image: "/lovable-uploads/8599bcc3-c73a-4244-84fe-6caa49ab80df.png",
      description: "Dynamic yoga practice combining breath, movement, and mindfulness in a beautiful studio space.",
      tags: ["Group Classes", "All Levels", "Mindful Movement"]
    },
    {
      id: 3,
      title: "Sound Healing Therapy",
      provider: "Thabo Mokoena",
      category: "Therapy & Healing",
      rating: 5.0,
      reviews: 23,
      price: { zar: 320, wellcoins: 280 },
      location: "Johannesburg",
      image: "/lovable-uploads/965c3c16-d837-4f01-8f8a-220d4a14a83b.png",
      description: "Transformative sound healing sessions using crystal bowls, gongs, and traditional instruments.",
      tags: ["Sound Therapy", "Energy Healing", "Stress Relief"]
    },
    {
      id: 4,
      title: "Organic Skincare Workshop",
      provider: "2BeWell by Zenith & Feroza",
      category: "Natural Products",
      rating: 4.9,
      reviews: 67,
      price: { zar: 250, wellcoins: 200 },
      location: "Cape Town",
      image: "/lovable-uploads/7c743eb8-f381-4e63-af07-39be635a68ca.png",
      description: "Learn to create your own natural skincare products using organic, locally-sourced ingredients.",
      tags: ["DIY Workshop", "Organic", "Eco-Friendly"],
      featured: true
    },
    {
      id: 5,
      title: "Mindfulness Life Coaching",
      provider: "Coach Maria Santos",
      category: "Life Coaching",
      rating: 4.7,
      reviews: 31,
      price: { zar: 600, wellcoins: 500 },
      location: "Online",
      image: "/lovable-uploads/00bcae7d-32b7-4512-ba26-c767559ee023.png",
      description: "Personalized coaching sessions to help you find clarity, purpose, and inner peace.",
      tags: ["1-on-1 Coaching", "Goal Setting", "Mindfulness"]
    },
    {
      id: 6,
      title: "Traditional Healing Consultation",
      provider: "Sangoma Nomsa Dlamini",
      category: "Therapy & Healing",
      rating: 4.8,
      reviews: 19,
      price: { zar: 200, wellcoins: 160 },
      location: "Durban",
      image: "/lovable-uploads/83be8984-2c43-478e-ba25-b848902c104f.png",
      description: "Authentic traditional healing practices combining ancestral wisdom with modern wellness.",
      tags: ["Traditional Medicine", "Cultural Heritage", "Spiritual Healing"]
    }
  ];

  const wantsList = [
    {
      id: 1,
      title: "Looking for Prenatal Yoga Instructor",
      user: "Lisa M.",
      budget: "R300-400 per session",
      location: "Cape Town",
      description: "Seeking experienced prenatal yoga instructor for private sessions. Prefer someone with certification in pregnancy yoga.",
      posted: "2 days ago"
    },
    {
      id: 2,
      title: "Need Nutritionist for Family Meal Planning",
      user: "David K.",
      budget: "R500-800 consultation",
      location: "Stellenbosch",
      description: "Looking for a family nutritionist to help create healthy meal plans for two adults and two children.",
      posted: "5 days ago"
    },
    {
      id: 3,
      title: "Seeking Stress Management Workshop",
      user: "Corporate Client",
      budget: "R2000-3000",
      location: "Johannesburg CBD",
      description: "Company seeking wellness facilitator for employee stress management workshop for 20-30 people.",
      posted: "1 week ago"
    }
  ];

  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || service.category.toLowerCase().includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="pt-16">
        {/* Header */}
        <section className="py-12 bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="font-heading font-bold text-3xl sm:text-4xl mb-2">
                  Wellness <span className="bg-rainbow-gradient bg-clip-text text-transparent">Marketplace</span>
                </h1>
                <p className="text-gray-600">Discover wellness services and connect with conscious providers</p>
              </div>
              
              {/* AI Assistant Prompt */}
              <div className="flex items-center bg-gradient-to-r from-omni-violet/10 to-omni-blue/10 rounded-lg p-4">
                <Bot className="h-6 w-6 text-omni-violet mr-3" />
                <div>
                  <p className="font-medium text-sm">Need help finding the perfect service?</p>
                  <Button variant="link" className="p-0 h-auto text-omni-violet text-sm">
                    Ask our AI Assistant →
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="py-6 bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search services, providers, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Filters */}
              <div className="flex gap-3">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name} ({cat.count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="cape-town">Cape Town</SelectItem>
                    <SelectItem value="johannesburg">Johannesburg</SelectItem>
                    <SelectItem value="durban">Durban</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Tabs defaultValue="services" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="services">Available Services ({filteredServices.length})</TabsTrigger>
                <TabsTrigger value="wants">Community Wants ({wantsList.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="services">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredServices.map((service) => (
                    <Card key={service.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                      {service.featured && (
                        <div className="bg-rainbow-gradient text-white text-xs font-medium px-3 py-1 text-center">
                          Featured Service
                        </div>
                      )}
                      
                      <div className="aspect-square overflow-hidden">
                        <img 
                          src={service.image}
                          alt={service.title}
                          className="instagram-post-img hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {service.category}
                          </Badge>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium ml-1">{service.rating}</span>
                            <span className="text-xs text-gray-500 ml-1">({service.reviews})</span>
                          </div>
                        </div>
                        
                        <CardTitle className="text-lg line-clamp-2">{service.title}</CardTitle>
                        <p className="text-sm text-omni-indigo font-medium">{service.provider}</p>
                        
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          {service.location}
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <CardDescription className="line-clamp-2 mb-4">
                          {service.description}
                        </CardDescription>
                        
                        <div className="flex flex-wrap gap-1 mb-4">
                          {service.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">ZAR Payment:</span>
                            <span className="font-bold">R{service.price.zar}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium flex items-center">
                              <Coins className="h-4 w-4 text-omni-orange mr-1" />
                              WellCoins:
                            </span>
                            <span className="font-bold text-omni-orange">{service.price.wellcoins} WC</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button className="flex-1" size="sm">
                            Book Now
                          </Button>
                          <Button variant="outline" size="sm">
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="wants">
                <div className="space-y-4">
                  {wantsList.map((want) => (
                    <Card key={want.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg mb-2">{want.title}</CardTitle>
                            <div className="flex items-center text-sm text-gray-500 space-x-4 mb-3">
                              <span>Posted by {want.user}</span>
                              <span>•</span>
                              <span>{want.posted}</span>
                              <span>•</span>
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {want.location}
                              </div>
                            </div>
                            <CardDescription className="mb-3">
                              {want.description}
                            </CardDescription>
                            <Badge className="bg-green-100 text-green-800">
                              Budget: {want.budget}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <Button className="w-full sm:w-auto">
                          Submit Proposal
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default WellnessMarketplace;
