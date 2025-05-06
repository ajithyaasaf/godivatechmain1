/**
 * SEO Keywords Utility
 * 
 * This file contains centralized keyword sets for different pages and services
 * focused on local SEO for Madurai and Tamil Nadu region
 */

// Location-based keywords for better local SEO
export const locationKeywords = {
  primary: [
    'Madurai',
    'Tamil Nadu',
    'South India'
  ],
  nearby: [
    'Coimbatore',
    'Trichy',
    'Chennai',
    'Pondicherry',
    'Tirunelveli',
    'Salem'
  ],
  local: [
    'Iyer Bungalow',
    'Anna Nagar',
    'KK Nagar',
    'Arasaradi',
    'Mattuthavani',
    'Kalavasal'
  ]
};

// Service type keywords in different formats
export const serviceTypeKeywords = {
  webDev: [
    'web development',
    'website design',
    'website development',
    'ecommerce website',
    'responsive website',
    'WordPress website',
    'custom website',
  ],
  digitalMarketing: [
    'digital marketing',
    'SEO',
    'social media marketing',
    'content marketing',
    'email marketing',
    'PPC advertising',
    'Google Ads',
    'Facebook Ads',
    'Instagram marketing'
  ],
  appDev: [
    'app development',
    'mobile app',
    'Android app',
    'iOS app',
    'cross-platform app',
    'Flutter app',
    'React Native app'
  ],
  branding: [
    'branding',
    'logo design',
    'visual identity',
    'brand strategy',
    'rebranding',
    'corporate identity'
  ],
  software: [
    'software development',
    'custom software',
    'business software',
    'ERP solutions',
    'CRM software',
    'inventory management software'
  ]
};

// Quality and price-related keywords
export const qualityPriceKeywords = {
  quality: [
    'best',
    'top',
    'professional',
    'expert',
    'trusted',
    'reliable',
    'leading'
  ],
  price: [
    'affordable',
    'cheapest',
    'cost-effective',
    'budget-friendly',
    'reasonable price',
    'value for money'
  ],
  business: [
    'company',
    'agency',
    'firm',
    'service provider',
    'consultant',
    'specialists'
  ]
};

// Business type keywords
export const businessTypeKeywords = [
  'small business',
  'startup',
  'enterprise',
  'local business',
  'ecommerce',
  'retail',
  'restaurants',
  'healthcare',
  'education',
  'manufacturing',
  'real estate',
  'hospitality',
  'finance'
];

// Generate keyword combinations for specific services
export const generateKeywordSet = (
  service: keyof typeof serviceTypeKeywords,
  includePrice = true,
  includeLocation = true,
  count = 20
) => {
  const keywords: string[] = [];
  
  // Add main service keywords with quality indicators and locations
  for (const quality of qualityPriceKeywords.quality) {
    for (const businessType of qualityPriceKeywords.business) {
      for (const serviceKeyword of serviceTypeKeywords[service]) {
        // Basic format: "best web development company in Madurai"
        if (includeLocation) {
          for (const location of locationKeywords.primary) {
            keywords.push(`${quality} ${serviceKeyword} ${businessType} in ${location}`);
          }
        } else {
          keywords.push(`${quality} ${serviceKeyword} ${businessType}`);
        }
      }
    }
  }
  
  // Add price-focused keywords if requested
  if (includePrice) {
    for (const price of qualityPriceKeywords.price) {
      for (const businessType of qualityPriceKeywords.business) {
        for (const serviceKeyword of serviceTypeKeywords[service]) {
          // Price format: "affordable web development company in Madurai"
          if (includeLocation) {
            for (const location of locationKeywords.primary) {
              keywords.push(`${price} ${serviceKeyword} ${businessType} in ${location}`);
            }
          } else {
            keywords.push(`${price} ${serviceKeyword} ${businessType}`);
          }
        }
      }
    }
  }
  
  // Add business-specific keywords
  for (const businessType of businessTypeKeywords) {
    for (const serviceKeyword of serviceTypeKeywords[service].slice(0, 3)) {
      if (includeLocation) {
        keywords.push(`${serviceKeyword} for ${businessType} in ${locationKeywords.primary[0]}`);
      } else {
        keywords.push(`${serviceKeyword} for ${businessType}`);
      }
    }
  }
  
  // Add location-specific keywords
  if (includeLocation) {
    for (const local of locationKeywords.local.slice(0, 3)) {
      for (const serviceKeyword of serviceTypeKeywords[service].slice(0, 2)) {
        keywords.push(`${serviceKeyword} in ${local}, ${locationKeywords.primary[0]}`);
      }
    }
  }
  
  // Return limited unique set of keywords
  return [...new Set(keywords)].slice(0, count).join(', ');
};

// Pre-generated keyword sets for main pages
export const homeKeywords = `
best digital marketing company in Madurai, 
best web development company in Madurai, 
best app development in Madurai,
cheapest app development in Madurai,
affordable website design in Madurai,
top software company in Madurai,
professional web development agency in Tamil Nadu,
best branding company in Madurai,
trusted SEO services in Madurai,
responsive website design Madurai,
cost-effective digital marketing services Tamil Nadu,
custom software development Madurai,
ecommerce website development Tamil Nadu,
leading IT company in Madurai,
mobile app development agency Madurai,
budget-friendly website design Madurai,
expert digital marketing consultant Tamil Nadu,
local SEO services Madurai,
website maintenance services Tamil Nadu,
top rated app developers in Madurai
`.replace(/\n/g, '');

export const aboutKeywords = `
best software company in Madurai,
leading IT service provider Tamil Nadu,
experienced web development team Madurai,
professional digital marketing experts in Madurai,
affordable technology solutions Tamil Nadu,
trusted app development company Madurai,
skilled web developers in Tamil Nadu,
top rated IT company in South India,
custom software development Madurai,
reliable tech consultants Tamil Nadu,
website design specialists Madurai,
expert mobile app developers Madurai,
digital marketing agency with proven results,
IT services for local businesses Madurai,
established technology company in Tamil Nadu,
award-winning web design Madurai
`.replace(/\n/g, '');

export const contactKeywords = `
contact best web development company Madurai,
hire affordable app developers in Tamil Nadu,
get quote for website design Madurai,
digital marketing services contact in Madurai,
software development consultation Tamil Nadu,
professional IT services contact Madurai,
web design agency phone number Madurai,
app development inquiry Tamil Nadu,
SEO services contact information Madurai,
website development estimates in Tamil Nadu,
contact for business software solutions Madurai,
schedule digital marketing consultation Tamil Nadu,
custom software development inquiry Madurai,
IT company address in Madurai
`.replace(/\n/g, '');

export const servicesKeywords = `
top web development services Madurai,
professional digital marketing solutions Tamil Nadu,
affordable app development services Madurai,
best UI/UX design services in Tamil Nadu,
custom software development Madurai,
ecommerce website development services Tamil Nadu,
SEO and content marketing Madurai,
social media management services Tamil Nadu,
responsive website design services Madurai,
Android and iOS app development Tamil Nadu,
WordPress website development Madurai,
logo and branding services Tamil Nadu,
web hosting and maintenance Madurai,
graphic design services Tamil Nadu,
enterprise software solutions Madurai,
cheapest web development in Madurai,
best social media marketing in Madurai,
affordable SEO services in Madurai
`.replace(/\n/g, '');

export const blogKeywords = `
digital marketing tips Madurai,
web development guides Tamil Nadu,
app development tutorials Madurai,
SEO best practices for local businesses,
website design trends Tamil Nadu,
Madurai business technology news,
digital marketing case studies Tamil Nadu,
web technology updates Madurai,
mobile app development resources,
business growth strategies Tamil Nadu,
WordPress tutorials for Madurai businesses,
local SEO tips for Tamil Nadu,
social media marketing guides Madurai,
latest web technologies Tamil Nadu,
software development insights Madurai,
ecommerce best practices Tamil Nadu
`.replace(/\n/g, '');

export const portfolioKeywords = `
web development projects Madurai,
mobile app portfolio Tamil Nadu,
digital marketing case studies Madurai,
website designs for local businesses,
successful SEO campaigns Tamil Nadu,
app development success stories Madurai,
client testimonials web development Tamil Nadu,
completed software projects Madurai,
ecommerce website portfolio Tamil Nadu,
branding projects for Madurai businesses,
business website examples Tamil Nadu,
mobile app showcase Madurai,
website design gallery Tamil Nadu,
digital transformation case studies Madurai,
custom software implementations Tamil Nadu
`.replace(/\n/g, '');