import React, { useState, useEffect } from 'react';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/components/CartProvider';
import { 
  Search, 
  ExternalLink, 
  TrendingUp, 
  DollarSign, 
  Package, 
  RefreshCw,
  ShoppingCart,
  Filter,
  Star,
  Heart,
  Share2,
  Zap
} from 'lucide-react';

interface CJProduct {
  id: string;
  affiliate_program_id: string;
  external_product_id: string;
  name: string;
  description: string;
  category: string;
  image_url: string;
  affiliate_url: string;
  price_usd: number;
  price_zar: number;
  price_eur: number;
  commission_rate: number;
  is_active: boolean;
  created_at?: string;
  last_synced_at?: string;
}

const CJAffiliateProducts = () => {
  const [products, setProducts] = useState<CJProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<CJProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [currency, setCurrency] = useState<'USD' | 'ZAR' | 'EUR'>('ZAR');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const { addItem } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchTerm, categoryFilter, sortBy]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('affiliate_products')
        .select('*')
        .eq('affiliate_program_id', 'cj')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

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

  const runConnectivityCheck = async () => {
    try {
      toast({
        title: 'Running connectivity check...',
        description: 'Testing CJ API endpoints',
      });

      const { data, error } = await supabase.functions.invoke('cj-connectivity-check');

      if (error) throw error;

      const results = data.results;
      const allGood = results.productFeed?.status === 'success' && 
                     results.commissions?.status === 'success' &&
                     results.companyId?.status === 'configured';

      console.log('Connectivity check results:', data);

      // Show detailed results
      const statusEmoji = (status: string) => status === 'success' || status === 'configured' ? '✅' : '❌';
      
      toast({
        title: allGood ? '✅ All Checks Passed' : '⚠️ Configuration Issues',
        description: (
          <div className="space-y-1 text-sm">
            <div>{statusEmoji(results.productFeed?.status)} Product Feed API: {results.productFeed?.status}</div>
            <div>{statusEmoji(results.commissions?.status)} Commissions API: {results.commissions?.status}</div>
            <div>{statusEmoji(results.companyId?.status)} Company ID: {results.companyId?.status}</div>
            <div className="mt-2 pt-2 border-t border-border">
              {data.recommendations?.[0] || 'All systems operational'}
            </div>
          </div>
        ),
        variant: allGood ? 'default' : 'destructive',
        duration: 8000,
      });
    } catch (error) {
      console.error('Connectivity check error:', error);
      toast({
        title: 'Connectivity Check Failed',
        description: error.message || 'Failed to run connectivity check',
        variant: 'destructive',
      });
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

      if (error) {
        throw new Error(error.message || 'Sync failed');
      }

      if (data && data.success) {
        toast({
          title: 'Sync Complete',
          description: `Synced ${data.results.inserted} products. ${data.results.errors} errors.`,
        });
        fetchProducts();
      } else {
        throw new Error(data?.error || 'Unknown sync error');
      }
    } catch (error) {
      console.error('Error syncing products:', error);
      toast({
        title: 'Sync Failed',
        description: error.message || 'Failed to sync products from CJ Affiliate. Try running connectivity check first.',
        variant: 'destructive',
      });
    } finally {
      setSyncing(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }

    // Apply sorting
    switch (sortBy) {
      case 'price_low':
        filtered.sort((a, b) => getPriceInCurrency(a) - getPriceInCurrency(b));
        break;
      case 'price_high':
        filtered.sort((a, b) => getPriceInCurrency(b) - getPriceInCurrency(a));
        break;
      case 'commission_high':
        filtered.sort((a, b) => (b.commission_rate || 0) - (a.commission_rate || 0));
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Keep original order (featured)
        break;
    }

    setFilteredProducts(filtered);
  };

  const getPriceInCurrency = (product: CJProduct): number => {
    switch (currency) {
      case 'USD':
        return product.price_usd || 0;
      case 'EUR':
        return product.price_eur || 0;
      case 'ZAR':
      default:
        return product.price_zar || 0;
    }
  };

  const formatPrice = (product: CJProduct): string => {
    const price = getPriceInCurrency(product);
    switch (currency) {
      case 'USD':
        return `$${price.toFixed(2)}`;
      case 'EUR':
        return `€${price.toFixed(2)}`;
      case 'ZAR':
      default:
        return `R${price.toFixed(2)}`;
    }
  };

  const calculateEarnings = (product: CJProduct): string => {
    const price = getPriceInCurrency(product);
    const earnings = price * (product.commission_rate || 0);
    switch (currency) {
      case 'USD':
        return `$${earnings.toFixed(2)}`;
      case 'EUR':
        return `€${earnings.toFixed(2)}`;
      case 'ZAR':
      default:
        return `R${earnings.toFixed(2)}`;
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

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
        toast({ title: 'Removed from favorites' });
      } else {
        newFavorites.add(productId);
        toast({ title: 'Added to favorites' });
      }
      return newFavorites;
    });
  };

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

  return (
    <div className="min-h-screen">
      <UnifiedNavigation />
      <main className="pt-20 pb-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4">
              <Badge variant="secondary" className="mb-2">
                <Zap className="w-3 h-3 mr-1" />
                CJ Affiliate Network
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Premium Wellness Store
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Discover curated wellness products from trusted brands. Earn commissions on every sale.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button onClick={syncProducts} disabled={syncing} size="lg" variant="default">
                  <RefreshCw className={`mr-2 w-5 h-5 ${syncing ? 'animate-spin' : ''}`} />
                  {syncing ? 'Syncing Products...' : 'Sync Latest Products'}
                </Button>
                <Button onClick={runConnectivityCheck} size="lg" variant="secondary">
                  <ExternalLink className="mr-2 w-5 h-5" />
                  Run Connectivity Check
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="#products">
                    <ShoppingCart className="mr-2 w-5 h-5" />
                    Browse Products
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Package className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{products.length}</p>
                    <p className="text-sm text-muted-foreground">Products</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-secondary/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-secondary/10 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {products.length > 0 ? (products.reduce((sum, p) => sum + p.commission_rate, 0) / products.length * 100).toFixed(1) : 0}%
                    </p>
                    <p className="text-sm text-muted-foreground">Avg Commission</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-accent/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-accent/10 rounded-lg">
                    <DollarSign className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      R{products.length > 0 ? (products.reduce((sum, p) => sum + (p.price_zar * p.commission_rate), 0) / products.length).toFixed(0) : 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Avg Earning</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-muted">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <Star className="w-6 h-6 text-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{filteredProducts.length}</p>
                    <p className="text-sm text-muted-foreground">Filtered Results</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Filters & Controls */}
        <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Search & Primary Filters */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <Input
                      placeholder="Search products by name, description, or category..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Category" />
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

                {/* Secondary Controls */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="featured">Featured</SelectItem>
                        <SelectItem value="price_low">Price: Low to High</SelectItem>
                        <SelectItem value="price_high">Price: High to Low</SelectItem>
                        <SelectItem value="commission_high">Highest Commission</SelectItem>
                        <SelectItem value="name">Name A-Z</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={currency} onValueChange={(v) => setCurrency(v as any)}>
                      <SelectTrigger className="w-full sm:w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ZAR">ZAR (R)</SelectItem>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)} className="w-full sm:w-auto">
                    <TabsList>
                      <TabsTrigger value="grid">Grid</TabsTrigger>
                      <TabsTrigger value="list">List</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Products Display */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          {loading ? (
            <div className="text-center py-12">
              <RefreshCw className="w-12 h-12 animate-spin mx-auto text-primary mb-4" />
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
                <p className="text-muted-foreground mb-6">
                  {products.length === 0 
                    ? 'Sync products to get started' 
                    : 'Try adjusting your filters or search term'}
                </p>
                <Button onClick={syncProducts} disabled={syncing}>
                  <RefreshCw className={`mr-2 w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
                  Sync Products Now
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
                : 'space-y-4'}>
                {filteredProducts.map((product) => (
                  <Card 
                    key={product.id} 
                    className={`group hover:shadow-xl transition-all duration-300 ${
                      viewMode === 'list' ? 'flex flex-row' : ''
                    }`}
                  >
                    <div className={viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}>
                      {product.image_url ? (
                        <div className="relative overflow-hidden rounded-t-lg">
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                              viewMode === 'list' ? 'h-full rounded-l-lg rounded-t-none' : 'h-48'
                            }`}
                            loading="lazy"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background"
                            onClick={() => toggleFavorite(product.id)}
                          >
                            <Heart 
                              className={`w-5 h-5 ${
                                favorites.has(product.id) 
                                  ? 'fill-red-500 text-red-500' 
                                  : 'text-muted-foreground'
                              }`} 
                            />
                          </Button>
                        </div>
                      ) : (
                        <div className={`bg-muted flex items-center justify-center ${
                          viewMode === 'list' ? 'h-full rounded-l-lg' : 'h-48 rounded-t-lg'
                        }`}>
                          <Package className="w-12 h-12 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {product.category || 'Wellness'}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            <Star className="w-3 h-3 mr-1" />
                            {(product.commission_rate * 100).toFixed(0)}%
                          </Badge>
                        </div>
                        <CardTitle className="line-clamp-2 text-lg group-hover:text-primary transition-colors">
                          {product.name}
                        </CardTitle>
                        <CardDescription className="line-clamp-2 text-sm">
                          {product.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* Pricing */}
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-2xl font-bold text-foreground">
                              {formatPrice(product)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Earn: <span className="font-semibold text-green-600">
                                {calculateEarnings(product)}
                              </span>
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button
                            onClick={() => trackClick(product)}
                            className="flex-1"
                            size="sm"
                          >
                            View Product
                            <ExternalLink className="ml-2 w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              navigator.clipboard.writeText(product.affiliate_url);
                              toast({ title: 'Link copied to clipboard!' });
                            }}
                          >
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Pagination Info */}
              <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Showing <span className="font-semibold">{filteredProducts.length}</span> of{' '}
                  <span className="font-semibold">{products.length}</span> products
                </p>
              </div>
            </>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CJAffiliateProducts;