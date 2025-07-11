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
    const { type, businessName, specialties, experienceYears, location } = await req.json();

    let prompt = '';
    
    switch (type) {
      case 'bio':
        prompt = `Create a professional and engaging bio for a wellness provider with the following details:
        - Business Name: ${businessName}
        - Specialties: ${specialties?.join(', ') || 'wellness services'}
        - Experience: ${experienceYears || 'several'} years
        - Location: ${location}
        
        The bio should be warm, authentic, and highlight their passion for wellness. Keep it around 2-3 sentences and make it sound personal and trustworthy.`;
        break;
        
      case 'service_title':
        prompt = `Generate a compelling service title for a wellness provider who specializes in ${specialties?.[0] || 'wellness'}. The title should be specific, engaging, and clearly communicate the benefit to clients. Keep it under 60 characters.`;
        break;
        
      case 'service_description':
        prompt = `Create a detailed service description for a ${specialties?.[0] || 'wellness'} service. Include:
        - What clients can expect
        - Benefits they'll receive  
        - Your approach or methodology
        - Who it's suitable for
        
        Make it warm, professional, and around 3-4 sentences. Focus on transformation and value.`;
        break;
        
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