import { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Coins, PiggyBank, Package, Calendar, Star, Award } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface StatItem {
  label: string;
  value: string | number;
  sub: string;
  icon: LucideIcon;
  color: string;
}

interface StatsGridProps {
  wellCoinBalance: number;
  zarEarnings: number;
  activeServices: number;
  totalServices: number;
  bookingsCount: number;
  avgRating: number | string;
  profileCompletion: number;
}

const StatsGrid = memo(({
  wellCoinBalance,
  zarEarnings,
  activeServices,
  totalServices,
  bookingsCount,
  avgRating,
  profileCompletion,
}: StatsGridProps) => {
  const stats: StatItem[] = [
    { label: "WellCoins", value: wellCoinBalance.toLocaleString(), sub: `≈ R${wellCoinBalance.toLocaleString()}`, icon: Coins, color: "text-primary" },
    { label: "Earnings", value: `R${zarEarnings.toLocaleString()}`, sub: "This month", icon: PiggyBank, color: "text-green-600" },
    { label: "Services", value: activeServices, sub: `${totalServices} total`, icon: Package, color: "text-primary" },
    { label: "Bookings", value: bookingsCount, sub: "All time", icon: Calendar, color: "text-primary" },
    { label: "Rating", value: avgRating || "New", sub: "Average", icon: Star, color: "text-amber-500" },
    { label: "Profile", value: `${profileCompletion}%`, sub: "Complete", icon: Award, color: "text-primary" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-muted-foreground font-medium">{stat.label}</span>
              <stat.icon className={`h-3.5 w-3.5 ${stat.color} opacity-50`} />
            </div>
            <div className={`text-lg md:text-xl font-heading ${stat.color}`}>{stat.value}</div>
            <p className="text-[10px] text-muted-foreground mt-0.5">{stat.sub}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
});

StatsGrid.displayName = "StatsGrid";

export default StatsGrid;
