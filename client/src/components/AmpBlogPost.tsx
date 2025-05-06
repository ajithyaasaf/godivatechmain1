import React from 'react';
import { Helmet } from 'react-helmet';
import type { BlogPost, Category } from '@shared/schema';

interface AmpBlogPostProps {
  post: BlogPost;
  category?: Category | null;
  canonicalUrl: string;
}

/**
 * AMP version of blog post for faster mobile loading
 * Follows AMP HTML specification for better mobile performance
 */
const AmpBlogPost: React.FC<AmpBlogPostProps> = ({ post, category, canonicalUrl }) => {
  // Process content for AMP compatibility
  const processAmpContent = (content: string) => {
    // Replace Markdown-style headers with HTML headers
    let processed = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
      .replace(/- (.*?)(?:\n|$)/g, '<li>$1</li>') // List items
      
      // Make sure all images use amp-img instead of img tags with correct attributes
      .replace(/<img(.*?)>/g, (match, attributes) => {
        const src = attributes.match(/src=['"]([^'"]*)['"]/)?.[1] || '';
        const alt = attributes.match(/alt=['"]([^'"]*)['"]/)?.[1] || '';
        const width = attributes.match(/width=['"]([^'"]*)['"]/)?.[1] || '800';
        const height = attributes.match(/height=['"]([^'"]*)['"]/)?.[1] || '450';
        
        return `<amp-img src="${src}" alt="${alt}" width="${width}" height="${height}" layout="responsive"></amp-img>`;
      })
      
      // Remove any script tags (not allowed in AMP)
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      
      // Replace iframe with amp-iframe
      .replace(/<iframe(.*?)><\/iframe>/g, (match, attributes) => {
        const src = attributes.match(/src=['"]([^'"]*)['"]/)?.[1] || '';
        return `<amp-iframe src="${src}" width="400" height="300" layout="responsive" sandbox="allow-scripts allow-same-origin"></amp-iframe>`;
      })
      
      // Ensure all links open in _blank for external URLs
      .replace(/<a\s+(?:[^>]*?\s+)?href=(["'])(https?:\/\/.*?)\1/g, '<a href=$1$2$1 target="_blank" rel="noopener noreferrer"');
      
    return processed;
  };
  
  const ampContent = processAmpContent(post.content);

  // Split content by paragraphs for better rendering
  const contentParagraphs = ampContent.split("\n\n");

  // Since we can't use React AMP components properly in tsx, we'll return
  // a note that this component will generate static HTML in prod
  return (
    <>
      <Helmet>
        {/* Note: These would be proper attributes in the AMP HTML output */}
        {/* For TypeScript, we're handling them differently but keeping here as a reference */}
        {/* <html amp /> */}
        {/* <meta charset="utf-8" /> */}
        <title>{post.title} | GodivaTech Madurai</title>
        <link rel="canonical" href={canonicalUrl} />
        <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1" />
        <script async src="https://cdn.ampproject.org/v0.js"></script>
        <script async custom-element="amp-iframe" src="https://cdn.ampproject.org/v0/amp-iframe-0.1.js"></script>
        <style data-amp-boilerplate="">
          {`body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}`}
        </style>
        <noscript>
          <style data-amp-boilerplate="">
            {`body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}`}
          </style>
        </noscript>
        <style data-amp-custom="">
          {`
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 16px;
            }
            h1 {
              font-size: 28px;
              margin-bottom: 16px;
              color: #1a1a1a;
            }
            h2 {
              font-size: 24px;
              margin: 24px 0 16px;
              color: #1a1a1a;
            }
            p {
              margin-bottom: 16px;
            }
            a {
              color: #0070f3;
              text-decoration: none;
            }
            a:hover {
              text-decoration: underline;
            }
            .category {
              display: inline-block;
              background-color: rgba(0,112,243,0.1);
              color: #0070f3;
              padding: 4px 8px;
              font-size: 14px;
              border-radius: 4px;
              margin-right: 12px;
            }
            .date {
              color: #666;
              font-size: 14px;
            }
            .meta {
              margin-bottom: 24px;
            }
            .author {
              display: flex;
              align-items: center;
              margin: 24px 0;
            }
            .author-image {
              width: 48px;
              height: 48px;
              border-radius: 50%;
              margin-right: 16px;
            }
            .author-name {
              font-weight: 600;
              margin: 0;
            }
            .author-date {
              color: #666;
              font-size: 14px;
              margin: 0;
            }
            .content {
              margin-top: 24px;
            }
            .image-caption {
              text-align: center;
              color: #666;
              font-size: 14px;
              margin-top: 8px;
            }
            .cta {
              background-color: rgba(0,112,243,0.05);
              border: 1px solid rgba(0,112,243,0.1);
              border-radius: 8px;
              padding: 16px;
              margin: 24px 0;
            }
            .cta-title {
              color: #0070f3;
              font-size: 20px;
              font-weight: 600;
              margin-bottom: 8px;
            }
            .related {
              margin-top: 40px;
              border-top: 1px solid #eaeaea;
              padding-top: 24px;
            }
            .related-title {
              margin-bottom: 16px;
            }
            .breadcrumbs {
              margin-bottom: 16px;
              font-size: 14px;
              color: #666;
            }
            .breadcrumbs a {
              color: #666;
              text-decoration: none;
            }
            .breadcrumbs a:hover {
              color: #0070f3;
            }
          `}
        </style>
        
        {/* Schema.org structured data for AMP */}
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": "${post.title}",
            "description": "${post.excerpt}",
            "image": "${post.coverImage || 'https://godivatech.com/assets/blog-default.jpg'}",
            "datePublished": "${new Date(post.publishedAt).toISOString()}",
            "dateModified": "${new Date(post.publishedAt).toISOString()}",
            "author": {
              "@type": "Person",
              "name": "${post.authorName}"
            },
            "publisher": {
              "@type": "Organization",
              "name": "GodivaTech",
              "logo": {
                "@type": "ImageObject",
                "url": "https://godivatech.com/logo.png"
              }
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": "${canonicalUrl}"
            },
            "locationCreated": {
              "@type": "Place",
              "name": "Madurai, Tamil Nadu, India",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Madurai",
                "addressRegion": "Tamil Nadu",
                "addressCountry": "IN"
              }
            }
          }
        `}</script>
      </Helmet>
      
      <div>
        <div className="breadcrumbs">
          <a href="/">Home</a> &raquo; <a href="/blog">Blog</a> &raquo; {post.title}
        </div>
        
        <h1 className="speakable-headline">{post.title}</h1>
        
        <div className="meta">
          <span className="category">{category?.name || "Uncategorized"}</span>
          <span className="date">{new Date(post.publishedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
        
        <div className="author">
          {/* AMP compatibility note: In production this would be an amp-img element */}
          <div className="author-image-container" style={{width: 48, height: 48, position: 'relative'}}>
            <img 
              src={post.authorImage || '/assets/placeholder-author.png'} 
              alt={post.authorName}
              width="48"
              height="48"
              className="author-image"
            />
          </div>
          <div>
            <p className="author-name">{post.authorName}</p>
            <p className="author-date">Published {new Date(post.publishedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>
        
        {/* AMP compatibility note: In production this would be an amp-img element */}
        <div style={{position: 'relative', aspectRatio: '16/9'}}>
          <img
            src={post.coverImage || '/assets/blog-default.jpg'} 
            alt={`${post.title} - GodivaTech Madurai - ${category?.name || 'Blog'}`}
            width="800"
            height="450"
            style={{width: '100%', height: 'auto'}}
          />
        </div>
        <p className="image-caption">{post.title} | GodivaTech Madurai</p>
        
        <div className="content speakable-content">
          {contentParagraphs.map((paragraph, index) => {
            // Regular paragraphs with possible inline links
            return (
              <div key={index} id={`section-${index}`}>
                <div dangerouslySetInnerHTML={{ __html: paragraph }} />
              </div>
            );
          })}
        </div>
        
        <div className="cta">
          <h3 className="cta-title">Need Professional {category?.name || "Digital Services"} in Madurai?</h3>
          <p>
            GodivaTech specializes in professional {category?.name?.toLowerCase() || "digital services"} for businesses in Madurai and across Tamil Nadu. Contact us today for affordable, result-driven solutions.
          </p>
          <p>
            <a href="/contact">Get in touch &raquo;</a>
          </p>
        </div>
      </div>
    </>
  );
};

export default AmpBlogPost;