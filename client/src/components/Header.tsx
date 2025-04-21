import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Box, MenuIcon, XIcon, ChevronDown, Search, UserCircle, ShoppingCart } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

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

  const mainNavItems = [
    { path: "/", label: "Home" },
    { path: "/services", label: "Services", hasDropdown: true },
    { path: "/portfolio", label: "Portfolio" },
    { path: "/about", label: "About Us" },
    { path: "/blog", label: "Blog" },
    { path: "/contact", label: "Contact" }
  ];

  return (
    <>
      {/* Top navigation bar with contact info and social links */}
      <div className={`w-full py-2 bg-primary text-white hidden md:block transition-all duration-300 ${scrolled ? 'py-1' : 'py-2'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <span>info@godivatech.com</span>
            <span>|</span>
            <span>(123) 456-7890</span>
          </div>
          <div className="flex items-center space-x-3">
            <a href="#" className="hover:text-white/80 transition-colors">
              <motion.span whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 400 }}>
                LinkedIn
              </motion.span>
            </a>
            <a href="#" className="hover:text-white/80 transition-colors">
              <motion.span whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 400 }}>
                Twitter
              </motion.span>
            </a>
            <a href="#" className="hover:text-white/80 transition-colors">
              <motion.span whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 400 }}>
                Facebook
              </motion.span>
            </a>
          </div>
        </div>
      </div>
    
      {/* Main navigation */}
      <motion.header 
        className={`sticky top-0 z-50 w-full ${
          scrolled 
            ? "bg-white/95 backdrop-blur-md shadow-lg py-2" 
            : "bg-white shadow-sm py-4"
        } transition-all duration-300`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-primary">
                <motion.span 
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Box className="rotate-45 text-accent h-7 w-7" />
                  <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                    GodivaTech
                  </span>
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
                className="text-neutral-700 hover:text-primary focus:outline-none"
                whileTap={{ scale: 0.95 }}
              >
                {isMenuOpen ? (
                  <XIcon className="h-6 w-6" />
                ) : (
                  <MenuIcon className="h-6 w-6" />
                )}
              </motion.button>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {mainNavItems.map((item) => (
                <div key={item.path} className="relative group">
                  <Link
                    href={item.path}
                    className={`relative px-3 py-2 font-medium rounded-md hover:bg-neutral-50 flex items-center transition-all duration-300 ${
                      isActive(item.path) 
                        ? "text-primary" 
                        : "text-neutral-700"
                    }`}
                  >
                    {item.label}
                    {item.hasDropdown && (
                      <ChevronDown className="ml-1 h-4 w-4 opacity-70 transition-transform group-hover:rotate-180" />
                    )}
                    
                    {isActive(item.path) && (
                      <motion.span
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                        layoutId="navbar-indicator"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </Link>
                  
                  {/* Dropdown for Services */}
                  {item.hasDropdown && (
                    <div className="absolute left-0 mt-1 w-56 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="py-1">
                        {['Software Development', 'Cloud Solutions', 'IT Consulting', 'Cybersecurity', 'Data Analytics', 'AI & Machine Learning'].map((service, idx) => (
                          <Link 
                            key={idx}
                            href={`/services/${service.toLowerCase().replace(/\s+/g, '-')}`}
                            className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-primary"
                          >
                            {service}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>
            
            {/* Desktop action buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <motion.button
                aria-label="Search"
                onClick={toggleSearch}
                className="p-2 rounded-full text-neutral-600 hover:text-primary hover:bg-neutral-100 transition-colors"
                whileTap={{ scale: 0.95 }}
              >
                <Search className="h-5 w-5" />
              </motion.button>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  asChild 
                  size="sm"
                  className="bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <Link href="/contact">Get Started</Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Search overlay */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div 
              className="absolute top-full left-0 w-full bg-white shadow-lg p-4"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="container mx-auto flex items-center">
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="w-full p-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                />
                <Button 
                  size="sm" 
                  className="ml-2 bg-primary"
                >
                  Search
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="ml-2"
                  onClick={toggleSearch}
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              className="md:hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="p-4 space-y-3 bg-white rounded-b-lg shadow-xl"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ staggerChildren: 0.1, delayChildren: 0.1 }}
              >
                {mainNavItems.map((item) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link
                      href={item.path}
                      className={`block px-4 py-3 rounded-md font-medium transition-colors duration-300 ${
                        isActive(item.path)
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-neutral-100"
                      }`}
                      onClick={toggleMenu}
                    >
                      <div className="flex justify-between items-center">
                        {item.label}
                        {item.hasDropdown && <ChevronDown className="h-4 w-4" />}
                      </div>
                    </Link>
                    
                    {/* Mobile submenu for services */}
                    {item.hasDropdown && isActive(item.path) && (
                      <div className="ml-4 mt-1 space-y-1 border-l-2 border-primary/20 pl-4">
                        {['Software Development', 'Cloud Solutions', 'IT Consulting', 'Cybersecurity', 'Data Analytics', 'AI & Machine Learning'].map((service, idx) => (
                          <Link 
                            key={idx}
                            href={`/services/${service.toLowerCase().replace(/\s+/g, '-')}`}
                            className="block py-2 text-sm text-neutral-600 hover:text-primary"
                            onClick={toggleMenu}
                          >
                            {service}
                          </Link>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  className="pt-2"
                >
                  <Link
                    href="/contact"
                    className="block px-4 py-3 rounded-md text-white bg-primary font-medium shadow-md hover:shadow-lg transition-all duration-300 text-center"
                    onClick={toggleMenu}
                  >
                    Get Started
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
};

export default Header;
