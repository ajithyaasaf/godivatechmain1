import React, { Suspense, lazy } from "react";
import { motion } from "framer-motion";
import HeroSection from "@/components/home/HeroSection";
import TrustedBySection from "@/components/home/TrustedBySection";
import ServiceSection from "@/components/home/ServiceSection";
import AboutSection from "@/components/home/AboutSection";
import PageTransition, { TransitionItem } from "@/components/PageTransition";
import PageLazy from "@/components/LazyLoadComponent";

// Lazy load SEO-heavy components that block initial render
const SEO = lazy(() => import("@/components/SEO"));
const AdvancedSEO = lazy(() => import("@/components/AdvancedSEO"));
const PreloadHeroResources = lazy(() => import("@/components/PreloadHeroResources"));

// Lazy loaded components (below the fold)
const TeamSection = lazy(() => import("@/components/home/TeamSection"));
const PortfolioSection = lazy(() => import("@/components/home/PortfolioSection"));
const TestimonialsSection = lazy(() => import("@/components/home/TestimonialsSection"));
const BlogSection = lazy(() => import("@/components/home/BlogSection"));
const NewsletterSection = lazy(() => import("@/components/home/NewsletterSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));
const ContactSection = lazy(() => import("@/components/home/ContactSection"));
const MapSection = lazy(() => import("@/components/home/MapSection"));

/**
 * Enhanced Home page with smooth section transitions and SEO optimization
 */
const Home = () => {
  return (
    <>
      {/* Lazy load SEO components - they're heavy and don't affect initial paint */}
      <Suspense fallback={null}>
        <SEO 
          title="🚀 Best Web Development Company Madurai | Transform Your Business | Free Quote 24hrs"
          description="Leading web development, digital marketing & design company in Madurai. Expert solutions & services for business growth. Get your free quote today!"
        />
      </Suspense>
      
      <Suspense fallback={null}>
        <AdvancedSEO />
      </Suspense>
      
      <Suspense fallback={null}>
        <PreloadHeroResources />
      </Suspense>
      
      <PageTransition>
        <div className="relative">
          {/* Hero section with immediate display */}
          <TransitionItem>
            <HeroSection />
          </TransitionItem>
          
          {/* Above-the-fold sections loaded immediately */}
          <TransitionItem delay={0.1}>
            <TrustedBySection />
          </TransitionItem>
          
          <TransitionItem delay={0.2}>
            <ServiceSection />
          </TransitionItem>
          
          <TransitionItem delay={0.1}>
            <AboutSection />
          </TransitionItem>
          
          {/* Below-the-fold sections lazy loaded */}
          <Suspense fallback={<div className="min-h-[400px] bg-gray-50/20 animate-pulse rounded-md my-8"></div>}>
            <TransitionItem delay={0.2}>
              <TeamSection />
            </TransitionItem>
          </Suspense>
          
          <Suspense fallback={<div className="min-h-[500px] bg-gray-50/20 animate-pulse rounded-md my-8"></div>}>
            <TransitionItem delay={0.1}>
              <PortfolioSection />
            </TransitionItem>
          </Suspense>
          
          <Suspense fallback={<div className="min-h-[400px] bg-gray-50/20 animate-pulse rounded-md my-8"></div>}>
            <TransitionItem delay={0.2}>
              <TestimonialsSection />
            </TransitionItem>
          </Suspense>
          
          <Suspense fallback={<div className="min-h-[400px] bg-gray-50/20 animate-pulse rounded-md my-8"></div>}>
            <TransitionItem delay={0.1}>
              <BlogSection />
            </TransitionItem>
          </Suspense>
          
          <Suspense fallback={<div className="min-h-[200px] bg-gray-50/20 animate-pulse rounded-md my-8"></div>}>
            <TransitionItem delay={0.2}>
              <NewsletterSection />
            </TransitionItem>
          </Suspense>
          
          <Suspense fallback={<div className="min-h-[200px] bg-gray-50/20 animate-pulse rounded-md my-8"></div>}>
            <TransitionItem delay={0.1}>
              <CTASection />
            </TransitionItem>
          </Suspense>
          
          <Suspense fallback={<div className="min-h-[400px] bg-gray-50/20 animate-pulse rounded-md my-8"></div>}>
            <TransitionItem delay={0.2}>
              <ContactSection />
            </TransitionItem>
          </Suspense>
          
          <Suspense fallback={<div className="min-h-[300px] bg-gray-50/20 animate-pulse rounded-md my-8"></div>}>
            <TransitionItem delay={0.1}>
              <MapSection />
            </TransitionItem>
          </Suspense>
          
          {/* Thin visual separator lines between sections */}
          <motion.div 
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
          <motion.div 
            className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
      </PageTransition>
    </>
  );
};

export default Home;
