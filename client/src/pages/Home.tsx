import React, { Suspense, lazy } from "react";
import HeroSection from "@/components/home/HeroSection";
import TrustedBySection from "@/components/home/TrustedBySection";
import ServiceSection from "@/components/home/ServiceSection";
import AboutSection from "@/components/home/AboutSection";

// Lazy load PageTransition only when needed (not critical for LCP)
const PageTransition = lazy(() => import("@/components/PageTransition"));
const TransitionItem = ({ children, delay }: any) => <>{children}</>;

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
 * Home page - optimized for maximum performance
 * SEO is handled entirely in index.html to avoid render blocking
 */
const Home = () => {
  return (
    <div className="relative">
      {/* Hero section with immediate display - skip transitions for LCP */}
      <HeroSection />
      
      {/* Above-the-fold sections loaded immediately */}
      <TrustedBySection />
      
      <ServiceSection />
      
      <AboutSection />
      
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
    </div>
  );
};

export default Home;
