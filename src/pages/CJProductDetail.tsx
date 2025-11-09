import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import UnifiedNavigation from "@/components/navigation/UnifiedNavigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Star, ArrowLeft, Heart, Truck, Shield, RefreshCw, ExternalLink, TrendingUp, Eye, Package, Calendar } from "lucide-react";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PriceDisplay } from "@/components/ui/price-display";
import { ProductImageGallery } from "@/components/product/ProductImageGallery";
import { RecentlyViewedSection } from "@/components/product/RecentlyViewedSection";
import { RelatedProductsSection } from "@/components/product/RelatedProductsSection";
import { useViewTracker } from "@/hooks/useViewTracker";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import BreadcrumbNav from "@/components/ui/breadcrumb-nav";
import { formatDistanceToNow } from "date-fns";

const CJProductDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [quickViewId, setQuickViewId] = useState<string | null>(null);
  
  const { addToRecentlyViewed } = useRecentlyViewed();
  useViewTracker(id);

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
      
      // Add to recently viewed
      if (data) {
        addToRecentlyViewed({
          id: data.id,
          category: data.category
        });
      }
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

  const formatViewCount = (count: number) => {
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return count?.toString() || '0';
  };

  const isNewProduct = (createdAt: string) => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return new Date(createdAt) > sevenDaysAgo;
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

  const breadcrumbItems = product ? [
    { label: 'Home', href: '/' },
    { label: 'Wellness Products', href: '/cj-affiliate-products' },
    { label: product.category, href: `/cj-affiliate-products?category=${encodeURIComponent(product.category)}` },
    { label: product.name, current: true }
  ] : [];

  return (
    <div className="min-h-screen">
      <UnifiedNavigation />
      
      <main className="pt-20 pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <BreadcrumbNav items={breadcrumbItems} className="mb-8 glass-card" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Product Image */}
            <div className="space-y-4">
              <ProductImageGallery
                imageUrl={product.image_url}
                productName={product.name}
                category={product.category}
              />
              
              {/* Affiliate Disclosure */}
              <Card className="glass-card border-primary/20">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <ExternalLink className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
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
                {/* Advertiser Info */}
                {product.advertiser_name && (
                  <div className="flex items-center gap-3 mb-4">
                    {product.brand_logo_url && (
                      <img src={product.brand_logo_url} alt={product.advertiser_name} className="h-8 object-contain" />
                    )}
                    <span className="text-sm text-muted-foreground">by {product.advertiser_name}</span>
                  </div>
                )}
                
                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="secondary">{product.category}</Badge>
                  {product.is_featured && <Badge className="badge-modern bg-gradient-to-r from-omni-violet to-omni-orange">Featured</Badge>}
                  {product.is_trending && <Badge className="badge-modern bg-gradient-to-r from-orange-500 to-red-500">🔥 Trending</Badge>}
                  {isNewProduct(product.created_at) && <Badge className="badge-modern bg-gradient-to-r from-green-500 to-emerald-500">New</Badge>}
                </div>
                
                <h1 className="font-heading font-bold text-3xl mb-4 text-foreground">{product.name}</h1>
                
                {/* View Count */}
                <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                  <Eye className="w-4 h-4" />
                  <span>{formatViewCount(product.view_count || 0)} people viewed this</span>
                </div>
                
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
                <Card className="glass-card border-primary/20 mb-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-green-500/20">
                        <TrendingUp className="w-5 h-5 text-green-700" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Earn R{calculateCommission(product.price_zar, product.commission_rate)} Commission</p>
                        <p className="text-sm text-muted-foreground">Help others discover this product and earn rewards!</p>
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
          <div className="mb-0">
            <Tabs defaultValue="specifications" className="w-full">
              <TabsList className="glass-card w-full justify-start overflow-x-auto">
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="benefits">Why Buy This?</TabsTrigger>
                <TabsTrigger value="shipping">Shipping</TabsTrigger>
                <TabsTrigger value="faq">FAQ</TabsTrigger>
              </TabsList>
              
              <TabsContent value="specifications" className="mt-8">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="w-5 h-5 text-primary" />
                      Product Specifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-0">
                      <div className="spec-row">
                        <span className="spec-label">Product ID</span>
                        <span className="spec-value">{product.external_product_id || product.id}</span>
                      </div>
                      <div className="spec-row">
                        <span className="spec-label">Category</span>
                        <Badge variant="outline">{product.category}</Badge>
                      </div>
                      <div className="spec-row">
                        <span className="spec-label">Commission Rate</span>
                        <Badge className="badge-modern">{(product.commission_rate * 100).toFixed(1)}%</Badge>
                      </div>
                      <div className="spec-row">
                        <span className="spec-label">Advertiser</span>
                        <span className="spec-value">{product.advertiser_name || 'N/A'}</span>
                      </div>
                      <div className="spec-row">
                        <span className="spec-label">Last Updated</span>
                        <span className="spec-value">
                          {product.last_synced_at ? formatDistanceToNow(new Date(product.last_synced_at), { addSuffix: true }) : 'Recently'}
                        </span>
                      </div>
                      <div className="spec-row">
                        <span className="spec-label">Total Views</span>
                        <span className="spec-value">{formatViewCount(product.view_count || 0)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="description" className="mt-8">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Product Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{product.description}</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="benefits" className="mt-8">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Why Choose This Product?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-muted-foreground leading-relaxed">Carefully curated from trusted wellness brands</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-muted-foreground leading-relaxed">Support conscious commerce and ethical sourcing</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-muted-foreground leading-relaxed">Earn rewards while shopping for wellness</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-muted-foreground leading-relaxed">Secure transactions and reliable fulfillment</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="shipping" className="mt-8">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="w-5 h-5 text-primary" />
                      Shipping Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-muted-foreground">
                      <p>• Free shipping on orders over R200</p>
                      <p>• Delivered by our trusted partner</p>
                      <p>• Estimated delivery: 3-5 business days</p>
                      <p>• Track your order after purchase</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="faq" className="mt-8">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Frequently Asked Questions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="return">
                        <AccordionTrigger className="text-left">What's the return policy?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          Returns are handled by our partner. Please refer to the partner's website for their specific return policy.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="commission">
                        <AccordionTrigger className="text-left">How does commission work?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          When you share this product and someone makes a purchase, you earn a commission. It's our way of rewarding you for spreading wellness!
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="secure">
                        <AccordionTrigger className="text-left">Is my purchase secure?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          Yes! All transactions are processed through our trusted partners using industry-standard security protocols.
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        {/* Related Products */}
        {product && (
          <RelatedProductsSection
            category={product.category}
            currentProductId={product.id}
            onQuickView={setQuickViewId}
          />
        )}
        
        {/* Recently Viewed */}
        {product && (
          <RecentlyViewedSection
            currentProductId={product.id}
            onQuickView={setQuickViewId}
          />
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default CJProductDetail;
