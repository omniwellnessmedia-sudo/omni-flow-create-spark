import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useDudaSite } from '@/hooks/useDudaSite';
import { DudaSite } from '@/types/duda';
import { Save, Loader2 } from 'lucide-react';

interface DudaContentEditorProps {
  site: DudaSite;
  onContentUpdated: () => void;
}

const DudaContentEditor = ({ site, onContentUpdated }: DudaContentEditorProps) => {
  const { loading, updateContent } = useDudaSite();
  const [heroTitle, setHeroTitle] = useState(site.page_title || '');
  const [heroSubtitle, setHeroSubtitle] = useState(site.page_subtitle || '');
  const [aboutText, setAboutText] = useState(site.about_section || '');

  const handleSave = async () => {
    await updateContent(site.duda_site_name, {
      hero_title: heroTitle,
      hero_subtitle: heroSubtitle,
      about_text: aboutText,
    });
    onContentUpdated();
  };

  const hasChanges = 
    heroTitle !== site.page_title ||
    heroSubtitle !== (site.page_subtitle || '') ||
    aboutText !== (site.about_section || '');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
          <CardDescription>
            The main headline and subheadline visitors see first
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hero-title">Hero Headline</Label>
            <Input
              id="hero-title"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              placeholder="Transform Your Wellness Journey"
              maxLength={80}
            />
            <p className="text-xs text-muted-foreground">
              {heroTitle.length}/80 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hero-subtitle">Hero Subheadline</Label>
            <Input
              id="hero-subtitle"
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              placeholder="Expert guidance for mind, body, and spirit"
              maxLength={120}
            />
            <p className="text-xs text-muted-foreground">
              {heroSubtitle.length}/120 characters
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About Section</CardTitle>
          <CardDescription>
            Tell your story and connect with your audience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="about-text">About Your Practice</Label>
            <Textarea
              id="about-text"
              value={aboutText}
              onChange={(e) => setAboutText(e.target.value)}
              placeholder="Share your journey, expertise, and approach to wellness..."
              rows={6}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground">
              {aboutText.length}/500 characters
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={loading || !hasChanges}
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default DudaContentEditor;
