import React, { memo, useMemo } from "react";
import { Link } from "wouter";
import { formatDistanceToNow, format } from "date-fns";
import type { ExtendedBlogPost } from "@/lib/schema";

// Optimize BlogCard with memoization
const BlogCard = memo(({ post, index = 0 }: { post: ExtendedBlogPost; index?: number }) => {
  // Calculate formatted dates once using useMemo to avoid recalculation on re-renders
  const dateValues = useMemo(() => {
    const postDate = new Date(post.publishedAt);
    return {
      formattedDate: formatDistanceToNow(postDate, { addSuffix: true }),
      formattedISODate: postDate.toISOString(),
      humanReadableDate: format(postDate, 'MMMM dd, yyyy')
    };
  }, [post.publishedAt]);
  
  // Memoize category name
  const categoryName = useMemo(() => 
    post.category?.name || "Uncategorized"
  , [post.category?.name]);
  
  // Generate structured data for SEO
  const structuredData = useMemo(() => ({
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
        "url": "https://godivatech.com/logo.png" 
      }
    },
    "datePublished": dateValues.formattedISODate,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://godivatech.com/blog/${post.slug}`
    }
  }), [post.title, post.excerpt, post.coverImage, post.authorName, post.slug, dateValues.formattedISODate]);

  // Calculate staggered animation delay
  const animationDelay = useMemo(() => 
    Math.min(index * 0.1, 0.3)
  , [index]);

  return (
    <article 
      className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 group"
      style={{ 
        willChange: "transform, box-shadow",
        animationDelay: `${animationDelay}s` 
      }}
    >
      {/* Add structured data for SEO */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      
      <Link href={`/blog/${post.slug}`}>
        <div className="w-full h-48 overflow-hidden bg-neutral-100 relative">
          {post.coverImage ? (
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy" 
              decoding="async"
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
          {/* Static semi-transparent gradient overlay instead of animation */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </Link>
      <div className="p-6">
        <div className="flex items-center mb-4">
          <Link href={post.category?.slug ? `/blog/category/${post.category.slug}` : "/blog"}>
            <span className="bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded hover:bg-primary/20 cursor-pointer transition-colors">
              {categoryName}
            </span>
          </Link>
          <time 
            dateTime={dateValues.formattedISODate} 
            className="text-neutral-500 text-sm ml-auto"
            title={dateValues.humanReadableDate}
          >
            {dateValues.formattedDate}
          </time>
        </div>
        <Link href={`/blog/${post.slug}`} className="block mb-3 group">
          <h3 className="text-xl font-semibold text-neutral-800 group-hover:text-primary transition duration-150">
            {post.title}
          </h3>
        </Link>
        <p className="text-neutral-600 mb-4 line-clamp-3 group-hover:line-clamp-none transition-all duration-300">{post.excerpt}</p>
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full overflow-hidden mr-3 bg-neutral-200">
            {post.authorImage ? (
              <img
                src={post.authorImage}
                alt={`${post.authorName} - Author at GodivaTech`}
                className="w-full h-full object-cover object-center"
                loading="lazy"
                decoding="async"
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
});

// Add displayName for React DevTools
BlogCard.displayName = "BlogCard";

export default BlogCard;
