/**
 * Canonical URL utilities for SEO optimization
 * Prevents duplicate content issues by designating the preferred URL version
 */

// Base URL for the website
const baseUrl = 'https://godivatech.com';

/**
 * Generate the canonical URL for a given path
 * @param path The URL path (without domain)
 * @returns The full canonical URL
 */
export const getCanonicalUrl = (path: string): string => {
  // Remove trailing slashes for consistency
  const normalizedPath = path.endsWith('/') && path !== '/' 
    ? path.slice(0, -1) 
    : path;
    
  // Format the full URL
  return `${baseUrl}${normalizedPath}`;
};

/**
 * Generate alternate URLs for a page (e.g., mobile, AMP, different languages)
 * @param path The base URL path
 * @returns Object containing alternate URLs
 */
export const getAlternateUrls = (path: string): Record<string, string> => {
  const canonicalUrl = getCanonicalUrl(path);
  
  return {
    // AMP version for mobile devices
    amp: `${canonicalUrl}?amp=1`,
    
    // Language variants - Tamil version is localized
    'ta-IN': `${canonicalUrl}?lang=ta`,
    
    // Mobile version might be the same, using responsive design
    mobile: canonicalUrl,
  };
};

/**
 * Check if the current URL is the canonical one
 * Useful for redirecting from non-canonical to canonical URLs
 * @param currentUrl The current URL (from browser)
 * @param path The expected canonical path
 * @returns Boolean indicating if current URL is canonical
 */
export const isCanonicalUrl = (currentUrl: string, path: string): boolean => {
  const canonical = getCanonicalUrl(path);
  
  // Remove protocol and domain for comparison
  const normalizeUrl = (url: string): string => {
    return url
      .replace(/^https?:\/\/[^/]+/i, '') // Remove protocol and domain
      .replace(/\/$/, '') // Remove trailing slash
      .replace(/\?$/, ''); // Remove empty query string
  };
  
  return normalizeUrl(currentUrl) === normalizeUrl(canonical);
};

/**
 * Generate canonical URLs for location-specific pages (neighborhood targeting)
 * @param path The base URL path
 * @param location The location info: city and neighborhood
 * @returns The canonical URL for the specific location
 */
export const getLocationCanonicalUrl = (
  path: string, 
  location: { city: string; neighborhood?: string }
): string => {
  // Format the location path segment
  const locationPath = location.neighborhood 
    ? `/${location.city.toLowerCase()}/${location.neighborhood}`
    : `/${location.city.toLowerCase()}`;
    
  return getCanonicalUrl(`${path}${locationPath}`);
};

/**
 * Generate hreflang tags for internationalization
 * @param path The current URL path
 * @returns Array of hreflang objects with language code and URL
 */
export const getHreflangUrls = (path: string): Array<{lang: string, url: string}> => {
  const canonicalUrl = getCanonicalUrl(path);
  
  return [
    { lang: 'en-IN', url: canonicalUrl },
    { lang: 'ta-IN', url: `${canonicalUrl}?lang=ta` },
    { lang: 'x-default', url: canonicalUrl }
  ];
};