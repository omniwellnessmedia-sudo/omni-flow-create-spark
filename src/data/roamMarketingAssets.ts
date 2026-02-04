// ROAM by Omni: Complete Marketing Campaign Assets
// Campaign Code: ROAM-FEB26 | Launch: 4 February 2026

export const ROAM_CAMPAIGN = {
  name: "Stay Connected to Your Wellness Journey",
  mascot: "Roam 🧭",
  tagline: "The Mindful Travel Connectivity Guide",
  duration: "90 Days (Feb 4 - May 4, 2026)",
  budget: "R3,000",
  teamLead: "Chad Cupido",
};

// UTM-tagged URLs for all campaign channels
export const CAMPAIGN_URLS = {
  // Primary Store URLs
  primary: {
    roamStore: {
      base: "/roam-store",
      organic: "/roam-store?utm_source=roam&utm_medium=organic&utm_campaign=launch-feb26",
      description: "Main eSIM Store",
    },
    wellconnect: {
      base: "/wellconnect",
      organic: "/wellconnect?utm_source=roam&utm_medium=organic&utm_campaign=retreats-feb26",
      description: "Retreat eSIMs",
    },
    globalData: {
      base: "/global-data",
      organic: "/global-data?utm_source=roam&utm_medium=organic&utm_campaign=business-feb26",
      description: "Business Travel",
    },
    tours: {
      base: "/tours",
      organic: "/tours?utm_source=roam&utm_medium=organic&utm_campaign=tours-feb26",
      description: "Viator Experiences",
    },
  },

  // Airport Campaign
  airport: {
    cptArrivals: "https://www.omniwellnessmedia.co.za/roam-store?utm_source=airport&utm_medium=qr&utm_campaign=cpt-arrivals-feb26&code=AIRPORT20",
    cptDepartures: "https://www.omniwellnessmedia.co.za/roam-store?utm_source=airport&utm_medium=qr&utm_campaign=cpt-departures-feb26&code=AIRPORT20",
    jnbArrivals: "https://www.omniwellnessmedia.co.za/roam-store?utm_source=airport&utm_medium=qr&utm_campaign=jnb-arrivals-feb26&code=AIRPORT20",
  },

  // Social Media
  social: {
    facebook: "?utm_source=facebook&utm_medium=organic&utm_campaign=roam-launch",
    instagram: "?utm_source=instagram&utm_medium=organic&utm_campaign=roam-launch",
    tiktok: "?utm_source=tiktok&utm_medium=organic&utm_campaign=roam-launch",
    linkedin: "?utm_source=linkedin&utm_medium=organic&utm_campaign=roam-launch",
    whatsapp: "?utm_source=whatsapp&utm_medium=share&utm_campaign=roam-launch",
  },

  // Paid Ads
  paid: {
    googleAds: "?utm_source=google&utm_medium=cpc&utm_campaign=esim-sa",
    metaAds: "?utm_source=meta&utm_medium=paid&utm_campaign=roam-launch",
    retargeting: "?utm_source=meta&utm_medium=retargeting&utm_campaign=cart-abandon",
  },

  // Partner/Affiliate
  partner: {
    hotel: (hotelName: string) => `?utm_source=partner&utm_medium=referral&utm_campaign=hotel-${hotelName.toLowerCase().replace(/\s+/g, '-')}`,
    influencer: (handle: string) => `?utm_source=influencer&utm_medium=referral&utm_campaign=${handle}`,
    coworking: (spaceName: string) => `?utm_source=partner&utm_medium=referral&utm_campaign=cowork-${spaceName.toLowerCase().replace(/\s+/g, '-')}`,
  },

  // Destination-specific
  destinations: {
    europe: "/roam-store?destination=europe&utm_source=google&utm_medium=cpc&utm_campaign=esim-europe",
    usa: "/roam-store?destination=usa&utm_source=google&utm_medium=cpc&utm_campaign=esim-usa",
    asia: "/roam-store?destination=asia&utm_source=google&utm_medium=cpc&utm_campaign=esim-asia",
    africa: "/roam-store?destination=africa&utm_source=google&utm_medium=cpc&utm_campaign=esim-africa",
  },
};

// Discount Codes with distribution strategy
export const DISCOUNT_CODES = {
  ROAM10: {
    code: "ROAM10",
    discount: "10%",
    target: "General use - all organic social posts",
    wellcoinsBonus: 5,
    usage: "Public - include in all organic posts",
  },
  WELCOME: {
    code: "WELCOME",
    discount: "$5 off",
    target: "New customers",
    wellcoinsBonus: 10,
    usage: "Homepage popup, exit intent, welcome emails",
  },
  WELLNESS: {
    code: "WELLNESS",
    discount: "15%",
    target: "Wellness community",
    wellcoinsBonus: 15,
    usage: "Partner retreats, yoga studios, wellness events",
  },
  OMNI25: {
    code: "OMNI25",
    discount: "25%",
    target: "VIP/Launch only",
    wellcoinsBonus: 25,
    usage: "Influencers, press, VIP customers ONLY",
    expiresAug2026: true,
  },
  FIRSTTRIP: {
    code: "FIRSTTRIP",
    discount: "20%",
    target: "First-time travelers",
    wellcoinsBonus: 20,
    usage: "Facebook/TikTok ads, airport QR codes",
  },
  AIRPORT20: {
    code: "AIRPORT20",
    discount: "20%",
    target: "Airport arrivals",
    wellcoinsBonus: 20,
    usage: "QR codes at CPT International Arrivals ONLY",
  },
};

// Roam 🧭 Quotable Moments for social graphics
export const ROAM_QUOTES = [
  {
    id: 1,
    pillar: "wellness",
    quote: "The best connectivity is the kind that lets you disconnect from stress.",
    attribution: "- Roam 🧭",
    hashtags: ["#MindfulTravel", "#WellnessTravel", "#ROAMbyOmni"],
  },
  {
    id: 2,
    pillar: "empowerment",
    quote: "You don't need unlimited data. You need the right data for your journey.",
    attribution: "- Roam 🧭",
    hashtags: ["#TravelSmart", "#eSIM", "#DigitalNomad"],
  },
  {
    id: 3,
    pillar: "education",
    quote: "eSIM isn't the future of travel. It's the present you've been missing.",
    attribution: "- Roam 🧭",
    hashtags: ["#eSIMExplained", "#TravelTech", "#TravelHacks"],
  },
  {
    id: 4,
    pillar: "inspiration",
    quote: "Land anywhere. Connect instantly. Worry never.",
    attribution: "- Roam 🧭",
    hashtags: ["#TravelGoals", "#Wanderlust", "#ROAMbyOmni"],
  },
  {
    id: 5,
    pillar: "community",
    quote: "Every eSIM sold supports a Cape Town community learning to code.",
    attribution: "- Roam 🧭",
    hashtags: ["#ImpactTravel", "#ValleyOfPlenty", "#ConsciousBusiness"],
  },
  {
    id: 6,
    pillar: "wellness",
    quote: "Your yoga retreat shouldn't start with airport SIM card stress.",
    attribution: "- Roam 🧭",
    hashtags: ["#YogaRetreat", "#BaliRetreat", "#WellnessTravel"],
  },
  {
    id: 7,
    pillar: "education",
    quote: "Still paying R50/MB abroad? That's R900 for one episode of your show. There's a better way.",
    attribution: "- Roam 🧭",
    hashtags: ["#NoMoreRoamingShock", "#TravelHacks", "#eSIM"],
  },
  {
    id: 8,
    pillar: "empowerment",
    quote: "Dual SIM means you never miss a call from home while exploring the world.",
    attribution: "- Roam 🧭",
    hashtags: ["#DualSIM", "#StayConnected", "#TravelTips"],
  },
];

// Content Calendar Pillars (Daily Rotation)
export const CONTENT_PILLARS = {
  monday: { pillar: "wellness", emoji: "🧘", theme: "Mindful connectivity, retreat prep" },
  tuesday: { pillar: "education", emoji: "📚", theme: "How eSIM works, device guides" },
  wednesday: { pillar: "empowerment", emoji: "💪", theme: "Take control of your connectivity" },
  thursday: { pillar: "inspiration", emoji: "🌍", theme: "Destination spotlights, travel stories" },
  friday: { pillar: "community", emoji: "🎉", theme: "User content, partner spotlights" },
  saturday: { pillar: "deals", emoji: "💰", theme: "Promo codes, limited offers" },
  sunday: { pillar: "roamTalks", emoji: "🧭", theme: "Personal tips from Roam" },
};

// Sample Social Posts (Roam Voice)
export const SAMPLE_POSTS = {
  instagram: {
    wellness: `🧭 Roam here. 

Your yoga retreat in Bali shouldn't start with airport SIM card stress.

Here's a wellness travel secret: Install your eSIM before you pack. Land. Breathe. Connect instantly.

No queues. No roaming shock. Just you, your mat, and peace of mind.

5GB Indonesia = R150 | Activated in 30 seconds

📍 Ready for mindful travel? Link in bio.

#ROAMbyOmni #WellnessTravel #eSIM #BaliRetreat #MindfulConnectivity #TravelWellness #DigitalNomad #YogaTravel`,
    education: `🧭 Quick eSIM 101:

"But how does it work?"

1️⃣ Choose your destination
2️⃣ Get a QR code instantly
3️⃣ Scan with your phone
4️⃣ Land connected

No physical SIM. No airport queues. No R500 roaming bills.

Works on iPhone XS+ and most Android phones from 2019.

Questions? Chat with me anytime 💬

#eSIM #TravelTech #HowTo #TravelHacks #ROAMbyOmni #DigitalNomad`,
  },
  tiktok: {
    education: `POV: You're explaining eSIM to your mom before her trip to Portugal 📱

"No mom, you don't get a new SIM card"
"No, nothing arrives in the mail"
"You literally just scan a QR code"
"Yes it works instantly"
"No, you keep your South African number"

This is the RoamBuddy way 🧭✨

#eSIMExplained #TravelHacks #SouthAfricanAbroad #TravelTips #RoamBuddy #DigitalNomad`,
    relatable: `Things that cost more than a RoamBuddy eSIM:

☕ Your daily coffee x2
🍔 One burger
🎫 A movie ticket
📲 10 minutes of roaming data abroad

5GB Europe = R150

Just saying 🧭

#TravelHacks #eSIM #BudgetTravel #ROAMbyOmni`,
  },
  facebook: {
    roamTalks: `🧭 A quick word from Roam...

I've guided thousands of conscious travelers to their perfect eSIM plan. Here's what I've learned:

The best travelers aren't the ones with the most data. They're the ones with the RIGHT data for their journey.

• Yoga retreat? 5GB is plenty
• Safari documentation? You need 20GB
• Silent meditation? 1GB for emergencies
• Digital nomad life? Unlimited

What's your next wellness journey? Drop a 🌍 and I'll recommend the perfect plan.

P.S. First-time travelers get 20% off with code FIRSTTRIP`,
    community: `🧭 Every time you buy an eSIM from RoamBuddy, you're supporting something bigger.

A portion of every sale goes to Valley of Plenty - our community initiative teaching coding and digital skills to young people in Hanover Park, Cape Town.

Your connectivity helps us build community.

That's what conscious travel is all about.

#ValleyOfPlenty #ImpactTravel #ConsciousBusiness #ROAMbyOmni`,
  },
};

// Ad Creative Library
export const AD_CREATIVES = {
  awareness: {
    name: "No More Roaming Shock",
    headline: "Still paying R50/MB abroad? 😱",
    primary: "RoamBuddy eSIM starts from R90 for 1GB. That's 500x cheaper than roaming.",
    cta: "Shop Now",
    link: "/roam-store?utm_source=meta&utm_medium=paid&utm_campaign=roaming-shock",
    imageGuidance: "Split screen - shocked face at phone bill vs peaceful traveler",
  },
  consideration: {
    name: "3 Reasons Smart Travelers Choose eSIM",
    headline: "Why 2 million travelers ditched SIM cards",
    carousel: [
      "✅ Instant activation - No airport queues",
      "✅ Keep your SA number active - Dual SIM",
      "✅ 200+ countries - One simple solution",
    ],
    cta: "Learn More",
    link: "/roam-store?utm_source=meta&utm_medium=paid&utm_campaign=3-reasons",
  },
  conversion: {
    name: "First Trip? 20% Off",
    headline: "First international trip? We've got you 🧭",
    primary: "Roam guides thousands of first-time travelers. Use code FIRSTTRIP for 20% off any eSIM. Works on iPhone, Samsung, Pixel & more.",
    cta: "Get Discount",
    link: "/roam-store?utm_source=meta&utm_medium=paid&utm_campaign=firsttrip&code=FIRSTTRIP",
  },
  retargeting: {
    name: "Still Thinking?",
    headline: "Your trip is coming up...",
    primary: "We noticed you were looking at our eSIM plans. Still have questions? Chat with Roam 🧭 Or use ROAM10 for 10% off.",
    cta: "Complete Purchase",
    link: "/roam-store?utm_source=meta&utm_medium=retargeting&utm_campaign=cart-abandon",
  },
};

// Google Ads Campaign Structure (NPO Grant)
export const GOOGLE_ADS_STRUCTURE = {
  campaign1: {
    name: "eSIM Awareness (Educational)",
    adGroups: [
      {
        name: "What is eSIM",
        keywords: ["what is esim", "esim meaning", "esim vs sim", "how does esim work"],
        landing: "/roam-store#how-esim-works",
      },
      {
        name: "Travel SIM",
        keywords: ["travel sim card south africa", "tourist sim cape town", "international sim card"],
        landing: "/roam-store",
      },
      {
        name: "Digital Nomad",
        keywords: ["digital nomad connectivity", "remote work abroad", "work from anywhere data"],
        landing: "/global-data",
      },
    ],
  },
  campaign2: {
    name: "Wellness Travel",
    adGroups: [
      {
        name: "Yoga Retreat Connectivity",
        keywords: ["yoga retreat bali wifi", "meditation retreat data", "wellness retreat phone"],
        landing: "/wellconnect",
      },
      {
        name: "Safari Data",
        keywords: ["safari phone signal", "kruger park cell service", "safari wifi south africa"],
        landing: "/roam-store?destination=south-africa",
      },
    ],
  },
  campaign3: {
    name: "Community Impact",
    adGroups: [
      {
        name: "Valley of Plenty",
        keywords: ["cape town community projects", "hanover park development", "tech education cape town"],
        landing: "/csr-impact",
      },
      {
        name: "Conscious Business",
        keywords: ["ethical travel companies south africa", "conscious business cape town"],
        landing: "/about",
      },
    ],
  },
};

// 90-Day Milestone Targets
export const MILESTONES = {
  month1: {
    period: "Feb 4 - Mar 4, 2026",
    targets: {
      websiteVisitors: 2000,
      roamConversations: 150,
      emailLeads: 75,
      esimSales: 30,
      socialFollowers: 500,
    },
  },
  month2: {
    period: "Mar 5 - Apr 4, 2026",
    targets: {
      websiteVisitors: 5000,
      roamConversations: 400,
      emailLeads: 200,
      esimSales: 100,
      revenue: 15000, // ZAR
      conversionRate: 0.03,
    },
  },
  month3: {
    period: "Apr 5 - May 4, 2026",
    targets: {
      websiteVisitors: 10000,
      roamConversations: 800,
      emailLeads: 500,
      esimSales: 250,
      revenue: 40000, // ZAR
      repeatCustomers: 0.15,
    },
  },
};

// Team Action Plan
export const TEAM_RESPONSIBILITIES = {
  chad: {
    role: "Strategy & Oversight",
    weekly: [
      "Mon: Review previous week metrics, adjust strategy",
      "Wed: Approve content calendar for following week",
      "Fri: Partner outreach calls",
      "Ongoing: Lead notification response (via WhatsApp alerts)",
    ],
  },
  zenith: {
    role: "Content & Community",
    weekly: [
      "Daily: Post scheduled content (3x platforms)",
      "Daily: Respond to comments/DMs within 2 hours",
      "Tue/Thu: Create next week's content batch",
      "Wed: Community engagement (reshare UGC, partner tags)",
    ],
  },
  feroza: {
    role: "Operations & Admin",
    weekly: [
      "Mon: Pull weekly analytics report",
      "Wed: Process affiliate payouts",
      "Thu: Update discount code tracking",
      "Fri: Email newsletter prep",
    ],
  },
  tumelo: {
    role: "Technical",
    weekly: [
      "Daily: Monitor site performance, chatbot logs",
      "Wed: GA4 and ad account health check",
      "As needed: UTM link generation, landing page updates",
    ],
  },
};

// Helper function to generate UTM URL
export const generateUTMUrl = (
  basePath: string,
  source: string,
  medium: string,
  campaign: string,
  content?: string,
  discountCode?: string
): string => {
  const baseUrl = "https://www.omniwellnessmedia.co.za";
  let url = `${baseUrl}${basePath}?utm_source=${source}&utm_medium=${medium}&utm_campaign=${campaign}`;
  if (content) url += `&utm_content=${content}`;
  if (discountCode) url += `&code=${discountCode}`;
  return url;
};

// Helper to track events
export const trackRoamEvent = (
  eventName: 'view_item' | 'begin_checkout' | 'purchase' | 'add_to_cart' | 'lead',
  params: {
    currency?: string;
    value?: number;
    items?: Array<{ item_id: string; item_name: string; item_category?: string }>;
    transaction_id?: string;
    coupon?: string;
  }
) => {
  // Call the global tracking function if available
  if (typeof window !== 'undefined' && (window as any).trackRoamEvent) {
    (window as any).trackRoamEvent(eventName, params);
  }
};
