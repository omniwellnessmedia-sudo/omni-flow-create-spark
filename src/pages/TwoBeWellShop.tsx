import MegaNavigation from "@/components/MegaNavigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { ShoppingCart, Coins, Users, Gift, Star, Heart, Leaf, Award, ArrowRight, Sparkles, Shield, Truck } from "lucide-react";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { useCart } from "@/contexts/CartContext";

const TwoBeWellShop = () => {
  const { state } = useCart();
  const [wellCoins, setWellCoins] = useState(250);
  const [activeTab, setActiveTab] = useState("products");

  const products = [
    {
      id: "lip-balm",
      title: "2BeKissed - Natural Lip Balm",
      price_zar: 85,
      price_wellcoins: 42,
      image: "/lovable-uploads/d369fae4-4adf-4e4c-89dd-9d37a01ea88e.png",
      description: "Mint-infused natural lip balm with Shea Butter, Coconut Oil, and Vitamin E for lasting moisture and protection.",
      ingredients: "Shea Butter, Coconut Oil, Candelilla Wax, Essential Oil, Vitamin E",
      benefits: ["100ml", "Vegan", "Handcrafted"],
      category: "Skincare",
      inStock: true,
      featured: true
    },
    {
      id: "face-serum",
      title: "2BeGlow - Radiance Face Serum",
      price_zar: 165,
      price_wellcoins: 82,
      image: "/lovable-uploads/bb1d5ac4-6c06-4ce7-8866-b0376ad65c36.png",
      description: "Glow & Calm face serum with Macadamia Nut Oil and Essential Oil Blend for radiant, healthy-looking skin.",
      ingredients: "Macadamia Nut Oil + Essential Oil Blend",
      benefits: ["130ml", "Vegan", "Natural Ingredients"],
      category: "Skincare",
      inStock: true,
      featured: true
    },
    {
      id: "body-butter",
      title: "2BeSmooth - Whipped Body Butter",
      price_zar: 125,
      price_wellcoins: 62,
      image: "/lovable-uploads/55337f01-2391-4c96-a2a3-0044cb84cd8b.png",
      description: "Luxuriously whipped body butter with Shea Butter, Cocoa Butter, and nourishing oils for silky-smooth skin.",
      ingredients: "Shea Butter, Cocoa Butter, Coconut Oil, Sweet Almond Oil, Arrowroot Powder, Vitamin E",
      benefits: ["100ml", "Vegan", "Whipped Texture"],
      category: "Skincare",
      inStock: true,
      featured: false
    },
    {
      id: "cleaner",
      title: "2BeFresh - All-Purpose Cleaner",
      price_zar: 95,
      price_wellcoins: 47,
      image: "/lovable-uploads/76a99deb-2c78-4ed9-9276-4d468c36b33b.png",
      description: "Natural all-purpose cleaning spray with plant-based ingredients for a chemical-free, eco-friendly home.",
      ingredients: "Natural plant-based ingredients, Essential oils",
      benefits: ["130ml", "Vegan", "Eco-Friendly"],
      category: "Home & Cleaning",
      inStock: true,
      featured: false
    }
  ];

  const communityRewards = [
    { action: "First Purchase", coins: 50, icon: <ShoppingCart className="w-5 h-5" />, description: "Welcome bonus for your first order" },
    { action: "Product Review", coins: 15, icon: <Star className="w-5 h-5" />, description: "Share your honest product experience" },
    { action: "Social Media Share", coins: 10, icon: <Heart className="w-5 h-5" />, description: "Spread the wellness love" },
    { action: "Refer a Friend", coins: 100, icon: <Users className="w-5 h-5" />, description: "Bring friends to our community" },
    { action: "Sustainability Challenge", coins: 25, icon: <Leaf className="w-5 h-5" />, description: "Participate in eco-friendly initiatives" },
    { action: "Workshop Attendance", coins: 75, icon: <Award className="w-5 h-5" />, description: "Join our educational workshops" }
  ];

  const membershipTiers = [
    { 
      name: "Seedling", 
      requirement: "0-499 WellCoins", 
      benefits: ["5% discount on all products", "Access to community tips", "Monthly newsletter"],
      color: "bg-emerald-100 text-emerald-800 border-emerald-200",
      icon: "🌱"
    },
    { 
      name: "Blooming", 
      requirement: "500-999 WellCoins", 
      benefits: ["10% discount", "Early access to new products", "Free monthly sample", "Priority support"],
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: "🌸"
    },
    { 
      name: "Flourishing", 
      requirement: "1000+ WellCoins", 
      benefits: ["15% discount", "VIP customer support", "Exclusive products", "Monthly wellness box", "Personal wellness consultant"],
      color: "bg-purple-100 text-purple-800 border-purple-200",
      icon: "🌺"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <MegaNavigation />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50"></div>
          <div className="absolute inset-0 opacity-30" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23000000\" fill-opacity=\"0.02\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"}}></div>
          
          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-emerald-300 to-emerald-500 rounded-full opacity-20 animate-bounce" style={{animationDelay: '0s', animationDuration: '6s'}}></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-br from-blue-300 to-blue-500 rounded-full opacity-20 animate-bounce" style={{animationDelay: '2s', animationDuration: '8s'}}></div>
          <div className="absolute bottom-40 left-20 w-12 h-12 bg-gradient-to-br from-purple-300 to-purple-500 rounded-full opacity-20 animate-bounce" style={{animationDelay: '4s', animationDuration: '7s'}}></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              {/* Left Content */}
              <div className="text-left space-y-8">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-white/20">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-emerald-700">Premium Natural Products</span>
                </div>

                {/* Main Heading */}
                <div>
                  <h1 className="font-heading font-bold text-5xl sm:text-7xl leading-tight mb-6">
                    <span className="block text-foreground">2BeWell</span>
                    <span className="block bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Natural Beauty
                    </span>
                    <span className="block text-foreground text-4xl sm:text-5xl font-medium">for Every Body</span>
                  </h1>
                  
                  <p className="text-xl text-muted-foreground max-w-lg leading-relaxed mb-8">
                    Handcrafted with love in South Africa. Our premium wellness products are made from 100% natural ingredients, 
                    supporting your journey to radiant health and sustainable living.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg hover:shadow-xl rounded-full px-8 py-4 font-semibold text-lg transition-all duration-300"
                    onClick={() => setActiveTab("products")}
                  >
                    Shop Natural Products
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 rounded-full px-8 py-4 font-semibold text-lg backdrop-blur-sm bg-white/80"
                    onClick={() => setActiveTab("wellcoins")}
                  >
                    <Coins className="mr-2 w-5 h-5" />
                    Earn WellCoins
                  </Button>
                </div>

                {/* Trust Indicators */}
                <div className="flex flex-wrap gap-6 pt-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Shield className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm font-medium">100% Natural</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Leaf className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm font-medium">Eco-Friendly</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Heart className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm font-medium">Cruelty-Free</span>
                  </div>
                </div>
              </div>

              {/* Right Content - Product Showcase */}
              <div className="relative">
                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-200 via-blue-200 to-purple-200 rounded-3xl blur-3xl opacity-30 scale-110"></div>
                
                {/* Product Grid */}
                <div className="relative grid grid-cols-2 gap-4">
                  {products.slice(0, 4).map((product, index) => (
                    <div 
                      key={product.id}
                      className={`group relative ${index === 0 ? 'col-span-2' : ''}`}
                      style={{
                        animation: `float ${4 + index}s ease-in-out infinite`,
                        animationDelay: `${index * 0.5}s`
                      }}
                    >
                      <Card className="overflow-hidden border-none shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 transform group-hover:scale-105">
                        <div className="relative">
                          <img 
                            src={product.image} 
                            alt={product.title}
                            className={`w-full object-cover ${index === 0 ? 'h-48' : 'h-32'} group-hover:scale-110 transition-transform duration-700`}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <Badge className="absolute top-2 right-2 bg-emerald-600 text-white shadow-lg">
                            R{product.price_zar}
                          </Badge>
                        </div>
                        <div className="p-3">
                          <h3 className="font-semibold text-sm line-clamp-1">{product.title}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{product.description}</p>
                        </div>
                      </Card>
                    </div>
                  ))}
                </div>

                {/* Floating Stats */}
                <div className="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/20">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 rounded-full">
                      <Coins className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Your WellCoins</p>
                      <p className="text-2xl font-bold text-emerald-600">{wellCoins}</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -top-6 -right-6 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/20">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Community</p>
                      <p className="text-2xl font-bold text-blue-600">2,547</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="flex flex-col items-center gap-2 text-muted-foreground animate-bounce">
              <span className="text-sm font-medium">Explore Products</span>
              <ArrowRight className="w-5 h-5 rotate-90" />
            </div>
          </div>
        </section>


        {/* Trust Indicators */}
        <section className="py-8 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center items-center gap-8 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">100% Natural Ingredients</span>
              </div>
              <div className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Sustainably Sourced</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Cruelty-Free</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Free Shipping on R200+</span>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex justify-center mb-12">
                <TabsList className="grid w-full max-w-md grid-cols-3 bg-card rounded-full p-2 shadow-elegant">
                  <TabsTrigger value="products" className="rounded-full font-medium">Products</TabsTrigger>
                  <TabsTrigger value="wellcoins" className="rounded-full font-medium">WellCoins</TabsTrigger>
                  <TabsTrigger value="community" className="rounded-full font-medium">Community</TabsTrigger>
                </TabsList>
              </div>

              {/* Products Tab */}
              <TabsContent value="products" className="animate-fade-in">
                {/* Featured Products */}
                <div className="mb-12">
                  <h2 className="font-heading font-bold text-3xl text-center mb-8">
                    Featured <span className="bg-gradient-primary bg-clip-text text-transparent">Products</span>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {products.filter(p => p.featured).map((product) => (
                      <Card key={product.id} className="group hover:shadow-glow transition-all duration-500 overflow-hidden border-none bg-gradient-to-br from-card to-card/50">
                        <div className="relative">
                          <img 
                            src={product.image} 
                            alt={product.title}
                            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground shadow-lg">
                            🪙 {product.price_wellcoins} WellCoins
                          </Badge>
                          {product.featured && (
                            <Badge className="absolute top-4 left-4 bg-secondary text-secondary-foreground shadow-lg">
                              ⭐ Featured
                            </Badge>
                          )}
                        </div>
                        <CardContent className="p-6">
                          <h3 className="font-heading font-bold text-xl mb-2">{product.title}</h3>
                          <p className="text-muted-foreground mb-4 line-clamp-2">{product.description}</p>
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl font-bold text-primary">R{product.price_zar}</span>
                              <span className="text-sm text-muted-foreground line-through">R{Math.floor(product.price_zar * 1.2)}</span>
                            </div>
                            <div className="flex gap-1">
                              {product.benefits.slice(0, 2).map((benefit) => (
                                <Badge key={benefit} variant="secondary" className="text-xs">
                                  {benefit}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <AddToCartButton 
                            item={product}
                            className="w-full bg-gradient-primary hover:shadow-glow rounded-full font-medium"
                          />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* All Products */}
                <div>
                  <h3 className="font-heading font-bold text-2xl mb-6">All Products</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                      <Card key={product.id} className="group hover:shadow-elegant transition-all duration-300 border-none">
                        <div className="relative overflow-hidden rounded-t-xl">
                          <img 
                            src={product.image} 
                            alt={product.title}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <Badge className="absolute top-3 right-3 bg-primary/90 text-primary-foreground backdrop-blur-sm">
                            🪙 {product.price_wellcoins}
                          </Badge>
                        </div>
                        <CardContent className="p-4">
                          <h4 className="font-semibold mb-2 line-clamp-1">{product.title}</h4>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-lg font-bold text-primary">R{product.price_zar}</span>
                            <Badge variant="outline" className="text-xs">{product.category}</Badge>
                          </div>
                          <AddToCartButton 
                            item={product}
                            size="sm"
                            className="w-full rounded-full"
                          />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* WellCoins Tab */}
              <TabsContent value="wellcoins" className="animate-fade-in">
                <div className="text-center mb-12">
                  <h2 className="font-heading font-bold text-3xl mb-4">
                    Earn <span className="bg-gradient-primary bg-clip-text text-transparent">WellCoins</span>
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Participate in our wellness community and earn WellCoins that you can spend on our premium products
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card className="border-none shadow-elegant">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Coins className="w-6 h-6 text-primary" />
                        Ways to Earn
                      </CardTitle>
                      <CardDescription>
                        Multiple ways to earn WellCoins through community engagement
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {communityRewards.map((reward) => (
                          <div key={reward.action} className="group p-4 rounded-xl bg-gradient-to-r from-card to-card/50 border border-border/50 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                                  {reward.icon}
                                </div>
                                <div>
                                  <span className="font-medium block">{reward.action}</span>
                                  <span className="text-sm text-muted-foreground">{reward.description}</span>
                                </div>
                              </div>
                              <Badge className="bg-primary/10 text-primary border-primary/20">
                                +{reward.coins}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-elegant">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Award className="w-6 h-6 text-secondary" />
                        Membership Tiers
                      </CardTitle>
                      <CardDescription>
                        Unlock better rewards as you collect more WellCoins
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {membershipTiers.map((tier, index) => (
                          <div key={tier.name} className={`p-6 rounded-xl border-2 ${tier.color} transition-all duration-300 hover:shadow-lg ${index === 1 ? 'ring-2 ring-primary/20' : ''}`}>
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <span className="text-2xl">{tier.icon}</span>
                                <h3 className="font-bold text-lg">{tier.name}</h3>
                              </div>
                              <Badge variant="outline" className="font-medium">{tier.requirement}</Badge>
                            </div>
                            <ul className="space-y-2">
                              {tier.benefits.map((benefit) => (
                                <li key={benefit} className="flex items-center gap-2 text-sm">
                                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                                  {benefit}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-medium">Your Progress to Blooming</span>
                          <span className="font-bold">{wellCoins}/500</span>
                        </div>
                        <Progress value={(wellCoins / 500) * 100} className="h-3" />
                        <p className="text-xs text-muted-foreground mt-2">
                          {500 - wellCoins} WellCoins to unlock 10% discount
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Community Tab */}
              <TabsContent value="community" className="animate-fade-in">
                <div className="text-center mb-12">
                  <h2 className="font-heading font-bold text-3xl mb-4">
                    Join Our <span className="bg-gradient-primary bg-clip-text text-transparent">Community</span>
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Connect with like-minded individuals, share knowledge, and earn WellCoins while making a positive impact
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <Card className="lg:col-span-2 border-none shadow-elegant">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Users className="w-6 h-6 text-primary" />
                        Active Challenges
                      </CardTitle>
                      <CardDescription>
                        Join ongoing community initiatives and earn WellCoins
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="p-6 bg-gradient-to-br from-emerald-50 to-green-100 rounded-xl border border-emerald-200">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-lg text-emerald-800 flex items-center gap-2">
                              🌱 Sustainable Living Challenge
                            </h3>
                            <Badge className="bg-emerald-600 text-white">+50 WellCoins</Badge>
                          </div>
                          <p className="text-emerald-700 mb-4">
                            Share your zero-waste tips and sustainable living practices with our community.
                          </p>
                          <div className="mb-3">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Progress</span>
                              <span>75 members participating</span>
                            </div>
                            <Progress value={75} className="h-2" />
                          </div>
                          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                            Join Challenge
                          </Button>
                        </div>

                        <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-100 rounded-xl border border-blue-200">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-lg text-blue-800 flex items-center gap-2">
                              💧 Water Conservation Project
                            </h3>
                            <Badge className="bg-blue-600 text-white">+75 WellCoins</Badge>
                          </div>
                          <p className="text-blue-700 mb-4">
                            Help document water-saving techniques in South African communities.
                          </p>
                          <div className="mb-3">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Progress</span>
                              <span>32 members participating</span>
                            </div>
                            <Progress value={45} className="h-2" />
                          </div>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            Join Project
                          </Button>
                        </div>

                        <div className="p-6 bg-gradient-to-br from-purple-50 to-violet-100 rounded-xl border border-purple-200">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-lg text-purple-800 flex items-center gap-2">
                              🤝 Wellness Mentorship
                            </h3>
                            <Badge className="bg-purple-600 text-white">+100 WellCoins</Badge>
                          </div>
                          <p className="text-purple-700 mb-4">
                            Mentor newcomers in their natural wellness journey and share your experience.
                          </p>
                          <div className="mb-3">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Active Mentors</span>
                              <span>18 mentors helping</span>
                            </div>
                            <Progress value={60} className="h-2" />
                          </div>
                          <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                            Become Mentor
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-elegant">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Gift className="w-6 h-6 text-secondary" />
                        Skill Exchange
                      </CardTitle>
                      <CardDescription>
                        Share your skills and learn from community members
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="p-4 bg-gradient-to-r from-card to-card/50 rounded-xl border">
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Star className="w-4 h-4 text-primary" />
                            Popular Skills Offered
                          </h4>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Natural Soap Making</span>
                              <Badge variant="outline" className="text-xs">+30 WellCoins</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Organic Gardening</span>
                              <Badge variant="outline" className="text-xs">+40 WellCoins</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Meditation & Mindfulness</span>
                              <Badge variant="outline" className="text-xs">+35 WellCoins</Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-gradient-to-r from-secondary/5 to-accent/5 rounded-xl border">
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Heart className="w-4 h-4 text-secondary" />
                            Skills Needed
                          </h4>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Web Design</span>
                              <Badge variant="secondary" className="text-xs">25 WellCoins</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Photography</span>
                              <Badge variant="secondary" className="text-xs">20 WellCoins</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Content Writing</span>
                              <Badge variant="secondary" className="text-xs">30 WellCoins</Badge>
                            </div>
                          </div>
                        </div>

                        <Button className="w-full bg-gradient-primary hover:shadow-glow rounded-full">
                          View All Exchanges
                        </Button>
                      </div>
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

export default TwoBeWellShop;