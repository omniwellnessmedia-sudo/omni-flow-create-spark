import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ProviderRole {
  provider_id: string;
  provider_name: string;
  role: 'owner' | 'manager' | 'staff';
  permissions: string[];
}

export const useProviderRoles = (userId: string | null) => {
  const [roles, setRoles] = useState<ProviderRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setRoles([]);
      setLoading(false);
      return;
    }

    const fetchRoles = async () => {
      try {
        const { data, error } = await supabase
          .from('provider_roles')
          .select(`
            role,
            permissions,
            provider_id,
            provider_profiles!inner(business_name)
          `)
          .eq('user_id', userId);

        if (error) throw error;

        const providerRoles: ProviderRole[] = (data || []).map((item: any) => ({
          provider_id: item.provider_id,
          provider_name: item.provider_profiles?.business_name || 'Unknown Provider',
          role: item.role as 'owner' | 'manager' | 'staff',
          permissions: item.permissions || [],
        }));

        setRoles(providerRoles);
      } catch (error) {
        console.error('Error fetching provider roles:', error);
        setRoles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, [userId]);

  return { roles, loading };
};
