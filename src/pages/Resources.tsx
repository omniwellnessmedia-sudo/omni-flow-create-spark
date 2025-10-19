import UnifiedNavigation from "@/components/navigation/UnifiedNavigation";
import Footer from "@/components/Footer";
import Hero from "@/components/ui/hero";
import BreadcrumbNav from "@/components/ui/breadcrumb-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, BookOpen, Video, Headphones, Globe, Users } from "lucide-react";

const Resources = () => {
  const resources = [
    {
      category: "Wellness Guides",
      icon: BookOpen,
      items: [
        { title: "Beginner's Guide to Mindfulness", type: "PDF", description: "Learn the basics of mindfulness practice" },
        { title: "Nutrition Essentials", type: "PDF", description: "Complete guide to conscious eating" },
        { title: "Plant-Based Transition Guide", type: "PDF", description: "Step-by-step guide to plant-based living" }
      ]
    },
    {
      category: "Video Content",
      icon: Video,
      items: [
        { title: "Community Impact Stories", type: "Video", description: "Real stories from our community projects" },
        { title: "Wellness Workshop Series", type: "Video", description: "Educational content for personal growth" },
        { title: "Behind the Scenes", type: "Video", description: "How we create conscious content" }
      ]
    },
    {
      category: "Audio Resources",
      icon: Headphones,
      items: [
        { title: "Meditation Practices", type: "Audio", description: "Guided meditations for daily practice" },
        { title: "Podcast Episodes", type: "Audio", description: "Insights and conversations with changemakers" },
        { title: "Affirmation Tracks", type: "Audio", description: "Positive affirmations for empowerment" }
      ]
    },
    {
      category: "Community Tools",
      icon: Users,
      items: [
        { title: "Event Planning Toolkit", type: "PDF", description: "Resources for organizing community events" },
        { title: "Social Media Templates", type: "Design", description: "Templates for conscious content creation" },
        { title: "Fundraising Guide", type: "PDF", description: "How to raise funds for community projects" }
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      <UnifiedNavigation />
      <BreadcrumbNav />
      
      <Hero
        title={
          <>
            <span className="text-gradient-rainbow">Resources</span> & Downloads
          </>
        }
        description="Access our library of wellness guides, educational content, and community tools to support your journey toward conscious living and positive change."
        image="/lovable-uploads/2c1edd03-b748-4129-ad38-5ed1db48917e.png"
        imageAlt="Resources and educational materials"
        variant="split"
        height="medium"
        actions={[
          {
            label: "Browse All Resources",
            href: "#resources",
            variant: "wellness"
          },
          {
            label: "Join Community",
            href: "/wellness-exchange",
            variant: "outline"
          }
        ]}
      />
      
      <main>
        {/* Featured Resources */}
        <section id="resources" className="section-spacing bg-white">
          <div className="container-width">
            <div className="text-center mb-16">
              <h2 className="text-gradient-rainbow text-4xl md:text-5xl font-bold mb-6">
                Free Resources for Your Journey
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Discover our collection of wellness guides, educational content, and community tools 
                designed to support your path toward conscious living and positive impact.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {resources.map((category, index) => (
                <Card key={category.category} className="group hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-rainbow rounded-lg flex items-center justify-center">
                        <category.icon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-gradient-rainbow">
                        {category.category}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {category.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800 mb-1">{item.title}</h4>
                            <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                            <span className="inline-block px-2 py-1 bg-gradient-rainbow text-white text-xs rounded-full">
                              {item.type}
                            </span>
                          </div>
                          <Button variant="outline" size="sm" className="ml-4">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="section-spacing bg-gray-50">
          <div className="container-width">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-gradient-rainbow text-3xl md:text-4xl font-bold mb-6">
                Stay Updated
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Get notified when we release new resources, guides, and educational content.
              </p>
              <div className="flex gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rainbow-gradient focus:border-transparent"
                />
                <Button variant="wellness" className="px-6">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Community Impact */}
        <section className="section-spacing bg-white">
          <div className="container-width">
            <div className="text-center mb-16">
              <h2 className="text-gradient-rainbow text-3xl md:text-4xl font-bold mb-6">
                Join Our Impact Community
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
                Connect with like-minded individuals working toward positive change in their communities.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-rainbow rounded-full flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-heading font-semibold text-xl mb-3">Global Network</h3>
                  <p className="text-gray-600">Connect with changemakers worldwide</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-rainbow rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-heading font-semibold text-xl mb-3">Community Support</h3>
                  <p className="text-gray-600">Share experiences and learn together</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-rainbow rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-heading font-semibold text-xl mb-3">Continuous Learning</h3>
                  <p className="text-gray-600">Access new resources and insights regularly</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Resources;