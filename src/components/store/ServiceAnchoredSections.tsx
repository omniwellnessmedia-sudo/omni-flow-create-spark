import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TakealotProductCard } from '@/components/product/TakealotProductCard';
import {
  SERVICE_ANCHORED_SECTIONS,
  anchorsFor,
  productMatchesSection,
} from '@/data/serviceAnchoredSections';

/**
 * The store's front matter: three curated sections, each led by the Omni
 * service it supports, with third party gear rendered beneath as supporting
 * kit. The service is the product; the gear is context. See
 * src/data/serviceAnchoredSections.ts for why the order is fixed this way.
 *
 * Anchor cards render the rate card's own name, price and blurb, so a price
 * change lands here without this file knowing.
 *
 * No em dashes in this file.
 */

const INK = '#15201F';
const mono = { fontFamily: '"JetBrains Mono", ui-monospace, monospace' } as const;

interface StoreProduct {
  id: string;
  name: string;
  category: string;
  image_url: string;
  price_zar: number;
  commission_rate: number;
  brand?: string;
  advertiser_name?: string;
}

const ServiceAnchoredSections = ({ products }: { products: StoreProduct[] }) => {
  return (
    <div className="space-y-12">
      {SERVICE_ANCHORED_SECTIONS.map((section) => {
        const anchors = anchorsFor(section);
        if (anchors.length === 0) return null;
        const kit = products.filter((p) => productMatchesSection(section, p)).slice(0, 4);
        const hue = anchors[0].hue;

        return (
          <section key={section.id} aria-label={section.title}>
            <p
              className="flex items-center gap-2 text-[10px] uppercase tracking-[.2em] text-muted-foreground"
              style={mono}
            >
              <span aria-hidden="true" className="h-[6px] w-[6px] rounded-full" style={{ background: hue }} />
              Built around an Omni service
            </p>
            <h2 className="mt-2 font-wwpl-display text-3xl font-medium leading-tight">
              {section.title}
            </h2>
            <p className="mt-2 max-w-[62ch] text-sm text-muted-foreground">{section.lead}</p>

            {/* The anchors: Omni's own offers, always first. */}
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {anchors.map((offer) => (
                <div
                  key={offer.slug}
                  className="flex h-full flex-col rounded-2xl border bg-white/70 p-6"
                  style={{ borderTop: `3px solid ${offer.hue}` }}
                >
                  <p
                    className="text-[10px] uppercase tracking-[.18em] text-muted-foreground"
                    style={mono}
                  >
                    Omni service
                  </p>
                  <h3 className="mt-1.5 font-wwpl-display text-[22px] font-medium leading-snug">
                    {offer.name}
                  </h3>
                  <p className="mt-1 text-lg font-semibold" style={{ color: INK }}>
                    {offer.price}
                  </p>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {offer.blurb}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link to={`/services/${offer.slug}`}>
                      <Button size="sm" className="rounded-full" style={{ background: INK, color: '#FAF8F2' }}>
                        {offer.cta}
                      </Button>
                    </Link>
                    <Link to={section.serviceHref}>
                      <Button size="sm" variant="outline" className="rounded-full">
                        About this service
                        <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Supporting kit: third party products, clearly secondary. */}
            {kit.length > 0 && (
              <>
                <p
                  className="mt-6 text-[10px] uppercase tracking-[.18em] text-muted-foreground"
                  style={mono}
                >
                  Supporting kit, sold by our partners
                </p>
                <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                  {kit.map((product) => (
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    <TakealotProductCard key={product.id} product={product as any} showQuickView={false} />
                  ))}
                </div>
              </>
            )}
          </section>
        );
      })}
    </div>
  );
};

export default ServiceAnchoredSections;
