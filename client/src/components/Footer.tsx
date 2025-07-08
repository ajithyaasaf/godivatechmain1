import React from "react";
import { Link } from "wouter";
import { Box, MapPin, Phone, Mail, ArrowUpCircle } from "lucide-react";
import { FaLinkedinIn, FaTwitter, FaFacebookF, FaInstagram } from "react-icons/fa";
import { motion } from "framer-motion";
import godivaLogo from "../assets/godiva-logo.png";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  const footerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };
  
  return (
    <footer className="bg-gradient-to-br from-neutral-900 to-neutral-800 text-white pt-16 pb-6 relative">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50"></div>
      <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-primary/10 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-primary/5 blur-2xl"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16"
          variants={footerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
        >
          <motion.div variants={itemVariants}>
            <div className="flex items-center mb-6">
              <motion.span 
                className="flex items-center"
                whileHover={{ scale: 1.05 }}
              >
                <img 
                  src={godivaLogo} 
                  alt="GodivaTech Logo" 
                  className="h-10 w-auto"
                />
              </motion.span>
            </div>
            <p className="text-neutral-300 mb-6 leading-relaxed">
              Empowering businesses through innovative technology solutions since 2010.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: <FaLinkedinIn />, href: "https://linkedin.com", label: "LinkedIn" },
                { icon: <FaTwitter />, href: "https://twitter.com", label: "Twitter" },
                { icon: <FaFacebookF />, href: "https://facebook.com", label: "Facebook" },
                { icon: <FaInstagram />, href: "https://instagram.com", label: "Instagram" }
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-neutral-700/50 text-white hover:bg-primary hover:scale-110 transition-all duration-300"
                  aria-label={social.label}
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-6 relative pl-3 border-l-2 border-primary">Services</h3>
            <ul className="space-y-3">
              {[
                { name: "Web Development", slug: "web-design-development" },
                { name: "Digital Marketing", slug: "digital-marketing" },
                { name: "E-commerce", slug: "ecommerce-solutions" },
                { name: "Web Hosting", slug: "web-hosting-maintenance" },
                { name: "UI/UX Design", slug: "ui-ux-design" },
                { name: "Branding & Logo Design", slug: "branding-logo-design" }
              ].map((service, index) => (
                <motion.li 
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-neutral-300 hover:text-white transition-colors flex items-center"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/70 mr-2"></span>
                    {service.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-6 relative pl-3 border-l-2 border-primary">Company</h3>
            <ul className="space-y-3">
              {[
                { label: "About Us", path: "/about" },
                { label: "Portfolio", path: "/portfolio" },
                { label: "Blog", path: "/blog" },
                { label: "Careers", path: "/about" },
                { label: "Contact Us", path: "/contact" }
              ].map((item, index) => (
                <motion.li 
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Link
                    href={item.path}
                    className="text-neutral-300 hover:text-white transition-colors flex items-center"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/70 mr-2"></span>
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-6 relative pl-3 border-l-2 border-primary">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start group">
                <MapPin className="h-5 w-5 mt-1 mr-3 text-primary group-hover:text-white transition-colors" />
                <span className="text-neutral-300 group-hover:text-white transition-colors">
                  261, Vaigai Mainroad 4th Street, Sri Nagar, Iyer Bungalow, Madurai 625007, India
                </span>
              </li>
              <li className="flex items-start group">
                <Phone className="h-5 w-5 mt-1 mr-3 text-primary group-hover:text-white transition-colors" />
                <span className="text-neutral-300 group-hover:text-white transition-colors">+91 96005 20130</span>
              </li>
              <li className="flex items-start group">
                <Mail className="h-5 w-5 mt-1 mr-3 text-primary group-hover:text-white transition-colors" />
                <span className="text-neutral-300 group-hover:text-white transition-colors">info@godivatech.com</span>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        <div className="border-t border-neutral-700/50 pt-6 relative">
          {/* Scroll to top button */}
          <motion.button
            onClick={scrollToTop}
            className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-primary hover:bg-primary/90 text-white p-2 rounded-full shadow-lg"
            whileHover={{ y: -3, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Scroll to top"
          >
            <ArrowUpCircle className="h-6 w-6" />
          </motion.button>
          
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-neutral-400 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} GodivaTech. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center space-x-6">
              {[
                { label: "Privacy Policy", path: "/privacy" },
                { label: "Terms of Service", path: "/terms" },
                { label: "Sitemap", path: "/sitemap" }
              ].map((item, index) => (
                <Link
                  key={index}
                  href={item.path}
                  className="text-neutral-400 text-sm hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
