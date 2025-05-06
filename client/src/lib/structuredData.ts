/**
 * Structured Data Utility Functions
 * 
 * This file contains functions for generating JSON-LD structured data
 * for different page types to improve SEO and enable rich results in search.
 */

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
  name: 'GodivaTech',
  description: 'Best digital marketing, web development and app development company in Madurai offering affordable IT solutions for local businesses.',
  url: 'https://godivatech.com',
  telephone: '+91 96005 20130',
  image: 'https://godivatech.com/building.jpg',
  priceRange: '₹₹',
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
        'Friday',
        'Saturday'
      ],
      opens: '09:00',
      closes: '18:00'
    }
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'IT Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Web Development',
          description: 'Custom website design and development for businesses in Madurai at affordable prices'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Digital Marketing',
          description: 'Comprehensive digital marketing services in Madurai including SEO, social media, and content marketing'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'App Development',
          description: 'Mobile application development for Android and iOS platforms for businesses in Madurai'
        }
      }
    ]
  }
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
  headline: title,
  description: description,
  image: imageUrl,
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
export const getFaqData = (faqs: {question: string, answer: string}[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer
    }
  }))
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

// CollectionPage structured data for portfolio or product collections
export const getCollectionPageData = (
  name: string,
  items: {name: string, description: string, image?: string}[]
) => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: name,
  description: `Collection of ${items.length} projects by GodivaTech, the best web development company in Madurai`,
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