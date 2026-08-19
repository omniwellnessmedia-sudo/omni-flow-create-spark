import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UserRoleData {
  isAdmin: boolean;
  isAccountant: boolean;
  /** Catalogue managers onboard local businesses and products. Deliberately
   *  narrower than admin: no accounting, leads, team management or role
   *  assignment. Admins and super admins satisfy it too. */
  isCatalogueManager: boolean;
  roles: string[];
  userId: string | null;
  loading: boolean;
  error: Error | null;
}

export const useSecureUserRole = () => {
  const [roleData, setRoleData] = useState<UserRoleData>({
    isAdmin: false,
    isAccountant: false,
    isCatalogueManager: false,
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
          isAccountant: false,
          isCatalogueManager: false,
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
        isAdmin: roleList.includes('admin') || roleList.includes('super_admin'),
        // Cast to string[]: the generated Supabase types predate the 'accountant'
        // role (added by migration), so .includes('accountant') is a type error even
        // though it matches correctly at runtime.
        isAccountant: (roleList as string[]).includes('accountant'),
        // Same cast reason as accountant above: the generated Supabase types
        // predate this role. Admins inherit it so they are never locked out of
        // a screen they are responsible for approving.
        isCatalogueManager:
          (roleList as string[]).includes('catalogue_manager') ||
          roleList.includes('admin') ||
          roleList.includes('super_admin'),
        roles: roleList,
        userId: user.id,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error checking user role:', error);
      setRoleData({
        isAdmin: false,
        isAccountant: false,
        isCatalogueManager: false,
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
