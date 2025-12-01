import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CuratorProfile } from "@/data/roamBuddyProducts";

interface WellnessCuratorCardProps {
  curator: CuratorProfile;
}

export const WellnessCuratorCard = ({ curator }: WellnessCuratorCardProps) => {
  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex flex-col items-center text-center space-y-4">
        <Avatar className="w-24 h-24 border-4 border-primary/20">
          <AvatarImage src={curator.avatar} alt={curator.name} />
          <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
            {curator.name.charAt(0)}
          </AvatarFallback>
        </Avatar>

        <div className="space-y-2">
          <h3 className="text-xl font-bold text-foreground">{curator.name}</h3>
          <p className="text-sm font-medium text-primary">{curator.role}</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{curator.expertise}</p>
        </div>

        <p className="text-sm text-foreground/80 leading-relaxed">{curator.quote}</p>

        <Button
          variant="outline"
          className="w-full mt-4"
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
