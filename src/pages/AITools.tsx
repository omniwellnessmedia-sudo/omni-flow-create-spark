import { useState } from "react";
import Navigation from "@/components/Navigation";
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
  MessageSquare
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
        stage: "Foundation",
        title: "Build Your Brand Voice",
        description: "Establish your unique wellness identity",
        tools: [
          {
            id: "brand-foundation",
            title: "Brand Voice Generator",
            description: "Create your authentic wellness brand voice that resonates with your ideal clients",
            price: 79,
            wellcoins: 40,
            icon: MessageSquare,
            features: ["Brand personality analysis", "Voice guidelines", "Tone examples", "Client avatars"]
          },
          {
            id: "content-pillars",
            title: "Content Pillar Creator",
            description: "Define your core content themes and messaging strategy",
            price: 59,
            wellcoins: 30,
            icon: Target,
            features: ["5 core content pillars", "Post templates", "Hashtag sets", "Engagement strategies"]
          }
        ]
      },
      {
        stage: "Content Creation",
        title: "Scale Your Content",
        description: "Create engaging content that converts",
        tools: [
          {
            id: "ai-copywriter",
            title: "Wellness Copywriter AI",
            description: "Generate high-converting copy for your services, workshops, and programs",
            price: 149,
            wellcoins: 75,
            icon: FileText,
            features: ["Sales page copy", "Email sequences", "Social captions", "Workshop descriptions"]
          },
          {
            id: "visual-creator",
            title: "Visual Content Generator",
            description: "Create stunning visuals for your wellness brand",
            price: 199,
            wellcoins: 100,
            icon: Camera,
            features: ["Custom graphics", "Quote cards", "Story templates", "Brand consistency"]
          }
        ]
      },
      {
        stage: "Business Growth",
        title: "Launch & Scale",
        description: "Take your practice to the next level",
        tools: [
          {
            id: "program-builder",
            title: "Wellness Program Builder",
            description: "Design comprehensive wellness programs that sell",
            price: 299,
            wellcoins: 150,
            icon: Presentation,
            features: ["Program structure", "Pricing strategy", "Marketing materials", "Launch sequence"]
          },
          {
            id: "market-analyzer",
            title: "Market Intelligence",
            description: "Analyze your competition and find your unique position",
            price: 399,
            wellcoins: 200,
            icon: BarChart,
            features: ["Competitor analysis", "Market positioning", "Pricing insights", "Growth opportunities"]
          }
        ]
      },
      {
        stage: "Go-to-Market",
        title: "Platform Domination",
        description: "Expand across all wellness platforms",
        tools: [
          {
            id: "platform-optimizer",
            title: "Multi-Platform Optimizer",
            description: "Optimize your presence across all major wellness platforms",
            price: 599,
            wellcoins: 300,
            icon: Globe,
            features: ["Platform analysis", "Content adaptation", "Cross-promotion strategy", "Analytics dashboard"]
          },
          {
            id: "growth-accelerator",
            title: "Growth Accelerator Suite",
            description: "Complete growth system for scaling wellness businesses",
            price: 999,
            wellcoins: 500,
            icon: Rocket,
            features: ["Full marketing system", "Automation setup", "Partnership network", "Revenue optimization"]
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
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full px-6 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-700">AI-Powered Wellness Tools</span>
            </div>
            
            <h1 className="font-heading font-bold text-4xl sm:text-6xl lg:text-7xl mb-6">
              Your Wellness Journey,
              <br />
              <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent">
                AI-Accelerated
              </span>
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
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {stageIndex + 1}
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-2xl text-gray-900">{stage.title}</h3>
                    <p className="text-gray-600">{stage.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {stage.tools.map((tool, toolIndex) => (
                    <Card 
                      key={tool.id} 
                      className="hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm overflow-hidden group"
                    >
                      <div className="relative">
                        <div className="absolute top-4 right-4 z-10">
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
                              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <tool.icon className="w-6 h-6 text-purple-600" />
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

                          <div className="pt-4 border-t">
                            <AddToCartButton
                              item={{
                                id: tool.id,
                                title: tool.title,
                                price_zar: tool.price,
                                price_wellcoins: tool.wellcoins,
                                category: "AI Tools",
                                image: "/placeholder.svg"
                              }}
                              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 font-semibold py-3 rounded-xl group-hover:shadow-lg transition-all"
                            />
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  ))}
                </div>

                {stageIndex < journeyStages[userType].length - 1 && (
                  <div className="flex justify-center mt-12">
                    <div className="flex items-center gap-2 text-gray-400">
                      <ArrowRight className="w-5 h-5" />
                      <span className="text-sm">Next Stage</span>
                      <ArrowRight className="w-5 h-5" />
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