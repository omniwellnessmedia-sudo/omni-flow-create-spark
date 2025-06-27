
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Podcast = () => {
  const episodes = [
    {
      title: "Building Bridges: Community Stories from Cape Town",
      description: "A heartfelt conversation with local community leaders about creating sustainable change from the ground up.",
      duration: "45 min",
      date: "December 20, 2024",
      season: "Season 1",
      episode: "Episode 12",
      topics: ["Community Development", "Leadership", "Social Change"]
    },
    {
      title: "Traditional Healing Meets Modern Wellness",
      description: "Exploring the intersection of indigenous wisdom and contemporary health practices with Dr. Thandiwe Mthembu.",
      duration: "38 min", 
      date: "December 13, 2024",
      season: "Season 1",
      episode: "Episode 11",
      topics: ["Traditional Medicine", "Holistic Health", "Cultural Heritage"]
    },
    {
      title: "Youth Voices: The Future of Conscious Media",
      description: "Young content creators share their vision for authentic storytelling and community engagement.",
      duration: "42 min",
      date: "December 6, 2024",
      season: "Season 1", 
      episode: "Episode 10",
      topics: ["Youth Empowerment", "Digital Media", "Storytelling"]
    },
    {
      title: "Sustainable Business in South Africa",
      description: "Entrepreneurs discuss building businesses that prioritize people and planet alongside profit.",
      duration: "50 min",
      date: "November 29, 2024",
      season: "Season 1",
      episode: "Episode 9", 
      topics: ["Sustainable Business", "Entrepreneurship", "Social Impact"]
    },
    {
      title: "The Art of Authentic Storytelling",
      description: "Documentary filmmakers and photographers share insights on capturing truth and creating emotional connections.",
      duration: "36 min",
      date: "November 22, 2024",
      season: "Season 1",
      episode: "Episode 8",
      topics: ["Documentary", "Photography", "Authentic Content"]
    },
    {
      title: "Mental Health in Our Communities",
      description: "A candid discussion about mental wellness, breaking stigma, and creating supportive community networks.",
      duration: "48 min",
      date: "November 15, 2024",
      season: "Season 1",
      episode: "Episode 7",
      topics: ["Mental Health", "Community Support", "Wellness"]
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-white via-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl mb-6">
              Omni Wellness <span className="bg-rainbow-gradient bg-clip-text text-transparent">Podcast</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-4xl mx-auto">
              Conversations that matter. Join us as we explore stories of transformation, 
              wisdom from our communities, and insights that inspire positive change.
            </p>
            
            {/* Podcast Player Placeholder */}
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8 mb-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-rainbow-gradient rounded-lg flex items-center justify-center">
                  <span className="text-white text-2xl">🎧</span>
                </div>
                <div className="text-left">
                  <h3 className="font-heading font-semibold text-lg">Latest Episode</h3>
                  <p className="text-gray-600 text-sm">Building Bridges: Community Stories from Cape Town</p>
                </div>
              </div>
              <div className="bg-gray-100 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>00:00</span>
                  <span>45:32</span>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-2">
                  <div className="bg-rainbow-gradient h-2 rounded-full w-1/3"></div>
                </div>
              </div>
              <div className="flex justify-center gap-4">
                <Button size="sm" variant="outline">⏮️</Button>
                <Button size="lg" className="bg-rainbow-gradient hover:opacity-90 text-white">▶️ Play</Button>
                <Button size="sm" variant="outline">⏭️</Button>
              </div>
            </div>
          </div>
        </section>

        {/* About the Podcast */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-6">
                  About Our <span className="bg-rainbow-gradient bg-clip-text text-transparent">Podcast</span>
                </h2>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  The Omni Wellness Podcast is a platform for authentic conversations about community, 
                  wellness, and positive change. We feature voices from across South Africa and beyond, 
                  sharing stories that inspire and educate.
                </p>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Each episode explores different aspects of our content pillars: Inspiration, Education, 
                  Empowerment, and Wellness, bringing you insights from community leaders, healers, 
                  entrepreneurs, and change-makers.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button variant="outline" className="border-omni-indigo text-omni-indigo hover:bg-omni-indigo hover:text-white">
                    🎵 Spotify
                  </Button>
                  <Button variant="outline" className="border-omni-green text-omni-green hover:bg-omni-green hover:text-white">
                    🎧 Apple Podcasts
                  </Button>
                  <Button variant="outline" className="border-omni-red text-omni-red hover:bg-omni-red hover:text-white">
                    📺 YouTube
                  </Button>
                </div>
              </div>
              <div>
                <img 
                  src="/lovable-uploads/ae84052e-02fe-4443-9a9f-63f094e6a81e.png"
                  alt="Podcast recording session"
                  className="w-full h-80 object-cover rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Episodes */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-6">
                Recent <span className="bg-rainbow-gradient bg-clip-text text-transparent">Episodes</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Catch up on our latest conversations and discover insights that matter to your community.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {episodes.map((episode, index) => (
                <Card 
                  key={episode.title}
                  className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up cursor-pointer border-0 shadow-md"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-omni-indigo">
                        {episode.season} • {episode.episode}
                      </span>
                      <span className="text-sm text-gray-500">{episode.duration}</span>
                    </div>
                    <CardTitle className="font-heading text-xl mb-2 hover:text-omni-indigo transition-colors">
                      {episode.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 leading-relaxed mb-4">
                      {episode.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-gray-500">{episode.date}</span>
                      <Button size="sm" className="bg-rainbow-gradient hover:opacity-90 text-white">
                        ▶️ Listen
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {episode.topics.map((topic) => (
                        <span 
                          key={topic}
                          className="text-xs px-2 py-1 bg-rainbow-subtle rounded-full text-gray-700"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Subscribe Section */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-6">
              Never Miss an <span className="bg-rainbow-gradient bg-clip-text text-transparent">Episode</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Subscribe to the Omni Wellness Podcast and be the first to hear our latest conversations 
              about community, wellness, and positive change.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-rainbow-gradient hover:opacity-90 text-white font-semibold px-8 py-3 text-lg rounded-full shadow-lg">
                🔔 Subscribe Now
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-omni-indigo text-omni-indigo hover:bg-omni-indigo hover:text-white font-semibold px-8 py-3 text-lg rounded-full shadow-lg">
                📧 Get Updates
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
