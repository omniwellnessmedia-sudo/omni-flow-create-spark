import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PremiumProductCard } from '@/components/product/PremiumProductCard';
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
  Zap,
  Grid3x3,
  List
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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('cj-favorites');
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
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

      const statusEmoji = (status: string) => status === 'success' || status === 'configured' ? '✅' : '❌';
      
      toast({
        title: allGood ? '✅ All Checks Passed' : '⚠️ Configuration Issues',
        description: (
          <div className="space-y-1 text-sm">
            <div>{statusEmoji(results.productFeed?.status)} Product Feed API</div>
            <div>{statusEmoji(results.commissions?.status)} Commissions API</div>
            <div>{statusEmoji(results.companyId?.status)} Company ID</div>
          </div>
        ),
        variant: allGood ? 'default' : 'destructive',
        duration: 6000,
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
    toast({
      title: '🔄 Starting Product Sync',
      description: 'Fetching wellness products from CJ... This takes 2-3 minutes.',
    });
    
    try {
      const { data, error } = await supabase.functions.invoke('cj-sync-products', {
        body: {}
      });

      if (error) throw new Error(error.message || 'Sync failed');

      if (data && data.success) {
        const { inserted = 0, updated = 0, totalFetched = 0 } = data.results || {};
        toast({
          title: '✅ Sync Complete!',
          description: `Added ${inserted} new products, updated ${updated}. Total fetched: ${totalFetched}.`,
        });
        
        // Refresh products after short delay
        setTimeout(() => {
          fetchProducts();
        }, 1000);
      } else {
        throw new Error(data?.error || 'Unknown sync error');
      }
    } catch (error: any) {
      console.error('Error syncing products:', error);
      toast({
        title: 'Sync Failed',
        description: error.message || 'Failed to sync products from CJ Affiliate.',
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
        filtered.sort((a, b) => a.price_zar - b.price_zar);
        break;
      case 'price_high':
        filtered.sort((a, b) => b.price_zar - a.price_zar);
        break;
      case 'commission_high':
        filtered.sort((a, b) => (b.commission_rate || 0) - (a.commission_rate || 0));
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
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
      localStorage.setItem('cj-favorites', JSON.stringify([...newFavorites]));
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
                Shop Conscious Products, Earn Rewards
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Premium Wellness Marketplace
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Discover curated wellness products from trusted brands. Every purchase supports our community.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button onClick={syncProducts} disabled={syncing} size="lg" variant="default">
                  <RefreshCw className={`mr-2 w-5 h-5 ${syncing ? 'animate-spin' : ''}`} />
                  {syncing ? 'Syncing...' : 'Sync Products'}
                </Button>
                <Button onClick={runConnectivityCheck} size="lg" variant="secondary">
                  <ExternalLink className="mr-2 w-5 h-5" />
                  Check API Status
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
                    <p className="text-sm text-muted-foreground">Results</p>
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
                      placeholder="Search products..."
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

                  <div className="flex gap-2">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'outline'}
                      size="icon"
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid3x3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'outline'}
                      size="icon"
                      onClick={() => setViewMode('list')}
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
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
                    : 'Try adjusting your filters'}
                </p>
                <Button onClick={syncProducts} disabled={syncing}>
                  <RefreshCw className={`mr-2 w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
                  Sync Products
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
                  : 'space-y-4'
              }>
                {filteredProducts.map((product) => (
                  <PremiumProductCard
                    key={product.id}
                    product={product}
                    onFavoriteToggle={toggleFavorite}
                    isFavorite={favorites.has(product.id)}
                  />
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
