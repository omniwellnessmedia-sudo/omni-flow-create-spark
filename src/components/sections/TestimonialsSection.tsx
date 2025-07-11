
import { Card, CardContent } from "@/components/ui/card";

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "Omni Wellness Media transformed our brand story and helped us connect with our community in ways we never imagined. Their authentic approach to content creation is unparalleled.",
      author: "Sarah Johnson",
      role: "Founder, Green Living Co.",
      image: "/lovable-uploads/fcf93d20-65c1-4e39-8c34-360afdf825f1.png"
    },
    {
      quote: "The team's dedication to conscious business development and their holistic approach to wellness has been instrumental in our organization's growth and impact.",
      author: "Marcus Williams",
      role: "Director, Community Wellness Foundation",
      image: "/lovable-uploads/00bcae7d-32b7-4512-ba26-c767559ee023.png"
    },
    {
      quote: "Working with Omni Wellness Media has been transformative. They don't just create content; they create movements that inspire positive change in communities.",
      author: "Dr. Amara Okafor",
      role: "Health & Wellness Consultant",
      image: "/lovable-uploads/65549a00-dea0-461e-9e85-fe455db1c706.png"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="heading-primary mb-6">
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
              key={testimonial.author}
              variant="standard"
              className="hover:shadow-lg transition-all duration-300 animate-fade-in-up border-0 bg-rainbow-subtle"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex-1 mb-6">
                  <div className="text-4xl text-omni-indigo mb-4">"</div>
                  <p className="text-gray-700 italic leading-relaxed card-description-clamp">{testimonial.quote}</p>
                </div>
                <div className="flex items-center mt-auto">
                  <img 
                    src={testimonial.image}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <div className="font-bold text-gray-800">{testimonial.author}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
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
