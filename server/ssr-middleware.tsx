import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { log } from './vite';

/**
 * Server-Side Rendering middleware
 * This middleware intercepts requests for pages and hydrates them with
 * server-fetched data for SEO improvement.
 */
export async function ssrMiddleware(req: Request, res: Response, next: NextFunction) {
  // Skip API routes, static assets, and when SSR is disabled
  const url = req.originalUrl;
  
  // Only process top-level routes for SSR
  const isMainRoute = /^\/(\w+)?$/.test(url) || url === '/' || 
                      /^\/blog\/[\w-]+$/.test(url) || 
                      /^\/services\/[\w-]+$/.test(url);
                      
  if (!isMainRoute || 
      url.startsWith('/api') || 
      url.startsWith('/src') || 
      url.startsWith('/node_modules') ||
      url.startsWith('/@') ||
      url.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|map|json|xml)$/) ||
      req.query.ssr === 'false' || 
      req.headers['x-disable-ssr']) {
    return next();
  }
  
  try {
    // Get the base HTML template
    const indexPath = path.resolve(process.cwd(), 'client', 'index.html');
    
    // Check if file exists (for production builds it might be in a different location)
    if (!fs.existsSync(indexPath)) {
      // If not found, try the production build location
      return next();
    }
    
    // To avoid issues with module imports, we'll use a simpler approach
    // Instead of trying to render the full app server-side, we'll just
    // prefetch data and provide it to the client for hydration

    // Dynamic import to avoid issues with top-level imports
    const { firestoreStorage } = await import('./firestore-storage');
    
    // Prefetch data based on the URL path
    let prefetchedData: any[] = [];
    
    try {
      if (url === '/' || url === '/home') {
        // For the homepage, prefetch common data
        const [services, projects, testimonials, blogPosts] = await Promise.all([
          firestoreStorage.getAllServices(),
          firestoreStorage.getAllProjects(),
          firestoreStorage.getAllTestimonials(),
          firestoreStorage.getAllBlogPosts()
        ]);
        
        prefetchedData = [
          { queryKey: ['services'], data: services },
          { queryKey: ['projects'], data: projects },
          { queryKey: ['testimonials'], data: testimonials },
          { queryKey: ['blog-posts'], data: blogPosts }
        ];
      } 
      else if (url.startsWith('/blog')) {
        // For blog pages
        const [blogPosts, categories] = await Promise.all([
          firestoreStorage.getAllBlogPosts(),
          firestoreStorage.getAllCategories()
        ]);
        
        prefetchedData = [
          { queryKey: ['blog-posts'], data: blogPosts },
          { queryKey: ['categories'], data: categories }
        ];
        
        // If we're on a specific blog post
        const slug = url.split('/').pop();
        if (slug && slug !== 'blog') {
          const post = await firestoreStorage.getBlogPostBySlug(slug);
          if (post) {
            prefetchedData.push({ queryKey: ['blog-post', slug], data: post });
          }
        }
      }
      // Add more route-specific data prefetching here
    } catch (prefetchError: any) {
      const errorMessage = prefetchError?.message || 'Unknown error';
      log(`Error prefetching data for SSR: ${errorMessage}`, 'ssr-error');
      // Continue with empty prefetched data
    }
    
    let html = fs.readFileSync(indexPath, 'utf-8');
    
    // Inject the prefetched data into the HTML
    if (prefetchedData.length > 0) {
      const headEndMarker = '</head>';
      const dataScript = `<script>
        window.__INITIAL_DATA__ = ${JSON.stringify(prefetchedData)};
      </script>`;
      
      html = html.replace(headEndMarker, `${dataScript}\n${headEndMarker}`);
    }
    
    // Add canonical URL tag for SEO - ensures every page has a canonical tag
    const canonicalUrl = `https://godivatech.com${url === '/' ? '' : url}`;
    const canonicalTag = `<link rel="canonical" href="${canonicalUrl}" />`;
    
    // Check if canonical tag exists and add it if not
    if (!html.includes('<link rel="canonical"')) {
      html = html.replace('</head>', `${canonicalTag}\n</head>`);
    }
    
    log(`SSR data prefetched for ${url}`, 'ssr');
    
    // Set appropriate headers and send the HTML
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (error: any) {
    const errorMessage = error?.message || 'Unknown error';
    log(`SSR middleware error: ${errorMessage}`, 'ssr-error');
    // If SSR fails, continue to the next middleware (client-side rendering)
    next();
  }
}