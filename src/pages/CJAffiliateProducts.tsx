import React, { useState, useEffect } from 'react';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Search, ExternalLink, TrendingUp, DollarSign, Package, RefreshCw } from 'lucide-react';

interface CJProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  image_url: string;
  affiliate_url: string;
  price_usd: number;
  price_zar: number;
  commission_rate: number;
  is_active: boolean;
}

const CJAffiliateProducts = () => {
  const [products, setProducts] = useState<CJProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const { toast } = useToast();

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('affiliate_products')
        .select('*')
        .eq('affiliate_program_id', 'cj')
        .eq('is_active', true)
        .order('last_synced_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: 'Error',
        description: 'Failed to load affiliate products',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const syncProducts = async () => {
    setSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke('cj-sync-products', {
        body: {
          categories: ['wellness', 'natural', 'organic', 'health', 'fitness', 'yoga', 'meditation'],
        },
      });

      if (error) throw error;

      toast({
        title: 'Sync Complete',
        description: `Synced ${data.results.inserted} products from CJ Affiliate`,
      });

      fetchProducts();
    } catch (error) {
      console.error('Error syncing products:', error);
      toast({
        title: 'Sync Failed',
        description: 'Failed to sync products from CJ Affiliate',
        variant: 'destructive',
      });
    } finally {
      setSyncing(false);
    }
  };

  const trackClick = async (product: CJProduct) => {
    try {
      const clickId = `cj-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      await supabase.from('affiliate_clicks').insert({
        affiliate_program_id: 'cj',
        click_id: clickId,
        destination_url: product.affiliate_url,
        referrer_url: window.location.href,
      });

      window.open(product.affiliate_url, '_blank');
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(products.map(p => p.category))];

  return (
    <div className="min-h-screen">
      <UnifiedNavigation />
      <main className="pt-20 pb-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-purple-50 via-white to-blue-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <Badge className="mb-4 bg-purple-100 text-purple-800">
                CJ Affiliate Network
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Premium Wellness Products
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Discover thousands of curated wellness products from top brands through our CJ Affiliate partnership
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={syncProducts} disabled={syncing} size="lg">
                  <RefreshCw className={`mr-2 w-5 h-5 ${syncing ? 'animate-spin' : ''}`} />
                  {syncing ? 'Syncing...' : 'Sync Products'}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Package className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{products.length}</p>
                    <p className="text-sm text-gray-600">Active Products</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {products.length > 0 ? (products.reduce((sum, p) => sum + p.commission_rate, 0) / products.length * 100).toFixed(1) : 0}%
                    </p>
                    <p className="text-sm text-gray-600">Avg Commission</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      R{products.length > 0 ? (products.reduce((sum, p) => sum + (p.price_zar * p.commission_rate), 0) / products.length).toFixed(0) : 0}
                    </p>
                    <p className="text-sm text-gray-600">Avg Earning/Sale</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Filters */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-64">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </section>

        {/* Products Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <RefreshCw className="w-12 h-12 animate-spin mx-auto text-purple-600 mb-4" />
              <p className="text-gray-600">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
                <p className="text-gray-600 mb-6">Try syncing products or adjusting your filters</p>
                <Button onClick={syncProducts} disabled={syncing}>
                  <RefreshCw className={`mr-2 w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
                  Sync Products Now
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    {product.image_url && (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                        loading="lazy"
                      />
                    )}
                    <CardTitle className="line-clamp-2">{product.name}</CardTitle>
                    <CardDescription className="line-clamp-3">
                      {product.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-2xl font-bold text-purple-600">
                          R{product.price_zar.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">
                          ${product.price_usd.toFixed(2)} USD
                        </p>
                      </div>
                      <Badge variant="secondary">
                        {(product.commission_rate * 100).toFixed(1)}% commission
                      </Badge>
                    </div>
                    <div className="mb-4">
                      <p className="text-sm text-gray-600">
                        Earn: <span className="font-semibold text-green-600">
                          R{(product.price_zar * product.commission_rate).toFixed(2)}
                        </span> per sale
                      </p>
                    </div>
                    <Button
                      onClick={() => trackClick(product)}
                      className="w-full"
                      variant="default"
                    >
                      View Product
                      <ExternalLink className="ml-2 w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CJAffiliateProducts;