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
  images: string[];
}

/**
 * Site-wide fallback social image. og:image must never be written as an empty
 * string: an empty tag makes scrapers show no image at all, where absence at
 * least lets some fall back to a page image. Pages that navigate from a page
 * WITH an image to one without would otherwise leak the first page's image,
 * so the fallback is applied unconditionally instead of leaving stale values.
 */
export const DEFAULT_SOCIAL_IMAGE =
  'https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/omni-favicons/android-chrome-512x512.png';

/**
 * Toggle <meta name="robots" content="noindex, nofollow"> for the current
 * document. Written and removed explicitly because the tag must not survive a
 * client-side navigation from an admin surface to a public page.
 */
export const setRobotsNoindex = (noindex: boolean) => {
  let tag = document.querySelector('meta[name="robots"]');
  if (noindex) {
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('name', 'robots');
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', 'noindex, nofollow');
  } else if (tag) {
    tag.remove();
  }
};

export const updateMetaTags = (metadata: SEOMetadata) => {
  // Update title
  document.title = metadata.title;

  const socialImage = metadata.image || DEFAULT_SOCIAL_IMAGE;

  // Update or create meta tags
  const metaTags = [
    { name: 'description', content: metadata.description },
    { property: 'og:title', content: metadata.title },
    { property: 'og:description', content: metadata.description },
    { property: 'og:type', content: metadata.type || 'website' },
    { property: 'og:url', content: metadata.url || metadata.canonical || window.location.href },
    { property: 'og:site_name', content: 'Omni Wellness Media' },
    { property: 'og:locale', content: 'en_ZA' },
    { property: 'og:image', content: socialImage },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: metadata.title },
    { name: 'twitter:description', content: metadata.description },
    { name: 'twitter:image', content: socialImage },
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
      url: 'https://omni-wellness.com',
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

  if (data.rating && data.reviewCount) {
    jsonLD['aggregateRating'] = {
      '@type': 'AggregateRating',
      ratingValue: data.rating.toString(),
      reviewCount: data.reviewCount.toString(),
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
