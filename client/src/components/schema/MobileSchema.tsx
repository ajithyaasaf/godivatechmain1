import React from 'react';
import { createMobileAppStructuredData, createMobileFAQStructuredData, createMobileBreadcrumbStructuredData, createMobileServiceStructuredData } from '@/lib/mobileOptimization';
import { locationKeywords } from '@/lib/seoKeywords';

/**
 * Props for MobileSchema component
 */
interface MobileSchemaProps {
  type: 'app' | 'faq' | 'breadcrumb' | 'service';
  data: any;
  pageUrl: string;
  title?: string;
  categoryName?: string;
}

/**
 * MobileSchema Component - Creates schema markup optimized for mobile SEO
 * 
 * This specialized component generates structured data JSON-LD for mobile search results.
 * It supports several schema types optimized for mobile display and helps with rich results.
 * 
 * @param type Type of schema: 'app', 'faq', 'breadcrumb', or 'service'
 * @param data Schema-specific data
 * @param pageUrl The canonical URL of the page
 * @param title Optional page title (for some schema types)
 * @param categoryName Optional category name (for content categorization)
 */
const MobileSchema: React.FC<MobileSchemaProps> = ({ 
  type, 
  data, 
  pageUrl,
  title = '',
  categoryName = ''
}) => {
  // Determine the appropriate schema data based on type
  const getSchemaData = () => {
    switch (type) {
      case 'app':
        return createMobileAppStructuredData(pageUrl, title, data, categoryName);
      
      case 'faq':
        return createMobileFAQStructuredData(data);
      
      case 'breadcrumb':
        return createMobileBreadcrumbStructuredData(data, data.cityName || 'Madurai');
      
      case 'service':
        return createMobileServiceStructuredData(data, pageUrl);
      
      default:
        return {};
    }
  };

  // Generate the actual schema data
  const schemaData = getSchemaData();

  return (
    <script 
      type="application/ld+json"
      dangerouslySetInnerHTML={{ 
        __html: JSON.stringify(schemaData, null, 0)
      }}
    />
  );
};

/**
 * FAQs specifically for mobile SEO
 */
export const getCommonServiceFAQs = (serviceName: string, cityName = 'Madurai') => {
  // Get appropriate neighborhood for this service type
  let neighborhood = "";

  // Map service to appropriate neighborhood for local SEO
  if (serviceName.toLowerCase().includes('web')) {
    neighborhood = locationKeywords.neighborhoods.webDevelopment?.[0] || "Anna Nagar";
  } else if (serviceName.toLowerCase().includes('app')) {
    neighborhood = locationKeywords.neighborhoods.mobileApp?.[0] || "Iyer Bungalow";
  } else if (serviceName.toLowerCase().includes('digital') || serviceName.toLowerCase().includes('seo')) {
    neighborhood = locationKeywords.neighborhoods.digitalMarketing?.[0] || "Anna Nagar";
  } else if (serviceName.toLowerCase().includes('brand')) {
    neighborhood = locationKeywords.neighborhoods.branding?.[0] || "Anna Nagar";
  } else {
    neighborhood = locationKeywords.neighborhoods.software?.[0] || "Iyer Bungalow";
  }

  // Default questions with service and location inserted
  return [
    {
      question: `What is the cost of ${serviceName} in ${cityName}?`,
      answer: `The cost of ${serviceName} in ${cityName} varies depending on project complexity and requirements. GodivaTech offers competitive pricing starting from ₹15,000 for basic services. Contact us for a custom quote tailored to your specific needs.`
    },
    {
      question: `Who is the best ${serviceName} provider in ${cityName}?`,
      answer: `GodivaTech is recognized as one of the leading ${serviceName} providers in ${cityName}, especially in the ${neighborhood} area. With years of experience, a portfolio of successful projects, and consistently positive client reviews, we deliver high-quality solutions for businesses of all sizes.`
    },
    {
      question: `How long does ${serviceName} take to complete in ${cityName}?`,
      answer: `The timeline for ${serviceName} in ${cityName} typically ranges from 2-8 weeks depending on project scope and complexity. At GodivaTech, located in ${neighborhood}, ${cityName}, we emphasize clear project timelines and regular updates throughout the development process.`
    },
    {
      question: `What makes GodivaTech's ${serviceName} different from other providers in ${cityName}?`,
      answer: `GodivaTech's ${serviceName} stands out in ${cityName} through our focus on performance optimization, local SEO enhancements, and industry-specific solutions. Our team based in ${neighborhood} combines technical expertise with deep understanding of local market needs in ${cityName} and Tamil Nadu.`
    },
    {
      question: `Do you offer maintenance services after ${serviceName} project completion in ${cityName}?`,
      answer: `Yes, GodivaTech provides comprehensive maintenance and support services for all ${serviceName} projects in ${cityName}. Our service packages include regular updates, technical support, performance monitoring, and security enhancements to ensure your digital assets continue performing optimally.`
    }
  ];
};

export default MobileSchema;