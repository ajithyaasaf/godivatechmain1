/**
 * Style Optimization Utilities
 * 
 * This module provides tools to optimize CSS loading and rendering:
 * - Lazy loading of non-critical styles
 * - CSS prioritization
 * - Unused CSS removal
 */

/**
 * Extract critical CSS for above-the-fold content
 * This function extracts only the CSS needed for initial rendering
 */
export function extractCriticalCSS(): string {
  if (typeof document === 'undefined') return '';
  
  try {
    const criticalStyles: string[] = [];
    const visibleElements = document.querySelectorAll('[data-critical="true"]');
    
    // Find all visible components and extract their styles
    const styleSheets = Array.from(document.styleSheets);
    
    styleSheets.forEach(sheet => {
      try {
        const rules = Array.from(sheet.cssRules);
        
        rules.forEach(rule => {
          // Check if rule applies to any visible element
          if (rule instanceof CSSStyleRule) {
            visibleElements.forEach(element => {
              if (element.matches(rule.selectorText)) {
                criticalStyles.push(rule.cssText);
              }
            });
          }
        });
      } catch (e) {
        // Catch CORS errors from external stylesheets
        console.warn('Cannot access rules in stylesheet', e);
      }
    });
    
    return criticalStyles.join('\n');
  } catch (e) {
    console.error('Error extracting critical CSS:', e);
    return '';
  }
}

/**
 * Inject critical CSS directly into the head
 * @param styles CSS string to inject
 */
export function injectCriticalCSS(styles: string): void {
  if (!styles || typeof document === 'undefined') return;
  
  const styleElement = document.createElement('style');
  styleElement.setAttribute('data-critical', 'true');
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}

/**
 * Lazy load a CSS file
 * @param href URL of the CSS file
 * @param priority Loading priority (high, low, auto)
 */
export function loadCSS(href: string, priority: 'high' | 'low' | 'auto' = 'auto'): Promise<void> {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    // @ts-ignore - fetchpriority is valid but not in all TS types
    link.fetchpriority = priority;
    
    link.onload = () => resolve();
    link.onerror = () => reject(new Error(`Failed to load CSS: ${href}`));
    
    document.head.appendChild(link);
  });
}

/**
 * Load CSS after initial page render
 * @param href URL of the CSS file
 */
export function deferCSS(href: string): void {
  if (typeof window === 'undefined') return;
  
  // Use requestIdleCallback or setTimeout as fallback
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(() => {
      loadCSS(href, 'low');
    });
  } else {
    setTimeout(() => {
      loadCSS(href, 'low');
    }, 200);
  }
}

/**
 * Detect and log unused CSS selectors
 * Helpful during development to identify unused styles
 */
export function detectUnusedCSS(): void {
  if (typeof document === 'undefined' || import.meta.env.MODE !== 'development') return;
  
  const unusedSelectors: string[] = [];
  
  try {
    const styleSheets = Array.from(document.styleSheets);
    
    styleSheets.forEach(sheet => {
      try {
        const rules = Array.from(sheet.cssRules);
        
        rules.forEach(rule => {
          if (rule instanceof CSSStyleRule) {
            const selector = rule.selectorText;
            
            // Skip pseudo-classes and complex selectors
            if (
              selector.includes(':hover') || 
              selector.includes(':focus') || 
              selector.includes(':active') ||
              selector.includes('::before') ||
              selector.includes('::after') ||
              selector.includes('>') ||
              selector.includes('+')
            ) {
              return;
            }
            
            try {
              // Check if selector matches any element
              const elements = document.querySelectorAll(selector);
              if (elements.length === 0) {
                unusedSelectors.push(selector);
              }
            } catch (e) {
              // Ignore invalid selectors
            }
          }
        });
      } catch (e) {
        // Catch CORS errors
      }
    });
    
    if (unusedSelectors.length > 0) {
      console.warn('Detected potentially unused CSS selectors:', unusedSelectors);
    }
  } catch (e) {
    console.error('Error detecting unused CSS:', e);
  }
}