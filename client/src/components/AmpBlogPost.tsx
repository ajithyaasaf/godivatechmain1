import React from 'react';

interface AmpBlogPostProps {
  post: {
    title: string;
    content: string;
    coverImage?: string;
    authorName?: string;
    authorImage?: string;
    publishedAt: string;
    slug: string;
    excerpt?: string;
  };
  category?: {
    name: string;
  } | null;
  canonicalUrl: string;
}

/**
 * AMP-compatible blog post component
 * This creates an AMP version of blog posts for faster mobile loading
 * https://amp.dev/documentation/guides-and-tutorials/start/create/basic_markup/
 */
const AmpBlogPost: React.FC<AmpBlogPostProps> = ({
  post,
  category,
  canonicalUrl
}) => {
  const {
    title, 
    content, 
    coverImage, 
    authorName = 'GodivaTech', 
    authorImage, 
    publishedAt,
    slug,
    excerpt
  } = post;
  
  const categoryName = category?.name;
  
  // Clean content for AMP compatibility
  const cleanContent = content
    .replace(/<img/g, '<amp-img layout="responsive" width="600" height="400"')
    .replace(/<iframe/g, '<amp-iframe layout="responsive" width="600" height="400" sandbox="allow-scripts allow-same-origin"')
    .replace(/<script/g, '<script type="application/ld+json"');
  
  // AMP HTML template
  const ampHtml = `
    <!doctype html>
    <html amp lang="en">
      <head>
        <meta charset="utf-8">
        <script async src="https://cdn.ampproject.org/v0.js"></script>
        <title>${title}</title>
        <link rel="canonical" href="${canonicalUrl}">
        <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
        <script type="application/ld+json">
          {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": "${title}",
            "image": "${coverImage || 'https://godivatech.com/images/blog-default.jpg'}",
            "datePublished": "${publishedAt}",
            "dateModified": "${publishedAt}",
            "author": {
              "@type": "Person",
              "name": "${authorName}"
            },
            "publisher": {
              "@type": "Organization",
              "name": "GodivaTech",
              "logo": {
                "@type": "ImageObject",
                "url": "https://godivatech.com/logo.png",
                "width": 600,
                "height": 60
              }
            },
            "description": "${excerpt || content.substring(0, 160).replace(/<[^>]*>/g, '').replace(/"/g, '\\"')}"
          }
        </script>
        <style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
        <style amp-custom>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 16px;
          }
          header {
            text-align: center;
            margin-bottom: 32px;
          }
          h1 {
            font-size: 32px;
            margin-bottom: 8px;
            color: #111;
          }
          .meta {
            font-size: 14px;
            color: #666;
            margin-bottom: 16px;
          }
          .author {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 24px;
          }
          .author-image {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            margin-right: 8px;
          }
          .category {
            display: inline-block;
            padding: 4px 8px;
            background: #f0f0f0;
            border-radius: 4px;
            font-size: 12px;
            margin-bottom: 16px;
          }
          .content {
            font-size: 18px;
          }
          .content p {
            margin-bottom: 24px;
          }
          .content h2 {
            margin-top: 32px;
            margin-bottom: 16px;
          }
          .content a {
            color: #0066cc;
            text-decoration: none;
          }
          .content a:hover {
            text-decoration: underline;
          }
          .cover-image {
            margin-bottom: 24px;
          }
        </style>
      </head>
      <body>
        <header>
          <h1>${title}</h1>
          <div class="meta">
            <time datetime="${publishedAt}">${new Date(publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
          </div>
          ${categoryName ? `<div class="category">${categoryName}</div>` : ''}
          <div class="author">
            ${authorImage ? `<amp-img class="author-image" src="${authorImage}" width="40" height="40" alt="${authorName}"></amp-img>` : ''}
            <span>${authorName}</span>
          </div>
          ${coverImage ? `<amp-img class="cover-image" src="${coverImage}" width="800" height="400" layout="responsive" alt="${title}"></amp-img>` : ''}
        </header>
        
        <div class="content">
          ${cleanContent}
        </div>
        
        <footer>
          <p>© ${new Date().getFullYear()} GodivaTech. All rights reserved.</p>
        </footer>
      </body>
    </html>
  `;
  
  return (
    <div style={{ display: 'none' }}>
      <link 
        rel="amphtml" 
        href={`${canonicalUrl}/amp`} 
      />
    </div>
  );
};

export default AmpBlogPost;