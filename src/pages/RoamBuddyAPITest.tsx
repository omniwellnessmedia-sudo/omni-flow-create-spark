import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Clock, Play, Download } from 'lucide-react';
import { testRoamBuddyAPI, APITestResult } from '@/scripts/testRoamBuddyAPI';

const RoamBuddyAPITest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<APITestResult[]>([]);
  const [report, setReport] = useState<string>('');
  const [lastTestTime, setLastTestTime] = useState<Date | null>(null);

  const runTests = async () => {
    setIsLoading(true);
    setResults([]);
    setReport('');
    
    try {
      const { results: testResults, report: testReport } = await testRoamBuddyAPI();
      setResults(testResults);
      setReport(testReport);
      setLastTestTime(new Date());
    } catch (error) {
      console.error('Test execution failed:', error);
      setReport(`# Test Execution Failed ❌\n\nError: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadReport = () => {
    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `roambuddy-api-test-report-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status: 'success' | 'error') => {
    return status === 'success' ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <AlertCircle className="h-4 w-4 text-red-500" />
    );
  };

  const getStatusBadge = (status: 'success' | 'error') => {
    return (
      <Badge variant={status === 'success' ? 'default' : 'destructive'}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const successCount = results.filter(r => r.status === 'success').length;
  const averageResponseTime = results.length > 0 
    ? Math.round(results.reduce((sum, r) => sum + r.responseTime, 0) / results.length)
    : 0;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            RoamBuddy API Testing Dashboard
          </h1>
          <p className="text-xl text-muted-foreground">
            Comprehensive testing suite for Travel Well Connected API integration
          </p>
        </div>

        {/* Test Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Test Controls
            </CardTitle>
            <CardDescription>
              Run comprehensive tests on all RoamBuddy API endpoints
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 items-center">
              <Button 
                onClick={runTests} 
                disabled={isLoading}
                size="lg"
                className="bg-primary hover:bg-primary/90"
              >
                {isLoading ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Running Tests...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Run API Tests
                  </>
                )}
              </Button>
              
              {report && (
                <Button 
                  onClick={downloadReport}
                  variant="outline"
                  size="lg"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
              )}
            </div>
            
            {lastTestTime && (
              <p className="text-sm text-muted-foreground">
                Last test run: {lastTestTime.toLocaleString()}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Test Summary */}
        {results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">{successCount}/{results.length}</p>
                    <p className="text-sm text-muted-foreground">Tests Passed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Clock className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">{averageResponseTime}ms</p>
                    <p className="text-sm text-muted-foreground">Avg Response Time</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Badge variant={successCount === results.length ? 'default' : 'destructive'} className="text-lg p-2">
                    {successCount === results.length ? '✅ HEALTHY' : '⚠️ ISSUES'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Detailed Results */}
        {results.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Detailed Test Results</CardTitle>
              <CardDescription>
                Individual endpoint test results with response times and status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.map((result, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(result.status)}
                      <div>
                        <p className="font-medium">{result.endpoint}</p>
                        {result.error && (
                          <p className="text-sm text-red-500">{result.error}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-muted-foreground">
                        {result.responseTime}ms
                      </span>
                      {getStatusBadge(result.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Raw Report */}
        {report && (
          <Card>
            <CardHeader>
              <CardTitle>Test Report</CardTitle>
              <CardDescription>
                Detailed markdown report for documentation and sharing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto max-h-96 whitespace-pre-wrap">
                {report}
              </pre>
            </CardContent>
          </Card>
        )}

        {/* API Information */}
        <Card>
          <CardHeader>
            <CardTitle>API Information</CardTitle>
            <CardDescription>
              Current configuration and endpoints being tested
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Endpoints Tested:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Configuration Test</li>
                  <li>• Authentication</li>
                  <li>• Product Catalog</li>
                  <li>• Countries & Destinations</li>
                  <li>• Service Discovery</li>
                  <li>• Wellness Packages</li>
                  <li>• Order Creation (Mock)</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Integration Features:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Fallback system active</li>
                  <li>• Wellness enhancements</li>
                  <li>• Error handling</li>
                  <li>• Database integration</li>
                  <li>• Real-time processing</li>
                  <li>• Security validation</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RoamBuddyAPITest;