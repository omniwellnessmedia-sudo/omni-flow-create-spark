import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useViewTracker = (productId: string | undefined) => {
  useEffect(() => {
    if (!productId) return;

    const trackView = async () => {
      // Track in localStorage to prevent duplicate counts
      const viewedKey = `viewed_${productId}`;
      const lastViewed = localStorage.getItem(viewedKey);
      const now = Date.now();
      
      // Only count as new view if not viewed in last 24 hours
      if (!lastViewed || now - parseInt(lastViewed) > 24 * 60 * 60 * 1000) {
        try {
          // Fetch current product to get view count
          const { data: product } = await supabase
            .from('affiliate_products')
            .select('view_count')
            .eq('id', productId)
            .single();
          
          if (product) {
            // Increment view count
            const { error } = await supabase
              .from('affiliate_products')
              .update({ view_count: (product.view_count || 0) + 1 })
              .eq('id', productId);
            
            if (!error) {
              localStorage.setItem(viewedKey, now.toString());
            }
          }
        } catch (err) {
          console.error('Error tracking view:', err);
        }
      }
    };

    // Track after 3 seconds (user actually viewing, not just passing through)
    const timer = setTimeout(trackView, 3000);
    return () => clearTimeout(timer);
  }, [productId]);
};
