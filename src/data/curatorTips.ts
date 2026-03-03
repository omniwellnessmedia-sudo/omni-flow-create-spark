/**
 * Curator Tips - Page-specific and context-aware curator messages
 * 
 * Each curator has a unique voice and expertise area.
 * Tips are mapped to pages/sections for consistent guided experience.
 */

import { IMAGES } from "@/lib/images";

export interface CuratorTipData {
  curator: "chad" | "zenith" | "feroza" | "roam";
  message: string;
  context?: string;
}

export interface CuratorProfile {
  id: string;
  name: string;
  title: string;
  emoji: string;
  image: string;
  expertise: string[];
  style: "strategic" | "nurturing" | "authentic" | "helpful";
}

// Curator profiles
export const curators: Record<string, CuratorProfile> = {
  chad: {
    id: "chad",
    name: "Chad Cupido",
    title: "Founding Director",
    emoji: "💡",
    image: IMAGES.team.chad,
    expertise: ["strategy", "media", "business", "vision"],
    style: "strategic",
  },
  zenith: {
    id: "zenith",
    name: "Zenith Yassin",
    title: "Operations & Coordination Lead",
    emoji: "🧭",
    image: IMAGES.team.zenith,
    expertise: ["tours", "experiences", "community", "coordination"],
    style: "nurturing",
  },
  feroza: {
    id: "feroza",
    name: "Feroza Begg",
    title: "Operations & Admin Support",
    emoji: "🌿",
    image: IMAGES.team.feroza,
    expertise: ["products", "wellness", "2bewell", "content"],
    style: "authentic",
  },
  roam: {
    id: "roam",
    name: "Roam",
    title: "Mindful Travel Guide",
    emoji: "🧭",
    image: IMAGES.logos.omniPrimary,
    expertise: ["travel", "connectivity", "esim", "destinations"],
    style: "helpful",
  },
};

// Page-specific curator tips
export const pageTips: Record<string, CuratorTipData> = {
  // Homepage sections
  "home-hero": {
    curator: "chad",
    message: "Welcome to Omni. This is where your wellness journey begins.",
    context: "hero",
  },
  "home-services": {
    curator: "chad",
    message: "Start here — these are our core offerings, each crafted with intention.",
    context: "services preview",
  },
  "home-tours": {
    curator: "zenith",
    message: "I've personally vetted each of these experiences. They're transformative.",
    context: "tours preview",
  },
  "home-2bewell": {
    curator: "feroza",
    message: "Everything here is made with intention in our Cape Town kitchen.",
    context: "2bewell cta",
  },
  "home-testimonials": {
    curator: "zenith",
    message: "These stories warm our hearts. Real people, real transformation.",
    context: "testimonials",
  },

  // Main pages
  "about": {
    curator: "chad",
    message: "Let us tell you our story. We started with a simple belief.",
    context: "about intro",
  },
  "services": {
    curator: "chad",
    message: "Not sure where to start? Let me guide you through what we offer.",
    context: "services intro",
  },
  "contact": {
    curator: "zenith",
    message: "We're here to listen. Whatever you're dreaming of, let's talk.",
    context: "contact intro",
  },
  "blog": {
    curator: "zenith",
    message: "These stories matter to us. Hope they inspire you too.",
    context: "blog intro",
  },

  // Tours & Experiences
  "tours": {
    curator: "zenith",
    message: "Ready for an adventure? I've handpicked each experience with care.",
    context: "tours main",
  },
  "tours-retreats": {
    curator: "zenith",
    message: "Retreats are where transformation happens. Let's find yours.",
    context: "retreats",
  },
  "great-mother-cave": {
    curator: "zenith",
    message: "This is one of our most sacred experiences. Chief Kingsley awaits.",
    context: "cave tour",
  },

  // Shop pages
  "twobewellshop": {
    curator: "feroza",
    message: "Nature bottled with love. Every product tells a story.",
    context: "2bewell shop",
  },
  "2bewell-products": {
    curator: "feroza",
    message: "Made in Cape Town with organic ingredients and good intentions.",
    context: "products",
  },

  // RoamBuddy & Travel
  "roambuddy": {
    curator: "roam",
    message: "Tell me where you're headed — I'll find the perfect connectivity plan.",
    context: "roambuddy main",
  },
  "roambuddy-store": {
    curator: "roam",
    message: "Mindful connectivity for conscious travelers. Let's get you connected.",
    context: "esim store",
  },
  "travel-well-connected": {
    curator: "roam",
    message: "Stay connected without missing a moment of your journey.",
    context: "travel store",
  },

  // Business & Consulting
  "business-consulting": {
    curator: "chad",
    message: "Building something meaningful? Let's talk about your vision.",
    context: "consulting",
  },
  "media-production": {
    curator: "chad",
    message: "Conscious content that uplifts. Let me show you what's possible.",
    context: "media",
  },

  // Community
  "wellness-community": {
    curator: "zenith",
    message: "Community is where the magic happens. Join us.",
    context: "community",
  },
  "podcast": {
    curator: "chad",
    message: "Stories worth your time. Pull up a chair and listen in.",
    context: "podcast",
  },
};

// Context-specific tips for sections/components
export const sectionTips: Record<string, CuratorTipData[]> = {
  newsletter: [
    {
      curator: "zenith",
      message: "We'd love to stay in touch. No spam, just wellness wisdom.",
    },
  ],
  productCard: [
    {
      curator: "feroza",
      message: "Every product is crafted with care and organic ingredients.",
    },
  ],
  tourCard: [
    {
      curator: "zenith",
      message: "This experience has been personally vetted by our team.",
    },
  ],
  esimCard: [
    {
      curator: "roam",
      message: "Perfect for your journey. I've tested this myself.",
    },
  ],
  serviceCard: [
    {
      curator: "chad",
      message: "This is one of our core offerings. Let's explore it together.",
    },
  ],
};

// Helper functions
export const getCuratorForPage = (page: string): CuratorProfile | undefined => {
  const tip = pageTips[page];
  if (tip) {
    return curators[tip.curator];
  }
  return undefined;
};

export const getTipForPage = (page: string): CuratorTipData | undefined => {
  return pageTips[page];
};

export const getCuratorById = (id: string): CuratorProfile | undefined => {
  return curators[id];
};

export const getRandomTipForSection = (section: string): CuratorTipData | undefined => {
  const tips = sectionTips[section];
  if (tips && tips.length > 0) {
    return tips[Math.floor(Math.random() * tips.length)];
  }
  return undefined;
};

export default {
  curators,
  pageTips,
  sectionTips,
  getCuratorForPage,
  getTipForPage,
  getCuratorById,
  getRandomTipForSection,
};
