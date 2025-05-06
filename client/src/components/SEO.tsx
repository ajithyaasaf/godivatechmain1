import React, { memo } from 'react';
import { Helmet } from 'react-helmet';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product' | 'service' | 'profile';
  ogLocale?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  structuredData?: Record<string, any>[];
  children?: React.ReactNode;
  
  // Article-specific metadata
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  
  // Location-specific metadata
  cityName?: string;
  regionName?: string;
  countryName?: string;
  
  // Advanced SEO settings
  robots?: string;
  ampUrl?: string;
  alternateUrls?: { hrefLang: string; href: string }[];
  imageWidth?: number;
  imageHeight?: number;
  facebookAppId?: string;
  twitterSite?: string;
  twitterCreator?: string;
}

/**
 * Enhanced SEO Component for comprehensive search engine optimization
 * 
 * This component centralizes all SEO-related tags including:
 * - Title & meta description with location-specific keywords
 * - Open Graph tags for social sharing with proper dimensions
 * - Twitter card tags with creator attribution
 * - Canonical URL and alternate language URLs
 * - JSON-LD structured data for rich results
 * - AMP page links and mobile optimization hints
 */
const SEO: React.FC<SEOProps> = memo(({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage,
  ogType = 'website',
  ogLocale = 'en_IN',
  twitterCard = 'summary_large_image',
  structuredData = [],
  publishedTime,
  modifiedTime,
  author,
  section,
  cityName = 'Madurai',
  regionName = 'Tamil Nadu',
  countryName = 'India',
  robots,
  ampUrl,
  alternateUrls = [],
  imageWidth = 1200,
  imageHeight = 630,
  facebookAppId,
  twitterSite = '@godivatech',
  twitterCreator,
  children
}) => {
  // Default domain for canonical URLs and images
  const domain = 'https://godivatech.com';
  
  // Format canonical URL with proper handling
  const canonical = canonicalUrl ? 
    (canonicalUrl.startsWith('http') ? canonicalUrl : `${domain}${canonicalUrl.startsWith('/') ? canonicalUrl : `/${canonicalUrl}`}`) : 
    domain;
  
  // Format OpenGraph image URL with proper handling
  const formattedOgImage = ogImage ? 
    (ogImage.startsWith('http') ? ogImage : `${domain}${ogImage.startsWith('/') ? ogImage : `/${ogImage}`}`) : 
    `${domain}/og-image.jpg`;
    
  // Enhanced title with location for local SEO when needed
  const enhancedTitle = title.toLowerCase().includes(cityName.toLowerCase()) ? 
    title : 
    `${title} | GodivaTech | ${cityName}, ${regionName}`;
    
  // Extend keywords with location context for better local SEO
  const extendedKeywords = keywords ? 
    `${keywords}, ${cityName}, ${regionName}, IT services ${cityName}, technology solutions ${cityName}` : 
    `GodivaTech, IT services, web development, digital marketing, ${cityName}, ${regionName}, technology solutions`;

  return (
    <Helmet>
      {/* Basic SEO - Enhanced with proper formatting */}
      <html lang={ogLocale.split('_')[0]} />
      <title>{enhancedTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={extendedKeywords} />
      <link rel="canonical" href={canonical} />
      
      {/* Mobile optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta name="theme-color" content="#4f46e5" /> {/* Primary color */}
      
      {/* Robots control */}
      {robots && <meta name="robots" content={robots} />}
      {!robots && <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />}
      
      {/* Open Graph / Facebook - Enhanced */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={formattedOgImage} />
      <meta property="og:image:width" content={String(imageWidth)} />
      <meta property="og:image:height" content={String(imageHeight)} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content="GodivaTech" />
      <meta property="og:locale" content={ogLocale} />
      {facebookAppId && <meta property="fb:app_id" content={facebookAppId} />}
      
      {/* Article-specific Open Graph tags - Expanded */}
      {ogType === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {ogType === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {ogType === 'article' && author && (
        <meta property="article:author" content={author} />
      )}
      {ogType === 'article' && section && (
        <meta property="article:section" content={section} />
      )}
      
      {/* Twitter - Enhanced */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={formattedOgImage} />
      <meta name="twitter:site" content={twitterSite} />
      {twitterCreator && <meta name="twitter:creator" content={twitterCreator} />}
      <meta name="twitter:label1" content="Est. reading time" />
      <meta name="twitter:data1" content="3 minutes" /> {/* Can be dynamically calculated if needed */}
      
      {/* AMP link for supported pages */}
      {ampUrl && <link rel="amphtml" href={ampUrl} />}
      
      {/* Alternate language versions */}
      {alternateUrls.map((altUrl, index) => (
        <link 
          key={`alt-url-${index}`} 
          rel="alternate" 
          hrefLang={altUrl.hrefLang} 
          href={altUrl.href} 
        />
      ))}
      
      {/* Add x-default alternate for international targeting */}
      <link rel="alternate" hrefLang="x-default" href={domain} />
      
      {/* JSON-LD Structured Data - Better formatted */}
      {structuredData.map((data, index) => (
        <script 
          key={`structured-data-${index}`} 
          type="application/ld+json"
          dangerouslySetInnerHTML={{ 
            __html: JSON.stringify(data, null, 0) // Formatting for better readability
          }}
        />
      ))}
      
      {/* Basic organization structured data for all pages */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "GodivaTech",
            "url": domain,
            "logo": `${domain}/logo.png`,
            "sameAs": [
              "https://www.facebook.com/godivatech",
              "https://www.linkedin.com/company/godivatech",
              "https://twitter.com/godivatech"
            ],
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Anna Nagar",
              "addressLocality": cityName,
              "addressRegion": regionName,
              "postalCode": "625020",
              "addressCountry": countryName
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+91-123-456-7890",
              "contactType": "customer service"
            }
          }, null, 0)
        }}
      />
      
      {/* Additional SEO elements provided by the component consumer */}
      {children}
    </Helmet>
  );
});

// Add displayName for React DevTools
SEO.displayName = "SEO";

export default SEO;