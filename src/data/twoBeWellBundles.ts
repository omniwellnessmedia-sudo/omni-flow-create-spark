export interface ProductBundle {
  id: string;
  name: string;
  tagline: string;
  description: string;
  products: string[]; // Product IDs
  originalPrice: number;
  bundlePrice: number;
  savings: number;
  wellCoins: number;
  featured: boolean;
  benefits: string[];
}

export const twoBeWellBundles: ProductBundle[] = [
  {
    id: "skincare-essentials",
    name: "Skincare Essentials Bundle",
    tagline: "Everything you need for radiant skin",
    description: "Complete skincare routine with our best-selling products. From lips to body, experience the full 2BeWell transformation.",
    products: ["2bekissed-lip-balm", "2beglow-face-serum", "2besmooth-body-butter"],
    originalPrice: 375, // 85 + 165 + 125
    bundlePrice: 350,
    savings: 25,
    wellCoins: 175,
    featured: true,
    benefits: [
      "Save R25 on complete routine",
      "Perfect for skincare beginners",
      "All BWC endorsed products",
      "Natural ingredients, visible results"
    ]
  },
  {
    id: "complete-selfcare",
    name: "Complete Self-Care Collection",
    tagline: "The ultimate 2BeWell experience",
    description: "All 4 premium products for head-to-toe nourishment and a sparkling clean home. The complete 2BeWell lifestyle.",
    products: ["2bekissed-lip-balm", "2beglow-face-serum", "2besmooth-body-butter", "2befresh-cleaner"],
    originalPrice: 470, // 85 + 165 + 125 + 95
    bundlePrice: 420,
    savings: 50,
    wellCoins: 210,
    featured: true,
    benefits: [
      "Save R50 on full collection",
      "Best value bundle",
      "Includes home care essential",
      "Complete natural living transformation"
    ]
  },
  {
    id: "wellness-boost",
    name: "Wellness Boost Bundle",
    tagline: "Nutrition from the inside out",
    description: "Supercharge your health with our premium nutrition duo. Omega-3 rich chia seeds and high-protein pea powder for optimal wellness.",
    products: ["chia-seeds", "pea-protein-powder"],
    originalPrice: 430, // 145 + 285
    bundlePrice: 400,
    savings: 30,
    wellCoins: 200,
    featured: true,
    benefits: [
      "Save R30 on nutrition essentials",
      "High-protein plant power",
      "Omega-3 and complete amino acids",
      "Perfect for active lifestyles"
    ]
  }
];

export const getBundleById = (id: string): ProductBundle | undefined => {
  return twoBeWellBundles.find(bundle => bundle.id === id);
};

export const getFeaturedBundles = (): ProductBundle[] => {
  return twoBeWellBundles.filter(bundle => bundle.featured);
};
