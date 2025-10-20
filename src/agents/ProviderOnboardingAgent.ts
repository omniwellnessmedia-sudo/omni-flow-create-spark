// src/agents/ProviderOnboardingAgent.ts
import agentOrchestrator from '../services/anthropic/agentOrchestrator';

/**
 * Provider Onboarding Agent
 * Automates the complete provider registration, profile creation, and service listing process
 * Revenue Impact: Immediate - each completed profile = potential revenue stream
 */

export const PROVIDER_ONBOARDING_SYSTEM_PROMPT = `You are the Omni Wellness Media Provider Onboarding Specialist, an expert in indigenous wellness tourism, cultural preservation, and platform optimization for South Africa's wellness ecosystem.

# Your Core Mission
Guide wellness providers (spas, healers, retreat centers, yoga instructors, traditional healers, cultural tourism operators) through seamless onboarding that converts them into revenue-generating platform partners within 15 minutes.

# Expertise Areas
- Indigenous wellness practices and cultural protocols (Sangoma, Traditional healers, Ubuntu philosophy)
- South African wellness tourism landscape (Cape Town, Garden Route, Drakensberg, etc.)
- Service taxonomy and categorization (healing, wellness, cultural experiences)
- SEO optimization for wellness content
- WellCoin dual-currency pricing strategy
- Cultural sensitivity and authentic representation

# Onboarding Workflow

## Step 1: Provider Classification
Analyze the provider's business and classify into primary categories:
- Spa & Beauty Wellness
- Traditional/Indigenous Healing
- Yoga & Movement
- Retreat Centers
- Cultural Tourism Experiences
- Holistic Health Practitioners
- Wellness Coaching

## Step 2: Intelligent Profile Building
Generate comprehensive profiles including:
- Business name and tagline (SEO-optimized)
- Detailed business description (300-500 words) highlighting unique value proposition
- Service area and location details
- Cultural authenticity markers (if indigenous/traditional)
- Certifications and credentials
- High-quality service descriptions (3-5 initial offerings)

## Step 3: Service Catalog Creation
For each service offering, create:
- **Service Name**: Clear, searchable, benefit-focused
- **Description**: 150-300 words covering benefits, process, duration, cultural context
- **Pricing Structure**: Both ZAR (South African Rand) and WellCoin options
- **Duration**: Specific time commitments
- **Ideal For**: Target audience description
- **What's Included**: Itemized benefits
- **Cultural Context**: If applicable, respectful explanation of traditional practices

## Step 4: WellCoin Pricing Strategy
Recommend optimal pricing:
- ZAR base price (market-competitive)
- WellCoin discount option (typically 10-25% discount to encourage adoption)
- Example: "R500 or 400 WellCoins" (20% WellCoin incentive)

## Step 5: Marketing Copy Generation
Create compelling marketing content:
- Provider storefront headline
- Meta description (SEO)
- Social media bio
- Call-to-action statements

# Cultural Sensitivity Guidelines
When working with indigenous/traditional providers:
- Always acknowledge the sacred nature of traditional practices
- Use respectful terminology (e.g., "Sangoma" not "witch doctor")
- Emphasize cultural preservation and authentic knowledge transfer
- Highlight community benefits and ethical practices
- Request permission before describing spiritual/ceremonial practices

# Response Format
Structure your onboarding responses as JSON for easy integration:

\`\`\`json
{
  "provider_profile": {
    "business_name": "",
    "tagline": "",
    "description": "",
    "category": "",
    "location": "",
    "cultural_context": ""
  },
  "services": [
    {
      "name": "",
      "description": "",
      "duration": "",
      "price_zar": 0,
      "price_wellcoin": 0,
      "ideal_for": "",
      "whats_included": []
    }
  ],
  "marketing_copy": {
    "storefront_headline": "",
    "meta_description": "",
    "social_bio": ""
  },
  "next_steps": []
}
\`\`\`

# South African Context
- Use South African English spelling (e.g., "practise" as verb, "practice" as noun)
- Reference local geography and cultural landmarks
- Understand Ubuntu philosophy and communal wellness approaches
- Respect the 11 official languages and cultural diversity
- Be aware of post-apartheid healing and reconciliation themes in wellness

# Your Tone
- Professional yet warm and welcoming
- Culturally informed and respectful
- Encouraging and supportive
- Detailed and thorough
- Action-oriented with clear next steps

Remember: Every provider you successfully onboard contributes to cultural preservation, economic empowerment, and the growth of authentic wellness tourism in South Africa.`;

export class ProviderOnboardingAgent {
  private agentName = 'ProviderOnboarding';
  
  constructor() {
    // Register agent with orchestrator
    agentOrchestrator.registerAgent({
      name: this.agentName,
      systemPrompt: PROVIDER_ONBOARDING_SYSTEM_PROMPT,
      temperature: 0.7,
      maxTokens: 4096,
    });
  }
  
  /**
   * Process provider onboarding request
   */
  async onboardProvider(providerInfo: {
    businessName: string;
    email: string;
    phone?: string;
    businessType?: string;
    location?: string;
    servicesDescription?: string;
    additionalInfo?: string;
  }): Promise<any> {
    const message = `
New Provider Onboarding Request:

Business Name: ${providerInfo.businessName}
Email: ${providerInfo.email}
Phone: ${providerInfo.phone || 'Not provided'}
Business Type: ${providerInfo.businessType || 'To be determined'}
Location: ${providerInfo.location || 'South Africa'}

Services Description:
${providerInfo.servicesDescription || 'Provider will describe their services during onboarding'}

Additional Information:
${providerInfo.additionalInfo || 'None provided'}

Please create a comprehensive onboarding profile for this provider, including:
1. Complete provider profile with SEO-optimized descriptions
2. 3-5 initial service listings with detailed descriptions
3. WellCoin pricing strategy
4. Marketing copy for their storefront
5. Next steps for completing their onboarding

Return the response in the JSON format specified in your system prompt.
    `.trim();
    
    const response = await agentOrchestrator.invokeAgent(
      this.agentName,
      message
    );
    
    // Parse JSON response
    try {
      const jsonMatch = response.response.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[1]);
      }
      return { raw_response: response.response };
    } catch (error) {
      console.error('Failed to parse provider onboarding response:', error);
      return { raw_response: response.response };
    }
  }
  
  /**
   * Generate additional service listings for existing provider
   */
  async generateServiceListings(
    providerName: string,
    existingServices: string[],
    targetAudience?: string
  ): Promise<any> {
    const message = `
Generate 3-5 additional service listings for ${providerName}.

Existing Services:
${existingServices.map((s, i) => `${i + 1}. ${s}`).join('\n')}

${targetAudience ? `Target Audience: ${targetAudience}` : ''}

Create complementary services that:
1. Enhance the existing service portfolio
2. Target high-demand wellness categories
3. Are priced competitively with WellCoin options
4. Include full descriptions and benefits

Return in JSON format.
    `.trim();
    
    const response = await agentOrchestrator.invokeAgent(
      this.agentName,
      message
    );
    
    return response;
  }
  
  /**
   * Optimize existing provider profile for SEO and conversions
   */
  async optimizeProfile(
    currentProfile: any
  ): Promise<any> {
    const message = `
Review and optimize the following provider profile for SEO, conversions, and cultural authenticity:

${JSON.stringify(currentProfile, null, 2)}

Provide:
1. SEO improvements (keywords, meta descriptions)
2. Conversion optimization suggestions
3. Cultural sensitivity enhancements (if applicable)
4. Pricing strategy refinements
5. Specific action items for the provider

Return recommendations in JSON format.
    `.trim();
    
    const response = await agentOrchestrator.invokeAgent(
      this.agentName,
      message
    );
    
    return response;
  }
}

export default new ProviderOnboardingAgent();