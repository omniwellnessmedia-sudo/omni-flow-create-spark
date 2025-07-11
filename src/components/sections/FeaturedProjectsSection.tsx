
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const FeaturedProjectsSection = () => {
  const projects = [
    {
      title: "Community Garden Initiative",
      description: "Empowering local communities through sustainable gardening practices and food security programs.",
      image: "/lovable-uploads/9d51151d-b05c-4392-9f83-9e301a4f790d.png",
      category: "Community Development"
    },
    {
      title: "Traditional Wisdom Documentation",
      description: "Preserving and sharing indigenous knowledge through multimedia storytelling.",
      image: "/lovable-uploads/8599bcc3-c73a-4244-84fe-6caa49ab80df.png",
      category: "Cultural Heritage"
    },
    {
      title: "The Valley of Plenty Kids React",
      description: "Engaging children in discussions about community, wellness, and positive change.",
      image: "/lovable-uploads/965c3c16-d837-4f01-8f8a-220d4a14a83b.png",
      category: "Youth Engagement"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl mb-6">
            Featured <span className="bg-rainbow-gradient bg-clip-text text-transparent">Projects</span>
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
              <div className="aspect-video overflow-hidden">
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
