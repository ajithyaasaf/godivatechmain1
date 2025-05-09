import React, { useState, memo, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence, LazyMotion, domAnimation, m } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";
import CTASection from "@/components/home/CTASection";
import PageTransition, { TransitionItem } from "@/components/PageTransition";
import SEO from "@/components/SEO";
import { portfolioKeywords } from "@/lib/seoKeywords";
import OptimizedImage from "@/components/ui/optimized-image";
import { 
  getOrganizationData, 
  getWebPageData,
  getBreadcrumbData,
  getCollectionPageData
} from "@/lib/structuredData";

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  technologies: string[];
  link?: string;
}

// Project card component with animation - optimized with memo and LazyMotion
const ProjectCard = memo(({ project, index }: { project: Project; index: number }) => {
  return (
    <LazyMotion features={domAnimation}>
      <m.div
        className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-neutral-100 h-full"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ 
          duration: 0.6,
          delay: index * 0.1 + 0.2,
          ease: [0.25, 0.1, 0.25, 1.0] 
        }}
        whileHover={{ y: -8 }}
      >
        <div className="relative overflow-hidden group">
          <div className="absolute inset-0 bg-primary/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="px-4 py-2 bg-white/90 rounded-full text-primary font-medium text-sm flex items-center gap-1 transform scale-0 group-hover:scale-100 transition-transform duration-300">
              View Project <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>
          
          <OptimizedImage
            src={project.image}
            alt={project.title}
            className="w-full h-64 object-contain bg-white transition-transform duration-500 group-hover:scale-105"
            width={800}
            height={600}
            priority={index < 3}
          />
          
          <div className="absolute top-4 right-4 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
            {project.category}
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-lg font-bold text-neutral-800 mb-2 group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <p className="text-neutral-600 mb-4 text-sm">{project.description}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.map((tech, idx) => (
              <span
                key={`tech-${project.id}-${tech}-${idx}`}
                className="bg-neutral-100 text-neutral-700 text-xs font-medium px-2.5 py-1 rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
          <a
            href={project.link || "#"}
            className="inline-flex items-center text-primary font-medium hover:text-primary-dark transition-colors text-sm group"
          >
            <span className="relative">
              View Case Study
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary origin-left group-hover:w-full transition-all duration-300" />
            </span>
            <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </a>
        </div>
      </m.div>
    </LazyMotion>
  );
});

// Methodology step component - optimized with memo and LazyMotion
const MethodologyStep = memo(({ number, title, description, delay }: { 
  number: number; 
  title: string; 
  description: string;
  delay: number;
}) => (
  <LazyMotion features={domAnimation}>
    <m.div 
      className="bg-white p-8 rounded-xl shadow-lg text-center border border-neutral-100 h-full"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -10, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)" }}
    >
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 relative hover:scale-110 transition-transform duration-300">
        {/* Pulse effect using CSS animation instead of JS animation */}
        <div 
          className="absolute inset-0 rounded-full bg-primary/5 animate-pulse"
        />
        <span className="text-xl font-bold text-primary relative z-10">{number}</span>
      </div>
      <h3 className="text-xl font-semibold text-neutral-800 mb-3">{title}</h3>
      <p className="text-neutral-600">
        {description}
      </p>
    </m.div>
  </LazyMotion>
));

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
  // Add a loading state to show loading indicator while fetching
  const { data: projects = [], isLoading, isError } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
    // Add retry logic and longer timeout to ensure we try harder to get data
    retry: 3,
    retryDelay: 1000,
    // Log all errors for debugging purposes
    onError: (error) => {
      console.error("Error fetching projects from API:", error);
    },
    // Log successful data retrieval
    onSuccess: (data) => {
      console.log("Projects fetched successfully, count:", data.length);
    }
  });

  // Default projects in case API doesn't return data
  // This will only be used if there's an error or if the API explicitly returns an empty array
  const defaultProjects = [
    {
      id: 1,
      title: "E-Commerce Platform Redesign",
      description: "Completely redesigned the online shopping experience for a leading retailer, resulting in a 40% increase in conversions.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "Software Development",
      technologies: ["React", "Node.js", "AWS"]
    },
    {
      id: 2,
      title: "Healthcare Data Migration",
      description: "Migrated a healthcare provider's legacy systems to a secure cloud infrastructure, improving performance by 60%.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "Cloud Solutions",
      technologies: ["Azure", "Kubernetes", "HIPAA"]
    },
    {
      id: 3,
      title: "Predictive Maintenance System",
      description: "Developed an AI-powered system for a manufacturing company that predicts equipment failures before they occur.",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "AI & Machine Learning",
      technologies: ["Python", "TensorFlow", "IoT"]
    },
    {
      id: 4,
      title: "Financial Services Mobile App",
      description: "Created a secure mobile banking application with advanced features like biometric authentication and real-time notifications.",
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "Software Development",
      technologies: ["React Native", "Node.js", "MongoDB"]
    },
    {
      id: 5,
      title: "Enterprise Resource Planning System",
      description: "Designed and implemented a custom ERP solution that integrated all departments and streamlined business processes.",
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "Software Development",
      technologies: ["Java", "Spring Boot", "PostgreSQL"]
    },
    {
      id: 6,
      title: "Cybersecurity Infrastructure Upgrade",
      description: "Strengthened a financial institution's security posture with advanced threat detection and prevention systems.",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "Cybersecurity",
      technologies: ["Palo Alto", "Splunk", "AWS Security"]
    }
  ];

  // Only use default projects if there's an error or the projects array is explicitly empty
  // If still loading, we should wait for the actual data
  const displayProjects = isError || (projects && projects.length === 0 && !isLoading) ? defaultProjects : projects;
  
  // Get unique categories from projects
  const uniqueCategories = Array.from(new Set(displayProjects.map(project => project.category)));
  const categories = ['All', ...uniqueCategories];
  
  // Filter projects by category
  const filteredProjects = activeFilter 
    ? displayProjects.filter(project => project.category === activeFilter) 
    : displayProjects;
    
  // Methodology steps
  const methodologySteps = [
    {
      number: 1,
      title: "Discovery",
      description: "We thoroughly analyze your requirements, goals, and challenges to define the project scope."
    },
    {
      number: 2,
      title: "Planning",
      description: "We create a detailed project plan with timelines, milestones, and resource allocation."
    },
    {
      number: 3,
      title: "Execution",
      description: "Our expert team develops the solution, with regular updates and feedback sessions."
    },
    {
      number: 4,
      title: "Delivery & Support",
      description: "We deploy the solution and provide ongoing support to ensure long-term success."
    }
  ];

  // SEO structured data array for rich snippets
  const structuredData = [
    getOrganizationData(),
    getWebPageData(
      "Successful Project Portfolio | Best Web Development in Madurai - GodivaTech",
      "Explore GodivaTech's portfolio of successful web development, app development, and digital marketing projects. See how we've helped businesses in Madurai achieve digital excellence.",
      "https://godivatech.com/portfolio"
    ),
    getBreadcrumbData([
      { name: "Home", item: "https://godivatech.com/" },
      { name: "Portfolio", item: "https://godivatech.com/portfolio" }
    ]),
    getCollectionPageData(
      "Project Portfolio",
      displayProjects.map(project => ({
        name: project.title,
        description: project.description,
        image: project.image
      }))
    )
  ];

  return (
    <PageTransition>
      <SEO
        title="Successful Project Portfolio | Best Web Development in Madurai - GodivaTech"
        description="Explore GodivaTech's portfolio of successful web development, app development, and digital marketing projects. See how we've helped businesses in Madurai achieve digital excellence."
        keywords={portfolioKeywords}
        canonicalUrl="/portfolio"
        ogType="website"
        ogImage="/images/portfolio-og-image.jpg"
        imageWidth={1200}
        imageHeight={630}
        cityName="Madurai"
        regionName="Tamil Nadu"
        countryName="India"
        twitterCard="summary_large_image"
        twitterSite="@godivatech"
        twitterCreator="@godivatech"
        robots="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        alternateUrls={[
          { hrefLang: "en-in", href: "https://godivatech.com/portfolio" },
          { hrefLang: "ta-in", href: "https://godivatech.com/ta/portfolio" }
        ]}
        structuredData={structuredData}
      />
      <div className="relative">
        {/* Hero section */}
        <TransitionItem>
          <section className="relative py-24 overflow-hidden">
            {/* Background gradient with mesh */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-indigo-800"></div>
            
            {/* Background patterns */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMjkgNTl2LTJoMnYyaC0yem0wLTRWMzloMnYxNmgtMnptMC0xOFYyMWgydjE2aC0yem0wLTE4VjNoMnYxNmgtMnptLTIgNDBWNDFoMnYxNmgtMnptMC0xOFYyM2gydjE2aC0yek0yNyA1VjNoMnYyaC0yem0yIDJWNWgydjJoLTJ6bTIgMlY3aDJ2MmgtMnptMiAyVjloMnYyaC0yem0yIDJWMTFoMnYyaC0yem0yIDJWMTNoMnYyaC0yem0yIDJWMTVoMnYyaC0yem0yIDJWMTdoMnYyaC0yem0yIDJWMTloMnYyaC0yem0tMTYgMTRWMzNoMnYyaC0yem0wIDRWMzdoMnYyaC0yem0wIDRWNDFoMnYyaC0yem0wIDRWNDVoMnYyaC0yem0wIDRWNDloMnYyaC0yem0wIDRWNTNoMnYyaC0yem0wIDRWNTdoMnYyaC0yeiIvPjwvZz48L2c+PC9zdmc+')]"></div>
            </div>
            
            {/* Content */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center max-w-3xl mx-auto text-white">
                <LazyMotion features={domAnimation}>
                  <m.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                  >
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                      Our Project <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-200">Portfolio</span>
                    </h1>
                    <p className="text-xl text-white/90 mb-6">
                      Explore our successful projects and see how we've helped businesses across various industries achieve their goals through innovative technology solutions.
                    </p>
                  </m.div>
                  
                  {/* Animated highlight */}
                  <m.div
                    className="mt-8 inline-block bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg border border-white/20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                  >
                    <span className="font-medium">
                      Delivering excellence across {categories.length - 1} specialized service areas
                    </span>
                  </m.div>
                </LazyMotion>
              </div>
            </div>
            
            {/* Decorative elements with CSS animations instead of JS for better performance */}
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/30 rounded-full blur-3xl animate-float-slow" />
            <div className="absolute top-1/4 -right-10 w-60 h-60 bg-indigo-500/30 rounded-full blur-3xl animate-float-reverse" />
          </section>
        </TransitionItem>

        {/* Filter and projects section */}
        <TransitionItem delay={0.2}>
          <section className="py-20 bg-neutral-50 relative">
            {/* Subtle grid pattern */}
            <div className="absolute inset-0 
              [background-image:linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] 
              [background-size:4rem_4rem]" />
              
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              {/* Filter buttons */}
              <motion.div 
                className="mb-12 flex flex-wrap justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                {categories.map((category, index) => (
                  <motion.button
                    key={`filter-category-${category}-${index}`}
                    onClick={() => setActiveFilter(category === 'All' ? null : category)}
                    className={`py-2 px-6 rounded-full text-sm font-medium transition-all duration-300 ${
                      (category === 'All' && activeFilter === null) || category === activeFilter
                        ? "bg-primary text-white shadow-md"
                        : "bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200"
                    }`}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                  >
                    {category}
                  </motion.button>
                ))}
              </motion.div>

              {/* Projects grid with staggered animation */}
              <AnimatePresence mode="wait">
                <motion.div 
                  key={activeFilter || 'all'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {filteredProjects.map((project, index) => (
                    <ProjectCard 
                      key={project.id} 
                      project={project} 
                      index={index} 
                    />
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </section>
        </TransitionItem>

        {/* Methodology section */}
        <TransitionItem delay={0.1}>
          <section className="py-20 bg-white relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl -ml-48 -mb-48" />
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <motion.div 
                className="text-center mb-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <div className="inline-flex items-center justify-center mb-4 px-3 py-1 rounded-full bg-primary/5 border border-primary/10">
                  <span className="text-primary font-semibold text-sm">OUR APPROACH</span>
                </div>
                
                <h2 className="text-4xl font-bold text-neutral-800 mb-4">Our Project Methodology</h2>
                <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                  We follow a proven approach to ensure successful project delivery and exceptional results.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {methodologySteps.map((step, index) => (
                  <MethodologyStep 
                    key={`methodology-step-${step.title}-${index}`}
                    number={step.number}
                    title={step.title}
                    description={step.description}
                    delay={0.1 * index + 0.2}
                  />
                ))}
              </div>
            </div>
          </section>
        </TransitionItem>

        {/* CTA Section */}
        <TransitionItem delay={0.2}>
          <CTASection />
        </TransitionItem>
      </div>
    </PageTransition>
  );
};

export default Portfolio;
