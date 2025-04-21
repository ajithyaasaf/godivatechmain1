import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import TeamSection from "@/components/home/TeamSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CTASection from "@/components/home/CTASection";
import PageTransition, { TransitionItem } from "@/components/PageTransition";

const About = () => {
  // No need for manual scroll handling - now managed by PageTransition
  
  return (
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
                <h1 className="text-5xl font-bold text-neutral-800 mb-6">About GodivaTech</h1>
                <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
                  Empowering businesses with innovative technology solutions since 2010.
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
                      GodivaTech was founded in 2010 by a group of passionate technologists who believed in the power of technology to transform businesses. What began as a small software development shop has grown into a full-service technology partner trusted by companies worldwide.
                    </p>
                    <p className="text-lg text-neutral-600 mb-6">
                      Over the years, we've expanded our services to include cloud solutions, IT consulting, cybersecurity, data analytics, and AI & machine learning, always staying at the forefront of technological innovations.
                    </p>
                    <p className="text-lg text-neutral-600">
                      Today, we're proud to have a team of 50+ technology experts dedicated to helping our clients navigate the ever-changing digital landscape and achieve their business goals.
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
                      Our Mission & Values
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/40 to-transparent" />
                    </h2>
                    <p className="text-lg text-neutral-600 mb-8">
                      Our mission is to empower businesses through innovative technology solutions that drive growth, efficiency, and competitive advantage.
                    </p>
                    
                    {/* Values with hover effects */}
                    <div className="space-y-8">
                      <motion.div 
                        className="p-6 rounded-lg border border-neutral-200 bg-white/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/20 hover:bg-white/80"
                        whileHover={{ y: -5 }}
                      >
                        <h3 className="text-xl font-semibold text-neutral-800 mb-2">Client-Centric Approach</h3>
                        <p className="text-neutral-600">
                          We put our clients' needs at the center of everything we do, focusing on delivering solutions that address their unique challenges and opportunities.
                        </p>
                      </motion.div>
                      
                      <motion.div 
                        className="p-6 rounded-lg border border-neutral-200 bg-white/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/20 hover:bg-white/80"
                        whileHover={{ y: -5 }}
                      >
                        <h3 className="text-xl font-semibold text-neutral-800 mb-2">Innovation</h3>
                        <p className="text-neutral-600">
                          We're constantly exploring new technologies and methodologies to ensure our clients benefit from the latest advancements in the industry.
                        </p>
                      </motion.div>
                      
                      <motion.div 
                        className="p-6 rounded-lg border border-neutral-200 bg-white/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/20 hover:bg-white/80"
                        whileHover={{ y: -5 }}
                      >
                        <h3 className="text-xl font-semibold text-neutral-800 mb-2">Excellence</h3>
                        <p className="text-neutral-600">
                          We're committed to delivering the highest quality solutions, maintaining rigorous standards in our work, and continuously improving our processes.
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
                      <Link href="/contact">Get in Touch</Link>
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
  );
};

export default About;
