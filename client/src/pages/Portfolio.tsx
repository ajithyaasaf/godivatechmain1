import React, { useState, memo, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence, LazyMotion, domAnimation, m } from "framer-motion";
import { ArrowRight, ExternalLink, Loader2, AlertCircle } from "lucide-react";
import CTASection from "@/components/home/CTASection";
import PageTransition, { TransitionItem } from "@/components/PageTransition";
import SEO from "@/components/SEO";
import { pageKeywords } from "@/lib/seoKeywords";
import OptimizedImage from "@/components/ui/optimized-image";
// Remove unused Firestore import - using API data instead
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
        <div className="relative overflow-hidden group h-64">
          {/* Overlay effect on hover */}
          <div className="absolute inset-0 bg-primary/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            <div className="px-4 py-2 bg-white/90 rounded-full text-primary font-medium text-sm flex items-center gap-1 transform scale-0 group-hover:scale-100 transition-transform duration-300">
              View Project <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>
          
          {/* Project image with fixed height container */}
          <div className="w-full h-64 bg-white">
            <OptimizedImage
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
              width={800}
              height={600}
            />
          </div>
          
          {/* Category badge */}
          <div className="absolute top-4 right-4 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md z-10">
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
  // Removed Firestore logic - using API only
  
  // Fetch projects from API
  const { data: apiProjects = [], isLoading: isLoadingApi } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  // Use API projects directly
  const displayProjects = apiProjects;
  
  // Log data source
  useEffect(() => {
    if (apiProjects.length > 0) {
      console.log("Using projects from API server");
    } else {
      console.log("No projects found from API");
    }
  }, [apiProjects.length]);
  
  // Get unique categories from projects
  const uniqueCategories = Array.from(new Set(displayProjects.map(project => project.category)));
  const categories = ['All', ...uniqueCategories];
  
  // Show loading state
  const isLoading = isLoadingApi && displayProjects.length === 0;
    
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
        title="Best Web Development in Madurai | Our Successful Project Portfolio - GodivaTech"
        description="Explore GodivaTech's portfolio of successful web development, app development, and digital marketing projects. See how we've helped businesses in Madurai achieve digital excellence."
        keywords={pageKeywords.portfolio.join(", ")}
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

              {/* Loading state */}
              {isLoading && (
                <motion.div 
                  className="flex flex-col items-center justify-center py-16"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                  <p className="text-neutral-600 text-lg">
                    Loading projects from database...
                  </p>
                </motion.div>
              )}
              
              {/* Empty state - no projects found */}
              {!isLoading && displayProjects.length === 0 && (
                <motion.div 
                  className="flex flex-col items-center justify-center py-16 px-4 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="h-8 w-8 text-amber-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-800 mb-2">No projects found</h3>
                  <p className="text-neutral-600 max-w-md mx-auto mb-8">
                    We couldn't retrieve any projects at this time. This could be due to a connection issue with our database.
                  </p>
                  <p className="text-neutral-500 text-sm">
                    Technical details: Failed to fetch from both the API server and Firestore directly.
                  </p>
                </motion.div>
              )}

              {/* Projects grid with staggered animation */}
              {!isLoading && displayProjects.length > 0 && (
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
              )}
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
