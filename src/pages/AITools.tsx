
import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const AITools = () => {
  const [contentInput, setContentInput] = useState("");
  const [brandInput, setBrandInput] = useState("");
  const [wellnessAnswers, setWellnessAnswers] = useState({
    sleep: "",
    stress: "",
    exercise: "",
    nutrition: ""
  });
  const { toast } = useToast();

  const handleContentGenerate = () => {
    toast({
      title: "Content Generated!",
      description: "Your wellness-focused content has been created based on your input.",
    });
  };

  const handleWellnessAssess = () => {
    toast({
      title: "Assessment Complete!",
      description: "Your personalized wellness recommendations are ready.",
    });
  };

  const handleBrandAnalyze = () => {
    toast({
      title: "Brand Analysis Complete!",
      description: "Your brand voice analysis and recommendations are ready.",
    });
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-white via-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl mb-6">
              AI-Powered <span className="bg-rainbow-gradient bg-clip-text text-transparent">Tools</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Harness the power of artificial intelligence to enhance your content creation, 
              assess wellness needs, and optimize your brand strategy.
            </p>
          </div>
        </section>

        {/* AI Tools */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="content">Content Creator</TabsTrigger>
                <TabsTrigger value="wellness">Wellness Assessment</TabsTrigger>
                <TabsTrigger value="brand">Brand Voice Analyzer</TabsTrigger>
              </TabsList>

              <TabsContent value="content">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">✨</span>
                      Content Creator
                    </CardTitle>
                    <CardDescription>
                      Generate inspiring, wellness-focused content tailored to your brand and audience.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="content-topic">Content Topic or Theme</Label>
                      <Input
                        id="content-topic"
                        placeholder="e.g., Mindful morning routines, Community wellness, Sustainable living"
                        value={contentInput}
                        onChange={(e) => setContentInput(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="content-details">Additional Details</Label>
                      <Textarea
                        id="content-details"
                        placeholder="Provide more context about your target audience, tone, or specific requirements..."
                        className="min-h-[100px]"
                      />
                    </div>
                    <Button 
                      onClick={handleContentGenerate}
                      className="w-full bg-gradient-to-r from-omni-red to-omni-orange hover:opacity-90 text-white"
                    >
                      Generate Content
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="wellness">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">🌱</span>
                      Wellness Assessment
                    </CardTitle>
                    <CardDescription>
                      Get personalized wellness recommendations based on your current lifestyle and goals.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="sleep">How would you rate your sleep quality? (1-10)</Label>
                      <Input
                        id="sleep"
                        type="number"
                        min="1"
                        max="10"
                        value={wellnessAnswers.sleep}
                        onChange={(e) => setWellnessAnswers({...wellnessAnswers, sleep: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="stress">How would you rate your stress levels? (1-10)</Label>
                      <Input
                        id="stress"
                        type="number"
                        min="1"
                        max="10"
                        value={wellnessAnswers.stress}
                        onChange={(e) => setWellnessAnswers({...wellnessAnswers, stress: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="exercise">How many days per week do you exercise?</Label>
                      <Input
                        id="exercise"
                        type="number"
                        min="0"
                        max="7"
                        value={wellnessAnswers.exercise}
                        onChange={(e) => setWellnessAnswers({...wellnessAnswers, exercise: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="nutrition">Describe your current eating habits</Label>
                      <Textarea
                        id="nutrition"
                        placeholder="e.g., Mostly plant-based, occasional fast food, trying to eat healthier..."
                        value={wellnessAnswers.nutrition}
                        onChange={(e) => setWellnessAnswers({...wellnessAnswers, nutrition: e.target.value})}
                      />
                    </div>
                    <Button 
                      onClick={handleWellnessAssess}
                      className="w-full bg-gradient-to-r from-omni-green to-omni-blue hover:opacity-90 text-white"
                    >
                      Get Wellness Assessment
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="brand">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">🎯</span>
                      Brand Voice Analyzer
                    </CardTitle>
                    <CardDescription>
                      Analyze your brand's voice and get recommendations to better connect with your audience.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="brand-name">Brand Name</Label>
                      <Input
                        id="brand-name"
                        placeholder="Your brand or company name"
                        value={brandInput}
                        onChange={(e) => setBrandInput(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="brand-description">Brand Description</Label>
                      <Textarea
                        id="brand-description"
                        placeholder="Describe your brand, mission, values, and target audience..."
                        className="min-h-[100px]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="sample-content">Sample Content</Label>
                      <Textarea
                        id="sample-content"
                        placeholder="Paste some of your existing content (social media posts, website copy, etc.)"
                        className="min-h-[100px]"
                      />
                    </div>
                    <Button 
                      onClick={handleBrandAnalyze}
                      className="w-full bg-gradient-to-r from-omni-indigo to-omni-violet hover:opacity-90 text-white"
                    >
                      Analyze Brand Voice
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-6">
                Why Our <span className="bg-rainbow-gradient bg-clip-text text-transparent">AI Tools</span>?
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center border-0 bg-white shadow-lg">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">🚀</div>
                  <h3 className="font-heading font-semibold text-xl mb-2">Fast & Efficient</h3>
                  <p className="text-gray-600">Get professional-quality results in minutes, not hours.</p>
                </CardContent>
              </Card>
              <Card className="text-center border-0 bg-white shadow-lg">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">🎯</div>
                  <h3 className="font-heading font-semibold text-xl mb-2">Wellness-Focused</h3>
                  <p className="text-gray-600">Tailored specifically for wellness and conscious brands.</p>
                </CardContent>
              </Card>
              <Card className="text-center border-0 bg-white shadow-lg">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">💡</div>
                  <h3 className="font-heading font-semibold text-xl mb-2">Actionable Insights</h3>
                  <p className="text-gray-600">Get practical recommendations you can implement immediately.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AITools;
