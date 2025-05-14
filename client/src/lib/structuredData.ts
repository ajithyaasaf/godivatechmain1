/**
 * Structured Data Utility Functions
 * 
 * This file contains functions for generating JSON-LD structured data
 * for different page types to improve SEO and enable rich results in search.
 * This includes mobile-optimized structured data for better performance across all devices.
 */

// Check if the current device is mobile
export const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  
  const userAgent = navigator.userAgent.toLowerCase();
  const mobileKeywords = ['android', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];
  return mobileKeywords.some(keyword => userAgent.indexOf(keyword) !== -1) || window.innerWidth < 768;
};

// Organization structured data
export const getOrganizationData = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'GodivaTech',
  alternateName: 'Godiva Technologies',
  url: 'https://godivatech.com',
  logo: 'https://godivatech.com/logo.png',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+91 96005 20130',
    contactType: 'customer service',
    areaServed: ['IN', 'Madurai', 'Tamil Nadu'],
    availableLanguage: ['en', 'ta']
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: '261, Vaigai mainroad 4th Street, Sri Nagar, Iyer Bungalow',
    addressLocality: 'Madurai',
    addressRegion: 'Tamil Nadu',
    postalCode: '625007',
    addressCountry: 'IN'
  },
  sameAs: [
    'https://www.facebook.com/godivatech',
    'https://www.linkedin.com/company/godivatech',
    'https://twitter.com/godivatech',
    'https://www.instagram.com/godivatech'
  ]
});

// Local Business structured data
export const getLocalBusinessData = () => ({
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': 'https://godivatech.com/#organization',
  name: 'GodivaTech - Best Software Company in Madurai',
  description: 'Best digital marketing, web development and app development company in Madurai offering affordable IT solutions for local businesses in Tamil Nadu.',
  url: 'https://godivatech.com',
  telephone: '+91 96005 20130',
  email: 'info@godivatech.com',
  image: [
    'https://godivatech.com/building.jpg',
    'https://godivatech.com/office-entrance.jpg',
    'https://godivatech.com/team-photo.jpg'
  ],
  logo: 'https://godivatech.com/logo.png',
  slogan: 'Madurai\'s Premier Technology Partner',
  priceRange: '₹₹',
  currenciesAccepted: 'INR',
  paymentAccepted: 'Cash, Credit Card, UPI',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '261, Vaigai mainroad 4th Street, Sri Nagar, Iyer Bungalow',
    addressLocality: 'Madurai',
    addressRegion: 'Tamil Nadu',
    postalCode: '625007',
    addressCountry: 'IN'
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '9.9252007',
    longitude: '78.1197754'
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday'
      ],
      opens: '09:00',
      closes: '18:00'
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Saturday',
      opens: '10:00',
      closes: '16:00'
    }
  ],
  areaServed: [
    {
      '@type': 'City',
      name: 'Madurai',
      '@id': 'https://www.wikidata.org/wiki/Q173032'
    },
    {
      '@type': 'State',
      name: 'Tamil Nadu',
      '@id': 'https://www.wikidata.org/wiki/Q1445'
    }
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'IT Services in Madurai',
    description: 'Professional technology services offered by GodivaTech in Madurai, Tamil Nadu',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Web Development',
          description: 'Custom website design and development for businesses in Madurai at affordable prices',
          serviceType: 'Web Development',
          provider: {
            '@id': 'https://godivatech.com/#organization'
          },
          serviceOutput: 'Professional, SEO-optimized websites',
          hoursAvailable: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: [
              'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
            ],
            opens: '09:00',
            closes: '18:00'
          }
        },
        areaServed: {
          '@type': 'City',
          name: 'Madurai'
        },
        eligibleRegion: {
          '@type': 'State',
          name: 'Tamil Nadu'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Digital Marketing',
          description: 'Comprehensive digital marketing services in Madurai including SEO, social media, and content marketing',
          serviceType: 'Digital Marketing',
          provider: {
            '@id': 'https://godivatech.com/#organization'
          }
        },
        areaServed: {
          '@type': 'City',
          name: 'Madurai'
        },
        eligibleRegion: {
          '@type': 'State',
          name: 'Tamil Nadu'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'App Development',
          description: 'Mobile application development for Android and iOS platforms for businesses in Madurai',
          serviceType: 'App Development',
          provider: {
            '@id': 'https://godivatech.com/#organization'
          }
        },
        areaServed: {
          '@type': 'City',
          name: 'Madurai'
        },
        eligibleRegion: {
          '@type': 'State',
          name: 'Tamil Nadu'
        }
      }
    ]
  },
  // Add review aggregate for social proof
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    ratingCount: '57',
    bestRating: '5',
    worstRating: '1'
  },
  // Awards and recognitions
  award: [
    'Best Web Development Company in Madurai 2023',
    'Top Digital Marketing Agency in Tamil Nadu'
  ],
  // Local business attributes
  keywords: [
    'web development Madurai',
    'digital marketing Madurai',
    'app development Tamil Nadu',
    'SEO company Madurai',
    'affordable web design Madurai',
    'best software company in Madurai',
    'top digital marketing agency Tamil Nadu'
  ],
  // Social profiles
  sameAs: [
    'https://www.facebook.com/godivatech',
    'https://www.linkedin.com/company/godivatech',
    'https://twitter.com/godivatech',
    'https://www.instagram.com/godivatech'
  ]
});

// Web Page structured data
export const getWebPageData = (title: string, description: string, url: string) => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: title,
  description: description,
  url: url,
  isPartOf: {
    '@id': 'https://godivatech.com/#website'
  },
  about: {
    '@id': 'https://godivatech.com/#organization'
  },
  inLanguage: 'en-IN'
});

// Website structured data
export const getWebsiteData = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://godivatech.com/#website',
  url: 'https://godivatech.com',
  name: 'GodivaTech',
  description: 'Best Digital Marketing & Web Development Company in Madurai',
  publisher: {
    '@id': 'https://godivatech.com/#organization'
  },
  potentialAction: [
    {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://godivatech.com/search?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    }
  ],
  inLanguage: 'en-IN'
});

// Blog Post structured data
export const getBlogPostData = (
  title: string,
  description: string,
  url: string,
  imageUrl: string,
  datePublished: string,
  dateModified: string,
  authorName: string,
  authorImage?: string
) => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  name: title,
  headline: title,
  description: description,
  image: imageUrl,
  url: url,
  isPartOf: {
    '@id': 'https://godivatech.com/#website'
  },
  about: {
    '@id': 'https://godivatech.com/#organization'
  },
  inLanguage: 'en-IN',
  datePublished: datePublished,
  dateModified: dateModified || datePublished,
  author: {
    '@type': 'Person',
    name: authorName,
    image: authorImage
  },
  publisher: {
    '@type': 'Organization',
    name: 'GodivaTech',
    logo: {
      '@type': 'ImageObject',
      url: 'https://godivatech.com/logo.png'
    }
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': url
  },
  // Add location attributes for local SEO
  locationCreated: {
    '@type': 'Place',
    name: 'Madurai, Tamil Nadu, India',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Madurai',
      addressRegion: 'Tamil Nadu',
      addressCountry: 'IN'
    }
  }
});

// Service Page structured data
export const getServiceData = (
  name: string,
  description: string,
  url: string,
  image?: string
) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: name,
  name: name,
  description: description,
  url: url,
  provider: {
    '@id': 'https://godivatech.com/#organization'
  },
  ...(image && { image: image }),
  areaServed: {
    '@type': 'City',
    name: 'Madurai',
    '@id': 'https://www.wikidata.org/wiki/Q173032'
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: name,
    description: `Best ${name} services in Madurai at affordable prices`
  }
});

// FAQPage structured data
/**
 * Creates FAQPage schema markup for service pages or blog posts with FAQs
 * This schema helps pages appear in Google's FAQ rich results
 * 
 * @param faqs Array of question/answer pairs
 * @param url The canonical URL of the page (optional)
 * @returns Schema.org FAQPage structured data
 */
export const getFaqData = (faqs: {question: string, answer: string}[], url?: string) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer
    }
  })),
  ...(url ? { '@id': url } : {})
});

// BreadcrumbList structured data
export const getBreadcrumbData = (
  items: {name: string, item: string}[]
) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.item
  }))
});

// Mobile-optimized blog post structured data
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

// Mobile-optimized breadcrumb structured data
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

// Mobile-optimized gallery structured data
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

// CollectionPage structured data for portfolio or product collections
export const getCollectionPageData = (
  name: string,
  items: {name: string, description: string, image?: string}[]
) => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: name,
  description: `Collection of ${items.length} projects by GodivaTech, the best web development company in Madurai`,
  url: 'https://godivatech.com/blog',
  isPartOf: {
    '@id': 'https://godivatech.com/#website'
  },
  about: {
    '@id': 'https://godivatech.com/#organization'
  },
  inLanguage: 'en-IN',
  numberOfItems: items.length,
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'CreativeWork',
      name: item.name,
      description: item.description,
      ...(item.image && { image: item.image })
    }
  }))
});