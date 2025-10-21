// Sandy Mitchell - Transformed to match new provider interface
import { ProviderDirectory } from '@/types/provider';
import { IMAGES, getImageWithFallback } from '@/lib/images';
import { sandyProviderProfile, sandyServices, sandyPackages } from './sandyMitchellProfile';

export const transformedSandyProfile: ProviderDirectory = {
  profile: {
    ...sandyProviderProfile,
    category: 'Yoga & Meditation' as const,
    languages: ['English', 'Afrikaans'],
    availability: {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      hours: '08:00 - 18:00 (SAST)'
    },
    featured: true,
    badges: ['Certified Dru Yoga Instructor', 'Buteyko Breathing Specialist', 'Healthy Back Expert']
  },
  services: sandyServices.map(service => ({
    ...service,
    // Map the old SandyService category to the new ServiceCategory
    category: service.category as any
  })),
  packages: sandyPackages
};

export default transformedSandyProfile;