import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ExternalLink, Heart, Share2, Tag, Star, Check, Truck, Shield, MapPin, Copy } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { ProductImageGallery } from '@/components/product/ProductImageGallery';
import { CommissionCard } from '@/components/product/CommissionCard';
import { TakealotProductCard } from '@/components/product/TakealotProductCard';
import { ReviewSystem } from '@/components/product/ReviewSystem';
import { RecentlyViewedSection } from '@/components/product/RecentlyViewedSection';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { useViewTracker } from '@/hooks/useViewTracker';
import { useUserRole } from '@/hooks/useUserRole';
import curatedSeed from '@/data/curated_wellness_seed.json';
import cjSeed from '@/data/cjSeedProducts.json';

interface Product {
  id: string;
  name: string;
  description: string;
  long_description?: string;
  category: string;
  brand?: string;
  advertiser_name?: string;
  image_url: string;
  additional_images?: string[];
  affiliate_url: string;
  price_usd: number;
  price_zar: number;
  price_eur: number;
  sale_price_zar?: number | null;
  commission_rate: number;
  rating?: number;
  review_count?: number;
  product_highlights?: string[];
  product_details?: Record<string, string>;
  delivery_info?: string;
  stock_status?: string;
  is_featured?: boolean;
  is_trending?: boolean;
  created_at?: string;
  last_synced_at?: string;
}

// Star Rating Component
const StarRating = ({ rating, reviewCount }: { rating?: number; reviewCount?: number }) => {
  if (!rating) return null;
  
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating 
                ? 'fill-amber-400 text-amber-400' 
                : 'fill-muted text-muted-foreground'
            }`}
          />
        ))}
      </div>
      <span className="text-sm text-muted-foreground">
        {rating.toFixed(1)} ({reviewCount || 0} reviews)
      </span>
    </div>
  );
};

const StoreProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState<'USD' | 'ZAR' | 'EUR'>('ZAR');
  const { toast } = useToast();
  const { addToRecentlyViewed } = useRecentlyViewed();
  const { isAffiliate, isCustomer } = useUserRole();
  
  // Track view count
  useViewTracker(id);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      // Try database first
      const { data, error } = await supabase
        .from('affiliate_products')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      let productData = data;

      // Fallback to curated seed products, then CJ seed products
      if (!productData) {
        const allSeedProducts = [...(curatedSeed as any[]), ...(cjSeed as any[])];
        productData = allSeedProducts.find(p => p.id === id) || null;
      }

      // Transform the product data to match our interface
      if (productData) {
        const transformedProduct: Product = {
          ...productData,
          additional_images: Array.isArray(productData.additional_images) 
            ? (productData.additional_images as any[]).filter(img => typeof img === 'string') as string[]
            : productData.additional_images 
              ? [productData.additional_images as string]
              : [],
          product_highlights: Array.isArray(productData.product_highlights)
            ? (productData.product_highlights as any[]).filter(h => typeof h === 'string') as string[]
            : [],
          product_details: productData.product_details as Record<string, string> || {},
        };
        setProduct(transformedProduct as Product);
        
        // Add to recently viewed
        addToRecentlyViewed({
          id: transformedProduct.id,
          category: transformedProduct.category
        });
      } else {
        setProduct(null);
      }

      // Fetch related products
      if (productData) {
        const { data: related } = await supabase
          .from('affiliate_products')
          .select('*')
          .eq('category', productData.category)
          .neq('id', id)
          .limit(4);

        const allSeedProducts = [...(curatedSeed as any[]), ...(cjSeed as any[])];
        const relatedData = related && related.length > 0 
          ? related 
          : allSeedProducts.filter(p => p.category === productData.category && p.id !== id).slice(0, 4);

        setRelatedProducts(relatedData);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const trackClick = async () => {
    if (!product) return;

    try {
      const clickId = `cj-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      await supabase.from('affiliate_clicks').insert({
        affiliate_program_id: 'cj',
        click_id: clickId,
        destination_url: product.affiliate_url,
        referrer_url: window.location.href,
      });

      toast({
        title: 'Redirecting to product...',
        description: 'Your purchase supports our platform!',
      });

      window.open(product.affiliate_url, '_blank');
    } catch (error) {
      console.error('Error tracking click:', error);
      window.open(product.affiliate_url, '_blank');
    }
  };

  const formatPrice = (product: Product) => {
    const prices = {
      USD: `$${product.price_usd.toFixed(2)}`,
      ZAR: `R${product.price_zar.toFixed(2)}`,
      EUR: `€${product.price_eur.toFixed(2)}`,
    };
    return prices[currency];
  };

  const calculateEarnings = (product: Product) => {
    const price = currency === 'USD' ? product.price_usd : currency === 'EUR' ? product.price_eur : product.price_zar;
    const earnings = price * product.commission_rate;
    const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : 'R';
    return `${symbol}${earnings.toFixed(2)}`;
  };

  const copyAffiliateLink = async () => {
    if (!product) return;
    
    try {
      await navigator.clipboard.writeText(product.affiliate_url);
      toast({
        title: '✅ Affiliate link copied!',
        description: 'Share this link to earn commission on sales',
      });
      
      // Track affiliate link copy
      await supabase.from('affiliate_clicks').insert({
        affiliate_program_id: product.id.startsWith('curated_') ? 'curated_seed' : 'cj',
        click_id: `copy-${Date.now()}`,
        destination_url: product.affiliate_url,
        referrer_url: window.location.href,
      });
    } catch (error) {
      toast({
        title: 'Failed to copy',
        description: 'Please try again',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <UnifiedNavigation />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <p className="text-lg text-muted-foreground">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <UnifiedNavigation />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
            <Button asChild>
              <Link to="/store">Browse All Products</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <UnifiedNavigation />
      <main className="pt-20 pb-16">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/store" className="hover:text-primary">Store</Link>
            <span>/</span>
            <Link to={`/store/collections/${product.category.toLowerCase().replace(' ', '-')}`} className="hover:text-primary">
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>
        </div>

        {/* Product Details - 60/40 Layout */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-8 lg:gap-12">
            {/* Left: Product Image Gallery (60%) */}
            <div className="space-y-4">
              <ProductImageGallery
                images={[product.image_url, ...(product.additional_images || [])]}
                productName={product.name}
                category={product.category}
              />
            </div>

            {/* Right: Product Info Sidebar (40%) */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                <Badge variant="secondary" className="mb-3">
                  <Tag className="w-3 h-3 mr-1" />
                  {product.category}
                </Badge>
                {product.brand && (
                  <p className="text-sm text-muted-foreground mb-2">{product.brand}</p>
                )}
                <h1 className="text-3xl font-bold mb-3">{product.name}</h1>
                <StarRating rating={product.rating} reviewCount={product.review_count} />
              </div>

              {/* Pricing */}
              <div className="space-y-4">
                <div className="flex items-baseline gap-4">
                  <span className="text-4xl font-bold text-primary">{formatPrice(product)}</span>
                  {product.sale_price_zar && currency === 'ZAR' && (
                    <Badge variant="destructive" className="text-sm">
                      Save R{(product.price_zar - product.sale_price_zar).toFixed(0)}
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrency('ZAR')}
                    className={currency === 'ZAR' ? 'bg-primary/10' : ''}
                  >
                    ZAR
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrency('USD')}
                    className={currency === 'USD' ? 'bg-primary/10' : ''}
                  >
                    USD
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrency('EUR')}
                    className={currency === 'EUR' ? 'bg-primary/10' : ''}
                  >
                    EUR
                  </Button>
                </div>
              </div>

              {/* Commission Card - Only for Affiliates */}
              {isAffiliate && (
                <CommissionCard 
                  price={currency === 'ZAR' ? product.price_zar : currency === 'USD' ? product.price_usd : product.price_eur}
                  commissionRate={product.commission_rate}
                  currency={currency}
                />
              )}

              {/* Product Highlights */}
              {product.product_highlights && product.product_highlights.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm">Product Highlights</h3>
                  <ul className="space-y-2">
                    {product.product_highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-2">
                {product.delivery_info?.toLowerCase().includes('free') && (
                  <Badge variant="outline" className="gap-1">
                    <Truck className="w-3 h-3" />
                    Free Delivery 🇿🇦
                  </Badge>
                )}
                {product.stock_status === 'in_stock' && (
                  <Badge variant="outline" className="gap-1 border-emerald-500/20 text-emerald-700">
                    <Shield className="w-3 h-3" />
                    In Stock
                  </Badge>
                )}
                <Badge variant="outline" className="gap-1">
                  <MapPin className="w-3 h-3" />
                  SA Seller
                </Badge>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button size="lg" className="w-full" onClick={trackClick}>
                  <ExternalLink className="mr-2 w-5 h-5" />
                  {isAffiliate ? 'Get Affiliate Link' : 'Buy Now'}
                </Button>
                {isAffiliate && (
                  <Button size="lg" variant="outline" className="w-full" onClick={copyAffiliateLink}>
                    <Copy className="mr-2 w-5 h-5" />
                    Copy Affiliate Link
                  </Button>
                )}
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => toast({ title: 'Added to wishlist' })}>
                    <Heart className="mr-2 w-4 h-4" />
                    Save
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast({ title: 'Link copied to clipboard' });
                  }}>
                    <Share2 className="mr-2 w-4 h-4" />
                    Share
                  </Button>
                </div>
              </div>

              {/* Affiliate Invitation - Only for Customers */}
              {isCustomer && (
                <div className="text-center py-4 border-t border-border/50">
                  <Link to="/wellness-exchange-signup" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    💼 Want to earn commission? <span className="underline font-medium">Become an affiliate</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Product Details Tabs */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="delivery">Delivery & Returns</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="prose prose-sm max-w-none">
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {product.long_description || product.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="specifications" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  {product.product_details && Object.keys(product.product_details).length > 0 ? (
                    <Table>
                      <TableBody>
                        {Object.entries(product.product_details).map(([key, value]) => (
                          <TableRow key={key}>
                            <TableCell className="font-medium w-1/3">{key}</TableCell>
                            <TableCell>{value}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-muted-foreground">No specifications available</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="delivery" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {product.delivery_info && (
                      <div>
                        <h3 className="font-semibold mb-2">Delivery Information</h3>
                        <p className="text-sm text-muted-foreground">{product.delivery_info}</p>
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold mb-2">Standard Delivery Terms 🇿🇦</h3>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                        <li>Delivery within 2-5 business days in South Africa</li>
                        <li>Free delivery on orders over R450</li>
                        <li>Track your order online</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Returns Policy</h3>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                        <li>30-day return policy</li>
                        <li>Item must be unused and in original packaging</li>
                        <li>Proof of purchase required</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        {/* Reviews Section */}
        {product && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <ReviewSystem productId={product.id} />
          </section>
        )}

        {/* Recently Viewed */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-3xl font-bold mb-8">Recently Viewed</h2>
          <RecentlyViewedSection 
            currentProductId={product?.id}
            onQuickView={() => {}}
          />
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Related Products</h2>
              <Button variant="outline" asChild>
                <Link to={`/store/collections/${product.category.toLowerCase().replace(/\s+/g, '_')}`}>
                  View All in {product.category}
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.slice(0, 3).map((relatedProduct) => (
                <TakealotProductCard 
                  key={relatedProduct.id}
                  product={relatedProduct}
                  showQuickView={false}
                />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default StoreProductDetail;
