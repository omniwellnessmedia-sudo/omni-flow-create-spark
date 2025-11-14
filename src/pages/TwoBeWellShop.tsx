import UnifiedNavigation from "@/components/navigation/UnifiedNavigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, ArrowLeft, Heart, Leaf, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { useState } from "react";
import { twoBeWellProducts, type TwoBeWellProduct } from "@/data/twoBeWellProducts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TwoBeWellShop = () => {
  const [selectedCategory, setSelectedCategory] = useState<TwoBeWellProduct['category'] | "all">("all");

  const filteredProducts = selectedCategory === "all" 
    ? twoBeWellProducts 
    : twoBeWellProducts.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen">
      <UnifiedNavigation />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button asChild variant="ghost" className="mb-4">
            <Link to="/2bewell"><ArrowLeft className="w-4 h-4 mr-2" />Back to 2BeWell</Link>
          </Button>
        </div>

        <section className="py-12 bg-gradient-to-br from-green-50 via-white to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-200">
                <Leaf className="w-3 h-3 mr-1" />100% Natural • Vegan • Handmade in South Africa
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-black via-purple-600 to-orange-500 bg-clip-text text-transparent">
                2BeWell Natural Shop
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
                Premium plant-based skincare, nutrition, and home essentials. Handcrafted with love by Zenith & Feroza.
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Badge variant="secondary" className="px-4 py-2"><Award className="w-4 h-4 mr-2" />BWC Endorsed</Badge>
                <Badge variant="secondary" className="px-4 py-2">🪙 Earn WellCoins on Every Purchase</Badge>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8 bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as any)} className="w-full">
              <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4">
                <TabsTrigger value="all">All Products</TabsTrigger>
                <TabsTrigger value="skincare">Skincare</TabsTrigger>
                <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
                <TabsTrigger value="homecare">Home Care</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product, index) => (
                <Card key={product.id} className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up border-0 shadow-lg group overflow-hidden" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="relative">
                    <img src={product.image} alt={product.name} className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                      <span className="text-sm font-semibold text-green-600">🪙 {product.wellCoins} WellCoins</span>
                    </div>
                    <Button variant="ghost" size="icon" className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white">
                      <Heart className="w-5 h-5 text-gray-600" />
                    </Button>
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      {product.certifications.slice(0, 2).map((cert) => (
                        <Badge key={cert} variant="secondary" className="text-xs">
                          {cert.includes("Vegan") && "🌱"}{cert.includes("Cruelty") && "🐰"}{cert.includes("Organic") && "🌿"}{cert.split(" ")[0]}
                        </Badge>
                      ))}
                    </div>
                    <CardTitle className="font-heading text-lg">{product.name}</CardTitle>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-2xl font-bold text-green-600">R{product.price}</span>
                      <Badge className="bg-purple-100 text-purple-800 capitalize">{product.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-3">{product.shortDescription}</p>
                    <div className="mb-4"><p className="text-xs text-gray-500"><strong>Size:</strong> {product.size}</p></div>
                    <AddToCartButton item={{ id: product.id, image: product.image, title: product.name, price_zar: product.price, price_wellcoins: product.wellCoins, item_type: "product" as const }} className="w-full bg-green-600 hover:bg-green-700 text-white rounded-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-br from-green-600 to-blue-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-4">Join Our Wellness Community</h2>
            <p className="text-lg mb-8 opacity-90">Get exclusive access to new products, special offers, and wellness tips.</p>
            <Button asChild size="lg" className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 text-lg rounded-full">
              <Link to="/contact"><ShoppingCart className="mr-2 w-5 h-5" />Contact Us</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TwoBeWellShop;
