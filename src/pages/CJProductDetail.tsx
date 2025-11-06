import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import UnifiedNavigation from "@/components/navigation/UnifiedNavigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, ArrowLeft, Heart, Truck, Shield, RefreshCw, ExternalLink, TrendingUp } from "lucide-react";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { SmartProductImage } from "@/components/product/SmartProductImage";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PriceDisplay } from "@/components/ui/price-display";

const CJProductDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('affiliate_products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast({
        title: 'Error',
        description: 'Failed to load product details',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateCommission = (price: number, rate: number) => {
    return (price * rate).toFixed(2);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? 'Removed from favorites' : 'Added to favorites',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <UnifiedNavigation />
        <main className="pt-20 pb-16">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <RefreshCw className="w-12 h-12 animate-spin mx-auto text-primary mb-4" />
            <p>Loading product...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen">
        <UnifiedNavigation />
        <main className="pt-20 pb-16">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold mb-4">Product not found</h1>
            <Button asChild>
              <Link to="/cj-affiliate-products">Back to Shop</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <UnifiedNavigation />
      
      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Button variant="ghost" asChild className="mb-4">
              <Link to="/cj-affiliate-products">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Shop
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="space-y-4">
              <SmartProductImage
                src={product.image_url}
                alt={product.name}
                category={product.category}
                className="aspect-square rounded-lg"
              />
              
              {/* Affiliate Disclosure */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-2 text-sm text-blue-800">
                    <ExternalLink className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p>
                      This is a partner product. We earn a commission when you purchase, 
                      which helps support our platform at no extra cost to you.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <Badge variant="secondary" className="mb-2">{product.category}</Badge>
                <h1 className="font-heading font-bold text-3xl mb-4">{product.name}</h1>
                
                {/* Price */}
                <div className="mb-6">
                  <PriceDisplay 
                    price={product.price_zar} 
                    showBothCurrencies={true}
                    primaryCurrency="ZAR"
                    size="lg"
                  />
                </div>

                {/* Commission Earning Highlight */}
                <Card className="bg-green-50 border-green-200 mb-6">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 text-green-800">
                      <TrendingUp className="w-5 h-5" />
                      <div>
                        <p className="font-semibold">Earn R{calculateCommission(product.price_zar, product.commission_rate)} Commission</p>
                        <p className="text-sm">Help others discover this product and earn rewards!</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <p className="text-muted-foreground mb-6">{product.description}</p>

                {/* Stock Status */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-600">Available from partner</span>
                </div>

                {/* Add to Cart */}
                <div className="flex gap-4 mb-8">
                  <AddToCartButton
                    item={{
                      id: product.id,
                      title: product.name,
                      price_zar: product.price_zar,
                      price_usd: product.price_usd,
                      price_eur: product.price_eur,
                      image: product.image_url,
                      category: product.category,
                      item_type: 'affiliate',
                      affiliate_url: product.affiliate_url,
                      affiliate_program_id: product.affiliate_program_id,
                      commission_rate: product.commission_rate,
                    }}
                    className="flex-1"
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={toggleFavorite}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current text-red-500' : ''}`} />
                  </Button>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Truck className="w-4 h-4" />
                    <span>Free shipping on orders over R200</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Shield className="w-4 h-4" />
                    <span>Secure checkout guaranteed</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <RefreshCw className="w-4 h-4" />
                    <span>Partner's return policy applies</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="mt-16">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="benefits">Why Buy This?</TabsTrigger>
                <TabsTrigger value="partner">Partner Info</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Description:</h4>
                      <p className="text-muted-foreground">{product.description}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Category:</h4>
                      <Badge variant="outline">{product.category}</Badge>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Commission Rate:</h4>
                      <Badge variant="secondary">{(product.commission_rate * 100).toFixed(1)}%</Badge>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="benefits" className="mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Why Choose This Product?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-muted-foreground">Carefully curated from trusted wellness brands</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-muted-foreground">Support conscious commerce and ethical sourcing</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-muted-foreground">Earn rewards while shopping for wellness</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-muted-foreground">Secure transactions and reliable fulfillment</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="partner" className="mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Partner Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      This product is fulfilled by our trusted partner through the CJ Affiliate Network. 
                      When you purchase, you'll be directed to the partner's secure checkout.
                    </p>
                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">What happens next?</h4>
                      <ol className="space-y-2 text-sm text-muted-foreground">
                        <li>1. Add to cart and complete checkout</li>
                        <li>2. You'll receive order details and partner fulfillment link</li>
                        <li>3. Complete purchase with our trusted partner</li>
                        <li>4. Track your order and earn rewards</li>
                      </ol>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CJProductDetail;
