import { getProductImage } from '@/lib/imageHelpers';

export interface TwoBeWellProduct {
  id: string;
  name: string;
  price: number;
  wellCoins: number;
  category: "skincare" | "homecare" | "nutrition";
  image: string;
  labelImage?: string;
  shortDescription: string;
  fullDescription: string;
  benefits: string[];
  ingredients: string;
  usage: string;
  size: string;
  certifications: string[];
  shelfLife?: string;
  nutritionalInfo?: {
    servingSize: string;
    perServing?: Array<{ nutrient: string; amount: string; rda?: string }>;
    per100g?: Array<{ nutrient: string; amount: string; rda?: string }>;
  };
  cautions?: string[];
  featured?: boolean;
  bwcEndorsed?: boolean;
  teamCreator?: 'zenith' | 'feroza' | 'both';
}

export const twoBeWellProducts: TwoBeWellProduct[] = [
  {
    id: "2bekissed-lip-balm",
    name: "2BeKissed - Natural Lip Balm (Sweet Orange)",
    price: 85,
    wellCoins: 42,
    category: "skincare",
    image: getProductImage("2bekissed-lip-balm"),
    teamCreator: 'zenith',
    shortDescription: "Sweet Orange infused natural lip balm with Shea Butter, Coconut Oil, and Vitamin E for lasting moisture and protection.",
    fullDescription: "Experience the uplifting touch of our Sweet Orange infused natural lip balm. Handcrafted with premium ingredients, 2BeKissed provides deep hydration and protection for your lips. The combination of Shea Butter and Coconut Oil creates a smooth, non-greasy formula that locks in moisture, while Vitamin E nourishes and protects against environmental damage.",
    benefits: [
      "Deep hydration with Shea Butter and Coconut Oil",
      "Uplifting Sweet Orange scent",
      "Vitamin E protection against environmental damage",
      "Long-lasting moisture barrier",
      "100% natural and vegan ingredients"
    ],
    ingredients: "Shea Butter, Coconut Oil, Candelilla Wax, Essential Oil (Sweet Orange), Vitamin E Oil",
    usage: "Apply to lips as needed for hydration and protection. Suitable for daily use.",
    size: "20ml",
    certifications: ["100% Vegan", "Cruelty-Free", "Natural Ingredients", "Handmade in South Africa"],
    cautions: [
      "Patch test before use",
      "Avoid contact with eyes",
      "Contains coconut - avoid if allergic",
      "External use only"
    ],
    featured: true,
    bwcEndorsed: true
  },
  {
    id: "2beglow-face-serum",
    name: "2BeGlow - Glow & Calm Face Serum",
    price: 165,
    wellCoins: 82,
    category: "skincare",
    image: getProductImage("2beglow-face-serum"),
    teamCreator: 'zenith',
    shortDescription: "Unlock your skin's natural radiance through our Glow & Calm face serum with Macadamia Oil, Rosehip, and essential oils.",
    fullDescription: "Your skin's new favorite flex. Unlock your skin's natural radiance through our Glow & Calm face serum. With a glow so good you'll catch yourself doing a double-take in the mirror. This lightweight, fast-absorbing formula combines Macadamia Oil, Rosehip, Avocado Oil, Lavender, and Frankincense for radiant, calm skin.",
    benefits: [
      "Promotes radiant, glowing skin",
      "Calms and soothes irritated skin",
      "Rich in antioxidants and fatty acids",
      "Fast-absorbing, non-greasy formula",
      "Suitable for all skin types"
    ],
    ingredients: "Macadamia Oil, Rosa Canina Seed Oil (Rosehip), Avocado Oil, Boswellia Carterii (Frankincense Essential Oil), Angustifolia (Lavender Essential Oil)",
    usage: "Apply 3-5 drops to clean slightly damp face and neck. Massage gently using upward motions. Use alone or under moisturizer. Store in a cool dark place. Avoid direct sunlight.",
    size: "30ml",
    shelfLife: "Use within 6-9 months",
    certifications: ["100% Vegan", "Beauty Without Cruelty Endorsed", "Cruelty-Free", "Natural Ingredients", "Handmade in South Africa"],
    cautions: [
      "Patch test before use",
      "Contains nut oils - avoid if allergic",
      "Stop use if irritation occurs",
      "Avoid contact with eyes"
    ],
    featured: true,
    bwcEndorsed: true
  },
  {
    id: "2besmooth-body-butter",
    name: "2BeSmooth - Whipped Body Butter",
    price: 125,
    wellCoins: 62,
    category: "skincare",
    image: getProductImage("2besmooth-body-butter"),
    teamCreator: 'zenith',
    shortDescription: "Your favourite pamper partner. Leaves your skin so soft you'll be showing it off everywhere, from brunch to your mirror selfies.",
    fullDescription: "Introducing your favourite pamper partner, our Whipped Body Butter. This rich, creamy formula melts into your skin, providing intense hydration and nourishment. The luxurious combination of Shea and Cocoa Butter with Sweet Almond and Coconut Oils creates a protective barrier that locks in moisture all day long.",
    benefits: [
      "Intense deep hydration for dry skin",
      "Luxurious whipped texture that melts on contact",
      "Long-lasting moisture with Shea and Cocoa Butter",
      "Sweet Orange & Lavender aromatherapy",
      "Soothes and nourishes all skin types"
    ],
    ingredients: "Shea Butter, Cocoa Butter, Coconut Oil, Prunus Sweet Almond Oil, Arrowroot Powder, Vitamin E Oil, Essential oils (Sweet Orange & Lavender)",
    usage: "Apply generously to dry skin and massage until fully absorbed. Store in a cool, dry place. Product may melt in heat. If so, refrigerate briefly and re-whip if needed.",
    size: "90ml",
    shelfLife: "Use within 6-9 months",
    certifications: ["100% Vegan", "Cruelty-Free", "Natural Ingredients", "Handmade in South Africa"],
    cautions: [
      "Patch test before use",
      "Contains nut oils (almond) and coconut",
      "Avoid if allergic",
      "External use only",
      "Avoid contact with eyes"
    ],
    featured: true,
    bwcEndorsed: true
  },
  {
    id: "2befresh-cleaner",
    name: "2BeFresh - Natural All-Purpose Cleaner",
    price: 95,
    wellCoins: 47,
    category: "homecare",
    image: getProductImage("2befresh-cleaner"),
    teamCreator: 'feroza',
    shortDescription: "Natural all-purpose cleaning spray with plant-based ingredients for a chemical-free, eco-friendly home.",
    fullDescription: "Transform your cleaning routine with 2BeFresh all-purpose cleaner. This powerful, plant-based formula effectively removes dirt, grease, and grime from all household surfaces without harsh chemicals. Safe for your family, pets, and the environment, 2BeFresh leaves your home sparkling clean with a fresh, natural scent.",
    benefits: [
      "Powerful cleaning without harsh chemicals",
      "Safe for all household surfaces",
      "Biodegradable and eco-friendly",
      "Fresh, natural scent",
      "Non-toxic and pet-safe"
    ],
    ingredients: "Purified Water, Castile Soap, White Vinegar, Lemon Essential Oil, Tea Tree Essential Oil, Eucalyptus Essential Oil",
    usage: "Spray directly onto surface and wipe clean with a cloth. For tough stains, let sit for 1-2 minutes before wiping. Shake well before use. Safe for kitchen counters, bathrooms, floors, and most household surfaces.",
    size: "500ml",
    certifications: ["100% Vegan", "Cruelty-Free", "Natural Ingredients", "Biodegradable", "Made in South Africa"],
    featured: false
  }
];

// Utility functions
export const getFeaturedProducts = (): TwoBeWellProduct[] => {
  return twoBeWellProducts.filter(product => product.featured);
};

export const getProductsByCategory = (category: TwoBeWellProduct['category']): TwoBeWellProduct[] => {
  return twoBeWellProducts.filter(product => product.category === category);
};

export const getProductById = (id: string): TwoBeWellProduct | undefined => {
  return twoBeWellProducts.find(product => product.id === id);
};

export const getBWCEndorsedProducts = (): TwoBeWellProduct[] => {
  return twoBeWellProducts.filter(product => product.bwcEndorsed);
};
