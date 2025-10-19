
import UnifiedNavigation from "@/components/navigation/UnifiedNavigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IMAGES } from "@/lib/images";

const Portfolio = () => {
  const projects = [
    {
      title: "Community Garden Initiative",
      description: "Empowering local communities through sustainable gardening practices and food security programs. This project showcased the journey from seed to harvest, highlighting community collaboration and environmental stewardship.",
      image: IMAGES.wellness.communityProject2,
      category: "Community Development",
      impact: "50+ families involved, 200+ meals provided monthly",
      services: ["Video Production", "Photography", "Community Engagement"]
    },
    {
      title: "Traditional Wisdom Documentation",
      description: "Preserving and sharing indigenous knowledge through multimedia storytelling. We worked with elders to document traditional practices, healing methods, and cultural wisdom for future generations.",
      image: IMAGES.providers.chief,
      category: "Cultural Heritage",
      impact: "10+ elder interviews, 500+ community members reached",
      services: ["Documentary Production", "Cultural Consulting", "Digital Archiving"]
    },
    {
      title: "The Valley of Plenty - Kids React",
      description: "Engaging children in discussions about community, wellness, and positive change through interactive content creation. This series captures authentic reactions and insights from young community members.",
      image: IMAGES.providers.bwc,
      category: "Youth Engagement",
      impact: "100K+ views, 15+ episodes produced",
      services: ["Video Series", "Youth Engagement", "Social Media Strategy"]
    },
    {
      title: "Mindful Movement Campaign",
      description: "A comprehensive wellness campaign promoting mental health awareness and mindful practices. Featured meditation sessions, wellness workshops, and community healing circles.",
      image: IMAGES.sandy.meditation,
      category: "Wellness Advocacy",
      impact: "1000+ participants, 25+ workshops conducted",
      services: ["Campaign Strategy", "Event Production", "Content Creation"]
    },
    {
      title: "Unity Through Diversity",
      description: "A powerful storytelling project that celebrates cultural diversity while highlighting our shared humanity. Featured families from different backgrounds sharing their stories of connection and community.",
      image: IMAGES.wellness.team,
      category: "Social Cohesion",
      impact: "50+ stories collected, 75K+ social media reach",
      services: ["Documentary Series", "Social Media Campaign", "Community Outreach"]
    },
    {
      title: "Mentorship Bridge Program",
      description: "Connecting youth with experienced mentors through structured programs and content creation. Documented the journey of mentorship relationships and their transformative impact on communities.",
      image: IMAGES.wellness.graduation,
      category: "Youth Development",
      impact: "30+ mentor-mentee pairs, 85% program completion rate",
      services: ["Program Documentation", "Mentorship Training", "Impact Assessment"]
    }
  ];

  return (
    <div className="min-h-screen">
      <UnifiedNavigation />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-white via-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="heading-secondary text-gradient-hero no-faded-text">
              Our <span className="text-gradient-rainbow">Portfolio</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-4xl mx-auto">
              Real stories, authentic impact. Explore how we've partnered with communities and organizations 
              to create meaningful change through conscious content and strategic engagement.
            </p>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {projects.map((project, index) => (
                <Card 
                  key={project.title}
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up border-0 shadow-lg"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={project.image}
                      alt={project.title}
                      className="instagram-post-img hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-omni-indigo bg-omni-indigo/10 px-3 py-1 rounded-full">
                        {project.category}
                      </span>
                    </div>
                    <CardTitle className="font-heading text-xl mb-2">{project.title}</CardTitle>
                    <CardDescription className="text-gray-600 leading-relaxed">
                      {project.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-sm text-gray-800 mb-1">Impact</h4>
                        <p className="text-sm text-gray-600">{project.impact}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-gray-800 mb-2">Services Provided</h4>
                        <div className="flex flex-wrap gap-2">
                          {project.services.map((service) => (
                            <span 
                              key={service}
                              className="text-xs px-2 py-1 bg-rainbow-subtle rounded-full text-gray-700"
                            >
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="heading-secondary text-gradient-hero no-faded-text">
                Our <span className="text-gradient-rainbow">Impact</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Numbers that matter - real impact in communities across South Africa.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { number: "500+", label: "Community Members Engaged" },
                { number: "50+", label: "Projects Completed" },
                { number: "1M+", label: "Content Views & Reach" },
                { number: "25+", label: "Partner Organizations" }
              ].map((stat, index) => (
                <div 
                  key={stat.label}
                  className="text-center animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="text-4xl sm:text-5xl font-bold text-gradient-rainbow mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Portfolio;
