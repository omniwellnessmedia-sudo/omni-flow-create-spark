// 30 Standardized Wellness Travel Activities
// Each activity maps to connectivity needs and curated eSIM recommendations

export interface WellnessActivity {
  id: string;
  name: string;
  category: 'Movement & Nature' | 'Mind & Meditation' | 'Healing & Bodywork' | 'Adventure & Exploration' | 'Community & Growth';
  icon: string;
  dataNeeds: 'minimal' | 'light' | 'moderate' | 'heavy' | 'unlimited';
  recommendedGB: string;
  keyApps: string[];
  connectivityTips: string;
  wellnessIntentBadge: string;
}

export interface WellnessIntentBadge {
  badge: string;
  intent: string;
  dataRange: string;
}

export const wellnessIntentBadges: WellnessIntentBadge[] = [
  { badge: '🧘', intent: 'Meditation & Mindfulness', dataRange: '1-3GB' },
  { badge: '🥾', intent: 'Active Adventure', dataRange: '5-10GB' },
  { badge: '🌊', intent: 'Ocean & Water Wellness', dataRange: '5GB' },
  { badge: '🌿', intent: 'Nature Immersion', dataRange: '3-5GB' },
  { badge: '🎪', intent: 'Community & Events', dataRange: '10GB+' },
  { badge: '✨', intent: 'Healing Journeys', dataRange: '3GB' },
  { badge: '📸', intent: 'Documentation & Creation', dataRange: '10-20GB' },
  { badge: '🧭', intent: 'Explorer & Multi-Country', dataRange: 'Unlimited' },
];

export const wellnessTravelActivities: WellnessActivity[] = [
  // Movement & Nature (10)
  {
    id: 'hiking',
    name: 'Hiking',
    category: 'Movement & Nature',
    icon: '🥾',
    dataNeeds: 'moderate',
    recommendedGB: '5-10',
    keyApps: ['GPS Navigation', 'Offline Maps', 'Weather', 'Camera'],
    connectivityTips: 'Download offline maps before your hike. A 5GB plan covers GPS tracking and emergency sharing.',
    wellnessIntentBadge: '🥾',
  },
  {
    id: 'trail-running',
    name: 'Trail Running',
    category: 'Movement & Nature',
    icon: '🏃',
    dataNeeds: 'moderate',
    recommendedGB: '5-10',
    keyApps: ['Strava', 'AllTrails', 'Spotify', 'Emergency SOS'],
    connectivityTips: 'Fitness tracking apps sync efficiently. 5GB handles route mapping and music streaming.',
    wellnessIntentBadge: '🥾',
  },
  {
    id: 'forest-bathing',
    name: 'Forest Bathing (Shinrin-yoku)',
    category: 'Movement & Nature',
    icon: '🌲',
    dataNeeds: 'light',
    recommendedGB: '1-3',
    keyApps: ['Meditation Apps', 'Nature Sounds', 'Camera'],
    connectivityTips: 'Minimal data needed - focus on presence. 1GB provides peace of mind backup.',
    wellnessIntentBadge: '🌿',
  },
  {
    id: 'beach-walking',
    name: 'Beach Walking',
    category: 'Movement & Nature',
    icon: '🏖️',
    dataNeeds: 'light',
    recommendedGB: '3-5',
    keyApps: ['Camera', 'Tide Apps', 'Weather', 'Social Sharing'],
    connectivityTips: 'Light usage for photos and sunset shares. 3GB is plenty for a beach wellness trip.',
    wellnessIntentBadge: '🌊',
  },
  {
    id: 'mountain-climbing',
    name: 'Mountain Climbing',
    category: 'Movement & Nature',
    icon: '🏔️',
    dataNeeds: 'moderate',
    recommendedGB: '5-10',
    keyApps: ['Emergency SOS', 'Offline Maps', 'Weather Alerts', 'Location Sharing'],
    connectivityTips: 'Safety first - ensure emergency coverage. Download everything offline before ascent.',
    wellnessIntentBadge: '🥾',
  },
  {
    id: 'surfing',
    name: 'Surfing & Water Sports',
    category: 'Movement & Nature',
    icon: '🏄',
    dataNeeds: 'moderate',
    recommendedGB: '5',
    keyApps: ['Surf Reports', 'Weather', 'Tide Charts', 'GoPro Connect'],
    connectivityTips: 'Check conditions before dawn sessions. 5GB covers reports and video uploads.',
    wellnessIntentBadge: '🌊',
  },
  {
    id: 'cycling',
    name: 'Cycling Tours',
    category: 'Movement & Nature',
    icon: '🚴',
    dataNeeds: 'moderate',
    recommendedGB: '5-10',
    keyApps: ['Komoot', 'Strava', 'Navigation', 'Music'],
    connectivityTips: 'Navigation is key for touring. 10GB recommended for multi-day cycling adventures.',
    wellnessIntentBadge: '🥾',
  },
  {
    id: 'safari',
    name: 'Safari & Wildlife',
    category: 'Movement & Nature',
    icon: '🦁',
    dataNeeds: 'heavy',
    recommendedGB: '10-20',
    keyApps: ['Camera', 'Wildlife ID', 'Guide Communication', 'Photo Backup'],
    connectivityTips: 'You will take thousands of photos! 10GB+ for uploads. Check lodge WiFi availability.',
    wellnessIntentBadge: '📸',
  },
  {
    id: 'kayaking',
    name: 'Kayaking & Paddleboarding',
    category: 'Movement & Nature',
    icon: '🛶',
    dataNeeds: 'light',
    recommendedGB: '3',
    keyApps: ['Weather', 'Location Sharing', 'Emergency SOS'],
    connectivityTips: 'Minimal but reliable - waterproof your device! 3GB for safety connectivity.',
    wellnessIntentBadge: '🌊',
  },
  {
    id: 'cold-plunge',
    name: 'Cold Plunge & Wild Swimming',
    category: 'Movement & Nature',
    icon: '🧊',
    dataNeeds: 'light',
    recommendedGB: '1-3',
    keyApps: ['Location Sharing', 'Temperature Apps', 'Timer'],
    connectivityTips: 'Safety first - share your location. 1GB provides essential connectivity.',
    wellnessIntentBadge: '🌿',
  },

  // Mind & Meditation (6)
  {
    id: 'meditation-retreat',
    name: 'Guided Meditation Retreats',
    category: 'Mind & Meditation',
    icon: '🧘',
    dataNeeds: 'minimal',
    recommendedGB: '1-3',
    keyApps: ['Insight Timer', 'Calm', 'Emergency Contact'],
    connectivityTips: 'Less is more. 1GB for emergencies while you focus inward.',
    wellnessIntentBadge: '🧘',
  },
  {
    id: 'silent-retreat',
    name: 'Silent Retreats (Vipassana)',
    category: 'Mind & Meditation',
    icon: '🤫',
    dataNeeds: 'minimal',
    recommendedGB: '1',
    keyApps: ['Emergency Only'],
    connectivityTips: 'Ultra-minimal by design. 1GB for peace of mind - your phone stays off.',
    wellnessIntentBadge: '🧘',
  },
  {
    id: 'sound-bath',
    name: 'Sound Bath & Sound Healing',
    category: 'Mind & Meditation',
    icon: '🎶',
    dataNeeds: 'light',
    recommendedGB: '3',
    keyApps: ['Spotify', 'YouTube Music', 'Recording Apps'],
    connectivityTips: 'Stream healing frequencies. 3GB for audio content and session recordings.',
    wellnessIntentBadge: '✨',
  },
  {
    id: 'breathwork',
    name: 'Breathwork Workshops',
    category: 'Mind & Meditation',
    icon: '💨',
    dataNeeds: 'light',
    recommendedGB: '3',
    keyApps: ['Breathwrk', 'Wim Hof', 'Heart Rate Monitors'],
    connectivityTips: 'App-guided sessions need reliable connection. 3GB for workshop immersion.',
    wellnessIntentBadge: '🧘',
  },
  {
    id: 'digital-detox',
    name: 'Digital Detox Programs',
    category: 'Mind & Meditation',
    icon: '📵',
    dataNeeds: 'minimal',
    recommendedGB: '1',
    keyApps: ['Emergency Contact Only'],
    connectivityTips: 'Ironically, you need data to fully disconnect safely. 1GB emergency backup.',
    wellnessIntentBadge: '🧘',
  },
  {
    id: 'journaling',
    name: 'Mindfulness Journaling',
    category: 'Mind & Meditation',
    icon: '📓',
    dataNeeds: 'light',
    recommendedGB: '1-3',
    keyApps: ['Day One', 'Notion', 'Cloud Sync'],
    connectivityTips: 'Light cloud sync for your reflections. 1GB handles text-based journaling.',
    wellnessIntentBadge: '🧘',
  },

  // Healing & Bodywork (6)
  {
    id: 'yoga-retreat',
    name: 'Yoga Retreats',
    category: 'Healing & Bodywork',
    icon: '🧘‍♀️',
    dataNeeds: 'moderate',
    recommendedGB: '5',
    keyApps: ['Yoga Apps', 'Class Videos', 'Booking', 'Social'],
    connectivityTips: 'Video classes need bandwidth. 5GB for a week-long retreat experience.',
    wellnessIntentBadge: '✨',
  },
  {
    id: 'spa-wellness',
    name: 'Spa & Thermal Wellness',
    category: 'Healing & Bodywork',
    icon: '♨️',
    dataNeeds: 'light',
    recommendedGB: '3',
    keyApps: ['Booking Apps', 'Relaxation Music', 'Reviews'],
    connectivityTips: 'Light usage - you are here to unplug. 3GB for bookings and relaxation streaming.',
    wellnessIntentBadge: '✨',
  },
  {
    id: 'ayurveda',
    name: 'Ayurvedic Treatments',
    category: 'Healing & Bodywork',
    icon: '🌿',
    dataNeeds: 'light',
    recommendedGB: '3',
    keyApps: ['Practitioner Communication', 'Health Tracking', 'Recipes'],
    connectivityTips: 'Communication with practitioners. 3GB for a healing journey.',
    wellnessIntentBadge: '✨',
  },
  {
    id: 'traditional-healing',
    name: 'Traditional Healing Ceremonies',
    category: 'Healing & Bodywork',
    icon: '🪶',
    dataNeeds: 'light',
    recommendedGB: '3-5',
    keyApps: ['Translation', 'Documentation', 'Voice Recording'],
    connectivityTips: 'Translation apps and cultural documentation. 3GB for respectful engagement.',
    wellnessIntentBadge: '✨',
  },
  {
    id: 'massage-journey',
    name: 'Massage & Bodywork Journeys',
    category: 'Healing & Bodywork',
    icon: '💆',
    dataNeeds: 'light',
    recommendedGB: '3',
    keyApps: ['Booking', 'Reviews', 'Maps'],
    connectivityTips: 'Find and book the best practitioners. 3GB for a relaxing trip.',
    wellnessIntentBadge: '✨',
  },
  {
    id: 'detox-retreat',
    name: 'Detox & Fasting Retreats',
    category: 'Healing & Bodywork',
    icon: '🥬',
    dataNeeds: 'light',
    recommendedGB: '3',
    keyApps: ['Health Monitoring', 'Fasting Apps', 'Emergency Contact'],
    connectivityTips: 'Health apps for tracking your journey. 3GB for safe detox.',
    wellnessIntentBadge: '✨',
  },

  // Adventure & Exploration (4)
  {
    id: 'cultural-immersion',
    name: 'Cultural Immersion Tours',
    category: 'Adventure & Exploration',
    icon: '🌍',
    dataNeeds: 'heavy',
    recommendedGB: '10',
    keyApps: ['Google Translate', 'Navigation', 'Camera', 'Cultural Guides'],
    connectivityTips: 'Translation and navigation are essential. 10GB for deep cultural exploration.',
    wellnessIntentBadge: '🧭',
  },
  {
    id: 'eco-tourism',
    name: 'Eco-Tourism',
    category: 'Adventure & Exploration',
    icon: '🌱',
    dataNeeds: 'moderate',
    recommendedGB: '5',
    keyApps: ['Conservation Apps', 'Wildlife ID', 'Nature Guides'],
    connectivityTips: 'Document and learn about ecosystems. 5GB for conscious exploration.',
    wellnessIntentBadge: '🌿',
  },
  {
    id: 'stargazing',
    name: 'Stargazing & Astronomy',
    category: 'Adventure & Exploration',
    icon: '⭐',
    dataNeeds: 'light',
    recommendedGB: '3',
    keyApps: ['SkyView', 'Star Walk', 'Astrophotography'],
    connectivityTips: 'Remote locations need reliable backup. 3GB for astronomy apps.',
    wellnessIntentBadge: '🌿',
  },
  {
    id: 'pilgrimage',
    name: 'Pilgrimage & Sacred Site Visits',
    category: 'Adventure & Exploration',
    icon: '🕉️',
    dataNeeds: 'moderate',
    recommendedGB: '5',
    keyApps: ['Audio Guides', 'Spiritual Apps', 'Translation', 'Maps'],
    connectivityTips: 'Audio guides enrich sacred experiences. 5GB for a meaningful pilgrimage.',
    wellnessIntentBadge: '🧭',
  },

  // Community & Growth (4)
  {
    id: 'wellness-conference',
    name: 'Wellness Conferences & Events',
    category: 'Community & Growth',
    icon: '🎤',
    dataNeeds: 'heavy',
    recommendedGB: '10-20',
    keyApps: ['LinkedIn', 'Zoom', 'Social Media', 'Networking Apps'],
    connectivityTips: 'High data for networking and live streaming. 10GB+ for full participation.',
    wellnessIntentBadge: '🎪',
  },
  {
    id: 'retreat-facilitation',
    name: 'Retreat Facilitation',
    category: 'Community & Growth',
    icon: '🎯',
    dataNeeds: 'heavy',
    recommendedGB: '10-20',
    keyApps: ['Video Calls', 'Group Coordination', 'Scheduling'],
    connectivityTips: 'You need reliable connection for your participants. 10GB+ for facilitators.',
    wellnessIntentBadge: '🎪',
  },
  {
    id: 'community-gathering',
    name: 'Conscious Community Gatherings',
    category: 'Community & Growth',
    icon: '👥',
    dataNeeds: 'heavy',
    recommendedGB: '10',
    keyApps: ['Social Sharing', 'Live Streaming', 'Event Apps'],
    connectivityTips: 'Share the experience with your community. 10GB for documentation.',
    wellnessIntentBadge: '🎪',
  },
  {
    id: 'plant-medicine',
    name: 'Plant Medicine Ceremonies',
    category: 'Community & Growth',
    icon: '🍃',
    dataNeeds: 'minimal',
    recommendedGB: '1-3',
    keyApps: ['Emergency Contacts', 'Integration Apps', 'Journaling'],
    connectivityTips: 'Safety-focused minimal data. 1GB for emergency contacts and integration support.',
    wellnessIntentBadge: '✨',
  },
];

// Helper function to get activities by category
export const getActivitiesByCategory = (category: WellnessActivity['category']) => {
  return wellnessTravelActivities.filter(activity => activity.category === category);
};

// Helper function to get activities by data need
export const getActivitiesByDataNeed = (dataNeeds: WellnessActivity['dataNeeds']) => {
  return wellnessTravelActivities.filter(activity => activity.dataNeeds === dataNeeds);
};

// Helper function to get activity by ID
export const getActivityById = (id: string) => {
  return wellnessTravelActivities.find(activity => activity.id === id);
};

// Categories for UI display
export const wellnessCategories = [
  { id: 'Movement & Nature', icon: '🥾', count: 10 },
  { id: 'Mind & Meditation', icon: '🧘', count: 6 },
  { id: 'Healing & Bodywork', icon: '✨', count: 6 },
  { id: 'Adventure & Exploration', icon: '🧭', count: 4 },
  { id: 'Community & Growth', icon: '🎪', count: 4 },
] as const;
