import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import SEO from "@/components/SEO";
import { servicesKeywords } from "@/lib/seoKeywords";
import { 
  getOrganizationData, 
  getWebPageData,
  getBreadcrumbData 
} from "@/lib/structuredData";
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

// Industry card component with animation
const IndustryCard = ({ icon: Icon, title, description, index }: { 
  icon: React.ElementType, 
  title: string, 
  description: string,
  index: number
}) => {
  return (
    <motion.div 
      className="bg-white rounded-xl shadow-lg p-8 border border-neutral-100 h-full"
      whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="relative w-16 h-16 mb-6">
        <motion.div 
          className="absolute inset-0 rounded-xl bg-primary/10 z-0"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, index % 2 === 0 ? 5 : -5, 0],
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity,
            repeatType: "reverse",
            delay: index * 0.3
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <Icon className="text-primary h-7 w-7" />
        </div>
      </div>
      <h3 className="text-xl font-bold text-neutral-800 mb-3">{title}</h3>
      <p className="text-neutral-600">
        {description}
      </p>
    </motion.div>
  );
};

// Service approach step component
const ServiceStep = ({ number, title, description, delay }: {
  number: number;
  title: string;
  description: string;
  delay: number;
}) => (
  <motion.div 
    className="flex items-start"
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
  >
    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold mr-4 shrink-0">
      {number}
    </div>
    <div>
      <h3 className="text-xl font-semibold text-neutral-800 mb-2">{title}</h3>
      <p className="text-neutral-600">
        {description}
      </p>
    </div>
  </motion.div>
);

// Service Card component for main services section
const EnterpriseServiceCard = ({ 
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
    <motion.div 
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
          <motion.div 
            className="absolute top-0 right-0 w-20 h-20 opacity-10"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 10, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
            }}
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
            <motion.div
              className="ml-2"
              initial={{ x: 0 }}
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <ArrowRight className="h-4 w-4" />
            </motion.div>
          </Link>
        </div>
      </div>
      
      <div className="h-1.5 w-full bg-gradient-to-r from-primary via-primary to-indigo-600 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
    </motion.div>
  );
};

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
        title="Best Web Development & Digital Marketing Services in Madurai | GodivaTech"
        description="GodivaTech offers affordable web development, app development, and digital marketing services in Madurai. Get custom IT solutions at competitive prices for your business."
        keywords={servicesKeywords}
        canonicalUrl="/services"
        structuredData={[
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
        ]}
      />
      
      <div className="relative">
        {/* Hero section */}
        <TransitionItem>
          <section className="relative py-28 md:py-32 overflow-hidden">
            {/* Background with gradient and effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-purple-700"></div>
            
            {/* Animated background patterns */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIgZD0iTTMwMCwzMDAgTDMwMCw1MCBBMjUwLDI1MCAwIDEgMSAxMDEuOTY0NzksNDUzLjAzMzAxIi8+PC9zdmc+')]"></div>
              <motion.div 
                className="absolute inset-0"
                animate={{
                  backgroundPosition: ['0% 0%', '100% 100%'],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
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
                  Comprehensive <span className="text-white/90">IT Services</span> for Modern Businesses
                </motion.h1>
                
                <motion.p 
                  className="text-xl text-white/90 mb-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  From enterprise web development to digital transformation, we provide strategic technology solutions that help businesses thrive in today's digital landscape.
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
            
            {/* Decorative elements */}
            <motion.div 
              className="absolute -bottom-16 -left-16 w-32 h-32 bg-white opacity-10 rounded-full blur-xl"
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
            <motion.div 
              className="absolute -bottom-32 -right-20 w-64 h-64 bg-indigo-300 opacity-10 rounded-full blur-3xl"
              animate={{
                y: [0, -40, 0],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
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
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                  >
                    <h2 className="text-3xl font-bold text-neutral-800 mb-6 relative inline-block">
                      Our Work Process
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/40 to-transparent" />
                    </h2>
                    <p className="text-lg text-neutral-600 mb-8">
                      At Godiva Technologies, we follow a structured process to ensure the successful delivery of high-quality digital solutions for our clients:
                    </p>
                  </motion.div>
                  
                  <div className="space-y-8">
                    <ServiceStep 
                      number={1} 
                      title="Initial Consultation" 
                      description="We start by understanding your business, goals, and specific requirements through detailed discussions with your team."
                      delay={0.1}
                    />
                    
                    <ServiceStep 
                      number={2} 
                      title="Custom Strategy Development" 
                      description="We create a tailored digital strategy that addresses your unique challenges and leverages the right technologies for your business."
                      delay={0.2}
                    />
                    
                    <ServiceStep 
                      number={3} 
                      title="Creative Design & Development" 
                      description="Our team designs and develops solutions with a focus on user experience, visual appeal, and technical excellence."
                      delay={0.3}
                    />
                    
                    <ServiceStep 
                      number={4} 
                      title="Quality Testing" 
                      description="We thoroughly test all deliverables across different devices and platforms to ensure optimal performance and functionality."
                      delay={0.4}
                    />
                    
                    <ServiceStep 
                      number={5} 
                      title="Launch & Ongoing Support" 
                      description="After launch, we provide dedicated support and maintenance to ensure your digital assets continue to perform at their best."
                      delay={0.5}
                    />
                  </div>
                </div>
                
                <div>
                  <motion.div
                    className="rounded-xl overflow-hidden shadow-2xl relative"
                    initial={{ opacity: 0, scale: 0.95, rotateY: 15 }}
                    whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-transparent mix-blend-overlay z-10" />
                    
                    {/* Main image */}
                    <img
                      src="https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                      alt="Service approach illustration"
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Floating badge */}
                    <motion.div
                      className="absolute bottom-6 right-6 bg-white rounded-lg shadow-lg py-2 px-4 z-20 flex items-center border border-neutral-100"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.8 }}
                    >
                      <CheckCircle className="text-primary h-5 w-5 mr-2" />
                      <span className="font-medium text-sm">Client-Centric Approach</span>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </div>
          </section>
        </TransitionItem>

        {/* Industries section */}
        <TransitionItem delay={0.2}>
          <section className="py-24 relative overflow-hidden bg-gradient-to-b from-gray-50/80 to-white">
            {/* Background with gradients */}
            <div className="absolute inset-0 bg-neutral-50/60" />
            
            {/* Subtle grid pattern */}
            <div className="absolute inset-0 
              [background-image:linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] 
              [background-size:4rem_4rem]" />
              
            {/* Content */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <motion.div 
                className="text-center mb-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <div className="inline-flex items-center justify-center mb-4 px-3 py-1 rounded-full bg-primary/5 border border-primary/10">
                  <span className="text-primary font-semibold text-sm">INDUSTRY EXPERTISE</span>
                </div>
                
                <h2 className="text-4xl font-bold text-neutral-800 mb-4">Industries We Serve</h2>
                <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                  Our specialized solutions are tailored to meet the unique requirements of businesses across various sectors, with deep expertise in these key industries.
                </p>
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {industries.map((industry, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7, delay: 0.1 * index }}
                  >
                    <IndustryCard 
                      icon={industry.icon}
                      title={industry.title}
                      description={industry.description}
                      index={index}
                    />
                  </motion.div>
                ))}
              </div>
              
              <motion.div 
                className="mt-16 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-neutral-600 mb-6">Don't see your industry? Our expertise extends beyond these sectors.</p>
                <Button 
                  asChild 
                  variant="outline" 
                  className="border-primary text-primary hover:bg-primary/5"
                >
                  <Link href="/contact" className="flex items-center">
                    Discuss Your Industry Needs
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </section>
        </TransitionItem>
        
        {/* Benefits Section */}
        <TransitionItem delay={0.3}>
          <section className="py-24 bg-primary/5 relative overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center mb-16">
                <motion.div 
                  className="inline-flex items-center justify-center mb-4 px-3 py-1 rounded-full bg-primary/10 border border-primary/20"
                  initial={{ opacity: 0, y: -10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="text-primary font-semibold text-sm">WHY CHOOSE US</span>
                </motion.div>
                
                <motion.h2 
                  className="text-4xl font-bold text-gray-900 mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  The GodivaTech Advantage
                </motion.h2>
                
                <motion.p 
                  className="text-lg text-gray-600 max-w-3xl mx-auto"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Our enterprise solutions are built on core principles that ensure exceptional quality, reliability, and value for your business.
                </motion.p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    icon: Sparkles,
                    title: "Expert Team",
                    description: "Our team consists of industry veterans with deep expertise in the latest technologies and best practices."
                  },
                  {
                    icon: FileCheck,
                    title: "Proven Methodology",
                    description: "A structured approach to project delivery ensures quality, timeliness, and transparency at every stage."
                  },
                  {
                    icon: ShieldCheck,
                    title: "Enterprise Security",
                    description: "We implement robust security measures to protect your data and applications from vulnerabilities."
                  },
                  {
                    icon: Cpu,
                    title: "Scalable Solutions",
                    description: "Our technology solutions are designed to grow with your business, adapting to changing needs."
                  },
                  {
                    icon: MessageCircle,
                    title: "Dedicated Support",
                    description: "We provide ongoing technical support and maintenance to ensure your systems run smoothly."
                  },
                  {
                    icon: Database,
                    title: "Data-Driven Approach",
                    description: "We leverage analytics and insights to make informed decisions that drive business growth."
                  }
                ].map((benefit, index) => (
                  <motion.div 
                    key={index}
                    className="bg-white rounded-xl p-8 shadow-md border border-gray-100 flex flex-col h-full"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="bg-primary/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                      <benefit.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </TransitionItem>

        {/* Newsletter and CTA Sections */}
        <TransitionItem delay={0.1}>
          <NewsletterSection />
        </TransitionItem>
        
        <TransitionItem delay={0.2}>
          <CTASection />
        </TransitionItem>
      </div>
    </PageTransition>
  );
};

export default Services;
