import FirecrawlApp from '@mendable/firecrawl-js';

interface ErrorResponse {
  success: false;
  error: string;
}

interface CrawlStatusResponse {
  success: true;
  status: string;
  completed: number;
  total: number;
  creditsUsed: number;
  expiresAt: string;
  data: Record<string, unknown>[];
}

type CrawlResponse = CrawlStatusResponse | ErrorResponse;

export class FirecrawlService {
  private static API_KEY_STORAGE_KEY = 'firecrawl_api_key';
  private static firecrawlApp: FirecrawlApp | null = null;
  // Store API key in memory only for current session (more secure than localStorage)
  private static currentApiKey: string | null = null;

  static saveApiKey(apiKey: string): void {
    // Use sessionStorage instead of localStorage - clears when browser closes
    sessionStorage.setItem(this.API_KEY_STORAGE_KEY, apiKey);
    this.currentApiKey = apiKey;
    this.firecrawlApp = new FirecrawlApp({ apiKey });
    console.log('API key saved for this session');
  }

  static getApiKey(): string | null {
    // Prefer in-memory key, fallback to sessionStorage
    if (this.currentApiKey) {
      return this.currentApiKey;
    }
    const storedKey = sessionStorage.getItem(this.API_KEY_STORAGE_KEY);
    if (storedKey) {
      this.currentApiKey = storedKey;
    }
    return storedKey;
  }

  static clearApiKey(): void {
    sessionStorage.removeItem(this.API_KEY_STORAGE_KEY);
    this.currentApiKey = null;
    this.firecrawlApp = null;
    console.log('API key cleared');
  }

  static async testApiKey(apiKey: string): Promise<boolean> {
    try {
      console.log('Testing API key with Firecrawl API');
      this.firecrawlApp = new FirecrawlApp({ apiKey });
      // A simple test crawl to verify the API key
      const testResponse = await this.firecrawlApp.crawlUrl('https://example.com', {
        limit: 1
      });
      return testResponse.success;
    } catch (error) {
      console.error('Error testing API key:', error);
      return false;
    }
  }

  static async crawlWebsite(url: string): Promise<{ success: boolean; error?: string; data?: CrawlStatusResponse }> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      return { success: false, error: 'API key not found' };
    }

    try {
      console.log('Making crawl request to Firecrawl API');
      if (!this.firecrawlApp) {
        this.firecrawlApp = new FirecrawlApp({ apiKey });
      }

      const crawlResponse = await this.firecrawlApp.crawlUrl(url, {
        limit: 100,
        scrapeOptions: {
          formats: ['markdown', 'html'],
        }
      }) as CrawlResponse;

      if (!crawlResponse.success) {
        console.error('Crawl failed:', (crawlResponse as ErrorResponse).error);
        return { 
          success: false, 
          error: (crawlResponse as ErrorResponse).error || 'Failed to crawl website' 
        };
      }

      console.log('Crawl successful:', crawlResponse);
      return { 
        success: true,
        data: crawlResponse 
      };
    } catch (error) {
      console.error('Error during crawl:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to connect to Firecrawl API' 
      };
    }
  }
}