import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useWishlist = () => {
  const [wishlistItems, setWishlistItems] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('user_wishlists')
        .select('product_id')
        .eq('user_id', user.id);

      if (error) throw error;

      setWishlistItems(new Set(data?.map(item => item.product_id) || []));
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = async (productId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: 'Sign in required',
          description: 'Please sign in to save favorites',
          variant: 'destructive',
        });
        return false;
      }

      const isInWishlist = wishlistItems.has(productId);

      if (isInWishlist) {
        // Remove from wishlist
        const { error } = await supabase
          .from('user_wishlists')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);

        if (error) throw error;

        setWishlistItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });

        toast({
          title: 'Removed from favorites',
          description: 'Product removed from your wishlist',
        });
      } else {
        // Add to wishlist
        const { error } = await supabase
          .from('user_wishlists')
          .insert({
            user_id: user.id,
            product_id: productId,
          });

        if (error) throw error;

        setWishlistItems(prev => new Set([...prev, productId]));

        toast({
          title: 'Added to favorites',
          description: 'Product saved to your wishlist',
        });
      }

      return true;
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      toast({
        title: 'Error',
        description: 'Failed to update wishlist',
        variant: 'destructive',
      });
      return false;
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.has(productId);
  };

  const getWishlistCount = () => {
    return wishlistItems.size;
  };

  return {
    wishlistItems,
    loading,
    toggleWishlist,
    isInWishlist,
    getWishlistCount,
    refetch: fetchWishlist,
  };
};
