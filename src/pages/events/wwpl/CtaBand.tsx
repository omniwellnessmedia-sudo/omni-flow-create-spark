import { quicketHref } from "./attribution";
import { EVENT_CONCLUDED } from "./event";
import { BtnLink, Reveal } from "./ui";
import { cn } from "@/lib/utils";

/**
 * Repeating call-to-action band, built from the OFFICIAL commissioned banner
 * artwork (final-banner, the 1500x500 wide cut of the same lockup as the
 * poster). Used between sections so the booking action is never more than a
 * screen away on a long page.
 *
 * The banner already carries the title, date, venue, "Tickets from R150" and
 * the Quicket lockup, so nothing is overlaid on top of it — the whole band is
 * the link, with a button beneath for the people who need a button to press.
 *
 * ONLY OFFICIAL ARTWORK IS USED ON THIS PAGE. The generated motif and still
 * images that shipped with the design handoff have been removed: they were not
 * crops of the commissioned poster, they were separate synthetic images, and
 * passing them off as documentary stills on a page about a documentary is not
 * defensible. The poster and this banner are the only picture assets, plus the
 * three session glyphs lifted from the poster's own icon row.
 */
export const CtaBand = ({
  from,
  headline,
  sub,
  className,
}: {
  /** Analytics label — which band on the page was clicked. */
  from: string;
  headline?: string;
  sub?: string;
  className?: string;
}) => {
  const track = () => {
    const w = window as any;
    const ev = EVENT_CONCLUDED ? "petition_cta" : "quicket_click";
    w.gtag?.("event", ev, { campaign: "stunningpigs", from });
    w.tagClarityEvent?.(ev, "stunningpigs");
  };

  /* Campaign mode: the banner artwork carries "Tickets from R150" baked into
     the image, so post-event the band drops the artwork and becomes a plain
     petition band in the same visual register. */
  if (EVENT_CONCLUDED) {
    return (
      <section className={cn("bg-wwpl-plum py-14", className)}>
        <div className="mx-auto w-full max-w-[1120px] px-5 sm:px-8">
          <Reveal className="text-center">
            {headline && (
              <h2 className="font-wwpl-display font-semibold text-[clamp(24px,4.5vw,34px)] leading-tight text-white">
                {headline}
              </h2>
            )}
            {sub && (
              <p className="mx-auto mt-3 max-w-[56ch] text-[15px] leading-relaxed text-[rgba(249,245,240,.7)]">
                {sub}
              </p>
            )}
            <BtnLink href="#petition" variant="gold" onClick={track} className="mt-7">
              Add your name to the petition
            </BtnLink>
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <section className={cn("bg-wwpl-plum py-14", className)}>
      <div className="mx-auto w-full max-w-[1120px] px-5 sm:px-8">
        <Reveal className="text-center">
          <a
            href={quicketHref()}
            target="_blank"
            rel="noopener"
            onClick={track}
            className="group block overflow-hidden rounded-2xl border border-[rgba(240,217,168,.22)] shadow-wwpl-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wwpl-gold focus-visible:ring-offset-2"
          >
            <img
              src="/events/wwpl/final-banner.webp"
              alt="Celebrating Women Who Protect Life — Monday 10 August 2026, The Masque Theatre, Muizenberg. Tickets from R150 on Quicket."
              width={1200}
              height={400}
              loading="lazy"
              decoding="async"
              className="w-full motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-wwpl group-hover:scale-[1.02]"
            />
          </a>

          {headline && (
            <h2 className="mt-8 font-wwpl-display font-semibold text-[clamp(24px,4vw,32px)] leading-tight text-white">
              {headline}
            </h2>
          )}
          {sub && (
            <p className="mx-auto mt-3 max-w-[52ch] text-[15px] leading-relaxed text-[rgba(249,245,240,.7)]">
              {sub}
            </p>
          )}

          <div className="mt-6 flex justify-center">
            <BtnLink
              href={quicketHref()}
              target="_blank"
              rel="noopener"
              onClick={track}
              variant="gold"
              className="px-8 py-3.5 text-[16px]"
            >
              Get tickets — from R150
            </BtnLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
