import { useParams, Link } from "react-router-dom";
import UnifiedNavigation from "@/components/navigation/UnifiedNavigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Leaf, Award, AlertCircle, CheckCircle, User } from "lucide-react";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { twoBeWellProducts } from "@/data/twoBeWellProducts";
import { twoBeWellTeam } from "@/data/2bewellTeam";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { handleImageError } from "@/lib/imageHelpers";

const TwoBeWellProductDetail = () => {
  const { productId } = useParams();
  const product = twoBeWellProducts.find(p => p.id === productId);

  if (!product) {
    return (
      <div className="min-h-screen">
        <UnifiedNavigation />
        <div className="pt-24 pb-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
          <Button asChild>
            <Link to="/2bewell-shop">Return to Shop</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <UnifiedNavigation />
      
      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button asChild variant="ghost" className="mb-6">
            <Link to="/2bewell-shop">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Shop
            </Link>
          </Button>

          <div className="grid lg:grid-cols-2 gap-12 mb-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-muted to-muted/50 shadow-xl">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover p-8 hover:scale-110 transition-transform duration-500"
                  onError={handleImageError}
                />
              </div>
              {product.labelImage && (
                <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-muted to-muted/50 shadow-lg">
                  <img
                    src={product.labelImage}
                    alt={`${product.name} - Label Details`}
                    className="w-full h-full object-cover p-8"
                    onError={handleImageError}
                  />
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  {product.bwcEndorsed && (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                      <Award className="w-3 h-3 mr-1" />
                      BWC Endorsed
                    </Badge>
                  )}
                  <Badge variant="secondary">
                    <Leaf className="w-3 h-3 mr-1" />
                    100% Vegan
                  </Badge>
                  <Badge variant="secondary">Handmade in SA</Badge>
                </div>

                <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
                <p className="text-xl text-muted-foreground mb-6">
                  {product.shortDescription}
                </p>

                <div className="flex items-baseline gap-4 mb-6">
                  <span className="text-4xl font-bold">R{product.price}</span>
                  <span className="text-xl text-muted-foreground">or {product.wellCoins} WellCoins</span>
                </div>

                {product.size && (
                  <p className="text-sm text-muted-foreground mb-2">Size: {product.size}</p>
                )}
                {product.shelfLife && (
                  <p className="text-sm text-muted-foreground mb-4">Shelf Life: {product.shelfLife}</p>
                )}

                {product.teamCreator && (
                  <div className="flex items-center gap-3 mb-6 p-3 bg-muted/50 rounded-lg">
                    <User className="w-5 h-5 text-primary" />
                    <span className="text-sm">
                      Handcrafted by <strong className="text-primary">
                        {product.teamCreator === 'both' ? 'Zenith & Feroza' : 
                         product.teamCreator.charAt(0).toUpperCase() + product.teamCreator.slice(1)}
                      </strong>
                    </span>
                  </div>
                )}

                <AddToCartButton
                  item={{
                    id: product.id,
                    title: product.name,
                    price_zar: product.price,
                    price_wellcoins: product.wellCoins,
                    image: product.image,
                    item_type: "product" as const
                  }}
                  className="w-full h-14 text-lg"
                />
              </div>

              {/* Certifications */}
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Certifications
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.certifications.map((cert, idx) => (
                      <Badge key={idx} variant="outline">{cert}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Cautions */}
              {product.cautions && product.cautions.length > 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong className="block mb-2">Important Information:</strong>
                    <ul className="list-disc list-inside space-y-1">
                      {product.cautions.map((caution, idx) => (
                        <li key={idx} className="text-sm">{caution}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          {/* Detailed Information Tabs */}
          <Tabs defaultValue="description" className="mb-12">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
              <TabsTrigger value="usage">How to Use</TabsTrigger>
              {product.nutritionalInfo && (
                <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <p className="text-lg leading-relaxed">{product.fullDescription}</p>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Key Benefits:</h3>
                    <ul className="space-y-2">
                      {product.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ingredients" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-3">Full Ingredient List:</h3>
                  <p className="text-base leading-relaxed">{product.ingredients}</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="usage" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-3">Usage Instructions:</h3>
                  <p className="text-base leading-relaxed whitespace-pre-line">{product.usage}</p>
                </CardContent>
              </Card>
            </TabsContent>

            {product.nutritionalInfo && (
              <TabsContent value="nutrition" className="mt-6">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold text-lg mb-4">Nutritional Information</h3>
                    
                    {product.nutritionalInfo.servingSize && (
                      <p className="mb-4 text-sm text-muted-foreground">
                        Serving Size: {product.nutritionalInfo.servingSize}
                      </p>
                    )}

                    {product.nutritionalInfo.per100g && (
                      <div>
                        <h4 className="font-semibold mb-3">Per 100g:</h4>
                        <div className="space-y-2">
                          {product.nutritionalInfo.per100g.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center py-2 border-b">
                              <span>{item.nutrient}</span>
                              <div className="text-right">
                                <span className="font-medium">{item.amount}</span>
                                {item.rda && (
                                  <span className="text-sm text-muted-foreground ml-2">({item.rda} RDA)</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {product.nutritionalInfo.perServing && (
                      <div className="mt-6">
                        <h4 className="font-semibold mb-3">Per Serving:</h4>
                        <div className="space-y-2">
                          {product.nutritionalInfo.perServing.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center py-2 border-b">
                              <span>{item.nutrient}</span>
                              <div className="text-right">
                                <span className="font-medium">{item.amount}</span>
                                {item.rda && (
                                  <span className="text-sm text-muted-foreground ml-2">({item.rda} RDA)</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>

          {/* Made by Section */}
          <Card className="bg-gradient-to-br from-green-50 to-purple-50">
            <CardContent className="pt-6 text-center">
              <h3 className="text-2xl font-bold mb-2">Handcrafted with Love</h3>
              <p className="text-muted-foreground mb-4">
                Every 2BeWell product is carefully handmade by <strong>Zenith & Feroza</strong> in South Africa
              </p>
              <div className="flex items-center justify-center gap-4 text-sm">
                <span>📧 info.2bewell@gmail.com</span>
                <span>•</span>
                <span>📱 @2bewell_natural</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TwoBeWellProductDetail;
