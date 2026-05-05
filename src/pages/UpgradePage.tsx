import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import UnifiedNavigation from "@/components/navigation/UnifiedNavigation";
import Footer from "@/components/Footer";
import {
  Check,
  X,
  Zap,
  BarChart2,
  Users,
  TrendingUp,
  CreditCard,
  Brain,
  Star,
  MessageCircle,
  ChevronLeft,
  Shield,
  Copy,
  Mail,
} from "lucide-react";

const FREE_FEATURES = [
  "List unlimited services",
  "Accept bookings",
  "Public provider profile",
  "Basic earnings overview",
  "Community blog",
  "Media uploads",
];

const PRO_FEATURES = [
  { icon: BarChart2, label: "Business analytics", sub: "Revenue charts, booking funnel, conversion rate" },
  { icon: Users, label: "Client CRM", sub: "Directory, repeat-client tracking, follow-up nudges" },
  { icon: TrendingUp, label: "Booking intelligence", sub: "Pending vs confirmed vs cancelled breakdown" },
  { icon: CreditCard, label: "Financial suite", sub: "Monthly comparison, revenue mix, CSV export" },
  { icon: Brain, label: "AI Content Studio", sub: "AI-drafted service descriptions & social captions" },
  { icon: Star, label: "Priority marketplace listing", sub: "Appear higher in search and category pages" },
];

const FAQS = [
  {
    q: "How do I activate Pro?",
    a: "Send us a WhatsApp or email and we'll enable your Pro features within minutes after confirming payment.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes — no contracts, no lock-in. Simply let us know and we'll revert your account to the Free tier.",
  },
  {
    q: "Do I lose my data if I cancel?",
    a: "No. All your services, bookings, and client history stay on your account on the Free tier.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes! Your first 30 days on Pro are completely free. Payment only starts on day 31.",
  },
];

const ACTIVATION_EMAIL = "hello@omniwellnessmedia.co.za";

const UpgradePage = () => {
  const navigate = useNavigate();
  const [emailCopied, setEmailCopied] = useState(false);

  const whatsappHref =
    "https://wa.me/27815551234?text=Hi%2C%20I%27d%20like%20to%20upgrade%20to%20Provider%20Pro%20on%20Omni%20Wellness.";
  const emailHref =
    `mailto:${ACTIVATION_EMAIL}?subject=Provider%20Pro%20Upgrade%20Request&body=Hi%2C%20I%27d%20like%20to%20activate%20Provider%20Pro%20on%20my%20account.%20My%20registered%20email%20is%3A%20`;

  const copyEmail = () => {
    navigator.clipboard.writeText(ACTIVATION_EMAIL).then(() => {
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <UnifiedNavigation />

      <main id="main-content" className="flex-1">
        {/* Back nav */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to dashboard
          </button>
        </div>

        {/* Hero */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 gap-1.5">
            <Zap className="h-3 w-3" />
            Provider Pro
          </Badge>
          <h1 className="font-heading text-4xl sm:text-5xl mb-4 leading-tight">
            Grow your wellness practice
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Analytics, CRM, financial reports, and AI content tools — everything
            a professional wellness provider needs to scale.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
            {/* Free */}
            <div className="rounded-2xl border border-border/60 bg-card p-6">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-3">
                Free
              </p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="font-heading text-4xl">R0</span>
                <span className="text-muted-foreground text-sm">/month</span>
              </div>
              <p className="text-xs text-muted-foreground mb-6">Always free · No card required</p>
              <div className="space-y-3 mb-6">
                {FREE_FEATURES.map((f) => (
                  <div key={f} className="flex items-center gap-2.5">
                    <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <Check className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <span className="text-sm">{f}</span>
                  </div>
                ))}
                {["Advanced analytics", "Client CRM", "Financial suite", "AI Content Studio"].map(
                  (f) => (
                    <div key={f} className="flex items-center gap-2.5 opacity-40">
                      <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center shrink-0">
                        <X className="h-3 w-3" />
                      </div>
                      <span className="text-sm line-through">{f}</span>
                    </div>
                  )
                )}
              </div>
              <Button variant="outline" className="w-full" onClick={() => navigate("/provider-dashboard")}>
                Continue with Free
              </Button>
            </div>

            {/* Pro */}
            <div className="rounded-2xl overflow-hidden border-2 border-primary shadow-lg shadow-primary/10 relative">
              <div className="absolute top-3 right-3">
                <Badge className="bg-primary text-white border-0 text-[10px]">Most popular</Badge>
              </div>
              <div className="bg-gradient-to-br from-primary to-violet-600 p-6 text-white">
                <p className="text-xs text-white/80 font-medium uppercase tracking-wide mb-3">
                  Provider Pro
                </p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="font-heading text-4xl">R499</span>
                  <span className="text-white/70 text-sm">/month</span>
                </div>
                <p className="text-xs text-white/70">First 30 days free · Cancel anytime</p>
              </div>
              <div className="p-6 bg-card">
                <p className="text-xs text-muted-foreground font-medium mb-4">
                  Everything in Free, plus:
                </p>
                <div className="space-y-3 mb-6">
                  {FREE_FEATURES.map((f) => (
                    <div key={f} className="flex items-center gap-2.5">
                      <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                      <span className="text-sm">{f}</span>
                    </div>
                  ))}
                  {PRO_FEATURES.map((f) => (
                    <div key={f.label} className="flex items-start gap-2.5">
                      <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <f.icon className="h-3 w-3 text-primary" />
                      </div>
                      <div>
                        <span className="text-sm font-medium">{f.label}</span>
                        <p className="text-xs text-muted-foreground leading-snug">{f.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-2.5">
                  <a href={whatsappHref} target="_blank" rel="noreferrer">
                    <Button className="w-full bg-gradient-to-r from-primary to-violet-600 hover:opacity-90 text-white border-0 gap-2">
                      <MessageCircle className="h-4 w-4" />
                      Activate via WhatsApp
                    </Button>
                  </a>
                  <div className="rounded-xl border border-border/60 p-3">
                    <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5" />
                      Or email us to activate:
                    </p>
                    <div className="flex items-center gap-2">
                      <a
                        href={emailHref}
                        className="flex-1 text-sm font-medium text-primary hover:underline truncate"
                      >
                        {ACTIVATION_EMAIL}
                      </a>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 shrink-0"
                        onClick={copyEmail}
                      >
                        {emailCopied ? (
                          <Check className="h-3.5 w-3.5 text-green-600" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1.5">
                      Subject: Provider Pro Upgrade Request
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pro features deep-dive */}
          <div className="mb-16">
            <h2 className="font-heading text-2xl text-center mb-8">What's inside Provider Pro</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {PRO_FEATURES.map((f) => (
                <div
                  key={f.label}
                  className="rounded-2xl border border-border/50 bg-card p-5 flex flex-col gap-3"
                >
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <f.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{f.label}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-0.5">{f.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-6 mb-16 text-sm text-muted-foreground">
            {[
              { icon: Shield, text: "Secure ZAR billing" },
              { icon: Check, text: "No lock-in contracts" },
              { icon: Zap, text: "Instant activation" },
              { icon: MessageCircle, text: "WhatsApp support" },
            ].map((b) => (
              <div key={b.text} className="flex items-center gap-2">
                <b.icon className="h-4 w-4 text-primary" />
                {b.text}
              </div>
            ))}
          </div>

          {/* FAQs */}
          <div className="max-w-2xl mx-auto">
            <h2 className="font-heading text-2xl text-center mb-8">Questions</h2>
            <div className="space-y-4">
              {FAQS.map((faq) => (
                <div key={faq.q} className="rounded-xl border border-border/50 p-5">
                  <p className="font-medium mb-1.5">{faq.q}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UpgradePage;
