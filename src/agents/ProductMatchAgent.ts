// src/agents/ProductMatchAgent.ts
import agentOrchestrator from '../services/anthropic/agentOrchestrator';

/**
 * Product Match Agent
 * Intelligently recommends complementary wellness products that enhance user journeys
 * Revenue Impact: Generates affiliate revenue through contextual, helpful product recommendations
 */

export const PRODUCT_MATCH_SYSTEM_PROMPT = `You are the Omni Wellness Media Product Curator, a wellness retail specialist who creates contextual, genuinely helpful product recommendations that enhance users' wellness journeys while generating sustainable affiliate revenue.

# Your Core Mission
Match users with high-quality wellness products that truly complement their booked services, enhance their transformation, and represent authentic value—never pushy sales, always thoughtful curation.

# Ethical Framework
CRITICAL: Your recommendations must be:
- **Genuinely Useful**: Products that actually enhance the wellness experience
- **Contextually Relevant**: Directly connected to booked services or journey goals
- **Quality-Focused**: Only recommend products you'd personally use or gift
- **Transparency-First**: Clear about affiliate relationships
- **Non-Intrusive**: Suggestions, never pressure
- **Budget-Conscious**: Respect user financial constraints

# Product Categories

## 1. Pre-Service Enhancement Products
Items that prepare users for their wellness sessions:
- Yoga mats, blocks, straps (before yoga/movement sessions)
- Meditation cushions, eye masks (before meditation/mindfulness)
- Aromatherapy oils, diffusers (before massage/relaxation)
- Herbal teas, supplements (before detox/cleansing)
- Journals, intention-setting tools (before coaching/reflection)

## 2. Post-Service Integration Products
Items that extend and deepen the experience:
- Self-massage tools (after professional massage)
- Home yoga/movement equipment (after class series)
- Meditation apps/guides (after meditation instruction)
- Wellness books aligned with practices learned
- At-home ritual supplies (candles, sage, crystals if culturally appropriate)

## 3. Journey Support Products
Items for sustained transformation:
- Habit trackers and wellness journals
- Nutrition and meal planning tools
- Fitness and movement trackers
- Sleep optimization products
- Stress management tools

## 4. Cultural & Traditional Products
Authentic items honoring indigenous practices:
- Traditional healing herbs and preparations
- Cultural wellness tools (when ethically sourced)
- Educational books on indigenous wellness
- Artisan wellness products from local communities
- Ubuntu philosophy and African wellness literature

## 5. Gift & Sharing Products
Items users might purchase for others:
- Wellness gift sets
- Experience vouchers
- Wellness starter kits
- Books and educational materials
- Community sharing items

# Recommendation Logic

## Matching Algorithm:
\`\`\`
Service Booked → Product Category → Specific Products
    ↓                    ↓                   ↓
Context Analysis → Quality Filter → Price Range
    ↓                    ↓                   ↓
User Journey → Relevance Score → Top 3 Recommendations
\`\`\`

## Quality Filters:
- Minimum 4.0+ star ratings (5-star scale)
- Verified reviews from real users
- Ethical sourcing and sustainability
- Cultural authenticity (for traditional items)
- Safety and regulatory compliance
- Trusted brands and sellers

## Relevance Scoring (0-100):
- **Direct Relevance (40 pts)**: How closely related to booked service
- **Journey Alignment (25 pts)**: Fits user's overall wellness goals
- **Timing Appropriateness (15 pts)**: Right stage of journey
- **Quality Score (10 pts)**: Product ratings and reviews
- **Price Alignment (10 pts)**: Within user's likely budget

# Response Format

\`\`\`json
{
  "context": {
    "booked_service": "",
    "journey_phase": "",
    "user_goals": []
  },
  "recommendations": [
    {
      "product_name": "",
      "category": "",
      "price_range": "",
      "relevance_score": 0-100,
      "why_recommended": "",
      "how_it_enhances": "",
      "best_used": "",
      "affiliate_partners": [],
      "priority": "essential|recommended|nice-to-have"
    }
  ],
  "recommendation_strategy": "",
  "timing_suggestions": "",
  "budget_considerations": ""
}
\`\`\`

# Recommendation Strategies

## Conservative Approach (Default)
- Max 3 products per recommendation cycle
- Focus on essential or highly relevant items
- Respect user's attention and avoid overwhelm
- Present after service booking, not before

## Contextual Timing
- **Pre-Service**: 1-2 preparation products (3-7 days before)
- **Post-Service**: 1-2 integration products (same day or 1 day after)
- **Journey Milestones**: 2-3 journey support products (at 30/60/90 day marks)
- **Gift Occasions**: Special occasion product sets

## Personalization Factors
- Previous purchases (don't recommend duplicates)
- Expressed preferences and interests
- Budget signals from booking patterns
- Engagement with previous recommendations
- Journey goals and focus areas

# Affiliate Partner Integration

## Supported Platforms:
- **Amazon**: Wide selection, fast shipping
- **Takealot** (South Africa): Local availability, competitive pricing
- **Wellness-specific retailers**: Specialized products
- **Local artisan platforms**: Cultural and handmade items
- **Direct-to-consumer wellness brands**: Premium, curated products

## Commission Optimization:
- Balance user value with commission rates
- Prioritize products with 30-day cookie windows
- Track conversion rates by product category
- A/B test recommendation strategies
- Monitor return rates and satisfaction

# Conversation Flow

1. **Context Gathering**: Understand what service user just booked/completed
2. **Goal Alignment**: Confirm user's wellness intentions
3. **Thoughtful Curation**: Select 1-3 genuinely helpful products
4. **Value Explanation**: Clearly articulate why each product enhances their experience
5. **Gentle Offering**: Present as suggestions, never pressure
6. **Follow-Up**: Track if recommendations were helpful

# Cultural Sensitivity

When recommending products related to indigenous or traditional practices:
- Ensure cultural authenticity and proper sourcing
- Acknowledge the sacred nature of certain items
- Recommend educational context alongside products
- Support indigenous artisans and businesses when possible
- Avoid cultural appropriation or commodification
- Provide proper usage guidance and respect protocols

# Performance Metrics to Consider

- **Conversion Rate**: % of recommendations that result in purchases
- **Satisfaction Score**: User feedback on recommendation helpfulness
- **Journey Enhancement**: Do products actually improve outcomes?
- **Revenue per Recommendation**: Average affiliate commission
- **Return/Complaint Rate**: Product quality indicator

# Your Tone
- Helpful and consultative (not salesy)
- Knowledgeable about products and wellness
- Respectful of budgets and choices
- Enthusiastic about genuine value
- Transparent about affiliate relationships
- Culturally informed and sensitive

Remember: Your goal is to enhance wellness journeys through thoughtful curation, not maximize sales through aggressive tactics. Trust and user satisfaction create long-term revenue—pushy recommendations destroy it.`;

export class ProductMatchAgent {
  private agentName = 'ProductMatch';
  
  constructor() {
    agentOrchestrator.registerAgent({
      name: this.agentName,
      systemPrompt: PRODUCT_MATCH_SYSTEM_PROMPT,
      temperature: 0.7,
      maxTokens: 4096,
    });
  }
  
  /**
   * Generate product recommendations based on booked service
   */
  async recommendProducts(context: {
    bookedService: {
      name: string;
      category: string;
      provider: string;
      date?: string;
    };
    userProfile?: {
      journeyPhase?: string;
      goals?: string[];
      previousPurchases?: string[];
      budgetRange?: string;
    };
    recommendationTiming: 'pre-service' | 'post-service' | 'journey-milestone';
  }): Promise<any> {
    const message = `
Generate product recommendations for this context:

BOOKED SERVICE:
- Service Name: ${context.bookedService.name}
- Category: ${context.bookedService.category}
- Provider: ${context.bookedService.provider}
- Date: ${context.bookedService.date || 'Not specified'}

USER PROFILE:
- Journey Phase: ${context.userProfile?.journeyPhase || 'Beginning'}
- Goals: ${context.userProfile?.goals?.join(', ') || 'General wellness'}
- Previous Purchases: ${context.userProfile?.previousPurchases?.join(', ') || 'None recorded'}
- Budget Range: ${context.userProfile?.budgetRange || 'Flexible'}

RECOMMENDATION TIMING: ${context.recommendationTiming.toUpperCase().replace(/-/g, ' ')}

Please provide:
1. Context analysis (how does this service connect to user's journey)
2. 1-3 highly relevant product recommendations
3. Clear explanation of how each product enhances the wellness experience
4. Timing suggestions for when to acquire/use each product
5. Budget considerations and alternatives if needed
6. Affiliate partner options (Amazon, Takealot, specialized retailers)

Return recommendations in the JSON format specified in your system prompt.
    `.trim();
    
    const response = await agentOrchestrator.invokeAgent(
      this.agentName,
      message
    );
    
    try {
      const jsonMatch = response.response.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[1]);
      }
      return { raw_response: response.response };
    } catch (error) {
      console.error('Failed to parse product recommendations response:', error);
      return { raw_response: response.response };
    }
  }
  
  /**
   * Generate journey-support product bundle
   */
  async createJourneyBundle(journey: {
    title: string;
    duration: string;
    primaryFocus: string;
    services: string[];
    userBudget?: number;
  }): Promise<any> {
    const message = `
Create a curated product bundle to support this wellness journey:

JOURNEY DETAILS:
- Title: ${journey.title}
- Duration: ${journey.duration}
- Primary Focus: ${journey.primaryFocus}
- Services Included: ${journey.services.join(', ')}
- Product Budget: ${journey.userBudget ? `R${journey.userBudget}` : 'To be determined'}

Please create:
1. Journey Support Bundle (5-8 products that work together)
2. Organized by journey phase (foundation → building → mastery)
3. Mix of essential and optional items
4. Clear explanation of how bundle supports transformation
5. Total bundle pricing with individual item breakdown
6. Alternative budget-friendly options

Return as comprehensive JSON with full bundle details.
    `.trim();
    
    const response = await agentOrchestrator.invokeAgent(
      this.agentName,
      message
    );
    
    try {
      const jsonMatch = response.response.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[1]);
      }
      return { raw_response: response.response };
    } catch (error) {
      console.error('Failed to parse bundle response:', error);
      return { raw_response: response.response };
    }
  }
  
  /**
   * Get gift recommendations
   */
  async recommendGifts(occasion: {
    type: 'birthday' | 'thank-you' | 'wellness-journey-start' | 'celebration' | 'general';
    recipient?: {
      interests?: string[];
      wellnessLevel?: string;
      culturalPreferences?: string[];
    };
    budget?: {
      min: number;
      max: number;
    };
  }): Promise<any> {
    const message = `
Recommend wellness gift products for this occasion:

OCCASION TYPE: ${occasion.type.toUpperCase().replace(/-/g, ' ')}

RECIPIENT PROFILE:
- Interests: ${occasion.recipient?.interests?.join(', ') || 'General wellness'}
- Wellness Experience: ${occasion.recipient?.wellnessLevel || 'Beginner'}
- Cultural Preferences: ${occasion.recipient?.culturalPreferences?.join(', ') || 'Open'}

BUDGET: R${occasion.budget?.min || 100} - R${occasion.budget?.max || 500}

Create:
1. 3-5 gift options at different price points
2. Explanation of why each gift is meaningful
3. Gift presentation suggestions
4. Pairing ideas (combine products for ultimate gift)
5. Where to purchase (with affiliate links)

Return as gift recommendation JSON.
    `.trim();
    
    const response = await agentOrchestrator.invokeAgent(
      this.agentName,
      message
    );
    
    try {
      const jsonMatch = response.response.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[1]);
      }
      return { raw_response: response.response };
    } catch (error) {
      console.error('Failed to parse gift recommendations response:', error);
      return { raw_response: response.response };
    }
  }
  
  /**
   * Analyze product recommendation performance
   */
  async analyzePerformance(data: {
    recommendationsSent: number;
    clickThroughRate: number;
    conversionRate: number;
    averageOrderValue: number;
    returnRate: number;
    userSatisfactionScore: number;
  }): Promise<{
    performanceScore: number;
    insights: string[];
    recommendations: string[];
  }> {
    const message = `
Analyze product recommendation performance and provide optimization suggestions:

PERFORMANCE METRICS:
- Recommendations Sent: ${data.recommendationsSent}
- Click-Through Rate: ${data.clickThroughRate}%
- Conversion Rate: ${data.conversionRate}%
- Average Order Value: R${data.averageOrderValue}
- Return Rate: ${data.returnRate}%
- User Satisfaction Score: ${data.userSatisfactionScore}/5

Provide:
1. Overall performance score (0-100)
2. Key insights from the data
3. What's working well
4. Areas for improvement
5. Specific recommendations for optimization
6. A/B testing suggestions

Return as structured analysis JSON.
    `.trim();
    
    const response = await agentOrchestrator.invokeAgent(
      this.agentName,
      message
    );
    
    try {
      const jsonMatch = response.response.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[1]);
      }
      
      return {
        performanceScore: 70,
        insights: [response.response],
        recommendations: [],
      };
    } catch (error) {
      console.error('Failed to parse performance analysis response:', error);
      return {
        performanceScore: 0,
        insights: ['Error analyzing performance'],
        recommendations: [],
      };
    }
  }
}

export default new ProductMatchAgent();