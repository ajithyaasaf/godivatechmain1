import React, { ReactNode, useState, useEffect, memo } from "react";
import { motion } from "framer-motion";
import Header from "./Header";
import Footer from "./Footer";
import BackToTopButton from "./ui/BackToTopButton";
import ParticleBackground from "./ui/ParticleBackground";
import { preconnect, dnsPrefetch } from "@/lib/resourcePreloader";
import PageTransition from "./PageTransition";
import { setupLazyLoading } from "@/lib/imageOptimizer";
import { throttle } from "@/lib/jsOptimizer";
import { detectUnusedCSS } from "@/lib/styleOptimizer";
import { trackBundlePerformance } from "@/lib/bundleOptimizer";
import { trackLCP } from "@/lib/lcp-optimization";

interface LayoutProps {
  children: ReactNode;
}

/**
 * Main layout component with page transitions and background effects
 * Optimized for performance with LCP tracking and resource prioritization
 */
const Layout = ({ children }: LayoutProps) => {
  const [showParticles, setShowParticles] = useState(false);
  
  // Setup preloading and optimizations on first render
  useEffect(() => {
    // Track LCP for performance monitoring
    trackLCP();
    
    // Performance monitoring in development mode
    if (import.meta.env.MODE === 'development') {
      trackBundlePerformance('main-bundle');
      detectUnusedCSS();
    }
    
    // Setup preconnect for domains we'll load resources from - prioritized order
    preconnect('https://fonts.googleapis.com');
    preconnect('https://fonts.gstatic.com');
    preconnect('https://res.cloudinary.com');
    setTimeout(() => {
      // Non-critical connections delayed
      preconnect('https://cdn.jsdelivr.net');
      preconnect('https://api.fontshare.com');
    }, 500);
    
    // DNS prefetch for other domains
    dnsPrefetch('https://randomuser.me');
    dnsPrefetch('https://firebasestorage.googleapis.com');
    
    // Setup image lazy loading with higher thresholds for mobile
    setupLazyLoading({
      rootMargin: '300px', // Load images when they're within 300px of viewport
      threshold: 0.01 // Start loading with just 1% visibility
    });
    
    // Optimize scroll events - throttle to prevent jank
    const handleScroll = throttle(() => {
      // Add any scroll-based logic here
    }, 150); // Increase throttle time to reduce processing
    window.addEventListener('scroll', handleScroll, { passive: true }); // Add passive flag for better performance
    
    // Delay showing particle effects for better initial load performance
    const timer = setTimeout(() => {
      // Only show particles on desktop devices to improve mobile performance
      const isMobile = window.innerWidth < 768;
      setShowParticles(!isMobile);
    }, 2000); // Increased delay for better initial rendering
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return (
    <div className="font-sans text-neutral-700 antialiased bg-neutral-50 relative min-h-screen overflow-x-hidden">
      {/* Subtle particle effect in the background with reduced count for better performance */}
      {showParticles && (
        <ParticleBackground 
          particleCount={25}
          colors={['#3b82f6', '#4f46e5', '#8b5cf6']}
          minOpacity={0.02}
          maxOpacity={0.06}
          className="z-0 fixed"
        />
      )}
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        
        {/* Main content with page transitions */}
        <main className="flex-grow relative"> 
          {children}
        </main>
        
        <Footer />
        <BackToTopButton />
        
        {/* Subtle gradient overlays for visual depth */}
        <div className="pointer-events-none">
          {/* Top gradient overlay */}
          <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-white/10 to-transparent z-0" />
          
          {/* Bottom gradient overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white/10 to-transparent z-0" />
        </div>
      </div>
    </div>
  );
};

// Export memoized layout to prevent unnecessary re-renders
export default memo(Layout);
