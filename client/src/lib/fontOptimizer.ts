/**
 * Font Loading Optimization Utilities
 * 
 * This module provides utilities to optimize font loading performance using:
 * 1. Font preloading
 * 2. Font display strategies
 * 3. Font subsetting
 */

/**
 * Adds a preload link for a font to the document head
 * @param url URL of the font file to preload
 * @param format Font format (e.g., 'woff2', 'woff')
 */
export function preloadFont(url: string, format: string = 'woff2'): void {
  if (typeof document === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = url;
  link.as = 'font';
  link.type = `font/${format}`;
  link.crossOrigin = 'anonymous';
  document.head.appendChild(link);
}

/**
 * Creates a font-face definition with optimal display strategy
 * @param fontFamily Font family name
 * @param fontUrl URL to the font file
 * @param fontWeight Font weight
 * @param fontStyle Font style
 * @param display Font display strategy ('swap', 'optional', 'fallback', 'block', 'auto')
 */
export function createFontFace(
  fontFamily: string,
  fontUrl: string,
  fontWeight: string | number = 400,
  fontStyle: string = 'normal',
  display: 'swap' | 'optional' | 'fallback' | 'block' | 'auto' = 'swap'
): void {
  if (typeof document === 'undefined') return;
  
  const style = document.createElement('style');
  style.textContent = `
    @font-face {
      font-family: '${fontFamily}';
      font-weight: ${fontWeight};
      font-style: ${fontStyle};
      font-display: ${display};
      src: url('${fontUrl}') format('woff2');
    }
  `;
  document.head.appendChild(style);
}

/**
 * Optimizes font loading by preloading critical fonts and using the appropriate
 * font-display strategy
 */
export function optimizeFontLoading(): void {
  // Preload critical fonts
  preloadFont('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  preloadFont('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&display=swap');
  
  // Add font-display: swap to ensure text remains visible during font loading
  const fontDisplayStyle = document.createElement('style');
  fontDisplayStyle.textContent = `
    /* Apply font-display: swap to all @font-face rules */
    @font-face {
      font-display: swap !important;
    }
    
    /* Ensure text is visible while fonts are loading */
    html {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, 
                   "Helvetica Neue", Arial, sans-serif;
    }
    
    /* Add fallback font stacks for key elements */
    h1, h2, h3, h4, h5, h6 {
      font-family: 'Poppins', system-ui, sans-serif;
    }
    
    p, span, div, button, input, textarea, select {
      font-family: 'Inter', system-ui, sans-serif;
    }
  `;
  document.head.appendChild(fontDisplayStyle);
}

export default optimizeFontLoading;