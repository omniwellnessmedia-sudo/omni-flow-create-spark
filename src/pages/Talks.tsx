import { ExternalLink, Phone } from 'lucide-react';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';
import Footer from '@/components/Footer';
import YouTubeFacade from '@/components/YouTubeFacade';
import { INK, INK_SOFT, SLATE, CREAM, CREAM_2, LINE, HAIRLINE, mono, SpectrumRule, Reveal, Eyebrow } from '@/components/services/spectrum';
import { SPECTRUM } from '@/data/publicRateCard';
import { TALKS, listedTalks, HELPLINE, CHANNEL_URL } from '@/data/talks';
import { useSEO } from '@/lib/seo';

/**
 * /talks: the produced video talks, in one place on the site.
 *
 * The videos live on the Omni Wellness Media YouTube channel; this page is
 * the front door to them from the site, with a poster and a play button per
 * talk (see YouTubeFacade for why not eighteen iframes). What is listed is
 * decided in src/data/talks.ts: public videos only, and the sensitive ones
 * only once a helpline number is on file.
 *
 * WHILE THE LIST IS SHORT. Uploads arrive a few at a time, and each is made
 * public only after a person has watched it through. Until the first one is
 * public the page says so plainly and points at the channel, rather than
 * embedding private videos that would render as "unavailable".
 *
 * No em dashes in this file.
 */

const Talks = () => {
  useSEO({
    title: 'Talks | Omni Wellness Media',
    description:
      'Produced talks from Omni Wellness Media on wellbeing, purpose and change, from the Omni Wellness Media YouTube channel.',
    canonical: 'https://omniwellnessmedia.co.za/talks',
  });

  const talks = listedTalks();
  const unlisted = TALKS.length - talks.length;

  return (
    <div className="min-h-screen" style={{ background: CREAM, color: INK }}>
      <UnifiedNavigation />

      <main>
        <section className="px-4 pb-12 pt-28 sm:px-6 lg:px-8 lg:pt-36">
          <div className="mx-auto max-w-5xl">
            <Eyebrow hue={SPECTRUM.violet}>Talks</Eyebrow>
            <h1 className="mt-5 max-w-3xl font-wwpl-display text-[42px] leading-[1.02] sm:text-[58px]" style={{ color: INK }}>
              Talks on wellbeing, purpose and change.
            </h1>
            <p className="mt-6 max-w-2xl text-[18px] leading-relaxed" style={{ color: INK_SOFT }}>
              Produced by Omni Wellness Media. Press play on any of them here, or watch the whole series on
              the channel.
            </p>
            <a
              href={CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[14px] transition-colors hover:bg-black/5"
              style={{ border: `1px solid ${LINE}`, color: INK }}
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              Omni Wellness Media on YouTube
            </a>
          </div>
        </section>

        <SpectrumRule />

        <section className="px-4 py-14 sm:px-6 lg:px-8 lg:py-20" style={{ background: '#FFFFFF' }}>
          <div className="mx-auto max-w-5xl">
            {talks.length === 0 ? (
              <div className="rounded-[18px] p-8" style={{ background: CREAM_2, border: `1px solid ${HAIRLINE}` }}>
                <p className="text-[11px] uppercase tracking-[.22em]" style={{ ...mono, color: SLATE }}>
                  Being added
                </p>
                <p className="mt-3 max-w-2xl text-[16px] leading-relaxed" style={{ color: INK_SOFT }}>
                  The talks are being moved onto the channel a few at a time and each one is checked
                  before it goes public. The first will appear here as soon as it is live.
                </p>
              </div>
            ) : (
              <ul className="grid gap-8 md:grid-cols-2">
                {talks.map((talk, i) => (
                  <Reveal key={talk.youtubeId} delay={i * 60}>
                    <li className="flex h-full flex-col">
                      <YouTubeFacade id={talk.youtubeId} title={talk.title} />
                      <h2 className="mt-4 font-wwpl-display text-[24px] leading-tight" style={{ color: INK }}>
                        {talk.title}
                      </h2>
                      <p className="mt-1.5 text-[15px] leading-relaxed" style={{ color: SLATE }}>
                        {talk.blurb}
                      </p>
                      {talk.sensitive && HELPLINE && (
                        <p className="mt-3 flex items-start gap-2 text-[13px] leading-snug" style={{ color: INK_SOFT }}>
                          <Phone className="mt-[2px] h-3.5 w-3.5 flex-none" aria-hidden="true" />
                          <span>If you need to talk to someone now: {HELPLINE}</span>
                        </p>
                      )}
                    </li>
                  </Reveal>
                ))}
              </ul>
            )}

            {talks.length > 0 && unlisted > 0 && (
              <p className="mt-10 text-[13px]" style={{ ...mono, color: SLATE }}>
                More talks are being added.
              </p>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Talks;
