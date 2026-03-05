import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Users, Mountain, Heart, Waves, Camera, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';
import Footer from '@/components/Footer';

const STORAGE_BASE = "https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images";

export default function KalkBayTour() {
  return (
    <>
      <UnifiedNavigation />
      
      {/* Hero Section */}
      <section className="relative h-[75vh] overflow-hidden">
        <img 
          src={`${STORAGE_BASE}/General%20Images/group%20tour%20amazing%20cave%20view%20muizenberg.jpg`}
          alt="Kalk Bay coastal views"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70" />
        <div className="relative z-10 container mx-auto h-full flex items-center px-4">
          <div className="max-w-3xl text-white">
            <Badge className="mb-4 bg-white/20 text-white border-white/30 backdrop-blur-sm">
              <Waves className="w-3 h-3 mr-1" />
              Coastal Cultural Experience • Half Day
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Kalk Bay Rich Tapestry Walk
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-8 text-white/95 leading-relaxed max-w-2xl">
              Discover the vibrant culture, heritage, and natural beauty of Kalk Bay — 
              from its historic harbour to hidden caves and artisan treasures.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                Enquire Now
              </Button>
              <Link to="/travel-well-connected-store">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  View All Tours
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tour Overview */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Quick Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              <Card>
                <CardContent className="p-4 text-center">
                  <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-semibold">4-5 hours</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <MapPin className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-semibold">Kalk Bay, CT</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground">Group Size</p>
                  <p className="font-semibold">Max 15</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Mountain className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground">Difficulty</p>
                  <p className="font-semibold">Easy-Moderate</p>
                </CardContent>
              </Card>
            </div>

            <h2 className="text-3xl font-bold mb-6">About This Experience</h2>
            <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
              <p>
                Kalk Bay is one of Cape Town's most beloved coastal villages — a place where fishing 
                heritage, artistic culture, and natural beauty converge. This guided walking tour takes 
                you through the heart of Kalk Bay, from the bustling harbour where fishermen still 
                bring in their daily catch, to hidden caves along the coastline, and through the 
                charming streets lined with antique shops, bookstores, and artisan galleries.
              </p>
              <p>
                Along the way, you'll learn about the rich cultural history of the Kalk Bay community, 
                the indigenous Khoi-San connections to this coastline, and the stories behind the 
                landmark buildings and natural formations that make this area so special.
              </p>
            </div>

            {/* Highlights */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold mb-6">Tour Highlights</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  'Historic Kalk Bay Harbour & fish market',
                  'Coastal cave exploration',
                  'Artisan shops & gallery walk',
                  'Indigenous cultural storytelling',
                  'Scenic coastal path walk',
                  'Local cuisine tasting opportunity',
                  'Photography opportunities',
                  'Mindful nature connection moments'
                ].map((highlight, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <Check className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-foreground">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* What to Bring */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold mb-6">What to Bring</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  'Comfortable walking shoes',
                  'Sunscreen & hat',
                  'Water bottle',
                  'Camera',
                  'Light jacket (coastal wind)',
                  'Spending money for local shops'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-muted-foreground">
                    <Camera className="h-4 w-4 text-primary shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="mt-16 text-center bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-8 border border-border/30">
              <Heart className="h-10 w-10 mx-auto mb-4 text-primary" />
              <h3 className="text-2xl font-bold mb-3">Coming Soon</h3>
              <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                This tour is currently being finalised. Contact us to express your interest 
                or to book a custom Kalk Bay experience for your group.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/contact">
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Express Interest
                  </Button>
                </Link>
                <Link to="/travel-well-connected-store">
                  <Button size="lg" variant="outline">
                    Browse Other Tours
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
