import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  ChevronLeft,
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
  Youtube,
  Heart,
  Share2,
  CheckCircle,
  Languages,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { getProviderById } from '@/data/providerDirectory';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';
import Footer from '@/components/Footer';

const IndividualProviderProfile = () => {
  // Route is /provider/:id — match the param name. Old code used providerId which never resolved,
  // sent everyone to the "Provider Not Found" / redirect loop.
  const { id: providerId } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'packages' | 'reviews'>('overview');
  // Start with the static directory hit (Sandy/Chad/Chief/2BeWell) if present, else load from DB.
  const [providerData, setProviderData] = useState(() => (providerId ? getProviderById(providerId) : undefined));
  const [loading, setLoading] = useState(false);

  // Real providers live in Supabase, not the hardcoded directory. When the id isn't a static
  // entry, fetch provider_profiles + services and map them into the same shape the page renders.
  // This is what "View Public Profile" from the Provider Dashboard hits — previously every real
  // provider got "Provider Not Found" because their UUID wasn't in the static list.
  useEffect(() => {
    if (!providerId) return;
    const staticHit = getProviderById(providerId);
    if (staticHit) { setProviderData(staticHit); return; }

    let cancelled = false;
    setLoading(true);
    (async () => {
      const { data: prof } = await supabase
        .from('provider_profiles')
        .select('*')
        .eq('id', providerId)
        .maybeSingle();

      if (cancelled) return;
      if (!prof) { setProviderData(undefined); setLoading(false); return; }

      const { data: svcs } = await supabase
        .from('services')
        .select('*')
        .eq('provider_id', providerId)
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (cancelled) return;

      setProviderData({
        profile: {
          id: prof.id,
          business_name: prof.business_name || 'Wellness Provider',
          description: prof.description || '',
          philosophy: '',
          specialties: prof.specialties || [],
          certifications: prof.certifications || [],
          badges: prof.certifications || [],
          languages: [],
          location: prof.location || 'South Africa',
          email: '',
          website: prof.website || '',
          profile_image_url: prof.profile_image_url || '',
          cover_image: prof.profile_image_url || '',
          years_experience: prof.experience_years || 0,
          total_clients: 0,
          rating: 0,
          verified: prof.verified ?? false,
          featured: false,
          category: 'Wellness',
          social_media: {},
          availability: prof.availability || { days: [], hours: '' },
        },
        services: (svcs || []).map((s: any) => ({
          id: s.id,
          title: s.title,
          description: s.description || '',
          category: s.category || 'Wellness',
          price_zar: s.price_zar || 0,
          price_wellcoins: s.price_wellcoins || 0,
          duration_minutes: s.duration_minutes || 60,
          location: s.location || prof.location || '',
          is_online: s.is_online || false,
          benefits: [],
        })),
        packages: [],
      } as any);
      setLoading(false);
    })();

    return () => { cancelled = true; };
  }, [providerId]);

  // Sandy has a richer custom page at /provider/sandy-mitchell with full hero, gallery, and
  // BookingSystem integration. Redirect any IDs that resolve to her record so the user always
  // lands on the canonical version (kills the duplicate-profile issue).
  if (providerId === 'sandy-mitchell-dru-yoga' || providerId === 'sandy-mitchell') {
    return <Navigate to="/provider/sandy-mitchell" replace />;
  }

  if (!providerId) return <Navigate to="/provider-directory" replace />;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <UnifiedNavigation />
        <main id="main-content" className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground text-sm">Loading provider…</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!providerData) {
    return (
      <div className="min-h-screen flex flex-col">
        <UnifiedNavigation />
        <main id="main-content" className="flex-1 flex items-center justify-center">
          <div className="text-center px-4">
            <div className="text-6xl mb-4">🌿</div>
            <h1 className="font-heading text-3xl mb-3">Provider Not Found</h1>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              This provider may have moved or is no longer available.
            </p>
            <Button asChild>
              <Link to="/provider-directory">Browse All Providers</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const { profile, services, packages } = providerData;

  const getSocialIcon = (platform: string) => {
    const map: Record<string, React.ElementType> = {
      instagram: Instagram, facebook: Facebook, linkedin: Linkedin,
      twitter: Twitter, youtube: Youtube,
    };
    return map[platform] || Globe;
  };

  const reviewsPlaceholder = [
    { name: 'Amara N.', avatar: '', date: 'March 2026', rating: 5, text: 'Truly transformative session. The space held felt safe and sacred — I left feeling reconnected to myself.', service: 'Sound Healing Session' },
    { name: 'Sipho M.', avatar: '', date: 'February 2026', rating: 5, text: 'Professional, warm, and deeply knowledgeable. Would book again without hesitation.', service: 'Wellness Consultation' },
    { name: 'Caro L.', avatar: '', date: 'January 2026', rating: 5, text: 'The corporate retreat package exceeded every expectation. Our whole team felt the shift.', service: 'Corporate Wellness Package' },
  ];

  const lowestPrice = services.length > 0
    ? Math.min(...services.map(s => s.price_zar).filter(Boolean))
    : null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <UnifiedNavigation />

      <main id="main-content" className="flex-1">
        {/* ── HERO ── */}
        <div className="relative h-[320px] sm:h-[380px] lg:h-[420px] overflow-hidden bg-muted">
          {profile.cover_image ? (
            <img
              src={profile.cover_image}
              alt={`${profile.business_name} cover`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 via-primary/10 to-omni-violet/10" />
          )}
          {/* Gradient fade at bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

          {/* Nav buttons */}
          <div className="absolute top-4 left-4 flex gap-2 z-10">
            <Button
              variant="secondary"
              size="sm"
              asChild
              className="bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white"
            >
              <Link to="/provider-directory">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Link>
            </Button>
          </div>
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            <button
              onClick={() => setSaved(s => !s)}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
              aria-label={saved ? 'Remove from saved' : 'Save provider'}
            >
              <Heart className={`h-4 w-4 transition-colors ${saved ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
            </button>
            <button
              onClick={() => navigator.share?.({ title: profile.business_name, url: window.location.href })}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
              aria-label="Share profile"
            >
              <Share2 className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* ── IDENTITY STRIP ── */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end gap-5 -mt-14 mb-6 relative z-10">
            {/* Avatar lifted from cover */}
            <div className="relative shrink-0">
              <Avatar className="h-24 w-24 sm:h-28 sm:w-28 border-4 border-background shadow-xl">
                <AvatarImage src={profile.profile_image_url} alt={profile.business_name} />
                <AvatarFallback className="text-2xl font-heading bg-primary/10 text-primary">
                  {profile.business_name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {profile.verified && (
                <span className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1 border-2 border-background">
                  <ShieldCheck className="h-3.5 w-3.5 text-white" />
                </span>
              )}
            </div>

            <div className="pb-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="font-heading text-2xl sm:text-3xl leading-tight truncate">
                  {profile.business_name}
                </h1>
                {profile.featured && (
                  <Badge className="bg-gradient-to-r from-omni-orange/90 to-omni-yellow/90 text-white border-0 shrink-0">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Omni Circle
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  {profile.location}
                </span>
                {profile.rating > 0 && (
                  <span className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <strong className="text-foreground">{profile.rating}</strong>
                    {profile.total_clients > 0 && <>&nbsp;·&nbsp;{profile.total_clients} clients</>}
                  </span>
                )}
                {profile.years_experience > 0 && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {profile.years_experience} yrs experience
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ── SPECIALTIES PILLS ── */}
          <div className="flex flex-wrap gap-2 mb-8">
            {profile.specialties.map((s) => (
              <span
                key={s}
                className="px-3 py-1 rounded-full text-xs font-medium bg-primary/8 text-primary border border-primary/15"
              >
                {s}
              </span>
            ))}
          </div>

          <Separator className="mb-8" />

          {/* ── MAIN LAYOUT: content + sticky sidebar ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pb-24 lg:pb-16">

            {/* LEFT — scrollable content */}
            <div className="lg:col-span-2 space-y-10">

              {/* About */}
              <section aria-label="About">
                <h2 className="font-heading text-2xl mb-4">About</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">{profile.description}</p>
                {profile.philosophy && (
                  <blockquote className="border-l-3 border-primary pl-5 italic text-foreground/80 bg-primary/4 rounded-r-lg py-3 pr-4">
                    "{profile.philosophy}"
                  </blockquote>
                )}
              </section>

              {/* Certifications */}
              {profile.certifications?.length > 0 && (
                <section aria-label="Certifications">
                  <h2 className="font-heading text-2xl mb-4">Certifications & Training</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {profile.certifications.map((cert) => (
                      <div key={cert} className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 border border-border/40">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <span className="text-sm">{cert}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Tab Nav */}
              <div className="border-b border-border">
                <nav className="flex gap-0 -mb-px" role="tablist" aria-label="Profile sections">
                  {(['overview', 'services', 'packages', 'reviews'] as const).map(tab => (
                    <button
                      key={tab}
                      role="tab"
                      aria-selected={activeTab === tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-5 py-3 text-sm font-medium capitalize border-b-2 transition-colors ${
                        activeTab === tab
                          ? 'border-primary text-primary'
                          : 'border-transparent text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab content */}
              {activeTab === 'overview' && (
                <section className="space-y-8">
                  {/* Badges */}
                  {profile.badges?.length > 0 && (
                    <div>
                      <h3 className="font-heading text-xl mb-4">Achievements</h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.badges.map(b => (
                          <Badge key={b} variant="outline" className="border-primary/30 text-primary gap-1">
                            <Award className="h-3 w-3" />
                            {b}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Languages + Availability — each only shown when it has content */}
                  {(profile.languages?.length > 0 || profile.availability?.days?.length > 0 || profile.availability?.hours) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {profile.languages?.length > 0 && (
                        <div>
                          <h3 className="font-heading text-xl mb-3">Languages</h3>
                          <div className="flex flex-wrap gap-2">
                            {profile.languages.map(lang => (
                              <span key={lang} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm bg-muted border border-border/50">
                                <Languages className="h-3.5 w-3.5 text-muted-foreground" />
                                {lang}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {(profile.availability?.days?.length > 0 || profile.availability?.hours) && (
                        <div>
                          <h3 className="font-heading text-xl mb-3">Availability</h3>
                          <div className="text-sm text-muted-foreground space-y-1">
                            {profile.availability?.days?.length > 0 && <p>{profile.availability.days.join(', ')}</p>}
                            {profile.availability?.hours && <p>{profile.availability.hours}</p>}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* If a real provider has no enrichment yet, give the overview something meaningful */}
                  {!profile.badges?.length && !profile.languages?.length && !profile.availability?.days?.length && !profile.availability?.hours && (
                    <p className="text-sm text-muted-foreground">
                      {profile.description || "This provider is still completing their profile. Check back soon for more details."}
                    </p>
                  )}
                </section>
              )}

              {activeTab === 'services' && (
                <section className="space-y-5">
                  {services.length === 0 && (
                    <div className="text-center py-16 px-4 rounded-2xl border border-border/50 bg-muted/30">
                      <Sparkles className="h-10 w-10 mx-auto mb-3 text-muted-foreground/30" />
                      <h3 className="font-heading text-lg mb-1">No services listed yet</h3>
                      <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                        This provider is still setting up their offerings. Reach out to enquire about availability.
                      </p>
                    </div>
                  )}
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className="rounded-2xl border border-border/50 bg-card overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="p-5 sm:p-6">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <h3 className="font-heading text-lg leading-snug">{service.title}</h3>
                              <Badge variant="secondary" className="text-xs shrink-0">{service.category}</Badge>
                              {service.is_online && (
                                <Badge variant="outline" className="text-xs text-green-700 border-green-300 bg-green-50 shrink-0">
                                  Online available
                                </Badge>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />{service.duration_minutes} min
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />{service.location}
                              </span>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="font-heading text-xl text-primary">R{service.price_zar}</div>
                            <div className="flex items-center justify-end gap-1 text-xs text-muted-foreground mt-0.5">
                              <Coins className="h-3 w-3 text-omni-orange" />
                              {service.price_wellcoins} WC
                            </div>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{service.description}</p>

                        {service.benefits?.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {service.benefits.slice(0, 4).map(b => (
                              <span key={b} className="flex items-center gap-1 text-xs text-green-800 bg-green-50 border border-green-200 rounded-full px-2.5 py-1">
                                <CheckCircle className="h-3 w-3" />{b}
                              </span>
                            ))}
                            {service.benefits.length > 4 && (
                              <span className="text-xs text-muted-foreground py-1">+{service.benefits.length - 4} more</span>
                            )}
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Button className="flex-1 bg-primary hover:bg-primary/90" size="sm">
                            <Calendar className="h-3.5 w-3.5 mr-2" />
                            Book
                          </Button>
                          <Button variant="outline" size="sm">Enquire</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </section>
              )}

              {activeTab === 'packages' && (
                <section className="space-y-5">
                  {packages.length === 0 && (
                    <div className="text-center py-16 px-4 rounded-2xl border border-border/50 bg-muted/30">
                      <Award className="h-10 w-10 mx-auto mb-3 text-muted-foreground/30" />
                      <h3 className="font-heading text-lg mb-1">No packages yet</h3>
                      <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                        This provider offers individual services — see the Services tab to book.
                      </p>
                    </div>
                  )}
                  {packages.map((pkg) => (
                    <div key={pkg.id} className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/4 to-transparent p-5 sm:p-6">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <h3 className="font-heading text-xl mb-1 text-primary">{pkg.title}</h3>
                          <p className="text-sm text-muted-foreground">{pkg.description}</p>
                          {pkg.duration && (
                            <span className="inline-block mt-2 px-2.5 py-1 rounded-full text-xs bg-primary/10 text-primary">{pkg.duration}</span>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <div className="font-heading text-2xl text-primary">R{pkg.price_zar}</div>
                          <div className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                            <Coins className="h-3 w-3 text-omni-orange" />{pkg.price_wellcoins} WC
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 mb-5">
                        {pkg.includes.map(item => (
                          <div key={item} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>

                      {pkg.savings && (
                        <div className="text-sm text-green-800 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5 mb-4">
                          {pkg.savings}
                        </div>
                      )}

                      <Button className="w-full" size="lg">
                        <Calendar className="h-4 w-4 mr-2" />
                        Book Package
                      </Button>
                    </div>
                  ))}
                </section>
              )}

              {activeTab === 'reviews' && (
                <section>
                  {profile.rating > 0 ? (
                  <>
                  {/* Rating summary */}
                  <div className="flex items-center gap-6 p-6 rounded-2xl bg-muted/50 border border-border/50 mb-6">
                    <div className="text-center">
                      <div className="font-heading text-5xl text-primary leading-none mb-1">{profile.rating}</div>
                      <div className="flex justify-center gap-0.5 mb-1">
                        {[1,2,3,4,5].map(i => (
                          <Star key={i} className={`h-4 w-4 ${i <= Math.round(profile.rating) ? 'fill-amber-400 text-amber-400' : 'text-muted'}`} />
                        ))}
                      </div>
                      <div className="text-xs text-muted-foreground">Overall</div>
                    </div>
                    <Separator orientation="vertical" className="h-16" />
                    <div className="flex-1 space-y-1.5">
                      {['Communication', 'Knowledge', 'Value', 'Experience'].map(cat => (
                        <div key={cat} className="flex items-center gap-3 text-sm">
                          <span className="text-muted-foreground w-28">{cat}</span>
                          <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: '95%' }} />
                          </div>
                          <span className="text-xs text-muted-foreground w-6">4.9</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Review cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {reviewsPlaceholder.map((review, i) => (
                      <div key={i} className="p-5 rounded-2xl border border-border/50 bg-card">
                        <div className="flex items-center gap-3 mb-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                              {review.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-sm">{review.name}</div>
                            <div className="text-xs text-muted-foreground">{review.date}</div>
                          </div>
                          <div className="ml-auto flex gap-0.5">
                            {[1,2,3,4,5].map(s => (
                              <Star key={s} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-2">{review.text}</p>
                        <span className="text-xs text-primary/70">{review.service}</span>
                      </div>
                    ))}
                  </div>
                  </>
                  ) : (
                    <div className="text-center py-16 px-4 rounded-2xl border border-border/50 bg-muted/30">
                      <Star className="h-10 w-10 mx-auto mb-3 text-muted-foreground/30" />
                      <h3 className="font-heading text-lg mb-1">No reviews yet</h3>
                      <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                        This provider hasn't received reviews yet. Be the first to book a session and share your experience.
                      </p>
                    </div>
                  )}
                </section>
              )}
            </div>

            {/* RIGHT — sticky booking card */}
            <div className="hidden lg:block">
              <div className="sticky top-24 space-y-4">
                {/* Booking card */}
                <div className="rounded-2xl border border-border/60 shadow-elegant bg-card p-6">
                  {lowestPrice && (
                    <div className="mb-4">
                      <span className="text-xs text-muted-foreground uppercase tracking-wide">Starting from</span>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="font-heading text-3xl text-primary">R{lowestPrice}</span>
                        <span className="text-sm text-muted-foreground">/ session</span>
                      </div>
                    </div>
                  )}

                  <Button className="w-full mb-3 bg-primary hover:bg-primary/90 text-white" size="lg">
                    <Calendar className="h-4 w-4 mr-2" />
                    Book a Session
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
                      <span><strong>{profile.rating}</strong> · {profile.total_clients} clients served</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span>{profile.years_experience} years of practice</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span>{profile.location}</span>
                    </div>
                    {profile.availability?.days && (
                      <div className="flex items-start gap-3">
                        <Calendar className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                        <span>{profile.availability.days.join(', ')}<br />{profile.availability.hours}</span>
                      </div>
                    )}
                  </div>

                  {Object.keys(profile.social_media || {}).length > 0 && (
                    <>
                      <Separator className="my-4" />
                      <div className="flex justify-center gap-2">
                        {Object.entries(profile.social_media).map(([platform, handle]) => {
                          if (!handle) return null;
                          const Icon = getSocialIcon(platform);
                          return (
                            <a
                              key={platform}
                              href={`https://${platform}.com/${(handle as string).replace('@', '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={platform}
                              className="p-2 rounded-full bg-muted hover:bg-primary/10 transition-colors"
                            >
                              <Icon className="h-4 w-4 text-muted-foreground" />
                            </a>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>

                {/* Trust badges */}
                {profile.verified && (
                  <div className="rounded-xl border border-border/40 bg-green-50/50 p-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-green-800">
                      <ShieldCheck className="h-4 w-4" />
                      Verified Provider
                    </div>
                    <p className="text-xs text-green-700/80 leading-relaxed">
                      Identity and qualifications independently verified by the Omni Wellness team.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile sticky booking bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-background/95 backdrop-blur-md border-t border-border/50 px-4 py-3 flex items-center gap-3">
        <div className="flex-1">
          {lowestPrice && (
            <div className="flex items-baseline gap-1">
              <span className="font-heading text-lg text-primary">R{lowestPrice}</span>
              <span className="text-xs text-muted-foreground">/ session</span>
            </div>
          )}
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-white px-6">
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

export default IndividualProviderProfile;
