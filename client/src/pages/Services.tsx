import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  Activity, Heart, BarChart4, CheckCircle, Building2, Truck,
  GraduationCap, ArrowRight
} from "lucide-react";
import ServiceSection from "@/components/home/ServiceSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import CTASection from "@/components/home/CTASection";
import PageTransition, { TransitionItem } from "@/components/PageTransition";

// Industry card component with animation
const IndustryCard = ({ icon: Icon, title, description, index }: { 
  icon: React.ElementType, 
  title: string, 
  description: string,
  index: number
}) => {
  return (
    <motion.div 
      className="bg-white rounded-xl shadow-lg p-8 border border-neutral-100 h-full"
      whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="relative w-16 h-16 mb-6">
        <motion.div 
          className="absolute inset-0 rounded-xl bg-primary/10 z-0"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, index % 2 === 0 ? 5 : -5, 0],
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity,
            repeatType: "reverse",
            delay: index * 0.3
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <Icon className="text-primary h-7 w-7" />
        </div>
      </div>
      <h3 className="text-xl font-bold text-neutral-800 mb-3">{title}</h3>
      <p className="text-neutral-600">
        {description}
      </p>
    </motion.div>
  );
};

// Service approach step component
const ServiceStep = ({ number, title, description, delay }: {
  number: number;
  title: string;
  description: string;
  delay: number;
}) => (
  <motion.div 
    className="flex items-start"
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
  >
    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold mr-4 shrink-0">
      {number}
    </div>
    <div>
      <h3 className="text-xl font-semibold text-neutral-800 mb-2">{title}</h3>
      <p className="text-neutral-600">
        {description}
      </p>
    </div>
  </motion.div>
);

const Services = () => {
  // Industry data
  const industries = [
    { 
      icon: Heart, 
      title: "Healthcare", 
      description: "Custom websites and marketing solutions for clinics, hospitals and healthcare providers to enhance patient engagement."
    },
    { 
      icon: BarChart4, 
      title: "Food & Restaurants", 
      description: "Engaging websites, social media marketing and branding solutions for restaurants, catering services and food businesses."
    },
    { 
      icon: Activity, 
      title: "Retail & E-commerce", 
      description: "Online stores, digital marketing campaigns and branded content to help retail businesses increase sales."
    },
    { 
      icon: Building2, 
      title: "Real Estate", 
      description: "Property listing websites, virtual tours and promotional content for real estate agents and property developers."
    },
    { 
      icon: GraduationCap, 
      title: "Education", 
      description: "Websites, learning platforms and branding solutions for educational institutions and training centers."
    },
    { 
      icon: Truck, 
      title: "Local Businesses", 
      description: "Affordable web development and digital marketing services for small businesses in Madurai and beyond."
    }
  ];
  
  return (
    <PageTransition>
      <div className="relative">
        {/* Hero section */}
        <TransitionItem>
          <section className="relative py-24 overflow-hidden">
            {/* Background with gradient and effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-purple-700"></div>
            
            {/* Animated background patterns */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIgZD0iTTMwMCwzMDAgTDMwMCw1MCBBMjUwLDI1MCAwIDEgMSAxMDEuOTY0NzksNDUzLjAzMzAxIi8+PC9zdmc+')]"></div>
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
            </div>
            
            {/* Content */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center max-w-3xl mx-auto text-white">
                <motion.h1 
                  className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  Our <span className="text-white/90">Services</span>
                </motion.h1>
                
                <motion.p 
                  className="text-xl text-white/90 mb-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  From web development to digital marketing, we provide comprehensive digital solutions to elevate your business in the online world.
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <Button 
                    asChild 
                    size="lg"
                    variant="outline" 
                    className="bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white hover:bg-white/20 rounded-full px-8"
                  >
                    <Link href="/contact" className="flex items-center">
                      Get a Free Consultation
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <motion.div 
              className="absolute -bottom-16 -left-16 w-32 h-32 bg-white opacity-10 rounded-full blur-xl"
              animate={{
                y: [0, -30, 0],
                opacity: [0.1, 0.15, 0.1],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            <motion.div 
              className="absolute -bottom-32 -right-20 w-64 h-64 bg-indigo-300 opacity-10 rounded-full blur-3xl"
              animate={{
                y: [0, -40, 0],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          </section>
        </TransitionItem>

        {/* Service Section */}
        <TransitionItem delay={0.1}>
          <ServiceSection />
        </TransitionItem>

        {/* Service approach section */}
        <TransitionItem delay={0.2}>
          <section className="py-24 bg-white/50 backdrop-blur-sm relative overflow-hidden">
            {/* Subtle background */}
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-50/50 to-white/80 z-0" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMSI+PHBhdGggZD0iTTM2IDM0aC0ydi00aDJ2NHptMC02aC0ydi00aDJ2NHptMC02aC0ydi00aDJ2NHptMC02aC0yVjhoMnY0em0wIDE4aC0ydi00aDJ2NHptMCA2aC0ydi00aDJ2NHptMCA2aC0ydi00aDJ2NHptMCA2aC0ydi00aDJ2NHptLTYgMEgyOHYtNGgydjR6bS02IDBoLTR2LTRoNHY0em0tNiAwaC00di00aDR2NHptLTYgMEg4di00aDR2NHptMC02aC00di00aDR2NHptMC02aC00di00aDR2NHptMC02aC00di00aDR2NHptMC02aC00VjhoNHY0em0wLTZoLTRWOGg0djR6TTI4IDh2NGgtMlY4aDJ6bTYgMGgydjRoLTJWOHptNiAwaDJ2NGgtMlY4em02IDBoMnY0aC0yVjh6bTYgMGg0djRoLTRWOHptMCA2aDR2NGgtNHYtNHptMCA2aDR2NGgtNHYtNHptMCA2aDR2NGgtNHYtNHptMCA2aDR2NGgtNHYtNHptMCA2aDR2NGgtNHYtNHptLTYgMGgydjRoLTJ2LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-5 bg-fixed" />
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                  >
                    <h2 className="text-3xl font-bold text-neutral-800 mb-6 relative inline-block">
                      Our Service Approach
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/40 to-transparent" />
                    </h2>
                    <p className="text-lg text-neutral-600 mb-8">
                      At GodivaTech, we follow a systematic approach to deliver solutions that meet your specific business needs:
                    </p>
                  </motion.div>
                  
                  <div className="space-y-8">
                    <ServiceStep 
                      number={1} 
                      title="Initial Consultation" 
                      description="We start by understanding your business, goals, and specific requirements through detailed discussions with your team."
                      delay={0.1}
                    />
                    
                    <ServiceStep 
                      number={2} 
                      title="Custom Strategy Development" 
                      description="We create a tailored digital strategy that addresses your unique challenges and leverages the right technologies for your business."
                      delay={0.2}
                    />
                    
                    <ServiceStep 
                      number={3} 
                      title="Creative Design & Development" 
                      description="Our team designs and develops solutions with a focus on user experience, visual appeal, and technical excellence."
                      delay={0.3}
                    />
                    
                    <ServiceStep 
                      number={4} 
                      title="Quality Testing" 
                      description="We thoroughly test all deliverables across different devices and platforms to ensure optimal performance and functionality."
                      delay={0.4}
                    />
                    
                    <ServiceStep 
                      number={5} 
                      title="Launch & Ongoing Support" 
                      description="After launch, we provide dedicated support and maintenance to ensure your digital assets continue to perform at their best."
                      delay={0.5}
                    />
                  </div>
                </div>
                
                <div>
                  <motion.div
                    className="rounded-xl overflow-hidden shadow-2xl relative"
                    initial={{ opacity: 0, scale: 0.95, rotateY: 15 }}
                    whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-transparent mix-blend-overlay z-10" />
                    
                    {/* Main image */}
                    <img
                      src="https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                      alt="Service approach illustration"
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Floating badge */}
                    <motion.div
                      className="absolute bottom-6 right-6 bg-white rounded-lg shadow-lg py-2 px-4 z-20 flex items-center border border-neutral-100"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.8 }}
                    >
                      <CheckCircle className="text-primary h-5 w-5 mr-2" />
                      <span className="font-medium text-sm">Trusted Process</span>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </div>
          </section>
        </TransitionItem>

        {/* Industries section */}
        <TransitionItem delay={0.2}>
          <section className="py-24 relative overflow-hidden">
            {/* Background with gradients */}
            <div className="absolute inset-0 bg-neutral-50/60" />
            
            {/* Subtle grid pattern */}
            <div className="absolute inset-0 
              [background-image:linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] 
              [background-size:4rem_4rem]" />
              
            {/* Content */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <motion.div 
                className="text-center mb-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <div className="inline-flex items-center justify-center mb-4 px-3 py-1 rounded-full bg-primary/5 border border-primary/10">
                  <span className="text-primary font-semibold text-sm">SPECIALIZED EXPERTISE</span>
                </div>
                
                <h2 className="text-4xl font-bold text-neutral-800 mb-4">Industries We Serve</h2>
                <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                  We provide tailored technology solutions for a diverse range of industries, with expertise that spans across multiple sectors.
                </p>
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {industries.map((industry, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7, delay: 0.1 * index }}
                  >
                    <IndustryCard 
                      icon={industry.icon}
                      title={industry.title}
                      description={industry.description}
                      index={index}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </TransitionItem>

        {/* Newsletter and CTA Sections */}
        <TransitionItem delay={0.1}>
          <NewsletterSection />
        </TransitionItem>
        
        <TransitionItem delay={0.2}>
          <CTASection />
        </TransitionItem>
      </div>
    </PageTransition>
  );
};

export default Services;
