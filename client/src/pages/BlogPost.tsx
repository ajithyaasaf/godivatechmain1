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
  
  // Process content for better rendering with SEO keywords
  const processContent = (content: string) => {
    // Replace Markdown-style headers with HTML headers
    let processed = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
      .replace(/- (.*?)(?:\n|$)/g, '<li>$1</li>') // List items
      
      // Add internal links to services with targeted SEO keywords for Madurai
      .replace(/Web Development/g, '<a href="https://www.godivatech.com/services/web-development" class="text-primary hover:underline">best web development in Madurai</a>')
      .replace(/Digital Marketing/g, '<a href="https://www.godivatech.com/services/digital-marketing" class="text-primary hover:underline">top digital marketing agency in Madurai</a>')
      .replace(/Mobile App/g, '<a href="https://www.godivatech.com/services/app-development" class="text-primary hover:underline">mobile app development company in Madurai</a>')
      .replace(/SEO/g, '<a href="https://www.godivatech.com/services/digital-marketing" class="text-primary hover:underline">SEO services in Madurai</a>')
      .replace(/Logo Design/g, '<a href="https://www.godivatech.com/services/logo-brand-design" class="text-primary hover:underline">professional logo design in Madurai</a>')
      .replace(/UI\/UX Design/g, '<a href="https://www.godivatech.com/services/ui-ux-design" class="text-primary hover:underline">UI/UX design services in Madurai</a>')
      .replace(/Brand Design/g, '<a href="https://www.godivatech.com/services/logo-brand-design" class="text-primary hover:underline">brand design company in Madurai</a>')
      .replace(/Poster Design/g, '<a href="https://www.godivatech.com/services/poster-design" class="text-primary hover:underline">poster design services in Madurai</a>')
      
      // Add Madurai-specific business keywords
      .replace(/business website/gi, '<a href="https://www.godivatech.com/services/web-development" class="text-primary hover:underline">business website development in Madurai</a>')
      .replace(/online presence/gi, '<a href="https://www.godivatech.com/services/digital-marketing" class="text-primary hover:underline">digital presence for Madurai businesses</a>')
      .replace(/social media/gi, '<a href="https://www.godivatech.com/services/digital-marketing" class="text-primary hover:underline">social media marketing in Madurai</a>')
      .replace(/local business/gi, '<a href="https://www.godivatech.com/about" class="text-primary hover:underline">Madurai local business solutions</a>')
      .replace(/ecommerce/gi, '<a href="https://www.godivatech.com/services/web-development" class="text-primary hover:underline">eCommerce website development in Madurai</a>')
      .replace(/website design/gi, '<a href="https://www.godivatech.com/services/web-development" class="text-primary hover:underline">best website design in Madurai</a>')
      .replace(/responsive website/gi, '<a href="https://www.godivatech.com/services/web-development" class="text-primary hover:underline">responsive website design in Madurai</a>')
      .replace(/professional website/gi, '<a href="https://www.godivatech.com/services/web-development" class="text-primary hover:underline">professional website development in Madurai</a>')
      .replace(/branding/gi, '<a href="https://www.godivatech.com/services/logo-brand-design" class="text-primary hover:underline">branding services in Madurai</a>')
      .replace(/content marketing/gi, '<a href="https://www.godivatech.com/services/digital-marketing" class="text-primary hover:underline">content marketing services in Madurai</a>')
      .replace(/Tamil Nadu/gi, '<a href="https://www.godivatech.com/about" class="text-primary hover:underline">best IT company in Tamil Nadu</a>')
      
      // Replace GodivaTech mentions with SEO optimized links
      .replace(/GodivaTech/g, '<a href="https://www.godivatech.com/about" class="text-primary hover:underline">GodivaTech - best software company in Madurai</a>')
      
      // Add external authoritative links
      .replace(/Google My Business/g, '<a href="https://business.google.com" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">Google My Business for Madurai companies</a>')
      .replace(/Google Maps/g, '<a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">Google Maps listing for Madurai</a>')
      .replace(/Facebook/g, '<a href="https://business.facebook.com" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">Facebook marketing for Madurai</a>')
      .replace(/Instagram/g, '<a href="https://business.instagram.com" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">Instagram marketing for Madurai</a>');
    
    return processed;
  };

  // Split content by paragraphs for better rendering
  const contentParagraphs = post.content.split("\n\n");

  return (
    <>
      <Helmet>
        <title>{post.title} | Best {post.category?.name || 'Digital Services'} in Madurai | GodivaTech</title>
        <meta name="description" content={`${post.excerpt} GodivaTech provides the best ${post.category?.name || 'digital services'} in Madurai, Tamil Nadu for businesses looking to grow their online presence.`} />
        <meta name="keywords" content={`
          ${post.category?.name || ''}, 
          best software company in Madurai, 
          top web development company in Madurai, 
          digital marketing agency Madurai, 
          SEO services in Madurai, 
          website design Madurai, 
          mobile app development Madurai, 
          eCommerce development Tamil Nadu, 
          branding agency Madurai, 
          UI/UX design Madurai, 
          logo design Madurai, 
          ${post.title.toLowerCase()}, 
          GodivaTech Madurai, 
          IT company Tamil Nadu`} />
        <meta property="og:title" content={`${post.title} | Best ${post.category?.name || 'Digital Services'} in Madurai | GodivaTech`} />
        <meta property="og:description" content={`${post.excerpt} Get professional ${post.category?.name || 'digital services'} for your business in Madurai, Tamil Nadu.`} />
        <meta property="og:image" content={post.coverImage} />
        <meta property="og:type" content="article" />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:site_name" content="GodivaTech - Best Software Company in Madurai" />
        <meta property="article:published_time" content={new Date(post.publishedAt).toISOString()} />
        <meta property="article:author" content={post.authorName} />
        <meta property="article:section" content={post.category?.name} />
        <meta property="article:tag" content={`Madurai, ${post.category?.name || 'Digital Services'}, Tamil Nadu`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${post.title} | GodivaTech Madurai`} />
        <meta name="twitter:description" content={post.excerpt} />
        <meta name="twitter:image" content={post.coverImage} />
        <meta name="geo.region" content="IN-TN" />
        <meta name="geo.placename" content="Madurai" />
        <link rel="canonical" href={`https://godivatech.com/blog/${post.slug}`} />
        
        {/* JSON-LD Schema markup for better SEO */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.excerpt,
            "image": post.coverImage,
            "url": `https://godivatech.com/blog/${post.slug}`,
            "datePublished": new Date(post.publishedAt).toISOString(),
            "dateModified": new Date(post.publishedAt).toISOString(),
            "author": {
              "@type": "Person",
              "name": post.authorName,
              "url": "https://godivatech.com/about"
            },
            "publisher": {
              "@type": "Organization",
              "name": "GodivaTech - Best Software Company in Madurai",
              "logo": {
                "@type": "ImageObject",
                "url": "https://godivatech.com/assets/godiva-logo.png"
              }
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://godivatech.com/blog/${post.slug}`
            },
            "keywords": `${post.category?.name || ''}, best software company in Madurai, ${post.title.toLowerCase()}, GodivaTech Madurai`,
            "articleSection": post.category?.name,
            "isAccessibleForFree": "True",
            "locationCreated": {
              "@type": "Place",
              "name": "Madurai, Tamil Nadu, India",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Madurai",
                "addressRegion": "TN",
                "addressCountry": "IN"
              }
            }
          })}
        </script>

        {/* Local Business Schema for GodivaTech */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "GodivaTech",
            "description": "Best Software & Digital Marketing Company in Madurai",
            "url": "https://www.godivatech.com",
            "logo": "https://godivatech.com/assets/godiva-logo.png",
            "image": "https://godivatech.com/assets/godiva-logo.png",
            "telephone": "+91-XXXXXXXXXX",
            "email": "info@godivatech.com",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "261, Vaigai mainroad 4th Street, Sri Nagar, Iyer Bungalow",
              "addressLocality": "Madurai",
              "postalCode": "625007",
              "addressRegion": "Tamil Nadu",
              "addressCountry": "IN"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "9.9252",
              "longitude": "78.1198"
            },
            "openingHoursSpecification": {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
              "opens": "09:00",
              "closes": "18:00"
            },
            "sameAs": [
              "https://www.facebook.com/godivatech",
              "https://www.instagram.com/godivatech",
              "https://www.linkedin.com/company/godivatech",
              "https://twitter.com/godivatech"
            ],
            "priceRange": "₹₹",
            "servesCuisine": ["Web Development", "Digital Marketing", "Mobile App Development", "UI/UX Design"]
          })}
        </script>
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
            
            {/* Call to Action Box with Targeted SEO Keywords */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-8 mb-8">
              <h3 className="text-2xl font-bold text-primary mb-4">Need the Best {post.category?.name || "Digital Services"} in Madurai?</h3>
              <p className="text-neutral-700 mb-6">
                As the leading software company in Madurai, GodivaTech specializes in professional {post.category?.name?.toLowerCase() || "digital services"} for businesses across Tamil Nadu. 
                Our experienced Madurai-based team can help you implement all the strategies discussed in this article with affordable, result-driven solutions.
              </p>
              <p className="text-neutral-700 mb-6">
                From <a href="https://www.godivatech.com/services/web-development" className="text-primary hover:underline">expert web development</a> and <a href="https://www.godivatech.com/services/digital-marketing" className="text-primary hover:underline">digital marketing</a> to <a href="https://www.godivatech.com/services/logo-brand-design" className="text-primary hover:underline">professional branding</a>, we provide all the technical services your Madurai business needs to succeed online.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact" className="bg-primary hover:bg-primary/90 text-white py-3 px-6 rounded-lg inline-block text-center font-medium">
                  Contact Best {post.category?.name || "Digital"} Agency in Madurai
                </Link>
                <Link href={`/services/${post.category?.slug || ''}`} className="bg-white border border-primary text-primary hover:bg-primary/5 py-3 px-6 rounded-lg inline-block text-center font-medium">
                  View Our {post.category?.name || "Services"} in Madurai
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
