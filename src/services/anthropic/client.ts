// src/services/anthropic/client.ts
import Anthropic from '@anthropic-ai/sdk';

/**
 * Anthropic Client Configuration
 * Provides singleton instance of Anthropic SDK client
 */
class AnthropicClientService {
  private static instance: Anthropic | null = null;
  
  /**
   * Get singleton instance of Anthropic client
   */
  static getClient(): Anthropic {
    if (!this.instance) {
      // Debug logging
      console.log('🔍 Checking for API key...');
      console.log('ANTHROPIC_API_KEY exists:', !!process.env.ANTHROPIC_API_KEY);
      console.log('VITE_ANTHROPIC_API_KEY exists:', !!process.env.VITE_ANTHROPIC_API_KEY);
      
      const apiKey = process.env.ANTHROPIC_API_KEY || process.env.VITE_ANTHROPIC_API_KEY;
      
      if (!apiKey) {
        console.error('❌ No API key found in environment variables');
        console.error('Available env vars:', Object.keys(process.env).filter(k => k.includes('ANTHROPIC')));
        throw new Error(
          'ANTHROPIC_API_KEY not found in environment variables. ' +
          'Please add it to your .env file.'
        );
      }
      
      console.log('✅ API key found, initializing Anthropic client...');
      
      this.instance = new Anthropic({
        apiKey: apiKey,
      });
    }
    
    return this.instance;
  }
  
  /**
   * Reset client instance (useful for testing or key rotation)
   */
  static resetClient(): void {
    this.instance = null;
  }
}

export default AnthropicClientService;

/**
 * Convenience export for direct client access
 */
export const getAnthropicClient = () => AnthropicClientService.getClient();