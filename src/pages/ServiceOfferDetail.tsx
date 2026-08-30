import { useParams, Link, Navigate } from 'react-router-dom';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';
import Footer from '@/components/Footer';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';
import {
  getOffer,
  getBandForOffer,
  getSiblingOffers,
  RATE_CARD_TERMS,
  SPECTRUM,
} from '@/data/publicRateCard';
import { useSEO } from '@/lib/seo';
import { WHATSAPP_URL } from '@/components/services/spectrum';

/**
 * One page per offer on the rate card.
 *
 * WHY THIS EXISTS. /services was a single page of anchor links. Every offer
 * was a card that jumped to a heading further down the same document, so
 * there was nothing to send a client, nothing for search to index against a
 * specific service, and nothing to point an advert at. Eighteen offers shared
 * one URL and one page title.
 *
 * WHERE THE CONTENT COMES FROM. Every word of offer content on this page is
 * read from src/data/publicRateCard.ts and nothing is written here. That file
 * is the only place a client facing price may be defined, and its rule is
 * that a number not on the approved rate card is not publishable. This page
 * therefore cannot introduce a price, reword an inclusion, or invent a claim
 * about what an offer delivers. The only prose this file contributes is
 * structural labelling, such as the words "What you get", which describe the
 * page rather than the service.
 *
 * That constraint is deliberate rather than incidental. The obvious way to
 * fill eighteen detail pages is to generate supporting copy per offer, and
 * that is exactly how unapproved claims and drifting prices reach a live
 * site. A thinner page built only from approved content is the correct
 * trade.
 *
 * No em dashes in this file.
 */

const ServiceOfferDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const offer = getOffer(slug);
  const band = getBandForOffer(slug);
  const siblings = slug ? getSiblingOffers(slug) : [];

  // An unknown slug is a mistyped or stale URL, not an error state worth a
  // page of its own. Send the visitor to the catalogue, which is what they
  // were looking for.
  const seoTitle = offer
    ? `${offer.name} | ${offer.price} | Omni Wellness Media`
    : 'Services | Omni Wellness Media';

  useSEO({
    title: seoTitle,
    description: offer ? offer.blurb : 'Services and rates from Omni Wellness Media.',
    canonical: offer
      ? `https://omniwellnessmedia.co.za/services/${offer.slug}`
      : 'https://omniwellnessmedia.co.za/services',
  });

  if (!offer || !band) return <Navigate to="/services" replace />;

  const hue = offer.hue || band.hue;

  return (
    <>
      <UnifiedNavigation />

      <main style={{ background: '#FAF8F2' }}>
        <div className="mx-auto max-w-5xl px-4 py-12 md:py-16">
          <Link
            to="/services"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All services and rates
          </Link>

          <header className="mt-8">
            <p
              className="flex items-center gap-2 text-[10px] uppercase tracking-[.2em] text-muted-foreground"
              style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}
            >
              <span aria-hidden="true" className="h-[6px] w-[6px] rounded-full" style={{ background: hue }} />
              {band.eyebrow}
            </p>

            <h1 className="mt-3 font-wwpl-display text-4xl font-medium leading-tight md:text-5xl">
              {offer.name}
            </h1>

            <p className="mt-4 max-w-[62ch] text-lg text-muted-foreground">{offer.blurb}</p>

            <p className="mt-6 font-wwpl-display text-3xl font-medium" style={{ color: hue }}>
              {offer.price}
            </p>
            {offer.footnote && (
              <p className="mt-2 max-w-[62ch] text-sm text-muted-foreground">{offer.footnote}</p>
            )}

            <div className="mt-7 flex flex-wrap gap-3">
              <Link to={`/contact?service=${offer.slug}`} className="btn-primary inline-flex items-center gap-2">
                {offer.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
              {offer.whatsapp && (
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary inline-flex items-center gap-2"
                >
                  Ask on WhatsApp
                </a>
              )}
            </div>
          </header>

          {offer.bullets.length > 0 && (
            <section className="mt-14">
              <h2 className="font-wwpl-display text-2xl font-medium">What you get</h2>
              <ul className="mt-4 max-w-[62ch] space-y-2.5">
                {offer.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-[15px]">
                    <Check className="mt-[3px] h-4 w-4 shrink-0" style={{ color: hue }} aria-hidden="true" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </section>
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

          {siblings.length > 0 && (
            <section className="mt-16 border-t pt-10" style={{ borderColor: 'rgba(14,21,19,.09)' }}>
              <h2 className="font-wwpl-display text-2xl font-medium">Also in {band.heading.toLowerCase()}</h2>
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

          <section
            className="mt-14 rounded-2xl p-8 text-center"
            style={{ background: '#15201F', color: SPECTRUM.clay }}
          >
            <h2 className="font-wwpl-display text-2xl font-medium" style={{ color: '#FAF8F2' }}>
              Ready when you are
            </h2>
            <p className="mx-auto mt-2 max-w-[52ch] text-sm" style={{ color: '#B9C6C2' }}>
              Tell us what you are working on and we will come back with the next step.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                to={`/contact?service=${offer.slug}`}
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-medium"
                style={{ background: '#FAF8F2', color: '#15201F' }}
              >
                {offer.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 rounded-full border px-6 py-3 text-[15px] font-medium"
                style={{ borderColor: 'rgba(250,248,242,.3)', color: '#FAF8F2' }}
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

export default ServiceOfferDetail;
