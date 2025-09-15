import React, { memo, useMemo, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ChevronRightIcon, ChevronLeftIcon, ChevronRight, ImageIcon } from "lucide-react";
import { LazyMotion, domAnimation, m } from "framer-motion";
import OptimizedImage from "@/components/ui/optimized-image";

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  technologies: string[];
  link?: string;
  gallery?: string[];
}

// Enhanced ProjectCard with gallery support
const ProjectCard = memo(({ project, index }: { project: Project; index: number }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const animationDelay = useMemo(() => Math.min(index * 0.1, 0.4), [index]);
  
  // Use gallery if available, otherwise fall back to single image
  const images = useMemo(() => {
    if (project.gallery && project.gallery.length > 0) {
      return project.gallery;
    }
    return [project.image];
  }, [project.gallery, project.image]);
  
  const hasMultipleImages = images.length > 1;
  
  // Navigation functions
  const nextImage = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);
  
  const prevImage = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);
  
  return (
    <div 
      className="bg-neutral-50 rounded-lg overflow-hidden shadow hover:shadow-lg transition-all duration-300 transform hover:translate-y-[-3px]"
      style={{ 
        willChange: "transform, box-shadow",
        animationDelay: `${animationDelay}s`
      }}
    >
      <div className="relative group">
        <OptimizedImage
          src={images[currentImageIndex]}
          alt={`${project.title} - Image ${currentImageIndex + 1}`}
          className="w-full h-64 object-contain bg-white transition-opacity duration-300"
          width={400}
          height={256}
        />
        
        {/* Category badge */}
        <div className="absolute top-4 right-4 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
          {project.category}
        </div>
        
        {/* Gallery indicators and controls */}
        {hasMultipleImages && (
          <>
            {/* Gallery count indicator */}
            <div className="absolute top-4 left-4 bg-black/70 text-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1 z-30">
              <ImageIcon className="h-3 w-3" />
              {images.length}
            </div>
            
            {/* Navigation arrows - only show on hover */}
            <button
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-30"
              aria-label="Previous image"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            
            <button
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-30"
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            
            {/* Dot indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-30">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentImageIndex(idx);
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    idx === currentImageIndex 
                      ? 'bg-white scale-125' 
                      : 'bg-white/60 hover:bg-white/80'
                  }`}
                  aria-label={`View image ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold text-neutral-800 mb-2">{project.title}</h3>
        <p className="text-neutral-600 mb-4 line-clamp-3 hover:line-clamp-none transition-all duration-300">
          {project.description}
        </p>
        
        {/* Show image count for multi-image projects */}
        {hasMultipleImages && (
          <div className="text-sm text-neutral-500 mb-3 flex items-center gap-1">
            <ImageIcon className="h-4 w-4" />
            {images.length} design variations
          </div>
        )}
        
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((tech, index) => (
            <span
              key={index}
              className="bg-neutral-200 text-neutral-700 text-xs font-medium px-2.5 py-1 rounded"
            >
              {tech}
            </span>
          ))}
        </div>
        
        <Link
          href={project.link || "/portfolio"}
          className="text-primary font-medium hover:text-primary/90 transition duration-150 flex items-center group"
        >
          View Case Study 
          <ChevronRightIcon className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
});

// Add displayName for React DevTools
ProjectCard.displayName = "ProjectCard";

// Memoize the entire section component for better performance
const PortfolioSection = memo(() => {
  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  // Memoize default projects to avoid recreating on each render
  const defaultProjects = useMemo(() => [
    {
      id: 1,
      title: "Tilted – Email Campaign",
      description: "Created engaging email campaign designs to maximize customer engagement and conversion rates.",
      image: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "Marketing",
      technologies: ["Email Design", "Digital Marketing", "Brand Strategy"]
    },
    {
      id: 2,
      title: "Marakkaar Biryani",
      description: "Developed promotional materials and marketing strategy for this popular food brand to increase visibility.",
      image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "Marketing",
      technologies: ["Social Media", "Poster Design", "Brand Promotion"]
    },
    {
      id: 3,
      title: "India Cater",
      description: "Created distinctive marketing materials that showcased the catering company's services and offerings.",
      image: "https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "Marketing",
      technologies: ["Brand Identity", "Poster Design", "Marketing Strategy"]
    },
    {
      id: 4,
      title: "Siddahayur Health Care",
      description: "Designed healthcare marketing materials that effectively communicated wellness services to potential clients.",
      image: "https://images.unsplash.com/photo-1584982751601-97dcc096659c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "Marketing",
      technologies: ["Healthcare Marketing", "Visual Design", "Brand Strategy"]
    },
    {
      id: 5,
      title: "Wrap & Eat",
      description: "Created vibrant promotional materials for this food business to attract customers and build brand recognition.",
      image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "Marketing",
      technologies: ["Food Marketing", "Graphic Design", "Branding"]
    },
    {
      id: 6,
      title: "Jeeva Vasal Church",
      description: "Designed compelling poster designs for events and communications that aligned with the organization's mission.",
      image: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "Marketing",
      technologies: ["Event Promotion", "Community Outreach", "Visual Design"]
    }
  ], []);

  // Memoize calculated value to avoid unnecessary re-calculations
  const displayProjects = useMemo(() => 
    projects.length > 0 ? projects : defaultProjects
  , [projects, defaultProjects]);

  return (
    <section id="portfolio" className="py-20 bg-white relative">
      {/* Subtle background pattern for visual interest without heavy animations */}
      <div className="absolute inset-0 opacity-5 
        [background-image:linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] 
        [background-size:6rem_6rem]" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <LazyMotion features={domAnimation} strict>
          <m.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2 className="text-3xl font-bold text-neutral-800 mb-4">Web Design Projects & Creative Digital Marketing Case Studies</h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Explore our diverse portfolio showcasing successful websites, mobile apps, and marketing campaigns developed for businesses in Madurai and throughout Tamil Nadu.
            </p>
          </m.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayProjects.map((project, index) => (
              <m.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ 
                  duration: 0.5, 
                  delay: Math.min(0.1 * index, 0.3), 
                  ease: "easeOut" 
                }}
                style={{ willChange: "transform, opacity" }}
              >
                <ProjectCard 
                  project={project} 
                  index={index}
                />
              </m.div>
            ))}
          </div>

          <m.div 
            className="text-center mt-12"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link 
              href="/portfolio" 
              className="inline-flex items-center justify-center px-6 py-3 rounded-full
                        bg-gradient-to-r from-primary/90 to-indigo-600/90 text-white font-semibold
                        shadow-lg hover:shadow-primary/20 transition-all duration-300
                        hover:scale-105 active:scale-95"
            >
              View All Projects
              <ChevronRightIcon className="ml-2 h-4 w-4" />
            </Link>
          </m.div>
        </LazyMotion>
      </div>
    </section>
  );
});

// Add displayName for React DevTools
PortfolioSection.displayName = "PortfolioSection";

export default PortfolioSection;
