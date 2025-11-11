import HeroSection from "@/components/sections/HeroSection";
import UnifiedNavigation from "@/components/navigation/UnifiedNavigation";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag, TrendingUp, Package } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen">
      <UnifiedNavigation />
      <HeroSection />
      
      {/* Shop CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Shop Curated Wellness Products
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover premium wellness products from yoga essentials to natural beauty. 
              Earn commissions while sharing health and consciousness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Link to="/store/collections/yoga_meditation" className="group">
              <div className="p-6 rounded-xl border bg-card hover:shadow-xl transition-all">
                <Package className="w-12 h-12 mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Yoga & Meditation</h3>
                <p className="text-sm text-muted-foreground">Premium mats, cushions, and meditation tools</p>
              </div>
            </Link>
            
            <Link to="/store/collections/wellness_supplements" className="group">
              <div className="p-6 rounded-xl border bg-card hover:shadow-xl transition-all">
                <TrendingUp className="w-12 h-12 mb-4 text-emerald-600" />
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Wellness Supplements</h3>
                <p className="text-sm text-muted-foreground">Organic supplements and superfoods</p>
              </div>
            </Link>
            
            <Link to="/store/collections/natural_beauty" className="group">
              <div className="p-6 rounded-xl border bg-card hover:shadow-xl transition-all">
                <ShoppingBag className="w-12 h-12 mb-4 text-pink-600" />
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Natural Beauty</h3>
                <p className="text-sm text-muted-foreground">Organic skincare and beauty essentials</p>
              </div>
            </Link>
          </div>

          <div className="text-center">
            <Link to="/store">
              <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity text-lg px-8">
                Browse All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;