import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface FeatureFlag {
  id: string;
  feature_key: string;
  display_name: string;
  description: string | null;
  is_enabled: boolean;
  category: string;
  updated_at: string;
}

export const useFeatureFlags = () => {
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchFlags = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("feature_flags")
        .select("*")
        .order("category", { ascending: true });

      if (error) throw error;
      setFlags(data || []);
    } catch (error) {
      console.error("Error fetching feature flags:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFlags();

    // Subscribe to real-time updates
    const channel = supabase
      .channel("feature_flags_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "feature_flags" },
        () => {
          fetchFlags();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchFlags]);

  const isEnabled = useCallback(
    (featureKey: string): boolean => {
      const flag = flags.find((f) => f.feature_key === featureKey);
      return flag?.is_enabled ?? false;
    },
    [flags]
  );

  const toggleFlag = useCallback(
    async (featureKey: string) => {
      const flag = flags.find((f) => f.feature_key === featureKey);
      if (!flag) return;

      try {
        const { error } = await supabase
          .from("feature_flags")
          .update({
            is_enabled: !flag.is_enabled,
            updated_by: (await supabase.auth.getUser()).data.user?.id,
          })
          .eq("feature_key", featureKey);

        if (error) throw error;

        toast({
          title: "Feature Updated",
          description: `${flag.display_name} is now ${!flag.is_enabled ? "enabled" : "disabled"}`,
        });

        // Optimistic update
        setFlags((prev) =>
          prev.map((f) =>
            f.feature_key === featureKey
              ? { ...f, is_enabled: !f.is_enabled }
              : f
          )
        );
      } catch (error) {
        console.error("Error toggling feature flag:", error);
        toast({
          title: "Error",
          description: "Failed to update feature flag",
          variant: "destructive",
        });
      }
    },
    [flags, toast]
  );

  const getFlagsByCategory = useCallback(
    (category: string): FeatureFlag[] => {
      return flags.filter((f) => f.category === category);
    },
    [flags]
  );

  return {
    flags,
    loading,
    isEnabled,
    toggleFlag,
    getFlagsByCategory,
    refetch: fetchFlags,
  };
};

// Convenience hook for a single feature flag
export const useFeatureFlag = (featureKey: string) => {
  const { isEnabled, loading } = useFeatureFlags();
  return { isEnabled: isEnabled(featureKey), loading };
};
