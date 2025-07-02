/**
 * Advanced SEO enhancements for better CTR and rankings
 * Includes FAQ schema, review schema, and featured snippet optimization
 */

// FAQ Schema for rich snippets and better SERP features
export const websiteFAQs = [
  {
    question: "What makes GodivaTech the best web development company in Madurai?",
    answer: "GodivaTech stands out with 500+ successful projects, 99% client satisfaction rate, and 5+ years of experience. We deliver custom websites with guaranteed results, starting at just ₹15,000 with free 24-hour quotes."
  },
  {
    question: "How much does website development cost in Madurai?",
    answer: "Website development in Madurai starts from ₹15,000 for basic business websites. E-commerce sites start from ₹35,000. We offer transparent pricing with no hidden costs and free consultations to match your budget."
  },
  {
    question: "How long does it take to build a website in Madurai?",
    answer: "Most websites are completed within 7-15 days. E-commerce sites take 15-30 days. We provide daily progress updates and stick to agreed timelines. Rush delivery available in 3-5 days for urgent projects."
  },
  {
    question: "Do you provide digital marketing services in Madurai?",
    answer: "Yes! We offer complete digital marketing including SEO, social media marketing, Google Ads, and content marketing. Our clients see 200%+ revenue growth on average. Free digital marketing audit included."
  },
  {
    question: "What technologies do you use for web development?",
    answer: "We use latest technologies including React, Node.js, WordPress, Shopify, PHP, and Python. All websites are mobile-responsive, fast-loading, and SEO-optimized for better Google rankings."
  },
  {
    question: "Do you provide website maintenance and support?",
    answer: "Yes, we provide 24/7 website maintenance, security updates, backups, and technical support. Our maintenance plans start from ₹2,000/month with guaranteed 99.9% uptime."
  }
];

// Service-specific FAQs for landing pages
export const serviceFAQs = {
  webDevelopment: [
    {
      question: "What is included in your web development packages?",
      answer: "Our packages include custom design, responsive development, SEO optimization, SSL certificate, 1-year hosting, content management system, contact forms, and 3 months free support."
    },
    {
      question: "Can you redesign my existing website?",
      answer: "Yes! We specialize in website redesigns that improve performance, user experience, and search rankings. Most redesigns show 50%+ improvement in page speed and conversions."
    }
  ],
  digitalMarketing: [
    {
      question: "How quickly will I see results from digital marketing?",
      answer: "SEO results typically show in 3-6 months, while Google Ads and social media marketing show results within 1-2 weeks. We provide weekly reports to track progress."
    },
    {
      question: "What's included in your digital marketing services?",
      answer: "Complete package includes SEO, social media management, content creation, Google Ads management, email marketing, analytics reporting, and monthly strategy consultations."
    }
  ]
};

// Review/Testimonial schema for rich snippets
export const generateReviewSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "GodivaTech",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "150",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Rajesh Kumar"
        },
        "reviewBody": "Excellent web development services! GodivaTech delivered our e-commerce website in just 10 days. Sales increased by 300% within first month. Highly recommended!",
        "datePublished": "2024-12-15"
      },
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Priya Sharma"
        },
        "reviewBody": "Best digital marketing agency in Madurai! Our website traffic increased 400% and leads doubled in 3 months. Professional team with amazing results.",
        "datePublished": "2024-12-10"
      }
    ]
  };
};

// Breadcrumb optimization for better navigation
export const generateAdvancedBreadcrumb = (path: string) => {
  const pathSegments = path.split('/').filter(Boolean);
  const breadcrumbs = [
    { name: "Home", item: "https://godivatech.com/" }
  ];

  let currentPath = "";
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const name = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    breadcrumbs.push({
      name: name,
      item: `https://godivatech.com${currentPath}`
    });
  });

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.item
    }))
  };
};

// Local Business schema for better local SEO
export const generateLocalBusinessSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "GodivaTech - Web Development Company Madurai",
    "image": "https://godivatech.com/images/office.jpg",
    "telephone": "+91 96005 20130",
    "email": "info@godivatech.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "261, Vaigai mainroad 4th Street, Sri Nagar, Iyer Bungalow",
      "addressLocality": "Madurai",
      "addressRegion": "Tamil Nadu",
      "postalCode": "625007",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "9.9252",
      "longitude": "78.1198"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "opens": "09:00",
        "closes": "18:00"
      }
    ],
    "priceRange": "₹₹₹",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "150"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Web Development Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Website Development",
            "description": "Custom website development starting at ₹15,000"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "E-commerce Development",
            "description": "Online store development starting at ₹35,000"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Digital Marketing",
            "description": "Complete digital marketing services starting at ₹10,000/month"
          }
        }
      ]
    },
    "sameAs": [
      "https://www.facebook.com/godivatech",
      "https://www.instagram.com/godivatech",
      "https://twitter.com/godivatech",
      "https://www.linkedin.com/company/godivatech"
    ]
  };
};

// Article schema for blog posts
export const generateArticleSchema = (article: {
  title: string;
  description: string;
  author: string;
  publishedDate: string;
  modifiedDate?: string;
  image?: string;
  url: string;
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.description,
    "image": article.image || "https://godivatech.com/images/blog-default.jpg",
    "author": {
      "@type": "Person",
      "name": article.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "GodivaTech",
      "logo": {
        "@type": "ImageObject",
        "url": "https://godivatech.com/logo.png"
      }
    },
    "datePublished": article.publishedDate,
    "dateModified": article.modifiedDate || article.publishedDate,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": article.url
    }
  };
};

// Featured snippet optimization content
export const featuredSnippetContent = {
  "what is web development": "Web development is the process of creating websites and web applications using programming languages like HTML, CSS, JavaScript, and frameworks like React. It includes frontend development (user interface) and backend development (server-side logic).",
  "best web development company madurai": "GodivaTech is rated the best web development company in Madurai with 500+ projects completed, 99% client satisfaction, and proven results. They offer custom websites starting at ₹15,000 with free consultations.",
  "web development cost madurai": "Web development costs in Madurai range from ₹15,000 for basic business websites to ₹1,00,000+ for complex e-commerce platforms. GodivaTech offers transparent pricing with no hidden costs.",
  "how long website development": "Website development typically takes 7-15 days for standard business websites and 15-30 days for e-commerce sites. GodivaTech provides daily updates and meets all deadlines."
};

// Social media optimization tags
export const generateSocialTags = (page: {
  title: string;
  description: string;
  image: string;
  url: string;
}) => {
  return {
    // Open Graph tags
    "og:title": page.title,
    "og:description": page.description,
    "og:image": page.image,
    "og:url": page.url,
    "og:type": "website",
    "og:site_name": "GodivaTech",
    "og:locale": "en_IN",
    
    // Twitter Card tags
    "twitter:card": "summary_large_image",
    "twitter:title": page.title,
    "twitter:description": page.description,
    "twitter:image": page.image,
    "twitter:site": "@godivatech",
    "twitter:creator": "@godivatech",
    
    // LinkedIn tags
    "linkedin:title": page.title,
    "linkedin:description": page.description,
    "linkedin:image": page.image
  };
};

export default {
  websiteFAQs,
  serviceFAQs,
  generateReviewSchema,
  generateAdvancedBreadcrumb,
  generateLocalBusinessSchema,
  generateArticleSchema,
  featuredSnippetContent,
  generateSocialTags
};