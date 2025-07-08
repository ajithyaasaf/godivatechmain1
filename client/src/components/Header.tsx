import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Link from "@/components/CustomLink";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Box, XIcon, ChevronDown, Search, 
  ArrowUpRight, Globe, Layers, Shield, Database, 
  Braces, BrainCircuit, Palette, CircleUser, 
  Menu, Phone, Mail
} from "lucide-react";
import godivaLogo from "../assets/godiva-logo.png";

/**
 * Navigation item type definition
 */
interface NavItem {
  path: string;
  label: string;
  hasMegaMenu?: boolean;
  icon?: React.FC<{ className?: string }>;
}

/**
 * Service item type definition
 */
interface ServiceItem {
  icon: React.FC<{ className?: string }>;
  title: string;
  description: string;
  path: string;
  color: string;
}

/**
 * Logo component with animation
 */
const Logo: React.FC = () => (
  <Link href="/" className="relative font-bold text-neutral-900 group">
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
);

/**
 * Mobile menu trigger component
 */
const MobileMenuTrigger: React.FC<{ isOpen: boolean, onClick: () => void }> = ({ isOpen, onClick }) => (
  <motion.button
    aria-label="Toggle menu"
    onClick={onClick}
    className="text-neutral-700 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-md p-2"
    whileTap={{ scale: 0.95 }}
  >
    {isOpen ? (
      <XIcon className="h-6 w-6" />
    ) : (
      <Menu className="h-6 w-6" />
    )}
  </motion.button>
);

/**
 * Search trigger component
 */
const SearchTrigger: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <motion.button
    aria-label="Search"
    onClick={onClick}
    className="p-2 rounded-md text-neutral-600 hover:text-primary hover:bg-neutral-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
    whileTap={{ scale: 0.95 }}
  >
    <Search className="h-5 w-5" />
  </motion.button>
);

/**
 * CTA Button component
 */
const CTAButton: React.FC = () => (
  <motion.div
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
  >
    <Button 
      asChild 
      size="sm"
      className="bg-primary hover:bg-primary/90 rounded-lg font-medium px-4 py-2 flex items-center gap-1 shadow-sm hover:shadow-md transition-all duration-300"
    >
      <Link href="/contact">
        <span>Start a Project</span>
        <ArrowUpRight className="h-4 w-4 ml-1" />
      </Link>
    </Button>
  </motion.div>
);

/**
 * Desktop NavItem component
 */
const DesktopNavItem: React.FC<{ 
  item: NavItem, 
  isActive: boolean, 
  isMegaMenuOpen?: boolean,
  toggleMegaMenu?: () => void 
}> = ({ item, isActive, isMegaMenuOpen, toggleMegaMenu }) => {
  
  if (item.hasMegaMenu) {
    return (
      <button
        onClick={(e) => {
          e.stopPropagation(); // Stop event propagation
          if (toggleMegaMenu) toggleMegaMenu();
        }}
        className={`px-3 py-2 font-medium rounded-md flex items-center transition-all duration-300 ${
          isActive || isMegaMenuOpen
            ? "text-primary bg-primary/5" 
            : "text-neutral-700 hover:bg-neutral-50"
        }`}
        aria-expanded={isMegaMenuOpen}
        aria-haspopup="true"
      >
        {item.label}
        <ChevronDown className={`ml-1 h-4 w-4 opacity-70 transition-transform duration-300 ${isMegaMenuOpen ? 'rotate-180' : ''}`} />
      </button>
    );
  }
  
  return (
    <Link
      href={item.path}
      className={`relative px-3 py-2 font-medium rounded-md flex items-center transition-all duration-300 ${
        isActive 
          ? "text-primary bg-primary/5" 
          : "text-neutral-700 hover:bg-neutral-50"
      }`}
      aria-current={isActive ? "page" : undefined}
    >
      {item.label}
      
      {isActive && (
        <motion.span
          className="absolute bottom-1 left-3 right-3 h-0.5 bg-primary/30 rounded-full"
          layoutId="navbar-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </Link>
  );
};

/**
 * MegaMenu component
 */
const MegaMenu: React.FC<{ 
  isOpen: boolean, 
  services: ServiceItem[],
  onClose: () => void
}> = ({ isOpen, services, onClose }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div 
        className="absolute left-0 right-0 mt-1 bg-white shadow-xl border-t border-neutral-100 hidden md:block z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        role="menu"
        aria-orientation="vertical"
        onClick={(e) => e.stopPropagation()} // Stop propagation of clicks within megamenu
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Link
                key={index}
                href={service.path}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent the click from closing the menu
                  onClose(); // Explicitly close the menu
                }}
                className="flex p-4 rounded-lg hover:bg-neutral-50 transition-colors group"
                role="menuitem"
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
              Need a custom solution? <Link href="/contact" className="text-primary font-medium" onClick={(e) => e.stopPropagation()}>Contact our team →</Link>
            </div>
            <Button 
              size="sm" 
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation(); // Prevent propagation
                onClose(); // Close the menu
              }}
              className="text-neutral-500"
              role="menuitem"
            >
              Close
            </Button>
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

/**
 * Search overlay component
 */
const SearchOverlay: React.FC<{ isOpen: boolean, onClose: () => void }> = ({ isOpen, onClose }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label="Search"
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
              aria-label="Search input"
            />
            <Button 
              size="sm" 
              variant="ghost" 
              className="ml-2 text-neutral-500"
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
          <div className="p-4">
            <p className="text-sm text-neutral-500 mb-3">Popular searches:</p>
            <div className="flex flex-wrap gap-2">
              {['Web Design', 'Digital Marketing', 'E-commerce', 'Logo Design'].map((term, idx) => (
                <span 
                  key={idx} 
                  className="text-sm px-3 py-1 bg-neutral-100 rounded-full text-neutral-700 hover:bg-primary/10 hover:text-primary cursor-pointer transition-colors"
                  role="button"
                  tabIndex={0}
                >
                  {term}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

/**
 * Mobile menu component
 */
const MobileMenu: React.FC<{
  isOpen: boolean,
  navItems: NavItem[],
  serviceItems: ServiceItem[],
  isActive: (path: string) => boolean,
  onClose: () => void
}> = ({ isOpen, navItems, serviceItems, isActive, onClose }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div 
        className="fixed inset-0 z-50 md:hidden bg-gradient-to-br from-primary/95 to-indigo-800/95 text-white flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        role="dialog"
        aria-modal="true"
        aria-label="Main navigation"
      >
        {/* Header with close button */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <motion.div 
            className="flex items-center"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <img 
              src={godivaLogo} 
              alt="GodivaTech Logo" 
              className="h-10 w-auto brightness-200"
            />
          </motion.div>
          
          <motion.button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Close menu"
          >
            <XIcon className="h-6 w-6" />
          </motion.button>
        </div>
        
        {/* Main navigation */}
        <div className="flex-1 overflow-y-auto py-8 px-6">
          <nav className="space-y-5" aria-label="Mobile navigation">
            {navItems.map((item, index) => (
              <motion.div 
                key={item.path}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15 + (index * 0.05) }}
                className="min-h-fit"
              >
                {!item.hasMegaMenu ? (
                  <Link
                    href={item.path}
                    className={`block text-xl font-medium py-4 transition-colors ${
                      isActive(item.path) ? "text-white" : "text-white/80 hover:text-white"
                    }`}
                    onClick={onClose}
                    aria-current={isActive(item.path) ? "page" : undefined}
                  >
                    <div className="flex items-center">
                      <span className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 mr-4">
                        {item.label === "Home" && <Box className="h-6 w-6" />}
                        {item.label === "Portfolio" && <BrainCircuit className="h-6 w-6" />}
                        {item.label === "About" && <CircleUser className="h-6 w-6" />}
                        {item.label === "Blog" && <Braces className="h-6 w-6" />}
                        {item.label === "Contact" && <Palette className="h-6 w-6" />}
                      </span>
                      <span className="text-2xl">{item.label}</span>
                    </div>
                  </Link>
                ) : (
                  <div className="mb-8">
                    <div className="flex items-center py-4 text-xl font-medium">
                      <span className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 mr-4">
                        <Layers className="h-6 w-6" />
                      </span>
                      <span className="text-2xl">{item.label}</span>
                    </div>
                    
                    {/* Services grid */}
                    <div className="grid grid-cols-2 gap-4 mt-6 pl-16">
                      {serviceItems.map((service, idx) => (
                        <Link 
                          key={idx}
                          href={service.path}
                          className="bg-white/10 hover:bg-white/20 rounded-xl p-4 transition-colors group"
                          onClick={onClose}
                        >
                          <div className={`${service.color} bg-opacity-20 h-12 w-12 rounded-full flex items-center justify-center mb-3`}>
                            <service.icon className={`h-6 w-6 ${service.color}`} />
                          </div>
                          <span className="text-base font-medium block group-hover:text-white leading-tight">{service.title}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </nav>
        </div>
        
        {/* Quick contact info */}
        <motion.div
          className="px-6 py-4 border-t border-white/10"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex flex-col space-y-3">
            <a href="tel:+1234567890" className="flex items-center text-white/80 hover:text-white">
              <Phone className="h-5 w-5 mr-3" />
              <span>(123) 456-7890</span>
            </a>
            <a href="mailto:hello@godivatech.com" className="flex items-center text-white/80 hover:text-white">
              <Mail className="h-5 w-5 mr-3" />
              <span>hello@godivatech.com</span>
            </a>
          </div>
        </motion.div>
        
        {/* CTA section */}
        <motion.div 
          className="py-6 px-6 border-t border-white/10 mt-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-center mb-4">
            <h3 className="text-xl font-medium text-white">Ready to start your project?</h3>
          </div>
          
          <Button
            asChild
            className="w-full bg-white text-primary hover:bg-white/90 rounded-lg py-6 shadow-lg font-medium text-lg"
            onClick={onClose}
          >
            <Link href="/contact" className="flex items-center justify-center">
              Get in Touch
              <ArrowUpRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          
          <div className="mt-6 pt-4 border-t border-white/10">
            <div className="flex justify-center gap-6 text-white/70">
              <a href="#" className="hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a href="#" className="hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                </svg>
              </a>
              <a href="#" className="hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full">
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
);

/**
 * Main Header component
 */
const Header: React.FC = () => {
  // State management
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);

  // Action handlers
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);
  const toggleMegaMenu = () => setIsMegaMenuOpen(!isMegaMenuOpen);

  // Handle clicks outside the megamenu to close it, but prevent immediate closure
  useEffect(() => {
    // Create a ref to track if we're handling the initial click that opens the menu
    let isInitialClick = false;
    
    const handleClickOutside = (event: MouseEvent) => {
      // If it's the initial click that just opened the menu, ignore it
      if (isInitialClick) {
        isInitialClick = false;
        return;
      }
      
      // Otherwise, close the menu on subsequent clicks outside
      if (isMegaMenuOpen) {
        setIsMegaMenuOpen(false);
      }
    };
    
    if (isMegaMenuOpen) {
      // Set flag to ignore the initial click
      isInitialClick = true;
      
      // Add the listener with a slight delay to avoid the initial click
      const timeoutId = setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 100);
      
      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [isMegaMenuOpen]);

  // Scroll detection
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

  // Active link detection
  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // Main navigation items
  const mainNavItems: NavItem[] = [
    { path: "/", label: "Home", icon: Box },
    { path: "/services", label: "Services", hasMegaMenu: true, icon: Layers },
    { path: "/portfolio", label: "Portfolio", icon: BrainCircuit },
    { path: "/about", label: "About", icon: CircleUser },
    { path: "/blog", label: "Blog", icon: Braces },
    { path: "/contact", label: "Contact", icon: Palette }
  ];

  // Services for mega menu - Aligned with enterprise services
  const serviceItems: ServiceItem[] = [
    { 
      icon: Globe, 
      title: "Web Design & Development", 
      description: "Custom websites with responsive designs optimized for all devices",
      path: "/services/web-design-development",
      color: "text-blue-500"
    },
    { 
      icon: Palette, 
      title: "Branding & Logo Design", 
      description: "Comprehensive brand identity systems for businesses",
      path: "/services/branding-logo-design",
      color: "text-cyan-500"
    },
    { 
      icon: Layers, 
      title: "Digital Marketing", 
      description: "Strategic marketing solutions to boost your online presence",
      path: "/services/digital-marketing",
      color: "text-indigo-500"
    },
    { 
      icon: Box, 
      title: "E-commerce Solutions", 
      description: "End-to-end platforms with secure payment processing",
      path: "/services/ecommerce-solutions",
      color: "text-purple-500"
    },
    { 
      icon: Database, 
      title: "Web Hosting & Maintenance", 
      description: "Reliable hosting with ongoing support and security updates",
      path: "/services/web-hosting-maintenance",
      color: "text-green-500"
    },
    { 
      icon: CircleUser, 
      title: "UI/UX Design", 
      description: "User-centered design enhancing usability and engagement",
      path: "/services/ui-ux-design",
      color: "text-rose-500"
    }
  ];

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-40 w-full 
          ${scrolled 
            ? "bg-white/90 backdrop-blur-md shadow-md py-3" 
            : "bg-white/50 backdrop-blur-sm py-4"
          } transition-all duration-300`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Logo />

            {/* Mobile controls */}
            <div className="flex items-center gap-4 md:hidden">
              <SearchTrigger onClick={toggleSearch} />
              <MobileMenuTrigger isOpen={isMenuOpen} onClick={toggleMenu} />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2" aria-label="Main navigation">
              {mainNavItems.map((item) => (
                <div key={item.path} className="relative group">
                  <DesktopNavItem 
                    item={item}
                    isActive={isActive(item.path)}
                    isMegaMenuOpen={item.hasMegaMenu ? isMegaMenuOpen : undefined}
                    toggleMegaMenu={item.hasMegaMenu ? toggleMegaMenu : undefined}
                  />
                </div>
              ))}
            </nav>
            
            {/* Desktop action buttons */}
            <div className="hidden md:flex items-center gap-3">
              <SearchTrigger onClick={toggleSearch} />
              <CTAButton />
            </div>
          </div>
        </div>

        {/* MegaMenu component */}
        <MegaMenu 
          isOpen={isMegaMenuOpen} 
          services={serviceItems}
          onClose={() => setIsMegaMenuOpen(false)}
        />
      </header>
      
      {/* Search overlay */}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      
      {/* Mobile menu */}
      <MobileMenu 
        isOpen={isMenuOpen}
        navItems={mainNavItems}
        serviceItems={serviceItems}
        isActive={isActive}
        onClose={() => setIsMenuOpen(false)}
      />
      
      {/* Spacer to prevent content from hiding behind fixed header */}
      <div className={`${scrolled ? 'h-16' : 'h-20'} transition-all duration-300`}></div>
    </>
  );
};

export default Header;
