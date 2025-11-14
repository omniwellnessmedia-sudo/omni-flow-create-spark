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

export const injectJSONLD = (jsonLD: object) => {
  const existingScript = document.getElementById('tour-jsonld');
  if (existingScript) {
    existingScript.remove();
  }

  const script = document.createElement('script');
  script.id = 'tour-jsonld';
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
