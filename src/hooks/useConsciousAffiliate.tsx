import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import {
  PROGRAMME_ACTIVE,
  buildViatorLink,
} from "@/config/programmes";

interface AffiliateParams {
  productSlug?: string;
  fullProductUrl?: string;
  channel: string;
  wellnessCategory?: string;
  retreatId?: string;
  consciousnessIntent?: string;
  affiliateProgram?: 'camerastuff' | 'viator' | 'roambuddy';
}

export const useConsciousAffiliate = () => {
  const { user } = useAuth();

  const generateAffiliateLink = (params: AffiliateParams): string => {
    const {
      productSlug,
      fullProductUrl,
      channel,
      wellnessCategory,
      retreatId,
      affiliateProgram = 'viator',
    } = params;

    if (affiliateProgram === 'viator') {
      // Attribution is pid + mcid and nothing else. The previous implementation
      // sent `search`, `medium_version` and `wellness_category`, none of which
      // Viator documents, and omitted pid/mcid entirely, so nothing it
      // generated could be paid out. See src/config/programmes.ts.
      return buildViatorLink({
        productPath: fullProductUrl ?? (productSlug ? `/tours/${productSlug}` : undefined),
        campaign: channel,
      });
    }

    if (affiliateProgram === 'roambuddy') {
      const roambuddyParams = new URLSearchParams({
        ref: "omniwellness",
        channel: channel,
      });

      if (wellnessCategory) {
        roambuddyParams.set("wellness_category", wellnessCategory);
      }

      return `https://www.worldroambuddy.com?${roambuddyParams.toString()}`;
    }

    if (affiliateProgram === 'camerastuff') {
      // The CameraStuff affiliate account was deactivated by the merchant in
      // August 2026. Emitting tagged links for a programme we are not in earns
      // nothing and misrepresents the relationship, so we send visitors to the
      // plain product page with no affiliate tag until re-application is
      // approved. Flip PROGRAMME_ACTIVE.camerastuff back to true at that point
      // and this returns to normal.
      const baseProductUrl =
        fullProductUrl || `https://camerastuff.co.za/products/${productSlug}`;

      if (!PROGRAMME_ACTIVE.camerastuff) {
        return baseProductUrl;
      }

      const urlParams = new URLSearchParams({
        a_aid: "omniwellnessmedia",
        channel: channel,
      });
      if (wellnessCategory) urlParams.set("wellness_category", wellnessCategory);
      if (retreatId) urlParams.set("retreat_id", retreatId);

      const separator = baseProductUrl.includes('?') ? '&' : '?';
      return `${baseProductUrl}${separator}${urlParams.toString()}`;
    }

    return fullProductUrl ?? "#";
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
