import React, { useRef, memo, useMemo } from "react";
import { Link } from "wouter";
import { 
  ChevronRight, Code, Cloud, Users, Shield, BarChart, BrainCircuit,
  ArrowRight, ArrowUpRight, Check, Globe, Smartphone, Laptop, PenTool,
  Palette, Layout, Target, Megaphone, LineChart, MonitorSmartphone
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { useAnimateOnScroll, slideInUpVariants } from "@/hooks/use-animation";
import { TransitionItem } from "@/components/PageTransition";

// Enhanced mapping of service types to modern icon components
const getIconForService = (serviceName: string): React.ElementType => {
  const iconMap: Record<string, React.ElementType> = {
    'web-development': Globe,
    'digital-marketing': Megaphone, 
    'app-development': Smartphone,
    'poster-design': PenTool,
    'ui-ux-design': Layout,
    'logo-brand-design': Palette,
    'e-commerce': MonitorSmartphone,
    'seo': Target,
    'analytics': LineChart
  };
  
  return iconMap[serviceName] || Globe;
};

interface ServiceCardProps { 
  icon: React.ElementType;
  title: string;
  description: string;
  slug: string;
  index: number;
}

// Optimized ServiceCard with better performance using pure CSS animations
const ServiceCard = memo(({ 
  icon: Icon, 
  title, 
  description, 
  slug,
  index
}: ServiceCardProps) => {
  // Pre-compute animation delays based on index to stagger animations
  const pulseDelay = useMemo(() => Math.min(index * 0.2, 1.5), [index]);
  const gleamDelay = useMemo(() => Math.min(index * 0.1, 0.8), [index]);
  
  return (
    <div 
      className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden group 
                hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 
                border border-white/60 h-full relative z-10
                hover:translate-y-[-8px]"
      style={{ willChange: "transform" }}
    >
      {/* Card hover effect - subtle gradient border */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-indigo-500/10 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl z-0"></div>
      
      <div className="p-8 flex flex-col h-full relative z-10">
        {/* Modern Icon with optimized design elements */}
        <div className="relative mb-6 w-16 h-16 flex items-center justify-center">
          {/* Static gradient background with border - no animation needed */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 to-indigo-500/20 
                          shadow-md border border-primary/10"></div>
          
          {/* Simplified and optimized pulse effect - Using CSS Animation */}
          <div 
            className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-primary/5 to-indigo-400/10 animate-pulse-slow"
            style={{ 
              willChange: "transform, opacity",
              animationDelay: `${pulseDelay}s` 
            }}
          />
          
          {/* Simplified gleam effect with reduced animation complexity - Using CSS */}
          <div 
            className="absolute inset-0 bg-gradient-to-tr from-primary/0 via-white/30 to-primary/0 
                      rounded-2xl blur-sm animate-gleam"
            style={{ 
              willChange: "opacity",
              animationDelay: `${gleamDelay}s` 
            }}
          />
          
          {/* Micro dots pattern - static, no animation */}
          <div className="absolute inset-0 opacity-20 
                         [background-image:radial-gradient(#4f46e530_1px,transparent_1px)] 
                         [background-size:5px_5px] rounded-2xl"></div>
          
          {/* Icon with simplified glow effect */}
          <div className="relative z-10 flex items-center justify-center">
            {Icon && (
              <div className="relative">
                {/* Static shadow effect instead of animated */}
                <div className="absolute inset-0 text-primary opacity-40 blur-[2px] scale-125 translate-y-[2px]">
                  <Icon className="h-7 w-7" />
                </div>
                
                {/* Main icon */}
                <Icon className="h-7 w-7 text-primary relative z-10 group-hover:scale-110 
                               transition-all duration-300 drop-shadow-sm" />
              </div>
            )}
          </div>
        </div>
        
        {/* Enhanced Content */}
        <div className="flex-grow">
          {/* Title with hover animation */}
          <div className="relative inline-block mb-3">
            <h3 className="text-xl font-bold text-neutral-800 group-hover:text-primary transition-colors">
              {title}
            </h3>
            {/* Optimized accent line with CSS */}
            <div 
              className="absolute -bottom-1 left-0 h-[2px] w-0 bg-gradient-to-r from-primary to-indigo-500 origin-left
                        group-hover:w-[30%] transition-all duration-300"
            />
          </div>
          
          {/* Description with improved typography */}
          <p className="text-neutral-600 mb-6 line-clamp-3 leading-relaxed">
            {description}
          </p>
        </div>
        
        {/* Enhanced Learn More button with optimized animations */}
        <div className="mt-auto pt-4">
          <div className="inline-block relative overflow-hidden group">
            <Link 
              href={`/services/${slug}`} 
              className="group inline-flex items-center"
            >
              {/* Modern button with gradient effect */}
              <span className="relative px-4 py-1.5 rounded-full bg-gradient-to-r from-primary/10 to-indigo-500/10 
                border border-primary/20 text-primary font-medium
                group-hover:from-primary/15 group-hover:to-indigo-500/15 
                group-hover:border-primary/30 transition-all duration-300
                shadow-sm group-hover:shadow-md group-hover:shadow-primary/5">
                Learn More
              </span>
              
              {/* Static arrow icon with CSS-based hover effect */}
              <span
                className="ml-2 bg-white shadow-sm rounded-full p-1 border border-primary/10 transform 
                           group-hover:translate-x-1 transition-transform duration-300"
              >
                <ArrowUpRight className="h-3 w-3 text-primary" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
});

ServiceCard.displayName = "ServiceCard";

interface ServiceType {
  id: number;
  title: string;
  description: string;
  icon?: React.ElementType;
  slug: string;
}

// Define component as const function with React.FC type for better typing
const ServiceSection: React.FC = () => {
  // Use memo for API data
  const { data: services = [] } = useQuery<ServiceType[]>({
    queryKey: ['/api/services'],
    // Set staleTime to reduce unnecessary network requests
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Use memoized predefined services to prevent unnecessary re-renders
  const defaultServices = useMemo<ServiceType[]>(() => [
    {
      id: 1,
      title: "Web Development",
      description: "Create affordable, responsive websites for your business that work on all devices and help your brand stand out online.",
      icon: Globe,
      slug: "web-development"
    },
    {
      id: 2,
      title: "Digital Marketing",
      description: "Boost your online presence with our comprehensive digital marketing strategies including SEO, social media management, and online advertising.",
      icon: Megaphone,
      slug: "digital-marketing"
    },
    {
      id: 3,
      title: "Mobile App Development",
      description: "Build custom mobile applications for Android and iOS platforms that connect you with your customers wherever they are.",
      icon: Smartphone,
      slug: "app-development"
    },
    {
      id: 4,
      title: "Poster Design",
      description: "Craft eye-catching posters and marketing materials that effectively communicate your message and attract customer attention.",
      icon: PenTool,
      slug: "poster-design"
    },
    {
      id: 5,
      title: "UI/UX Design",
      description: "Create intuitive and engaging user interfaces that provide exceptional user experiences and keep customers coming back.",
      icon: Layout,
      slug: "ui-ux-design"
    },
    {
      id: 6,
      title: "Logo & Brand Design",
      description: "Develop a distinctive visual identity with professional logo design and comprehensive branding that communicates your company values.",
      icon: Palette,
      slug: "logo-brand-design"
    }
  ], []);

  // Memoize computed value to prevent recalculation on re-renders  
  const displayServices = useMemo<ServiceType[]>(() => 
    services.length > 0 ? services : defaultServices
  , [services, defaultServices]);

  const sectionRef = useRef<HTMLDivElement>(null);
  
  // Optimize scroll hook with simplified configuration
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  // Color based on scroll progress - memoized transform
  const gradientOpacity = useTransform(scrollYProgress, [0, 0.5], [0, 0.2]);
  
  // Features list for highlight section - memoized to prevent recreation
  const keyFeatures = useMemo(() => [
    "Experienced Web Development Team",
    "Responsive Customer Support",
    "Affordable Pricing Plans",
    "Customized IT Solutions for Your Business"
  ], []);
  
  return (
    <section 
      id="services" 
      ref={sectionRef}
      className="py-24 relative overflow-hidden"
      style={{ position: 'relative' }} // Ensure position for scroll calculations
    >
      {/* Modern 3D mesh gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white to-primary/5 opacity-90" />
        
        {/* Noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.15] 
          [background-image:url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]" />
        
        {/* Static gradient circles - using CSS instead of heavy animations */}
        <div 
          className="absolute top-1/4 -left-10 w-72 h-72 bg-gradient-to-br from-blue-500/15 to-blue-400/5 
                     rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float-slow" 
          style={{ willChange: "transform" }}
        />
        <div 
          className="absolute -bottom-20 right-1/3 w-72 h-72 bg-gradient-to-br from-primary/15 to-indigo-400/5
                     rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float-reverse" 
          style={{ willChange: "transform", animationDelay: "2s" }}
        />
        
        {/* Grid lines */}
        <div className="absolute inset-0 
          [background-image:linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] 
          [background-size:4rem_4rem]" />
      </div>
      
      <TransitionItem>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section header */}
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center mb-4 px-3 py-1 rounded-full bg-primary/5 border border-primary/10">
              <span className="text-primary font-semibold text-sm animate-pulse-slow">
                OUR EXPERTISE
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-6 tracking-tight leading-tight">
              Leading <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">web development & digital marketing</span> in Madurai
            </h2>
            
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
              From custom web development to digital marketing and creative design, we offer affordable IT solutions to help businesses in Madurai and beyond establish a strong online presence.
            </p>
          </div>

          {/* Services grid - optimized with LazyMotion */}
          <LazyMotion features={domAnimation} strict>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
              {displayServices.map((service: ServiceType, index: number) => (
                <m.div
                  key={service.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ 
                    duration: 0.5, 
                    delay: Math.min(0.1 * index, 0.5), // Cap max delay
                    ease: "easeOut"
                  }}
                  style={{ willChange: "transform, opacity" }}
                >
                  <ServiceCard 
                    icon={getIconForService(service.slug)}
                    title={service.title}
                    description={service.description}
                    slug={service.slug}
                    index={index}
                  />
                </m.div>
              ))}
            </div>
            
            {/* View All Services link for better internal linking */}
            <div className="text-center mb-10">
              <Link 
                href="/services" 
                className="inline-flex items-center justify-center px-6 py-3 rounded-full
                          bg-gradient-to-r from-primary to-indigo-600 text-white font-semibold
                          shadow-lg hover:shadow-primary/20 transition-all duration-300
                          hover:scale-105 active:scale-95"
              >
                View All Services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </LazyMotion>
          
          {/* Features highlight - with performance optimizations */}
          <LazyMotion features={domAnimation}>
            <m.div 
              className="rounded-2xl bg-gradient-to-r from-primary/5 to-indigo-500/5 p-10 backdrop-blur-sm border border-white/40 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{ willChange: "transform, opacity" }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div>
                  <h3 className="text-2xl font-bold text-neutral-800 mb-6">Why Choose GodivaTech Services?</h3>
                  <p className="text-neutral-600 mb-8">
                    With over a decade of experience, our team is dedicated to providing affordable and high-quality technology solutions tailored to your specific business needs.
                  </p>
                  
                  <ul className="space-y-3">
                    {keyFeatures.map((feature, idx) => (
                      <m.li 
                        key={idx}
                        className="flex items-start"
                        initial={{ opacity: 0, x: -5 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ 
                          delay: Math.min(0.1 * idx, 0.3), 
                          duration: 0.3 
                        }}
                      >
                        <div className="mr-3 mt-1 bg-primary/10 rounded-full p-1">
                          <Check className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-neutral-700">{feature}</span>
                      </m.li>
                    ))}
                  </ul>
                  
                  <div className="mt-8 transition-all duration-300 hover:translate-y-[-2px]">
                    <Link 
                      href="/services" 
                      className="inline-flex items-center rounded-full bg-primary text-white px-6 py-3 font-medium hover:bg-primary/90 transition-colors shadow-sm hover:shadow-md"
                    >
                      View All Services
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </div>
                
                <div className="lg:pl-10">
                  <m.div 
                    className="rounded-2xl overflow-hidden border-4 border-white/80 shadow-xl relative"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    style={{ willChange: "transform, opacity" }}
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                      alt="Technology team collaboration"
                      className="w-full h-auto"
                      loading="lazy" 
                      decoding="async"
                      width="600"
                      height="400"
                      fetchPriority="low"
                      style={{ willChange: "opacity" }}
                    />
                    
                    {/* Static overlay gradient instead of animated */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-60 mix-blend-overlay" />
                  </m.div>
                </div>
              </div>
            </m.div>
          </LazyMotion>
        </div>
      </TransitionItem>
    </section>
  );
};

export default memo(ServiceSection);
