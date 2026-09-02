import React, { useEffect, createElement } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { 
  ArrowLeft, ArrowRight, CheckCircle, Clock, 
  Users, Briefcase, Sparkles, Globe, Palette, Cloud, 
  Box, Database, CircleUser, Code, ShieldCheck, Layers,
  Video, LineChart, Film, BarChart3
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import PageTransition, { TransitionItem } from "@/components/PageTransition";
import CTASection from "@/components/home/CTASection";
import FAQSection from "@/components/ui/faq-section";
import Breadcrumb from "@/components/ui/breadcrumb";
import SEO from "@/components/SEO";
import { pageKeywords } from "@/lib/seoKeywords";
import { 
  getOrganizationData, 
  getWebPageData,
  getBreadcrumbData,
  getServiceData,
  getFaqData
} from "@/lib/structuredData";

import { SERVICES_BY_SLUG, getServiceBySlug, type ServiceDefinition } from "@shared/services-data";
import { getServiceIcon } from "@/lib/service-icons";

type ServiceType = ServiceDefinition;
const defaultServiceData = SERVICES_BY_SLUG;

const ServiceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();
  
  const { data: service, isLoading, error } = useQuery<ServiceType>({
    queryKey: [`/api/services/${slug}`],
    retry: 1,
  });
  
  // If service doesn't exist in API, use the default data or redirect to services page
  useEffect(() => {
    if (!isLoading && !service && !defaultServiceData[slug]) {
      // Redirect to the services page if the slug doesn't exist
      setLocation("/services");
    }
  }, [slug, service, isLoading, setLocation]);
  
  // Merge API data with default content so missing fields fall back to enriched defaults
  const serviceData = service ? { ...defaultServiceData[slug], ...service } : defaultServiceData[slug];
  const Icon = getServiceIcon(serviceData?.icon, serviceData?.title, slug);
  
  // If loading or redirecting, show a loading state
  if (isLoading || (!service && !defaultServiceData[slug])) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!serviceData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold mb-4">Service Not Found</h1>
        <p className="text-gray-600 mb-8">The service you are looking for does not exist or has been removed.</p>
        <Button asChild>
          <Link href="/services">Back to Services</Link>
        </Button>
      </div>
    );
  }

  // Create structured data for SEO
  const structuredData = [
    getOrganizationData(),
    getWebPageData(
      `${serviceData.title} | Best ${serviceData.title} in Madurai, Tamil Nadu`,
      `${serviceData.description} Affordable and professional ${serviceData.title.toLowerCase()} services in Madurai for local businesses.`,
      `https://godivatech.com/services/${serviceData.slug}`
    ),
    getBreadcrumbData([
      { name: "Home", item: "https://godivatech.com/" },
      { name: "Services", item: "https://godivatech.com/services" },
      { name: serviceData.title, item: `https://godivatech.com/services/${serviceData.slug}` }
    ]),
    getServiceData(
      serviceData.title,
      serviceData.description,
      `https://godivatech.com/services/${serviceData.slug}`
    )
  ];
  
  return (
    <PageTransition>
      <SEO
        title={`${serviceData.title} | Best ${serviceData.title} Services in Madurai`}
        description={`${serviceData.description} Professional and affordable ${serviceData.title.toLowerCase()} services in Madurai designed for local businesses.`}
        keywords={`${serviceData.title.toLowerCase()} Madurai, best ${serviceData.title.toLowerCase()} services Tamil Nadu, web development Madurai, digital marketing Madurai, app development Madurai`}
        canonicalUrl={`/services/${serviceData.slug}`}
        structuredData={structuredData}
      />
      
      <div className="relative">
        {/* Hero section */}
        <TransitionItem>
          <section className="bg-gradient-to-br from-primary via-primary to-purple-700 py-24 lg:py-32 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden opacity-20">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIgZD0iTTMwMCwzMDAgTDMwMCw1MCBBMjUwLDI1MCAwIDEgMSAxMDEuOTY0NzksNDUzLjAzMzAxIi8+PC9zdmc+')]"></div>
            </div>
            
            <motion.div 
              className="absolute -bottom-16 -left-16 w-64 h-64 bg-white opacity-10 rounded-full blur-xl"
              animate={{
                y: [0, -30, 0],
                opacity: [0.1, 0.15, 0.1],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            
            <div className="container mx-auto px-4 relative z-10">
              {/* Back button */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-12"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 rounded-full"
                  asChild
                >
                  <Link href="/services" className="inline-flex items-center">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Services
                  </Link>
                </Button>
              </motion.div>
              
              <div className="flex flex-col md:flex-row gap-12 items-center">
                {/* Content */}
                <motion.div 
                  className="w-full md:w-2/3 text-white"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                >
                  <h1 className="text-4xl lg:text-5xl font-bold mb-6">{serviceData.title}</h1>
                  <p className="text-xl text-white/90 mb-8">{serviceData.description}</p>
                  
                  {serviceData.features && (
                    <div className="flex flex-wrap gap-4 mb-10">
                      {serviceData.features.map((feature, idx) => (
                        <div 
                          key={idx} 
                          className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 flex items-center text-sm"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <Button 
                    size="lg" 
                    className="bg-white text-primary hover:bg-white/90 rounded-full px-8 shadow-lg"
                    asChild
                  >
                    <Link href="/contact" className="inline-flex items-center">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </motion.div>
                
                {/* Icon */}
                <motion.div 
                  className="w-full md:w-1/3 flex justify-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                >
                  <div className="relative">
                    <div className="w-48 h-48 lg:w-64 lg:h-64 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
                      <Icon className="h-24 w-24 lg:h-32 lg:w-32 text-white" />
                    </div>
                    <motion.div 
                      className="absolute inset-0 rounded-full border-2 border-white/20"
                      animate={{ 
                        scale: [1, 1.1, 1],
                        opacity: [0.5, 0.2, 0.5]
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity 
                      }}
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </section>
        </TransitionItem>
        
        {/* Main content section */}
        {/* Breadcrumb Navigation - Added for SEO and UX */}
        <TransitionItem delay={0.05}>
          <section className="py-6 bg-white border-b border-neutral-100">
            <div className="container mx-auto px-4">
              <Breadcrumb 
                items={[
                  { name: "Services", href: "/services" },
                  { name: serviceData.title, href: `/services/${serviceData.slug}`, current: true }
                ]}
              />
            </div>
          </section>
        </TransitionItem>
        
        <TransitionItem delay={0.1}>
          <section className="py-24 bg-white">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                {/* Main content */}
                <div className="lg:col-span-2">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                  >
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Overview</h2>
                    <div className="prose prose-lg max-w-none mb-12">
                      <p>{serviceData.longDescription}</p>
                    </div>
                    
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Process</h2>
                    <div className="space-y-8 mb-12">
                      {serviceData.processSteps?.map((step, idx) => (
                        <div key={idx} className="flex">
                          <div className="mr-6">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                              {idx + 1}
                            </div>
                            {idx < (serviceData.processSteps?.length || 0) - 1 && (
                              <div className="w-0.5 h-full bg-primary/10 mx-auto mt-2"></div>
                            )}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                            <p className="text-gray-600">{step.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>
                
                {/* Sidebar */}
                <div>
                  <motion.div
                    className="bg-gray-50 rounded-xl p-8 border border-gray-100 sticky top-24"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                  >
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Key Benefits</h3>
                    <ul className="space-y-4 mb-10">
                      {serviceData.benefits?.map((benefit, idx) => (
                        <li key={idx} className="flex">
                          <CheckCircle className="h-5 w-5 text-primary mr-3 shrink-0 mt-0.5" />
                          <span className="text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {serviceData.technologies && (
                      <>
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Technologies</h3>
                        <div className="flex flex-wrap gap-2 mb-10">
                          {serviceData.technologies.map((tech, idx) => (
                            <span 
                              key={idx} 
                              className="inline-block bg-white px-3 py-1 rounded-md border border-gray-200 text-sm text-gray-700"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                    
                    <Button asChild className="w-full">
                      <Link href="/contact" className="inline-flex items-center justify-center">
                        Request a Quote
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </section>
        </TransitionItem>
        
        {/* Related services section */}
        <TransitionItem delay={0.2}>
          <section className="py-24 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Related Services</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Explore our other services that complement {serviceData.title} for a comprehensive digital solution.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {Object.values(defaultServiceData)
                  .filter(s => s.slug !== slug)
                  .slice(0, 3)
                  .map((relatedService, idx) => (
                    <motion.div
                      key={relatedService.slug}
                      className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden group hover:shadow-lg transition-all"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.1 * idx }}
                    >
                      <div className="p-6">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                          {createElement(getServiceIcon(relatedService.icon, relatedService.title, relatedService.slug), { className: "h-6 w-6 text-primary" })}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                          {relatedService.title}
                        </h3>
                        <p className="text-gray-600 mb-6 line-clamp-2">
                          {relatedService.description}
                        </p>
                        <Link 
                          href={`/services/${relatedService.slug}`}
                          className="inline-flex items-center text-primary font-medium"
                        >
                          <span>Learn More</span>
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>
          </section>
        </TransitionItem>
        
        {/* FAQ Section with structured data */}
        <TransitionItem delay={0.3}>
          <FAQSection
            title={`Frequently Asked Questions About ${serviceData?.title || 'Our Services'}`}
            subtitle="Find answers to common questions about our services in Madurai"
            faqs={getFAQsForService(slug)}
            canonicalUrl={`https://godivatech.com/services/${slug}`}
          />
        </TransitionItem>
        
        {/* CTA Section */}
        <TransitionItem delay={0.4}>
          <CTASection />
        </TransitionItem>
      </div>
    </PageTransition>
  );
};

// Helper function to get FAQs based on service slug
const getFAQsForService = (slug: string): {question: string, answer: string}[] => {
  // Service-specific FAQs with geo-targeted keywords for Madurai
  const faqMap: Record<string, {question: string, answer: string}[]> = {
    'web-design-development': [
      {
        question: "How much does professional website development cost in Madurai?",
        answer: "Website development costs in Madurai typically range from ₹20,000 for basic websites to ₹1,00,000+ for complex e-commerce platforms. At GodivaTech, we offer affordable web development packages starting at ₹15,000 with flexible payment options designed specifically for Madurai businesses."
      },
      {
        question: "How long does it take to build a website in Madurai?",
        answer: "Our Madurai-based development team typically delivers simple websites within 1-2 weeks, while more complex projects may take 4-8 weeks. We follow an efficient development process to ensure timely delivery while maintaining high quality standards for all our Madurai clients."
      },
      {
        question: "Do you provide website maintenance services in Madurai?",
        answer: "Yes, GodivaTech offers comprehensive website maintenance services for businesses in Madurai. Our maintenance packages include regular updates, security monitoring, content updates, technical support, and performance optimization to keep your website running smoothly."
      },
      {
        question: "What makes GodivaTech the best web development company in Madurai?",
        answer: "As Madurai's leading web development company, we combine local market knowledge with technical expertise. We focus on creating SEO-optimized, high-performance websites that generate real business results. Our affordable pricing, personal attention, and post-launch support make us the preferred choice for businesses in Madurai and across Tamil Nadu."
      },
      {
        question: "Do you develop mobile-responsive websites for Madurai businesses?",
        answer: "Absolutely! All websites we develop for Madurai businesses are fully responsive and optimized for all devices including smartphones, tablets, and desktops. Mobile optimization is essential for local SEO in Madurai, and we ensure your website provides an excellent experience across all devices."
      }
    ],
    'digital-marketing': [
      {
        question: "What digital marketing services do you offer in Madurai?",
        answer: "Our Madurai-based digital marketing team offers comprehensive services including local SEO for Madurai businesses, Google Ads management, social media marketing for Tamil Nadu audiences, content marketing, email campaigns, and complete digital strategy development tailored to the Madurai market."
      },
      {
        question: "How much does digital marketing cost for businesses in Madurai?",
        answer: "Our digital marketing packages for Madurai businesses start at ₹10,000 per month, with customized pricing based on your specific goals and requirements. As a local Madurai company, we offer affordable rates compared to agencies from larger cities, while delivering excellent ROI for our clients."
      },
      {
        question: "How long does it take to see results from digital marketing in Madurai?",
        answer: "Most of our Madurai clients begin seeing initial results within 1-3 months. Local SEO improvements typically appear within 2-3 months, while paid advertising campaigns can generate immediate traffic. We provide transparent monthly reporting so you can track progress from the beginning of our partnership."
      },
      {
        question: "Do you specialize in local SEO for Madurai businesses?",
        answer: "Yes, we have deep expertise in local SEO specifically for the Madurai market. We help businesses improve their Google My Business presence, local directory listings, location-based keywords, and Madurai-focused content strategy to ensure you rank highly for searches in Madurai and surrounding areas in Tamil Nadu."
      },
      {
        question: "What makes GodivaTech the best digital marketing agency in Madurai?",
        answer: "As a Madurai-based company, we understand the local market dynamics better than outsiders. We combine this local knowledge with industry-leading expertise, transparent reporting, and proven results. Our team stays updated with the latest digital marketing trends while maintaining affordable pricing for local businesses."
      }
    ],
    'branding-logo-design': [
      {
        question: "How much does professional logo design cost in Madurai?",
        answer: "Our logo design packages for Madurai businesses start at ₹5,000, with complete branding packages available from ₹15,000. As a local Madurai design agency, we offer competitive rates while delivering premium quality designs that stand out in the local market."
      },
      {
        question: "What's included in your branding packages for Madurai businesses?",
        answer: "Our comprehensive branding packages for Madurai businesses include logo design, business card design, letterhead, email signature, social media profile graphics, brand color palette, typography selection, brand guidelines document, and guidance on consistent brand implementation across your marketing materials."
      },
      {
        question: "How long does the logo design process take for Madurai clients?",
        answer: "For our Madurai clients, the logo design process typically takes 1-2 weeks. This includes initial consultation to understand your business values, multiple concept presentations, revisions based on your feedback, and finalization of the selected design with all necessary file formats for different applications."
      },
      {
        question: "Do you understand the cultural preferences in Madurai for logo design?",
        answer: "Absolutely. As a Madurai-based design team, we have deep understanding of local cultural preferences, color associations, and design elements that resonate with the Madurai market. We combine this local insight with modern design principles to create logos that connect with your target audience while maintaining a professional appearance."
      },
      {
        question: "Why should I choose GodivaTech for branding in Madurai?",
        answer: "As Madurai's premier branding agency, we offer a perfect blend of local market knowledge, design expertise, and business understanding. Our designers have created successful brand identities for numerous Madurai businesses across different industries. We focus on creating brands that not only look good but also strategically position your business for growth in the local market."
      }
    ],
    'ecommerce-solutions': [
      {
        question: "How much does it cost to build an e-commerce website in Madurai?",
        answer: "Our e-commerce solutions for Madurai businesses start at ₹30,000 for basic online stores and range up to ₹1,50,000+ for custom marketplaces with advanced features. As a local Madurai development company, we offer competitive pricing while ensuring high-quality, secure online stores."
      },
      {
        question: "Which e-commerce platform do you recommend for Madurai businesses?",
        answer: "We recommend platforms based on your specific business needs. For most Madurai retailers, WooCommerce offers an excellent balance of flexibility and cost-effectiveness. For larger businesses, we might suggest Shopify or custom solutions. We help you select the best platform based on your product range, budget, and technical requirements."
      },
      {
        question: "Do you provide e-commerce training for Madurai business owners?",
        answer: "Yes, we offer comprehensive training sessions for all our Madurai e-commerce clients. We understand that many local business owners are new to online selling, so we provide easy-to-follow training on managing products, processing orders, handling shipping, and analyzing sales data through your new e-commerce platform."
      },
      {
        question: "Can you help with payment gateway integration for businesses in Madurai?",
        answer: "Absolutely! We integrate all major payment gateways that work well for Madurai businesses, including RazorPay, PayU, CCAvenue, PayTM, and international options like PayPal. We ensure secure checkout processes and help you set up the most cost-effective payment solutions for your business."
      },
      {
        question: "Do you offer ongoing support for e-commerce websites in Madurai?",
        answer: "Yes, we provide dedicated ongoing support for all e-commerce websites we build for Madurai businesses. Our support packages include regular updates, security maintenance, technical troubleshooting, and assistance with adding new products or features. We're committed to ensuring your online store remains secure and operates smoothly."
      }
    ],
    'app-development': [
      {
        question: "How much does it cost to develop a mobile app in Madurai?",
        answer: "Mobile app development costs in Madurai typically range from ₹1,00,000 for basic apps to ₹5,00,000+ for complex applications with advanced features. At GodivaTech, we offer the most competitive app development rates in Madurai while maintaining excellent quality standards."
      },
      {
        question: "How long does it take to develop a mobile app in Madurai?",
        answer: "The timeline for mobile app development in Madurai generally ranges from 2-3 months for simpler apps to 4-6 months for more complex applications. Our Madurai-based development team follows an agile approach with regular updates and milestone deliveries throughout the development process."
      },
      {
        question: "Do you develop apps for both Android and iOS in Madurai?",
        answer: "Yes, our Madurai app development team creates applications for both Android and iOS platforms. We typically use cross-platform frameworks like React Native or Flutter to develop cost-effective solutions that work seamlessly across both operating systems, providing maximum reach for your Madurai business."
      },
      {
        question: "What makes GodivaTech the best app development company in Madurai?",
        answer: "As Madurai's leading app development company, we combine technical expertise with deep understanding of local business needs. Our apps are designed with user experience as a priority, ensuring higher adoption rates and user satisfaction. We offer affordable pricing compared to national agencies, post-launch support, and maintenance services."
      },
      {
        question: "Do you provide app maintenance services in Madurai?",
        answer: "Yes, we offer comprehensive app maintenance services for all applications developed by us. Our Madurai-based support team handles updates for new OS versions, bug fixes, security patches, and feature enhancements. We provide flexible maintenance packages to ensure your app continues to perform optimally."
      }
    ],
    'corporate-video-production': [
      {
        question: "What types of corporate video production services do you offer?",
        answer: "We produce a comprehensive range of corporate videos including brand story films, promotional advertisements, 3D product explainers, executive interviews, training modules, client testimonials, and dynamic social media reels."
      },
      {
        question: "What is the typical turnaround time for a corporate video?",
        answer: "Depending on project scope, scripting, and post-production requirements, most corporate video projects are completed within 2 to 4 weeks from initial concept approval to final delivery."
      },
      {
        question: "Do you provide scriptwriting, voiceover, and drone filming?",
        answer: "Yes, our video production package is complete end-to-end. We handle professional scriptwriting, professional voiceover artists across multiple languages, 4K drone cinematography, motion graphics, and audio mastering."
      }
    ],
    'data-analytics': [
      {
        question: "How can data analytics and BI benefit my business?",
        answer: "Data analytics transforms fragmented data from your sales, marketing, operations, and CRM systems into real-time visual dashboards. This eliminates guesswork, automates reporting, identifies bottlenecks, and highlights new revenue opportunities."
      },
      {
        question: "Which business intelligence tools and platforms do you support?",
        answer: "We build custom solutions using Power BI, Tableau, Google Looker Studio, Python, SQL, BigQuery, and Snowflake, integrating seamlessly with your current software stack."
      },
      {
        question: "Can you connect and unify data from multiple separate platforms?",
        answer: "Yes, we build automated ETL (Extract, Transform, Load) data pipelines that sync data from ERPs, e-commerce stores, CRMs, marketing platforms, and databases into a single, cohesive dashboard."
      }
    ],
    // Default FAQs for any other service
    'default': [
      {
        question: "What makes GodivaTech the best technology company in Madurai?",
        answer: "As a Madurai-based technology company, we combine local market knowledge with technical expertise to deliver solutions that drive real business results. Our affordable pricing, personalized service, and commitment to client success make us the preferred technology partner for businesses across Madurai and Tamil Nadu."
      },
      {
        question: "How do you ensure the quality of your services in Madurai?",
        answer: "We follow strict quality assurance processes for all our Madurai clients. This includes comprehensive testing, regular client reviews during project development, adherence to industry best practices, and continuous training for our team to stay updated with the latest technologies and trends."
      },
      {
        question: "Do you offer support after project completion for Madurai clients?",
        answer: "Absolutely! We provide dedicated post-project support for all our Madurai clients. Our support packages include technical assistance, maintenance, updates, and training to ensure your technology solutions continue to perform optimally and drive business growth."
      },
      {
        question: "What types of businesses in Madurai do you typically work with?",
        answer: "We work with a diverse range of businesses in Madurai, from small local retailers and service providers to medium-sized companies and educational institutions. Our solutions are scalable and can be customized to meet the specific needs and budget constraints of different business types in Madurai."
      },
      {
        question: "How can I get started with GodivaTech for my Madurai business?",
        answer: "Getting started is easy! Simply contact us through our website, email, or phone to schedule a free initial consultation. During this meeting, we'll discuss your business needs, objectives, and budget to provide you with a customized proposal for your Madurai business."
      }
    ]
  };
  
  // Return service-specific FAQs or default FAQs if the service isn't found
  return faqMap[slug] || faqMap['default'];
};

export default ServiceDetail;