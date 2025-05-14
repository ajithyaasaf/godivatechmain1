import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';

/**
 * Production-only Server-Side Rendering middleware
 * 
 * This middleware handles:
 * 1. Data prefetching for SEO improvement
 * 2. Page metadata based on the route
 * 3. Structured data injection for search engines
 * 
 * Unlike full SSR, this doesn't render React components server-side,
 * but focuses on the most important SEO aspects.
 */
export async function ssrProduction(req: Request, res: Response, next: NextFunction) {
  const url = req.originalUrl;
  
  // Only process main routes
  const isMainRoute = /^\/(\w+)?$/.test(url) || url === '/' || 
                      /^\/blog\/[\w-]+$/.test(url) || 
                      /^\/services\/[\w-]+$/.test(url);
                      
  if (!isMainRoute || 
      url.startsWith('/api') || 
      url.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|map|json|xml)$/)) {
    return next();
  }
  
  try {
    // Get the index.html file from the production build
    const indexPath = path.resolve(process.cwd(), 'dist', 'client', 'index.html');
    
    if (!fs.existsSync(indexPath)) {
      console.error('Production build not found at', indexPath);
      return next();
    }
    
    let html = fs.readFileSync(indexPath, 'utf-8');
    
    // Import storage dynamically to avoid module loading issues
    const { firestoreStorage } = await import('./firestore-storage');
    
    // Prepare SEO metadata based on the route
    let title = 'GodivaTech - Innovative Technology Solutions';
    let description = 'GodivaTech provides cutting-edge technology services including web development, mobile apps, and digital marketing solutions.';
    let keywords = 'technology, web development, mobile apps, digital marketing, IT services';
    let canonicalUrl = `https://godivatech.com${url}`;
    let imageUrl = 'https://godivatech.com/images/godiva-tech-og.jpg';
    
    // Pre-fetch data based on the route and enhance SEO metadata
    let structuredData = {};
    let prefetchedData = [];
    
    try {
      if (url === '/' || url === '/home') {
        // Home page - fetch general data
        const [services, projects, testimonials] = await Promise.all([
          firestoreStorage.getAllServices(),
          firestoreStorage.getAllProjects(),
          firestoreStorage.getAllTestimonials()
        ]);
        
        prefetchedData = [
          { queryKey: ['services'], data: services },
          { queryKey: ['projects'], data: projects }, 
          { queryKey: ['testimonials'], data: testimonials }
        ];
        
        // Create structured data for homepage
        structuredData = {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "GodivaTech",
          "url": "https://godivatech.com",
          "logo": "https://godivatech.com/images/logo.png",
          "description": description,
          "sameAs": [
            "https://twitter.com/godivatech",
            "https://www.linkedin.com/company/godivatech"
          ]
        };
      }
      else if (url.startsWith('/blog')) {
        const slug = url.split('/').pop();
        
        if (slug && slug !== 'blog') {
          // Single blog post page
          const post = await firestoreStorage.getBlogPostBySlug(slug);
          
          if (post) {
            prefetchedData = [{ queryKey: ['blog-post', slug], data: post }];
            
            // Update metadata for this specific blog post
            title = `${post.title} | GodivaTech Blog`;
            description = post.excerpt || post.content.substring(0, 160);
            imageUrl = post.coverImage || imageUrl;
            
            // Create article structured data
            structuredData = {
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              "headline": post.title,
              "image": post.coverImage,
              "datePublished": post.publishedAt || post.createdAt,
              "dateModified": post.updatedAt || post.createdAt,
              "author": {
                "@type": "Person",
                "name": post.author?.name || "GodivaTech Team"
              },
              "publisher": {
                "@type": "Organization",
                "name": "GodivaTech",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://godivatech.com/images/logo.png"
                }
              },
              "description": description
            };
          }
        } else {
          // Blog listing page
          const posts = await firestoreStorage.getAllBlogPosts();
          prefetchedData = [{ queryKey: ['blog-posts'], data: posts }];
          
          title = "Blog | GodivaTech";
          description = "Read the latest insights on technology, web development, and digital marketing from the GodivaTech team.";
          
          structuredData = {
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "GodivaTech Blog",
            "description": description,
            "url": canonicalUrl
          };
        }
      }
      else if (url.startsWith('/services')) {
        const slug = url.split('/').pop();
        
        if (slug && slug !== 'services') {
          // Single service page
          const service = await firestoreStorage.getServiceBySlug(slug);
          
          if (service) {
            prefetchedData = [{ queryKey: ['service', slug], data: service }];
            
            title = `${service.name} | GodivaTech Services`;
            description = service.shortDescription || service.description?.substring(0, 160) || description;
            
            structuredData = {
              "@context": "https://schema.org",
              "@type": "Service",
              "name": service.name,
              "description": description,
              "provider": {
                "@type": "Organization",
                "name": "GodivaTech"
              }
            };
          }
        } else {
          // Services listing page
          const services = await firestoreStorage.getAllServices();
          prefetchedData = [{ queryKey: ['services'], data: services }];
          
          title = "Our Services | GodivaTech";
          description = "Explore our comprehensive range of technology services including web development, mobile apps, and digital marketing.";
        }
      }
      // Add more routes as needed
      
    } catch (error: any) {
      console.error('Error prefetching data for SEO:', error?.message || error);
      // Continue with default metadata
    }
    
    // Enhance HTML with improved SEO metadata
    html = html
      // Update title tag
      .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
      // Update meta descriptions
      .replace(
        /<meta name="description" content=".*?">/,
        `<meta name="description" content="${description}">`
      )
      // Add meta keywords if not present or update existing
      .replace(
        /<meta name="keywords" content=".*?">/,
        `<meta name="keywords" content="${keywords}">`
      );
      
    // If keywords meta tag doesn't exist, add it before </head>
    if (!html.includes('meta name="keywords"')) {
      html = html.replace(
        '</head>',
        `  <meta name="keywords" content="${keywords}">\n  </head>`
      );
    }
    
    // Add canonical URL
    if (!html.includes('rel="canonical"')) {
      html = html.replace(
        '</head>',
        `  <link rel="canonical" href="${canonicalUrl}">\n  </head>`
      );
    } else {
      html = html.replace(
        /<link rel="canonical" href=".*?">/,
        `<link rel="canonical" href="${canonicalUrl}">`
      );
    }
    
    // Add canonical URL tag always
    if (!html.includes('<link rel="canonical"')) {
      html = html.replace('</head>', `<link rel="canonical" href="${canonicalUrl}">\n</head>`);
    } else {
      html = html.replace(
        /<link rel="canonical" href=".*?">/,
        `<link rel="canonical" href="${canonicalUrl}">`
      );
    }
    
    // Add OpenGraph and Twitter Card metadata for better social sharing
    const ogTags = `
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:type" content="${url === '/' ? 'website' : 'article'}">
  <meta property="og:site_name" content="GodivaTech">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${imageUrl}">`;
    
    // Add structured data for rich results in search engines
    const structuredDataScript = `
  <script type="application/ld+json">
    ${JSON.stringify(structuredData)}
  </script>`;
    
    // Inject SEO enhancements before closing head tag
    html = html.replace('</head>', `${ogTags}\n${structuredDataScript}\n</head>`);
    
    // Inject prefetched data for client-side hydration
    if (prefetchedData.length > 0) {
      const dataScript = `
  <script>
    window.__INITIAL_DATA__ = ${JSON.stringify(prefetchedData)};
  </script>`;
      
      html = html.replace('</head>', `${dataScript}\n</head>`);
    }
    
    console.log(`[ssr-production] Enhanced SEO for ${url}`);
    
    // Send the enhanced HTML
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
    
  } catch (error: any) {
    console.error('[ssr-production] Error:', error?.message || error);
    next();
  }
}