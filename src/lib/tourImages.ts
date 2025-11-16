// Tour image mapping - Maps tour IDs to unique images from Supabase storage
const SUPABASE_URL = "https://dtjmhieeywdvhjxqyxad.supabase.co";
const STORAGE_BASE = `${SUPABASE_URL}/storage/v1/object/public/provider-images`;

export const tourImageMap: Record<string, string> = {
  'muizenberg-cave-tours': `${STORAGE_BASE}/Tours/muizenberg%20cave%20tours/muizenberg%20cave%20%20view%201.jpg`,
  'conscious-connections-indigenous-healing': `${STORAGE_BASE}/General%20Images/indigenous%20tour%20chief%20kingsley%20explaining.jpg`,
  'weekend-wellness-table-mountain': `${STORAGE_BASE}/General%20Images/group%20tour%20amazing%20cave%20view%20muizenberg.jpg`,
  'indigenous-healing-cape-point': `${STORAGE_BASE}/General%20Images/Chief%20Kingsley%20amazing%20portrait.jpg`,
  'surf-culture-muizenberg': `${STORAGE_BASE}/General%20Images/community%20outing%202.jpg`,
  'wine-country-yoga-retreat': `${STORAGE_BASE}/General%20Images/wellness%20group%20tour.jpg`,
  'winter-wellness-fireplace-retreat': `${STORAGE_BASE}/General%20Images/Wellness%20retreat%202.jpg`,
  'service-learning-education': `${STORAGE_BASE}/General%20Images/Wellness%20retreat3%20portrait.jpg`,
  'study-abroad-conscious-living': `${STORAGE_BASE}/General%20Images/feroza%20begg%20-%20portrait.jpg`,
  'ubuntu-healing-circle': `${STORAGE_BASE}/General%20Images/chad%20cupido%20portrait.jpg`,
  'qigong-meditation-retreat': `${STORAGE_BASE}/General%20Images/community%20outing%201.jpg`,
  'sound-healing-experience': `${STORAGE_BASE}/General%20Images/khoe%20indigenous%20language%20heritage%20experience%206.jpg`,
  'traditional-healing-immersion': `${STORAGE_BASE}/General%20Images/khoe%20indigenous%20language%20heritage%20experience%207.jpg`,
};

export const getTourImage = (tourId: string, fallback: string): string => {
  return tourImageMap[tourId] || fallback;
};
