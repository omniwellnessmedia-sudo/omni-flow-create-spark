import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Leaf, Heart, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { getLifestyleImage, getTeamImage, getProductImage } from "@/lib/imageHelpers";

interface TwoBeWellCTAProps {
  variant?: "default" | "compact" | "sidebar";
  className?: string;
}

export const TwoBeWellCTA = ({ variant = "default", className = "" }: TwoBeWellCTAProps) => {
  if (variant === "compact") {
    return (
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-emerald-50 via-white to-purple-50 shadow-soft">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0djItMnptMC0ydjJoLTJ2LTJoMnptLTItMmgydjJoLTJ2LTJ6bTItMmgydjJoLTJ2LTJ6bTAtMmgydjJoLTJ2LTJ6bTItMmgydjJoLTJ2LTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40"></div>
        
        <div className="relative p-8">
          <div className="flex items-start justify-between mb-4">
            <Badge className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0 px-4 py-1.5">
              🌿 Featured Products
            </Badge>
            <Sparkles className="h-6 w-6 text-emerald-500 animate-pulse" />
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Discover 2BeWell Natural
          </h3>
          
          <p className="text-gray-600 mb-6 leading-relaxed">
            Handcrafted plant-based wellness essentials. 100% vegan, BWC endorsed.
          </p>

          <div className="flex items-center gap-3 mb-6 text-sm">
            <div className="flex items-center gap-1.5 text-emerald-600">
              <Leaf className="h-4 w-4" />
              <span className="font-medium">100% Vegan</span>
            </div>
            <div className="flex items-center gap-1.5 text-pink-600">
              <Heart className="h-4 w-4" />
              <span className="font-medium">Cruelty-Free</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              asChild 
              className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border-0 shadow-lg rounded-full"
            >
              <Link to="/2bewell/shop" className="flex items-center justify-center gap-2">
                Shop Now <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button 
              asChild 
              variant="outline"
              className="flex-1 border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-full"
            >
              <Link to="/2bewell/shop#story">Our Story</Link>
            </Button>
          </div>

          <p className="text-xs text-gray-500 mt-4 text-center">
            From R85 • Earn WellCoins on every purchase
          </p>
        </div>
      </Card>
    );
  }

  if (variant === "sidebar") {
    return (
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-soft">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Leaf className="h-5 w-5 text-emerald-600" />
            </div>
            <Badge className="bg-emerald-600 text-white border-0">Featured</Badge>
          </div>

          <h4 className="text-lg font-bold text-gray-900 mb-2">
            2BeWell Natural
          </h4>
          
          <p className="text-sm text-gray-600 mb-4">
            Plant-based skincare that honors your body and the planet.
          </p>

          <Button 
            asChild 
            size="sm"
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border-0 rounded-full"
          >
            <Link to="/2bewell/shop" className="flex items-center justify-center gap-2">
              Explore <ArrowRight className="h-3 w-3" />
            </Link>
          </Button>
        </div>
      </Card>
    );
  }

  // Default "full" variant with bento grid
  return (
    <Card className={`relative overflow-hidden border-0 bg-gradient-to-br from-emerald-50 via-white to-purple-50 shadow-elegant ${className}`}>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0djItMnptMC0ydjJoLTJ2LTJoMnptLTItMmgydjJoLTJ2LTJ6bTItMmgydjJoLTJ2LTJ6bTAtMmgydjJoLTJ2LTJ6bTItMmgydjJoLTJ2LTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40"></div>
      
      <div className="relative p-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-white rounded-2xl shadow-md">
                <Leaf className="h-8 w-8 text-emerald-600" />
              </div>
              <Badge className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0 px-6 py-2 text-sm">
                🌿 Featured Partner
              </Badge>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Meet 2BeWell
            </h2>
            
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Nature Bottled with Love
            </p>

            <p className="text-gray-600 mb-8 leading-relaxed">
              In Cape Town, Zenith and Feroza craft plant-based skincare that honors 
              your body and our planet. Every product is handmade with intention, 
              infused with nature's wisdom, and packaged with care.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-2 text-sm">
                <div className="p-1.5 bg-emerald-100 rounded-lg">
                  <Leaf className="h-4 w-4 text-emerald-600" />
                </div>
                <span className="font-medium text-gray-700">100% Vegan</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="p-1.5 bg-pink-100 rounded-lg">
                  <Heart className="h-4 w-4 text-pink-600" />
                </div>
                <span className="font-medium text-gray-700">Cruelty-Free</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="p-1.5 bg-purple-100 rounded-lg">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                </div>
                <span className="font-medium text-gray-700">BWC Endorsed</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <Heart className="h-4 w-4 text-blue-600" />
                </div>
                <span className="font-medium text-gray-700">Handcrafted</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                asChild 
                size="lg"
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border-0 shadow-lg rounded-full px-8"
              >
                <Link to="/2bewell/shop" className="flex items-center gap-2">
                  Explore 2BeWell <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button 
                asChild 
                size="lg"
                variant="outline"
                className="border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 rounded-full px-8"
              >
                <Link to="/2bewell/shop#story">Meet the Makers</Link>
              </Button>
            </div>

            <p className="text-sm text-gray-500 mt-6">
              From R85 • Earn WellCoins on every purchase • Free shipping over R500
            </p>
          </div>

          {/* Right: Product showcase (bento grid) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 aspect-[16/9] bg-white rounded-3xl overflow-hidden shadow-lg">
              <img 
                src={getLifestyleImage('hero-collage')}
                alt="2BeWell Natural Products Collection"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-md">
              <img 
                src={getTeamImage('zenith')}
                alt="Zenith - Co-Founder & Skincare Specialist"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-md">
              <img 
                src={getProductImage('2beglow-face-serum')}
                alt="2BeGlow Face Serum"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
