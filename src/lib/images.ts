// Centralized Image Management System for Omni Wellness Platform
// All images organized by category based on /public/images/ structure

export const IMAGES = {
  // Sandy Mitchell - Professional photoshoot images
  sandy: {
    profile: '/images/sandy/Sandy _August shoot _ omni-2.png',
    hero: '/images/sandy/Sandy _August shoot _ omni-3.png',
    meditation: '/images/sandy/Sandy _August shoot _ omni-5.png',
    yoga: '/images/sandy/Sandy _August shoot _ omni-4.png',
    teaching: '/images/sandy/Sandy _August shoot _ omni-6.png',
    nature: '/images/sandy/Sandy _August shoot _ omni-7.png',
    portrait1: '/images/sandy/Sandy _August shoot _ omni-8.png',
    portrait2: '/images/sandy/Sandy _August shoot _ omni-9.png',
    portrait3: '/images/sandy/Sandy _August shoot _ omni-10.png',
    action1: '/images/sandy/Sandy _August shoot _ omni-11.png',
    action2: '/images/sandy/Sandy _August shoot _ omni-12.png',
    closeup: '/images/sandy/Sandy _August shoot _ omni-13.png',
    fallback: '/images/sandy/Sandy _August shoot _ omni-2.png'
  },

  // Omni Services - from /public/images/wellness/
  omni: {
    logo: '/lovable-uploads/9d9ecf28-f102-4674-949b-c09c14479f21.png',
    logoAlt: '/lovable-uploads/9d9ecf28-f102-4674-949b-c09c14479f21.png',
    team: '/images/wellness/Omni wellness team.jpg',
    communityProject1: '/images/wellness/Omni wellness community project 1.JPG',
    communityProject2: '/images/wellness/Omni wellness community project 2.JPG',
    communityProject3: '/images/wellness/Omni wellness community project 3.jpg'
  },

  // Community & Wellness - Real photos
  wellness: {
    marketplace: '/images/wellness/wellness 2.jpg',
    community: '/images/wellness/Omni wellness community project 1.JPG',
    deals: '/images/wellness/wellness.jpg',
    meditation: '/images/sandy/Sandy _August shoot _ omni-5.png',
    yoga: '/images/sandy/Sandy _August shoot _ omni-4.png',
    retreat: '/images/wellness/OMNI_OLIVETREE_RETREAT_2024.jpg',
    retreat2: '/images/wellness/OMNI_OLIVETREE_RETREAT_2024-6.jpg',
    retreat3: '/images/wellness/OMNI_OLIVETREE_RETREAT_2024-17.jpg',
    retreat4: '/images/wellness/OMNI_OLIVETREE_RETREAT_2024-43.jpg',
    graduation: '/images/wellness/OMNI_KALK BAY_ GRADUATION-8.jpg',
    graduation2: '/images/wellness/OMNI_KALK BAY_ GRADUATION-48.jpg',
    landmark: '/images/wellness/OMNI_LANDMARK FOUNDATION_IMAGES_JUNE 2024-2.jpg',
    muiz: '/images/wellness/CAPTCHA_OMNI_IMAGES_DAILY_MUIZ-7.jpg',
    beachLions: '/images/wellness/CPTCHA_BEACH_LIONSHEAD_MARCH_SHOOT 02_OMNI-4.jpg',
    beachLions2: '/images/wellness/CPTCHA_BEACH_LIONSHEAD_MARCH_SHOOT 02_OMNI-20.jpg'
  },

  // Tours & Retreats - Real travel images
  tours: {
    mountain: '/images/tours/_MG_0220.jpg',
    mountain2: '/images/tours/_MG_0235.jpg',
    capeTown: '/images/tours/IMG_20241010_142332.jpg',
    nature: '/images/tours/IMG_20241026_100612.jpg',
    hiking: '/images/tours/IMG_20241026_111216.jpg',
    adventure: '/images/tours/IMG_20241026_123154.jpg',
    scenic: '/images/tours/IMG_20250117_060441.jpg',
    coastal: '/images/tours/image00004.jpeg',
    retreat: '/images/wellness/OMNI_OLIVETREE_RETREAT_2024.jpg'
  },

  // Business & Professional - Real community/business images
  business: {
    consulting: '/images/wellness/Omni wellness team.jpg',
    partnership: '/images/wellness/OMNI_KALK BAY_ GRADUATION-8.jpg',
    strategy: '/images/wellness/Omni wellness community project 2.JPG',
    teamwork: '/images/wellness/Omni wellness team.jpg',
    community: '/images/wellness/Omni wellness community project 1.JPG'
  },

  // Media & Content - Real production images
  media: {
    production: '/images/wellness/SAGA_HKL_OMNI_Artscape-9.jpg',
    podcast: '/images/wellness/CAPTCHA_OMNI_IMAGES_DAILY_MUIZ-7.jpg',
    video: '/images/wellness/SAGA_HKL_OMNI_Artscape-9.jpg',
    content: '/images/wellness/Omni wellness team.jpg'
  },

  // AI & Technology - Using wellness tech imagery
  ai: {
    tools: '/lovable-uploads/dd3b9532-dbb3-471a-939d-894418e20e0e.png',
    interface: '/lovable-uploads/dd3b9532-dbb3-471a-939d-894418e20e0e.png',
    neural: '/lovable-uploads/dd3b9532-dbb3-471a-939d-894418e20e0e.png'
  },

  // Products & Shopping - Real wellness products
  products: {
    wellness: '/images/wellness/wellness.jpg',
    supplements: '/images/wellness/wellness 2.jpg',
    essentials: '/images/wellness/wellness.jpg'
  },

  // Providers - Real provider images
  providers: {
    chad: '/images/wellness/Chad and cow_OMNI_BWC.jpg',
    chadAction: '/images/wellness/HUMAN ANIMAL_CHAD-3.jpg',
    chadAction2: '/images/wellness/HUMAN ANIMAL_CHAD-4.jpg',
    chief: '/images/wellness/Chief_Hennie_van_Wyk_001_2.slideshow.jpg',
    castle: '/images/wellness/Castle1.jpg',
    bwc: '/images/wellness/bwc cover youth troopers.png'
  }
} as const;

// Helper functions for image management
export const getImageWithFallback = (primaryPath: string, fallbackPath?: string) => {
  return {
    src: primaryPath,
    fallback: fallbackPath || IMAGES.omni.logoAlt,
    onError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      if (fallbackPath && e.currentTarget.src !== fallbackPath) {
        e.currentTarget.src = fallbackPath;
      } else {
        e.currentTarget.src = IMAGES.omni.logoAlt;
      }
    }
  };
};

export const getSandyImage = (variant: keyof typeof IMAGES.sandy = 'profile') => {
  return getImageWithFallback(IMAGES.sandy[variant], IMAGES.sandy.fallback);
};

export const getOmniLogo = () => {
  return getImageWithFallback(IMAGES.omni.logo, IMAGES.omni.logoAlt);
};