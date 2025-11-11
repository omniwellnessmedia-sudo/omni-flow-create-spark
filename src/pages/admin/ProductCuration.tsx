import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Star, TrendingUp, Eye, DollarSign } from 'lucide-react';

export const ProductCuration = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('affiliate_products')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    setProducts(data || []);
    setLoading(false);
  };

  const toggleFeatured = async (productId: string, currentValue: boolean) => {
    const { error } = await supabase
      .from('affiliate_products')
      .update({ is_featured: !currentValue })
      .eq('id', productId);

    if (!error) {
      toast({ title: 'Product updated' });
      fetchProducts();
    }
  };

  const toggleActive = async (productId: string, currentValue: boolean) => {
    const { error } = await supabase
      .from('affiliate_products')
      .update({ is_active: !currentValue })
      .eq('id', productId);

    if (!error) {
      toast({ title: 'Product status updated' });
      fetchProducts();
    }
  };

  const runAutoCuration = async () => {
    setSyncing(true);
    const { error } = await supabase.rpc('auto_curate_featured_products');
    
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Auto-curation complete' });
      fetchProducts();
    }
    setSyncing(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Product Curation</h1>
        <Button onClick={runAutoCuration} disabled={syncing}>
          <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
          Auto-Curate
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <img src={product.image_url} alt={product.name} className="w-full h-40 object-cover rounded" />
              <CardTitle className="text-sm line-clamp-2">{product.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex gap-2 flex-wrap">
                <Badge variant={product.is_featured ? 'default' : 'outline'}>
                  <Star className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
                <Badge variant={product.is_trending ? 'default' : 'outline'}>
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Trending
                </Badge>
                <Badge variant="secondary">
                  <Eye className="w-3 h-3 mr-1" />
                  {product.view_count || 0}
                </Badge>
              </div>
              <div className="text-sm">
                <span className="font-bold">R{product.price_zar}</span>
                <span className="text-muted-foreground ml-2">
                  {(product.commission_rate * 100).toFixed(0)}% commission
                </span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => toggleFeatured(product.id, product.is_featured)}>
                  {product.is_featured ? 'Unfeature' : 'Feature'}
                </Button>
                <Button size="sm" variant={product.is_active ? 'destructive' : 'default'} onClick={() => toggleActive(product.id, product.is_active)}>
                  {product.is_active ? 'Deactivate' : 'Activate'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductCuration;
