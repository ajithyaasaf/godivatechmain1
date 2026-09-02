import { createApp } from "./app";
import { setupVite, serveStatic, log } from "./vite";
import { ssrProduction } from "./ssr-production";
import { createServer } from "http";
import path from "path";
import fs from "fs";

(async () => {
  const app = await createApp();
  const server = createServer(app);

  // Use appropriate SSR approach based on environment
  if (process.env.DISABLE_SSR !== 'true') {
    if (process.env.NODE_ENV === 'production') {
      app.get(/^\/(?!api).*/, ssrProduction);
      log('Production SSR middleware enabled');
    } else {
      // Add crawler detection middleware for development mode
      app.use((req, res, next) => {
        const userAgent = req.headers['user-agent'] || '';
        const isCrawler = /bot|crawler|spider|lighthouse|googlebot|bingbot|yandex|duckduck/i.test(userAgent);

        if (isCrawler && !req.path.startsWith('/api') && !req.path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|map)$/)) {
          try {
            const seoHtmlPath = path.resolve(process.cwd(), 'client', 'public', 'seo.html');
            if (fs.existsSync(seoHtmlPath)) {
              let seoHtml = fs.readFileSync(seoHtmlPath, 'utf-8');
              let pageTitle = 'GodivaTech - Web Development & Digital Marketing Services in Madurai';
              let pageDescription = "GodivaTech offers quality web development, digital marketing, and app services in Madurai at competitive prices. Get custom solutions for your business.";
              let canonicalUrl = `https://godivatech.com${req.path === '/' ? '' : req.path}`;

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

              seoHtml = seoHtml.replace(/<title>.*?<\/title>/, `<title>${pageTitle}</title>`);
              seoHtml = seoHtml.replace(/<meta name="description" content=".*?">/, `<meta name="description" content="${pageDescription}">`);
              seoHtml = seoHtml.replace(/<link rel="canonical" href=".*?">/, `<link rel="canonical" href="${canonicalUrl}">`);
              seoHtml = seoHtml.replace(/<meta property="og:title" content=".*?">/, `<meta property="og:title" content="${pageTitle}">`);
              seoHtml = seoHtml.replace(/<meta property="og:description" content=".*?">/, `<meta property="og:description" content="${pageDescription}">`);
              seoHtml = seoHtml.replace(/<meta property="og:url" content=".*?">/, `<meta property="og:url" content="${canonicalUrl}">`);
              seoHtml = seoHtml.replace(/<h1>.*?<\/h1>/, `<h1>${pageTitle}</h1>`);

              log(`Serving SEO-optimized HTML for crawler on path: ${req.path}`);
              res.setHeader('Content-Type', 'text/html');
              res.send(seoHtml);
              return;
            }
          } catch (error) {
            console.error('Error serving SEO HTML:', error);
          }
        }
        next();
      });

      log('Crawler-friendly version enabled in development mode');
    }
  }

  // Fallback route handler for all non-api routes to support client-side SPA routing
  app.get(/^\/(?!api).*/, (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|map)$/)) {
      return next();
    }
    next();
  });

  // 404 handler for API routes
  app.use('/api/*', (req, res) => {
    res.status(404).json({
      status: 404,
      message: 'API endpoint not found',
      path: req.originalUrl
    });
  });

  // Serve robots.txt directly
  app.get('/robots.txt', (req, res) => {
    res.sendFile('robots.txt', { root: './public', maxAge: 86400000 });
  });

  // Setup Vite in development, or serveStatic in production
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Serve on port 5000 (or process.env.PORT)
  const port = process.env.PORT ? parseInt(process.env.PORT) : 5000;
  server.listen(port, "0.0.0.0", () => {
    log(`serving on port ${port}`);
  });
})();
