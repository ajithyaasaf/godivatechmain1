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
              <a href="https://www.facebook.com/GodivaTech/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/p/DOg6n1hkvE9/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"/>
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
