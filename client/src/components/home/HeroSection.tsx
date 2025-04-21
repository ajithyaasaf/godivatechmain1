import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { typeText, createButtonPulse } from "@/lib/animation";
import { useParallax } from "@/hooks/use-parallax";
import { 
  ChevronDown, ArrowRight, MousePointer, ArrowUpRight, 
  Sparkles, Rocket, Code, BarChart3, Layers, BarChart
} from "lucide-react";

const HeroSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaButtonRef = useRef<HTMLButtonElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Ultra-light parallax to avoid blur issues
  const [imageRef, imageOffset] = useParallax<HTMLDivElement>(-0.02);
  const [contentRef, contentOffset] = useParallax<HTMLDivElement>(0.02);
  
  // Scroll-based animations using framer-motion
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });
  
  const scrollToNext = () => {
    const nextSection = document.getElementById('services');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // Keep content fully visible during scroll
  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 1]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 1]);
  
  useEffect(() => {
    if (subtitleRef.current) {
      setTimeout(() => {
        typeText(
          subtitleRef,
          "Transforming ideas into powerful digital solutions that drive growth and efficiency for forward-thinking companies.",
          25,
          800
        );
      }, 500);
    }
    
    if (ctaButtonRef.current) {
      createButtonPulse(ctaButtonRef);
    }
  }, []);
  
  // Featured services to display in hero
  const featuredServices = [
    { icon: Code, label: "Software Development" },
    { icon: Layers, label: "Cloud Solutions" },
    { icon: BarChart, label: "Data Analytics" }
  ];
  
  // Animation variants
  const itemFadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" } 
    }
  };
  
  return (
    <div 
      ref={sectionRef} 
      className="relative min-h-[100vh] overflow-hidden flex items-center py-20"
      style={{ position: 'relative' }} // Ensure position for scroll measurements
    >
      {/* Modern 3D mesh gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-primary to-purple-800 opacity-90" />
        
        {/* Noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.15] 
          [background-image:url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]" />
        
        {/* Animated gradient circles */}
        <div 
          className="absolute top-1/4 -left-10 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" 
          style={{ animationDelay: '0s' }}
        />
        <div 
          className="absolute top-1/3 -right-10 w-72 h-72 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" 
          style={{ animationDelay: '2s' }}
        />
        <div 
          className="absolute -bottom-10 left-1/4 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" 
          style={{ animationDelay: '4s' }}
        />
        
        {/* Grid lines */}
        <div className="absolute inset-0 
          [background-image:linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] 
          [background-size:4rem_4rem]" />
      </div>
      
      {/* Glowing sparkles */}
      <div className="absolute inset-0 overflow-hidden z-10 pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              filter: 'blur(1px)',
              boxShadow: '0 0 6px 2px rgba(255, 255, 255, 0.3)',
            }}
            animate={{
              opacity: [0.1, 0.8, 0.1],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left content */}
          <motion.div 
            ref={contentRef}
            className="lg:order-1 mt-8 lg:mt-0 text-center lg:text-left"
            style={{ y: contentOffset.y }}
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
          >
            <motion.div 
              variants={itemFadeIn}
              className="mb-6 inline-flex"
            >
              <motion.span 
                className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium border border-white/20"
                whileHover={{ scale: 1.05 }}
              >
                <Sparkles className="h-3.5 w-3.5 mr-2 text-yellow-300" />
                Next-Gen Technology Solutions
              </motion.span>
            </motion.div>
            
            <motion.h1 
              variants={itemFadeIn}
              className="text-5xl md:text-6xl xl:text-7xl font-bold text-white leading-[1.1] mb-6 tracking-tight"
            >
              <span className="block">
                Transform Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-200">Digital</span>
              </span>
              <span className="block mt-2">
                Future with <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-200">Innovation</span>
              </span>
            </motion.h1>
            
            <motion.div variants={itemFadeIn}>
              <p 
                ref={subtitleRef} 
                className="text-xl text-white/90 mb-6 max-w-xl lg:mx-0 mx-auto min-h-[4rem]"
                style={{ visibility: 'hidden' }}
              >
                {/* Text will be filled in by typing effect */}
              </p>
            </motion.div>
            
            <motion.div 
              variants={itemFadeIn}
              className="flex flex-wrap gap-4 justify-center lg:justify-start mt-8"
            >
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto"
              >
                <Button 
                  ref={ctaButtonRef}
                  asChild 
                  size="lg" 
                  className="bg-white text-primary hover:bg-neutral-50 shadow-lg hover:shadow-xl transition-all duration-300 rounded-full w-full sm:w-auto"
                >
                  <Link href="/contact">
                    <span className="flex items-center justify-center gap-2">
                      Get Started 
                      <ArrowUpRight strokeWidth={2.5} className="h-4 w-4" />
                    </span>
                  </Link>
                </Button>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto"
              >
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg" 
                  className="border-white/20 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 rounded-full w-full sm:w-auto"
                >
                  <Link href="/services">Explore Solutions</Link>
                </Button>
              </motion.div>
            </motion.div>
            
            {/* Featured services tags */}
            <motion.div 
              variants={itemFadeIn}
              className="mt-10 flex flex-wrap gap-2 justify-center lg:justify-start"
            >
              <span className="text-white/70 mr-2 text-sm">Featured:</span>
              {featuredServices.map((service, index) => (
                <motion.span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white/90 bg-white/5 border border-white/10 backdrop-blur-sm"
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                >
                  <service.icon className="h-3 w-3 mr-1.5" />
                  {service.label}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
          
          {/* 3D isometric illustration */}
          <motion.div 
            ref={imageRef}
            className="lg:order-2 flex justify-center items-center"
            style={{ y: imageOffset.y }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <div className="relative w-full max-w-lg">
              {/* Glowing background shape */}
              <motion.div 
                className="absolute top-0 left-1/2 -translate-x-1/2 h-[350px] w-[350px] rounded-full bg-gradient-to-br from-blue-400/20 to-purple-600/20 blur-3xl"
                animate={{
                  scale: [0.8, 1, 0.8],
                  opacity: [0.4, 0.6, 0.4]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
              
              {/* Hero image with 3D effect */}
              <div className="relative mx-auto">
                {/* 3D floating platform */}
                <motion.div
                  className="relative mx-auto"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ 
                    duration: 1,
                    delay: 0.8,
                    ease: "easeOut"
                  }}
                >
                  {/* Main image container */}
                  <div className="relative w-full max-w-[400px] aspect-square mx-auto transform perspective-[1000px]">
                    {/* 3D effect shadow */}
                    <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-2xl opacity-40 blur-xl transform rotate-3" />
                    
                    {/* Image */}
                    <motion.div
                      className="relative w-full h-full rounded-3xl overflow-hidden border border-white/20 shadow-2xl transform rotate-2 bg-gradient-to-br from-indigo-900/90 to-purple-900/90 backdrop-blur-sm"
                      animate={{ 
                        rotateX: [0, -2, 0, 2, 0], 
                        rotateY: [0, 2, 0, -2, 0] 
                      }}
                      transition={{ 
                        duration: 12, 
                        ease: "easeInOut", 
                        repeat: Infinity,
                        repeatType: "loop"
                      }}
                    >
                      <img 
                        src="https://images.unsplash.com/photo-1581092921461-7d54dbd7fb49?ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=80" 
                        alt="Digital Transformation Illustration" 
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{ opacity: 0.8, mixBlendMode: 'soft-light' }}
                        onLoad={() => setImageLoaded(true)}
                      />
                      
                      {/* Overlay content */}
                      <div className="absolute inset-0 flex flex-col justify-center items-center p-8 text-white">
                        <motion.div 
                          className="w-16 h-16 bg-white/10 rounded-full backdrop-blur-sm flex items-center justify-center mb-4 border border-white/20"
                          animate={{ 
                            scale: [1, 1.1, 1],
                            rotate: [0, 10, 0],
                            boxShadow: [
                              '0 0 0 0 rgba(255,255,255,0.3)',
                              '0 0 0 10px rgba(255,255,255,0)',
                              '0 0 0 0 rgba(255,255,255,0)'
                            ]
                          }}
                          transition={{ 
                            duration: 3,
                            repeat: Infinity
                          }}
                        >
                          <Rocket className="h-8 w-8 text-white" />
                        </motion.div>
                        <h3 className="text-2xl font-bold text-center mb-2">Digital Innovation</h3>
                        <p className="text-center text-sm text-white/80">Building the future with cutting-edge technology</p>
                      </div>
                      
                      {/* Glowing accent */}
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/20 via-purple-500/0 to-transparent" />
                    </motion.div>
                  </div>
                  
                  {/* Floating elements around the main image */}
                  <motion.div 
                    className="absolute -top-5 -left-10 w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 border border-white/20 backdrop-blur-sm shadow-lg"
                    animate={{ 
                      y: [0, -10, 0],
                      rotate: [0, 5, 0]
                    }}
                    transition={{ 
                      duration: 8, 
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  />
                  
                  <motion.div 
                    className="absolute -bottom-10 right-10 w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-pink-600 border border-white/20 backdrop-blur-sm shadow-lg"
                    animate={{ 
                      y: [0, 10, 0],
                      rotate: [0, -5, 0]
                    }}
                    transition={{ 
                      duration: 7, 
                      repeat: Infinity,
                      repeatType: "reverse",
                      delay: 1
                    }}
                  />
                  
                  <motion.div 
                    className="absolute bottom-20 -right-8 w-16 h-16 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 border border-white/20 backdrop-blur-sm shadow-lg rotate-12"
                    animate={{ 
                      y: [0, 8, 0],
                      rotate: [12, 0, 12]
                    }}
                    transition={{ 
                      duration: 6, 
                      repeat: Infinity,
                      repeatType: "reverse",
                      delay: 2
                    }}
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Modern scroll indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-30 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
      >
        <motion.span 
          className="text-sm mb-3 text-white/70 font-light"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Scroll to explore
        </motion.span>
        <motion.button
          onClick={scrollToNext}
          className="relative w-8 h-12 rounded-full border border-white/20 flex items-center justify-center overflow-hidden backdrop-blur-sm bg-white/5"
          whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
        >
          <motion.div
            animate={{ 
              y: [0, 16, 0] 
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
              repeatDelay: 0.5
            }}
            className="w-1.5 h-1.5 bg-white rounded-full"
          />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default HeroSection;
