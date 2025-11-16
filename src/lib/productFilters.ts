// Product filtering utilities for quality control

interface Product {
  name: string;
  description?: string;
  category?: string;
  image_url?: string;
  price_zar?: number;
  commission_rate?: number;
}

// Keywords to filter out adult/inappropriate products
const ADULT_KEYWORDS = [
  'adult', 'xxx', 'porn', 'erotic', 'sexual', 'intimate toys', 
  'vibrator', 'lingerie', 'bondage', 'fetish', 'sex toy'
];

// Keywords to filter low-quality or non-wellness products
const NON_WELLNESS_KEYWORDS = [
  'casino', 'gambling', 'tobacco', 'cigarette', 'vape', 'alcohol',
  'weapon', 'firearm', 'ammunition'
];

// Wellness-related categories we want to keep
const WELLNESS_CATEGORIES = [
  'yoga', 'fitness', 'meditation', 'wellness', 'health', 'nutrition',
  'supplement', 'vitamin', 'organic', 'natural', 'holistic', 'aromatherapy',
  'essential oil', 'massage', 'spa', 'beauty', 'skincare', 'herbal',
  'tea', 'protein', 'superfood', 'exercise', 'workout', 'pilates',
  'mindfulness', 'self-care', 'wellbeing', 'healing'
];

export const isAdultContent = (product: Product): boolean => {
  const searchText = `${product.name} ${product.description || ''} ${product.category || ''}`.toLowerCase();
  return ADULT_KEYWORDS.some(keyword => searchText.includes(keyword));
};

export const isNonWellness = (product: Product): boolean => {
  const searchText = `${product.name} ${product.description || ''} ${product.category || ''}`.toLowerCase();
  return NON_WELLNESS_KEYWORDS.some(keyword => searchText.includes(keyword));
};

export const isWellnessRelevant = (product: Product): boolean => {
  const searchText = `${product.name} ${product.description || ''} ${product.category || ''}`.toLowerCase();
  return WELLNESS_CATEGORIES.some(keyword => searchText.includes(keyword));
};

export const hasHighQualityImage = (product: Product): boolean => {
  if (!product.image_url) return false;
  
  // Filter out placeholder or low-quality images
  const lowQualityIndicators = ['placeholder', 'no-image', 'default', 'unavailable', 'coming-soon'];
  const imageLower = product.image_url.toLowerCase();
  
  return !lowQualityIndicators.some(indicator => imageLower.includes(indicator)) &&
         product.image_url.length > 20; // Ensure it's a real URL
};

export const hasReasonablePrice = (product: Product): boolean => {
  if (!product.price_zar) return false;
  // Filter out extremely cheap (likely junk) or suspiciously expensive products
  return product.price_zar >= 50 && product.price_zar <= 50000;
};

export const hasGoodCommission = (product: Product): boolean => {
  if (!product.commission_rate) return true; // Don't filter if commission not set
  // Filter out products with very low commission (< 5%)\\n  return product.commission_rate >= 0.05;
};

// Main filter function to apply all quality checks
export const filterQualityProducts = (products: Product[]): Product[] => {
  return products.filter(product => {
    // Must not be adult content
    if (isAdultContent(product)) return false;
    
    // Must not be non-wellness (gambling, tobacco, etc.)
    if (isNonWellness(product)) return false;
    
    // Must be wellness-relevant
    if (!isWellnessRelevant(product)) return false;
    
    // Must have high-quality image
    if (!hasHighQualityImage(product)) return false;
    
    // Must have reasonable price
    if (!hasReasonablePrice(product)) return false;
    
    // Should have good commission
    if (!hasGoodCommission(product)) return false;
    
    return true;
  });
};

// Get quality score for sorting (0-100)
export const getProductQualityScore = (product: Product): number => {
  let score = 50; // Base score
  
  // Image quality
  if (hasHighQualityImage(product)) score += 15;
  
  // Wellness relevance
  if (isWellnessRelevant(product)) score += 15;
  
  // Commission rate
  if (product.commission_rate && product.commission_rate >= 0.15) score += 10;
  else if (product.commission_rate && product.commission_rate >= 0.10) score += 5;
  
  // Price reasonableness
  if (hasReasonablePrice(product)) score += 10;
  
  return Math.min(score, 100);
};
