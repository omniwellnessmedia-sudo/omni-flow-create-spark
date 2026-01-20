import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Download, Mail, X, Gift, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ExitIntentPopupProps {
  title?: string;
  description?: string;
  offerTitle?: string;
  offerDescription?: string;
  ctaLabel?: string;
  downloadUrl?: string;
  collectEmail?: boolean;
  delay?: number; // ms before enabling exit detection
}

const ExitIntentPopup: React.FC<ExitIntentPopupProps> = ({
  title = "Wait! Don't leave empty-handed",
  description = "Get our free programme prospectus and discover how you can transform your career.",
  offerTitle = "Free Programme Prospectus",
  offerDescription = "40+ pages of programme details, outcomes, and alumni stories",
  ctaLabel = "Download Free Guide",
  downloadUrl = "https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/partner-logos**%20(Brand%20Assets)/UWC-Programme-Prospectus.pdf",
  collectEmail = true,
  delay = 5000
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if already shown this session
    if (sessionStorage.getItem('exitIntentShown')) {
      setHasShown(true);
      return;
    }

    let timeoutId: NodeJS.Timeout;
    
    const handleMouseLeave = (e: MouseEvent) => {
      if (hasShown) return;
      
      // Only trigger when mouse moves to top of viewport (likely leaving tab)
      if (e.clientY < 10 && e.movementY < 0) {
        setIsOpen(true);
        setHasShown(true);
        sessionStorage.setItem('exitIntentShown', 'true');
      }
    };

    // Enable after delay
    timeoutId = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [hasShown, delay]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (collectEmail && email) {
      setIsSubmitting(true);
      
      try {
        const { error } = await supabase
          .from('newsletter_subscribers')
          .upsert({
            email,
            source: 'exit_intent_popup',
            interests: ['uwc_programme'],
          }, { onConflict: 'email' });

        if (error) throw error;

        toast({
          title: 'Success!',
          description: 'Check your inbox for the download link.',
        });
      } catch (error) {
        console.error('Error subscribing:', error);
      }
      
      setIsSubmitting(false);
    }

    // Download the file
    if (downloadUrl) {
      window.open(downloadUrl, '_blank');
    }
    
    setIsOpen(false);
  };

  const handleDownloadOnly = () => {
    if (downloadUrl) {
      window.open(downloadUrl, '_blank');
    }
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-primary/10 text-primary border-primary/20">
              <Gift className="w-3 h-3 mr-1" />
              Free Resource
            </Badge>
          </div>
          <DialogTitle className="text-2xl font-bold text-foreground">
            {title}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Offer Card */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                <Download className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">{offerTitle}</h4>
                <p className="text-sm text-muted-foreground">{offerDescription}</p>
              </div>
            </div>
          </div>

          {collectEmail ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 min-h-[44px]"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full min-h-[44px]"
                disabled={isSubmitting}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Sending...' : ctaLabel}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                We'll also send you wellness tips. Unsubscribe anytime.
              </p>
            </form>
          ) : (
            <Button 
              className="w-full min-h-[44px]"
              onClick={handleDownloadOnly}
            >
              <Download className="w-4 h-4 mr-2" />
              {ctaLabel}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExitIntentPopup;
