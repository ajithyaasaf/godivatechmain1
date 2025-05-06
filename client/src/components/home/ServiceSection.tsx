import React, { useRef } from "react";
import { Link } from "wouter";
import { 
  ChevronRight, Code, Cloud, Users, Shield, BarChart, BrainCircuit,
  ArrowRight, ArrowUpRight, Check, Globe, Smartphone, Laptop, PenTool,
  Palette, Layout, Target, Megaphone, LineChart, MonitorSmartphone
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useAnimateOnScroll, slideInUpVariants } from "@/hooks/use-animation";
import { TransitionItem } from "@/components/PageTransition";

// Enhanced mapping of service types to modern icon components
const getIconForService = (serviceName: string) => {
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

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  slug,
  index
}) => {
  return (
    <motion.div 
      className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden group 
                hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 
                border border-white/60 h-full relative z-10"
      whileHover={{ 
        y: -8, 
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.01)'
      }}
    >
      {/* Card hover effect - subtle gradient border */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl z-0"></div>
      
      <div className="p-8 flex flex-col h-full relative z-10">
        {/* Modern Icon with enhanced design elements */}
        <div className="relative mb-6 w-16 h-16">
          {/* Base gradient background */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 to-indigo-500/20 shadow-lg"></div>
          
          {/* Animated pulse effect */}
          <motion.div 
            className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-primary/5 to-indigo-400/10"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, 0],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{ 
              duration: 6, 
              repeat: Infinity,
              repeatType: "reverse",
              delay: index * 0.5
            }}
          />
          
          {/* Light gleam effect */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-tr from-primary/0 via-white/40 to-primary/0 rounded-2xl blur-sm"
            animate={{
              rotate: [0, 180],
              scale: [0.9, 1.1, 0.9],
              opacity: [0, 0.3, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
              delay: index * 0.3
            }}
          />
          
          {/* Micro dots pattern */}
          <div className="absolute inset-0 opacity-20 
                         [background-image:radial-gradient(#4f46e530_1px,transparent_1px)] 
                         [background-size:5px_5px] rounded-2xl"></div>
          
          {/* Icon with glow effect */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            {Icon && typeof Icon === 'function' && (
              <div className="relative">
                {/* Shadow/glow effect */}
                <div className="absolute -inset-1 text-primary opacity-50 blur-[2px]">
                  <Icon className="h-7 w-7" />
                </div>
                
                {/* Main icon */}
                <Icon className="text-primary h-7 w-7 relative z-10 group-hover:scale-110 
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
            {/* Animated accent line */}
            <motion.div 
              className="absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-primary to-indigo-500 origin-left"
              initial={{ width: "0%" }}
              whileInView={{ width: "30%" }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
            />
          </div>
          
          {/* Description with improved typography */}
          <p className="text-neutral-600 mb-6 line-clamp-3 leading-relaxed">
            {description}
          </p>
        </div>
        
        {/* Enhanced Learn More button */}
        <div className="mt-auto pt-4">
          <motion.div
            className="inline-block relative overflow-hidden"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link 
              href={`/services/${slug}`} 
              className="group inline-flex items-center"
            >
              {/* Modern button with gradient and glow effect */}
              <span className="relative px-4 py-1.5 rounded-full bg-gradient-to-r from-primary/10 to-indigo-500/10 
                border border-primary/20 text-primary font-medium
                group-hover:from-primary/15 group-hover:to-indigo-500/15 
                group-hover:border-primary/30 transition-all duration-300
                shadow-sm group-hover:shadow-md group-hover:shadow-primary/5">
                Learn More
                
                {/* Subtle shine effect */}
                <motion.span 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ left: "-100%" }}
                  whileHover={{ left: ["100%"] }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                />
              </span>
              
              {/* Animated arrow icon */}
              <motion.div
                className="ml-2 bg-white shadow-sm rounded-full p-1 border border-primary/10"
                initial={{ x: 0 }}
                whileHover={{ x: 5, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <ArrowUpRight className="h-3 w-3 text-primary" />
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

interface ServiceType {
  id: number;
  title: string;
  description: string;
  icon?: React.ElementType;
  slug: string;
}

const ServiceSection = () => {
  const { data: services = [] } = useQuery<ServiceType[]>({
    queryKey: ['/api/services'],
  });

  // Use predefined services with modern icons if API doesn't return data
  const defaultServices: ServiceType[] = [
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
  ];

  const displayServices: ServiceType[] = services.length > 0 ? services : defaultServices;

  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  // Color based on scroll progress
  const gradientOpacity = useTransform(scrollYProgress, [0, 0.5], [0, 0.2]);
  
  // Features list for highlight section
  const keyFeatures = [
    "Experienced Web Development Team",
    "Responsive Customer Support",
    "Affordable Pricing Plans",
    "Customized IT Solutions for Your Business"
  ];
  
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
        
        {/* Animated gradient circles */}
        <motion.div 
          className="absolute top-1/4 -left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10" 
          animate={{
            y: [0, 50, 0],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div 
          className="absolute -bottom-20 right-1/3 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-10" 
          animate={{
            y: [0, -30, 0],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 5
          }}
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
              <motion.span 
                className="text-primary font-semibold text-sm"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                OUR EXPERTISE
              </motion.span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-6 tracking-tight leading-tight">
              Leading <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">web development & digital marketing</span> in Madurai
            </h2>
            
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
              From custom web development to digital marketing and creative design, we offer affordable IT solutions to help businesses in Madurai and beyond establish a strong online presence.
            </p>
          </div>

          {/* Services grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {displayServices.map((service: ServiceType, index: number) => (
              <AnimatePresence key={service.id || index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ 
                    duration: 0.7, 
                    delay: 0.15 * index,
                    ease: [0.25, 0.1, 0.25, 1]
                  }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  <ServiceCard 
                    icon={service.icon || Code}
                    title={service.title}
                    description={service.description}
                    slug={service.slug}
                    index={index}
                  />
                </motion.div>
              </AnimatePresence>
            ))}
          </div>
          
          {/* Features highlight */}
          <motion.div 
            className="rounded-2xl bg-gradient-to-r from-primary/5 to-indigo-500/5 p-10 backdrop-blur-sm border border-white/40 shadow-lg"
            whileInView={{ opacity: [0, 1], y: [20, 0] }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <h3 className="text-2xl font-bold text-neutral-800 mb-6">Why Choose GodivaTech Services?</h3>
                <p className="text-neutral-600 mb-8">
                  With over a decade of experience, our team is dedicated to providing affordable and high-quality technology solutions tailored to your specific business needs.
                </p>
                
                <ul className="space-y-3">
                  {keyFeatures.map((feature, idx) => (
                    <motion.li 
                      key={idx}
                      className="flex items-start"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 * idx + 0.3, duration: 0.5 }}
                    >
                      <div className="mr-3 mt-1 bg-primary/10 rounded-full p-1">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-neutral-700">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
                
                <motion.div 
                  className="mt-8"
                  whileInView={{ opacity: [0, 1], y: [10, 0] }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  <Link 
                    href="/services" 
                    className="inline-flex items-center rounded-full bg-primary text-white px-6 py-3 font-medium hover:bg-primary/90 transition-colors shadow-sm hover:shadow-md"
                  >
                    View All Services
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </motion.div>
              </div>
              
              <div className="lg:pl-10">
                <motion.div 
                  className="rounded-2xl overflow-hidden border-4 border-white/80 shadow-xl relative"
                  whileInView={{ 
                    opacity: [0, 1],
                    y: [20, 0], 
                    rotateY: [10, 0], 
                    rotateX: [-5, 0]
                  }}
                  transition={{ 
                    duration: 0.8, 
                    delay: 0.3,
                    ease: "easeOut"
                  }}
                  viewport={{ once: true }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <img 
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                    alt="Technology team collaboration"
                    className="w-full h-auto"
                  />
                  
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-60 mix-blend-overlay" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </TransitionItem>
    </section>
  );
};

export default ServiceSection;
