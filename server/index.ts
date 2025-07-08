// Environment variables are loaded automatically by the runtime

import express, { type Request, Response, NextFunction } from "express";
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { ssrMiddleware } from "./ssr-middleware";
import { ssrProduction } from "./ssr-production";
import { staticAssetCache, apiCache, htmlCache, noCache } from "./caching";
import { seoMiddleware } from "./seo-middleware";

const app = express();

// Configure CORS for cross-origin requests
let allowedOrigins;

if (process.env.NODE_ENV === 'production') {
  if (process.env.ALLOWED_ORIGINS) {
    // Parse comma-separated list of allowed origins
    allowedOrigins = process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim());
    console.log('Allowed origins from env:', allowedOrigins);
  } else {
    // Default production origins if not specified
    allowedOrigins = [
      'https://www.godivatech.com',    // Production domain
      'https://godivatech.com',        // Production domain without www
    ];
  }
} else {
  // In development, allow all origins
  allowedOrigins = '*';
}

// Standard CORS middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Add a custom middleware to ensure CORS headers are always present
// This handles cases where the main CORS middleware might not apply
app.use((req, res, next) => {
  // For preflight requests
  if (req.method === 'OPTIONS') {
    // Set CORS headers for preflight requests
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    // Handle preflight request
    res.status(204).end();
    return;
  }
  
  // Set CORS headers for all other requests
  // This ensures headers are set even if the cors middleware doesn't catch it
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  next();
});

// Comprehensive Security Headers Middleware
app.use((req, res, next) => {
  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://godivatech-backend.onrender.com https://firestore.googleapis.com https://www.google-analytics.com",
    "frame-src 'self' https://www.google.com",
    "object-src 'none'",
    "base-uri 'self'"
  ].join('; ');

  res.header('Content-Security-Policy', csp);
  res.header('X-Frame-Options', 'DENY');
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.header('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.header('X-XSS-Protection', '1; mode=block');
  res.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  
  next();
});

// Apply appropriate caching strategies based on request path
app.use((req, res, next) => {
  const path = req.path;
  
  // API routes should use our API caching strategy
  if (path.startsWith('/api/')) {
    apiCache(req, res, next);
  }
  // Static files should use longer caching
  else if (path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|map|webp)$/)) {
    staticAssetCache(req, res, next);
  }
  // HTML routes should use HTML caching with short duration
  else {
    htmlCache(req, res, next);
  }
});

// Increase JSON body limit to 10MB for image uploads
app.use(express.json({ limit: '10mb' })); 
// Increase URL-encoded body limit to 10MB
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// Apply SEO middleware to ensure all pages have canonical URLs and proper meta tags
app.use(seoMiddleware);

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // Use appropriate SSR approach based on environment
  // In production, we use a robust metadata-focused approach
  // In development, we add crawler-friendly version with internal links
  if (process.env.DISABLE_SSR !== 'true') {
    if (process.env.NODE_ENV === 'production') {
      // Use production-optimized SSR with SEO enhancements
      app.get(/^\/(?!api).*/, ssrProduction);
      log('Production SSR middleware enabled');
    } else {
      // Add crawler detection middleware for development mode
      app.use((req, res, next) => {
        const userAgent = req.headers['user-agent'] || '';
        const isCrawler = /bot|crawler|spider|lighthouse|googlebot|bingbot|yandex|duckduck/i.test(userAgent);
        
        if (isCrawler && !req.path.startsWith('/api') && !req.path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|map)$/)) {
          // If it's a crawler request, serve our optimized SEO HTML
          try {
            // Read the SEO-optimized HTML file
            const seoHtmlPath = path.resolve(process.cwd(), 'client', 'public', 'seo.html');
            
            if (fs.existsSync(seoHtmlPath)) {
              // Read the optimized SEO HTML
              let seoHtml = fs.readFileSync(seoHtmlPath, 'utf-8');
              
              // Customize the SEO HTML for the current path
              let pageTitle = 'GodivaTech - Web Development & Digital Marketing Services in Madurai';
              let pageDescription = "GodivaTech offers quality web development, digital marketing, and app services in Madurai at competitive prices. Get custom solutions for your business.";
              let canonicalUrl = `https://godivatech.com${req.path === '/' ? '' : req.path}`;
              
              // Set specific titles and descriptions based on routes
              if (req.path.startsWith('/services')) {
                pageTitle = 'Our Services - Web, App & Digital Marketing Solutions | GodivaTech Madurai';
                pageDescription = 'Explore our comprehensive range of professional web development, mobile app, and digital marketing services in Madurai, Tamil Nadu. Affordable solutions for businesses.';
              } else if (req.path.startsWith('/portfolio')) {
                pageTitle = 'Our Portfolio - Successful Web & App Projects | GodivaTech Madurai';
                pageDescription = 'View our portfolio of successful web development, app development, and digital marketing projects. See how we have helped businesses in Madurai achieve digital excellence.';
              } else if (req.path.startsWith('/about')) {
                pageTitle = 'About GodivaTech - Leading Web Development Company in Madurai';
                pageDescription = 'Learn about GodivaTech, a leading web development and digital marketing company in Madurai. Know our mission, vision, and the expert team behind our quality services.';
              } else if (req.path.startsWith('/blog')) {
                pageTitle = 'Blog - Latest Web Development & Digital Marketing Insights | GodivaTech';
                pageDescription = 'Read our blog for the latest insights, tips, and trends in web development, digital marketing, and technology. Expert advice from Madurai tech companies.';
              } else if (req.path.startsWith('/contact')) {
                pageTitle = 'Contact Us - Get Web Development & Digital Marketing Services | GodivaTech';
                pageDescription = 'Contact GodivaTech for professional web development, digital marketing, and app development services in Madurai. Get a free consultation for your business needs.';
              }
              
              // Update the HTML with page-specific metadata
              seoHtml = seoHtml.replace(/<title>.*?<\/title>/, `<title>${pageTitle}</title>`);
              seoHtml = seoHtml.replace(/<meta name="description" content=".*?">/, `<meta name="description" content="${pageDescription}">`);
              seoHtml = seoHtml.replace(/<link rel="canonical" href=".*?">/, `<link rel="canonical" href="${canonicalUrl}">`);
              
              // Update OG tags
              seoHtml = seoHtml.replace(/<meta property="og:title" content=".*?">/, `<meta property="og:title" content="${pageTitle}">`);
              seoHtml = seoHtml.replace(/<meta property="og:description" content=".*?">/, `<meta property="og:description" content="${pageDescription}">`);
              seoHtml = seoHtml.replace(/<meta property="og:url" content=".*?">/, `<meta property="og:url" content="${canonicalUrl}">`);
              
              // Update Twitter tags
              seoHtml = seoHtml.replace(/<meta name="twitter:title" content=".*?">/, `<meta name="twitter:title" content="${pageTitle}">`);
              seoHtml = seoHtml.replace(/<meta name="twitter:description" content=".*?">/, `<meta name="twitter:description" content="${pageDescription}">`);
              seoHtml = seoHtml.replace(/<meta name="twitter:url" content=".*?">/, `<meta name="twitter:url" content="${canonicalUrl}">`);
              
              // Update breadcrumb JSON-LD
              const breadcrumbJsonLd = {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": "https://godivatech.com/"
                  }
                ]
              };
              
              // Add path segments to breadcrumb
              if (req.path !== '/') {
                const pathSegments = req.path.split('/').filter(Boolean);
                
                pathSegments.forEach((segment, index) => {
                  const humanReadableName = segment
                    .split('-')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
                    
                  breadcrumbJsonLd.itemListElement.push({
                    "@type": "ListItem",
                    "position": index + 2,
                    "name": humanReadableName,
                    "item": `https://godivatech.com/${pathSegments.slice(0, index + 1).join('/')}`
                  });
                });
              }
              
              // Update breadcrumb JSON-LD in the HTML
              const breadcrumbRegex = new RegExp('<script type="application\\/ld\\+json">\\s*\\{\\s*"@context": "https:\\/\\/schema\\.org",\\s*"@type": "BreadcrumbList",[^<]*<\\/script>', 'g');
              seoHtml = seoHtml.replace(
                breadcrumbRegex,
                `<script type="application/ld+json">\n${JSON.stringify(breadcrumbJsonLd, null, 2)}\n</script>`
              );
              
              // Update the H1 tag to match the page title
              seoHtml = seoHtml.replace(/<h1>.*?<\/h1>/, `<h1>${pageTitle}</h1>`);
              
              log(`Serving SEO-optimized HTML for crawler on path: ${req.path}`);
              
              res.setHeader('Content-Type', 'text/html');
              res.send(seoHtml);
              return;
            }
          } catch (error) {
            console.error('Error serving SEO HTML:', error);
            // Fall back to default crawler HTML if there's an error
          }
          
          // Fall back to a simple crawler HTML if the SEO file doesn't exist
          const navLinksHtml = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>GodivaTech - Web Development & Digital Marketing Services</title>
              <meta name="description" content="GodivaTech offers quality web development, digital marketing, and app services in Madurai at competitive prices. Get custom solutions for your business.">
              <link rel="canonical" href="https://godivatech.com${req.path === '/' ? '' : req.path}">
              <meta property="og:type" content="website">
              <meta property="og:title" content="Web Development & Digital Marketing Services | GodivaTech Madurai">
              <meta property="og:description" content="GodivaTech offers quality web development, digital marketing, and app services in Madurai at competitive prices. Get custom solutions for your business.">
              <meta property="og:url" content="https://godivatech.com${req.path === '/' ? '' : req.path}">
              <meta property="og:site_name" content="GodivaTech">
              <meta name="robots" content="index, follow, max-image-preview:large">
            </head>
            <body>
              <h1>GodivaTech - Web Development & Digital Marketing Services</h1>
              
              <nav aria-label="Main Navigation">
                <ul>
                  <li><a href="/">Home</a></li>
                  <li><a href="/services">Services</a></li>
                  <li><a href="/portfolio">Portfolio</a></li>
                  <li><a href="/about">About</a></li>
                  <li><a href="/blog">Blog</a></li>
                  <li><a href="/contact">Contact</a></li>
                </ul>
              </nav>
              
              <section>
                <h2>Our Services</h2>
                <ul>
                  <li><a href="/services/web-development">Web Development</a></li>
                  <li><a href="/services/digital-marketing">Digital Marketing</a></li>
                  <li><a href="/services/app-development">Mobile App Development</a></li>
                  <li><a href="/services/poster-design">Poster Design</a></li>
                  <li><a href="/services/ui-ux-design">UI/UX Design</a></li>
                  <li><a href="/services/logo-brand-design">Logo & Brand Design</a></li>
                </ul>
              </section>
              
              <div>
                <p>This is a crawler-friendly snapshot of the GodivaTech website.</p>
                <p>Please visit our website with a browser to see the full interactive experience.</p>
              </div>
              
              <script type="application/ld+json">
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "GodivaTech",
                "url": "https://godivatech.com",
                "logo": "https://godivatech.com/logo.png",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": "Madurai",
                  "addressRegion": "Tamil Nadu",
                  "postalCode": "625020",
                  "addressCountry": "India"
                }
              }
              </script>
            </body>
            </html>
          `;
          
          res.setHeader('Content-Type', 'text/html');
          res.send(navLinksHtml);
          return;
        }
        
        next();
      });
      
      log('Crawler-friendly version enabled in development mode');
    }
  }
  
  // Fallback route handler for all non-api routes to support client-side SPA routing
  app.get(/^\/(?!api).*/, (req, res, next) => {
    // Skip API routes - they're handled above
    if (req.path.startsWith('/api')) {
      return next();
    }
    
    // For assets and other static files, continue to the next middleware
    if (req.path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|map)$/)) {
      return next();
    }
    
    // For all other routes, we need to serve the index.html for client-side routing
    next();
  });
  
  // Add a 404 handler for API routes
  app.use('/api/*', (req, res) => {
    res.status(404).json({
      status: 404,
      message: 'API endpoint not found',
      path: req.originalUrl
    });
  });

  // Serve robots.txt directly
  app.get('/robots.txt', (req, res) => {
    res.sendFile('robots.txt', { root: './public', maxAge: 86400000 }); // 1-day cache
  });
  
  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
