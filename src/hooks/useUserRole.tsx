import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type UserType = 'consumer' | 'provider' | 'affiliate' | 'admin' | 'guest';

export const useUserRole = () => {
  const [userType, setUserType] = useState<UserType>('guest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    isAffiliate: userType === 'affiliate' || userType === 'provider' || userType === 'admin',
    isCustomer: userType === 'consumer' || userType === 'guest',
    isAdmin: userType === 'admin'
  };
};
