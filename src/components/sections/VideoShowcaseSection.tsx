
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, ExternalLink } from "lucide-react";

const VideoShowcaseSection = () => {
  const [selectedVideo, setSelectedVideo] = useState(0);

  const videos = [
    {
      id: "ZOoaiV-IiiU",
      title: "The conscious content creators - Omni Wellness Media",
      description: "Discover our mission and approach to conscious content creation",
      thumbnail: "https://img.youtube.com/vi/ZOoaiV-IiiU/maxresdefault.jpg"
    },
    {
      id: "KuusruAQeT4",
      title: "Uniting for Our Baboons – A Shared Mission",
      description: "Community conservation efforts and wildlife protection",
      thumbnail: "https://img.youtube.com/vi/KuusruAQeT4/maxresdefault.jpg"
    },
    {
      id: "QQfOKeZdZmM",
      title: "A legacy beyond financial success : Cheryl-Lynn from Mzansi Business Services",
      description: "Inspiring stories of business impact and community development",
      thumbnail: "https://img.youtube.com/vi/QQfOKeZdZmM/maxresdefault.jpg"
    },
    {
      id: "o0OwJHp2Fms",
      title: "Indigenous Tour Intro Kalk Bay",
      description: "Cultural heritage and community storytelling",
      thumbnail: "https://img.youtube.com/vi/o0OwJHp2Fms/maxresdefault.jpg"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="heading-primary text-gradient-hero mb-6">
            Our Story in Motion
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Experience our journey through powerful visual storytelling and authentic community narratives.
          </p>
          <Button 
            asChild 
            variant="outline" 
            className="hover:bg-gradient-rainbow hover:text-white transition-all duration-300"
          >
            <a 
              href="https://www.youtube.com/channel/UC9xAQa9QquyE4Glsy1zmpRQ" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Visit Our YouTube Channel
            </a>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Video Player */}
          <div className="lg:col-span-2">
            <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${videos[selectedVideo].id}`}
                title={videos[selectedVideo].title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            <div className="mt-6">
              <h3 className="font-heading font-bold text-2xl mb-3">{videos[selectedVideo].title}</h3>
              <p className="text-gray-600">{videos[selectedVideo].description}</p>
            </div>
          </div>

          {/* Video Playlist */}
          <div className="space-y-4">
            <h4 className="font-heading font-semibold text-xl mb-4">Featured Videos</h4>
            {videos.map((video, index) => (
              <Card 
                key={video.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  index === selectedVideo ? 'ring-2 ring-rainbow-gradient' : ''
                }`}
                onClick={() => setSelectedVideo(index)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                      <img 
                        src={video.thumbnail} 
                        alt={video.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                        <Play className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-semibold text-sm mb-1 line-clamp-2">{video.title}</h5>
                      <p className="text-xs text-gray-500 line-clamp-2">{video.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoShowcaseSection;
