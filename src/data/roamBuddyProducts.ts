export interface CuratedESIMPick {
  id: string;
  name: string;
  curator: 'zenith' | 'chad' | 'abbi';
  whyWeChoseIt: string;
  whoShouldGet: string[];
  wellnessAngle: string;
  peaceOfMindScore: number;
  destination?: string;
  dataAmount?: string;
  validity?: string;
}

export interface CuratorProfile {
  name: string;
  role: string;
  expertise: string;
  avatar: string;
  quote: string;
  curatorId: 'zenith' | 'chad' | 'abbi';
}

export const curatedESIMPicks: CuratedESIMPick[] = [
  {
    id: 'pick-sa-retreat',
    name: 'South Africa Peace of Mind',
    curator: 'zenith',
    whyWeChoseIt: "Perfect for retreat attendees who need reliable connectivity for emergency contacts and meditation apps without international roaming stress. Covers all major wellness destinations across South Africa.",
    whoShouldGet: ['Retreat goers', 'First-time SA visitors', 'Wellness travelers'],
    wellnessAngle: 'meditation_retreat',
    peaceOfMindScore: 95,
    destination: 'South Africa',
    dataAmount: '10GB',
    validity: '30 days'
  },
  {
    id: 'pick-africa-explorer',
    name: 'Africa Explorer',
    curator: 'chad',
    whyWeChoseIt: "Multi-country coverage ideal for cultural documentation journeys across the continent. Stay connected while capturing transformative experiences from Cape Town to Cairo.",
    whoShouldGet: ['Cultural explorers', 'Documentary creators', 'Multi-country travelers'],
    wellnessAngle: 'cultural_immersion',
    peaceOfMindScore: 92,
    destination: 'Africa',
    dataAmount: '20GB',
    validity: '60 days'
  },
  {
    id: 'pick-global-zen',
    name: 'Global Zen Connectivity',
    curator: 'abbi',
    whyWeChoseIt: "For digital nomads attending wellness events worldwide - no country-hopping SIM swaps. One eSIM covers your entire conscious travel journey.",
    whoShouldGet: ['Digital nomads', 'Frequent travelers', 'Location-independent workers'],
    wellnessAngle: 'digital_nomad_wellness',
    peaceOfMindScore: 98,
    destination: 'Global',
    dataAmount: 'Unlimited',
    validity: '90 days'
  },
  {
    id: 'pick-europe-wellness',
    name: 'Europe Wellness Traveler',
    curator: 'zenith',
    whyWeChoseIt: "Covers major wellness destinations from Portuguese retreats to Swiss healing centers. Stay connected across Europe's transformative wellness landscape.",
    whoShouldGet: ['European retreat attendees', 'Wellness tourists', 'Spa travelers'],
    wellnessAngle: 'european_wellness',
    peaceOfMindScore: 94,
    destination: 'Europe',
    dataAmount: '15GB',
    validity: '45 days'
  }
];

export const curatorProfiles: Record<string, CuratorProfile> = {
  zenith: {
    name: 'Zenith',
    role: 'Retreat Coordination & Administration',
    expertise: 'Wellness Travel Connectivity',
    avatar: '/lovable-uploads/zenith-avatar.jpg',
    quote: 'Peace of mind starts with knowing you\'re connected when you need to be',
    curatorId: 'zenith'
  },
  chad: {
    name: 'Chad',
    role: 'Content & Strategy Lead',
    expertise: 'Content Creator Connectivity',
    avatar: '/lovable-uploads/chad-avatar.jpg',
    quote: 'Documenting transformation requires reliable connectivity',
    curatorId: 'chad'
  },
  abbi: {
    name: 'Abbi',
    role: 'Content Development',
    expertise: 'Digital Nomad Solutions',
    avatar: '/lovable-uploads/abbi-avatar.jpg',
    quote: 'Digital nomads need connectivity that travels as freely as they do',
    curatorId: 'abbi'
  }
};

export const partnershipStory = {
  headline: 'Why We Partner with RoamBuddy',
  description: `We've chosen RoamBuddy as our connectivity partner because staying connected during transformative travel shouldn't mean compromising your wellness journey. RoamBuddy shares our commitment to seamless, stress-free travel connectivity.`,
  benefits: [
    {
      icon: '🇿🇦',
      title: 'South African Excellence',
      description: 'Supporting local tech infrastructure and innovation'
    },
    {
      icon: '⚡',
      title: 'Instant Activation',
      description: 'No stress at arrival - activate before you land'
    },
    {
      icon: '🎧',
      title: '24/7 Support',
      description: 'Peace of mind during retreats with round-the-clock assistance'
    },
    {
      icon: '🌍',
      title: 'Wellness Destinations',
      description: 'Coverage optimized for global wellness and retreat locations'
    }
  ],
  disclaimer: `Omni Wellness Media doesn't sell connectivity directly. We guide you toward solutions that align with conscious travel. When you purchase through our platform, we earn a small commission that supports our community development work.`
};

export const trustBadges = [
  { icon: '🛡️', label: 'Peace of Mind Guarantee' },
  { icon: '⚡', label: 'Instant Activation' },
  { icon: '🌍', label: 'Global Coverage' },
  { icon: '💚', label: 'Wellness App Optimized' },
  { icon: '🎧', label: '24/7 Support' }
];

export const destinationCategories = [
  { id: 'south-africa', label: '🇿🇦 South Africa', description: 'Perfect for local retreats and safari wellness' },
  { id: 'africa', label: '🌍 Africa Regional', description: 'Multi-country coverage for African adventures' },
  { id: 'europe', label: '🇪🇺 Europe', description: 'From Portuguese retreats to Alpine healing' },
  { id: 'asia', label: '🌏 Asia', description: 'Thailand wellness, Bali retreats, and beyond' },
  { id: 'global', label: '🌐 Global', description: 'Unlimited world coverage for location-independent wellness' }
];
