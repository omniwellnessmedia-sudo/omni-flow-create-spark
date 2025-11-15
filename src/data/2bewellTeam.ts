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
    role: 'Co-Founder & Skincare Specialist',
    image: 'https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/Zenith_TNT_OMNI-9.jpg',
    bio: 'Passionate about natural ingredients and the healing power of plants. Zenith crafts each skincare product with love and scientific precision.',
    specialties: ['Skincare Formulation', 'Essential Oils', 'Natural Preservatives', 'Product Development'],
    email: 'zenith@2bewell.co.za',
    instagram: '@zenith_2bewell'
  },
  {
    name: 'Feroza',
    role: 'Co-Founder & Nutrition Expert',
    image: 'https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/feroza%20begg%20-%20portrait.jpg',
    bio: 'Believes in food as medicine and the power of plant-based nutrition. Feroza sources the finest superfoods and creates nourishing blends.',
    specialties: ['Plant-Based Nutrition', 'Superfood Blends', 'Home Care', 'Wellness Coaching'],
    email: 'feroza@2bewell.co.za',
    instagram: '@feroza_2bewell'
  }
];

export const getTeamMember = (name: string) => {
  return twoBeWellTeam.find(member => 
    member.name.toLowerCase() === name.toLowerCase()
  );
};
