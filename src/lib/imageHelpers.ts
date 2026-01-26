/**
 * Image Helper for 2BeWell Products
 * Loads images from Supabase storage with fallback system
 */

const SUPABASE_URL = 'https://dtjmhieeywdvhjxqyxad.supabase.co';
const STORAGE_BUCKET = 'provider-images';
const PRODUCT_FOLDER = 'product-images%20(2BeWell%20Products)';

/**
 * Get image URL from Supabase storage with fallback
 */
export const get2BeWellImage = (
  fileName: string,
  folder: 'products' | 'bundles' | 'team' | 'lifestyle' = 'products'
): string => {
  // Map to actual storage file names based on your upload
  const storageMap: Record<string, string> = {
    // Products (numbered files in storage)
    'lip-balm': '6.png',
    'face-serum': '9.png',
    'body-butter': '10.png',
    'home-cleaner': '11.png',
    'chia-seeds': '5.png',
    'pea-protein': '6.png',
    // Team
    'zenith': '10.png',
    'feroza': '10.png', // Use same for now, update when you upload Feroza's photo
    // Bundles/lifestyle
    'hero-collage': '13.jpg',
    'bundle-skincare': '1.jpg',
    'bundle-complete': '2.jpg',
    'bundle-wellness': '5.png',
    'bundle-starter': '2.jpg',
  };

  const storageFileName = storageMap[fileName] || 'coming soon.jpg';
  const storagePath = `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${PRODUCT_FOLDER}/${storageFileName}`;

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

  const imageKey = imageMap[productId] || 'coming soon';
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
 * Image error handler with fallback
 */
export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  const img = e.currentTarget;
  
  // Prevent infinite loop
  if (img.dataset.fallbackAttempted === 'true') {
    return;
  }
  
  img.dataset.fallbackAttempted = 'true';
  
  // Use a gradient placeholder
  img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect width="400" height="400" fill="%23f0fdf4"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%2310b981" font-size="20" font-family="sans-serif"%3E2BeWell%3C/text%3E%3C/svg%3E';
};
