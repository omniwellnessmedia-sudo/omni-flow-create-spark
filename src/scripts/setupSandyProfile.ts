// Script to set up Sandy Mitchell's complete provider profile
// Run this after creating her user account in Supabase Auth

import { supabase } from "@/integrations/supabase/client";

export const setupSandyProfile = async (userId: string) => {
  try {
    // 1. Create/Update Provider Profile
    const { error: profileError } = await supabase
      .from('provider_profiles')
      .upsert({
        id: userId,
        business_name: 'Sandy Mitchell Wellness',
        description: `I'm Sandy Mitchell, a Dru Yoga and Buteyko Breathing practitioner based in Cape Town. My work is grounded in heart-based, breath awareness, that meets people where they are. I guide clients gently back to their breath, body, and inner stillness — especially those who feel disconnected from traditional wellness spaces. My sessions are soft, soulful, and rooted in real human experience.

My journey into wellness has been a gradual progression over time, having always taken an interest in wellness and ways to improve one's health with minimal intervention. I've trained in Dru Yoga — a gentle, accessible form of yoga that works through energy block release sequences, flowing sequences and traditional asanas (postures) — as well Buteyko Breathing, a science-based, non-invasive approach to correcting dysfunctional breathing patterns, often linked to adverse health conditions.

I aim to create a space where people feel safe to be themselves, guided by a belief in the power of subtlety and gentleness rather than pushing or forcing. I work with people of all ages, but especially support people who feel overwhelmed, burnt out, or simply stuck. My yoga classes are grounded and accessible, and at times we laugh a lot!

I also collaborate with Omni Wellness Media on workshops, content, and a longer-term vision of co-creating accessible tools for combating stress and living life more in tune with nature and one's self.`,
        location: 'Cape Town, South Africa',
        phone: '+27-XXX-XXX-XXXX',
        website: 'https://sandymitchell.co.za/book-a-call/',
        specialties: ['Dru Yoga', 'Buteyko Breathing', 'Breathwork', 'Trauma-Informed Practice', 'Mental Wellness'],
        certifications: ['Dru Yoga Instructor', 'Buteyko Breathing Practitioner'],
        experience_years: 5,
        verified: true,
        wellcoin_balance: 100
      });

    if (profileError) throw profileError;

    // 2. Create Services
    const services = [
      {
        provider_id: userId,
        title: 'Dru Yoga Class - Stonehurst',
        description: 'Gentle, flowing yoga designed for all bodies. Includes breath, movement, stillness. Fridays 9:00 AM at Stonehurst.',
        category: 'Yoga & Movement',
        price_zar: 120,
        price_wellcoins: 100,
        duration_minutes: 60,
        location: 'Stonehurst, Cape Town',
        is_online: false,
        active: true
      },
      {
        provider_id: userId,
        title: 'Dru Yoga Class - Observatory',
        description: 'Gentle, flowing yoga designed for all bodies. Includes breath, movement, stillness. Thursdays 5:45 PM at Observatory.',
        category: 'Yoga & Movement',
        price_zar: 120,
        price_wellcoins: 100,
        duration_minutes: 60,
        location: 'Observatory, Cape Town',
        is_online: false,
        active: true
      },
      {
        provider_id: userId,
        title: 'Dru Backcare Course',
        description: 'A 5-10 week programme to relieve back pain. Simple, easy-to-do exercises. Stretch and strengthen the muscles along your spine.',
        category: 'Therapeutic Wellness',
        price_zar: 600,
        price_wellcoins: 500,
        duration_minutes: 60,
        location: 'Cape Town',
        is_online: false,
        active: true
      },
      {
        provider_id: userId,
        title: 'Dru Mental Wellness Course',
        description: 'A 5 week Yoga course to improve one\'s feeling of wellbeing. Focusing on calming yoga flows, relaxation and better breathing.',
        category: 'Mental Health & Wellness',
        price_zar: 600,
        price_wellcoins: 500,
        duration_minutes: 60,
        location: 'Cape Town',
        is_online: false,
        active: true
      },
      {
        provider_id: userId,
        title: 'Buteyko Breathing Private Session',
        description: 'Personalised breathing retraining for anxiety, sleep, respiratory disorders or general health. Includes 4/5 sessions. Handouts, MP3s and WhatsApp support is included.',
        category: 'Breathwork & Meditation',
        price_zar: 350,
        price_wellcoins: 300,
        duration_minutes: 60,
        location: 'Cape Town or Online (Zoom)',
        is_online: true,
        active: true
      },
      {
        provider_id: userId,
        title: 'Free Discovery Call',
        description: '15-min consult to understand your needs and see if we\'re a fit. Perfect introduction to my approach.',
        category: 'Consultation',
        price_zar: 0,
        price_wellcoins: 0,
        duration_minutes: 15,
        location: 'Online (Zoom/Phone)',
        is_online: true,
        active: true
      },
      {
        provider_id: userId,
        title: 'Monthly Workshop',
        description: 'Themed sessions combining Dru Yoga & Buteyko with space for sharing, rest, and community. 90-120 minutes of deep restoration.',
        category: 'Workshops & Events',
        price_zar: 250,
        price_wellcoins: 210,
        duration_minutes: 90,
        location: 'Cape Town',
        is_online: false,
        active: true
      }
    ];

    const { error: servicesError } = await supabase
      .from('services')
      .insert(services);

    if (servicesError) throw servicesError;

    // 3. Create Welcome Transaction
    const { error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        transaction_type: 'bonus',
        description: 'Welcome to Omni Wellness Exchange! Your starting WellCoins.',
        amount_wellcoins: 100,
        amount_zar: 0,
        status: 'completed'
      });

    if (transactionError) throw transactionError;

    console.log('Sandy Mitchell profile and services created successfully!');
    return true;

  } catch (error) {
    console.error('Error setting up Sandy profile:', error);
    return false;
  }
};

// Example usage:
// setupSandyProfile('SANDY_USER_ID_FROM_SUPABASE');