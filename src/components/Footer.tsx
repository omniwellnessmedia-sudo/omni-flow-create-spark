import { Link } from "react-router-dom";
import { useState } from "react";
import { ChevronUp, Mail, Calendar, MessageCircle, Instagram, Youtube, Heart, Lightbulb, BookOpen, Users, Share2, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IMAGES } from "@/lib/images";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const OMNI_QR_CODE_URL = "https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/partner-logos**%20(Brand%20Assets)/omniwellnessmedia.png";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    setIsSubscribing(true);
    try {
      const { error } = await supabase.functions.invoke('subscribe-newsletter', {
        body: {
          email,
          source: 'footer',
          interests: ['wellness', 'conscious-content', 'community']
        }
      });
      if (error) throw error;
      toast.success("Subscribed!", { description: "Welcome to our wellness community!" });
      setEmail("");
    } catch (error) {
      console.error('Newsletter error:', error);
      toast.error("Couldn't subscribe", { description: "Please try again later." });
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleShareQR = async () => {
    const shareData = {
      title: 'Omni Wellness Media',
      text: 'Connect with Omni Wellness Media - Bridging Wellness, Outreach & Media',
      url: 'https://linktr.ee/omniwellnessmedia'
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled or error
        copyLinktreeLink();
      }
    } else {
      copyLinktreeLink();
    }
  };

  const copyLinktreeLink = () => {
    navigator.clipboard.writeText('https://linktr.ee/omniwellnessmedia');
    toast.success('Linktree link copied to clipboard!');
  };

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white mt-16 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 opacity-30"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.1),transparent_70%)]"></div>
      
      <div className="relative container-width py-16">
        {/* Newsletter Spotlight */}
        <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-8 mb-16 border border-white/10 backdrop-blur-sm">
          <div className="text-center max-w-2xl mx-auto">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-to-r from-primary to-secondary rounded-full">
                <Heart className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="font-heading text-2xl font-bold mb-3">
              Join Our <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-bold">Wellness Community</span>
            </h3>
            <p className="text-gray-300 mb-6">
              Get weekly wellness tips, conscious content insights, and be the first to know about our transformative projects.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <Input 
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 flex-1"
                disabled={isSubscribing}
              />
              <Button 
                type="submit"
                size="lg" 
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-medium"
                disabled={isSubscribing}
              >
                {isSubscribing ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Mail className="w-4 h-4 mr-2" />
                )}
                {isSubscribing ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
            <div className="mt-4">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
                <Link to="/contact">
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Consultation
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative">
                <img src={IMAGES.logos.omniPrimary} alt="Omni Wellness Media" className="h-16 w-16 rounded-full border-2 border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-secondary to-accent opacity-20 animate-pulse"></div>
              </div>
              <div>
                <h3 className="font-heading font-bold text-xl text-white mb-1">
                  Omni Wellness Media
                </h3>
                <p className="text-primary font-medium text-sm">Conscious Content Creation</p>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6 leading-relaxed text-sm">
              Bridging wellness, outreach & media to empower South Africa's journey to health & consciousness.
            </p>

            {/* Wellness Mission Highlights */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <Lightbulb className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm text-gray-300">Conscious Content</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/20 rounded-lg">
                  <Users className="w-4 h-4 text-secondary" />
                </div>
                <span className="text-sm text-gray-300">Community Empowerment</span>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="flex flex-wrap gap-3">
              <a
                href="https://www.instagram.com/omniwellnessmedia/"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-3 bg-white/10 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 rounded-full transition-all duration-300 hover:scale-110 border border-white/20"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a
                href="https://www.youtube.com/watch?v=ZOoaiV-IiiU"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-3 bg-white/10 hover:bg-red-600 rounded-full transition-all duration-300 hover:scale-110 border border-white/20"
                aria-label="Subscribe to our YouTube"
              >
                <Youtube className="w-5 h-5 text-white" />
              </a>
              <a
                href="https://whatsapp.com/channel/0029VbAwPluA89MadCKPxE1y"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-3 bg-white/10 hover:bg-green-600 rounded-full transition-all duration-300 hover:scale-110 border border-white/20"
                aria-label="Join our WhatsApp Channel"
              >
                <MessageCircle className="w-5 h-5 text-white" />
              </a>
              <a
                href="https://x.com/Omniwellmedia"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-3 bg-white/10 hover:bg-black rounded-full transition-all duration-300 hover:scale-110 border border-white/20"
                aria-label="Follow us on X"
              >
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Services & Solutions */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-6 text-white flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
              Services & Solutions
            </h3>
            <ul className="space-y-3">
              <li><Link to="/services/business-consulting" className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 block">
                Business Development
              </Link></li>
              <li><Link to="/services/media-production" className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 block">
                Media Production
              </Link></li>
              <li><Link to="/services/social-media-strategy" className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 block">
                Social Media Strategy
              </Link></li>
              <li><Link to="/services/web-development" className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 block">
                Web Development
              </Link></li>
              <li><Link to="/ai-tools" className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 block">
                AI Wellness Tools
              </Link></li>
            </ul>
          </div>

          {/* Wellness Resources */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-6 text-white flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-secondary to-accent rounded-full"></div>
              Wellness Resources
            </h3>
            <ul className="space-y-3">
              <li><Link to="/podcast" className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 block flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-white/70" />
                Wellness Podcast
              </Link></li>
              <li><Link to="/wellness-community" className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 block flex items-center gap-2">
                <Users className="w-4 h-4 text-white/70" />
                Community
              </Link></li>
              <li><Link to="/tours-retreats" className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 block flex items-center gap-2">
                <Heart className="w-4 h-4 text-white/70" />
                Tours & Retreats
              </Link></li>
              <li><Link to="/twobewellshop" className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 block flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-white/70" />
                2BeWell Shop
              </Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 block">
                Our Story
              </Link></li>
            </ul>
          </div>

          {/* Connect With Us - QR Code & Linktree */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-6 text-white flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-accent to-primary rounded-full"></div>
              Connect With Us
            </h3>
            
            {/* QR Code */}
            <div className="bg-white rounded-xl p-4 mb-4 inline-block">
              <img 
                src={OMNI_QR_CODE_URL} 
                alt="Omni Wellness Media QR Code" 
                className="w-32 h-32 object-contain"
              />
            </div>
            
            <p className="text-gray-400 text-xs mb-4">Scan to connect with us</p>
            
            {/* Share & Linktree Buttons */}
            <div className="space-y-3">
              <a
                href="https://linktr.ee/omniwellnessmedia"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium w-full justify-center"
              >
                <ExternalLink className="w-4 h-4" />
                Visit Our Linktree
              </a>
              
              <Button 
                onClick={handleShareQR}
                variant="outline" 
                size="sm"
                className="w-full border-white/30 text-white hover:bg-white/10"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Our Links
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">© 2025 Omni Wellness Media. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy-policy" className="text-gray-300 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="text-gray-300 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Floating Back to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 left-6 p-3 bg-gradient-to-r from-primary to-secondary text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-40"
        aria-label="Back to top"
      >
        <ChevronUp className="w-5 h-5" />
      </button>
    </footer>
  );
};

export default Footer;
