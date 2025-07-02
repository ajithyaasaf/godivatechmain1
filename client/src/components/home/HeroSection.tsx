import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useScroll, useTransform } from "framer-motion";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { typeText } from "@/lib/animation";
import { 
  ArrowUpRight, Sparkles, Code, Layers, BarChart
} from "lucide-react";
import { preloadHeroImages, optimizeFonts, decodeImagesAsync } from "@/lib/lcp-optimization";
import { delayAnimationsUntilAfterLCP, getOptimizedAnimationVariants } from "@/lib/animation-optimizer";

// Hero Section with optimized animations for performance
const HeroSection = () => {
  // Refs for different elements
  const sectionRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaButtonRef = useRef<HTMLButtonElement>(null);
  
  // Simplified scroll animation
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });
  
  // Scroll to services section - memoized to avoid recreation on each render
  const scrollToNext = useCallback(() => {
    const nextSection = document.getElementById('services');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);
  
  // Scroll-based visibility effects
  const scrollOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  
  // Type animation effect - optimized for LCP
  useEffect(() => {
    let typingTimeout: NodeJS.Timeout;
    
    // Optimize LCP (Largest Contentful Paint)
    // 1. Preload hero images to improve render time
    preloadHeroImages([
      '/src/assets/godiva-logo.png',
      // Add any other critical hero images here
    ]);
    
    // 2. Optimize font loading
    optimizeFonts();
    
    // 3. Add LCP data attribute to main heading for prioritization
    const mainHeading = document.querySelector('.hero-section h1');
    if (mainHeading) {
      mainHeading.setAttribute('data-above-fold', 'true');
      mainHeading.setAttribute('fetchpriority', 'high');
    }
    
    // 4. Decode images asynchronously to avoid blocking
    decodeImagesAsync('img[loading="eager"]');
    
    // Show subtitle text immediately without animation for better LCP
    if (subtitleRef.current) {
      subtitleRef.current.style.visibility = 'visible';
      subtitleRef.current.textContent = "Providing affordable IT solutions to businesses in Madurai and beyond.";
    }
    
    // Delay animations until after LCP for better performance
    delayAnimationsUntilAfterLCP(2000).then(() => {
      // Start animations after LCP
      setShouldStartAnimations(true);
      
      // Run typing animation after LCP
      if (subtitleRef.current) {
        subtitleRef.current.textContent = "";
        typeText(
          subtitleRef,
          "Providing affordable IT solutions to businesses in Madurai and beyond.",
          30, // Slightly faster typing for better performance
          300  // Reduced delay for better performance
        );
      }
    });
    
    // Log LCP time for verification
    if (typeof PerformanceObserver !== 'undefined') {
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log(`LCP time: ${Math.round(lastEntry.startTime)}ms`);
        lcpObserver.disconnect();
      });
      
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    }
    
    // Clean up timeout to prevent memory leaks
    return () => {
      clearTimeout(typingTimeout);
    };
  }, []);
  
  // Featured services to display in hero - memoized to prevent recreation
  const featuredServices = useMemo(() => [
    { icon: Code, label: "Web Development" },
    { icon: Layers, label: "Digital Marketing" },
    { icon: BarChart, label: "UI/UX Design" }
  ], []);
  
  // Animation state to control when animations start
  const [shouldStartAnimations, setShouldStartAnimations] = useState(false);
  
  // Animation variants - optimized based on device capabilities
  const itemFadeIn = useMemo(() => 
    getOptimizedAnimationVariants({
      hidden: { opacity: 0, y: 20 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.8, ease: "easeOut" } 
      }
    })
  , []);
  
  // Pre-compute sparkles for consistent rendering
  const sparkles = useMemo(() => 
    Array.from({ length: 6 }).map((_, i) => ({
      id: i,
      top: `${Math.floor(Math.random() * 100)}%`,
      left: `${Math.floor(Math.random() * 100)}%`,
      size: Math.floor(Math.random() * 4 + 2),
      animationDelay: `${Math.floor(Math.random() * 5)}s`
    }))
  , []);
  
  // Container animation variants
  const containerVariants = useMemo(() => ({
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2
      }
    }
  }), []);
  
  return (
    <div 
      ref={sectionRef} 
      className="hero-section relative min-h-[100vh] overflow-hidden flex items-center py-20"
      // All style properties removed to restore original colors completely
    >
      {/* Modern mesh gradient background - static elements for better performance */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-primary to-purple-800 opacity-90" />
        
        {/* Noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.15] 
          [background-image:url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]" />
        
        {/* Animated gradient blobs - reduced from 3 to 2 for performance */}
        <div className="absolute top-1/4 -left-10 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow" 
          style={{ animationDuration: '15s' }}
        />
        <div className="absolute -bottom-10 left-1/4 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow" 
          style={{ animationDuration: '20s', animationDelay: '3s' }}
        />
        
        {/* Grid lines with larger size for better performance */}
        <div className="absolute inset-0 
          [background-image:linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] 
          [background-size:6rem_6rem]" />
      </div>
      
      {/* Static sparkles with CSS animations - reduced quantity for performance */}
      <div className="absolute inset-0 overflow-hidden z-10 pointer-events-none">
        {sparkles.map(sparkle => (
          <div
            key={sparkle.id}
            className="absolute rounded-full bg-white animate-pulse-slow"
            style={{
              top: sparkle.top,
              left: sparkle.left,
              width: `${sparkle.size}px`,
              height: `${sparkle.size}px`,
              filter: 'blur(1px)',
              boxShadow: '0 0 6px 2px rgba(255, 255, 255, 0.3)',
              animationDelay: sparkle.animationDelay,
              animationDuration: '3s',
              opacity: 0.6,
              willChange: 'opacity'
            }}
          />
        ))}
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <LazyMotion features={domAnimation} strict>
            {/* Left content */}
            <m.div 
              className="lg:order-1 mt-8 lg:mt-0 text-center lg:text-left"
              initial="hidden"
              animate={shouldStartAnimations ? "visible" : "hidden"}
              variants={containerVariants}
            >
              <m.div 
                variants={itemFadeIn}
                className="mb-6 inline-flex"
              >
                <span 
                  className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium border border-white/20 transition-transform duration-200 hover:scale-105"
                >
                  <Sparkles className="h-3.5 w-3.5 mr-2 text-yellow-300" />
                  Next-Gen Technology Solutions
                </span>
              </m.div>
              
              <m.div 
                variants={itemFadeIn}
              >
                <h1 
                  className="text-5xl md:text-6xl xl:text-7xl font-bold text-white leading-[1.1] mb-6 tracking-tight"
                  data-above-fold="true"
                >
                  <span className="block">
                    Professional Web Development & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-200">Digital Marketing</span>
                  </span>
                  <span className="block mt-2">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-200">Services in Madurai</span>
                  </span>
                </h1>
              </m.div>
              
              <m.div 
                variants={itemFadeIn}
              >
                <h2 className="text-xl md:text-2xl font-medium text-white/80 mb-4">
                  Affordable Big IT & Technology Solutions For Your Business
                </h2>
              </m.div>
              
              <m.div variants={itemFadeIn}>
                <p 
                  ref={subtitleRef} 
                  className="text-xl text-white/90 mb-6 max-w-xl lg:mx-0 mx-auto min-h-[4rem]"
                  style={{ visibility: 'hidden' }}
                >
                  {/* Text will be filled in by typing effect */}
                </p>
              </m.div>
              
              <m.div 
                variants={itemFadeIn}
                className="flex flex-wrap gap-4 justify-center lg:justify-start mt-8"
              >
                <div 
                  className="w-full sm:w-auto transition-transform duration-200 hover:scale-105 active:scale-95"
                >
                  <Button 
                    ref={ctaButtonRef}
                    asChild 
                    size="lg" 
                    className="bg-white text-primary hover:bg-neutral-50 shadow-lg hover:shadow-xl transition-all duration-300 rounded-full w-full sm:w-auto"
                  >
                    <Link href="/contact">
                      <span className="flex items-center justify-center gap-2">
                        Start a Project 
                        <ArrowUpRight strokeWidth={2.5} className="h-4 w-4" />
                      </span>
                    </Link>
                  </Button>
                </div>
                
                <div 
                  className="w-full sm:w-auto transition-transform duration-200 hover:scale-105 active:scale-95"
                >
                  <Button 
                    asChild 
                    variant="outline" 
                    size="lg" 
                    className="border-white/20 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 rounded-full w-full sm:w-auto"
                  >
                    <Link href="/services">Explore Solutions</Link>
                  </Button>
                </div>
              </m.div>
              
              {/* Featured services tags */}
              <m.div 
                variants={itemFadeIn}
                className="mt-10 flex flex-wrap gap-2 justify-center lg:justify-start"
              >
                <span className="text-white/70 mr-2 text-sm">Featured:</span>
                {featuredServices.map((service, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white/90 bg-white/5 border border-white/10 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-white/10"
                  >
                    <service.icon className="h-3 w-3 mr-1.5" />
                    {service.label}
                  </span>
                ))}
              </m.div>
            </m.div>
            
            {/* Right content - 3D isometric illustration - Loading priority reduced for better LCP */}
            <m.div 
              className="lg:order-2 flex justify-center items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: shouldStartAnimations ? 1 : 0 }}
              transition={{ duration: 0.3 }} // Faster animation for better performance
              data-below-fold="true" // Mark as below fold for delayed loading
            >
              <div className="relative w-full max-w-lg">
                {/* Glowing background shape - using static effect for better performance */}
                <div 
                  className="absolute top-0 left-1/2 -translate-x-1/2 h-[350px] w-[350px] rounded-full bg-gradient-to-br from-blue-400/20 to-purple-600/20 blur-3xl animate-pulse-slow"
                  style={{ opacity: 0.5, animationDuration: '10s' }}
                />
              
              {/* Simplified 3D visuals with minimal animation */}
              <div className="relative mx-auto">
                <div
                  className="relative mx-auto animate-fade-in"
                  style={{ animationDuration: '1s', animationDelay: '0.8s' }}
                >
                  {/* Main image container */}
                  <div className="relative w-full max-w-[400px] aspect-square mx-auto">
                    {/* Shadow */}
                    <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-2xl opacity-40 blur-xl transform rotate-3" />
                    
                    {/* Image - Using CSS animations instead of JS animations */}
                    <div
                      className="relative w-full h-full rounded-3xl overflow-hidden border border-white/20 shadow-2xl transform rotate-2 bg-gradient-to-br from-indigo-900/90 to-purple-900/90 backdrop-blur-sm animate-float-slow"
                      style={{ 
                        transformStyle: 'preserve-3d',
                        animationDuration: '20s',
                        willChange: 'transform'
                      }}
                    >
                      {/* Display 3D visualization */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div 
                          className="text-white/90 text-center relative z-20 animate-fade-in"
                          style={{ animationDuration: '1s', animationDelay: '1s' }}
                        >
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-32 h-32 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center">
                              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400/30 to-purple-400/30 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                                  <Sparkles className="w-6 h-6 text-white/90" />
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Floating feature boxes with CSS animations instead of JS */}
                          <div
                            className="absolute top-8 right-8 w-16 h-16 rounded-lg bg-gradient-to-br from-blue-600/80 to-blue-400/80 border border-white/20 backdrop-blur-sm shadow-lg animate-float-slow"
                            style={{ animationDuration: '10s' }}
                          />
                          
                          <div
                            className="absolute top-8 left-8 w-16 h-16 rounded-lg bg-gradient-to-br from-purple-600/80 to-purple-400/80 border border-white/20 backdrop-blur-sm shadow-lg rotate-12 animate-float-reverse"
                            style={{ animationDuration: '15s' }}
                          />
                          
                          <div
                            className="absolute bottom-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 border border-white/20 backdrop-blur-sm shadow-lg rotate-12 animate-float-slow"
                            style={{ animationDuration: '12s' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </m.div>
          </LazyMotion>
        </div>
      </div>
      
      {/* Modern scroll indicator - using CSS animation */}
      <div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-30 flex flex-col items-center"
        style={{ opacity: String(scrollOpacity) }}
      >
        <div 
          className="text-sm mb-3 text-white/70 font-light animate-float-slow"
          style={{ animationDuration: '2s' }}
        >
          Scroll to explore
        </div>
        <button
          onClick={scrollToNext}
          className="relative w-8 h-12 rounded-full border border-white/20 flex items-center justify-center overflow-hidden backdrop-blur-sm bg-white/5 hover:bg-white/10 transition-colors"
          aria-label="Scroll to services section"
        >
          <div
            className="w-1.5 h-1.5 bg-white rounded-full animate-float-slow"
            style={{ 
              animationDuration: '1.5s',
              transformOrigin: 'center',
              animationTimingFunction: 'cubic-bezier(0.45, 0, 0.55, 1)'
            }}
          />
        </button>
      </div>
    </div>
  );
};

// Set displayName for React DevTools
HeroSection.displayName = "HeroSection";

// Use memo to prevent unnecessary re-renders
export default React.memo(HeroSection);
