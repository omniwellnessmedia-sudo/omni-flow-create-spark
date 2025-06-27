
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const VideoShowcaseSection = () => {
  const videos = [
    {
      id: "ZOoaiV-IiiU",
      title: "The conscious content creators - Omni Wellness Media",
      description: "Discover our mission and approach to conscious content creation"
    },
    {
      id: "KuusruAQeT4", 
      title: "Uniting for Our Baboons – A Shared Mission",
      description: "Community conservation efforts and wildlife protection"
    },
    {
      id: "QQfOKeZdZmM",
      title: "A legacy beyond financial success : Cheryl-Lynn from Mzansi Business Services", 
      description: "Inspiring stories of business success and community impact"
    },
    {
      id: "o0OwJHp2Fms",
      title: "Indigenous Tour Intro Kalk Bay",
      description: "Cultural heritage and indigenous wisdom sharing"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl mb-6">
            Our <span className="bg-rainbow-gradient bg-clip-text text-transparent">Stories</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Watch our latest videos showcasing conscious content, community impact, and the real stories that drive positive change.
          </p>
          <Button 
            variant="outline" 
            className="border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
            onClick={() => window.open('https://www.youtube.com/channel/UC9xAQa9QquyE4Glsy1zmpRQ', '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Visit Our YouTube Channel
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {videos.map((video, index) => (
            <Card 
              key={video.id}
              className="hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in-up border-0 overflow-hidden"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CardContent className="p-0">
                <div className="aspect-video bg-gray-100 relative group">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${video.id}`}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-heading font-semibold text-lg mb-2 text-gray-800">
                    {video.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {video.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoShowcaseSection;
