
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const AIToolsPreview = () => {
  const tools = [
    {
      title: "Content Creator",
      description: "Generate inspiring, wellness-focused content for your brand with AI assistance.",
      icon: "✨",
      color: "from-omni-red to-omni-orange"
    },
    {
      title: "Wellness Assessment",
      description: "Personalized wellness evaluation and recommendations for holistic health.",
      icon: "🌱",
      color: "from-omni-green to-omni-blue"
    },
    {
      title: "Brand Voice Analyzer",
      description: "Analyze and refine your brand's voice to resonate with your target audience.",
      icon: "🎯",
      color: "from-omni-indigo to-omni-violet"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl mb-6">
            AI-Powered <span className="bg-rainbow-gradient bg-clip-text text-transparent">Tools</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Leverage cutting-edge AI technology to enhance your content creation, 
            assess wellness needs, and optimize your brand strategy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {tools.map((tool, index) => (
            <Card 
              key={tool.title}
              className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up border-0 overflow-hidden"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className={`h-2 bg-gradient-to-r ${tool.color}`}></div>
              <CardHeader className="text-center">
                <div className="text-4xl mb-4">{tool.icon}</div>
                <CardTitle className="font-heading text-xl mb-2">{tool.title}</CardTitle>
                <CardDescription className="text-gray-600">{tool.description}</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button 
                  variant="outline" 
                  className="w-full border-gray-200 hover:bg-rainbow-subtle"
                  asChild
                >
                  <Link to="/ai-tools">Try Now</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button asChild size="lg" className="bg-rainbow-gradient hover:opacity-90 text-white font-semibold px-8 py-3 text-lg rounded-full shadow-lg">
            <Link to="/ai-tools">Explore All AI Tools</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AIToolsPreview;
