import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const { type, businessName, specialties, experienceYears, location, tool_name } = await req.json();

    // Input sanitization function to prevent XSS and injection attacks
    const sanitizeInput = (input: string): string => {
      if (!input) return "";
      return input
        .replace(/[<>]/g, "") // Remove potential script tags
        .replace(/javascript:/gi, "") // Remove javascript: protocols
        .replace(/on\w+\s*=/gi, "") // Remove event handlers
        .replace(/\${.*?}/g, "") // Remove template literals
        .trim()
        .substring(0, 500); // Limit length
    };

    // Sanitize inputs
    const sanitizedBusinessName = businessName ? sanitizeInput(businessName) : "";
    const sanitizedSpecialties = Array.isArray(specialties) 
      ? specialties.map(s => sanitizeInput(s)).filter(s => s.length > 0)
      : [];
    const sanitizedLocation = location ? sanitizeInput(location) : "";
    const sanitizedToolName = tool_name ? sanitizeInput(tool_name) : "";
    
    // Validate experience years is a reasonable number
    const validExperienceYears = typeof experienceYears === 'number' && 
      experienceYears >= 0 && experienceYears <= 50 ? experienceYears : null;

    let prompt = '';
    
    switch (type) {
      case 'bio':
        prompt = `Create a professional and engaging bio for a wellness provider with the following details:
        - Business Name: ${sanitizedBusinessName}
        - Specialties: ${sanitizedSpecialties.join(', ') || 'wellness services'}
        - Experience: ${validExperienceYears || 'several'} years
        - Location: ${sanitizedLocation}
        
        The bio should be warm, authentic, and highlight their passion for wellness. Keep it around 2-3 sentences and make it sound personal and trustworthy.`;
        break;
        
      case 'service_title':
        prompt = `Generate a compelling service title for a wellness provider who specializes in ${sanitizedSpecialties[0] || 'wellness'}. The title should be specific, engaging, and clearly communicate the benefit to clients. Keep it under 60 characters.`;
        break;
        
      case 'service_description':
        prompt = `Create a detailed service description for a ${sanitizedSpecialties[0] || 'wellness'} service. Include:
        - What clients can expect
        - Benefits they'll receive  
        - Your approach or methodology
        - Who it's suitable for
        
        Make it warm, professional, and around 3-4 sentences. Focus on transformation and value.`;
        break;
        
      case 'tool_demo':
        // Generate demo content based on the tool name
        const toolDemos = {
          'logo-generator': 'Generated 5 unique logo concepts for "Zenith Wellness Studio" featuring lotus symbols and calming blue-green gradients. Brand guide includes complementary colors (#2D4A5A, #7FB3A3, #F5F5DC) and suggested fonts (Montserrat, Open Sans).',
          'business-plan': 'Created comprehensive business plan for wellness practice: Executive Summary outlines holistic yoga & meditation services targeting young professionals. Financial projections show break-even at month 8 with 50 regular clients.',
          'content-calendar-pro': 'Generated 90-day content calendar: Week 1-10 focus on "Mindful Mornings" theme with 63 Instagram posts, 21 LinkedIn articles, and 12 YouTube videos. Hashtag strategy includes #MindfulMorning #WellnessWednesday #SelfCareSunday.',
          'email-sequences': 'Created 7-email welcome sequence: Email 1 welcomes new clients with free meditation guide. Email 3 shares founder story. Email 7 offers first session 50% off. Open rates predicted at 28% industry average.',
          'meal-planner': 'Generated personalized 7-day meal plan for weight management: 1,800 calories/day with Mediterranean focus. Breakfast: Overnight oats with berries (320 cal). Lunch: Quinoa Buddha bowl (445 cal). Dinner: Grilled salmon with roasted vegetables (510 cal).',
          'mindfulness-coach': 'Created custom 10-minute morning meditation: "Begin by noticing three things you can see, two you can hear, one you can smell. Breathe deeply, setting intention for your day ahead..." Includes breathing pattern: 4 counts in, 6 counts out.',
          'wellness-assessment': 'Wellness Blueprint Complete: Physical Health Score 7/10, Mental Wellbeing 6/10, Emotional Balance 8/10. Recommendations: Increase cardio 2x/week, try journaling for stress, maintain social connections. Priority focus: Sleep optimization.',
          'story-creator': 'Wellness Story Framework: Hook: "Two years ago, I couldn\'t climb stairs without getting winded..." Journey: Document struggles with energy, discovery of yoga, gradual transformation. Call-to-action: "What small step will you take today?"'
        };
        
        const demoContent = toolDemos[sanitizedToolName] || `AI tool "${sanitizedToolName}" demonstration: This powerful tool uses advanced AI to generate personalized content tailored to your specific wellness goals and business needs.`;
        
        return new Response(JSON.stringify({ content: demoContent }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
        
      default:
        throw new Error('Invalid content type');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are a wellness marketing expert who writes authentic, engaging content for wellness practitioners. Your writing is warm, professional, and focuses on genuine transformation and healing.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 200,
      }),
    });

    const data = await response.json();
    const generatedContent = data.choices[0].message.content.trim();

    return new Response(JSON.stringify({ content: generatedContent }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-content function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});