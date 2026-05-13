import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UserRoleData {
  isAdmin: boolean;
  roles: string[];
  userId: string | null;
  loading: boolean;
  error: Error | null;
}

export const useSecureUserRole = () => {
  const [roleData, setRoleData] = useState<UserRoleData>({
    isAdmin: false,
    roles: [],
    userId: null,
    loading: true,
    error: null,
  });

  const checkUserRole = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setRoleData({
          isAdmin: false,
          roles: [],
          userId: null,
          loading: false,
          error: null,
        });
        return;
      }

      const { data: roles, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      if (error) throw error;

      const roleList = (roles || []).map(r => r.role);

      setRoleData({
        isAdmin: roleList.includes('admin'),
        roles: roleList,
        userId: user.id,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error checking user role:', error);
      setRoleData({
        isAdmin: false,
        roles: [],
        userId: null,
        loading: false,
        error: error as Error,
      });
    }
  };

  useEffect(() => {
    checkUserRole();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkUserRole();
    });

    return () => subscription.unsubscribe();
  }, []);

  return roleData;
};
