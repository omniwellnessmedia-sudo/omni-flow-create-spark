
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IMAGES } from "@/lib/images";

const FeaturedProjectsSection = () => {
  const projects = [
    {
      title: "Community Outreach & Support",
      description: "Providing essential resources and support to families and children in our community.",
      image: IMAGES.wellness.communityProject1,
      category: "Community Development"
    },
    {
      title: "Indigenous Wisdom & Healing",
      description: "Learning from traditional healers and documenting ancient wisdom for future generations.",
      image: IMAGES.wellness.landmark,
      category: "Cultural Heritage"
    },
    {
      title: "Wellness Education & Growth",
      description: "Sharing knowledge and fostering growth through educational programs and community workshops.",
      image: IMAGES.wellness.graduation,
      category: "Education & Development"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="heading-primary text-gradient-hero mb-6">
            Featured Projects
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Real stories, authentic impact. See how we're creating positive change 
            through conscious content and community empowerment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <Card 
              key={project.title}
              variant="standard"
              className="overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="aspect-square overflow-hidden">
                <img 
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader className="flex-1">
                <div className="text-sm text-omni-indigo font-medium mb-2">{project.category}</div>
                <CardTitle variant="clamp" className="font-heading text-xl mb-2">{project.title}</CardTitle>
                <CardDescription variant="clamp" className="text-gray-600">{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button 
                  variant="soft"
                  className="w-full card-button-standard"
                >
                  View Project
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjectsSection;
