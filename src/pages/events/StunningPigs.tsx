import { useEffect, useState } from "react";
import UnifiedNavigation from "@/components/navigation/UnifiedNavigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { IMAGES } from "@/lib/images";
import { trackAdsConversion } from "@/lib/googleAds";
import {
  MapPin, CalendarDays, Ticket, Users, Heart, Accessibility,
  GlassWater, ArrowDown, Loader2, Film, MessageCircle, Mic2, Utensils, ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Celebrating Women Who Protect Life — Women's Day event at The Masque Theatre,
 * featuring the Cape Town premiere of the Stunning Pigs documentary.
 *
 * SOURCE OF TRUTH (verified 18 Jul against the Chad ↔ The Masque email thread):
 *   - Date: Monday 10 August 2026 (Women's Day public holiday)
 *   - Sessions: What Feeds Us 10:00 · Stunning Pigs 12:00 · Voices for Women
 *     Showcase & Awards Ceremony 14:00 — R150 per session
 *   - TICKETS ARE SOLD ON QUICKET (assigned seating, live since 13 Jul):
 *     https://qkt.io/Eu8CpR — this page is a promo pre-lander that routes there.
 *
 * NATIVE TICKET SALES ARE PERMANENTLY RETIRED FOR THIS EVENT. Quicket holds the
 * seat plan; selling seats from our own inventory in parallel would double-sell
 * seats Quicket has already allocated. Do not reconnect the cart flow.
 *
 * The full-day discount code exists but is distributed PRIVATELY to trusted
 * attendees (per Chad) — never print it on this page.
 *
 * Content rules (fixed): factual, dignified framing; NO graphic gassing or
 * slaughter imagery anywhere; no false scarcity.
 */

const QUICKET_URL = "https://qkt.io/Eu8CpR";
const EVENT_DATE_DISPLAY = "Monday 10 August 2026 · Women's Day public holiday";

const SESSIONS = [
  {
    no: 1,
    time: "10:00",
    title: "What Feeds Us",
    description:
      "The day opens with What Feeds Us — food, ethics and community, setting the table for everything that follows.",
    icon: Utensils,
  },
  {
    no: 2,
    time: "12:00",
    title: "Stunning Pigs — Cape Town Premiere",
    description:
      "The main feature: the Cape Town premiere of the Stunning Pigs documentary, followed by a public Q&A with the Beauty Without Cruelty campaign and G.A.R.D.",
    icon: Film,
  },
  {
    no: 3,
    time: "14:00",
    title: "Voices for Women Showcase & Awards Ceremony",
    description:
      "The day closes with live performances and the Voices for Women awards, honouring women who protect life.",
    icon: Mic2,
  },
];

// Partner list per the live campaign coordination (Chad's tracking structure).
const PARTNERS = [
  { name: "Beauty Without Cruelty (BWC)", role: "Anchor", logo: IMAGES.partners?.bwc as string | undefined },
  { name: "G.A.R.D.", role: "Campaign partner", logo: undefined },
  { name: "Vegan Streetfood", role: "Food truck on the day", logo: undefined },
  { name: "Omni Wellness Media", role: "Media & production", logo: IMAGES.logos.omniPrimary },
  { name: "Travel and Tours Cape Town", role: "Campaign partner", logo: IMAGES.partners?.travelTours as string | undefined },
];

const track = (event: string, params: Record<string, unknown> = {}) => {
  const w = window as any;
  w.gtag?.("event", event, { campaign: "stunningpigs", ...params });
  w.tagClarityEvent?.(event, "stunningpigs");
};

const StunningPigs = () => {
  const [optinEmail, setOptinEmail] = useState("");
  const [optinBusy, setOptinBusy] = useState(false);

  useEffect(() => {
    document.title = "Celebrating Women Who Protect Life — 10 Aug at The Masque | Omni Wellness Media";
    track("view_event");
  }, []);

  // The trackable conversion for this event: the click through to Quicket.
  // Purchases complete on Quicket's domain (we cannot tag their checkout) —
  // actual sales are reconciled from Quicket's Sales Reports by date/campaign.
  const bookOnQuicket = (from: string) => {
    track("quicket_click", { from });
    trackAdsConversion("quicket_ticket_click", { value: 150, currency: "ZAR" });
    window.open(QUICKET_URL, "_blank", "noopener,noreferrer");
  };

  const submitOptin = async () => {
    const email = optinEmail.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setOptinBusy(true);
    try {
      const { error } = await supabase.functions.invoke("subscribe-newsletter", {
        body: { email, source: "stunningpigs", interests: ["stunning-pigs"] },
      });
      if (error) throw error;
      toast.success("You're on the list — we'll keep you posted.");
      setOptinEmail("");
    } catch {
      toast.error("Couldn't sign you up just now — please try again.");
    } finally {
      setOptinBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <UnifiedNavigation />

      {/* Hero — dignified, factual. No graphic imagery. */}
      <section className="relative border-b border-border/50 bg-gradient-to-b from-rose-500/[0.06] via-background to-background">
        <div className="container mx-auto px-4 py-16 sm:py-24 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <Badge variant="outline" className="mb-5 border-rose-500/40 text-rose-600 dark:text-rose-400">
              Women's Day at The Masque Theatre
            </Badge>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight mb-4">
              Celebrating Women<br />Who Protect Life
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mb-6">
              Featuring the Cape Town premiere of the <em>Stunning Pigs</em> documentary —
              three sessions of film, food, voices and awards, presented with Beauty
              Without Cruelty, G.A.R.D. and friends, produced with Omni Wellness Media.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground mb-8">
              <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-rose-500 shrink-0" />{EVENT_DATE_DISPLAY}</p>
              <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-rose-500 shrink-0" />The Masque Theatre, 37 Main Road, Muizenberg</p>
              <p className="flex items-center gap-2"><Users className="h-4 w-4 text-rose-500 shrink-0" />Three sessions · 10:00, 12:00 &amp; 14:00 · assigned seating</p>
              <p className="flex items-center gap-4">
                <span className="flex items-center gap-2"><Accessibility className="h-4 w-4 text-rose-500 shrink-0" />Wheelchair access</span>
                <span className="flex items-center gap-2"><GlassWater className="h-4 w-4 text-rose-500 shrink-0" />Licensed bar</span>
                <span className="flex items-center gap-2"><Utensils className="h-4 w-4 text-rose-500 shrink-0" />Vegan food truck</span>
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" onClick={() => bookOnQuicket("hero")} className="bg-rose-600 hover:bg-rose-700 text-white">
                <Ticket className="h-4 w-4 mr-2" />Book on Quicket — R150
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#sessions">See the programme <ArrowDown className="h-4 w-4 ml-2" /></a>
              </Button>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Tickets are sold securely through Quicket with assigned seating.
            </p>
          </div>

          {/* {{image}} slot — replace with the approved dignified single pig portrait.
              Content rule: one dignified portrait only — no campaign or graphic imagery. */}
          <div className="relative rounded-3xl border-2 border-dashed border-rose-500/30 bg-rose-500/[0.04] min-h-[320px] lg:min-h-[440px] flex items-center justify-center p-8">
            <div className="text-center max-w-xs">
              <Heart className="h-10 w-10 text-rose-500/50 mx-auto mb-4" />
              <p className="font-medium text-sm mb-1">{"{{image}}"} — dignified single pig portrait</p>
              <p className="text-xs text-muted-foreground">
                Awaiting the approved photograph. Per event guidelines: one dignified
                portrait only — no graphic or campaign imagery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About — factual framing */}
      <section id="about" className="scroll-mt-24 container mx-auto px-4 py-16 max-w-3xl">
        <h2 className="font-heading text-3xl mb-6">Why this day matters</h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            <em>Stunning Pigs</em> is a documentary examining the use of high-concentration
            CO2 gas stunning of pigs. The film presents what happens inside gas-stunning
            systems factually and without sensationalism, and asks a simple public
            question: do current practices meet the standard of humane treatment South
            Africans expect?
          </p>
          <p>
            The premiere is followed by a public Q&amp;A with the Beauty Without Cruelty
            campaign and G.A.R.D. — an open, respectful conversation about achievable,
            more humane standards. This is a public education event: no graphic footage
            is used in any of our promotion, and the day is designed to inform, not to shock.
          </p>
          <p>
            Held on Women's Day, the programme celebrates the women leading this work —
            opening with <em>What Feeds Us</em> and closing with the <em>Voices for
            Women</em> showcase and awards ceremony.
          </p>
        </div>
      </section>

      {/* Sessions */}
      <section id="sessions" className="scroll-mt-24 bg-muted/30 border-y border-border/50">
        <div className="container mx-auto px-4 py-16">
          <div className="flex items-baseline justify-between flex-wrap gap-2 mb-8">
            <h2 className="font-heading text-3xl">Three sessions, one day</h2>
            <span className="text-xs text-muted-foreground">R150 per session · attend one, two or all three</span>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {SESSIONS.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.no}
                  className={cn(
                    "rounded-2xl border bg-card p-6",
                    s.no === 2 ? "border-rose-500/60 ring-2 ring-rose-500/20 shadow-lg" : "border-border/60",
                  )}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", s.no === 2 ? "bg-rose-500/15 text-rose-600 dark:text-rose-400" : "bg-muted text-muted-foreground")}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <Badge variant={s.no === 2 ? "default" : "secondary"} className={cn("text-[10px]", s.no === 2 && "bg-rose-600 text-white")}>
                      {s.no === 2 ? "Main feature" : `Session ${s.no}`}
                    </Badge>
                  </div>
                  <p className="text-sm font-semibold text-rose-600 dark:text-rose-400 mb-1">{s.time}</p>
                  <h3 className="font-heading text-lg leading-snug mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{s.description}</p>
                  <Button size="sm" onClick={() => bookOnQuicket(`session-${s.no}`)} className="w-full bg-rose-600 hover:bg-rose-700 text-white">
                    <Ticket className="h-4 w-4 mr-2" />Book — R150
                  </Button>
                </div>
              );
            })}
          </div>
          <p className="text-center text-sm text-muted-foreground mt-8">
            Attending all three sessions? A full-day access code is available for
            committed attendees —{" "}
            <a href="mailto:omniwellnessmedia@gmail.com?subject=Full-day%20access%20—%20Celebrating%20Women%20Who%20Protect%20Life" className="text-rose-600 dark:text-rose-400 underline underline-offset-2">
              email us
            </a>{" "}
            and we'll set you up.
          </p>
        </div>
      </section>

      {/* Book — the single conversion surface */}
      <section id="tickets" className="scroll-mt-24 container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-heading text-3xl mb-3">Get your seat</h2>
          <p className="text-muted-foreground mb-8">
            Tickets are R150 per session with assigned seating, sold securely through
            Quicket — The Masque Theatre's official ticketing partner.
          </p>
          <Button size="lg" onClick={() => bookOnQuicket("tickets-section")} className="bg-rose-600 hover:bg-rose-700 text-white text-base px-8">
            <Ticket className="h-5 w-5 mr-2" />Book your tickets on Quicket
            <ExternalLink className="h-4 w-4 ml-2" aria-hidden="true" />
          </Button>
          <p className="mt-4 text-xs text-muted-foreground">
            Opens Quicket in a new tab · card &amp; instant EFT accepted
          </p>
        </div>
      </section>

      {/* Updates opt-in */}
      <section className="bg-muted/30 border-y border-border/50">
        <div className="container mx-auto px-4 py-14 max-w-xl text-center">
          <MessageCircle className="h-8 w-8 text-rose-500 mx-auto mb-4" />
          <h2 className="font-heading text-2xl mb-2">Stay close to the campaign</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Programme updates, honouree announcements, and how to add your voice for
            more humane standards.
          </p>
          <div className="flex gap-2 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="you@example.com"
              aria-label="Email address for event updates"
              value={optinEmail}
              onChange={(e) => setOptinEmail(e.target.value)}
            />
            <Button
              disabled={optinBusy}
              onClick={submitOptin}
              className="bg-rose-600 hover:bg-rose-700 text-white shrink-0"
            >
              {optinBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Keep me posted"}
            </Button>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="font-heading text-2xl text-center mb-2">Presented with</h2>
        <p className="text-xs text-muted-foreground text-center mb-10">
          Hosted at The Masque Theatre — @masquetheatresa
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-8 max-w-4xl mx-auto">
          {PARTNERS.map((p) => (
            <div key={p.name} className="flex flex-col items-center gap-2 w-36 text-center">
              {p.logo ? (
                <img
                  src={p.logo}
                  alt={`${p.name} logo`}
                  className="h-14 w-auto max-w-[120px] object-contain"
                  loading="lazy"
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
              ) : (
                <div className="h-14 flex items-center justify-center px-4 rounded-lg border border-dashed border-border text-xs font-medium text-muted-foreground">
                  {"{{logo}}"}
                </div>
              )}
              <span className="text-xs font-medium leading-tight">{p.name}</span>
              <span className="text-[10px] text-muted-foreground -mt-1">{p.role}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Sticky mobile CTA — shortest path back to Quicket on long scrolls */}
      <div className="fixed bottom-0 inset-x-0 z-40 sm:hidden border-t border-border bg-background/95 backdrop-blur px-4 py-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate">Tickets R150 · 10 August</p>
          <p className="text-[11px] text-muted-foreground">Assigned seating on Quicket</p>
        </div>
        <Button size="sm" onClick={() => bookOnQuicket("sticky-bar")} className="bg-rose-600 hover:bg-rose-700 text-white shrink-0">
          <Ticket className="h-4 w-4 mr-1.5" />Book now
        </Button>
      </div>
      <div className="h-16 sm:hidden" aria-hidden="true" />

      <Footer />
    </div>
  );
};

export default StunningPigs;
