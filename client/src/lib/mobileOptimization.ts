/**
 * Mobile Optimization Utilities
 * 
 * This file contains utilities to enhance mobile SEO and performance
 * of the GodivaTech website, improving Core Web Vitals and mobile experience.
 */

import { locationKeywords } from './seoKeywords';

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
    iosAppId?: string;
    androidAppId?: string;
    appDescription?: string;
    appName?: string;
    appRating?: number;
    appReviews?: number;
    appPrice?: string;
    appCurrency?: string;
  },
  categoryName?: string
) => {
  const { 
    iosAppId, 
    androidAppId, 
    appDescription = 'GodivaTech Mobile App offers convenient access to our services and portfolio.',
    appName = 'GodivaTech',
    appRating = 4.7,
    appReviews = 128,
    appPrice = '0',
    appCurrency = 'INR'
  } = appData;

  const baseData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": appName,
    "applicationCategory": categoryName || "BusinessApplication",
    "operatingSystem": "iOS, Android",
    "description": appDescription,
    "offers": {
      "@type": "Offer",
      "price": appPrice,
      "priceCurrency": appCurrency
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": appRating.toString(),
      "ratingCount": appReviews.toString()
    },
    "url": pageUrl
  };

  // Add platform-specific data
  const appData2: Record<string, any> = { ...baseData };
  
  if (iosAppId) {
    appData2.downloadUrl = `https://apps.apple.com/app/id${iosAppId}`;
  }
  
  if (androidAppId) {
    appData2.downloadUrl = `https://play.google.com/store/apps/details?id=${androidAppId}`;
  }

  return appData2;
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
    "mainEntity": questions.map((q) => ({
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
  cityName = 'Madurai'
) => {
  // For mobile, enhance breadcrumbs with local neighborhood data
  const enhancedItems = items.map((item, index) => {
    let name = item.name;
    
    // For service pages, enhance with neighborhood data
    if (
      index > 0 && 
      ["Web Development", "App Development", "Digital Marketing", "SEO", "Branding"].includes(name)
    ) {
      // Map services to neighborhoods
      const serviceMap: Record<string, string[]> = {
        "Web Development": locationKeywords.neighborhoods.webDevelopment,
        "App Development": locationKeywords.neighborhoods.mobileApp,
        "Digital Marketing": locationKeywords.neighborhoods.digitalMarketing,
        "SEO": locationKeywords.neighborhoods.digitalMarketing,
        "Branding": locationKeywords.neighborhoods.branding
      };
      
      const neighborhoods = serviceMap[name] || [];
      if (neighborhoods.length > 0) {
        // Use the first neighborhood for this service
        name = `${name} in ${neighborhoods[0]}, ${cityName}`;
      }
    }
    
    return {
      "@type": "ListItem",
      "position": index + 1,
      "name": name,
      "item": item.url
    };
  });

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": enhancedItems
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
  // Mobile-first indexing prefers WebP format
  const imageUrl = image.includes('cloudinary') && !image.includes('f_webp') 
    ? `${image.replace('/upload/', '/upload/f_webp,q_auto,w_')}`
    : image;

  return {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "contentUrl": imageUrl,
    "description": alt,
    "width": width.toString(),
    "height": height.toString(),
    "representativeOfPage": true, // Indicates this is a primary image
    "caption": alt
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
    category: string;
    image?: string;
  },
  pageUrl: string
) => {
  // Map service to neighborhood for local targeting
  const serviceMap: Record<string, string[]> = {
    "Web Development": locationKeywords.neighborhoods.webDevelopment,
    "Mobile App Development": locationKeywords.neighborhoods.mobileApp,
    "Digital Marketing": locationKeywords.neighborhoods.digitalMarketing,
    "SEO": locationKeywords.neighborhoods.digitalMarketing,
    "Branding": locationKeywords.neighborhoods.branding,
    "Software Development": locationKeywords.neighborhoods.software
  };
  
  const neighborhoods = serviceMap[serviceData.name] || [];
  const areaServed = neighborhoods.length > 0 
    ? neighborhoods.map(n => `${n}, Madurai`) 
    : ["Madurai, Tamil Nadu"];

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": serviceData.name,
    "description": serviceData.description,
    "provider": {
      "@type": "LocalBusiness",
      "name": "GodivaTech",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Madurai",
        "addressRegion": "Tamil Nadu",
        "addressCountry": "India"
      }
    },
    "areaServed": areaServed,
    "serviceType": serviceData.category,
    "url": pageUrl,
    "image": serviceData.image || "https://godivatech.com/images/service-default.jpg"
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
  widths = [375, 640, 768, 1024, 1280]
) => {
  // For Cloudinary images, create a proper srcset
  if (baseUrl.includes('cloudinary')) {
    const basePath = baseUrl.split('/upload/')[0] + '/upload/';
    const imagePath = baseUrl.split('/upload/')[1];
    
    const srcset = widths
      .map(width => `${basePath}w_${width},q_auto,f_auto/${imagePath} ${width}w`)
      .join(', ');
      
    const sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
    
    return { srcset, sizes };
  }
  
  // For regular images, use a simpler approach
  return {
    srcset: `${baseUrl} 1200w`,
    sizes: '100vw'
  };
};

/**
 * Gets service-specific Core Web Vitals scores for reporting
 * 
 * @param serviceName Name of the service
 * @returns Object with Core Web Vitals metrics
 */
export const getCoreWebVitalsForService = (serviceName: string) => {
  // These would typically be pulled from a monitoring service
  // For now, using placeholder values based on service
  const webVitalsMap: Record<string, any> = {
    "Web Development": {
      desktopScore: 95,
      mobileScore: 88,
      fcp: "1.2s",
      lcp: "2.1s",
      fid: "50ms",
      cls: "0.05"
    },
    "Mobile App Development": {
      desktopScore: 92,
      mobileScore: 85,
      fcp: "1.5s",
      lcp: "2.3s",
      fid: "70ms",
      cls: "0.08"
    },
    "Digital Marketing": {
      desktopScore: 97,
      mobileScore: 90,
      fcp: "1.0s",
      lcp: "1.8s",
      fid: "40ms",
      cls: "0.03"
    },
    "default": {
      desktopScore: 94,
      mobileScore: 87,
      fcp: "1.3s",
      lcp: "2.2s",
      fid: "60ms",
      cls: "0.06"
    }
  };
  
  return webVitalsMap[serviceName] || webVitalsMap["default"];
};