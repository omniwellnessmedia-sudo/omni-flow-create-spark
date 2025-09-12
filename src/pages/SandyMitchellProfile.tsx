import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AddToCartButton } from '@/components/cart/AddToCartButton';
import BookingSystem from '@/components/booking/BookingSystem';
import sandyMitchellData from '@/data/sandyMitchellProfile';
import { IMAGES, getSandyImage } from '@/lib/images';
import {
  MapPin,
  Clock,
  Coins,
  Star,
  Globe,
  Calendar,
  Heart,
  Users,
  Award,
  Phone,
  Mail,
  Instagram,
  Facebook,
  CheckCircle,
  Leaf,
  Sparkles,
  Wind
} from 'lucide-react';
import { toast } from 'sonner';

const SandyMitchellProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('services');
  const { profile, services, packages } = sandyMitchellData;

  const { isProvider, hasProviderPermission } = useAuth();

  // Check if user is authenticated and authorized to view Sandy's profile
  useEffect(() => {
    if (!user) {
      toast.error("Please sign in to access provider profiles", {
        description: "Authentication required for provider access"
      });
      navigate('/auth');
      return;
    }
    
    // Check if user has provider access to Sandy's profile
    const canViewSandyProfile = isProvider('sandy-mitchell') || 
                               hasProviderPermission('sandy-mitchell', 'view_profile') ||
                               user.email === 'admin@omniwellness.co.za';
    
    // For demo: temporarily allow all authenticated users
    // In production, uncomment below to restrict access
    if (!canViewSandyProfile) {
      console.log('Demo mode: Allowing all authenticated users to view Sandy\'s profile');
      // toast.error("Access Denied", {
      //   description: "You don't have permission to access this provider profile"
      // });
      // navigate('/marketplace');
    }
  }, [user, navigate, isProvider, hasProviderPermission]);

  const handleBookService = (serviceId: string) => {
    toast.success("Redirecting to booking system...", {
      description: "Sandy's integrated booking system coming soon!"
    });
  };

  const handleContactSandy = () => {
    window.open(`mailto:${profile.email}`, '_blank');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: SANDY_THEME.COLORS.BACKGROUND }}>
      {/* Hero Section with Sandy's Branding */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={IMAGES.SANDY.HERO}
          alt="Sandy Mitchell Dru Yoga Studio"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl mx-auto px-6">
            <div className="flex items-center justify-center mb-4">
              <Avatar className="w-24 h-24 border-4 border-white/20">
                <AvatarImage src={IMAGES.SANDY.PROFILE} alt="Sandy Mitchell" />
                <AvatarFallback style={{ backgroundColor: SANDY_THEME.COLORS.PRIMARY }}>
                  SM
                </AvatarFallback>
              </Avatar>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: SANDY_THEME.FONTS.HEADING }}>
              {profile.business_name}
            </h1>
            <p className="text-xl mb-6 opacity-90">
              {profile.philosophy}
            </p>
            <div className="flex items-center justify-center space-x-6 mb-6">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">4.9</span>
                <span className="text-sm opacity-80">(127 reviews)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5" />
                <span className="text-sm">{profile.years_experience} Years Experience</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span className="text-sm">500+ Happy Clients</span>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-4">
              <Button 
                size="lg" 
                onClick={() => setActiveTab('services')}
                style={{ backgroundColor: SANDY_THEME.COLORS.PRIMARY }}
                className="hover:opacity-90"
              >
                <Calendar className="w-5 h-5 mr-2" />
                View Services
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={handleContactSandy}
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                <Mail className="w-5 h-5 mr-2" />
                Contact Sandy
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 -mt-20 relative z-10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/90 backdrop-blur-sm shadow-lg">
            <TabsTrigger value="services" className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <span>Services</span>
            </TabsTrigger>
            <TabsTrigger value="about" className="flex items-center space-x-2">
              <Heart className="w-4 h-4" />
              <span>About Sandy</span>
            </TabsTrigger>
            <TabsTrigger value="packages" className="flex items-center space-x-2">
              <Leaf className="w-4 h-4" />
              <span>Packages</span>
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center space-x-2">
              <Wind className="w-4 h-4" />
              <span>Gallery</span>
            </TabsTrigger>
          </TabsList>

          {/* Services Tab */}
          <TabsContent value="services" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <Card key={service.id} className="group overflow-hidden border-none shadow-elegant hover:shadow-2xl transition-all duration-300 bg-white/95 backdrop-blur-sm">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={service.images[0]}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge 
                        className="text-white"
                        style={{ backgroundColor: SANDY_THEME.COLORS.PRIMARY }}
                      >
                        {service.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg" style={{ color: SANDY_THEME.COLORS.TEXT }}>
                      {service.title}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl font-bold" style={{ color: SANDY_THEME.COLORS.PRIMARY }}>
                          R{service.price_zar}
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <Coins className="w-4 h-4" />
                          <span>{service.price_wellcoins} WC</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 mb-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{service.duration_minutes} min</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{service.is_online ? 'Online' : 'In-Person'}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="text-sm font-medium" style={{ color: SANDY_THEME.COLORS.TEXT }}>
                        Perfect for:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {service.suitableFor.slice(0, 3).map((item) => (
                          <Badge key={item} variant="outline" className="text-xs">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <div className="flex-1">
                        <BookingSystem
                          serviceId={service.id}
                          serviceName={service.title}
                          servicePrice={service.price_zar}
                          serviceDuration={service.duration_minutes}
                          providerId={profile.id}
                          providerName={profile.business_name}
                          isOnline={service.is_online}
                        />
                      </div>
                      <AddToCartButton
                        item={{
                          id: service.id,
                          title: service.title,
                          price_zar: service.price_zar,
                          price_wellcoins: service.price_wellcoins,
                          image: service.images[0],
                          category: service.category
                        }}
                        variant="outline"
                        size="default"
                        className="px-4"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* About Sandy Tab */}
          <TabsContent value="about" className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Sandy's Story */}
              <div className="lg:col-span-2">
                <Card className="bg-white/95 backdrop-blur-sm border-none shadow-elegant">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2" style={{ color: SANDY_THEME.COLORS.TEXT }}>
                      <Heart className="w-6 h-6" style={{ color: SANDY_THEME.COLORS.PRIMARY }} />
                      <span>Sandy's Journey</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      {profile.description}
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      With {profile.years_experience} years of dedicated practice and teaching, Sandy has helped hundreds of students discover the transformative power of gentle, accessible yoga. Her approach combines traditional wisdom with modern understanding of body mechanics and breath work.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div>
                        <h4 className="font-semibold mb-2" style={{ color: SANDY_THEME.COLORS.TEXT }}>Specializations</h4>
                        <ul className="space-y-1">
                          {profile.specialties.map((specialty) => (
                            <li key={specialty} className="flex items-center space-x-2 text-sm">
                              <CheckCircle className="w-4 h-4" style={{ color: SANDY_THEME.COLORS.PRIMARY }} />
                              <span>{specialty}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2" style={{ color: SANDY_THEME.COLORS.TEXT }}>Certifications</h4>
                        <ul className="space-y-1">
                          {profile.certifications.map((cert) => (
                            <li key={cert} className="flex items-center space-x-2 text-sm">
                              <Award className="w-4 h-4" style={{ color: SANDY_THEME.COLORS.PRIMARY }} />
                              <span>{cert}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Contact & Social */}
              <div className="space-y-6">
                <Card className="bg-white/95 backdrop-blur-sm border-none shadow-elegant">
                  <CardHeader>
                    <CardTitle style={{ color: SANDY_THEME.COLORS.TEXT }}>Contact Sandy</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5" style={{ color: SANDY_THEME.COLORS.PRIMARY }} />
                      <span className="text-sm">{profile.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5" style={{ color: SANDY_THEME.COLORS.PRIMARY }} />
                      <span className="text-sm">{profile.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Globe className="w-5 h-5" style={{ color: SANDY_THEME.COLORS.PRIMARY }} />
                      <a href={profile.website} target="_blank" className="text-sm hover:underline">
                        Visit Website
                      </a>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5" style={{ color: SANDY_THEME.COLORS.PRIMARY }} />
                      <span className="text-sm">{profile.location}</span>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <h4 className="font-semibold mb-3" style={{ color: SANDY_THEME.COLORS.TEXT }}>Follow Sandy</h4>
                      <div className="flex space-x-3">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Instagram className="w-4 h-4 mr-2" />
                          Instagram
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Facebook className="w-4 h-4 mr-2" />
                          Facebook
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Packages Tab */}
          <TabsContent value="packages" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {packages.map((pkg) => (
                <Card key={pkg.id} className="border-none shadow-elegant bg-white/95 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle style={{ color: SANDY_THEME.COLORS.TEXT }}>{pkg.title}</CardTitle>
                    <CardDescription>{pkg.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="text-3xl font-bold" style={{ color: SANDY_THEME.COLORS.PRIMARY }}>
                          R{pkg.price_zar}
                        </div>
                        <Badge variant="secondary">
                          Save R{pkg.savings_amount}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Package Includes:</div>
                        <ul className="space-y-1">
                          {pkg.includes.map((item) => (
                            <li key={item} className="flex items-center space-x-2 text-sm">
                              <CheckCircle className="w-4 h-4" style={{ color: SANDY_THEME.COLORS.PRIMARY }} />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <BookingSystem
                        serviceId={pkg.id}
                        serviceName={pkg.title}
                        servicePrice={pkg.price_zar}
                        serviceDuration={120} // Default 2 hours for packages
                        providerId={profile.id}
                        providerName={profile.business_name}
                        isOnline={false}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {IMAGES.SANDY.GALLERY.map((image, index) => (
                <div key={index} className="relative aspect-square overflow-hidden rounded-lg">
                  <img
                    src={image}
                    alt={`Sandy's studio ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SandyMitchellProfile;