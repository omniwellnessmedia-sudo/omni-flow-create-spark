import { Quote } from "lucide-react";

interface Testimonial {
  quote: string;
  author: string;
  title: string;
  equipment: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "The backdrop stand system transformed how we document our retreats. It's professional-grade but respectful of the sacred space. Our participants feel honored, not exposed.",
    author: "Sarah M.",
    title: "Yoga Retreat Facilitator, Cape Town",
    equipment: "Backdrop Stand Kit + 660 Pro II Panels"
  },
  {
    quote: "As a researcher documenting wellness interventions, I needed equipment that wouldn't intimidate participants. These tools let me capture authentic moments while respecting consent and comfort.",
    author: "Dr. James K.",
    title: "UWC Wellness Research Fellow",
    equipment: "SNL660 Panels + CM5 Lavalier Mics"
  },
  {
    quote: "The Godox panels give broadcast-quality light without the heat. For documenters capturing long meditation sessions, that matters. CameraStuff's warranty and local support made the decision easy.",
    author: "Amara L.",
    title: "Documentary Filmmaker, Conscious Content",
    equipment: "660 Pro II + Camera Backpack"
  }
];

export const TestimonialsSection = () => {
  return (
    <div className="py-16 lg:py-20 px-6 border-t-2 border-border">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16 space-y-3">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
            Conscious Practitioners Share Their Experience
          </h2>
          <p className="text-lg text-muted-foreground">
            Real documenters, real work, authentic feedback
          </p>
        </div>

        {/* Testimonial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-background rounded-lg p-8 shadow-sm border-l-4 border-primary hover:shadow-md transition-shadow"
            >
              <Quote className="w-8 h-8 text-primary/30 mb-4" />
              
              <p className="text-base italic text-foreground/90 leading-relaxed mb-6">
                "{testimonial.quote}"
              </p>
              
              <div className="space-y-2">
                <p className="font-bold text-sm text-foreground">
                  {testimonial.author}
                </p>
                <p className="text-xs text-muted-foreground">
                  {testimonial.title}
                </p>
                <p className="text-xs text-muted-foreground pt-3 border-t border-border">
                  Uses: {testimonial.equipment}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Note for updating with real testimonials */}
        <p className="text-center text-xs text-muted-foreground mt-8 italic">
          Template testimonials - replace with real customer reviews as collected
        </p>
      </div>
    </div>
  );
};
