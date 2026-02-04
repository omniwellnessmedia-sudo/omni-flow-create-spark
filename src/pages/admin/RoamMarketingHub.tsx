import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Copy, ExternalLink, QrCode, Calendar, Target, Users, TrendingUp, Megaphone, FileText, Compass } from "lucide-react";
import { toast } from "sonner";
import {
  CAMPAIGN_URLS,
  DISCOUNT_CODES,
  ROAM_QUOTES,
  CONTENT_PILLARS,
  SAMPLE_POSTS,
  AD_CREATIVES,
  MILESTONES,
  TEAM_RESPONSIBILITIES,
  generateUTMUrl,
} from "@/data/roamMarketingAssets";

const RoamMarketingHub = () => {
  const [selectedQuote, setSelectedQuote] = useState(0);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl">
            🧭
          </div>
          <div>
            <h1 className="text-3xl font-bold">ROAM Marketing Hub</h1>
            <p className="text-muted-foreground">Campaign Code: ROAM-FEB26 | Launch: 4 February 2026</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="default">90-Day Campaign</Badge>
          <Badge variant="secondary">Budget: R3,000</Badge>
          <Badge variant="outline">Lead: Chad Cupido</Badge>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="urls" className="max-w-7xl mx-auto">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 mb-6">
          <TabsTrigger value="urls" className="gap-2"><ExternalLink className="h-4 w-4" /> URLs</TabsTrigger>
          <TabsTrigger value="codes" className="gap-2"><QrCode className="h-4 w-4" /> Codes</TabsTrigger>
          <TabsTrigger value="content" className="gap-2"><FileText className="h-4 w-4" /> Content</TabsTrigger>
          <TabsTrigger value="ads" className="gap-2"><Megaphone className="h-4 w-4" /> Ads</TabsTrigger>
          <TabsTrigger value="targets" className="gap-2"><Target className="h-4 w-4" /> Targets</TabsTrigger>
          <TabsTrigger value="team" className="gap-2"><Users className="h-4 w-4" /> Team</TabsTrigger>
        </TabsList>

        {/* URLs Tab */}
        <TabsContent value="urls" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="h-5 w-5" />
                UTM-Tagged Campaign URLs
              </CardTitle>
              <CardDescription>All URLs ready to copy with tracking parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Primary URLs */}
              <div>
                <h3 className="font-semibold mb-3">Primary Store URLs</h3>
                <div className="space-y-2">
                  {Object.entries(CAMPAIGN_URLS.primary).map(([key, url]) => (
                    <div key={key} className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                      <Badge variant="outline">{url.description}</Badge>
                      <code className="flex-1 text-xs overflow-hidden text-ellipsis">
                        {url.organic}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(`https://www.omniwellnessmedia.co.za${url.organic}`, url.description)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Airport URLs */}
              <div>
                <h3 className="font-semibold mb-3">🛬 Airport QR Code URLs</h3>
                <div className="space-y-2">
                  {Object.entries(CAMPAIGN_URLS.airport).map(([key, url]) => (
                    <div key={key} className="flex items-center gap-2 p-2 bg-accent/10 rounded-lg border border-accent/20">
                      <Badge variant="default">{key}</Badge>
                      <code className="flex-1 text-xs overflow-hidden text-ellipsis">
                        {url}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(url, key)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social URLs */}
              <div>
                <h3 className="font-semibold mb-3">📱 Social Media Suffixes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {Object.entries(CAMPAIGN_URLS.social).map(([platform, suffix]) => (
                    <div key={platform} className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                      <Badge variant="secondary" className="capitalize">{platform}</Badge>
                      <code className="flex-1 text-xs">{suffix}</code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(suffix, platform)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* URL Generator */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">🔧 Custom URL Generator</h3>
                <URLGenerator />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Discount Codes Tab */}
        <TabsContent value="codes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                Active Discount Codes
              </CardTitle>
              <CardDescription>Distribution strategy for each code</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(DISCOUNT_CODES).map(([key, code]) => (
                  <Card key={key} className="border-2">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl font-mono">{code.code}</CardTitle>
                        <Badge variant="default">{code.discount}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-2">{code.target}</p>
                      <p className="text-xs mb-3 p-2 bg-muted rounded">{code.usage}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">+{code.wellcoinsBonus} WellCoins</Badge>
                        <Button size="sm" onClick={() => copyToClipboard(code.code, "Code")}>
                          <Copy className="h-4 w-4 mr-1" /> Copy
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-6">
          {/* Roam Quotes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Compass className="h-5 w-5" />
                Roam 🧭 Quotable Moments
              </CardTitle>
              <CardDescription>Shareable quote graphics for social media</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ROAM_QUOTES.map((quote, index) => (
                  <Card 
                    key={quote.id} 
                    className={`cursor-pointer transition-all ${selectedQuote === index ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => setSelectedQuote(index)}
                  >
                    <CardContent className="p-4">
                      <Badge variant="outline" className="mb-2 capitalize">{quote.pillar}</Badge>
                      <blockquote className="text-lg font-medium italic mb-2">
                        "{quote.quote}"
                      </blockquote>
                      <p className="text-sm text-muted-foreground">{quote.attribution}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {quote.hashtags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="mt-2 w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(`${quote.quote}\n\n${quote.attribution}\n\n${quote.hashtags.join(' ')}`, "Quote");
                        }}
                      >
                        <Copy className="h-4 w-4 mr-1" /> Copy Quote
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Content Calendar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Weekly Content Pillars
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
                {Object.entries(CONTENT_PILLARS).map(([day, pillar]) => (
                  <Card key={day} className="text-center p-3">
                    <div className="text-2xl mb-1">{pillar.emoji}</div>
                    <div className="font-semibold capitalize">{day}</div>
                    <div className="text-xs text-muted-foreground capitalize">{pillar.pillar}</div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sample Posts */}
          <Card>
            <CardHeader>
              <CardTitle>Sample Posts (Roam Voice)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs defaultValue="instagram">
                <TabsList>
                  <TabsTrigger value="instagram">Instagram</TabsTrigger>
                  <TabsTrigger value="tiktok">TikTok</TabsTrigger>
                  <TabsTrigger value="facebook">Facebook</TabsTrigger>
                </TabsList>
                <TabsContent value="instagram" className="space-y-4">
                  {Object.entries(SAMPLE_POSTS.instagram).map(([type, content]) => (
                    <div key={type} className="relative">
                      <Badge className="absolute top-2 right-2 capitalize">{type}</Badge>
                      <Textarea value={content} readOnly className="min-h-[200px] text-sm" />
                      <Button
                        size="sm"
                        className="mt-2"
                        onClick={() => copyToClipboard(content, `Instagram ${type}`)}
                      >
                        <Copy className="h-4 w-4 mr-1" /> Copy Post
                      </Button>
                    </div>
                  ))}
                </TabsContent>
                <TabsContent value="tiktok" className="space-y-4">
                  {Object.entries(SAMPLE_POSTS.tiktok).map(([type, content]) => (
                    <div key={type} className="relative">
                      <Badge className="absolute top-2 right-2 capitalize">{type}</Badge>
                      <Textarea value={content} readOnly className="min-h-[150px] text-sm" />
                      <Button
                        size="sm"
                        className="mt-2"
                        onClick={() => copyToClipboard(content, `TikTok ${type}`)}
                      >
                        <Copy className="h-4 w-4 mr-1" /> Copy Post
                      </Button>
                    </div>
                  ))}
                </TabsContent>
                <TabsContent value="facebook" className="space-y-4">
                  {Object.entries(SAMPLE_POSTS.facebook).map(([type, content]) => (
                    <div key={type} className="relative">
                      <Badge className="absolute top-2 right-2 capitalize">{type}</Badge>
                      <Textarea value={content} readOnly className="min-h-[200px] text-sm" />
                      <Button
                        size="sm"
                        className="mt-2"
                        onClick={() => copyToClipboard(content, `Facebook ${type}`)}
                      >
                        <Copy className="h-4 w-4 mr-1" /> Copy Post
                      </Button>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ads Tab */}
        <TabsContent value="ads" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="h-5 w-5" />
                Ad Creative Library
              </CardTitle>
              <CardDescription>Ready-to-use ad copy for Meta and Google</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(AD_CREATIVES).map(([key, ad]) => (
                <Card key={key} className="border-l-4 border-l-primary">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{ad.name}</CardTitle>
                      <Badge variant="outline" className="capitalize">{key}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <span className="text-xs text-muted-foreground">Headline:</span>
                      <p className="font-semibold">{ad.headline}</p>
                    </div>
                    {'primary' in ad && (
                      <div>
                        <span className="text-xs text-muted-foreground">Primary Text:</span>
                        <p>{ad.primary}</p>
                      </div>
                    )}
                    {'carousel' in ad && (
                      <div>
                        <span className="text-xs text-muted-foreground">Carousel:</span>
                        <ul className="list-disc list-inside">
                          {ad.carousel.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                      </div>
                    )}
                    <div className="flex items-center gap-4 pt-2">
                      <Badge>{ad.cta}</Badge>
                      <code className="text-xs text-muted-foreground">{ad.link}</code>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const text = `Headline: ${ad.headline}\n${'primary' in ad ? `Primary: ${ad.primary}\n` : ''}CTA: ${ad.cta}\nLink: ${ad.link}`;
                        copyToClipboard(text, ad.name);
                      }}
                    >
                      <Copy className="h-4 w-4 mr-1" /> Copy All
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Targets Tab */}
        <TabsContent value="targets" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(MILESTONES).map(([month, data]) => (
              <Card key={month}>
                <CardHeader>
                  <CardTitle className="capitalize">{month.replace('month', 'Month ')}</CardTitle>
                  <CardDescription>{data.period}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(data.targets).map(([metric, value]) => (
                      <div key={metric} className="flex items-center justify-between">
                        <span className="text-sm capitalize">{metric.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <Badge variant="secondary">
                          {typeof value === 'number' && value < 1 
                            ? `${(value * 100).toFixed(0)}%` 
                            : value.toLocaleString()}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(TEAM_RESPONSIBILITIES).map(([member, data]) => (
              <Card key={member}>
                <CardHeader>
                  <CardTitle className="capitalize flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {member}
                  </CardTitle>
                  <CardDescription>{data.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {data.weekly.map((task, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="text-primary">•</span>
                        {task}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// URL Generator Component
const URLGenerator = () => {
  const [basePath, setBasePath] = useState("/roam-store");
  const [source, setSource] = useState("facebook");
  const [medium, setMedium] = useState("organic");
  const [campaign, setCampaign] = useState("roam-launch");
  const [code, setCode] = useState("");

  const generatedUrl = generateUTMUrl(basePath, source, medium, campaign, undefined, code || undefined);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <Input
          placeholder="Base path"
          value={basePath}
          onChange={(e) => setBasePath(e.target.value)}
        />
        <Input
          placeholder="Source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
        />
        <Input
          placeholder="Medium"
          value={medium}
          onChange={(e) => setMedium(e.target.value)}
        />
        <Input
          placeholder="Campaign"
          value={campaign}
          onChange={(e) => setCampaign(e.target.value)}
        />
      </div>
      <Input
        placeholder="Discount code (optional)"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
        <code className="flex-1 text-sm break-all">{generatedUrl}</code>
        <Button onClick={() => {
          navigator.clipboard.writeText(generatedUrl);
          toast.success("URL copied!");
        }}>
          <Copy className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default RoamMarketingHub;
