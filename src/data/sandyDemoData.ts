// Sandy Mitchell Demo Data for Stakeholder Presentation
export interface DemoBooking {
  id: string;
  clientName: string;
  service: string;
  date: string;
  time: string;
  duration: number;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  revenue: number;
  wellcoins: number;
  location: string;
  clientEmail: string;
  notes?: string;
}

export interface DemoReview {
  id: string;
  clientName: string;
  service: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export interface DemoTransaction {
  id: string;
  type: 'booking' | 'wellcoin_exchange' | 'withdrawal';
  amount: number;
  wellcoins: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

// Sandy's realistic demo data
export const sandyDemoData = {
  profile: {
    name: "Sandy Mitchell",
    business: "Sandy Mitchell Wellness",
    specialties: ["Dru Yoga", "Buteyko Breathing", "Mindfulness"],
    rating: 4.8,
    totalReviews: 127,
    yearsExperience: 12,
    wellcoinBalance: 2847,
    zarEarnings: 24680,
    profileCompletion: 95,
    totalClients: 89,
    repeatClients: 67,
    responseTime: "Within 2 hours",
    locations: ["Stonehurst Observatory", "Online Sessions"],
    bio: "I'm Sandy Mitchell, a Dru Yoga and Buteyko Breathing practitioner based in Cape Town. My work is grounded in heart-based, breath awareness, that meets people where they are. I guide clients gently back to their breath, body, and inner stillness — especially those who feel disconnected from traditional wellness spaces. My sessions are soft, soulful, and rooted in real human experience.",
    avatar: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80'
  },

  recentBookings: [
    {
      id: "bk_001",
      clientName: "Emma Thompson",
      service: "Private Dru Yoga Session",
      date: "2025-09-12",
      time: "09:00",
      duration: 60,
      status: "confirmed" as const,
      revenue: 450,
      wellcoins: 25,
      location: "Stonehurst Observatory",
      clientEmail: "emma.t@email.com",
      notes: "First-time client, focus on gentle movements"
    },
    {
      id: "bk_002", 
      clientName: "Michael Chen",
      service: "Buteyko Breathing Workshop",
      date: "2025-09-13",
      time: "14:00",
      duration: 90,
      status: "confirmed" as const,
      revenue: 350,
      wellcoins: 35,
      location: "Online",
      clientEmail: "m.chen@email.com"
    },
    {
      id: "bk_003",
      clientName: "Sarah Williams",
      service: "Mindful Movement Session", 
      date: "2025-09-14",
      time: "10:30",
      duration: 75,
      status: "pending" as const,
      revenue: 380,
      wellcoins: 20,
      location: "Stonehurst Observatory",
      clientEmail: "sarah.w@email.com",
      notes: "Referred by Emma Thompson"
    },
    {
      id: "bk_004",
      clientName: "James Mitchell",
      service: "Dru Yoga for Beginners",
      date: "2025-09-15",
      time: "08:00",
      duration: 60,
      status: "confirmed" as const,
      revenue: 300,
      wellcoins: 30,
      location: "Online",
      clientEmail: "james.m@email.com"
    },
    {
      id: "bk_005",
      clientName: "Lisa Park",
      service: "Advanced Breathing Techniques",
      date: "2025-09-16",
      time: "16:00", 
      duration: 90,
      status: "confirmed" as const,
      revenue: 420,
      wellcoins: 40,
      location: "Stonehurst Observatory",
      clientEmail: "l.park@email.com"
    }
  ],

  pastBookings: [
    {
      id: "bk_past_001",
      clientName: "Rachel Green",
      service: "Private Dru Yoga Session",
      date: "2025-09-05",
      time: "11:00",
      duration: 60,
      status: "completed" as const,
      revenue: 450,
      wellcoins: 25,
      location: "Stonehurst Observatory",
      clientEmail: "r.green@email.com"
    },
    {
      id: "bk_past_002",
      clientName: "David Johnson",
      service: "Buteyko Breathing Introduction",
      date: "2025-09-03",
      time: "15:30",
      duration: 90,
      status: "completed" as const,
      revenue: 350,
      wellcoins: 35,
      location: "Online",
      clientEmail: "d.johnson@email.com"
    },
    {
      id: "bk_past_003",
      clientName: "Maria Santos",
      service: "Mindful Movement Session",
      date: "2025-09-01",
      time: "09:30",
      duration: 75,
      status: "completed" as const,
      revenue: 380,
      wellcoins: 20,
      location: "Stonehurst Observatory", 
      clientEmail: "m.santos@email.com"
    }
  ],

  reviews: [
    {
      id: "rv_001",
      clientName: "Rachel Green",
      service: "Private Dru Yoga Session",
      rating: 5,
      comment: "Sandy's approach to yoga is truly transformative. Her gentle guidance and deep knowledge of Dru yoga helped me find peace and strength I didn't know I had. Highly recommended!",
      date: "2025-09-06",
      verified: true
    },
    {
      id: "rv_002",
      clientName: "David Johnson", 
      service: "Buteyko Breathing Introduction",
      rating: 5,
      comment: "The breathing techniques Sandy taught me have completely changed my sleep quality and energy levels. Professional, knowledgeable, and truly caring.",
      date: "2025-09-04",
      verified: true
    },
    {
      id: "rv_003",
      clientName: "Maria Santos",
      service: "Mindful Movement Session",
      rating: 5,
      comment: "Sandy creates such a welcoming and healing space. Her mindfulness techniques have helped me manage stress so much better. Thank you!",
      date: "2025-09-02",
      verified: true
    },
    {
      id: "rv_004",
      clientName: "Jennifer Brown",
      service: "Dru Yoga for Beginners",
      rating: 4,
      comment: "Great introduction to Dru yoga. Sandy is patient and explains everything clearly. Looking forward to continuing sessions.",
      date: "2025-08-28",
      verified: true
    }
  ],

  transactions: [
    {
      id: "tx_001",
      type: "booking" as const,
      amount: 450,
      wellcoins: 25,
      description: "Private Dru Yoga Session - Rachel Green",
      date: "2025-09-05",
      status: "completed" as const
    },
    {
      id: "tx_002",
      type: "booking" as const,
      amount: 350,
      wellcoins: 35,
      description: "Buteyko Breathing Introduction - David Johnson",
      date: "2025-09-03",
      status: "completed" as const
    },
    {
      id: "tx_003",
      type: "wellcoin_exchange" as const,
      amount: 150,
      wellcoins: -150,
      description: "WellCoins to ZAR conversion",
      date: "2025-09-01",
      status: "completed" as const
    },
    {
      id: "tx_004",
      type: "booking" as const,
      amount: 380,
      wellcoins: 20,
      description: "Mindful Movement Session - Maria Santos",
      date: "2025-09-01",
      status: "completed" as const
    }
  ],

  monthlyStats: {
    totalEarnings: 24680,
    totalBookings: 47,
    newClients: 12,
    wellcoinsEarned: 1245,
    averageRating: 4.8,
    responseRate: 98,
    cancellationRate: 2,
    rebookingRate: 75
  },

  upcomingWeek: [
    { date: "2025-09-12", bookings: 2, revenue: 800 },
    { date: "2025-09-13", bookings: 1, revenue: 350 },
    { date: "2025-09-14", bookings: 3, revenue: 1140 },
    { date: "2025-09-15", bookings: 1, revenue: 300 },
    { date: "2025-09-16", bookings: 2, revenue: 840 },
    { date: "2025-09-17", bookings: 0, revenue: 0 },
    { date: "2025-09-18", bookings: 1, revenue: 450 }
  ]
};

// Helen Thompson - Laughinggirl Cape Town Profile Data
export const helenProviderData = {
  profile: {
    name: "Helen Thompson",
    business: "Laughinggirl Cape Town",
    specialties: ["Laughter Coaching", "Wellness Workshops", "Stress Relief", "Team Building", "Mental Health Support"],
    rating: 4.9,
    totalReviews: 89,
    yearsExperience: 8,
    wellcoinBalance: 1847,
    zarEarnings: 18950,
    profileCompletion: 92,
    totalClients: 156,
    repeatClients: 98,
    responseTime: "Within 1 hour",
    locations: ["Cape Town CBD", "Online Sessions", "Corporate Venues"],
    bio: "I'm Helen Thompson, founder of Laughinggirl Cape Town - a certified laughter coach bringing joy and wellness to individuals and organizations across the Western Cape. Through the power of therapeutic laughter, I help people reduce stress, boost immunity, and reconnect with their natural joy.",
    avatar: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80'
  },

  services: [
    {
      id: 'helen_001',
      title: 'Laughter Yoga Sessions',
      description: 'Combine laughter exercises with deep breathing techniques. Perfect for stress relief and building community connections.',
      category: 'Wellness Workshops',
      price_zar: 180,
      price_wellcoins: 150,
      duration_minutes: 90,
      location: 'Cape Town CBD',
      is_online: false,
      active: true,
      provider_id: 'helen-thompson',
      created_at: '2025-09-01T00:00:00Z',
      bookings_count: 28,
      rating: 4.9
    },
    {
      id: 'helen_002',
      title: 'Corporate Laughter Workshops',
      description: 'Team building through therapeutic laughter. Boost morale, reduce workplace stress, and improve communication.',
      category: 'Corporate Wellness',
      price_zar: 2500,
      price_wellcoins: 2000,
      duration_minutes: 120,
      location: 'Client venue or online',
      is_online: true,
      active: true,
      provider_id: 'helen-thompson',
      created_at: '2025-09-01T00:00:00Z',
      bookings_count: 15,
      rating: 5.0
    },
    {
      id: 'helen_003',
      title: 'Stress Relief Laughter Session',
      description: 'Individual sessions focused on using laughter as medicine for anxiety, depression, and chronic stress.',
      category: 'Mental Health & Wellness',
      price_zar: 450,
      price_wellcoins: 350,
      duration_minutes: 60,
      location: 'Cape Town or Online',
      is_online: true,
      active: true,
      provider_id: 'helen-thompson',
      created_at: '2025-09-01T00:00:00Z',
      bookings_count: 42,
      rating: 4.8
    },
    {
      id: 'helen_004',
      title: 'Laughter Coach Training',
      description: '3-day intensive certification program. Learn to facilitate laughter sessions and become a certified laughter professional.',
      category: 'Professional Training',
      price_zar: 3500,
      price_wellcoins: 2800,
      duration_minutes: 1440, // 3 days
      location: 'Cape Town',
      is_online: false,
      active: true,
      provider_id: 'helen-thompson',
      created_at: '2025-09-01T00:00:00Z',
      bookings_count: 8,
      rating: 5.0
    },
    {
      id: 'helen_005',
      title: 'Family Laughter Sessions',
      description: 'Bring families together through joy and laughter. Build stronger bonds and create lasting memories.',
      category: 'Family Wellness',
      price_zar: 320,
      price_wellcoins: 250,
      duration_minutes: 75,
      location: 'Cape Town venues',
      is_online: false,
      active: true,
      provider_id: 'helen-thompson',
      created_at: '2025-09-01T00:00:00Z',
      bookings_count: 22,
      rating: 4.9
    }
  ],

  recentBookings: [
    {
      id: 'helen_bk_001',
      clientName: 'Stellenbosch University',
      service: 'Corporate Laughter Workshop',
      date: '2025-09-15',
      time: '14:00',
      duration: 120,
      status: 'confirmed' as const,
      revenue: 2500,
      wellcoins: 50,
      location: 'Stellenbosch Campus',
      clientEmail: 'hr@sun.ac.za',
      notes: 'Staff wellness initiative - 40 participants'
    },
    {
      id: 'helen_bk_002',
      clientName: 'Sarah Johnson',
      service: 'Stress Relief Laughter Session',
      date: '2025-09-12',
      time: '10:00',
      duration: 60,
      status: 'confirmed' as const,
      revenue: 450,
      wellcoins: 20,
      location: 'Online',
      clientEmail: 's.johnson@email.com',
      notes: 'Dealing with work burnout'
    }
  ],

  reviews: [
    {
      id: 'helen_rv_001',
      clientName: 'Cape Town Tech Company',
      service: 'Corporate Laughter Workshop',
      rating: 5,
      comment: "Helen transformed our team dynamics! The laughter workshop was exactly what we needed. Stress levels dropped significantly and team communication improved immediately.",
      date: '2025-09-05',
      verified: true
    },
    {
      id: 'helen_rv_002',
      clientName: 'Maria Fernandez',
      service: 'Stress Relief Session',
      rating: 5,
      comment: "Life-changing experience! Helen's approach to healing through laughter has helped me overcome anxiety better than traditional therapy. Highly recommend!",
      date: '2025-09-02',
      verified: true
    }
  ]
};

export const helenAdminData = {
  platformStats: {
    totalProviders: 347,
    activeProviders: 289,
    totalUsers: 5420,
    monthlyActiveUsers: 2890,
    totalRevenue: 284750,
    monthlyRevenue: 45600,
    wellcoinCirculation: 28470,
    averageProviderRating: 4.6,
    totalBookings: 1847,
    monthlyBookings: 312,
    platformGrowth: 23.4 // percentage
  },

  topProviders: [
    {
      name: "Sandy Mitchell Wellness",
      revenue: 24680,
      bookings: 47,
      rating: 4.8,
      growth: 18.5
    },
    {
      name: "Cape Town Healing Arts",
      revenue: 22340,
      bookings: 52,
      rating: 4.7,
      growth: 12.3
    },
    {
      name: "Mindful Living Studio",
      revenue: 18920,
      bookings: 38,
      rating: 4.9,
      growth: 25.7
    }
  ],

  recentActivity: [
    {
      type: "provider_signup",
      description: "New provider: Wellness Warriors joined",
      timestamp: "2025-09-10T10:30:00Z"
    },
    {
      type: "booking_completed",
      description: "Sandy Mitchell completed session with Rachel Green",
      timestamp: "2025-09-09T16:45:00Z"
    },
    {
      type: "review_posted", 
      description: "5-star review posted for Sandy Mitchell Wellness",
      timestamp: "2025-09-09T14:20:00Z"
    },
    {
      type: "wellcoin_transaction",
      description: "Large WellCoin exchange: 500 coins converted",
      timestamp: "2025-09-09T11:15:00Z"
    }
  ],

  // Sandy's demo services for the stakeholder presentation
  services: [
    {
      id: 'srv_001',
      title: 'Dru Yoga Class - Stonehurst',
      description: 'Gentle, flowing yoga designed for all bodies. Includes breath, movement, stillness. Fridays 9:00 AM at Stonehurst.',
      category: 'Yoga & Movement',
      price_zar: 120,
      price_wellcoins: 100,
      duration_minutes: 60,
      location: 'Stonehurst, Cape Town',
      is_online: false,
      active: true,
      provider_id: 'sandy-mitchell',
      created_at: '2025-09-01T00:00:00Z',
      bookings_count: 15,
      rating: 4.9
    },
    {
      id: 'srv_002',
      title: 'Dru Yoga Class - Observatory',
      description: 'Gentle, flowing yoga designed for all bodies. Includes breath, movement, stillness. Thursdays 17:45 at Observatory.',
      category: 'Yoga & Movement',
      price_zar: 120,
      price_wellcoins: 100,
      duration_minutes: 60,
      location: 'Observatory, Cape Town',
      is_online: false,
      active: true,
      provider_id: 'sandy-mitchell',
      created_at: '2025-09-01T00:00:00Z',
      bookings_count: 12,
      rating: 4.8
    },
    {
      id: 'srv_003',
      title: 'Dru Backcare Course',
      description: 'A 5-10 week programme to relieve back pain. Simple, easy-to-do exercises. Stretch and strengthen the muscles along your spine.',
      category: 'Therapeutic Wellness',
      price_zar: 600,
      price_wellcoins: 500,
      duration_minutes: 60,
      location: 'Cape Town',
      is_online: false,
      active: true,
      provider_id: 'sandy-mitchell',
      created_at: '2025-09-01T00:00:00Z',
      bookings_count: 8,
      rating: 4.9
    },
    {
      id: 'srv_004',
      title: 'Dru Mental Wellness Course',
      description: 'A 5 week Yoga course to improve one\'s sense of wellbeing. Focusing on mental clarity and emotional balance.',
      category: 'Mental Health & Wellness',
      price_zar: 600,
      price_wellcoins: 500,
      duration_minutes: 60,
      location: 'Cape Town',
      is_online: false,
      active: true,
      provider_id: 'sandy-mitchell',
      created_at: '2025-09-01T00:00:00Z',
      bookings_count: 6,
      rating: 4.8
    },
    {
      id: 'srv_005',
      title: 'Buteyko Private Session',
      description: 'Personalised breathing retraining for anxiety, sleep, respiratory disorders or general health. Includes 4/5 sessions. Handouts, MP3s and WhatsApp support is included.',
      category: 'Breathwork & Meditation',
      price_zar: 350,
      price_wellcoins: 300,
      duration_minutes: 60,
      location: 'Cape Town or Online',
      is_online: true,
      active: true,
      provider_id: 'sandy-mitchell',
      created_at: '2025-09-01T00:00:00Z',
      bookings_count: 18,
      rating: 4.9
    },
    {
      id: 'srv_006',
      title: 'Free Discovery Call',
      description: '15-min consult to understand your needs and see if we\'re a fit. Perfect introduction to my approach.',
      category: 'Consultation',
      price_zar: 0,
      price_wellcoins: 0,
      duration_minutes: 15,
      location: 'Online',
      is_online: true,
      active: true,
      provider_id: 'sandy-mitchell',
      created_at: '2025-09-01T00:00:00Z',
      bookings_count: 25,
      rating: 4.7
    },
    {
      id: 'srv_007',
      title: 'Monthly Wellness Workshop',
      description: 'Themed sessions combining Dru Yoga & Buteyko with space for sharing, rest, and community. 90-120 minutes of deep restoration.',
      category: 'Workshops & Events',
      price_zar: 250,
      price_wellcoins: 200,
      duration_minutes: 105,
      location: 'Cape Town',
      is_online: false,
      active: true,
      provider_id: 'sandy-mitchell',
      created_at: '2025-09-01T00:00:00Z',
      bookings_count: 10,
      rating: 4.9
    }
  ]
};