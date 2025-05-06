/**
 * SEO Keywords for GodivaTech Website
 * 
 * This file defines location-specific and service-specific keywords
 * to enhance the site's search engine visibility and local targeting.
 */

// Location-specific SEO targeting
export const locationKeywords = {
  primaryCity: "Madurai",
  region: "Tamil Nadu",
  country: "India",
  postalCodes: {
    annaNagar: "625020", 
    iyerBungalow: "625014",
    tamilSangam: "625016",
    sindhupuram: "625007",
    aavinDairy: "625010",
    kKNagar: "625020"
  },
  neighborhoods: {
    webDevelopment: ["Anna Nagar", "K K Nagar", "Kochadai"],
    mobileApp: ["Iyer Bungalow", "Gomathipuram", "Arasaradi"],
    digitalMarketing: ["Anna Nagar", "Tamil Sangam Colony", "S S Colony"],
    branding: ["Anna Nagar", "Teppakulam", "Goripalayam"],
    software: ["Iyer Bungalow", "Nagamalai", "Vilangudi"]
  },
  nearbyAreas: [
    "Trichy Road",
    "Dindigul Road",
    "Melur Road",
    "Sivaganga Road",
    "Virudhunagar Road",
    "Theni Road"
  ]
};

// Home page keywords
export const homeKeywords = "web development company Madurai, app development Madurai, website designers Anna Nagar, digital marketing services Tamil Nadu, affordable web development Madurai, custom software development Iyer Bungalow, website design agency K K Nagar, local marketing agency Madurai, web development price Madurai";

// About page keywords
export const aboutKeywords = "top web development company Madurai, best IT services Madurai, experienced web designers Anna Nagar, professional app developers Iyer Bungalow, IT company history Madurai, software development team Tamil Nadu, leading digital agency Madurai, tech experts K K Nagar";

// Services page keywords
export const servicesKeywords = "IT services Madurai, web development services Anna Nagar, app development Iyer Bungalow, digital marketing services K K Nagar, custom software development Madurai, ecommerce website development Tamil Nadu, responsive web design Madurai, SEO services Madurai, website maintenance services Anna Nagar";

// Get service-specific keywords based on service name
export const getServiceKeywords = (serviceName: string) => {
  const serviceKeywordsMap: Record<string, string> = {
    "Web Design & Development": "custom website development Madurai, responsive web design Anna Nagar, ecommerce website developers Madurai, WordPress experts Tamil Nadu, affordable web design K K Nagar, professional website designers Madurai, SEO-friendly websites Anna Nagar, custom web applications Iyer Bungalow",
    
    "Branding & Logo Design": "logo design services Madurai, branding agency Anna Nagar, corporate identity design Madurai, brand strategy Tamil Nadu, professional logo designers K K Nagar, visual identity experts Madurai, custom logo creation Anna Nagar, brand guideline development Iyer Bungalow",
    
    "Digital Marketing": "digital marketing services Madurai, SEO services Anna Nagar, social media marketing Madurai, PPC campaigns Tamil Nadu, content marketing K K Nagar, local SEO Madurai, email marketing Anna Nagar, digital marketing agency Iyer Bungalow",
    
    "E-commerce Solutions": "ecommerce website development Madurai, online store creation Anna Nagar, shopping cart integration Madurai, payment gateway setup Tamil Nadu, inventory management systems K K Nagar, product catalog design Madurai, ecommerce SEO Anna Nagar, mobile shopping experience Iyer Bungalow",
    
    "Web Hosting & Maintenance": "website hosting services Madurai, web maintenance Anna Nagar, website security Madurai, performance optimization Tamil Nadu, website updates K K Nagar, technical support services Madurai, affordable web hosting Anna Nagar, website backup solutions Iyer Bungalow",
    
    "UI/UX Design": "user interface design Madurai, user experience services Anna Nagar, UI/UX designers Madurai, wireframing and prototyping Tamil Nadu, usability testing K K Nagar, mobile app UI design Madurai, web interface design Anna Nagar, user-centered design Iyer Bungalow"
  };
  
  // Return service-specific keywords or a default if not found
  return serviceKeywordsMap[serviceName] || servicesKeywords;
};

// Portfolio page keywords
export const portfolioKeywords = "web development portfolio Madurai, mobile app projects Anna Nagar, website samples Madurai, digital marketing case studies Tamil Nadu, successful web projects K K Nagar, client websites Madurai, app development showcase Anna Nagar, completed projects Iyer Bungalow";

// Blog page keywords
export const blogKeywords = "web development blog Madurai, digital marketing tips Anna Nagar, tech news Madurai, IT insights Tamil Nadu, web design tutorials K K Nagar, app development guides Madurai, SEO blog Anna Nagar, technology trends Iyer Bungalow";

// Contact page keywords
export const contactKeywords = "contact web development company Madurai, hire web designers Anna Nagar, app development consultation Madurai, digital marketing quotes Tamil Nadu, web project inquiry K K Nagar, IT services contact Madurai, get in touch Anna Nagar, free consultation Iyer Bungalow";

// Get location-specific SEO description
export const getLocationSpecificDescription = (
  baseDescription: string,
  neighborhood: string = "Anna Nagar"
) => {
  // Extract the main description without unnecessary information
  const mainPart = baseDescription.split('.')[0];
  
  // Add location-specific information
  return `${mainPart}. Based in ${neighborhood}, Madurai, Tamil Nadu, we provide custom solutions tailored to local businesses and enterprises throughout Southern India.`;
};

// Get city-specific meta title
export const getCitySpecificTitle = (
  baseTitle: string,
  city: string = "Madurai"
) => {
  if (baseTitle.includes(city)) {
    return baseTitle;
  }
  
  // If title doesn't contain city name, add it
  return `${baseTitle} in ${city}`;
};