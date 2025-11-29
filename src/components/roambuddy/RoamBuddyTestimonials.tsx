import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quote } from "lucide-react";
import { testimonials } from "@/data/roamBuddyProducts";

export const RoamBuddyTestimonials = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Luxury Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(var(--primary),0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(var(--accent),0.1),transparent_50%)]" />
      
      <div className="relative container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-block px-6 py-2 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full mb-4">
            <p className="text-sm font-semibold text-primary uppercase tracking-widest">Traveler Stories</p>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Trusted by Conscious Travelers Worldwide
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real experiences from wellness travelers, retreat facilitators, and digital nomads
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="group p-8 bg-background/80 backdrop-blur-xl border-2 hover:border-primary/30 shadow-xl hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
              {/* Luxury Card Accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary" />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative space-y-6">
                <Quote className="h-10 w-10 text-primary/30 group-hover:text-primary/50 transition-colors duration-500" />
                
                <p className="text-foreground/90 text-base leading-relaxed italic min-h-[120px]">
                  "{testimonial.quote}"
                </p>
                
                <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full blur-md opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                    <Avatar className="relative h-14 w-14 border-3 border-background shadow-lg ring-2 ring-primary/20">
                      <AvatarImage src={testimonial.image} alt={testimonial.name} className="object-cover" />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-sm font-bold">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-foreground text-lg">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.title}</div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
