import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Database, 
  Globe, 
  Code, 
  Users, 
  ShoppingCart, 
  BarChart3, 
  DollarSign,
  TrendingUp,
  Zap,
  Shield,
  Smartphone,
  Brain,
  Calendar,
  Camera,
  Palette
} from "lucide-react";

const TechnicalOverview = () => {
  const platforms = [
    {
      name: "Main Corporate Website",
      status: "Production Ready",
      features: ["Hero Section", "Services Showcase", "Team Profiles", "Portfolio", "Contact System"],
      completeness: 95,
      description: "Full-featured corporate website with responsive design and content management"
    },
    {
      name: "AI Tools Platform", 
      status: "Beta",
      features: ["Journey System", "Content Generation", "Data Analysis", "User Onboarding"],
      completeness: 80,
      description: "Staged AI-powered journey system for business and personal development"
    },
    {
      name: "2BeWell Marketplace",
      status: "MVP Complete",
      features: ["Service Listings", "Provider Profiles", "Booking System", "WellCoin Economy"],
      completeness: 90,
      description: "Wellness service marketplace with dual currency system"
    },
    {
      name: "Wellness Exchange",
      status: "Alpha",
      features: ["Community Posts", "Want System", "Service Discovery", "Provider Matching"],
      completeness: 70,
      description: "Community-driven platform for wellness service exchange"
    },
    {
      name: "Tours & Retreats",
      status: "Production Ready",
      features: ["Tour Catalog", "Booking System", "Itineraries", "Customer Management"],
      completeness: 95,
      description: "Complete tour booking platform for wellness experiences"
    },
    {
      name: "RoamBuddy Integration",
      status: "Live",
      features: ["Real-time API", "Product Catalog", "Purchase System", "Global Coverage"],
      completeness: 100,
      description: "Fully integrated eSIM and travel services marketplace"
    }
  ];

  const techStack = [
    { category: "Frontend", items: ["React 18", "TypeScript", "Vite", "Tailwind CSS", "Shadcn/ui"] },
    { category: "Backend", items: ["Supabase", "PostgreSQL", "Row Level Security", "Edge Functions"] },
    { category: "Authentication", items: ["Supabase Auth", "JWT", "Social Login", "Role-based Access"] },
    { category: "Database", items: ["23 Tables", "Advanced Triggers", "Real-time Subscriptions", "File Storage"] },
    { category: "APIs", items: ["RoamBuddy API", "Calendly Integration", "Custom Edge Functions"] },
    { category: "UI/UX", items: ["Responsive Design", "Dark/Light Mode", "Rainbow Gradient System", "Animations"] }
  ];

  const businessMetrics = [
    { label: "Total Development Hours", value: "2,000+", icon: Code },
    { label: "Database Tables", value: "23", icon: Database },
    { label: "API Endpoints", value: "15+", icon: Globe },
    { label: "Reusable Components", value: "66+", icon: Palette },
    { label: "User Journey Steps", value: "12", icon: Brain },
    { label: "Revenue Streams", value: "6", icon: DollarSign }
  ];

  const revenueProjections = {
    year1: {
      roambuddyCommissions: 50000,
      wellnessServices: 75000,
      aiToolsSubscriptions: 30000,
      toursRetreats: 100000,
      corporateServices: 200000,
      total: 455000
    },
    year2: {
      roambuddyCommissions: 120000,
      wellnessServices: 180000,
      aiToolsSubscriptions: 80000,
      toursRetreats: 250000,
      corporateServices: 400000,
      total: 1030000
    },
    year3: {
      roambuddyCommissions: 200000,
      wellnessServices: 350000,
      aiToolsSubscriptions: 150000,
      toursRetreats: 400000,
      corporateServices: 600000,
      total: 1700000
    }
  };

  const valuation = {
    development: 800000, // Based on 2000+ hours at $400/hour
    ipValue: 200000, // Custom components, business logic, integrations
    marketPosition: 300000, // First-mover advantage in conscious wellness tech
    revenueMultiple: 3, // Conservative 3x revenue multiple
    currentValue: 1300000,
    projectedValue: 5100000 // Based on Year 3 revenue x 3
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      {/* Back Navigation */}
      <div className="px-4 pt-6">
        <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
      </div>

      {/* Header */}
      <section className="py-12 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Technical Overview
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Complete analysis of the Omni Wellness Media multi-platform ecosystem, 
            technical architecture, and pre-launch valuation with RoamBuddy projections.
          </p>
          <Badge className="bg-gradient-primary text-white text-lg px-6 py-2">
            MVP Complete - Pre-Launch Ready
          </Badge>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <Tabs defaultValue="platforms" className="w-full">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-5 mb-12">
              <TabsTrigger value="platforms">Platforms</TabsTrigger>
              <TabsTrigger value="tech">Tech Stack</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="projections">Revenue</TabsTrigger>
              <TabsTrigger value="valuation">Valuation</TabsTrigger>
            </TabsList>

            {/* Platform Overview */}
            <TabsContent value="platforms" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Platform Architecture</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Six integrated platforms providing comprehensive wellness and travel solutions
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {platforms.map((platform) => (
                  <Card key={platform.name} className="hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant={platform.status === "Production Ready" || platform.status === "Live" ? "default" : "secondary"}>
                          {platform.status}
                        </Badge>
                        <span className="text-sm font-semibold text-primary">{platform.completeness}%</span>
                      </div>
                      <CardTitle className="text-lg">{platform.name}</CardTitle>
                      <CardDescription>{platform.description}</CardDescription>
                      <Progress value={platform.completeness} className="mt-2" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm">Key Features:</h4>
                        {platform.features.map((feature) => (
                          <div key={feature} className="flex items-center text-sm">
                            <div className="w-2 h-2 bg-primary rounded-full mr-2" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Technical Stack */}
            <TabsContent value="tech" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Technology Stack</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Modern, scalable architecture built for performance and maintainability
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {techStack.map((category) => (
                  <Card key={category.category}>
                    <CardHeader>
                      <CardTitle className="text-lg">{category.category}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {category.items.map((item) => (
                          <Badge key={item} variant="outline" className="mr-2 mb-2">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Business Metrics */}
              <div className="mt-12">
                <h3 className="text-2xl font-bold text-center mb-8">Development Metrics</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {businessMetrics.map((metric) => (
                    <Card key={metric.label} className="text-center">
                      <CardContent className="p-6">
                        <metric.icon className="w-8 h-8 text-primary mx-auto mb-2" />
                        <div className="text-2xl font-bold text-primary">{metric.value}</div>
                        <div className="text-sm text-muted-foreground">{metric.label}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Features */}
            <TabsContent value="features" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Feature Completeness</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Comprehensive feature set ready for beta testing and launch
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      E-commerce & Marketplace
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">RoamBuddy Integration</span>
                        <Badge>Complete</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Service Bookings</span>
                        <Badge>Complete</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">WellCoin Economy</span>
                        <Badge>Complete</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Payment Processing</span>
                        <Badge variant="secondary">Beta</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Brain className="w-5 h-5 mr-2" />
                      AI & Automation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Journey System</span>
                        <Badge>Complete</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Content Generation</span>
                        <Badge variant="secondary">Beta</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">User Onboarding</span>
                        <Badge>Complete</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Analytics Integration</span>
                        <Badge variant="secondary">Alpha</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="w-5 h-5 mr-2" />
                      Community & Social
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Provider Profiles</span>
                        <Badge>Complete</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Community Posts</span>
                        <Badge>Complete</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Want System</span>
                        <Badge>Complete</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Reviews & Ratings</span>
                        <Badge variant="secondary">Beta</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="w-5 h-5 mr-2" />
                      Tours & Events
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Tour Catalog</span>
                        <Badge>Complete</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Booking System</span>
                        <Badge>Complete</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Itinerary Management</span>
                        <Badge>Complete</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Customer Management</span>
                        <Badge variant="secondary">Beta</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Revenue Projections */}
            <TabsContent value="projections" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Revenue Projections</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Conservative 3-year financial projections across all revenue streams
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {Object.entries(revenueProjections).map(([year, data]) => (
                  <Card key={year} className={year === "year2" ? "ring-2 ring-primary" : ""}>
                    <CardHeader>
                      <CardTitle className="text-center">
                        {year === "year1" ? "Year 1" : year === "year2" ? "Year 2 (Target)" : "Year 3"}
                      </CardTitle>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary">
                          ${data.total.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">Total Revenue</div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>RoamBuddy Commissions</span>
                          <span className="font-semibold">${data.roambuddyCommissions.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Wellness Services</span>
                          <span className="font-semibold">${data.wellnessServices.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>AI Tools</span>
                          <span className="font-semibold">${data.aiToolsSubscriptions.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Tours & Retreats</span>
                          <span className="font-semibold">${data.toursRetreats.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Corporate Services</span>
                          <span className="font-semibold">${data.corporateServices.toLocaleString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* RoamBuddy Specific Projections */}
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Smartphone className="w-5 h-5 mr-2" />
                    RoamBuddy Revenue Breakdown
                  </CardTitle>
                  <CardDescription>
                    Conservative projections based on travel industry growth and eSIM adoption rates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">$50K</div>
                      <div className="text-sm text-muted-foreground">Year 1 Target</div>
                      <div className="text-xs text-muted-foreground mt-1">~100 customers/month</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">$120K</div>
                      <div className="text-sm text-muted-foreground">Year 2 Target</div>
                      <div className="text-xs text-muted-foreground mt-1">~240 customers/month</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">$200K</div>
                      <div className="text-sm text-muted-foreground">Year 3 Target</div>
                      <div className="text-xs text-muted-foreground mt-1">~400 customers/month</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Valuation */}
            <TabsContent value="valuation" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Pre-Launch Valuation</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Professional valuation based on development costs, IP value, and revenue projections
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <Card className="bg-gradient-to-r from-green-50 to-blue-50">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <DollarSign className="w-5 h-5 mr-2" />
                      Current Valuation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-6">
                      <div className="text-4xl font-bold text-green-600">
                        ${valuation.currentValue.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">Pre-Revenue Valuation</div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Development Costs</span>
                        <span className="font-semibold">${valuation.development.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">IP & Assets Value</span>
                        <span className="font-semibold">${valuation.ipValue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Market Position</span>
                        <span className="font-semibold">${valuation.marketPosition.toLocaleString()}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-bold">
                        <span>Total Asset Value</span>
                        <span>${valuation.currentValue.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      Projected Valuation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-6">
                      <div className="text-4xl font-bold text-purple-600">
                        ${valuation.projectedValue.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">Year 3 Valuation (3x Revenue)</div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Year 3 Revenue</span>
                        <span className="font-semibold">${revenueProjections.year3.total.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Revenue Multiple</span>
                        <span className="font-semibold">{valuation.revenueMultiple}x</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Growth Factor</span>
                        <span className="font-semibold text-green-600">+292%</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-bold">
                        <span>Projected Value</span>
                        <span>${valuation.projectedValue.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Investment Highlights */}
              <Card>
                <CardHeader>
                  <CardTitle>Investment Highlights</CardTitle>
                  <CardDescription>
                    Key factors supporting the valuation and growth projections
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-semibold mb-4 flex items-center">
                        <Shield className="w-4 h-4 mr-2" />
                        Risk Mitigation
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                          MVP Complete - Technical risk eliminated
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                          Live RoamBuddy integration - Revenue path validated
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                          Multi-platform approach - Diversified revenue
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                          Scalable architecture - Low marginal costs
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-4 flex items-center">
                        <Zap className="w-4 h-4 mr-2" />
                        Growth Catalysts
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                          Growing eSIM market (47% CAGR)
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                          Wellness tourism expansion
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                          AI tools market growth
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                          First-mover advantage in conscious tech
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready for Beta Testing & Launch</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Complete technical stack, validated revenue streams, and production-ready platforms 
            await your investment and strategic partnership.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-primary hover:bg-gradient-primary/90">
              Schedule Demo
            </Button>
            <Button size="lg" variant="outline">
              Download Full Report
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TechnicalOverview;