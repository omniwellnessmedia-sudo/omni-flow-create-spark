import { Link } from 'react-router-dom';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';
import Footer from '@/components/Footer';
import { ArrowRight } from 'lucide-react';
import {
  SERVICE_BANDS,
  QUOTED_CATEGORIES,
  RATE_CARD_TERMS,
  getOffer,
} from '@/data/publicRateCard';
import { useSEO } from '@/lib/seo';

/**
 * The pricing page from the service pack handoff.
 *
 * WHY IT IS SEPARATE FROM /services. The services page is a catalogue: seven
 * bands, nineteen offers, browsed by category. This page answers a different
 * question, the one a buyer asks first: what does it cost to start, what does
 * the common choice cost, and what does ongoing cost. Three tiers, then every
 * published rate in one table.
 *
 * PRICES COME FROM THE RATE CARD, ALWAYS. Every figure on this page is read
 * from src/data/publicRateCard.ts by slug. Nothing is written here, so a rate
 * change lands on this page without anyone editing it.
 *
 * WHAT THE HANDOFF HAS THAT THIS PAGE DOES NOT. Its pricing page also sells
 * four downloadable kits at R199, R349, R499 and R799. None of those appears
 * on the approved rate card, so none is published here. They go in when they
 * reach the rate card.
 *
 * No em dashes in this file.
 */

const INK = '#15201F';
const CREAM = '#FAF8F2';
const CLAY = '#C9B68E';
const mono = { fontFamily: '"JetBrains Mono", ui-monospace, monospace' } as const;

/** The three entry points, in the handoff's order and wording. */
const TIERS = [
  {
    slug: 'clarity-session',
    eyebrow: 'Start here',
    unit: 'Once-off',
    line: 'One hour with a senior strategist and a written action map.',
    featured: false,
  },
  {
    slug: 'revenue-sprint',
    eyebrow: 'Most chosen',
    unit: 'Launch rate, fixed scope',
    line: 'One offer, one page, one route to payment, measured.',
    featured: true,
  },
  {
    slug: 'growth-desk',
    eyebrow: 'Ongoing',
    unit: 'Per month',
    line: 'A standing desk for strategy, content and site work.',
    featured: false,
  },
] as const;

const Pricing = () => {
  useSEO({
    title: 'Pricing | Omni Wellness Media',
    description:
      'Published rates in South African rand for strategy, websites, content, retainers, podcast and campaign work.',
    canonical: 'https://omniwellnessmedia.co.za/pricing',
  });

  const tiers = TIERS.map((t) => ({ ...t, offer: getOffer(t.slug) })).filter((t) => t.offer);

  // Every offer that publishes a rate, in band order. Offers quoted on scope
  // are listed separately below rather than shown with an empty rate.
  const published = SERVICE_BANDS.flatMap((band) =>
    band.offers.map((offer) => ({ band, offer }))
  );

  return (
    <>
      <UnifiedNavigation />
      <main style={{ background: CREAM }}>
        <div className="mx-auto max-w-[1180px] px-5 py-14 sm:px-8 md:py-20">
          <p
            className="text-[11px] uppercase tracking-[.22em] text-muted-foreground"
            style={mono}
          >
            Pricing · South Africa · Rates in ZAR
          </p>
          <h1
            className="mt-5 max-w-[20ch] font-wwpl-display font-medium leading-[1.06]"
            style={{ fontSize: 'clamp(38px, 5.5vw, 68px)', color: INK }}
          >
            What it costs to <em style={{ color: CLAY }}>start, and to keep going.</em>
          </h1>
          <p className="mt-6 max-w-[62ch] text-[17px] leading-relaxed text-muted-foreground">
            Three ways in, then every published rate in one place. Anything larger is
            quoted after we understand the work.
          </p>

          {/* Three tiers */}
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {tiers.map((t) => (
              <div
                key={t.slug}
                className="flex flex-col rounded-[20px] border p-7"
                style={{
                  background: t.featured ? 'rgba(43,185,185,.13)' : 'rgba(255,255,255,.7)',
                  borderColor: t.featured ? 'rgba(43,185,185,.5)' : 'rgba(14,21,19,.14)',
                }}
              >
                <p className="text-[11px] uppercase tracking-[.2em]" style={{ ...mono, color: t.offer!.hue }}>
                  {t.eyebrow}
                </p>
                <h2 className="mt-2 font-wwpl-display text-[26px] font-medium leading-snug" style={{ color: INK }}>
                  {t.offer!.name}
                </h2>
                <p className="mt-3 font-wwpl-display text-[40px] font-medium leading-none" style={{ color: INK }}>
                  {t.offer!.price}
                </p>
                <p className="mt-1.5 text-[11px] uppercase tracking-[.14em] text-muted-foreground" style={mono}>
                  {t.unit}
                </p>
                <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">{t.line}</p>
                <ul className="mt-4 space-y-2">
                  {t.offer!.bullets.slice(0, 4).map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-[14px]">
                      <span
                        aria-hidden="true"
                        className="mt-[7px] h-[5px] w-[5px] shrink-0 rounded-full"
                        style={{ background: t.offer!.hue }}
                      />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-6">
                  <Link
                    to={`/services/${t.slug}`}
                    className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[14px] font-medium"
                    style={{ background: INK, color: CREAM }}
                  >
                    {t.offer!.cta}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Published rates */}
          <section className="mt-20">
            <h2 className="font-wwpl-display text-[clamp(28px,3.4vw,38px)] font-medium" style={{ color: INK }}>
              Published rates
            </h2>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-left">
                <thead>
                  <tr>
                    {['Service', 'Rate', 'What you get'].map((h) => (
                      <th
                        key={h}
                        className="border-b py-3 pr-4 text-[10.5px] uppercase tracking-[.16em] text-muted-foreground"
                        style={{ ...mono, borderColor: 'rgba(14,21,19,.16)' }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {published.map(({ band, offer }) => (
                    <tr key={offer.slug}>
                      <td className="border-b py-4 pr-4 align-top" style={{ borderColor: 'rgba(14,21,19,.09)' }}>
                        <Link to={`/services/${offer.slug}`} className="text-[15px] font-medium underline-offset-4 hover:underline">
                          {offer.name}
                        </Link>
                        <span className="mt-0.5 block text-[11px] uppercase tracking-[.14em] text-muted-foreground" style={mono}>
                          {band.eyebrow}
                        </span>
                      </td>
                      <td
                        className="whitespace-nowrap border-b py-4 pr-4 align-top text-[14px]"
                        style={{ ...mono, borderColor: 'rgba(14,21,19,.09)', color: offer.hue }}
                      >
                        {offer.price}
                      </td>
                      <td className="border-b py-4 align-top text-[14px] text-muted-foreground" style={{ borderColor: 'rgba(14,21,19,.09)' }}>
                        {offer.blurb}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Quoted on scope */}
          <section className="mt-16">
            <h2 className="font-wwpl-display text-[clamp(24px,3vw,32px)] font-medium" style={{ color: INK }}>
              Quoted on scope
            </h2>
            <p className="mt-2 max-w-[62ch] text-[15px] text-muted-foreground">
              These are priced after a conversation, because the number depends on what
              the work actually is.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {QUOTED_CATEGORIES.map((q) => (
                <div
                  key={q.area}
                  className="rounded-2xl border bg-white/70 p-5"
                  style={{ borderColor: 'rgba(14,21,19,.12)' }}
                >
                  <p className="text-[11px] uppercase tracking-[.18em] text-muted-foreground" style={mono}>
                    {q.area}
                  </p>
                  <p className="mt-2 text-[15px] leading-relaxed">{q.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Terms */}
          <section className="mt-16 border-t pt-10" style={{ borderColor: 'rgba(14,21,19,.09)' }}>
            <h2 className="font-wwpl-display text-2xl font-medium" style={{ color: INK }}>
              Commercial terms
            </h2>
            <ul className="mt-5 grid gap-2.5 md:grid-cols-2">
              {RATE_CARD_TERMS.map((t) => (
                <li key={t} className="text-[13.5px] leading-relaxed text-muted-foreground">
                  {t}
                </li>
              ))}
            </ul>
          </section>

          {/* Close */}
          <section className="mt-16 rounded-[22px] p-9 text-center md:p-12" style={{ background: INK }}>
            <h2 className="font-wwpl-display text-[clamp(26px,3.4vw,38px)] font-medium" style={{ color: CREAM }}>
              Not sure which one yet?
            </h2>
            <p className="mx-auto mt-3 max-w-[52ch] text-[15px]" style={{ color: '#B9C6C2' }}>
              Take the free Revenue Readiness Scorecard. Ten questions, two minutes, and
              the result names the offer that fits.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link
                to="/scorecard"
                className="rounded-full px-6 py-3 text-[14px] font-medium"
                style={{ background: CREAM, color: INK }}
              >
                Take the scorecard
              </Link>
              <Link
                to="/services"
                className="rounded-full px-6 py-3 text-[14px]"
                style={{ border: '1px solid rgba(247,243,234,.3)', color: CREAM }}
              >
                See all services
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Pricing;
