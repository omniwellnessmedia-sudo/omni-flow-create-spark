import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PremiumProductCard } from '@/components/product/PremiumProductCard';
import { FeaturedProductsCarousel } from '@/components/product/FeaturedProductsCarousel';
import { ProductQuickView } from '@/components/product/ProductQuickView';
import { FiltersSidebar } from '@/components/product/FiltersSidebar';
import { BackToTopButton } from '@/components/product/BackToTopButton';
import { ProductSkeleton } from '@/components/product/ProductSkeleton';
import { TrustBadges } from '@/components/product/TrustBadges';
import { EmptyState } from '@/components/ui/empty-state';
import { 
  Search, 
  ExternalLink, 
  TrendingUp, 
  DollarSign, 
  Package, 
  RefreshCw,
  ShoppingCart,
  Star,
  Zap,
  Sparkles
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
  const [displayedProducts, setDisplayedProducts] = useState<CJProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [sortBy, setSortBy] = useState('featured');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [quickViewProductId, setQuickViewProductId] = useState<string | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const { toast } = useToast();
  
  const INITIAL_LOAD = 24;
  const LOAD_MORE = 12;

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
  }, [products, searchTerm, selectedCategories, priceRange, sortBy]);

  useEffect(() => {
    // Reset pagination when filters change
    setPage(1);
    const initialProducts = filteredProducts.slice(0, INITIAL_LOAD);
    setDisplayedProducts(initialProducts);
    setHasMore(filteredProducts.length > INITIAL_LOAD);
  }, [filteredProducts]);

  useEffect(() => {
    // Infinite scroll observer
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const sentinel = document.getElementById('scroll-sentinel');
    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => {
      if (sentinel) {
        observer.unobserve(sentinel);
      }
    };
  }, [hasMore, loading, page]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('affiliate_products')
        .select('*')
        .eq('affiliate_program_id', 'cj')
        .eq('is_active', true)
        .order('is_featured', { ascending: false })
        .order('is_trending', { ascending: false })
        .order('view_count', { ascending: false });

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
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product => 
        selectedCategories.includes(product.category)
      );
    }

    // Apply price range filter
    filtered = filtered.filter(product =>
      product.price_zar >= priceRange[0] && product.price_zar <= priceRange[1]
    );

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
      case 'newest':
        filtered.sort((a, b) => 
          new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
        );
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  };

  const loadMore = () => {
    const nextPage = page + 1;
    const startIndex = INITIAL_LOAD + (page - 1) * LOAD_MORE;
    const endIndex = startIndex + LOAD_MORE;
    const newProducts = filteredProducts.slice(startIndex, endIndex);
    
    if (newProducts.length > 0) {
      setDisplayedProducts(prev => [...prev, ...newProducts]);
      setPage(nextPage);
      setHasMore(endIndex < filteredProducts.length);
    } else {
      setHasMore(false);
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
      localStorage.setItem('cj-favorites', JSON.stringify([...newFavorites]));
      return newFavorites;
    });
  };

  const handleQuickView = (productId: string) => {
    setQuickViewProductId(productId);
    setIsQuickViewOpen(true);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      }
      return [...prev, category];
    });
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 10000]);
    setSearchTerm('');
    setSortBy('featured');
  };

  const activeFiltersCount = 
    selectedCategories.length + 
    (priceRange[0] !== 0 || priceRange[1] !== 10000 ? 1 : 0) +
    (searchTerm ? 1 : 0);

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];
  const minPrice = Math.min(...products.map(p => p.price_zar), 0);
  const maxPrice = Math.max(...products.map(p => p.price_zar), 10000);

  return (
    <div className="min-h-screen bg-background">
      <UnifiedNavigation />
      
      <main className="pt-20 pb-16">
        {/* Hero Section - Modern Glassmorphism Design */}
        <section className="relative py-24 overflow-hidden animated-gradient-hero">
          {/* Decorative Elements */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-20 left-10 w-72 h-72 bg-omni-violet/20 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-omni-orange/20 rounded-full blur-3xl" />
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center space-y-8 max-w-5xl mx-auto">
              {/* Badge */}
              <div className="animate-scale-in">
                <Badge className="badge-modern glass-button border-primary/20 bg-background/60 text-foreground">
                  <Sparkles className="w-3.5 h-3.5 mr-2 text-primary" />
                  Conscious Wellness Marketplace by Omni Wellness Media
                </Badge>
              </div>

              {/* Main Heading - Solid text for readability */}
              <h1 className="text-hero text-foreground animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                Bridging Wellness,
                <br />
                <span className="text-gradient-primary">Outreach & Media</span>
              </h1>

              {/* Subheading */}
              <p className="text-subhero mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                Curated wellness products that align with our mission of holistic wellness, sustainable living, and conscious consumption. Every purchase supports our community programs.
              </p>

              {/* CTA Buttons - Glassmorphism Style */}
              <div className="flex flex-wrap gap-4 justify-center pt-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <Button 
                  onClick={syncProducts} 
                  disabled={syncing} 
                  size="lg"
                  className="glass-button hover-lift shadow-elegant"
                >
                  <RefreshCw className={`mr-2 w-5 h-5 ${syncing ? 'animate-spin' : ''}`} />
                  {syncing ? 'Syncing Products...' : 'Sync Products'}
                </Button>
                <Button 
                  onClick={runConnectivityCheck} 
                  size="lg" 
                  variant="outline"
                  className="glass-button hover-lift"
                >
                  <ExternalLink className="mr-2 w-5 h-5" />
                  API Status
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  asChild
                  className="glass-button hover-lift"
                >
                  <a href="#products">
                    <ShoppingCart className="mr-2 w-5 h-5" />
                    {loading ? 'Loading...' : `Browse ${products.length} Products`}
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Section Divider */}
        <div className="section-divider-thick max-w-4xl mx-auto" />

        {/* About Marketplace Section - Enhanced Design */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="card-modern glass-card border-border/30 overflow-hidden">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2 gap-0">
                {/* Text Content */}
                <div className="p-8 md:p-12 space-y-6">
                  <h2 className="text-section-title text-foreground">
                    Welcome to the Omni Wellness Marketplace
                  </h2>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    At Omni Wellness Media, we believe in bridging wellness, outreach, and media to empower South Africa's journey to health and consciousness.
                  </p>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    This marketplace features carefully curated wellness products from trusted partners through CJ Affiliate. Every purchase supports our mission to create conscious media content, business development, and sustainable community initiatives like The Valley of Plenty and the Human Animal Project.
                  </p>
                </div>

                {/* Stats Cards */}
                <div className="p-8 md:p-12 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 flex items-center">
                  <div className="grid grid-cols-2 gap-4 w-full">
                    <div className="text-center p-6 bg-background/60 backdrop-blur-sm rounded-xl border border-border/50 hover-lift">
                      <div className="text-4xl font-bold text-primary mb-2">{products.length}</div>
                      <div className="text-sm font-medium text-muted-foreground">Products</div>
                    </div>
                    <div className="text-center p-6 bg-background/60 backdrop-blur-sm rounded-xl border border-border/50 hover-lift">
                      <div className="text-4xl font-bold text-secondary mb-2">
                        {products.length > 0 ? (products.reduce((sum, p) => sum + p.commission_rate, 0) / products.length * 100).toFixed(1) : 0}%
                      </div>
                      <div className="text-sm font-medium text-muted-foreground">Avg Commission</div>
                    </div>
                    <div className="text-center p-6 bg-background/60 backdrop-blur-sm rounded-xl border border-border/50 col-span-2 hover-lift">
                      <div className="text-4xl font-bold text-accent mb-2">
                        R{products.length > 0 ? (products.reduce((sum, p) => sum + (p.price_zar * p.commission_rate), 0) / products.length).toFixed(0) : 0}
                      </div>
                      <div className="text-sm font-medium text-muted-foreground">Avg Commission Earned</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Trust Badges */}
        <TrustBadges />

        {/* Featured Products Carousel */}
        {!loading && products.length > 0 && (
          <FeaturedProductsCarousel 
            products={products}
            onQuickView={handleQuickView}
          />
        )}

        {/* Main Products Section with Sidebar */}
        <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search wellness products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-14 text-lg"
              />
            </div>
          </div>

          <div className="grid lg:grid-cols-[280px_1fr] gap-8">
            {/* Filters Sidebar - Desktop */}
            <div className="hidden lg:block">
              <FiltersSidebar
                categories={categories}
                selectedCategories={selectedCategories}
                onCategoryChange={handleCategoryChange}
                minPrice={minPrice}
                maxPrice={maxPrice}
                priceRange={priceRange}
                onPriceRangeChange={setPriceRange}
                sortBy={sortBy}
                onSortChange={setSortBy}
                onClearFilters={handleClearFilters}
                activeFiltersCount={activeFiltersCount}
              />
            </div>

            {/* Products Grid */}
            <div className="space-y-6">
              {/* Results Header */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Showing <span className="font-semibold text-foreground">{displayedProducts.length}</span> of{' '}
                    <span className="font-semibold text-foreground">{filteredProducts.length}</span> products
                    {filteredProducts.length !== products.length && (
                      <span className="text-xs"> (filtered from {products.length} total)</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Loading State */}
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  <ProductSkeleton count={24} />
                </div>
              ) : filteredProducts.length === 0 ? (
                <EmptyState
                  icon={<Package className="w-16 h-16 text-muted-foreground" />}
                  title={products.length === 0 ? "No Products Yet" : "No Products Found"}
                  description={products.length === 0 
                    ? "Sync products from CJ Affiliate to get started" 
                    : "Try adjusting your filters or search term"}
                  actionLabel={products.length === 0 ? "Sync Products" : "Clear Filters"}
                  onAction={products.length === 0 ? syncProducts : handleClearFilters}
                />
              ) : (
                <>
                  {/* Products Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {displayedProducts.map((product) => (
                      <PremiumProductCard
                        key={product.id}
                        product={product}
                        onFavoriteToggle={toggleFavorite}
                        isFavorite={favorites.has(product.id)}
                        onQuickView={handleQuickView}
                      />
                    ))}
                  </div>

                  {/* Infinite Scroll Sentinel */}
                  <div id="scroll-sentinel" className="h-20 flex items-center justify-center">
                    {hasMore && !loading && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span className="text-sm">Loading more products...</span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Quick View Modal */}
      <ProductQuickView
        productId={quickViewProductId}
        isOpen={isQuickViewOpen}
        onClose={() => {
          setIsQuickViewOpen(false);
          setQuickViewProductId(null);
        }}
      />

      {/* Back to Top Button */}
      <BackToTopButton />

      <Footer />
    </div>
  );
};

export default CJAffiliateProducts;
