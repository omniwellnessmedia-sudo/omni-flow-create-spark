import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import UnifiedNavigation from "@/components/navigation/UnifiedNavigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { BWCBadge } from "@/components/twobewell/BWCBadge";
import { PriceDisplay } from "@/components/ui/price-display";
import { ArrowLeft, Heart, Share2, Info, Package } from "lucide-react";
import { getProductById, twoBeWellProducts } from "@/data/twoBeWellProducts";
import { useToast } from "@/hooks/use-toast";

const TwoBeWellProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const product = getProductById(productId || "");
  const [selectedImage, setSelectedImage] = useState<"product" | "label">("product");
  const { toast } = useToast();

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <Button asChild>
            <Link to="/two-be-well-shop">Back to Shop</Link>
          </Button>
        </div>
      </div>
    );
  }

  const relatedProducts = twoBeWellProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.shortDescription,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Product link copied to clipboard"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <UnifiedNavigation />
      <main className="pt-20 pb-16">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/two-be-well-shop" className="hover:text-foreground">Shop</Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>
          <Button asChild variant="ghost" className="mt-2">
            <Link to="/two-be-well-shop">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Shop
            </Link>
          </Button>
        </div>

        {/* Product Detail */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Images */}
            <div className="space-y-4">
              <div className="aspect-square rounded-xl overflow-hidden bg-muted">
                <img
                  src={selectedImage === "product" ? product.image : (product.labelImage || product.image)}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {product.labelImage && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedImage("product")}
                    className={`flex-1 aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === "product" ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <img src={product.image} alt="Product" className="w-full h-full object-cover" />
                  </button>
                  <button
                    onClick={() => setSelectedImage("label")}
                    className={`flex-1 aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === "label" ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <img src={product.labelImage} alt="Product Label" className="w-full h-full object-cover" />
                  </button>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
                <p className="text-lg text-muted-foreground mb-4">{product.shortDescription}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {product.bwcEndorsed && <BWCBadge />}
                  <Badge variant="secondary">🇿🇦 Handmade in SA</Badge>
                  <Badge variant="secondary">🌱 100% Vegan</Badge>
                  <Badge variant="secondary">
                    <Package className="w-3 h-3 mr-1" />
                    {product.size}
                  </Badge>
                </div>

                <div className="mb-6">
                  <PriceDisplay 
                    price={product.price} 
                    showBothCurrencies={true}
                    primaryCurrency="ZAR"
                    size="lg"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Earn {product.wellCoins} WellCoins with this purchase
                  </p>
                </div>

                <div className="flex gap-3">
                  <AddToCartButton
                    item={{
                      id: product.id,
                      title: product.name,
                      price_zar: product.price,
                      price_usd: product.price / 18,
                      price_wellcoins: product.wellCoins,
                      image: product.image,
                      category: product.category
                    }}
                    className="flex-1"
                    size="lg"
                  />
                  <Button variant="outline" size="lg">
                    <Heart className="w-5 h-5" />
                  </Button>
                  <Button variant="outline" size="lg" onClick={handleShare}>
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Certifications */}
              <Card className="p-4 bg-muted/50">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Certifications & Standards
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.certifications.map((cert) => (
                    <Badge key={cert} variant="outline">{cert}</Badge>
                  ))}
                </div>
                {product.shelfLife && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Shelf Life: {product.shelfLife}
                  </p>
                )}
              </Card>
            </div>
          </div>

          {/* Detailed Information Tabs */}
          <div className="mt-16">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
                <TabsTrigger value="usage">Usage & Benefits</TabsTrigger>
                <TabsTrigger value="cautions">Cautions</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-6">
                <Card className="p-6">
                  <h3 className="text-2xl font-bold mb-4">About {product.name}</h3>
                  <p className="text-muted-foreground leading-relaxed">{product.fullDescription}</p>
                  
                  {product.nutritionalInfo && (
                    <div className="mt-6">
                      <h4 className="font-semibold mb-3">Nutritional Information</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Serving Size: {product.nutritionalInfo.servingSize}
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {product.nutritionalInfo.per100g?.map((item) => (
                          <div key={item.nutrient} className="flex justify-between border-b py-2">
                            <span className="text-sm">{item.nutrient}</span>
                            <span className="text-sm font-medium">{item.amount}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              </TabsContent>

              <TabsContent value="ingredients" className="mt-6">
                <Card className="p-6">
                  <h3 className="text-2xl font-bold mb-4">Full Ingredient List</h3>
                  <p className="text-muted-foreground leading-relaxed">{product.ingredients}</p>
                  {product.labelImage && (
                    <div className="mt-6">
                      <p className="text-sm text-muted-foreground mb-2">View product label for complete details:</p>
                      <img 
                        src={product.labelImage} 
                        alt="Product Label" 
                        className="rounded-lg border max-w-md cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => window.open(product.labelImage, '_blank')}
                      />
                    </div>
                  )}
                </Card>
              </TabsContent>

              <TabsContent value="usage" className="mt-6">
                <Card className="p-6">
                  <h3 className="text-2xl font-bold mb-4">How to Use</h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">{product.usage}</p>
                  
                  <h4 className="font-semibold mb-3">Key Benefits</h4>
                  <ul className="space-y-2">
                    {product.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">✓</span>
                        <span className="text-muted-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </TabsContent>

              <TabsContent value="cautions" className="mt-6">
                <Card className="p-6 bg-orange-50 border-orange-200">
                  <h3 className="text-2xl font-bold mb-4 text-orange-900">Important Cautions</h3>
                  {product.cautions && product.cautions.length > 0 ? (
                    <ul className="space-y-2">
                      {product.cautions.map((caution, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-orange-600 mt-1">⚠️</span>
                          <span className="text-orange-900">{caution}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-orange-900">No specific cautions. Use as directed.</p>
                  )}
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-3xl font-bold mb-8">You Might Also Like</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <Link 
                    key={relatedProduct.id} 
                    to={`/two-be-well-shop/product/${relatedProduct.id}`}
                    className="group"
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={relatedProduct.image}
                          alt={relatedProduct.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                          {relatedProduct.name}
                        </h3>
                        <PriceDisplay 
                          price={relatedProduct.price} 
                          showBothCurrencies={false}
                          size="sm"
                        />
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TwoBeWellProductDetail;
