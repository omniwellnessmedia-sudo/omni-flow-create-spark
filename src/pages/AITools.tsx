import { useState } from "react";
import MegaNavigation from "@/components/MegaNavigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { 
  Sparkles, 
  Target, 
  Zap, 
  Brain, 
  Palette, 
  Presentation, 
  TrendingUp, 
  Rocket,
  Heart,
  User,
  ArrowRight,
  CheckCircle,
  Star,
  Camera,
  FileText,
  BarChart,
  Globe,
  Users,
  MessageSquare,
  Calendar
} from "lucide-react";

const AITools = () => {
  const [userType, setUserType] = useState<'practitioner' | 'enthusiast' | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const { toast } = useToast();

  const handleToolComplete = (toolName: string) => {
    toast({
      title: "🎉 Tool Activated!",
      description: `${toolName} is ready to supercharge your wellness journey!`,
    });
  };

  // Journey-based tool categories
  const journeyStages = {
    practitioner: [
      {
        stage: "Just Getting Started",
        title: "🚀 Launch Your Wellness Business",
        description: "Everything you need to start your wellness practice from scratch",
        bundlePrice: 499,
        bundleWellcoins: 250,
        savingsText: "Save R300 vs individual tools",
        tools: [
          {
            id: "logo-generator",
            title: "Logo & Brand Identity Kit",
            description: "Professional logo designs with brand guidelines and color palettes",
            price: 199,
            wellcoins: 100,
            icon: Palette,
            features: ["5 logo variations", "Brand color palette", "Typography guide", "Social media kit"],
            demoAvailable: true
          },
          {
            id: "business-plan",
            title: "Wellness Business Plan Generator",
            description: "Complete business plan template tailored for wellness professionals",
            price: 149,
            wellcoins: 75,
            icon: FileText,
            features: ["Executive summary", "Financial projections", "Marketing strategy", "Operations plan"],
            demoAvailable: true
          },
          {
            id: "legal-templates",
            title: "Legal Document Library",
            description: "Essential legal templates and waivers for wellness practices",
            price: 99,
            wellcoins: 50,
            icon: CheckCircle,
            features: ["Client waivers", "Service contracts", "Privacy policies", "Terms & conditions"],
            demoAvailable: true
          },
          {
            id: "class-calendar",
            title: "Class & Session Calendar Builder",
            description: "Smart scheduling system with booking integration",
            price: 179,
            wellcoins: 90,
            icon: Calendar,
            features: ["Schedule templates", "Booking widgets", "Automated reminders", "Payment integration"],
            demoAvailable: true
          },
          {
            id: "pricing-calculator",
            title: "Pricing Strategy Calculator",
            description: "Data-driven pricing recommendations for your services",
            price: 79,
            wellcoins: 40,
            icon: TrendingUp,
            features: ["Market analysis", "Competitor pricing", "Profit margins", "Package recommendations"],
            demoAvailable: true
          }
        ]
      },
      {
        stage: "Already Going",
        title: "📈 Optimize & Grow Your Practice",
        description: "Advanced tools to scale your existing wellness business",
        bundlePrice: 899,
        bundleWellcoins: 450,
        savingsText: "Save R500 vs individual tools",
        tools: [
          {
            id: "content-calendar-pro",
            title: "90-Day Content Calendar",
            description: "Professional content strategy with ready-to-post content",
            price: 299,
            wellcoins: 150,
            icon: Calendar,
            features: ["90 days of posts", "Platform optimization", "Hashtag research", "Engagement tactics"],
            demoAvailable: true
          },
          {
            id: "email-sequences",
            title: "Client Retention Email System",
            description: "Automated email sequences that convert and retain clients",
            price: 249,
            wellcoins: 125,
            icon: MessageSquare,
            features: ["Welcome sequences", "Re-engagement campaigns", "Upsell templates", "A/B test variants"],
            demoAvailable: true
          },
          {
            id: "workshop-builder",
            title: "Workshop & Program Creator",
            description: "Design and package your expertise into profitable programs",
            price: 399,
            wellcoins: 200,
            icon: Presentation,
            features: ["Program outlines", "Workbook templates", "Pricing strategies", "Launch sequences"],
            demoAvailable: true
          },
          {
            id: "social-strategy",
            title: "Advanced Social Media Strategy",
            description: "Platform-specific content and growth strategies",
            price: 199,
            wellcoins: 100,
            icon: Users,
            features: ["Platform strategies", "Content templates", "Growth hacks", "Analytics tracking"],
            demoAvailable: true
          },
          {
            id: "review-system",
            title: "Review & Testimonial Generator",
            description: "Automated system to collect and showcase client testimonials",
            price: 149,
            wellcoins: 75,
            icon: Star,
            features: ["Review collection", "Testimonial templates", "Social proof widgets", "Response templates"],
            demoAvailable: true
          },
          {
            id: "financial-dashboard",
            title: "Financial Tracking Dashboard",
            description: "Complete financial management system for wellness businesses",
            price: 179,
            wellcoins: 90,
            icon: BarChart,
            features: ["Revenue tracking", "Expense management", "Profit analysis", "Tax preparation"],
            demoAvailable: true
          }
        ]
      },
      {
        stage: "Ready to Scale",
        title: "🏆 Dominate Your Market",
        description: "Enterprise-level tools and our premium services for market leaders",
        bundlePrice: 2999,
        bundleWellcoins: 1500,
        savingsText: "Save R1000 + Free consultation calls",
        tools: [
          {
            id: "multi-location-planner",
            title: "Multi-Location Business Expansion",
            description: "Strategic planning for opening multiple wellness locations",
            price: 799,
            wellcoins: 400,
            icon: Globe,
            features: ["Location analysis", "Expansion timeline", "Investment planning", "Team structure"],
            demoAvailable: true,
            premium: true
          },
          {
            id: "staff-training-system",
            title: "Staff Training Program Builder",
            description: "Complete training systems for your wellness team",
            price: 599,
            wellcoins: 300,
            icon: Users,
            features: ["Training modules", "Certification tracks", "Performance metrics", "Onboarding guides"],
            demoAvailable: true,
            premium: true
          },
          {
            id: "advanced-analytics",
            title: "Advanced Analytics & Intelligence",
            description: "Deep business insights and predictive analytics",
            price: 699,
            wellcoins: 350,
            icon: BarChart,
            features: ["Predictive analytics", "Customer insights", "Market trends", "ROI optimization"],
            demoAvailable: true,
            premium: true
          },
          {
            id: "partnership-finder",
            title: "Partnership & Collaboration Hub",
            description: "Find and manage strategic partnerships in the wellness industry",
            price: 499,
            wellcoins: 250,
            icon: Users,
            features: ["Partnership matching", "Collaboration templates", "Revenue sharing", "Joint ventures"],
            demoAvailable: true,
            premium: true
          },
          {
            id: "white-label-creator",
            title: "White-Label Program Generator",
            description: "Create licensable wellness programs for other practitioners",
            price: 899,
            wellcoins: 450,
            icon: Rocket,
            features: ["Program packaging", "Licensing agreements", "Training materials", "Marketing support"],
            demoAvailable: true,
            premium: true
          },
          {
            id: "platform-integration",
            title: "Platform Integration Suite",
            description: "Seamless integration with all major wellness platforms",
            price: 799,
            wellcoins: 400,
            icon: Globe,
            features: ["API integrations", "Data synchronization", "Multi-platform management", "Custom dashboards"],
            demoAvailable: true,
            premium: true
          }
        ]
      }
    ],
    enthusiast: [
      {
        stage: "Getting Started",
        title: "Discover Your Path",
        description: "Find your unique wellness journey",
        tools: [
          {
            id: "wellness-assessment",
            title: "Personal Wellness Blueprint",
            description: "Get a personalized roadmap for your wellness journey",
            price: 49,
            wellcoins: 25,
            icon: Heart,
            features: ["Comprehensive assessment", "Personalized plan", "Resource library", "Progress tracking"]
          },
          {
            id: "habit-designer",
            title: "Habit Stack Designer",
            description: "Build sustainable wellness habits that stick",
            price: 39,
            wellcoins: 20,
            icon: Zap,
            features: ["Custom habit stacks", "Implementation guide", "Tracking templates", "Motivation boosters"]
          }
        ]
      },
      {
        stage: "Building Momentum",
        title: "Accelerate Your Growth",
        description: "Level up your wellness practice",
        tools: [
          {
            id: "meal-planner",
            title: "AI Nutrition Planner",
            description: "Get personalized meal plans that fuel your wellness goals",
            price: 79,
            wellcoins: 40,
            icon: Target,
            features: ["Custom meal plans", "Shopping lists", "Nutrition tracking", "Recipe variations"]
          },
          {
            id: "mindfulness-coach",
            title: "Mindfulness Coach AI",
            description: "Personalized meditation and mindfulness practices",
            price: 69,
            wellcoins: 35,
            icon: Brain,
            features: ["Custom meditations", "Breathing exercises", "Stress management", "Progress insights"]
          }
        ]
      },
      {
        stage: "Sharing Your Journey",
        title: "Inspire Others",
        description: "Share your transformation story",
        tools: [
          {
            id: "story-creator",
            title: "Wellness Story Creator",
            description: "Transform your journey into inspiring content",
            price: 99,
            wellcoins: 50,
            icon: Sparkles,
            features: ["Story structure", "Social templates", "Video scripts", "Engagement strategies"]
          },
          {
            id: "community-builder",
            title: "Community Builder",
            description: "Build and nurture your wellness community",
            price: 149,
            wellcoins: 75,
            icon: Users,
            features: ["Community strategy", "Engagement tactics", "Content calendar", "Growth hacks"]
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-pink-50">
      <MegaNavigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full px-6 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-700">AI-Powered Wellness Tools</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-center mb-6 bg-gradient-to-r from-black via-purple-600 to-orange-500 bg-clip-text text-transparent">
              Your Wellness Journey, AI-Accelerated
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Whether you're starting your wellness journey or scaling your practice, 
              our AI tools adapt to your exact needs. No more generic solutions – 
              get personalized tools that grow with you.
            </p>

            {!userType && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <Card 
                  className="cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-300 group"
                  onClick={() => setUserType('practitioner')}
                >
                  <CardContent className="p-8 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                      <User className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="font-heading font-bold text-2xl mb-4">I'm a Wellness Practitioner</h3>
                    <p className="text-gray-600 mb-6">
                      Scale your practice, create content, and grow your wellness business with AI-powered tools
                    </p>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                      Business Growth Focus
                    </Badge>
                  </CardContent>
                </Card>

                <Card 
                  className="cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-pink-300 group"
                  onClick={() => setUserType('enthusiast')}
                >
                  <CardContent className="p-8 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                      <Heart className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="font-heading font-bold text-2xl mb-4">I'm on My Wellness Journey</h3>
                    <p className="text-gray-600 mb-6">
                      Discover, build, and share your personal wellness transformation with AI guidance
                    </p>
                    <Badge variant="secondary" className="bg-pink-100 text-pink-700">
                      Personal Growth Focus
                    </Badge>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Journey-Based Tools */}
      {userType && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Button 
                variant="outline" 
                onClick={() => setUserType(null)}
                className="mb-8 hover:bg-gray-50"
              >
                ← Change Journey Type
              </Button>
              
              <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-6">
                Your {userType === 'practitioner' ? 'Business Growth' : 'Personal Wellness'} Journey
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {userType === 'practitioner' 
                  ? "From building your brand to scaling across platforms – we've got every stage covered"
                  : "From discovering your path to inspiring others – transform your wellness journey step by step"
                }
              </p>
            </div>

            {journeyStages[userType].map((stage, stageIndex) => (
              <div key={stage.stage} className="mb-20">
                {/* Stage Header with Bundle Option */}
                <div className="flex flex-col lg:flex-row items-start gap-8 mb-12">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {stageIndex + 1}
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-2xl text-gray-900">{stage.title}</h3>
                      <p className="text-gray-600">{stage.description}</p>
                    </div>
                  </div>

                  {/* Bundle Pricing Card for Practitioners */}
                  {userType === 'practitioner' && stage.bundlePrice && (
                    <Card className="bg-gradient-to-br from-purple-600 to-pink-600 text-white border-0 min-w-[300px]">
                      <CardContent className="p-6">
                        <div className="text-center">
                          <Badge className="bg-white/20 text-white mb-3">
                            🔥 Bundle Deal
                          </Badge>
                          <div className="text-3xl font-bold mb-2">R{stage.bundlePrice}</div>
                          <div className="text-purple-100 text-sm mb-3">or {stage.bundleWellcoins} WellCoins</div>
                          <div className="text-green-200 text-sm font-medium mb-4">{stage.savingsText}</div>
                          <Button 
                            className="w-full bg-white text-purple-600 hover:bg-gray-100 font-semibold"
                            onClick={() => handleToolComplete(`${stage.stage} Bundle`)}
                          >
                            Get Complete Bundle
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Individual Tools Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {stage.tools.map((tool, toolIndex) => (
                    <Card 
                      key={tool.id} 
                      className={`hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm overflow-hidden group ${
                        tool.premium ? 'ring-2 ring-gradient-to-r from-purple-400 to-pink-400' : ''
                      }`}
                    >
                      <div className="relative">
                        {/* Badges */}
                        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                          {tool.premium && (
                            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                              ⭐ Premium
                            </Badge>
                          )}
                          {tool.demoAvailable && (
                            <Badge variant="outline" className="bg-white/90 text-green-600 border-green-300">
                              🎯 Demo Available
                            </Badge>
                          )}
                          {toolIndex === 0 && stageIndex === 0 && (
                            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0">
                              <Star className="w-3 h-3 mr-1" />
                              Most Popular
                            </Badge>
                          )}
                        </div>
                        
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-12 h-12 ${
                                tool.premium 
                                  ? 'bg-gradient-to-br from-purple-500 to-pink-500' 
                                  : 'bg-gradient-to-br from-purple-100 to-pink-100'
                              } rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                <tool.icon className={`w-6 h-6 ${
                                  tool.premium ? 'text-white' : 'text-purple-600'
                                }`} />
                              </div>
                              <div>
                                <CardTitle className="text-xl">{tool.title}</CardTitle>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-2xl font-bold text-purple-600">R{tool.price}</span>
                                  <span className="text-sm text-gray-500">or {tool.wellcoins} WellCoins</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          <CardDescription className="text-gray-600 text-base leading-relaxed">
                            {tool.description}
                          </CardDescription>

                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">What you get:</Label>
                            <div className="grid grid-cols-1 gap-2">
                              {tool.features.map((feature, featureIndex) => (
                                <div key={featureIndex} className="flex items-center text-sm text-gray-600">
                                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                                  {feature}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="pt-4 border-t space-y-3">
                            {tool.demoAvailable && (
                              <Button
                                variant="outline"
                                className="w-full border-purple-300 text-purple-600 hover:bg-purple-50"
                                onClick={() => handleToolComplete(`${tool.title} Demo`)}
                              >
                                🎯 Try Interactive Demo
                              </Button>
                            )}
                            <AddToCartButton
                              item={{
                                id: tool.id,
                                title: tool.title,
                                price_zar: tool.price,
                                price_wellcoins: tool.wellcoins,
                                category: "AI Tools",
                                image: "/placeholder.svg"
                              }}
                              className={`w-full ${
                                tool.premium 
                                  ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600' 
                                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                              } text-white border-0 font-semibold py-3 rounded-xl group-hover:shadow-lg transition-all`}
                            />
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Stage Separator */}
                {stageIndex < journeyStages[userType].length - 1 && (
                  <div className="flex justify-center mt-16">
                    <div className="flex items-center gap-4 text-gray-400">
                      <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-20"></div>
                      <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200">
                        <ArrowRight className="w-4 h-4" />
                        <span className="text-sm font-medium">Next Stage</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                      <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-20"></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Social Proof */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-purple-100">Wellness Practitioners</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10k+</div>
              <div className="text-purple-100">AI Tools Generated</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-purple-100">Success Rate</div>
            </div>
          </div>
          
          <blockquote className="text-xl italic mb-6">
            "These AI tools completely transformed how I create content for my yoga studio. 
            I went from spending hours on copy to having everything ready in minutes!"
          </blockquote>
          <div className="text-purple-200">
            - Sarah K., Yoga Instructor & Studio Owner
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AITools;