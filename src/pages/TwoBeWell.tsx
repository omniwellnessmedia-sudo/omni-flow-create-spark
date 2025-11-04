
import UnifiedNavigation from "@/components/navigation/UnifiedNavigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowRight, Leaf, Heart, Users, Sparkles, Coins, ShoppingCart } from "lucide-react";
import { IMAGES } from "@/lib/images";

const TwoBeWell = () => {
  const products = [
    {
      name: "2BeKissed - Natural Lip Balm",
      price: "R85",
      wellCoins: "42",
      image: IMAGES.twoBeWell.lipBalm,
      description: "Mint-infused natural lip balm with Shea Butter, Coconut Oil, and Vitamin E for lasting moisture and protection.",
      ingredients: "Shea Butter, Coconut Oil, Candelilla Wax, Essential Oil, Vitamin E"
    },
    {
      name: "2BeGlow - Radiance Face Serum",
      price: "R165",
      wellCoins: "82",
      image: IMAGES.twoBeWell.faceSerum,
      description: "Glow & Calm face serum with Macadamia Nut Oil and Essential Oil Blend for radiant, healthy-looking skin.",
      ingredients: "Macadamia Nut Oil + Essential Oil Blend"
    },
    {
      name: "2BeSmooth - Whipped Body Butter",
      price: "R125",
      wellCoins: "62",
      image: IMAGES.twoBeWell.bodyButter,
      description: "Luxuriously whipped body butter with Shea Butter, Cocoa Butter, and nourishing oils for silky-smooth skin.",
      ingredients: "Shea Butter, Cocoa Butter, Coconut Oil, Sweet Almond Oil, Arrowroot Powder, Vitamin E"
    },
    {
      name: "2BeFresh - All-Purpose Cleaner",
      price: "R95",
      wellCoins: "47",
      image: IMAGES.twoBeWell.cleaner,
      description: "Natural all-purpose cleaning spray with plant-based ingredients for a chemical-free, eco-friendly home.",
      ingredients: "Shea Butter, Coconut Oil, Candelilla Wax, Essential Oil, Vitamin E"
    }
  ];

  const values = [
    {
      icon: <Leaf className="w-8 h-8 text-green-600" />,
      title: "100% Natural & Vegan",
      description: "Clean, plant-based ingredients that nourish without compromise. Always cruelty-free."
    },
    {
      icon: <Heart className="w-8 h-8 text-pink-600" />,
      title: "Handcrafted with Love",
      description: "Every product is carefully made in small batches to ensure quality and freshness."
    },
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      title: "Community-Powered",
      description: "Join our WellCoin ecosystem and be part of a sustainable wellness community."
    },
    {
      icon: <Sparkles className="w-8 h-8 text-purple-600" />,
      title: "Conscious Living",
      description: "Supporting mindful choices that benefit you, your community, and the planet."
    }
  ];

  return (
    <div className="min-h-screen">
      <UnifiedNavigation />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-green-50 via-white to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-in-up">
                <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-200">
                  🌿 Women-Led • Eco-Conscious • South African
                </Badge>
                <h1 className="text-5xl md:text-6xl font-bold text-center mb-6 bg-gradient-to-r from-black via-purple-600 to-orange-500 bg-clip-text text-transparent">
                  The Natural Touch of 2BeWell
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed">
                  Discover skincare that works in harmony with your body. Made with clean ingredients 
                  and gentle intention - because glowing skin should come naturally.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    asChild 
                    size="lg"
                    className="bg-gradient-rainbow hover:opacity-90 text-white px-8 py-3 text-lg rounded-full shadow-lg"
                  >
                    <Link to="/2bewell-shop" className="inline-flex items-center">
                      <ShoppingCart className="mr-2 w-5 h-5" />
                      Shop with WellCoins
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-2 border-green-500 text-green-700 hover:bg-green-50 px-8 py-3 text-lg rounded-full"
                  >
                    <Coins className="mr-2 w-5 h-5" />
                    Learn About WellCoins
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                <img
                  src={IMAGES.sandy.portrait1}
                  alt="2BeWell Product Collection"
                  className="instagram-post-img rounded-2xl shadow-lg"
                />
                <img
                  src={IMAGES.sandy.portrait2}
                  alt="Natural Beauty Products"
                  className="instagram-post-img rounded-2xl shadow-lg"
                />
                <img
                  src={IMAGES.sandy.action1}
                  alt="Handcrafted Skincare"
                  className="instagram-post-img rounded-2xl shadow-lg"
                />
                <img
                  src={IMAGES.sandy.action2}
                  alt="Natural Face Serum"
                  className="instagram-post-img rounded-2xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-bold text-center mb-6 bg-gradient-to-r from-black via-purple-600 to-orange-500 bg-clip-text text-transparent">
                Our Natural Collection
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Each product is lovingly handcrafted by Zenith and Feroza using only the finest natural ingredients. 
                Shop with traditional currency or earn WellCoins through community participation.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product, index) => (
                <Card 
                  key={product.name}
                  className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up border-0 shadow-lg group overflow-hidden"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="instagram-post-img group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                      <span className="text-sm font-semibold text-green-600">🪙 {product.wellCoins} WellCoins</span>
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="font-heading text-lg">{product.name}</CardTitle>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-green-600">{product.price}</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        100% Natural
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                    <p className="text-xs text-gray-500 mb-4">
                      <strong>Ingredients:</strong> {product.ingredients}
                    </p>
                    <Button 
                      asChild 
                      className="w-full bg-green-600 hover:bg-green-700 text-white rounded-full"
                    >
                      <Link to="/2bewell-shop">Add to Cart</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-bold text-center mb-6 bg-gradient-to-r from-black via-purple-600 to-orange-500 bg-clip-text text-transparent">
                Why Choose 2BeWell?
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                More than skincare - we're building a conscious community rooted in wellness, sustainability, and shared values.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card 
                  key={value.title}
                  className="text-center hover:shadow-lg transition-all duration-300 animate-fade-in-up border-0 shadow-md"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader>
                    <div className="mx-auto mb-4 p-3 bg-white rounded-full shadow-md">
                      {value.icon}
                    </div>
                    <CardTitle className="font-heading text-xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-in-up">
                <h2 className="text-5xl md:text-6xl font-bold text-center mb-6 bg-gradient-to-r from-black via-purple-600 to-orange-500 bg-clip-text text-transparent">
                  Rooted in Purpose
                </h2>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  At 2BeWell, we believe wellness should be natural, intentional, and accessible. 
                  What began as a passion for clean, plant-based living has grown into a handcrafted 
                  range of products that nurture the skin, home, and heart.
                </p>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  Founded by Zenith and Feroza, we are proudly rooted in South Africa, and each 
                  product is made in small batches using carefully selected natural ingredients. 
                  From our calming face serums to our powerful all-purpose cleaners, everything 
                  we create is free from harmful chemicals, cruelty-free, and 100% vegan.
                </p>
                <div className="bg-green-50 p-6 rounded-2xl">
                  <h3 className="font-heading font-semibold text-xl mb-3 text-green-800">Our Mission</h3>
                  <p className="text-green-700">
                    To inspire conscious living through honest ingredients and earth-friendly 
                    packaging — all while supporting local sourcing, sustainable practices, 
                    and community empowerment through our innovative WellCoin ecosystem.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                <img
                  src={IMAGES.sandy.portrait3}
                  alt="Handcrafted with Love"
                  className="instagram-post-img rounded-2xl shadow-lg"
                />
                <img
                  src={IMAGES.sandy.closeup}
                  alt="Natural Ingredients"
                  className="instagram-post-img rounded-2xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-green-600 to-blue-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-6">
              Ready to Glow Naturally?
            </h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Join our wellness community and discover handmade skincare and home care essentials - 
              crafted for you, and kind to the planet. Earn WellCoins while you shop!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild 
                size="lg"
                className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 text-lg rounded-full shadow-lg"
              >
                <Link to="/2bewell-shop">
                  <ShoppingCart className="mr-2 w-5 h-5" />
                  Start Shopping
                </Link>
              </Button>
              <Button 
                asChild
                variant="outline" 
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-3 text-lg rounded-full"
              >
                <Link to="/contact">
                  Join Our Community
                  <ArrowRight className="ml-2 w-5 h-5" />
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

export default TwoBeWell;
