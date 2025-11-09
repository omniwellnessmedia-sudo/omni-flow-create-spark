import { useEffect, useState } from 'react';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { PremiumProductCard } from './PremiumProductCard';
import { supabase } from '@/integrations/supabase/client';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Eye } from 'lucide-react';

interface RecentlyViewedSectionProps {
  currentProductId?: string;
  onQuickView: (id: string) => void;
}

export const RecentlyViewedSection = ({ currentProductId, onQuickView }: RecentlyViewedSectionProps) => {
  const { getRecentlyViewed } = useRecentlyViewed();
  const [products, setProducts] = useState<any[]>([]);
  const recentIds = getRecentlyViewed(currentProductId, 6);

  useEffect(() => {
    fetchRecentProducts();
  }, [recentIds.length]);

  const fetchRecentProducts = async () => {
    if (recentIds.length === 0) return;
    
    const ids = recentIds.map(item => item.id);
    const { data } = await supabase
      .from('affiliate_products')
      .select('*')
      .in('id', ids);
    
    if (data) {
      // Maintain order from recently viewed
      const ordered = ids.map(id => data.find(p => p.id === id)).filter(Boolean);
      setProducts(ordered);
    }
  };

  if (products.length === 0) return null;

  return (
    <section className="py-20 section-divider-top">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <Eye className="w-6 h-6 text-primary" />
          <div>
            <h2 className="text-section-title text-foreground">Recently Viewed</h2>
            <p className="text-muted-foreground mt-1">Continue where you left off</p>
          </div>
        </div>
        
        <Carousel opts={{ align: 'start', loop: false }} className="w-full">
          <CarouselContent className="-ml-4">
            {products.map(product => (
              <CarouselItem key={product.id} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <PremiumProductCard 
                  product={product}
                  onQuickView={onQuickView}
                  isFavorite={false}
                  onFavoriteToggle={() => {}}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="glass-button -left-12" />
          <CarouselNext className="glass-button -right-12" />
        </Carousel>
      </div>
    </section>
  );
};
