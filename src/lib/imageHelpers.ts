/**
 * Image Helper for 2BeWell Products
 * Loads images from Supabase storage with fallback system
 * 
 * IMPORTANT: Folder names in Supabase contain ** which must be URL encoded as %2A%2A
 */

const SUPABASE_URL = 'https://dtjmhieeywdvhjxqyxad.supabase.co';
const STORAGE_BUCKET = 'provider-images';

// Correct folder paths with ** encoded as %2A%2A
// IMPORTANT: The folder name is "product-images** (2BeWell)" where ** must be encoded as %2A%2A
const FOLDERS = {
  products: 'product-images%2A%2A%20(2BeWell)',
  partnerLogos: 'partner-logos%2A%2A%20(Brand%20Assets)',
};

/**
 * Get image URL from Supabase storage with fallback
 */
export const get2BeWellImage = (
  fileName: string,
  folder: 'products' | 'bundles' | 'team' | 'lifestyle' = 'products'
): string => {
  // Map to actual storage file names based on your upload - CORRECTED MAPPINGS
  const storageMap: Record<string, string> = {
    // Products - using correct numbered files from Supabase storage
    'lip-balm': '3.png',
    'face-serum': '12.png',
    'body-butter': 'OMNI_2BeWell-7.jpg',
    'home-cleaner': 'all%20purpose%20cleaner%20stock.png',
    'chia-seeds': '5.png',
    'pea-protein': '6.png',
    // Team - use partner logos folder for Omni logo placeholder
    'zenith': `../${FOLDERS.partnerLogos}/OMNI%20LOGO%20FA-06(1)%20(1).png`,
    'feroza': `../${FOLDERS.partnerLogos}/OMNI%20LOGO%20FA-06(1)%20(1).png`,
    // Bundles/lifestyle
    'hero-collage': 'OMNI_2BeWell-8.jpg',
    'bundle-skincare': 'OMNI_2BeWell-7.jpg',
    'bundle-complete': 'ChatGPT%20Image%20Jun%2024%2C%202025%2C%2009_26_31%20AM.png',
    'bundle-wellness': '5.png',
    'bundle-starter': 'ChatGPT%20Image%20Jun%2024%2C%202025%2C%2009_26_31%20AM.png',
  };

  const storageFileName = storageMap[fileName] || 'OMNI_2BeWell-7.jpg';
  
  // Team images use partner-logos folder, others use products folder
  if (folder === 'team' || storageFileName.startsWith('../')) {
    return `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${FOLDERS.partnerLogos}/OMNI%20LOGO%20FA-06(1)%20(1).png`;
  }
  
  const storagePath = `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${FOLDERS.products}/${storageFileName}`;

  return storagePath;
};

/**
 * Get product image with automatic fallback
 */
export const getProductImage = (productId: string): string => {
  const imageMap: Record<string, string> = {
    '2bekissed-lip-balm': 'lip-balm',
    '2beglow-face-serum': 'face-serum',
    '2besmooth-body-butter': 'body-butter',
    '2befresh-cleaner': 'home-cleaner',
    'chia-seeds-300g': 'chia-seeds',
    'pea-protein-500g': 'pea-protein',
  };

  const imageKey = imageMap[productId] || 'body-butter';
  return get2BeWellImage(imageKey);
};

/**
 * Get bundle image
 */
export const getBundleImage = (bundleId: string): string => {
  const bundleMap: Record<string, string> = {
    'skincare-essentials': 'bundle-skincare',
    'complete-selfcare': 'bundle-complete',
    'wellness-boost': 'bundle-wellness',
    'starter-wellness': 'bundle-starter',
  };

  const imageKey = bundleMap[bundleId] || 'hero-collage';
  return get2BeWellImage(imageKey, 'bundles');
};

/**
 * Get team member image
 */
export const getTeamImage = (name: string): string => {
  return get2BeWellImage(name.toLowerCase(), 'team');
};

/**
 * Get hero/lifestyle image
 */
export const getLifestyleImage = (key: string = 'hero-collage'): string => {
  return get2BeWellImage(key, 'lifestyle');
};

/**
 * Image error handler with fallback - uses Omni logo
 * Uses correct URL encoding with ** as %2A%2A
 */
export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  const img = e.currentTarget;
  
  // Prevent infinite loop
  if (img.dataset.fallbackAttempted === 'true') {
    return;
  }
  
  img.dataset.fallbackAttempted = 'true';
  
  // Use Omni logo as fallback - correct encoding with %2A%2A for **
  img.src = 'https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/partner-logos%2A%2A%20(Brand%20Assets)/OMNI%20LOGO%20FA-06(1)%20(1).png';
};
