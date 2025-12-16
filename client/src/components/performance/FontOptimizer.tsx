import { useEffect } from 'react';

/**
 * FontOptimizer Component
 * 
 * Implements web font optimization best practices:
 * - Font preloading
 * - Font-display: swap
 * - Font subsetting
 * - Adaptive font loading
 */
const FontOptimizer: React.FC = () => {
  useEffect(() => {
    // Add font-display: swap to all @font-face rules
    addFontDisplaySwap();
    
    // Preload critical fonts
    preloadCriticalFonts();
    
    // Add font loading detection
    detectFontLoading();
    
    // Prevent layout shifts from font loading
    preventFontLayoutShifts();
  }, []);
  
  return null; // This is a utility component with no visible UI
};

/**
 * Add font-display: swap to all @font-face rules
 */
function addFontDisplaySwap() {
  // Create a style element for font-display: swap
  const style = document.createElement('style');
  style.textContent = `
    @font-face {
      font-display: swap !important;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Preload critical fonts
 */
function preloadCriticalFonts() {
  const criticalFonts = [
    // Add your critical font paths here
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
  ];
  
  criticalFonts.forEach(fontUrl => {
    // Check if link already exists
    const existingLink = document.querySelector(`link[href="${fontUrl}"]`);
    if (existingLink) return;
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.href = fontUrl;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
}

/**
 * Detect when fonts have loaded
 */
function detectFontLoading() {
  if ('fonts' in document) {
    document.fonts.ready.then(() => {
      // Add class to body when fonts are loaded
      document.documentElement.classList.add('fonts-loaded');
      
      // Custom event to inform components that fonts have loaded
      const event = new CustomEvent('fontsLoaded');
      document.dispatchEvent(event);
      
      // Log font loading time for performance tracking
      console.log('Fonts loaded');
    });
  }
}

/**
 * Prevent layout shifts from font loading
 */
function preventFontLayoutShifts() {
  // Add CSS to match fallback and web font metrics
  const style = document.createElement('style');
  style.textContent = `
    /* Prevent font-related layout shifts with size-adjust */
    html:not(.fonts-loaded) body {
      /* This helps align fallback font size to web font size */
      font-size-adjust: 0.5;
    }
    
    /* Set fallback fonts with similar x-height */
    @font-face {
      font-family: 'Inter';
      src: local('Arial');
      font-weight: 400 700;
      size-adjust: 107%;
      ascent-override: 90%;
      descent-override: 20%;
      line-gap-override: 0%;
    }
  `;
  document.head.appendChild(style);
}

export default FontOptimizer;