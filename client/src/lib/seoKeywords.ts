/**
 * SEO Keywords Utility
 *
 * This file contains centralized keyword sets for different pages and services
 * focused on local SEO for Madurai and Tamil Nadu region
 */

// Location-based keywords for better local SEO
export const locationKeywords = {
  primary: [
    "Madurai",
    "Madurai Tamil Nadu",
    "Madurai city",
    "Madurai district",
  ],
  nearby: [
    "Coimbatore",
    "Trichy",
    "Chennai",
    "Tirunelveli",
    "Dindigul",
    "Theni",
    "Sivagangai",
    "Ramanathapuram",
    "Virudhunagar",
  ],
  local: [
    "Iyer Bungalow Madurai",
    "Anna Nagar Madurai",
    "KK Nagar Madurai",
    "Arasaradi Madurai",
    "Mattuthavani Madurai",
    "Kalavasal Madurai",
    "Pasumalai Madurai",
    "Narimedu Madurai",
    "Gomathipuram Madurai",
    "SS Colony Madurai",
    "Anaiyur Madurai",
    "Thiruparankundram Madurai",
    "Tirunagar Madurai",
    "Meenakshi Nagar Madurai",
    "Jaihindpuram Madurai",
  ],
};

// Service type keywords in different formats
export const serviceTypeKeywords = {
  webDev: [
    "web development",
    "website design",
    "website development",
    "ecommerce website",
    "responsive website",
    "WordPress website",
    "custom website",
  ],
  digitalMarketing: [
    "digital marketing",
    "SEO",
    "social media marketing",
    "content marketing",
    "email marketing",
    "PPC advertising",
    "Google Ads",
    "Facebook Ads",
    "Instagram marketing",
  ],
  appDev: [
    "app development",
    "mobile app",
    "Android app",
    "iOS app",
    "cross-platform app",
    "Flutter app",
    "React Native app",
  ],
  branding: [
    "branding",
    "logo design",
    "visual identity",
    "brand strategy",
    "rebranding",
    "corporate identity",
  ],
  software: [
    "software development",
    "custom software",
    "business software",
    "ERP solutions",
    "CRM software",
    "inventory management software",
  ],
};

// Quality and price-related keywords
export const qualityPriceKeywords = {
  quality: [
    "best",
    "top",
    "professional",
    "expert",
    "trusted",
    "reliable",
    "leading",
  ],
  price: [
    "affordable",
    "cheapest",
    "cost-effective",
    "budget-friendly",
    "reasonable price",
    "value for money",
  ],
  business: [
    "company",
    "agency",
    "firm",
    "service provider",
    "consultant",
    "specialists",
  ],
};

// Business type keywords
export const businessTypeKeywords = [
  "small business",
  "startup",
  "enterprise",
  "local business",
  "ecommerce",
  "retail",
  "restaurants",
  "healthcare",
  "education",
  "manufacturing",
  "real estate",
  "hospitality",
  "finance",
];

// Generate keyword combinations for specific services
export const generateKeywordSet = (
  service: keyof typeof serviceTypeKeywords,
  includePrice = true,
  includeLocation = true,
  count = 20,
) => {
  const keywords: string[] = [];

  // Add main service keywords with quality indicators and locations
  for (const quality of qualityPriceKeywords.quality) {
    for (const businessType of qualityPriceKeywords.business) {
      for (const serviceKeyword of serviceTypeKeywords[service]) {
        // Basic format: "best web development company in Madurai"
        if (includeLocation) {
          for (const location of locationKeywords.primary) {
            keywords.push(
              `${quality} ${serviceKeyword} ${businessType} in ${location}`,
            );

            // Add natural search queries
            keywords.push(
              `${quality} ${serviceKeyword} ${businessType} near me ${location}`,
            );
            keywords.push(
              `${serviceKeyword} ${businessType} ${location} reviews`,
            );
            keywords.push(
              `top rated ${serviceKeyword} ${businessType} ${location}`,
            );
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
              keywords.push(
                `${price} ${serviceKeyword} ${businessType} in ${location}`,
              );

              // Add cost-oriented search queries
              keywords.push(
                `${serviceKeyword} ${businessType} ${location} cost`,
              );
              keywords.push(`${serviceKeyword} packages ${location} price`);
              keywords.push(
                `how much does ${serviceKeyword} cost in ${location}`,
              );
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
        keywords.push(
          `${serviceKeyword} for ${businessType} in ${locationKeywords.primary[0]}`,
        );

        // Add business-specific queries
        keywords.push(
          `${serviceKeyword} company for ${businessType}s ${locationKeywords.primary[0]}`,
        );
        keywords.push(
          `best ${serviceKeyword} for ${businessType} ${locationKeywords.primary[0]}`,
        );
      } else {
        keywords.push(`${serviceKeyword} for ${businessType}`);
      }
    }
  }

  // Add location-specific keywords
  if (includeLocation) {
    // Local neighborhood targeting
    for (const local of locationKeywords.local.slice(0, 5)) {
      for (const serviceKeyword of serviceTypeKeywords[service].slice(0, 2)) {
        keywords.push(`${serviceKeyword} in ${local}`);
        keywords.push(`${serviceKeyword} company ${local}`);
      }
    }

    // Add question-based search queries
    keywords.push(
      `who is the best ${service} company in ${locationKeywords.primary[0]}`,
    );
    keywords.push(
      `where to get ${service} services in ${locationKeywords.primary[0]}`,
    );
    keywords.push(
      `how to find ${service} experts in ${locationKeywords.primary[0]}`,
    );

    // Add year-specific keywords
    const currentYear = new Date().getFullYear();
    keywords.push(
      `best ${service} company ${locationKeywords.primary[0]} ${currentYear}`,
    );
    keywords.push(
      `top rated ${service} services ${locationKeywords.primary[0]} ${currentYear}`,
    );
  }

  // Return limited unique set of keywords
  return [...new Set(keywords)].slice(0, count).join(", ");
};

// Pre-generated keyword sets for main pages
export const homeKeywords = `
best digital marketing company in Madurai, 
top web development company in Madurai, 
affordable app development in Madurai,
cheapest app development near me Madurai,
web design services Madurai Tamil Nadu,
top software company in Madurai Iyer Bungalow,
professional web development agency in Madurai,
best branding company in Madurai 2025,
trusted SEO services for small business Madurai,
responsive website design company Madurai,
cost-effective digital marketing services Madurai Tamil Nadu,
custom software development company Madurai,
ecommerce website development agency Madurai,
leading IT company in Madurai Anna Nagar,
mobile app developers Madurai,
WordPress development company Madurai,
expert digital marketing services near me Madurai,
local SEO services for Madurai businesses,
website development cost in Madurai,
top app development company in Madurai reviews
`.replace(/\n/g, "");

export const aboutKeywords = `
best software company in Madurai Tamilnadu,
leading IT service provider in Madurai since 2015,
experienced web development team in Madurai reviews,
professional digital marketing experts Madurai services,
affordable technology solutions for startups Madurai,
trusted app development company near me Madurai,
skilled web developers in Madurai portfolios,
top rated IT company in Madurai jobs,
custom software development Madurai case studies,
reliable tech consultants Madurai for small business,
website design specialists in Madurai pricing,
expert mobile app developers Madurai projects,
award-winning digital marketing agency Madurai testimonials,
IT services for Madurai local businesses,
established technology company in Madurai office location,
certified web design company Madurai
`.replace(/\n/g, "");

export const contactKeywords = `
contact best web development company in Madurai location,
hire affordable app developers in Madurai near me,
website design cost quotation Madurai,
digital marketing agency contact number Madurai,
software development company consultation in Madurai,
professional IT services WhatsApp contact Madurai,
web design company office address in Madurai,
mobile app developers for hire in Madurai,
SEO services pricing in Madurai,
website development agency near me Madurai,
contact business software solutions company Madurai,
schedule free digital marketing consultation Madurai,
custom software development company contact Madurai,
GodivaTech IT company address in Madurai
`.replace(/\n/g, "");

export const servicesKeywords = `
top web development services in Madurai price list,
professional digital marketing solutions Madurai packages,
affordable mobile app development services Madurai cost,
UI/UX design services in Madurai portfolio,
custom software development for small business Madurai,
ecommerce website development Madurai for online store,
local SEO and Google Maps marketing Madurai,
social media management monthly packages Madurai,
responsive website design services Madurai examples,
Android and iOS app development company Madurai,
WordPress website development services in Madurai price,
logo and branding services packages Madurai,
website maintenance services monthly cost Madurai,
graphic design services for business cards Madurai,
enterprise software solutions for manufacturers Madurai,
cheapest web development company in Madurai reviews,
best social media marketing agency in Madurai results,
affordable SEO packages in Madurai for small businesses
`.replace(/\n/g, "");

export const blogKeywords = `
digital marketing tips for Madurai local businesses,
website development cost guide 2025 Madurai,
mobile app development process Madurai companies,
SEO strategies for Madurai small business owners,
latest website design trends for Tamil Nadu businesses,
Madurai business technology growth tips,
digital marketing success stories Madurai companies,
web development technology comparison for Madurai startups,
affordable mobile app ideas for Madurai retailers,
business growth strategies using digital marketing Madurai,
WordPress website development tutorial for Madurai businesses,
local SEO Google Map Pack ranking tips Madurai,
social media marketing strategies for Madurai restaurants,
ecommerce website features for Tamil Nadu businesses,
software development outsourcing benefits Madurai,
best website hosting services for Madurai businesses
`.replace(/\n/g, "");

export const portfolioKeywords = `
web development projects completed in Madurai,
mobile app designs for Madurai businesses,
digital marketing results for local companies Madurai,
business website designs Madurai examples,
successful SEO ranking improvements Madurai clients,
app development before and after Madurai businesses,
client success stories web development Madurai,
completed software projects for Madurai companies,
ecommerce website examples built in Madurai,
branding transformation projects for Madurai businesses,
small business website showcase Madurai,
mobile app user interface designs Madurai,
responsive website design gallery Madurai clients,
digital transformation case studies for Madurai retailers,
custom software developed for Madurai manufacturers
`.replace(/\n/g, "");
