/**
 * Server-side meta tag injector
 * Ensures critical SEO tags are always injected into HTML responses
 */

interface MetaTagOptions {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  keywords?: string;
  ogType?: string;
  ogImage?: string;
  robotsContent?: string;
}

/**
 * Injects meta tags for SEO into HTML
 * @param html The HTML content to inject meta tags into
 * @param options Meta tag options
 * @returns HTML with meta tags injected
 */
export function injectMetaTags(html: string, options: MetaTagOptions = {}): string {
  // Default options
  const {
    title = 'GodivaTech - Web Development & Digital Marketing Services in Madurai',
    description = 'GodivaTech offers quality web development, digital marketing, and app services in Madurai at competitive prices. Get custom solutions for your business.',
    canonicalUrl = 'https://godivatech.com/',
    keywords = 'web development, digital marketing, app development, Madurai, Tamil Nadu, SEO services',
    ogType = 'website',
    ogImage = 'https://godivatech.com/og-image.jpg',
    robotsContent = 'index, follow, max-image-preview:large, max-snippet:-1'
  } = options;
  
  // Update title if it exists
  if (html.includes('<title>')) {
    html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
  } else {
    html = html.replace('</head>', `  <title>${title}</title>\n</head>`);
  }
  
  // Update description
  if (html.includes('<meta name="description"')) {
    html = html.replace(
      /<meta name="description" content=".*?">/,
      `<meta name="description" content="${description}">`
    );
  } else {
    html = html.replace('</head>', `  <meta name="description" content="${description}">\n</head>`);
  }
  
  // Update keywords
  if (html.includes('<meta name="keywords"')) {
    html = html.replace(
      /<meta name="keywords" content=".*?">/,
      `<meta name="keywords" content="${keywords}">`
    );
  } else {
    html = html.replace('</head>', `  <meta name="keywords" content="${keywords}">\n</head>`);
  }
  
  // Update canonical URL
  if (html.includes('<link rel="canonical"')) {
    html = html.replace(
      /<link rel="canonical" href=".*?">/,
      `<link rel="canonical" href="${canonicalUrl}">`
    );
  } else {
    html = html.replace('</head>', `  <link rel="canonical" href="${canonicalUrl}">\n</head>`);
  }
  
  // Add robots meta tag
  if (!html.includes('<meta name="robots"')) {
    html = html.replace('</head>', `  <meta name="robots" content="${robotsContent}">\n</head>`);
  }
  
  // Add OpenGraph meta tags
  if (!html.includes('<meta property="og:title"')) {
    const ogTags = `
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:type" content="${ogType}">
  <meta property="og:image" content="${ogImage}">
  <meta property="og:site_name" content="GodivaTech">`;
    
    html = html.replace('</head>', `${ogTags}\n</head>`);
  }
  
  // Add Twitter card meta tags
  if (!html.includes('<meta name="twitter:card"')) {
    const twitterTags = `
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${ogImage}">
  <meta name="twitter:site" content="@godivatech">`;
    
    html = html.replace('</head>', `${twitterTags}\n</head>`);
  }
  
  return html;
}