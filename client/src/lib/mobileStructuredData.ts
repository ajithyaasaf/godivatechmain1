/**
 * Mobile-specific structured data for enhanced SEO
 * 
 * This file contains utilities for generating mobile-optimized
 * structured data to improve mobile search rankings and visibility.
 */

// Check if the current device is mobile
export const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  
  const userAgent = navigator.userAgent.toLowerCase();
  const mobileKeywords = ['android', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];
  return mobileKeywords.some(keyword => userAgent.indexOf(keyword) !== -1) || window.innerWidth < 768;
};

/**
 * Generate mobile-optimized blog post structured data
 */
export const getMobileBlogPostData = (
  title: string,
  excerpt: string,
  url: string,
  image: string = '',
  datePublished: string = '',
  dateModified: string = '',
  authorName: string = 'GodivaTech',
  authorImage?: string,
  categoryName?: string,
  baseUrl: string = 'https://godivatech.com'
) => {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "description": excerpt || "",
    "image": image || `${baseUrl}/images/blog-default.jpg`,
    "author": {
      "@type": "Person",
      "name": authorName || "GodivaTech",
      "image": authorImage
    },
    "publisher": {
      "@type": "Organization",
      "name": "GodivaTech",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.png`
      }
    },
    "datePublished": datePublished,
    "dateModified": dateModified,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    },
    "articleSection": categoryName || "Technology",
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": [".article-title", ".article-body"]
    },
    "isAccessibleForFree": "True",
    "isPartOf": {
      "@type": "Blog",
      "name": "GodivaTech Blog",
      "description": "Latest technology insights and updates from GodivaTech",
      "url": `${baseUrl}/blog`
    }
  };
};

/**
 * Generate optimized breadcrumb data for mobile devices
 */
export const getMobileBreadcrumbData = (
  items: Array<{ name: string; item: string }>,
  cityName: string = 'Madurai'
) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name.includes(cityName) ? item.name : `${item.name} in ${cityName}`,
      "item": item.item
    }))
  };
};

/**
 * Generate gallery-specific structured data for mobile
 */
export const getMobileGalleryData = (
  images: Array<{ url: string; caption: string; width?: number; height?: number }>,
  title: string,
  baseUrl: string = 'https://godivatech.com'
) => {
  return {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "associatedMedia": images.map(image => ({
      "@type": "ImageObject",
      "contentUrl": image.url,
      "caption": image.caption,
      "width": image.width || 1200,
      "height": image.height || 800,
      "representativeOfPage": false
    })),
    "name": title,
    "url": baseUrl
  };
};