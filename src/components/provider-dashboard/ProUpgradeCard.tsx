import { Lock, Zap, BarChart2, Users, TrendingUp, CreditCard, Brain, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const FEATURES = [
  { icon: BarChart2, text: "Business analytics & revenue charts" },
  { icon: Users, text: "Client CRM with follow-up reminders" },
  { icon: TrendingUp, text: "Booking intelligence & conversion stats" },
  { icon: CreditCard, text: "Financial suite & CSV export" },
  { icon: Brain, text: "AI Content Studio (descriptions + socials)" },
  { icon: Star, text: "Priority listing on the marketplace" },
];

interface ProUpgradeCardProps {
  featureName?: string;
  compact?: boolean;
}

const ProUpgradeCard = ({ featureName, compact = false }: ProUpgradeCardProps) => {
  const navigate = useNavigate();

  if (compact) {
    return (
      <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-violet-500/5 p-6 text-center">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
          <Lock className="h-5 w-5 text-primary" />
        </div>
        <h3 className="font-heading text-base mb-1">{featureName || "Pro Feature"}</h3>
        <p className="text-xs text-muted-foreground mb-4">Unlock with Provider Pro</p>
        <Button
          size="sm"
          className="bg-gradient-to-r from-primary to-violet-600 hover:opacity-90 text-white border-0"
          onClick={() => navigate("/upgrade")}
        >
          Upgrade — R499/month
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden border border-primary/20 shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-violet-600 p-6 text-white">
        <div className="flex items-center gap-3 mb-5">
          <div className="h-11 w-11 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-heading text-xl leading-tight">Provider Pro</h3>
            <p className="text-white/80 text-sm">Everything you need to grow</p>
          </div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="font-heading text-4xl">R499</span>
          <span className="text-white/70 text-sm">/month</span>
        </div>
        <p className="text-white/70 text-xs mt-1">First 30 days free · Cancel anytime</p>
      </div>

      {/* Features */}
      <div className="p-6 bg-card">
        <p className="text-sm font-medium mb-4 text-muted-foreground">Everything in Free, plus:</p>
        <div className="space-y-3 mb-6">
          {FEATURES.map((f) => (
            <div key={f.text} className="flex items-center gap-3">
              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <f.icon className="h-3 w-3 text-primary" />
              </div>
              <span className="text-sm">{f.text}</span>
            </div>
          ))}
        </div>
        <Button
          className="w-full bg-gradient-to-r from-primary to-violet-600 hover:opacity-90 text-white border-0"
          onClick={() => navigate("/upgrade")}
        >
          Start Free Trial
        </Button>
        <p className="text-xs text-center text-muted-foreground mt-3">
          Billed monthly in ZAR · No lock-in
        </p>
      </div>
    </div>
  );
};

export default ProUpgradeCard;
