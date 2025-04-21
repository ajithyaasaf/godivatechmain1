import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { typeText, createButtonPulse } from "@/lib/animation";
import { useParallax } from "@/hooks/use-parallax";
import { ChevronDown, ArrowRight, MousePointer } from "lucide-react";

const HeroSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaButtonRef = useRef<HTMLButtonElement>(null);
  const [imageRef, imageOffset] = useParallax<HTMLDivElement>(-0.15);
  const [contentRef, contentOffset] = useParallax<HTMLDivElement>(0.1);
  
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
  
  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  
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
  
  return (
    <div 
      ref={sectionRef} 
      className="relative h-[100vh] min-h-[700px] overflow-hidden flex items-center"
    >
      {/* Modern gradient background with animated overlay */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-tr from-primary/90 via-primary to-[#5C41FF]"
        style={{ opacity: backgroundOpacity }}
      >
        {/* Animated grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZoLTJ2LTRoMnY0em0wLTZoLTJ2LTRoMnY0em0wLTZoLTJWOGgydjR6bTAgMThoLTJ2LTRoMnY0em0wIDZoLTJ2LTRoMnY0em0wIDZoLTJ2LTRoMnY0em0wIDZoLTJ2LTRoMnY0em0tNiAwSDI4di00aDJ2NHptLTYgMGgtNHYtNGg0djR6bS02IDBoLTR2LTRoNHY0em0tNiAwSDh2LTRoNHY0em0wLTZoLTR2LTRoNHY0em0wLTZoLTR2LTRoNHY0em0wLTZoLTR2LTRoNHY0em0wLTZoLTR2LTRoNHY0em0wLTZoLTRWOGg0djR6TTI4IDhoMnY0aC0yVjh6bTYgMGgydjRoLTJWOHptNiAwaDJ2NGgtMlY4em02IDBoMnY0aC0yVjh6bTYgMGg0djRoLTRWOHptMCA2aDR2NGgtNHYtNHptMCA2aDR2NGgtNHYtNHptMCA2aDR2NGgtNHYtNHptMCA2aDR2NGgtNHYtNHptMCA2aDR2NGgtNHYtNHptLTYgMGgydjRoLTJ2LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20 bg-[length:30px_30px]" />
        
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-transparent to-black/30"
          style={{ 
            y: useTransform(scrollYProgress, [0, 1], ["0%", "20%"]) 
          }}
        />
      </motion.div>
      
      {/* Modern floating elements */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        {/* Larger blurred circles */}
        <motion.div 
          className="absolute top-[20%] left-[10%] w-64 h-64 rounded-full bg-white/10 blur-3xl"
          animate={{ 
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.15, 0.1] 
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div 
          className="absolute bottom-[30%] right-[15%] w-80 h-80 rounded-full bg-blue-300/10 blur-3xl"
          animate={{ 
            y: [0, -40, 0],
            scale: [1, 1.15, 1],
            opacity: [0.1, 0.18, 0.1] 
          }}
          transition={{ 
            duration: 18, 
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        
        {/* Small floating particles */}
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              opacity: Math.random() * 0.3 + 0.1,
            }}
            animate={{ 
              y: [0, Math.random() * 30 * (Math.random() > 0.5 ? 1 : -1)],
              x: [0, Math.random() * 30 * (Math.random() > 0.5 ? 1 : -1)],
              opacity: [Math.random() * 0.3, Math.random() * 0.5, Math.random() * 0.3]
            }}
            transition={{ 
              duration: Math.random() * 5 + 5, 
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        ))}
      </div>
      
      {/* Content container with animated effects */}
      <motion.div 
        className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20"
        style={{ opacity: contentOpacity }}
      >
        <div className="flex flex-col md:flex-row items-center">
          <motion.div 
            ref={contentRef}
            className="w-full md:w-1/2 text-center md:text-left mb-10 md:mb-0"
            style={{ y: contentOffset.y }}
          >
            <div className="mb-6 inline-block">
              <motion.span 
                className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
                Innovative Technology Solutions
              </motion.span>
            </div>
            
            <motion.h1 
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6 tracking-tight"
            >
              Empowering Your <span className="relative inline-block">
                Future
                <motion.span 
                  className="absolute bottom-1 left-0 w-full h-2 bg-white/20 rounded-full" 
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, delay: 1 }}
                />
              </span> with Innovative Tech
            </motion.h1>
            
            <p 
              ref={subtitleRef} 
              className="text-xl text-white/90 mb-8 max-w-lg min-h-[4rem]"
              style={{ visibility: 'hidden' }}
            >
              {/* Text will be filled in by typing effect */}
            </p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  ref={ctaButtonRef}
                  asChild 
                  size="lg" 
                  className="bg-white text-primary hover:bg-neutral-100 shadow-lg transition-all duration-300 group overflow-hidden relative"
                >
                  <Link href="/contact">
                    <span className="relative z-10 flex items-center">
                      Get Started 
                      <motion.span 
                        className="ml-2"
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop", repeatDelay: 2 }}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </motion.span>
                    </span>
                    <motion.span 
                      className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-out"
                    />
                  </Link>
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg" 
                  className="bg-transparent border-2 border-white text-white hover:bg-white/10 shadow-lg"
                >
                  <Link href="/services">Discover Solutions</Link>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            ref={imageRef}
            className="w-full md:w-1/2 flex justify-center md:justify-end"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            style={{ y: imageOffset.y }}
          >
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
            >
              {/* Hero image with modern styling */}
              <motion.div className="relative">
                <motion.div 
                  className="absolute -inset-1 bg-gradient-to-r from-white/40 to-white/10 rounded-xl blur-sm"
                  animate={{ 
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
                <motion.img 
                  src="https://images.unsplash.com/photo-1581092921461-7d54dbd7fb49?ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=80" 
                  alt="Technology illustration" 
                  className="rounded-xl shadow-2xl w-full max-w-md relative z-10 border border-white/20"
                />
              </motion.div>
              
              {/* Interactive floating elements around the image */}
              <motion.div 
                className="absolute -top-5 -left-5 w-24 h-24 rounded-lg bg-blue-500/40 backdrop-blur-md"
                style={{
                  y: useTransform(scrollYProgress, [0, 1], ["0%", "20%"]),
                  rotate: useTransform(scrollYProgress, [0, 1], ["0deg", "10deg"]),
                }}
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, 0]
                }}
                transition={{ 
                  duration: 6, 
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
              
              <motion.div 
                className="absolute -bottom-5 -right-5 w-28 h-28 rounded-full bg-purple-600/30 backdrop-blur-md"
                style={{
                  y: useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]),
                }}
                animate={{ 
                  scale: [1, 0.9, 1],
                  rotate: [0, -5, 0]
                }}
                transition={{ 
                  duration: 8, 
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
              
              <motion.div 
                className="absolute top-1/2 -right-8 w-16 h-16 rounded-lg bg-white/20 backdrop-blur-md rotate-12"
                animate={{ 
                  y: [-10, 10, -10],
                  rotate: [12, 0, 12]
                }}
                transition={{ 
                  duration: 10, 
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 text-white flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
      >
        <motion.span 
          className="text-sm mb-2 opacity-80"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Scroll to explore
        </motion.span>
        <motion.button
          onClick={scrollToNext}
          className="p-2 rounded-full border border-white/30 hover:bg-white/10 transition-colors"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronDown className="h-4 w-4" />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default HeroSection;
