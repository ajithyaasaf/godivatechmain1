import React from "react";
import { Link } from "wouter";
import { formatDistanceToNow, format } from "date-fns";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  coverImage: string;
  authorName: string;
  authorImage: string;
  categoryId: number;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
}

const BlogCard = ({ post }: { post: BlogPost }) => {
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
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-48 object-cover"
          loading="lazy" // Add lazy loading for better performance
        />
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
          <img
            src={post.authorImage}
            alt={`${post.authorName} - Author at GodivaTech Madurai`}
            className="w-8 h-8 rounded-full mr-3"
            loading="lazy"
          />
          <span className="text-neutral-700 font-medium">{post.authorName}</span>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
