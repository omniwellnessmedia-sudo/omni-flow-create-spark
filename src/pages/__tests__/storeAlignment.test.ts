import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  SERVICE_ANCHORED_SECTIONS,
  anchorsFor,
  productMatchesSection,
} from '@/data/serviceAnchoredSections';
import { getOffer } from '@/data/publicRateCard';

/**
 * The store serves the services, per Chad's direction of 4 September 2026:
 * the catalogue must strengthen Omni's paid services, stay secondary to
 * service enquiries, and never create the impression that Omni is the
 * seller where it is not. These tests pin all three.
 *
 * No em dashes in this file.
 */

const read = (p: string) => readFileSync(resolve(__dirname, p), 'utf8');
const storeSrc = read('../StoreCollections.tsx');
const cardSrc = read('../../components/product/TakealotProductCard.tsx');
const sectionsSrc = read('../../data/serviceAnchoredSections.ts');
const sectionsComponentSrc = read('../../components/store/ServiceAnchoredSections.tsx');

describe('service anchored sections', () => {
  it('every anchor slug resolves to a real rate card offer', () => {
    for (const section of SERVICE_ANCHORED_SECTIONS) {
      for (const slug of section.anchorSlugs) {
        expect(getOffer(slug), `${section.id} anchors unknown slug ${slug}`).toBeTruthy();
      }
      expect(anchorsFor(section).length).toBe(section.anchorSlugs.length);
    }
  });

  it('uses the section names Feroza proposed, verbatim', () => {
    expect(SERVICE_ANCHORED_SECTIONS.map((s) => s.title)).toEqual([
      'Conscious Business & Workspace Essentials',
      'Creator & Production Essentials',
      'Digital Workspace & Tech Essentials',
    ]);
  });

  it('writes no price of its own; prices come from the rate card alone', () => {
    // Client facing prices live only in src/data/publicRateCard.ts. Neither
    // the section data nor the component may carry a rand figure.
    expect(sectionsSrc).not.toMatch(/R\s?\d/);
    expect(sectionsComponentSrc).not.toMatch(/R\s?\d[\d,]/);
    expect(sectionsComponentSrc).toContain('{offer.price}');
  });

  it('anchors point at routes that exist', () => {
    const app = read('../../App.tsx');
    expect(app).toContain('path="/services/:slug"');
    for (const section of SERVICE_ANCHORED_SECTIONS) {
      expect(app).toContain(`path="${section.serviceHref}"`);
    }
  });

  it('renders the Omni offer before any product', () => {
    // The anchor grid must appear above the supporting kit grid in source
    // order, which is what puts the service first on the page.
    const anchorAt = sectionsComponentSrc.indexOf('Omni service');
    const kitAt = sectionsComponentSrc.indexOf('Supporting kit');
    expect(anchorAt).toBeGreaterThan(-1);
    expect(kitAt).toBeGreaterThan(anchorAt);
  });

  it('matches products to sections on real keywords', () => {
    const creator = SERVICE_ANCHORED_SECTIONS[1];
    expect(productMatchesSection(creator, { category: 'Lighting', name: 'Godox kit' })).toBe(true);
    expect(productMatchesSection(creator, { category: 'Supplements', name: 'Ashwagandha' })).toBe(false);
  });
});

describe('the store never poses as the seller', () => {
  it('every product card carries seller attribution', () => {
    expect(cardSrc).toContain("You buy on the seller's own site.");
    expect(cardSrc).toContain('Sold by');
  });

  it('the storefront hero claims only what Omni can stand behind', () => {
    // These three appeared as hero badges with no basis: delivery terms
    // belong to sellers, and no certification exists.
    expect(storeSrc).not.toContain('Free SA Delivery');
    expect(storeSrc).not.toContain('Wellness Certified');
    expect(storeSrc).not.toContain('Eco-Friendly');
  });

  it('shoppers cannot sort by what Omni earns', () => {
    expect(storeSrc).not.toContain('Highest Commission');
  });
});

describe('the services lead the store', () => {
  it('the base store view renders the anchored sections', () => {
    expect(storeSrc).toContain('<ServiceAnchoredSections');
    // Collection sub pages skip them; browsing stays browsable.
    expect(storeSrc).toContain('!handle && !loading');
  });
});
