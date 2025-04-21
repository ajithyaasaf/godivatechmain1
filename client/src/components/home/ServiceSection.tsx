import React, { useRef } from "react";
import { Link } from "wouter";
import { 
  ChevronRight, Code, Cloud, Users, Shield, BarChart, BrainCircuit,
  ArrowRight, 
  CodeIcon, CloudIcon, UsersIcon, ShieldIcon, BarChartIcon, Brain
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { motion, useScroll, useTransform } from "framer-motion";
import { useAnimateOnScroll, slideInUpVariants } from "@/hooks/use-animation";
import ParallaxSection from "@/components/ui/ParallaxSection";

// Explicit mapping of service types to icon components to avoid lowercase tag errors
const getIconForService = (serviceName: string) => {
  const iconMap: Record<string, React.ElementType> = {
    'software-development': Code,
    'cloud-solutions': Cloud,
    'it-consulting': Users,
    'cybersecurity': Shield,
    'data-analytics': BarChart,
    'ai-machine-learning': BrainCircuit
  };
  
  return iconMap[serviceName] || Code;
};

const ServiceCard = ({ 
  icon: Icon, 
  title, 
  description, 
  slug 
}: { 
  icon: React.ElementType, 
  title: string, 
  description: string,
  slug: string
}) => {
  const [ref, controls] = useAnimateOnScroll(0.1);
  
  return (
    <motion.div 
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={slideInUpVariants}
      className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 hover:bg-gradient-to-br hover:from-white hover:to-primary/5 border border-neutral-100"
      whileHover={{ y: -10 }}
    >
      <div className="p-8">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 relative">
          <div className="absolute inset-0 rounded-full bg-primary/5 animate-ping opacity-75" style={{ animationDuration: '3s' }}></div>
          {/* Using Icon component directly with validation */}
          {Icon && typeof Icon === 'function' && <Icon className="text-2xl text-primary h-6 w-6" />}
        </div>
        <h3 className="text-xl font-semibold text-neutral-800 mb-3 group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-neutral-600 mb-6 line-clamp-3">
          {description}
        </p>
        <motion.div
          className="overflow-hidden relative"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Link 
            href={`/services/${slug}`} 
            className="inline-flex items-center text-primary font-medium group-hover:text-primary-dark transition-colors"
          >
            <span className="relative">
              Learn More
              <motion.span 
                className="absolute bottom-0 left-0 w-full h-[2px] bg-primary origin-left" 
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </span>
            <motion.div
              className="ml-2"
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <ArrowRight className="h-4 w-4" />
            </motion.div>
          </Link>
        </motion.div>
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

  // Use predefined services if API doesn't return data
  const defaultServices: ServiceType[] = [
    {
      id: 1,
      title: "Software Development",
      description: "Custom software solutions tailored to your business needs, from web applications to mobile apps and enterprise systems.",
      icon: Code,
      slug: "software-development"
    },
    {
      id: 2,
      title: "Cloud Solutions",
      description: "Scalable cloud infrastructure, migration services, and managed cloud solutions to optimize your business operations.",
      icon: Cloud,
      slug: "cloud-solutions"
    },
    {
      id: 3,
      title: "IT Consulting",
      description: "Strategic technology advisory services to help you make informed decisions and maximize your IT investments.",
      icon: Users,
      slug: "it-consulting"
    },
    {
      id: 4,
      title: "Cybersecurity",
      description: "Comprehensive security assessments, implementation, and monitoring to protect your business from evolving threats.",
      icon: Shield,
      slug: "cybersecurity"
    },
    {
      id: 5,
      title: "Data Analytics",
      description: "Turn your data into actionable insights with our advanced analytics, business intelligence, and data visualization solutions.",
      icon: BarChart,
      slug: "data-analytics"
    },
    {
      id: 6,
      title: "AI & Machine Learning",
      description: "Cutting-edge AI solutions that automate processes, predict trends, and enhance decision-making for your business.",
      icon: BrainCircuit,
      slug: "ai-machine-learning"
    }
  ];

  const displayServices: ServiceType[] = services.length > 0 ? services : defaultServices;

  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  // Modern background effects
  const bgOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.6]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.2, 0.3], [0, 1, 1]);
  const titleY = useTransform(scrollYProgress, [0, 0.2, 1], ["50px", "0px", "0px"]);
  
  return (
    <section 
      id="services" 
      ref={sectionRef}
      className="py-24 relative overflow-hidden"
    >
      {/* Modern gradient background */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-primary/5 via-white to-neutral-50"
        style={{ opacity: bgOpacity }}
      />
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
      <div className="absolute inset-0">
        <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-blue-100/50 blur-3xl"></div>
        <div className="absolute top-1/2 -left-20 w-72 h-72 rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute -bottom-10 right-1/4 w-56 h-56 rounded-full bg-purple-100/50 blur-3xl"></div>
      </div>
      
      {/* Floating particles */}
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-primary/20 backdrop-blur-sm"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 8 + 4}px`,
            height: `${Math.random() * 8 + 4}px`,
            opacity: 0.4,
            y: useTransform(
              scrollYProgress,
              [0, 1],
              [0, Math.random() * 100 * (Math.random() > 0.5 ? 1 : -1)]
            ),
            x: useTransform(
              scrollYProgress,
              [0, 1],
              [0, Math.random() * 50 * (Math.random() > 0.5 ? 1 : -1)]
            ),
          }}
        />
      ))}
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="text-center mb-20"
          style={{ 
            opacity: titleOpacity,
            y: titleY 
          }}
        >
          <div className="flex items-center justify-center mb-4">
            <div className="h-[1px] w-16 bg-primary/60 rounded"></div>
            <span className="mx-2 text-primary font-semibold text-sm">WHAT WE OFFER</span>
            <div className="h-[1px] w-16 bg-primary/60 rounded"></div>
          </div>
          
          <motion.h2 
            className="text-3xl md:text-5xl font-bold text-neutral-800 mb-6 tracking-tight"
            whileInView={{ 
              opacity: [0, 1],
              y: [-20, 0] 
            }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Our Services
          </motion.h2>
          <motion.p 
            className="text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed"
            whileInView={{ 
              opacity: [0, 1]
            }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            We offer comprehensive technology solutions to help your business thrive in the digital landscape.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayServices.map((service: ServiceType, index: number) => (
            <motion.div
              key={service.id || index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.5, 
                delay: 0.1 * index,
                ease: "easeOut"
              }}
            >
              <ServiceCard 
                icon={service.icon || Code}
                title={service.title}
                description={service.description}
                slug={service.slug}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceSection;
