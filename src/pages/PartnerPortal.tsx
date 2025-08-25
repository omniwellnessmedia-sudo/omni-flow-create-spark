
import MegaNavigation from "@/components/MegaNavigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Users, 
  Store, 
  Calendar, 
  TrendingUp, 
  Star, 
  Award, 
  Camera, 
  Heart, 
  BookOpen, 
  Zap,
  CheckCircle,
  ArrowRight,
  DollarSign,
  BarChart3,
  MessageCircle,
  Share2,
  Shield,
  Target
} from "lucide-react";

const PartnerPortal = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedService, setSelectedService] = useState("");

  const serviceCategories = [
    {
      id: "wellness",
      name: "Wellness & Mindfulness",
      icon: <Heart className="w-6 h-6" />,
      color: "bg-pink-500",
      services: ["Yoga Instruction", "Meditation Coaching", "Breathwork", "Sound Healing", "Reiki", "Life Coaching"],
      commission: "15-25%",
      avgEarning: "R2,500/month"
    },
    {
      id: "education",
      name: "Education & Training",
      icon: <BookOpen className="w-6 h-6" />,
      color: "bg-blue-500",
      services: ["Workshop Facilitation", "Online Courses", "Skill Training", "Language Teaching", "Art Classes", "Music Lessons"],
      commission: "20-30%",
      avgEarning: "R3,200/month"
    },
    {
      id: "creative",
      name: "Creative & Media",
      icon: <Camera className="w-6 h-6" />,
      color: "bg-purple-500",
      services: ["Photography", "Videography", "Graphic Design", "Content Creation", "Social Media Management", "Writing"],
      commission: "25-35%",
      avgEarning: "R4,800/month"
    },
    {
      id: "business",
      name: "Business & Consulting",
      icon: <TrendingUp className="w-6 h-6" />,
      color: "bg-green-500",
      services: ["Business Consulting", "Marketing Strategy", "Financial Planning", "HR Services", "Legal Advice", "Tech Support"],
      commission: "30-40%",
      avgEarning: "R6,500/month"
    }
  ];

  const partnerBenefits = [
    {
      title: "Zero Setup Costs",
      description: "Join our community for free - no membership fees or hidden charges",
      icon: <Shield className="w-8 h-8 text-green-500" />
    },
    {
      title: "Omni Media Support",
      description: "Get professional content creation and marketing support from our media team",
      icon: <Camera className="w-8 h-8 text-purple-500" />
    },
    {
      title: "WellCoins Integration",
      description: "Earn and accept community currency alongside traditional payments",
      icon: <Zap className="w-8 h-8 text-yellow-500" />
    },
    {
      title: "Flexible Commission",
      description: "Keep 60-85% of your earnings - higher than most platforms",
      icon: <DollarSign className="w-8 h-8 text-blue-500" />
    },
    {
      title: "AI-Powered Matching",
      description: "Smart algorithms connect you with ideal clients based on your expertise",
      icon: <Target className="w-8 h-8 text-red-500" />
    },
    {
      title: "Community Growth",
      description: "Tap into our existing network of conscious consumers and businesses",
      icon: <Users className="w-8 h-8 text-indigo-500" />
    }
  ];

  const successStories = [
    {
      name: "Sarah Johnson",
      service: "Yoga & Mindfulness",
      earnings: "R8,500/month",
      rating: 4.9,
      story: "Joined 6 months ago and tripled my client base through the platform",
      image: "/lovable-uploads/8599bcc3-c73a-4244-84fe-6caa49ab80df.png"
    },
    {
      name: "David Chen",
      service: "Business Consulting",
      earnings: "R12,000/month",
      rating: 5.0,
      story: "The AI matching system connects me with perfect clients every time",
      image: "/lovable-uploads/65549a00-dea0-461e-9e85-fe455db1c706.png"
    },
    {
      name: "Maria Santos",
      service: "Creative Photography",
      earnings: "R6,800/month",
      rating: 4.8,
      story: "Omni Media's support helped me showcase my work professionally",
      image: "/lovable-uploads/362cb38a-2c1c-4857-a238-75f8e507408e.png"
    }
  ];

  return (
    <div className="min-h-screen">
      <MegaNavigation />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="heading-secondary text-gradient-hero no-faded-text">
                  Join the <span className="text-gradient-rainbow">Conscious</span> Partner Network
                </h1>
                <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                  Transform your expertise into sustainable income while making a positive impact. 
                  Our AI-powered platform connects conscious service providers with clients who value authentic wellness and growth.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg" 
                    className="bg-gradient-rainbow hover:opacity-90 text-white font-semibold px-8 py-4 text-lg rounded-full shadow-xl"
                    asChild
                  >
                    <Link to="/wellness-exchange/provider-signup">
                      Start Your Journey
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 text-lg rounded-full"
                    onClick={() => setActiveTab("services")}
                  >
                    Explore Services
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold">R5,200</p>
                            <p className="text-sm text-gray-300">Avg Monthly</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold">1,250+</p>
                            <p className="text-sm text-gray-300">Active Partners</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="space-y-4 mt-8">
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                            <Star className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold">4.8/5</p>
                            <p className="text-sm text-gray-300">Partner Rating</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                            <BarChart3 className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold">89%</p>
                            <p className="text-sm text-gray-300">Success Rate</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-12 h-14">
                <TabsTrigger value="overview" className="text-sm font-medium">Overview</TabsTrigger>
                <TabsTrigger value="services" className="text-sm font-medium">Services</TabsTrigger>
                <TabsTrigger value="benefits" className="text-sm font-medium">Benefits</TabsTrigger>
                <TabsTrigger value="success" className="text-sm font-medium">Success Stories</TabsTrigger>
                <TabsTrigger value="application" className="text-sm font-medium">Apply Now</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="text-2xl font-heading">Why Choose Our Partner Network?</CardTitle>
                      <CardDescription className="text-lg">
                        We're not just another marketplace - we're a conscious community building the future of wellness and sustainable business.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Zap className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg mb-2">AI-Powered Client Matching</h3>
                            <p className="text-gray-600">Our advanced algorithms analyze client needs and match them with the perfect service provider, ensuring higher success rates and client satisfaction.</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Camera className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg mb-2">Omni Media Integration</h3>
                            <p className="text-gray-600">Get professional content creation, photography, and marketing support from our award-winning media team to showcase your services beautifully.</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Heart className="w-6 h-6 text-yellow-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg mb-2">Conscious Community</h3>
                            <p className="text-gray-600">Connect with like-minded individuals who value authentic wellness, sustainability, and positive impact over quick profits.</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="w-6 h-6 text-blue-500" />
                        Platform Stats
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Active Partners</span>
                            <span className="font-semibold">1,250+</span>
                          </div>
                          <Progress value={85} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Monthly Bookings</span>
                            <span className="font-semibold">3,400+</span>
                          </div>
                          <Progress value={92} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Client Satisfaction</span>
                            <span className="font-semibold">4.8/5</span>
                          </div>
                          <Progress value={96} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Partner Retention</span>
                            <span className="font-semibold">89%</span>
                          </div>
                          <Progress value={89} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {serviceCategories.map((category) => (
                    <Card key={category.id} className="hover:shadow-lg transition-all duration-300 group cursor-pointer">
                      <CardContent className="p-6">
                        <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform`}>
                          {category.icon}
                        </div>
                        <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
                        <p className="text-sm text-gray-600 mb-4">{category.services.length} services available</p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Commission:</span>
                            <span className="font-semibold text-green-600">{category.commission}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Avg Earning:</span>
                            <span className="font-semibold">{category.avgEarning}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Services Tab */}
              <TabsContent value="services">
                <div className="space-y-8">
                  <div className="text-center">
                    <h2 className="font-heading font-bold text-3xl mb-4">Service Categories</h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                      Explore our diverse range of service categories and find the perfect fit for your expertise and passion.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {serviceCategories.map((category) => (
                      <Card key={category.id} className="hover:shadow-xl transition-all duration-300">
                        <CardHeader>
                          <div className="flex items-center gap-3 mb-4">
                            <div className={`w-10 h-10 ${category.color} rounded-lg flex items-center justify-center text-white`}>
                              {category.icon}
                            </div>
                            <CardTitle className="text-xl">{category.name}</CardTitle>
                          </div>
                          <div className="flex gap-4 text-sm">
                            <Badge className="bg-green-100 text-green-800">
                              Commission: {category.commission}
                            </Badge>
                            <Badge className="bg-blue-100 text-blue-800">
                              Avg: {category.avgEarning}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-3">
                            {category.services.map((service) => (
                              <div key={service} className="flex items-center gap-2 text-sm">
                                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                <span>{service}</span>
                              </div>
                            ))}
                          </div>
                          <Button 
                            className="w-full mt-6 bg-gradient-rainbow hover:opacity-90 text-white"
                            onClick={() => {
                              setSelectedService(category.id);
                              setActiveTab("application");
                            }}
                          >
                            Apply for {category.name}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Benefits Tab */}
              <TabsContent value="benefits">
                <div className="space-y-12">
                  <div className="text-center">
                    <h2 className="font-heading font-bold text-3xl mb-4">Partner Benefits</h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                      We provide everything you need to succeed - from zero setup costs to AI-powered client matching.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {partnerBenefits.map((benefit, index) => (
                      <Card key={index} className="hover:shadow-lg transition-all duration-300 group">
                        <CardContent className="p-8 text-center">
                          <div className="mb-6 group-hover:scale-110 transition-transform">
                            {benefit.icon}
                          </div>
                          <h3 className="font-semibold text-xl mb-3">{benefit.title}</h3>
                          <p className="text-gray-600">{benefit.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-0">
                    <CardContent className="p-12">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        <div>
                          <h3 className="font-heading font-bold text-2xl mb-4">
                            Compare with Other Platforms
                          </h3>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                              <span className="font-medium">Commission Rate</span>
                              <div className="flex gap-4">
                                <Badge className="bg-green-100 text-green-800">Our Platform: 15-40%</Badge>
                                <Badge variant="outline">Others: 5-20%</Badge>
                              </div>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                              <span className="font-medium">Marketing Support</span>
                              <div className="flex gap-4">
                                <Badge className="bg-green-100 text-green-800">Full Media Team</Badge>
                                <Badge variant="outline">DIY Only</Badge>
                              </div>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                              <span className="font-medium">Client Quality</span>
                              <div className="flex gap-4">
                                <Badge className="bg-green-100 text-green-800">AI-Matched</Badge>
                                <Badge variant="outline">Random</Badge>
                              </div>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                              <span className="font-medium">Community</span>
                              <div className="flex gap-4">
                                <Badge className="bg-green-100 text-green-800">Conscious Network</Badge>
                                <Badge variant="outline">Basic Marketplace</Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="bg-white rounded-2xl p-8 shadow-lg">
                            <h4 className="font-bold text-3xl text-green-600 mb-2">60-85%</h4>
                            <p className="text-gray-600 mb-4">You keep more of what you earn</p>
                            <Button className="bg-gradient-rainbow hover:opacity-90 text-white px-8 py-3 rounded-full">
                              Calculate Your Earnings
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Success Stories Tab */}
              <TabsContent value="success">
                <div className="space-y-12">
                  <div className="text-center">
                    <h2 className="font-heading font-bold text-3xl mb-4">Success Stories</h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                      Real partners, real results. See how our community members have transformed their passion into sustainable income.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {successStories.map((story, index) => (
                      <Card key={index} className="hover:shadow-xl transition-all duration-300">
                        <CardContent className="p-8">
                          <div className="flex items-center gap-4 mb-6">
                            <img 
                              src={story.image} 
                              alt={story.name}
                              className="w-16 h-16 rounded-full object-cover"
                            />
                            <div>
                              <h3 className="font-semibold text-lg">{story.name}</h3>
                              <p className="text-gray-600">{story.service}</p>
                              <div className="flex items-center gap-1 mt-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`w-4 h-4 ${i < Math.floor(story.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                  />
                                ))}
                                <span className="text-sm text-gray-600 ml-1">{story.rating}</span>
                              </div>
                            </div>
                          </div>
                          <blockquote className="text-gray-700 italic mb-4">
                            "{story.story}"
                          </blockquote>
                          <div className="flex justify-between items-center">
                            <Badge className="bg-green-100 text-green-800 text-sm">
                              {story.earnings}
                            </Badge>
                            <Button variant="outline" size="sm">
                              Read Full Story
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                    <CardContent className="p-12 text-center">
                      <h3 className="font-heading font-bold text-2xl mb-4">
                        Ready to Write Your Success Story?
                      </h3>
                      <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
                        Join over 1,250 partners who have transformed their expertise into sustainable income through our conscious community.
                      </p>
                      <Button 
                        size="lg" 
                        className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8 py-4 text-lg rounded-full"
                        onClick={() => setActiveTab("application")}
                      >
                        Start Your Application
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Application Tab */}
              <TabsContent value="application">
                <div className="max-w-4xl mx-auto">
                  <div className="text-center mb-12">
                    <h2 className="font-heading font-bold text-3xl mb-4">Partner Application</h2>
                    <p className="text-lg text-gray-600">
                      Join our conscious community and start earning from your expertise. The application takes just 5 minutes.
                    </p>
                  </div>

                  <Card className="shadow-xl">
                    <CardContent className="p-8">
                      <form className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <Label htmlFor="firstName" className="text-base font-medium">First Name *</Label>
                            <Input id="firstName" placeholder="Your first name" className="mt-2" />
                          </div>
                          <div>
                            <Label htmlFor="lastName" className="text-base font-medium">Last Name *</Label>
                            <Input id="lastName" placeholder="Your last name" className="mt-2" />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <Label htmlFor="email" className="text-base font-medium">Email Address *</Label>
                            <Input id="email" type="email" placeholder="your@email.com" className="mt-2" />
                          </div>
                          <div>
                            <Label htmlFor="phone" className="text-base font-medium">Phone Number *</Label>
                            <Input id="phone" placeholder="+27 xxx xxx xxxx" className="mt-2" />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="serviceCategory" className="text-base font-medium">Primary Service Category *</Label>
                          <Select value={selectedService} onValueChange={setSelectedService}>
                            <SelectTrigger className="mt-2">
                              <SelectValue placeholder="Choose your main service category" />
                            </SelectTrigger>
                            <SelectContent>
                              {serviceCategories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="experience" className="text-base font-medium">Years of Experience *</Label>
                          <Select>
                            <SelectTrigger className="mt-2">
                              <SelectValue placeholder="Select your experience level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0-1">0-1 years</SelectItem>
                              <SelectItem value="2-3">2-3 years</SelectItem>
                              <SelectItem value="4-5">4-5 years</SelectItem>
                              <SelectItem value="6-10">6-10 years</SelectItem>
                              <SelectItem value="10+">10+ years</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="bio" className="text-base font-medium">Professional Bio *</Label>
                          <Textarea 
                            id="bio" 
                            placeholder="Tell us about your expertise, background, and what makes you unique..."
                            className="mt-2 min-h-[120px]"
                          />
                        </div>

                        <div>
                          <Label htmlFor="website" className="text-base font-medium">Website or Portfolio (Optional)</Label>
                          <Input id="website" placeholder="https://your-website.com" className="mt-2" />
                        </div>

                        <div className="space-y-4">
                          <Label className="text-base font-medium">Additional Information</Label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center space-x-2">
                              <input type="checkbox" id="certified" className="rounded" />
                              <Label htmlFor="certified" className="text-sm">I have relevant certifications</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input type="checkbox" id="insurance" className="rounded" />
                              <Label htmlFor="insurance" className="text-sm">I have professional insurance</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input type="checkbox" id="online" className="rounded" />
                              <Label htmlFor="online" className="text-sm">I offer online services</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input type="checkbox" id="travel" className="rounded" />
                              <Label htmlFor="travel" className="text-sm">I can travel to clients</Label>
                            </div>
                          </div>
                        </div>

                        <div className="border-t pt-8">
                          <div className="bg-blue-50 p-6 rounded-lg mb-6">
                            <h3 className="font-semibold text-lg mb-3">What happens next?</h3>
                            <div className="space-y-2 text-sm text-gray-700">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span>We'll review your application within 24 hours</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span>Schedule a brief video call to discuss your goals</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span>Set up your profile with our media team support</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span>Start receiving matched client opportunities</span>
                              </div>
                            </div>
                          </div>
                          
                          <Button 
                            type="submit" 
                            size="lg" 
                            className="w-full bg-gradient-rainbow hover:opacity-90 text-white font-semibold py-4 text-lg rounded-full shadow-lg"
                          >
                            Submit Application
                            <ArrowRight className="ml-2 w-5 h-5" />
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
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

export default PartnerPortal;
