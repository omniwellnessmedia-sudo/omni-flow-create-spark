import { useState } from 'react';
import { useToast } from "@/hooks/use-toast"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { FirecrawlService } from '@/utils/FirecrawlService';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CrawledPageData {
  url: string;
  title?: string;
  content?: string;
  metadata?: Record<string, unknown>;
  html?: string;
  markdown?: string;
}

interface CrawlResult {
  success: boolean;
  status?: string;
  completed?: number;
  total?: number;
  creditsUsed?: number;
  expiresAt?: string;
  data?: CrawledPageData[];
}

export const CrawlForm = () => {
  const { toast } = useToast();
  const [url, setUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [crawlResult, setCrawlResult] = useState<CrawlResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setProgress(0);
    setCrawlResult(null);
    
    try {
      // Save API key first if provided
      if (apiKey) {
        FirecrawlService.saveApiKey(apiKey);
      }
      
      const savedApiKey = FirecrawlService.getApiKey();
      if (!savedApiKey) {
        toast({
          title: "Error",
          description: "Please provide your Firecrawl API key",
          variant: "destructive",
          duration: 3000,
        });
        return;
      }

      console.log('Starting crawl for URL:', url);
      const result = await FirecrawlService.crawlWebsite(url);
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Website crawled successfully",
          duration: 3000,
        });
        setCrawlResult(result.data);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to crawl website",
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Error crawling website:', error);
      toast({
        title: "Error",
        description: "Failed to crawl website",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
      setProgress(100);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Scrape Wellness Deals Data</CardTitle>
        <p className="text-sm text-gray-600">
          Enter a wellness deals website URL to scrape real data. Get your free Firecrawl API key from{' '}
          <a href="https://firecrawl.dev" target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:underline">
            firecrawl.dev
          </a>
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="apiKey" className="text-sm font-medium text-gray-700">
              Firecrawl API Key
            </label>
            <Input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="fc-..."
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="url" className="text-sm font-medium text-gray-700">
              Website URL to Scrape
            </label>
            <Input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full"
              placeholder="https://hyperli.com or other wellness deals site"
              required
            />
          </div>
          
          {isLoading && (
            <Progress value={progress} className="w-full" />
          )}
          
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
          >
            {isLoading ? "Scraping..." : "Scrape Wellness Deals"}
          </Button>
        </form>

        {crawlResult && (
          <Card className="mt-6">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-2">Scraping Results</h3>
              <div className="space-y-2 text-sm">
                <p>Status: {crawlResult.status}</p>
                <p>Completed Pages: {crawlResult.completed}</p>
                <p>Total Pages: {crawlResult.total}</p>
                <p>Credits Used: {crawlResult.creditsUsed}</p>
                <p>Expires At: {new Date(crawlResult.expiresAt || '').toLocaleString()}</p>
                {crawlResult.data && (
                  <div className="mt-4">
                    <p className="font-semibold mb-2">Scraped Data:</p>
                    <pre className="bg-gray-100 p-2 rounded overflow-auto max-h-60 text-xs">
                      {JSON.stringify(crawlResult.data, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};