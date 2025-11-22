export type UseCase = 'vlogging' | 'studio' | 'travel' | 'film-production';
export type Curator = 'ferozza' | 'chad' | 'zenith';
export type SkillLevel = 'beginner' | 'intermediate' | 'professional';

export interface EnhancedProduct {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  imageGallery?: string[];
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
    curatorQuote: "All-in-one starter kit. Mobile creators. Budget-friendly. Gets you filming immediately without overwhelming choices.",
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
    imageUrl: "https://camerastuff.co.za/cdn/shop/files/bl-micropro-10-bi-colour-led-ring-light-head-only-camerastuff-online-shop-south-891.webp?v=1752089859&width=1540",
    imageGallery: [
      "https://camerastuff.co.za/cdn/shop/files/bl-micropro-10-bi-colour-led-ring-light-head-only-camerastuff-online-shop-south-891.webp?v=1752089859&width=1540",
      "https://camerastuff.co.za/cdn/shop/files/bl-micropro-10-bi-colour-led-ring-light-head-only-camerastuff-online-shop-south-955.webp?v=1752089863&width=1540",
      "https://camerastuff.co.za/cdn/shop/files/bl-micropro-10-bi-colour-led-ring-light-head-only-camerastuff-online-shop-south-905.webp?v=1752089867&width=1540"
    ],
    productUrl: "https://camerastuff.co.za/products/bl-micropro-10-bi-colour-led-ring-light-head-only",
    category: 'vlogging',
    skillLevel: 'beginner',
    curator: 'chad',
    curatorQuote: "Professional lighting = professional perception. Testimonials. Consultations. Beauty content. Instantly elevates your brand credibility.",
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
    imageUrl: "https://camerastuff.co.za/cdn/shop/files/neewer-pa046-360-rotatable-side-handle-top-handle-phone-cages-camerastuff-online-shop-595.webp?v=1758821958&width=1540",
    imageGallery: [
      "https://camerastuff.co.za/cdn/shop/files/neewer-pa046-360-rotatable-side-handle-top-handle-phone-cages-camerastuff-online-shop-595.webp?v=1758821958&width=1540",
      "https://camerastuff.co.za/cdn/shop/files/neewer-pa046-360-rotatable-side-handle-top-handle-phone-cages-camerastuff-online-shop-158.webp?v=1758821962&width=1540",
      "https://camerastuff.co.za/cdn/shop/files/neewer-pa046-360-rotatable-side-handle-top-handle-phone-cages-camerastuff-online-shop-515.webp?v=1758821967&width=1540",
      "https://camerastuff.co.za/cdn/shop/files/neewer-pa046-360-rotatable-side-handle-top-handle-phone-cages-camerastuff-online-shop-542.webp?v=1758821970&width=1540",
      "https://camerastuff.co.za/cdn/shop/files/neewer-pa046-360-rotatable-side-handle-top-handle-phone-cages-camerastuff-online-shop-173.webp?v=1758821978&width=1540",
      "https://camerastuff.co.za/cdn/shop/files/neewer-pa046-360-rotatable-side-handle-top-handle-phone-cages-camerastuff-online-shop-332.webp?v=1758821982&width=1540",
      "https://camerastuff.co.za/cdn/shop/files/neewer-pa046-360-rotatable-side-handle-top-handle-phone-cages-camerastuff-online-shop-546.webp?v=1758821986&width=1540"
    ],
    productUrl: "https://camerastuff.co.za/products/neewer-pa046-360-rotatable-side-handletop-handle-for-phone-cages",
    category: 'vlogging',
    skillLevel: 'intermediate',
    curator: 'ferozza',
    curatorQuote: "Stability for mobile filming. Long shoots. Active documentation. Eliminates shaky footage and hand fatigue. Professional smartphone cinematography.",
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
    imageUrl: "https://camerastuff.co.za/cdn/shop/files/godox-sz150r-150w-rgb-ww-zoomable-cob-led-video-light-monolight-camerastuff-online-shop-612.webp?v=1752069558&width=640",
    imageGallery: [
      "https://camerastuff.co.za/cdn/shop/files/godox-sz150r-150w-rgb-ww-zoomable-cob-led-video-light-monolight-camerastuff-online-shop-612.webp?v=1752069558&width=640",
      "https://camerastuff.co.za/cdn/shop/files/godox-sz150r-150w-rgb-ww-zoomable-cob-led-video-light-monolight-camerastuff-online-shop-362.webp?v=1752069562&width=640",
      "https://camerastuff.co.za/cdn/shop/files/godox-sz150r-150w-rgb-ww-zoomable-cob-led-video-light-monolight-camerastuff-online-shop-134.webp?v=1752069570&width=640",
      "https://camerastuff.co.za/cdn/shop/files/godox-sz150r-150w-rgb-ww-zoomable-cob-led-video-light-monolight-camerastuff-online-shop-595.webp?v=1752069573&width=640",
      "https://camerastuff.co.za/cdn/shop/files/godox-sz150r-150w-rgb-ww-zoomable-cob-led-video-light-monolight-camerastuff-online-shop-485.webp?v=1752069579&width=640",
      "https://camerastuff.co.za/cdn/shop/files/godox-sz150r-150w-rgb-ww-zoomable-cob-led-video-light-monolight-camerastuff-online-shop-423.webp?v=1743590747&width=640"
    ],
    productUrl: "https://camerastuff.co.za/products/godox-sz150r-150w-rgb-ww-zoomable-cob-led-video-light-monolight",
    category: 'studio',
    skillLevel: 'professional',
    curator: 'chad',
    curatorQuote: "Broadcast-quality lighting. Corporate pitches. High-budget productions. Professional studio standard without rental costs.",
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
    imageUrl: "https://camerastuff.co.za/cdn/shop/files/neewer-ls-39-optical-snoot-projector-20-degree-lens-camerastuff-online-shop-south-africa-1-144.webp?v=1752089020&width=1280",
    imageGallery: [
      "https://camerastuff.co.za/cdn/shop/files/neewer-ls-39-optical-snoot-projector-20-degree-lens-camerastuff-online-shop-south-africa-1-144.webp?v=1752089020&width=1280",
      "https://camerastuff.co.za/cdn/shop/files/neewer-ls-39-optical-snoot-projector-20-degree-lens-camerastuff-online-shop-south-africa-3-937.webp?v=1752089027&width=1280",
      "https://camerastuff.co.za/cdn/shop/files/neewer-ls-39-optical-snoot-projector-20-degree-lens-camerastuff-online-shop-south-africa-5-730.webp?v=1752089035&width=1280",
      "https://camerastuff.co.za/cdn/shop/files/neewer-ls-39-optical-snoot-projector-20-degree-lens-camerastuff-online-shop-south-africa-7-920.webp?v=1752089042&width=1280"
    ],
    productUrl: "https://camerastuff.co.za/products/neewer-ls-39-optical-snoot-projector-with-20-degree-lens",
    category: 'studio',
    skillLevel: 'professional',
    curator: 'ferozza',
    curatorQuote: "Artistic lighting control. Sacred spaces. Dramatic effects. Focused beams. Honors intimate environments without clinical brightness.",
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
    imageUrl: "https://camerastuff.co.za/cdn/shop/files/neewer-pa021-pa033-handheld-cage-filter-thread-adapter-samsung-s23-ultra-camerastuff-777.webp?v=1738785819&width=1540",
    imageGallery: [
      "https://camerastuff.co.za/cdn/shop/files/neewer-pa021-pa033-handheld-cage-filter-thread-adapter-samsung-s23-ultra-camerastuff-777.webp?v=1738785819&width=1540",
      "https://camerastuff.co.za/cdn/shop/files/neewer-pa021-pa033-handheld-cage-filter-thread-adapter-samsung-s23-ultra-camerastuff-542.webp?v=1738785822&width=1540",
      "https://camerastuff.co.za/cdn/shop/files/neewer-pa021-pa033-handheld-cage-filter-thread-adapter-samsung-s23-ultra-camerastuff-444.webp?v=1738785826&width=1540",
      "https://camerastuff.co.za/cdn/shop/files/neewer-pa021-pa033-handheld-cage-filter-thread-adapter-samsung-s23-ultra-camerastuff-799.webp?v=1738785834&width=1540",
      "https://camerastuff.co.za/cdn/shop/files/neewer-pa021-pa033-handheld-cage-filter-thread-adapter-samsung-s23-ultra-camerastuff-808.webp?v=1738785845&width=1540"
    ],
    productUrl: "https://camerastuff.co.za/products/neewer-pa021pa033-handheld-cage-with-filter-thread-adapter-for-samsung-s23-ultra",
    category: 'vlogging',
    skillLevel: 'intermediate',
    curator: 'zenith',
    curatorQuote: "Modular system. Efficient setup. Multiple locations. Everything mounts together. Saves hours in production logistics.",
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
    imageUrl: "https://camerastuff.co.za/cdn/shop/files/neewer-ns7l-30cm-mini-quick-release-lantern-softbox-hs60b-hs60c-camerastuff-online-shop-378.webp?v=1752098137&width=1540",
    imageGallery: [
      "https://camerastuff.co.za/cdn/shop/files/neewer-ns7l-30cm-mini-quick-release-lantern-softbox-hs60b-hs60c-camerastuff-online-shop-378.webp?v=1752098137&width=1540",
      "https://camerastuff.co.za/cdn/shop/files/neewer-ns7l-30cm-mini-quick-release-lantern-softbox-hs60b-hs60c-camerastuff-online-shop-427.webp?v=1752098140&width=1540",
      "https://camerastuff.co.za/cdn/shop/files/neewer-ns7l-30cm-mini-quick-release-lantern-softbox-hs60b-hs60c-camerastuff-online-shop-962.webp?v=1752098143&width=1540",
      "https://camerastuff.co.za/cdn/shop/files/neewer-ns7l-30cm-mini-quick-release-lantern-softbox-hs60b-hs60c-camerastuff-online-shop-756.webp?v=1752098147&width=1540",
      "https://camerastuff.co.za/cdn/shop/files/neewer-ns7l-30cm-mini-quick-release-lantern-softbox-hs60b-hs60c-camerastuff-online-shop-469.webp?v=1752098153&width=1540",
      "https://camerastuff.co.za/cdn/shop/files/neewer-ns7l-30cm-mini-quick-release-lantern-softbox-hs60b-hs60c-camerastuff-online-shop-610.webp?v=1752098156&width=1540",
      "https://camerastuff.co.za/cdn/shop/files/neewer-ns7l-30cm-mini-quick-release-lantern-softbox-hs60b-hs60c-camerastuff-online-shop-525.webp?v=1752098159&width=1540"
    ],
    productUrl: "https://camerastuff.co.za/products/neewer-ns7l-30cm-mini-quick-release-lantern-softbox-for-hs60bhs60c",
    category: 'studio',
    skillLevel: 'intermediate',
    curator: 'ferozza',
    curatorQuote: "Soft, gentle lighting. Interviews. Portraits. 360° wrap-around light. Flattering for wellness practitioners. Non-aggressive aesthetic.",
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
    imageUrl: "https://camerastuff.co.za/cdn/shop/files/godox-lms-60g-lavalier-microphone-camerastuff-online-shop-south-africa-1-337.webp?v=1752080234&width=640",
    imageGallery: [
      "https://camerastuff.co.za/cdn/shop/files/godox-lms-60g-lavalier-microphone-camerastuff-online-shop-south-africa-1-337.webp?v=1752080234&width=640",
      "https://camerastuff.co.za/cdn/shop/files/godox-lms-60g-lavalier-microphone-camerastuff-online-shop-south-africa-2-414.webp?v=1752080237&width=640",
      "https://camerastuff.co.za/cdn/shop/files/godox-lms-60g-lavalier-microphone-camerastuff-online-shop-south-africa-3-477.webp?v=1752080240&width=640",
      "https://camerastuff.co.za/cdn/shop/files/godox-lms-60g-lavalier-microphone-camerastuff-online-shop-south-africa-4-405.webp?v=1752080243&width=640",
      "https://camerastuff.co.za/cdn/shop/files/godox-lms-60g-lavalier-microphone-camerastuff-online-shop-south-africa-5-970.webp?v=1752080246&width=640",
      "https://camerastuff.co.za/cdn/shop/files/godox-lms-60g-lavalier-microphone-camerastuff-online-shop-south-africa-10-135.webp?v=1752080260&width=640"
    ],
    productUrl: "https://camerastuff.co.za/products/godox-lms-60g-lavalier-microphone",
    category: 'travel',
    skillLevel: 'intermediate',
    curator: 'chad',
    curatorQuote: "Unobtrusive audio. Documentary interviews. Clear vocal capture. Disappears on clothing. Professional sound without intimidating equipment.",
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
    imageUrl: "https://camerastuff.co.za/cdn/shop/files/camerastuff-900d-tactical-shoulder-sling-camera-bag-online-shop-south-africa-1.jpg?v=1758821597&width=1280",
    productUrl: "https://camerastuff.co.za/products/camerastuff-900d-tactical-shoulder-sling-camera-bag",
    category: 'travel',
    skillLevel: 'beginner',
    curator: 'ferozza',
    curatorQuote: "Durable protection. Field documentation. All-weather. Quick access. Outdoor wellness events. Equipment stays safe in unpredictable environments.",
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
    imageUrl: "https://camerastuff.co.za/cdn/shop/files/camerastuff-icb-04-clapper-board-30x25cm-acrylic-black-online-shop-south-africa-1-386.jpg?v=1758820955&width=1280",
    imageGallery: [
      "https://camerastuff.co.za/cdn/shop/files/camerastuff-icb-04-clapper-board-30x25cm-acrylic-black-online-shop-south-africa-1-386.jpg?v=1758820955&width=1280",
      "https://camerastuff.co.za/cdn/shop/files/camerastuff-icb-04-clapper-board-30x25cm-acrylic-black-online-shop-south-africa-2-222.jpg?v=1758820958&width=1280"
    ],
    productUrl: "https://camerastuff.co.za/products/camerastuff-icb-04-clapper-board-30x25cm-acrylic-black",
    category: 'film-production',
    skillLevel: 'professional',
    curator: 'zenith',
    curatorQuote: "Professional organization. Multi-camera sync. Efficient editing workflow. Signals production credibility. Serious projects need serious tools.",
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
    curatorQuote: "Quick setup. Borrowed spaces. Mobile studios. Creates intentional environments. Professional presentation in any location.",
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
    curatorQuote: "Variable color control. Long sessions. Minimal heat. Matches natural lighting. Respects wellness space energy without artificial look.",
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
    curatorQuote: "Portable. Remote locations. Backpack-friendly. Professional lighting quality. Outdoor events. Studio performance in travel package.",
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
    curatorQuote: "Affordable professional quality. Single-light solution. Natural light pairing. Elevates brand perception. Starting practitioners.",
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
    curatorQuote: "Large-format. Movement practices. Full-body capture. Yoga flows. Professional scale. Practitioners move freely without frame constraints.",
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
    curatorQuote: "Two-person setup. Intimate conversations. Discreet. Professional audio. Practitioner dialogues. Respect personal space.",
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
    curatorQuote: "Participant-documenter balance. Quick access. Non-intrusive. Retreat filming. Maintains presence while capturing moments.",
    whyYouNeedThis: "Respectful, mobile camera storage that maintains your presence in wellness spaces.",
    perfectFor: [
      "Retreat participant-documenters",
      "Community wellness events",
      "Observational documentary work",
      "Hands-free mobility needs"
    ],
    channel: "retreat-documentation",
    imagePosition: 'left'
  },
  {
    id: 18,
    name: "Neewer NK-ST300 3x2.45m Paper Backdrop Stand",
    description: "Heavy-duty paper backdrop stand system supporting rolls up to 2.45m wide. Adjustable height, stable tripod base, quick-release mechanism. Professional backdrop presentation without permanent installation.",
    imageUrl: "https://camerastuff.co.za/cdn/shop/files/neewer-nk-st300-3-x2-45m-backdrop-stand-camerastuff-online-shop-south-africa-1-142.webp?v=1752098078&width=1540",
    imageGallery: [
      "https://camerastuff.co.za/cdn/shop/files/neewer-nk-st300-3-x2-45m-backdrop-stand-camerastuff-online-shop-south-africa-1-142.webp?v=1752098078&width=1540",
      "https://camerastuff.co.za/cdn/shop/files/neewer-nk-st300-3-x2-45m-backdrop-stand-camerastuff-online-shop-south-africa-2-233.webp?v=1752098081&width=1540",
      "https://camerastuff.co.za/cdn/shop/files/neewer-nk-st300-3-x2-45m-backdrop-stand-camerastuff-online-shop-south-africa-3-727.webp?v=1752098084&width=1540",
      "https://camerastuff.co.za/cdn/shop/files/neewer-nk-st300-3-x2-45m-backdrop-stand-camerastuff-online-shop-south-africa-5-988.webp?v=1752098091&width=1540",
      "https://camerastuff.co.za/cdn/shop/files/neewer-nk-st300-3-x2-45m-backdrop-stand-camerastuff-online-shop-south-africa-6-479.webp?v=1752098094&width=1540",
      "https://camerastuff.co.za/cdn/shop/files/neewer-nk-st300-3-x2-45m-backdrop-stand-camerastuff-online-shop-south-africa-8-635.webp?v=1752098100&width=1540"
    ],
    productUrl: "https://camerastuff.co.za/products/neewer-nk-st300-3x245m-paper-backdrop-stand",
    category: 'studio',
    skillLevel: 'intermediate',
    curator: 'zenith',
    curatorQuote: "Paper rolls. Color options. Clean aesthetic. Studio versatility. Quick swaps. Professional presentation without permanent commitment.",
    whyYouNeedThis: "Versatile backdrop system that enables quick color changes for different wellness aesthetics.",
    perfectFor: [
      "Studio with multiple aesthetics",
      "Photography and video mixing",
      "Product and portrait work",
      "Color-themed wellness content"
    ],
    channel: "studio-versatility",
    imagePosition: 'right'
  },
  {
    id: 19,
    name: "Neewer BH40C RGB Esthetician Double LED Kit",
    description: "Specialized dual-arm LED lighting system designed for beauty and esthetician work. RGB color control, adjustable brightness, flexible gooseneck arms, desktop mount included. Perfect for close-up beauty and wellness content.",
    imageUrl: "https://camerastuff.co.za/cdn/shop/files/neewer-bh40c-rgb-esthetician-double-led-constant-light-kit-stand-camerastuff-online-shop-497.webp?v=1750337486&width=1540",
    imageGallery: [
      "https://camerastuff.co.za/cdn/shop/files/neewer-bh40c-rgb-esthetician-double-led-constant-light-kit-stand-camerastuff-online-shop-497.webp?v=1750337486&width=1540",
      "https://camerastuff.co.za/cdn/shop/files/neewer-bh40c-rgb-esthetician-double-led-constant-light-kit-stand-camerastuff-online-shop-882.webp?v=1750337490&width=1540",
      "https://camerastuff.co.za/cdn/shop/files/neewer-bh40c-rgb-esthetician-double-led-constant-light-kit-stand-camerastuff-online-shop-328.webp?v=1750337494&width=1540",
      "https://camerastuff.co.za/cdn/shop/files/neewer-bh40c-rgb-esthetician-double-led-constant-light-kit-stand-camerastuff-online-shop-998.webp?v=1750337498&width=1540",
      "https://camerastuff.co.za/cdn/shop/files/neewer-bh40c-rgb-esthetician-double-led-constant-light-kit-stand-camerastuff-online-shop-609.webp?v=1750337505&width=1540",
      "https://camerastuff.co.za/cdn/shop/files/neewer-bh40c-rgb-esthetician-double-led-constant-light-kit-stand-camerastuff-online-shop-930.webp?v=1750337509&width=1540",
      "https://camerastuff.co.za/cdn/shop/files/neewer-bh40c-rgb-esthetician-double-led-constant-light-kit-stand-camerastuff-online-shop-841.webp?v=1750337513&width=1540",
      "https://camerastuff.co.za/cdn/shop/files/neewer-bh40c-rgb-esthetician-double-led-constant-light-kit-stand-camerastuff-online-shop-501.webp?v=1750337516&width=1540"
    ],
    productUrl: "https://camerastuff.co.za/products/neewer-bh40c-rgb-esthetician-double-led-constant-light-kit-with-stand",
    category: 'studio',
    skillLevel: 'professional',
    curator: 'ferozza',
    curatorQuote: "Beauty work. Skincare content. Close-up precision. Adjustable angles. Flattering lighting. Esthetician standard without salon cost.",
    whyYouNeedThis: "Salon-quality lighting for beauty and skincare content that showcases transformations professionally.",
    perfectFor: [
      "Beauty and skincare documentation",
      "Esthetician content creators",
      "Close-up wellness procedures",
      "Transformation before/after content"
    ],
    salesFunnelCTA: "Building a beauty wellness brand? Omni can elevate your visual identity",
    channel: "beauty-wellness",
    imagePosition: 'left'
  },
  {
    id: 20,
    name: "Neewer GL1C 48W RGBWW Streaming LED Panel",
    description: "Compact streaming-optimized LED panel with desktop mount. 48W RGBWW output, app control, multiple lighting effects, adjustable brightness and color temperature. Designed for content creators and streamers.",
    imageUrl: "https://camerastuff.co.za/cdn/shop/files/neewer-gl1c-48w-rgb-ww-streaming-led-constant-light-panel-desktop-mount-camerastuff-508.jpg?v=1743595520&width=1540",
    imageGallery: [
      "https://camerastuff.co.za/cdn/shop/files/neewer-gl1c-48w-rgb-ww-streaming-led-constant-light-panel-desktop-mount-camerastuff-508.jpg?v=1743595520&width=1540",
      "https://camerastuff.co.za/cdn/shop/files/neewer-gl1c-48w-rgb-ww-streaming-led-constant-light-panel-desktop-mount-camerastuff-114.webp?v=1743595524&width=1540",
      "https://camerastuff.co.za/cdn/shop/files/neewer-gl1c-48w-rgb-ww-streaming-led-constant-light-panel-desktop-mount-camerastuff-106.webp?v=1743595527&width=1540",
      "https://camerastuff.co.za/cdn/shop/files/neewer-gl1c-48w-rgb-ww-streaming-led-constant-light-panel-desktop-mount-camerastuff-721.webp?v=1743595530&width=1540",
      "https://camerastuff.co.za/cdn/shop/files/neewer-gl1c-48w-rgb-ww-streaming-led-constant-light-panel-desktop-mount-camerastuff-283.webp?v=1743595538&width=1540",
      "https://camerastuff.co.za/cdn/shop/files/neewer-gl1c-48w-rgb-ww-streaming-led-constant-light-panel-desktop-mount-camerastuff-142.webp?v=1743595541&width=1540",
      "https://camerastuff.co.za/cdn/shop/files/neewer-gl1c-48w-rgb-ww-streaming-led-constant-light-panel-desktop-mount-camerastuff-460.webp?v=1743595544&width=1540",
      "https://camerastuff.co.za/cdn/shop/files/neewer-gl1c-48w-rgb-ww-streaming-led-constant-light-panel-desktop-mount-camerastuff-132.webp?v=1743595547&width=1540"
    ],
    productUrl: "https://camerastuff.co.za/products/neewer-gl1c-48w-rgbww-streaming-led-constant-light-panel-with-desktop-mount",
    category: 'vlogging',
    skillLevel: 'beginner',
    curator: 'chad',
    curatorQuote: "Streaming setup. Online classes. Desktop content. App control. Wellness coaching online. Professional look for virtual sessions.",
    whyYouNeedThis: "Professional streaming setup for online wellness coaching and virtual classes.",
    perfectFor: [
      "Online wellness coaching",
      "Virtual yoga classes",
      "Meditation livestreams",
      "Desktop content creation"
    ],
    salesFunnelCTA: "Going virtual? Let Omni design your online wellness studio",
    channel: "virtual-wellness",
    imagePosition: 'right'
  },
  {
    id: 21,
    name: "Neewer SL90 12W RGBWW Mini LED Panel",
    description: "Ultra-compact 12W RGBWW LED panel. Pocket-sized, magnetic mounting, rechargeable battery, full color control. Perfect for travel creators and on-the-go lighting needs.",
    imageUrl: "https://camerastuff.co.za/cdn/shop/files/neewer-sl90-12w-rgb-ww-mini-led-constant-light-panel-camerastuff-online-shop-south-africa-729.webp?v=1752089431&width=1540",
    imageGallery: [
      "https://camerastuff.co.za/cdn/shop/files/neewer-sl90-12w-rgb-ww-mini-led-constant-light-panel-camerastuff-online-shop-south-africa-729.webp?v=1752089431&width=1540",
      "https://camerastuff.co.za/cdn/shop/files/neewer-sl90-12w-rgb-ww-mini-led-constant-light-panel-camerastuff-online-shop-south-africa-970.webp?v=1752089439&width=1540",
      "https://camerastuff.co.za/cdn/shop/files/neewer-sl90-12w-rgb-ww-mini-led-constant-light-panel-camerastuff-online-shop-south-africa-623.webp?v=1752089464&width=1540",
      "https://camerastuff.co.za/cdn/shop/files/neewer-sl90-12w-rgb-ww-mini-led-constant-light-panel-camerastuff-online-shop-south-africa-337.webp?v=1752089457&width=1540",
      "https://camerastuff.co.za/cdn/shop/files/neewer-sl90-12w-rgb-ww-mini-led-constant-light-panel-camerastuff-online-shop-south-africa-988.webp?v=1752089450&width=1540",
      "https://camerastuff.co.za/cdn/shop/files/neewer-sl90-12w-rgb-ww-mini-led-constant-light-panel-camerastuff-online-shop-south-africa-286.webp?v=1752089442&width=1540"
    ],
    productUrl: "https://camerastuff.co.za/products/neewer-sl90-12w-rgbww-mini-led-constant-light-panel",
    category: 'travel',
    skillLevel: 'beginner',
    curator: 'ferozza',
    curatorQuote: "Pocket-sized. Emergency fill light. Travel essential. Magnetic mount. Always-ready lighting. Never miss a moment for lack of light.",
    whyYouNeedThis: "Emergency lighting solution that fits in your pocket and saves unexpected moments.",
    perfectFor: [
      "Travel wellness creators",
      "Emergency fill lighting",
      "Compact travel kits",
      "Spontaneous content capture"
    ],
    channel: "travel-essentials",
    imagePosition: 'left'
  }
];

export const curatorProfiles = {
  ferozza: {
    name: "Ferozza",
    title: "Content Creator & Vlogger",
    expertise: "Mobile & Compact Gear",
    bio: "Specializes in portable, high-quality gear for creators on the move. Focuses on equipment that balances portability with professional results.",
    avatar: "https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/Feroza%20Portrait.jpg"
  },
  chad: {
    name: "Chad",
    title: "Head of Media & Strategy",
    expertise: "Studio & Professional Production",
    bio: "Expert in studio setups and professional media production. Guides teams toward equipment that delivers consistent, broadcast-quality results.",
    avatar: "https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/provider-images/Chad%20and%20cow_OMNI_BWC.jpg"
  },
  zenith: {
    name: "Zenith",
    title: "Administration & Project Coordination",
    expertise: "Practical & Beginner-Friendly Solutions",
    bio: "Focuses on accessible, user-friendly equipment that empowers newcomers to start their content creation journey with confidence.",
    avatar: "https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/Zenith_TNT_OMNI-9.jpg"
  }
};
