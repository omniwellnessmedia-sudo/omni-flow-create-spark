import { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Compass, Globe, Smartphone, Users, TrendingUp, Shield,
  Zap, Download, Bot, CreditCard, QrCode, BarChart3,
  Target, Megaphone, Heart, ArrowRight
} from "lucide-react";

const RoamBuddyOverview = () => {
  const printRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <>
      {/* Print styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #partner-overview, #partner-overview * { visibility: visible; }
          #partner-overview { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
          .print-break { page-break-before: always; }
        }
      `}</style>

      <div id="partner-overview" ref={printRef} className="min-h-screen bg-gradient-to-b from-background to-muted/10">
        {/* Sticky Export Bar */}
        <div className="no-print sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b px-6 py-3 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Partner Presentation · Confidential</span>
          <Button onClick={handleExportPDF} className="gap-2">
            <Download className="h-4 w-4" /> Export PDF
          </Button>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-12 space-y-16">

          {/* Hero */}
          <section className="text-center space-y-6">
            <div className="inline-flex items-center gap-3 text-5xl">
              <span>🧭</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              ROAM by Omni × RoamBuddy
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Strategic Partnership Overview — Wellness-Integrated Travel Connectivity for the South African Market
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Badge variant="default" className="text-sm px-3 py-1">Launch: 4 Feb 2026</Badge>
              <Badge variant="secondary" className="text-sm px-3 py-1">90-Day Campaign</Badge>
              <Badge variant="outline" className="text-sm px-3 py-1">Cape Town, South Africa</Badge>
            </div>
          </section>

          <Separator />

          {/* Brand Architecture */}
          <section className="space-y-6">
            <SectionHeader icon={Compass} title="Brand Architecture" />
            <div className="grid md:grid-cols-3 gap-4">
              <BrandCard
                emoji="🧭"
                name="ROAM"
                tagline="The Mindful Travel Guide"
                description="AI-powered mascot driving all customer interactions — from lead qualification to post-purchase support."
                color="from-primary/10 to-primary/5"
              />
              <BrandCard
                emoji="🌿"
                name="WELLCONNECT"
                tagline="Retreat Connectivity"
                description="Curated eSIM bundles for yoga retreats, meditation centres, and wellness tourism."
                color="from-green-500/10 to-green-500/5"
              />
              <BrandCard
                emoji="✈️"
                name="OMNI GLOBAL DATA"
                tagline="Business Travel"
                description="Premium data plans for digital nomads, remote workers, and corporate travel."
                color="from-blue-500/10 to-blue-500/5"
              />
            </div>
          </section>

          {/* Value Proposition */}
          <section className="space-y-6">
            <SectionHeader icon={Heart} title="Why This Partnership Works" />
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { icon: Globe, title: "Wellness-Integrated Travel", desc: "Only eSIM provider combining connectivity with curated wellness experiences — retreats, tours, conscious travel." },
                { icon: Users, title: "Built-In Audience", desc: "Omni Wellness Media's community of 5,000+ health-conscious South Africans, growing via content + events." },
                { icon: Bot, title: "AI Sales Agent (24/7)", desc: "Roam 🧭 qualifies leads using travel psychology, recommends plans, and automates the entire purchase flow." },
                { icon: Shield, title: "Google NPO Ad Grant", desc: "$10,000/month FREE Google Ads through Dr. Phil-afel NPO status — that's R180K/month in search traffic." },
              ].map((item) => (
                <Card key={item.title} className="border">
                  <CardContent className="p-5 flex gap-4">
                    <item.icon className="h-8 w-8 text-primary shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <div className="print-break" />

          {/* Technical Integration */}
          <section className="space-y-6">
            <SectionHeader icon={Zap} title="Technical Integration Stack" />
            <Card>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2"><Smartphone className="h-4 w-4" /> Customer-Facing</h3>
                    <ul className="space-y-2 text-sm">
                      {[
                        "AI Sales Bot (Roam 🧭) — Gemini-powered, wellness-trained",
                        "Guest Checkout — No login required for purchases",
                        "PayPal CardFields — Direct card payments (ZAR)",
                        "Instant QR / LPA delivery via email",
                        "Device compatibility checker",
                        "Multi-currency display (ZAR, USD, EUR)",
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <ArrowRight className="h-3 w-3 text-primary mt-1.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2"><BarChart3 className="h-4 w-4" /> Backend Automation</h3>
                    <ul className="space-y-2 text-sm">
                      {[
                        "RoamBuddy API integration (order creation, ICCID retrieval)",
                        "Automated lead notifications (Email + WhatsApp)",
                        "Automated sale notifications with commission tracking",
                        "UTM tracking across all channels",
                        "GA4 + Meta Pixel event tracking",
                        "Supabase edge functions for all server logic",
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <ArrowRight className="h-3 w-3 text-primary mt-1.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Commission & Revenue */}
          <section className="space-y-6">
            <SectionHeader icon={CreditCard} title="Commission Structure" />
            <div className="grid md:grid-cols-3 gap-4">
              <MetricCard title="RoamBuddy Store" value="8-15%" subtitle="Per eSIM sale" />
              <MetricCard title="Travel Well Connected" value="10-15%" subtitle="Wellness bundles" />
              <MetricCard title="Internal Default" value="10%" subtitle="Used for projections" />
            </div>
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-5">
                <p className="text-sm">
                  <strong>Revenue Model:</strong> Commission on every sale + WellCoins loyalty rewards that drive repeat purchases. 
                  All commissions tracked automatically via Supabase with real-time dashboard visibility.
                </p>
              </CardContent>
            </Card>
          </section>

          <div className="print-break" />

          {/* Marketing Strategy */}
          <section className="space-y-6">
            <SectionHeader icon={Megaphone} title="Go-to-Market Strategy" />
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <QrCode className="h-5 w-5" /> Airport Activation
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>QR code standees at Cape Town International Airport Arrivals Hall targeting inbound tourists.</p>
                  <ul className="space-y-1">
                    <li>• 50 A3 posters + 10 standees</li>
                    <li>• 500 pocket flyers</li>
                    <li>• Code: <code className="bg-muted px-1 rounded">AIRPORT20</code> (20% off)</li>
                    <li>• UTM-tracked for attribution</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="h-5 w-5" /> Digital Channels
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>Multi-channel content strategy with Roam 🧭 as the consistent brand voice.</p>
                  <ul className="space-y-1">
                    <li>• Google Ad Grant: $10K/month (FREE via NPO)</li>
                    <li>• 31-day content calendar (Instagram, TikTok, Facebook)</li>
                    <li>• Meta retargeting for cart abandonment</li>
                    <li>• Tiered discount codes per channel</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* 90-Day Targets */}
          <section className="space-y-6">
            <SectionHeader icon={TrendingUp} title="90-Day Milestone Targets" />
            <div className="grid md:grid-cols-3 gap-4">
              <MilestoneCard
                month="Month 1"
                period="Feb 4 - Mar 4"
                metrics={[
                  { label: "Website Visitors", value: "2,000" },
                  { label: "AI Conversations", value: "150" },
                  { label: "Email Leads", value: "75" },
                  { label: "eSIM Sales", value: "30" },
                ]}
              />
              <MilestoneCard
                month="Month 2"
                period="Mar 5 - Apr 4"
                metrics={[
                  { label: "Website Visitors", value: "5,000" },
                  { label: "AI Conversations", value: "400" },
                  { label: "eSIM Sales", value: "100" },
                  { label: "Revenue", value: "R15,000" },
                ]}
              />
              <MilestoneCard
                month="Month 3"
                period="Apr 5 - May 4"
                metrics={[
                  { label: "Website Visitors", value: "10,000" },
                  { label: "AI Conversations", value: "800" },
                  { label: "eSIM Sales", value: "250" },
                  { label: "Revenue", value: "R40,000" },
                ]}
              />
            </div>
          </section>

          {/* Existing Partner Ecosystem */}
          <section className="space-y-6">
            <SectionHeader icon={Users} title="Partner Ecosystem" />
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { name: "Viator", commission: "8%", type: "Tours & Experiences" },
                { name: "CameraStuff", commission: "5-10%", type: "Travel Gear" },
                { name: "CJ Affiliate", commission: "5-15%", type: "712+ Products" },
              ].map((p) => (
                <Card key={p.name}>
                  <CardContent className="p-4 text-center">
                    <h3 className="font-semibold text-lg">{p.name}</h3>
                    <Badge variant="secondary" className="my-2">{p.commission}</Badge>
                    <p className="text-xs text-muted-foreground">{p.type}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <Separator />

          {/* Footer / Contact */}
          <section className="text-center space-y-4 pb-12">
            <h2 className="text-2xl font-bold">Let's Build This Together</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Omni Wellness Media brings the audience, the AI, and the conscious brand. 
              RoamBuddy brings world-class eSIM infrastructure. Together, we redefine travel connectivity.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <span>📧 chad@omniwellnessmedia.co.za</span>
              <span>📱 +27 74 831 5961</span>
              <span>🌐 omniwellnessmedia.co.za</span>
            </div>
            <p className="text-xs text-muted-foreground pt-4">
              Omni Wellness Media © 2026 · Confidential Partner Document
            </p>
          </section>
        </div>
      </div>
    </>
  );
};

// Sub-components

const SectionHeader = ({ icon: Icon, title }: { icon: any; title: string }) => (
  <div className="flex items-center gap-3">
    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
      <Icon className="h-5 w-5 text-primary" />
    </div>
    <h2 className="text-2xl font-bold">{title}</h2>
  </div>
);

const BrandCard = ({ emoji, name, tagline, description, color }: {
  emoji: string; name: string; tagline: string; description: string; color: string;
}) => (
  <Card className={`bg-gradient-to-br ${color} border`}>
    <CardContent className="p-5 text-center space-y-2">
      <div className="text-4xl">{emoji}</div>
      <h3 className="text-xl font-bold">{name}</h3>
      <p className="text-sm font-medium text-muted-foreground">{tagline}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const MetricCard = ({ title, value, subtitle }: { title: string; value: string; subtitle: string }) => (
  <Card className="text-center">
    <CardContent className="p-5 space-y-1">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-3xl font-bold text-primary">{value}</p>
      <p className="text-xs text-muted-foreground">{subtitle}</p>
    </CardContent>
  </Card>
);

const MilestoneCard = ({ month, period, metrics }: {
  month: string; period: string; metrics: { label: string; value: string }[];
}) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-lg">{month}</CardTitle>
      <p className="text-xs text-muted-foreground">{period}</p>
    </CardHeader>
    <CardContent className="space-y-2">
      {metrics.map((m) => (
        <div key={m.label} className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{m.label}</span>
          <Badge variant="secondary">{m.value}</Badge>
        </div>
      ))}
    </CardContent>
  </Card>
);

export default RoamBuddyOverview;
