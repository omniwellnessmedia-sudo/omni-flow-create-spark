
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { ShoppingCart, Coins, Users, Gift, Star, Heart, Leaf, Award, Plus, Minus } from "lucide-react";

const TwoBeWellShop = () => {
  const [cart, setCart] = useState<{[key: string]: number}>({});
  const [wellCoins, setWellCoins] = useState(250); // User's current WellCoins

  const products = [
    {
      id: "lip-balm",
      name: "2BeKissed - Natural Lip Balm",
      price: 85,
      wellCoins: 42,
      image: "/lovable-uploads/d369fae4-4adf-4e4c-89dd-9d37a01ea88e.png",
      description: "Mint-infused natural lip balm with Shea Butter, Coconut Oil, and Vitamin E for lasting moisture and protection.",
      ingredients: "Shea Butter, Coconut Oil, Candelilla Wax, Essential Oil, Vitamin E",
      benefits: ["100ml", "Vegan", "Handcrafted"],
      inStock: true
    },
    {
      id: "face-serum",
      name: "2BeGlow - Radiance Face Serum",
      price: 165,
      wellCoins: 82,
      image: "/lovable-uploads/bb1d5ac4-6c06-4ce7-8866-b0376ad65c36.png",
      description: "Glow & Calm face serum with Macadamia Nut Oil and Essential Oil Blend for radiant, healthy-looking skin.",
      ingredients: "Macadamia Nut Oil + Essential Oil Blend",
      benefits: ["130ml", "Vegan", "Natural Ingredients"],
      inStock: true
    },
    {
      id: "body-butter",
      name: "2BeSmooth - Whipped Body Butter",
      price: 125,
      wellCoins: 62,
      image: "/lovable-uploads/55337f01-2391-4c96-a2a3-0044cb84cd8b.png",
      description: "Luxuriously whipped body butter with Shea Butter, Cocoa Butter, and nourishing oils for silky-smooth skin.",
      ingredients: "Shea Butter, Cocoa Butter, Coconut Oil, Sweet Almond Oil, Arrowroot Powder, Vitamin E",
      benefits: ["100ml", "Vegan", "Whipped Texture"],
      inStock: true
    },
    {
      id: "cleaner",
      name: "2BeFresh - All-Purpose Cleaner",
      price: 95,
      wellCoins: 47,
      image: "/lovable-uploads/76a99deb-2c78-4ed9-9276-4d468c36b33b.png",
      description: "Natural all-purpose cleaning spray with plant-based ingredients for a chemical-free, eco-friendly home.",
      ingredients: "Natural plant-based ingredients, Essential oils",
      benefits: ["130ml", "Vegan", "Eco-Friendly"],
      inStock: true
    }
  ];

  const communityRewards = [
    { action: "First Purchase", coins: 50, icon: <ShoppingCart className="w-5 h-5" /> },
    { action: "Product Review", coins: 15, icon: <Star className="w-5 h-5" /> },
    { action: "Social Media Share", coins: 10, icon: <Heart className="w-5 h-5" /> },
    { action: "Refer a Friend", coins: 100, icon: <Users className="w-5 h-5" /> },
    { action: "Sustainability Challenge", coins: 25, icon: <Leaf className="w-5 h-5" /> },
    { action: "Workshop Attendance", coins: 75, icon: <Award className="w-5 h-5" /> }
  ];

  const membershipTiers = [
    { 
      name: "Seedling", 
      requirement: "0-499 WellCoins", 
      benefits: ["5% discount on all products", "Access to community tips"],
      color: "bg-green-200 text-green-800"
    },
    { 
      name: "Blooming", 
      requirement: "500-999 WellCoins", 
      benefits: ["10% discount", "Early access to new products", "Free monthly sample"],
      color: "bg-blue-200 text-blue-800"
    },
    { 
      name: "Flourishing", 
      requirement: "1000+ WellCoins", 
      benefits: ["15% discount", "VIP customer support", "Exclusive products", "Monthly wellness box"],
      color: "bg-purple-200 text-purple-800"
    }
  ];

  const addToCart = (productId: string) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => ({
      ...prev,
      [productId]: Math.max((prev[productId] || 0) - 1, 0)
    }));
  };

  const getTotalItems = () => {
    return Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  };

  const getTotalPrice = () => {
    return Object.entries(cart).reduce((total, [productId, quantity]) => {
      const product = products.find(p => p.id === productId);
      return total + (product ? product.price * quantity : 0);
    }, 0);
  };

  const getTotalWellCoins = () => {
    return Object.entries(cart).reduce((total, [productId, quantity]) => {
      const product = products.find(p => p.id === productId);
      return total + (product ? product.wellCoins * quantity : 0);
    }, 0);
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16">
        {/* Header */}
        <section className="py-12 bg-gradient-to-br from-green-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div>
                <h1 className="font-heading font-bold text-3xl sm:text-4xl mb-4">
                  2BeWell <span className="bg-rainbow-gradient bg-clip-text text-transparent">Community Shop</span>
                </h1>
                <p className="text-lg text-gray-600">
                  Shop with traditional currency or use your WellCoins from community participation
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Card className="p-4 bg-white shadow-lg">
                  <div className="flex items-center gap-3">
                    <Coins className="w-8 h-8 text-yellow-500" />
                    <div>
                      <p className="text-sm text-gray-600">Your WellCoins</p>
                      <p className="text-2xl font-bold text-yellow-600">{wellCoins}</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 bg-white shadow-lg">
                  <div className="flex items-center gap-3">
                    <ShoppingCart className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Cart Items</p>
                      <p className="text-2xl font-bold text-green-600">{getTotalItems()}</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Tabs defaultValue="products" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-8">
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="wellcoins">WellCoins</TabsTrigger>
                <TabsTrigger value="community">Community</TabsTrigger>
                <TabsTrigger value="cart">Cart ({getTotalItems()})</TabsTrigger>
              </TabsList>

              {/* Products Tab */}
              <TabsContent value="products">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <Card key={product.id} className="hover:shadow-xl transition-all duration-300 group">
                      <div className="relative">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="instagram-post-img group-hover:scale-105 transition-transform duration-300"
                        />
                        <Badge className="absolute top-3 right-3 bg-yellow-100 text-yellow-800">
                          🪙 {product.wellCoins} WellCoins
                        </Badge>
                      </div>
                      <CardHeader>
                        <CardTitle className="font-heading text-lg">{product.name}</CardTitle>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-green-600">R{product.price}</span>
                          <div className="flex gap-1">
                            {product.benefits.map((benefit) => (
                              <Badge key={benefit} variant="secondary" className="text-xs">
                                {benefit}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                        <p className="text-xs text-gray-500 mb-4">
                          <strong>Key Ingredients:</strong> {product.ingredients}
                        </p>
                        <div className="flex items-center gap-2 mb-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeFromCart(product.id)}
                            disabled={!cart[product.id]}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="mx-3 font-semibold">{cart[product.id] || 0}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addToCart(product.id)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <Button 
                          onClick={() => addToCart(product.id)}
                          className="w-full bg-green-600 hover:bg-green-700 text-white rounded-full"
                        >
                          Add to Cart
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* WellCoins Tab */}
              <TabsContent value="wellcoins">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Coins className="w-6 h-6 text-yellow-500" />
                        Earn WellCoins
                      </CardTitle>
                      <CardDescription>
                        Participate in our community and earn WellCoins to spend on products
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {communityRewards.map((reward) => (
                          <div key={reward.action} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-white rounded-full">
                                {reward.icon}
                              </div>
                              <span className="font-medium">{reward.action}</span>
                            </div>
                            <Badge className="bg-yellow-100 text-yellow-800">
                              +{reward.coins} WellCoins
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="w-6 h-6 text-purple-500" />
                        Membership Tiers
                      </CardTitle>
                      <CardDescription>
                        Unlock better rewards as you collect more WellCoins
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {membershipTiers.map((tier) => (
                          <div key={tier.name} className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold text-lg">{tier.name}</h3>
                              <Badge className={tier.color}>{tier.requirement}</Badge>
                            </div>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {tier.benefits.map((benefit) => (
                                <li key={benefit} className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                  {benefit}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6">
                        <div className="flex justify-between text-sm mb-2">
                          <span>Your Progress</span>
                          <span>{wellCoins}/500 to next tier</span>
                        </div>
                        <Progress value={(wellCoins / 500) * 100} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Community Tab */}
              <TabsContent value="community">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-6 h-6 text-blue-500" />
                        Community Challenges
                      </CardTitle>
                      <CardDescription>
                        Join our community initiatives and earn WellCoins while making a difference
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="p-6 bg-green-50 rounded-xl">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-lg text-green-800">🌱 Sustainable Living Challenge</h3>
                            <Badge className="bg-green-200 text-green-800">+50 WellCoins</Badge>
                          </div>
                          <p className="text-green-700 mb-4">
                            Share your zero-waste tips and sustainable living practices with our community.
                          </p>
                          <Progress value={75} className="mb-2" />
                          <p className="text-sm text-green-600">75 members participating</p>
                        </div>

                        <div className="p-6 bg-blue-50 rounded-xl">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-lg text-blue-800">💧 Water Conservation Project</h3>
                            <Badge className="bg-blue-200 text-blue-800">+75 WellCoins</Badge>
                          </div>
                          <p className="text-blue-700 mb-4">
                            Help document water-saving techniques in South African communities.
                          </p>
                          <Progress value={45} className="mb-2" />
                          <p className="text-sm text-blue-600">32 members participating</p>
                        </div>

                        <div className="p-6 bg-purple-50 rounded-xl">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-lg text-purple-800">🤝 Wellness Mentorship</h3>
                            <Badge className="bg-purple-200 text-purple-800">+100 WellCoins</Badge>
                          </div>
                          <p className="text-purple-700 mb-4">
                            Mentor newcomers in their natural wellness journey and share your experience.
                          </p>
                          <Progress value={60} className="mb-2" />
                          <p className="text-sm text-purple-600">18 mentors active</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Gift className="w-6 h-6 text-pink-500" />
                        Skill Exchange
                      </CardTitle>
                      <CardDescription>
                        Share skills and learn from others in our community
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-semibold mb-2">Available Skills</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Natural Soap Making</span>
                              <Badge variant="outline">+30 WellCoins</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>Organic Gardening</span>
                              <Badge variant="outline">+40 WellCoins</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>Meditation & Mindfulness</span>
                              <Badge variant="outline">+35 WellCoins</Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-semibold mb-2">Seeking Skills</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Web Design</span>
                              <Badge variant="outline">25 WellCoins</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>Photography</span>
                              <Badge variant="outline">20 WellCoins</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>Content Writing</span>
                              <Badge variant="outline">30 WellCoins</Badge>
                            </div>
                          </div>
                        </div>

                        <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white">
                          Join Skill Exchange
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Cart Tab */}
              <TabsContent value="cart">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Shopping Cart</CardTitle>
                        <CardDescription>
                          {getTotalItems()} items in your cart
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {getTotalItems() === 0 ? (
                          <div className="text-center py-12">
                            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">Your cart is empty</p>
                            <Button className="mt-4" onClick={() => document.querySelector('[value="products"]')?.click()}>
                              Continue Shopping
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {Object.entries(cart).filter(([_, quantity]) => quantity > 0).map(([productId, quantity]) => {
                              const product = products.find(p => p.id === productId);
                              if (!product) return null;
                              
                              return (
                                <div key={productId} className="flex items-center gap-4 p-4 border rounded-lg">
                                  <img 
                                    src={product.image} 
                                    alt={product.name}
                                    className="w-16 h-16 object-cover rounded-lg"
                                  />
                                  <div className="flex-1">
                                    <h3 className="font-semibold">{product.name}</h3>
                                    <p className="text-sm text-gray-500">R{product.price} each</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => removeFromCart(productId)}
                                    >
                                      <Minus className="w-4 h-4" />
                                    </Button>
                                    <span className="mx-3 font-semibold">{quantity}</span>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => addToCart(productId)}
                                    >
                                      <Plus className="w-4 h-4" />
                                    </Button>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-semibold">R{product.price * quantity}</p>
                                    <p className="text-sm text-yellow-600">🪙 {product.wellCoins * quantity} WellCoins</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span>R{getTotalPrice()}</span>
                        </div>
                        <div className="flex justify-between text-yellow-600">
                          <span>WellCoin Value</span>
                          <span>🪙 {getTotalWellCoins()}</span>
                        </div>
                        <div className="border-t pt-4">
                          <div className="flex justify-between font-semibold text-lg">
                            <span>Total</span>
                            <span>R{getTotalPrice()}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-3 pt-4">
                          <Button 
                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                            disabled={getTotalItems() === 0}
                          >
                            Pay with Cash (R{getTotalPrice()})
                          </Button>
                          <Button 
                            variant="outline"
                            className="w-full border-yellow-500 text-yellow-600 hover:bg-yellow-50"
                            disabled={getTotalItems() === 0 || wellCoins < getTotalWellCoins()}
                          >
                            Pay with WellCoins (🪙 {getTotalWellCoins()})
                          </Button>
                          <Button 
                            variant="outline"
                            className="w-full"
                            disabled={getTotalItems() === 0}
                          >
                            Mix Payment (Cash + WellCoins)
                          </Button>
                        </div>

                        {wellCoins < getTotalWellCoins() && getTotalItems() > 0 && (
                          <div className="p-3 bg-yellow-50 rounded-lg text-sm text-yellow-800">
                            You need {getTotalWellCoins() - wellCoins} more WellCoins for full payment. 
                            Participate in community activities to earn more!
                          </div>
                        )}
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
