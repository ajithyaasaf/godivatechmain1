import React, { useState, useEffect, useRef, memo, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { Star, CheckCircle } from "lucide-react";
import OptimizedImage from "@/components/ui/optimized-image";

interface Testimonial {
  id: number;
  name: string;
  position: string;
  company: string;
  content: string;
  image?: string;
}

// Generate 2-letter uppercase initials from name
const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return (name.slice(0, 2) || "GT").toUpperCase();
};

// Vibrant curated gradients for authentic initials avatars
const GRADIENTS = [
  "from-blue-600 to-indigo-600",
  "from-purple-600 to-pink-600",
  "from-emerald-600 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-cyan-600 to-blue-600",
  "from-rose-500 to-red-600",
  "from-violet-600 to-purple-600"
];

const getAvatarGradient = (name: string): string => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
};

// Optimized with memoization to prevent unnecessary renders
const TestimonialCard = memo(({ testimonial, index, isActive = true }: { 
  testimonial: Testimonial, 
  index: number,
  isActive?: boolean
}) => {
  // Pre-compute the animation delay once per component instance
  const animationDelay = useMemo(() => Math.min(index * 0.1, 0.3), [index]);
  const initials = useMemo(() => getInitials(testimonial.name), [testimonial.name]);
  const gradient = useMemo(() => getAvatarGradient(testimonial.name), [testimonial.name]);

  // Clean location & subtitle without awkward commas
  const subtitle = useMemo(() => {
    const pos = (testimonial.position || "").trim();
    const comp = (testimonial.company || "").trim();
    if (pos && comp) return `${pos}, ${comp}`;
    if (pos) return pos;
    if (comp) return comp;
    return "Verified Client";
  }, [testimonial.position, testimonial.company]);
  
  // Check if image is a real uploaded photo (ignore unsplash placeholders)
  const hasRealCustomImage = Boolean(
    testimonial.image && 
    !testimonial.image.includes('images.unsplash.com') && 
    testimonial.image.trim() !== ''
  );

  return (
    <div 
      className={`bg-white rounded-2xl shadow-lg p-8 relative hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-neutral-100/80 ${
        isActive ? 'animate-fade-in' : ''
      }`}
      style={{ 
        willChange: "transform, opacity",
        animationDelay: `${animationDelay}s`
      }}
    >
      {/* 5-Star Rating Header */}
      <div className="flex items-center gap-1 text-amber-400 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
        ))}
      </div>

      <p className="text-neutral-700 mb-6 relative z-10 leading-relaxed text-base italic">
        "{testimonial.content}"
      </p>

      <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
        <div className="flex items-center">
          {hasRealCustomImage ? (
            <OptimizedImage
              src={testimonial.image!}
              alt={testimonial.name}
              className="w-12 h-12 rounded-full mr-4 object-cover shadow-sm"
              width={48}
              height={48}
            />
          ) : (
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-base shadow-md mr-4 flex-shrink-0 tracking-wider`}>
              {initials}
            </div>
          )}
          <div>
            <p className="font-bold text-neutral-900 text-base leading-snug">{testimonial.name}</p>
            <p className="text-sm text-neutral-500 font-medium">{subtitle}</p>
          </div>
        </div>

        {/* Verified Badge */}
        <div className="hidden sm:flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          <CheckCircle className="w-3.5 h-3.5 mr-1 text-emerald-500" />
          Verified
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
      content: "Godiva Technologies created a beautiful website for our traditional silk business. The design perfectly showcases our products and has helped us reach customers across Tamil Nadu. Very professional team!"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      position: "",
      company: "US",
      content: "Godiva Tech delivered exceptional logo design and branding services for our US-based creative agency. Their understanding of modern design trends and attention to detail exceeded our expectations. Highly recommended for branding projects!"
    },
    {
      id: 3,
      name: "Karthik Ramasamy",
      position: "",
      company: "Madurai",
      content: "Our restaurant's online presence improved dramatically after Godiva Technologies built our website. Online orders increased by 60% and customer engagement is much better. Great work by the Madurai team!"
    },
    {
      id: 4,
      name: "Lakshmi Sundar",
      position: "",
      company: "Chennai",
      content: "The digital marketing strategies implemented by Godiva Technologies have brought more customers to our jewelry store. Their social media campaigns perfectly capture our brand essence. Excellent service!"
    },
    {
      id: 5,
      name: "Vinoth Kumar",
      position: "",
      company: "Chennai",
      content: "As a fellow tech company in Chennai, we appreciate Godiva's technical expertise in web development. They helped us build a robust platform that serves our clients effectively. Top-notch development skills!"
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
              <div className="flex justify-center mt-8 gap-3">
                {displayTestimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonialIndex(index)}
                    className={`w-3 h-3 rounded-full p-2 ${
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
