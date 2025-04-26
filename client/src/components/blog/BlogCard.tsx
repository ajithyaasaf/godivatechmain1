import React from "react";
import { Link } from "wouter";
import { formatDistanceToNow, format } from "date-fns";
import type { ExtendedBlogPost } from "@shared/schema";

const BlogCard = ({ post }: { post: ExtendedBlogPost }) => {
  const formattedDate = formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true });
  const formattedISODate = new Date(post.publishedAt).toISOString();
  const humanReadableDate = format(new Date(post.publishedAt), 'MMMM dd, yyyy');
  
  const categoryName = post.category?.name || "Uncategorized";
  
  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.coverImage,
    "author": {
      "@type": "Person",
      "name": post.authorName
    },
    "publisher": {
      "@type": "Organization",
      "name": "GodivaTech",
      "logo": {
        "@type": "ImageObject",
        "url": "https://godivatech.com/logo.png" // Update with actual logo URL
      }
    },
    "datePublished": formattedISODate,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://godivatech.com/blog/${post.slug}`
    }
  };

  return (
    <article className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow duration-300">
      {/* Add structured data for SEO */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      
      <Link href={`/blog/${post.slug}`}>
        <div className="w-full h-48 overflow-hidden bg-neutral-100">
          {post.coverImage ? (
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover object-center"
              loading="lazy" // Add lazy loading for better performance
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
            </div>
          )}
        </div>
      </Link>
      <div className="p-6">
        <div className="flex items-center mb-4">
          <Link href={`/blog?category=${post.category?.slug || ""}`}>
            <span className="bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded hover:bg-primary/20 cursor-pointer transition-colors">
              {categoryName}
            </span>
          </Link>
          <time 
            dateTime={formattedISODate} 
            className="text-neutral-500 text-sm ml-auto"
            title={humanReadableDate}
          >
            {formattedDate}
          </time>
        </div>
        <Link href={`/blog/${post.slug}`} className="block mb-3">
          <h3 className="text-xl font-semibold text-neutral-800 hover:text-primary transition duration-150">
            {post.title}
          </h3>
        </Link>
        <p className="text-neutral-600 mb-4">{post.excerpt}</p>
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full overflow-hidden mr-3 bg-neutral-200">
            {post.authorImage ? (
              <img
                src={post.authorImage}
                alt={`${post.authorName} - Author at GodivaTech`}
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-500">
                {post.authorName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <span className="text-neutral-700 font-medium">{post.authorName}</span>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
