import React, { useState, useEffect, useRef, memo, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { LazyMotion, domAnimation, m } from "framer-motion";
import OptimizedImage from "@/components/ui/optimized-image";

interface Testimonial {
  id: number;
  name: string;
  position: string;
  company: string;
  content: string;
  image: string;
}

// Optimized with memoization to prevent unnecessary renders
const TestimonialCard = memo(({ testimonial, index, isActive = true }: { 
  testimonial: Testimonial, 
  index: number,
  isActive?: boolean
}) => {
  // Pre-compute the animation delay once per component instance
  const animationDelay = useMemo(() => Math.min(index * 0.1, 0.3), [index]);
  
  return (
    <div 
      className={`bg-white rounded-lg shadow-lg p-8 relative hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
        isActive ? 'animate-fade-in' : ''
      }`}
      style={{ 
        willChange: "transform, opacity",
        animationDelay: `${animationDelay}s`
      }}
    >
      <div className="text-primary text-5xl absolute -top-4 -left-2">
        "
      </div>
      <p className="text-neutral-600 mb-6 relative z-10">
        {testimonial.content}
      </p>
      <div className="flex items-center">
        <OptimizedImage
          src={testimonial.image}
          alt={testimonial.name}
          className="w-12 h-12 rounded-full mr-4"
          width={48}
          height={48}
        />
        <div>
          <p className="font-semibold text-neutral-800">{testimonial.name}</p>
          <p className="text-neutral-500">{testimonial.position}, {testimonial.company}</p>
        </div>
      </div>
    </div>
  );
});

// Add displayName for React DevTools
TestimonialCard.displayName = "TestimonialCard";

// Optimized with memoization
const TestimonialsSection = memo(() => {
  // Animation variants for improved performance
  const headingVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };
  
  const textVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.6, delay: 0.2 }
    }
  };
  
  const { data: testimonials = [] } = useQuery<Testimonial[]>({
    queryKey: ['/api/testimonials'],
  });

  // State management for the carousel
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Memoize default testimonials to avoid unnecessary re-creation
  // Using smaller/optimized image URLs with better performance
  const defaultTestimonials = useMemo(() => [
    {
      id: 1,
      name: "Murugan Selvam",
      position: "",
      company: "Madurai",
      content: "Godiva Technologies created a beautiful website for our traditional silk business. The design perfectly showcases our products and has helped us reach customers across Tamil Nadu. Very professional team!",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60&fm=webp"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      position: "",
      company: "US",
      content: "Godiva Tech delivered exceptional logo design and branding services for our US-based creative agency. Their understanding of modern design trends and attention to detail exceeded our expectations. Highly recommended for branding projects!",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60&fm=webp"
    },
    {
      id: 3,
      name: "Karthik Ramasamy",
      position: "",
      company: "Madurai",
      content: "Our restaurant's online presence improved dramatically after Godiva Technologies built our website. Online orders increased by 60% and customer engagement is much better. Great work by the Madurai team!",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60&fm=webp"
    },
    {
      id: 4,
      name: "Lakshmi Sundar",
      position: "",
      company: "Chennai",
      content: "The digital marketing strategies implemented by Godiva Technologies have brought more customers to our jewelry store. Their social media campaigns perfectly capture our brand essence. Excellent service!",
      image: "https://images.unsplash.com/photo-1594736797933-d0401ba6fe65?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60&fm=webp"
    },
    {
      id: 5,
      name: "Vinoth Kumar",
      position: "",
      company: "Chennai",
      content: "As a fellow tech company in Chennai, we appreciate Godiva's technical expertise in web development. They helped us build a robust platform that serves our clients effectively. Top-notch development skills!",
      image: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60&fm=webp"
    }
  ], []);

  // Memoize to prevent recalculation
  const displayTestimonials = useMemo(() => 
    testimonials.length > 0 ? testimonials : defaultTestimonials
  , [testimonials, defaultTestimonials]);
  
  // Use layout effect for critical UI updates
  useEffect(() => {
    // Throttled resize handler to improve performance
    let resizeTimer: NodeJS.Timeout;
    
    const checkScreenSize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setIsSmallScreen(window.innerWidth < 768);
      }, 100); // 100ms throttle for better performance
    };
    
    checkScreenSize(); // Initial check
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);
  
  // Optimize auto-scrolling with a fixed interval
  useEffect(() => {
    if (!isSmallScreen && displayTestimonials.length > 1) {
      const interval = setInterval(() => {
        setCurrentTestimonialIndex((prev) => 
          prev === displayTestimonials.length - 1 ? 0 : prev + 1
        );
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [displayTestimonials.length, isSmallScreen]);
  
  return (
    <section className="py-20 overflow-hidden relative bg-gradient-to-br from-blue-800 to-indigo-900">
      {/* Add subtle background pattern instead of heavy animations */}
      <div className="absolute inset-0 opacity-10 
        [background-image:radial-gradient(#ffffff15_1px,transparent_1px)] 
        [background-size:20px_20px]"></div>
        
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <LazyMotion features={domAnimation} strict>
          <div className="text-center mb-16">
            <m.h2 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={headingVariants}
              className="text-3xl font-bold text-white mb-4"
            >
              Customer Success Stories & Madurai Web Design Testimonials
            </m.h2>
            <m.p 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={textVariants}
              className="text-lg text-white/90 max-w-2xl mx-auto"
            >
              See what local businesses say about our website design, development, and digital marketing services that have helped them grow their online presence.
            </m.p>
          </div>

          {isSmallScreen ? (
            // Grid layout for small screens with optimized animations
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayTestimonials.map((testimonial, index) => (
                <m.div
                  key={testimonial.id}
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
                  <TestimonialCard 
                    testimonial={testimonial}
                    index={index}
                  />
                </m.div>
              ))}
            </div>
          ) : (
            // Carousel for larger screens with optimized animations
            <div ref={carouselRef} className="relative">
              <div className="flex justify-center">
                <div className="w-full max-w-2xl">
                  {/* Using a key prop for React to detect change and animate properly */}
                  <m.div
                    key={currentTestimonialIndex}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    style={{ willChange: "transform, opacity" }}
                  >
                    <TestimonialCard 
                      testimonial={displayTestimonials[currentTestimonialIndex]}
                      index={0}
                      isActive={true}
                    />
                  </m.div>
                </div>
              </div>
              
              {/* Carousel indicators */}
              <div className="flex justify-center mt-8 space-x-2">
                {displayTestimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonialIndex(index)}
                    className={`w-3 h-3 rounded-full ${
                      index === currentTestimonialIndex 
                        ? 'bg-white' 
                        : 'bg-white/50 hover:bg-white/70'
                    } transition-colors duration-300`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
        </LazyMotion>
      </div>
    </section>
  );
});

// Add displayName for React DevTools
TestimonialsSection.displayName = "TestimonialsSection";

export default TestimonialsSection;
