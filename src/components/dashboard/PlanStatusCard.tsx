import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, ArrowRight } from "lucide-react";

interface PlanStatusCardProps {
  isPro: boolean;
  // Days remaining in trial / billing period. When null we show "Free plan" copy.
  daysLeft?: number | null;
  totalDays?: number;
}

const PlanStatusCard = ({ isPro, daysLeft = null, totalDays = 30 }: PlanStatusCardProps) => {
  const navigate = useNavigate();

  // Circular progress: progress = days used out of total.
  const used = daysLeft != null ? Math.max(0, totalDays - daysLeft) : 0;
  const pct = daysLeft != null ? Math.min(100, (used / totalDays) * 100) : 0;
  const r = 32;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;

  return (
    <Card className="border-border/50 magic-card overflow-hidden">
      <CardContent className="p-5 bg-gradient-to-br from-primary/5 via-card to-omni-violet/5">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="min-w-0">
            <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] tracking-wide mb-2">
              Your Plan
            </Badge>
            <h3 className="font-heading text-lg leading-tight flex items-center gap-1.5">
              {isPro ? "Provider Pro" : "Free plan"}
              {isPro && <Zap className="h-4 w-4 text-omni-orange" />}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed max-w-[200px]">
              {isPro
                ? "Everything you need to grow your practice."
                : "Upgrade for analytics, CRM, financial tools and AI content."}
            </p>
          </div>

          {/* Circular countdown — only shown when there's a trial / period to count */}
          {daysLeft != null && (
            <div className="relative shrink-0">
              <svg width="80" height="80" viewBox="0 0 80 80" className="-rotate-90">
                <circle
                  cx="40" cy="40" r={r}
                  fill="none"
                  stroke="hsl(var(--muted))"
                  strokeWidth="6"
                />
                <circle
                  cx="40" cy="40" r={r}
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={c}
                  strokeDashoffset={offset}
                  className="transition-[stroke-dashoffset] duration-700 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-heading text-xl leading-none">{daysLeft}</span>
                <span className="text-[9px] text-muted-foreground mt-0.5">Days left</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isPro ? (
            <Button size="sm" variant="outline" className="flex-1" onClick={() => navigate("/upgrade")}>
              View plan details
              <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
            </Button>
          ) : (
            <>
              <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90" onClick={() => navigate("/upgrade")}>
                Upgrade
              </Button>
              <button
                type="button"
                onClick={() => navigate("/upgrade")}
                className="text-xs text-primary hover:underline shrink-0"
              >
                View plan details
              </button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PlanStatusCard;
