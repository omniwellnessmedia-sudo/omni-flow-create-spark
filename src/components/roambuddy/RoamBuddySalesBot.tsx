import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  MessageCircle, 
  X, 
  Send, 
  Loader2, 
  Sparkles,
  Plane,
  Mail,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface RoamBuddySalesBotProps {
  onProductRecommended?: (productId: string) => void;
}

export const RoamBuddySalesBot = ({ onProductRecommended }: RoamBuddySalesBotProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-open after 10 seconds on page if not interacted
  useEffect(() => {
    const timer = setTimeout(() => {
      if (messages.length === 0 && !isOpen) {
        setIsOpen(true);
        // Add welcome message
        setMessages([{
          role: 'assistant',
          content: "Hey there! 👋 I'm Roam, your travel connectivity expert. Planning a trip? I can help you find the perfect eSIM plan to stay connected anywhere in the world. Where are you headed?",
          timestamp: new Date()
        }]);
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await supabase.functions.invoke('roambuddy-sales-chat', {
        body: {
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
          sessionId
        }
      });

      if (response.error) throw response.error;

      const data = response.data;
      
      // Add assistant response
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.message,
        timestamp: new Date()
      }]);

      // Check if we should show email capture
      if (data.showEmailCapture && !emailSubmitted) {
        setShowEmailCapture(true);
      }

      // Track product recommendation
      if (data.productRecommended && onProductRecommended) {
        onProductRecommended(data.productRecommended);
      }

    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having trouble connecting right now. Feel free to browse our eSIM plans directly, or try again in a moment!",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSubmit = async () => {
    if (!email.trim()) return;

    try {
      // Add to newsletter subscribers with lead source
      const { error } = await supabase
        .from('newsletter_subscribers')
        .upsert({
          email: email.trim(),
          source: 'roambuddy-sales-bot',
          interests: ['travel', 'esim', 'connectivity'],
          subscribed_at: new Date().toISOString()
        }, { onConflict: 'email' });

      if (error) throw error;

      // Update chatbot conversation
      await supabase
        .from('chatbot_conversations' as any)
        .upsert({
          session_id: sessionId,
          user_email: email.trim(),
          messages: messages.map(m => ({ role: m.role, content: m.content })),
          lead_captured: true,
          lead_source: 'roambuddy-sales-bot'
        }, { onConflict: 'session_id' });

      // Send notification email to Chad
      try {
        await supabase.functions.invoke('roambuddy-lead-notification', {
          body: {
            email: email.trim(),
            messages: messages.map(m => ({ role: m.role, content: m.content })),
            sessionId,
            capturedAt: new Date().toISOString()
          }
        });
        console.log('Lead notification sent to Chad');
      } catch (notifyError) {
        console.error('Failed to send lead notification:', notifyError);
        // Don't block the user flow if notification fails
      }

      setEmailSubmitted(true);
      setShowEmailCapture(false);
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "🎉 Awesome! You're all set to receive exclusive travel tips and eSIM deals. Check your inbox for a welcome message with a special discount code!",
        timestamp: new Date()
      }]);

      toast.success('Welcome to the RoamBuddy community!');
    } catch (error) {
      console.error('Email submit error:', error);
      toast.error('Failed to save your email. Please try again.');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const openChat = () => {
    setIsOpen(true);
    if (messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: "Hey there! 👋 I'm Roam, your travel connectivity expert. Planning a trip? I can help you find the perfect eSIM plan to stay connected anywhere in the world. Where are you headed?",
        timestamp: new Date()
      }]);
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={openChat}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-105",
          "bg-gradient-to-r from-blue-600 to-blue-700 text-white",
          isOpen && "scale-0 opacity-0"
        )}
        aria-label="Chat with Roam"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="font-medium">Need eSIM help?</span>
        <Sparkles className="h-4 w-4 animate-pulse" />
      </button>

      {/* Chat Window */}
      <div
        className={cn(
          "fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] bg-background rounded-2xl shadow-2xl border border-border overflow-hidden transition-all duration-300",
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
        )}
        style={{ maxHeight: 'calc(100vh - 120px)' }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Plane className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">Roam</h3>
                <p className="text-xs text-white/80">Your Travel Connectivity Expert</p>
              </div>
            </div>
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 h-8 w-8"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="h-[350px] p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex",
                  message.role === 'user' ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-3 text-sm",
                    message.role === 'user'
                      ? "bg-blue-600 text-white rounded-br-md"
                      : "bg-muted text-foreground rounded-bl-md"
                  )}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">Roam is typing...</span>
                  </div>
                </div>
              </div>
            )}

            {/* Email Capture */}
            {showEmailCapture && !emailSubmitted && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl p-4 border border-blue-100 dark:border-blue-900">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Get 10% off your first eSIM!</span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Join our newsletter for exclusive deals and travel tips.
                </p>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="text-sm h-9"
                  />
                  <Button size="sm" onClick={handleEmailSubmit} className="h-9">
                    <Check className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Quick Actions */}
        {messages.length === 1 && (
          <div className="px-4 pb-2">
            <div className="flex flex-wrap gap-2">
              {['Thailand', 'Europe', 'USA', 'Global'].map((dest) => (
                <Badge
                  key={dest}
                  variant="secondary"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => {
                    setInputValue(`I'm traveling to ${dest}`);
                    setTimeout(() => sendMessage(), 100);
                  }}
                >
                  {dest}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about eSIM plans..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              onClick={sendMessage} 
              disabled={!inputValue.trim() || isLoading}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
