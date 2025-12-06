import { useState } from "react";
import { Play, MessageCircle, Sparkles, Heart, Globe, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const thoughtBubbles = [
  { text: "What is Omni?", icon: MessageCircle, position: "left-4 top-8" },
  { text: "Conscious Media", icon: Sparkles, position: "right-4 top-12" },
  { text: "Wellness First", icon: Heart, position: "left-8 top-1/3" },
  { text: "South Africa", icon: Globe, position: "right-8 top-1/2" },
  { text: "Community", icon: Users, position: "left-4 bottom-1/3" },
];

export const WhatIsOmniSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hoveredBubble, setHoveredBubble] = useState<number | null>(null);

  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-b from-background via-muted/30 to-background">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary/3 to-transparent rounded-full" />
      </div>
      
      {/* Floating thought bubbles - positioned outside content area */}
      <div className="absolute inset-0 pointer-events-none hidden lg:block">
        {thoughtBubbles.map((bubble, index) => (
          <div
            key={index}
            onMouseEnter={() => setHoveredBubble(index)}
            onMouseLeave={() => setHoveredBubble(null)}
            className={cn(
              "absolute pointer-events-auto flex items-center gap-2 px-4 py-2.5 rounded-full cursor-pointer z-10",
              "bg-background/95 backdrop-blur-md border shadow-lg",
              "transition-all duration-500 ease-out",
              hoveredBubble === index 
                ? "border-primary scale-110 shadow-primary/20 shadow-xl" 
                : "border-border/40 hover:border-primary/50 hover:scale-105",
              bubble.position
            )}
            style={{
              animation: `float-bubble ${3 + index * 0.5}s ease-in-out infinite`,
              animationDelay: `${index * 0.3}s`,
            }}
          >
            <bubble.icon className={cn(
              "h-4 w-4 transition-colors duration-300",
              hoveredBubble === index ? "text-primary" : "text-primary/60"
            )} />
            <span className={cn(
              "text-sm font-medium whitespace-nowrap transition-colors duration-300",
              hoveredBubble === index ? "text-primary" : "text-foreground/70"
            )}>{bubble.text}</span>
          </div>
        ))}
      </div>
      
      <div className="container mx-auto px-4 relative z-20">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Play className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Meet the Founder</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="text-foreground">What is </span>
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                  Omni Wellness Media
                </span>
                <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full opacity-50" />
              </span>
              <span className="text-foreground">?</span>
            </h2>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Hear from Chad Cupido as he introduces our mission to bridge wellness, 
              outreach & media — empowering South Africa's journey to health & consciousness.
            </p>
          </div>

          {/* Video container with enhanced styling */}
          <div className="relative group">
            {/* Outer glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Video card */}
            <div className="relative bg-card rounded-2xl overflow-hidden shadow-2xl border border-border/50">
              {/* Top accent bar */}
              <div className="h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
              
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
          </div>

          {/* Stats and tagline */}
          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground italic mb-8">
              "Creating content that uplifts, educates, and inspires real change"
            </p>
            
            {/* Stats row */}
            <div className="flex flex-wrap justify-center gap-6 md:gap-12">
              {[
                { label: "Content Pillars", value: "4", icon: Sparkles },
                { label: "Community Focus", value: "SA", icon: Globe },
                { label: "Mission", value: "Conscious", icon: Heart },
              ].map((stat, index) => (
                <div key={index} className="flex items-center gap-3 px-5 py-3 rounded-xl bg-muted/50 border border-border/50">
                  <stat.icon className="h-5 w-5 text-primary" />
                  <div className="text-left">
                    <div className="text-xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CSS for floating animation */}
      <style>{`
        @keyframes float-bubble {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-12px);
          }
        }
      `}</style>
    </section>
  );
};

export default WhatIsOmniSection;
