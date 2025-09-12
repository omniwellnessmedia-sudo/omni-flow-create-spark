// Complete Provider Directory Data
import { ProviderDirectory } from '@/types/provider';
import transformedSandyProfile from './transformedSandyProfile';
import chadCupidoProfile from './chadCupidoProfile';
import chiefKingsleyProfile from './chiefKingsleyProfile';
import twoBeWellProfile from './twoBeWellProfile';

export const allProviders: ProviderDirectory[] = [
  // Sandy Mitchell - Featured first as primary provider
  transformedSandyProfile,
  
  // Chad Cupido - Business Developer
  chadCupidoProfile,
  
  // Chief Kingsley - Traditional & Cultural Guide
  chiefKingsleyProfile,
  
  // 2BeWell - Wellness Products
  twoBeWellProfile
];

// Featured providers for homepage and promotional displays
export const featuredProviders = allProviders.filter(provider => provider.profile.featured);

// Get provider by ID
export const getProviderById = (id: string): ProviderDirectory | undefined => {
  return allProviders.find(provider => provider.profile.id === id);
};

// Get providers by category
export const getProvidersByCategory = (category: string): ProviderDirectory[] => {
  return allProviders.filter(provider => provider.profile.category === category);
};

// Get providers by location (contains search)
export const getProvidersByLocation = (location: string): ProviderDirectory[] => {
  return allProviders.filter(provider => 
    provider.profile.location.toLowerCase().includes(location.toLowerCase())
  );
};

// Search providers by name or specialties
export const searchProviders = (query: string): ProviderDirectory[] => {
  const searchTerm = query.toLowerCase();
  return allProviders.filter(provider => 
    provider.profile.business_name.toLowerCase().includes(searchTerm) ||
    provider.profile.description.toLowerCase().includes(searchTerm) ||
    provider.profile.specialties.some(specialty => specialty.toLowerCase().includes(searchTerm))
  );
};

// Get all unique categories
export const getUniqueCategories = (): string[] => {
  const categories = allProviders.map(provider => provider.profile.category);
  return [...new Set(categories)].sort();
};

// Get all unique locations (cities)
export const getUniqueLocations = (): string[] => {
  const locations = allProviders.map(provider => {
    // Extract city from location string
    const location = provider.profile.location;
    if (location.includes('Cape Town')) return 'Cape Town';
    if (location.includes('Eastern Cape')) return 'Eastern Cape';
    if (location.includes('Online')) return 'Online';
    return location.split(',')[0].trim();
  });
  return [...new Set(locations)].sort();
};

export default allProviders;