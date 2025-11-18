import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FilterSidebar } from "@/components/product/FilterSidebar";
import { AffiliateProductCard } from "@/components/affiliate/AffiliateProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Upload, RefreshCw, ShieldCheck, Heart, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useInView } from "react-intersection-observer";
import { useUserRole } from "@/hooks/useUserRole";
import { Badge } from "@/components/ui/badge";

interface AwinProduct {
  id: string;
  affiliate_program_id: string;
  external_product_id: string;
  name: string;
  description: string | null;
  price_usd: number | null;
  price_zar: number | null;
  price_eur: number | null;
  commission_rate: number | null;
  category: string | null;
  image_url: string | null;
  affiliate_url: string;
  is_active: boolean;
  is_featured: boolean;
  advertiser_name: string | null;
  brand: string | null;
}

export default function AwinAffiliateProducts() {
  const [products, setProducts] = useState<AwinProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<AwinProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [displayedCount, setDisplayedCount] = useState(24);
  
  const { userType, isAdmin } = useUserRole();
  
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0,
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("affiliate_products")
        .select("*")
        .eq("affiliate_program_id", "awin")
        .eq("is_active", true)
        .order("is_featured", { ascending: false })
        .order("is_trending", { ascending: false })
        .order("view_count", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
      setFilteredProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleSyncProducts = async (productsData?: any[]) => {
    try {
      setSyncing(true);
      
      if (productsData) {
        // Manual JSON upload sync
        console.log('[AWIN] Invoking manual sync with products:', productsData?.length);
        const { data, error } = await supabase.functions.invoke('sync-awin-products', {
          body: { products: productsData }
        });

        if (error) throw error as any;
        console.log('[AWIN] Manual sync response:', data);
        toast.success(`Synced ${data?.products_synced ?? productsData.length} products successfully`);
      } else {
        // Fetch from Awin API
        console.log('[AWIN] Fetching products from Awin API...');
        const { data, error } = await supabase.functions.invoke('fetch-awin-products');

        if (error) throw error as any;
        console.log('[AWIN] API fetch response:', data);
        
        if (data?.success) {
          toast.success(data.message || `Synced ${data?.products_synced || 0} products from Awin API`);
        } else {
          toast.warning(data?.message || 'Unable to fetch from Awin API');
        }
      }
      
      await fetchProducts();
    } catch (error: any) {
      console.error('Sync error:', error);
      toast.error(`Failed to sync products: ${error?.message ?? 'Unknown error'}`);
    } finally {
      setSyncing(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      console.log('[AWIN] Selected file:', { name: file.name, type: file.type, size: file.size });
      const text = await file.text();
      console.log('[AWIN] File text length:', text.length);

      let parsed: any;
      try {
        parsed = JSON.parse(text);
      } catch (e) {
        console.error('[AWIN] JSON parse failed:', e);
        throw new Error('Could not parse JSON. Please ensure the file content is valid JSON.');
      }

      const productsData = Array.isArray(parsed) ? parsed : parsed?.products;
      if (!Array.isArray(productsData)) {
        throw new Error('Invalid format. Provide an array of products or { "products": [...] }');
      }

      toast.message('Uploading...', { description: `Found ${productsData.length} products. Starting sync...` });
      await handleSyncProducts(productsData);
    } catch (error: any) {
      console.error('File upload error:', error);
      toast.error(`Failed to parse product file: ${error?.message ?? 'Unknown error'}`);
    }
  };

  const filterAndSortProducts = useCallback(() => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.category?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => (a.price_zar || 0) - (b.price_zar || 0));
        break;
      case "price-high":
        filtered.sort((a, b) => (b.price_zar || 0) - (a.price_zar || 0));
        break;
      case "commission":
        // Only allow commission sorting for admins
        if (isAdmin) {
          filtered.sort((a, b) => (b.commission_rate || 0) - (a.commission_rate || 0));
        }
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default: // featured
        filtered.sort((a, b) => {
          if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1;
          return (b.commission_rate || 0) - (a.commission_rate || 0);
        });
    }

    setFilteredProducts(filtered);
    setDisplayedCount(24);
  }, [products, searchQuery, selectedCategory, sortBy]);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [filterAndSortProducts]);

  useEffect(() => {
    if (inView && displayedCount < filteredProducts.length) {
      setDisplayedCount((prev) => Math.min(prev + 24, filteredProducts.length));
    }
  }, [inView, displayedCount, filteredProducts.length]);

  const categories = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/20 via-secondary/20 to-background py-20 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1544367567-0f2fcb009e0b)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Badge variant="secondary" className="gap-1">
                <Sparkles className="h-3 w-3" />
                Curated by Omni Wellness
              </Badge>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Wellness Marketplace
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover carefully vetted wellness products from our trusted partners. 
              Each purchase supports Omni's mission to promote holistic health and conscious living.
            </p>
            
            {/* Trust Signals */}
            <div className="flex flex-wrap gap-6 justify-center pt-4">
              <div className="flex items-center gap-2 text-sm">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">Trusted Partners</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Heart className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">Wellness Focused</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">Carefully Curated</span>
              </div>
            </div>
            
            {/* Admin Controls */}
            {isAdmin && (
              <div className="pt-6 border-t border-border/40 mt-8">
                <p className="text-sm text-muted-foreground mb-3">Admin Controls</p>
                <div className="flex gap-4 justify-center flex-wrap">
                  <Button onClick={fetchProducts} variant="outline" size="sm" className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                  </Button>
                  <Button 
                    onClick={() => handleSyncProducts()} 
                    variant="default" 
                    size="sm" 
                    disabled={syncing}
                    className="gap-2"
                  >
                    <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
                    {syncing ? 'Fetching from API...' : 'Fetch from Awin API'}
                  </Button>
                  <label htmlFor="product-upload">
                    <Button asChild variant="outline" size="sm" disabled={syncing} className="gap-2">
                      <span className="cursor-pointer">
                        <Upload className="h-4 w-4" />
                        {syncing ? 'Uploading...' : 'Upload JSON'}
                      </span>
                    </Button>
                  </label>
                  <input
                    id="product-upload"
                    type="file"
                    accept=".json,.txt,application/json,text/plain"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 space-y-6">
            <div className="space-y-4 p-4 border rounded-lg bg-card">
              <div>
                <h3 className="font-semibold mb-2">Category</h3>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  {isAdmin && <option value="commission">Commission Rate</option>}
                  <option value="name">Name</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Transparency Disclaimer */}
            <div className="mb-6 p-4 bg-muted/50 rounded-lg border border-border/50">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Transparent Partnership:</strong> These products are from our carefully vetted partner brands. 
                When you make a purchase, you'll be redirected to the partner's website to complete your order securely. 
                A small commission from your purchase helps support Omni's wellness mission at no extra cost to you.
              </p>
            </div>

            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  placeholder="Search wellness products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-6">
              <p className="text-muted-foreground">
                Showing {Math.min(displayedCount, filteredProducts.length)} of {filteredProducts.length} products
              </p>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-96" />
                ))}
              </div>
            )}

            {/* Products Grid */}
            {!loading && filteredProducts.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.slice(0, displayedCount).map((product) => (
                    <AffiliateProductCard 
                      key={product.id} 
                      product={product} 
                      currency="ZAR" 
                      isPublicView={!isAdmin}
                    />
                  ))}
                </div>
                {displayedCount < filteredProducts.length && (
                  <div ref={loadMoreRef} className="flex justify-center py-8">
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                  </div>
                )}
              </>
            )}

            {/* No Results */}
            {!loading && filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-xl text-muted-foreground mb-4">No products found</p>
                <p className="text-sm text-muted-foreground mb-6">
                  {products.length === 0 
                    ? isAdmin 
                      ? "Upload your product feed to get started"
                      : "Check back soon for curated wellness products"
                    : "Try adjusting your filters or search terms"}
                </p>
                {products.length === 0 && isAdmin && (
                  <label htmlFor="product-upload-empty">
                    <Button asChild variant="default" disabled={syncing} className="gap-2">
                      <span className="cursor-pointer">
                        <Upload className="h-4 w-4" />
                        Upload Products
                      </span>
                    </Button>
                  </label>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
