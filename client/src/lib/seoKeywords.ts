/**
 * Centralized SEO keywords for GodivaTech website
 * 
 * These keywords are used across the website for consistent SEO optimization.
 * Having them in a single file allows for easy updates and maintenance.
 */

// Company information
export const companyName = "GodivaTech";
export const companyLocation = "Madurai";
export const companyLocationFull = "Madurai, Tamil Nadu, India";
export const companyIndustry = "Web Development";
export const companyPhone = "+91 96005 20130";
export const companyEmail = "info@godivatech.com";

// Main keywords - primary terms the company wants to rank for
export const mainKeywords = {
  primaryServices: [
    "web development Madurai",
    "app development Madurai",
    "digital marketing Madurai",
    "website design Madurai",
    "ecommerce website Madurai",
    "SEO services Madurai",
    "software development Madurai",
    "responsive web design Madurai",
    "custom web development Madurai",
    "mobile app development Madurai"
  ],
  industrySpecific: [
    "business website development Madurai",
    "healthcare website development Madurai",
    "educational website development Madurai",
    "restaurant website development Madurai",
    "real estate website development Madurai",
    "travel website development Madurai"
  ],
  technology: [
    "React development Madurai",
    "WordPress development Madurai",
    "Shopify development Madurai",
    "PHP development Madurai",
    "NodeJS development Madurai",
    "Angular development Madurai",
    "Flutter app development Madurai",
    "React Native development Madurai"
  ]
};

// Keywords for specific pages
export const pageKeywords = {
  home: [
    "best web development company in Madurai",
    "top app development company in Madurai",
    "affordable website design Madurai",
    "professional web developers Madurai",
    "web development services Madurai",
    "custom website design Madurai"
  ],
  about: [
    "experienced web development team Madurai",
    "professional web designers Madurai",
    "trusted web developers Madurai",
    "skilled app developers Madurai",
    "GodivaTech team Madurai",
    "web development experts Madurai"
  ],
  services: [
    "comprehensive web services Madurai",
    "end-to-end web development Madurai",
    "full-stack development services Madurai",
    "web hosting services Madurai",
    "website maintenance Madurai",
    "ecommerce development Madurai"
  ],
  portfolio: [
    "web development projects Madurai",
    "app development case studies Madurai",
    "website portfolio Madurai",
    "successful web projects Madurai",
    "client websites Madurai",
    "mobile app portfolio Madurai"
  ],
  blog: [
    "web development blog Madurai",
    "app development tips Madurai",
    "website design trends Madurai",
    "technology insights Madurai",
    "web development tutorials Madurai",
    "digital marketing strategies Madurai"
  ],
  contact: [
    "contact web developers Madurai",
    "hire web design company Madurai",
    "web development consultation Madurai",
    "app development quote Madurai",
    "website design inquiry Madurai",
    "GodivaTech contact details Madurai"
  ]
};

// Long-tail keywords for content marketing
export const longTailKeywords = [
  "how to create a business website in Madurai",
  "cost of developing a website in Madurai",
  "best ecommerce platform for small business in Madurai",
  "how to rank website higher on Google in Madurai",
  "responsive web design services for mobile in Madurai",
  "custom CRM development for business in Madurai",
  "fast loading WordPress website development Madurai",
  "secure ecommerce website development Madurai",
  "B2B website design and development Madurai",
  "affordable mobile app development for startups Madurai",
  "progressive web app development company Madurai",
  "SEO-friendly website development Madurai"
];

// Meta description templates
export const metaDescriptions = {
  home: `${companyName} is the leading web development company in ${companyLocation}, offering professional website design, app development, and digital marketing services. Get a free consultation today.`,
  about: `Learn about ${companyName}, the top-rated web and app development company in ${companyLocation}. Our experienced team delivers custom, high-quality digital solutions for businesses of all sizes.`,
  services: `Explore our comprehensive web design, development, and digital marketing services at ${companyName}. We provide tailored solutions for businesses in ${companyLocation} and beyond.`,
  portfolio: `View our portfolio of successful web and app development projects at ${companyName}. See how we've helped businesses in ${companyLocation} establish their online presence.`,
  blog: `Read the latest insights on web development, app design, and digital marketing on the ${companyName} blog. Stay updated with technology trends and tips.`,
  contact: `Contact ${companyName} for professional web development, app design, and digital marketing services in ${companyLocation}. Request a quote or consultation today.`
};

// Schema markup data (for structured data)
export const schemaMarkupData = {
  organization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": companyName,
    "url": "https://godivatech.com/",
    "logo": "https://godivatech.com/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": companyPhone,
      "contactType": "customer service",
      "areaServed": "Madurai",
      "availableLanguage": ["English", "Tamil"]
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "261, Vaigai mainroad 4th Street, Sri Nagar, Iyer Bungalow",
      "addressLocality": "Madurai",
      "postalCode": "625007",
      "addressCountry": "IN"
    },
    "sameAs": [
      "https://www.facebook.com/godivatech",
      "https://www.instagram.com/godivatech",
      "https://twitter.com/godivatech",
      "https://www.linkedin.com/company/godivatech"
    ]
  },
  localBusiness: {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": `${companyName} - Web Development Company in ${companyLocation}`,
    "image": "https://godivatech.com/images/office.jpg",
    "@id": "https://godivatech.com/#organization",
    "url": "https://godivatech.com/",
    "telephone": companyPhone,
    "priceRange": "₹₹₹",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "261, Vaigai mainroad 4th Street, Sri Nagar, Iyer Bungalow",
      "addressLocality": "Madurai",
      "postalCode": "625007",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 9.9252,
      "longitude": 78.1198
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "09:00",
      "closes": "18:00"
    },
    "sameAs": [
      "https://www.facebook.com/godivatech",
      "https://www.instagram.com/godivatech",
      "https://twitter.com/godivatech",
      "https://www.linkedin.com/company/godivatech"
    ]
  }
};

// Helper functions for SEO implementation
export const generateBreadcrumbData = (breadcrumbs: { name: string, item: string }[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((breadcrumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": breadcrumb.name,
      "item": breadcrumb.item
    }))
  };
};

export const generateFAQData = (faqs: { question: string, answer: string }[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
};

export const generateServiceData = (service: { name: string, description: string, url: string }) => {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": service.name,
    "provider": {
      "@type": "Organization",
      "name": companyName
    },
    "description": service.description,
    "url": service.url,
    "areaServed": {
      "@type": "City",
      "name": companyLocation
    }
  };
};

export const getOrganizationData = () => schemaMarkupData.organization;
export const getLocalBusinessData = () => schemaMarkupData.localBusiness;
export const getWebPageData = (title: string, description: string, url: string) => {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": title,
    "description": description,
    "url": url,
    "publisher": {
      "@type": "Organization",
      "name": companyName
    }
  };
};