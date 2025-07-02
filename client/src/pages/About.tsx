import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import TeamSection from "@/components/home/TeamSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CTASection from "@/components/home/CTASection";
import PageTransition, { TransitionItem } from "@/components/PageTransition";
import SEO from "@/components/SEO";
import { pageKeywords } from "@/lib/seoKeywords";
import { 
  getOrganizationData, 
  getWebPageData,
  getBreadcrumbData 
} from "@/lib/structuredData";

const About = () => {
  // No need for manual scroll handling - now managed by PageTransition
  
  // SEO structured data
  const structuredData = [
    getOrganizationData(),
    getWebPageData(
      "Best Software Company in Madurai | About GodivaTech",
      "GodivaTech is a leading IT service provider in Madurai offering affordable web development, app development, and digital marketing solutions since 2010.",
      "https://godivatech.com/about"
    ),
    getBreadcrumbData([
      { name: "Home", item: "https://godivatech.com/" },
      { name: "About Us", item: "https://godivatech.com/about" }
    ])
  ];
  
  return (
    <>
      <SEO
        title="Best Software Company in Madurai | About GodivaTech"
        description="GodivaTech provides affordable web development, digital marketing, and app development services in Madurai since 2010. Learn about our experienced team, mission, and values as a leading IT company in Tamil Nadu."
        keywords={pageKeywords.about.join(", ")}
        canonicalUrl="/about"
        ogType="profile"
        ogImage="/images/about-og-image.jpg"
        imageWidth={1200}
        imageHeight={630}
        cityName="Madurai"
        regionName="Tamil Nadu"
        countryName="India"
        twitterCard="summary_large_image"
        twitterSite="@godivatech"
        twitterCreator="@godivatech"
        robots="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        alternateUrls={[
          { hrefLang: "en-in", href: "https://godivatech.com/about" },
          { hrefLang: "ta-in", href: "https://godivatech.com/ta/about" }
        ]}
        structuredData={structuredData}
      />
      
      <PageTransition>
        <div className="relative">
          <TransitionItem>
            <section className="py-20 bg-white/50 backdrop-blur-sm relative overflow-hidden">
              {/* Background Elements */}
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-70" />
              <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl opacity-70" />
              
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header with subtle animation */}
                <motion.div 
                  className="text-center mb-16"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                >
                  <h1 className="text-5xl font-bold text-neutral-800 mb-6">About Us</h1>
                  <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
                    We provide affordable IT and technology solutions for businesses in Madurai and beyond, helping them establish a strong online presence.
                  </p>
                </motion.div>

                {/* Our Story Section */}
                <TransitionItem delay={0.2}>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 items-center">
                    <div>
                      <h2 className="text-3xl font-bold text-neutral-800 mb-6 relative inline-block">
                        Our Story
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/40 to-transparent" />
                      </h2>
                      <p className="text-lg text-neutral-600 mb-6">
                        Godiva Technologies was established by Rajesh Kumar in 2010, with a vision of providing comprehensive IT solutions that combine creativity, innovation, and technical expertise to meet diverse business needs. We started as a small web development company and gradually expanded our service offerings.
                      </p>
                      <p className="text-lg text-neutral-600 mb-6">
                        Today, we've grown into a full-service digital transformation partner offering web development, digital marketing, app development, video production, UI/UX design, and creative designing services to businesses in Madurai and beyond.
                      </p>
                      <p className="text-lg text-neutral-600">
                        With 13+ years of experience and a portfolio of 150+ successful projects, we continue to help businesses establish a strong online presence and achieve their digital goals with our tailored solutions.
                      </p>
                    </div>
                    <div>
                      <motion.div
                        className="rounded-lg overflow-hidden shadow-xl relative"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                      >
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent mix-blend-overlay"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                        <img
                          src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                          alt="GodivaTech office"
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                    </div>
                  </div>
                </TransitionItem>

                {/* Mission & Values Section */}
                <TransitionItem delay={0.3}>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 items-center">
                    <div className="order-2 lg:order-1">
                      <motion.div
                        className="rounded-lg overflow-hidden shadow-xl relative"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                      >
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-bl from-indigo-600/20 to-transparent mix-blend-overlay"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                        <img
                          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                          alt="GodivaTech team collaboration"
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                    </div>
                    <div className="order-1 lg:order-2">
                      <h2 className="text-3xl font-bold text-neutral-800 mb-6 relative inline-block">
                        Our Vision & Mission
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/40 to-transparent" />
                      </h2>
                      <p className="text-lg text-neutral-600 mb-8">
                        Our mission is to provide affordable and effective IT solutions for businesses of all sizes. We aim to help our clients establish a strong online presence through our web development, digital marketing, and creative design services.
                      </p>
                      
                      {/* Values with hover effects */}
                      <div className="space-y-8">
                        <motion.div 
                          className="p-6 rounded-lg border border-neutral-200 bg-white/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/20 hover:bg-white/80"
                          whileHover={{ y: -5 }}
                        >
                          <h3 className="text-xl font-semibold text-neutral-800 mb-2">Client-Centric Approach</h3>
                          <p className="text-neutral-600">
                            We put our clients' needs first and work closely with them to understand their business goals, target audience, and unique requirements to deliver customized solutions.
                          </p>
                        </motion.div>
                        
                        <motion.div 
                          className="p-6 rounded-lg border border-neutral-200 bg-white/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/20 hover:bg-white/80"
                          whileHover={{ y: -5 }}
                        >
                          <h3 className="text-xl font-semibold text-neutral-800 mb-2">Affordable Solutions</h3>
                          <p className="text-neutral-600">
                            We provide cost-effective IT and technology solutions without compromising on quality, making our services accessible to businesses of all sizes in Madurai and beyond.
                          </p>
                        </motion.div>
                        
                        <motion.div 
                          className="p-6 rounded-lg border border-neutral-200 bg-white/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/20 hover:bg-white/80"
                          whileHover={{ y: -5 }}
                        >
                          <h3 className="text-xl font-semibold text-neutral-800 mb-2">Timely Delivery</h3>
                          <p className="text-neutral-600">
                            We understand the importance of time in business, which is why we consistently deliver projects on schedule while maintaining the highest quality standards for all our services.
                          </p>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </TransitionItem>

                {/* CTA Button */}
                <TransitionItem delay={0.4}>
                  <div className="text-center py-8">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button 
                        asChild 
                        size="lg"
                        className="bg-primary hover:bg-primary/90 rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <Link href="/contact">Start a Project</Link>
                      </Button>
                    </motion.div>
                  </div>
                </TransitionItem>
              </div>
            </section>
          </TransitionItem>

          {/* Team Section with delay */}
          <TransitionItem delay={0.2}>
            <TeamSection />
          </TransitionItem>
          
          {/* Testimonials Section with delay */}
          <TransitionItem delay={0.3}>
            <TestimonialsSection />
          </TransitionItem>
          
          {/* CTA Section with delay */}
          <TransitionItem delay={0.2}>
            <CTASection />
          </TransitionItem>
          
          {/* Subtle separators */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
        </div>
      </PageTransition>
    </>
  );
};

export default About;