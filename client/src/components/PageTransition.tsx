import React, { useEffect, ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * Advanced page transition component with multiple effects and smooth scroll restoration
 */
const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const [location] = useLocation();
  const [showTransition, setShowTransition] = useState(true);
  
  // Unique key for each route to force re-render
  const pageKey = location;
  
  // Smooth scroll to top when this component mounts (page change)
  useEffect(() => {
    // Reset scroll position
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    
    // Show the transition effect
    setShowTransition(true);
    
    // Hide transition after it completes
    const timer = setTimeout(() => {
      setShowTransition(false);
    }, 1200);
    
    return () => clearTimeout(timer);
  }, [location]);

  // Main content transition
  const contentVariants = {
    initial: {
      opacity: 0,
      y: 20
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.6, -0.05, 0.01, 0.99], // Custom easing
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.5
      }
    }
  };
  
  // Fancy overlay transition (slides in and out)
  const overlayVariants = {
    initial: {
      y: '100vh'
    },
    animate: {
      y: '-100vh',
      transition: {
        duration: 0.8,
        ease: [0.785, 0.135, 0.15, 0.86] // Custom ease
      }
    }
  };
  
  // Child item animations for staggered effect
  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5
      }
    }
  };

  return (
    <>
      {/* Main content with transition */}
      <motion.div
        key={pageKey}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={contentVariants}
        className="page-content relative" // Added relative positioning for better scroll tracking
      >
        {children}
      </motion.div>
      
      {/* Overlay transition effect that shows during page changes */}
      <AnimatePresence>
        {showTransition && (
          <>
            {/* Layer 1 - Primary color */}
            <motion.div
              key="overlay-1"
              className="fixed inset-0 z-[100] bg-gradient-to-tr from-primary to-indigo-600 pointer-events-none"
              initial={{ y: '100vh', opacity: 0.9 }}
              animate={{ 
                y: '-100vh',
                opacity: 0.9,
                transition: {
                  duration: 0.8,
                  ease: [0.785, 0.135, 0.15, 0.86],
                  delay: 0.1
                }
              }}
              exit={{ y: '-200vh' }}
            />
            
            {/* Layer 2 - Secondary shade */}
            <motion.div
              key="overlay-2"
              className="fixed inset-0 z-[99] bg-gradient-to-tr from-blue-600 to-purple-700 pointer-events-none"
              initial={{ y: '100vh', opacity: 0.6 }}
              animate={{ 
                y: '-100vh',
                opacity: 0.6,
                transition: {
                  duration: 0.9,
                  ease: [0.785, 0.135, 0.15, 0.86]
                }
              }}
              exit={{ y: '-200vh' }}
            />
            
            {/* Layer 3 - Tertiary shade */}
            <motion.div
              key="overlay-3"
              className="fixed inset-0 z-[98] bg-gradient-to-tr from-violet-700 to-fuchsia-700 pointer-events-none"
              initial={{ y: '100vh', opacity: 0.4 }}
              animate={{ 
                y: '-100vh',
                opacity: 0.4,
                transition: {
                  duration: 1,
                  ease: [0.785, 0.135, 0.15, 0.86],
                  delay: 0.05
                }
              }}
              exit={{ y: '-200vh' }}
            />
          </>
        )}
      </AnimatePresence>
    </>
  );
};

// Higher-order component for wrapping individual elements with staggered animations
export const TransitionItem: React.FC<{
  children: ReactNode;
  delay?: number;
}> = ({ children, delay = 0 }) => {
  return (
    <motion.div
      variants={{
        initial: { opacity: 0, y: 20 },
        animate: { 
          opacity: 1, 
          y: 0,
          transition: {
            duration: 0.5,
            ease: [0.6, -0.05, 0.01, 0.99],
            delay: delay
          }
        }
      }}
      initial="initial"
      animate="animate"
      className="relative" // Added relative positioning for better animation tracking
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;