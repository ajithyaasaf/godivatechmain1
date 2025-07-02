/**
 * Resource Preloading Utilities
 * 
 * This file provides utilities for preloading critical resources
 * like images, fonts, and scripts to improve perceived performance.
 */

/**
 * Preload an image by creating a hidden Image object
 * @param src Image URL to preload
 * @returns A promise that resolves when the image is loaded
 */
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!src) {
      resolve();
      return;
    }
    
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to preload image: ${src}`));
    img.src = src;
  });
};

/**
 * Preload multiple images in parallel
 * @param srcs Array of image URLs to preload
 * @returns A promise that resolves when all images are loaded
 */
export const preloadImages = (srcs: string[]): Promise<void[]> => {
  return Promise.all(srcs.map(src => preloadImage(src)));
};

/**
 * Preload a font by injecting a stylesheet
 * @param fontFamily Font family name
 * @param fontUrl URL to the font file
 * @param fontWeight Font weight
 * @param fontStyle Font style
 */
export const preloadFont = (
  fontFamily: string,
  fontUrl: string,
  fontWeight = 'normal',
  fontStyle = 'normal'
): void => {
  // Create a new stylesheet
  const style = document.createElement('style');
  style.type = 'text/css';
  style.appendChild(
    document.createTextNode(`
      @font-face {
        font-family: ${fontFamily};
        font-weight: ${fontWeight};
        font-style: ${fontStyle};
        src: url('${fontUrl}') format('woff2');
        font-display: swap;
      }
    `)
  );
  document.head.appendChild(style);
  
  // Create a <link rel="preload"> tag
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = fontUrl;
  link.as = 'font';
  link.type = 'font/woff2';
  link.crossOrigin = 'anonymous';
  document.head.appendChild(link);
};

/**
 * Add a preconnect hint for external domains
 * @param domain Domain to preconnect to
 * @param crossOrigin Whether to use crossorigin attribute
 */
export const preconnect = (domain: string, crossOrigin = true): void => {
  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = domain;
  if (crossOrigin) {
    link.crossOrigin = 'anonymous';
  }
  document.head.appendChild(link);
};

/**
 * Add a DNS prefetch hint for external domains
 * @param domain Domain to prefetch DNS for
 */
export const dnsPrefetch = (domain: string): void => {
  const link = document.createElement('link');
  link.rel = 'dns-prefetch';
  link.href = domain;
  document.head.appendChild(link);
};

/**
 * Preload a script
 * @param src Script URL
 * @param async Whether to load asynchronously
 * @param defer Whether to defer loading
 */
export const preloadScript = (src: string, async = true, defer = true): void => {
  const script = document.createElement('script');
  script.src = src;
  if (async) script.async = true;
  if (defer) script.defer = true;
  document.head.appendChild(script);
};