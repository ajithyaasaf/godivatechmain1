/**
 * Advanced SEO Component - Maximizes CTR and Rankings
 * Includes structured data, FAQs, reviews, and social optimization
 */

import { Helmet } from "react-helmet";
import { useLocation } from "wouter";
import { 
  websiteFAQs, 
  generateReviewSchema, 
  generateLocalBusinessSchema,
  generateAdvancedBreadcrumb,
  generateSocialTags
} from "@/lib/advancedSEO";

interface AdvancedSEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  articleData?: {
    author: string;
    publishedDate: string;
    modifiedDate?: string;
  };
  faqData?: Array<{ question: string; answer: string }>;
}

export function AdvancedSEO({ 
  title, 
  description, 
  keywords,
  image = "https://godivatech.com/images/og-image.jpg",
  articleData,
  faqData = websiteFAQs
}: AdvancedSEOProps) {
  const [location] = useLocation();
  const currentUrl = `https://godivatech.com${location}`;

  // Generate comprehensive structured data
  const localBusinessSchema = generateLocalBusinessSchema();
  const reviewSchema = generateReviewSchema();
  const breadcrumbSchema = generateAdvancedBreadcrumb(location);
  
  // FAQ Schema for rich snippets
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  // Social media tags
  const socialTags = generateSocialTags({
    title: title || "🚀 Best Web Development Company Madurai | Transform Your Business | Free Quote 24hrs",
    description: description || "🚀 Best web development company in Madurai! Transform your business with stunning websites & apps. 500+ clients served. Free quote in 24hrs!",
    image,
    url: currentUrl
  });

  // Article schema for blog posts
  const articleSchema = articleData ? {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "image": image,
    "author": {
      "@type": "Person",
      "name": articleData.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "GodivaTech",
      "logo": {
        "@type": "ImageObject",
        "url": "https://godivatech.com/logo.png"
      }
    },
    "datePublished": articleData.publishedDate,
    "dateModified": articleData.modifiedDate || articleData.publishedDate,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": currentUrl
    }
  } : null;

  return (
    <Helmet>
      {/* Enhanced Title and Description */}
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Advanced Meta Tags for Better Rankings */}
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />
      
      {/* Hreflang for local SEO */}
      <link rel="alternate" hrefLang="en-IN" href={currentUrl} />
      <link rel="alternate" hrefLang="ta-IN" href={currentUrl} />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={socialTags["og:title"]} />
      <meta property="og:description" content={socialTags["og:description"]} />
      <meta property="og:image" content={socialTags["og:image"]} />
      <meta property="og:url" content={socialTags["og:url"]} />
      <meta property="og:type" content={socialTags["og:type"]} />
      <meta property="og:site_name" content={socialTags["og:site_name"]} />
      <meta property="og:locale" content={socialTags["og:locale"]} />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content={socialTags["twitter:card"]} />
      <meta name="twitter:title" content={socialTags["twitter:title"]} />
      <meta name="twitter:description" content={socialTags["twitter:description"]} />
      <meta name="twitter:image" content={socialTags["twitter:image"]} />
      <meta name="twitter:site" content={socialTags["twitter:site"]} />
      <meta name="twitter:creator" content={socialTags["twitter:creator"]} />
      
      {/* LinkedIn Tags */}
      <meta property="linkedin:title" content={socialTags["linkedin:title"]} />
      <meta property="linkedin:description" content={socialTags["linkedin:description"]} />
      <meta property="linkedin:image" content={socialTags["linkedin:image"]} />
      
      {/* Performance and Technical SEO */}
      <meta name="theme-color" content="#1a202c" />
      <meta name="msapplication-TileColor" content="#1a202c" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      
      {/* Local Business Schema */}
      <script type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
      </script>
      
      {/* Review Schema for Rich Snippets */}
      <script type="application/ld+json">
        {JSON.stringify(reviewSchema)}
      </script>
      
      {/* Breadcrumb Schema */}
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
      
      {/* FAQ Schema for Featured Snippets */}
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>
      
      {/* Article Schema for Blog Posts */}
      {articleSchema && (
        <script type="application/ld+json">
          {JSON.stringify(articleSchema)}
        </script>
      )}
      
      {/* Preconnect to Important Domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://cloudinary.com" />
      
      {/* DNS Prefetch for Performance */}
      <link rel="dns-prefetch" href="//google-analytics.com" />
      <link rel="dns-prefetch" href="//googletagmanager.com" />
      <link rel="dns-prefetch" href="//facebook.com" />
      
      {/* Favicon and App Icons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
    </Helmet>
  );
}

export default AdvancedSEO;