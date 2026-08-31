import { useEffect } from 'react';

export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  /**
   * Absolute canonical URL for this page, on the APEX host (netlify.toml 301s
   * www -> apex). Omit only if the page genuinely should inherit the
   * homepage canonical from index.html — which is almost never what you want,
   * because inheriting it tells Google to fold this page's signals into "/".
   */
  canonical?: string;
}

export interface TourSEOData extends SEOMetadata {
  tourName: string;
  price: number;
  currency: string;
  location: string;
  duration: string;
  rating?: number;
  reviewCount?: number;
  /** Where the reviews can be inspected. Without this, no rating is published. */
  reviewSource?: string;
  images: string[];
}

export const updateMetaTags = (metadata: SEOMetadata) => {
  // Update title
  document.title = metadata.title;

  // Update or create meta tags
  const metaTags = [
    { name: 'description', content: metadata.description },
    { property: 'og:title', content: metadata.title },
    { property: 'og:description', content: metadata.description },
    { property: 'og:type', content: metadata.type || 'website' },
    { property: 'og:url', content: metadata.url || window.location.href },
    { property: 'og:image', content: metadata.image || '' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: metadata.title },
    { name: 'twitter:description', content: metadata.description },
    { name: 'twitter:image', content: metadata.image || '' },
  ];

  if (metadata.keywords && metadata.keywords.length > 0) {
    metaTags.push({ name: 'keywords', content: metadata.keywords.join(', ') });
  }

  if (metadata.author) {
    metaTags.push({ name: 'author', content: metadata.author });
  }

  if (metadata.publishedTime) {
    metaTags.push({ property: 'article:published_time', content: metadata.publishedTime });
  }

  if (metadata.modifiedTime) {
    metaTags.push({ property: 'article:modified_time', content: metadata.modifiedTime });
  }

  metaTags.forEach(({ name, property, content }) => {
    const selector = name ? `meta[name="${name}"]` : `meta[property="${property}"]`;
    let element = document.querySelector(selector);

    if (!element) {
      element = document.createElement('meta');
      if (name) element.setAttribute('name', name);
      if (property) element.setAttribute('property', property);
      document.head.appendChild(element);
    }

    element.setAttribute('content', content);
  });

  // Canonical is a <link>, not a <meta>, so it needs its own branch. index.html
  // ships a default pointing at the homepage; without this every route would
  // keep declaring itself to be "/".
  //
  // Written UNCONDITIONALLY. Setting it only when `canonical` was supplied
  // meant the value leaked across client-side navigation: leaving a page that
  // sets one for a page that does not left the second page declaring the
  // first page's URL as its canonical — the same bug, inverted.
  const canonicalHref = metadata.canonical || metadata.url || window.location.href;
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', canonicalHref);
};

export const generateTourJSONLD = (data: TourSEOData) => {
  const jsonLD = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: data.tourName,
    description: data.description,
    image: data.images,
    url: data.url || window.location.href,
    offers: {
      '@type': 'Offer',
      price: data.price.toString(),
      priceCurrency: data.currency,
      availability: 'https://schema.org/InStock',
      url: data.url || window.location.href,
    },
    provider: {
      '@type': 'Organization',
      name: 'Omni Wellness Media',
      // The apex domain the site actually lives on. This previously said
      // omni-wellness.com, a domain we do not hold.
      url: 'https://omniwellnessmedia.co.za',
    },
    touristType: 'Wellness travelers',
    itinerary: {
      '@type': 'ItemList',
      name: `${data.tourName} Itinerary`,
    },
  };

  if (data.location) {
    jsonLD['touristDestination'] = {
      '@type': 'Place',
      name: data.location,
    };
  }

  // aggregateRating is emitted ONLY when the caller also names where the
  // reviews live. Until 30 August 2026 the three tour pages passed invented
  // figures here (5.0/47, 4.9/127, 4.8/38) with no review source anywhere in
  // the codebase, publishing fabricated review markup to search engines.
  // That is a Google structured data policy violation that can draw a manual
  // action against the whole domain, and one of those counts collided with a
  // number this project explicitly bans. A rating without a reviewSource is
  // now dropped rather than published.
  if (data.rating && data.reviewCount && data.reviewSource) {
    jsonLD['aggregateRating'] = {
      '@type': 'AggregateRating',
      ratingValue: data.rating.toString(),
      reviewCount: data.reviewCount.toString(),
      url: data.reviewSource,
    };
  }

  return jsonLD;
};

/**
 * Inject a JSON-LD block. `id` scopes the <script> element so different page
 * types can each own one without clobbering each other — it used to be
 * hardcoded to 'tour-jsonld', which meant any second consumer would silently
 * replace the tour markup.
 */
export const injectJSONLD = (jsonLD: object, id = 'tour-jsonld') => {
  document.getElementById(id)?.remove();

  const script = document.createElement('script');
  script.id = id;
  script.type = 'application/ld+json';
  script.text = JSON.stringify(jsonLD);
  document.head.appendChild(script);
};

export const useSEO = (metadata: SEOMetadata) => {
  useEffect(() => {
    updateMetaTags(metadata);
    
    return () => {
      // Cleanup: reset to default
      document.title = 'Omni Wellness Media';
    };
  }, [metadata.title, metadata.description]);
};

export const useTourSEO = (tourData: TourSEOData) => {
  useEffect(() => {
    updateMetaTags(tourData);
    
    const jsonLD = generateTourJSONLD(tourData);
    injectJSONLD(jsonLD);
    
    return () => {
      const script = document.getElementById('tour-jsonld');
      if (script) script.remove();
    };
  }, [tourData.tourName, tourData.price]);
};
