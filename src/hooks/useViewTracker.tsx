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
          // Increment view count in database
          const { error } = await supabase.rpc('increment_view_count', {
            product_id: productId
          });
          
          if (!error) {
            localStorage.setItem(viewedKey, now.toString());
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
