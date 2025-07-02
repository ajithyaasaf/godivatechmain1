/**
 * Helper functions for canonical URLs and SEO
 */

/**
 * Format a path into a canonical URL
 * Ensures the URL is absolute with proper domain
 * 
 * @param path The relative path or absolute URL
 * @returns Properly formatted canonical URL
 */
export function formatCanonicalUrl(path: string): string {
  const domain = 'https://godivatech.com';
  
  // If already absolute URL, return as is
  if (path.startsWith('http')) {
    return path;
  }
  
  // Ensure path starts with /
  const formattedPath = path.startsWith('/') ? path : `/${path}`;
  
  // For homepage, return domain without trailing slash
  if (formattedPath === '/') {
    return domain;
  }
  
  // Return domain + path
  return `${domain}${formattedPath}`;
}

/**
 * Get canonical URL for current page
 * Uses window.location in browser, falls back to path parameter on server
 * 
 * @param fallbackPath Fallback path to use when window is not available
 * @returns Canonical URL for current page
 */
export function getCurrentCanonicalUrl(fallbackPath: string = '/'): string {
  if (typeof window !== 'undefined') {
    // In browser context
    return formatCanonicalUrl(window.location.pathname);
  }
  
  // In server context
  return formatCanonicalUrl(fallbackPath);
}

/**
 * Get current page URL with query parameters
 * Useful for share links and OpenGraph URLs
 * 
 * @returns Full URL including query parameters
 */
export function getCurrentPageUrl(): string {
  if (typeof window !== 'undefined') {
    return window.location.href;
  }
  
  return formatCanonicalUrl('/');
}