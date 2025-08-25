
import MegaNavigation from "@/components/MegaNavigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Hash, TrendingUp, Users, MessageCircle, Calendar, Download, Calculator, CheckCircle, Instagram, Facebook, Twitter } from "lucide-react";
import { AddToCartButton } from "@/components/cart/AddToCartButton";

const SocialMediaStrategy = () => {
  const [auditData, setAuditData] = useState({ followers: '', engagement: '', posts: '' });
  const [auditResult, setAuditResult] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', business: '', goals: '' });

  const calculateEngagement = () => {
    const followers = parseFloat(auditData.followers) || 0;
    const engagement = parseFloat(auditData.engagement) || 0;
    const posts = parseFloat(auditData.posts) || 0;
    
    if (followers > 0 && engagement > 0) {
      const engagementRate = (engagement / followers) * 100;
      const postsPerWeek = posts;
      let health = 'Poor';
      if (engagementRate >= 3) health = 'Excellent';
      else if (engagementRate >= 1.5) health = 'Good';
      else if (engagementRate >= 0.5) health = 'Average';
      
      setAuditResult({ 
        rate: engagementRate.toFixed(2), 
        health, 
        postsPerWeek,
        recommendation: engagementRate < 1 ? 'Needs improvement' : 'Performing well'
      });
    }
  };

  const strategies = [
    {
      platform: "Instagram",
      icon: Instagram,
      color: "from-pink-500 to-purple-500",
      features: ["Story Strategy", "Reel Creation", "IGTV Content", "Shopping Integration"]
    },
    {
      platform: "Facebook", 
      icon: Facebook,
      color: "from-blue-600 to-blue-400",
      features: ["Community Building", "Event Promotion", "Live Streaming", "Ad Campaigns"]
    },
    {
      platform: "TikTok",
      icon: Hash,
      color: "from-black to-red-500", 
      features: ["Viral Content", "Trend Analysis", "Creator Partnerships", "Music Integration"]
    },
    {
      platform: "LinkedIn",
      icon: Users,
      color: "from-blue-700 to-blue-500",
      features: ["Thought Leadership", "B2B Networking", "Professional Content", "Industry Insights"]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <MegaNavigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-white via-gray-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl mb-6">
                Build <span className="text-gradient-rainbow">Engaging Communities</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Transform your social media presence with strategies that build authentic connections, 
                drive meaningful engagement, and convert followers into loyal advocates for your mission.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button size="lg" className="bg-gradient-rainbow hover:opacity-90 text-white font-semibold px-8 py-4 text-lg rounded-full shadow-lg">
                  <TrendingUp className="mr-2 w-5 h-5" />
                  Get Strategy Audit
                </Button>
                <Button variant="outline" size="lg" className="px-8 py-4 text-lg rounded-full border-2">
                  <Download className="mr-2 w-5 h-5" />
                  Content Calendar Template
                </Button>
              </div>
              <div className="flex items-center space-x-8 text-sm text-gray-600">
                <div className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Multi-Platform Strategy</div>
                <div className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Content Creation</div>
                <div className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Analytics & Reporting</div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border">
                <h3 className="font-heading font-bold text-2xl mb-6 text-center">Free Social Media Audit</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="business">Business/Brand Name</Label>
                    <Input 
                      id="business"
                      value={formData.business}
                      onChange={(e) => setFormData({...formData, business: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="goals">Primary Social Media Goal</Label>
                    <Select onValueChange={(value) => setFormData({...formData, goals: value})}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select your main goal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="awareness">Brand Awareness</SelectItem>
                        <SelectItem value="engagement">Community Engagement</SelectItem>
                        <SelectItem value="leads">Lead Generation</SelectItem>
                        <SelectItem value="sales">Drive Sales</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full bg-gradient-rainbow hover:opacity-90 text-white font-semibold py-3 rounded-full">
                    Get My Free Audit
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Engagement Calculator */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-4">
              Social Media <span className="text-gradient-rainbow">Health Check</span>
            </h2>
            <p className="text-lg text-gray-600">Analyze your current social media performance</p>
          </div>
          
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center text-2xl">
                <Calculator className="mr-3 w-6 h-6" />
                Engagement Rate Calculator
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div>
                  <Label className="text-sm font-medium">Total Followers</Label>
                  <Input 
                    type="number"
                    value={auditData.followers}
                    onChange={(e) => setAuditData({...auditData, followers: e.target.value})}
                    placeholder="5000"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Avg. Likes + Comments per Post</Label>
                  <Input 
                    type="number"
                    value={auditData.engagement}
                    onChange={(e) => setAuditData({...auditData, engagement: e.target.value})}
                    placeholder="150"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Posts per Week</Label>
                  <Input 
                    type="number"
                    value={auditData.posts}
                    onChange={(e) => setAuditData({...auditData, posts: e.target.value})}
                    placeholder="5"
                    className="mt-2"
                  />
                </div>
              </div>
              
              <Button onClick={calculateEngagement} className="w-full bg-gradient-rainbow hover:opacity-90 text-white font-semibold py-3 mb-6">
                Analyze My Performance
              </Button>
              
              {auditResult && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="font-bold text-xl mb-4 text-green-800">Your Social Media Health Score:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">{auditResult.rate}%</div>
                      <div className="text-sm text-green-700">Engagement Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">{auditResult.health}</div>
                      <div className="text-sm text-green-700">Performance Rating</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">{auditResult.postsPerWeek}</div>
                      <div className="text-sm text-green-700">Posts/Week</div>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-white rounded-lg">
                    <p className="text-green-800 font-semibold">Recommendation: {auditResult.recommendation}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Premium Packages */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-6">
              Premium <span className="text-gradient-rainbow">Strategy Packages</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Take your social media to the next level with our professional packages
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-2 border-gray-200 hover:shadow-lg transition-all duration-300">
              <CardHeader className="text-center">
                <CardTitle className="text-xl mb-2">Content Calendar</CardTitle>
                <div className="text-3xl font-bold text-green-600 mb-2">R99</div>
                <CardDescription>30-day content calendar with captions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    30 post ideas & captions
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Platform-specific optimization
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Hashtag recommendations
                  </div>
                </div>
                <AddToCartButton
                  item={{
                    id: "content-calendar",
                    title: "30-Day Content Calendar",
                    price_zar: 99,
                    price_wellcoins: 50,
                    category: "Social Media",
                    image: "/placeholder.svg"
                  }}
                  className="w-full"
                />
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-300 hover:shadow-lg transition-all duration-300 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-semibold">Most Popular</span>
              </div>
              <CardHeader className="text-center">
                <CardTitle className="text-xl mb-2">Strategy Audit</CardTitle>
                <div className="text-3xl font-bold text-purple-600 mb-2">R299</div>
                <CardDescription>Complete social media audit & strategy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Full competitor analysis
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Platform-specific strategy
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    60-day action plan
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Growth projections
                  </div>
                </div>
                <AddToCartButton
                  item={{
                    id: "strategy-audit",
                    title: "Complete Social Media Strategy Audit",
                    price_zar: 299,
                    price_wellcoins: 150,
                    category: "Social Media",
                    image: "/placeholder.svg"
                  }}
                  className="w-full"
                />
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-300 hover:shadow-lg transition-all duration-300">
              <CardHeader className="text-center">
                <CardTitle className="text-xl mb-2">1-on-1 Strategy Call</CardTitle>
                <div className="text-3xl font-bold text-blue-600 mb-2">R599</div>
                <CardDescription>60-minute personalized strategy session</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Live strategy session
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Custom action plan
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Follow-up resources
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Recording provided
                  </div>
                </div>
                <AddToCartButton
                  item={{
                    id: "strategy-call",
                    title: "1-on-1 Social Media Strategy Call",
                    price_zar: 599,
                    price_wellcoins: 300,
                    category: "Social Media",
                    image: "/placeholder.svg"
                  }}
                  className="w-full"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Platform Strategies */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-6">
              Platform-Specific <span className="text-gradient-rainbow">Strategies</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Tailored approaches for each social media platform to maximize your reach and engagement
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {strategies.map((strategy, index) => (
              <Card key={strategy.platform} className="hover:shadow-lg transition-all duration-300 border-0 shadow-md overflow-hidden">
                <div className={`bg-gradient-to-r ${strategy.color} p-6 text-white`}>
                  <div className="flex items-center mb-4">
                    <strategy.icon className="w-8 h-8 mr-3" />
                    <h3 className="font-heading font-bold text-2xl">{strategy.platform}</h3>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-3">
                    {strategy.features.map((feature) => (
                      <div key={feature} className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-6">
              Complete <span className="text-gradient-rainbow">Social Media Management</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Hash, title: "Content Strategy", desc: "Develop compelling content themes that resonate with your audience" },
              { icon: MessageCircle, title: "Community Management", desc: "Build and nurture engaged communities around your brand" },
              { icon: TrendingUp, title: "Growth Campaigns", desc: "Strategic campaigns designed to increase followers and engagement" },
              { icon: Users, title: "Influencer Partnerships", desc: "Connect with relevant influencers to amplify your message" },
              { icon: Calendar, title: "Content Scheduling", desc: "Consistent posting schedule optimized for each platform" },
              { icon: TrendingUp, title: "Analytics & Reporting", desc: "Detailed insights and recommendations for continuous improvement" }
            ].map((service, index) => (
              <Card key={service.title} className="bg-white hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                <CardHeader>
                  <service.icon className="w-12 h-12 text-green-600 mb-4" />
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">{service.desc}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-6">
            Ready to Amplify Your Social Presence?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Book a free social media strategy session to discover how we can help you build authentic connections and drive meaningful engagement.
          </p>
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <h3 className="font-heading font-bold text-2xl mb-6 text-gray-900">Schedule Your Strategy Session</h3>
            <div className="text-gray-900 mb-6">
              <p className="mb-2">📱 Complete social media audit</p>
              <p className="mb-2">📊 Custom strategy recommendations</p>
              <p className="mb-2">📅 Content calendar template</p>
              <p>🎯 Platform-specific action plan</p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg mb-6">
              <p className="text-gray-700">Calendly booking widget will be integrated here</p>
            </div>
            <Button size="lg" className="bg-gradient-rainbow hover:opacity-90 text-white font-semibold px-8 py-4 text-lg rounded-full shadow-lg">
              <Calendar className="mr-2 w-5 h-5" />
              Book My Strategy Session
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SocialMediaStrategy;
