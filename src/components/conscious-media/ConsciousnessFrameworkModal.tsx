import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Users, Shield, Heart, Info } from "lucide-react";
import type { ReactNode } from "react";

interface FrameworkSection {
  icon: ReactNode;
  title: string;
  description: string;
}

export const ConsciousnessFrameworkModal = () => {
  const sections: FrameworkSection[] = [
    {
      icon: <Shield className="w-8 h-8 text-primary" />,
      title: "Consent Model",
      description:
        "Every visual capture requires explicit consent. Whose image appears where? How is it used? Who benefits? These aren't afterthoughts—they're foundational questions that guide all documentation practices.",
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Cultural Sensitivity",
      description:
        "Especially critical for ancestral wisdom and traditional practice documentation. We honor cultural protocols, sacred spaces, and indigenous knowledge systems with the reverence they deserve.",
    },
    {
      icon: <Heart className="w-8 h-8 text-primary" />,
      title: "Community Benefit-Sharing",
      description:
        "Documentation serves community first, commercial second. When transformation is captured, the community that enabled that transformation should benefit—not just external observers or extractors.",
    },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="gap-2">
          <Info className="w-4 h-4" />
          Learn About Our Framework
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-3xl font-heading">
            How We Document Authentically
          </DialogTitle>
          <DialogDescription className="text-base leading-relaxed">
            Our consciousness framework ensures that every image, video, and piece of content
            honors the people, practices, and communities it represents.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 mt-6">
          {sections.map((section, index) => (
            <div
              key={index}
              className="flex gap-6 p-6 rounded-lg border border-border bg-card hover:bg-accent/5 transition-colors"
            >
              <div className="flex-shrink-0">{section.icon}</div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">{section.title}</h3>
                <p className="text-base leading-relaxed text-muted-foreground">
                  {section.description}
                </p>
              </div>
            </div>
          ))}

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 space-y-3">
            <h4 className="text-lg font-semibold text-foreground">
              Equipment as Infrastructure, Not Extraction
            </h4>
            <p className="text-sm leading-relaxed text-foreground/80">
              When we recommend equipment like professional lighting or cameras, we're not
              pushing products—we're enabling authentic storytelling infrastructure. The goal
              is empowerment: retreat facilitators documenting transformation, practitioners
              sharing their craft, communities telling their own stories.
            </p>
            <p className="text-sm leading-relaxed text-foreground/80">
              This is why we partner with values-aligned companies like CameraStuff (South
              African, locally supported, accessible pricing) rather than prioritizing highest
              commissions.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
