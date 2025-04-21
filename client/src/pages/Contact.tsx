import React from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { AtSign, Phone, MapPin, Clock, ArrowRight } from "lucide-react";
import ContactSection from "@/components/home/ContactSection";
import MapSection from "@/components/home/MapSection";
import PageTransition, { TransitionItem } from "@/components/PageTransition";

const Contact = () => {
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
      info: "(123) 456-7890",
      description: "Monday to Friday, 9am to 5pm"
    },
    { 
      icon: MapPin, 
      title: "Visit Us", 
      info: "123 Tech Avenue, San Francisco, CA",
      description: "Our headquarters location"
    },
    { 
      icon: Clock, 
      title: "Working Hours", 
      info: "9:00 AM - 5:00 PM (PST)",
      description: "Monday to Friday"
    }
  ];
  
  return (
    <>
      <Helmet>
        <title>Contact Us | GodivaTech</title>
        <meta 
          name="description" 
          content="Contact GodivaTech to discuss your technology needs. Our team of experts is ready to help you transform your business with innovative software solutions, IT consulting, and cloud services." 
        />
        <meta name="keywords" content="contact GodivaTech, technology consulting, IT support, software development services" />
      </Helmet>

      <PageTransition>
        <div className="relative">
          {/* Hero section */}
          <TransitionItem>
            <section className="relative py-24 overflow-hidden">
              {/* Background gradient with animated patterns */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-indigo-700"></div>
              
              {/* Animated dots pattern */}
              <motion.div 
                className="absolute inset-0"
                animate={{
                  backgroundPosition: ['0% 0%', '100% 100%'],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
                style={{
                  backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
                  backgroundSize: '30px 30px',
                }}
              />
              
              {/* Content */}
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="max-w-3xl mx-auto text-center text-white">
                  <motion.div
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
                  </motion.div>
                  
                  {/* Contact cards */}
                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    {contactInfo.map((item, index) => (
                      <motion.div
                        key={index}
                        className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-left border border-white/20 hover:bg-white/20 transition-colors duration-300"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index + 0.4, duration: 0.6 }}
                        whileHover={{ y: -5 }}
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
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-1/4 -right-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 -left-20 w-80 h-80 bg-primary/20 rounded-full blur-3xl"></div>
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
};

export default Contact;
