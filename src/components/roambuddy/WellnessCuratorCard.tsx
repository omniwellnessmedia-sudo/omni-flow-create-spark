import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CuratorProfile } from "@/data/roamBuddyProducts";

interface WellnessCuratorCardProps {
  curator: CuratorProfile;
}

export const WellnessCuratorCard = ({ curator }: WellnessCuratorCardProps) => {
  return (
    <Card className="group p-8 hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-background via-background to-primary/5 border-2 hover:border-primary/30 relative overflow-hidden">
      {/* Luxury Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative flex flex-col items-center text-center space-y-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
          <Avatar className="relative w-32 h-32 border-4 border-primary/30 shadow-2xl ring-4 ring-background group-hover:scale-105 transition-transform duration-500">
            <AvatarImage src={curator.avatar} alt={curator.name} className="object-cover" />
            <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-3xl font-bold">
              {curator.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-foreground tracking-tight">{curator.name}</h3>
          <p className="text-sm font-semibold text-primary uppercase tracking-widest">{curator.role}</p>
          <div className="inline-block px-4 py-1.5 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full">
            <p className="text-xs text-foreground/70 font-medium uppercase tracking-wider">
              {curator.expertise}
            </p>
          </div>
        </div>

        <blockquote className="text-sm text-foreground/80 italic leading-relaxed border-l-4 border-gradient-to-b from-primary via-accent to-primary/50 pl-6 py-2 max-w-xs">
          "{curator.quote}"
        </blockquote>
      </div>
    </Card>
  );
};
