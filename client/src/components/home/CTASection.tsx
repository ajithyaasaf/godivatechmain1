import React, { memo } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { RocketIcon } from "lucide-react";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { safeImageProps } from "@/lib/dom-elements-safe";

// Optimize with memoization to prevent unnecessary re-renders
const CTASection = memo(() => {
  // Animation variants for improved performance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.6,
        staggerChildren: 0.1
      } 
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  
  return (
    <section className="py-20 bg-white relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03] 
        [background-image:radial-gradient(#4f46e520_1px,transparent_1px)] 
        [background-size:24px_24px]"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <LazyMotion features={domAnimation} strict>
          <m.div 
            className="bg-neutral-800 rounded-lg shadow-xl overflow-hidden"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={containerVariants}
          >
            <div className="lg:flex">
              <m.div 
                className="lg:w-1/2 p-10 md:p-16"
                variants={itemVariants}
              >
                <m.h2 
                  className="text-3xl font-bold text-white mb-6"
                  variants={itemVariants}
                >
                  Ready to elevate your online presence?
                </m.h2>
                <m.p 
                  className="text-neutral-300 mb-8 text-lg"
                  variants={itemVariants}
                >
                  Let's discuss how our digital solutions can help grow your business. Contact us today for a free consultation with our expert team.
                </m.p>
                <m.div 
                  className="flex flex-col sm:flex-row gap-4"
                  variants={itemVariants}
                >
                  <Button 
                    asChild 
                    className="bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px]"
                  >
                    <Link href="/contact">Start a Project</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="bg-transparent border border-white text-white hover:bg-white/10 transition-all duration-300 hover:translate-y-[-2px]"
                  >
                    <Link href="/services">Learn More</Link>
                  </Button>
                </m.div>
              </m.div>
              
              <div className="lg:w-1/2 bg-gradient-to-br from-primary to-secondary hidden lg:block">
                <div className="relative h-full">
                  {/* Optimized image with lazy loading */}
                  <img
                    {...safeImageProps({
                      src: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                      alt: "Technology team working", 
                      className: "w-full h-full object-cover opacity-20",
                      loading: "lazy",
                      decoding: "async"
                    })}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <m.div 
                      className="text-center"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    >
                      {/* Use CSS animation instead of JS animation */}
                      <div className="text-white text-6xl mb-4 animate-pulse-slow" style={{ animationDuration: '3s' }}>
                        <RocketIcon className="h-16 w-16 mx-auto" />
                      </div>
                      <p className="text-white text-xl font-semibold">
                        Affordable IT & Technology Solutions
                      </p>
                    </m.div>
                  </div>
                </div>
              </div>
            </div>
          </m.div>
        </LazyMotion>
      </div>
    </section>
  );
});

// Add displayName for React DevTools
CTASection.displayName = "CTASection";

export default CTASection;
