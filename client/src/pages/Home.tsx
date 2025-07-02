import React, { Suspense, lazy } from "react";
import { motion } from "framer-motion";
import HeroSection from "@/components/home/HeroSection";
import TrustedBySection from "@/components/home/TrustedBySection";
import ServiceSection from "@/components/home/ServiceSection";
import AboutSection from "@/components/home/AboutSection";
import PageTransition, { TransitionItem } from "@/components/PageTransition";
import SEO from "@/components/SEO";
import AdvancedSEO from "@/components/AdvancedSEO";
import LazyLoadComponent from "@/components/LazyLoadComponent";
import PreloadHeroResources from "@/components/PreloadHeroResources";
import { 
  getLocalBusinessData, 
  getOrganizationData, 
  getWebsiteData,
  getWebPageData 
} from "@/lib/structuredData";
import { pageKeywords, metaDescriptions } from "@/lib/seoKeywords";

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
  // Get current date for freshness signals
  const currentDate = new Date().toISOString();
  
  // SEO structured data enhanced with proper IDs and current dates
  const structuredData = [
    getOrganizationData(),
    getLocalBusinessData(),
    getWebsiteData(),
    getWebPageData(
      "Web Development & Digital Marketing Services | GodivaTech Madurai",
      "GodivaTech offers web development, digital marketing, and app development services in Madurai at affordable prices. Get custom technology solutions for your business.",
      "https://godivatech.com/"
    )
  ];
  
  return (
    <>
      <AdvancedSEO
        title="🚀 Best Web Development Company Madurai | Transform Your Business | Free Quote 24hrs"
        description={metaDescriptions.home}
        keywords={pageKeywords.home.join(", ")}
        image="https://godivatech.com/assets/home-og-image.jpg"
      />
      
      <SEO
        title="🚀 Best Web Development Company Madurai | Transform Your Business | Free Quote 24hrs"
        description={metaDescriptions.home}
        keywords={pageKeywords.home.join(", ")}
        canonicalUrl="https://godivatech.com/"
        structuredData={structuredData}
        ogImage="https://godivatech.com/assets/home-og-image.jpg"
        ogType="website"
        ogLocale="en_IN"
        twitterCard="summary_large_image"
        twitterSite="@godivatech"
        modifiedTime={currentDate}
        cityName="Madurai"
        regionName="Tamil Nadu"
        countryName="India"
        postalCode="625007"
        facebookAppId="107394345671850"
        priceRange="₹₹"
        businessHours={['Mo-Fr 09:00-18:00', 'Sa 10:00-16:00']}
        robots="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
      />
      
      {/* Preload critical resources for hero section */}
      <PreloadHeroResources />
      
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
