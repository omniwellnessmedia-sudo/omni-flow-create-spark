import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Search, SlidersHorizontal, Heart, Scale } from 'lucide-react';
import { TakealotProductCard } from '@/components/product/TakealotProductCard';
import { FilterSidebar, FilterState } from '@/components/product/FilterSidebar';
import { ProductComparison } from '@/components/product/ProductComparison';
import { WishlistDrawer } from '@/components/product/WishlistDrawer';
import { SearchAutocomplete } from '@/components/product/SearchAutocomplete';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useProductComparison } from '@/hooks/useProductComparison';
import { useWishlist } from '@/hooks/useWishlist';
import curatedSeed from '@/data/curated_wellness_seed.json';

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
  brand?: string;
  advertiser_name?: string;
}

const StoreCollections = () => {
  const { handle } = useParams<{ handle: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const { toast } = useToast();
  
  // Comparison and Wishlist state
  const { comparisonProducts, count: comparisonCount } = useProductComparison();
  const { getWishlistCount } = useWishlist();
  const [showComparison, setShowComparison] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [comparisonProductsData, setComparisonProductsData] = useState<Product[]>([]);
  
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 5000],
    selectedBrands: [],
    selectedCategories: [],
    minCommission: 0,
    minRating: 0,
    inStock: false,
    onSale: false,
  });

  const collectionTitle = handle?.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ') || 'All Products';

  useEffect(() => {
    fetchProducts();
  }, [handle]);

  useEffect(() => {
    if (comparisonProducts.length > 0) {
      fetchComparisonProducts();
    }
  }, [comparisonProducts]);

  const fetchComparisonProducts = async () => {
    const { data } = await supabase
      .from('affiliate_products')
      .select('*')
      .in('id', comparisonProducts);
    
    const dbProducts = data || [];
    const seedProducts = (curatedSeed as any[]).filter(p => 
      comparisonProducts.includes(p.id)
    );
    
    setComparisonProductsData([...seedProducts, ...dbProducts] as any);
  };

  const fetchProducts = async () => {
    try {
      let query = supabase
        .from('affiliate_products')
        .select('*')
        .eq('is_active', true);

      // Filter by category if handle is provided
      if (handle) {
        query = query.ilike('category', `%${handle.replace('-', ' ')}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Combine database products with curated seed products
      const dbProducts = data || [];
      const seedData = (curatedSeed as any[]).filter(p => 
        !handle || p.category.toLowerCase().includes(handle.replace('-', ' '))
      );
      
      setProducts([...seedData, ...dbProducts]);
    } catch (error) {
      console.error('Error fetching products:', error);
      // Use curated seed products as fallback
      setProducts((curatedSeed as any[]).filter(p => 
        !handle || p.category.toLowerCase().includes(handle.replace('-', ' '))
      ));
    } finally {
      setLoading(false);
    }
  };

  // Extract unique brands and categories
  const uniqueBrands = Array.from(new Set(products.map(p => p.brand).filter(Boolean))) as string[];
  const uniqueCategories = Array.from(new Set(products.map(p => p.category).filter(Boolean))) as string[];

  const filteredProducts = products
    .filter(p => {
      // Search filter
      if (searchTerm && !p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !p.description?.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Price range filter
      const displayPrice = (p as any).sale_price_zar || p.price_zar;
      if (displayPrice < filters.priceRange[0] || displayPrice > filters.priceRange[1]) {
        return false;
      }

      // Brand filter
      if (filters.selectedBrands.length > 0 && !filters.selectedBrands.includes(p.brand || '')) {
        return false;
      }

      // Category filter
      if (filters.selectedCategories.length > 0 && !filters.selectedCategories.includes(p.category)) {
        return false;
      }

      // Commission filter
      if (filters.minCommission > 0 && (p.commission_rate * 100) < filters.minCommission) {
        return false;
      }

      // Rating filter
      if (filters.minRating > 0 && ((p as any).rating || 0) < filters.minRating) {
        return false;
      }

      // Sale filter
      if (filters.onSale && !(p as any).sale_price_zar) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price_low':
          return ((a as any).sale_price_zar || a.price_zar) - ((b as any).sale_price_zar || b.price_zar);
        case 'price_high':
          return ((b as any).sale_price_zar || b.price_zar) - ((a as any).sale_price_zar || a.price_zar);
        case 'commission':
          return b.commission_rate - a.commission_rate;
        case 'rating':
          return ((b as any).rating || 0) - ((a as any).rating || 0);
        case 'newest':
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        default:
          // Featured first
          if ((b as any).is_featured && !(a as any).is_featured) return 1;
          if ((a as any).is_featured && !(b as any).is_featured) return -1;
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-background">
      <UnifiedNavigation />
      <main className="pt-20 pb-16">
        {/* Collection Header */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-12 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {collectionTitle}
            </h1>
            <p className="text-lg text-muted-foreground">
              {filteredProducts.length} curated wellness products • Free delivery in South Africa 🇿🇦
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Action Bar */}
          <div className="flex gap-3 mb-6">
            <Button
              variant="outline"
              onClick={() => setShowComparison(true)}
              disabled={comparisonCount === 0}
            >
              <Scale className="w-4 h-4 mr-2" />
              Compare
              {comparisonCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {comparisonCount}
                </Badge>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowWishlist(true)}
            >
              <Heart className="w-4 h-4 mr-2" />
              Wishlist
              {getWishlistCount() > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {getWishlistCount()}
                </Badge>
              )}
            </Button>
          </div>

          {/* Search & Sort Bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex-1">
              <SearchAutocomplete />
            </div>
            
            {/* Mobile Filter Toggle */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="sm:hidden">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto">
                <FilterSidebar
                  onFilterChange={setFilters}
                  brands={uniqueBrands}
                  categories={uniqueCategories}
                  currentFilters={filters}
                />
              </SheetContent>
            </Sheet>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-56">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price_low">Price: Low to High</SelectItem>
                <SelectItem value="price_high">Price: High to Low</SelectItem>
                <SelectItem value="commission">Highest Commission</SelectItem>
                <SelectItem value="rating">Customer Rating</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Layout: Sidebar + Products */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Desktop Filter Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24">
                <FilterSidebar
                  onFilterChange={setFilters}
                  brands={uniqueBrands}
                  categories={uniqueCategories}
                  currentFilters={filters}
                />
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {loading ? (
                <div className="text-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">Loading wellness products...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-xl text-muted-foreground mb-2">No products found</p>
                  <p className="text-sm text-muted-foreground">Try adjusting your filters or search terms</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <TakealotProductCard 
                      key={product.id} 
                      product={product as any}
                      showQuickView={true}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      
      {/* Comparison Modal */}
      <ProductComparison
        products={comparisonProductsData as any}
        open={showComparison}
        onOpenChange={setShowComparison}
        onRemoveProduct={() => fetchComparisonProducts()}
      />
      
      {/* Wishlist Drawer */}
      <WishlistDrawer
        open={showWishlist}
        onOpenChange={setShowWishlist}
      />
      
      <Footer />
    </div>
  );
};

export default StoreCollections;
