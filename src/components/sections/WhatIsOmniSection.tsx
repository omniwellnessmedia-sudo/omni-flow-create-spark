import { useState } from "react";
import { Play, Pause, MessageCircle, Sparkles, Heart, Globe, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const thoughtBubbles = [
  { text: "What is Omni?", icon: MessageCircle, delay: "0s" },
  { text: "Conscious Media", icon: Sparkles, delay: "0.5s" },
  { text: "Wellness First", icon: Heart, delay: "1s" },
  { text: "South Africa", icon: Globe, delay: "1.5s" },
  { text: "Community", icon: Users, delay: "2s" },
];

export const WhatIsOmniSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hoveredBubble, setHoveredBubble] = useState<number | null>(null);

  return (
    <section className="relative py-16 md:py-20 overflow-hidden bg-gradient-to-b from-muted/50 via-background to-muted/30">
      {/* Enhanced background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--accent)/0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent,hsl(var(--primary)/0.02),transparent)]" />
      
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header with interactive thought bubbles */}
          <div className="text-center mb-10 relative">
            {/* Floating interactive thought bubbles */}
            <div className="absolute inset-0 pointer-events-auto">
              {thoughtBubbles.map((bubble, index) => (
                <div
                  key={index}
                  onMouseEnter={() => setHoveredBubble(index)}
                  onMouseLeave={() => setHoveredBubble(null)}
                  className={cn(
                    "absolute hidden md:flex items-center gap-2 px-4 py-2.5 rounded-full cursor-pointer",
                    "bg-background/90 backdrop-blur-md border-2 shadow-xl",
                    "animate-float opacity-0 transition-all duration-300",
                    hoveredBubble === index 
                      ? "border-primary scale-110 shadow-primary/30 bg-primary/5" 
                      : "border-border/60 hover:border-primary/50 hover:scale-105",
                    index % 2 === 0 ? "left-0 lg:left-[3%]" : "right-0 lg:right-[3%]"
                  )}
                  style={{
                    top: `${10 + index * 18}%`,
                    animationDelay: bubble.delay,
                    animationFillMode: "forwards",
                  }}
                >
                  <bubble.icon className={cn(
                    "h-4 w-4 transition-colors duration-300",
                    hoveredBubble === index ? "text-primary" : "text-primary/70"
                  )} />
                  <span className={cn(
                    "text-sm font-semibold transition-colors duration-300",
                    hoveredBubble === index ? "text-primary" : "text-foreground/80"
                  )}>{bubble.text}</span>
                </div>
              ))}
            </div>

            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/15 border-2 border-primary/30 mb-6 shadow-lg shadow-primary/10 hover:scale-105 transition-transform duration-300 cursor-default">
              <MessageCircle className="h-4 w-4 text-primary" />
              <span className="text-sm font-bold text-primary">Meet the Founder</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5">
              <span className="text-foreground">What is </span>
              <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent drop-shadow-sm">
                Omni Wellness Media
              </span>
              <span className="text-foreground">?</span>
            </h2>
            
            <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto leading-relaxed">
              Hear from Chad Cupido as he introduces our mission to bridge wellness, 
              outreach & media — empowering South Africa's journey to health & consciousness.
            </p>
          </div>

          {/* Video container */}
          <div className="relative max-w-4xl mx-auto">
            {/* Decorative elements */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-2xl opacity-50" />
            
            {/* Video wrapper */}
            <div 
              className={cn(
                "relative rounded-2xl overflow-hidden shadow-2xl",
                "border border-border/50 bg-background",
                "transition-all duration-500",
                isPlaying ? "ring-4 ring-primary/30" : "hover:ring-2 hover:ring-primary/20"
              )}
            >
              {/* Aspect ratio container */}
              <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/ZOoaiV-IiiU?rel=0&modestbranding=1"
                  title="The conscious content creators - Omni Wellness Media"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  onLoad={() => setIsPlaying(false)}
                />
              </div>
            </div>

            {/* Bottom accent */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent rounded-full" />
          </div>

          {/* Bottom tagline */}
          <div className="text-center mt-12">
            <p className="text-sm text-muted-foreground italic">
              "Creating content that uplifts, educates, and inspires real change"
            </p>
            
            {/* Stats row */}
            <div className="flex flex-wrap justify-center gap-8 mt-8">
              {[
                { label: "Content Pillars", value: "4" },
                { label: "Community Focus", value: "SA" },
                { label: "Mission", value: "Conscious" },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-primary">{stat.value}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CSS for floating animation */}
      <style>{`
        @keyframes float {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-float {
          animation: float 0.6s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default WhatIsOmniSection;
