import { Request, Response, NextFunction } from 'express';

/**
 * A middleware to ensure every page has proper SEO tags
 * This will add or update canonical URLs, meta descriptions, and other SEO elements
 * for production-ready SEO implementation
 */
export function seoMiddleware(req: Request, res: Response, next: NextFunction) {
  // Store the original send method
  const originalSend = res.send;
  
  // Override the send method
  res.send = function(body: any) {
    // Only process HTML responses
    if (typeof body === 'string' && body.includes('<!DOCTYPE html>') && !req.path.startsWith('/api')) {
      try {
        // Get the current URL path
        const url = req.originalUrl || req.url;
        const baseUrl = process.env.BASE_URL || 'https://godivatech.com';
        const canonicalUrl = `${baseUrl}${url === '/' ? '' : url}`;
        
        // Check if canonical link already exists
        if (!body.includes('<link rel="canonical"')) {
          // Add canonical URL tag
          body = body.replace('</head>', `  <link rel="canonical" href="${canonicalUrl}">\n</head>`);
        } else {
          // Update existing canonical URL tag
          body = body.replace(
            /<link rel="canonical" href=".*?">/g,
            `<link rel="canonical" href="${canonicalUrl}">`
          );
        }
        
        // Add basic meta tags if they don't exist
        if (!body.includes('<meta name="description"')) {
          const defaultDescription = "GodivaTech provides web development, digital marketing, and app development services in Madurai. We create high-performance websites and apps for businesses in Tamil Nadu.";
          body = body.replace('</head>', `  <meta name="description" content="${defaultDescription}">\n</head>`);
        }
        
        // Add robots meta tag if not present
        if (!body.includes('<meta name="robots"')) {
          body = body.replace('</head>', `  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">\n</head>`);
        }
        
        // Add charset and viewport meta tags if not present
        if (!body.includes('<meta charset="')) {
          body = body.replace('<head>', '<head>\n  <meta charset="UTF-8">');
        }
        
        if (!body.includes('<meta name="viewport"')) {
          body = body.replace('</head>', `  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n</head>`);
        }
      } catch (error) {
        console.error('Error in SEO middleware:', error);
        // Continue with the original HTML if there's an error
      }
    }
    
    // Call the original send method
    return originalSend.call(this, body);
  };
  
  next();
}