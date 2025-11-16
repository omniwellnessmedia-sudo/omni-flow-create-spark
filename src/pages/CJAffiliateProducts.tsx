import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useWishlist } from '@/hooks/useWishlist';
import { TakealotProductCard } from '@/components/product/TakealotProductCard';
import { FeaturedProductsCarousel } from '@/components/product/FeaturedProductsCarousel';
import { ProductQuickView } from '@/components/product/ProductQuickView';
import { ProductComparison } from '@/components/product/ProductComparison';
import { FiltersSidebar } from '@/components/product/FiltersSidebar';
import { BackToTopButton } from '@/components/product/BackToTopButton';
import { ProductSkeleton } from '@/components/product/ProductSkeleton';
import { TrustBadges } from '@/components/product/TrustBadges';
import { EmptyState } from '@/components/ui/empty-state';
import { ImpactBadges } from '@/components/social-impact/ImpactBadges';
import { filterQualityProducts } from '@/lib/productFilters';
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
  Sparkles,
  GitCompare,
  Heart
} from 'lucide-react';

interface CJProduct {
  id: string;
  affiliate_program_id: string;
  external_product_id: string;
  name: string;
  description: string;
  long_description?: string;
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
  advertiser_name?: string;
  advertiser_id?: string;
  brand?: string;
  brand_logo_url?: string;
  is_featured?: boolean;
  is_trending?: boolean;
  view_count?: number;
}

const CJAffiliateProducts = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [products, setProducts] = useState<CJProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<CJProduct[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<CJProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(categoryParam ? [categoryParam] : []);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [sortBy, setSortBy] = useState('featured');
  const [compareProducts, setCompareProducts] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const { toggleWishlist, isInWishlist, getWishlistCount } = useWishlist();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [quickViewProductId, setQuickViewProductId] = useState<string | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const { toast } = useToast();
  
  const INITIAL_LOAD = 24;
  const LOAD_MORE = 12;

  useEffect(() => {
    fetchProducts();
    // Load comparison from localStorage
    const savedComparison = localStorage.getItem('cj-comparison');
    if (savedComparison) {
      setCompareProducts(JSON.parse(savedComparison));
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
      
      // Apply quality filters - cast to compatible type
      const qualityProducts = filterQualityProducts(data || [] as any) as CJProduct[];
      setProducts(qualityProducts);
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

  const addToCompare = (productId: string) => {
    if (compareProducts.includes(productId)) {
      toast({ title: 'Already in comparison', variant: 'destructive' });
      return;
    }
    
    if (compareProducts.length >= 4) {
      toast({ 
        title: 'Maximum reached', 
        description: 'You can compare up to 4 products at once',
        variant: 'destructive' 
      });
      return;
    }

    const newCompare = [...compareProducts, productId];
    setCompareProducts(newCompare);
    localStorage.setItem('cj-comparison', JSON.stringify(newCompare));
    toast({ title: 'Added to comparison' });
  };

  const removeFromCompare = (productId: string) => {
    const newCompare = compareProducts.filter(id => id !== productId);
    setCompareProducts(newCompare);
    localStorage.setItem('cj-comparison', JSON.stringify(newCompare));
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
        {/* Hero Section - Wellness Marketplace with Image Background */}
        <section className="relative py-32 overflow-hidden">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1920"
              alt="Wellness products background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/85 backdrop-blur-sm" />
          </div>
          
          {/* Decorative Gradient Orbs */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-20 left-10 w-96 h-96 bg-omni-violet/40 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-omni-orange/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-omni-green/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
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

        {/* About Marketplace Section - Clean & Visual Design */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-5 gap-8 items-start">
            {/* Text Content - Larger, More Prominent */}
            <div className="lg:col-span-3 space-y-8">
              <div className="space-y-4">
                <Badge className="badge-modern bg-primary/10 text-primary border-primary/20">
                  <Sparkles className="w-4 h-4 mr-2" />
                  About Our Marketplace
                </Badge>
                
                <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                  Welcome to the
                  <br />
                  <span className="text-gradient-primary">Omni Wellness Marketplace</span>
                </h2>
              </div>
              
              <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <p className="flex items-start gap-3">
                  <span className="text-primary mt-1 flex-shrink-0">✓</span>
                  <span>
                    <strong className="text-foreground">Bridging wellness, outreach & media</strong> to empower South Africa's journey to health and consciousness.
                  </span>
                </p>
                
                <p className="flex items-start gap-3">
                  <span className="text-primary mt-1 flex-shrink-0">✓</span>
                  <span>
                    <strong className="text-foreground">Carefully curated products</strong> from trusted wellness partners through CJ Affiliate network.
                  </span>
                </p>
                
                <p className="flex items-start gap-3">
                  <span className="text-primary mt-1 flex-shrink-0">✓</span>
                  <span>
                    <strong className="text-foreground">Every purchase supports</strong> conscious media content, business development, and community initiatives like The Valley of Plenty and Human Animal Project.
                  </span>
                </p>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <Button size="lg" className="shadow-lg" asChild>
                  <a href="#products">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Browse Products
                  </a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/about">
                    Learn Our Mission
                  </Link>
                </Button>
              </div>
            </div>

            {/* Stats Cards - Redesigned for Better Visibility */}
            <div className="lg:col-span-2 space-y-4">
              <Card className="glass-card border-primary/20 hover-lift overflow-hidden">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                    <Package className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-5xl font-bold text-foreground mb-2">
                    {products.length}
                  </div>
                  <div className="text-base font-medium text-muted-foreground">
                    Curated Products
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-secondary/20 hover-lift overflow-hidden">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary/10 mb-4">
                    <TrendingUp className="w-8 h-8 text-secondary" />
                  </div>
                  <div className="text-5xl font-bold text-foreground mb-2">
                    {products.length > 0 ? (products.reduce((sum, p) => sum + p.commission_rate, 0) / products.length * 100).toFixed(1) : 0}%
                  </div>
                  <div className="text-base font-medium text-muted-foreground">
                    Average Commission
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-accent/20 hover-lift overflow-hidden">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 mb-4">
                    <DollarSign className="w-8 h-8 text-accent" />
                  </div>
                  <div className="text-5xl font-bold text-foreground mb-2">
                    R{products.length > 0 ? (products.reduce((sum, p) => sum + (p.price_zar * p.commission_rate), 0) / products.length).toFixed(0) : 0}
                  </div>
                  <div className="text-base font-medium text-muted-foreground">
                    Avg. Earnings per Sale
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
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
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Showing <span className="font-semibold text-foreground">{displayedProducts.length}</span> of{' '}
                    <span className="font-semibold text-foreground">{filteredProducts.length}</span> products
                    {filteredProducts.length !== products.length && (
                      <span className="text-xs"> (filtered from {products.length} total)</span>
                    )}
                  </p>
                </div>
                
                {/* Quick Actions */}
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowComparison(true)}
                    disabled={compareProducts.length === 0}
                  >
                    <GitCompare className="w-4 h-4 mr-2" />
                    Compare ({compareProducts.length})
                  </Button>
                  <Button variant="outline" size="sm">
                    <Heart className="w-4 h-4 mr-2" />
                    Wishlist ({getWishlistCount()})
                  </Button>
                </div>
              </div>

              {/* Loading State */}
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <ProductSkeleton count={12} />
                </div>
              ) : filteredProducts.length === 0 ? (
                <EmptyState
                  icon={<Package className="w-16 h-16 text-muted-foreground" />}
                  title={products.length === 0 ? "No Products Yet" : "No Products Found"}
                  description={products.length === 0 
                    ? "Click 'Sync Products' above to fetch wellness products from CJ Affiliate" 
                    : "Try adjusting your filters or search term"}
                  actionLabel={products.length === 0 ? "Sync Products Now" : "Clear All Filters"}
                  onAction={products.length === 0 ? syncProducts : handleClearFilters}
                />
              ) : (
                <>
                  {/* Products Grid - Better spacing and responsive */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
                    {displayedProducts.map((product) => (
                      <TakealotProductCard
                        key={`${product.external_product_id}-${product.id}`}
                        product={product}
                        showQuickView={true}
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
                    {!hasMore && displayedProducts.length > INITIAL_LOAD && (
                      <p className="text-sm text-muted-foreground">
                        You've reached the end of the catalog
                      </p>
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

      {/* Product Comparison Modal */}
      <ProductComparison
        products={products.filter(p => compareProducts.includes(p.id))}
        open={showComparison}
        onOpenChange={setShowComparison}
        onRemoveProduct={removeFromCompare}
      />

      {/* Back to Top Button */}
      <BackToTopButton />

      <Footer />
    </div>
  );
};

export default CJAffiliateProducts;
