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
  'masturbation', 'condom', 'lubricant', 'sensual', 'seduction',
  // Underwear and intimate apparel. Added 28 Aug 2026 after catalogue shots
  // of a topless model reached a live collection page: those listings were
  // named "Panties Bliss Natural Natural" and "Bermuda Comfort Natural
  // Natural", so the only garment word on the old list, lingerie, never
  // matched. Feed imagery for this category cannot be vetted in advance, so
  // the category is excluded outright.
  'panties', 'panty', 'thong', 'brassiere', 'underwear', 'briefs',
  'boxer shorts', 'negligee', 'babydoll', 'garter', 'corset', 'bodysuit',
  'shapewear', 'nightwear', 'sleepwear', 'intimates', 'bermuda',
];

// LIMIT OF THIS APPROACH, stated plainly so nobody trusts it further than it
// deserves. These filters read names, descriptions and categories. The
// listing "Bermuda Comfort Natural Natural" carried no word indicating
// underwear, and the category the feed supplied for it was "General
// Wellness"; what made it unpublishable was its photograph, which no text
// filter can inspect. A blocklist over an unvetted third party feed reduces
// the rate of bad listings, it does not make the feed safe. The durable fix
// is an allowlist: a human approves a product before it can appear.

// Keywords to filter low-quality or non-wellness products - STRICT
const NON_WELLNESS_KEYWORDS = [
  'casino', 'gambling', 'tobacco', 'cigarette', 'vape', 'cigar',
  'weapon', 'firearm', 'ammunition', 'gun', 'knife',
  // Product classes observed reaching the live storefront on 28 Aug 2026.
  // Each matched a wellness keyword by coincidence: a Lenovo Yoga laptop
  // battery on "yoga", an organic chemistry textbook on "organic", a 1976
  // album called Natural Gas on "natural". The relevance keywords are
  // ordinary English words, so coincidental matches are inevitable and a
  // hard reject on the product class is the only reliable guard.
  // Computing and electronics
  'laptop', 'battery', 'charger', 'adapter', 'motherboard', 'toner',
  'cartridge', 'keyboard', 'monitor', 'router', 'hard drive', 'ssd',
  // Books and printed matter
  'textbook', 'paperback', 'hardcover', 'edition', 'novel', 'workbook',
  // Recorded music and film
  'vinyl', 'album', ' lp ', ' cd ', 'dvd', 'blu-ray', 'soundtrack',
  // Pantry staples and groceries
  'mustard', 'ketchup', 'mayonnaise', 'sauce', 'seasoning', 'flour',
  'sugar', 'canned', 'tinned',
  // Hardware, garden and household consumables
  'twine', 'rope', 'screws', 'nails', 'adhesive', 'sandpaper',
  'pillowcase', 'duvet', 'curtain', 'bedding',
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
  // Filter out products with very low commission (< 5%).
  // This return was previously swallowed by a literal backslash-n inside the
  // comment above, so the function returned undefined for every product that
  // carried a commission rate.
  return product.commission_rate >= 0.05;
};

// RELAXED filter - Using OR logic (any one condition passes)
export const filterQualityProducts = (products: Product[]): Product[] => {
  return products.filter(product => {
    // STRICT: Must not be adult content
    if (isAdultContent(product)) {
      return false;
    }
    
    // STRICT: Must not be non-wellness harmful products
    if (isNonWellness(product)) {
      return false;
    }
    
    // RELAXED: Pass if ANY of these conditions are met (OR logic)
    const inTrustedCategory = isInTrustedCategory(product);
    const hasWellnessKeyword = hasWellnessKeywords(product);
    const hasGoodImage = hasImage(product) && !hasBrokenImage(product);
    const hasReasonablePrice_ = hasReasonablePrice(product);
    
    // RELEVANCE. This used to be an OR that included hasGoodImage, so any
    // product carrying an image URL longer than ten characters passed,
    // whatever it was. That is how a Lenovo Yoga laptop battery (matched on
    // "yoga"), an organic chemistry textbook, a 1976 album called Natural
    // Gas, jute twine and Dijon mustard reached a wellness storefront.
    // Relevance is now required on its own terms: the product must sit in a
    // trusted wellness category or carry a wellness keyword. Having a
    // picture is not evidence of relevance.
    if (!inTrustedCategory && !hasWellnessKeyword) {
      return false;
    }

    // A listing with no usable image is not presentable either way.
    if (!hasGoodImage) {
      return false;
    }
    
    // Must have reasonable price
    if (!hasReasonablePrice_) {
      return false;
    }
    
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
