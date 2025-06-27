
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const AIToolsPreview = () => {
  const tools = [
    {
      title: "Community Impact Calculator",
      description: "Calculate and visualize the potential impact of your wellness initiatives on communities.",
      icon: "🌍",
      color: "from-omni-green to-omni-blue",
      features: ["ROI measurement", "Community reach analytics", "Impact visualization"]
    },
    {
      title: "Content Strategy Generator",
      description: "Generate comprehensive content strategies aligned with your brand's wellness mission.",
      icon: "✨",
      color: "from-omni-red to-omni-orange",
      features: ["Multi-platform planning", "Audience targeting", "Engagement optimization"]
    },
    {
      title: "Wellness Assessment Pro",
      description: "Advanced wellness evaluation tool for individuals and organizations with personalized recommendations.",
      icon: "🌱",
      color: "from-omni-yellow to-omni-green",
      features: ["Holistic health analysis", "Custom action plans", "Progress tracking"]
    },
    {
      title: "Brand Consciousness Analyzer",
      description: "Evaluate how well your brand aligns with conscious business practices and social impact.",
      icon: "🎯",
      color: "from-omni-indigo to-omni-violet",
      features: ["Sustainability scoring", "Social impact metrics", "Improvement roadmap"]
    },
    {
      title: "Lead Magnet Creator",
      description: "Design compelling lead magnets specifically for wellness and conscious business audiences.",
      icon: "🧲",
      color: "from-omni-orange to-omni-red",
      features: ["Template library", "Conversion optimization", "A/B testing"]
    },
    {
      title: "Storytelling Impact Tool",
      description: "Craft powerful stories that highlight the contrast between privilege and poverty to spark awareness.",
      icon: "📖",
      color: "from-omni-blue to-omni-indigo",
      features: ["Narrative frameworks", "Emotional impact scoring", "Engagement prediction"]
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl mb-6">
            AI-Powered <span className="bg-rainbow-gradient bg-clip-text text-transparent">Tools</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Leverage cutting-edge AI technology designed specifically for conscious brands, 
            wellness organizations, and social impact initiatives.
          </p>
          <div className="inline-flex items-center gap-2 bg-rainbow-subtle px-4 py-2 rounded-full">
            <span className="text-sm font-medium text-gray-700">🚀 Free Tools Available</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {tools.map((tool, index) => (
            <Card 
              key={tool.title}
              className="hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in-up border-0 overflow-hidden group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`h-2 bg-gradient-to-r ${tool.color} group-hover:h-3 transition-all duration-300`}></div>
              <CardHeader className="text-center pb-4">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{tool.icon}</div>
                <CardTitle className="font-heading text-xl mb-3 group-hover:text-transparent group-hover:bg-rainbow-gradient group-hover:bg-clip-text transition-all duration-300">
                  {tool.title}
                </CardTitle>
                <CardDescription className="text-gray-600 leading-relaxed">{tool.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Key Features:</p>
                  <ul className="space-y-1">
                    {tool.features.map((feature, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-center">
                        <span className="w-1.5 h-1.5 bg-rainbow-gradient rounded-full mr-2"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full border-gray-200 hover:bg-rainbow-subtle hover:border-transparent group-hover:shadow-md transition-all duration-300"
                  asChild
                >
                  <Link to="/ai-tools">Try Free Now</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center space-y-4">
          <Button asChild size="lg" className="bg-rainbow-gradient hover:opacity-90 text-white font-semibold px-12 py-4 text-lg rounded-full shadow-xl transform hover:scale-105 transition-all duration-300">
            <Link to="/ai-tools">Explore All AI Tools</Link>
          </Button>
          <p className="text-sm text-gray-500">No signup required • Instant results • Lead generation ready</p>
        </div>
      </div>
    </section>
  );
};

export default AIToolsPreview;
