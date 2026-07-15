import { Link } from "react-router-dom";
import { IMAGES } from "@/lib/images";
import SmartImage from "@/components/ui/smart-image";
import { Button } from "@/components/ui/button";
import { Heart, ArrowRight, Sparkles } from "lucide-react";

/**
 * FoundationSection — homepage impact block (Feroza's competitor-inspiration
 * request, modelled on Tripadvisor's foundation/Kiva panel).
 *
 * Frames Omni as a purpose-driven ecosystem and drives traffic to the existing
 * Dr Phil-Afei Foundation page at /csr-impact. 20% of every tour booking goes
 * to the foundation — that's the hook.
 */
const FoundationSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-omni-violet/5 via-background to-omni-green/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 items-center rounded-3xl overflow-hidden border border-border/50 bg-card shadow-xl">
          {/* Image */}
          <div className="relative h-64 lg:h-full min-h-[340px] order-2 lg:order-1">
            <SmartImage
              src={IMAGES.community.empowerment}
              fallback={IMAGES.services.community1}
              category="community"
              alt="Omni Wellness community empowerment programme in Cape Town"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/50 via-transparent to-transparent" />
          </div>

          {/* Copy */}
          <div className="p-8 lg:p-12 order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-5">
              <Sparkles className="h-3.5 w-3.5" />
              Dr Phil-Afei Foundation
            </div>

            <h2 className="font-heading text-3xl md:text-4xl leading-tight mb-4">
              Make Your Journey Matter
            </h2>

            <p className="text-muted-foreground leading-relaxed mb-4">
              Omni isn't only a wellness and travel platform — it's part of a larger,
              purpose-driven ecosystem. Every tour, retreat and experience helps fund
              community programmes through the Dr Phil-Afei Foundation.
            </p>

            <div className="flex items-center gap-3 rounded-2xl bg-muted/50 p-4 mb-6">
              <div className="h-10 w-10 rounded-xl bg-omni-green/10 flex items-center justify-center shrink-0">
                <Heart className="h-5 w-5 text-omni-green" />
              </div>
              <p className="text-sm">
                <span className="font-semibold text-foreground">20% of every tour booking</span>{" "}
                goes directly to community upliftment, education and conservation across Cape Town.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/csr-impact">
                  Explore our impact <ArrowRight className="h-4 w-4 ml-1.5" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/tours">Book a tour that gives back</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FoundationSection;
