import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const ImpactOpportunities = () => {
  return (
    <Card className="border-0 magic-card overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-gradient-to-br from-omni-green/90 via-omni-green to-emerald-700 text-white p-6 relative overflow-hidden">
          {/* Soft background sparkle */}
          <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" aria-hidden="true" />
          <div className="absolute -bottom-12 -left-6 h-28 w-28 rounded-full bg-white/5 blur-2xl" aria-hidden="true" />

          <div className="relative">
            <div className="h-12 w-12 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center mb-4">
              <Heart className="h-6 w-6" fill="currentColor" />
            </div>

            <h3 className="font-heading text-xl leading-tight mb-1.5">
              Make an Impact with Omni
            </h3>
            <p className="text-sm text-white/85 leading-relaxed mb-5 max-w-[280px]">
              Join community initiatives, beach cleanups, and social impact projects.
            </p>

            <Button asChild size="sm" className="bg-white text-omni-green hover:bg-white/90 font-medium">
              <Link to="/csr-impact">
                See Impact Opportunities
                <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImpactOpportunities;
