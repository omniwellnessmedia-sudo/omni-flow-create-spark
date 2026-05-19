import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { AddToCartButton } from '@/components/cart/AddToCartButton';
import BookingSystem from '@/components/booking/BookingSystem';
import { supabase } from '@/integrations/supabase/client';
import sandyMitchellData from '@/data/sandyMitchellProfile';
import { IMAGES, getImageWithFallback } from '@/lib/images';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';
import Footer from '@/components/Footer';
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
  Mail,
  Instagram,
  Facebook,
  CheckCircle,
  Sparkles,
  Share2,
  ShieldCheck,
  ChevronLeft,
} from 'lucide-react';
import { toast } from 'sonner';

const SandyMitchellProfile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'services' | 'about' | 'packages' | 'gallery'>('services');
  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState(sandyMitchellData.profile);
  const [services, setServices] = useState(sandyMitchellData.services);
  const [packages] = useState(sandyMitchellData.packages);

  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        const { data: providerData } = await supabase
          .from('provider_profiles')
          .select('*')
          .ilike('business_name', '%sandy%dru%yoga%')
          .limit(1)
          .maybeSingle();

        if (providerData) {
          setProfile(prev => ({
            ...prev,
            business_name: providerData.business_name || prev.business_name,
            description: providerData.description || prev.description,
            specialties: providerData.specialties?.length ? providerData.specialties : prev.specialties,
            certifications: providerData.certifications?.length ? providerData.certifications : prev.certifications,
            location: providerData.location || prev.location,
            phone: providerData.phone || prev.phone,
            website: providerData.website || prev.website,
            profile_image_url: providerData.profile_image_url || prev.profile_image_url,
            years_experience: providerData.experience_years || prev.years_experience,
          }));

          const { data: servicesData } = await supabase
            .from('services')
            .select('*')
            .eq('provider_id', providerData.id)
            .eq('active', true)
            .order('created_at', { ascending: false });

          if (servicesData?.length) {
            setServices(servicesData.map(s => ({
              id: s.id,
              title: s.title,
              description: s.description || '',
              category: 'Yoga' as const,
              price_zar: s.price_zar || 0,
              price_wellcoins: s.price_wellcoins || 0,
              duration_minutes: s.duration_minutes || 60,
              location: s.location || providerData.location || '',
              is_online: s.is_online || false,
              images: s.images?.length ? s.images : [IMAGES.sandy.yoga],
              longDescription: s.description || '',
              active: s.active ?? true,
              benefits: ['Personalised wellness support', 'Gentle guidance', 'Mind-body connection'],
              requirements: ['Comfortable clothing', 'Open mind'],
              specialFeatures: ['Dru Yoga inspired', 'Beginner friendly'],
              suitableFor: ['All Levels'],
            })));
          }
        }
      } catch (err) {
        // static data remains as fallback
      }
    };
    fetchLiveData();
  }, []);

  const lowestPrice = services.length
    ? Math.min(...services.map(s => s.price_zar).filter(Boolean))
    : null;

  const galleryImages = [
    IMAGES.sandy.yoga, IMAGES.sandy.meditation, IMAGES.sandy.teaching,
    IMAGES.sandy.nature, IMAGES.sandy.portrait1, IMAGES.sandy.portrait2,
    IMAGES.sandy.portrait3, IMAGES.sandy.action1, IMAGES.sandy.action2,
  ].filter(Boolean);

  const tabs = [
    { id: 'services' as const, label: `Services (${services.length})`, icon: Sparkles },
    { id: 'about' as const, label: 'About Sandy', icon: Heart },
    { id: 'packages' as const, label: 'Packages', icon: Award },
    ...(galleryImages.length ? [{ id: 'gallery' as const, label: 'Gallery', icon: Star }] : []),
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <UnifiedNavigation />

      <main id="main-content" className="flex-1">
        {/* ── HERO ── */}
        <div className="relative h-[320px] sm:h-[380px] lg:h-[420px] overflow-hidden bg-muted">
          <img
            {...getImageWithFallback(IMAGES.sandy.hero, IMAGES.sandy.yoga)}
            alt="Sandy Mitchell — Dru Yoga"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

          {/* Nav */}
          <div className="absolute top-4 left-4 z-10">
            <Button variant="secondary" size="sm" asChild
              className="bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white">
              <Link to="/wellness-exchange/marketplace">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Marketplace
              </Link>
            </Button>
          </div>
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            <button
              onClick={() => setSaved(s => !s)}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
              aria-label={saved ? 'Unsave' : 'Save'}
            >
              <Heart className={`h-4 w-4 ${saved ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
            </button>
            <button
              onClick={() => navigator.share?.({ title: profile.business_name, url: window.location.href })}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
              aria-label="Share"
            >
              <Share2 className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ── IDENTITY STRIP ── */}
          <div className="flex items-end gap-5 -mt-14 mb-5 relative z-10">
            <div className="relative shrink-0">
              <Avatar className="h-24 w-24 sm:h-28 sm:w-28 border-4 border-background shadow-xl">
                <AvatarImage src={profile.profile_image_url || IMAGES.sandy.profile} alt={profile.business_name} />
                <AvatarFallback className="text-2xl font-heading bg-[#2a9d8f]/10 text-[#2a9d8f]">SM</AvatarFallback>
              </Avatar>
              <span className="absolute -bottom-1 -right-1 bg-[#2a9d8f] rounded-full p-1 border-2 border-background">
                <ShieldCheck className="h-3.5 w-3.5 text-white" />
              </span>
            </div>

            <div className="pb-1 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="font-heading text-2xl sm:text-3xl leading-tight">{profile.business_name}</h1>
                <Badge className="bg-gradient-to-r from-[#2a9d8f] to-[#52b69a] text-white border-0 shrink-0">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Omni Circle
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-[#2a9d8f]" />
                  {profile.location}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <strong className="text-foreground">4.9</strong>
                  &nbsp;·&nbsp;127 reviews
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {profile.years_experience} yrs experience
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  500+ clients
                </span>
              </div>
            </div>
          </div>

          {/* Philosophy quote */}
          <blockquote className="border-l-4 border-[#2a9d8f]/50 pl-4 italic text-foreground/70 text-base mb-5 max-w-xl">
            "{profile.philosophy}"
          </blockquote>

          {/* Specialties */}
          <div className="flex flex-wrap gap-2 mb-6">
            {profile.specialties.map(s => (
              <span key={s} className="px-3 py-1 rounded-full text-xs font-medium bg-[#2a9d8f]/8 text-[#2a9d8f] border border-[#2a9d8f]/15">
                {s}
              </span>
            ))}
          </div>

          <Separator className="mb-6" />

          {/* ── MAIN LAYOUT ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pb-24 lg:pb-16">

            {/* LEFT: content */}
            <div className="lg:col-span-2 space-y-8">

              {/* Tab nav */}
              <div className="border-b border-border">
                <nav className="flex gap-0 -mb-px" role="tablist">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      role="tab"
                      aria-selected={activeTab === tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 sm:px-5 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'border-[#2a9d8f] text-[#2a9d8f]'
                          : 'border-transparent text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <tab.icon className="h-3.5 w-3.5" />
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* ── SERVICES ── */}
              {activeTab === 'services' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {services.map(service => (
                    <div key={service.id}
                      className="rounded-2xl border border-border/50 bg-card overflow-hidden hover:shadow-lg transition-shadow group">
                      {/* Service image */}
                      <div className="relative h-44 overflow-hidden">
                        <img
                          {...getImageWithFallback(service.images?.[0] || IMAGES.sandy.yoga, IMAGES.sandy.yoga)}
                          alt={service.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 flex gap-1.5">
                          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/90 text-[#2a9d8f] backdrop-blur-sm">
                            {service.category}
                          </span>
                          {service.price_zar === 0 && (
                            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#2a9d8f] text-white">
                              FREE
                            </span>
                          )}
                        </div>
                        {service.is_online && (
                          <div className="absolute top-3 right-3">
                            <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 border border-green-200">
                              Online
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-4">
                        <h3 className="font-heading text-base leading-snug mb-1">{service.title}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{service.description}</p>

                        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />{service.duration_minutes} min
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />{service.is_online ? 'Online' : 'In-Person'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <span className="font-heading text-xl text-[#2a9d8f]">R{service.price_zar}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Coins className="h-3 w-3 text-omni-orange" />
                            {service.price_wellcoins} WC
                          </div>
                        </div>

                        {service.suitableFor?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-4">
                            {service.suitableFor.slice(0, 3).map(t => (
                              <span key={t} className="px-2 py-0.5 rounded-full text-[11px] bg-muted text-muted-foreground">
                                {t}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex gap-2">
                          <div className="flex-1">
                            <BookingSystem
                              serviceId={service.id}
                              serviceName={service.title}
                              servicePrice={service.price_zar}
                              serviceDuration={service.duration_minutes}
                              providerId={profile.id}
                              providerName={profile.business_name}
                              providerEmail={profile.email}
                              isOnline={service.is_online}
                              buttonClassName="bg-[#2a9d8f] hover:bg-[#21857a] text-white border-0"
                              providerAvailability={{ days: ['mon', 'tue', 'wed', 'thu', 'fri'], startTime: '09:00', endTime: '17:30' }}
                            />
                          </div>
                          {service.price_zar > 0 && (
                            <AddToCartButton
                              item={{
                                id: service.id,
                                title: service.title,
                                price_zar: service.price_zar,
                                price_wellcoins: service.price_wellcoins,
                                image: service.images?.[0],
                                category: service.category,
                              }}
                              variant="outline"
                              size="default"
                              className="px-3 shrink-0"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ── ABOUT ── */}
              {activeTab === 'about' && (
                <div className="space-y-8">
                  <section>
                    <h2 className="font-heading text-2xl mb-4">Sandy's Journey</h2>
                    <div className="space-y-3 text-muted-foreground leading-relaxed">
                      {profile.description.split(/\n\n+/).map((para, i) => (
                        <p key={i}>{para.trim()}</p>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h2 className="font-heading text-2xl mb-4">Certifications</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {profile.certifications.map(cert => (
                        <div key={cert} className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 border border-border/40">
                          <CheckCircle className="h-4 w-4 text-[#2a9d8f] mt-0.5 shrink-0" />
                          <span className="text-sm">{cert}</span>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h2 className="font-heading text-2xl mb-4">Connect with Sandy</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(
                        [
                          profile.email ? { icon: Mail, label: profile.email, href: `mailto:${profile.email}`, external: false } : null,
                          profile.website ? { icon: Globe, label: 'Visit Website', href: profile.website, external: true } : null,
                        ] as ({ icon: React.ElementType; label: string; href: string; external: boolean } | null)[]
                      ).filter((l): l is NonNullable<typeof l> => l !== null).map(link => (
                        <a key={link.href} href={link.href}
                          target={link.external ? '_blank' : undefined}
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border/40 hover:bg-muted transition-colors text-sm">
                          <link.icon className="h-4 w-4 text-[#2a9d8f] shrink-0" />
                          <span className="truncate">{link.label}</span>
                        </a>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-3 mt-4">
                      {profile.social_media?.instagram && (
                        <Button asChild variant="outline" size="sm" className="gap-2">
                          <a href={profile.social_media.instagram} target="_blank" rel="noopener noreferrer">
                            <Instagram className="h-4 w-4" />Instagram
                          </a>
                        </Button>
                      )}
                      {profile.social_media?.facebook && (
                        <Button asChild variant="outline" size="sm" className="gap-2">
                          <a href={profile.social_media.facebook} target="_blank" rel="noopener noreferrer">
                            <Facebook className="h-4 w-4" />Facebook
                          </a>
                        </Button>
                      )}
                      {profile.social_media?.linkedin && (
                        <Button asChild variant="outline" size="sm" className="gap-2">
                          <a href={profile.social_media.linkedin} target="_blank" rel="noopener noreferrer">
                            <Globe className="h-4 w-4" />LinkedIn
                          </a>
                        </Button>
                      )}
                    </div>
                  </section>
                </div>
              )}

              {/* ── PACKAGES ── */}
              {activeTab === 'packages' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {packages.map(pkg => (
                    <div key={pkg.id}
                      className="rounded-2xl border border-[#2a9d8f]/20 bg-gradient-to-br from-[#2a9d8f]/5 to-transparent p-5">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <h3 className="font-heading text-lg text-[#2a9d8f]">{pkg.title}</h3>
                          <p className="text-sm text-muted-foreground mt-0.5">{pkg.description}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="font-heading text-2xl text-[#2a9d8f]">R{pkg.price_zar}</div>
                        </div>
                      </div>

                      {pkg.savings && (
                        <div className="inline-block mb-3 px-3 py-1 rounded-full text-xs bg-green-100 text-green-800 border border-green-200">
                          {pkg.savings}
                        </div>
                      )}

                      <div className="space-y-2 mb-4">
                        {pkg.includes.map(item => (
                          <div key={item} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-[#2a9d8f] shrink-0" />
                            {item}
                          </div>
                        ))}
                      </div>

                      <BookingSystem
                        serviceId={pkg.id}
                        serviceName={pkg.title}
                        servicePrice={pkg.price_zar}
                        serviceDuration={120}
                        providerId={profile.id}
                        providerName={profile.business_name}
                        providerEmail={profile.email}
                        isOnline={false}
                        buttonClassName="bg-[#2a9d8f] hover:bg-[#21857a] text-white border-0"
                        providerAvailability={{ days: ['mon', 'tue', 'wed', 'thu', 'fri'], startTime: '09:00', endTime: '17:30' }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* ── GALLERY ── */}
              {activeTab === 'gallery' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {galleryImages.map((img, i) => (
                    <div key={i} className="aspect-square rounded-2xl overflow-hidden group bg-muted">
                      <img
                        {...getImageWithFallback(img, IMAGES.sandy.profile)}
                        alt={`Sandy Mitchell — photo ${i + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT: sticky booking card */}
            <div className="hidden lg:block">
              <div className="sticky top-24 space-y-4">
                <div className="rounded-2xl border border-border/60 shadow-elegant bg-card p-6">
                  {lowestPrice && (
                    <div className="mb-4">
                      <span className="text-xs text-muted-foreground uppercase tracking-wide">Starting from</span>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="font-heading text-3xl text-[#2a9d8f]">R{lowestPrice}</span>
                        <span className="text-sm text-muted-foreground">/ session</span>
                      </div>
                    </div>
                  )}

                  <Button
                    className="w-full mb-3 text-white"
                    style={{ backgroundColor: '#2a9d8f' }}
                    size="lg"
                    onClick={() => setActiveTab('services')}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Book with Sandy
                  </Button>

                  <Button variant="outline" className="w-full mb-4" size="lg" asChild>
                    <a href={`mailto:${profile.email}`}>
                      <Mail className="h-4 w-4 mr-2" />
                      Send Message
                    </a>
                  </Button>

                  <div className="text-xs text-center text-muted-foreground mb-4">
                    No charge until confirmed
                  </div>

                  <Separator className="mb-4" />

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400 shrink-0" />
                      <span><strong>4.9</strong> · 127 reviews</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span>{profile.years_experience} years of practice</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span>500+ happy clients</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span>{profile.location}</span>
                    </div>
                  </div>
                </div>

                {/* Verified badge */}
                <div className="rounded-xl border border-border/40 bg-green-50/50 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-green-800">
                    <ShieldCheck className="h-4 w-4" />
                    Verified Provider
                  </div>
                  <p className="text-xs text-green-700/80 leading-relaxed">
                    Identity and qualifications independently verified by the Omni Wellness team.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile sticky bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-background/95 backdrop-blur-md border-t border-border/50 px-4 py-3 flex items-center gap-3">
        <div className="flex-1">
          {lowestPrice && (
            <div className="flex items-baseline gap-1">
              <span className="font-heading text-lg text-[#2a9d8f]">R{lowestPrice}</span>
              <span className="text-xs text-muted-foreground">/ session</span>
            </div>
          )}
        </div>
        <Button
          className="text-white px-6"
          style={{ backgroundColor: '#2a9d8f' }}
          onClick={() => setActiveTab('services')}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Book
        </Button>
        <Button variant="outline" size="icon" asChild>
          <a href={`mailto:${profile.email}`} aria-label="Send email">
            <Mail className="h-4 w-4" />
          </a>
        </Button>
      </div>

      <Footer />
    </div>
  );
};

export default SandyMitchellProfile;
