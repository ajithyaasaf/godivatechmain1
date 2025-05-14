/**
 * CSS Minification Utilities
 * 
 * This module provides tools to optimize CSS:
 * - Remove unused CSS
 * - Extract critical CSS
 * - Inline essential styles
 */

/**
 * CSS selector usage map to track which selectors are being used
 */
export interface SelectorUsageMap {
  [selector: string]: {
    used: boolean;
    count: number;
    lastUsed: number; // timestamp
  };
}

/**
 * Parse CSS text and extract selectors
 * @param cssText CSS content to parse
 * @returns Array of parsed selectors
 */
export function parseCssSelectors(cssText: string): string[] {
  const selectors: string[] = [];
  
  try {
    // Basic CSS parser (won't handle all edge cases)
    const rules = cssText.split('}');
    
    rules.forEach(rule => {
      const selectorBlock = rule.split('{')[0];
      if (!selectorBlock) return;
      
      // Split multiple selectors (e.g. h1, h2, h3)
      const individualSelectors = selectorBlock.split(',');
      
      individualSelectors.forEach(selector => {
        const trimmedSelector = selector.trim();
        if (trimmedSelector && !trimmedSelector.includes('@media') && !trimmedSelector.includes('@keyframes')) {
          selectors.push(trimmedSelector);
        }
      });
    });
  } catch (e) {
    console.error('Error parsing CSS selectors:', e);
  }
  
  return selectors;
}

/**
 * Check if a given CSS selector is used in the DOM
 * @param selector CSS selector to check
 * @returns Whether the selector is used
 */
export function isSelectorUsed(selector: string): boolean {
  if (typeof document === 'undefined') return true;
  
  try {
    // Skip problematic selectors
    if (
      selector.includes(':hover') ||
      selector.includes(':focus') ||
      selector.includes(':active') ||
      selector.includes('::before') ||
      selector.includes('::after') ||
      selector.includes('::-webkit')
    ) {
      return true;
    }
    
    // Check if any elements match this selector
    return document.querySelectorAll(selector).length > 0;
  } catch (e) {
    // If the selector is invalid or causes errors, consider it used
    // to avoid removing potentially important styles
    return true;
  }
}

/**
 * Extract critical CSS by analyzing what's in the current viewport
 * @param options Configuration options
 * @returns Critical CSS as string
 */
export function extractCriticalCss(options: {
  excludeSelectors?: string[];
  includeSelectors?: string[];
  rootElement?: HTMLElement;
} = {}): string {
  if (typeof document === 'undefined') return '';
  
  const {
    excludeSelectors = [],
    includeSelectors = [],
    rootElement = document.body
  } = options;
  
  try {
    const criticalRules: string[] = [];
    const styleSheets = Array.from(document.styleSheets);
    
    // Get all visible elements in the viewport
    const visibleElements = getVisibleElements(rootElement);
    
    // Process each stylesheet
    styleSheets.forEach(sheet => {
      try {
        const rules = Array.from(sheet.cssRules || sheet.rules || []);
        
        rules.forEach(rule => {
          // Handle simple CSS rules
          if (rule instanceof CSSStyleRule) {
            const selector = rule.selectorText;
            
            // Skip excluded selectors
            if (excludeSelectors.some(excl => selector.includes(excl))) {
              return;
            }
            
            // Always include specific selectors
            if (includeSelectors.some(incl => selector.includes(incl))) {
              criticalRules.push(rule.cssText);
              return;
            }
            
            // Check if this selector applies to any visible element
            let isUsed = false;
            for (const element of visibleElements) {
              try {
                if (element.matches(selector)) {
                  isUsed = true;
                  break;
                }
              } catch (e) {
                // Skip invalid selectors
              }
            }
            
            if (isUsed) {
              criticalRules.push(rule.cssText);
            }
          } 
          // Handle @media rules
          else if (rule instanceof CSSMediaRule) {
            // Always include media rules for small screens (mobile)
            if (
              rule.conditionText.includes('max-width') || 
              rule.media.mediaText.includes('max-width')
            ) {
              criticalRules.push(rule.cssText);
            }
          }
          // Always include @keyframes and @font-face
          else if (
            rule instanceof CSSKeyframesRule ||
            (rule as any).type === CSSRule.FONT_FACE_RULE
          ) {
            criticalRules.push(rule.cssText);
          }
        });
      } catch (e) {
        // Skip CORS-restricted stylesheets
      }
    });
    
    return criticalRules.join('\n');
  } catch (e) {
    console.error('Error extracting critical CSS:', e);
    return '';
  }
}

/**
 * Get all elements that are currently visible in the viewport
 * @param rootElement Element to start searching from
 * @returns Array of visible elements
 */
function getVisibleElements(rootElement: HTMLElement): HTMLElement[] {
  const visibleElements: HTMLElement[] = [];
  const rootRect = rootElement.getBoundingClientRect();
  
  // If root is not visible, return empty array
  if (
    rootRect.width === 0 ||
    rootRect.height === 0 ||
    rootRect.bottom < 0 ||
    rootRect.top > window.innerHeight
  ) {
    return [];
  }
  
  // Helper function to check if element is visible
  const isVisible = (element: HTMLElement): boolean => {
    // Skip non-rendered elements
    const computedStyle = window.getComputedStyle(element);
    if (
      computedStyle.display === 'none' ||
      computedStyle.visibility === 'hidden' ||
      computedStyle.opacity === '0'
    ) {
      return false;
    }
    
    // Check if in viewport
    const rect = element.getBoundingClientRect();
    return !(
      rect.width === 0 ||
      rect.height === 0 ||
      rect.bottom < 0 ||
      rect.top > window.innerHeight
    );
  };
  
  // Recursive function to process elements
  const processElement = (element: HTMLElement) => {
    if (isVisible(element)) {
      visibleElements.push(element);
      
      // Process children
      Array.from(element.children).forEach(child => {
        if (child instanceof HTMLElement) {
          processElement(child);
        }
      });
    }
  };
  
  processElement(rootElement);
  return visibleElements;
}

/**
 * Create an inline <style> element with critical CSS
 * @param css CSS content to inline
 * @param id Optional ID for the style element
 */
export function injectCriticalCss(css: string, id = 'critical-css'): void {
  if (typeof document === 'undefined' || !css) return;
  
  // Check if element already exists
  let styleElement = document.getElementById(id) as HTMLStyleElement;
  
  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.id = id;
    document.head.appendChild(styleElement);
  }
  
  styleElement.textContent = css;
}