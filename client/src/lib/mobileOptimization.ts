/**
 * Mobile Optimization Utilities
 * 
 * This file contains utilities to enhance mobile SEO and performance
 * of the GodivaTech website, improving Core Web Vitals and mobile experience.
 */

/**
 * Interface for mobile-optimized metadata
 */
export interface MobileMetadata {
  mobileAlternate?: string;
  ampUrl?: string;
  mobileAppUrls?: {
    ios?: string;
    android?: string;
    windows?: string;
  };
  pageSpeed?: {
    desktopScore: number;
    mobileScore: number;
    fcp: string; // First Contentful Paint
    lcp: string; // Largest Contentful Paint
    fid: string; // First Input Delay
    cls: string; // Cumulative Layout Shift
  };
}

/**
 * Creates mobile-specific structured data for better mobile search results
 * 
 * @param pageUrl The canonical URL of the page
 * @param pageTitle The title of the page
 * @param appData Mobile app related data
 * @param categoryName Category of the content (optional)
 * @returns JSON-LD structured data for SoftwareApplication
 */
export const createMobileAppStructuredData = (
  pageUrl: string,
  pageTitle: string,
  appData: {
    name: string;
    description: string;
    appId?: string;
    platform?: 'iOS' | 'Android' | 'Web';
    version?: string;
    rating?: number;
    reviews?: number;
  },
  categoryName?: string
) => {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": appData.name,
    "description": appData.description,
    "applicationCategory": categoryName || "BusinessApplication",
    "operatingSystem": appData.platform || "Web",
    "url": pageUrl,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    },
    "aggregateRating": appData.rating ? {
      "@type": "AggregateRating",
      "ratingValue": appData.rating.toString(),
      "reviewCount": appData.reviews?.toString() || "10"
    } : undefined,
    "author": {
      "@type": "Organization",
      "name": "GodivaTech",
      "url": "https://godivatech.com/"
    },
    "sameAs": [
      "https://www.facebook.com/godivatech",
      "https://twitter.com/godivatech",
      "https://www.instagram.com/godivatech/"
    ]
  };
};

/**
 * Creates FAQPage structured data specifically formatted for mobile display
 * 
 * @param questions Array of questions and answers
 * @returns JSON-LD structured data for FAQPage
 */
export const createMobileFAQStructuredData = (
  questions: Array<{ question: string; answer: string }>
) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": questions.map(q => ({
      "@type": "Question",
      "name": q.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": q.answer
      }
    }))
  };
};

/**
 * Creates mobile-specific breadcrumb structured data optimized for mobile SERPs
 * 
 * @param items Array of breadcrumb items with name and url
 * @param cityName City for local SEO enhancement
 * @returns JSON-LD structured data for BreadcrumbList
 */
export const createMobileBreadcrumbStructuredData = (
  items: Array<{ name: string; url: string }>,
  cityName: string = 'Madurai'
) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name.includes(cityName) ? item.name : `${item.name} in ${cityName}`,
      "item": item.url
    }))
  };
};

/**
 * Optimizes image metadata for mobile-first indexing
 * 
 * @param image Image URL
 * @param alt Alt text for the image
 * @param width Width of the image
 * @param height Height of the image
 * @returns JSON-LD structured data for ImageObject
 */
export const createMobileImageStructuredData = (
  image: string,
  alt: string,
  width: number = 1200,
  height: number = 630
) => {
  return {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "contentUrl": image,
    "description": alt,
    "name": alt,
    "height": height,
    "width": width,
    "encodingFormat": image.toLowerCase().endsWith('png') ? "image/png" : "image/jpeg",
    "about": {
      "@type": "Thing",
      "name": alt,
      "description": alt
    }
  };
};

/**
 * Generates mobile-specific service schema with neighborhood targeting
 * 
 * @param serviceData Service information
 * @param pageUrl Canonical URL of the service page
 * @returns JSON-LD structured data for Service
 */
export const createMobileServiceStructuredData = (
  serviceData: {
    name: string;
    description: string;
    category?: string;
    image?: string;
    provider?: string;
    neighborhood?: string;
    cityName?: string;
  },
  pageUrl: string
) => {
  const cityName = serviceData.cityName || "Madurai";
  const neighborhood = serviceData.neighborhood || "Anna Nagar";
  
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": serviceData.name,
    "description": serviceData.description,
    "provider": {
      "@type": "Organization",
      "name": serviceData.provider || "GodivaTech",
      "url": "https://godivatech.com",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": cityName,
        "addressRegion": "Tamil Nadu",
        "postalCode": "625020",
        "streetAddress": neighborhood,
        "addressCountry": "IN"
      }
    },
    "areaServed": {
      "@type": "City",
      "name": cityName,
      "containsPlace": {
        "@type": "Neighborhood",
        "name": neighborhood
      }
    },
    "serviceType": serviceData.category || "Technology Services",
    "url": pageUrl,
    "image": serviceData.image || "https://godivatech.com/images/services-overview.jpg"
  };
};

/**
 * Generates mobile-optimized image srcset attribute data
 * 
 * @param baseUrl Base image URL (without size parameters)
 * @param alt Image alt text
 * @returns Object with srcset and sizes attributes
 */
export const getMobileImageSrcSet = (
  baseUrl: string,
  alt: string
) => {
  // If using Cloudinary
  if (baseUrl.includes('cloudinary.com') && baseUrl.includes('upload')) {
    const widths = [320, 480, 640, 768, 1024, 1280];
    
    // Create srcset with Cloudinary transformations
    const srcset = widths.map(width => {
      const transformedUrl = baseUrl.replace('/upload/', `/upload/w_${width},q_auto,f_auto/`);
      return `${transformedUrl} ${width}w`;
    }).join(',');
    
    return {
      srcset,
      sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
      alt
    };
  }
  
  // For regular images
  return {
    srcset: `${baseUrl} 1x, ${baseUrl} 2x`,
    sizes: "100vw",
    alt
  };
};

/**
 * Gets service-specific Core Web Vitals scores for reporting
 * 
 * @param serviceName Name of the service
 * @returns Object with Core Web Vitals metrics
 */
export const getCoreWebVitalsForService = (serviceName: string) => {
  // These would normally come from an analytics API
  // Using static values for demonstration
  const defaultMetrics = {
    desktopScore: 92,
    mobileScore: 85,
    fcp: "1.2s",
    lcp: "2.4s",
    fid: "70ms",
    cls: "0.08"
  };
  
  // Service-specific optimizations could be added here
  const serviceSpecificMetrics: Record<string, any> = {
    "Web Design & Development": {
      desktopScore: 95,
      mobileScore: 90,
      fcp: "0.9s",
      lcp: "2.1s", 
      fid: "50ms",
      cls: "0.05"
    },
    "Digital Marketing": {
      desktopScore: 94,
      mobileScore: 88,
      fcp: "1.0s",
      lcp: "2.2s",
      fid: "60ms",
      cls: "0.06"
    }
  };
  
  return serviceSpecificMetrics[serviceName] || defaultMetrics;
};