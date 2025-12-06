import { useState } from "react";
import { MessageCircle, Sparkles, Heart, Globe, Users, Play } from "lucide-react";
import { cn } from "@/lib/utils";

const pillars = [
  { text: "Inspiration", icon: Sparkles, color: "from-amber-500 to-orange-500" },
  { text: "Education", icon: MessageCircle, color: "from-emerald-500 to-teal-500" },
  { text: "Empowerment", icon: Heart, color: "from-rose-500 to-pink-500" },
  { text: "Wellness", icon: Globe, color: "from-blue-500 to-cyan-500" },
];

const stats = [
  { label: "Content Pillars", value: "4", icon: Sparkles },
  { label: "Community Focus", value: "SA", icon: Users },
  { label: "Mission", value: "Conscious", icon: Heart },
];

export const WhatIsOmniSection = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [activePillar, setActivePillar] = useState<number | null>(null);

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Elegant background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.05),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(var(--accent)/0.05),transparent_70%)]" />
      
      {/* Decorative geometric shapes */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in">
              <Play className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary tracking-wide">Meet the Founder</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="text-foreground">What is </span>
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-primary via-emerald-500 to-teal-500 bg-clip-text text-transparent">
                  Omni Wellness Media
                </span>
                <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 via-emerald-500/50 to-teal-500/50 rounded-full blur-sm" />
              </span>
              <span className="text-foreground">?</span>
            </h2>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Hear from Chad Cupido as he introduces our mission to bridge wellness, 
              outreach & media — empowering South Africa's journey to health & consciousness.
            </p>
          </div>

          {/* Content Pillars - Interactive Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {pillars.map((pillar, index) => (
              <button
                key={index}
                onMouseEnter={() => setActivePillar(index)}
                onMouseLeave={() => setActivePillar(null)}
                className={cn(
                  "flex items-center gap-2 px-5 py-3 rounded-full border-2 transition-all duration-300",
                  "bg-background/80 backdrop-blur-sm shadow-lg",
                  activePillar === index 
                    ? "border-primary scale-105 shadow-xl shadow-primary/20" 
                    : "border-border/50 hover:border-primary/50 hover:scale-102"
                )}
              >
                <div className={cn(
                  "p-1.5 rounded-full bg-gradient-to-r",
                  pillar.color
                )}>
                  <pillar.icon className="h-4 w-4 text-white" />
                </div>
                <span className={cn(
                  "font-semibold transition-colors duration-300",
                  activePillar === index ? "text-primary" : "text-foreground"
                )}>
                  {pillar.text}
                </span>
              </button>
            ))}
          </div>

          {/* Video Container with Premium Styling */}
          <div 
            className="relative max-w-4xl mx-auto"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {/* Outer glow effect */}
            <div className={cn(
              "absolute -inset-4 rounded-3xl transition-all duration-500",
              "bg-gradient-to-r from-primary/20 via-emerald-500/20 to-teal-500/20",
              isHovering ? "blur-2xl opacity-80 scale-105" : "blur-xl opacity-50"
            )} />
            
            {/* Video wrapper with elegant border */}
            <div className={cn(
              "relative rounded-2xl overflow-hidden",
              "bg-gradient-to-r from-primary/10 via-emerald-500/10 to-teal-500/10 p-[2px]",
              "shadow-2xl transition-all duration-500",
              isHovering && "shadow-primary/20"
            )}>
              <div className="bg-background rounded-2xl overflow-hidden">
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
                  />
                </div>
              </div>
            </div>

            {/* Bottom accent line */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-primary/60 to-transparent rounded-full" />
          </div>

          {/* Bottom Section - Quote & Stats */}
          <div className="text-center mt-16">
            {/* Quote */}
            <blockquote className="relative max-w-2xl mx-auto mb-12">
              <div className="absolute -left-4 -top-4 text-6xl text-primary/20 font-serif">"</div>
              <p className="text-lg md:text-xl text-muted-foreground italic leading-relaxed">
                Creating content that uplifts, educates, and inspires real change
              </p>
              <div className="absolute -right-4 -bottom-4 text-6xl text-primary/20 font-serif rotate-180">"</div>
            </blockquote>
            
            {/* Stats Grid */}
            <div className="flex flex-wrap justify-center gap-8 md:gap-12">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className="group flex flex-col items-center p-4 rounded-xl transition-all duration-300 hover:bg-muted/50"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <stat.icon className="h-5 w-5 text-primary/70 group-hover:text-primary transition-colors" />
                    <span className="text-3xl font-bold bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">
                      {stat.value}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatIsOmniSection;
