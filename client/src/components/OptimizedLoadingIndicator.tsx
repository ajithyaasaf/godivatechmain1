import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Smart loading indicator with performance optimizations
 * - Provides a non-blocking loading indicator with delayed appearance
 * - Skips showing for fast loads to prevent flicker
 * - Incorporates fallback content when available
 */
interface OptimizedLoadingIndicatorProps {
  /**
   * Minimum delay before showing loading indicator (ms)
   * This prevents flicker for fast operations
   */
  minDelay?: number;
  
  /**
   * Text to display while loading
   */
  loadingText?: string;
  
  /**
   * Simple fallback content to render immediately
   */
  fallback?: React.ReactNode;
  
  /**
   * Whether the loading state is active
   */
  isLoading: boolean;
  
  /**
   * Whether to show progress indicators
   */
  showProgress?: boolean;
  
  /**
   * Custom className for the container
   */
  className?: string;
}

const OptimizedLoadingIndicator: React.FC<OptimizedLoadingIndicatorProps> = ({
  minDelay = 300,
  loadingText = 'Loading...',
  fallback,
  isLoading,
  showProgress = true,
  className = '',
}) => {
  // State to control visibility based on minDelay
  const [shouldShow, setShouldShow] = useState(false);
  
  // Apply the minDelay before showing the loading indicator
  useEffect(() => {
    if (!isLoading) {
      setShouldShow(false);
      return;
    }
    
    const timer = setTimeout(() => {
      if (isLoading) {
        setShouldShow(true);
      }
    }, minDelay);
    
    return () => clearTimeout(timer);
  }, [isLoading, minDelay]);
  
  // If not loading or not ready to show, render nothing or fallback
  if (!isLoading || !shouldShow) {
    return fallback ? <>{fallback}</> : null;
  }
  
  // Render optimized loading indicator
  return (
    <motion.div 
      className={`flex flex-col items-center justify-center p-6 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {showProgress && (
        <div className="relative w-16 h-16 mb-4">
          {/* Outer ring - rotates slowly */}
          <motion.div 
            className="absolute inset-0 border-4 border-primary/30 rounded-full"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ 
              duration: 3, 
              ease: "linear", 
              repeat: Infinity,
              // Optimize animation performance 
              willChange: "transform",
            }}
          />
          
          {/* Inner ring - rotates faster in opposite direction */}
          <motion.div 
            className="absolute inset-2 border-4 border-t-primary border-r-primary border-b-transparent border-l-transparent rounded-full"
            initial={{ rotate: 0 }}
            animate={{ rotate: -720 }}
            transition={{ 
              duration: 2, 
              ease: "easeInOut", 
              repeat: Infinity,
              willChange: "transform",
            }}
          />
          
          {/* Center dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-primary rounded-full" />
          </div>
        </div>
      )}
      
      <p className="text-neutral-600 text-center font-medium">
        {loadingText}
      </p>
    </motion.div>
  );
};

export default OptimizedLoadingIndicator;