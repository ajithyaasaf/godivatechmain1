import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Box, MenuIcon, XIcon, ChevronDown, Search, 
  ArrowUpRight, Globe, Layers, Shield, Database, 
  Braces, BrainCircuit, Palette, CircleUser
} from "lucide-react";
import godivaLogo from "../assets/godiva-logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);
  const toggleMegaMenu = () => setIsMegaMenuOpen(!isMegaMenuOpen);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  // Main navigation items
  const mainNavItems = [
    { path: "/", label: "Home" },
    { path: "/services", label: "Services", hasMegaMenu: true },
    { path: "/portfolio", label: "Portfolio" },
    { path: "/about", label: "About" },
    { path: "/blog", label: "Blog" },
    { path: "/contact", label: "Contact" }
  ];

  // Services for mega menu
  const serviceItems = [
    { 
      icon: Braces, 
      title: "Software Development", 
      description: "Custom apps, websites, and enterprise solutions",
      path: "/services/software-development",
      color: "text-blue-500"
    },
    { 
      icon: Globe, 
      title: "Cloud Solutions", 
      description: "Scalable infrastructure and migration services",
      path: "/services/cloud-solutions",
      color: "text-cyan-500"
    },
    { 
      icon: Layers, 
      title: "IT Consulting", 
      description: "Strategic technology advisory services",
      path: "/services/it-consulting",
      color: "text-indigo-500"
    },
    { 
      icon: Shield, 
      title: "Cybersecurity", 
      description: "Comprehensive protection from evolving threats",
      path: "/services/cybersecurity",
      color: "text-purple-500"
    },
    { 
      icon: Database, 
      title: "Data Analytics", 
      description: "Insights from your data through advanced analytics",
      path: "/services/data-analytics",
      color: "text-green-500"
    },
    { 
      icon: BrainCircuit, 
      title: "AI & Machine Learning", 
      description: "Intelligent automation and predictive systems",
      path: "/services/ai-machine-learning",
      color: "text-rose-500"
    }
  ];

  return (
    <>
      {/* Modern minimalist header with glassmorphism effect */}
      <motion.header 
        className={`fixed top-0 left-0 right-0 z-50 w-full
          ${scrolled 
            ? "bg-white/80 backdrop-blur-md shadow-lg py-3" 
            : "bg-white/40 backdrop-blur-sm shadow py-5"
          } transition-all duration-500`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="relative text-2xl font-bold text-neutral-900 group">
                <motion.span 
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <img 
                    src={godivaLogo} 
                    alt="GodivaTech Logo" 
                    className="h-10 w-auto"
                  />
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary via-blue-500 to-indigo-600 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
                  />
                </motion.span>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center gap-4 md:hidden">
              <motion.button
                aria-label="Search"
                onClick={toggleSearch}
                className="text-neutral-700 hover:text-primary focus:outline-none"
                whileTap={{ scale: 0.95 }}
              >
                <Search className="h-5 w-5" />
              </motion.button>
              
              <motion.button
                aria-label="Toggle menu"
                onClick={toggleMenu}
                className="text-neutral-700 hover:text-primary focus:outline-none p-1"
                whileTap={{ scale: 0.95 }}
              >
                {isMenuOpen ? (
                  <XIcon className="h-5 w-5" />
                ) : (
                  <div className="w-5 flex flex-col items-end gap-1.5">
                    <span className="block w-full h-0.5 bg-neutral-800 rounded-full" />
                    <span className="block w-3/4 h-0.5 bg-neutral-800 rounded-full" />
                  </div>
                )}
              </motion.button>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-0.5 lg:gap-1">
              {mainNavItems.map((item) => (
                <div key={item.path} className="relative group">
                  {item.hasMegaMenu ? (
                    <button
                      onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
                      className={`px-3 py-2 font-medium rounded-full flex items-center transition-all duration-300 ${
                        isActive(item.path) || isMegaMenuOpen
                          ? "text-primary bg-primary/5" 
                          : "text-neutral-700 hover:bg-neutral-50"
                      }`}
                    >
                      {item.label}
                      <ChevronDown className={`ml-1 h-4 w-4 opacity-70 transition-transform duration-300 ${isMegaMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                  ) : (
                    <Link
                      href={item.path}
                      className={`relative px-3 py-2 font-medium rounded-full flex items-center transition-all duration-300 ${
                        isActive(item.path) 
                          ? "text-primary bg-primary/5" 
                          : "text-neutral-700 hover:bg-neutral-50"
                      }`}
                    >
                      {item.label}
                      
                      {isActive(item.path) && (
                        <motion.span
                          className="absolute bottom-1 left-3 right-3 h-0.5 bg-primary/30 rounded-full"
                          layoutId="navbar-indicator"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
            
            {/* Desktop action buttons */}
            <div className="hidden md:flex items-center gap-1">
              <motion.button
                aria-label="Search"
                onClick={toggleSearch}
                className="p-2 rounded-full text-neutral-600 hover:text-primary hover:bg-neutral-100 transition-colors"
                whileTap={{ scale: 0.95 }}
              >
                <Search className="h-4 w-4" />
              </motion.button>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  asChild 
                  size="sm"
                  className="bg-primary hover:bg-primary/90 rounded-full font-medium px-4 py-2 flex items-center gap-1 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <Link href="/contact">
                    <span>Get Started</span>
                    <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Modern mega menu for services */}
        <AnimatePresence>
          {isMegaMenuOpen && (
            <motion.div 
              className="absolute left-0 right-0 mt-1 bg-white shadow-xl border-t border-neutral-100 hidden md:block z-50"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {serviceItems.map((service, index) => (
                    <Link
                      key={index}
                      href={service.path}
                      onClick={() => setIsMegaMenuOpen(false)}
                      className="flex p-4 rounded-lg hover:bg-neutral-50 transition-colors group"
                    >
                      <div className={`mr-4 p-3 rounded-lg ${service.color} bg-opacity-10 self-start`}>
                        <service.icon className={`h-6 w-6 ${service.color}`} />
                      </div>
                      <div>
                        <h3 className="font-medium text-neutral-900 group-hover:text-primary transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-sm text-neutral-500 mt-1">
                          {service.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
                
                <div className="mt-6 pt-6 border-t border-neutral-100 flex justify-between items-center">
                  <div className="text-sm text-neutral-500">
                    Need a custom solution? <Link href="/contact" className="text-primary font-medium">Contact our team →</Link>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => setIsMegaMenuOpen(false)}
                    className="text-neutral-500"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search overlay with modern design */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-24"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSearchOpen(false)}
            >
              <motion.div 
                className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4"
                initial={{ scale: 0.9, y: -50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: -50 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-4 flex items-center border-b border-neutral-100">
                  <Search className="h-5 w-5 text-neutral-400 mr-3" />
                  <input 
                    type="text" 
                    placeholder="Search for anything..." 
                    className="w-full p-2 focus:outline-none text-lg"
                    autoFocus
                  />
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="ml-2 text-neutral-500"
                    onClick={() => setIsSearchOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
                <div className="p-4">
                  <p className="text-sm text-neutral-500 mb-3">Popular searches:</p>
                  <div className="flex flex-wrap gap-2">
                    {['Software Development', 'Cloud Solutions', 'Machine Learning', 'Data Analytics'].map((term, idx) => (
                      <span key={idx} className="text-sm px-3 py-1 bg-neutral-100 rounded-full text-neutral-700 hover:bg-primary/10 hover:text-primary cursor-pointer transition-colors">
                        {term}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modern mobile navigation with sliding effect */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
            >
              <motion.div 
                className="absolute top-[61px] right-0 bottom-0 w-[75%] max-w-sm bg-white shadow-2xl flex flex-col"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex-1 overflow-y-auto p-5 space-y-5">
                  {mainNavItems.map((item) => (
                    <div key={item.path} className="border-b border-neutral-100 pb-4">
                      <Link
                        href={item.path}
                        className={`block text-lg font-medium transition-colors ${
                          isActive(item.path)
                            ? "text-primary"
                            : "text-neutral-800 hover:text-primary"
                        }`}
                        onClick={() => !item.hasMegaMenu && setIsMenuOpen(false)}
                      >
                        <div className="flex justify-between items-center">
                          {item.label}
                          {item.hasMegaMenu && (
                            <ChevronDown className="h-5 w-5 transition-transform" />
                          )}
                        </div>
                      </Link>
                      
                      {/* Mobile submenu for services */}
                      {item.hasMegaMenu && (
                        <div className="mt-3 ml-3 space-y-2">
                          {serviceItems.map((service, idx) => (
                            <Link 
                              key={idx}
                              href={service.path}
                              className="flex items-center py-2 text-neutral-600 hover:text-primary transition-colors"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              <service.icon className={`h-4 w-4 ${service.color} mr-2`} />
                              <span>{service.title}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="p-5 border-t border-neutral-100">
                  <Button
                    asChild
                    className="w-full bg-primary hover:bg-primary/90 rounded-full py-2.5"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Link href="/contact" className="flex items-center justify-center">
                      Get Started
                      <ArrowUpRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                  
                  <div className="mt-4 flex justify-center space-x-4 text-neutral-400">
                    <a href="#" className="hover:text-primary transition-colors">
                      <span className="sr-only">LinkedIn</span>
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </a>
                    <a href="#" className="hover:text-primary transition-colors">
                      <span className="sr-only">Twitter</span>
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                      </svg>
                    </a>
                    <a href="#" className="hover:text-primary transition-colors">
                      <span className="sr-only">GitHub</span>
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
      
      {/* Spacer to prevent content from hiding behind fixed header */}
      <div className={`${scrolled ? 'h-16' : 'h-20'} transition-all duration-300`}></div>
    </>
  );
};

export default Header;
