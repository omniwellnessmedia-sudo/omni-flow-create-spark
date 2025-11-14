import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabaseClient.auth.getUser(token);

    if (!user) {
      throw new Error('Unauthorized');
    }

    const { content_type, context } = await req.json();

    if (!content_type || !context) {
      throw new Error('Missing required fields: content_type, context');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    console.log('Generating content:', content_type, 'for:', context.business_name);

    // Create AI prompt based on content type
    let systemPrompt = '';
    let userPrompt = '';

    switch (content_type) {
      case 'hero_headline':
        systemPrompt = `You are a professional copywriter specializing in wellness and holistic health marketing. Generate compelling hero headlines that drive conversions.`;
        userPrompt = `Generate 3 compelling hero headlines for a wellness practitioner's website.

Business Context:
- Business Name: ${context.business_name}
- Specialties: ${context.specialties?.join(', ') || 'Wellness Services'}
- Location: ${context.location || 'South Africa'}
- Target Audience: ${context.target_audience || 'Health-conscious individuals'}

Requirements:
- Each headline should be 5-10 words
- Focus on transformation and results
- Use empowering, positive language
- Avoid clichés
- Be specific to the specialties

Format your response as a JSON array:
[
  {
    "content": "Your compelling headline here",
    "reasoning": "Why this works for their audience and specialty"
  }
]`;
        break;

      case 'hero_subheadline':
        systemPrompt = `You are a professional copywriter specializing in wellness marketing. Generate engaging subheadlines that support the main message.`;
        userPrompt = `Generate 3 engaging subheadlines for a wellness practitioner's website.

Business Context:
- Business Name: ${context.business_name}
- Specialties: ${context.specialties?.join(', ') || 'Wellness Services'}
- Location: ${context.location || 'South Africa'}

Requirements:
- 10-15 words each
- Complement the hero headline
- Describe the unique value proposition
- Create urgency or desire

Format as JSON array with "content" and "reasoning" fields.`;
        break;

      case 'about_section':
        systemPrompt = `You are a professional content writer for wellness businesses. Create authentic, engaging About sections.`;
        userPrompt = `Generate 3 About section variations for a wellness practitioner.

Business Context:
- Business Name: ${context.business_name}
- Specialties: ${context.specialties?.join(', ') || 'Wellness Services'}
- Location: ${context.location || 'South Africa'}

Requirements:
- 100-150 words each
- Personal yet professional tone
- Highlight expertise and passion
- Build trust and connection
- Include a call to action

Format as JSON array with "content" and "reasoning" fields.`;
        break;

      case 'meta_description':
        systemPrompt = `You are an SEO expert specializing in wellness businesses. Generate optimized meta descriptions.`;
        userPrompt = `Generate 3 SEO-optimized meta descriptions.

Business Context:
- Business Name: ${context.business_name}
- Specialties: ${context.specialties?.join(', ') || 'Wellness Services'}
- Location: ${context.location || 'South Africa'}

Requirements:
- 150-160 characters each
- Include primary keyword naturally
- Action-oriented
- Highlight unique value

Format as JSON array with "content" and "reasoning" fields.`;
        break;

      default:
        throw new Error(`Unsupported content_type: ${content_type}`);
    }

    const startTime = Date.now();

    // Call Lovable AI
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('Lovable AI error:', aiResponse.status, errorText);
      throw new Error(`AI generation failed: ${errorText}`);
    }

    const aiData = await aiResponse.json();
    const generationTime = Date.now() - startTime;
    
    const aiContent = aiData.choices[0].message.content;
    
    // Parse JSON response
    let suggestions;
    try {
      suggestions = JSON.parse(aiContent);
    } catch (e) {
      // If not valid JSON, extract content manually
      console.warn('AI response not valid JSON, extracting manually');
      suggestions = [{
        content: aiContent,
        reasoning: 'AI-generated content'
      }];
    }

    // Get provider website
    const { data: website } = await supabaseClient
      .from('provider_websites')
      .select('id')
      .eq('provider_id', user.id)
      .maybeSingle();

    // Store each suggestion in database
    for (const suggestion of suggestions) {
      await supabaseClient
        .from('website_ai_content')
        .insert({
          provider_id: user.id,
          website_id: website?.id || null,
          content_type: content_type,
          prompt_used: userPrompt,
          generated_content: suggestion.content,
          model_used: 'google/gemini-2.5-flash',
          generation_time_ms: generationTime,
        });
    }

    return new Response(
      JSON.stringify({
        success: true,
        content_type: content_type,
        suggestions: suggestions,
        generation_time_ms: generationTime,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error generating content:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
