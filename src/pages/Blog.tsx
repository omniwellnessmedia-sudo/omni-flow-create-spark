
import MegaNavigation from "@/components/MegaNavigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Blog = () => {
  const blogPosts = [
    {
      title: "The Power of Authentic Storytelling in Community Development",
      excerpt: "How genuine narratives can bridge gaps between communities and create lasting positive change.",
      category: "Inspiration",
      date: "December 15, 2024",
      readTime: "5 min read",
      image: "/lovable-uploads/fcf93d20-65c1-4e39-8c34-360afdf825f1.png"
    },
    {
      title: "Building Sustainable Wellness Programs in Local Communities",
      excerpt: "A comprehensive guide to creating wellness initiatives that grow from within communities.",
      category: "Wellness",
      date: "December 10, 2024", 
      readTime: "8 min read",
      image: "/lovable-uploads/9d51151d-b05c-4392-9f83-9e301a4f790d.png"
    },
    {
      title: "Digital Inclusion: Making Technology Work for Everyone",
      excerpt: "Exploring how conscious businesses can use technology to empower underserved communities.",
      category: "Education",
      date: "December 5, 2024",
      readTime: "6 min read",
      image: "/lovable-uploads/83be8984-2c43-478e-ba25-b848902c104f.png"
    },
    {
      title: "The Role of Traditional Wisdom in Modern Wellness",
      excerpt: "Honoring indigenous knowledge while building contemporary wellness solutions.",
      category: "Wellness",
      date: "November 28, 2024",
      readTime: "7 min read",
      image: "/lovable-uploads/8599bcc3-c73a-4244-84fe-6caa49ab80df.png"
    },
    {
      title: "Creating Content That Matters: A Guide for Conscious Brands",
      excerpt: "Strategies for developing content that inspires action and builds authentic connections.",
      category: "Empowerment",
      date: "November 20, 2024",
      readTime: "9 min read",
      image: "/lovable-uploads/00bcae7d-32b7-4512-ba26-c767559ee023.png"
    },
    {
      title: "Youth Voices: Amplifying the Next Generation of Change-Makers",
      excerpt: "How to meaningfully engage young people in community development and social change.",
      category: "Inspiration",
      date: "November 15, 2024",
      readTime: "6 min read",
      image: "/lovable-uploads/965c3c16-d837-4f01-8f8a-220d4a14a83b.png"
    }
  ];

  const categories = ["All", "Inspiration", "Education", "Empowerment", "Wellness"];

  const getCategoryColor = (category: string) => {
    const colors = {
      "Inspiration": "text-omni-red bg-omni-red/10",
      "Education": "text-omni-green bg-omni-green/10", 
      "Empowerment": "text-omni-blue bg-omni-blue/10",
      "Wellness": "text-omni-violet bg-omni-violet/10"
    };
    return colors[category] || "text-gray-600 bg-gray-100";
  };

  return (
    <div className="min-h-screen">
      <MegaNavigation />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-white via-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="heading-secondary text-gradient-hero no-faded-text">
              Insights & <span className="text-gradient-rainbow">Stories</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-4xl mx-auto">
              Explore our thoughts on conscious content creation, community empowerment, 
              and the stories that inspire positive change across communities.
            </p>
            <div className="flex gap-4 justify-center">
              <Button 
                onClick={() => window.location.href = '/blog/community'}
                className="bg-gradient-rainbow hover:opacity-90 text-white"
              >
                Community Blog
              </Button>
            </div>
          </div>
        </section>

        {/* Content Pillars */}
        <section className="py-12 bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="font-heading font-semibold text-2xl mb-4">
                Our Content <span className="text-gradient-rainbow">Pillars</span>
              </h2>
              <div className="flex flex-wrap justify-center gap-4">
                {categories.slice(1).map((category, index) => (
                  <span 
                    key={category}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${getCategoryColor(category)} animate-fade-in`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post, index) => (
                <Card 
                  key={post.title}
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up cursor-pointer border-0 shadow-md"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${getCategoryColor(post.category)}`}>
                        {post.category}
                      </span>
                      <span className="text-xs text-gray-500">{post.readTime}</span>
                    </div>
                    <CardTitle className="font-heading text-lg mb-2 line-clamp-2 hover:text-omni-indigo transition-colors">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 line-clamp-2">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-gray-500">
                      {post.date}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Topics */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="heading-secondary text-gradient-hero no-faded-text">
                Featured <span className="text-gradient-rainbow">Topics</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Dive deeper into the subjects that matter most to our community.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                "Inclusion, Equity & Diversity",
                "Conscious Food & Medicine", 
                "Animal Wellness",
                "Nature & Environmental Healing",
                "Children's Wellness Programs",
                "Financial Wellness & Sustainability",
                "Personal Development & Growth",
                "Community Building Strategies",
                "Traditional Healing Practices"
              ].map((topic, index) => (
                <div 
                  key={topic}
                  className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <h3 className="font-medium text-gray-800 hover:text-omni-indigo transition-colors">
                    {topic}
                  </h3>
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

export default Blog;
