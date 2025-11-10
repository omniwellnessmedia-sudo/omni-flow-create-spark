import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { useWishlist } from '@/hooks/useWishlist';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Heart, Trash2, ShoppingCart, Search, Filter, SortAsc, ExternalLink } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface WishlistProduct {
  id: string;
  product_id: string;
  notes: string | null;
  created_at: string;
  product: {
    id: string;
    name: string;
    description: string | null;
    category: string | null;
    image_url: string | null;
    price_zar: number;
    price_usd: number;
    commission_rate: number;
    affiliate_url: string;
  };
}

const Wishlist = () => {
  const { user, loading: authLoading } = useAuth();
  const { wishlistItems, toggleWishlist, loading: wishlistLoading, refetch } = useWishlist();
  const navigate = useNavigate();
  
  const [products, setProducts] = useState<WishlistProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<WishlistProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error('Please sign in to view your wishlist');
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchWishlistProducts();
    }
  }, [user, wishlistItems]);

  const fetchWishlistProducts = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_wishlists')
        .select(`
          id,
          product_id,
          notes,
          created_at,
          product:affiliate_products (
            id,
            name,
            description,
            category,
            image_url,
            price_zar,
            price_usd,
            commission_rate,
            affiliate_url
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const typedData = data as unknown as WishlistProduct[];
      setProducts(typedData || []);
      
      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(typedData?.map(item => item.product?.category).filter(Boolean) as string[])
      );
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast.error('Failed to load wishlist');
    }
  };

  useEffect(() => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.product?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.product?.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.product?.category === categoryFilter);
    }

    // Sort
    switch (sortBy) {
      case 'recent':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'price-low':
        filtered.sort((a, b) => (a.product?.price_zar || 0) - (b.product?.price_zar || 0));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.product?.price_zar || 0) - (a.product?.price_zar || 0));
        break;
      case 'name':
        filtered.sort((a, b) => (a.product?.name || '').localeCompare(b.product?.name || ''));
        break;
    }

    setFilteredProducts(filtered);
  }, [products, searchQuery, categoryFilter, sortBy]);

  const handleRemove = async (productId: string) => {
    await toggleWishlist(productId);
    await refetch();
    toast.success('Removed from wishlist');
  };

  if (authLoading || wishlistLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-12 w-64 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-96" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="h-8 w-8 text-primary fill-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              My Wishlist
            </h1>
          </div>
          <p className="text-muted-foreground">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} saved
          </p>
        </div>

        {products.length === 0 ? (
          <Card className="border-2 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Heart className="h-16 w-16 text-muted-foreground/20 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
              <p className="text-muted-foreground mb-6 text-center max-w-md">
                Start adding products you love to keep track of them and shop later
              </p>
              <Button onClick={() => navigate('/cj-products')}>
                Browse Products
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Filters & Search */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="search">Search</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="search"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger id="category">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="sort">Sort By</Label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger id="sort">
                        <SortAsc className="h-4 w-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recent">Recently Added</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                        <SelectItem value="name">Name</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((item) => (
                <Card key={item.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    {item.product?.image_url ? (
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Heart className="h-16 w-16 text-muted-foreground/20" />
                      </div>
                    )}
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemove(item.product_id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg line-clamp-2">{item.product?.name}</CardTitle>
                      {item.product?.category && (
                        <Badge variant="secondary" className="shrink-0 text-xs">
                          {item.product.category}
                        </Badge>
                      )}
                    </div>
                    {item.product?.description && (
                      <CardDescription className="line-clamp-2">
                        {item.product.description}
                      </CardDescription>
                    )}
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-primary">
                          R{item.product?.price_zar?.toFixed(0)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          ${item.product?.price_usd?.toFixed(2)} USD
                        </p>
                      </div>
                      {item.product?.commission_rate > 0 && (
                        <Badge variant="outline" className="bg-green-50">
                          {(item.product.commission_rate * 100).toFixed(0)}% Commission
                        </Badge>
                      )}
                    </div>

                    {item.notes && (
                      <div className="p-3 bg-muted rounded-md">
                        <p className="text-sm text-muted-foreground italic">{item.notes}</p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        className="flex-1"
                        onClick={() => window.open(item.product?.affiliate_url, '_blank')}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Buy Now
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => navigate(`/cj-products/${item.product_id}`)}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
