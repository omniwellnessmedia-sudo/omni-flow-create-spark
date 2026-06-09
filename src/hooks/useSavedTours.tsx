import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

/**
 * useSavedTours — wishlist API for tours.
 *
 * Mirrors useWishlist intentionally so the UX layer is identical (toggle,
 * isSaved, count), but reads/writes user_saved_tours instead of user_wishlists.
 * Tours can't reuse user_wishlists because that table's product_id has a hard
 * FK to affiliate_products.
 */
export const useSavedTours = () => {
  const [savedTourIds, setSavedTourIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSaved = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data, error } = await supabase
        .from("user_saved_tours")
        .select("tour_id")
        .eq("user_id", user.id);

      if (error) throw error;
      setSavedTourIds(new Set(data?.map((r: { tour_id: string }) => r.tour_id) || []));
    } catch (err) {
      console.error("Error fetching saved tours:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSaved(); }, [fetchSaved]);

  const toggleSaved = async (tourId: string): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Sign in required",
          description: "Please sign in to save tours to your favorites.",
          variant: "destructive",
        });
        return false;
      }

      const isSaved = savedTourIds.has(tourId);

      if (isSaved) {
        const { error } = await supabase
          .from("user_saved_tours")
          .delete()
          .eq("user_id", user.id)
          .eq("tour_id", tourId);
        if (error) throw error;

        setSavedTourIds(prev => {
          const next = new Set(prev);
          next.delete(tourId);
          return next;
        });
        toast({ title: "Removed from favorites" });
      } else {
        const { error } = await supabase
          .from("user_saved_tours")
          .insert({ user_id: user.id, tour_id: tourId });
        if (error) throw error;

        setSavedTourIds(prev => new Set([...prev, tourId]));
        toast({ title: "Saved to favorites", description: "Find it later in your wishlist." });
      }
      return true;
    } catch (err) {
      console.error("Error toggling saved tour:", err);
      toast({ title: "Error", description: "Couldn't update favorites.", variant: "destructive" });
      return false;
    }
  };

  return {
    savedTourIds,
    loading,
    toggleSaved,
    isSaved: (tourId: string) => savedTourIds.has(tourId),
    count: savedTourIds.size,
    refetch: fetchSaved,
  };
};
