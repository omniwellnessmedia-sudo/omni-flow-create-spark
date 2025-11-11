import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ExternalLink, Heart, Share2, TrendingUp, DollarSign, Tag } from 'lucide-react';
import curatedSeed from '@/data/curated_wellness_seed.json';
import cjSeed from '@/data/cjSeedProducts.json';

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  image_url: string;
  affiliate_url: string;
  price_usd: number;
  price_zar: number;
  price_eur: number;
  commission_rate: number;
  created_at?: string;
  last_synced_at?: string;
}

const StoreProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState<'USD' | 'ZAR' | 'EUR'>('ZAR');
  const { toast } = useToast();

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

      setProduct(productData);

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

        {/* Product Details */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <Badge variant="secondary" className="mb-4">
                  <Tag className="w-3 h-3 mr-1" />
                  {product.category}
                </Badge>
                <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
                <p className="text-lg text-muted-foreground">{product.description}</p>
              </div>

              <div className="flex items-baseline gap-4">
                <span className="text-5xl font-bold text-primary">{formatPrice(product)}</span>
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

              {/* Commission Info */}
              <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Commission Rate</p>
                        <p className="text-xl font-bold">{(product.commission_rate * 100).toFixed(0)}%</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-secondary/10 rounded-lg">
                        <DollarSign className="w-5 h-5 text-secondary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">You Earn</p>
                        <p className="text-xl font-bold">{calculateEarnings(product)}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="space-y-4">
                <Button size="lg" className="w-full" onClick={trackClick}>
                  <ExternalLink className="mr-2 w-5 h-5" />
                  Shop Now
                </Button>
                <div className="flex gap-4">
                  <Button variant="outline" className="flex-1" onClick={() => toast({ title: 'Added to favorites' })}>
                    <Heart className="mr-2 w-5 h-5" />
                    Save
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast({ title: 'Link copied to clipboard' });
                  }}>
                    <Share2 className="mr-2 w-5 h-5" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="text-3xl font-bold mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link key={relatedProduct.id} to={`/store/product/${relatedProduct.id}`}>
                  <Card className="group hover:shadow-xl transition-all duration-300 h-full">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={relatedProduct.image_url}
                        alt={relatedProduct.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                        {relatedProduct.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-primary">
                          {formatPrice(relatedProduct)}
                        </span>
                        <Badge variant="secondary">
                          {(relatedProduct.commission_rate * 100).toFixed(0)}%
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
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
