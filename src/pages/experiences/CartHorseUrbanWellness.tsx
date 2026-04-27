import { useState } from 'react';
import { useTourSEO } from '@/lib/seo';
import TourBookingSidebar from '@/components/tours/TourBookingSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';
import Footer from '@/components/Footer';
import { Check, X, Heart, Users, Clock, MapPin, Award, Shield, Leaf, Sun, Star, Sparkles, GraduationCap, HandHeart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const STORAGE_BASE = "https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images";

export default function CartHorseUrbanWellness() {
  const { toast } = useToast();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', organisation: '',
    preferredDate: '', ticketType: 'individual', attendees: '1',
    dietary: '', discipline: ''
  });

  useTourSEO({
    tourName: 'Hoofbeats & Healing — Cart Horse Urban Wellness Experience',
    title: 'Hoofbeats & Healing | Equine-Assisted Wellness | Impact Travel Cape Town',
    description: 'A CPD-accredited, evidence-based equine-assisted wellness experience in Cape Town. Connect with rescued working horses through the Pegasus Programme. Conscious impact travel that transforms lives — human and animal. From R1,800pp.',
    price: 1800,
    currency: 'ZAR',
    location: 'Cape Town, South Africa',
    duration: 'Full Day',
    rating: 5.0,
    reviewCount: 23,
    images: [],
    url: window.location.href
  });

  const tour = {
    id: 'cart-horse-urban-wellness',
    title: 'Hoofbeats & Healing — Cart Horse Urban Wellness Experience',
    price: 1800,
    price_from: 1800,
    duration: 'Full Day, 9am–4pm',
    destination: 'Cape Town, South Africa',
    max_participants: 20,
    overview: 'CPD-accredited full-day equine-assisted wellness experience with rescued working horses',
    start_date: new Date().toISOString(),
    end_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    active: true
  };

  const experienceHighlights = [
    { icon: Sparkles, title: 'Pegasus Programme', desc: 'Participate in the award-winning equine welfare and human wellness programme' },
    { icon: HandHeart, title: 'Equine Interaction', desc: 'Guided connection sessions with rescued and rehabilitated working horses' },
    { icon: Users, title: 'Handler Session', desc: 'Work alongside experienced handlers learning equine communication and care' },
    { icon: GraduationCap, title: 'CPD Certificate', desc: 'Receive a CPD-accredited certificate of completion for healthcare professionals' },
  ];

  const inclusions = [
    { included: true, text: 'Pegasus Programme facilitation' },
    { included: true, text: 'Equine-assisted interaction session' },
    { included: true, text: 'Handler-led horse care experience' },
    { included: true, text: 'CPD-accredited certificate' },
    { included: true, text: 'Light refreshments & herbal tea' },
    { included: true, text: 'Guided mindfulness session' },
    { included: true, text: 'Safety briefing & protective gear' },
    { included: true, text: 'Professional facilitation team' },
    { included: true, text: 'Commemorative impact report' },
    { included: false, text: 'Transport to/from venue' },
    { included: false, text: 'Full lunch (optional add-on R200pp)' },
    { included: false, text: 'Personal riding equipment' },
    { included: false, text: 'Overnight accommodation' },
  ];

  const targetAudience = [
    { title: 'Healthcare Professionals', desc: 'Earn CPD points through an evidence-based equine-assisted therapy experience. Ideal for psychologists, occupational therapists, social workers, and counsellors seeking experiential professional development.', badge: 'CPD Accredited' },
    { title: 'Corporate Teams', desc: 'A transformative team wellness day that builds empathy, presence, and connection. Move beyond standard team-building with an experience rooted in animal-assisted therapy and social impact.', badge: 'Team Wellness' },
    { title: 'Conscious Travellers', desc: 'For impact travellers seeking meaningful experiences that give back. Connect with rescued horses, support animal welfare, and engage with grassroots community programmes in Cape Town.', badge: 'Impact Travel' },
  ];

  const handleSubmitBooking = () => {
    if (!formData.name || !formData.email || !formData.preferredDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Enquiry Received",
      description: "Thank you! Our team will contact you within 24 hours to craft your personalised experience.",
    });
    setBookingOpen(false);
    setFormData({ name: '', email: '', phone: '', organisation: '', preferredDate: '', ticketType: 'individual', attendees: '1', dietary: '', discipline: '' });
  };

  // Minimum date: 14 days from now for bespoke scheduling
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 14);

  return (
    <>
      <UnifiedNavigation />

      {/* Hero Section */}
      <section className="relative h-[80vh] overflow-hidden">
        <img
          src={`${STORAGE_BASE}/provider-images/CPTCHA_BEACH_LIONSHEAD_MARCH_SHOOT%2002_OMNI-20.jpg`}
          alt="Equine-assisted wellness experience with Cart Horse"
          className="absolute inset-0 w-full h-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
        <div className="relative z-10 container mx-auto h-full flex items-center px-4">
          <div className="max-w-3xl text-white">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className="bg-amber-600/80 text-white border-white/30">CPD Accredited</Badge>
              <Badge className="bg-green-600/80 text-white border-white/30">Evidence-Based</Badge>
              <Badge className="bg-blue-600/80 text-white border-white/30">UWC Research Partner</Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 break-words">
              Hoofbeats & Healing
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-4 text-white/90">
              Equine-Assisted Wellness & Impact Travel Experience
            </p>
            <p className="text-base sm:text-lg mb-8 text-white/80 max-w-2xl break-words">
              A transformative full-day experience connecting you with rescued working horses through the Pegasus Programme.
              Evidence-based, CPD-accredited, and rooted in conscious impact travel that changes lives — human and animal.
            </p>
            <div className="flex flex-wrap gap-4 items-center">
              <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="bg-amber-600 hover:bg-amber-700">
                    Reserve Your Experience
                  </Button>
                </DialogTrigger>
              </Dialog>
              <Button
                size="lg"
                variant="outline"
                className="border-white/40 text-white hover:bg-white/10"
                onClick={() => document.getElementById('programme-details')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Explore the Programme
              </Button>
              <div className="flex items-center gap-4 text-white/90 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>9am–4pm</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Cape Town</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Block */}
      <section className="py-16 bg-gradient-to-br from-amber-50 via-white to-green-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <Badge className="mb-4 bg-amber-600">The Story</Badge>
                <h2 className="text-3xl font-bold mb-4">Where Healing Meets Hoofbeats</h2>
                <p className="text-base leading-relaxed mb-4">
                  In the heart of Cape Town, rescued working horses are finding new purpose — and so are the humans
                  who connect with them. The Cart Horse Protection Association's Pegasus Programme brings together
                  equine welfare and human wellness in a ground-breaking, research-backed experience.
                </p>
                <p className="text-base leading-relaxed text-muted-foreground">
                  This is not a riding lesson or a petting zoo. It is a carefully facilitated, evidence-based encounter
                  that invites you to slow down, be present, and discover what these remarkable animals can teach us
                  about resilience, trust, and authentic connection.
                </p>
              </div>
              <Card className="border-l-4 border-l-amber-500 bg-amber-50/50">
                <CardContent className="pt-6">
                  <blockquote className="text-lg italic text-muted-foreground leading-relaxed">
                    "The horses don't care about your title or your to-do list. They respond to your presence.
                    That's what makes this transformative — it strips away everything except what's real."
                  </blockquote>
                  <p className="mt-4 text-sm font-semibold">— Pegasus Programme Facilitator</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Highlights */}
      <section id="programme-details" className="py-16 bg-background scroll-mt-24">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-3 text-center">Your Experience</h2>
            <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
              A premium, bespoke wellness experience tailored to your group. Every session is personally curated.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {experienceHighlights.map((item, i) => (
                <Card key={i} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <item.icon className="w-8 h-8 text-amber-600 mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Itinerary Timeline */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-3 text-center">Experience Flow</h2>
            <p className="text-center text-muted-foreground mb-8">
              Your experience is personally scheduled to suit your group's availability.
            </p>
            <div className="space-y-6">
              <Card className="border-l-4 border-l-amber-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Sun className="w-5 h-5 text-amber-500" />
                    Arrival & Grounding
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <p>Welcome and orientation at the Cart Horse sanctuary. Mindfulness grounding exercise to transition from the pace of daily life into a space of presence and openness.</p>
                  <p>Introduction to equine-assisted wellness principles and the Pegasus Programme's research foundations with UWC.</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <HandHeart className="w-5 h-5 text-green-500" />
                    Equine Connection Session
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <p>Guided interaction with rescued horses in a safe, facilitated environment. Learn to read equine body language, practice non-verbal communication, and discover what the horses reflect back to you.</p>
                  <p>This is the heart of the experience — a space where empathy, vulnerability, and authentic connection are gently drawn out through the wisdom of these animals.</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Shield className="w-5 h-5 text-blue-500" />
                    Handler Experience & Horse Care
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <p>Work alongside experienced handlers in practical horse care — grooming, feeding, and stable management. Understand the rehabilitation journey of rescued working horses and the daily commitment of the Cart Horse team.</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Leaf className="w-5 h-5 text-purple-500" />
                    Reflection & Integration
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <p>Facilitated reflection circle with herbal tea and light refreshments. Process your experience, share insights, and receive your CPD certificate and personalised impact report documenting the change your visit supports.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Who Is This For */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Who Is This For?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {targetAudience.map((audience, i) => (
                <Card key={i} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <Badge className="w-fit mb-2" variant="secondary">{audience.badge}</Badge>
                    <CardTitle className="text-xl">{audience.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{audience.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">What's Included</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {inclusions.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  {item.included ? (
                    <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  ) : (
                    <X className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  )}
                  <span className={`text-sm ${item.included ? '' : 'text-muted-foreground'}`}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 bg-gradient-to-br from-amber-50 via-white to-green-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-3 text-center">Investment</h2>
            <p className="text-center text-muted-foreground mb-8">
              Premium bespoke experiences, personally curated for your group
            </p>
            <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <Card className="text-center hover:shadow-xl transition-shadow">
                <CardHeader>
                  <Badge className="mx-auto mb-2" variant="secondary">Individual / Small Group</Badge>
                  <Users className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                  <CardTitle className="text-xl">Individual Experience</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-amber-600 mb-1">R1,800</div>
                  <p className="text-sm text-muted-foreground">per person</p>
                  <p className="text-xs text-muted-foreground mt-2">1-20 participants</p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-xl transition-shadow border-amber-600 ring-2 ring-amber-600/20">
                <CardHeader>
                  <Badge className="mx-auto mb-2 bg-amber-600">Corporate Package</Badge>
                  <Award className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                  <CardTitle className="text-xl">Corporate Wellness Day</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-amber-600 mb-1">R14,500</div>
                  <p className="text-sm text-muted-foreground">flat rate (up to 20 pax)</p>
                  <p className="text-xs text-muted-foreground mt-2">Includes facilitation & CPD</p>
                </CardContent>
              </Card>
            </div>

            {/* Community Impact */}
            <Card className="mt-8 border-2 border-amber-600/20 bg-gradient-to-br from-amber-50/80 to-green-50/80">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                  <Heart className="w-10 h-10 text-amber-600 shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg mb-1">Impact Travel That Transforms Lives</h3>
                    <p className="text-sm text-muted-foreground">
                      Your participation directly funds the rescue, rehabilitation, and lifelong care of Cape Town's working horses.
                      A portion of proceeds supports the <strong>Dr. Phil-afel Foundation</strong> and <strong>Cart Horse Protection Association</strong>,
                      creating lasting change for both animals and the communities they serve.
                      <em> Section 18A tax-deductible donations available.</em>
                    </p>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <Link to="/csr-impact">
                    <Button variant="outline" size="sm">Learn About Our Impact Partners →</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">What Participants Say</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { quote: "I came expecting a nice day out. I left with a completely different understanding of what it means to be present. The horses see through everything.", name: "Dr. S. Malan", role: "Clinical Psychologist" },
                { quote: "Our team was transformed. The conversations that happened after the horse sessions were deeper than anything we've achieved in corporate workshops.", name: "R. Abrahams", role: "HR Director" },
                { quote: "This is what impact travel should be — real connection, real change, no performance. I'll be bringing my family back.", name: "L. Chen", role: "Conscious Traveller" },
              ].map((testimonial, i) => (
                <Card key={i} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex gap-1 mb-3">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-sm italic text-muted-foreground mb-4">"{testimonial.quote}"</p>
                    <p className="text-sm font-semibold">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="experience">
                <AccordionTrigger>Do I need horse-riding experience?</AccordionTrigger>
                <AccordionContent>
                  No riding experience is needed. This is not a riding experience — it is a facilitated wellness encounter focused on connection, presence, and care. All interactions are ground-based and guided by experienced facilitators.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="cpd">
                <AccordionTrigger>How does CPD accreditation work?</AccordionTrigger>
                <AccordionContent>
                  Healthcare professionals receive a CPD-accredited certificate upon completion. The programme is developed in partnership with UWC's research team and meets professional development requirements for psychologists, social workers, occupational therapists, and counsellors.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="corporate">
                <AccordionTrigger>Can this be customised for corporate groups?</AccordionTrigger>
                <AccordionContent>
                  Absolutely. Corporate experiences are fully bespoke — we work with your team to design the session around your wellness objectives, group dynamics, and available time. Contact us to discuss your vision and we'll craft the perfect experience.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="safety">
                <AccordionTrigger>Is it safe for people who are nervous around horses?</AccordionTrigger>
                <AccordionContent>
                  Yes. Our facilitators are trained to support participants at every comfort level. The horses in the Pegasus Programme are specifically selected for their calm temperaments, and all interactions are at your pace with professional guidance throughout.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="scheduling">
                <AccordionTrigger>How do I book a specific date?</AccordionTrigger>
                <AccordionContent>
                  Submit your preferred travel dates through our enquiry form and our team will personally coordinate with the Cart Horse sanctuary and facilitation team to confirm your experience. We recommend booking at least 2 weeks in advance for the best availability.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section id="booking-section" className="py-16 bg-background scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <TourBookingSidebar tour={tour} />
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Reserve Your Experience</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Tell us your preferred dates and we'll personally curate your experience.
            </p>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="modal-name">Full Name *</Label>
              <Input id="modal-name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Your full name" />
            </div>
            <div>
              <Label htmlFor="modal-email">Email *</Label>
              <Input id="modal-email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="your@email.com" />
            </div>
            <div>
              <Label htmlFor="modal-phone">Phone</Label>
              <Input id="modal-phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+27 (0) 00 000 0000" />
            </div>
            <div>
              <Label htmlFor="modal-org">Organisation (if applicable)</Label>
              <Input id="modal-org" value={formData.organisation} onChange={(e) => setFormData({ ...formData, organisation: e.target.value })} placeholder="Company or practice name" />
            </div>
            <div>
              <Label htmlFor="modal-date">Preferred Travel Date *</Label>
              <Input id="modal-date" type="date" value={formData.preferredDate} onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })} min={minDate.toISOString().split('T')[0]} />
              <p className="text-xs text-muted-foreground mt-1">We'll confirm availability and coordinate your bespoke experience.</p>
            </div>
            <div>
              <Label>Experience Type</Label>
              <Select value={formData.ticketType} onValueChange={(val) => setFormData({ ...formData, ticketType: val })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual / Small Group (R1,800pp)</SelectItem>
                  <SelectItem value="corporate">Corporate Wellness Day (R14,500)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="modal-attendees">Number of Attendees</Label>
              <Input id="modal-attendees" type="number" min="1" max="20" value={formData.attendees} onChange={(e) => setFormData({ ...formData, attendees: e.target.value })} />
            </div>
            <div>
              <Label>Professional Discipline (for CPD)</Label>
              <Select value={formData.discipline} onValueChange={(val) => setFormData({ ...formData, discipline: val })}>
                <SelectTrigger><SelectValue placeholder="Select if applicable" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="psychology">Psychology</SelectItem>
                  <SelectItem value="occupational-therapy">Occupational Therapy</SelectItem>
                  <SelectItem value="social-work">Social Work</SelectItem>
                  <SelectItem value="counselling">Counselling</SelectItem>
                  <SelectItem value="nursing">Nursing</SelectItem>
                  <SelectItem value="other-healthcare">Other Healthcare</SelectItem>
                  <SelectItem value="not-applicable">Not Applicable</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="modal-dietary">Dietary Requirements / Special Needs</Label>
              <Textarea id="modal-dietary" value={formData.dietary} onChange={(e) => setFormData({ ...formData, dietary: e.target.value })} placeholder="Allergies, accessibility needs, etc." rows={2} />
            </div>
            <Button onClick={handleSubmitBooking} className="w-full bg-amber-600 hover:bg-amber-700">
              Submit Enquiry
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Our team will confirm availability and finalise your booking within 24 hours.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </>
  );
}
