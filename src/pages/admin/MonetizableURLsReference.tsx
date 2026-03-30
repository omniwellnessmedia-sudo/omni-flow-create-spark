import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ExternalLink, 
  Copy, 
  Check, 
  Download, 
  ShoppingBag, 
  Plane, 
  Camera, 
  Briefcase,
  GraduationCap,
  Globe,
  TrendingUp,
  Mail
} from "lucide-react";
import { toast } from "sonner";
import UnifiedNavigation from "@/components/navigation/UnifiedNavigation";
import Footer from "@/components/Footer";

const BASE_URL = "https://www.omniwellnessmedia.co.za";

interface URLEntry {
  path: string;
  title: string;
  description: string;
  category: string;
  revenueType: "affiliate" | "lead" | "direct" | "recruitment";
  productCount?: number;
  commission?: string;
  status: "active" | "coming-soon";
}

const monetizableURLs: URLEntry[] = [
  // Tier 1: Primary Sales Funnels
  {
    path: "/conscious-media-infrastructure",
    title: "Conscious Media Infrastructure",
    description: "CameraStuff curated products for content creators",
    category: "Affiliate Store",
    revenueType: "affiliate",
    productCount: 21,
    commission: "5-10%",
    status: "active"
  },
  {
    path: "/roambuddy-store",
    title: "RoamBuddy eSIM Store",
    description: "Travel eSIM packages for global connectivity",
    category: "Affiliate Store",
    revenueType: "affiliate",
    productCount: 4,
    commission: "8-15%",
    status: "active"
  },
  {
    path: "/twobewellshop",
    title: "2BeWell Wellness Shop",
    description: "Curated wellness products with PayPal checkout",
    category: "Direct Sales",
    revenueType: "direct",
    productCount: 4,
    status: "active"
  },
  {
    path: "/tours",
    title: "Viator Tours & Experiences",
    description: "Cape Town wellness tours and experiences",
    category: "Affiliate Store",
    revenueType: "affiliate",
    productCount: 30,
    commission: "8%",
    status: "active"
  },
  {
    path: "/travel-well-connected-store",
    title: "Travel Well Connected Store",
    description: "Premium eSIM packages for travelers",
    category: "Affiliate Store",
    revenueType: "affiliate",
    productCount: 4,
    commission: "10-15%",
    status: "active"
  },
  {
    path: "/tour-detail/great-mother-cave-tour",
    title: "Great Mother Cave Tour",
    description: "Signature spiritual experience",
    category: "Featured Tour",
    revenueType: "affiliate",
    commission: "8%",
    status: "active"
  },
  {
    path: "/tour-detail/winter-wine-country-wellness",
    title: "Winter Wine Country Wellness",
    description: "Premium wine country wellness retreat",
    category: "Featured Tour",
    revenueType: "affiliate",
    commission: "8%",
    status: "active"
  },
  {
    path: "/programs/uwc-human-animal",
    title: "UWC Human-Animal Programme",
    description: "Student recruitment for 2026 cohort",
    category: "Education",
    revenueType: "recruitment",
    status: "active"
  },
  // Tier 2: Affiliate Marketplaces
  {
    path: "/cj-affiliate-products",
    title: "CJ Affiliate Products",
    description: "Commission Junction product catalog",
    category: "Affiliate Marketplace",
    revenueType: "affiliate",
    productCount: 712,
    commission: "5-15%",
    status: "active"
  },
  {
    path: "/awin-affiliate-products",
    title: "Awin Affiliate Products",
    description: "Awin network products",
    category: "Affiliate Marketplace",
    revenueType: "affiliate",
    productCount: 15,
    commission: "5-12%",
    status: "active"
  },
  {
    path: "/affiliate-marketplace",
    title: "Unified Affiliate Marketplace",
    description: "Combined affiliate product directory",
    category: "Affiliate Marketplace",
    revenueType: "affiliate",
    commission: "Variable",
    status: "active"
  },
  {
    path: "/wellness-deals",
    title: "Wellness Deals",
    description: "Special offers and discounts",
    category: "Affiliate Marketplace",
    revenueType: "affiliate",
    status: "active"
  },
  // Tier 3: Service Pages (Lead Gen)
  {
    path: "/business-consulting",
    title: "Business Consulting",
    description: "Strategic business development services",
    category: "Services",
    revenueType: "lead",
    status: "active"
  },
  {
    path: "/media-production",
    title: "Media Production",
    description: "Video, podcast, and content production",
    category: "Services",
    revenueType: "lead",
    status: "active"
  },
  {
    path: "/web-development",
    title: "Web Development",
    description: "Website and e-commerce solutions",
    category: "Services",
    revenueType: "lead",
    status: "active"
  },
  {
    path: "/social-media-strategy",
    title: "Social Media Strategy",
    description: "Social media management and campaigns",
    category: "Services",
    revenueType: "lead",
    status: "active"
  },
  {
    path: "/conscious-media-partnership",
    title: "Conscious Media Partnership",
    description: "Brand partnership opportunities",
    category: "Services",
    revenueType: "lead",
    status: "active"
  }
];

const affiliateIntegrations = [
  { name: "CameraStuff", products: 21, status: "Active", commission: "5-10%" },
  { name: "Viator", products: 30, status: "Active", commission: "8%" },
  { name: "RoamBuddy", products: 4, status: "Active", commission: "8-15%" },
  { name: "CJ Affiliate", products: 712, status: "Active", commission: "5-15%" },
  { name: "Awin", products: 15, status: "Active", commission: "5-12%" },
  { name: "PayPal (2BeWell)", products: 4, status: "Active", commission: "Direct" }
];

export default function MonetizableURLsReference() {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const copyToClipboard = async (url: string) => {
    await navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    toast.success("URL copied to clipboard!");
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const downloadAsCSV = () => {
    const headers = ["URL", "Title", "Category", "Revenue Type", "Products", "Commission", "Status"];
    const rows = monetizableURLs.map(url => [
      `${BASE_URL}${url.path}`,
      url.title,
      url.category,
      url.revenueType,
      url.productCount || "-",
      url.commission || "-",
      url.status
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = "omni-wellness-monetizable-urls.csv";
    a.click();
    toast.success("CSV downloaded!");
  };

  const getRevenueIcon = (type: string) => {
    switch (type) {
      case "affiliate": return <TrendingUp className="h-4 w-4" />;
      case "lead": return <Mail className="h-4 w-4" />;
      case "direct": return <ShoppingBag className="h-4 w-4" />;
      case "recruitment": return <GraduationCap className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    if (category.includes("Store") || category.includes("Marketplace")) return <ShoppingBag className="h-5 w-5" />;
    if (category.includes("Tour")) return <Plane className="h-5 w-5" />;
    if (category.includes("Services")) return <Briefcase className="h-5 w-5" />;
    if (category.includes("Education")) return <GraduationCap className="h-5 w-5" />;
    return <Camera className="h-5 w-5" />;
  };

  const tier1URLs = monetizableURLs.filter(u => 
    ["Affiliate Store", "Direct Sales", "Featured Tour", "Education"].includes(u.category)
  );
  const tier2URLs = monetizableURLs.filter(u => u.category === "Affiliate Marketplace");
  const tier3URLs = monetizableURLs.filter(u => u.category === "Services");

  return (
    <div className="min-h-screen bg-background">
      <UnifiedNavigation />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              Omni Wellness Media
              <span className="block text-2xl text-muted-foreground mt-2">Monetizable URLs Reference</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              Complete inventory of all active revenue-generating pages and affiliate integrations.
            </p>
            <div className="flex justify-center gap-4">
              <Button onClick={downloadAsCSV} className="gap-2">
                <Download className="h-4 w-4" />
                Download CSV
              </Button>
              <Button variant="outline" asChild>
                <a href={BASE_URL} target="_blank" rel="noopener noreferrer" className="gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Visit Live Site
                </a>
              </Button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <Card className="text-center">
              <CardContent className="pt-6">
                <p className="text-4xl font-bold text-primary">{monetizableURLs.length}</p>
                <p className="text-sm text-muted-foreground">Total URLs</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <p className="text-4xl font-bold text-green-500">786+</p>
                <p className="text-sm text-muted-foreground">Products</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <p className="text-4xl font-bold text-blue-500">6</p>
                <p className="text-sm text-muted-foreground">Affiliate Networks</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <p className="text-4xl font-bold text-amber-500">5</p>
                <p className="text-sm text-muted-foreground">Service Pages</p>
              </CardContent>
            </Card>
          </div>

          {/* Affiliate Integrations */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Active Affiliate Integrations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {affiliateIntegrations.map((integration) => (
                  <div key={integration.name} className="border rounded-lg p-4 text-center">
                    <p className="font-semibold">{integration.name}</p>
                    <p className="text-2xl font-bold text-primary">{integration.products}</p>
                    <p className="text-xs text-muted-foreground">products</p>
                    <Badge variant="outline" className="mt-2">{integration.commission}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* URL Tiers */}
          <Tabs defaultValue="tier1" className="space-y-6">
            <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
              <TabsTrigger value="tier1">Primary ({tier1URLs.length})</TabsTrigger>
              <TabsTrigger value="tier2">Marketplaces ({tier2URLs.length})</TabsTrigger>
              <TabsTrigger value="tier3">Services ({tier3URLs.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="tier1">
              <div className="grid gap-4">
                {tier1URLs.map((url) => (
                  <Card key={url.path} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            {getCategoryIcon(url.category)}
                          </div>
                          <div>
                            <h3 className="font-semibold">{url.title}</h3>
                            <p className="text-sm text-muted-foreground">{url.description}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">{url.category}</Badge>
                              {url.productCount && (
                                <Badge variant="secondary" className="text-xs">{url.productCount} products</Badge>
                              )}
                              {url.commission && (
                                <Badge className="text-xs bg-green-500">{url.commission}</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyToClipboard(`${BASE_URL}${url.path}`)}
                          >
                            {copiedUrl === `${BASE_URL}${url.path}` ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                          <Button variant="ghost" size="icon" asChild>
                            <a href={`${BASE_URL}${url.path}`} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="tier2">
              <div className="grid gap-4">
                {tier2URLs.map((url) => (
                  <Card key={url.path} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            {getCategoryIcon(url.category)}
                          </div>
                          <div>
                            <h3 className="font-semibold">{url.title}</h3>
                            <p className="text-sm text-muted-foreground">{url.description}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">{url.category}</Badge>
                              {url.productCount && (
                                <Badge variant="secondary" className="text-xs">{url.productCount} products</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyToClipboard(`${BASE_URL}${url.path}`)}
                          >
                            {copiedUrl === `${BASE_URL}${url.path}` ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                          <Button variant="ghost" size="icon" asChild>
                            <a href={`${BASE_URL}${url.path}`} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="tier3">
              <div className="grid gap-4">
                {tier3URLs.map((url) => (
                  <Card key={url.path} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-amber-500/10 rounded-lg">
                            {getCategoryIcon(url.category)}
                          </div>
                          <div>
                            <h3 className="font-semibold">{url.title}</h3>
                            <p className="text-sm text-muted-foreground">{url.description}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                Lead Generation
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyToClipboard(`${BASE_URL}${url.path}`)}
                          >
                            {copiedUrl === `${BASE_URL}${url.path}` ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                          <Button variant="ghost" size="icon" asChild>
                            <a href={`${BASE_URL}${url.path}`} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Admin Links */}
          <Card className="mt-12">
            <CardHeader>
              <CardTitle>Admin Dashboards</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { path: "/admin", title: "Main Admin" },
                  { path: "/admin/social-scheduler", title: "Social Scheduler" },
                  { path: "/admin/newsletter", title: "Newsletter Editor" },
                  { path: "/admin/affiliate-performance", title: "Affiliate Performance" },
                  { path: "/admin/product-management", title: "Product Management" },
                  { path: "/admin/viator-tours", title: "Viator Tours" }
                ].map((link) => (
                  <Button key={link.path} variant="outline" asChild className="justify-start">
                    <a href={`${BASE_URL}${link.path}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      {link.title}
                    </a>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Email Notification Info */}
          <Card className="mt-8 border-green-500/50 bg-green-500/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/20 rounded-full">
                  <Mail className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-700 dark:text-green-400">Email Notifications Active</h3>
                  <p className="text-sm text-muted-foreground">
                    All service quotes and contact form submissions are sent to <strong>admin@omniwellnessmedia.co.za</strong>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
