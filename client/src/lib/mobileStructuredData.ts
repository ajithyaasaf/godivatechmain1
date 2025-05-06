/**
 * Mobile Structured Data Utilities
 * 
 * Specialized structured data optimizations for mobile devices
 * Enhances mobile search appearance with mobile-specific metadata
 */

import { 
  getOrganizationData, 
  getServiceData, 
  getBlogPostData,
  getWebPageData,
  getBreadcrumbData 
} from './structuredData';

// Enhance WebPage schema with mobile-specific attributes
export const getMobileWebPageData = (title: string, description: string, url: string) => {
  const baseData = getWebPageData(title, description, url);
  
  return {
    ...baseData,
    speakable: {
      "@type": "SpeakableSpecification",
      "cssSelector": [
        ".speakable-headline", 
        ".speakable-summary"
      ]
    },
    // Add mobile web app capability information for better mobile display
    "potentialAction": {
      "@type": "ViewAction",
      "target": [
        url,
        {
          "@type": "EntryPoint",
          "urlTemplate": "android-app://com.godivatech.app/https/godivatech.com" + url.replace('https://godivatech.com', '')
        }
      ]
    },
    // Mobile-specific accessibility feature annotation
    "accessibilityFeature": [
      "highContrast/cssAccessible",
      "largePrint/cssAccessible",
      "resizeText/cssAccessible",
      "displayTransformability",
      "longDescription",
      "alternativeText",
      "fullKeyboardControl",
      "readingOrder"
    ],
    // Mobile browser compatibility
    "browserRequirements": "Requires JavaScript. Requires HTML5."
  };
};

// Enhanced service data for mobile users with special mobile features
export const getMobileServiceData = (
  name: string,
  description: string,
  url: string,
  image?: string
) => {
  const baseServiceData = getServiceData(name, description, url, image);
  
  return {
    ...baseServiceData,
    // Indicate availability of mobile-specific features
    "availableOnDevice": [
      "Android",
      "iOS",
      "Mobile"
    ],
    // Add special offers for mobile users
    "hasOfferCatalog": {
      ...baseServiceData.hasOfferCatalog,
      "name": `Mobile-optimized ${name} services in Madurai`,
      "description": `Best ${name} services in Madurai optimized for mobile users at affordable prices`,
    },
    // Add accessibility considerations for mobile
    "accessMode": ["visual", "textual", "tactile"],
    "accessModeSufficient": ["visual", "textual"],
    "accessibilityAPI": ["ARIA"],
    "accessibilityControl": ["fullKeyboardControl", "fullTouchControl"],
    "serviceOutput": "Fully responsive solution optimized for mobile users"
  };
};

// Enhanced mobile-specific blog post data
export const getMobileBlogPostData = (
  title: string,
  description: string,
  url: string,
  imageUrl: string,
  datePublished: string,
  dateModified: string,
  authorName: string,
  authorImage?: string
) => {
  const baseBlogData = getBlogPostData(
    title, description, url, imageUrl, 
    datePublished, dateModified, authorName, authorImage
  );
  
  return {
    ...baseBlogData,
    // Add WordCount for mobile article rendering optimization
    "wordCount": description.split(/\s+/).length + title.split(/\s+/).length,
    // Add reading time estimate for mobile readers
    "timeRequired": `PT${Math.ceil((description.split(/\s+/).length + title.split(/\s+/).length) / 250 * 60)}S`,
    // Mobile app association
    "potentialAction": {
      "@type": "ViewAction",
      "target": [
        url,
        {
          "@type": "EntryPoint",
          "urlTemplate": "android-app://com.godivatech.app/https/godivatech.com" + url.replace('https://godivatech.com', '')
        }
      ]
    },
    // Enhanced speakable property for voice search on mobile
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": [
        "h1", 
        ".article-excerpt",
        ".speakable-content"
      ]
    },
    // For AMP versions
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url,
      "alternativeHeadline": `Mobile guide to ${title}`,
      "specialty": "Mobile-optimized content",
    }
  };
};

// Breadcrumb data specialized for mobile
export const getMobileBreadcrumbData = (items: {name: string, item: string}[]) => {
  const baseBreadcrumb = getBreadcrumbData(items);
  return {
    ...baseBreadcrumb,
    // Add mobile specific classes for better rendering and schema interpretation
    "@id": "#mobile-breadcrumb",
    "itemListElement": baseBreadcrumb.itemListElement.map(item => ({
      ...item,
      "@type": "ListItem",
      "potentialAction": {
        "@type": "ViewAction",
        "target": item.item
      }
    }))
  };
};

// Mobile-optimized Organization data
export const getMobileOrganizationData = () => {
  const baseOrgData = getOrganizationData();
  
  return {
    ...baseOrgData,
    // Add app-specific identifiers for mobile
    "sameAs": [
      ...baseOrgData.sameAs,
      "android-app://com.godivatech.app/https/godivatech.com"
    ],
    // Mobile contact methods
    "contactPoint": [
      {
        ...baseOrgData.contactPoint,
        "contactType": "customer service",
        "contactOption": ["TollFree", "HearingImpairedSupported"],
        "availableLanguage": ["en", "ta"]
      },
      {
        "@type": "ContactPoint",
        "telephone": "+91 96005 20130",
        "contactType": "technical support",
        "areaServed": ["IN", "Madurai", "Tamil Nadu"],
        "availableLanguage": ["en", "ta"],
        "contactOption": ["HearingImpairedSupported"]
      },
      {
        "@type": "ContactPoint",
        "telephone": "+91 96005 20130",
        "contactType": "sales",
        "areaServed": ["IN", "Madurai", "Tamil Nadu"],
        "availableLanguage": ["en", "ta"],
        "contactOption": ["TollFree"]
      }
    ]
  };
};

// Mobile-optimized FAQ data
export const getMobileFaqData = (faqs: {question: string, answer: string}[], url?: string) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      },
      // Add mobile-specific speech attributes for voice search
      "speakable": {
        "@type": "SpeakableSpecification",
        "cssSelector": [".faq-question", ".faq-answer"]
      }
    })),
    ...(url ? { "@id": url } : {})
  };
};

// Helper function to determine if on mobile device
export const isMobileDevice = () => {
  if (typeof window !== 'undefined') {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
          (window.innerWidth <= 768);
  }
  return false;
};

// Enhanced local business data for mobile users
export const getMobileLocalBusinessData = () => {
  const baseData = getOrganizationData();
  
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": "https://godivatech.com/#mobile-organization",
    "name": "GodivaTech - Best Software Company in Madurai for Mobile Users",
    "description": "Mobile-optimized digital marketing, web development and app development services in Madurai offering affordable IT solutions for local businesses.",
    "url": "https://godivatech.com",
    "telephone": "+91 96005 20130",
    "email": "info@godivatech.com",
    "image": [
      "https://godivatech.com/building.jpg",
      "https://godivatech.com/office-entrance.jpg",
      "https://godivatech.com/team-photo.jpg"
    ],
    "logo": "https://godivatech.com/logo.png",
    "slogan": "Madurai's Premier Mobile-First Technology Partner",
    "priceRange": "₹₹",
    "address": baseData.address,
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "9.9252007",
      "longitude": "78.1197754"
    },
    "openingHours": "Mo,Tu,We,Th,Fr 09:00-18:00 Sa 10:00-16:00",
    "potentialAction": [
      {
        "@type": "OrderAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://godivatech.com/contact",
          "inLanguage": "en-IN",
          "actionPlatform": [
            "http://schema.org/MobileWebPlatform",
            "http://schema.org/DesktopWebPlatform",
            "http://schema.org/IOSPlatform",
            "http://schema.org/AndroidPlatform"
          ]
        },
        "result": {
          "@type": "ServiceChannel",
          "providesService": {
            "@type": "Service",
            "name": "Mobile-optimized Web Development Services in Madurai"
          }
        }
      },
      {
        "@type": "ViewAction",
        "target": "https://godivatech.com/"
      }
    ],
    // Special mobile application data
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://godivatech.com/",
      "speakable": {
        "@type": "SpeakableSpecification",
        "cssSelector": [".speakable-content"]
      },
      "specialty": "Mobile-optimized website for Madurai businesses"
    }
  };
};