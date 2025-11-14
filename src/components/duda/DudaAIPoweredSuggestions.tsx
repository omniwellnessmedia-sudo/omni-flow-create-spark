import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAIContent } from '@/hooks/useAIContent';
import { useDudaSite } from '@/hooks/useDudaSite';
import { DudaSite, AIContentType } from '@/types/duda';
import { Sparkles, Wand2, Loader2, ThumbsUp, Copy, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DudaAIPoweredSuggestionsProps {
  site: DudaSite;
}

const DudaAIPoweredSuggestions = ({ site }: DudaAIPoweredSuggestionsProps) => {
  const { loading, suggestions, generateContent, rateContent, markAsApplied } = useAIContent();
  const { updateContent } = useDudaSite();
  const { toast } = useToast();
  const [contentType, setContentType] = useState<AIContentType>('hero_headline');
  const [appliedSuggestion, setAppliedSuggestion] = useState<string | null>(null);

  const handleGenerate = async () => {
    // Get provider profile for context
    const context = {
      business_name: site.page_title || 'Wellness Practice',
      specialties: [], // TODO: Get from provider profile
      location: 'South Africa',
      target_audience: 'Health-conscious individuals',
    };

    await generateContent(contentType, context);
  };

  const handleApply = async (content: string, suggestionId?: string) => {
    const updateField = contentType === 'hero_headline' ? 'hero_title' :
                       contentType === 'hero_subheadline' ? 'hero_subtitle' :
                       contentType === 'about_section' ? 'about_text' : null;

    if (!updateField) {
      toast({
        title: 'Not Implemented',
        description: 'This content type cannot be applied automatically yet',
        variant: 'destructive',
      });
      return;
    }

    await updateContent(site.duda_site_name, {
      [updateField]: content,
    });

    if (suggestionId) {
      markAsApplied(suggestionId);
    }

    setAppliedSuggestion(content);
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: 'Copied!',
      description: 'Content copied to clipboard',
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            AI Content Generator
          </CardTitle>
          <CardDescription>
            Generate professional website content in seconds using AI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Content Type</label>
            <Select value={contentType} onValueChange={(v) => setContentType(v as AIContentType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hero_headline">Hero Headline</SelectItem>
                <SelectItem value="hero_subheadline">Hero Subheadline</SelectItem>
                <SelectItem value="about_section">About Section</SelectItem>
                <SelectItem value="service_description">Service Description</SelectItem>
                <SelectItem value="meta_description">SEO Meta Description</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Generate Content
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {suggestions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">AI Suggestions</h3>
          {suggestions.map((suggestion, index) => (
            <Card key={index} className="relative">
              <CardContent className="pt-6 space-y-4">
                <div>
                  <p className="font-medium text-lg mb-2">{suggestion.content}</p>
                  <p className="text-sm text-muted-foreground italic">
                    {suggestion.reasoning}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleApply(suggestion.content)}
                    disabled={appliedSuggestion === suggestion.content}
                  >
                    {appliedSuggestion === suggestion.content ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Applied
                      </>
                    ) : (
                      'Use This'
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopy(suggestion.content)}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => rateContent('', 5)} // TODO: Get actual content ID
                  >
                    <ThumbsUp className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DudaAIPoweredSuggestions;
