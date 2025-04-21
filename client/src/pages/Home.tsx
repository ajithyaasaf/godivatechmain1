import React from "react";
import { motion } from "framer-motion";
import HeroSection from "@/components/home/HeroSection";
import TrustedBySection from "@/components/home/TrustedBySection";
import ServiceSection from "@/components/home/ServiceSection";
import AboutSection from "@/components/home/AboutSection";
import TeamSection from "@/components/home/TeamSection";
import PortfolioSection from "@/components/home/PortfolioSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import BlogSection from "@/components/home/BlogSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import CTASection from "@/components/home/CTASection";
import ContactSection from "@/components/home/ContactSection";
import MapSection from "@/components/home/MapSection";
import PageTransition, { TransitionItem } from "@/components/PageTransition";

/**
 * Enhanced Home page with smooth section transitions
 */
const Home = () => {
  // No need for manual scroll restoration - now handled by PageTransition component
  
  return (
    <PageTransition>
      <div className="relative">
        {/* Hero section without delay for immediate display */}
        <HeroSection />
        
        {/* Other sections with staggered reveal */}
        <TransitionItem>
          <TrustedBySection />
        </TransitionItem>
        
        <TransitionItem delay={0.1}>
          <ServiceSection />
        </TransitionItem>
        
        <TransitionItem delay={0.1}>
          <AboutSection />
        </TransitionItem>
        
        <TransitionItem delay={0.15}>
          <TeamSection />
        </TransitionItem>
        
        <TransitionItem delay={0.1}>
          <PortfolioSection />
        </TransitionItem>
        
        <TransitionItem delay={0.1}>
          <TestimonialsSection />
        </TransitionItem>
        
        <TransitionItem delay={0.15}>
          <BlogSection />
        </TransitionItem>
        
        <TransitionItem delay={0.1}>
          <NewsletterSection />
        </TransitionItem>
        
        <TransitionItem delay={0.1}>
          <CTASection />
        </TransitionItem>
        
        <TransitionItem delay={0.15}>
          <ContactSection />
        </TransitionItem>
        
        <TransitionItem delay={0.1}>
          <MapSection />
        </TransitionItem>
        
        {/* Thin visual separator lines between sections */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
      </div>
    </PageTransition>
  );
};

export default Home;
