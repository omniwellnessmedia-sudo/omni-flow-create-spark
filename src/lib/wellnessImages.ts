// Centralized wellness images from Supabase Storage
// IMPORTANT: Folder names contain ** which must be URL encoded as %2A%2A
const SUPABASE_STORAGE_BASE = 'https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/';

// Correct folder names with ** encoded
const FOLDERS = {
  general: 'General%20Images',
  community: '%20community-images%2A%2A%20(Workshop%20Photos)',
  partnerLogos: 'partner-logos%2A%2A%20(Brand%20Assets)',
};

export const wellnessImages = {
  services: {
    yoga: `${SUPABASE_STORAGE_BASE}${FOLDERS.general}/Wellness%20retreat3%20portrait.jpg`,
    meditation: `${SUPABASE_STORAGE_BASE}${FOLDERS.general}/Wellness%20retreat%202.jpg`,
    nutrition: `${SUPABASE_STORAGE_BASE}${FOLDERS.community}/Khoe%20meisie_Omni-2.jpg`,
    healing: `${SUPABASE_STORAGE_BASE}${FOLDERS.general}/indigenous%20tour%20chief%20kingsley%20explaining.jpg`,
    fitness: `${SUPABASE_STORAGE_BASE}${FOLDERS.general}/community%20outing%202.jpg`,
    tour: `${SUPABASE_STORAGE_BASE}${FOLDERS.general}/group%20tour%20amazing%20cave%20view%20muizenberg.jpg`,
    workshop: `${SUPABASE_STORAGE_BASE}${FOLDERS.community}/Khoe%20meisie_Omni-2.jpg`,
    retreat: `${SUPABASE_STORAGE_BASE}${FOLDERS.general}/Wellness%20retreat%202.jpg`,
  },
  heroes: {
    marketplace: `${SUPABASE_STORAGE_BASE}${FOLDERS.general}/wellness%20group%20tour.jpg`,
    retreat: `${SUPABASE_STORAGE_BASE}${FOLDERS.general}/muizenberg%20cave%20view%202.jpg`,
    community: `${SUPABASE_STORAGE_BASE}${FOLDERS.general}/community%20outing%202.jpg`,
  },
  people: {
    chiefKingsley: `${SUPABASE_STORAGE_BASE}${FOLDERS.general}/Chief%20Kingsley%20amazing%20portrait.jpg`,
    chad: `${SUPABASE_STORAGE_BASE}${FOLDERS.general}/Chad%20Amazing%20portrait.jpg`,
    feroza: `${SUPABASE_STORAGE_BASE}${FOLDERS.general}/feroza%20begg%20-%20portrait.jpg`,
    zenith: `${SUPABASE_STORAGE_BASE}${FOLDERS.general}/Zenith_TNT_OMNI-9.jpg`,
  },
  logos: {
    drPhilFoundation: `${SUPABASE_STORAGE_BASE}${FOLDERS.partnerLogos}/DR%20PHIL%20LOGO%20NPO_OMNI-02.png`,
    beautyWithoutCruelty: `${SUPABASE_STORAGE_BASE}${FOLDERS.partnerLogos}/Bwc%20logo.JPG`,
  }
};

// Helper to get service image by category
export const getServiceImage = (category: string): string => {
  const categoryLower = category.toLowerCase();
  
  if (categoryLower.includes('yoga')) return wellnessImages.services.yoga;
  if (categoryLower.includes('meditation')) return wellnessImages.services.meditation;
  if (categoryLower.includes('nutrition')) return wellnessImages.services.nutrition;
  if (categoryLower.includes('heal')) return wellnessImages.services.healing;
  if (categoryLower.includes('fitness') || categoryLower.includes('training')) return wellnessImages.services.fitness;
  if (categoryLower.includes('tour')) return wellnessImages.services.tour;
  if (categoryLower.includes('workshop')) return wellnessImages.services.workshop;
  if (categoryLower.includes('retreat')) return wellnessImages.services.retreat;
  
  // Default fallback
  return wellnessImages.heroes.marketplace;
};