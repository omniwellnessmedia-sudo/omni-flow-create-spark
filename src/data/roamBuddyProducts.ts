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

export interface Country {
  code: string;
  name: string;
  flag: string;
}

export interface Testimonial {
  name: string;
  title: string;
  quote: string;
  image: string;
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

export const countries: Country[] = [
  // Africa
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬' },
  { code: 'MA', name: 'Morocco', flag: '🇲🇦' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭' },
  { code: 'ET', name: 'Ethiopia', flag: '🇪🇹' },
  { code: 'TZ', name: 'Tanzania', flag: '🇹🇿' },
  { code: 'UG', name: 'Uganda', flag: '🇺🇬' },
  { code: 'RW', name: 'Rwanda', flag: '🇷🇼' },
  { code: 'SN', name: 'Senegal', flag: '🇸🇳' },
  { code: 'TN', name: 'Tunisia', flag: '🇹🇳' },
  { code: 'BW', name: 'Botswana', flag: '🇧🇼' },
  { code: 'NA', name: 'Namibia', flag: '🇳🇦' },
  { code: 'MU', name: 'Mauritius', flag: '🇲🇺' },
  { code: 'SC', name: 'Seychelles', flag: '🇸🇨' },
  { code: 'ZM', name: 'Zambia', flag: '🇿🇲' },
  { code: 'ZW', name: 'Zimbabwe', flag: '🇿🇼' },
  { code: 'MZ', name: 'Mozambique', flag: '🇲🇿' },
  { code: 'AO', name: 'Angola', flag: '🇦🇴' },
  
  // Europe
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹' },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴' },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰' },
  { code: 'FI', name: 'Finland', flag: '🇫🇮' },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪' },
  { code: 'GR', name: 'Greece', flag: '🇬🇷' },
  { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿' },
  { code: 'PL', name: 'Poland', flag: '🇵🇱' },
  { code: 'RO', name: 'Romania', flag: '🇷🇴' },
  { code: 'HU', name: 'Hungary', flag: '🇭🇺' },
  { code: 'HR', name: 'Croatia', flag: '🇭🇷' },
  { code: 'IS', name: 'Iceland', flag: '🇮🇸' },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺' },
  
  // Asia
  { code: 'TH', name: 'Thailand', flag: '🇹🇭' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳' },
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
  { code: 'TW', name: 'Taiwan', flag: '🇹🇼' },
  { code: 'HK', name: 'Hong Kong', flag: '🇭🇰' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'IL', name: 'Israel', flag: '🇮🇱' },
  { code: 'JO', name: 'Jordan', flag: '🇯🇴' },
  { code: 'OM', name: 'Oman', flag: '🇴🇲' },
  { code: 'QA', name: 'Qatar', flag: '🇶🇦' },
  { code: 'KW', name: 'Kuwait', flag: '🇰🇼' },
  { code: 'BH', name: 'Bahrain', flag: '🇧🇭' },
  { code: 'LB', name: 'Lebanon', flag: '🇱🇧' },
  { code: 'MM', name: 'Myanmar', flag: '🇲🇲' },
  { code: 'KH', name: 'Cambodia', flag: '🇰🇭' },
  { code: 'LA', name: 'Laos', flag: '🇱🇦' },
  { code: 'NP', name: 'Nepal', flag: '🇳🇵' },
  { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰' },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩' },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰' },
  { code: 'MV', name: 'Maldives', flag: '🇲🇻' },
  { code: 'MN', name: 'Mongolia', flag: '🇲🇳' },
  { code: 'KZ', name: 'Kazakhstan', flag: '🇰🇿' },
  { code: 'UZ', name: 'Uzbekistan', flag: '🇺🇿' },
  { code: 'AZ', name: 'Azerbaijan', flag: '🇦🇿' },
  { code: 'GE', name: 'Georgia', flag: '🇬🇪' },
  { code: 'AM', name: 'Armenia', flag: '🇦🇲' },
  
  // Americas
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴' },
  { code: 'PE', name: 'Peru', flag: '🇵🇪' },
  { code: 'VE', name: 'Venezuela', flag: '🇻🇪' },
  { code: 'EC', name: 'Ecuador', flag: '🇪🇨' },
  { code: 'BO', name: 'Bolivia', flag: '🇧🇴' },
  { code: 'PY', name: 'Paraguay', flag: '🇵🇾' },
  { code: 'UY', name: 'Uruguay', flag: '🇺🇾' },
  { code: 'CR', name: 'Costa Rica', flag: '🇨🇷' },
  { code: 'PA', name: 'Panama', flag: '🇵🇦' },
  { code: 'GT', name: 'Guatemala', flag: '🇬🇹' },
  { code: 'HN', name: 'Honduras', flag: '🇭🇳' },
  { code: 'SV', name: 'El Salvador', flag: '🇸🇻' },
  { code: 'NI', name: 'Nicaragua', flag: '🇳🇮' },
  { code: 'CU', name: 'Cuba', flag: '🇨🇺' },
  { code: 'DO', name: 'Dominican Republic', flag: '🇩🇴' },
  { code: 'JM', name: 'Jamaica', flag: '🇯🇲' },
  { code: 'TT', name: 'Trinidad and Tobago', flag: '🇹🇹' },
  { code: 'BB', name: 'Barbados', flag: '🇧🇧' },
  { code: 'BS', name: 'Bahamas', flag: '🇧🇸' },
  
  // Oceania
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿' },
  { code: 'FJ', name: 'Fiji', flag: '🇫🇯' },
  { code: 'PG', name: 'Papua New Guinea', flag: '🇵🇬' },
  { code: 'NC', name: 'New Caledonia', flag: '🇳🇨' },
  { code: 'PF', name: 'French Polynesia', flag: '🇵🇫' },
  { code: 'WS', name: 'Samoa', flag: '🇼🇸' },
  { code: 'TO', name: 'Tonga', flag: '🇹🇴' },
  { code: 'VU', name: 'Vanuatu', flag: '🇻🇺' },
  { code: 'SB', name: 'Solomon Islands', flag: '🇸🇧' },
  
  // Additional Popular Destinations
  { code: 'MT', name: 'Malta', flag: '🇲🇹' },
  { code: 'CY', name: 'Cyprus', flag: '🇨🇾' },
  { code: 'LU', name: 'Luxembourg', flag: '🇱🇺' },
  { code: 'MC', name: 'Monaco', flag: '🇲🇨' },
  { code: 'LI', name: 'Liechtenstein', flag: '🇱🇮' },
  { code: 'AD', name: 'Andorra', flag: '🇦🇩' },
  { code: 'SM', name: 'San Marino', flag: '🇸🇲' },
  { code: 'VA', name: 'Vatican City', flag: '🇻🇦' },
  { code: 'GL', name: 'Greenland', flag: '🇬🇱' },
  { code: 'BM', name: 'Bermuda', flag: '🇧🇲' },
  { code: 'KY', name: 'Cayman Islands', flag: '🇰🇾' },
  { code: 'VI', name: 'US Virgin Islands', flag: '🇻🇮' },
  { code: 'PR', name: 'Puerto Rico', flag: '🇵🇷' },
  { code: 'GU', name: 'Guam', flag: '🇬🇺' },
  { code: 'AS', name: 'American Samoa', flag: '🇦🇸' },
  { code: 'MP', name: 'Northern Mariana Islands', flag: '🇲🇵' },
  { code: 'MH', name: 'Marshall Islands', flag: '🇲🇭' },
  { code: 'FM', name: 'Micronesia', flag: '🇫🇲' },
  { code: 'PW', name: 'Palau', flag: '🇵🇼' },
  { code: 'KI', name: 'Kiribati', flag: '🇰🇮' },
  { code: 'TV', name: 'Tuvalu', flag: '🇹🇻' },
  { code: 'NR', name: 'Nauru', flag: '🇳🇷' },
  { code: 'CK', name: 'Cook Islands', flag: '🇨🇰' },
  { code: 'NU', name: 'Niue', flag: '🇳🇺' },
  { code: 'TK', name: 'Tokelau', flag: '🇹🇰' },
  { code: 'BN', name: 'Brunei', flag: '🇧🇳' },
  { code: 'TL', name: 'Timor-Leste', flag: '🇹🇱' },
  { code: 'BT', name: 'Bhutan', flag: '🇧🇹' },
  { code: 'AF', name: 'Afghanistan', flag: '🇦🇫' },
  { code: 'IQ', name: 'Iraq', flag: '🇮🇶' },
  { code: 'IR', name: 'Iran', flag: '🇮🇷' },
  { code: 'SY', name: 'Syria', flag: '🇸🇾' },
  { code: 'YE', name: 'Yemen', flag: '🇾🇪' },
  { code: 'DZ', name: 'Algeria', flag: '🇩🇿' },
  { code: 'LY', name: 'Libya', flag: '🇱🇾' },
  { code: 'SD', name: 'Sudan', flag: '🇸🇩' },
  { code: 'SS', name: 'South Sudan', flag: '🇸🇸' },
  { code: 'SO', name: 'Somalia', flag: '🇸🇴' },
  { code: 'DJ', name: 'Djibouti', flag: '🇩🇯' },
  { code: 'ER', name: 'Eritrea', flag: '🇪🇷' },
  { code: 'CF', name: 'Central African Republic', flag: '🇨🇫' },
  { code: 'TD', name: 'Chad', flag: '🇹🇩' },
  { code: 'NE', name: 'Niger', flag: '🇳🇪' },
  { code: 'ML', name: 'Mali', flag: '🇲🇱' },
  { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫' },
  { code: 'CI', name: 'Ivory Coast', flag: '🇨🇮' },
  { code: 'GM', name: 'Gambia', flag: '🇬🇲' },
  { code: 'GN', name: 'Guinea', flag: '🇬🇳' },
  { code: 'GW', name: 'Guinea-Bissau', flag: '🇬🇼' },
  { code: 'LR', name: 'Liberia', flag: '🇱🇷' },
  { code: 'SL', name: 'Sierra Leone', flag: '🇸🇱' },
  { code: 'TG', name: 'Togo', flag: '🇹🇬' },
  { code: 'BJ', name: 'Benin', flag: '🇧🇯' },
  { code: 'CM', name: 'Cameroon', flag: '🇨🇲' },
  { code: 'CG', name: 'Congo', flag: '🇨🇬' },
  { code: 'CD', name: 'Democratic Republic of Congo', flag: '🇨🇩' },
  { code: 'GA', name: 'Gabon', flag: '🇬🇦' },
  { code: 'GQ', name: 'Equatorial Guinea', flag: '🇬🇶' },
  { code: 'ST', name: 'São Tomé and Príncipe', flag: '🇸🇹' },
  { code: 'BI', name: 'Burundi', flag: '🇧🇮' },
  { code: 'MW', name: 'Malawi', flag: '🇲🇼' },
  { code: 'KM', name: 'Comoros', flag: '🇰🇲' },
  { code: 'MG', name: 'Madagascar', flag: '🇲🇬' },
  { code: 'RE', name: 'Réunion', flag: '🇷🇪' },
  { code: 'YT', name: 'Mayotte', flag: '🇾🇹' },
  { code: 'LS', name: 'Lesotho', flag: '🇱🇸' },
  { code: 'SZ', name: 'Eswatini', flag: '🇸🇿' },
];

export const testimonials: Testimonial[] = [
  {
    name: "Ewa K.",
    title: "Flight Attendant, British Airways",
    quote: "I LOVE Roambuddy! I never travel without it. I work for British Airways as a stewardess and I am often travelling to exotic dream locations such as Mexico, Caribbean, Maldives, Mauritius, USA. Roaming with my home provider tends to be very expensive so I was pleased to buy a Roambuddy device and now I am able to get online whenever I fly to without worrying about bill shock from my home operator! Roambuddy is now an essential item for my travel luggage.",
    image: "https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/Sandy/Sandy%20_August%20shoot%20_%20omni-7.png"
  },
  {
    name: "Sarah M.",
    title: "Digital Nomad & Wellness Coach",
    quote: "As someone who travels frequently for wellness retreats, RoamBuddy has been a game-changer. The instant activation and reliable connection in over 180 countries means I can stay connected with my clients no matter where my journey takes me. Plus, the savings compared to roaming charges are incredible!",
    image: "https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/Sandy/Sandy%20_August%20shoot%20_%20omni-3.png"
  }
];
