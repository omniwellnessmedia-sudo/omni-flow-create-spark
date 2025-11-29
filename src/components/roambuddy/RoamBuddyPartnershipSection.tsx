import { Card } from "@/components/ui/card";
import { partnershipStory } from "@/data/roamBuddyProducts";

export const RoamBuddyPartnershipSection = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container-width">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              {partnershipStory.headline}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {partnershipStory.description}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {partnershipStory.benefits.map((benefit, index) => (
              <Card key={index} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{benefit.icon}</div>
                  <div className="flex-1 space-y-2">
                    <h3 className="font-bold text-foreground">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-lg">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {partnershipStory.disclaimer}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
