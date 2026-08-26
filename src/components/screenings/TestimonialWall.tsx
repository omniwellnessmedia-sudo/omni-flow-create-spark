import { TESTIMONIALS } from "@/data/testimonials";
import { isPublishable } from "@/lib/testimonialGate";

/**
 * Consent-gated testimonial wall for /screenings.
 *
 * Every record renders through isPublishable (src/lib/testimonialGate.ts).
 * When zero records survive the gate, this component returns null: no empty
 * state, no coming-soon card, the section simply does not exist in the DOM.
 *
 * Anonymous records render the static attribution "Attendee, August 2026",
 * written here as a literal rather than read from data so it cannot drift
 * into carrying a name. Attributed records follow attributionMode.
 *
 * Commercial page rules: theme accent #339999, no star ratings, no invented
 * review counts, no Dr Phil-afel Foundation branding, donation links or
 * Section 18A language here or in anything this file imports.
 * No em dashes in this file.
 */

const ACCENT = "#339999";

/* Attribution is deliberately the static literal "Attendee, August 2026"
 * in the markup below, per the governance direction of 26 August 2026:
 * rendering it from a data field could drift into carrying a name. When
 * the first record with written attributed consent arrives, attributed
 * rendering (full_name, first_name, initials per attributionMode) gets
 * reintroduced alongside, never replacing, this rule for anonymous
 * records. */

const TestimonialWall = () => {
  const published = TESTIMONIALS.filter(isPublishable);
  if (published.length === 0) return null;

  return (
    <section
      aria-labelledby="testimonial-wall-heading"
      className="border-b border-wwpl-line bg-white py-16"
    >
      <div className="mx-auto max-w-5xl px-5">
        <div className="text-center">
          <h2
            id="testimonial-wall-heading"
            className="font-wwpl-display text-[clamp(24px,4vw,32px)] font-semibold text-wwpl-ink"
          >
            What attendees said
          </h2>
          <p className="mx-auto mt-2 max-w-[58ch] text-[13.5px] text-wwpl-slate">
            Names withheld pending permission. Attributed versions will replace these as
            consent is confirmed.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {published.map((t) => (
            <figure
              key={t.id}
              className="relative flex h-full flex-col overflow-hidden rounded-[16px] border border-wwpl-line bg-wwpl-cream/40 p-6"
            >
              <span
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-[3px]"
                style={{ background: ACCENT }}
              />
              <blockquote className="flex-1 text-[15.5px] leading-relaxed text-wwpl-ink">
                "{t.quotePublished}"
              </blockquote>
              <figcaption className="mt-4">
                <cite className="text-[13px] not-italic" style={{ color: ACCENT }}>
                  Attendee, August 2026
                </cite>
              </figcaption>
            </figure>
          ))}
        </div>

        <p className="mt-8 text-center text-[12.5px] text-wwpl-slate">
          If you recognise your words here and would prefer them removed, email
          [CONTACT_EMAIL_PLACEHOLDER] and they will come down.
        </p>
      </div>
    </section>
  );
};

export default TestimonialWall;
