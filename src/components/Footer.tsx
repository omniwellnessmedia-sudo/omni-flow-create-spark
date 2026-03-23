import { Link } from "react-router-dom";
import { useState } from "react";
import { Mail, Instagram, Youtube, MessageCircle, Loader2, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IMAGES } from "@/lib/images";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }
    setIsSubscribing(true);
    try {
      const { error } = await supabase.functions.invoke('subscribe-newsletter', {
        body: { email, source: 'footer', interests: ['wellness', 'conscious-content', 'community'] }
      });
      if (error) throw error;
      toast.success("Subscribed!", { description: "Welcome to our wellness community." });
      setEmail("");
    } catch (err) {
      console.error('Newsletter subscription error:', err);
      toast.error("Couldn't subscribe", { description: "Please try again later." });
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="bg-[#1a1a1a] text-white mt-0">
      {/* Newsletter Strip */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6 md:gap-10">
            <div className="flex-1 text-center md:text-left">
              <h3 className="font-heading text-2xl mb-1">Stay Connected</h3>
              <p className="text-white/50 text-sm">Stories, tours, and community updates — no spam.</p>
            </div>
            <form onSubmit={handleSubscribe} className="flex gap-2 w-full md:w-auto">
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 min-w-[220px]"
                disabled={isSubscribing}
              />
              <Button type="submit" className="bg-white text-[#1a1a1a] hover:bg-white/90 font-medium shrink-0" disabled={isSubscribing}>
                {isSubscribing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4 mr-1" />}
                {isSubscribing ? "" : "Subscribe"}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <img
                src={IMAGES.logos.omniPrimary}
                alt="Omni Wellness Media"
                className="h-12 w-12 rounded-full"
              />
              <span className="font-heading text-lg">Omni Wellness</span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed mb-6">
              Bridging wellness, culture, and conscious media from Cape Town to the world.
            </p>
            <div className="flex gap-3">
              <a href="https://www.instagram.com/omniwellnessmedia/" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/5 hover:bg-white/10 rounded-lg transition-colors" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://www.youtube.com/watch?v=ZOoaiV-IiiU" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/5 hover:bg-white/10 rounded-lg transition-colors" aria-label="YouTube">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="https://whatsapp.com/channel/0029VbAwPluA89MadCKPxE1y" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/5 hover:bg-white/10 rounded-lg transition-colors" aria-label="WhatsApp">
                <MessageCircle className="w-4 h-4" />
              </a>
              <a href="https://x.com/Omniwellmedia" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/5 hover:bg-white/10 rounded-lg transition-colors" aria-label="X">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            </div>
          </div>

          {/* Experiences */}
          <div>
            <h4 className="text-xs font-medium uppercase tracking-wider text-white/30 mb-4">Experiences</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/tours/great-mother-cave-tour" className="text-white/60 hover:text-white transition-colors">Great Mother Cave</Link></li>
              <li><Link to="/tours/muizenberg-cave-tours" className="text-white/60 hover:text-white transition-colors">Muizenberg Heritage</Link></li>
              <li><Link to="/tours/kalk-bay-tour" className="text-white/60 hover:text-white transition-colors">Kalk Bay Tapestry</Link></li>
              <li><Link to="/tours-retreats" className="text-white/60 hover:text-white transition-colors">All Tours & Retreats</Link></li>
              <li><Link to="/roambuddy-store" className="text-white/60 hover:text-white transition-colors">ROAM eSIM Store</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs font-medium uppercase tracking-wider text-white/30 mb-4">Services</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/business-consulting" className="text-white/60 hover:text-white transition-colors">Business Consulting</Link></li>
              <li><Link to="/media-production" className="text-white/60 hover:text-white transition-colors">Media Production</Link></li>
              <li><Link to="/web-development" className="text-white/60 hover:text-white transition-colors">Web Development</Link></li>
              <li><Link to="/blog" className="text-white/60 hover:text-white transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-medium uppercase tracking-wider text-white/30 mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/about" className="text-white/60 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/csr-impact" className="text-white/60 hover:text-white transition-colors">CSR Impact</Link></li>
              <li><Link to="/contact" className="text-white/60 hover:text-white transition-colors">Contact</Link></li>
              <li><a href="mailto:admin@omniwellnessmedia.co.za" className="text-white/60 hover:text-white transition-colors">admin@omniwellnessmedia.co.za</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="container mx-auto px-4 py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-white/30 text-xs">&copy; 2026 Omni Wellness Media. All rights reserved.</p>
          <div className="flex gap-5 text-xs">
            <Link to="/privacy-policy" className="text-white/30 hover:text-white/60 transition-colors">Privacy</Link>
            <Link to="/terms-of-service" className="text-white/30 hover:text-white/60 transition-colors">Terms</Link>
          </div>
        </div>
      </div>

      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 left-6 p-2.5 bg-[#1a1a1a] text-white/60 hover:text-white rounded-full border border-white/10 hover:border-white/20 transition-all z-40"
        aria-label="Back to top"
      >
        <ArrowUp className="w-4 h-4" />
      </button>
    </footer>
  );
};

export default Footer;
