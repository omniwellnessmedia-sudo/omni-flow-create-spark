import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Film, Mail } from "lucide-react";
import { useConsciousAffiliate } from "@/hooks/useConsciousAffiliate";

export const FilmProductionComingSoon = () => {
  const { trackProductView } = useConsciousAffiliate();

  const handleContactClick = async () => {
    await trackProductView(
      'Film Production - Contact for Recommendations',
      'conscious_media_infrastructure_coming_soon',
      'film_production_inquiry'
    );
  };

  return (
    <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20">
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <Film className="w-10 h-10 text-primary" />
        </div>
        
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-foreground">
            Film Production Equipment Coming Soon
          </h3>
          <p className="text-base text-muted-foreground max-w-2xl">
            We're expanding our film production recommendations with professional cinema equipment suggestions from the Omni team. From cinema cameras to lighting rigs, we're curating the best tools for serious filmmakers.
          </p>
        </div>

        <div className="bg-background/50 p-4 rounded-lg border border-primary/20 max-w-xl">
          <p className="text-sm text-foreground mb-4">
            <strong>Need immediate help?</strong> Talk to us about your specific film production project. We can provide custom equipment recommendations tailored to your creative vision and budget.
          </p>
          
          <Button 
            onClick={handleContactClick}
            className="w-full sm:w-auto"
            size="lg"
          >
            <Mail className="mr-2 h-5 w-5" />
            Contact Us for Film Equipment Advice
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          Professional cinema gear recommendations launching soon
        </p>
      </div>
    </Card>
  );
};
