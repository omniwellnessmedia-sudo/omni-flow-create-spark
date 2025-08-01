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
    const { templateType, designData } = await req.json()
    const canvaApiKey = Deno.env.get('CANVA_API_KEY')

    if (!canvaApiKey) {
      throw new Error('Canva API key not configured')
    }

    // Template configurations based on type
    const templateConfigs = {
      'logo': {
        templateId: 'BAEKKfLhGi4', // Example Canva template ID
        width: 500,
        height: 500,
        elements: ['logo_text', 'tagline', 'icon']
      },
      'social-post': {
        templateId: 'BAEKKfLhGi5',
        width: 1080,
        height: 1080,
        elements: ['main_text', 'background', 'call_to_action']
      },
      'wellness-flyer': {
        templateId: 'BAEKKfLhGi6',
        width: 600,
        height: 800,
        elements: ['title', 'description', 'contact_info', 'date_time']
      },
      'business-card': {
        templateId: 'BAEKKfLhGi7',
        width: 600,
        height: 400,
        elements: ['business_name', 'contact_details', 'logo_space']
      },
      'brand-kit': {
        templateId: 'BAEKKfLhGi8',
        width: 1200,
        height: 800,
        elements: ['logo_variations', 'color_palette', 'typography']
      }
    }

    const config = templateConfigs[templateType as keyof typeof templateConfigs]
    
    if (!config) {
      throw new Error('Invalid template type')
    }

    // Create design using Canva Connect API
    const createDesignResponse = await fetch('https://api.canva.com/rest/v1/designs', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${canvaApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        design_type: templateType === 'logo' ? 'Logo' : 
                    templateType === 'social-post' ? 'InstagramPost' :
                    templateType === 'business-card' ? 'BusinessCard' :
                    templateType === 'wellness-flyer' ? 'Flyer' : 'Presentation',
        width: config.width,
        height: config.height,
      }),
    })

    if (!createDesignResponse.ok) {
      const error = await createDesignResponse.text()
      console.error('Canva API error:', error)
      throw new Error(`Canva API error: ${createDesignResponse.status}`)
    }

    const designResult = await createDesignResponse.json()
    const designId = designResult.design.id

    // Auto-fill the design with provided data
    const autofillData = {
      business_name: designData.businessName,
      tagline: designData.tagline,
      description: designData.description,
      primary_color: designData.primaryColor,
      secondary_color: designData.secondaryColor,
      industry: designData.industry,
      style: designData.style
    }

    // Apply autofill if template supports it
    if (designData.businessName) {
      try {
        await fetch(`https://api.canva.com/rest/v1/designs/${designId}/autofill`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${canvaApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data: autofillData
          }),
        })
      } catch (autofillError) {
        console.warn('Autofill failed, design created without data:', autofillError)
      }
    }

    // Get design URLs
    const editUrl = `https://www.canva.com/design/${designId}/edit`
    const previewUrl = `https://export-download.canva.com/v1/designs/${designId}/preview`
    const downloadUrl = `https://export-download.canva.com/v1/designs/${designId}/png`

    return new Response(
      JSON.stringify({
        success: true,
        designId,
        previewUrl,
        editUrl,
        downloadUrl,
        templateType,
        designData: autofillData
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error creating Canva design:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to create design',
        details: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})