import React, { useEffect, createElement } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { 
  ArrowLeft, ArrowRight, CheckCircle, Clock, 
  Users, Briefcase, Sparkles, Globe, Palette, Cloud, 
  Box, Database, CircleUser, Code, ShieldCheck, Layers
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import PageTransition, { TransitionItem } from "@/components/PageTransition";
import CTASection from "@/components/home/CTASection";

// Helper function to get icon based on slug
const getIconForService = (slug: string) => {
  const iconMap: Record<string, React.ElementType> = {
    'web-design-development': Globe,
    'branding-logo-design': Palette,
    'digital-marketing': Cloud,
    'ecommerce-solutions': Box,
    'web-hosting-maintenance': Database,
    'ui-ux-design': CircleUser,
    'app-development': Code,
    'cyber-security': ShieldCheck,
    'cloud-solutions': Layers
  };
  
  return iconMap[slug] || Globe;
};

interface ServiceType {
  id: number;
  title: string;
  description: string;
  icon?: React.ElementType;
  slug: string;
  features?: string[];
  longDescription?: string;
  processSteps?: { title: string; description: string }[];
  benefits?: string[];
  technologies?: string[];
}

// Default data for when API returns no results
const defaultServiceData: Record<string, ServiceType> = {
  "web-design-development": {
    id: 1,
    title: "Web Design & Development",
    description: "Custom websites with responsive designs that work seamlessly across all devices, providing optimal user experiences.",
    slug: "web-design-development",
    features: ["Responsive Design", "SEO Optimization", "Custom CMS Integration"],
    longDescription: "Our web design and development service delivers custom, responsive websites that not only look professional but also perform exceptionally well. We focus on creating user-friendly interfaces with intuitive navigation, fast loading times, and mobile optimization to ensure your website provides an excellent experience on any device.",
    processSteps: [
      { title: "Discovery & Planning", description: "We analyze your business needs, target audience, and goals to create a strategic plan for your website." },
      { title: "Design & Prototyping", description: "Our designers create wireframes and visual designs that align with your brand and business objectives." },
      { title: "Development", description: "Our developers bring the designs to life with clean, efficient code and responsive functionality." },
      { title: "Testing & QA", description: "Rigorous testing ensures your website works flawlessly across all browsers and devices." },
      { title: "Launch & Support", description: "After launch, we provide ongoing support and maintenance to keep your website running optimally." }
    ],
    benefits: [
      "Increased online visibility and brand recognition",
      "Improved user engagement and conversion rates",
      "Mobile-friendly experience for all users",
      "Fast loading speeds for better user retention",
      "SEO-optimized structure for better search rankings"
    ],
    technologies: ["HTML5", "CSS3", "JavaScript", "React", "Node.js", "WordPress", "PHP"]
  },
  "branding-logo-design": {
    id: 2,
    title: "Branding & Logo Design",
    description: "Comprehensive branding solutions that help establish your unique identity in the market.",
    slug: "branding-logo-design",
    features: ["Logo Creation", "Brand Guidelines", "Visual Identity Systems"],
    longDescription: "Our branding service helps businesses establish a strong, recognizable identity in the marketplace. We create comprehensive brand packages including logos, color schemes, typography, and design elements that communicate your brand's values and personality consistently across all touchpoints.",
    processSteps: [
      { title: "Brand Discovery", description: "We explore your business values, mission, target audience, and competitive landscape." },
      { title: "Concept Development", description: "Our designers create multiple concepts based on research and brand positioning." },
      { title: "Refinement", description: "We refine the selected concept into a polished, professional brand identity." },
      { title: "Brand Guidelines", description: "We develop comprehensive guidelines for consistent application across all media." },
      { title: "Implementation", description: "We help integrate your new branding across various platforms and materials." }
    ],
    benefits: [
      "Strong brand recognition and recall",
      "Consistent representation across all media",
      "Professional image that builds customer trust",
      "Visual identity that communicates your brand values",
      "Differentiation from competitors in your market"
    ],
    technologies: ["Adobe Creative Suite", "Figma", "Brand Strategy Frameworks", "Color Theory", "Typography"]
  },
  "digital-marketing": {
    id: 3,
    title: "Digital Marketing",
    description: "Strategic marketing solutions to increase your online visibility, engage with customers, and drive conversions.",
    slug: "digital-marketing",
    features: ["SEO & SEM", "Social Media Marketing", "Content Strategy"],
    longDescription: "Our digital marketing services help businesses increase their online visibility and reach their target audience effectively. We develop data-driven strategies across search engines, social media, email, and content marketing to drive traffic, generate leads, and increase conversions for sustainable business growth.",
    processSteps: [
      { title: "Strategy Development", description: "We create a customized marketing plan based on your business goals and target audience." },
      { title: "Channel Selection", description: "We identify the most effective channels to reach your specific audience." },
      { title: "Content Creation", description: "Our team develops engaging content optimized for each selected platform." },
      { title: "Campaign Execution", description: "We launch and manage campaigns across multiple channels." },
      { title: "Analysis & Optimization", description: "Continuous monitoring and refinement to improve performance and ROI." }
    ],
    benefits: [
      "Increased website traffic and lead generation",
      "Improved conversion rates and sales",
      "Enhanced brand awareness and engagement",
      "Data-driven insights for continuous improvement",
      "Cost-effective targeting of specific audience segments"
    ],
    technologies: ["Google Analytics", "SEO Tools", "Social Media Platforms", "Email Marketing Software", "Content Management Systems"]
  },
  "ecommerce-solutions": {
    id: 4,
    title: "E-commerce Solutions",
    description: "End-to-end e-commerce platforms with secure payment processing and inventory management systems.",
    slug: "ecommerce-solutions",
    features: ["Secure Payments", "Inventory Management", "Mobile Shopping Experience"],
    longDescription: "Our e-commerce solutions provide businesses with robust online stores that drive sales and deliver exceptional shopping experiences. We build customized platforms with secure payment processing, inventory management, and mobile optimization to help you sell products effectively online.",
    processSteps: [
      { title: "Requirements Analysis", description: "We identify your specific e-commerce needs, product types, and business workflows." },
      { title: "Platform Selection", description: "We recommend and implement the best e-commerce platform for your business." },
      { title: "Design & Development", description: "Our team creates a user-friendly store design with optimized product pages." },
      { title: "Payment & Shipping Setup", description: "We integrate secure payment gateways and configure shipping options." },
      { title: "Testing & Launch", description: "Comprehensive testing ensures a flawless shopping experience before launch." }
    ],
    benefits: [
      "24/7 sales capability to customers worldwide",
      "Streamlined inventory and order management",
      "Secure and diverse payment options",
      "Seamless mobile shopping experience",
      "Detailed analytics to optimize sales performance"
    ],
    technologies: ["Shopify", "WooCommerce", "Magento", "Payment Gateways", "Inventory Management Systems"]
  },
  "web-hosting-maintenance": {
    id: 5,
    title: "Web Hosting & Maintenance",
    description: "Reliable hosting solutions with regular maintenance to ensure your website remains secure and performs optimally.",
    slug: "web-hosting-maintenance",
    features: ["24/7 Support", "Security Updates", "Performance Optimization"],
    longDescription: "Our web hosting and maintenance services ensure your website remains secure, up-to-date, and performing at its best. We provide reliable hosting infrastructure combined with regular monitoring, updates, and technical support to minimize downtime and maximize website performance.",
    processSteps: [
      { title: "Hosting Setup", description: "We configure secure, high-performance hosting tailored to your website's needs." },
      { title: "Migration (if needed)", description: "We handle the transition from your current host with minimal disruption." },
      { title: "Security Implementation", description: "We install SSL certificates and security measures to protect your site." },
      { title: "Monitoring Setup", description: "We implement monitoring systems to track uptime and performance." },
      { title: "Ongoing Maintenance", description: "Regular updates, backups, and optimization to keep your site running smoothly." }
    ],
    benefits: [
      "Improved website security and protection from threats",
      "Faster loading speeds and better user experience",
      "Reduced downtime and technical issues",
      "Regular backups to prevent data loss",
      "Expert support when you need assistance"
    ],
    technologies: ["Cloud Hosting", "SSL Certificates", "CDN Services", "Security Scanning Tools", "Backup Systems"]
  },
  "ui-ux-design": {
    id: 6,
    title: "UI/UX Design",
    description: "User-centered design approaches that enhance usability and create engaging digital experiences.",
    slug: "ui-ux-design",
    features: ["User Research", "Wireframing & Prototyping", "Usability Testing"],
    longDescription: "Our UI/UX design services focus on creating intuitive, engaging user experiences that delight your customers and achieve your business goals. We combine research-based insights with creative design thinking to develop interfaces that are both aesthetically pleasing and highly functional.",
    processSteps: [
      { title: "User Research", description: "We study your users' needs, behaviors, and pain points to inform the design process." },
      { title: "Information Architecture", description: "We organize content and features in a logical, intuitive structure." },
      { title: "Wireframing", description: "We create blueprints of key screens to establish layout and functionality." },
      { title: "Visual Design", description: "Our designers develop the visual style and UI elements of your interface." },
      { title: "Prototyping & Testing", description: "We build interactive prototypes and test them with real users for feedback." }
    ],
    benefits: [
      "Improved user satisfaction and engagement",
      "Reduced user errors and support requests",
      "Higher conversion rates and goal completion",
      "Consistent user experience across platforms",
      "Designed based on real user behavior and feedback"
    ],
    technologies: ["Figma", "Adobe XD", "Sketch", "InVision", "User Testing Platforms"]
  }
};

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
  
  // Use default service data if API returns nothing
  const serviceData = service || defaultServiceData[slug];
  const Icon = getIconForService(slug);
  
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

  return (
    <PageTransition>
      <Helmet>
        <title>{serviceData.title} | GodivaTech Services</title>
        <meta name="description" content={serviceData.description} />
      </Helmet>
      
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
                          {createElement(getIconForService(relatedService.slug), { className: "h-6 w-6 text-primary" })}
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
        
        {/* CTA Section */}
        <TransitionItem delay={0.3}>
          <CTASection />
        </TransitionItem>
      </div>
    </PageTransition>
  );
};

export default ServiceDetail;