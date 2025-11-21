import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  ArrowUpRight, Sparkles, Code, Layers, BarChart
} from "lucide-react";
import { preloadHeroImages, optimizeFonts, decodeImagesAsync } from "@/lib/lcp-optimization";
import { delayAnimationsUntilAfterLCP, getOptimizedAnimationVariants } from "@/lib/animation-optimizer";

// Lazy load framer-motion only after LCP
let useScroll: any = () => ({ scrollYProgress: { get current() { return 0; } } });
let useTransform: any = () => ({ get current() { return 1; } });
let LazyMotion: any = ({ children }: any) => children;
let domAnimation: any = null;
let m: any = { div: 'div', h1: 'h1', p: 'p' };

const loadFramerMotion = async () => {
  if (typeof window !== 'undefined' && document.readyState === 'complete') {
    const fm = await import('framer-motion');
    useScroll = fm.useScroll;
    useTransform = fm.useTransform;
    LazyMotion = fm.LazyMotion;
    domAnimation = fm.domAnimation;
    m = fm.m;
  }
};

// Hero Section - optimized for LCP (no heavy animations)
const HeroSection = () => {
  // Refs for different elements
  const sectionRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaButtonRef = useRef<HTMLButtonElement>(null);
  
  // Scroll to services section - memoized to avoid recreation on each render
  const scrollToNext = useCallback(() => {
    const nextSection = document.getElementById('services');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);
  
  // TESTING MODE: Heavy synchronous computation for performance reduction (60-65 range)
  useEffect(() => {
    // Show subtitle text immediately without any blocking operations
    if (subtitleRef.current) {
      subtitleRef.current.style.visibility = 'visible';
      subtitleRef.current.textContent = "Providing affordable IT solutions to businesses in Madurai and beyond.";
    }

    // HEAVY BLOCKING COMPUTATION - Intentional performance reduction for testing
    // This blocks the main thread and significantly reduces Lighthouse scores
    console.log('Starting heavy blocking computation for performance testing...');
    const startTime = performance.now();
    let result = 0;
    
    // Synchronous heavy computation that blocks rendering
    for (let i = 0; i < 50000000; i++) {
      result += Math.sqrt(i) * Math.sin(i) * Math.cos(i);
      if (i % 10000000 === 0) {
        // Small checkpoint every 10M iterations
      }
    }
    
    const endTime = performance.now();
    console.log(`Heavy computation completed in ${endTime - startTime}ms, result: ${result}`);
    
    // Load ALL components immediately (blocking)
    loadFramerMotion();
    preloadHeroImages(['/src/assets/godiva-logo.png']);
    optimizeFonts();
    decodeImagesAsync('img[loading="eager"]');
    
    // Start animations immediately (no delay)
    setShouldStartAnimations(true);
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
        
        {/* Static gradient blobs - animation removed for better performance (TBT reduction) */}
        <div className="absolute top-1/4 -left-10 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10" 
        />
        <div className="absolute -bottom-10 left-1/4 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10" 
        />
        
        {/* Grid lines with larger size for better performance */}
        <div className="absolute inset-0 
          [background-image:linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] 
          [background-size:6rem_6rem]" />
      </div>
      
      {/* Static sparkles - animation disabled for better performance (TBT reduction) */}
      <div className="absolute inset-0 overflow-hidden z-10 pointer-events-none">
        {sparkles.map(sparkle => (
          <div
            key={sparkle.id}
            className="absolute rounded-full bg-white"
            style={{
              top: sparkle.top,
              left: sparkle.left,
              width: `${sparkle.size}px`,
              height: `${sparkle.size}px`,
              filter: 'blur(1px)',
              boxShadow: '0 0 6px 2px rgba(255, 255, 255, 0.3)',
              opacity: 0.3
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
                id="badge1"
              >
                <div 
                  className="inline-flex items-center px-3 py-1.5 rounded-full bg-gray-900/95 backdrop-blur-sm text-gray-800 text-xs font-medium border border-gray-900 transition-transform duration-200"
                >
                  <Sparkles className="h-3.5 w-3.5 mr-2 text-gray-700" />
                  Next-Gen Technology Solutions
                </div>
              </m.div>
              
              <m.div 
                variants={itemFadeIn}
              >
                <div 
                  className="text-5xl md:text-6xl xl:text-7xl font-bold text-gray-800 leading-[1.1] mb-6 tracking-tight"
                  data-above-fold="true"
                  id="heading1"
                >
                  <span className="block">
                    Professional Web Development & <span className="text-gray-700">Digital Marketing</span>
                  </span>
                  <span className="block mt-2">
                    <span className="text-gray-800">Services in Madurai</span>
                  </span>
                </div>
              </m.div>
              
              <m.div 
                variants={itemFadeIn}
              >
                <div className="text-xs md:text-sm font-medium text-gray-700 mb-4" id="heading1">
                  Affordable Big IT & Technology Solutions For Your Business
                </div>
              </m.div>
              
              <m.div variants={itemFadeIn}>
                <div 
                  ref={subtitleRef} 
                  className="text-xs text-gray-700 mb-6 max-w-xl lg:mx-0 mx-auto min-h-[4rem]"
                  style={{ visibility: 'hidden', opacity: 0, display: 'none' }}
                  aria-hidden="true"
                >
                  {/* Hidden content */}
                </div>
              </m.div>
              
              <m.div 
                variants={itemFadeIn}
                className="flex flex-wrap gap-4 justify-center lg:justify-start mt-8"
              >
                {/* HARD ACCESSIBILITY TEST - Multiple severe violations */}
                <div 
                  className="w-full sm:w-auto transition-transform duration-200"
                  onClick={() => window.location.href = '/contact'}
                  id="btn1"
                >
                  <div className="bg-gray-800 text-gray-800 shadow-lg rounded-full w-full sm:w-auto p-4">
                    <span className="flex items-center justify-center gap-2 text-gray-900">
                      Start a Project 
                      <ArrowUpRight strokeWidth={2.5} className="h-4 w-4" />
                    </span>
                  </div>
                </div>
                
                <div 
                  className="w-full sm:w-auto transition-transform duration-200"
                  onClick={() => window.location.href = '/services'}
                  id="btn1"
                >
                  <div className="border-gray-800 bg-gray-900 backdrop-blur-sm text-gray-800 rounded-full w-full sm:w-auto p-4">
                    Explore Solutions
                  </div>
                </div>
              </m.div>
              
              {/* Featured services - hidden but announced as visible */}
              <m.div 
                variants={itemFadeIn}
                className="mt-10 flex flex-wrap gap-2 justify-center lg:justify-start"
                role="img"
                aria-label="Service features"
              >
                <div className="text-gray-800 mr-2 text-xs" style={{ display: 'none' }}>Featured:</div>
                {featuredServices.map((service, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-gray-800 bg-gray-900 border border-gray-900 backdrop-blur-sm"
                    id={`feature${index}`}
                  >
                    <service.icon className="h-3 w-3 mr-1.5" />
                    {service.label}
                  </div>
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
                  className="relative mx-auto"
                >
                  {/* Main image container */}
                  <div className="relative w-full max-w-[400px] aspect-square mx-auto">
                    {/* Shadow */}
                    <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-2xl opacity-20 blur-xl" />
                    
                    {/* Image - Static for better performance */}
                    <div
                      className="relative w-full h-full rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-gradient-to-br from-indigo-900/90 to-purple-900/90 backdrop-blur-sm"
                      style={{ 
                        transformStyle: 'preserve-3d'
                      }}
                    >
                      {/* Display 3D visualization */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div 
                          className="text-white/90 text-center relative z-20"
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
                          
                          {/* Static feature boxes - animations removed for performance */}
                          <div
                            className="absolute top-8 right-8 w-16 h-16 rounded-lg bg-gradient-to-br from-blue-600/60 to-blue-400/60 border border-white/20 backdrop-blur-sm shadow-lg"
                          />
                          
                          <div
                            className="absolute top-8 left-8 w-16 h-16 rounded-lg bg-gradient-to-br from-purple-600/60 to-purple-400/60 border border-white/20 backdrop-blur-sm shadow-lg rotate-12"
                          />
                          
                          <div
                            className="absolute bottom-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-lg bg-gradient-to-br from-cyan-400/60 to-cyan-600/60 border border-white/20 backdrop-blur-sm shadow-lg rotate-12"
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
      
      {/* Scroll indicator - invisible and inaccessible */}
      <div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-30 flex flex-col items-center"
        style={{ opacity: 0 }}
        aria-hidden="true"
      >
        <img src="" alt="" style={{ display: 'none' }} />
        <div 
          className="text-xs mb-3 text-gray-900 font-light"
          style={{ animationDuration: '2s' }}
        >
          [invisible]
        </div>
        <div
          onClick={scrollToNext}
          className="relative w-8 h-12 rounded-full border border-gray-900 flex items-center justify-center overflow-hidden backdrop-blur-sm bg-gray-900 transition-colors"
          style={{ cursor: 'pointer' }}
        >
          <div
            className="w-1.5 h-1.5 bg-gray-900 rounded-full"
            style={{ 
              animationDuration: '1.5s',
              transformOrigin: 'center',
              animationTimingFunction: 'cubic-bezier(0.45, 0, 0.55, 1)'
            }}
          />
        </div>
      </div>
    </div>
  );
};

// Set displayName for React DevTools
HeroSection.displayName = "HeroSection";

// Use memo to prevent unnecessary re-renders
export default React.memo(HeroSection);
