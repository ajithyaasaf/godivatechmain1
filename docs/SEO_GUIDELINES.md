# SEO Guidelines for GodivaTech Website

This document outlines the SEO best practices implemented on the GodivaTech website to ensure optimal search engine visibility and ranking.

## Core SEO Elements Implemented

### 1. Metadata Implementation
- **Page Titles**: Each page has a unique, descriptive title with target keywords and location (Madurai) where relevant.
- **Meta Descriptions**: Every page has a unique meta description under 160 characters that includes primary keywords.
- **Canonical URLs**: All pages use canonical tags to prevent duplicate content issues.
- **Robots Meta Tags**: Properly configured to control crawler behavior with `index, follow`.

### 2. Structured Data (JSON-LD)
- **LocalBusiness**: Complete business information including address, contact details, service areas, and business hours.
- **WebSite**: Website information with search functionality.
- **BreadcrumbList**: Site navigation structure for search engines.
- **FAQPage**: Frequently asked questions with structured data markup.
- **Organization**: Company information with appropriate sameAs links.

### 3. On-Page SEO Elements
- **Heading Structure**: Proper H1-H6 hierarchy with keyword optimization:
  - Single H1 tag per page containing primary keyword
  - H2 tags for main sections with secondary keywords
  - H3-H6 tags for subsections as needed
- **Internal Linking**: Strategic internal links with descriptive anchor text.
- **Image Optimization**: All images have descriptive filenames and alt attributes.
- **URL Structure**: Clean, readable URLs with keywords where appropriate.

### 4. Technical SEO
- **Mobile Responsiveness**: Website is fully responsive for all devices.
- **Page Speed Optimization**: Fast-loading pages with optimized assets.
- **XML Sitemap**: Complete sitemap at `/sitemap.xml` for improved crawling.
- **Schema.org Markup**: Rich data for search engines to better understand content.
- **SSL Implementation**: Secure website with HTTPS protocol.

### 5. Local SEO
- **NAP Consistency**: Name, Address, Phone number consistent across all pages.
- **Local Keywords**: "Madurai", "Tamil Nadu" included in key content areas.
- **Google Business Profile**: Linked with website for local search visibility.
- **Local Structured Data**: GeoCoordinates and PostalAddress markup.

## Page-Specific SEO Configuration

### Homepage
- **Title**: "GodivaTech - Web Development & Digital Marketing Services in Madurai"
- **Focus Keywords**: web development, digital marketing, Madurai
- **Structured Data**: Organization, WebSite, LocalBusiness

### Services Pages
- **Title Pattern**: "[Service Name] - Professional [Service] Solutions | GodivaTech Madurai"
- **Focus Keywords**: specific service name + Madurai/Tamil Nadu
- **Structured Data**: Service, BreadcrumbList

### Portfolio Pages
- **Title Pattern**: "[Project Type] Portfolio - Successful [Industry] Projects | GodivaTech"
- **Focus Keywords**: portfolio, project type, industry
- **Structured Data**: ItemList, BreadcrumbList

### Blog Posts
- **Title Pattern**: "[Main Keyword] - [Supporting Detail] | GodivaTech Blog"
- **Focus Keywords**: topic specific keywords, industry terms
- **Structured Data**: Article, BreadcrumbList, Author

## Monitoring & Maintenance

- Regular review of search console data
- Checking for crawl errors
- Monitoring search ranking for target keywords
- Updating content regularly with fresh information
- Verifying all structured data with Google's testing tool

## Implementation Notes

1. Canonical URLs are automatically generated through the server-side middleware.
2. All pages are validated with basic SEO requirements through our custom SEO component.
3. Crawler-friendly versions are provided for search engines.
4. Rich snippets are supported through comprehensive JSON-LD implementation.

This document should be updated whenever significant SEO changes are made to the website.