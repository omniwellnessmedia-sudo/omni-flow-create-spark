import { useState, useEffect } from "react";
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
  Settings
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

const WebsiteBuilder = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [website, setWebsite] = useState<WebsiteData>({
    page_title: 'Transform Your Life Through Wellness',
    page_subtitle: 'Discover authentic healing and sustainable growth with our expert wellness services',
    custom_domain: '',
    hero_image_url: '/lovable-uploads/wellness-humans.png',
    hero_video_url: '',
    about_section: 'I believe in the power of holistic wellness to transform lives. With years of experience and a deep commitment to authentic healing, I help individuals discover their path to optimal health and conscious living. My approach combines ancient wisdom with modern techniques to create lasting positive change.',
    services_section_title: 'Wellness Services That Transform Lives',
    testimonials_section_title: 'Success Stories from Our Community',
    contact_section_title: 'Start Your Transformation Today',
    theme_color: '#f97316',
    custom_css: '',
    seo_meta_title: 'Premium Wellness Services | Transform Your Life Today',
    seo_meta_description: 'Experience transformative wellness services designed to elevate your mind, body, and spirit. Book your consultation and begin your journey to optimal health.',
    google_analytics_id: '',
    facebook_pixel_id: '',
    published: false
  });

  useEffect(() => {
    if (user) {
      fetchWebsiteData();
    }
  }, [user]);

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

      toast.success('Website saved successfully!');
      await fetchWebsiteData(); // Refresh data
    } catch (error: any) {
      toast.error('Error saving website: ' + error.message);
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

      toast.success(website.published ? 'Website unpublished' : 'Website published!');
    } catch (error: any) {
      toast.error('Error publishing website: ' + error.message);
    }
  };

  const previewWebsite = () => {
    if (website.id) {
      // Open the live website in a new tab
      const baseUrl = window.location.origin;
      const websiteUrl = `${baseUrl}/provider-website/${website.id}`;
      window.open(websiteUrl, '_blank');
    } else {
      toast.info('Please save your website first to preview it');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-omni-orange"></div>
      </div>
    );
  }

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="heading-secondary text-gradient-hero no-faded-text">
              Website <span className="text-gradient-rainbow">Builder</span>
            </h2>
            <p className="text-gray-600">Create your high-converting wellness sales page and lead magnet funnel</p>
          </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={previewWebsite}>
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

      {/* Status Banner */}
      <Card className={`border-2 ${website.published ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'}`}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${website.published ? 'bg-green-500' : 'bg-orange-500'}`}></div>
              <div>
                <h3 className="font-semibold">
                  {website.published ? 'Website is Live!' : 'Website is in Draft'}
                </h3>
                <p className="text-sm text-gray-600">
                  {website.published 
                    ? 'Your website is published and visible to visitors'
                    : 'Your website is saved but not yet published'
                  }
                </p>
              </div>
            </div>
            {website.published && website.id && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  const baseUrl = window.location.origin;
                  const websiteUrl = `${baseUrl}/provider-website/${website.id}`;
                  window.open(websiteUrl, '_blank');
                }}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Live Site
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="design">Design</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="mt-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="page_title">Website Title</Label>
                    <Input
                      id="page_title"
                      value={website.page_title}
                      onChange={(e) => setWebsite({...website, page_title: e.target.value})}
                      placeholder="My Wellness Practice"
                    />
                  </div>
                  <div>
                    <Label htmlFor="page_subtitle">Subtitle</Label>
                    <Input
                      id="page_subtitle"
                      value={website.page_subtitle}
                      onChange={(e) => setWebsite({...website, page_subtitle: e.target.value})}
                      placeholder="Healing through mindful movement"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="about_section">About Section</Label>
                  <Textarea
                    id="about_section"
                    value={website.about_section}
                    onChange={(e) => setWebsite({...website, about_section: e.target.value})}
                    placeholder="Tell your story and share your approach to wellness..."
                    rows={6}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sales Page Framework</CardTitle>
                <CardDescription>High-converting sections optimized for wellness practitioners</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="services_title">Services Section Title</Label>
                  <Input
                    id="services_title"
                    value={website.services_section_title}
                    onChange={(e) => setWebsite({...website, services_section_title: e.target.value})}
                    placeholder="Transform Your Life With These Proven Services"
                  />
                </div>
                <div>
                  <Label htmlFor="testimonials_title">Social Proof Section Title</Label>
                  <Input
                    id="testimonials_title"
                    value={website.testimonials_section_title}
                    onChange={(e) => setWebsite({...website, testimonials_section_title: e.target.value})}
                    placeholder="Real Results From Real People"
                  />
                </div>
                <div>
                  <Label htmlFor="contact_title">Call-to-Action Section Title</Label>
                  <Input
                    id="contact_title"
                    value={website.contact_section_title}
                    onChange={(e) => setWebsite({...website, contact_section_title: e.target.value})}
                    placeholder="Ready to Begin Your Transformation?"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-700">
                  <Star className="w-5 h-5" />
                  Sales Page Best Practices
                </CardTitle>
                <CardDescription>Pre-optimized content templates for maximum conversion</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-purple-700">✨ Proven Headline Formulas</h4>
                    <ul className="text-gray-600 space-y-1">
                      <li>• "Transform [Problem] Into [Desired Result]"</li>
                      <li>• "Discover The [Time] Method For [Benefit]"</li>
                      <li>• "Finally, A [Solution] That Actually Works"</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-purple-700">🎯 Conversion Elements</h4>
                    <ul className="text-gray-600 space-y-1">
                      <li>• Urgency & scarcity triggers</li>
                      <li>• Social proof & testimonials</li>
                      <li>• Clear value propositions</li>
                      <li>• Risk-free guarantees</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-white rounded border border-purple-200">
                  <p className="text-sm text-purple-700 font-medium">🚀 Pro Tip:</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Your landing page is automatically optimized with conversion-tested layouts, mobile responsiveness, and lead capture forms.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="design" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Visual Design
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="theme_color">Theme Color</Label>
                <div className="flex items-center gap-3 mt-2">
                  <Input
                    type="color"
                    id="theme_color"
                    value={website.theme_color}
                    onChange={(e) => setWebsite({...website, theme_color: e.target.value})}
                    className="w-16 h-10"
                  />
                  <Input
                    value={website.theme_color}
                    onChange={(e) => setWebsite({...website, theme_color: e.target.value})}
                    placeholder="#f97316"
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
                />
                {website.hero_image_url && (
                  <div className="mt-2">
                    <img
                      src={website.hero_image_url}
                      alt="Hero preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="hero_video">Hero Video URL (Optional)</Label>
                <Input
                  id="hero_video"
                  value={website.hero_video_url}
                  onChange={(e) => setWebsite({...website, hero_video_url: e.target.value})}
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Media Management
              </CardTitle>
              <CardDescription>
                Upload and manage images, videos, and other media for your website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Media Library</h3>
                <p className="text-gray-600 mb-4">Upload images and videos to use on your website</p>
                <Button>
                  Upload Media
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>SEO & Analytics</CardTitle>
              <CardDescription>Improve your website's search visibility</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="meta_title">Meta Title</Label>
                <Input
                  id="meta_title"
                  value={website.seo_meta_title}
                  onChange={(e) => setWebsite({...website, seo_meta_title: e.target.value})}
                  placeholder="Your Wellness Practice | Yoga & Breathwork"
                />
              </div>
              <div>
                <Label htmlFor="meta_description">Meta Description</Label>
                <Textarea
                  id="meta_description"
                  value={website.seo_meta_description}
                  onChange={(e) => setWebsite({...website, seo_meta_description: e.target.value})}
                  placeholder="Discover transformative wellness practices with our expert-led yoga and breathwork sessions..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="analytics_id">Google Analytics ID</Label>
                <Input
                  id="analytics_id"
                  value={website.google_analytics_id}
                  onChange={(e) => setWebsite({...website, google_analytics_id: e.target.value})}
                  placeholder="GA-XXXXXXXXX-X"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="mt-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Custom Domain
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="custom_domain">Custom Domain</Label>
                  <Input
                    id="custom_domain"
                    value={website.custom_domain}
                    onChange={(e) => setWebsite({...website, custom_domain: e.target.value})}
                    placeholder="www.yourwellness.com"
                  />
                  <p className="text-sm text-gray-600 mt-2">
                    Connect your own domain name (requires DNS configuration)
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Custom CSS
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
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
                    className="font-mono text-sm"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WebsiteBuilder;