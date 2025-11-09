import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PremiumProductCard } from './PremiumProductCard';
import { Sparkles } from 'lucide-react';

interface RelatedProductsSectionProps {
  category: string;
  currentProductId: string;
  onQuickView: (id: string) => void;
}

export const RelatedProductsSection = ({ category, currentProductId, onQuickView }: RelatedProductsSectionProps) => {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetchRelatedProducts();
  }, [category, currentProductId]);

  const fetchRelatedProducts = async () => {
    const { data } = await supabase
      .from('affiliate_products')
      .select('*')
      .eq('category', category)
      .eq('is_active', true)
      .neq('id', currentProductId)
      .limit(4);
    
    if (data) setProducts(data);
  };

  if (products.length === 0) return null;

  return (
    <section className="py-20 section-divider-top bg-gradient-to-br from-muted/30 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <Sparkles className="w-6 h-6 text-primary" />
          <div>
            <h2 className="text-section-title text-foreground">Similar Products</h2>
            <p className="text-muted-foreground mt-1">You might also like these</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <PremiumProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
              isFavorite={false}
              onFavoriteToggle={() => {}}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
