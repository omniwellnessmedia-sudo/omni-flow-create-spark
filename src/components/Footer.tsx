import { Link } from "react-router-dom";
import { ChevronUp, Mail, Calendar, MessageCircle, Facebook, Instagram, Linkedin, Youtube, Heart, Lightbulb, BookOpen, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  return <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white mt-16 overflow-hidden">
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
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-medium" asChild>
                <a href="mailto:omnimediawellness@gmail.com?subject=Newsletter Subscription">
                  <Mail className="w-4 h-4 mr-2" />
                  Subscribe to Newsletter
                </a>
              </Button>
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
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative">
                <img src="/images/logos/omni logo.png" alt="Omni Wellness Media" className="h-20 w-20 rounded-full border-2 border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-secondary to-accent opacity-20 animate-pulse"></div>
              </div>
              <div>
                <h3 className="font-heading font-bold text-2xl text-white mb-1">
                  Omni Wellness Media
                </h3>
                <p className="text-primary font-medium">Conscious Content Creation</p>
              </div>
            </div>
            
            <p className="text-gray-300 mb-8 max-w-md leading-relaxed text-lg">
              Bridging wellness, outreach & media to empower South Africa's journey to health & consciousness. 
              Creating positive change through conscious content and sustainable solutions.
            </p>

            {/* Wellness Mission Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <Lightbulb className="w-4 h-4 text-primary bg-white" />
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

            {/* Social Media with proper icons */}
            <div className="flex justify-center space-x-4">
              <a
                href="https://facebook.com/omniwellnessmedia"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 hover:scale-110 border border-white/20"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="w-5 h-5 text-white group-hover:text-blue-300 transition-colors" />
                <span className="sr-only">Facebook</span>
              </a>
              <a
                href="https://instagram.com/omniwellnessmedia"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 hover:scale-110 border border-white/20"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-5 h-5 text-white group-hover:text-pink-300 transition-colors" />
                <span className="sr-only">Instagram</span>
              </a>
              <a
                href="https://linkedin.com/company/omni-wellness-media"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 hover:scale-110 border border-white/20"
                aria-label="Connect with us on LinkedIn"
              >
                <Linkedin className="w-5 h-5 text-white group-hover:text-blue-300 transition-colors" />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a
                href="https://youtube.com/@omniwellnessmedia"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 hover:scale-110 border border-white/20"
                aria-label="Subscribe to our YouTube channel"
              >
                <Youtube className="w-5 h-5 text-white group-hover:text-red-300 transition-colors" />
                <span className="sr-only">YouTube</span>
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
              <li><Link to="/blog" className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 block flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-white/70 hover:text-white transition-colors" />
                Wellness Blog
              </Link></li>
              <li><Link to="/podcast" className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 block flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-white/70 hover:text-white transition-colors" />
                Wellness Podcast
              </Link></li>
              <li><Link to="/wellness-community" className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 block flex items-center gap-2">
                <Users className="w-4 h-4 text-white/70 hover:text-white transition-colors" />
                Community
              </Link></li>
              <li><Link to="/tours-retreats" className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 block flex items-center gap-2">
                <Heart className="w-4 h-4 text-white/70 hover:text-white transition-colors" />
                Tours & Retreats
              </Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 block">
                Our Story
              </Link></li>
            </ul>
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

          {/* Back to Top - Mobile Only */}
          <div className="flex justify-center mt-8 md:hidden">
            <Button onClick={scrollToTop} variant="outline" size="sm" className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white card-button-standard">
              <ChevronUp className="w-4 h-4 mr-2" />
              Back to Top
            </Button>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;