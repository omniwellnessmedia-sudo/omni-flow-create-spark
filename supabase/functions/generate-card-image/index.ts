import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { prompt, category } = await req.json()

    // Enhanced prompts based on category
    const enhancedPrompts = {
      'business': `Professional business strategy and consulting visualization: ${prompt}. Modern, clean design with blue and purple gradients, professional atmosphere, ultra high resolution`,
      'media': `Creative media production and content creation: ${prompt}. Dynamic, colorful design with cameras, microphones, creative energy, ultra high resolution`,
      'ai-tools': `Futuristic AI and technology visualization: ${prompt}. Glowing neural networks, holographic interfaces, cyan and purple tech aesthetics, ultra high resolution`,
      'community': `Diverse community and wellness gathering: ${prompt}. Warm, inclusive atmosphere with diverse people connecting, golden hour lighting, ultra high resolution`,
      'tours': `Beautiful South African landscape and wellness retreat: ${prompt}. Stunning natural scenery, mountains, ocean, peaceful wellness setting, ultra high resolution`,
      'podcast': `Professional podcast studio and audio content: ${prompt}. Modern recording setup, warm lighting, professional microphones, engaging atmosphere, ultra high resolution`,
      'inspiration': `Uplifting and inspiring wellness scene: ${prompt}. Bright, positive energy, golden light, peaceful and motivating atmosphere, ultra high resolution`,
      'education': `Learning and educational environment: ${prompt}. Clean, organized learning space, books, growth symbols, bright and clear lighting, ultra high resolution`,
      'empowerment': `Powerful and empowering personal growth scene: ${prompt}. Strong, confident energy, rising sun, mountain peaks, success and achievement symbols, ultra high resolution`,
      'wellness': `Holistic wellness and mindfulness scene: ${prompt}. Peaceful meditation, nature elements, soft natural lighting, healing crystals, zen atmosphere, ultra high resolution`
    }

    const finalPrompt = enhancedPrompts[category] || `${prompt}. Beautiful, professional design with vibrant colors, ultra high resolution`

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt: finalPrompt,
        size: '1024x1024',
        quality: 'high',
        output_format: 'webp',
        background: 'opaque'
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('OpenAI API error:', error)
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        image: data.data[0].b64_json,
        format: 'webp'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Error generating image:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to generate image', 
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    )
  }
})