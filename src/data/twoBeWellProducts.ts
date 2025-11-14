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
  },
  {
    id: "chia-seeds",
    name: "2BeVital - Organic Chia Seeds",
    price: 145,
    wellCoins: 72,
    category: "nutrition",
    image: getProductImage("chia-seeds-300g"),
    teamCreator: 'feroza',
    shortDescription: "Nutrient-dense organic chia seeds packed with omega-3s, fiber, and plant-based protein for sustained energy and optimal health.",
    fullDescription: "Tiny but mighty, our organic chia seeds are a nutritional powerhouse. Rich in omega-3 fatty acids, dietary fiber, and plant-based protein, these versatile seeds support digestion, heart health, and sustained energy throughout the day. Perfect for smoothies, yogurt, baking, or making chia pudding.",
    benefits: [
      "High in omega-3 fatty acids for heart and brain health",
      "Excellent source of dietary fiber (11g per 2 tablespoons)",
      "Rich in plant-based protein",
      "Supports digestive health and regularity",
      "Helps control appetite and supports weight management",
      "Loaded with calcium, magnesium, and phosphorus for bone health"
    ],
    ingredients: "100% Organic Chia Seeds (Salvia hispanica)",
    usage: "Add 1-2 tablespoons (15-30g) to smoothies, yogurt, oatmeal, or baked goods. To make chia pudding, mix 3 tablespoons with 1 cup of liquid and refrigerate overnight. Always consume with adequate water.",
    size: "300g",
    certifications: ["100% Organic", "Vegan", "Gluten-Free", "Non-GMO", "Raw"],
    nutritionalInfo: {
      servingSize: "2 tablespoons (28g)",
      per100g: [
        { nutrient: "Energy", amount: "1839kJ (439 Cal)" },
        { nutrient: "Protein", amount: "16.5g" },
        { nutrient: "Total Fat", amount: "30.7g (Saturated: 3.3g)" },
        { nutrient: "Carbohydrates", amount: "42.1g (Sugar: 0.8g)" },
        { nutrient: "Fibre", amount: "33.7g" },
        { nutrient: "Calcium", amount: "631mg", rda: "63%" },
        { nutrient: "Magnesium", amount: "335mg", rda: "96%" },
        { nutrient: "Iron", amount: "7.7mg", rda: "43%" },
        { nutrient: "Omega-3", amount: "17.6g" }
      ]
    },
    cautions: [
      "Start with small amounts",
      "Ensure adequate water intake",
      "May cause digestive discomfort if consumed in excess",
      "Consult healthcare provider if on blood thinners"
    ],
    featured: true
  },
  {
    id: "pea-protein-powder",
    name: "2BeStrong - 80% Pea Protein Powder",
    price: 285,
    wellCoins: 142,
    category: "nutrition",
    image: getProductImage("pea-protein-500g"),
    teamCreator: 'feroza',
    shortDescription: "High-protein, allergen-free supplement with 80g protein per 100g, perfect for muscle recovery, sustained energy, and plant-based nutrition.",
    fullDescription: "Fuel your body with 2BeStrong pea protein powder. This premium, allergen-free protein supplement provides 80% pure protein to support muscle repair, boost satiety, and maintain sustained energy levels. Easily digestible and rich in iron, it's the perfect addition to smoothies, shakes, or baked goods for athletes, fitness enthusiasts, or anyone seeking quality plant-based protein.",
    benefits: [
      "80g of protein per 100g for muscle building and repair",
      "Exceptionally high in iron (33.4mg per 100g - 186% RDA)",
      "Allergen-free and easily digestible",
      "Low in carbohydrates - ideal for weight management",
      "Supports post-workout recovery",
      "Promotes satiety and helps control appetite"
    ],
    ingredients: "100% Organic Pea Protein Isolate (Pisum sativum)",
    usage: "Mix 1-2 scoops (15-25g) with water, plant milk, or your favorite smoothie. Consume post-workout for muscle recovery or as a meal supplement. Athletes may use 20-30g per serving. Can also be added to baked goods, pancakes, or energy balls.",
    size: "500g",
    certifications: ["100% Organic", "Vegan", "Gluten-Free", "Non-GMO", "Allergen-Free"],
    nutritionalInfo: {
      servingSize: "15-25g (1-2 scoops)",
      per100g: [
        { nutrient: "Energy", amount: "1640kJ (392 Cal)" },
        { nutrient: "Protein", amount: "80g" },
        { nutrient: "Total Fat", amount: "7.0g" },
        { nutrient: "Carbohydrates", amount: "2.5g" },
        { nutrient: "Fibre", amount: "1.5g" },
        { nutrient: "Iron", amount: "33.4mg", rda: "186%" }
      ]
    },
    featured: true
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
