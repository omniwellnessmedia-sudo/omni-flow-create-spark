import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DudaSite } from '@/types/duda';

export const useDudaSite = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createSite = async (businessName: string, customSubdomain?: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('duda-create-partner-site', {
        body: {
          business_name: businessName,
          custom_subdomain: customSubdomain,
        },
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || 'Failed to create site');
      }

      toast({
        title: 'Website Created!',
        description: 'Your Omni Wellness partner website is ready.',
      });

      return data;
    } catch (error: any) {
      console.error('Error creating site:', error);
      
      // Enhanced error messages based on error type
      let errorMessage = 'Could not create your website. Please try again.';
      
      if (error.message?.includes('401')) {
        errorMessage = 'Authentication failed with Duda. Please contact support to verify your account setup.';
      } else if (error.message?.includes('template')) {
        errorMessage = 'Website template not found. Please contact support.';
      } else if (error.message?.includes('already exists')) {
        errorMessage = 'A website already exists for your account.';
      } else if (error.message?.includes('credentials not configured')) {
        errorMessage = 'Website service not configured. Please contact support.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: 'Creation Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateContent = async (siteName: string, updates: Record<string, any>) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('duda-update-site-content', {
        body: {
          site_name: siteName,
          updates: updates,
        },
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || 'Failed to update content');
      }

      toast({
        title: 'Content Updated',
        description: data.auto_published 
          ? 'Changes are now live on your website!'
          : 'Changes saved. Publish your site to make them live.',
      });

      return data;
    } catch (error: any) {
      console.error('Error updating content:', error);
      toast({
        title: 'Update Failed',
        description: error.message || 'Could not update content',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const publishSite = async (siteName: string, action: 'publish' | 'unpublish' = 'publish') => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('duda-publish-site', {
        body: {
          site_name: siteName,
          action: action,
        },
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || `Failed to ${action} site`);
      }

      toast({
        title: action === 'publish' ? 'Website Published!' : 'Website Unpublished',
        description: action === 'publish' 
          ? `Your site is now live at ${data.live_url}`
          : 'Your website is no longer publicly accessible',
      });

      return data;
    } catch (error: any) {
      console.error(`Error ${action}ing site:`, error);
      toast({
        title: `${action === 'publish' ? 'Publish' : 'Unpublish'} Failed`,
        description: error.message || `Could not ${action} your website`,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteSite = async (siteName: string, permanent: boolean = false) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('duda-delete-site', {
        body: {
          site_name: siteName,
          permanent: permanent,
        },
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || 'Failed to delete site');
      }

      toast({
        title: 'Website Deleted',
        description: permanent 
          ? 'Your website has been permanently deleted'
          : 'Your website has been deactivated (can be restored)',
      });

      return data;
    } catch (error: any) {
      console.error('Error deleting site:', error);
      toast({
        title: 'Deletion Failed',
        description: error.message || 'Could not delete your website',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getSite = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('provider_websites')
        .select('*')
        .eq('provider_id', user.id)
        .maybeSingle();

      if (error) throw error;

      return data as DudaSite | null;
    } catch (error: any) {
      console.error('Error fetching site:', error);
      return null;
    }
  };

  return {
    loading,
    createSite,
    updateContent,
    publishSite,
    deleteSite,
    getSite,
  };
};
