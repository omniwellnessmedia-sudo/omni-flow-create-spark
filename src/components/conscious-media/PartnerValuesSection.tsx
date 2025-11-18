import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Award, Heart, TrendingUp } from "lucide-react";

interface PartnerValue {
  partner_id: string;
  partner_name: string;
  partner_website: string;
  south_african_commitment: string;
  conscious_values: string[];
  values_alignment_score: number;
  logo_url: string | null;
  partner_description: string;
}

export const PartnerValuesSection = () => {
  const [partnerData, setPartnerData] = useState<PartnerValue | null>(null);

  useEffect(() => {
    const fetchPartnerValues = async () => {
      const { data, error } = await supabase
        .from("conscious_partner_values")
        .select("*")
        .eq("partner_id", "camerastuff")
        .single();

      if (error) {
        console.error("Failed to fetch partner values:", error);
        return;
      }

      setPartnerData(data);
    };

    fetchPartnerValues();
  }, []);

  if (!partnerData) {
    return null;
  }

  const valueBlocks = [
    {
      icon: <MapPin className="w-8 h-8 text-primary" />,
      title: "Proudly South African Since 2006",
      description:
        "Founded locally, serving creative communities across South Africa with fast nationwide delivery and local expertise.",
    },
    {
      icon: <Award className="w-8 h-8 text-primary" />,
      title: "Authorized Godox Distributor with Local Warranty",
      description:
        "2-year local warranty. Fast repairs. Professional gear accessible to wellness communities.",
    },
    {
      icon: <Heart className="w-8 h-8 text-primary" />,
      title: "Shared Commitment to Consciousness",
      description:
        "Values-aligned partnerships that prioritize ethics in visual storytelling over extraction.",
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-primary" />,
      title: "Supporting Local Creative Economy",
      description:
        "When you choose CameraStuff, you invest in South African creative infrastructure.",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <Badge variant="secondary" className="text-sm px-4 py-2">
            Values-Aligned Partnership
          </Badge>
          <h2 className="text-4xl md:text-5xl font-heading font-bold tracking-tight">
            Why CameraStuff?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {partnerData.partner_description}
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {valueBlocks.map((block, index) => (
            <Card
              key={index}
              className="p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50"
            >
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  {block.icon}
                </div>
                <h3 className="text-2xl font-semibold text-foreground">{block.title}</h3>
                <p className="text-base leading-relaxed text-muted-foreground">
                  {block.description}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* South African Commitment Highlight */}
        <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <MapPin className="w-6 h-6 text-primary" />
              <h3 className="text-2xl font-semibold text-foreground">
                South African Commitment
              </h3>
            </div>
            <p className="text-base leading-relaxed text-foreground/90">
              {partnerData.south_african_commitment}
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {partnerData.conscious_values.map((value, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {value}
                </Badge>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};
