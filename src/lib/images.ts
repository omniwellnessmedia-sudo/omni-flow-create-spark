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
    muizKitchen: `${SUPABASE_URL}/provider-images/CAPTCHA_OMNI_IMAGES_DAILY_MUIZ-7.jpg`,
    beachLions1: `${SUPABASE_URL}/provider-images/CPTCHA_BEACH_LIONSHEAD_MARCH_SHOOT%2002_OMNI-4.jpg`,
    beachLions2: `${SUPABASE_URL}/provider-images/CPTCHA_BEACH_LIONSHEAD_MARCH_SHOOT%2002_OMNI-20.jpg`,
    humanAnimal1: `${SUPABASE_URL}/provider-images/HUMAN%20ANIMAL_CHAD-3.jpg`,
    humanAnimal2: `${SUPABASE_URL}/provider-images/HUMAN%20ANIMAL_CHAD-4.jpg`,
    chadBwc: `${SUPABASE_URL}/provider-images/Chad%20and%20cow_OMNI_BWC.jpg`,
    bwcCover: `${SUPABASE_URL}/provider-images/bwc%20cover%20youth%20troopers.png`,
    castle: `${SUPABASE_URL}/provider-images/Castle1.jpg`,
    chief: `${SUPABASE_URL}/provider-images/Chief_Hennie_van_Wyk_001_2.slideshow.jpg`,
  },
  locations: {
    view1: `${SUPABASE_URL}/location-images%20(Cape%20Town%20Locations)/_MG_0220.jpg`,
    view2: `${SUPABASE_URL}/location-images%20(Cape%20Town%20Locations)/_MG_0235.jpg`,
    coastal: `${SUPABASE_URL}/location-images%20(Cape%20Town%20Locations)/image00004.jpeg`,
    capeTown1: `${SUPABASE_URL}/provider-images/IMG_20241010_142332.jpg`,
    capeTown2: `${SUPABASE_URL}/provider-images/IMG_20241010_174621.jpg`,
    capeTown3: `${SUPABASE_URL}/provider-images/IMG_20241026_100612.jpg`,
    capeTown4: `${SUPABASE_URL}/location-images%20(Cape%20Town%20Locations)/IMG_20241026_111216.jpg`,
    capeTown5: `${SUPABASE_URL}/location-images%20(Cape%20Town%20Locations)/IMG_20241026_123154.jpg`,
    sunrise: `${SUPABASE_URL}/provider-images/IMG_20250117_060441.jpg`,
  },
  products: {
    // PRIMARY BRAND ASSETS
    logo: `${SUPABASE_URL}/product-images%20(2BeWell%20Products)/2%20be%20well%20NEW%20LOGO_OMNI.png`,
    
    // SKINCARE PRODUCTS (unique, no repetitions)
    lipBalm: `${SUPABASE_URL}/product-images%20(2BeWell%20Products)/3.png`, // Bottle 3
    faceSerum: `${SUPABASE_URL}/product-images%20(2BeWell%20Products)/12.png`, // Bottle 12
    bodyButter: `${SUPABASE_URL}/product-images%20(2BeWell%20Products)/OMNI_2BeWell-7.jpg`, // Hero product shot
    bodyButterLavender: `${SUPABASE_URL}/product-images%20(2BeWell%20Products)/OMNI_2BeWell-8.jpg`, // Lifestyle product variation
    
    // CLEANING PRODUCTS
    allPurposeCleaner: `${SUPABASE_URL}/product-images%20(2BeWell%20Products)/all%20purpose%20cleaner%20stock.png`,
    sprayBottle: `${SUPABASE_URL}/product-images%20(2BeWell%20Products)/Minimal%20Natural%20spray%20Instagram%20post.png`,
    
    // SUPPLEMENTS & WELLNESS TOOLS
    supplementBottle: `${SUPABASE_URL}/product-images%20(2BeWell%20Products)/ChatGPT%20Image%20Jul%201%2C%202025%2C%2002_16_46%20PM.png`,
    ashwagandha: `${SUPABASE_URL}/product-images%20(2BeWell%20Products)/ChatGPT%20Image%20Jul%201%2C%202025%2C%2002_16_46%20PM.png`, // Use existing supplement image
    jadeRoller: `${SUPABASE_URL}/product-images%20(2BeWell%20Products)/post%205.png`, // Use existing product image
    
    // GIFT SETS & DIGITAL PRODUCTS
    giftSet: `${SUPABASE_URL}/product-images%20(2BeWell%20Products)/ChatGPT%20Image%20Jun%2024%2C%202025%2C%2009_26_31%20AM.png`,
    ebookBundle: `${SUPABASE_URL}/product-images%20(2BeWell%20Products)/post%207.png`, // Use existing product image for digital
    
    // LIFESTYLE & MARKETING ASSETS
    productShot1: `${SUPABASE_URL}/product-images%20(2BeWell%20Products)/OMNI_2BeWell-8.jpg`, // Lifestyle shot
    lifestyleHero: `${SUPABASE_URL}/product-images%20(2BeWell%20Products)/post%208.png`, // Use existing lifestyle image
    socialPost1: `${SUPABASE_URL}/product-images%20(2BeWell%20Products)/post%205.png`,
    socialPost2: `${SUPABASE_URL}/product-images%20(2BeWell%20Products)/post%207.png`,
    socialPost3: `${SUPABASE_URL}/product-images%20(2BeWell%20Products)/post%208.png`,
  },
  community: {
    empowerment: `${SUPABASE_URL}/%20community-images%20(Workshop%20Photos)/OMNI_Women%20Empowerment%20course%20-%20the%20lookout_.jpg`,
    empowerment2: `${SUPABASE_URL}/%20community-images%20(Workshop%20Photos)/OMNI_Women%20Empowerment%20course%20-%20the%20lookout_-4.jpg`,
    empowerment3: `${SUPABASE_URL}/%20community-images%20(Workshop%20Photos)/OMNI_Women%20Empowerment%20course%20-%20the%20lookout_-6.jpg`,
    empowerment4: `${SUPABASE_URL}/%20community-images%20(Workshop%20Photos)/OMNI_Women%20Empowerment%20course%20-%20the%20lookout_-8.jpg`,
    empowerment5: `${SUPABASE_URL}/%20community-images%20(Workshop%20Photos)/OMNI_Women%20Empowerment%20course%20-%20the%20lookout_-9.jpg`,
    khoe: `${SUPABASE_URL}/%20community-images%20(Workshop%20Photos)/RR_OMNI_Khoe%20Meisie_WRM-2.jpg`,
    khoe2: `${SUPABASE_URL}/%20community-images%20(Workshop%20Photos)/RR_OMNI_Khoe%20Meisie_WRM-3.jpg`,
    khoe3: `${SUPABASE_URL}/%20community-images%20(Workshop%20Photos)/RR_OMNI_Khoe%20Meisie_WRM-4.jpg`,
    khoe4: `${SUPABASE_URL}/%20community-images%20(Workshop%20Photos)/RR_OMNI_Khoe%20Meisie_WRM-5.jpg`,
    khoe5: `${SUPABASE_URL}/%20community-images%20(Workshop%20Photos)/RR_OMNI_Khoe%20Meisie_WRM-6.jpg`,
    khoe6: `${SUPABASE_URL}/%20community-images%20(Workshop%20Photos)/Khoe%20meisie_Omni-3.jpg`,
    khoe7: `${SUPABASE_URL}/%20community-images%20(Workshop%20Photos)/Khoe%20meisie_Omni-7.jpg`,
    roze: `${SUPABASE_URL}/%20community-images%20(Workshop%20Photos)/ROZE.jpg`,
  },
  logos: {
    // Omni brand logos - in partner-logos (Brand Assets) subfolder
    omniPrimary: `${SUPABASE_URL}/partner-logos%20(Brand%20Assets)/OMNI%20LOGO%20FA-06(1)%20(1).png`,
    omniHorizontal: `${SUPABASE_URL}/partner-logos%20(Brand%20Assets)/Omni%20Horizontal%20Logo-07.png`,
    omniIcon: `${SUPABASE_URL}/partner-logos%20(Brand%20Assets)/OMNI%20WELLNESS%20MEDIA%20ICON.png`,
    omniWhite: `${SUPABASE_URL}/partner-logos%20(Brand%20Assets)/omni%20brand%20white%20logo%20for%20black%20transparent.png`,
    
    // Partner logos - in partner-logos (Brand Assets) subfolder
    twoBeWell: `${SUPABASE_URL}/product-images%20(2BeWell%20Products)/2%20be%20well%20NEW%20LOGO_OMNI.png`,
    amor: `${SUPABASE_URL}/partner-logos%20(Brand%20Assets)/1April2025_Amor%20logo%20png.png`,
    apex: `${SUPABASE_URL}/partner-logos%20(Brand%20Assets)/APEXAdvocacy_logo_blackonwhitebubble-01.png`,
    bwc: `${SUPABASE_URL}/partner-logos%20(Brand%20Assets)/Bwc%20logo.JPG`,
    cartHorse: `${SUPABASE_URL}/partner-logos%20(Brand%20Assets)/cart-horse-favicon-black.png`,
    mbs: `${SUPABASE_URL}/partner-logos%20(Brand%20Assets)/Cropped%20MBS%20Logo%20(1).webp`,
    drPhil1: `${SUPABASE_URL}/partner-logos%20(Brand%20Assets)/DR%20PHIL%20LOGO%20NPO_OMNI-01.png`,
    drPhil2: `${SUPABASE_URL}/partner-logos%20(Brand%20Assets)/DR%20PHIL%20LOGO%20NPO_OMNI-02.png`,
    gorachouqua: `${SUPABASE_URL}/partner-logos%20(Brand%20Assets)/Gorachouqua-Logo-300x300.png`,
    justLogos: `${SUPABASE_URL}/partner-logos%20(Brand%20Assets)/Just%20logos%20(1).png`,
    kai: `${SUPABASE_URL}/partner-logos%20(Brand%20Assets)/Kai%20Logo%20BW.png`,
    ttct: `${SUPABASE_URL}/partner-logos%20(Brand%20Assets)/logo%20tt%20ct%20(1).png`,
    muddyRambler: `${SUPABASE_URL}/partner-logos%20(Brand%20Assets)/Muddy%20Rambler%20Logo%20Square%20White.png`,
    muizKitchen: `${SUPABASE_URL}/partner-logos%20(Brand%20Assets)/muiz-kitchen-logo3.jpg`,
    newLogo: `${SUPABASE_URL}/partner-logos%20(Brand%20Assets)/New%20logo%20(1)%20(1).png`,
    valleyOfPlenty: `${SUPABASE_URL}/partner-logos%20(Brand%20Assets)/The%20Valley%20of%20Plenty%20Logo%20No%20Background%20(2).png`,
    tt: `${SUPABASE_URL}/partner-logos%20(Brand%20Assets)/TT%20Logo%20no%20background.png`,
    uwc: `${SUPABASE_URL}/partner-logos%20(Brand%20Assets)/UWC-Crest.png`,
    tufcat: 'https://www.tufcat.co.za/wp-content/uploads/2021/01/tufcat-logo-spaced.png',
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
    supplements: CORE.products.bodyButter,
    essentials: CORE.products.productShot1,
    // Legacy aliases for backward compatibility
    product1: CORE.products.bodyButter,
    product2: CORE.products.productShot1,
    post5: CORE.products.socialPost1,
    post7: CORE.products.socialPost2,
    post8: CORE.products.socialPost3,
  },
  community: CORE.community,
  logos: CORE.logos,
  wellness: { 
    marketplace: CORE.services.wellness1, 
    community: CORE.community.empowerment, 
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
    muiz: CORE.services.muizKitchen, 
    beachLions: CORE.services.beachLions1, 
    beachLions2: CORE.services.beachLions2 
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
    podcast: CORE.services.muizKitchen, 
    video: CORE.services.humanAnimal1, 
    content: CORE.services.humanAnimal2 
  },
  ai: { 
    tools: CORE.services.humanAnimal1, 
    interface: CORE.services.humanAnimal2, 
    neural: CORE.services.bwcCover 
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
    twoBeWell: CORE.logos.twoBeWell, 
    apex: CORE.logos.apex, 
    mbs: CORE.logos.mbs,
    drPhil: CORE.logos.drPhil1, 
    amor: CORE.logos.amor, 
    bwc: CORE.logos.bwc,
    baboonConservation: CORE.logos.bwc, 
    kai: CORE.logos.kai, 
    cartHorse: CORE.logos.cartHorse,
    muddyRambler: CORE.logos.muddyRambler,
    muizKitchen: CORE.logos.muizKitchen,
    valleyOfPlenty: CORE.logos.valleyOfPlenty,
    travelTours: CORE.logos.ttct,
    uwc: CORE.logos.uwc,
    gorachouqua: CORE.logos.gorachouqua,
    tt: CORE.logos.tt,
  },
  twoBeWell: { 
    // Brand
    logo: CORE.products.logo,
    
    // Skincare - Each product has unique image
    lipBalm: CORE.products.lipBalm,
    faceSerum: CORE.products.faceSerum,
    bodyButter: CORE.products.bodyButter,
    bodyButterLavender: CORE.products.bodyButterLavender,
    
    // Cleaning
    cleaner: CORE.products.allPurposeCleaner,
    allPurposeCleaner: CORE.products.allPurposeCleaner,
    spray: CORE.products.sprayBottle,
    
    // Supplements & Wellness Tools
    supplement: CORE.products.supplementBottle,
    ashwagandha: CORE.products.ashwagandha,
    jadeRoller: CORE.products.jadeRoller,
    
    // Gift Sets & Digital
    giftSet: CORE.products.giftSet,
    starterSet: CORE.products.giftSet,
    ebook: CORE.products.ebookBundle,
    
    // Marketing & Lifestyle
    hero: CORE.products.productShot1,
    lifestyle: CORE.products.lifestyleHero,
    productShot: CORE.products.productShot1,
    packaging1: CORE.products.socialPost1,
    packaging2: CORE.products.socialPost2,
    packaging3: CORE.products.socialPost3,
    
    // Legacy aliases for backward compatibility
    product1: CORE.products.bodyButter,
    product2: CORE.products.productShot1,
    allPurpose: CORE.products.allPurposeCleaner,
  },
  providers: { 
    chad: CORE.services.team, 
    chadAction: CORE.services.chadBwc, 
    chadAction2: CORE.services.landmark, 
    chief: CORE.services.chief, 
    castle: CORE.services.castle, 
    bwc: CORE.logos.bwc 
  },
  fallbacks: { 
    yoga: [CORE.sandy.yoga, CORE.sandy.outdoor, CORE.sandy.wellness], 
    meditation: [CORE.sandy.meditation, CORE.sandy.consultation, CORE.sandy.workshop], 
    workshops: [
      CORE.community.empowerment2, 
      CORE.community.empowerment4,
      CORE.community.khoe6,
      CORE.services.retreat4
    ], 
    retreats: [
      CORE.services.retreat2, 
      CORE.services.retreat5,
      CORE.services.retreat6,
      CORE.services.retreat1
    ], 
    community: [
      CORE.community.khoe4, 
      CORE.community.khoe7,
      CORE.community.roze,
      CORE.services.community3
    ], 
    locations: [
      CORE.locations.view2, 
      CORE.locations.capeTown4,
      CORE.locations.sunrise,
      CORE.services.beachLions2
    ], 
    general: [
      CORE.services.team, 
      CORE.services.wellness1,
      CORE.locations.view2,
      CORE.community.empowerment
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
  getImageWithFallback(IMAGES.logos.omniIcon, IMAGES.logos.omniPrimary);

export const getPartnerLogo = (partner: keyof typeof IMAGES.logos) => 
  getImageWithFallback(IMAGES.logos[partner], IMAGES.logos.omniPrimary);

export const getRandomFallback = (category: keyof typeof IMAGES.fallbacks) => 
  IMAGES.fallbacks[category][0];

export const getTwoBeWellImage = (imageType: keyof typeof IMAGES.twoBeWell) => 
  getImageWithFallback(IMAGES.twoBeWell[imageType], IMAGES.twoBeWell.logo);
