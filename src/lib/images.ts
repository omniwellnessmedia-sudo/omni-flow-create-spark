// Centralized Image Management System for Omni Wellness Platform
// All images organized by category based on /public/Omni-Wellness-Images/ structure

export const IMAGES = {
  // Sandy Mitchell - from /public/Omni-Wellness-Images/sandy/
  sandy: {
    profile: '/Omni-Wellness-Images/sandy/Sandy _August shoot _ omni-2.png',
    hero: '/Omni-Wellness-Images/sandy/Sandy _August shoot _ omni-3.png', 
    meditation: '/Omni-Wellness-Images/sandy/Sandy _August shoot _ omni-1.png',
    yoga: '/Omni-Wellness-Images/sandy/Sandy _August shoot _ omni-4.png',
    teaching: '/Omni-Wellness-Images/sandy/Sandy _August shoot _ omni-5.png',
    nature: '/Omni-Wellness-Images/sandy/Sandy _August shoot _ omni-6.png',
    fallback: '/lovable-uploads/590721a1-f529-47d4-b7f1-8e856b424bb9.png'
  },

  // Omni Services - from /public/Omni-Wellness-Images/omni services/
  omni: {
    logo: '/Omni-Wellness-Images/omni services/omni wellness logo.png',
    logoAlt: '/lovable-uploads/9d9ecf28-f102-4674-949b-c09c14479f21.png',
    branding: '/Omni-Wellness-Images/omni services/omni wellness branding.png',
    services: '/Omni-Wellness-Images/omni services/omni wellness services.png'
  },

  // Community & Wellness - organized by category
  wellness: {
    marketplace: '/lovable-uploads/196dfbe9-53ec-4411-8a03-66d8040a97c0.png',
    community: '/lovable-uploads/f83c6a43-7fb0-45db-8f28-4701fae8f52c.png',
    deals: '/lovable-uploads/2cbfba5c-c500-4e2a-bfe4-bea1c9043973.png',
    meditation: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    yoga: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop'
  },

  // Tours & Retreats
  tours: {
    mountain: '/lovable-uploads/8899b34c-3cb2-4a70-b18f-2a78af5432e7.png',
    retreat: '/lovable-uploads/ec1f5bbe-fb2b-47f4-be6f-f8e57e6d5cba.png',
    capeTown: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=400&h=300&fit=crop',
    nature: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop'
  },

  // Business & Professional
  business: {
    consulting: '/lovable-uploads/dd3b9532-dbb3-471a-939d-894418e20e0e.png',
    partnership: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=300&fit=crop',
    strategy: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop'
  },

  // Media & Content
  media: {
    production: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=300&fit=crop',
    podcast: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=300&fit=crop',
    video: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400&h=300&fit=crop'
  },

  // AI & Technology
  ai: {
    tools: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop',
    interface: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=300&fit=crop',
    neural: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop'
  },

  // Products & Shopping
  products: {
    wellness: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400&h=300&fit=crop',
    supplements: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400&h=300&fit=crop',
    essentials: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=300&fit=crop'
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