import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type UserType = 'consumer' | 'provider' | 'affiliate' | 'admin' | 'guest';

/**
 * @deprecated This hook uses the insecure profiles.user_type field.
 * Use useSecureUserRole() from '@/hooks/useSecureUserRole' for authorization checks.
 * This hook should ONLY be used for UI display purposes, NOT security decisions.
 * 
 * Security Warning: profiles.user_type can be modified by users and should never
 * be trusted for access control. Always use useSecureUserRole() for authentication/authorization.
 */
export const useUserRole = () => {
  const [userType, setUserType] = useState<UserType>('guest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.warn(
      '⚠️ useUserRole is DEPRECATED for authorization. Use useSecureUserRole() instead.\n' +
      'This hook should only be used for UI display, NOT security checks.'
    );
    const fetchUserRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setUserType('guest');
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', user.id)
        .single();

      setUserType((profile?.user_type as UserType) || 'consumer');
      setLoading(false);
    };

    fetchUserRole();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchUserRole();
    });

    return () => subscription.unsubscribe();
  }, []);

  return { 
    userType, 
    loading,
    // ⚠️ WARNING: These should NOT be used for authorization decisions
    // Use useSecureUserRole() instead for security-critical checks
    isAffiliate: userType === 'affiliate' || userType === 'provider' || userType === 'admin',
    isCustomer: userType === 'consumer' || userType === 'guest',
    isAdmin: userType === 'admin' // ⚠️ DO NOT USE FOR SECURITY - Use useSecureUserRole().isAdmin
  };
};
