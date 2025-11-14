import UnifiedNavigation from "@/components/navigation/UnifiedNavigation";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { twoBeWellProducts } from "@/data/twoBeWellProducts";
import { twoBeWellBundles } from "@/data/twoBeWellBundles";
import { twoBeWellTeam } from "@/data/2bewellTeam";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, Instagram, CheckCircle, Heart, Leaf, Sparkles, Star } from "lucide-react";
import heroImage from "@/assets/hero-products-collection.jpg";

const TwoBeWellShop = () => {
  return (
    <div className="min-h-screen bg-background">
      <UnifiedNavigation />
      
      <main className="pt-20">
        <div className="bg-muted/30 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />Back to Home
            </Link>
          </div>
        </div>

        <section className="py-20 bg-gradient-to-br from-green-50 via-yellow-50 to-purple-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                  <Leaf className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">100% Natural • Vegan • Handmade in SA</span>
                </div>
                
                <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent leading-tight">
                  Nature Bottled with Love
                </h1>
                
                <p className="text-lg text-muted-foreground leading-relaxed">
                  In a small kitchen in Cape Town, Zenith and Feroza transform nature's finest ingredients into 
                  wellness essentials. Every jar tells a story of conscious care and plant-based purity.
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <Badge className="px-4 py-2 bg-amber-100 text-amber-800">
                    <Star className="w-4 h-4 mr-2" />BWC Endorsed
                  </Badge>
                  <Badge className="px-4 py-2 bg-purple-100 text-purple-800">
                    <Sparkles className="w-4 h-4 mr-2" />Earn WellCoins
                  </Badge>
                </div>
                
                <div className="flex flex-col gap-2 text-sm text-muted-foreground pt-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>info.2bewell@gmail.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Instagram className="w-4 h-4" />
                    <span>@2bewell_natural</span>
                  </div>
                </div>
              </div>

              <div>
                <img src={heroImage} alt="2BeWell Products" className="w-full rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-500" />
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32">
            {twoBeWellProducts.map((product, index) => (
              <div key={product.id} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center`}>
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <img src={product.image} alt={product.name} className="w-full rounded-2xl shadow-xl" />
                </div>
                <div className={`space-y-6 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <Badge variant="outline">{product.category}</Badge>
                  <h2 className="text-4xl font-bold">{product.name}</h2>
                  <p className="text-xl text-muted-foreground italic">"{product.shortDescription}"</p>
                  
                  <div className="space-y-2">
                    {product.benefits.slice(0, 3).map((benefit, idx) => (
                      <div key={idx} className="flex gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-baseline gap-4 mb-6">
                      <span className="text-4xl font-bold">R{product.price}</span>
                      <span className="text-muted-foreground">or {product.wellCoins} WellCoins</span>
                    </div>
                    <div className="flex gap-3">
                      <Link to={`/2bewell/product/${product.id}`} className="flex-1">
                        <Button variant="outline" size="lg" className="w-full">View Details</Button>
                      </Link>
                      <div className="flex-1">
                        <AddToCartButton item={{ id: product.id, image: product.image, title: product.name, price_zar: product.price, price_wellcoins: product.wellCoins, item_type: "product" }} size="lg" className="w-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-16">Why Choose 2BeWell Natural?</h2>
            <div className="grid md:grid-cols-4 gap-8 mb-16">
              {[
                { icon: <Leaf className="w-12 h-12 text-green-600" />, title: "Plant-Based Purity", desc: "100% vegan, cruelty-free" },
                { icon: <Heart className="w-12 h-12 text-pink-600" />, title: "Handcrafted With Love", desc: "Small batch, made fresh" },
                { icon: <Star className="w-12 h-12 text-amber-600" />, title: "BWC Endorsed", desc: "Quality approved" },
                { icon: <Sparkles className="w-12 h-12 text-purple-600" />, title: "Conscious Choice", desc: "Supporting local wellness" }
              ].map((item, i) => (
                <Card key={i} className="p-6 border-0 bg-white/80">
                  <div className="flex justify-center mb-4">{item.icon}</div>
                  <h3 className="font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </Card>
              ))}
            </div>
            <p className="text-lg italic mb-4">"Every jar is made with intention and care"</p>
            <p className="font-semibold">- Zenith & Feroza, Founders</p>
          </div>
        </section>

        <section className="py-20 bg-background">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-16">Meet the Heart Behind 2BeWell</h2>
            <div className="grid md:grid-cols-2 gap-12">
              {twoBeWellTeam.map((member) => (
                <Card key={member.name} className="p-8 border-0 bg-gradient-to-br from-white to-purple-50">
                  <img src={member.image} alt={member.name} className="w-48 h-48 rounded-full mx-auto mb-6 border-4 shadow-xl" />
                  <h3 className="text-2xl font-bold mb-2">{member.name}</h3>
                  <p className="text-primary font-semibold mb-4">{member.role}</p>
                  <p className="italic mb-6">"{member.bio}"</p>
                  <div className="text-sm text-muted-foreground">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Mail className="w-4 h-4" />{member.email}
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Instagram className="w-4 h-4" />{member.instagram}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TwoBeWellShop;
