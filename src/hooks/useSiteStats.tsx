import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DudaSiteStats, PartnerWebsiteStats } from '@/types/duda';

export const useSiteStats = (siteName: string | null, autoFetch: boolean = true) => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<DudaSiteStats | null>(null);
  const [historicalStats, setHistoricalStats] = useState<PartnerWebsiteStats[]>([]);

  const fetchStats = async (period: '7d' | '30d' | '90d' = '30d') => {
    if (!siteName) return null;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('duda-get-site-stats', {
        body: { 
          site_name: siteName,
          period: period,
        },
      });

      if (error) throw error;

      if (data.success) {
        setStats(data.stats);
        return data.stats;
      }

      return null;
    } catch (error: any) {
      console.error('Error fetching stats:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchHistoricalStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('partner_website_stats')
        .select('*')
        .eq('provider_id', user.id)
        .order('period_start', { ascending: false })
        .limit(12); // Last 12 periods

      if (error) throw error;

      setHistoricalStats((data || []) as PartnerWebsiteStats[]);
    } catch (error: any) {
      console.error('Error fetching historical stats:', error);
    }
  };

  const getTotalCommission = () => {
    return historicalStats.reduce((total, stat) => {
      return total + (stat.commission_earned_zar || 0);
    }, 0);
  };

  const getTotalCommissionWellCoins = () => {
    return historicalStats.reduce((total, stat) => {
      return total + (stat.commission_earned_wellcoins || 0);
    }, 0);
  };

  const getPendingCommission = () => {
    return historicalStats
      .filter(stat => stat.commission_status === 'pending')
      .reduce((total, stat) => total + (stat.commission_earned_zar || 0), 0);
  };

  useEffect(() => {
    if (autoFetch && siteName) {
      fetchStats();
      fetchHistoricalStats();
    }
  }, [siteName, autoFetch]);

  return {
    loading,
    stats,
    historicalStats,
    fetchStats,
    fetchHistoricalStats,
    getTotalCommission,
    getTotalCommissionWellCoins,
    getPendingCommission,
  };
};
