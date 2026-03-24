
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "Joined these lovely people yesterday for a very interesting indigenous walk. Was fascinating to learn more about the mountains here in Cape Town. The plants, their medicinal properties and how Chief Kingsley's ancestors passed on this amazing knowledge. So wonderful that he's passing it on today and sharing his gifts with the world. Thanks so much Chad and team!",
      author: "Janneke Blake",
      role: "Cape Town Explorer",
      initials: "JB",
      rating: 5,
      featured: true
    },
    {
      quote: "My weekend wellness retreat in Cape Town was life-changing. The combination of nature, indigenous wisdom, and community connection created a profound healing experience I'll never forget.",
      author: "Anonymous",
      role: "Retreat Participant",
      initials: "RP",
      rating: 5,
      featured: false
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-xs font-medium uppercase tracking-widest text-primary mb-3">Testimonials</p>
          <h2 className="font-heading text-3xl md:text-4xl mb-4">
            What Our Guests Say
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real stories from people who've walked with us.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.author + index}
              className={`border-border/50 animate-fade-in ${
                testimonial.featured ? 'md:col-span-2' : ''
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <blockquote className={`text-foreground leading-relaxed mb-6 ${testimonial.featured ? 'text-base md:text-lg' : 'text-sm'}`}>
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center pt-4 border-t border-border/30">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center mr-3 shrink-0">
                    <span className="text-xs font-semibold text-primary">{testimonial.initials}</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">{testimonial.author}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
