import { getBundleImage } from '@/lib/imageHelpers';

export interface TwoBeWellBundle {
  id: string;
  name: string;
  description: string;
  products: string[]; // product IDs
  originalPrice: number;
  bundlePrice: number;
  savings: number;
  wellCoins: number;
  image: string;
  featured?: boolean;
}

export const twoBeWellBundles: TwoBeWellBundle[] = [
  {
    id: "skincare-essentials",
    name: "Skincare Essentials Bundle",
    description: "Complete daily skincare routine with Lip Balm, Face Serum, and Body Butter",
    products: ["2bekissed-lip-balm", "2beglow-face-serum", "2besmooth-body-butter"],
    originalPrice: 375, // 85 + 165 + 125
    bundlePrice: 350,
    savings: 25,
    wellCoins: 175,
    image: getBundleImage("skincare-essentials"),
    featured: true
  },
  {
    id: "complete-selfcare",
    name: "Complete Self-Care Collection",
    description: "Everything you need for holistic wellness: all skincare products plus home cleaner",
    products: ["2bekissed-lip-balm", "2beglow-face-serum", "2besmooth-body-butter", "2befresh-cleaner"],
    originalPrice: 470, // 85 + 165 + 125 + 95
    bundlePrice: 420,
    savings: 50,
    wellCoins: 210,
    image: getBundleImage("complete-selfcare"),
    featured: true
  },
  {
    id: "wellness-boost",
    name: "Wellness Boost Bundle",
    description: "Supercharge your nutrition with Chia Seeds and Pea Protein powder",
    products: ["chia-seeds-300g", "pea-protein-500g"],
    originalPrice: 430, // 145 + 285
    bundlePrice: 400,
    savings: 30,
    wellCoins: 200,
    image: getBundleImage("wellness-boost")
  },
  {
    id: "starter-wellness",
    name: "Wellness Starter Pack",
    description: "Perfect introduction to 2BeWell: Face Serum and Chia Seeds",
    products: ["2beglow-face-serum", "chia-seeds-300g"],
    originalPrice: 310, // 165 + 145
    bundlePrice: 285,
    savings: 25,
    wellCoins: 142,
    image: getBundleImage("starter-wellness")
  }
];

export const getBundleByld = (id: string) => {
  return twoBeWellBundles.find(bundle => bundle.id === id);
};

export const getFeaturedBundles = () => {
  return twoBeWellBundles.filter(bundle => bundle.featured);
};
