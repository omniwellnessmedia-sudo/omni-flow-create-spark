import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { QUESTIONS, DIMENSIONS } from '@/data/scorecard';
import { INK, CREAM_2, SLATE, LINE, mono, SpectrumRule } from '@/components/services/spectrum';

/**
 * The Revenue Readiness Scorecard, offered on the home page.
 *
 * WHY IT SITS DIRECTLY AFTER THE HERO. It is the only thing on this site
 * that qualifies a visitor without costing anybody an hour. Someone who is
 * not ready to buy still tells us what they need by taking it, and someone
 * who is ready arrives at a service page already knowing which one. That
 * earns the most valuable slot on the page.
 *
 * WHY IT APPEARS ONCE. Repeating a lead magnet between every section reads
 * as a pop-up that cannot be closed, and the later placements cannibalise
 * the first rather than adding to it. One placement with real weight beats
 * three scattered ones. What belongs between the other sections is
 * evidence, not another ask.
 *
 * EVERY NUMBER HERE IS DERIVED, NOT TYPED. The question count comes from
 * the questions and the dimensions from the dimension map, so this cannot
 * promise ten questions while the scorecard asks twelve. The two minutes is
 * the one human estimate and it is deliberately generous.
 *
 * WHAT IT DOES NOT SAY. No count of people who have taken it, no average
 * score, no testimonial about it. Those would all be invented, and the
 * offer is strong enough stated plainly: a real answer, for nothing, without
 * handing over an email first.
 *
 * No em dashes in this file.
 */

const ScorecardSection = () => {
  const dimensions = Object.values(DIMENSIONS);

  return (
    <section
      aria-labelledby="scorecard-heading"
      className="relative overflow-hidden"
      style={{ background: CREAM_2 }}
    >
      <div className="mx-auto max-w-[1180px] px-5 py-16 sm:px-8 sm:py-20">
        <div className="overflow-hidden rounded-[26px]" style={{ background: INK }}>
          <SpectrumRule />
          <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            <div>
              <p
                className="text-[11px] uppercase tracking-[.22em]"
                style={{ ...mono, color: 'rgba(246,241,232,.6)' }}
              >
                Free · No email required
              </p>
              <h2
                id="scorecard-heading"
                className="mt-4 max-w-[20ch] font-wwpl-display text-[clamp(30px,4.4vw,46px)] font-medium leading-[1.08]"
                style={{ color: '#FAF8F2' }}
              >
                Find out what is costing you revenue.
              </h2>
              <p
                className="mt-5 max-w-[54ch] text-[16.5px] leading-relaxed"
                style={{ color: 'rgba(246,241,232,.78)' }}
              >
                {QUESTIONS.length} questions about your offer, your website, your content, your route
                to payment and how you measure any of it. You get your result on the screen
                immediately, with the weakest area named and what to do about it.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  to="/scorecard"
                  className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[15px] font-medium transition-transform hover:scale-[1.02]"
                  style={{ background: '#F7F3EA', color: INK }}
                >
                  Take the scorecard
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <span className="text-[13.5px]" style={{ color: 'rgba(246,241,232,.6)' }}>
                  About two minutes
                </span>
              </div>
            </div>

            {/* What it scores. Derived from the dimension map, so the list
                cannot drift from the questions actually asked. */}
            <ul className="grid gap-3">
              {dimensions.map((d) => (
                <li
                  key={d.label}
                  className="flex items-start gap-3.5 rounded-2xl p-4"
                  style={{ background: 'rgba(246,241,232,.06)' }}
                >
                  <span
                    aria-hidden="true"
                    className="mt-[7px] h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: d.hue }}
                  />
                  <span className="min-w-0">
                    <span className="block text-[15px] font-medium" style={{ color: '#FAF8F2' }}>
                      {d.label}
                    </span>
                    <span
                      className="mt-0.5 block text-[13.5px] leading-snug"
                      style={{ color: 'rgba(246,241,232,.66)' }}
                    >
                      {d.blurb}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-5 text-center text-[13px]" style={{ color: SLATE }}>
          Not ready for that?{' '}
          <Link
            to="/services"
            className="underline underline-offset-4"
            style={{ color: INK, borderColor: LINE }}
          >
            Browse all services and rates
          </Link>{' '}
          instead.
        </p>
      </div>
    </section>
  );
};

export default ScorecardSection;
