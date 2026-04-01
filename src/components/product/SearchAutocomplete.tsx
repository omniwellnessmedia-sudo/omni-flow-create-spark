import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Search, TrendingUp, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import curatedSeed from '@/data/curated_wellness_seed.json';

interface SearchResult {
  id: string;
  name: string;
  category: string;
  price_zar: number;
  image_url: string;
}

const SearchProductThumbnail = ({ src, alt }: { src: string; alt: string }) => {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="w-12 h-12 rounded bg-gradient-to-br from-teal-50 to-teal-100 flex items-center justify-center flex-shrink-0">
        <Package className="w-5 h-5 text-teal-400" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="w-12 h-12 object-cover rounded flex-shrink-0"
      onError={() => setFailed(true)}
    />
  );
};

interface SearchAutocompleteProps {
  onResultClick?: () => void;
}

export const SearchAutocomplete = ({ onResultClick }: SearchAutocompleteProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const searchProducts = async () => {
      setLoading(true);
      try {
        // Search database products
        const { data: dbProducts } = await supabase
          .from('affiliate_products')
          .select('id, name, category, price_zar, image_url')
          .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
          .eq('is_active', true)
          .limit(5);

        // Search curated products
        const curatedProducts = (curatedSeed as any[])
          .filter(p => 
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.description?.toLowerCase().includes(query.toLowerCase()) ||
            p.category.toLowerCase().includes(query.toLowerCase())
          )
          .slice(0, 5);

        // Combine and deduplicate
        const combined = [...curatedProducts, ...(dbProducts || [])];
        const unique = Array.from(
          new Map(combined.map(item => [item.id, item])).values()
        ).slice(0, 8);

        setResults(unique);
        setShowResults(true);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleResultClick = () => {
    setShowResults(false);
    setQuery('');
    onResultClick?.();
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          type="search"
          placeholder="Search wellness products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setShowResults(true)}
          className="pl-10 pr-4"
        />
      </div>

      {showResults && (
        <div className="absolute top-full mt-2 w-full bg-background border border-border rounded-lg shadow-lg z-[100] max-h-96 overflow-hidden">
          <Command className="bg-background">
            <CommandList>
              {loading ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Searching...
                </div>
              ) : results.length === 0 ? (
                <CommandEmpty>
                  <div className="p-4 text-center">
                    <p className="text-sm text-muted-foreground">No products found</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Try different keywords or browse categories
                    </p>
                  </div>
                </CommandEmpty>
              ) : (
                <CommandGroup heading="Products">
                  {results.map((product) => (
                    <Link
                      key={product.id}
                      to={`/store/product/${product.id}`}
                      onClick={handleResultClick}
                    >
                      <CommandItem className="cursor-pointer">
                        <div className="flex items-center gap-3 w-full">
                          <SearchProductThumbnail src={product.image_url} alt={product.name} />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">
                              {product.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {product.category}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-sm">
                              R{product.price_zar.toFixed(0)}
                            </p>
                          </div>
                        </div>
                      </CommandItem>
                    </Link>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
};
