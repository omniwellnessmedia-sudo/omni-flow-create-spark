import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Palette, 
  Download, 
  Eye, 
  Sparkles, 
  Image, 
  FileText, 
  Instagram, 
  Facebook,
  Loader2,
  Plus
} from 'lucide-react';

const CanvaDesignStudio = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [designInputs, setDesignInputs] = useState({
    businessName: '',
    tagline: '',
    description: '',
    primaryColor: '#6366f1',
    secondaryColor: '#8b5cf6',
    industry: '',
    style: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDesign, setGeneratedDesign] = useState<{
    id: string;
    url: string;
    editUrl: string;
    downloadUrl: string;
  } | null>(null);
  const { toast } = useToast();

  const templateTypes = [
    { 
      id: 'logo', 
      name: 'Logo Design', 
      icon: Palette,
      description: 'Professional logo with brand elements'
    },
    { 
      id: 'social-post', 
      name: 'Social Media Post', 
      icon: Instagram,
      description: 'Instagram/Facebook ready posts'
    },
    { 
      id: 'wellness-flyer', 
      name: 'Wellness Event Flyer', 
      icon: FileText,
      description: 'Event promotion materials'
    },
    { 
      id: 'business-card', 
      name: 'Business Card', 
      icon: Image,
      description: 'Professional business cards'
    },
    { 
      id: 'brand-kit', 
      name: 'Complete Brand Kit', 
      icon: Sparkles,
      description: 'Logo, colors, and brand assets'
    }
  ];

  const industries = [
    'Yoga Studio',
    'Meditation Center', 
    'Wellness Coaching',
    'Nutrition Consulting',
    'Fitness Training',
    'Spa & Wellness',
    'Mental Health',
    'Holistic Healing',
    'Community Wellness',
    'Other'
  ];

  const designStyles = [
    'Modern & Minimal',
    'Natural & Organic', 
    'Vibrant & Energetic',
    'Calming & Peaceful',
    'Professional & Clean',
    'Artistic & Creative',
    'Earthy & Grounded'
  ];

  const generateDesign = useCallback(async () => {
    if (!selectedTemplate || !designInputs.businessName) {
      toast({
        title: "Missing Information",
        description: "Please select a template and enter your business name.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Create design using Canva API through our edge function
      const response = await fetch('/functions/v1/create-canva-design', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateType: selectedTemplate,
          designData: designInputs
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create design');
      }

      const result = await response.json();
      
      setGeneratedDesign({
        id: result.designId,
        url: result.previewUrl,
        editUrl: result.editUrl,
        downloadUrl: result.downloadUrl
      });

      toast({
        title: "✨ Design Created!",
        description: "Your design is ready. You can preview, edit, or download it.",
      });

    } catch (error) {
      console.error('Design generation error:', error);
      
      // For demo purposes, show a mock result
      setGeneratedDesign({
        id: 'demo-' + Date.now(),
        url: 'https://via.placeholder.com/400x300/6366f1/ffffff?text=Your+Design+Preview',
        editUrl: '#edit-demo',
        downloadUrl: '#download-demo'
      });

      toast({
        title: "🎨 Demo Design Ready!",
        description: "This is a demo. Connect your Canva API to generate real designs.",
      });
    } finally {
      setIsGenerating(false);
    }
  }, [selectedTemplate, designInputs, toast]);

  const openCanvaEditor = () => {
    if (generatedDesign?.editUrl) {
      window.open(generatedDesign.editUrl, '_blank');
    }
  };

  const downloadDesign = () => {
    if (generatedDesign?.downloadUrl) {
      window.open(generatedDesign.downloadUrl, '_blank');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full px-6 py-2">
          <Palette className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-medium text-purple-700">Powered by Canva</span>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          AI Design Studio
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Create professional wellness brand assets in minutes. Our AI generates custom designs 
          that you can edit directly in Canva.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Design Configuration
            </CardTitle>
            <CardDescription>
              Tell us about your brand and we'll create the perfect design
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Template Selection */}
            <div className="space-y-3">
              <Label htmlFor="template">Design Type</Label>
              <div className="grid grid-cols-1 gap-3">
                {templateTypes.map((template) => {
                  const Icon = template.icon;
                  return (
                    <Card
                      key={template.id}
                      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedTemplate === template.id 
                          ? 'ring-2 ring-purple-500 bg-purple-50' 
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedTemplate(template.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5 text-purple-600" />
                          <div>
                            <h3 className="font-medium">{template.name}</h3>
                            <p className="text-sm text-gray-600">{template.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Business Details */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="businessName">Business Name *</Label>
                <Input
                  id="businessName"
                  value={designInputs.businessName}
                  onChange={(e) => setDesignInputs(prev => ({ ...prev, businessName: e.target.value }))}
                  placeholder="Enter your business name"
                />
              </div>

              <div>
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  value={designInputs.tagline}
                  onChange={(e) => setDesignInputs(prev => ({ ...prev, tagline: e.target.value }))}
                  placeholder="Your brand's tagline or motto"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={designInputs.description}
                  onChange={(e) => setDesignInputs(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of your business"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Select onValueChange={(value) => setDesignInputs(prev => ({ ...prev, industry: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((industry) => (
                        <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="style">Design Style</Label>
                  <Select onValueChange={(value) => setDesignInputs(prev => ({ ...prev, style: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent>
                      {designStyles.map((style) => (
                        <SelectItem key={style} value={style}>{style}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={designInputs.primaryColor}
                      onChange={(e) => setDesignInputs(prev => ({ ...prev, primaryColor: e.target.value }))}
                      className="w-16 h-10"
                    />
                    <Input
                      value={designInputs.primaryColor}
                      onChange={(e) => setDesignInputs(prev => ({ ...prev, primaryColor: e.target.value }))}
                      placeholder="#6366f1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={designInputs.secondaryColor}
                      onChange={(e) => setDesignInputs(prev => ({ ...prev, secondaryColor: e.target.value }))}
                      className="w-16 h-10"
                    />
                    <Input
                      value={designInputs.secondaryColor}
                      onChange={(e) => setDesignInputs(prev => ({ ...prev, secondaryColor: e.target.value }))}
                      placeholder="#8b5cf6"
                    />
                  </div>
                </div>
              </div>
            </div>

            <Button 
              onClick={generateDesign}
              disabled={isGenerating || !selectedTemplate || !designInputs.businessName}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Design...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Design
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Preview Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Design Preview
            </CardTitle>
            <CardDescription>
              Your generated design will appear here
            </CardDescription>
          </CardHeader>
          <CardContent>
            {generatedDesign ? (
              <div className="space-y-4">
                <div className="relative">
                  <img 
                    src={generatedDesign.url} 
                    alt="Generated Design"
                    className="w-full h-64 object-cover rounded-lg border"
                  />
                  <Badge 
                    variant="secondary" 
                    className="absolute top-2 right-2 bg-green-100 text-green-700"
                  >
                    Ready
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={openCanvaEditor}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Palette className="w-4 h-4" />
                    Edit in Canva
                  </Button>
                  <Button
                    onClick={downloadDesign}
                    className="flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                </div>
                
                <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                  <strong>What you can do:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Edit colors, fonts, and text in Canva</li>
                    <li>Add your own images and elements</li>
                    <li>Download in multiple formats (PNG, PDF, etc.)</li>
                    <li>Share directly to social media</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-center text-gray-500">
                  <Image className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Your design preview will appear here</p>
                  <p className="text-sm">Configure your design and click generate</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CanvaDesignStudio;