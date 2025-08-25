
import MegaNavigation from "@/components/MegaNavigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Play, Users, Heart, Lightbulb, Zap, Quote } from "lucide-react";

const Podcast = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [quoteText, setQuoteText] = useState("");
  const [quoteAuthor, setQuoteAuthor] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Here you would integrate with your email service
    console.log("Subscription:", { email, name });
  };

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would save the quote
    console.log("Quote submitted:", { quoteText, quoteAuthor });
    setQuoteText("");
    setQuoteAuthor("");
  };

  const featuredVideos = [
    {
      id: "FDrHL7IM3_c",
      title: "Tri Toad Nursery: Join Sheena in building a sustainable future",
      description: "Discover how Sheena is creating sustainable solutions through her nursery business, building a greener future for our communities.",
      category: "Sustainability"
    },
    {
      id: "IjLGY5UEDkU",
      title: "A legacy beyond financial success: Cheryl-Lynn from Mzansi Business Services (AUDIO ONLY)",
      description: "An inspiring audio conversation about building businesses that create lasting impact beyond just financial gains.",
      category: "Business Impact"
    },
    {
      id: "9p9TKXziKus",
      title: "Kiara's Dream to becoming a Holistic Psychiatrist",
      description: "Follow Kiara's inspiring journey toward becoming a holistic psychiatrist, bridging traditional and alternative healing approaches.",
      category: "Wellness Journey"
    },
    {
      id: "K49Zh_jVd8c",
      title: "Empowerment Through Compassion: Supporting Animal Rights",
      description: "Exploring the intersection of compassion, empowerment, and animal rights advocacy in our community.",
      category: "Animal Welfare"
    },
    {
      id: "QQfOKeZdZmM",
      title: "A legacy beyond financial success: Cheryl-Lynn from Mzansi Business Services",
      description: "The full video conversation with Cheryl-Lynn about creating meaningful business legacies in South Africa.",
      category: "Business Legacy"
    }
  ];

  return (
    <div className="min-h-screen">
      <MegaNavigation />
      <main className="pt-16">
        {/* Hero Section - Funnel Focused */}
        <section className="py-20 bg-gradient-to-br from-white via-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Badge className="mb-6 px-6 py-3 bg-omni-violet text-white text-sm font-medium shadow-lg">
              🎧 Free Access • Real Stories • Transformative Insights
            </Badge>
            
            <h1 className="heading-secondary text-gradient-hero no-faded-text">
              Conversations That <span className="text-gradient-rainbow">Transform</span> Lives
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              Join thousands of conscious individuals who tune in weekly for authentic stories of transformation, 
              sustainable business success, and community empowerment from across South Africa.
            </p>

            {/* Value Proposition */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
              <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md">
                <Users className="h-8 w-8 text-omni-green mb-3" />
                <h3 className="font-semibold mb-2">Real People</h3>
                <p className="text-sm text-gray-600">Authentic conversations with entrepreneurs, healers, and change-makers</p>
              </div>
              <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md">
                <Lightbulb className="h-8 w-8 text-omni-orange mb-3" />
                <h3 className="font-semibold mb-2">Actionable Insights</h3>
                <p className="text-sm text-gray-600">Practical wisdom you can apply to your own wellness and business journey</p>
              </div>
              <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md">
                <Heart className="h-8 w-8 text-omni-red mb-3" />
                <h3 className="font-semibold mb-2">Community Impact</h3>
                <p className="text-sm text-gray-600">Stories that inspire positive change in your community</p>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto">
              <h3 className="font-heading font-bold text-2xl mb-4">Get Weekly Inspiration</h3>
              <p className="text-gray-600 mb-6">Join our community and never miss a transformative conversation</p>
              
              {!submitted ? (
                <form onSubmit={handleSubscribe} className="space-y-4">
                  <Input
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <Input
                    type="email"
                    placeholder="Your Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Button type="submit" className="w-full bg-omni-violet hover:bg-omni-indigo text-white py-3">
                    🎧 Start Listening Free
                  </Button>
                </form>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-omni-green rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl">✓</span>
                  </div>
                  <h4 className="font-semibold text-lg mb-2">Welcome to the Community!</h4>
                  <p className="text-gray-600">Check your email for your first episode recommendation.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Featured Episodes */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="heading-secondary text-gradient-hero no-faded-text">
                Featured <span className="text-gradient-rainbow">Episodes</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Dive into our most impactful conversations with entrepreneurs, healers, and visionaries 
                who are creating positive change across South Africa.
              </p>
            </div>

            <div className="space-y-12">
              {featuredVideos.map((video, index) => (
                <div key={video.id} className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${index % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}>
                  <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                    <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${video.id}?list=PLR3RRL-DsOuh8rCEr6WHsb5otlEWqinZz`}
                        title={video.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    </div>
                  </div>
                  <div className={index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}>
                    <Badge className="mb-4 bg-omni-blue/10 text-omni-blue">
                      {video.category}
                    </Badge>
                    <h3 className="font-heading font-bold text-2xl mb-4">{video.title}</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">{video.description}</p>
                    <div className="flex items-center gap-4">
                      <Button className="bg-omni-violet hover:bg-omni-indigo text-white">
                        <Play className="w-4 h-4 mr-2" />
                        Watch Now
                      </Button>
                      <Button variant="outline">
                        Share Episode
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Quote Section */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Quote className="h-12 w-12 text-omni-orange mx-auto mb-6" />
              <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-6">
                Share Your <span className="text-omni-orange">Wisdom</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Inspired by our conversations? Share a quote or insight that has transformed your own journey. 
                We feature the best submissions in our community newsletter.
              </p>
            </div>

            <Card className="max-w-2xl mx-auto shadow-xl">
              <CardHeader>
                <CardTitle className="text-center">Submit Your Inspirational Quote</CardTitle>
                <CardDescription className="text-center">
                  Help inspire others in our community with your wisdom
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleQuoteSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Your Inspirational Quote</label>
                    <Textarea
                      placeholder="Share a quote, insight, or piece of wisdom that has impacted your journey..."
                      value={quoteText}
                      onChange={(e) => setQuoteText(e.target.value)}
                      rows={4}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Your Name (or "Anonymous")</label>
                    <Input
                      placeholder="How would you like to be credited?"
                      value={quoteAuthor}
                      onChange={(e) => setQuoteAuthor(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-omni-orange hover:bg-omni-red text-white">
                    <Zap className="w-4 h-4 mr-2" />
                    Share Your Wisdom
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 bg-gradient-to-br from-omni-violet to-omni-indigo text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl mb-6">
              Ready to Join Our <span className="text-omni-yellow">Community</span>?
            </h2>
            <p className="text-lg text-violet-100 mb-8 max-w-2xl mx-auto">
              Don't miss out on weekly conversations that could transform your perspective, 
              business, and impact in your community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-white text-omni-violet hover:bg-gray-100 font-bold px-8 py-3 text-lg rounded-full shadow-lg">
                🎧 Subscribe Free Now
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-omni-violet font-semibold px-8 py-3 text-lg rounded-full">
                📱 Follow on Social
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Podcast;
