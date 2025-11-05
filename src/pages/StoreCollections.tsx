import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Search, SlidersHorizontal, Heart, ExternalLink } from 'lucide-react';
import seedProducts from '@/data/cjSeedProducts.json';

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

const StoreCollections = () => {
  const { handle } = useParams<{ handle: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [currency, setCurrency] = useState<'USD' | 'ZAR' | 'EUR'>('ZAR');
  const { toast } = useToast();

  const collectionTitle = handle?.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ') || 'All Products';

  useEffect(() => {
    fetchProducts();
  }, [handle]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('affiliate_products')
        .select('*')
        .eq('affiliate_program_id', 'cj')
        .eq('is_active', true)
        .ilike('category', handle ? `%${handle.replace('-', ' ')}%` : '%');

      if (error) throw error;

      // Use seed products as fallback if database is empty
      const productsToUse = data && data.length > 0 
        ? data 
        : (seedProducts as any[]).filter(p => 
            !handle || p.category.toLowerCase().includes(handle.replace('-', ' '))
          );

      setProducts(productsToUse);
    } catch (error) {
      console.error('Error fetching products:', error);
      // Use seed products on error
      setProducts((seedProducts as any[]).filter(p => 
        !handle || p.category.toLowerCase().includes(handle.replace('-', ' '))
      ));
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products
    .filter(p => 
      !searchTerm || 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price_low':
          return a.price_zar - b.price_zar;
        case 'price_high':
          return b.price_zar - a.price_zar;
        case 'commission':
          return b.commission_rate - a.commission_rate;
        default:
          return 0;
      }
    });

  const formatPrice = (product: Product) => {
    const prices = {
      USD: `$${product.price_usd.toFixed(2)}`,
      ZAR: `R${product.price_zar.toFixed(2)}`,
      EUR: `€${product.price_eur.toFixed(2)}`,
    };
    return prices[currency];
  };

  return (
    <div className="min-h-screen bg-background">
      <UnifiedNavigation />
      <main className="pt-20 pb-16">
        {/* Collection Header */}
        <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{collectionTitle}</h1>
            <p className="text-lg text-muted-foreground">
              {filteredProducts.length} products available
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price_low">Price: Low to High</SelectItem>
                <SelectItem value="price_high">Price: High to Low</SelectItem>
                <SelectItem value="commission">Highest Commission</SelectItem>
              </SelectContent>
            </Select>
            <Select value={currency} onValueChange={(v) => setCurrency(v as any)}>
              <SelectTrigger className="w-full md:w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ZAR">ZAR (R)</SelectItem>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Link key={product.id} to={`/store/product/${product.id}`}>
                  <Card className="group hover:shadow-xl transition-all duration-300 h-full">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
                        onClick={(e) => {
                          e.preventDefault();
                          toast({ title: 'Added to favorites' });
                        }}
                      >
                        <Heart className="w-5 h-5" />
                      </Button>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">
                          {formatPrice(product)}
                        </span>
                        <Badge variant="secondary">
                          {(product.commission_rate * 100).toFixed(0)}% comm.
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default StoreCollections;
