import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Star, 
  MapPin, 
  Clock, 
  Users, 
  Award,
  Globe,
  Phone,
  Mail,
  ExternalLink,
  Calendar,
  Coins,
  DollarSign,
  ChevronLeft,
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
  Youtube,
  Heart,
  Share2,
  BookOpen,
  CheckCircle
} from 'lucide-react';
import { getProviderById } from '@/data/providerDirectory';
import { useAuth } from '@/components/AuthProvider';
import { IMAGES, getSandyImage, getImageWithFallback } from '@/lib/images';

const IndividualProviderProfile = () => {
  const { providerId } = useParams<{ providerId: string }>();
  const { user } = useAuth();
  const [selectedService, setSelectedService] = useState<string | null>(null);

  if (!providerId) {
    return <Navigate to="/provider-directory" replace />;
  }

  const providerData = getProviderById(providerId);

  if (!providerData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Provider Not Found</h1>
          <p className="text-muted-foreground mb-6">The provider you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/provider-directory">Browse All Providers</Link>
          </Button>
        </div>
      </div>
    );
  }

  const { profile, services, packages } = providerData;

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return Instagram;
      case 'facebook': return Facebook;
      case 'linkedin': return Linkedin;
      case 'twitter': return Twitter;
      case 'youtube': return Youtube;
      default: return Globe;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      {/* Hero Section with Cover Image */}
      <div className="relative h-96 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${profile.cover_image})` }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>
        
        {/* Navigation */}
        <div className="absolute top-6 left-6 z-10">
          <Button variant="secondary" asChild className="backdrop-blur-sm bg-white/20">
            <Link to="/provider-directory">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Directory
            </Link>
          </Button>
        </div>

        {/* Share Button */}
        <div className="absolute top-6 right-6 z-10">
          <Button variant="secondary" size="sm" className="backdrop-blur-sm bg-white/20">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Provider Header */}
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="container mx-auto">
            <div className="flex items-end gap-6">
              <Avatar className="h-24 w-24 border-4 border-white/20 backdrop-blur">
                <AvatarImage src={profile.profile_image_url} alt={profile.business_name} />
                <AvatarFallback>{profile.business_name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-bold">{profile.business_name}</h1>
                  {profile.verified && (
                    <Badge className="bg-green-600/80 backdrop-blur">
                      <Award className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  {profile.featured && (
                    <Badge className="bg-primary/80 backdrop-blur">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-white/90">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {profile.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {profile.rating}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {profile.total_clients} clients
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {profile.years_experience} years
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="packages">Packages</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>About {profile.business_name.split(' - ')[0]}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-muted-foreground leading-relaxed">
                      {profile.description}
                    </p>

                    <div>
                      <h4 className="font-semibold mb-3">Philosophy</h4>
                      <p className="text-muted-foreground italic border-l-4 border-primary pl-4">
                        "{profile.philosophy}"
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Specialties</h4>
                      <div className="flex flex-wrap gap-2">
                        {profile.specialties.map((specialty) => (
                          <Badge key={specialty} variant="secondary">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Certifications</h4>
                      <div className="space-y-2">
                        {profile.certifications.map((cert) => (
                          <div key={cert} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm">{cert}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {profile.badges && profile.badges.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3">Achievement Badges</h4>
                        <div className="flex flex-wrap gap-2">
                          {profile.badges.map((badge) => (
                            <Badge key={badge} variant="outline" className="border-primary text-primary">
                              <Award className="h-3 w-3 mr-1" />
                              {badge}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="services" className="space-y-6">
                {services.map((service) => (
                  <Card key={service.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {service.title}
                            <Badge variant="outline">{service.category}</Badge>
                          </CardTitle>
                          <CardDescription className="flex items-center gap-4 mt-2">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {service.duration_minutes} min
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {service.location}
                            </span>
                            {service.is_online && (
                              <Badge variant="secondary" className="text-xs">Online Available</Badge>
                            )}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2 text-lg font-bold">
                            <DollarSign className="h-4 w-4" />
                            R{service.price_zar}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Coins className="h-3 w-3" />
                            {service.price_wellcoins} WellCoins
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">{service.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-medium mb-2 text-green-700">Benefits</h5>
                          <ul className="text-sm space-y-1">
                            {service.benefits.slice(0, 3).map((benefit) => (
                              <li key={benefit} className="flex items-center gap-2">
                                <CheckCircle className="h-3 w-3 text-green-600" />
                                {benefit}
                              </li>
                            ))}
                            {service.benefits.length > 3 && (
                              <li className="text-muted-foreground text-xs">
                                +{service.benefits.length - 3} more benefits
                              </li>
                            )}
                          </ul>
                        </div>
                        
                        <div>
                          <h5 className="font-medium mb-2 text-blue-700">Suitable For</h5>
                          <ul className="text-sm space-y-1">
                            {service.suitableFor.slice(0, 3).map((suitable) => (
                              <li key={suitable} className="flex items-center gap-2">
                                <Users className="h-3 w-3 text-blue-600" />
                                {suitable}
                              </li>
                            ))}
                            {service.suitableFor.length > 3 && (
                              <li className="text-muted-foreground text-xs">
                                +{service.suitableFor.length - 3} more
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="flex gap-2">
                      <Button className="flex-1">
                        <Calendar className="h-4 w-4 mr-2" />
                        Book Service
                      </Button>
                      <Button variant="outline" onClick={() => setSelectedService(service.id)}>
                        <BookOpen className="h-4 w-4 mr-2" />
                        Learn More
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="packages" className="space-y-6">
                {packages.map((pkg) => (
                  <Card key={pkg.id} className="hover:shadow-lg transition-shadow border-primary/20">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-primary">{pkg.title}</CardTitle>
                          <CardDescription>{pkg.description}</CardDescription>
                          {pkg.duration && (
                            <Badge variant="outline" className="mt-2">{pkg.duration}</Badge>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2 text-2xl font-bold text-primary">
                            <DollarSign className="h-5 w-5" />
                            R{pkg.price_zar}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Coins className="h-3 w-3" />
                            {pkg.price_wellcoins} WellCoins
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div>
                        <h5 className="font-medium mb-2">Package Includes:</h5>
                        <ul className="space-y-2">
                          {pkg.includes.map((item) => (
                            <li key={item} className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-sm">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-green-800 font-medium text-sm">{pkg.savings}</p>
                      </div>
                    </CardContent>
                    
                    <CardFooter>
                      <Button size="lg" className="w-full">
                        <Calendar className="h-4 w-4 mr-2" />
                        Book Package
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="reviews" className="space-y-6">
                <Card>
                  <CardContent className="p-8 text-center">
                    <Star className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-semibold mb-2">Reviews Coming Soon</h3>
                    <p className="text-muted-foreground">
                      Client reviews and testimonials will be available soon.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <a href={`mailto:${profile.email}`} 
                     className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
                    <Mail className="h-4 w-4 text-primary" />
                    <span className="text-sm">{profile.email}</span>
                  </a>
                  
                  <a href={`tel:${profile.phone}`} 
                     className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
                    <Phone className="h-4 w-4 text-primary" />
                    <span className="text-sm">{profile.phone}</span>
                  </a>

                  {profile.website && (
                    <a href={profile.website} target="_blank" rel="noopener noreferrer"
                       className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
                      <Globe className="h-4 w-4 text-primary" />
                      <span className="text-sm">Visit Website</span>
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </a>
                  )}
                </div>

                <Separator />

                <div>
                  <h5 className="font-medium mb-2">Availability</h5>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>{profile.availability.days.join(', ')}</div>
                    <div>{profile.availability.hours}</div>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium mb-2">Languages</h5>
                  <div className="flex flex-wrap gap-1">
                    {profile.languages.map((language) => (
                      <Badge key={language} variant="secondary" className="text-xs">
                        {language}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Media */}
            {Object.keys(profile.social_media).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Follow Me</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(profile.social_media).map(([platform, handle]) => {
                      if (!handle) return null;
                      const IconComponent = getSocialIcon(platform);
                      return (
                        <Button key={platform} variant="outline" size="sm" asChild>
                          <a href={`https://${platform}.com/${handle.replace('@', '')}`} 
                             target="_blank" rel="noopener noreferrer">
                            <IconComponent className="h-4 w-4 mr-2" />
                            {handle}
                          </a>
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Consultation
                </Button>
                <Button variant="outline" className="w-full">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
                {user && (
                  <Button variant="outline" className="w-full">
                    <Heart className="h-4 w-4 mr-2" />
                    Save Provider
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndividualProviderProfile;