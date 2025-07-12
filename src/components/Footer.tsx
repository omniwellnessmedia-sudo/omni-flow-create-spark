
import { Link } from "react-router-dom";
import { ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 text-white section-large">
      <div className="container-width">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative">
                <img 
                  src="/lovable-uploads/9d9ecf28-f102-4674-949b-c09c14479f21.png" 
                  alt="Omni Wellness Media" 
                  className="h-16 w-16 rounded-full border-2 border-rainbow-gradient p-1 bg-white"
                />
                <div className="absolute inset-0 rounded-full bg-rainbow-gradient opacity-20 animate-pulse"></div>
              </div>
              <div>
                <span className="font-heading font-bold text-xl bg-rainbow-gradient bg-clip-text text-transparent block">
                  Omni Wellness Media
                </span>
                <span className="text-gray-400 text-sm">Conscious Content • Community Impact</span>
              </div>
            </div>
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              Empowering communities through conscious content creation, business development, 
              and holistic wellness solutions. Creating positive change from South Africa to the world.
            </p>
            
            {/* Contact Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <a 
                href="mailto:omnimediawellness@gmail.com" 
                className="bg-rainbow-gradient text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity duration-300 text-center text-sm"
              >
                📧 Email Us
              </a>
              <a 
                href="/contact" 
                className="border border-gray-600 text-gray-300 px-6 py-3 rounded-full font-semibold hover:bg-gray-800 hover:text-white transition-all duration-300 text-center text-sm"
              >
                📅 Book Consultation
              </a>
            </div>
            
            {/* Social Links */}
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
            <h3 className="font-heading font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/services" className="text-gray-300 hover:text-white transition-colors">Services</Link></li>
              <li><Link to="/portfolio" className="text-gray-300 hover:text-white transition-colors">Portfolio</Link></li>
              <li><Link to="/ai-tools" className="text-gray-300 hover:text-white transition-colors">AI Tools</Link></li>
            </ul>
          </div>

          {/* Content */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Content</h3>
            <ul className="space-y-2">
              <li><Link to="/blog" className="text-gray-300 hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/podcast" className="text-gray-300 hover:text-white transition-colors">Podcast</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link></li>
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
