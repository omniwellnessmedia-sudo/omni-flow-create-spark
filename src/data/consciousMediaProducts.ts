export type UseCase = 'vlogging' | 'studio' | 'travel' | 'film-production';
export type Curator = 'ferozza' | 'chad' | 'zenith';
export type SkillLevel = 'beginner' | 'intermediate' | 'professional';

export interface EnhancedProduct {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  productUrl: string;
  price?: number;
  category: UseCase;
  skillLevel: SkillLevel;
  curator: Curator;
  curatorQuote: string;
  whyYouNeedThis: string;
  perfectFor: string[];
  salesFunnelCTA?: string;
  channel: string;
  imagePosition: 'left' | 'right';
}

export const products: EnhancedProduct[] = [
  // NEW PRODUCTS FROM FEROZZA
  {
    id: 1,
    name: "Neewer PA045 Vlogging Kit with LED Light/Selfie Stick/Tripod/Mic",
    description: "All-in-one mobile content creation kit. Includes adjustable LED light, extendable selfie stick, sturdy tripod, and professional microphone. Perfect for smartphone filmmakers starting their wellness journey.",
    imageUrl: "https://camerastuff.co.za/cdn/shop/files/neewer-pa045-vlogging-kit-led-light-selfie-stick-tripod-mic-smartphones-camerastuff-472.webp?v=1750338026&width=640",
    productUrl: "https://camerastuff.co.za/products/neewer-pa045-vlogging-kit-with-led-lightselfie-stick-tripodmic-for-smartphones",
    category: 'vlogging',
    skillLevel: 'beginner',
    curator: 'ferozza',
    curatorQuote: "I started documenting retreat healing circles with just my phone and this kit. The light saved me in dim community spaces, and the mic picked up every whispered intention. If you're ready to share your wellness journey but think you need expensive cameras—start here. This is how I began.",
    whyYouNeedThis: "Transform your smartphone into a professional storytelling tool without overwhelming complexity or cost.",
    perfectFor: [
      "Wellness vloggers starting out",
      "Community organizers documenting events",
      "Mobile retreat filmmakers",
      "Social media wellness creators"
    ],
    salesFunnelCTA: "Ready to level up? Book a content strategy session with Omni",
    channel: "mobile-vlogging",
    imagePosition: 'left'
  },
  {
    id: 2,
    name: "BL MicroPro 10 Bi-Colour LED Ring Light (Head Only)",
    description: "Professional 10-inch bi-color LED ring light. Adjustable color temperature (3200K-5600K), dimmable output, eliminates harsh shadows. Creates the signature beauty lighting for wellness content, testimonials, and intimate sessions.",
    imageUrl: "https://camerastuff.co.za/cdn/shop/files/bl-micropro-10-bi-colour-led-ring-light-head-only-camerastuff-online-shop-south-africa-1-825.jpg?v=1738932817&width=640",
    productUrl: "https://camerastuff.co.za/products/bl-micropro-10-bi-colour-led-ring-light-head-only",
    category: 'vlogging',
    skillLevel: 'beginner',
    curator: 'chad',
    curatorQuote: "Here's what changed when we invested in proper ring lights: clients started asking if we were 'real production professionals.' This single piece of equipment elevated how people perceived our entire brand. If you're doing wellness consultations, testimonials, or healing sessions on camera—this signals expertise.",
    whyYouNeedThis: "Professional lighting instantly communicates credibility and creates flattering, trust-building visuals.",
    perfectFor: [
      "Online wellness consultations",
      "Testimonial capture",
      "Beauty and self-care content",
      "Guided meditation recordings"
    ],
    salesFunnelCTA: "Need help building your online wellness brand? Partner with Omni",
    channel: "beauty-wellness",
    imagePosition: 'right'
  },
  {
    id: 3,
    name: "Neewer PA046 360° Rotatable Side Handle for Phone Cages",
    description: "Ergonomic 360° rotating handle for smartphone camera rigs. Cold shoe mount for accessories, multiple 1/4\" threads, comfortable grip. Transforms phones into cinema-style handheld cameras.",
    imageUrl: "https://camerastuff.co.za/cdn/shop/files/neewer-pa046-360-rotatable-side-handletop-handle-for-phone-cages-camerastuff-online-shop-south-africa-1-731.webp?v=1738932821&width=640",
    productUrl: "https://camerastuff.co.za/products/neewer-pa046-360-rotatable-side-handletop-handle-for-phone-cages",
    category: 'vlogging',
    skillLevel: 'intermediate',
    curator: 'ferozza',
    curatorQuote: "I film 8-hour retreat days entirely on my phone. This handle eliminated the shaky footage and hand fatigue that made me look amateur. Now I move through yoga sessions, garden tours, and community gatherings with the stability of a cinema camera. Your hands will thank you.",
    whyYouNeedThis: "Stabilize smartphone footage and eliminate fatigue during long documentation sessions.",
    perfectFor: [
      "All-day retreat filming",
      "Walking meditation documentation",
      "Active wellness activities",
      "Community event coverage"
    ],
    channel: "mobile-cinematography",
    imagePosition: 'left'
  },
  {
    id: 4,
    name: "Godox SZ150R 150W RGB-WW Zoomable COB LED Video Light",
    description: "Professional 150W COB LED with full RGB color control. Zoomable beam (15-45°), wireless control, CRI 96+, TLCI 97+. Film-grade lighting for serious studio setups.",
    imageUrl: "https://camerastuff.co.za/cdn/shop/files/godox-sz150r-150w-rgb-ww-zoomable-cob-led-video-light-monolight-camerastuff-online-shop-south-africa-1-537.webp?v=1738945486&width=640",
    productUrl: "https://camerastuff.co.za/products/godox-sz150r-150w-rgb-ww-zoomable-cob-led-video-light-monolight",
    category: 'studio',
    skillLevel: 'professional',
    curator: 'chad',
    curatorQuote: "When you're pitching wellness content to broadcasters or corporate wellness programs, they look at your lighting first. This light meets broadcast standards without the R50,000 rental fees. It's paid for itself three times over in contracts we won because our demo reels looked 'TV ready.'",
    whyYouNeedThis: "Broadcast-quality lighting that opens doors to high-budget wellness media opportunities.",
    perfectFor: [
      "Professional studio recordings",
      "Corporate wellness content",
      "Broadcast-quality productions",
      "High-end client work"
    ],
    salesFunnelCTA: "Pitching to corporates? Let Omni produce your demo reel",
    channel: "professional-studio",
    imagePosition: 'right'
  },
  {
    id: 5,
    name: "Neewer LS-39 Optical Snoot Projector with 20° Lens",
    description: "Creative lighting modifier for precise beam control. 20° optical snoot creates dramatic spotlighting effects, textures, and patterns. For documenters who want cinematic, artistic lighting.",
    imageUrl: "https://camerastuff.co.za/cdn/shop/files/neewer-ls-39-optical-snoot-projector-with-20-degree-lens-camerastuff-online-shop-south-africa-1-819.jpg?v=1738758734&width=640",
    productUrl: "https://camerastuff.co.za/products/neewer-ls-39-optical-snoot-projector-with-20-degree-lens",
    category: 'studio',
    skillLevel: 'professional',
    curator: 'ferozza',
    curatorQuote: "We used this to light a traditional healer's sacred space without flooding the room with clinical brightness. The focused beam created reverence—like natural light streaming through a cave opening. When your subject matter is sacred, clinical lighting feels disrespectful. This tool honors the space.",
    whyYouNeedThis: "Create artistic, respectful lighting that enhances sacred and intimate wellness spaces.",
    perfectFor: [
      "Traditional healing documentation",
      "Ceremonial space filming",
      "Artistic wellness portraits",
      "Creative documentary lighting"
    ],
    channel: "creative-lighting",
    imagePosition: 'left'
  },
  {
    id: 6,
    name: "Neewer PA021/PA033 Handheld Cage for Samsung S23 Ultra",
    description: "Professional smartphone cage with filter thread adapter, cold shoe mounts, and ergonomic grip. Transforms Samsung S23 Ultra into a modular cinema camera system.",
    imageUrl: "https://camerastuff.co.za/cdn/shop/files/neewer-pa021pa033-handheld-cage-with-filter-thread-adapter-for-samsung-s23-ultra-camerastuff-online-shop-south-africa-1-663.jpg?v=1738758738&width=640",
    productUrl: "https://camerastuff.co.za/products/neewer-pa021pa033-handheld-cage-with-filter-thread-adapter-for-samsung-s23-ultra",
    category: 'vlogging',
    skillLevel: 'intermediate',
    curator: 'zenith',
    curatorQuote: "I coordinate logistics for 15+ shoots monthly. This cage eliminated 2 hours of setup per session—no more juggling separate tripods, mics, and lights. When you're managing tight schedules and multiple locations, gear that mounts everything in one system saves your sanity. And your schedule.",
    whyYouNeedThis: "Modular smartphone system that streamlines setup and increases production efficiency.",
    perfectFor: [
      "Multi-location shoot days",
      "Samsung S23 Ultra users",
      "Mobile cinema professionals",
      "Efficiency-focused creators"
    ],
    channel: "mobile-cinematography",
    imagePosition: 'right'
  },
  {
    id: 7,
    name: "Neewer NS7L 30cm Mini Quick-Release Lantern Softbox",
    description: "Portable lantern softbox for 360° soft, diffused lighting. Quick-release design, 30cm diameter. Creates flattering, wrap-around light for interviews and close-up wellness content.",
    imageUrl: "https://camerastuff.co.za/cdn/shop/files/neewer-ns7l-30cm-mini-quick-release-lantern-softbox-for-hs60bhs60c-camerastuff-online-shop-south-africa-1-377.jpg?v=1738758738&width=640",
    productUrl: "https://camerastuff.co.za/products/neewer-ns7l-30cm-mini-quick-release-lantern-softbox-for-hs60bhs60c",
    category: 'studio',
    skillLevel: 'intermediate',
    curator: 'ferozza',
    curatorQuote: "Traditional softboxes create harsh shadows that make wellness practitioners look tired. This lantern wraps light around the subject naturally—like sunlight filtering through tree leaves. When you're filming healing work, harsh lighting feels aggressive. This feels gentle. That matters.",
    whyYouNeedThis: "Soft, non-aggressive lighting that complements the gentle nature of wellness work.",
    perfectFor: [
      "Interview and testimonial work",
      "Portrait wellness photography",
      "Healing session documentation",
      "Gentle, flattering lighting needs"
    ],
    channel: "portrait-wellness",
    imagePosition: 'left'
  },
  {
    id: 8,
    name: "Godox LMS-60G Lavalier Microphone",
    description: "Professional omnidirectional lavalier microphone. Clear vocal capture, minimal handling noise, lightweight clip-on design. Essential for documentary-style wellness interviews.",
    imageUrl: "https://camerastuff.co.za/cdn/shop/files/godox-lms-60g-lavalier-microphone-camerastuff-online-shop-south-africa-1-665.jpg?v=1738758743&width=640",
    productUrl: "https://camerastuff.co.za/products/godox-lms-60g-lavalier-microphone",
    category: 'travel',
    skillLevel: 'intermediate',
    curator: 'chad',
    curatorQuote: "We lost our first documentary interview to wind noise. Never again. This lavalier mic captures voices clearly without boom poles that intimidate participants. When you're filming authentic stories, your gear needs to disappear. This does. And the audio is broadcast-quality.",
    whyYouNeedThis: "Unobtrusive, professional audio capture that maintains intimacy in documentary settings.",
    perfectFor: [
      "Documentary interviews",
      "Retreat testimonials",
      "Outdoor wellness content",
      "Walking meditation narration"
    ],
    salesFunnelCTA: "Need full documentary production? Omni specializes in authentic wellness stories",
    channel: "documentary-audio",
    imagePosition: 'right'
  },
  {
    id: 9,
    name: "Camerastuff 900D Tactical Shoulder Sling Camera Bag",
    description: "Durable 900D tactical camera bag with quick-access sling design. Weatherproof material, padded compartments, tripod straps. Protects equipment during field documentation.",
    imageUrl: "https://camerastuff.co.za/cdn/shop/files/camerastuff-900d-tactical-shoulder-sling-camera-bag-camerastuff-online-shop-south-africa-1-613.jpg?v=1738758744&width=640",
    productUrl: "https://camerastuff.co.za/products/camerastuff-900d-tactical-shoulder-sling-camera-bag",
    category: 'travel',
    skillLevel: 'beginner',
    curator: 'ferozza',
    curatorQuote: "This bag survived dust storms at Valley of Plenty, coastal humidity, and 14-hour retreat shoots across South Africa. When you're documenting real wellness work in unpredictable environments, your gear needs military-grade protection. This delivers. And it's fast-access when moments happen quickly.",
    whyYouNeedThis: "Field-tested protection for equipment during unpredictable outdoor wellness documentation.",
    perfectFor: [
      "Retreat and field documentation",
      "All-weather shooting",
      "Community outreach filming",
      "Outdoor wellness events"
    ],
    channel: "field-equipment",
    imagePosition: 'left'
  },
  {
    id: 10,
    name: "Camerastuff ICB-04 Clapper Board 30x25cm Acrylic - Black",
    description: "Professional acrylic clapperboard for film production. Clear scene identification, sync reference for audio/video. Essential for organized, professional wellness film projects.",
    imageUrl: "https://camerastuff.co.za/cdn/shop/files/camerastuff-icb-04-clapper-board-30x25cm-acrylic-black-camerastuff-online-shop-south-africa-1-713.jpg?v=1738758745&width=640",
    productUrl: "https://camerastuff.co.za/products/camerastuff-icb-04-clapper-board-30x25cm-acrylic-black",
    category: 'film-production',
    skillLevel: 'professional',
    curator: 'zenith',
    curatorQuote: "Clients ask why we use a clapperboard for wellness content. Because it signals 'we're professionals making something that matters.' It organizes footage for efficient editing, syncs audio perfectly, and communicates production seriousness. If you're pitching serious projects, this detail separates amateurs from pros.",
    whyYouNeedThis: "Professional production organization that signals credibility to clients and streamlines post-production.",
    perfectFor: [
      "Multi-camera productions",
      "Documentary filmmaking",
      "Corporate wellness videos",
      "Professional editing workflows"
    ],
    salesFunnelCTA: "Building a wellness film project? Hire Omni as your production partner",
    channel: "film-production",
    imagePosition: 'right'
  },

  // ORIGINAL PRODUCTS
  {
    id: 11,
    name: "Backdrop Stand Kit",
    description: "Professional backdrop support system. Lightweight aluminum frame with integrated clamps and sandbag stability. Easy setup and takedown for mobile documentation.",
    imageUrl: "https://camerastuff.co.za/cdn/shop/files/neewer-2-6x3m-lightweight-backdrop-stand-kit-clamps-sandbags-camerastuff-online-shop-133.webp?v=1752090264&width=1540",
    productUrl: "https://camerastuff.co.za/products/neewer-26x3m-lightweight-backdrop-stand-kit-with-clamps-sandbags",
    category: 'studio',
    skillLevel: 'intermediate',
    curator: 'zenith',
    curatorQuote: "We set this up in 15 minutes at community centers with zero backdrops. Instant professional environment. When you're documenting wellness work in borrowed spaces, this transforms 'makeshift' into 'intentional.' Clients notice the difference immediately.",
    whyYouNeedThis: "Create intentional, distraction-free settings in any borrowed or temporary space.",
    perfectFor: [
      "Mobile studio setups",
      "Community space filming",
      "Pop-up wellness events",
      "Flexible production environments"
    ],
    channel: "retreat-documentation",
    imagePosition: 'left'
  },
  {
    id: 12,
    name: "Neewer 660 Pro II RGB WW 50W Panel (2-light kit)",
    description: "Professional RGB variable-color LED panel system with 2 units, 50W each. Adjustable color temperature (3200K-5600K), CRI 95+, wireless remote control. Includes light stands and softboxes.",
    imageUrl: "https://camerastuff.co.za/cdn/shop/files/neewer-rgb660-pro-ii-660-rgb-ww-50w-led-constant-light-panel-kit-two-lights-camerastuff-481.webp",
    productUrl: "https://camerastuff.co.za/products/neewer-660-pro-ii-rgb-ww-50w-led-constant-light-panel-kit-two-lights",
    category: 'studio',
    skillLevel: 'professional',
    curator: 'ferozza',
    curatorQuote: "I use these for 8-hour meditation shoots. Zero heat buildup—practitioners stay comfortable. The RGB lets me match sunset lighting during evening sessions without artificial looks. When wellness spaces have specific energetic qualities, generic lighting destroys them. This respects the space.",
    whyYouNeedThis: "Match natural lighting conditions in wellness spaces without disrupting the environment's energy.",
    perfectFor: [
      "Long meditation sessions",
      "Studio wellness recordings",
      "Multi-hour retreat filming",
      "Temperature-sensitive environments"
    ],
    channel: "practitioner-equipment",
    imagePosition: 'right'
  },
  {
    id: 13,
    name: "Neewer SNL660 45W Bi-Colour 2-Pack",
    description: "Compact bi-color LED panels (3200K-5600K) with 45W output. Lightweight, portable design with wireless remote and light stand compatibility. Ideal for intimate documentation spaces.",
    imageUrl: "https://camerastuff.co.za/cdn/shop/files/neewer-2-x-pack-snl660-45w-bi-colour-led-constant-light-panel-kit-camerastuff-online-shop-809.jpg?v=1738762359&width=840",
    productUrl: "https://camerastuff.co.za/products/neewer-2-x-pack-snl660-45w-bi-colour-led-constant-light-panel-kit",
    category: 'travel',
    skillLevel: 'intermediate',
    curator: 'ferozza',
    curatorQuote: "These fit in my backpack for mountain retreat filming. Full professional lighting in a portable package. I've filmed healing circles in caves, forest ceremonies, and cliffside yoga—this kit goes everywhere and performs like studio lights.",
    whyYouNeedThis: "Professional-quality portable lighting that doesn't compromise on performance.",
    perfectFor: [
      "Remote retreat locations",
      "Backpacking documentarians",
      "Outdoor wellness events",
      "Compact production needs"
    ],
    channel: "retreat-documentation",
    imagePosition: 'left'
  },
  {
    id: 14,
    name: "Neewer 660 Pro 50W RGB WW Single Panel",
    description: "Individual 50W RGB variable-color LED panel. Full spectrum control (3200K-5600K), CRI 95+, wireless remote, light stand included. Flexible single-unit deployment.",
    imageUrl: "https://camerastuff.co.za/cdn/shop/files/neewer-660-pro-50w-rgb-ww-led-video-light-panel-camerastuff-online-shop-south-africa-3-681.webp?v=1752076274&width=640",
    productUrl: "https://camerastuff.co.za/products/neewer-660-pro-50w-rgb-ww-led-video-light-panel",
    category: 'studio',
    skillLevel: 'intermediate',
    curator: 'chad',
    curatorQuote: "Single-light setups look amateur. This panel plus natural window light? Instantly professional. When you're building your wellness practice and can't afford full studio kits, this one light elevates your entire visual brand. It's the difference between 'side hustle' and 'serious practitioner.'",
    whyYouNeedThis: "Affordable professional lighting that transforms your visual credibility immediately.",
    perfectFor: [
      "Starting wellness professionals",
      "One-on-one session recording",
      "Small studio spaces",
      "Budget-conscious quality seekers"
    ],
    channel: "practitioner-equipment",
    imagePosition: 'right'
  },
  {
    id: 15,
    name: "Backdrop Support Kit (280x300cm)",
    description: "Heavy-duty backdrop system for large-scale documentation. 280x300cm coverage creates immersive, distraction-free settings. Durable construction, quick assembly, multiple backdrop compatibility.",
    imageUrl: "https://camerastuff.co.za/cdn/shop/files/camerastuff-bgs-2-8x3a-backdrop-stand-support-kit-280x300cm-online-shop-south-africa-1-175.jpg?v=1752094995&width=1540",
    productUrl: "https://camerastuff.co.za/products/camerastuff-bgs-28x3a-backdrop-stand-support-kit-280x300cm",
    category: 'studio',
    skillLevel: 'professional',
    curator: 'chad',
    curatorQuote: "We use this for full-body movement documentation—yoga flows, dance therapy, somatic healing. The large format means practitioners move freely without worrying about frame edges. Professional scale communicates 'this is serious work.' That matters when clients are investing in transformation.",
    whyYouNeedThis: "Large-format professional backdrop for movement-based wellness documentation.",
    perfectFor: [
      "Yoga and movement filming",
      "Dance therapy documentation",
      "Full-body wellness practices",
      "Professional studio presentations"
    ],
    channel: "retreat-documentation",
    imagePosition: 'left'
  },
  {
    id: 16,
    name: "Neewer CM5 2-Pack Lavalier Mics",
    description: "Professional wired lavalier/lapel microphones (2-pack). Omnidirectional condenser pickup, 3.5mm connector, cable length 2.5m. Compact, unobtrusive design for interview and practitioner documentation.",
    imageUrl: "https://camerastuff.co.za/cdn/shop/files/neewer-cm5-2-pack-wired-lavalier-lapel-omnidirectional-condenser-microphone-camerastuff-877.webp",
    productUrl: "https://camerastuff.co.za/products/neewer-cm5-2-pack-wired-lavalier-lapel-omnidirectional-condenser-microphone",
    category: 'travel',
    skillLevel: 'beginner',
    curator: 'zenith',
    curatorQuote: "Two-person interviews with one purchase. These mics disappear on clothing but capture crystal-clear audio. When you're filming practitioner dialogues or healer consultations, boom mics feel intrusive. These respect the intimacy while delivering professional sound.",
    whyYouNeedThis: "Discreet, professional audio capture for intimate wellness conversations.",
    perfectFor: [
      "Two-person interviews",
      "Practitioner dialogues",
      "Consultation recordings",
      "Intimate conversation documentation"
    ],
    channel: "practitioner-equipment",
    imagePosition: 'right'
  },
  {
    id: 17,
    name: "Neewer NW-XJB02S Camera Sling Backpack",
    description: "Professional camera sling backpack with ergonomic single-shoulder design. Multiple compartments, weatherproof material, compatible with DSLR/mirrorless and accessories. Enables hands-free mobility.",
    imageUrl: "https://camerastuff.co.za/cdn/shop/files/neewer-nw-xjb02s-sling-camera-backpack-bag-purple-camerastuff-online-shop-south-africa-2-576.webp",
    productUrl: "https://camerastuff.co.za/products/neewer-nw-xjb02s-camera-sling-backpack-purple",
    category: 'travel',
    skillLevel: 'beginner',
    curator: 'ferozza',
    curatorQuote: "This bag lets me move through retreat spaces without looking like 'the camera person.' Sling design means I'm present as a participant while ready to capture moments. When you're documenting sacred work, you can't separate yourself with giant equipment bags. This bag respects the flow.",
    whyYouNeedThis: "Respectful, mobile camera storage that maintains your presence in wellness spaces.",
    perfectFor: [
      "Retreat participant-documenters",
      "Community wellness events",
      "Observational documentary work",
      "Hands-free mobility needs"
    ],
    channel: "retreat-documentation",
    imagePosition: 'left'
  }
];

export const curatorProfiles = {
  ferozza: {
    name: "Ferozza",
    title: "Field Documentation Specialist",
    expertise: "Retreat & Community Filming",
    bio: "14+ retreats documented across South Africa. Specializes in authentic, participatory wellness documentation in challenging field conditions.",
    avatar: "https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/provider-images/Omni%20wellness%20team.jpg"
  },
  chad: {
    name: "Chad Cupido",
    title: "Strategic Media Director",
    expertise: "Business Development & Brand Positioning",
    bio: "Founder of Omni Wellness Media. Focuses on ROI-driven equipment choices and professional brand credibility through conscious media.",
    avatar: "https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/provider-images/HUMAN%20ANIMAL_CHAD-3.jpg"
  },
  zenith: {
    name: "Zenith",
    title: "Production Coordinator",
    expertise: "Workflow Optimization & Logistics",
    bio: "Manages 15+ monthly shoots. Specializes in equipment efficiency, production logistics, and streamlined creative workflows.",
    avatar: "https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/provider-images/Omni%20wellness%20community%20project%201.JPG"
  }
};
