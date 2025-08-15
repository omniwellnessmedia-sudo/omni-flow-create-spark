// RoamBuddy API Testing Script
// This script tests all RoamBuddy API endpoints to verify functionality

export interface APITestResult {
  endpoint: string;
  status: 'success' | 'error';
  responseTime: number;
  data?: any;
  error?: string;
}

export class RoamBuddyAPITester {
  private baseUrl = 'https://api.worldroambuddy.com:3001/api/v1';
  private edgeFunctionUrl = '/functions/v1/roambuddy-api'; // Supabase edge function URL

  async runComprehensiveTest(): Promise<APITestResult[]> {
    const results: APITestResult[] = [];
    
    console.log('🚀 Starting RoamBuddy API Comprehensive Test...');
    
    // Test 1: Configuration Test
    results.push(await this.testConfiguration());
    
    // Test 2: Authentication Test
    results.push(await this.testAuthentication());
    
    // Test 3: Products Test
    results.push(await this.testGetAllProducts());
    
    // Test 4: Countries Test
    results.push(await this.testGetCountries());
    
    // Test 5: Destinations Test
    results.push(await this.testGetDestinations());
    
    // Test 6: Services for Destination Test
    results.push(await this.testGetServicesForDestination());
    
    // Test 7: Wellness Packages Test
    results.push(await this.testGetWellnessPackages());
    
    // Test 8: Order Creation Test (Mock)
    results.push(await this.testCreateOrder());
    
    return results;
  }

  private async testConfiguration(): Promise<APITestResult> {
    return this.makeAPICall('test', {}, 'Configuration Test');
  }

  private async testAuthentication(): Promise<APITestResult> {
    return this.makeAPICall('authenticate', {}, 'Authentication Test');
  }

  private async testGetAllProducts(): Promise<APITestResult> {
    return this.makeAPICall('getAllProducts', {}, 'Get All Products');
  }

  private async testGetCountries(): Promise<APITestResult> {
    return this.makeAPICall('getCountries', {}, 'Get Countries');
  }

  private async testGetDestinations(): Promise<APITestResult> {
    return this.makeAPICall('getDestinations', {}, 'Get Destinations');
  }

  private async testGetServicesForDestination(): Promise<APITestResult> {
    return this.makeAPICall('getServices', { destination: 'South Africa' }, 'Get Services for South Africa');
  }

  private async testGetWellnessPackages(): Promise<APITestResult> {
    return this.makeAPICall('getWellnessPackages', { 
      destination: 'South Africa', 
      wellness_type: 'all',
      duration: 'all' 
    }, 'Get Wellness Packages');
  }

  private async testCreateOrder(): Promise<APITestResult> {
    const mockOrderData = {
      product_id: 'test-product',
      customer_name: 'Test Customer',
      customer_email: 'test@example.com',
      product_name: 'Test eSIM Package',
      amount: 25,
      currency: 'USD',
      destination: 'South Africa'
    };
    
    return this.makeAPICall('createOrder', mockOrderData, 'Create Mock Order');
  }

  private async makeAPICall(action: string, data: any, testName: string): Promise<APITestResult> {
    const startTime = Date.now();
    
    try {
      console.log(`📡 Testing: ${testName}...`);
      
      // Call our Supabase edge function
      const response = await fetch(`https://dtjmhieeywdvhjxqyxad.supabase.co/functions/v1/roambuddy-api`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, data })
      });

      const responseTime = Date.now() - startTime;
      const result = await response.json();

      if (response.ok && result.success) {
        console.log(`✅ ${testName}: SUCCESS (${responseTime}ms)`);
        return {
          endpoint: action,
          status: 'success',
          responseTime,
          data: result.data
        };
      } else {
        console.log(`❌ ${testName}: FAILED - ${result.error || 'Unknown error'}`);
        return {
          endpoint: action,
          status: 'error',
          responseTime,
          error: result.error || 'Unknown error'
        };
      }
    } catch (error) {
      const responseTime = Date.now() - startTime;
      console.log(`❌ ${testName}: ERROR - ${error.message}`);
      return {
        endpoint: action,
        status: 'error',
        responseTime,
        error: error.message
      };
    }
  }

  formatResults(results: APITestResult[]): string {
    const successCount = results.filter(r => r.status === 'success').length;
    const totalCount = results.length;
    const averageResponseTime = results.reduce((sum, r) => sum + r.responseTime, 0) / totalCount;

    let report = `
# RoamBuddy API Test Results 📊

**Test Summary:**
- ✅ Successful Tests: ${successCount}/${totalCount}
- ⚡ Average Response Time: ${Math.round(averageResponseTime)}ms
- 📅 Test Date: ${new Date().toISOString().split('T')[0]}

## Detailed Results:

`;

    results.forEach((result, index) => {
      const emoji = result.status === 'success' ? '✅' : '❌';
      report += `### ${index + 1}. ${result.endpoint} ${emoji}
- **Status:** ${result.status.toUpperCase()}
- **Response Time:** ${result.responseTime}ms
`;
      
      if (result.error) {
        report += `- **Error:** ${result.error}\n`;
      }
      
      if (result.data && result.status === 'success') {
        if (Array.isArray(result.data)) {
          report += `- **Data:** ${result.data.length} items returned\n`;
        } else if (typeof result.data === 'object') {
          const keys = Object.keys(result.data);
          report += `- **Data:** ${keys.length} properties (${keys.slice(0, 3).join(', ')}${keys.length > 3 ? '...' : ''})\n`;
        } else {
          report += `- **Data:** ${String(result.data).substring(0, 100)}...\n`;
        }
      }
      
      report += '\n';
    });

    return report;
  }
}

// Export for direct use in components
export const testRoamBuddyAPI = async (): Promise<{ results: APITestResult[], report: string }> => {
  const tester = new RoamBuddyAPITester();
  const results = await tester.runComprehensiveTest();
  const report = tester.formatResults(results);
  
  return { results, report };
};