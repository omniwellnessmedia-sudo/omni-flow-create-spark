import { getTeamImage } from '@/lib/imageHelpers';

export interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
  specialties: string[];
  email: string;
  instagram?: string;
}

export const twoBeWellTeam: TeamMember[] = [
  {
    name: 'Zenith',
    role: 'Co-Founder',
    image: 'https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/Zenith_TNT_OMNI-9.jpg',
    bio: 'Passionate about natural ingredients and the healing power of plants, Zenith transforms botanical treasures into conscious skincare. With an artisan\'s touch and deep respect for nature, every product is crafted with love, intention, and scientific precision.',
    specialties: ['Natural Skincare', 'Botanical Formulation', 'Essential Oils', 'Conscious Beauty'],
    email: 'zenith@2bewell.co.za',
    instagram: '@zenith_2bewell'
  },
  {
    name: 'Feroza',
    role: 'Co-Founder',
    image: 'https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/feroza%20begg%20-%20portrait.jpg',
    bio: 'A true believer in food as medicine and the transformative power of plant-based living. Feroza carefully sources the finest superfoods and creates nourishing blends that support wellness from within, proving that nature provides everything we need to thrive.',
    specialties: ['Plant-Based Wellness', 'Superfood Nutrition', 'Holistic Health', 'Natural Living'],
    email: 'feroza@2bewell.co.za',
    instagram: '@feroza_2bewell'
  }
];

export const getTeamMember = (name: string) => {
  return twoBeWellTeam.find(member => 
    member.name.toLowerCase() === name.toLowerCase()
  );
};
