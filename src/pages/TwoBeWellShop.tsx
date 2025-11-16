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
import { ImpactBadges } from "@/components/social-impact/ImpactBadges";
import { ImpactBadges } from "@/components/social-impact/ImpactBadges";
// Images from Supabase Storage
const productsHero = "https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/product-images**%20(2BeWell)/3.jpg";
const ferozaPortrait = "https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/feroza%20begg%20-%20portrait.jpg";
const zenithPortrait = "https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/Zenith_TNT_OMNI-9.jpg";

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

        <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,191,36,0.1),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(34,197,94,0.1),transparent_50%)]" />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8 animate-fade-in-up">
                <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-5 py-2.5 rounded-full shadow-lg border border-amber-200">
                  <Leaf className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-semibold text-foreground">100% Natural • Vegan • Handmade in SA</span>
                </div>
                
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1]">
                  <span className="bg-gradient-to-r from-amber-600 via-green-600 to-emerald-600 bg-clip-text text-transparent">
                    Nature Bottled
                  </span>
                  <br />
                  <span className="text-foreground">with Love</span>
                </h1>
                
                <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
                  From a small kitchen in Cape Town, Zenith and Feroza transform nature's finest ingredients into 
                  wellness essentials. Every jar tells a story of conscious care and plant-based purity.
                </p>
                
                <div className="flex flex-wrap gap-3">
                  <Badge variant="secondary" className="px-5 py-2.5 text-base bg-amber-100 text-amber-900 border-amber-200 hover:bg-amber-200">
                    <Star className="w-5 h-5 mr-2 fill-amber-600 text-amber-600" />
                    BWC Endorsed
                  </Badge>
                  <Badge variant="secondary" className="px-5 py-2.5 text-base bg-purple-100 text-purple-900 border-purple-200 hover:bg-purple-200">
                    <Sparkles className="w-5 h-5 mr-2 fill-purple-600 text-purple-600" />
                    Earn WellCoins
                  </Badge>
                  <Badge variant="secondary" className="px-5 py-2.5 text-base bg-green-100 text-green-900 border-green-200 hover:bg-green-200">
                    <Heart className="w-5 h-5 mr-2 fill-green-600 text-green-600" />
                    Cruelty Free
                  </Badge>
                </div>

                <div className="flex items-center gap-6 pt-4">
                  <div className="flex -space-x-4">
                    <img src={zenithPortrait} alt="Zenith" className="w-14 h-14 rounded-full border-4 border-white shadow-lg object-cover" />
                    <img src={ferozaPortrait} alt="Feroza" className="w-14 h-14 rounded-full border-4 border-white shadow-lg object-cover" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-foreground">Crafted by Zenith & Feroza</span>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <a href="mailto:info.2bewell@gmail.com" className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                        <Mail className="w-4 h-4" />
                        info.2bewell@gmail.com
                      </a>
                      <span className="text-border">•</span>
                      <a href="https://instagram.com/2bewell_natural" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                        <Instagram className="w-4 h-4" />
                        @2bewell_natural
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-green-400/20 rounded-3xl blur-3xl transform scale-110" />
                <img 
                  src={productsHero} 
                  alt="2BeWell Natural Products Collection" 
                  className="relative w-full rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02]" 
                />
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
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-16">Meet the Heart Behind 2BeWell</h2>
            <div className="grid md:grid-cols-2 gap-16">
              {twoBeWellTeam.map((member) => (
                <Card key={member.name} className="p-8 border-0 bg-gradient-to-br from-white to-purple-50 overflow-hidden">
                  <div className="flex flex-col items-center">
                    <div className="w-56 h-72 mb-6 rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                      <img 
                        src={member.image} 
                        alt={member.name} 
                        className="w-full h-full object-cover object-center" 
                      />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{member.name}</h3>
                    <p className="text-primary font-semibold mb-4">{member.role}</p>
                    <p className="italic mb-6 text-muted-foreground">"{member.bio}"</p>
                    <div className="text-sm text-muted-foreground space-y-2">
                      <div className="flex items-center justify-center gap-2">
                        <Mail className="w-4 h-4" />{member.email}
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <Instagram className="w-4 h-4" />{member.instagram}
                      </div>
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
