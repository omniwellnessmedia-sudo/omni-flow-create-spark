
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Coins, Users, Bot, Star, Zap, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";

const WellnessExchange = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: <Bot className="h-8 w-8 text-omni-violet" />,
      title: "AI-Guided Onboarding",
      description: "Get personalized assistance every step of the way with our intelligent AI assistant that helps you maximize your success.",
    },
    {
      icon: <Coins className="h-8 w-8 text-omni-orange" />,
      title: "WellCoin Currency",
      description: "Earn and spend WellCoins through community participation. 1 WellCoin = 1 ZAR base value with hybrid payment options.",
    },
    {
      icon: <Users className="h-8 w-8 text-omni-green" />,
      title: "Vibrant Community",
      description: "Connect with like-minded wellness professionals and conscious consumers in a supportive ecosystem.",
    },
    {
      icon: <Star className="h-8 w-8 text-omni-blue" />,
      title: "Trust & Reviews",
      description: "Build your reputation with our robust two-way review system and verified member profiles.",
    },
    {
      icon: <Zap className="h-8 w-8 text-omni-red" />,
      title: "Smart Matching",
      description: "AI-powered recommendations connect the right providers with the right consumers effortlessly.",
    },
    {
      icon: <Heart className="h-8 w-8 text-pink-500" />,
      title: "Conscious Commerce",
      description: "Every transaction supports wellness, sustainability, and positive community impact.",
    }
  ];

  const stats = [
    { number: "500+", label: "Active Members" },
    { number: "1,000+", label: "WellCoins Circulating" },
    { number: "200+", label: "Services Available" },
    { number: "98%", label: "User Satisfaction" }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="pt-16">
        {/* Hero Section - Fixed */}
        <section className="relative py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Badge className="mb-6 px-6 py-3 bg-rainbow-gradient text-white text-sm font-medium shadow-lg border-0">
              Revolutionizing Wellness Exchange in South Africa
            </Badge>
            
            <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl mb-6 text-gray-900">
              The <span className="bg-rainbow-gradient bg-clip-text text-transparent font-extrabold">Wellness Exchange</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed">
              Where wellness meets innovation. Trade services, earn WellCoins, and build meaningful connections 
              in South Africa's most advanced conscious commerce platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              {user ? (
                <Button asChild size="lg" className="bg-rainbow-gradient hover:opacity-90 text-white px-8 py-3 shadow-lg font-semibold border-0">
                  <Link to="/wellness-exchange/marketplace">
                    Explore Marketplace
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button asChild size="lg" className="bg-rainbow-gradient hover:opacity-90 text-white px-8 py-3 shadow-lg font-semibold border-0">
                    <Link to="/auth">
                      Join as Provider
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="px-8 py-3 border-2 border-gray-300 bg-white hover:bg-gray-50 font-semibold text-gray-800">
                    <Link to="/auth">
                      Join as Consumer
                    </Link>
                  </Button>
                </>
              )}
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center bg-white rounded-lg p-4 shadow-md border border-gray-100">
                  <div className="text-3xl sm:text-4xl font-bold bg-rainbow-gradient bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-700 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section - Fixed */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-6 text-gray-900">
                Why Choose the <span className="bg-rainbow-gradient bg-clip-text text-transparent font-extrabold">Wellness Exchange</span>?
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Experience the future of wellness commerce with features designed to empower your journey.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature) => (
                <Card 
                  key={feature.title}
                  className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white border border-gray-200 text-center p-6"
                >
                  <CardHeader className="pb-4">
                    <div className="mx-auto mb-4 p-3 rounded-full bg-gray-50 w-fit">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl mb-2 text-gray-900">{feature.title}</CardTitle>
                    <CardDescription className="text-gray-600">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works - Fixed */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-6 text-gray-900">
                How the <span className="bg-rainbow-gradient bg-clip-text text-transparent font-extrabold">Exchange</span> Works
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Simple steps to start your wellness exchange journey.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* For Providers */}
              <Card className="p-8 hover:shadow-xl transition-all duration-300 bg-white border border-gray-200">
                <CardHeader className="text-center pb-6">
                  <div className="w-16 h-16 bg-omni-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-omni-green" />
                  </div>
                  <CardTitle className="text-2xl mb-4 text-gray-900">For Providers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-omni-green rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-xs font-bold">1</span>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1 text-gray-900">Sign Up & Get AI Guidance</h4>
                        <p className="text-sm text-gray-600">Our AI assistant helps you create your profile and first service listings.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-omni-green rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-xs font-bold">2</span>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1 text-gray-900">List Your Services</h4>
                        <p className="text-sm text-gray-600">Create compelling offerings with pricing in both ZAR and WellCoins.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-omni-green rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-xs font-bold">3</span>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1 text-gray-900">Earn & Grow</h4>
                        <p className="text-sm text-gray-600">Provide services, earn WellCoins, build your reputation, and grow your business.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* For Consumers */}
              <Card className="p-8 hover:shadow-xl transition-all duration-300 bg-white border border-gray-200">
                <CardHeader className="text-center pb-6">
                  <div className="w-16 h-16 bg-omni-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-8 w-8 text-omni-blue" />
                  </div>
                  <CardTitle className="text-2xl mb-4 text-gray-900">For Consumers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-omni-blue rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-xs font-bold">1</span>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1 text-gray-900">Join the Community</h4>
                        <p className="text-sm text-gray-600">Sign up and let our AI help you discover wellness services that match your needs.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-omni-blue rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-xs font-bold">2</span>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1 text-gray-900">Explore & Connect</h4>
                        <p className="text-sm text-gray-600">Browse services, read reviews, and connect with trusted wellness providers.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-omni-blue rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-xs font-bold">3</span>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1 text-gray-900">Pay Your Way</h4>
                        <p className="text-sm text-gray-600">Use traditional currency, WellCoins, or a hybrid payment for maximum flexibility.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* WellCoin System - Fixed */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="w-20 h-20 bg-gradient-to-br from-omni-orange to-omni-red rounded-full flex items-center justify-center mx-auto mb-6">
                <Coins className="h-10 w-10 text-white" />
              </div>
              <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-6 text-gray-900">
                The <span className="bg-gradient-to-r from-omni-orange to-omni-red bg-clip-text text-transparent font-extrabold">WellCoin</span> System
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
                Our innovative digital currency that powers the wellness exchange ecosystem.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <Card className="p-6 border-2 border-omni-orange/20 hover:border-omni-orange/40 transition-colors bg-white">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl flex items-center text-gray-900">
                    <Zap className="h-6 w-6 text-omni-orange mr-2" />
                    Earn WellCoins
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-omni-orange rounded-full mr-3"></div>
                      <span className="text-gray-700">Provide wellness services to community members</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-omni-orange rounded-full mr-3"></div>
                      <span className="text-gray-700">Refer new active members to the platform</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-omni-orange rounded-full mr-3"></div>
                      <span className="text-gray-700">Write helpful reviews and testimonials</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-omni-orange rounded-full mr-3"></div>
                      <span className="text-gray-700">Participate in community forums and events</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-omni-orange rounded-full mr-3"></div>
                      <span className="text-gray-700">Contribute valuable content and tutorials</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="p-6 border-2 border-omni-green/20 hover:border-omni-green/40 transition-colors bg-white">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl flex items-center text-gray-900">
                    <Heart className="h-6 w-6 text-omni-green mr-2" />
                    Spend WellCoins
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-omni-green rounded-full mr-3"></div>
                      <span className="text-gray-700">Book wellness services from providers</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-omni-green rounded-full mr-3"></div>
                      <span className="text-gray-700">Purchase natural products from 2BeWell</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-omni-green rounded-full mr-3"></div>
                      <span className="text-gray-700">Access premium platform features</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-omni-green rounded-full mr-3"></div>
                      <span className="text-gray-700">Combine with ZAR for hybrid payments</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-omni-green rounded-full mr-3"></div>
                      <span className="text-gray-700">Support community initiatives and causes</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center bg-gradient-to-r from-omni-orange/10 to-omni-green/10 rounded-full px-6 py-3 mb-4 border border-gray-200">
                <Coins className="h-5 w-5 text-omni-orange mr-2" />
                <span className="text-lg font-semibold text-gray-900">1 WellCoin = 1 ZAR Base Value</span>
              </div>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Transparent, stable, and flexible. Our hybrid payment system gives you the freedom to choose 
                how you want to transact while building community value.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section - Fixed */}
        <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl mb-6 text-white">
              Ready to Transform Your <span className="bg-rainbow-gradient bg-clip-text text-transparent font-extrabold">Wellness Journey</span>?
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-3xl mx-auto">
              Join thousands of wellness professionals and conscious consumers who are already benefiting 
              from the most advanced wellness exchange platform in South Africa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {user ? (
                <Button asChild size="lg" className="bg-rainbow-gradient hover:opacity-90 text-white px-8 py-3 shadow-lg font-bold border-0">
                  <Link to="/wellness-exchange/marketplace">
                    Explore Marketplace
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <Button asChild size="lg" className="bg-rainbow-gradient hover:opacity-90 text-white px-8 py-3 shadow-lg font-bold border-0">
                  <Link to="/auth">
                    Get Started Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              )}
              <Button asChild variant="outline" size="lg" className="px-8 py-3 border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold bg-white/10 backdrop-blur-sm">
                <Link to="/contact">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default WellnessExchange;
