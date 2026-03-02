
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
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="heading-primary text-gradient-hero mb-6">
            What Our Partners Say
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We're honored to work with incredible individuals and organizations 
            who share our vision for positive change.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.author + index}
              variant="standard"
              className={`hover:shadow-lg transition-all duration-300 animate-fade-in-up border-2 ${
                testimonial.featured 
                  ? 'border-primary/30 bg-gradient-to-br from-primary/5 to-purple-50' 
                  : 'border-border/50 bg-white'
              }`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex-1 mb-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <div className="text-6xl font-serif text-primary/20 mb-4 leading-none">"</div>
                  <p className={`text-gray-700 leading-relaxed ${testimonial.featured ? 'text-base' : 'text-sm'} line-clamp-6`}>
                    {testimonial.quote}
                  </p>
                </div>
                <div className="flex items-center mt-auto pt-4 border-t border-border/50">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-sm font-bold text-primary">{testimonial.initials}</span>
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">{testimonial.author}</div>
                    <div className="text-xs text-gray-600">{testimonial.role}</div>
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
