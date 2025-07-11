// Comprehensive wellness glossary based on https://www.wellbeingescapes.com/wellness-glossary
export const wellnessSpecialties = [
  // A
  "Abdominal Massage Therapy",
  "Abhyanga",
  "Acupuncture",
  "Aerobics",
  "Airnergy",
  "Algae Body Wrap",
  "Anti-cellulite Massage",
  "Aromatherapy Massage",
  "Ashtanga Yoga",
  "Ayurveda",

  // B
  "Bach Flower Therapy",
  "Beauty Sleep Facial",
  "Bikram Yoga",
  "Bio Hormonal Modulator",
  "Bio Resistance Therapy",
  "Bioenergetic Therapy",
  "Biofeedback",
  "Body Wraps",
  "Bodypump",
  "Breathwork",

  // C
  "Cell Volt Charging",
  "Chakra Sound Healing",
  "Chi Nei Tsang",
  "Chiropractic",
  "Cognitive Training",
  "Colon Hydrotherapy",
  "Colorpuncture",
  "Colour Healing",
  "Core Release Massage",
  "Craniosacral Therapy",

  // D
  "Deep Tissue Massage",
  "Detox Massage",
  "DEXA Scanning",
  "Dual Therapy",

  // E
  "Energy Medicine",
  "Energy Massage",

  // F
  "Facial Treatments",
  "Facial Yoga",
  "Fitness Training",
  "Floatation Therapy",
  "Forest Bathing",
  "Four-handed Massage",

  // G
  "Gait Analysis",
  "Gua Sha",

  // H
  "Hammam",
  "Hatha Yoga",
  "Heart Rate Variability",
  "Herbal Therapy",
  "HIIT Training",
  "Holistic Acupressure",
  "Homeopathy",
  "Hot Stone Massage",
  "Hot Yoga",
  "Hydrotherapy",
  "Hyperbaric Oxygen Therapy",

  // I
  "Image Consultation",
  "Indian Head Massage",
  "Infrared Therapy",
  "IV Therapy",

  // K
  "Kinesiology",

  // L
  "Life Coaching",
  "Lymphatic Drainage",

  // M
  "Massage Therapy",
  "Meditation",
  "Mindfulness",
  "Myofascial Release",

  // N
  "Naturopathy",
  "Nutrition Counseling",

  // O
  "Osteopathy",
  "Oxygen Therapy",

  // P
  "Personal Training",
  "Pilates",
  "Physiotherapy",
  "Posture Correction",
  "Prenatal Massage",
  "Psychotherapy",

  // R
  "Reflexology",
  "Reiki",
  "Resistance Training",

  // S
  "Shiatsu",
  "Sound Healing",
  "Spa Treatments",
  "Sports Massage",
  "Stress Management",
  "Swedish Massage",

  // T
  "Thai Massage",
  "Therapeutic Massage",
  "Traditional Chinese Medicine",

  // V
  "Vibrational Therapy",
  "Yoga Therapy",

  // W
  "Weight Management",
  "Wellness Coaching",

  // Y
  "Yin Yoga",
  "Yoga",

  // Z
  "Zone Therapy"
];

export const wellnessCategories = [
  "Massage & Bodywork",
  "Fitness & Movement",
  "Nutrition & Wellness",
  "Mind & Mental Health",
  "Beauty & Skincare",
  "Alternative Medicine",
  "Therapeutic Services",
  "Spiritual & Energy Work",
  "Medical & Health",
  "Lifestyle & Coaching"
];

export const getCategoryForSpecialty = (specialty: string): string => {
  const massageKeywords = ["massage", "bodywork", "touch", "pressure", "manipulation"];
  const fitnessKeywords = ["yoga", "pilates", "training", "fitness", "exercise", "movement"];
  const nutritionKeywords = ["nutrition", "diet", "detox", "colon", "weight"];
  const mindKeywords = ["meditation", "mindfulness", "breathwork", "stress", "therapy", "coaching"];
  const beautyKeywords = ["facial", "beauty", "skin", "anti-aging"];
  const altMedKeywords = ["acupuncture", "ayurveda", "homeopathy", "naturopathy", "chinese"];
  const therapeuticKeywords = ["therapy", "healing", "treatment", "rehabilitation"];
  const spiritualKeywords = ["chakra", "energy", "reiki", "sound", "spiritual"];
  const medicalKeywords = ["medical", "clinical", "diagnostic", "analysis", "scanning"];

  const lowerSpecialty = specialty.toLowerCase();

  if (massageKeywords.some(keyword => lowerSpecialty.includes(keyword))) {
    return "Massage & Bodywork";
  }
  if (fitnessKeywords.some(keyword => lowerSpecialty.includes(keyword))) {
    return "Fitness & Movement";
  }
  if (nutritionKeywords.some(keyword => lowerSpecialty.includes(keyword))) {
    return "Nutrition & Wellness";
  }
  if (mindKeywords.some(keyword => lowerSpecialty.includes(keyword))) {
    return "Mind & Mental Health";
  }
  if (beautyKeywords.some(keyword => lowerSpecialty.includes(keyword))) {
    return "Beauty & Skincare";
  }
  if (altMedKeywords.some(keyword => lowerSpecialty.includes(keyword))) {
    return "Alternative Medicine";
  }
  if (therapeuticKeywords.some(keyword => lowerSpecialty.includes(keyword))) {
    return "Therapeutic Services";
  }
  if (spiritualKeywords.some(keyword => lowerSpecialty.includes(keyword))) {
    return "Spiritual & Energy Work";
  }
  if (medicalKeywords.some(keyword => lowerSpecialty.includes(keyword))) {
    return "Medical & Health";
  }

  return "Lifestyle & Coaching";
};