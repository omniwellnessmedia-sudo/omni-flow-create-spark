import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";

interface AffiliateParams {
  productSlug: string;
  channel: string;
  wellnessCategory?: string;
  retreatId?: string;
  consciousnessIntent?: string;
  affiliateProgram?: 'camerastuff' | 'viator' | 'roambuddy';
}

export const useConsciousAffiliate = () => {
  const { user } = useAuth();

  const generateAffiliateLink = (params: AffiliateParams): string => {
    const { productSlug, channel, wellnessCategory, retreatId, affiliateProgram = 'camerastuff' } = params;
    
    // Generate URLs based on affiliate program
    if (affiliateProgram === 'viator') {
      // Viator Partner Shop URL with proper affiliate parameters
      const viatorParams = new URLSearchParams({
        medium: "link",
        medium_version: "shop",
        campaign: "omni-wellness",
      });
      
      if (wellnessCategory) {
        viatorParams.set("wellness_category", wellnessCategory);
      }
      
      // If productSlug is provided, link to specific product, otherwise to partner shop home
      const baseUrl = productSlug 
        ? `https://www.viator.com/tours/${productSlug}`
        : "https://www.viator.com/partner-shop/omniwellnessmedia/";
      
      return `${baseUrl}?${viatorParams.toString()}`;
    }
    
    if (affiliateProgram === 'roambuddy') {
      // RoamBuddy affiliate URL
      const roambuddyParams = new URLSearchParams({
        ref: "omniwellness",
        channel: channel,
      });
      
      if (wellnessCategory) {
        roambuddyParams.set("wellness_category", wellnessCategory);
      }
      
      return `https://www.worldroambuddy.com?${roambuddyParams.toString()}`;
    }
    
    // Default: CameraStuff
    const baseUrl = "https://camerastuff.co.za/products";
    const urlParams = new URLSearchParams({
      a_aid: "omniwellnessmedia",
      channel: channel,
    });

    if (wellnessCategory) {
      urlParams.set("wellness_category", wellnessCategory);
    }
    if (retreatId) {
      urlParams.set("retreat_id", retreatId);
    }

    return `${baseUrl}/${productSlug}?${urlParams.toString()}`;
  };

  const trackProductView = async (
    productName: string,
    channel: string,
    consciousnessIntent?: string
  ) => {
    try {
      await supabase.from("conscious_media_interactions").insert({
        user_id: user?.id || null,
        interaction_type: "view_product",
        product_name: productName,
        channel: channel,
        consciousness_intent: consciousnessIntent,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Failed to track product view:", error);
    }
  };

  const trackAffiliateClick = async (
    productName: string,
    channel: string,
    destinationUrl: string,
    consciousnessIntent?: string,
    wellnessCategory?: string,
    affiliateProgram: 'camerastuff' | 'viator' | 'roambuddy' = 'camerastuff'
  ) => {
    try {
      // Generate unique click ID
      const clickId = `${channel}_${Date.now()}_${crypto.randomUUID()}`;

      // Track in affiliate_clicks table
      const { error: clickError } = await supabase
        .from("affiliate_clicks")
        .insert({
          click_id: clickId,
          affiliate_program_id: affiliateProgram,
          destination_url: destinationUrl,
          referrer_url: window.location.href,
          user_id: user?.id || null,
          device_type: /Mobile/.test(navigator.userAgent) ? "mobile" : "desktop",
          user_agent: navigator.userAgent,
        });

      if (clickError) {
        console.error("Failed to track in affiliate_clicks:", clickError);
      }

      // Track in conscious_media_interactions table
      const { error: interactionError } = await supabase
        .from("conscious_media_interactions")
        .insert({
          user_id: user?.id || null,
          interaction_type: "click_link",
          product_name: productName,
          channel: channel,
          consciousness_intent: consciousnessIntent,
          wellness_category: wellnessCategory,
          timestamp: new Date().toISOString(),
        });

      if (interactionError) {
        console.error("Failed to track in conscious_media_interactions:", interactionError);
      }

      // Store click ID in sessionStorage for conversion tracking
      const storageKey = `last_${affiliateProgram}_click_id`;
      const channelKey = `last_${affiliateProgram}_channel`;
      sessionStorage.setItem(storageKey, clickId);
      sessionStorage.setItem(channelKey, channel);

      return clickId;
    } catch (error) {
      console.error("Failed to track affiliate click:", error);
      return null;
    }
  };

  return {
    generateAffiliateLink,
    trackProductView,
    trackAffiliateClick,
  };
};
