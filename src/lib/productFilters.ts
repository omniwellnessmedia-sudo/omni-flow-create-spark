// Product filtering utilities for quality control

interface Product {
  name: string;
  description?: string;
  category?: string;
  image_url?: string;
  price_zar?: number;
  commission_rate?: number;
}

// Keywords to filter out adult/inappropriate products - STRICT
const ADULT_KEYWORDS = [
  'adult', 'xxx', 'porn', 'erotic', 'sexual', 'intimate toys', 
  'vibrator', 'sex toy', 'bondage', 'fetish', 'lingerie', 'pleasure',
  'masturbation', 'condom', 'lubricant', 'sensual', 'seduction'
];

// Keywords to filter low-quality or non-wellness products - STRICT
const NON_WELLNESS_KEYWORDS = [
  'casino', 'gambling', 'tobacco', 'cigarette', 'vape', 'cigar',
  'weapon', 'firearm', 'ammunition', 'gun', 'knife'
];

// Trusted wellness categories - products in these categories pass without keyword check
const TRUSTED_CATEGORIES = [
  'Fitness Equipment',
  'Yoga Equipment', 
  'Yoga Essentials',
  'General Wellness',
  'Nutrition and Supplements',
  'Sports Nutrition',
  'Vitamins & Supplements',
  'Health & Beauty',
  'Organic Products',
  'Natural Products',
  'Wellness Products',
  'Exercise Equipment',
  'Workout Gear',
  'Meditation Accessories',
  'Spa Products',
  'Massage Equipment',
  'Aromatherapy',
  'Essential Oils',
  'Herbal Products',
  'Self-Care'
];

// Wellness-related keywords - optional boost for relevance
const WELLNESS_KEYWORDS = [
  'yoga', 'fitness', 'meditation', 'wellness', 'health', 'nutrition',
  'supplement', 'vitamin', 'organic', 'natural', 'holistic', 'aromatherapy',
  'essential oil', 'massage', 'spa', 'beauty', 'skincare', 'herbal',
  'tea', 'protein', 'superfood', 'exercise', 'workout', 'pilates',
  'mindfulness', 'self-care', 'wellbeing', 'healing', 'breathwork'
];

export const isAdultContent = (product: Product): boolean => {
  const searchText = `${product.name} ${product.description || ''} ${product.category || ''}`.toLowerCase();
  return ADULT_KEYWORDS.some(keyword => searchText.includes(keyword));
};

export const isNonWellness = (product: Product): boolean => {
  const searchText = `${product.name} ${product.description || ''} ${product.category || ''}`.toLowerCase();
  return NON_WELLNESS_KEYWORDS.some(keyword => searchText.includes(keyword));
};

// Check if product is in a trusted wellness category
export const isInTrustedCategory = (product: Product): boolean => {
  if (!product.category) return false;
  return TRUSTED_CATEGORIES.some(cat => 
    product.category?.toLowerCase().includes(cat.toLowerCase())
  );
};

// Check if product has wellness keywords (optional, for sorting/scoring)
export const hasWellnessKeywords = (product: Product): boolean => {
  const searchText = `${product.name} ${product.description || ''} ${product.category || ''}`.toLowerCase();
  return WELLNESS_KEYWORDS.some(keyword => searchText.includes(keyword));
};

// More lenient image check - just needs an image URL
export const hasImage = (product: Product): boolean => {
  return !!(product.image_url && product.image_url.length > 10);
};

// Check for truly broken images
export const hasBrokenImage = (product: Product): boolean => {
  if (!product.image_url) return true;
  const imageLower = product.image_url.toLowerCase();
  return imageLower.includes('no_imaged') || 
         imageLower.includes('unavailable') ||
         imageLower.includes('coming-soon');
};

export const hasReasonablePrice = (product: Product): boolean => {
  if (!product.price_zar) return true; // Don't filter if no price set
  // Filter out only extremely cheap (< R20) products
  return product.price_zar >= 20 && product.price_zar <= 100000;
};

export const hasGoodCommission = (product: Product): boolean => {
  if (!product.commission_rate) return true; // Don't filter if commission not set
  // Filter out products with very low commission (< 5%)\\n  return product.commission_rate >= 0.05;
};

// RELAXED filter - Option B approach
export const filterQualityProducts = (products: Product[]): Product[] => {
  return products.filter(product => {
    // STRICT: Must not be adult content
    if (isAdultContent(product)) {
      console.log('❌ Filtered out adult content:', product.name);
      return false;
    }
    
    // STRICT: Must not be non-wellness harmful products
    if (isNonWellness(product)) {
      console.log('❌ Filtered out non-wellness:', product.name);
      return false;
    }
    
    // RELAXED: Pass if in trusted category OR has wellness keywords OR has good image
    const inTrustedCategory = isInTrustedCategory(product);
    const hasWellnessKeyword = hasWellnessKeywords(product);
    const hasGoodImage = hasImage(product) && !hasBrokenImage(product);
    
    if (!inTrustedCategory && !hasWellnessKeyword && !hasGoodImage) {
      console.log('❌ Filtered out - no trusted category, keywords, or image:', product.name);
      return false;
    }
    
    // RELAXED: Only filter extreme prices
    if (!hasReasonablePrice(product)) {
      console.log('❌ Filtered out unreasonable price:', product.name, product.price_zar);
      return false;
    }
    
    console.log('✅ Passed filter:', product.name, { inTrustedCategory, hasWellnessKeyword, hasGoodImage });
    return true;
  });
};

// Get quality score for sorting (0-100)
export const getProductQualityScore = (product: Product): number => {
  let score = 50; // Base score
  
  // Trusted category bonus
  if (isInTrustedCategory(product)) score += 20;
  
  // Has image
  if (hasImage(product) && !hasBrokenImage(product)) score += 15;
  
  // Wellness keywords
  if (hasWellnessKeywords(product)) score += 10;
  
  // Commission rate
  if (product.commission_rate && product.commission_rate >= 0.15) score += 10;
  else if (product.commission_rate && product.commission_rate >= 0.10) score += 5;
  
  // Price reasonableness
  if (hasReasonablePrice(product)) score += 5;
  
  return Math.min(score, 100);
};
