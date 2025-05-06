import React from 'react';
import { Helmet } from 'react-helmet';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  ogLocale?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  structuredData?: Record<string, any>[];
  children?: React.ReactNode;
}

/**
 * SEO Component for optimizing pages for search engines
 * 
 * This component centralizes all SEO-related tags including:
 * - Title & meta description
 * - Open Graph tags for social sharing
 * - Twitter card tags
 * - Canonical URL
 * - JSON-LD structured data
 */
const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage,
  ogType = 'website',
  ogLocale = 'en_IN',
  twitterCard = 'summary_large_image',
  structuredData = [],
  children
}) => {
  // Default domain for canonical URLs and images
  const domain = 'https://godivatech.com';
  
  // Format canonical URL
  const canonical = canonicalUrl ? 
    (canonicalUrl.startsWith('http') ? canonicalUrl : `${domain}${canonicalUrl}`) : 
    undefined;
  
  // Format OpenGraph image URL
  const formattedOgImage = ogImage ? 
    (ogImage.startsWith('http') ? ogImage : `${domain}${ogImage}`) : 
    `${domain}/og-image.jpg`;

  return (
    <Helmet>
      {/* Basic SEO */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={formattedOgImage} />
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:site_name" content="GodivaTech" />
      <meta property="og:locale" content={ogLocale} />
      
      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={formattedOgImage} />
      
      {/* JSON-LD Structured Data */}
      {structuredData.map((data, index) => (
        <script 
          key={index} 
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
      
      {/* Additional SEO elements provided by the component consumer */}
      {children}
    </Helmet>
  );
};

export default SEO;