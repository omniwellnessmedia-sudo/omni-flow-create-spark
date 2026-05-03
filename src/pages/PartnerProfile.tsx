import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import UnifiedNavigation from "@/components/navigation/UnifiedNavigation";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Star,
  Clock,
  Globe,
  Phone,
  Award,
  Calendar,
  Coins,
  ChevronLeft,
  Play,
  Heart,
  Eye,
  ExternalLink,
  Mail,
  CheckCircle,
  ShieldCheck,
  Sparkles,
  MessageSquare,
  FileText,
  Share2,
} from "lucide-react";

interface PartnerProfile {
  id: string;
  business_name: string | null;
  description: string | null;
  location: string | null;
  specialties: string[] | null;
  certifications: string[] | null;
  verified: boolean | null;
  profile_image_url: string | null;
  website: string | null;
  phone: string | null;
  experience_years: number | null;
  created_at: string;
  profile: {
    full_name: string | null;
    email: string | null;
    avatar_url: string | null;
  };
  services: Array<{
    id: string;
    title: string;
    description: string | null;
    category: string | null;
    price_zar: number | null;
    price_wellcoins: number | null;
    duration_minutes: number | null;
    is_online: boolean | null;
    location: string | null;
  }>;
  media?: Array<{
    id: string;
    title: string;
    description: string | null;
    media_type: string;
    media_url: string;
    thumbnail_url: string | null;
    featured: boolean;
    view_count: number;
    created_at: string;
  }>;
  testimonials?: Array<{
    id: string;
    client_name: string;
    client_image_url: string | null;
    testimonial_text: string;
    rating: number;
    service_type: string | null;
    featured: boolean;
    created_at: string;
  }>;
  posts?: Array<{
    id: string;
    title: string;
    excerpt: string | null;
    featured_image_url: string | null;
    category: string | null;
    view_count: number;
    created_at: string;
  }>;
  website_info?: {
    id: string;
    page_title: string;
    published: boolean;
    custom_domain: string | null;
  };
}

const PartnerProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [partner, setPartner] = useState<PartnerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'about' | 'services' | 'gallery' | 'reviews' | 'articles'>('about');

  useEffect(() => {
    if (id) fetchPartner(id);
  }, [id]);

  const fetchPartner = async (partnerId: string) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('provider_profiles')
        .select(`*, profile:profiles(full_name, email, avatar_url), services(*)`)
        .eq('id', partnerId)
        .single();

      if (profileError) throw profileError;

      const { data: mediaData } = await supabase
        .from('provider_media')
        .select('*')
        .eq('provider_id', partnerId)
        .eq('active', true)
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(6);

      const { data: testimonialsData } = await supabase
        .from('provider_testimonials')
        .select('*')
        .eq('provider_id', partnerId)
        .eq('approved', true)
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(4);

      const { data: postsData } = await supabase
        .from('provider_posts')
        .select('id, title, excerpt, featured_image_url, category, view_count, created_at')
        .eq('provider_id', partnerId)
        .eq('published', true)
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(3);

      const { data: websiteData } = await supabase
        .from('provider_websites')
        .select('id, page_title, published, custom_domain')
        .eq('provider_id', partnerId)
        .single();

      setPartner({
        ...profileData,
        media: mediaData || [],
        testimonials: testimonialsData || [],
        posts: postsData || [],
        website_info: websiteData,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getDisplayName = () =>
    partner?.business_name || partner?.profile?.full_name || 'Wellness Provider';

  const getProfileImage = () =>
    partner?.profile_image_url || partner?.profile?.avatar_url || '';

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return null;
    if (minutes < 60) return `${minutes} min`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };

  const avgRating = partner?.testimonials?.length
    ? (partner.testimonials.reduce((s, t) => s + t.rating, 0) / partner.testimonials.length).toFixed(1)
    : null;

  const lowestPrice = partner?.services?.length
    ? Math.min(...partner.services.map(s => s.price_zar ?? Infinity).filter(p => p !== Infinity))
    : null;

  const tabs = [
    { id: 'about' as const, label: 'About' },
    ...(partner?.services?.length ? [{ id: 'services' as const, label: `Services (${partner.services.length})` }] : []),
    ...(partner?.media?.length ? [{ id: 'gallery' as const, label: 'Gallery' }] : []),
    ...(partner?.testimonials?.length ? [{ id: 'reviews' as const, label: `Reviews (${partner.testimonials.length})` }] : []),
    ...(partner?.posts?.length ? [{ id: 'articles' as const, label: 'Articles' }] : []),
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <UnifiedNavigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground text-sm">Loading profile…</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !partner) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <UnifiedNavigation />
        <main id="main-content" className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <div className="text-6xl mb-4">🌿</div>
            <h1 className="font-heading text-3xl mb-3">Partner Not Found</h1>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              This partner profile may have moved or is no longer available.
            </p>
            <Button asChild>
              <Link to="/partners-directory">Back to Partners</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const displayName = getDisplayName();
  const profileImage = getProfileImage();
  const initials = displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <UnifiedNavigation />

      <main id="main-content" className="flex-1">
        {/* ── HERO COVER ── */}
        <div className="relative h-[300px] sm:h-[360px] lg:h-[400px] overflow-hidden bg-muted">
          {partner.media?.[0] ? (
            <img
              src={partner.media[0].thumbnail_url || partner.media[0].media_url}
              alt={`${displayName} cover`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/25 via-omni-violet/15 to-omni-orange/10" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/15 to-transparent" />

          {/* Nav */}
          <div className="absolute top-4 left-4 z-10">
            <Button variant="secondary" size="sm" asChild
              className="bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white">
              <Link to="/partners-directory">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Partners
              </Link>
            </Button>
          </div>
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            <button
              onClick={() => setSaved(s => !s)}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
              aria-label={saved ? 'Unsave' : 'Save partner'}
            >
              <Heart className={`h-4 w-4 transition-colors ${saved ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
            </button>
            <button
              onClick={() => navigator.share?.({ title: displayName, url: window.location.href })}
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
                <AvatarImage src={profileImage} alt={displayName} />
                <AvatarFallback className="text-2xl font-heading bg-primary/10 text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {partner.verified && (
                <span className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1 border-2 border-background">
                  <ShieldCheck className="h-3.5 w-3.5 text-white" />
                </span>
              )}
            </div>

            <div className="pb-1 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="font-heading text-2xl sm:text-3xl leading-tight">{displayName}</h1>
                {partner.verified && (
                  <Badge className="bg-gradient-to-r from-primary/90 to-omni-green/80 text-white border-0 shrink-0">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Omni Partner
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                {partner.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    {partner.location}
                  </span>
                )}
                {avgRating && (
                  <span className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <strong className="text-foreground">{avgRating}</strong>
                    &nbsp;·&nbsp;{partner.testimonials!.length} reviews
                  </span>
                )}
                {partner.experience_years && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {partner.experience_years} yrs experience
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Partner since {new Date(partner.created_at).getFullYear()}
                </span>
              </div>
            </div>
          </div>

          {/* Specialties */}
          {partner.specialties?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {partner.specialties.map(s => (
                <span key={s}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-primary/8 text-primary border border-primary/15">
                  {s}
                </span>
              ))}
            </div>
          )}

          <Separator className="mb-8" />

          {/* ── MAIN LAYOUT ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pb-24 lg:pb-16">

            {/* LEFT: scrollable content */}
            <div className="lg:col-span-2 space-y-8">

              {/* Tab nav */}
              {tabs.length > 1 && (
                <div className="border-b border-border">
                  <nav className="flex gap-0 -mb-px overflow-x-auto" role="tablist" aria-label="Partner sections">
                    {tabs.map(tab => (
                      <button
                        key={tab.id}
                        role="tab"
                        aria-selected={activeTab === tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 sm:px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                          activeTab === tab.id
                            ? 'border-primary text-primary'
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </nav>
                </div>
              )}

              {/* ── ABOUT ── */}
              {activeTab === 'about' && (
                <div className="space-y-8">
                  <section>
                    <h2 className="font-heading text-2xl mb-4">About</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {partner.description || `${displayName} hasn't added a description yet.`}
                    </p>
                  </section>

                  {partner.certifications?.length > 0 && (
                    <section>
                      <h2 className="font-heading text-2xl mb-4">Certifications</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {partner.certifications.map(cert => (
                          <div key={cert} className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 border border-border/40">
                            <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                            <span className="text-sm">{cert}</span>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {partner.website_info?.published && (
                    <section className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-5 sm:p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <ExternalLink className="h-4 w-4 text-primary" />
                            <h3 className="font-heading text-lg text-primary">Personal Website</h3>
                          </div>
                          <p className="text-sm font-medium">{partner.website_info.page_title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {partner.website_info.custom_domain || `${displayName}'s Wellness Hub`}
                          </p>
                        </div>
                        <Button variant="outline" size="sm" className="gap-1.5 shrink-0">
                          Visit
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </section>
                  )}
                </div>
              )}

              {/* ── SERVICES ── */}
              {activeTab === 'services' && (
                <section className="space-y-5">
                  {partner.services.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      No services listed yet.
                    </div>
                  ) : (
                    partner.services.map(service => (
                      <div key={service.id}
                        className="rounded-2xl border border-border/50 bg-card p-5 sm:p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <h3 className="font-heading text-lg">{service.title}</h3>
                              {service.category && (
                                <Badge variant="secondary" className="text-xs shrink-0">{service.category}</Badge>
                              )}
                              {service.is_online && (
                                <Badge variant="outline" className="text-xs text-green-700 border-green-300 bg-green-50 shrink-0">
                                  Online
                                </Badge>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                              {service.duration_minutes && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatDuration(service.duration_minutes)}
                                </span>
                              )}
                              {service.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {service.location}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            {service.price_zar && (
                              <div className="font-heading text-xl text-primary">R{service.price_zar}</div>
                            )}
                            {service.price_wellcoins && (
                              <div className="flex items-center justify-end gap-1 text-xs text-muted-foreground mt-0.5">
                                <Coins className="h-3 w-3 text-omni-orange" />
                                {service.price_wellcoins} WC
                              </div>
                            )}
                          </div>
                        </div>
                        {service.description && (
                          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                            {service.description}
                          </p>
                        )}
                        <div className="flex gap-2">
                          <Button className="flex-1 bg-primary hover:bg-primary/90" size="sm">
                            <Calendar className="h-3.5 w-3.5 mr-2" />
                            Book
                          </Button>
                          <Button variant="outline" size="sm">Enquire</Button>
                        </div>
                      </div>
                    ))
                  )}
                </section>
              )}

              {/* ── GALLERY ── */}
              {activeTab === 'gallery' && (
                <section>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {partner.media?.map(media => (
                      <div key={media.id}
                        className="group relative aspect-square rounded-2xl overflow-hidden bg-muted cursor-pointer">
                        <img
                          src={media.thumbnail_url || media.media_url}
                          alt={media.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {media.media_type === 'video' && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                            <div className="h-12 w-12 rounded-full bg-white/90 flex items-center justify-center">
                              <Play className="h-5 w-5 text-foreground ml-0.5" />
                            </div>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute bottom-2 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-white text-xs font-medium truncate">{media.title}</p>
                          <div className="flex items-center gap-1 text-white/70 text-xs mt-0.5">
                            <Eye className="h-3 w-3" />
                            {media.view_count}
                          </div>
                        </div>
                        {media.featured && (
                          <div className="absolute top-2 right-2">
                            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-primary text-white">
                              Featured
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* ── REVIEWS ── */}
              {activeTab === 'reviews' && (
                <section>
                  {avgRating && (
                    <div className="flex items-center gap-6 p-6 rounded-2xl bg-muted/50 border border-border/50 mb-6">
                      <div className="text-center">
                        <div className="font-heading text-5xl text-primary leading-none mb-1">{avgRating}</div>
                        <div className="flex justify-center gap-0.5 mb-1">
                          {[1,2,3,4,5].map(i => (
                            <Star key={i} className={`h-4 w-4 ${i <= Math.round(Number(avgRating)) ? 'fill-amber-400 text-amber-400' : 'text-muted'}`} />
                          ))}
                        </div>
                        <div className="text-xs text-muted-foreground">Overall</div>
                      </div>
                      <Separator orientation="vertical" className="h-16" />
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">
                          Based on {partner.testimonials!.length} client testimonial{partner.testimonials!.length > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {partner.testimonials?.map(t => (
                      <div key={t.id} className="p-5 rounded-2xl border border-border/50 bg-card">
                        <div className="flex items-center gap-3 mb-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={t.client_image_url || ''} alt={t.client_name} />
                            <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                              {t.client_name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm">{t.client_name}</div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(t.created_at).toLocaleDateString('en-ZA', { month: 'long', year: 'numeric' })}
                            </div>
                          </div>
                          <div className="flex gap-0.5 shrink-0">
                            {[1,2,3,4,5].map(i => (
                              <Star key={i} className={`h-3.5 w-3.5 ${i <= t.rating ? 'fill-amber-400 text-amber-400' : 'text-muted'}`} />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-3 italic">
                          "{t.testimonial_text}"
                        </p>
                        <div className="flex items-center justify-between">
                          {t.service_type && (
                            <span className="text-xs text-primary/70">{t.service_type}</span>
                          )}
                          {t.featured && (
                            <Badge variant="outline" className="text-xs border-primary/30 text-primary ml-auto">
                              <Sparkles className="h-3 w-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* ── ARTICLES ── */}
              {activeTab === 'articles' && (
                <section className="space-y-4">
                  {partner.posts?.map(post => (
                    <div key={post.id}
                      className="flex gap-4 rounded-2xl border border-border/50 bg-card p-4 hover:shadow-md transition-shadow cursor-pointer">
                      {post.featured_image_url && (
                        <div className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-muted">
                          <img
                            src={post.featured_image_url}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-heading text-base sm:text-lg leading-snug mb-1 line-clamp-2">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {post.excerpt}
                          </p>
                        )}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          {post.category && (
                            <span className="px-2 py-0.5 rounded-full bg-primary/8 text-primary border border-primary/15">
                              {post.category}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />{post.view_count}
                          </span>
                          <span>{new Date(post.created_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </section>
              )}
            </div>

            {/* RIGHT: sticky card */}
            <div className="hidden lg:block">
              <div className="sticky top-24 space-y-4">
                {/* Booking card */}
                <div className="rounded-2xl border border-border/60 shadow-elegant bg-card p-6">
                  {lowestPrice !== null && lowestPrice !== Infinity && (
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

                  {partner.profile?.email && (
                    <Button variant="outline" className="w-full mb-4" size="lg" asChild>
                      <a href={`mailto:${partner.profile.email}`}>
                        <Mail className="h-4 w-4 mr-2" />
                        Send Message
                      </a>
                    </Button>
                  )}

                  <div className="text-xs text-center text-muted-foreground mb-4">
                    No charge until confirmed
                  </div>

                  <Separator className="mb-4" />

                  <div className="space-y-3 text-sm">
                    {avgRating && (
                      <div className="flex items-center gap-3">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400 shrink-0" />
                        <span><strong>{avgRating}</strong> · {partner.testimonials!.length} reviews</span>
                      </div>
                    )}
                    {partner.experience_years && (
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span>{partner.experience_years} years of practice</span>
                      </div>
                    )}
                    {partner.location && (
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span>{partner.location}</span>
                      </div>
                    )}
                    {partner.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                        <a href={`tel:${partner.phone}`} className="hover:text-primary transition-colors">
                          {partner.phone}
                        </a>
                      </div>
                    )}
                    {partner.website && (
                      <div className="flex items-center gap-3">
                        <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                        <a href={partner.website} target="_blank" rel="noopener noreferrer"
                          className="hover:text-primary transition-colors flex items-center gap-1">
                          Website
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Verified badge */}
                {partner.verified && (
                  <div className="rounded-xl border border-border/40 bg-green-50/50 p-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-green-800">
                      <ShieldCheck className="h-4 w-4" />
                      Verified Omni Partner
                    </div>
                    <p className="text-xs text-green-700/80 leading-relaxed">
                      Independently verified by the Omni Wellness team for quality and authenticity.
                    </p>
                  </div>
                )}

                {/* Quick stats */}
                <div className="rounded-xl border border-border/40 bg-card p-4">
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div>
                      <div className="font-heading text-xl text-primary">{partner.services?.length || 0}</div>
                      <div className="text-xs text-muted-foreground">Services</div>
                    </div>
                    <div>
                      <div className="font-heading text-xl text-primary">{partner.testimonials?.length || 0}</div>
                      <div className="text-xs text-muted-foreground">Reviews</div>
                    </div>
                    <div>
                      <div className="font-heading text-xl text-primary">{partner.media?.length || 0}</div>
                      <div className="text-xs text-muted-foreground">Media</div>
                    </div>
                    <div>
                      <div className="font-heading text-xl text-primary">{partner.posts?.length || 0}</div>
                      <div className="text-xs text-muted-foreground">Articles</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile sticky bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-background/95 backdrop-blur-md border-t border-border/50 px-4 py-3 flex items-center gap-3">
        <div className="flex-1">
          {lowestPrice !== null && lowestPrice !== Infinity && (
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
        {partner.profile?.email && (
          <Button variant="outline" size="icon" asChild>
            <a href={`mailto:${partner.profile.email}`} aria-label="Send email">
              <Mail className="h-4 w-4" />
            </a>
          </Button>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default PartnerProfile;
