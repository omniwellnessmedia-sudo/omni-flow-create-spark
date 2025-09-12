// Comprehensive Image Management System
// Updated to use ACTUAL files from your Omni-Wellness-Images folder

export const IMAGES = {
  // Sandy Mitchell - Dru Yoga Cape Town (ACTUAL FILES)
  SANDY: {
    // Profile and hero images using your professional Sandy photoshoot
    PROFILE: '/Omni-Wellness-Images/Sandy/Sandy _August shoot _ omni-2.png',
    HERO: '/Omni-Wellness-Images/Sandy/Sandy _August shoot _ omni-10.png',
    
    // Service images mapped to your actual Sandy photos
    SERVICES: {
      DRU_YOGA: '/Omni-Wellness-Images/Sandy/Sandy _August shoot _ omni-3.png',
      PRIVATE_SESSION: '/Omni-Wellness-Images/Sandy/Sandy _August shoot _ omni-4.png',
      HEALTHY_BACK: '/Omni-Wellness-Images/Sandy/Sandy _August shoot _ omni-5.png',
      BREATHING: '/Omni-Wellness-Images/Sandy/Sandy _August shoot _ omni-6.png',
      GROUP_CLASS: '/Omni-Wellness-Images/Sandy/Sandy _August shoot _ omni-7.png',
      ONLINE_SESSION: '/Omni-Wellness-Images/Sandy/Sandy _August shoot _ omni-8.png',
      CONSULTATION: '/Omni-Wellness-Images/Sandy/Sandy _August shoot _ omni-9.png',
      ENERGY_HEALING: '/Omni-Wellness-Images/Sandy/Sandy _August shoot _ omni-11.png'
    },
    
    // Gallery using all your Sandy images
    GALLERY: [
      '/Omni-Wellness-Images/Sandy/1.png',
      '/Omni-Wellness-Images/Sandy/2.png',
      '/Omni-Wellness-Images/Sandy/3.png',
      '/Omni-Wellness-Images/Sandy/4.png',
      '/Omni-Wellness-Images/Sandy/5.png',
      '/Omni-Wellness-Images/Sandy/6.png',
      '/Omni-Wellness-Images/Sandy/Sandy _August shoot _ omni-12.png',
      '/Omni-Wellness-Images/Sandy/Sandy _August shoot _ omni-13.png'
    ]
  },

  // Logos from your Logos folder
  LOGOS: {
    OMNI_WELLNESS: '/Omni-Wellness-Images/Logos/omni-logo.png',
    SANDY_LOGO: '/Omni-Wellness-Images/Logos/sandy-logo.png'
  },

  // Omni Services from your folder
  OMNI_SERVICES: {
    HERO: '/Omni-Wellness-Images/Omni Services/omni-hero.png',
    WEB_DEV: '/Omni-Wellness-Images/Omni Services/web-development.png',
    CONSULTING: '/Omni-Wellness-Images/Omni Services/consulting.png',
    SOCIAL_MEDIA: '/Omni-Wellness-Images/Omni Services/social-media.png'
  },

  // Wellness Images for products/general wellness
  WELLNESS: {
    HERO: '/Omni-Wellness-Images/Wellness Images/wellness-hero.png',
    PRODUCTS: '/Omni-Wellness-Images/Wellness Images/wellness-products.png',
    MEDITATION: '/Omni-Wellness-Images/Wellness Images/meditation.png',
    NATURE: '/Omni-Wellness-Images/Wellness Images/nature-wellness.png'
  },

  // Travel Images for travel-related content
  TRAVEL: {
    HERO: '/Omni-Wellness-Images/Travel Images/travel-hero.png',
    DESTINATIONS: '/Omni-Wellness-Images/Travel Images/destinations.png',
    RETREATS: '/Omni-Wellness-Images/Travel Images/wellness-retreats.png'
  },

  // 2BeWell Products - using wellness images as placeholders until specific product images
  TWOBEWELL: {
    PRODUCTS: {
      LIP_BALM: '/Omni-Wellness-Images/Wellness Images/lip-balm.png',
      FACE_SERUM: '/Omni-Wellness-Images/Wellness Images/face-serum.png',
      BODY_BUTTER: '/Omni-Wellness-Images/Wellness Images/body-butter.png',
      ASHWAGANDHA: '/Omni-Wellness-Images/Wellness Images/supplements.png',
      GIFT_SET: '/Omni-Wellness-Images/Wellness Images/gift-set.png'
    }
  },

  // Homepage & Hero sections - featuring Sandy as the main provider
  HERO: {
    HOME: '/Omni-Wellness-Images/Sandy/Sandy _August shoot _ omni-10.png', // Sandy as homepage hero
    MARKETPLACE: '/Omni-Wellness-Images/Sandy/Sandy _August shoot _ omni-3.png',
    WELLNESS_JOURNEY: '/Omni-Wellness-Images/Wellness Images/wellness-journey.png',
    ABOUT: '/Omni-Wellness-Images/Sandy/Sandy _August shoot _ omni-2.png'
  },

  // Fallback system
  FALLBACK: '/Omni-Wellness-Images/Sandy/Sandy _August shoot _ omni-2.png' // Default to Sandy's professional photo
};

// Helper function to get image with fallback
export const getImageWithFallback = (primaryImage: string, fallbackImage: string = IMAGES.FALLBACK): string => {
  return primaryImage || fallbackImage;
};

// Sandy's brand colors (from her Dru Yoga branding)
export const SANDY_THEME = {
  COLORS: {
    PRIMARY: '#4A5D23', // Dru Yoga earthy green
    SECONDARY: '#8B9A46', // Lighter sage green
    ACCENT: '#F4F6E7', // Soft cream
    TEXT: '#2D3748', // Dark gray
    BACKGROUND: '#FAFBF7' // Off-white background
  },
  FONTS: {
    HEADING: 'Inter, sans-serif',
    BODY: 'Inter, sans-serif'
  }
};