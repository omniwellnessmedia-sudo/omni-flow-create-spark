// src/api/routes/agent-endpoints.ts
import express, { Request, Response } from 'express';
import providerOnboardingAgent from '../../agents/ProviderOnboardingAgent';
import wellnessJourneyAgent from '../../agents/WellnessJourneyAgent';
import currencyHarmonizerAgent from '../../agents/CurrencyHarmonizerAgent';
import productMatchAgent from '../../agents/ProductMatchAgent';

const router = express.Router();

/**
 * PROVIDER ONBOARDING ENDPOINTS
 */

// POST /api/agents/provider-onboarding
router.post('/provider-onboarding', async (req: Request, res: Response) => {
  try {
    const { businessName, email, phone, businessType, location, servicesDescription, additionalInfo } = req.body;
    
    if (!businessName || !email) {
      return res.status(400).json({ 
        error: 'Missing required fields: businessName and email are required' 
      });
    }
    
    const result = await providerOnboardingAgent.onboardProvider({
      businessName,
      email,
      phone,
      businessType,
      location,
      servicesDescription,
      additionalInfo,
    });
    
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Provider onboarding error:', error);
    res.status(500).json({ 
      error: 'Failed to process provider onboarding',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// POST /api/agents/provider-services
router.post('/provider-services', async (req: Request, res: Response) => {
  try {
    const { providerName, existingServices, targetAudience } = req.body;
    
    if (!providerName || !existingServices) {
      return res.status(400).json({ 
        error: 'Missing required fields: providerName and existingServices are required' 
      });
    }
    
    const result = await providerOnboardingAgent.generateServiceListings(
      providerName,
      existingServices,
      targetAudience
    );
    
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Service generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate service listings',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// POST /api/agents/optimize-profile
router.post('/optimize-profile', async (req: Request, res: Response) => {
  try {
    const { currentProfile } = req.body;
    
    if (!currentProfile) {
      return res.status(400).json({ 
        error: 'Missing required field: currentProfile' 
      });
    }
    
    const result = await providerOnboardingAgent.optimizeProfile(currentProfile);
    
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Profile optimization error:', error);
    res.status(500).json({ 
      error: 'Failed to optimize profile',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * WELLNESS JOURNEY ENDPOINTS
 */

// POST /api/agents/design-journey
router.post('/design-journey', async (req: Request, res: Response) => {
  try {
    const { userProfile } = req.body;
    
    const result = await wellnessJourneyAgent.designJourney(userProfile || {});
    
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Journey design error:', error);
    res.status(500).json({ 
      error: 'Failed to design wellness journey',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// POST /api/agents/journey-consultation
router.post('/journey-consultation', async (req: Request, res: Response) => {
  try {
    const { message, isInitial } = req.body;
    
    let result;
    if (isInitial) {
      result = await wellnessJourneyAgent.startConsultation(message);
    } else {
      if (!message) {
        return res.status(400).json({ 
          error: 'Message is required for consultation continuation' 
        });
      }
      result = await wellnessJourneyAgent.continueConsultation(message);
    }
    
    res.json({
      success: true,
      response: result,
    });
  } catch (error) {
    console.error('Journey consultation error:', error);
    res.status(500).json({ 
      error: 'Failed to process consultation',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// POST /api/agents/journey-blueprint
router.post('/journey-blueprint', async (req: Request, res: Response) => {
  try {
    const { journeyData } = req.body;
    
    if (!journeyData) {
      return res.status(400).json({ 
        error: 'Missing required field: journeyData' 
      });
    }
    
    const result = await wellnessJourneyAgent.generateJourneyBlueprint(journeyData);
    
    res.json({
      success: true,
      blueprint: result,
    });
  } catch (error) {
    console.error('Blueprint generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate journey blueprint',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * CURRENCY HARMONIZER ENDPOINTS
 */

// POST /api/agents/economic-health
router.post('/economic-health', async (req: Request, res: Response) => {
  try {
    const { metrics } = req.body;
    
    if (!metrics) {
      return res.status(400).json({ 
        error: 'Missing required field: metrics' 
      });
    }
    
    const result = await currencyHarmonizerAgent.analyzeEconomicHealth(metrics);
    
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Economic health analysis error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze economic health',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// POST /api/agents/circulation-campaign
router.post('/circulation-campaign', async (req: Request, res: Response) => {
  try {
    const { objective } = req.body;
    
    if (!objective || !objective.goal) {
      return res.status(400).json({ 
        error: 'Missing required field: objective.goal' 
      });
    }
    
    const result = await currencyHarmonizerAgent.generateCirculationCampaign(objective);
    
    res.json({
      success: true,
      campaign: result,
    });
  } catch (error) {
    console.error('Campaign generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate circulation campaign',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// POST /api/agents/exchange-rate
router.post('/exchange-rate', async (req: Request, res: Response) => {
  try {
    const { factors } = req.body;
    
    if (!factors) {
      return res.status(400).json({ 
        error: 'Missing required field: factors' 
      });
    }
    
    const result = await currencyHarmonizerAgent.calculateExchangeRate(factors);
    
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Exchange rate calculation error:', error);
    res.status(500).json({ 
      error: 'Failed to calculate exchange rate',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// POST /api/agents/detect-imbalances
router.post('/detect-imbalances', async (req: Request, res: Response) => {
  try {
    const { recentData } = req.body;
    
    if (!recentData) {
      return res.status(400).json({ 
        error: 'Missing required field: recentData' 
      });
    }
    
    const result = await currencyHarmonizerAgent.detectImbalances(recentData);
    
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Imbalance detection error:', error);
    res.status(500).json({ 
      error: 'Failed to detect imbalances',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * PRODUCT MATCH ENDPOINTS
 */

// POST /api/agents/recommend-products
router.post('/recommend-products', async (req: Request, res: Response) => {
  try {
    const { context } = req.body;
    
    if (!context || !context.bookedService) {
      return res.status(400).json({ 
        error: 'Missing required field: context.bookedService' 
      });
    }
    
    const result = await productMatchAgent.recommendProducts(context);
    
    res.json({
      success: true,
      recommendations: result,
    });
  } catch (error) {
    console.error('Product recommendation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate product recommendations',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// POST /api/agents/journey-bundle
router.post('/journey-bundle', async (req: Request, res: Response) => {
  try {
    const { journey } = req.body;
    
    if (!journey) {
      return res.status(400).json({ 
        error: 'Missing required field: journey' 
      });
    }
    
    const result = await productMatchAgent.createJourneyBundle(journey);
    
    res.json({
      success: true,
      bundle: result,
    });
  } catch (error) {
    console.error('Bundle creation error:', error);
    res.status(500).json({ 
      error: 'Failed to create journey bundle',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// POST /api/agents/gift-recommendations
router.post('/gift-recommendations', async (req: Request, res: Response) => {
  try {
    const { occasion } = req.body;
    
    if (!occasion || !occasion.type) {
      return res.status(400).json({ 
        error: 'Missing required field: occasion.type' 
      });
    }
    
    const result = await productMatchAgent.recommendGifts(occasion);
    
    res.json({
      success: true,
      gifts: result,
    });
  } catch (error) {
    console.error('Gift recommendation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate gift recommendations',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// POST /api/agents/product-performance
router.post('/product-performance', async (req: Request, res: Response) => {
  try {
    const { data } = req.body;
    
    if (!data) {
      return res.status(400).json({ 
        error: 'Missing required field: data' 
      });
    }
    
    const result = await productMatchAgent.analyzePerformance(data);
    
    res.json({
      success: true,
      analysis: result,
    });
  } catch (error) {
    console.error('Performance analysis error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze product performance',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * HEALTH CHECK ENDPOINT
 */
router.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    agents: [
      'ProviderOnboarding',
      'WellnessJourney',
      'CurrencyHarmonizer',
      'ProductMatch',
    ],
    timestamp: new Date().toISOString(),
  });
});

export default router;