import React, { memo, useMemo } from "react";
import { motion, LazyMotion, domAnimation, m } from "framer-motion";
import { AtSign, Phone, MapPin, Clock, ArrowRight } from "lucide-react";
import ContactSection from "@/components/home/ContactSection";
import MapSection from "@/components/home/MapSection";
import PageTransition, { TransitionItem } from "@/components/PageTransition";
import SEO from "@/components/SEO";
import { pageKeywords } from "@/lib/seoKeywords";
import { 
  getOrganizationData, 
  getWebPageData,
  getLocalBusinessData,
  getBreadcrumbData 
} from "@/lib/structuredData";

const Contact = memo(() => {
  // Contact info items
  const contactInfo = [
    { 
      icon: AtSign, 
      title: "Email Us", 
      info: "info@godivatech.com",
      description: "For general inquiries and information"
    },
    { 
      icon: Phone, 
      title: "Call Us", 
      info: "+91 96005 20130",
      description: "Get in touch with our team"
    },
    { 
      icon: MapPin, 
      title: "Visit Us", 
      info: "261, Vaigai mainroad 4th Street, Sri Nagar, Iyer Bungalow, Madurai 625007",
      description: "Our headquarters location"
    },
    { 
      icon: Clock, 
      title: "Working Hours", 
      info: "9:00 AM - 6:00 PM (IST)",
      description: "Monday to Saturday"
    }
  ];
  
  // SEO structured data for rich snippets
  const structuredData = [
    getOrganizationData(),
    getLocalBusinessData(),
    getWebPageData(
      "Contact Best Web Development Company in Madurai | GodivaTech",
      "Contact GodivaTech for affordable web development, app development, and digital marketing services in Madurai. Get in touch for a free consultation and quote.",
      "https://godivatech.com/contact"
    ),
    getBreadcrumbData([
      { name: "Home", item: "https://godivatech.com/" },
      { name: "Contact Us", item: "https://godivatech.com/contact" }
    ])
  ];

  return (
    <>
      <SEO
        title="Contact Best Web Development Company in Madurai | GodivaTech"
        description="Contact GodivaTech for affordable web development, mobile app development, and digital marketing services in Madurai. Get in touch for a custom quote and consultation for your business needs."
        keywords={pageKeywords.contact.join(", ")}
        canonicalUrl="/contact"
        ogType="website"
        ogImage="/images/contact-og-image.jpg"
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
          { hrefLang: "en-in", href: "https://godivatech.com/contact" },
          { hrefLang: "ta-in", href: "https://godivatech.com/ta/contact" }
        ]}
        structuredData={structuredData}
      />

      <PageTransition>
        <div className="relative">
          {/* Hero section */}
          <TransitionItem>
            <section className="relative py-24 overflow-hidden">
              {/* Background gradient with animated patterns */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-indigo-700"></div>
              
              {/* Animated dots pattern with CSS animation instead of JS for better performance */}
              <div 
                className="absolute inset-0 bg-dots animate-slide-pattern"
                style={{
                  backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
                  backgroundSize: '30px 30px',
                }}
              />
              
              {/* Content */}
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="max-w-3xl mx-auto text-center text-white">
                  <LazyMotion features={domAnimation}>
                    <m.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7 }}
                    >
                      <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                        Get in Touch
                      </h1>
                      <p className="text-xl text-white/90 mb-10">
                        Have questions or ready to start your project? Contact our team today to discuss how we can help you achieve your business goals.
                      </p>
                    </m.div>
                    
                    {/* Contact cards */}
                    <m.div 
                      className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-12"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      {useMemo(() => contactInfo.map((item, index) => (
                        <m.div
                          key={index}
                          className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-left border border-white/20 hover:bg-white/20 transition-colors duration-300 hover:-translate-y-1"
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * index + 0.4, duration: 0.6 }}
                        >
                          <div className="flex items-start">
                            <div className="p-3 bg-white/10 rounded-lg mr-4">
                              <item.icon className="text-white h-6 w-6" />
                            </div>
                            <div>
                              <h3 className="text-white font-semibold text-lg mb-1">{item.title}</h3>
                              <p className="text-white/80 text-sm mb-1">{item.description}</p>
                              <p className="text-white font-medium text-base">{item.info}</p>
                            </div>
                          </div>
                        </m.div>
                      )), [contactInfo])}
                    </m.div>
                  </LazyMotion>
                </div>
              </div>
              
              {/* Decorative elements with CSS animations */}
              <div className="absolute top-1/4 -right-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-float-reverse"></div>
              <div className="absolute bottom-0 -left-20 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-float-slow"></div>
            </section>
          </TransitionItem>

          {/* Contact form section */}
          <TransitionItem delay={0.2}>
            <ContactSection />
          </TransitionItem>
          
          {/* Map section */}
          <TransitionItem delay={0.3}>
            <MapSection />
          </TransitionItem>
        </div>
      </PageTransition>
    </>
  );
});

export default Contact;
