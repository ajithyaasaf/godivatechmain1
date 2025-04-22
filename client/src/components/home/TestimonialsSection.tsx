import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

interface Testimonial {
  id: number;
  name: string;
  position: string;
  company: string;
  content: string;
  image: string;
}

const TestimonialCard = ({ testimonial, index }: { testimonial: Testimonial, index: number }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2 }}
      className="bg-white rounded-lg shadow-lg p-8 relative hover:shadow-xl transition-shadow duration-300"
      whileHover={{ y: -5 }}
    >
      <div className="text-primary text-5xl absolute -top-4 -left-2">
        "
      </div>
      <p className="text-neutral-600 mb-6 relative z-10">
        {testimonial.content}
      </p>
      <div className="flex items-center">
        <img
          src={testimonial.image}
          alt={testimonial.name}
          className="w-12 h-12 rounded-full mr-4"
        />
        <div>
          <p className="font-semibold text-neutral-800">{testimonial.name}</p>
          <p className="text-neutral-500">{testimonial.position}, {testimonial.company}</p>
        </div>
      </div>
    </motion.div>
  );
};

const TestimonialsSection = () => {
  const { data: testimonials = [] } = useQuery<Testimonial[]>({
    queryKey: ['/api/testimonials'],
  });

  // Default testimonials in case API doesn't return data
  const defaultTestimonials = [
    {
      id: 1,
      name: "Siva Prakash",
      position: "Owner",
      company: "Give Grants",
      content: "Godiva Technologies revamped our website with a modern design and improved user experience. Their team was quick to understand our requirements and delivered exactly what we needed for our business.",
      image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      id: 2,
      name: "Ahmed Al-Maktoum",
      position: "Director",
      company: "UAE Business Solutions",
      content: "We appreciate Godiva Tech's professional approach to website development. They created a website that perfectly represents our brand and has helped increase our customer inquiries by 40%.",
      image: "https://randomuser.me/api/portraits/men/33.jpg"
    },
    {
      id: 3,
      name: "Priya Venkatesh",
      position: "Marketing Manager",
      company: "Padmarajam Textiles",
      content: "The social media marketing campaigns designed by Godiva Technologies have significantly improved our online presence. Their team is responsive, creative, and delivers great results on time.",
      image: "https://randomuser.me/api/portraits/women/28.jpg"
    }
  ];

  const displayTestimonials = testimonials.length > 0 ? testimonials : defaultTestimonials;

  // Create carousel effect with auto-scroll
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  
  useEffect(() => {
    // Check screen size for responsive design
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    // Auto-scroll testimonials on larger screens
    if (!isSmallScreen) {
      const interval = setInterval(() => {
        setCurrentTestimonialIndex((prev) => 
          prev === displayTestimonials.length - 1 ? 0 : prev + 1
        );
      }, 5000);
      
      return () => {
        clearInterval(interval);
        window.removeEventListener('resize', checkScreenSize);
      };
    }
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [displayTestimonials.length, isSmallScreen]);
  
  // Animation variants for section heading
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
  
  return (
    <section className="py-20 overflow-hidden relative bg-gradient-to-br from-blue-800 to-indigo-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={headingVariants}
            className="text-3xl font-bold text-white mb-4"
          >
            What Our Clients Say
          </motion.h2>
          <motion.p 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={textVariants}
            className="text-lg text-white/90 max-w-2xl mx-auto"
          >
            Hear directly from our satisfied clients about their experience working with Godiva Technologies.
          </motion.p>
        </div>

        {isSmallScreen ? (
          // Grid layout for small screens
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayTestimonials.map((testimonial, index) => (
              <div key={testimonial.id}>
                <TestimonialCard 
                  testimonial={testimonial}
                  index={index}
                />
              </div>
            ))}
          </div>
        ) : (
          // Carousel for larger screens
          <div ref={carouselRef} className="relative">
            <div className="flex justify-center">
              <motion.div
                key={currentTestimonialIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-2xl"
              >
                <TestimonialCard 
                  testimonial={displayTestimonials[currentTestimonialIndex]}
                  index={0}
                />
              </motion.div>
            </div>
            
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
      </div>
    </section>
  );
};

export default TestimonialsSection;
