import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AIContentType, AIContentSuggestion, ContentGenerationContext } from '@/types/duda';

export const useAIContent = () => {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<AIContentSuggestion[]>([]);
  const { toast } = useToast();

  const generateContent = async (
    contentType: AIContentType,
    context: ContentGenerationContext
  ) => {
    setLoading(true);
    setSuggestions([]);
    
    try {
      const { data, error } = await supabase.functions.invoke('duda-generate-content', {
        body: {
          content_type: contentType,
          context: context,
        },
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate content');
      }

      setSuggestions(data.suggestions || []);

      toast({
        title: 'Content Generated!',
        description: `Generated ${data.suggestions?.length || 0} variations in ${Math.round(data.generation_time_ms / 1000)}s`,
      });

      return data;
    } catch (error: any) {
      console.error('Error generating content:', error);
      
      // Handle rate limit errors
      if (error.message?.includes('429') || error.message?.includes('rate limit')) {
        toast({
          title: 'Rate Limit Exceeded',
          description: 'Too many AI requests. Please wait a moment and try again.',
          variant: 'destructive',
        });
      } else if (error.message?.includes('402') || error.message?.includes('payment')) {
        toast({
          title: 'Credits Required',
          description: 'Please add AI credits to your workspace to continue generating content.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Generation Failed',
          description: error.message || 'Could not generate content',
          variant: 'destructive',
        });
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getContentHistory = async (contentType?: AIContentType) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let query = supabase
        .from('website_ai_content')
        .select('*')
        .eq('provider_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (contentType) {
        query = query.eq('content_type', contentType);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data;
    } catch (error: any) {
      console.error('Error fetching content history:', error);
      return [];
    }
  };

  const rateContent = async (contentId: string, rating: number) => {
    try {
      const { error } = await supabase
        .from('website_ai_content')
        .update({ rating: rating })
        .eq('id', contentId);

      if (error) throw error;

      toast({
        title: 'Rating Saved',
        description: 'Thank you for your feedback!',
      });
    } catch (error: any) {
      console.error('Error rating content:', error);
    }
  };

  const markAsApplied = async (contentId: string) => {
    try {
      const { error } = await supabase
        .from('website_ai_content')
        .update({ is_applied: true })
        .eq('id', contentId);

      if (error) throw error;
    } catch (error: any) {
      console.error('Error marking content as applied:', error);
    }
  };

  const clearSuggestions = () => {
    setSuggestions([]);
  };

  return {
    loading,
    suggestions,
    generateContent,
    getContentHistory,
    rateContent,
    markAsApplied,
    clearSuggestions,
  };
};
