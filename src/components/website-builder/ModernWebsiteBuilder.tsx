import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  Globe, 
  Palette, 
  Eye, 
  Code, 
  Save, 
  ExternalLink,
  Image as ImageIcon,
  FileText,
  Star,
  Smartphone,
  Monitor,
  Settings,
  Wand2,
  Zap,
  Target,
  TrendingUp,
  Shield,
  Sparkles
} from "lucide-react";

interface WebsiteData {
  id?: string;
  page_title: string;
  page_subtitle: string;
  custom_domain: string;
  hero_image_url: string;
  hero_video_url: string;
  about_section: string;
  services_section_title: string;
  testimonials_section_title: string;
  contact_section_title: string;
  theme_color: string;
  custom_css: string;
  seo_meta_title: string;
  seo_meta_description: string;
  google_analytics_id: string;
  facebook_pixel_id: string;
  published: boolean;
}

const ModernWebsiteBuilder = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [aiOptimizing, setAiOptimizing] = useState(false);
  const previewRef = useRef<HTMLIFrameElement>(null);
  
  const [website, setWebsite] = useState<WebsiteData>({
    page_title: 'Transform Your Wellness Journey',
    page_subtitle: 'Experience authentic healing through our proven wellness methodologies',
    custom_domain: '',
    hero_image_url: '/images/sandy/Sandy_August_shoot_omni-3.png',
    hero_video_url: '',
    about_section: 'As a certified wellness practitioner with over a decade of experience, I specialize in holistic healing approaches that address mind, body, and spirit. My evidence-based methods have helped hundreds of clients achieve lasting transformation and optimal well-being.',
    services_section_title: 'Transformative Wellness Services',
    testimonials_section_title: 'Client Success Stories',
    contact_section_title: 'Begin Your Transformation Today',
    theme_color: '#8b5cf6',
    custom_css: '',
    seo_meta_title: 'Professional Wellness Services | Holistic Healing & Transformation',
    seo_meta_description: 'Experience life-changing wellness services with our certified practitioners. Specializing in holistic healing, mindfulness, and sustainable wellness transformation.',
    google_analytics_id: '',
    facebook_pixel_id: '',
    published: false
  });

  useEffect(() => {
    if (user) {
      fetchWebsiteData();
    }
  }, [user]);

  // Real-time preview update
  useEffect(() => {
    if (previewRef.current) {
      updatePreview();
    }
  }, [website, previewMode]);

  const fetchWebsiteData = async () => {
    try {
      const { data, error } = await supabase
        .from('provider_websites')
        .select('*')
        .eq('provider_id', user!.id)
        .single();

      if (data) {
        setWebsite(data);
      }
    } catch (error) {
      console.error('Error fetching website data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveWebsite = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('provider_websites')
        .upsert({
          ...website,
          provider_id: user.id
        });

      if (error) throw error;

      toast.success('🎉 Website saved successfully!');
      await fetchWebsiteData();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error('Error saving website: ' + errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const publishWebsite = async () => {
    const updatedWebsite = { ...website, published: !website.published };
    setWebsite(updatedWebsite);
    
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('provider_websites')
        .upsert({
          ...updatedWebsite,
          provider_id: user.id
        });

      if (error) throw error;

      toast.success(
        website.published 
          ? '📴 Website unpublished' 
          : '🚀 Website published and live!'
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error('Error publishing website: ' + errorMessage);
    }
  };

  const optimizeWithAI = async () => {
    setAiOptimizing(true);
    
    // Simulate AI optimization
    setTimeout(() => {
      setWebsite(prev => ({
        ...prev,
        page_title: 'Transform Your Life Through Expert Wellness Guidance',
        page_subtitle: 'Join thousands who have discovered their path to optimal health and conscious living',
        seo_meta_title: 'Expert Wellness Coach | Transform Your Health & Life | Book Consultation',
        seo_meta_description: 'Discover personalized wellness strategies from a certified expert. Specializing in holistic health, stress management, and sustainable lifestyle transformation. Book your free consultation today.'
      }));
      
      setAiOptimizing(false);
      toast.success('✨ Content optimized for better conversion and SEO!');
    }, 2000);
  };

  const updatePreview = () => {
    const previewHTML = generatePreviewHTML();
    const blob = new Blob([previewHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    if (previewRef.current) {
      previewRef.current.src = url;
    }
  };

  const generatePreviewHTML = () => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${website.seo_meta_title || website.page_title}</title>
  <meta name="description" content="${website.seo_meta_description}">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            brand: '${website.theme_color}'
          }
        }
      }
    }
  </script>
  <style>
    ${website.custom_css}
    .hero-bg {
      background: linear-gradient(135deg, ${website.theme_color}66, ${website.theme_color}99), 
                  url('${website.hero_image_url}');
      background-size: cover;
      background-position: center;
    }
  </style>
</head>
<body class="font-sans antialiased">
  <!-- Navigation -->
  <nav class="bg-white shadow-sm sticky top-0 z-50">
    <div class="max-w-6xl mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <div class="font-bold text-xl" style="color: ${website.theme_color}">Wellness Pro</div>
        <div class="hidden md:flex space-x-8">
          <a href="#about" class="text-gray-700 hover:text-brand transition-colors">About</a>
          <a href="#services" class="text-gray-700 hover:text-brand transition-colors">Services</a>
          <a href="#contact" class="text-gray-700 hover:text-brand transition-colors">Contact</a>
        </div>
        <button class="btn-brand px-6 py-2 rounded-full text-white font-medium" style="background: ${website.theme_color}">
          Book Now
        </button>
      </div>
    </div>
  </nav>

  <!-- Hero Section -->
  <section class="hero-bg min-h-screen flex items-center text-white relative">
    <div class="absolute inset-0 bg-black bg-opacity-40"></div>
    <div class="relative z-10 max-w-6xl mx-auto px-4 text-center">
      <h1 class="text-4xl md:text-6xl font-bold mb-6 leading-tight">
        ${website.page_title}
      </h1>
      <p class="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
        ${website.page_subtitle}
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button class="bg-white text-gray-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors">
          Start Your Journey
        </button>
        <button class="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-gray-900 transition-colors">
          Learn More
        </button>
      </div>
    </div>
  </section>

  <!-- About Section -->
  <section id="about" class="py-20 bg-gray-50">
    <div class="max-w-6xl mx-auto px-4">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 class="text-3xl md:text-4xl font-bold mb-6" style="color: ${website.theme_color}">
            Your Wellness Journey Starts Here
          </h2>
          <p class="text-gray-700 text-lg leading-relaxed mb-6">
            ${website.about_section}
          </p>
          <div class="flex items-center space-x-4">
            <div class="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl" style="background: ${website.theme_color}">
              10+
            </div>
            <div>
              <p class="font-semibold">Years of Experience</p>
              <p class="text-gray-600">Helping clients transform their lives</p>
            </div>
          </div>
        </div>
        <div class="text-center">
          <img src="${website.hero_image_url}" alt="Wellness Expert" class="w-80 h-80 object-cover rounded-full mx-auto shadow-2xl">
        </div>
      </div>
    </div>
  </section>

  <!-- Services Section -->
  <section id="services" class="py-20">
    <div class="max-w-6xl mx-auto px-4">
      <h2 class="text-3xl md:text-4xl font-bold text-center mb-12" style="color: ${website.theme_color}">
        ${website.services_section_title}
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        ${[1, 2, 3].map(i => `
          <div class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div class="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl mb-6" style="background: ${website.theme_color}">
              ${i}
            </div>
            <h3 class="text-xl font-bold mb-4">Wellness Service ${i}</h3>
            <p class="text-gray-600 mb-6">Transform your well-being with our personalized approach to holistic health and conscious living.</p>
            <button class="w-full py-3 rounded-full font-semibold transition-colors" style="background: ${website.theme_color}; color: white;">
              Learn More
            </button>
          </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- Contact Section -->
  <section id="contact" class="py-20 text-white" style="background: linear-gradient(135deg, ${website.theme_color}, ${website.theme_color}dd)">
    <div class="max-w-4xl mx-auto px-4 text-center">
      <h2 class="text-3xl md:text-4xl font-bold mb-8">
        ${website.contact_section_title}
      </h2>
      <p class="text-xl mb-8 opacity-90">
        Take the first step towards your wellness transformation. Book a consultation today.
      </p>
      <button class="bg-white text-gray-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors">
        Schedule Free Consultation
      </button>
    </div>
  </section>

  <!-- Footer -->
  <footer class="bg-gray-900 text-white py-12">
    <div class="max-w-6xl mx-auto px-4 text-center">
      <p>&copy; 2024 Wellness Professional. All rights reserved.</p>
      <p class="text-gray-400 mt-2">Powered by Omni Wellness Media</p>
    </div>
  </footer>
</body>
</html>
    `;
  };

  const getPreviewDimensions = () => {
    switch (previewMode) {
      case 'mobile':
        return { width: '375px', height: '667px' };
      case 'tablet':
        return { width: '768px', height: '1024px' };
      default:
        return { width: '100%', height: '800px' };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Modern Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="heading-primary text-gradient-hero">
            Website <span className="text-gradient-rainbow">Builder</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Create stunning, conversion-optimized wellness websites with AI-powered insights
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={optimizeWithAI} 
            disabled={aiOptimizing}
            className="bg-gradient-primary text-white border-none hover:opacity-90"
          >
            {aiOptimizing ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            ) : (
              <Wand2 className="w-4 h-4 mr-2" />
            )}
            {aiOptimizing ? 'Optimizing...' : 'AI Optimize'}
          </Button>
          
          <Button variant="outline" onClick={() => window.open(`/provider-website/${website.id}`, '_blank')}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          
          <Button 
            variant={website.published ? "destructive" : "default"}
            onClick={publishWebsite}
          >
            <Globe className="w-4 h-4 mr-2" />
            {website.published ? 'Unpublish' : 'Publish'}
          </Button>
          
          <Button onClick={saveWebsite} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Status Banner with Analytics */}
      <Card className={`border-2 ${website.published ? 'border-green-200 bg-gradient-to-r from-green-50 to-emerald-50' : 'border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50'}`}>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${website.published ? 'bg-green-500 animate-pulse' : 'bg-orange-500'}`}></div>
              <div>
                <h3 className="font-semibold">
                  {website.published ? '🌐 Live Website' : '📝 Draft Mode'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {website.published 
                    ? 'Your website is live and discoverable'
                    : 'Save and publish to go live'
                  }
                </p>
              </div>
            </div>
            
            {website.published && (
              <>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">847</div>
                  <div className="text-sm text-muted-foreground">Page Views</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">23</div>
                  <div className="text-sm text-muted-foreground">Inquiries</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">2.8%</div>
                  <div className="text-sm text-muted-foreground">Conversion</div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Split Layout: Editor + Preview */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Editor Panel */}
        <div className="space-y-6">
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="content" className="text-xs">Content</TabsTrigger>
              <TabsTrigger value="design" className="text-xs">Design</TabsTrigger>
              <TabsTrigger value="seo" className="text-xs">SEO</TabsTrigger>
              <TabsTrigger value="advanced" className="text-xs">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Hero Section
                  </CardTitle>
                  <CardDescription>
                    First impressions matter - create compelling headlines that convert
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="page_title">Main Headline</Label>
                    <Input
                      id="page_title"
                      value={website.page_title}
                      onChange={(e) => setWebsite({...website, page_title: e.target.value})}
                      placeholder="Transform Your Wellness Journey"
                      className="text-lg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="page_subtitle">Supporting Text</Label>
                    <Textarea
                      id="page_subtitle"
                      value={website.page_subtitle}
                      onChange={(e) => setWebsite({...website, page_subtitle: e.target.value})}
                      placeholder="Experience authentic healing through our proven wellness methodologies"
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    About Section
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Label htmlFor="about_section">Your Story</Label>
                  <Textarea
                    id="about_section"
                    value={website.about_section}
                    onChange={(e) => setWebsite({...website, about_section: e.target.value})}
                    placeholder="Share your expertise and approach to wellness..."
                    rows={6}
                    className="mt-2"
                  />
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-700">
                    <Sparkles className="w-5 h-5" />
                    AI-Powered Content Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-semibold mb-2">✨ High-Converting Headlines:</h4>
                      <ul className="space-y-1 text-gray-600">
                        <li>• "Transform [Problem] in [Time Frame]"</li>
                        <li>• "The [Adjective] Guide to [Goal]"</li>
                        <li>• "Discover the Secret to [Benefit]"</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">🎯 Trust Builders:</h4>
                      <ul className="space-y-1 text-gray-600">
                        <li>• Specific years of experience</li>
                        <li>• Client success numbers</li>
                        <li>• Certifications & credentials</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="design" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Visual Identity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Brand Color</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <Input
                        type="color"
                        value={website.theme_color}
                        onChange={(e) => setWebsite({...website, theme_color: e.target.value})}
                        className="w-20 h-12"
                      />
                      <Input
                        value={website.theme_color}
                        onChange={(e) => setWebsite({...website, theme_color: e.target.value})}
                        placeholder="#8b5cf6"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="hero_image">Hero Image URL</Label>
                    <Input
                      id="hero_image"
                      value={website.hero_image_url}
                      onChange={(e) => setWebsite({...website, hero_image_url: e.target.value})}
                      placeholder="https://example.com/hero-image.jpg"
                      className="mt-2"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="seo" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    SEO Optimization
                  </CardTitle>
                  <CardDescription>
                    Optimize for search engines and social media sharing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="meta_title">SEO Title (60 characters max)</Label>
                    <Input
                      id="meta_title"
                      value={website.seo_meta_title}
                      onChange={(e) => setWebsite({...website, seo_meta_title: e.target.value})}
                      placeholder="Professional Wellness Services | Your Name"
                      className="mt-2"
                    />
                    <div className="text-sm text-muted-foreground mt-1">
                      {website.seo_meta_title.length}/60 characters
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="meta_description">Meta Description (160 characters max)</Label>
                    <Textarea
                      id="meta_description"
                      value={website.seo_meta_description}
                      onChange={(e) => setWebsite({...website, seo_meta_description: e.target.value})}
                      placeholder="Discover transformative wellness services with our certified practitioners..."
                      rows={3}
                      className="mt-2"
                    />
                    <div className="text-sm text-muted-foreground mt-1">
                      {website.seo_meta_description.length}/160 characters
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="advanced" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="w-5 h-5" />
                    Custom Styling
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Label htmlFor="custom_css">Custom CSS</Label>
                  <Textarea
                    id="custom_css"
                    value={website.custom_css}
                    onChange={(e) => setWebsite({...website, custom_css: e.target.value})}
                    placeholder="/* Add your custom styles here */
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}"
                    rows={10}
                    className="font-mono text-sm mt-2"
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Live Preview Panel */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Live Preview</h3>
            <div className="flex items-center gap-2">
              <Button
                variant={previewMode === 'desktop' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPreviewMode('desktop')}
              >
                <Monitor className="w-4 h-4" />
              </Button>
              <Button
                variant={previewMode === 'tablet' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPreviewMode('tablet')}
              >
                <Settings className="w-4 h-4" />
              </Button>
              <Button
                variant={previewMode === 'mobile' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPreviewMode('mobile')}
              >
                <Smartphone className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="bg-gray-100 p-4 rounded-lg flex justify-center">
            <iframe
              ref={previewRef}
              style={getPreviewDimensions()}
              className="border rounded-lg shadow-lg bg-white"
              title="Website Preview"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernWebsiteBuilder;