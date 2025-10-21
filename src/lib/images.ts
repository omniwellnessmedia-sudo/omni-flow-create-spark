// Centralized Image Management System - Supabase CDN
const SUPABASE_URL = 'https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images';

const CORE = {
  sandy: {
    profile: `${SUPABASE_URL}/Sandy/Sandy%20_August%20shoot%20_%20omni-2.png`,
    yoga: `${SUPABASE_URL}/Sandy/Sandy%20_August%20shoot%20_%20omni-3.png`,
    meditation: `${SUPABASE_URL}/Sandy/Sandy%20_August%20shoot%20_%20omni-4.png`,
    outdoor: `${SUPABASE_URL}/Sandy/Sandy%20_August%20shoot%20_%20omni-6.png`,
    portrait: `${SUPABASE_URL}/Sandy/Sandy%20_August%20shoot%20_%20omni-7.png`,
    wellness: `${SUPABASE_URL}/Sandy/Sandy%20_August%20shoot%20_%20omni-8.png`,
    consultation: `${SUPABASE_URL}/Sandy/Sandy%20_August%20shoot%20_%20omni-10.png`,
    workshop: `${SUPABASE_URL}/Sandy/Sandy%20_August%20shoot%20_%20omni-11.png`,
    hero: `${SUPABASE_URL}/Sandy/Sandy%20_August%20shoot%20_%20omni-13.png`,
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
    view1: `${SUPABASE_URL}/location-images**%20(Cape%20Town%20Locations)/_MG_0220.jpg`,
    view2: `${SUPABASE_URL}/location-images**%20(Cape%20Town%20Locations)/_MG_0235.jpg`,
    coastal: `${SUPABASE_URL}/location-images**%20(Cape%20Town%20Locations)/image00004.jpeg`,
    capeTown1: `${SUPABASE_URL}/provider-images/IMG_20241010_142332.jpg`,
    capeTown2: `${SUPABASE_URL}/provider-images/IMG_20241010_174621.jpg`,
    capeTown3: `${SUPABASE_URL}/provider-images/IMG_20241026_100612.jpg`,
    capeTown4: `${SUPABASE_URL}/location-images**%20(Cape%20Town%20Locations)/IMG_20241026_111216.jpg`,
    capeTown5: `${SUPABASE_URL}/location-images**%20(Cape%20Town%20Locations)/IMG_20241026_123154.jpg`,
    sunrise: `${SUPABASE_URL}/provider-images/IMG_20250117_060441.jpg`,
  },
  products: {
    logo: `${SUPABASE_URL}/product-images**%20(2BeWell%20Products)/2%20be%20well%20NEW%20LOGO_OMNI.png`,
    allPurpose: `${SUPABASE_URL}/product-images**%20(2BeWell%20Products)/all%20purpose%20cleaner%20stock.png`,
    product1: `${SUPABASE_URL}/product-images**%20(2BeWell%20Products)/OMNI_2BeWell-7.jpg`,
    product2: `${SUPABASE_URL}/product-images**%20(2BeWell%20Products)/OMNI_2BeWell-8.jpg`,
    spray: `${SUPABASE_URL}/product-images**%20(2BeWell%20Products)/Minimal%20Natural%20spray%20Instagram%20post.png`,
    post5: `${SUPABASE_URL}/product-images**%20(2BeWell%20Products)/post%205.png`,
    post7: `${SUPABASE_URL}/product-images**%20(2BeWell%20Products)/post%207.png`,
    post8: `${SUPABASE_URL}/product-images**%20(2BeWell%20Products)/post%208.png`,
    bottle12: `${SUPABASE_URL}/product-images**%20(2BeWell%20Products)/12.png`,
    bottle3: `${SUPABASE_URL}/product-images**%20(2BeWell%20Products)/3.png`,
  },
  community: {
    empowerment: `${SUPABASE_URL}/%20community-images**%20(Workshop%20Photos)/OMNI_Women%20Empowerment%20course%20-%20the%20lookout_.jpg`,
    empowerment2: `${SUPABASE_URL}/%20community-images**%20(Workshop%20Photos)/OMNI_Women%20Empowerment%20course%20-%20the%20lookout_-4.jpg`,
    empowerment3: `${SUPABASE_URL}/%20community-images**%20(Workshop%20Photos)/OMNI_Women%20Empowerment%20course%20-%20the%20lookout_-6.jpg`,
    khoe: `${SUPABASE_URL}/%20community-images**%20(Workshop%20Photos)/RR_OMNI_Khoe%20Meisie_WRM-2.jpg`,
    khoe2: `${SUPABASE_URL}/%20community-images**%20(Workshop%20Photos)/RR_OMNI_Khoe%20Meisie_WRM-3.jpg`,
    khoe3: `${SUPABASE_URL}/%20community-images**%20(Workshop%20Photos)/RR_OMNI_Khoe%20Meisie_WRM-4.jpg`,
  },
  logos: {
    omniPrimary: `${SUPABASE_URL}/partner-logos**%20(Brand%20Assets)/OMNI%20LOGO%20FA-06(1).png`,
    omniIcon: `${SUPABASE_URL}/partner-logos**%20(Brand%20Assets)/OMNI%20WELLNESS%20MEDIA%20ICON.png`,
    bwc: `${SUPABASE_URL}/partner-logos**%20(Brand%20Assets)/Bwc%20logo.JPG`,
    drPhil1: `${SUPABASE_URL}/partner-logos**%20(Brand%20Assets)/DR%20PHIL%20LOGO%20NPO_OMNI-01.png`,
    drPhil2: `${SUPABASE_URL}/partner-logos**%20(Brand%20Assets)/DR%20PHIL%20LOGO%20NPO_OMNI-02.png`,
    amor: `${SUPABASE_URL}/partner-logos**%20(Brand%20Assets)/1April2025_Amor%20logo%20png.png`,
    apex: `${SUPABASE_URL}/partner-logos**%20(Brand%20Assets)/APEXAdvocacy_logo_blackonwhitebubble-01.png`,
    gorachouqua: `${SUPABASE_URL}/partner-logos**%20(Brand%20Assets)/Gorachouqua-Logo-300x300.png`,
    kai: `${SUPABASE_URL}/partner-logos**%20(Brand%20Assets)/Kai%20Logo%20BW.png`,
    muddyRambler: `${SUPABASE_URL}/partner-logos**%20(Brand%20Assets)/Muddy%20Rambler%20Logo%20Square%20White.png`,
    muizKitchen: `${SUPABASE_URL}/partner-logos**%20(Brand%20Assets)/muiz-kitchen-logo3.jpg`,
    valleyOfPlenty: `${SUPABASE_URL}/partner-logos**%20(Brand%20Assets)/The%20Valley%20of%20Plenty%20Logo%20No%20Background%20(2).png`,
    tt: `${SUPABASE_URL}/partner-logos**%20(Brand%20Assets)/TT%20Logo%20no%20background.png`,
  },
};

export const IMAGES = {
  sandy: { 
    ...CORE.sandy, 
    portrait1: CORE.sandy.portrait, 
    portrait2: CORE.sandy.profile, 
    portrait3: CORE.sandy.consultation, 
    action1: CORE.sandy.yoga, 
    action2: CORE.sandy.outdoor, 
    closeup: CORE.sandy.portrait, 
    fallback: CORE.sandy.profile, 
    nature: CORE.sandy.outdoor, 
    teaching: CORE.sandy.workshop, 
    beach: CORE.sandy.outdoor 
  },
  services: CORE.services,
  locations: CORE.locations,
  products: { 
    ...CORE.products, 
    wellness: CORE.services.wellness1, 
    supplements: CORE.products.product1, 
    essentials: CORE.products.product2,
    packaging1: CORE.products.post5,
    packaging2: CORE.products.post7,
    packaging3: CORE.products.post8,
  },
  community: CORE.community,
  logos: CORE.logos,
  wellness: { 
    marketplace: CORE.services.wellness1, 
    community: CORE.services.community1, 
    deals: CORE.services.wellness2, 
    meditation: CORE.sandy.meditation, 
    yoga: CORE.sandy.yoga, 
    retreat: CORE.services.retreat1, 
    retreat2: CORE.services.retreat2, 
    retreat3: CORE.services.retreat3,
    retreat4: CORE.services.retreat4, 
    retreat5: CORE.services.retreat5,
    retreat6: CORE.services.retreat6,
    team: CORE.services.team, 
    communityProject1: CORE.services.community1, 
    communityProject2: CORE.services.community2, 
    communityProject3: CORE.services.community3,
    wellness: CORE.services.wellness1, 
    graduation: CORE.services.graduation1, 
    graduation2: CORE.services.graduation2, 
    landmark: CORE.services.landmark, 
    muiz: CORE.services.community1, 
    beachLions: CORE.locations.coastal, 
    beachLions2: CORE.locations.capeTown2 
  },
  tours: { 
    mountain: CORE.locations.view1, 
    mountain2: CORE.locations.view2, 
    capeTown: CORE.locations.capeTown1, 
    nature: CORE.locations.view1, 
    hiking: CORE.locations.capeTown3, 
    adventure: CORE.locations.capeTown1, 
    scenic: CORE.locations.view1, 
    coastal: CORE.locations.coastal, 
    retreat: CORE.services.retreat1,
    beach: CORE.locations.capeTown2,
    sunset: CORE.locations.sunrise,
    cultural: CORE.locations.capeTown4,
  },
  business: { 
    consulting: CORE.services.team, 
    partnership: CORE.services.community1, 
    strategy: CORE.services.wellness1, 
    teamwork: CORE.services.team, 
    community: CORE.services.community2 
  },
  media: { 
    production: CORE.services.artscape, 
    podcast: CORE.services.wellness1, 
    video: CORE.services.artscape, 
    content: CORE.services.wellness2 
  },
  ai: { 
    tools: CORE.services.wellness1, 
    interface: CORE.services.wellness2, 
    neural: CORE.locations.view1 
  },
  omni: { 
    logo: CORE.logos.omniPrimary, 
    logoAlt: CORE.logos.omniIcon, 
    team: CORE.services.team, 
    communityProject1: CORE.services.community1, 
    communityProject2: CORE.services.community2, 
    communityProject3: CORE.services.community3
  },
  partners: { 
    twoBeWell: CORE.products.logo, 
    apex: CORE.logos.apex, 
    mbs: CORE.logos.muddyRambler, 
    drPhil: CORE.logos.drPhil1, 
    amor: CORE.logos.amor, 
    baboonConservation: CORE.logos.bwc, 
    kai: CORE.logos.kai, 
    travelTours: CORE.logos.valleyOfPlenty 
  },
  twoBeWell: { 
    lipBalm: CORE.products.product1, 
    faceSerum: CORE.products.product2, 
    bodyButter: CORE.products.allPurpose, 
    cleaner: CORE.products.allPurpose, 
    product1: CORE.products.product1, 
    product2: CORE.products.product2, 
    logo: CORE.products.logo, 
    packaging: CORE.products.product1,
    packaging1: CORE.products.post5,
    packaging2: CORE.products.post7,
    packaging3: CORE.products.post8,
    spray: CORE.products.spray,
    allPurpose: CORE.products.allPurpose,
  },
  providers: { 
    chad: CORE.services.team, 
    chadAction: CORE.services.artscape, 
    chadAction2: CORE.services.landmark, 
    chief: CORE.community.khoe, 
    castle: CORE.locations.capeTown1, 
    bwc: CORE.logos.bwc 
  },
  fallbacks: { 
    yoga: [CORE.sandy.yoga], 
    meditation: [CORE.sandy.meditation], 
    workshops: [
      CORE.services.retreat1, 
      CORE.services.retreat4,
      CORE.community.empowerment2
    ], 
    retreats: [
      CORE.services.retreat1, 
      CORE.services.retreat5,
      CORE.services.retreat6
    ], 
    community: [
      CORE.services.community1, 
      CORE.services.community2,
      CORE.community.khoe2
    ], 
    locations: [
      CORE.locations.view1, 
      CORE.locations.capeTown4,
      CORE.locations.sunrise
    ], 
    general: [
      CORE.sandy.portrait, 
      CORE.services.wellness1,
      CORE.locations.view2
    ] 
  },
};

export const getImageWithFallback = (primaryPath: string, fallbackPath?: string) => ({ 
  src: primaryPath, 
  onError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => { 
    if (fallbackPath && e.currentTarget.src !== fallbackPath) 
      e.currentTarget.src = fallbackPath; 
    else 
      e.currentTarget.src = IMAGES.logos.omniPrimary; 
  } 
});

export const getSandyImage = (variant: keyof typeof IMAGES.sandy = 'profile') => 
  getImageWithFallback(IMAGES.sandy[variant], IMAGES.sandy.profile);

export const getOmniLogo = () => 
  getImageWithFallback(IMAGES.logos.omniPrimary);

export const getPartnerLogo = (partner: keyof typeof IMAGES.logos) => 
  getImageWithFallback(IMAGES.logos[partner], IMAGES.logos.omniPrimary);

export const getRandomFallback = (category: keyof typeof IMAGES.fallbacks) => 
  IMAGES.fallbacks[category][0];
