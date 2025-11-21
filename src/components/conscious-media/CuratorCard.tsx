import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Curator } from "@/data/consciousMediaProducts";
import { useConsciousAffiliate } from "@/hooks/useConsciousAffiliate";

interface CuratorCardProps {
  name: string;
  title: string;
  expertise: string;
  bio: string;
  avatar: string;
  curatorId: Curator;
  onViewPicks: (curator: Curator) => void;
}

export const CuratorCard = ({
  name,
  title,
  expertise,
  bio,
  avatar,
  curatorId,
  onViewPicks,
}: CuratorCardProps) => {
  const { trackProductView } = useConsciousAffiliate();

  const handleViewPicks = async () => {
    await trackProductView(
      `Curator Picks: ${name}`,
      'conscious_media_infrastructure_curator',
      'view_curator_picks'
    );
    onViewPicks(curatorId);
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex flex-col items-center text-center space-y-4">
        <Avatar className="w-24 h-24 border-4 border-primary/20">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
            {name.charAt(0)}
          </AvatarFallback>
        </Avatar>

        <div className="space-y-2">
          <h3 className="text-xl font-bold text-foreground">{name}</h3>
          <p className="text-sm font-medium text-primary">{title}</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{expertise}</p>
        </div>

        <p className="text-sm text-foreground/80 leading-relaxed">{bio}</p>

        <Button
          onClick={handleViewPicks}
          variant="outline"
          className="w-full mt-4"
        >
          See {name}'s Picks
        </Button>
      </div>
    </Card>
  );
};
