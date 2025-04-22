import React, { useEffect } from "react";
import { useParams, Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { formatDistanceToNow, format } from "date-fns";
import NewsletterSection from "@/components/home/NewsletterSection";
import BlogCard from "@/components/blog/BlogCard";
import { Button } from "@/components/ui/button";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
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

const BlogPost = () => {
  const { slug } = useParams();
  const [, navigate] = useLocation();

  const { data: blogPosts = [] } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog-posts'],
  });

  const post = blogPosts.find(post => post.slug === slug);
  
  // Get related posts (same category, excluding current post)
  const relatedPosts = post 
    ? blogPosts.filter(p => p.categoryId === post.categoryId && p.id !== post.id).slice(0, 3)
    : [];

  useEffect(() => {
    // If post not found, redirect to blog listing
    if (blogPosts.length > 0 && !post) {
      navigate("/blog");
    }
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [post, blogPosts, navigate]);

  if (!post) {
    return <div className="py-20 text-center">Loading...</div>;
  }

  const formattedDate = format(new Date(post.publishedAt), "MMMM dd, yyyy");
  const timeAgo = formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true });
  
  // Process content for better rendering
  const processContent = (content: string) => {
    // Replace Markdown-style headers with HTML headers
    let processed = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
      .replace(/- (.*?)(?:\n|$)/g, '<li>$1</li>') // List items
      
      // Add internal links to services and related terms
      .replace(/Web Development/g, '<a href="/services/web-development" class="text-primary hover:underline">Web Development</a>')
      .replace(/Digital Marketing/g, '<a href="/services/digital-marketing" class="text-primary hover:underline">Digital Marketing</a>')
      .replace(/Mobile App/g, '<a href="/services/app-development" class="text-primary hover:underline">Mobile App</a>')
      .replace(/SEO/g, '<a href="/services/digital-marketing" class="text-primary hover:underline">SEO</a>')
      .replace(/Logo Design/g, '<a href="/services/logo-brand-design" class="text-primary hover:underline">Logo Design</a>')
      .replace(/UI\/UX Design/g, '<a href="/services/ui-ux-design" class="text-primary hover:underline">UI/UX Design</a>')
      .replace(/Brand Design/g, '<a href="/services/logo-brand-design" class="text-primary hover:underline">Brand Design</a>')
      .replace(/Poster Design/g, '<a href="/services/poster-design" class="text-primary hover:underline">Poster Design</a>')
      
      // Add external authoritative links
      .replace(/Google My Business/g, '<a href="https://business.google.com" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">Google My Business</a>')
      .replace(/Google Maps/g, '<a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">Google Maps</a>');
    
    return processed;
  };

  // Split content by paragraphs for better rendering
  const contentParagraphs = post.content.split("\n\n");

  return (
    <>
      <Helmet>
        <title>{post.title} | GodivaTech Madurai</title>
        <meta name="description" content={post.excerpt} />
        <meta name="keywords" content={`${post.category?.name || ''}, Madurai, Tamil Nadu, ${post.title.toLowerCase()}`} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.coverImage} />
        <meta property="og:type" content="article" />
        <meta property="og:locale" content="en_IN" />
        <meta property="article:published_time" content={new Date(post.publishedAt).toISOString()} />
        <meta property="article:author" content={post.authorName} />
        <meta property="article:section" content={post.category?.name} />
        <link rel="canonical" href={`https://godivatech.com/blog/${post.slug}`} />
      </Helmet>

      <section className="bg-white pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap mb-8">
            <Link 
              href="/blog" 
              className="text-primary hover:text-primary/90 flex items-center"
            >
              <i className="fas fa-arrow-left mr-2"></i> Back to Blog
            </Link>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="mb-4 flex items-center">
                <span className="bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded mr-3">
                  {post.category?.name || "Uncategorized"}
                </span>
                <span className="text-neutral-500 text-sm">{formattedDate}</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">
                {post.title}
              </h1>
              
              <p className="text-lg text-neutral-600 mb-6">
                {post.excerpt}
              </p>
              
              <div className="flex items-center">
                <img 
                  src={post.authorImage} 
                  alt={post.authorName} 
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <p className="font-semibold text-neutral-800">{post.authorName}</p>
                  <p className="text-neutral-500 text-sm">Published {timeAgo}</p>
                </div>
              </div>
            </div>
            
            <div className="mb-10">
              <figure>
                <img 
                  src={post.coverImage} 
                  alt={`${post.title} - GodivaTech Madurai - ${post.category?.name || 'Blog'}`} 
                  className="w-full h-auto rounded-lg shadow-lg"
                  loading="eager"
                  width="800"
                  height="450"
                />
                <figcaption className="text-center text-neutral-500 text-sm mt-2">
                  {post.title} | GodivaTech Madurai
                </figcaption>
              </figure>
            </div>
            
            {/* Table of Contents for longer articles */}
            {contentParagraphs.length > 5 && (
              <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Table of Contents</h2>
                <ul className="space-y-2">
                  {contentParagraphs.slice(0, 6).map((para, idx) => {
                    // Extract potential headings (assuming first sentences of paragraphs)
                    const firstSentence = para.split('.')[0];
                    if (firstSentence.length > 10 && firstSentence.length < 100) {
                      return (
                        <li key={idx} className="text-primary hover:text-primary/80">
                          <a href={`#section-${idx}`} className="hover:underline">
                            {firstSentence.replace(/\*\*/g, '')}
                          </a>
                        </li>
                      );
                    }
                    return null;
                  }).filter(Boolean)}
                </ul>
              </div>
            )}
            
            <article className="prose prose-lg max-w-none mb-12">
              {contentParagraphs.map((paragraph, index) => {
                // Process paragraph to add links and formatting
                const processedContent = processContent(paragraph);
                
                // For paragraphs that might be headings (identified by bold start)
                if (processedContent.startsWith('<strong>')) {
                  return (
                    <div key={index} id={`section-${index}`}>
                      <h2 className="text-2xl font-bold text-neutral-800 mt-8 mb-4" 
                          dangerouslySetInnerHTML={{ __html: processedContent.replace('<strong>', '').replace('</strong>', '') }} />
                    </div>
                  );
                }
                
                // For list items
                if (processedContent.includes('<li>')) {
                  return (
                    <ul key={index} className="list-disc pl-5 my-4">
                      <div dangerouslySetInnerHTML={{ __html: processedContent }} />
                    </ul>
                  );
                }
                
                // Regular paragraphs with possible inline links
                return (
                  <div key={index} id={`section-${index}`}>
                    <p dangerouslySetInnerHTML={{ __html: processedContent }} />
                  </div>
                );
              })}
            </article>
            
            {/* Call to Action Box */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-8 mb-8">
              <h3 className="text-2xl font-bold text-primary mb-4">Need Help With Your {post.category?.name || "Digital"} Project?</h3>
              <p className="text-neutral-700 mb-6">
                GodivaTech specializes in {post.category?.name || "digital services"} for businesses in Madurai and across Tamil Nadu. 
                Our experienced team can help you implement the strategies discussed in this article.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact" className="bg-primary hover:bg-primary/90 text-white py-3 px-6 rounded-lg inline-block text-center font-medium">
                  Contact Us
                </Link>
                <Link href={`/services/${post.category?.slug || ''}`} className="bg-white border border-primary text-primary hover:bg-primary/5 py-3 px-6 rounded-lg inline-block text-center font-medium">
                  Our {post.category?.name || "Services"}
                </Link>
              </div>
            </div>
            
            {/* Social Sharing */}
            <div className="border-t border-neutral-200 pt-8 mb-12">
              <div className="flex flex-wrap gap-2">
                <span className="text-neutral-700 font-medium">Share this article:</span>
                <a 
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-500 hover:text-primary transition-colors"
                  aria-label="Share on Twitter"
                >
                  <i className="fab fa-twitter"></i>
                </a>
                <a 
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-500 hover:text-primary transition-colors"
                  aria-label="Share on LinkedIn"
                >
                  <i className="fab fa-linkedin-in"></i>
                </a>
                <a 
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-500 hover:text-primary transition-colors"
                  aria-label="Share on Facebook"
                >
                  <i className="fab fa-facebook-f"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {relatedPosts.length > 0 && (
        <section className="bg-neutral-50 py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-neutral-800 mb-8">Related Articles</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedPosts.map(relatedPost => (
                  <BlogCard key={relatedPost.id} post={relatedPost} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <NewsletterSection />
    </>
  );
};

export default BlogPost;
