import React, { memo, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { getCurrentCanonicalUrl } from '../lib/canonicalUrl';

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
  postalCode?: string;
  neighborhood?: string;
  latitude?: number;
  longitude?: number;
  landmark?: string;
  
  // Advanced SEO settings
  robots?: string;
  ampUrl?: string;
  alternateUrls?: { hrefLang: string; href: string }[];
  imageWidth?: number;
  imageHeight?: number;
  facebookAppId?: string;
  twitterSite?: string;
  twitterCreator?: string;
  
  // Mobile optimization
  mobileAppIosId?: string;
  mobileAppAndroidId?: string;
  mobileAppWindowsId?: string;
  
  // Additional structured data
  priceRange?: string;
  telephoneNumber?: string;
  businessHours?: string[];
  servicedArea?: string[];
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
  postalCode = '625020',
  neighborhood,
  latitude = 9.9252,
  longitude = 78.1198,
  landmark,
  robots,
  ampUrl,
  alternateUrls = [],
  imageWidth = 1200,
  imageHeight = 630,
  facebookAppId,
  twitterSite = '@godivatech',
  twitterCreator,
  mobileAppIosId,
  mobileAppAndroidId,
  mobileAppWindowsId,
  priceRange = '₹₹',
  telephoneNumber = '+91-123-456-7890',
  businessHours = ['Mo-Fr 09:00-18:00', 'Sa 10:00-15:00'],
  servicedArea = ['Madurai', 'Coimbatore', 'Trichy', 'Chennai'],
  children
}) => {
  // Default domain for canonical URLs and images
  const domain = 'https://godivatech.com';
  
  // Always use getCurrentCanonicalUrl to ensure consistent canonicals across the app
  // Fall back to provided canonicalUrl or default domain
  const canonical = canonicalUrl ? 
    (canonicalUrl.startsWith('http') ? canonicalUrl : `${domain}${canonicalUrl.startsWith('/') ? canonicalUrl : `/${canonicalUrl}`}`) : 
    getCurrentCanonicalUrl();
    
  // Add direct DOM manipulation for critical SEO elements in case React Helmet fails
  useEffect(() => {
    // Ensure canonical URL is always added to the DOM even if Helmet has issues
    let canonicalElement = document.querySelector('link[rel="canonical"]');
    
    if (!canonicalElement) {
      // Create and add canonical link if it doesn't exist
      canonicalElement = document.createElement('link');
      canonicalElement.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalElement);
    }
    
    // Set the href attribute to the canonical URL
    canonicalElement.setAttribute('href', canonical);
    
    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log("Canonical URL set by useEffect:", canonical);
    }
  }, [canonical]);
  
  // Format OpenGraph image URL with proper handling
  const formattedOgImage = ogImage ? 
    (ogImage.startsWith('http') ? ogImage : `${domain}${ogImage.startsWith('/') ? ogImage : `/${ogImage}`}`) : 
    `${domain}/og-image.jpg`;
    
  // Enhanced title with location for local SEO when needed (optimized for character count)
  const enhancedTitle = title.toLowerCase().includes(cityName.toLowerCase()) ? 
    title : 
    // Only add cityName if the title is short enough
    (title.length < 35) ? `${title} | GodivaTech ${cityName}` : title;
    
  // Extend keywords with location context for better local SEO
  const extendedKeywords = keywords ? 
    `${keywords}, ${cityName}, ${regionName}, IT services ${cityName}, technology solutions ${cityName}` : 
    `GodivaTech, IT services, web development, digital marketing, ${cityName}, ${regionName}, technology solutions`;

  return (
    <Helmet>
      {/* Basic SEO - Enhanced with proper formatting */}
      <html lang={ogLocale.split('_')[0]} />
      <title>{enhancedTitle}</title>
      <meta name="description" content={description.length > 160 ? description.substring(0, 157) + '...' : description} />
      <meta name="keywords" content={extendedKeywords} />
      <link rel="canonical" href={canonical} />
      <link rel="sitemap" type="application/xml" href={`${domain}/sitemap.xml`} />
      
      {/* Add structured data */}
      {structuredData && structuredData.length > 0 && structuredData.map((data, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
      
      {/* Mobile optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta name="theme-color" content="#4f46e5" /> {/* Primary color */}
      
      {/* Robots control */}
      {robots && <meta name="robots" content={robots} />}
      {!robots && <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />}
      
      {/* Open Graph / Facebook - Enhanced with Facebook best practices */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title.length > 60 ? title.substring(0, 57) + '...' : title} />
      <meta property="og:description" content={description.length > 160 ? description.substring(0, 157) + '...' : description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={formattedOgImage} />
      <meta property="og:image:width" content={String(imageWidth)} />
      <meta property="og:image:height" content={String(imageHeight)} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:site_name" content="GodivaTech" />
      <meta property="og:locale" content={ogLocale} />
      <meta property="og:locale:alternate" content="ta_IN" />
      
      {/* Add updated time for content freshness */}
      {modifiedTime && <meta property="og:updated_time" content={modifiedTime} />}
      
      {/* Add business location info for local SEO */}
      {cityName && <meta property="og:street-address" content={`${cityName}, ${regionName}, ${countryName}`} />}
      
      {/* Facebook ID for insights */}
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
      
      {/* Enhanced LocalBusiness structured data for all pages */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "@id": `${domain}/#organization`,
            "name": "GodivaTech",
            "alternateName": "Godiva Technologies",
            "url": domain,
            "logo": {
              "@type": "ImageObject",
              "url": `${domain}/logo.png`,
              "width": "180",
              "height": "60"
            },
            "image": formattedOgImage,
            "description": "GodivaTech offers professional web development, app development, and digital marketing services in Madurai, Tamil Nadu with a focus on creating high-performance, SEO-optimized digital solutions.",
            "priceRange": priceRange,
            "telephone": telephoneNumber,
            "email": "contact@godivatech.com",
            "sameAs": [
              "https://www.facebook.com/godivatech",
              "https://www.linkedin.com/company/godivatech",
              "https://twitter.com/godivatech",
              "https://www.instagram.com/godivatech",
              "https://www.youtube.com/channel/godivatech"
            ],
            "address": {
              "@type": "PostalAddress",
              "streetAddress": neighborhood || "Anna Nagar",
              "addressLocality": cityName,
              "addressRegion": regionName,
              "postalCode": postalCode,
              "addressCountry": countryName
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": latitude,
              "longitude": longitude
            },
            "hasMap": `https://www.google.com/maps?cid=123456789`,
            "openingHoursSpecification": businessHours.map(hours => {
              const [days, timeRange] = hours.split(' ');
              const [opens, closes] = timeRange.split('-');
              return {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": days.split('-').map(day => {
                  const daysMap: Record<string, string> = {
                    "Mo": "Monday", "Tu": "Tuesday", "We": "Wednesday", 
                    "Th": "Thursday", "Fr": "Friday", "Sa": "Saturday", "Su": "Sunday"
                  };
                  return daysMap[day as keyof typeof daysMap] || day;
                }),
                "opens": opens,
                "closes": closes
              };
            }),
            "areaServed": servicedArea.map(area => ({
              "@type": "City",
              "name": area
            })),
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": telephoneNumber,
              "contactType": "customer service",
              "contactOption": "TollFree",
              "areaServed": "IN",
              "availableLanguage": ["English", "Tamil"]
            },
            "founder": {
              "@type": "Person",
              "name": "Rajkumar Singh",
              "jobTitle": "CEO & Founder",
              "sameAs": "https://www.linkedin.com/in/rajkumar-godivatech/"
            },
            "foundingDate": "2015-06-01",
            "numberOfEmployees": {
              "@type": "QuantitativeValue",
              "value": "20-50"
            },
            "knowsAbout": [
              "Web Development", 
              "Mobile App Development", 
              "Digital Marketing", 
              "Search Engine Optimization", 
              "Software Development"
            ],
            "keywords": extendedKeywords.split(', ').slice(0, 10).join(', '),
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": canonical
            },
            "award": "Best Digital Marketing Agency in Madurai 2023"
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