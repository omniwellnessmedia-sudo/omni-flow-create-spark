import UnifiedNavigation from "@/components/navigation/UnifiedNavigation";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IMAGES } from "@/lib/images";
import { ArrowRight } from "lucide-react";

const Blog = () => {
  const blogPosts = [
    {
      title: "The Power of Authentic Storytelling in Community Development",
      excerpt: "How genuine narratives can bridge gaps between communities and create lasting positive change.",
      category: "Inspiration",
      date: "December 15, 2024",
      readTime: "5 min read",
      image: IMAGES.wellness.graduation,
    },
    {
      title: "Building Sustainable Wellness Programs in Local Communities",
      excerpt: "A comprehensive guide to creating wellness initiatives that grow from within communities.",
      category: "Wellness",
      date: "December 10, 2024",
      readTime: "8 min read",
      image: IMAGES.wellness.retreat,
    },
    {
      title: "Digital Inclusion: Making Technology Work for Everyone",
      excerpt: "Exploring how conscious businesses can use technology to empower underserved communities.",
      category: "Education",
      date: "December 5, 2024",
      readTime: "6 min read",
      image: IMAGES.ai.tools,
    },
    {
      title: "The Role of Traditional Wisdom in Modern Wellness",
      excerpt: "Honoring indigenous knowledge while building contemporary wellness solutions.",
      category: "Wellness",
      date: "November 28, 2024",
      readTime: "7 min read",
      image: IMAGES.providers.chief,
    },
    {
      title: "Creating Content That Matters: A Guide for Conscious Brands",
      excerpt: "Strategies for developing content that inspires action and builds authentic connections.",
      category: "Empowerment",
      date: "November 20, 2024",
      readTime: "9 min read",
      image: IMAGES.media.production,
    },
    {
      title: "Youth Voices: Amplifying the Next Generation of Change-Makers",
      excerpt: "How to meaningfully engage young people in community development and social change.",
      category: "Inspiration",
      date: "November 15, 2024",
      readTime: "6 min read",
      image: IMAGES.providers.bwc,
    },
  ];

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Inspiration: "bg-amber-50 text-amber-700 border-amber-200",
      Education: "bg-blue-50 text-blue-700 border-blue-200",
      Empowerment: "bg-green-50 text-green-700 border-green-200",
      Wellness: "bg-purple-50 text-purple-700 border-purple-200",
    };
    return colors[category] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  return (
    <div className="min-h-screen bg-background">
      <UnifiedNavigation />

      {/* Hero */}
      <section className="pt-28 pb-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <Badge variant="outline" className="mb-4">Stories & Insights</Badge>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-4">
            The Omni Journal
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Stories, ideas, and insights from our community — where wellness meets purpose.
          </p>
        </div>
      </section>

      {/* Featured Post */}
      <section className="pb-12 px-4">
        <div className="max-w-5xl mx-auto">
          <Link to={`/blog/${blogPosts[0].title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`} className="block group">
            <div className="relative overflow-hidden rounded-2xl aspect-[21/9]">
              <img
                src={blogPosts[0].image}
                alt={blogPosts[0].title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                <Badge className={`mb-3 ${getCategoryColor(blogPosts[0].category)}`}>{blogPosts[0].category}</Badge>
                <h2 className="font-heading text-2xl md:text-3xl text-white mb-2 max-w-2xl">
                  {blogPosts[0].title}
                </h2>
                <p className="text-white/70 text-sm max-w-xl">{blogPosts[0].excerpt}</p>
                <div className="mt-3 flex items-center gap-3 text-white/50 text-xs">
                  <span>{blogPosts[0].date}</span>
                  <span>&middot;</span>
                  <span>{blogPosts[0].readTime}</span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.slice(1).map((post) => {
              const slug = post.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
              return (
                <Link key={post.title} to={`/blog/${slug}`} className="block group">
                  <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-300 group-hover:-translate-y-0.5 h-full">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className={`text-[10px] ${getCategoryColor(post.category)}`}>{post.category}</Badge>
                        <span className="text-[10px] text-muted-foreground">{post.readTime}</span>
                      </div>
                      <CardTitle className="text-base leading-snug group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="text-sm line-clamp-2 mt-1">
                        {post.excerpt}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <span className="text-xs text-muted-foreground">{post.date}</span>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-heading text-2xl mb-3">Got a Story to Share?</h2>
          <p className="text-muted-foreground mb-6">
            We're always looking for conscious voices to amplify. If your work aligns with wellness, culture, or community, we'd love to hear from you.
          </p>
          <Button asChild variant="outline" className="rounded-full px-8">
            <Link to="/contact">
              Get in Touch <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
