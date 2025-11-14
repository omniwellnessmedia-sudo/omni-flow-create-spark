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
  nutritionalInfo?: {
    servingSize: string;
    perServing?: Array<{ nutrient: string; amount: string; rda?: string }>;
    per100g?: Array<{ nutrient: string; amount: string; rda?: string }>;
  };
  cautions?: string[];
  featured?: boolean;
}

export const twoBeWellProducts: TwoBeWellProduct[] = [
  {
    id: "2bekissed-lip-balm",
    name: "2BeKissed - Natural Lip Balm",
    price: 85,
    wellCoins: 42,
    category: "skincare",
    image: "/lovable-uploads/2bewell-lip-balm-label.tif",
    shortDescription: "Mint-infused natural lip balm with Shea Butter, Coconut Oil, and Vitamin E for lasting moisture and protection.",
    fullDescription: "Experience the refreshing touch of our mint-infused natural lip balm. Handcrafted with premium ingredients, 2BeKissed provides deep hydration and protection for your lips. The combination of Shea Butter and Coconut Oil creates a smooth, non-greasy formula that locks in moisture, while Vitamin E nourishes and protects against environmental damage.",
    benefits: [
      "Deep hydration with Shea Butter and Coconut Oil",
      "Refreshing mint sensation",
      "Vitamin E protection against environmental damage",
      "Long-lasting moisture barrier",
      "100% natural and vegan ingredients"
    ],
    ingredients: "Shea Butter, Coconut Oil, Candelilla Wax, Peppermint Essential Oil, Vitamin E",
    usage: "Apply generously to lips as needed throughout the day. Perfect for daily use, especially in dry or cold weather.",
    size: "15ml",
    certifications: ["100% Vegan", "Cruelty-Free", "Natural Ingredients", "Handmade in South Africa"],
    featured: true
  },
  {
    id: "2beglow-face-serum",
    name: "2BeGlow - Radiance Face Serum",
    price: 165,
    wellCoins: 82,
    category: "skincare",
    image: "/lovable-uploads/2bewell-face-serum-label.tif",
    shortDescription: "Glow & Calm face serum with Macadamia Nut Oil and Essential Oil Blend for radiant, healthy-looking skin.",
    fullDescription: "Unlock your skin's natural radiance with 2BeGlow face serum. This lightweight, fast-absorbing formula combines the nourishing power of Macadamia Nut Oil with a carefully selected blend of essential oils. Perfect for all skin types, this serum helps calm irritation, reduce inflammation, and promote a healthy, glowing complexion.",
    benefits: [
      "Promotes radiant, glowing skin",
      "Calms and soothes irritated skin",
      "Rich in antioxidants and fatty acids",
      "Fast-absorbing, non-greasy formula",
      "Suitable for all skin types"
    ],
    ingredients: "Macadamia Nut Oil, Jojoba Oil, Rosehip Oil, Lavender Essential Oil, Frankincense Essential Oil, Vitamin E",
    usage: "Apply 2-3 drops to clean, damp skin morning and evening. Gently massage into face and neck in upward circular motions. Follow with your favorite moisturizer.",
    size: "30ml",
    certifications: ["100% Vegan", "Cruelty-Free", "Natural Ingredients", "Handmade in South Africa"],
    featured: true
  },
  {
    id: "2besmooth-body-butter",
    name: "2BeSmooth - Whipped Body Butter",
    price: 125,
    wellCoins: 62,
    category: "skincare",
    image: "/lovable-uploads/2bewell-body-butter-label.tif",
    shortDescription: "Luxuriously whipped body butter with Shea Butter, Cocoa Butter, and nourishing oils for silky-smooth skin.",
    fullDescription: "Indulge your skin with 2BeSmooth whipped body butter. This rich, creamy formula melts into your skin, providing intense hydration and nourishment. The combination of Shea and Cocoa Butter with Sweet Almond and Coconut Oils creates a protective barrier that locks in moisture all day long, leaving your skin feeling soft, supple, and smooth.",
    benefits: [
      "Intense deep hydration for dry skin",
      "Luxurious whipped texture that melts on contact",
      "Long-lasting moisture retention",
      "Improves skin elasticity and texture",
      "Soothes and nourishes all skin types"
    ],
    ingredients: "Shea Butter, Cocoa Butter, Coconut Oil, Sweet Almond Oil, Arrowroot Powder, Vitamin E, Natural Fragrance",
    usage: "Apply generously to clean skin after bathing or showering. Massage in circular motions until fully absorbed. Use daily for best results, especially on dry areas like elbows, knees, and heels.",
    size: "200ml",
    certifications: ["100% Vegan", "Cruelty-Free", "Natural Ingredients", "Handmade in South Africa"],
    featured: true
  },
  {
    id: "2befresh-cleaner",
    name: "2BeFresh - All-Purpose Cleaner",
    price: 95,
    wellCoins: 47,
    category: "homecare",
    image: "/lovable-uploads/2bewell-cleaner-label.tif",
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
    image: "/lovable-uploads/2bewell-chia-seeds-label.tif",
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
        { nutrient: "Magnesium", amount: "335mg", rda: "84%" },
        { nutrient: "Iron", amount: "7.7mg", rda: "43%" },
        { nutrient: "Calcium", amount: "631mg", rda: "48%" },
        { nutrient: "Fiber", amount: "34g", rda: "136%" },
        { nutrient: "Protein", amount: "17g", rda: "34%" },
        { nutrient: "Omega-3 ALA", amount: "18g", rda: "N/A" }
      ]
    },
    cautions: [
      "Consume with sufficient water to avoid digestive discomfort",
      "Do not exceed 2 tablespoons per day without consulting a healthcare provider",
      "May interact with blood thinners - consult your doctor if on medication"
    ],
    featured: true
  },
  {
    id: "pea-protein-powder",
    name: "2BeStrong - 80% Pea Protein Powder",
    price: 285,
    wellCoins: 142,
    category: "nutrition",
    image: "/lovable-uploads/2bewell-pea-protein-label.tif",
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
      servingSize: "1 scoop (25g)",
      per100g: [
        { nutrient: "Protein", amount: "80g", rda: "160%" },
        { nutrient: "Iron", amount: "33.4mg", rda: "186%" },
        { nutrient: "Carbohydrates", amount: "5g", rda: "2%" },
        { nutrient: "Fat", amount: "8g", rda: "12%" },
        { nutrient: "Fiber", amount: "3g", rda: "12%" }
      ]
    },
    cautions: [
      "Individuals with kidney concerns should consult a healthcare provider before use",
      "Ensure adequate hydration when consuming protein supplements",
      "Do not exceed recommended daily protein intake for your body weight"
    ],
    featured: true
  }
];

export const getFeaturedProducts = () => twoBeWellProducts.filter(p => p.featured);
export const getProductsByCategory = (category: TwoBeWellProduct['category']) => 
  twoBeWellProducts.filter(p => p.category === category);
export const getProductById = (id: string) => twoBeWellProducts.find(p => p.id === id);
