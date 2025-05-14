import { useEffect } from 'react';

/**
 * CriticalCSSOptimizer Component
 * 
 * Implements critical CSS optimization best practices:
 * - Inline critical CSS
 * - Defer non-critical CSS
 * - CSS containment
 * - Reduce CSS specificity
 */
const CriticalCSSOptimizer: React.FC = () => {
  useEffect(() => {
    // Inline critical CSS styles
    inlineCriticalCSS();
    
    // Defer non-critical CSS
    deferNonCriticalCSS();
    
    // Add CSS containment to key elements
    addCSSContainment();
    
    return () => {
      // Clean up any added style elements
      document.querySelectorAll('style[data-critical="true"]').forEach(style => {
        document.head.removeChild(style);
      });
    };
  }, []);
  
  return null; // This is a utility component with no visible UI
};

/**
 * Inline critical CSS for faster render
 */
function inlineCriticalCSS() {
  const criticalCSS = `
    /* Critical CSS for fast LCP - focused on above-fold content */
    
    /* Layout structure */
    body {
      margin: 0;
      font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
    }
    
    .hero-section {
      min-height: 100vh;
      display: flex;
      align-items: center;
      contain: layout style paint;
    }
    
    /* Critical heading styles */
    h1 {
      margin: 0 0 1rem;
      font-size: clamp(2.5rem, 8vw, 4rem);
      font-weight: 700;
      line-height: 1.1;
    }
    
    /* Above-fold content visibility */
    [data-above-fold="true"] {
      content-visibility: auto;
      contain-intrinsic-size: auto 500px;
    }
    
    /* Prevent layout shifts on images */
    img {
      max-width: 100%;
      height: auto;
      display: block;
    }
    
    /* Gradient backgrounds - preserve original colors */
    .bg-gradient-to-br.from-indigo-900.via-primary.to-purple-800 {
      background-image: linear-gradient(to bottom right, #3730a3, var(--primary), #6b21a8);
    }
    
    /* Footer and banner gradients */
    .bg-gradient-to-br.from-gray-900.to-gray-800 {
      background-image: linear-gradient(to bottom right, #111827, #1f2937);
    }
    
    /* Tailwind-like utility classes for critical elements */
    .text-white { color: white; }
    .flex { display: flex; }
    .items-center { align-items: center; }
    .justify-center { justify-content: center; }
    .container { width: 100%; max-width: 1280px; margin-left: auto; margin-right: auto; }
    
    /* Anti-FOUC (Flash of Unstyled Content) */
    html { visibility: visible; }
  `;
  
  // Create style element for critical CSS
  const style = document.createElement('style');
  style.textContent = criticalCSS;
  style.setAttribute('data-critical', 'true');
  document.head.appendChild(style);
}

/**
 * Defer loading of non-critical CSS
 */
function deferNonCriticalCSS() {
  // Find all non-critical stylesheets
  document.querySelectorAll('link[rel="stylesheet"]:not([critical])').forEach(link => {
    if (link instanceof HTMLLinkElement) {
      // Convert to preload to avoid render blocking
      link.rel = 'preload';
      link.as = 'style';
      
      // Load after document is complete
      window.addEventListener('load', () => {
        link.rel = 'stylesheet';
      });
    }
  });
}

/**
 * Add CSS containment to optimize rendering
 * Modified to preserve colors while maintaining performance
 */
function addCSSContainment() {
  // Add containment to key sections for better rendering performance
  const containmentElements = {
    // Section selectors: containment type
    '.hero-section': 'layout style', // Changed from 'content' to preserve colors
    'header': 'layout',  // Changed to preserve colors
    'footer': 'layout', // Changed to preserve colors
    '.particle-container': 'strict',
    'section:not(.hero-section)': 'layout', // Changed to preserve colors
  };
  
  // Generate CSS text for containment
  let containmentCSS = '';
  
  Object.entries(containmentElements).forEach(([selector, containValue]) => {
    containmentCSS += `
      ${selector} {
        contain: ${containValue};
      }
    `;
  });
  
  // Create style element for containment CSS
  const style = document.createElement('style');
  style.textContent = containmentCSS;
  style.setAttribute('data-critical', 'true');
  document.head.appendChild(style);
}

export default CriticalCSSOptimizer;