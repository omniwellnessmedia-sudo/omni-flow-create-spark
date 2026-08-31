import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Users, ArrowRight, Check, X } from 'lucide-react';
import {
  walkBySlug,
  otherWalks,
  WALK_INCLUSIONS,
  WALK_NOT_INCLUDED,
  WALK_LUNCH,
  WALK_PRICING_TIERS,
  WALK_PRICING_NOTES,
  CAPE_POINT_NOTE,
} from '@/data/indigenousWalks';

/**
 * Shared sections for the three Indigenous walk pages.
 *
 * The operator's own platform keeps this content in shared components so its
 * pages cannot drift apart. These components twin that architecture here:
 * the three Omni pages render the same inclusions, the same lunch package,
 * the same suite pricing and the same series navigation from one source,
 * src/data/indigenousWalks.ts, where every word is mirrored from the
 * operator's repository.
 *
 * No em dashes in this file.
 */

/** The operator's About This Walk paragraphs, verbatim. */
export const WalkAbout = ({ slug }: { slug: string }) => {
  const walk = walkBySlug(slug);
  if (!walk) return null;
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl mb-6 text-center">About This Walk</h2>
          <Card>
            <CardContent className="space-y-4 p-8">
              {walk.about.map((p) => (
                <p key={p.slice(0, 40)} className="text-[15px] leading-relaxed text-muted-foreground">
                  {p}
                </p>
              ))}
            </CardContent>
          </Card>

          <Card className="mt-6 bg-[#15201F] text-white">
            <CardContent className="p-8">
              <h3 className="font-heading text-2xl mb-4">Start &amp; End Point</h3>
              <p className="flex items-start gap-3 text-white/70">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#C9B68E]" />
                <span>
                  <strong className="text-white">{walk.startPoint}</strong>
                  <br />
                  <span className="text-sm">{walk.startPointNote}</span>
                </span>
              </p>
              <p className="mt-4 text-sm italic text-white/50">Timing: {walk.timingNote}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

/** Inclusions, not-included and the optional lunch package. One source. */
export const WalkIncluded = () => (
  <section className="py-16 bg-background">
    <div className="container mx-auto px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-heading text-3xl mb-3 text-center">What's Included</h2>
        <p className="mx-auto mb-8 max-w-[64ch] text-center text-sm text-muted-foreground">
          Included on all three Indigenous walks, whichever journey you choose.
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {WALK_INCLUSIONS.map((item) => (
            <Card key={item.title} className="text-center transition-shadow hover:shadow-lg">
              <CardContent className="pt-6">
                <Check className="mx-auto mb-3 h-7 w-7 text-primary" />
                <h3 className="mb-2 font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-10 rounded-lg bg-muted/50 p-6">
          <h3 className="mb-3 font-semibold">Please Note, Not Included</h3>
          <ul className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
            {WALK_NOT_INCLUDED.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <X className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* The operator's optional lunch package, in full. This is the
            wellness layer at its most literal: the menu is plant forward and
            it is the operator's own offer, word for word. */}
        <Card className="mt-8 border-primary/20">
          <CardHeader>
            <CardTitle className="text-xl">
              Optional Lunch Package <span className="text-primary">{WALK_LUNCH.price}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">{WALK_LUNCH.intro}</p>
            <div className="grid gap-6 text-sm sm:grid-cols-2">
              <div>
                <p className="mb-2 font-semibold">{WALK_LUNCH.veganWraps.heading}</p>
                <ul className="space-y-1 text-muted-foreground">
                  {WALK_LUNCH.veganWraps.items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-1 font-semibold">{WALK_LUNCH.sandwiches.heading}</p>
                <p className="mb-2 text-xs text-muted-foreground">{WALK_LUNCH.sandwiches.note}</p>
                <ul className="space-y-1 text-muted-foreground">
                  {WALK_LUNCH.sandwiches.items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
                <p className="mb-1 mt-3 font-semibold">{WALK_LUNCH.juices.heading}</p>
                <ul className="space-y-1 text-muted-foreground">
                  {WALK_LUNCH.juices.items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="mt-4 text-xs italic text-muted-foreground">{WALK_LUNCH.footnote}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  </section>
);

/**
 * Suite pricing, with the framing the tiers are meaningless without.
 * The tiers price ALL THREE walks together, per the operator, and until
 * 30 August 2026 the Omni pages presented them as single walk prices.
 */
export const WalkPricing = () => (
  <div>
    <h2 className="font-heading text-3xl mb-3 text-center">Pricing</h2>
    <p className="mx-auto mb-1 max-w-[62ch] text-center text-sm text-muted-foreground">
      {WALK_PRICING_NOTES.suite}
    </p>
    <p className="mx-auto mb-8 max-w-[62ch] text-center text-sm italic text-muted-foreground">
      {WALK_PRICING_NOTES.individual}
    </p>
    <div className="grid gap-6 sm:grid-cols-3">
      {WALK_PRICING_TIERS.map((tier) => (
        <Card
          key={tier.range}
          className={`text-center transition-shadow hover:shadow-xl ${'popular' in tier && tier.popular ? 'border-primary ring-2 ring-primary/20' : ''}`}
        >
          <CardHeader>
            {'popular' in tier && tier.popular && <Badge className="mx-auto mb-2">Most Popular</Badge>}
            {'bestValue' in tier && tier.bestValue && (
              <Badge variant="secondary" className="mx-auto mb-2">
                Best Value
              </Badge>
            )}
            <Users className="mx-auto mb-2 h-8 w-8 text-primary" />
            <CardTitle className="text-xl">{tier.range}</CardTitle>
            <p className="text-sm text-muted-foreground">{tier.label}</p>
          </CardHeader>
          <CardContent>
            <div className="mb-1 text-3xl font-bold text-primary">{tier.price}</div>
            <p className="text-sm text-muted-foreground">per person, all three walks</p>
            <p className="mt-2 text-xs text-muted-foreground">{tier.desc}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

/** Series navigation: this walk's place in the suite, and the other two. */
export const WalkSeriesNav = ({ slug }: { slug: string }) => {
  const walk = walkBySlug(slug);
  if (!walk) return null;
  const others = otherWalks(slug);
  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-[11px] uppercase tracking-[.2em] text-muted-foreground">
            Indigenous Walk {walk.number} of 3
          </p>
          <h2 className="mt-2 text-center font-heading text-2xl">Continue the journey</h2>
          <p className="mx-auto mt-2 max-w-[60ch] text-center text-sm text-muted-foreground">
            The suite rate covers all three walks. Most guests walk them as a series.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {others.map((w) => (
              <Link key={w.slug} to={w.href} className="group">
                <Card className="h-full transition-colors hover:border-foreground/20">
                  <CardContent className="py-5">
                    <p className="text-[11px] uppercase tracking-[.15em] text-muted-foreground">
                      Walk {w.number} of 3 · {w.duration} · {w.difficulty}
                    </p>
                    <p className="mt-1.5 text-[16px] font-medium">{w.title}</p>
                    <span className="mt-2 inline-flex items-center gap-1.5 text-sm">
                      See this walk
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <div className="mt-6 rounded-xl border border-dashed p-5 text-center">
            <p className="text-sm text-muted-foreground">{CAPE_POINT_NOTE}</p>
            <Link to="/contact?service=cape-point-private" className="mt-3 inline-block">
              <Button variant="outline" size="sm">
                Enquire about Cape Point
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
