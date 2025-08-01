import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, Sparkles, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface ChatInterfaceProps {
  className?: string;
  placeholder?: string;
  welcomeMessage?: string;
}

export const ChatInterface = ({ 
  className, 
  placeholder = "Ask Omni AI anything about wellness, services, or your journey...",
  welcomeMessage = "👋 Hi! I'm Omni AI, your conscious wellness guide. How can I help you today?"
}: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      content: welcomeMessage,
      role: "assistant",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: getAIResponse(input),
        role: "assistant",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const getAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes("service") || input.includes("help")) {
      return "I can help you explore our conscious media services, business consulting, wellness programs, and AI tools. What specific area interests you most?";
    }
    if (input.includes("wellness") || input.includes("health")) {
      return "🧘 Wellness is at the heart of everything we do! We offer holistic wellness programs, conscious living guidance, and community connection. Would you like to explore our wellness marketplace or learn about our retreats?";
    }
    if (input.includes("business") || input.includes("consulting")) {
      return "💼 Our business development consulting focuses on sustainable practices and conscious growth. We help with strategy, branding, and aligning your business with wellness principles. Interested in learning more?";
    }
    if (input.includes("media") || input.includes("content")) {
      return "🎥 We create conscious content that inspires positive change - from video production to social media strategy. Our content pillars are Inspiration, Education, Empowerment, and Wellness. What type of content are you looking for?";
    }
    
    return "That's a great question! I'm here to guide you through Omni's conscious wellness ecosystem. Feel free to ask about our services, wellness programs, AI tools, or how we can support your journey. ✨";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className={cn("w-full max-w-4xl mx-auto bg-white/95 backdrop-blur-sm border border-white/20 shadow-xl", className)}>
      <div className="p-6">
        {/* Chat Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative">
            <MessageCircle className="h-8 w-8 text-wellness-primary" />
            <Sparkles className="h-4 w-4 text-wellness-accent absolute -top-1 -right-1" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Omni AI Assistant</h3>
            <p className="text-sm text-gray-600">Your conscious wellness guide</p>
          </div>
        </div>

        {/* Messages */}
        <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-lg px-4 py-2",
                  message.role === "user"
                    ? "bg-wellness-primary text-white"
                    : "bg-gray-100 text-gray-900"
                )}
              >
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg px-4 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="flex-1"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="bg-wellness-primary hover:bg-wellness-primary/90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInput("Tell me about your wellness services")}
            className="text-xs"
          >
            Wellness Services
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInput("How can you help my business?")}
            className="text-xs"
          >
            Business Consulting
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInput("Show me your AI tools")}
            className="text-xs"
          >
            AI Tools
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInput("What content do you create?")}
            className="text-xs"
          >
            Content Creation
          </Button>
        </div>
      </div>
    </Card>
  );
};