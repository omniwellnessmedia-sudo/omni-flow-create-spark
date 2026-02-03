/**
 * Omni Wellness Media - Voice & Tone Guide
 * 
 * This defines the conversational, warm, guided voice that should be used
 * across all pages, components, and communications.
 * 
 * The goal: Every interaction feels like someone is personally guiding you.
 * "We've got your back" - reassuring, authentic, conscious.
 */

export const omniVoice = {
  // Opening phrases - warm, welcoming, personal
  greetings: {
    general: "Hey there, conscious explorer",
    returning: "Welcome back to your wellness journey",
    warm: "We're glad you're here",
    collaborative: "Let's explore this together",
    home: "Welcome home, conscious explorer ✨",
    services: "Not sure where to start? We've got you.",
    about: "Hey, let us tell you our story",
    contact: "We're all ears",
    blog: "Grab a cup of tea and explore",
    tours: "Ready for an adventure?",
    shop: "Meet Zenith and Feroza",
  },

  // Transition phrases - guiding feel
  transitions: {
    curated: "Here's what we've curated for you",
    special: "We've got something special",
    showAround: "Let us show you around",
    rightPlace: "You're in the right place",
    discover: "Let's discover together",
    explore: "There's so much to explore",
  },

  // Reassurance phrases - Omni has your back
  reassurance: {
    covered: "We've got you covered",
    goodHands: "You're in good hands with our team",
    everyStep: "We're here every step of the way",
    noPressure: "No pressure, just possibilities",
    gotYourBack: "Omni has your back",
    takeYourTime: "Take your time, we're here when you're ready",
    trusted: "Trusted by conscious creators across South Africa",
  },

  // CTA phrases - action-oriented, friendly
  ctas: {
    explore: "Let's explore together",
    start: "Ready when you are",
    book: "Let's make it happen",
    contact: "We'd love to hear from you",
    discover: "Discover what's possible",
    connect: "Connect with us",
    join: "Join the journey",
    learn: "Learn more",
    seeMore: "See what we've created",
    getStarted: "Take the first step",
  },

  // Page-specific intros
  pageIntros: {
    home: {
      headline: "Welcome Home, Conscious Explorer ✨",
      subheadline: "We're here to guide your wellness journey — from retreats to connectivity, from content to community. Let's explore together.",
    },
    about: {
      headline: "Hey, Let Us Tell You Our Story",
      subheadline: "We started with a simple belief: everyone deserves content that uplifts. Here's who we are and why we do what we do.",
    },
    services: {
      headline: "Not Sure Where to Start? We've Got You.",
      subheadline: "Here's everything we can help you build — from media to strategy, from wellness to web.",
    },
    contact: {
      headline: "We're All Ears",
      subheadline: "Whatever you're dreaming of, let's talk about making it real. We'd love to hear from you.",
    },
    blog: {
      headline: "Grab a Cup of Tea and Explore",
      subheadline: "These are the stories, ideas, and insights we're excited to share with you.",
    },
    tours: {
      headline: "Ready for an Adventure?",
      subheadline: "Our curators have handpicked these experiences just for conscious travelers like you.",
    },
    businessConsulting: {
      headline: "Building Something Meaningful?",
      subheadline: "We've helped over 200 businesses grow with purpose. Let us show you how.",
    },
    twoBeWellShop: {
      headline: "Nature Bottled with Love",
      subheadline: "Meet Zenith and Feroza. In their Cape Town kitchen, they're bottling nature's best — just for you.",
    },
    podcast: {
      headline: "Stories Worth Your Time",
      subheadline: "Conversations that inspire, educate, and empower. Pull up a chair and listen in.",
    },
    roambuddy: {
      headline: "Stay Connected on Your Journey",
      subheadline: "Roam has curated the perfect connectivity solutions for conscious travelers. Tell me where you're headed.",
    },
  },

  // Section intros - for use within pages
  sectionIntros: {
    services: "Start here — these are our core offerings",
    testimonials: "Here's what people are saying",
    team: "Meet the humans behind Omni",
    partners: "We're proud to work with",
    featured: "Hand-picked for you",
    community: "From our community",
    tours: "Experiences curated with care",
  },

  // Curator-specific phrases
  curatorVoices: {
    chad: {
      intro: "Let's talk about your vision",
      tip: "Start here — these are our core offerings",
      style: "strategic",
    },
    zenith: {
      intro: "I've personally vetted each of these experiences",
      tip: "These stories matter to us — hope they inspire you",
      style: "nurturing",
    },
    feroza: {
      intro: "Everything here is made with intention",
      tip: "We believe in what we create",
      style: "authentic",
    },
    roam: {
      intro: "Tell me where you're headed, I'll find your plan",
      tip: "Connectivity should never interrupt your journey",
      style: "helpful",
    },
  },

  // Footer/Newsletter copy
  newsletter: {
    headline: "We'd Love to Stay in Touch",
    subheadline: "Get weekly wellness tips, conscious content insights, and be the first to know about our transformative projects.",
    successMessage: "Welcome to the Omni family! We're so glad you're here. Check your inbox for a warm hello from our team.",
    ctaText: "Join the Journey",
  },

  // Contact form responses
  contactResponses: {
    success: "Got it! Your message is in Chad's inbox. He'll get back to you within 24 hours. In the meantime, explore our services or grab a cup of tea with our blog.",
    error: "Oops! Something went wrong. Please try again, or reach out to us directly at omniwellnessmedia@gmail.com",
  },
};

// Helper function to get a random greeting
export const getRandomGreeting = (): string => {
  const greetings = Object.values(omniVoice.greetings);
  return greetings[Math.floor(Math.random() * greetings.length)];
};

// Helper function to get a random reassurance
export const getRandomReassurance = (): string => {
  const reassurances = Object.values(omniVoice.reassurance);
  return reassurances[Math.floor(Math.random() * reassurances.length)];
};

// Helper function to get page intro copy
export const getPageIntro = (page: keyof typeof omniVoice.pageIntros) => {
  return omniVoice.pageIntros[page];
};

// Helper function to get curator voice
export const getCuratorVoice = (curator: keyof typeof omniVoice.curatorVoices) => {
  return omniVoice.curatorVoices[curator];
};

export default omniVoice;
