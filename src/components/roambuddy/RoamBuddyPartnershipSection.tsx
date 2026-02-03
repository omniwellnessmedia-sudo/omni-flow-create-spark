import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { partnershipStory } from "@/data/roamBuddyProducts";

export const RoamBuddyPartnershipSection = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-muted/30 via-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header with ROAM Branding */}
          <div className="text-center space-y-4">
            <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2">
              Powered by RoamBuddy Technology
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              {partnershipStory.headline}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              {partnershipStory.description}
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {partnershipStory.benefits.map((benefit, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-background to-muted/30 group">
                <div className="flex items-start gap-4">
                  <div className="text-4xl group-hover:scale-110 transition-transform duration-300">{benefit.icon}</div>
                  <div className="flex-1 space-y-2">
                    <h3 className="font-bold text-foreground">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Community Impact Disclosure */}
          <div className="bg-gradient-to-r from-primary/5 to-accent/5 border-l-4 border-primary p-6 rounded-r-lg">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💚</span>
              <div>
                <p className="font-medium text-foreground mb-1">Community Impact</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {partnershipStory.disclaimer}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
