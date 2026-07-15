import { useEffect, useMemo, useState } from "react";
import UnifiedNavigation from "@/components/navigation/UnifiedNavigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useCart } from "@/components/CartProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { IMAGES } from "@/lib/images";
import {
  MapPin, CalendarDays, Ticket, Users, Heart, Accessibility,
  GlassWater, ArrowDown, Loader2, Film, MessageCircle, Leaf,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * STUNNING PIGS — Women's Day screening & public education event.
 *
 * UNLISTED + DRAFT until go-live: this route appears in no nav/sitemap, the seed
 * event row is status='draft', and reserve_screening_seats() refuses to sell
 * until the row is flipped to 'published'. Flip the status in screening_events
 * to open ticket sales — no code change needed.
 *
 * Sells through the site's native stack: cart -> Checkout -> PayPal (ZAR) ->
 * orders/order_items, with per-session seat inventory in screening_sessions.
 *
 * Content rules (fixed): factual, dignified framing; NO graphic gassing or
 * slaughter imagery anywhere; no false scarcity beyond the real allocation.
 */

const EVENT_SLUG = "stunning-pigs";
const EVENT_DATE_DISPLAY = "Saturday 8 August 2026 · Women's Day weekend";

interface SessionRow {
  session_id: string;
  session_no: number;
  session_title: string;
  session_description: string;
  starts_at: string | null;
  allocation: number;
  remaining: number;
  status: string;
}

// Mirror of the migration seed — used only when the DB rows aren't reachable yet
// (e.g. a preview environment before the migration is applied), clearly flagged
// as draft-preview so nobody mistakes it for live inventory.
const FALLBACK_SESSIONS: SessionRow[] = [
  { session_id: "preview-1", session_no: 1, session_title: "Women & Community Empowerment", session_description: "Opening session celebrating Women's Day: women leading community change, animal protection, and public education.", starts_at: null, allocation: 169, remaining: 169, status: "draft" },
  { session_id: "preview-2", session_no: 2, session_title: "STUNNING PIGS — Film & Q&A", session_description: "The main feature: the STUNNING PIGS documentary on high-concentration CO2 gas stunning of pigs, followed by a public Q&A with the BWC campaign and G.A.R.D.", starts_at: null, allocation: 169, remaining: 169, status: "draft" },
  { session_id: "preview-3", session_no: 3, session_title: "Ecosystem & Ethical Travel", session_description: "Closing session on ecosystems and ethical travel with Travel and Tours Cape Town and Chief Kingsley.", starts_at: null, allocation: 169, remaining: 169, status: "draft" },
];

const SESSION_ICON = [Users, Film, Leaf];

const TICKET_TYPES = [
  { key: "single", label: "Single", price: 150, seats: 1, blurb: "One seat, one voice for change." },
  { key: "couple", label: "Couple", price: 200, seats: 2, blurb: "Bring someone — two seats, shared conversation." },
] as const;

const DONATION_TIERS = [
  { key: "supporter", label: "Supporter", price: 500, blurb: "Helps cover venue, screening and education materials." },
  { key: "sponsor", label: "Sponsor", price: 1000, blurb: "Directly funds the public-education campaign." },
] as const;

// Partners strip. Logos already in Supabase storage are used; the two campaign
// partners without stored artwork render as styled text badges until logo files
// are provided ({{logo}} slots).
const PARTNERS = [
  { name: "Beautiful World Canvas (BWC)", role: "Anchor", logo: IMAGES.partners?.bwc as string | undefined },
  { name: "G.A.R.D.", role: "Campaign partner", logo: undefined },
  { name: "Pigs 'n Paws", role: "Campaign partner", logo: undefined },
  { name: "Omni Wellness Media", role: "Media & production", logo: IMAGES.logos.omniPrimary },
  { name: "Travel and Tours Cape Town", role: "Session partner", logo: IMAGES.partners?.travelTours as string | undefined },
  { name: "Dr Phil-afel Women's Empowerment", role: "Women's Day partner", logo: IMAGES.partners?.drPhil as string | undefined },
];

const track = (event: string, params: Record<string, unknown> = {}) => {
  const w = window as any;
  w.gtag?.("event", event, { campaign: "stunningpigs", ...params });
  w.tagClarityEvent?.(event, "stunningpigs");
};

const StunningPigs = () => {
  const { addItem } = useCart();
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [status, setStatus] = useState<string>("draft");
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [optinEmail, setOptinEmail] = useState("");
  const [optinBusy, setOptinBusy] = useState(false);

  useEffect(() => {
    document.title = "STUNNING PIGS — Women's Day Screening | Omni Wellness Media";
    track("view_event");
    (async () => {
      try {
        const { data, error } = await (supabase as any).rpc("get_screening_event", { p_slug: EVENT_SLUG });
        if (error || !data?.length) throw error ?? new Error("no rows");
        setSessions(data as SessionRow[]);
        setStatus((data as SessionRow[])[0]?.status ?? "draft");
        setSelectedSession((data as SessionRow[]).find((s: SessionRow) => s.session_no === 2)?.session_id ?? data[0].session_id);
      } catch {
        setSessions(FALLBACK_SESSIONS);
        setUsingFallback(true);
        setSelectedSession(FALLBACK_SESSIONS[1].session_id);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const isDraft = status !== "published";
  const selected = useMemo(
    () => sessions.find((s) => s.session_id === selectedSession) ?? null,
    [sessions, selectedSession]
  );

  const addTicket = (type: (typeof TICKET_TYPES)[number]) => {
    if (!selected) return;
    if (isDraft || usingFallback) {
      toast.info("Ticket sales open soon — join the updates list below and we'll tell you first.");
      return;
    }
    if (selected.remaining < type.seats) {
      toast.error("That session doesn't have enough seats left — join the waitlist below.");
      return;
    }
    addItem({
      id: `stunningpigs-s${selected.session_no}-${type.key}`,
      title: `STUNNING PIGS · Session ${selected.session_no}: ${selected.session_title} — ${type.label} ticket`,
      price_zar: type.price,
      item_type: "event_ticket",
      event_session_id: selected.session_id,
      seats_per_unit: type.seats,
      category: "event",
      location: "The Masque Theatre, Muizenberg",
    });
    track("begin_ticket", { ticket_type: type.key, session: selected.session_no, value: type.price, currency: "ZAR" });
    toast.success(`${type.label} ticket added — Session ${selected.session_no}`, {
      description: "Head to checkout when you're ready.",
    });
  };

  const addDonation = (tier: (typeof DONATION_TIERS)[number]) => {
    addItem({
      id: `stunningpigs-donation-${tier.key}`,
      title: `STUNNING PIGS campaign donation — ${tier.label}`,
      price_zar: tier.price,
      item_type: "event_donation",
      seats_per_unit: 0,
      category: "event",
    });
    track("begin_ticket", { ticket_type: `donation_${tier.key}`, value: tier.price, currency: "ZAR" });
    toast.success(`${tier.label} donation added. Thank you.`);
  };

  const submitOptin = async (source: string) => {
    const email = optinEmail.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setOptinBusy(true);
    try {
      const { error } = await supabase.functions.invoke("subscribe-newsletter", {
        body: { email, source, interests: ["stunning-pigs"] },
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

      {isDraft && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 text-center px-4 py-2 text-xs font-medium text-amber-700 dark:text-amber-400">
          DRAFT PREVIEW — this page is unlisted and ticket sales are closed until the event is published.
          {usingFallback && " (Showing seeded programme — live inventory not connected in this environment.)"}
        </div>
      )}

      {/* Hero — dignified, factual. No graphic imagery. */}
      <section className="relative border-b border-border/50 bg-gradient-to-b from-rose-500/[0.06] via-background to-background">
        <div className="container mx-auto px-4 py-16 sm:py-24 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <Badge variant="outline" className="mb-5 border-rose-500/40 text-rose-600 dark:text-rose-400">
              Women's Day screening & public education event
            </Badge>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight mb-6">
              STUNNING<br />PIGS
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mb-6">
              BWC and Friends present a Women's Day animal-protection screening and public
              education event — the STUNNING PIGS documentary — produced with Omni Wellness Media.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground mb-8">
              <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-rose-500 shrink-0" />{EVENT_DATE_DISPLAY}</p>
              <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-rose-500 shrink-0" />The Masque Theatre, 37 Main Road, Muizenberg</p>
              <p className="flex items-center gap-2"><Users className="h-4 w-4 text-rose-500 shrink-0" />Three 2-hour sessions · 169 seats each · programme being refined</p>
              <p className="flex items-center gap-4">
                <span className="flex items-center gap-2"><Accessibility className="h-4 w-4 text-rose-500 shrink-0" />Wheelchair access</span>
                <span className="flex items-center gap-2"><GlassWater className="h-4 w-4 text-rose-500 shrink-0" />Licensed bar</span>
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" asChild className="bg-rose-600 hover:bg-rose-700 text-white">
                <a href="#tickets"><Ticket className="h-4 w-4 mr-2" />Get tickets</a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#about">What it's about <ArrowDown className="h-4 w-4 ml-2" /></a>
              </Button>
            </div>
          </div>

          {/* {{image}} slot — replace with the approved dignified single pig portrait.
              Deliberately NOT auto-filled: content rule is one dignified portrait,
              no campaign/protest or graphic imagery. */}
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

      {/* What it is — factual framing */}
      <section id="about" className="container mx-auto px-4 py-16 max-w-3xl">
        <h2 className="font-heading text-3xl mb-6">Why this screening matters</h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            STUNNING PIGS is a documentary examining the use of high-concentration CO2 gas
            stunning of pigs at the Molare Abattoir. The film presents what happens inside
            gas-stunning systems factually and without sensationalism, and asks a simple
            public question: do current practices meet the standard of humane treatment
            South Africans expect?
          </p>
          <p>
            The screening is followed by a public Q&A with the BWC campaign and G.A.R.D. —
            an open, respectful conversation about achievable, more humane standards. This
            is a public education event: no graphic footage is shown in marketing, and the
            evening is designed to inform, not to shock.
          </p>
          <p>
            Held on Women's Day weekend, the programme celebrates the women leading this
            work — opening with a session on women and community empowerment, and closing
            with a look at ecosystems and ethical travel in the Cape.
          </p>
        </div>
      </section>

      {/* Sessions */}
      <section className="bg-muted/30 border-y border-border/50">
        <div className="container mx-auto px-4 py-16">
          <div className="flex items-baseline justify-between flex-wrap gap-2 mb-8">
            <h2 className="font-heading text-3xl">The three sessions</h2>
            <span className="text-xs text-muted-foreground">Programme being refined — session times to be confirmed</span>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {(loading ? FALLBACK_SESSIONS : sessions).map((s, i) => {
              const Icon = SESSION_ICON[s.session_no - 1] ?? Film;
              const isSel = s.session_id === selectedSession;
              const soldOut = !usingFallback && !isDraft && s.remaining <= 0;
              return (
                <button
                  key={s.session_id}
                  type="button"
                  onClick={() => setSelectedSession(s.session_id)}
                  className={cn(
                    "text-left rounded-2xl border bg-card p-6 transition-all",
                    isSel ? "border-rose-500/60 ring-2 ring-rose-500/20 shadow-lg" : "border-border/60 hover:border-border",
                  )}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", isSel ? "bg-rose-500/15 text-rose-600 dark:text-rose-400" : "bg-muted text-muted-foreground")}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <Badge variant={s.session_no === 2 ? "default" : "secondary"} className={cn("text-[10px]", s.session_no === 2 && "bg-rose-600 text-white")}>
                      {s.session_no === 2 ? "Main feature" : `Session ${s.session_no}`}
                    </Badge>
                  </div>
                  <h3 className="font-heading text-lg leading-snug mb-2">{s.session_title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{s.session_description}</p>
                  <p className="text-xs font-medium">
                    {soldOut ? (
                      <span className="text-destructive">Sold out — waitlist below</span>
                    ) : isDraft || usingFallback ? (
                      <span className="text-muted-foreground">{s.allocation} seats · 2 hours</span>
                    ) : (
                      <span className="text-muted-foreground">{s.remaining} of {s.allocation} seats available · 2 hours</span>
                    )}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tickets + donations */}
      <section id="tickets" className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading text-3xl mb-2">Tickets</h2>
          <p className="text-sm text-muted-foreground mb-8">
            {selected ? <>Booking for <b className="text-foreground">Session {selected.session_no}: {selected.session_title}</b> — change the session above.</> : "Select a session above."}
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            {TICKET_TYPES.map((t) => (
              <Card key={t.key} className="border-border/60">
                <CardContent className="p-6">
                  <div className="flex items-baseline justify-between mb-1">
                    <h3 className="font-heading text-xl">{t.label}</h3>
                    <span className="font-heading text-2xl">R{t.price}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{t.seats} seat{t.seats > 1 ? "s" : ""}</p>
                  <p className="text-sm text-muted-foreground mb-5">{t.blurb}</p>
                  <Button
                    className="w-full bg-rose-600 hover:bg-rose-700 text-white"
                    disabled={loading || !selected}
                    onClick={() => addTicket(t)}
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Ticket className="h-4 w-4 mr-2" />Add {t.label} ticket</>}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <h3 className="font-heading text-xl mb-1">Support the campaign</h3>
          <p className="text-sm text-muted-foreground mb-5">Optional donation add-ons — every rand goes to the public-education work.</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {DONATION_TIERS.map((d) => (
              <Card key={d.key} className="border-border/60 bg-muted/20">
                <CardContent className="p-6">
                  <div className="flex items-baseline justify-between mb-1">
                    <h4 className="font-medium">{d.label}</h4>
                    <span className="font-heading text-xl">R{d.price}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{d.blurb}</p>
                  <Button variant="outline" className="w-full" onClick={() => addDonation(d)}>
                    <Heart className="h-4 w-4 mr-2" />Add {d.label}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Updates / waitlist opt-in */}
      <section className="bg-muted/30 border-y border-border/50">
        <div className="container mx-auto px-4 py-14 max-w-xl text-center">
          <MessageCircle className="h-8 w-8 text-rose-500 mx-auto mb-4" />
          <h2 className="font-heading text-2xl mb-2">Stay close to the campaign</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Programme updates, ticket-release news, and how to add your voice for more
            humane standards. If a session is sold out, this is also the waitlist.
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
              onClick={() => submitOptin("stunningpigs")}
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

      <Footer />
    </div>
  );
};

export default StunningPigs;
