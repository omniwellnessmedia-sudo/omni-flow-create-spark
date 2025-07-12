
import { Link } from "react-router-dom";
import { ChevronUp, Mail, Calendar, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container-width">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative">
                <img 
                  src="/lovable-uploads/9d9ecf28-f102-4674-949b-c09c14479f21.png" 
                  alt="Omni Wellness Media" 
                  className="h-16 w-16 rounded-full border-2 border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105"
                />
                <div className="absolute inset-0 rounded-full bg-rainbow-gradient opacity-20 animate-pulse"></div>
              </div>
              <div>
                <span className="font-heading font-bold text-xl bg-rainbow-gradient bg-clip-text text-transparent block">
                  Omni Wellness Media
                </span>
                <span className="text-gray-400 text-sm">Conscious Content Creation</span>
              </div>
            </div>
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              Empowering communities through conscious content creation, business development, 
              and holistic wellness solutions. Creating positive change from South Africa to the world.
            </p>

            {/* Contact Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Button 
                size="sm"
                className="bg-omni-violet hover:bg-omni-violet/90 text-white font-medium"
                asChild
              >
                <a href="mailto:omnimediawellness@gmail.com">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Us
                </a>
              </Button>
              <Button 
                size="sm"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
                asChild
              >
                <Link to="/contact">
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Appointment
                </Link>
              </Button>
            </div>

            {/* Chat/Subscribe Feature */}
            <div className="bg-gray-800 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle className="w-4 h-4 text-omni-blue" />
                <h4 className="font-semibold text-white">Stay Connected</h4>
              </div>
              <p className="text-gray-400 text-sm mb-3">
                Subscribe for wellness tips and project updates
              </p>
              <a 
                href="mailto:omnimediawellness@gmail.com?subject=Newsletter Subscription"
                className="text-omni-blue hover:text-omni-blue/80 text-sm font-medium transition-colors"
              >
                Subscribe to Newsletter →
              </a>
            </div>

            {/* Social Media */}
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-800">
                <span className="sr-only">Facebook</span>
                📘
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-800">
                <span className="sr-only">Instagram</span>
                📷
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-800">
                <span className="sr-only">LinkedIn</span>
                💼
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-800">
                <span className="sr-only">YouTube</span>
                📺
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-6 text-white">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 block">About Us</Link></li>
              <li><Link to="/services" className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 block">Services</Link></li>
              <li><Link to="/portfolio" className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 block">Portfolio</Link></li>
              <li><Link to="/ai-tools" className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 block">AI Tools</Link></li>
            </ul>
          </div>

          {/* Content & Resources */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-6 text-white">Content & Resources</h3>
            <ul className="space-y-3">
              <li><Link to="/blog" className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 block">Blog</Link></li>
              <li><Link to="/podcast" className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 block">Podcast</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 block">Contact</Link></li>
              <li>
                <a 
                  href="mailto:omnimediawellness@gmail.com" 
                  className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 block"
                >
                  Direct Email
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Omni Wellness Media. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </a>
            </div>
          </div>

          {/* Back to Top - Mobile Only */}
          <div className="flex justify-center mt-8 md:hidden">
            <Button
              onClick={scrollToTop}
              variant="outline"
              size="sm"
              className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white card-button-standard"
            >
              <ChevronUp className="w-4 h-4 mr-2" />
              Back to Top
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
