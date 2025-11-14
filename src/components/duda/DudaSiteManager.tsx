import { useEffect, useState } from 'react';
import { useDudaSite } from '@/hooks/useDudaSite';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Globe, Sparkles, BarChart3, Settings, Loader2, ExternalLink, Rocket } from 'lucide-react';
import { DudaSite } from '@/types/duda';
import DudaSitePreview from './DudaSitePreview';
import DudaContentEditor from './DudaContentEditor';
import DudaAIPoweredSuggestions from './DudaAIPoweredSuggestions';
import DudaSiteStats from './DudaSiteStats';
import DudaQuickActions from './DudaQuickActions';

const DudaSiteManager = () => {
  const { loading, getSite } = useDudaSite();
  const [site, setSite] = useState<DudaSite | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadSite = async () => {
    setRefreshing(true);
    const data = await getSite();
    setSite(data);
    setRefreshing(false);
  };

  useEffect(() => {
    loadSite();
  }, []);

  if (loading || refreshing) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!site || !site.duda_site_name) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Globe className="w-16 h-16 text-primary" />
          </div>
          <CardTitle className="text-3xl">Create Your Partner Website</CardTitle>
          <CardDescription className="text-base">
            Get your own Omni Wellness branded website in minutes!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span className="text-sm">AI-Powered Content</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-600" />
              <span className="text-sm">Professional Design</span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-600" />
              <span className="text-sm">Built-in Analytics</span>
            </div>
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-orange-600" />
              <span className="text-sm">Easy to Update</span>
            </div>
          </div>
          <DudaQuickActions site={null} onSiteUpdated={loadSite} />
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'draft':
        return 'bg-yellow-500';
      case 'suspended':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Banner */}
      <Alert className={`border-l-4 ${site.published ? 'border-l-green-500 bg-green-50' : 'border-l-yellow-500 bg-yellow-50'}`}>
        <AlertDescription className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Badge className={getStatusColor(site.site_status)}>
              {site.site_status.toUpperCase()}
            </Badge>
            <span className="font-medium">
              {site.published ? 'Your website is live!' : 'Your website is in draft mode'}
            </span>
            {site.duda_last_published && (
              <span className="text-sm text-muted-foreground">
                Last published: {new Date(site.duda_last_published).toLocaleDateString()}
              </span>
            )}
          </div>
          {site.published && site.duda_site_url && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(site.duda_site_url, '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Live Site
            </Button>
          )}
        </AlertDescription>
      </Alert>

      {/* Quick Actions */}
      <DudaQuickActions site={site} onSiteUpdated={loadSite} />

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="ai-tools">
            <Sparkles className="w-4 h-4 mr-2" />
            AI Tools
          </TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Website Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Site Name:</span>
                  <p className="font-mono">{site.duda_site_name}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Preview URL:</span>
                  <p className="text-sm break-all">{site.duda_site_url}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Created:</span>
                  <p className="text-sm">{new Date(site.duda_created_at || site.created_at).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>

            <DudaSitePreview siteName={site.duda_site_name} previewUrl={site.duda_site_url} />
          </div>
        </TabsContent>

        <TabsContent value="content">
          <DudaContentEditor site={site} onContentUpdated={loadSite} />
        </TabsContent>

        <TabsContent value="ai-tools">
          <DudaAIPoweredSuggestions site={site} />
        </TabsContent>

        <TabsContent value="analytics">
          <DudaSiteStats siteName={site.duda_site_name} />
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Website Settings</CardTitle>
              <CardDescription>Manage your website preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Advanced settings coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DudaSiteManager;
