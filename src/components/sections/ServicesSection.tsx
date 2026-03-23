import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Briefcase, Video, Share2, Globe } from "lucide-react";

const STORAGE_BASE = "https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images";

const services = [
  {
    title: "Business Consulting",
    description: "Strategic guidance for conscious businesses creating positive impact.",
    icon: Briefcase,
    image: `${STORAGE_BASE}/Business%20Consulting/DSC00124.jpg`,
    link: "/business-consulting",
  },
  {
    title: "Media & Content",
    description: "Authentic storytelling through video, photography, and multimedia.",
    icon: Video,
    image: `${STORAGE_BASE}/General%20Images/community%20outing%201.jpg`,
    link: "/media-production",
  },
  {
    title: "Social Media Strategy",
    description: "Community-building strategies that drive meaningful engagement.",
    icon: Share2,
    image: `${STORAGE_BASE}/General%20Images/community%20outing%202.jpg`,
    link: "/social-media-strategy",
  },
  {
    title: "Web Development",
    description: "Modern, responsive platforms that reflect your brand and convert.",
    icon: Globe,
    image: `${STORAGE_BASE}/General%20Images/wellness%20group%20tour.jpg`,
    link: "/web-development",
  },
];

const ServicesSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-14" data-tour="services">
          <p className="text-xs font-medium uppercase tracking-widest text-primary mb-3">What We Do</p>
          <h2 className="font-heading text-3xl md:text-4xl mb-4 tracking-tight">
            Our Services
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            From strategy to execution — comprehensive solutions that align with your values.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5 mb-10">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Link
                key={service.title}
                to={service.link}
                className="group relative overflow-hidden rounded-2xl aspect-[16/10] animate-fade-in"
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <img
                  src={service.image}
                  alt={service.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="relative h-full flex flex-col justify-end p-6 md:p-8">
                  <div className="inline-flex p-2.5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 w-fit mb-3">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-heading text-xl md:text-2xl text-white mb-1.5">
                    {service.title}
                  </h3>
                  <p className="text-white/70 text-sm max-w-sm">
                    {service.description}
                  </p>
                  <div className="mt-3 flex items-center gap-1.5 text-white/60 text-sm group-hover:text-white transition-colors">
                    <span>Learn more</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center">
          <Button asChild variant="outline" size="lg" className="rounded-full px-8">
            <Link to="/contact">
              Start a Project
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
