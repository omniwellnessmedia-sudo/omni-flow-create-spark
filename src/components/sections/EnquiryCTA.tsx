import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail } from "lucide-react";

interface EnquiryCTAProps {
  headline?: string;
  description?: string;
  variant?: "default" | "dark" | "subtle";
}

const EnquiryCTA = ({
  headline = "Ready to Start Your Journey?",
  description = "Whether you're planning a tour, retreat, or project — our team is here to help you craft the perfect experience.",
  variant = "default",
}: EnquiryCTAProps) => {
  const bgClass = variant === "dark"
    ? "bg-[#1a1a1a] text-white"
    : variant === "subtle"
    ? "bg-muted/50"
    : "bg-gradient-to-br from-green-50 via-background to-blue-50";

  const textClass = variant === "dark" ? "text-white/60" : "text-muted-foreground";
  const btnClass = variant === "dark"
    ? "bg-white text-[#1a1a1a] hover:bg-white/90"
    : "bg-primary hover:bg-primary/90 text-white";

  return (
    <section className={`py-16 ${bgClass}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-heading text-2xl md:text-3xl mb-3">{headline}</h2>
          <p className={`${textClass} mb-8 text-sm md:text-base`}>{description}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className={`rounded-full px-8 ${btnClass}`}>
              <Link to="/contact">
                <Mail className="w-4 h-4 mr-2" />
                Get in Touch
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-8">
              <Link to="/tours-retreats">
                Browse Experiences
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnquiryCTA;
