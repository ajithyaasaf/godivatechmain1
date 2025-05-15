import React, { useState, useEffect, useMemo, memo } from "react";
import { motion, LazyMotion, domAnimation, m } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import SEO from "@/components/SEO";
import { pageKeywords } from "@/lib/seoKeywords";
import { 
  getOrganizationData, 
  getWebPageData,
  getBreadcrumbData 
} from "@/lib/structuredData";
import MobileSchema, { getCommonServiceFAQs } from "@/components/schema/MobileSchema";
import { createMobileServiceStructuredData } from "@/lib/mobileOptimization";
import { 
  Activity, Heart, BarChart4, CheckCircle, Building2, Truck,
  GraduationCap, ArrowRight, Globe, Layers, Code, Cloud, 
  Database, Palette, BrainCircuit, BarChart, ShieldCheck,
  Cpu, ScrollText, Users, Box, Bookmark, ChevronRight, 
  CheckCircle2, Sparkles, FileCheck, MessageCircle
} from "lucide-react";
import ServiceSection from "@/components/home/ServiceSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import CTASection from "@/components/home/CTASection";
import PageTransition, { TransitionItem } from "@/components/PageTransition";
import { useQuery } from "@tanstack/react-query";

// Industry card component with animation - optimized with memo and CSS animations
const IndustryCard = memo(({ icon: Icon, title, description, index }: { 
  icon: React.ElementType, 
  title: string, 
  description: string,
  index: number
}) => {
  return (
    <LazyMotion features={domAnimation}>
      <m.div 
        className="bg-white rounded-xl shadow-lg p-8 border border-neutral-100 h-full transform hover:-translate-y-2 hover:shadow-xl transition-all duration-300"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 20,
          delay: index * 0.1
        }}
      >
        <div className="relative w-16 h-16 mb-6">
          <div 
            className={`absolute inset-0 rounded-xl bg-primary/10 z-0 ${index % 2 === 0 ? 'animate-pulse-slow' : 'animate-float-slow'}`}
          />
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <Icon className="text-primary h-7 w-7" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-neutral-800 mb-3">{title}</h3>
        <p className="text-neutral-600">
          {description}
        </p>
      </m.div>
    </LazyMotion>
  );
});

// Service approach step component - optimized with memo and LazyMotion
const ServiceStep = memo(({ number, title, description, delay }: {
  number: number;
  title: string;
  description: string;
  delay: number;
}) => (
  <LazyMotion features={domAnimation}>
    <m.div 
      className="flex items-start"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
    >
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold mr-4 shrink-0 relative">
        <div className="absolute inset-0 rounded-full bg-primary/5 animate-pulse-slow"></div>
        <span className="relative z-10">{number}</span>
      </div>
      <div>
        <h3 className="text-xl font-semibold text-neutral-800 mb-2">{title}</h3>
        <p className="text-neutral-600">
          {description}
        </p>
      </div>
    </m.div>
  </LazyMotion>
));

// Service Card component for main services section - optimized with memo and LazyMotion
const EnterpriseServiceCard = memo(({ 
  icon: Icon, 
  title, 
  description, 
  path, 
  features = [], 
  index 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string; 
  path: string; 
  features?: string[];
  index: number;
}) => {
  return (
    <LazyMotion features={domAnimation}>
      <m.div 
        className="bg-white rounded-xl shadow-xl overflow-hidden group border border-neutral-100 hover:border-primary/20 transition-all duration-300 h-full flex flex-col"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
      >
        <div className="p-8 flex-grow flex flex-col">
          <div className="mb-6 relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
              <Icon className="text-primary h-8 w-8" />
            </div>
            <div 
              className="absolute top-0 right-0 w-20 h-20 opacity-10 animate-pulse-slow"
              style={{
                background: `radial-gradient(circle at center, var(--primary) 0%, transparent 70%)`,
              }}
            />
          </div>
          
          <h3 className="text-2xl font-bold text-neutral-800 mb-4 group-hover:text-primary transition-colors">
            {title}
          </h3>
          
          <p className="text-neutral-600 mb-6">
            {description}
          </p>
          
          {features.length > 0 && (
            <div className="space-y-3 mb-6">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-start">
                  <div className="text-primary mr-3 mt-1">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <span className="text-neutral-700">{feature}</span>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-auto pt-4">
            <Link 
              href={path} 
              className="inline-flex items-center text-primary font-medium group/link"
            >
              <span>Learn More</span>
              <span className="ml-2 transform group-hover/link:translate-x-1 transition-transform duration-300">
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </div>
        
        <div className="h-1.5 w-full bg-gradient-to-r from-primary via-primary to-indigo-600 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
      </m.div>
    </LazyMotion>
  );
});

interface ServiceType {
  id: number;
  title: string;
  description: string;
  icon?: React.ElementType;
  slug: string;
  features?: string[];
}

const Services = () => {
  const { data: apiServices = [] } = useQuery<ServiceType[]>({
    queryKey: ['/api/services'],
  });
  
  const [location] = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  
  // Prepare structured data for SEO
  const servicesStructuredData = useMemo(() => [
    getOrganizationData(),
    getWebPageData(
      "Best Web Development & Digital Marketing Services in Madurai | GodivaTech",
      "GodivaTech offers affordable web development, app development, and digital marketing services in Madurai. Get custom IT solutions at competitive prices for your business.",
      "https://godivatech.com/services"
    ),
    getBreadcrumbData([
      { name: "Home", item: "https://godivatech.com/" },
      { name: "Services", item: "https://godivatech.com/services" }
    ])
  ], []);

  // Detect mobile devices for serving optimized content
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileKeywords = ['android', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];
      const isMobileDevice = mobileKeywords.some(keyword => userAgent.indexOf(keyword) !== -1) || window.innerWidth < 768;
      setIsMobile(isMobileDevice);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  // Enterprise level services data
  const enterpriseServices: ServiceType[] = [
    { 
      id: 1,
      icon: Globe, 
      title: "Web Design & Development", 
      description: "Custom websites with responsive designs that work seamlessly across all devices, providing optimal user experiences.",
      slug: "web-design-development",
      features: ["Responsive Design", "SEO Optimization", "Custom CMS Integration"]
    },
    { 
      id: 2,
      icon: Palette, 
      title: "Branding & Logo Design", 
      description: "Comprehensive branding solutions that help establish your unique identity in the market.",
      slug: "branding-logo-design",
      features: ["Logo Creation", "Brand Guidelines", "Visual Identity Systems"]
    },
    { 
      id: 3,
      icon: Cloud, 
      title: "Digital Marketing", 
      description: "Strategic marketing solutions to increase your online visibility, engage with customers, and drive conversions.",
      slug: "digital-marketing",
      features: ["SEO & SEM", "Social Media Marketing", "Content Strategy"]
    },
    { 
      id: 4,
      icon: Box, 
      title: "E-commerce Solutions", 
      description: "End-to-end e-commerce platforms with secure payment processing and inventory management systems.",
      slug: "ecommerce-solutions",
      features: ["Secure Payments", "Inventory Management", "Mobile Shopping Experience"]
    },
    { 
      id: 5,
      icon: Database, 
      title: "Web Hosting & Maintenance", 
      description: "Reliable hosting solutions with regular maintenance to ensure your website remains secure and performs optimally.",
      slug: "web-hosting-maintenance",
      features: ["24/7 Support", "Security Updates", "Performance Optimization"]
    },
    { 
      id: 6,
      icon: Users, 
      title: "UI/UX Design", 
      description: "User-centered design approaches that enhance usability and create engaging digital experiences.",
      slug: "ui-ux-design",
      features: ["User Research", "Wireframing & Prototyping", "Usability Testing"]
    }
  ];
  
  // Combine API services with default services if needed
  const services = apiServices.length > 0 ? apiServices : enterpriseServices;
  
  // Industry data
  const industries = [
    { 
      icon: Heart, 
      title: "Healthcare", 
      description: "Custom websites and marketing solutions for clinics, hospitals and healthcare providers to enhance patient engagement."
    },
    { 
      icon: BarChart4, 
      title: "Food & Restaurants", 
      description: "Engaging websites, social media marketing and branding solutions for restaurants, catering services and food businesses."
    },
    { 
      icon: Activity, 
      title: "Retail & E-commerce", 
      description: "Online stores, digital marketing campaigns and branded content to help retail businesses increase sales."
    },
    { 
      icon: Building2, 
      title: "Real Estate", 
      description: "Property listing websites, virtual tours and promotional content for real estate agents and property developers."
    },
    { 
      icon: GraduationCap, 
      title: "Education", 
      description: "Websites, learning platforms and branding solutions for educational institutions and training centers."
    },
    { 
      icon: Truck, 
      title: "Local Businesses", 
      description: "Affordable web development and digital marketing services for small businesses in Madurai and beyond."
    }
  ];
  
  return (
    <PageTransition>
      <SEO
        title="Best Web Development & Digital Marketing in Madurai | GodivaTech"
        description="GodivaTech provides the best web development, digital marketing, and software development services in Madurai and Tamil Nadu. Award-winning solutions at competitive prices."
        keywords={pageKeywords.services.join(", ")}
        canonicalUrl="https://godivatech.com/services"
        ogType="website"
        ogImage="https://godivatech.com/images/services-og-image.jpg"
        imageWidth={1200}
        imageHeight={630}
        cityName="Madurai"
        regionName="Tamil Nadu"
        countryName="India"
        postalCode="625020"
        neighborhood="Anna Nagar"
        twitterCard="summary_large_image"
        twitterSite="@godivatech"
        twitterCreator="@godivatech"
        modifiedTime={new Date().toISOString()}
        facebookAppId="107394345671850"
        priceRange="₹₹"
        telephoneNumber="+91-96005-20130"
        businessHours={['Mo-Fr 09:00-18:00', 'Sa 10:00-16:00']}
        servicedArea={['Madurai', 'Coimbatore', 'Trichy', 'Chennai', 'Tamil Nadu']}
        robots="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        alternateUrls={[
          { hrefLang: "en-in", href: "https://godivatech.com/services" },
          { hrefLang: "ta-in", href: "https://godivatech.com/ta/services" }
        ]}
        structuredData={[
          getOrganizationData(),
          getWebPageData(
            "Best Web Development & Digital Marketing in Madurai | GodivaTech",
            "GodivaTech provides the best web development, digital marketing, and software development services in Madurai and Tamil Nadu. Award-winning solutions at competitive prices.",
            "https://godivatech.com/services"
          ),
          getBreadcrumbData([
            { name: "Home", item: "https://godivatech.com/" },
            { name: "Best Services in Madurai", item: "https://godivatech.com/services" }
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Best Web Development in Madurai",
            "serviceType": "Web Development",
            "provider": {
              "@type": "Organization",
              "name": "GodivaTech",
              "areaServed": {
                "@type": "State",
                "name": "Tamil Nadu"
              }
            },
            "areaServed": {
              "@type": "City",
              "name": "Madurai"
            },
            "description": "Professional web development services for businesses in Madurai, featuring responsive design, ecommerce solutions, and custom CMS development.",
            "offers": {
              "@type": "Offer",
              "price": "20000",
              "priceCurrency": "INR"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "ratingCount": "89",
              "bestRating": "5"
            }
          }
        ]}
      />
      
      {/* Add mobile-specific schema for better search results on mobile devices */}
      {isMobile && (
        <>
          {/* FAQ Schema for mobile rich results with target keywords */}
          <MobileSchema 
            type="faq" 
            data={[
              {
                question: "Who offers the best web development services in Madurai?",
                answer: "GodivaTech is recognized as the best web development company in Madurai, delivering high-quality, responsive websites with advanced functionality for businesses throughout Tamil Nadu."
              },
              {
                question: "What makes GodivaTech the best digital marketing agency in Madurai?",
                answer: "GodivaTech's digital marketing services in Madurai combine advanced SEO techniques, targeted social media campaigns, and data-driven strategies to maximize ROI, making us the best digital marketing partner for local businesses."
              },
              {
                question: "Why choose GodivaTech for software development in Madurai?",
                answer: "As the best software development company in Madurai, GodivaTech creates custom business applications, enterprise solutions, and mobile apps with cutting-edge technology and local business expertise."
              },
              {
                question: "Does GodivaTech offer the best logo design services in Madurai?",
                answer: "Yes, GodivaTech provides the best logo design services in Madurai with a team of creative designers who craft unique brand identities that perfectly represent your business values and appeal to your target audience."
              },
              {
                question: "How does GodivaTech compare to other web development companies in Tamil Nadu?",
                answer: "GodivaTech stands out as the best web development company in Tamil Nadu through our combination of technical expertise, industry knowledge, affordable pricing, and exceptional support for businesses across the state."
              }
            ]}
            pageUrl="https://godivatech.com/services" 
          />
          
          {/* Add mobile breadcrumb for location-specific searches */}
          <MobileSchema 
            type="breadcrumb" 
            data={[
              { name: "Home", url: "https://godivatech.com/" },
              { name: "Best Digital Services in Madurai", url: "https://godivatech.com/services" }
            ]}
            pageUrl="https://godivatech.com/services"
            categoryName="Best Services"
          />
          
          {/* Service Schema for mobile rankings with target keywords */}
          <MobileSchema 
            type="service" 
            data={{
              name: "Best Web Development & Digital Marketing in Madurai",
              description: "Award-winning web development, digital marketing, software development, and logo design services for businesses in Madurai and throughout Tamil Nadu.",
              category: "Professional Technology Services",
              image: "https://godivatech.com/images/services-overview.jpg"
            }}
            pageUrl="https://godivatech.com/services"
          />
        </>
      )}
      
      <div className="relative">
        {/* Hero section */}
        <TransitionItem>
          <section className="relative py-28 md:py-32 overflow-hidden">
            {/* Background with gradient and effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-purple-700"></div>
            
            {/* Animated background patterns */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIgZD0iTTMwMCwzMDAgTDMwMCw1MCBBMjUwLDI1MCAwIDEgMSAxMDEuOTY0NzksNDUzLjAzMzAxIi8+PC9zdmc+')]"></div>
              {/* Replaced JavaScript animation with CSS animation for better performance */}
              <div 
                className="absolute inset-0 animate-slide-pattern"
                style={{
                  backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
                  backgroundSize: '30px 30px',
                }}
              />
            </div>
            
            {/* Content */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center max-w-4xl mx-auto text-white">
                <div className="inline-flex items-center justify-center mb-6 px-3 py-1 rounded-full bg-white/10 border border-white/20">
                  <span className="text-white/90 font-semibold text-sm">ENTERPRISE SOLUTIONS</span>
                </div>
                
                <motion.h1 
                  className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <span className="text-white/90">Best Web Development</span> & Digital Marketing in <span className="text-white/90">Madurai</span>
                </motion.h1>
                
                <motion.p 
                  className="text-xl text-white/90 mb-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  Award-winning software development, website design, and digital marketing services that deliver exceptional results for businesses throughout Tamil Nadu. Trusted by leading companies for our expertise and local knowledge.
                </motion.p>
                
                <motion.div
                  className="flex flex-col sm:flex-row items-center justify-center gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <Button 
                    asChild 
                    size="lg"
                    className="bg-white text-primary hover:bg-white/90 rounded-full px-8 shadow-lg"
                  >
                    <Link href="/contact" className="flex items-center">
                      Schedule a Consultation
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  
                  <Button 
                    asChild 
                    size="lg"
                    variant="outline" 
                    className="bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white hover:bg-white/20 rounded-full px-8"
                  >
                    <Link href="#services-overview" className="flex items-center">
                      Explore Services
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </div>
            
            {/* Decorative elements - replaced JS animations with CSS animations */}
            <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-white opacity-10 rounded-full blur-xl animate-float-blob"></div>
            <div className="absolute -bottom-32 -right-20 w-64 h-64 bg-indigo-300 opacity-10 rounded-full blur-3xl animate-float-reverse"></div>
          </section>
        </TransitionItem>

        {/* Enterprise Services Overview Section */}
        <TransitionItem delay={0.1}>
          <section id="services-overview" className="py-24 bg-gray-50 relative">
            {/* Subtle pattern background */}
            <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0aC0ydi00aDJ2NHptMC02aC0ydi00aDJ2NHptMC02aC0ydi00aDJ2NHptMC02aC0yVjhoMnY0em0wIDE4aC0ydi00aDJ2NHptMCA2aC0ydi00aDJ2NHptMCA2aC0ydi00aDJ2NHptMCA2aC0ydi00aDJ2NHptLTYgMEgyOHYtNGgydjR6bS02IDBoLTR2LTRoNHY0em0tNiAwaC00di00aDR2NHptLTYgMEg4di00aDR2NHptMC02aC00di00aDR2NHptMC02aC00di00aDR2NHptMC02aC00di00aDR2NHptMC02aC00VjhoNHY0em0wLTZoLTRWOGg0djR6TTI4IDh2NGgtMlY4aDJ6bTYgMGgydjRoLTJWOHptNiAwaDJ2NGgtMlY4em02IDBoMnY0aC0yVjh6bTYgMGg0djRoLTRWOHptMCA2aDR2NGgtNHYtNHptMCA2aDR2NGgtNHYtNHptMCA2aDR2NGgtNHYtNHptMCA2aDR2NGgtNHYtNHptMCA2aDR2NGgtNHYtNHptLTYgMGgydjRoLTJ2LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] bg-repeat" />
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center mb-16">
                <motion.div 
                  className="inline-flex items-center justify-center mb-4 px-3 py-1 rounded-full bg-primary/5 border border-primary/10"
                  initial={{ opacity: 0, y: -10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="text-primary font-semibold text-sm">OUR SERVICES</span>
                </motion.div>
                
                <motion.h2 
                  className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  Enterprise-Grade Solutions
                </motion.h2>
                
                <motion.p 
                  className="text-xl text-gray-600 max-w-3xl mx-auto"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  We deliver tailored technology solutions designed to meet the unique challenges and opportunities of your business.
                </motion.p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service, index) => (
                  <EnterpriseServiceCard 
                    key={service.id || index}
                    icon={service.icon || Globe}
                    title={service.title}
                    description={service.description}
                    path={`/services/${service.slug}`}
                    features={service.features || []}
                    index={index}
                  />
                ))}
              </div>
              
              <div className="mt-16 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="text-gray-600 mb-6">Need a custom solution for your specific business challenge?</p>
                  <Button 
                    asChild 
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 shadow-md"
                  >
                    <Link href="/contact" className="flex items-center">
                      Request Custom Solution
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </div>
          </section>
        </TransitionItem>

        {/* Service approach section */}
        <TransitionItem delay={0.2}>
          <section className="py-24 bg-white/50 backdrop-blur-sm relative overflow-hidden">
            {/* Subtle background */}
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-50/50 to-white/80 z-0" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMSI+PHBhdGggZD0iTTM2IDM0aC0ydi00aDJ2NHptMC02aC0ydi00aDJ2NHptMC02aC0ydi00aDJ2NHptMC02aC0yVjhoMnY0em0wIDE4aC0ydi00aDJ2NHptMCA2aC0ydi00aDJ2NHptMCA2aC0ydi00aDJ2NHptMCA2aC0ydi00aDJ2NHptLTYgMEgyOHYtNGgydjR6bS02IDBoLTR2LTRoNHY0em0tNiAwaC00di00aDR2NHptLTYgMEg4di00aDR2NHptMC02aC00di00aDR2NHptMC02aC00di00aDR2NHptMC02aC00di00aDR2NHptMC02aC00VjhoNHY0em0wLTZoLTRWOGg0djR6TTI4IDh2NGgtMlY4aDJ6bTYgMGgydjRoLTJWOHptNiAwaDJ2NGgtMlY4em02IDBoMnY0aC0yVjh6bTYgMGg0djRoLTRWOHptMCA2aDR2NGgtNHYtNHptMCA2aDR2NGgtNHYtNHptMCA2aDR2NGgtNHYtNHptMCA2aDR2NGgtNHYtNHptMCA2aDR2NGgtNHYtNHptLTYgMGgydjRoLTJ2LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-5 bg-fixed" />
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <motion.div
                    className="inline-flex items-center justify-center mb-4 px-3 py-1 rounded-full bg-primary/5 border border-primary/10"
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <span className="text-primary font-semibold text-sm">OUR APPROACH</span>
                  </motion.div>
                  
                  <motion.h2 
                    className="text-4xl font-bold text-gray-900 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    How We Deliver Exceptional Results
                  </motion.h2>
                  
                  <motion.p 
                    className="text-xl text-gray-600 mb-10"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    Our structured methodology ensures that every project is completed to the highest standards, on time and within budget.
                  </motion.p>
                  
                  <div className="space-y-8">
                    <ServiceStep 
                      number={1}
                      title="Discovery and Planning"
                      description="We begin by understanding your business goals, target audience, and unique requirements to create a comprehensive project plan."
                      delay={0.3}
                    />
                    
                    <ServiceStep 
                      number={2}
                      title="Design and Prototyping"
                      description="Our designers create intuitive user interfaces and engaging visuals that align with your brand identity and business objectives."
                      delay={0.4}
                    />
                    
                    <ServiceStep 
                      number={3}
                      title="Development and Testing"
                      description="Our development team builds your solution using cutting-edge technologies, with rigorous testing throughout the process."
                      delay={0.5}
                    />
                    
                    <ServiceStep 
                      number={4}
                      title="Deployment and Support"
                      description="We launch your project with care and provide ongoing maintenance and support to ensure continued success."
                      delay={0.6}
                    />
                  </div>
                </div>
                
                <div className="relative mt-10 lg:mt-0">
                  <div className="relative">
                    {/* Replaced JS animation with CSS animation */}
                    <div className="absolute -top-10 -left-10 w-64 h-64 bg-primary opacity-5 rounded-full animate-pulse-slow"></div>
                    
                    <LazyMotion features={domAnimation}>
                      <m.div 
                        className="relative z-10 bg-gradient-to-br from-primary to-purple-700 rounded-2xl shadow-xl p-8 text-white"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                      >
                        <div className="mb-6">
                          <div className="bg-white/10 h-16 w-16 rounded-full flex items-center justify-center mb-4 relative overflow-hidden">
                            <div className="absolute inset-0 bg-white/5 animate-pulse-slow"></div>
                            <Sparkles className="h-8 w-8 text-white relative z-10" />
                          </div>
                          <h3 className="text-2xl font-bold mb-2">Why Choose Us?</h3>
                          <p className="text-white/80">Our approach delivers substantial benefits over traditional service providers.</p>
                        </div>
                      
                        <ul className="space-y-4">
                          <li className="flex items-start">
                            <div className="mr-4 text-white">
                              <CheckCircle className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-semibold">Expert Team</h4>
                              <p className="text-white/80 text-sm">Skilled professionals with deep industry experience</p>
                            </div>
                          </li>
                          
                          <li className="flex items-start">
                            <div className="mr-4 text-white">
                              <CheckCircle className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-semibold">Transparent Process</h4>
                              <p className="text-white/80 text-sm">Clear communication and milestone-based development</p>
                            </div>
                          </li>
                          
                          <li className="flex items-start">
                            <div className="mr-4 text-white">
                              <CheckCircle className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-semibold">Local Understanding</h4>
                              <p className="text-white/80 text-sm">Deep knowledge of Madurai market and customer needs</p>
                            </div>
                          </li>
                          
                          <li className="flex items-start">
                            <div className="mr-4 text-white">
                              <CheckCircle className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-semibold">Result Focused</h4>
                              <p className="text-white/80 text-sm">Commitment to delivering measurable business outcomes</p>
                            </div>
                          </li>
                        </ul>
                        
                        <div className="mt-8">
                          <Button 
                            asChild 
                            className="bg-white hover:bg-white/90 text-primary rounded-full px-6"
                          >
                            <Link href="/about" className="flex items-center">
                              About Our Team
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </m.div>
                    </LazyMotion>
                  </div>
                  
                  {/* Replaced JS animation with CSS animation */}
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500 opacity-5 rounded-full animate-float-blob"></div>
                </div>
              </div>
            </div>
          </section>
        </TransitionItem>

        {/* Industries we serve */}
        <TransitionItem delay={0.3}>
          <section className="py-24 bg-gradient-to-br from-gray-50 to-white relative">
            {/* Subtle pattern background */}
            <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0aC0ydi00aDJ2NHptMC02aC0ydi00aDJ2NHptMC02aC0ydi00aDJ2NHptMC02aC0yVjhoMnY0em0wIDE4aC0ydi00aDJ2NHptMCA2aC0ydi00aDJ2NHptMCA2aC0ydi00aDJ2NHptMCA2aC0ydi00aDJ2NHptLTYgMEgyOHYtNGgydjR6bS02IDBoLTR2LTRoNHY0em0tNiAwaC00di00aDR2NHptLTYgMEg4di00aDR2NHptMC02aC00di00aDR2NHptMC02aC00di00aDR2NHptMC02aC00di00aDR2NHptMC02aC00VjhoNHY0em0wLTZoLTRWOGg0djR6TTI4IDh2NGgtMlY4aDJ6bTYgMGgydjRoLTJWOHptNiAwaDJ2NGgtMlY4em02IDBoMnY0aC0yVjh6bTYgMGg0djRoLTRWOHptMCA2aDR2NGgtNHYtNHptMCA2aDR2NGgtNHYtNHptMCA2aDR2NGgtNHYtNHptMCA2aDR2NGgtNHYtNHptMCA2aDR2NGgtNHYtNHptLTYgMGgydjRoLTJ2LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] bg-repeat" />
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center mb-16">
                <LazyMotion features={domAnimation}>
                  <m.div 
                    className="inline-flex items-center justify-center mb-4 px-3 py-1 rounded-full bg-primary/5 border border-primary/10"
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <span className="text-primary font-semibold text-sm">INDUSTRIES</span>
                  </m.div>
                  
                  <m.h2 
                    className="text-4xl font-bold text-gray-900 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    Tailored Solutions for Every Industry
                  </m.h2>
                  
                  <m.p 
                    className="text-xl text-gray-600 max-w-3xl mx-auto"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    We specialize in creating industry-specific solutions that address the unique challenges and opportunities of your business sector.
                  </m.p>
                </LazyMotion>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {industries.map((industry, index) => (
                  <IndustryCard 
                    key={index}
                    icon={industry.icon}
                    title={industry.title}
                    description={industry.description}
                    index={index}
                  />
                ))}
              </div>
              
              <div className="mt-16 text-center">
                <LazyMotion features={domAnimation}>
                  <m.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <p className="text-gray-600 mb-6">Don't see your industry? We serve many other sectors as well!</p>
                    <Button 
                      asChild 
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary/5 rounded-full px-8"
                    >
                      <Link href="/contact" className="flex items-center">
                        Contact Us For Details
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </m.div>
                </LazyMotion>
              </div>
            </div>
          </section>
        </TransitionItem>

        {/* Newsletter and CTA Sections */}
        <TransitionItem delay={0.1}>
          <NewsletterSection />
        </TransitionItem>
        
        {/* FAQ Section optimized for SEO */}
        <TransitionItem delay={0.2}>
          <section className="py-24 bg-white relative">
            {/* Subtle background */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMSI+PHBhdGggZD0iTTM2IDM0aC0ydi00aDJ2NHptMC02aC0ydi00aDJ2NHptMC02aC0ydi00aDJ2NHptMC02aC0yVjhoMnY0em0wIDE4aC0ydi00aDJ2NHptMCA2aC0ydi00aDJ2NHptMCA2aC0ydi00aDJ2NHptMCA2aC0ydi00aDJ2NHptLTYgMEgyOHYtNGgydjR6bS02IDBoLTR2LTRoNHY0em0tNiAwaC00di00aDR2NHptLTYgMEg4di00aDR2NHptMC02aC00di00aDR2NHptMC02aC00di00aDR2NHptMC02aC00di00aDR2NHptMC02aC00VjhoNHY0em0wLTZoLTRWOGg0djR6TTI4IDh2NGgtMlY4aDJ6bTYgMGgydjRoLTJWOHptNiAwaDJ2NGgtMlY4em02IDBoMnY0aC0yVjh6bTYgMGg0djRoLTRWOHptMCA2aDR2NGgtNHYtNHptMCA2aDR2NGgtNHYtNHptMCA2aDR2NGgtNHYtNHptMCA2aDR2NGgtNHYtNHptMCA2aDR2NGgtNHYtNHptLTYgMGgydjRoLTJ2LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-5 bg-fixed" />
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center mb-16">
                <LazyMotion features={domAnimation}>
                  <m.div 
                    className="inline-flex items-center justify-center mb-4 px-3 py-1 rounded-full bg-primary/5 border border-primary/10"
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <span className="text-primary font-semibold text-sm">FREQUENTLY ASKED QUESTIONS</span>
                  </m.div>
                  
                  <m.h2 
                    className="text-4xl font-bold text-gray-900 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    Common Questions About Our IT Services
                  </m.h2>
                  
                  <m.p 
                    className="text-xl text-gray-600 max-w-3xl mx-auto"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    Get answers to the most common questions about our services in Madurai
                  </m.p>
                </LazyMotion>
              </div>
              
              <div className="max-w-4xl mx-auto">
                <LazyMotion features={domAnimation}>
                  {getCommonServiceFAQs("IT Services", "Madurai").map((faq, index) => (
                    <m.div
                      key={`faq-${index}`}
                      className="mb-8 border-b border-gray-200 pb-8 last:border-0"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.1 * index }}
                    >
                      <h3 className="text-2xl font-bold text-gray-800 mb-4">{faq.question}</h3>
                      <p className="text-gray-600">{faq.answer}</p>
                    </m.div>
                  ))}
                </LazyMotion>
              </div>
              
              <div className="mt-16 text-center">
                <LazyMotion features={domAnimation}>
                  <m.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <p className="text-gray-600 mb-6">Have more questions about our services in Madurai?</p>
                    <Button 
                      asChild 
                      size="lg"
                      className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 shadow-md"
                    >
                      <Link href="/contact" className="flex items-center">
                        Contact Us Today
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </m.div>
                </LazyMotion>
              </div>
            </div>
          </section>
        </TransitionItem>
        
        <TransitionItem delay={0.3}>
          <CTASection />
        </TransitionItem>
      </div>
    </PageTransition>
  );
};

export default Services;