import UnifiedNavigation from "@/components/navigation/UnifiedNavigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, ArrowLeft, Leaf, Award, Clock, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { useState } from "react";
import { twoBeWellProducts, type TwoBeWellProduct } from "@/data/twoBeWellProducts";
import { twoBeWellBundles } from "@/data/twoBeWellBundles";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TwoBeWellShop = () => {
  const [selectedCategory, setSelectedCategory] = useState<TwoBeWellProduct['category'] | "all">("all");

  const filteredProducts = selectedCategory === "all" 
    ? twoBeWellProducts 
    : twoBeWellProducts.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <UnifiedNavigation />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button asChild variant="ghost" className="mb-4">
            <Link to="/2bewell"><ArrowLeft className="w-4 h-4 mr-2" />Back to 2BeWell</Link>
          </Button>
        </div>

        {/* Hero Section */}
        <section className="relative py-16 bg-gradient-to-br from-green-50 via-background to-purple-50 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-64 h-64 bg-secondary rounded-full blur-3xl"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
              <div className="text-center lg:text-left">
                <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-200">
                  <Leaf className="w-3 h-3 mr-1" />100% Natural • Vegan • Handmade in South Africa
                </Badge>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent">
                  Meet the 2BeWell Family
                </h1>
                <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                  Premium plant-based skincare, nutrition, and home essentials. Handcrafted with love by <strong>Zenith & Feroza</strong>.
                </p>
                <div className="flex items-center justify-center lg:justify-start gap-4 flex-wrap mb-6">
                  <Badge variant="secondary" className="px-4 py-2 text-sm">
                    <Award className="w-4 h-4 mr-2" />Beauty Without Cruelty Endorsed
                  </Badge>
                  <Badge variant="secondary" className="px-4 py-2 text-sm">
                    🪙 Earn WellCoins on Every Purchase
                  </Badge>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-4 text-sm text-muted-foreground">
                  <span>📧 info.2bewell@gmail.com</span>
                  <span>•</span>
                  <span>📱 @2bewell_natural</span>
                </div>
              </div>
              
              <div className="relative">
                <img 
                  src="/lovable-uploads/2bewell-hero-products.png" 
                  alt="2BeWell Natural Products Collection" 
                  className="rounded-2xl shadow-2xl w-full h-auto transform hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    console.error('Hero image failed to load:', e.currentTarget.src);
                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23f0f0f0" width="400" height="400"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3E2BeWell Products%3C/text%3E%3C/svg%3E';
                  }}
                />
                <div className="absolute -bottom-4 -right-4 bg-card rounded-xl shadow-lg p-4 hidden md:block">
                  <p className="text-sm font-semibold text-green-600">🌱 Small Batch, Big Love</p>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* Category Filter */}
        <section className="py-8 bg-card border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as any)} className="w-full">
              <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
                <TabsTrigger value="all">All Products</TabsTrigger>
                <TabsTrigger value="skincare">Skincare</TabsTrigger>
                <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
                <TabsTrigger value="homecare">Home Care</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </section>

        {/* Product Bundles Section */}
        <section className="py-16 bg-gradient-to-br from-purple-50 via-background to-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-purple-100 text-purple-800 hover:bg-purple-200">
                <Package className="w-3 h-3 mr-1" />
                Special Bundles
              </Badge>
              <h2 className="text-4xl font-bold mb-4">Save with Our Curated Bundles</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Carefully selected product combinations for your wellness journey
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {twoBeWellBundles.filter(b => b.featured).map((bundle) => (
                <Card key={bundle.id} className="overflow-hidden hover:shadow-2xl transition-shadow duration-300 border-2 border-purple-200">
                  <CardHeader className="bg-gradient-to-br from-purple-50 to-green-50">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-2xl mb-2">{bundle.name}</CardTitle>
                        <p className="text-muted-foreground">{bundle.description}</p>
                      </div>
                      <Badge className="bg-red-500 text-white hover:bg-red-600">
                        Save R{bundle.savings}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-6">
                    <div className="flex items-baseline gap-4 mb-6">
                      <span className="text-sm line-through text-muted-foreground">R{bundle.originalPrice}</span>
                      <span className="text-4xl font-bold text-green-600">R{bundle.bundlePrice}</span>
                      <span className="text-sm text-muted-foreground">or {bundle.wellCoins} WellCoins</span>
                    </div>

                    <div className="space-y-2 mb-6">
                      <p className="font-semibold text-sm">Includes:</p>
                      <ul className="space-y-1">
                        {bundle.products.map((productId) => {
                          const product = twoBeWellProducts.find(p => p.id === productId);
                          return product ? (
                            <li key={productId} className="text-sm flex items-center gap-2">
                              <Award className="w-4 h-4 text-green-600" />
                              {product.name}
                            </li>
                          ) : null;
                        })}
                      </ul>
                    </div>

                    <AddToCartButton
                      item={{
                        id: bundle.id,
                        title: bundle.name,
                        price_zar: bundle.bundlePrice,
                        price_wellcoins: bundle.wellCoins,
                        image: bundle.image,
                        item_type: "product" as const
                      }}
                      className="w-full h-12"
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Individual Products Section */}
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-12">Shop Individual Products</h2>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Link key={product.id} to={`/2bewell/product/${product.id}`}>
                  <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 h-full group">
                    <div className="aspect-square bg-muted relative overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          console.error('Product image failed to load:', product.id, e.currentTarget.src);
                          e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23f0f0f0" width="400" height="400"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3E' + encodeURIComponent(product.name) + '%3C/text%3E%3C/svg%3E';
                        }}
                      />
                      {product.bwcEndorsed && (
                        <Badge className="absolute top-3 left-3 bg-green-100 text-green-800 hover:bg-green-200">
                          <Award className="w-3 h-3 mr-1" />
                          BWC
                        </Badge>
                      )}
                      {product.featured && (
                        <Badge className="absolute top-3 right-3 bg-purple-100 text-purple-800 hover:bg-purple-200">
                          Featured
                        </Badge>
                      )}
                      <Badge className="absolute bottom-3 left-3 bg-card/90 backdrop-blur-sm text-xs">
                        <Leaf className="w-3 h-3 mr-1" />
                        Handmade in SA
                      </Badge>
                    </div>
                    
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{product.shortDescription}</p>
                    </CardHeader>
                    
                    <CardContent className="space-y-3">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold">R{product.price}</span>
                        <span className="text-xs text-muted-foreground">or {product.wellCoins} WC</span>
                      </div>
                      
                      {product.shelfLife && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {product.shelfLife}
                        </p>
                      )}
                    </CardContent>

                    <CardFooter className="pt-0" onClick={(e) => e.preventDefault()}>
                      <AddToCartButton
                        item={{
                          id: product.id,
                          title: product.name,
                          price_zar: product.price,
                          price_wellcoins: product.wellCoins,
                          image: product.image,
                          item_type: "product" as const
                        }}
                        className="w-full"
                      />
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-primary to-secondary text-primary-foreground">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-bold text-3xl sm:text-4xl mb-4">Join Our Wellness Community</h2>
            <p className="text-lg mb-8 opacity-90">Get exclusive access to new products, special offers, and wellness tips.</p>
            <Button asChild size="lg" variant="secondary" className="px-8 py-3 text-lg rounded-full">
              <Link to="/contact">
                <ShoppingCart className="mr-2 w-5 h-5" />
                Contact Us
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TwoBeWellShop;
