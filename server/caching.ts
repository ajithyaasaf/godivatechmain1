import { Request, Response, NextFunction } from "express";

/**
 * Defines caching strategies for different types of content
 */
export const CACHE_STRATEGIES = {
  // Static assets (images, css, js) - cache for 1 week
  STATIC: {
    maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
    sMaxAge: 60 * 60 * 24 * 7, // 7 days in seconds
    staleWhileRevalidate: 60 * 60 * 24, // 1 day in seconds
    immutable: true,
  },
  // API responses - shorter cache, stale while revalidate pattern
  API: {
    maxAge: 60 * 5, // 5 minutes in seconds
    sMaxAge: 60 * 30, // 30 minutes in seconds
    staleWhileRevalidate: 60 * 60, // 1 hour in seconds
    immutable: false,
  },
  // HTML pages - very short cache with revalidation
  HTML: {
    maxAge: 0, // No browser cache
    sMaxAge: 60 * 10, // 10 minutes in CDN
    staleWhileRevalidate: 60 * 5, // 5 minutes
    immutable: false,
  },
  // No cache for dynamic content
  NO_CACHE: {
    noCache: true,
    noStore: true,
  }
};

/**
 * Generate Cache-Control header value based on provided options
 */
export const generateCacheControl = (options: {
  maxAge?: number;
  sMaxAge?: number;
  staleWhileRevalidate?: number;
  immutable?: boolean;
  noCache?: boolean;
  noStore?: boolean;
}) => {
  const directives: string[] = [];
  
  if (options.noCache) {
    directives.push('no-cache');
  }
  
  if (options.noStore) {
    directives.push('no-store');
  }
  
  if (options.maxAge !== undefined) {
    directives.push(`max-age=${options.maxAge}`);
  }
  
  if (options.sMaxAge !== undefined) {
    directives.push(`s-maxage=${options.sMaxAge}`);
  }
  
  if (options.staleWhileRevalidate !== undefined) {
    directives.push(`stale-while-revalidate=${options.staleWhileRevalidate}`);
  }
  
  if (options.immutable) {
    directives.push('immutable');
  }
  
  return directives.join(', ');
};

/**
 * Middleware to apply caching headers to static assets
 */
export const staticAssetCache = (req: Request, res: Response, next: NextFunction) => {
  const cacheControl = generateCacheControl(CACHE_STRATEGIES.STATIC);
  res.setHeader('Cache-Control', cacheControl);
  next();
};

/**
 * Middleware to apply caching headers to API responses
 */
export const apiCache = (req: Request, res: Response, next: NextFunction) => {
  // Skip caching for mutations
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    const noCacheControl = generateCacheControl(CACHE_STRATEGIES.NO_CACHE);
    res.setHeader('Cache-Control', noCacheControl);
    return next();
  }
  
  const cacheControl = generateCacheControl(CACHE_STRATEGIES.API);
  res.setHeader('Cache-Control', cacheControl);
  next();
};

/**
 * Middleware to apply caching headers to HTML responses
 */
export const htmlCache = (req: Request, res: Response, next: NextFunction) => {
  const cacheControl = generateCacheControl(CACHE_STRATEGIES.HTML);
  res.setHeader('Cache-Control', cacheControl);
  next();
};

/**
 * No caching middleware
 */
export const noCache = (req: Request, res: Response, next: NextFunction) => {
  const cacheControl = generateCacheControl(CACHE_STRATEGIES.NO_CACHE);
  res.setHeader('Cache-Control', cacheControl);
  next();
};