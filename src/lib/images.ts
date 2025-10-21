// Centralized Image Management System for Omni Wellness Platform
// All images from Supabase Storage with actual filenames

const SUPABASE_URL = 'https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public';

const CORE_IMAGES = {
  sandy: {
    profile: `${SUPABASE_URL}/provider-images/Sandy/Sandy%20_August%20shoot%20_%20omni-2.png`,
    yoga: `${SUPABASE_URL}/provider-images/Sandy/Sandy%20_August%20shoot%20_%20omni-3.png`,
    meditation: `${SUPABASE_URL}/provider-images/Sandy/Sandy%20_August%20shoot%20_%20omni-4.png`,
    outdoor: `${SUPABASE_URL}/provider-images/Sandy/Sandy%20_August%20shoot%20_%20omni-6.png`,
    portrait: `${SUPABASE_URL}/provider-images/Sandy/Sandy%20_August%20shoot%20_%20omni-7.png`,
    wellness: `${SUPABASE_URL}/provider-images/Sandy/Sandy%20_August%20shoot%20_%20omni-8.png`,
    consultation: `${SUPABASE_URL}/provider-images/Sandy/Sandy%20_August%20shoot%20_%20omni-10.png`,
    workshop: `${SUPABASE_URL}/provider-images/Sandy/Sandy%20_August%20shoot%20_%20omni-11.png`,
    hero: `${SUPABASE_URL}/provider-images/Sandy/Sandy%20_August%20shoot%20_%20omni-13.png`,
  },
  services: {
    retreat1: `${SUPABASE_URL}/provider-images/OMNI_OLIVETREE_RETREAT_2024.jpg`,
    retreat2: `${SUPABASE_URL}/provider-images/OMNI_OLIVETREE_RETREAT_2024-5.jpg`,
    retreat3: `${SUPABASE_URL}/provider-images/OMNI_OLIVETREE_RETREAT_2024-6.jpg`,
    retreat4: `${SUPABASE_URL}/provider-images/OMNI_OLIVETREE_RETREAT_2024-10.jpg`,
    retreat5: `${SUPABASE_URL}/provider-images/OMNI_OLIVETREE_RETREAT_2024-17.jpg`,
    retreat6: `${SUPABASE_URL}/provider-images/OMNI_OLIVETREE_RETREAT_2024-43.jpg`,
    graduation1: `${SUPABASE_URL}/provider-images/OMNI_KALK%20BAY_%20GRADUATION-8.jpg`,
    graduation2: `${SUPABASE_URL}/provider-images/OMNI_KALK%20BAY_%20GRADUATION-48.jpg`,
    community1: `${SUPABASE_URL}/provider-images/Omni%20wellness%20community%20project%201.JPG`,
    community2: `${SUPABASE_URL}/provider-images/Omni%20wellness%20community%20project%202.JPG`,
    community3: `${SUPABASE_URL}/provider-images/Omni%20wellness%20community%20project%203.jpg`,
    team: `${SUPABASE_URL}/provider-images/Omni%20wellness%20team.jpg`,
    wellness1: `${SUPABASE_URL}/provider-images/wellness.jpg`,
    wellness2: `${SUPABASE_URL}/provider-images/wellness%202.jpg`,
    landmark: `${SUPABASE_URL}/provider-images/OMNI_LANDMARK%20FOUNDATION_IMAGES_JUNE%202024-2.jpg`,
    artscape: `${SUPABASE_URL}/provider-images/SAGA_HKL_OMNI_Artscape-9.jpg`,
  },
  locations: {
    view1: `${SUPABASE_URL}/location-images/_MG_0220.jpg`,
    view2: `${SUPABASE_URL}/location-images/_MG_0235.jpg`,
    coastal: `${SUPABASE_URL}/location-images/image00004.jpeg`,
    capeTown1: `${SUPABASE_URL}/location-images/IMG_20241010_142332.jpg`,
    capeTown2: `${SUPABASE_URL}/location-images/IMG_20241010_174621.jpg`,
    capeTown3: `${SUPABASE_URL}/location-images/IMG_20241026_100612.jpg`,
    capeTown4: `${SUPABASE_URL}/location-images/IMG_20241026_111216.jpg`,
    capeTown5: `${SUPABASE_URL}/location-images/IMG_20241026_123154.jpg`,
    sunrise: `${SUPABASE_URL}/location-images/IMG_20250117_060441.jpg`,
  },
  products: {
    logo: `${SUPABASE_URL}/product-images/2%20be%20well%20NEW%20LOGO_OMNI.png`,
    allPurpose: `${SUPABASE_URL}/product-images/all%20purpose%20cleaner%20stock.png`,
    product1: `${SUPABASE_URL}/product-images/OMNI_2BeWell-7.jpg`,
    product2: `${SUPABASE_URL}/product-images/OMNI_2BeWell-8.jpg`,
    spray: `${SUPABASE_URL}/product-images/Minimal%20Natural%20spray%20Instagram%20post.png`,
  },
  community: {
    empowerment1: `${SUPABASE_URL}/community-images/OMNI_Women%20Empowerment%20course%20-%20the%20lookout_.jpg`,
    khoe1: `${SUPABASE_URL}/community-images/RR_OMNI_Khoe%20Meisie_WRM-2.jpg`,
  },
  logos: {
    omniPrimary: `${SUPABASE_URL}/partner-logos/OMNI%20LOGO%20FA-06(1).png`,
    omniIcon: `${SUPABASE_URL}/partner-logos/OMNI%20WELLNESS%20MEDIA%20ICON.png`,
    bwc: `${SUPABASE_URL}/partner-logos/Bwc%20logo.JPG`,
    drPhil1: `${SUPABASE_URL}/partner-logos/DR%20PHIL%20LOGO%20NPO_OMNI-01.png`,
    amor: `${SUPABASE_URL}/partner-logos/1April2025_Amor%20logo%20png.png`,
    apex: `${SUPABASE_URL}/partner-logos/APEXAdvocacy_logo_blackonwhitebubble-01.png`,
    kai: `${SUPABASE_URL}/partner-logos/Kai%20Logo%20BW.png`,
    muddyRambler: `${SUPABASE_URL}/partner-logos/Muddy%20Rambler%20Logo%20Square%20White.png`,
    muizKitchen: `${SUPABASE_URL}/partner-logos/muiz-kitchen-logo3.jpg`,
    valleyOfPlenty: `${SUPABASE_URL}/partner-logos/The%20Valley%20of%20Plenty%20Logo%20No%20Background%20(2).png`,
  },
};

export const IMAGES = {
  ...CORE_IMAGES,
  sandy: { ...CORE_IMAGES.sandy, portrait1: CORE_IMAGES.sandy.portrait, portrait2: CORE_IMAGES.sandy.profile, portrait3: CORE_IMAGES.sandy.consultation, action1: CORE_IMAGES.sandy.yoga, action2: CORE_IMAGES.sandy.outdoor, closeup: CORE_IMAGES.sandy.portrait, fallback: CORE_IMAGES.sandy.profile, nature: CORE_IMAGES.sandy.outdoor, teaching: CORE_IMAGES.sandy.workshop, beach: CORE_IMAGES.sandy.outdoor },
  wellness: { marketplace: CORE_IMAGES.services.wellness1, community: CORE_IMAGES.services.community1, deals: CORE_IMAGES.services.wellness2, meditation: CORE_IMAGES.sandy.meditation, yoga: CORE_IMAGES.sandy.yoga, retreat: CORE_IMAGES.services.retreat1, retreat2: CORE_IMAGES.services.retreat2, team: CORE_IMAGES.services.team, communityProject1: CORE_IMAGES.services.community1, communityProject2: CORE_IMAGES.services.community2, communityProject3: CORE_IMAGES.services.community3, wellness: CORE_IMAGES.services.wellness1 },
  tours: { mountain: CORE_IMAGES.locations.view1, capeTown: CORE_IMAGES.locations.capeTown1, retreat: CORE_IMAGES.services.retreat1 },
  business: { consulting: CORE_IMAGES.services.team, partnership: CORE_IMAGES.services.community1 },
  media: { production: CORE_IMAGES.services.artscape, podcast: CORE_IMAGES.services.wellness1 },
  ai: { tools: CORE_IMAGES.services.wellness1 },
  omni: { logo: CORE_IMAGES.logos.omniPrimary, logoAlt: CORE_IMAGES.logos.omniIcon, team: CORE_IMAGES.services.team },
  partners: { twoBeWell: CORE_IMAGES.products.logo, apex: CORE_IMAGES.logos.apex, mbs: CORE_IMAGES.logos.muddyRambler, drPhil: CORE_IMAGES.logos.drPhil1, amor: CORE_IMAGES.logos.amor, baboonConservation: CORE_IMAGES.logos.bwc, kai: CORE_IMAGES.logos.kai, travelTours: CORE_IMAGES.logos.valleyOfPlenty },
  twoBeWell: { lipBalm: CORE_IMAGES.products.product1, logo: CORE_IMAGES.products.logo },
  providers: { chad: CORE_IMAGES.services.team },
  fallbacks: { yoga: [CORE_IMAGES.sandy.yoga], meditation: [CORE_IMAGES.sandy.meditation], workshops: [CORE_IMAGES.services.retreat1], retreats: [CORE_IMAGES.services.retreat1], community: [CORE_IMAGES.services.community1], locations: [CORE_IMAGES.locations.view1], general: [CORE_IMAGES.sandy.portrait] },
};

export const getImageWithFallback = (primaryPath: string, fallbackPath?: string) => ({ src: primaryPath, onError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => { if (fallbackPath && e.currentTarget.src !== fallbackPath) e.currentTarget.src = fallbackPath; else e.currentTarget.src = IMAGES.logos.omniPrimary; } });

export const getSandyImage = (variant: keyof typeof IMAGES.sandy = 'profile') => getImageWithFallback(IMAGES.sandy[variant], IMAGES.sandy.profile);
export const getOmniLogo = () => getImageWithFallback(IMAGES.logos.omniPrimary);
export const getPartnerLogo = (partner: keyof typeof IMAGES.logos) => getImageWithFallback(IMAGES.logos[partner], IMAGES.logos.omniPrimary);
export const getRandomFallback = (category: keyof typeof IMAGES.fallbacks) => IMAGES.fallbacks[category][0];
