
import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface ProviderRole {
  provider_id: string;
  provider_name: string;
  role: 'owner' | 'manager' | 'staff';
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => void;
  isProvider: (providerId?: string) => boolean;
  getProviderRoles: () => ProviderRole[];
  hasProviderPermission: (providerId: string, permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: () => {},
  isProvider: () => false,
  getProviderRoles: () => [],
  hasProviderPermission: () => false,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false); // Set to false to avoid blocking

  useEffect(() => {
    let mounted = true;
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        try {
          setSession(session);
          setUser(session?.user ?? null);
        } catch (error) {
          console.error('Auth state change error:', error);
        }
      }
    );

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (error) throw error;
        
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Failed to get initial session:', error);
        if (mounted) {
          setSession(null);
          setUser(null);
        }
      }
    };

    getInitialSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // Provider role functions for future Sandy/provider authentication
  const getProviderRoles = (): ProviderRole[] => {
    if (!user) return [];
    
    // Check user metadata for provider roles
    const providerRoles = user.user_metadata?.provider_roles || [];
    
    // Hardcoded roles for Sandy (temporary until proper DB setup)
    const sandyProviderRoles: ProviderRole[] = [];
    if (user.email === 'sandy@druyogacapetown.co.za') {
      sandyProviderRoles.push({
        provider_id: 'sandy-mitchell',
        provider_name: 'Sandy Mitchell - Dru Yoga Cape Town',
        role: 'owner',
        permissions: ['view_profile', 'edit_profile', 'manage_bookings', 'view_analytics', 'manage_services']
      });
    }
    
    // Admin access
    if (user.email === 'admin@omniwellness.co.za') {
      sandyProviderRoles.push({
        provider_id: 'sandy-mitchell',
        provider_name: 'Sandy Mitchell - Dru Yoga Cape Town',
        role: 'manager',
        permissions: ['view_profile', 'edit_profile', 'manage_bookings', 'view_analytics']
      });
    }
    
    return [...providerRoles, ...sandyProviderRoles];
  };

  const isProvider = (providerId?: string): boolean => {
    const roles = getProviderRoles();
    if (!providerId) return roles.length > 0;
    return roles.some(role => role.provider_id === providerId);
  };

  const hasProviderPermission = (providerId: string, permission: string): boolean => {
    const roles = getProviderRoles();
    const providerRole = roles.find(role => role.provider_id === providerId);
    return providerRole?.permissions.includes(permission) || false;
  };

  // Removed loading state blocking to fix white screen issue

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      signOut, 
      isProvider, 
      getProviderRoles, 
      hasProviderPermission 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
