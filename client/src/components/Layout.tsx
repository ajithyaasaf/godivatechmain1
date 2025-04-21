import React, { ReactNode, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "./Header";
import Footer from "./Footer";
import BackToTopButton from "./ui/BackToTopButton";
import ParticleBackground from "./ui/ParticleBackground";
import PageTransition from "./PageTransition";

interface LayoutProps {
  children: ReactNode;
}

/**
 * Main layout component with page transitions and background effects
 */
const Layout = ({ children }: LayoutProps) => {
  const [showParticles, setShowParticles] = useState(false);
  
  // Wait for the page to load before showing particles to improve performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowParticles(true);
    }, 1000);
    
    return () => clearTimeout(timer);
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

export default Layout;
