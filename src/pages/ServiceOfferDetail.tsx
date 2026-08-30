import { useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';
import Footer from '@/components/Footer';
import { ArrowRight, ArrowLeft, Check, X, ShieldCheck, MessageCircle, Sparkles } from 'lucide-react';
import {
  getOffer,
  getBandForOffer,
  getSiblingOffers,
  getBandSales,
  RATE_CARD_TERMS,
} from '@/data/publicRateCard';
import { bandImage } from '@/data/serviceImagery';
import { useSEO } from '@/lib/seo';
import { WHATSAPP_URL } from '@/components/services/spectrum';

/**
 * One page per offer on the rate card, built to convert.
 *
 * WHERE THE CONTENT COMES FROM, AND WHY THAT MATTERS MORE THAN IT SOUNDS.
 * Offer content, meaning the name, price, inclusions and footnote, is read
 * from src/data/publicRateCard.ts and cannot be written here. That file is the
 * only place a client facing price may be defined, and a number not on the
 * approved rate card is not publishable. Sales furniture, meaning who the
 * offer suits, what happens next and the questions people ask, comes from
 * BAND_SALES in the same file and carries no prices, no inclusions and no
 * promises about outcomes.
 *
 * WHAT IS DELIBERATELY ABSENT. There is no countdown, no "only two slots
 * left", and no testimonial. The scarcity claims would be invented, and the
 * only consented testimonials this site holds are about a screening event, so
 * putting them beside a web development offer would be praise moved from one
 * product to another. Both are standard conversion tactics. Both would be
 * false here, and a claim that turns out to be false costs more than the
 * conversion it wins.
 *
 * WHAT IS PRESENT INSTEAD. A single primary action repeated at three depths, a
 * free diagnostic for people not ready to buy, explicit qualification
 * including who the offer does not suit, the process written out, objection
 * handling as questions, the commercial terms in plain sight, and Service and
 * FAQPage structured data so the questions can surface in search.
 *
 * No em dashes in this file.
 */

const ServiceOfferDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const offer = getOffer(slug);
  const band = getBandForOffer(slug);
  const sales = getBandSales(band?.id);
  const siblings = slug ? getSiblingOffers(slug) : [];

  useSEO({
    title: offer
      ? `${offer.name} | ${offer.price} | Omni Wellness Media`
      : 'Services | Omni Wellness Media',
    description: offer ? offer.blurb : 'Services and rates from Omni Wellness Media.',
    canonical: offer
      ? `https://omniwellnessmedia.co.za/services/${offer.slug}`
      : 'https://omniwellnessmedia.co.za/services',
  });

  // Service and FAQPage structured data. Search engines surface FAQ answers
  // directly, which is the cheapest visibility available to a page like this.
  // Removed on unmount so it cannot leak onto the next route.
  useEffect(() => {
    if (!offer || !band) return;
    const graph: Record<string, unknown>[] = [
      {
        '@type': 'Service',
        name: offer.name,
        description: offer.blurb,
        serviceType: band.heading,
        provider: { '@type': 'Organization', name: 'Omni Wellness Media' },
        areaServed: { '@type': 'Place', name: 'South Africa' },
        url: `https://omniwellnessmedia.co.za/services/${offer.slug}`,
        offers: {
          '@type': 'Offer',
          priceCurrency: 'ZAR',
          // The approved display string, not a parsed number. Several offers
          // are "From R..." or carry a launch rate, and turning those into a
          // bare figure would publish a price the rate card does not state.
          description: offer.price,
          availability: 'https://schema.org/InStock',
        },
      },
    ];
    if (sales?.faqs?.length) {
      graph.push({
        '@type': 'FAQPage',
        mainEntity: sales.faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      });
    }
    const el = document.createElement('script');
    el.type = 'application/ld+json';
    el.text = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
    document.head.appendChild(el);
    return () => {
      el.remove();
    };
  }, [offer, band, sales]);

  if (!offer || !band) return <Navigate to="/services" replace />;

  const hue = offer.hue || band.hue;
  const image = bandImage(band.id);
  const contactHref = `/contact?service=${offer.slug}`;

  const Cta = ({ variant }: { variant: 'light' | 'dark' }) => (
    <div className="flex flex-wrap gap-3">
      <Link
        to={contactHref}
        className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-medium transition-transform hover:scale-[1.02]"
        style={
          variant === 'dark'
            ? { background: '#FAF8F2', color: '#15201F' }
            : { background: '#15201F', color: '#FAF8F2' }
        }
      >
        {offer.cta}
        <ArrowRight className="h-4 w-4" />
      </Link>
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full border px-6 py-3 text-[15px] font-medium"
        style={
          variant === 'dark'
            ? { borderColor: 'rgba(250,248,242,.3)', color: '#FAF8F2' }
            : { borderColor: 'rgba(14,21,19,.18)' }
        }
      >
        <MessageCircle className="h-4 w-4" />
        Ask a question
      </a>
    </div>
  );

  return (
    <>
      <UnifiedNavigation />

      <main style={{ background: '#FAF8F2' }}>
        <div className="mx-auto max-w-5xl px-4 py-10 md:py-14">
          <Link
            to="/services"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All services and rates
          </Link>

          {/* Above the fold: what it is, what it costs, one action. */}
          <header className="mt-8 grid gap-10 md:grid-cols-[1.15fr_1fr] md:items-center">
            <div>
              <p
                className="flex items-center gap-2 text-[10px] uppercase tracking-[.2em] text-muted-foreground"
                style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}
              >
                <span aria-hidden="true" className="h-[6px] w-[6px] rounded-full" style={{ background: hue }} />
                {band.eyebrow}
              </p>

              <h1 className="mt-3 font-wwpl-display text-4xl font-medium leading-[1.08] md:text-[52px]">
                {offer.name}
              </h1>

              <p className="mt-4 max-w-[54ch] text-lg text-muted-foreground">{offer.blurb}</p>

              <div className="mt-6 flex items-baseline gap-3">
                <span className="font-wwpl-display text-4xl font-medium" style={{ color: hue }}>
                  {offer.price}
                </span>
              </div>
              {offer.footnote && (
                <p className="mt-2 max-w-[54ch] text-sm text-muted-foreground">{offer.footnote}</p>
              )}

              <div className="mt-7">
                <Cta variant="light" />
              </div>

              <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="h-4 w-4" style={{ color: hue }} />
                Quotations valid 14 days. Scope agreed in writing before anything starts.
              </p>
            </div>

            {/* Imagery is used only where a genuinely relevant photograph of
                our own work exists for the band. A mismatched stock photo is
                worse than none: it is the thing that makes a page read as
                filler. bandImage returns null rather than reaching for
                something vaguely related. */}
            {image ? (
              <img
                src={image.src}
                alt={image.alt}
                loading="eager"
                className="aspect-[4/5] w-full rounded-2xl object-cover"
              />
            ) : (
              <div
                className="flex aspect-[4/5] w-full flex-col justify-end rounded-2xl p-8"
                style={{ background: '#15201F' }}
                aria-hidden="true"
              >
                <div className="flex gap-1.5">
                  {['#E63946', '#F38020', '#F5C518', '#4FAE3F', '#2BB9B9', '#2C6FB5', '#5C2A8A'].map((c) => (
                    <span key={c} className="h-1.5 flex-1 rounded-full" style={{ background: c }} />
                  ))}
                </div>
                <p
                  className="mt-6 text-[10px] uppercase tracking-[.2em]"
                  style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace', color: '#8A9A96' }}
                >
                  {band.heading}
                </p>
                <p className="mt-2 font-wwpl-display text-3xl" style={{ color: '#FAF8F2' }}>
                  {offer.name}
                </p>
              </div>
            )}
          </header>

          {/* The free way in, for the majority who are not ready to buy today.
              Placed straight after the price so it catches the bounce. */}
          <section
            className="mt-14 flex flex-wrap items-center justify-between gap-6 rounded-2xl border p-7"
            style={{ borderColor: 'rgba(14,21,19,.12)', background: 'rgba(255,255,255,.7)' }}
          >
            <div className="min-w-[260px] flex-1">
              <p className="flex items-center gap-2 text-[15px] font-medium">
                <Sparkles className="h-4 w-4" style={{ color: hue }} />
                Not sure this is the right thing yet?
              </p>
              <p className="mt-1.5 max-w-[58ch] text-sm text-muted-foreground">
                Take the free Revenue Readiness Scorecard. Ten questions, two minutes, and
                you see the result immediately without giving us anything.
              </p>
            </div>
            <Link
              to="/scorecard"
              className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-[15px] font-medium"
              style={{ borderColor: hue, color: hue }}
            >
              Take the scorecard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>

          {offer.bullets.length > 0 && (
            <section className="mt-16">
              <h2 className="font-wwpl-display text-3xl font-medium">What you get</h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {offer.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-3 rounded-xl border bg-white/70 p-4 text-[15px]"
                    style={{ borderColor: 'rgba(14,21,19,.09)' }}
                  >
                    <Check className="mt-[3px] h-4 w-4 shrink-0" style={{ color: hue }} aria-hidden="true" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {sales && (
            <>
              {/* Qualification. Saying who this is not for is the part that
                  earns the trust the rest of the page spends. */}
              <section className="mt-16 grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border bg-white/70 p-6" style={{ borderColor: 'rgba(14,21,19,.09)' }}>
                  <h2 className="font-wwpl-display text-2xl font-medium">This is for you if</h2>
                  <ul className="mt-4 space-y-2.5">
                    {sales.forYouIf.map((t) => (
                      <li key={t} className="flex items-start gap-3 text-[15px]">
                        <Check className="mt-[3px] h-4 w-4 shrink-0" style={{ color: hue }} aria-hidden="true" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border p-6" style={{ borderColor: 'rgba(14,21,19,.09)' }}>
                  <h2 className="font-wwpl-display text-2xl font-medium">This is not for you if</h2>
                  <ul className="mt-4 space-y-2.5">
                    {sales.notForYouIf.map((t) => (
                      <li key={t} className="flex items-start gap-3 text-[15px] text-muted-foreground">
                        <X className="mt-[3px] h-4 w-4 shrink-0" aria-hidden="true" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              <section className="mt-16">
                <h2 className="font-wwpl-display text-3xl font-medium">What happens next</h2>
                <ol className="mt-6 space-y-4">
                  {sales.process.map((p, i) => (
                    <li key={p.title} className="flex gap-4">
                      <span
                        aria-hidden="true"
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium"
                        style={{ background: `${hue}1A`, color: hue }}
                      >
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-[16px] font-medium">{p.title}</p>
                        <p className="mt-0.5 max-w-[62ch] text-sm text-muted-foreground">{p.detail}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>

              <section className="mt-16">
                <h2 className="font-wwpl-display text-3xl font-medium">Questions people ask</h2>
                <div className="mt-5 divide-y" style={{ borderColor: 'rgba(14,21,19,.09)' }}>
                  {sales.faqs.map((f) => (
                    <details key={f.q} className="group py-4">
                      <summary className="cursor-pointer list-none text-[16px] font-medium marker:hidden">
                        <span className="flex items-start justify-between gap-4">
                          {f.q}
                          <span
                            aria-hidden="true"
                            className="mt-1 shrink-0 transition-transform group-open:rotate-45"
                            style={{ color: hue }}
                          >
                            +
                          </span>
                        </span>
                      </summary>
                      <p className="mt-2 max-w-[66ch] text-[15px] text-muted-foreground">{f.a}</p>
                    </details>
                  ))}
                </div>
              </section>
            </>
          )}

          {band.explore && (
            <section className="mt-12">
              <Link
                to={band.explore.href}
                className="text-[15px] underline-offset-4 hover:underline"
                style={{ color: hue }}
              >
                {band.explore.label}
              </Link>
            </section>
          )}

          <section className="mt-16 rounded-2xl p-8 md:p-10" style={{ background: '#15201F' }}>
            <h2 className="font-wwpl-display text-3xl font-medium" style={{ color: '#FAF8F2' }}>
              {offer.cta}
            </h2>
            <p className="mt-2 max-w-[54ch] text-sm" style={{ color: '#B9C6C2' }}>
              Tell us what you are working on. A person replies, usually the same working
              day, and you get a straight answer on whether this is the right thing.
            </p>
            <div className="mt-6">
              <Cta variant="dark" />
            </div>
          </section>

          {siblings.length > 0 && (
            <section className="mt-16 border-t pt-10" style={{ borderColor: 'rgba(14,21,19,.09)' }}>
              <h2 className="font-wwpl-display text-2xl font-medium">
                Also in {band.heading.toLowerCase()}
              </h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {siblings.map((s) => (
                  <Link
                    key={s.slug}
                    to={`/services/${s.slug}`}
                    className="group rounded-xl border bg-white/70 p-5 transition-colors hover:border-foreground/20"
                    style={{ borderColor: 'rgba(14,21,19,.09)' }}
                  >
                    <span
                      aria-hidden="true"
                      className="block h-[3px] w-8 rounded-full"
                      style={{ background: s.hue || band.hue }}
                    />
                    <p className="mt-3 text-[15px] font-medium">{s.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{s.price}</p>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-sm">
                      See details
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section className="mt-16 border-t pt-10" style={{ borderColor: 'rgba(14,21,19,.09)' }}>
            <h2
              className="text-[10px] uppercase tracking-[.2em] text-muted-foreground"
              style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}
            >
              Terms
            </h2>
            <ul className="mt-4 max-w-[70ch] space-y-1.5">
              {RATE_CARD_TERMS.map((t) => (
                <li key={t} className="text-sm text-muted-foreground">
                  {t}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>

      {/* Sticky action on small screens. The page is long and the price sits
          at the top, so on a phone the action would otherwise be scrolled
          past and never seen again. */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t px-4 py-3 md:hidden"
        style={{ background: 'rgba(250,248,242,.96)', borderColor: 'rgba(14,21,19,.12)' }}
      >
        <div className="min-w-0">
          <p className="truncate text-[13px] font-medium">{offer.name}</p>
          <p className="text-[13px]" style={{ color: hue }}>{offer.price}</p>
        </div>
        <Link
          to={contactHref}
          className="shrink-0 rounded-full px-5 py-2.5 text-[14px] font-medium"
          style={{ background: '#15201F', color: '#FAF8F2' }}
        >
          {offer.cta}
        </Link>
      </div>
      {/* Spacer so the sticky bar never covers the last of the terms. */}
      <div className="h-20 md:hidden" aria-hidden="true" />

      <Footer />
    </>
  );
};

export default ServiceOfferDetail;
