import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Search, FileText, Handshake, Phone } from 'lucide-react';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';
import Footer from '@/components/Footer';
import TalkToAHuman from '@/components/services/TalkToAHuman';
import {
  INK,
  INK_SOFT,
  SLATE,
  CREAM,
  CREAM_2,
  LINE,
  HAIRLINE,
  mono,
  SpectrumRule,
  Reveal,
  Eyebrow,
  WhatsappButton,
  useWhatsappLink,
} from '@/components/services/spectrum';
import { SPECTRUM, getOffer, type RateCardOffer } from '@/data/publicRateCard';
import { offerImage, type ServiceImage } from '@/data/serviceImagery';
import { publishedContacts, telHref } from '@/data/humanContact';
import { MUIZENBERG_CONTEXT, MUIZENBERG_OFFER_SLUGS, MUIZENBERG_ENQUIRE_HREF } from '@/data/muizenberg';
import { useSEO } from '@/lib/seo';

/**
 * The Muizenberg page: one page for the businesses within walking distance.
 *
 * WHY IT EXISTS. The services catalogue lists nineteen offers across seven
 * bands, which is the right shape for a buyer who arrives knowing what they
 * want. A cafe owner on Main Road handed a flyer does not. This page makes
 * the smallest possible ask of that person: two entry offers, one promise,
 * one way to reach us, and nothing to scroll past.
 *
 * THE PROMISE IS THE PRODUCT. Before anyone talks about money we look at the
 * business's website, Google profile and social pages and write down three
 * specific things we found. That is the pitch, the door-opener, and the
 * proof of work, and it costs the business owner nothing. The printable
 * sheet the team fills in by hand lives at /muizenberg/audit-sheet.
 *
 * THE PHOTOGRAPHS ARE OMNI'S OWN, from local events and shoots, chosen so
 * the page looks like the neighbourhood it is for rather than a stock
 * library. Every one shows adults only. Two photographs from the same
 * upload were left out because a child is the subject; they are not in
 * the repository. Each is cropped to the exact slot it fills and encoded
 * under 250KB, and the multi megabyte originals are not served.
 *
 * WHAT IS DELIBERATELY NOT HERE. No "first five businesses", no countdown, no
 * "limited slots": every one of those would be invented. No testimonials,
 * because the only consented ones this site holds are about a screening
 * event. No figures about the neighbourhood, because none has been verified.
 * Prices are read from the rate card by slug, never typed here.
 *
 * WHERE LEADS GO. Every route off this page carries the context
 * "Muizenberg local business" into the enquiry form, so the leads screen
 * shows which conversations this page started.
 *
 * No em dashes in this file.
 */

const ENQUIRE_HREF = MUIZENBERG_ENQUIRE_HREF;

/** Photographs used only on this page. Sizes are the encoded pixel sizes. */
export const MUIZENBERG_IMAGES = {
  hero: {
    src: '/services/muizenberg-hero.webp',
    alt: 'Two stallholders smiling together under a gazebo at a local market',
    width: 800,
    height: 1000,
  },
  strip: {
    src: '/services/muizenberg-strip.webp',
    alt: 'A crowd gathered on a field under branded umbrellas, with the mountains behind',
    width: 1600,
    height: 686,
  },
  audit: {
    src: '/services/muizenberg-audit.webp',
    alt: 'A woman in a green shirt writing notes on a sheet of paper at an outdoor event',
    width: 800,
    height: 1000,
  },
  outdoors: {
    src: '/services/muizenberg-outdoors.webp',
    alt: 'A tandem paraglider lifting off from a launch site, with two crew members steadying the harness',
    width: 800,
    height: 1000,
  },
  madeHere: {
    src: '/services/muizenberg-made-here.webp',
    alt: 'Four members of a local crew standing together at an outdoor event, one holding a camera',
    width: 1200,
    height: 800,
  },
} as const;

/**
 * Which photograph sits beside each door-opener. The clarity session uses
 * the same image as its catalogue card; the audit gets the page's own
 * photograph of somebody writing findings down, which is the product.
 */
const OFFER_PHOTOS: Record<(typeof MUIZENBERG_OFFER_SLUGS)[number], ServiceImage> = {
  'clarity-session': offerImage('clarity-session') ?? MUIZENBERG_IMAGES.audit,
  'website-audit': MUIZENBERG_IMAGES.audit,
};

/** Three larger offers for the owner who already knows they need more. */
const BIGGER_SLUGS = ['revenue-sprint', 'landing-page', 'content-starter-pack'] as const;

const WHO_FOR = [
  'Cafes, restaurants and bars',
  'Guesthouses, B&Bs and holiday lets',
  'Surf schools and outdoor operators',
  'Yoga, wellness and health practitioners',
  'Shops, markets and makers',
  'Tradespeople and home services',
];

const STEPS = [
  {
    icon: MapPin,
    title: 'Tell us who you are',
    body: 'Your business name and how to reach you. A message, a call, or the short form. Nothing else yet.',
  },
  {
    icon: Search,
    title: 'We look before we talk',
    body: 'We check your website, your Google Business profile and your social pages, and write down three specific things we found.',
  },
  {
    icon: FileText,
    title: 'You get the three findings',
    body: 'What we saw, why it costs you customers, and what fixes it. Written down, free, and yours whether or not you hire us.',
  },
  {
    icon: Handshake,
    title: 'You decide',
    body: 'Fix it yourself, book one of the two offers below, or do nothing. If the findings were not useful, you have lost nothing.',
  },
];

/**
 * A door-opener with its photograph beside it. The same surface, hue and
 * actions as the catalogue's OfferCard, laid out sideways so the picture
 * and the price are seen together.
 */
const PhotoOfferCard = ({
  offer,
  image,
  enquiryContext,
}: {
  offer: RateCardOffer;
  image: ServiceImage;
  enquiryContext: string;
}) => (
  <article
    className="group relative grid overflow-hidden rounded-[18px] bg-white shadow-[0_1px_3px_rgba(21,32,31,.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_34px_rgba(21,32,31,.10)] sm:grid-cols-[2fr_3fr]"
    style={{ border: `1px solid ${LINE}` }}
  >
    <span aria-hidden="true" className="absolute inset-x-0 top-0 z-10 h-[3px]" style={{ background: offer.hue }} />
    <div className="aspect-[4/3] sm:aspect-auto sm:h-full" style={{ background: CREAM_2 }}>
      <img
        src={image.src}
        alt={image.alt}
        width={800}
        height={1000}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover"
      />
    </div>
    <div className="flex flex-col p-6">
      <h3 className="font-wwpl-display text-[25px] leading-tight" style={{ color: INK }}>
        <Link to={`/services/${offer.slug}`} className="hover:underline underline-offset-4">
          {offer.name}
        </Link>
      </h3>
      <p className="mt-2 text-[12.5px] uppercase tracking-[.14em]" style={{ ...mono, color: offer.hue }}>
        {offer.price}
      </p>
      <p className="mt-3 text-[15px] leading-relaxed" style={{ color: SLATE }}>
        {offer.blurb}
      </p>
      <ul className="mt-4 space-y-2">
        {offer.bullets.map((b) => (
          <li key={b} className="flex items-start gap-3 text-[14px] leading-relaxed" style={{ color: INK_SOFT }}>
            <span aria-hidden="true" className="mt-[8px] h-[5px] w-[5px] flex-none rounded-full" style={{ background: offer.hue }} />
            {b}
          </li>
        ))}
      </ul>
      <div className="mt-auto flex flex-wrap items-center gap-3 pt-5" style={{ borderTop: `1px solid ${HAIRLINE}` }}>
        <Link
          to={`/enquire?s=${offer.slug}&a=${encodeURIComponent(enquiryContext)}`}
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13.5px] font-medium text-white transition-transform duration-300 group-hover:scale-[1.02]"
          style={{ background: offer.hue }}
        >
          {offer.cta} <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        <Link
          to={`/services/${offer.slug}`}
          className="inline-flex min-h-[24px] items-center gap-1.5 text-[13.5px] underline-offset-4 hover:underline"
          style={{ color: SLATE }}
        >
          Full details
        </Link>
      </div>
    </div>
  </article>
);

const Muizenberg = () => {
  useSEO({
    title: 'For Muizenberg Businesses | Omni Wellness Media',
    description:
      'Omni Wellness Media is in Muizenberg. We help local businesses get found online and turn lookers into customers. Three free findings before we talk about money.',
    canonical: 'https://omniwellnessmedia.co.za/muizenberg',
    image: `https://omniwellnessmedia.co.za${MUIZENBERG_IMAGES.strip.src}`,
  });

  const whatsapp = useWhatsappLink();
  const caller = publishedContacts()[0];
  const offers = MUIZENBERG_OFFER_SLUGS.map((slug) => getOffer(slug)).filter(
    (o): o is NonNullable<typeof o> => Boolean(o)
  );
  const bigger = BIGGER_SLUGS.map((slug) => {
    const offer = getOffer(slug);
    const image = offerImage(slug);
    return offer && image ? { offer, image } : null;
  }).filter((x): x is NonNullable<typeof x> => Boolean(x));

  return (
    <div className="min-h-screen" style={{ background: CREAM, color: INK }}>
      <UnifiedNavigation />

      <main>
        {/* Hero */}
        <section className="px-4 pb-14 pt-28 sm:px-6 lg:px-8 lg:pt-36">
          <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
            <div>
              <Eyebrow hue={SPECTRUM.teal}>Muizenberg and the South Peninsula</Eyebrow>
              <h1
                className="mt-5 max-w-3xl font-wwpl-display text-[42px] leading-[1.02] sm:text-[58px] lg:text-[64px]"
                style={{ color: INK }}
              >
                The media house on your doorstep.
              </h1>
              <p className="mt-6 max-w-2xl text-[18px] leading-relaxed sm:text-[20px]" style={{ color: INK_SOFT }}>
                Omni Wellness Media is in Muizenberg. We help local businesses get found online and turn
                lookers into customers, at prices a small business can say yes to.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link
                  to={ENQUIRE_HREF}
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-[15px] font-medium text-white transition-transform duration-300 hover:scale-[1.02]"
                  style={{ background: INK }}
                >
                  Get your three findings <ArrowRight className="h-4 w-4" />
                </Link>
                {whatsapp.canMessageUs ? (
                  <WhatsappButton
                    source="muizenberg_hero"
                    prefill="Hi, I run a business in Muizenberg and would like the three findings check."
                    className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-[15px] transition-colors hover:bg-black/5"
                    style={{ border: `1px solid ${LINE}`, color: INK }}
                  />
                ) : (
                  caller && (
                    <a
                      href={telHref(caller.phone)}
                      className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-[15px] transition-colors hover:bg-black/5"
                      style={{ border: `1px solid ${LINE}`, color: INK }}
                    >
                      <Phone className="h-4 w-4" aria-hidden="true" />
                      Call {caller.phone}
                    </a>
                  )
                )}
              </div>

              <p className="mt-5 text-[13px]" style={{ ...mono, color: SLATE }}>
                Free. Written down. Yours to keep, whether or not you hire us.
              </p>
            </div>

            <div className="relative mx-auto w-full max-w-[420px] lg:max-w-none">
              <div
                className="overflow-hidden rounded-[22px] shadow-[0_18px_50px_rgba(21,32,31,.14)]"
                style={{ border: `1px solid ${LINE}` }}
              >
                <img
                  src={MUIZENBERG_IMAGES.hero.src}
                  alt={MUIZENBERG_IMAGES.hero.alt}
                  width={MUIZENBERG_IMAGES.hero.width}
                  height={MUIZENBERG_IMAGES.hero.height}
                  fetchPriority="high"
                  decoding="async"
                  className="aspect-[4/5] w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <SpectrumRule />

        {/* The neighbourhood */}
        <div className="w-full" style={{ background: CREAM_2 }}>
          <img
            src={MUIZENBERG_IMAGES.strip.src}
            alt={MUIZENBERG_IMAGES.strip.alt}
            width={MUIZENBERG_IMAGES.strip.width}
            height={MUIZENBERG_IMAGES.strip.height}
            loading="lazy"
            decoding="async"
            className="aspect-[1600/686] w-full object-cover"
          />
        </div>

        {/* The promise */}
        <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24" style={{ background: '#FFFFFF' }}>
          <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
            <Reveal>
              <Eyebrow hue={SPECTRUM.green}>The promise</Eyebrow>
              <h2 className="mt-4 font-wwpl-display text-[34px] leading-tight sm:text-[42px]" style={{ color: INK }}>
                Three findings, before we meet.
              </h2>
              <p className="mt-5 text-[16px] leading-relaxed" style={{ color: SLATE }}>
                Most agencies open with a pitch. We open with your business. Give us the name and we go
                and look, the way a customer would: on a phone, on Google, on the pages you already
                have. Then we tell you the three things that are costing you customers right now.
              </p>
              <p className="mt-4 text-[16px] leading-relaxed" style={{ color: SLATE }}>
                That is the whole pitch. If the three findings are not useful, you have lost nothing but
                the time it took to read them.
              </p>
            </Reveal>

            <ol className="grid gap-4 sm:grid-cols-2">
              {STEPS.map((step, i) => (
                <Reveal key={step.title} delay={i * 80}>
                  <li
                    className="flex h-full flex-col rounded-[18px] p-6"
                    style={{ background: CREAM_2, border: `1px solid ${HAIRLINE}` }}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="flex h-9 w-9 items-center justify-center rounded-full text-white"
                        style={{ background: SPECTRUM.teal }}
                      >
                        <step.icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span className="text-[11px] uppercase tracking-[.2em]" style={{ ...mono, color: SLATE }}>
                        Step {i + 1}
                      </span>
                    </div>
                    <h3 className="mt-4 font-wwpl-display text-[22px] leading-tight" style={{ color: INK }}>
                      {step.title}
                    </h3>
                    <p className="mt-2 text-[14.5px] leading-relaxed" style={{ color: SLATE }}>
                      {step.body}
                    </p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* Two offers */}
        <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24" style={{ background: CREAM }}>
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <Eyebrow hue={SPECTRUM.teal}>Two ways to start</Eyebrow>
              <h2 className="mt-4 max-w-2xl font-wwpl-display text-[34px] leading-tight sm:text-[42px]" style={{ color: INK }}>
                Small enough to decide today. Useful enough to matter.
              </h2>
              <p className="mt-4 max-w-2xl text-[16px] leading-relaxed" style={{ color: SLATE }}>
                These are the published rates from our services page, the same for everyone. Each one
                ends with something written that you can act on the same week.
              </p>
            </Reveal>

            <div className="mt-10 grid gap-6">
              {offers.map((offer, i) => (
                <Reveal key={offer.slug} delay={i * 100}>
                  <PhotoOfferCard
                    offer={offer}
                    image={OFFER_PHOTOS[offer.slug as (typeof MUIZENBERG_OFFER_SLUGS)[number]]}
                    enquiryContext={MUIZENBERG_CONTEXT}
                  />
                </Reveal>
              ))}
            </div>

            {bigger.length > 0 && (
              <div className="mt-14">
                <Reveal>
                  <p className="text-[16px]" style={{ color: SLATE }}>
                    Need something bigger, like a website or a month of content?
                  </p>
                </Reveal>
                <ul className="mt-5 grid gap-4 sm:grid-cols-3">
                  {bigger.map(({ offer, image }, i) => (
                    <Reveal key={offer.slug} delay={i * 80}>
                      <li
                        className="group overflow-hidden rounded-[16px] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_34px_rgba(21,32,31,.10)]"
                        style={{ border: `1px solid ${LINE}` }}
                      >
                        <Link to={`/services/${offer.slug}`} className="block">
                          <img
                            src={image.src}
                            alt={image.alt}
                            width={800}
                            height={1000}
                            loading="lazy"
                            decoding="async"
                            className="aspect-[4/3] w-full object-cover"
                          />
                          <div className="p-5">
                            <h3 className="font-wwpl-display text-[20px] leading-tight group-hover:underline underline-offset-4" style={{ color: INK }}>
                              {offer.name}
                            </h3>
                            <p className="mt-1.5 text-[12px] uppercase tracking-[.14em]" style={{ ...mono, color: offer.hue }}>
                              {offer.price}
                            </p>
                          </div>
                        </Link>
                      </li>
                    </Reveal>
                  ))}
                </ul>
                <p className="mt-6 text-[14px]" style={{ color: SLATE }}>
                  <Link to="/services" className="inline-flex min-h-[24px] items-center underline underline-offset-4" style={{ color: INK }}>
                    Every service and rate is on one page
                  </Link>
                  .
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Who it is for */}
        <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20" style={{ background: '#FFFFFF' }}>
          <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div>
              <Reveal>
                <Eyebrow hue={SPECTRUM.orange}>Who this is for</Eyebrow>
                <h2 className="mt-4 font-wwpl-display text-[34px] leading-tight sm:text-[42px]" style={{ color: INK }}>
                  If customers could walk past you, this is for you.
                </h2>
                <p className="mt-4 text-[16px] leading-relaxed" style={{ color: SLATE }}>
                  Any business that depends on people finding it, choosing it, and coming back. The
                  findings are different for a surf school and a guesthouse. The way we look is the same.
                </p>
              </Reveal>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {WHO_FOR.map((who, i) => (
                  <Reveal key={who} delay={i * 50}>
                    <li
                      className="flex items-center gap-3 rounded-[14px] px-5 py-4 text-[15px]"
                      style={{ background: CREAM_2, color: INK_SOFT, border: `1px solid ${HAIRLINE}` }}
                    >
                      <span aria-hidden="true" className="h-2 w-2 flex-none rounded-full" style={{ background: SPECTRUM.orange }} />
                      {who}
                    </li>
                  </Reveal>
                ))}
              </ul>
            </div>
            <Reveal delay={120}>
              <div className="mx-auto max-w-[380px] overflow-hidden rounded-[22px] lg:max-w-none" style={{ border: `1px solid ${LINE}` }}>
                <img
                  src={MUIZENBERG_IMAGES.outdoors.src}
                  alt={MUIZENBERG_IMAGES.outdoors.alt}
                  width={MUIZENBERG_IMAGES.outdoors.width}
                  height={MUIZENBERG_IMAGES.outdoors.height}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/5] w-full object-cover"
                />
              </div>
            </Reveal>
          </div>
        </section>

        {/* Made here */}
        <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24" style={{ background: INK, color: CREAM }}>
          <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-16">
            <Reveal>
              <p className="flex items-center gap-3 text-[11px] uppercase tracking-[.22em]" style={{ ...mono, color: 'rgba(250,248,242,.6)' }}>
                <span aria-hidden="true" className="h-[9px] w-[9px] rounded-full" style={{ background: SPECTRUM.yellow }} />
                Made here
              </p>
              <h2 className="mt-4 font-wwpl-display text-[34px] leading-tight sm:text-[46px]">
                Work local businesses can afford, done by local people.
              </h2>
              <div className="mt-6 space-y-4 text-[16px] leading-relaxed" style={{ color: 'rgba(250,248,242,.78)' }}>
                <p>
                  There is a great deal of talent in this neighbourhood and not enough paid work for it.
                  Our aim is to change that one job at a time: local businesses get marketing and media
                  work at a price they can manage, and local people get paid to do it.
                </p>
                <p>
                  We are building a bench of writers, designers, photographers, editors and marketers
                  from Muizenberg and the surrounding area to deliver that work, with Omni selling it,
                  checking it and standing behind it. If you have skills and want in,{' '}
                  <Link to="/contact" className="inline-flex min-h-[24px] items-center underline underline-offset-4" style={{ color: CREAM }}>
                    tell us
                  </Link>
                  .
                </p>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="overflow-hidden rounded-[22px]" style={{ border: '1px solid rgba(250,248,242,.18)' }}>
                <img
                  src={MUIZENBERG_IMAGES.madeHere.src}
                  alt={MUIZENBERG_IMAGES.madeHere.alt}
                  width={MUIZENBERG_IMAGES.madeHere.width}
                  height={MUIZENBERG_IMAGES.madeHere.height}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[3/2] w-full object-cover"
                />
              </div>
            </Reveal>
          </div>
        </section>

        {/* Contact */}
        <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24" style={{ background: CREAM }}>
          <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-2">
            <Reveal>
              <div
                className="flex h-full flex-col rounded-2xl p-6"
                style={{ background: '#FFFFFF', border: `1px solid ${LINE}` }}
              >
                <p className="text-[10px] uppercase tracking-[.2em]" style={{ ...mono, color: SLATE }}>
                  Start here
                </p>
                <h2 className="mt-3 font-wwpl-display text-[24px] leading-tight" style={{ color: INK }}>
                  Send us your business name.
                </h2>
                <p className="mt-2 text-[15px] leading-relaxed" style={{ color: SLATE }}>
                  That is all we need to start looking. Say which offer interests you if you already
                  know, or leave it to us.
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <Link
                    to={ENQUIRE_HREF}
                    className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13.5px] font-medium text-white"
                    style={{ background: SPECTRUM.teal }}
                  >
                    Short form <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <WhatsappButton
                    source="muizenberg_contact"
                    prefill="Hi, I run a business in Muizenberg and would like the three findings check."
                    className="inline-flex items-center rounded-full px-5 py-2.5 text-[13.5px] transition-colors hover:bg-black/5"
                    style={{ border: `1px solid ${LINE}`, color: INK }}
                  />
                </div>
                <p className="mt-auto pt-6 text-[13px]" style={{ color: SLATE }}>
                  Not sure what you need yet? The{' '}
                  <Link to="/scorecard" className="inline-flex min-h-[24px] items-center underline underline-offset-4" style={{ color: INK }}>
                    two-minute scorecard
                  </Link>{' '}
                  tells you, without giving us anything.
                </p>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <TalkToAHuman className="h-full" />
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Muizenberg;
