import { Card, CardContent } from "@/components/ui/card";

interface Testimonial {
  quote: string;
  author: string;
  details: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "The professional lighting system transformed how we document our retreats. It's broadcast-quality but feels natural to our participants. They don't feel exposed—they feel honored.",
    author: "Sarah M., Yoga Retreat Facilitator",
    details: "Uses: LED Lighting Kit + Backdrop System"
  },
  {
    quote: "As a UWC researcher documenting wellness interventions, I needed equipment that wouldn't intimidate participants. This gear is professional-grade but invisible—it captures authentic moments while respecting consent.",
    author: "Dr. James K., Wellness Research Fellow",
    details: "Uses: LED Kit + Audio Kit"
  },
  {
    quote: "As a documentary filmmaker, I appreciate that Omni curates equipment with consciousness in mind. They're not just recommending gear—they're recommending tools that match values I actually care about.",
    author: "Amara L., Conscious Content Creator",
    details: "Uses: Complete system (all 5 products)"
  }
];

export const TestimonialsSection = () => {
  return (
    <section className="bg-purple-50/50 py-16 lg:py-20 px-10 lg:px-20 border-t-2 border-border">
      <div className="max-w-[1400px] mx-auto">
        <h2 className="text-3xl lg:text-4xl font-bold text-center text-foreground mb-3">
          Conscious Practitioners Share Their Experience
        </h2>
        <p className="text-lg text-muted-foreground text-center mb-12 lg:mb-16">
          Real documenters, real work, authentic feedback
        </p>
        
        <div className="grid md:grid-cols-3 gap-10">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white border-l-[5px] border-l-primary shadow-sm">
              <CardContent className="pt-8 pb-8 px-8">
                <p className="text-base text-foreground/90 italic leading-relaxed mb-5">
                  "{testimonial.quote}"
                </p>
                <div>
                  <p className="font-bold text-sm text-foreground">
                    {testimonial.author}
                  </p>
                  <p className="text-[13px] text-muted-foreground mt-3">
                    {testimonial.details}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8 italic">
          * Template testimonials - to be replaced with real customer reviews
        </p>
      </div>
    </section>
  );
};
