import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CuratorProfile } from "@/data/roamBuddyProducts";

interface WellnessCuratorCardProps {
  curator: CuratorProfile & { wellnessSpecialty?: string };
}

export const WellnessCuratorCard = ({ curator }: WellnessCuratorCardProps) => {
  // Get wellness specialty badge based on curator
  const getWellnessSpecialty = () => {
    switch (curator.curatorId) {
      case 'zenith':
        return { icon: '🧘', label: 'Retreat Specialist' };
      case 'chad':
        return { icon: '📸', label: 'Production & Documentation' };
      case 'ferozza':
        return { icon: '🧭', label: 'Multi-Country Explorer' };
      default:
        return { icon: '✨', label: 'Wellness Guide' };
    }
  };

  const specialty = getWellnessSpecialty();

  return (
    <Card className="p-8 hover:shadow-xl transition-all duration-500 group bg-gradient-to-br from-background to-muted/30">
      <div className="flex flex-col items-center text-center space-y-6">
        {/* Enlarged Avatar with Gradient Ring - 160px */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-primary rounded-full opacity-75 group-hover:opacity-100 blur-sm transition-opacity duration-500" />
          <Avatar className="relative w-40 h-40 border-4 border-background shadow-xl group-hover:scale-105 transition-transform duration-500">
            <AvatarImage src={curator.avatar} alt={curator.name} className="object-cover" />
            <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-4xl font-bold">
              {curator.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Curator Info */}
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-foreground">{curator.name}</h3>
          <p className="text-sm font-medium text-primary">{curator.role}</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{curator.expertise}</p>
          
          {/* Wellness Specialty Badge */}
          <Badge 
            variant="secondary" 
            className="bg-gradient-to-r from-primary/10 to-accent/10 text-foreground border-primary/20 px-4 py-1.5"
          >
            <span className="mr-1.5">{specialty.icon}</span>
            {specialty.label}
          </Badge>
        </div>

        {/* Quote */}
        <p className="text-sm text-foreground/80 leading-relaxed italic">"{curator.quote}"</p>

        {/* CTA Button */}
        <Button
          variant="outline"
          className="w-full mt-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300"
          onClick={() => {
            const section = document.getElementById('editor-picks');
            section?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          See {curator.name}'s Picks
        </Button>
      </div>
    </Card>
  );
};
