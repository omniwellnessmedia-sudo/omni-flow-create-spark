import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Download, Mail, Gift, Sparkles } from 'lucide-react';
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
  delay?: number;
}

const ExitIntentPopup: React.FC<ExitIntentPopupProps> = ({
  title = "Wait! Don't leave empty-handed",
  description = "Get our free programme prospectus and discover how you can transform your career.",
  offerTitle = "Free Programme Prospectus",
  offerDescription = "40+ pages of programme details, outcomes, and alumni stories",
  ctaLabel = "Download Free Guide",
  downloadUrl = "https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/partner-logos/UWC-Programme-Prospectus.pdf",
  collectEmail = true,
  delay = 5000
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (sessionStorage.getItem('exitIntentShown')) {
      setHasShown(true);
      return;
    }

    let timeoutId: NodeJS.Timeout;
    
    const handleMouseLeave = (e: MouseEvent) => {
      if (hasShown) return;
      if (e.clientY < 10 && e.movementY < 0) {
        setIsOpen(true);
        setHasShown(true);
        sessionStorage.setItem('exitIntentShown', 'true');
      }
    };

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
        // Use insert-then-update pattern to avoid upsert 401 errors for anonymous users
        const { error: insertError } = await supabase
          .from('newsletter_subscribers')
          .insert({ 
            email, 
            source: 'exit_intent_popup', 
            interests: ['uwc_programme'],
            subscribed_at: new Date().toISOString()
          });

        if (insertError && insertError.code === '23505') {
          // Email already exists, update instead
          await supabase
            .from('newsletter_subscribers')
            .update({ 
              source: 'exit_intent_popup',
              interests: ['uwc_programme'],
              updated_at: new Date().toISOString()
            })
            .eq('email', email);
        } else if (insertError) {
          throw insertError;
        }
        
        toast({ title: 'Success!', description: 'Check your inbox for the download link.' });
      } catch (error) {
        console.error('Error subscribing:', error);
      }
      setIsSubmitting(false);
    }

    if (downloadUrl) window.open(downloadUrl, '_blank');
    setIsOpen(false);
  };

  const handleDownloadOnly = () => {
    if (downloadUrl) window.open(downloadUrl, '_blank');
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
          <DialogTitle className="text-2xl font-bold text-foreground">{title}</DialogTitle>
          <DialogDescription className="text-muted-foreground">{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">{offerTitle}</h4>
                <p className="text-sm text-muted-foreground">{offerDescription}</p>
              </div>
            </div>
          </div>

          {collectEmail ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1"
                />
              </div>
              <Button type="submit" className="w-full min-h-[44px]" disabled={isSubmitting}>
                <Mail className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Sending...' : ctaLabel}
              </Button>
              <button
                type="button"
                onClick={handleDownloadOnly}
                className="w-full text-center text-sm text-muted-foreground hover:text-foreground underline"
              >
                Skip email, just download
              </button>
            </form>
          ) : (
            <Button onClick={handleDownloadOnly} className="w-full min-h-[44px]">
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
