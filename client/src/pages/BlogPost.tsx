import React, { useEffect, useState, useMemo, memo } from "react";
import { useParams, Link, useLocation } from "wouter";
import { formatDistanceToNow, format } from "date-fns";
import NewsletterSection from "@/components/home/NewsletterSection";
import BlogCard from "@/components/blog/BlogCard";
import { Button } from "@/components/ui/button";
import type { BlogPost, Category } from "@/lib/schema";
import { 
  getBlogPostBySlug, 
  getAllBlogPosts,
  getCategoryById
} from "@/lib/firestore";
import SEO from "@/components/SEO";
import AmpBlogPost from "@/components/AmpBlogPost";
import OptimizedImage from "@/components/ui/optimized-image";
import { blogKeywords, getLocationSpecificDescription } from "@/lib/seoKeywords";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import { formatCanonicalUrl } from "@/lib/canonicalUrl";
import { 
  getOrganizationData, 
  getWebPageData,
  getBreadcrumbData,
  getBlogPostData
} from "@/lib/structuredData";
import {
  createMobileAppStructuredData,
  createMobileBreadcrumbStructuredData,
  createMobileServiceStructuredData,
  createMobileImageStructuredData,
  createMobileFAQStructuredData
} from "@/lib/mobileOptimization";

const BlogPost = () => {
  const { slug } = useParams();
  const [, navigate] = useLocation();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      setLoading(true);
      try {
        // Fetch the blog post by slug
        const fetchedPost = await getBlogPostBySlug(slug || "");
        
        if (!fetchedPost) {
          navigate("/blog");
          return;
        }
        
        setPost(fetchedPost);
        
        // If post has a category, fetch the category details
        if (fetchedPost.categoryId) {
          const categoryData = await getCategoryById(fetchedPost.categoryId);
          if (categoryData) {
            setCategory(categoryData);
          }
        }
        
        // Fetch all posts to get related posts
        const allPosts = await getAllBlogPosts();
        const related = allPosts
          .filter(p => p.categoryId === fetchedPost.categoryId && p.id !== fetchedPost.id)
          .slice(0, 3);
          
        setRelatedPosts(related);
      } catch (error) {
        console.error("Error loading blog post:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (slug) {
      loadPost();
    }
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [slug, navigate]);

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
      
      // Add internal links to services with targeted SEO keywords for Madurai - WITHOUT underlines
      .replace(/Web Development/g, '<a href="https://www.godivatech.com/services/web-development" class="text-primary no-underline">best web development in Madurai</a>')
      .replace(/Digital Marketing/g, '<a href="https://www.godivatech.com/services/digital-marketing" class="text-primary no-underline">top digital marketing agency in Madurai</a>')
      .replace(/Mobile App/g, '<a href="https://www.godivatech.com/services/app-development" class="text-primary no-underline">mobile app development company in Madurai</a>')
      .replace(/SEO/g, '<a href="https://www.godivatech.com/services/digital-marketing" class="text-primary no-underline">SEO services in Madurai</a>')
      .replace(/Logo Design/g, '<a href="https://www.godivatech.com/services/logo-brand-design" class="text-primary no-underline">professional logo design in Madurai</a>')
      .replace(/UI\/UX Design/g, '<a href="https://www.godivatech.com/services/ui-ux-design" class="text-primary no-underline">UI/UX design services in Madurai</a>')
      .replace(/Brand Design/g, '<a href="https://www.godivatech.com/services/logo-brand-design" class="text-primary no-underline">brand design company in Madurai</a>')
      .replace(/Poster Design/g, '<a href="https://www.godivatech.com/services/poster-design" class="text-primary no-underline">poster design services in Madurai</a>')
      
      // Add Madurai-specific business keywords - WITHOUT underlines
      .replace(/business website/gi, '<a href="https://www.godivatech.com/services/web-development" class="text-primary no-underline">business website development in Madurai</a>')
      .replace(/online presence/gi, '<a href="https://www.godivatech.com/services/digital-marketing" class="text-primary no-underline">digital presence for Madurai businesses</a>')
      .replace(/social media/gi, '<a href="https://www.godivatech.com/services/digital-marketing" class="text-primary no-underline">social media marketing in Madurai</a>')
      .replace(/local business/gi, '<a href="https://www.godivatech.com/about" class="text-primary no-underline">Madurai local business solutions</a>')
      .replace(/ecommerce/gi, '<a href="https://www.godivatech.com/services/web-development" class="text-primary no-underline">eCommerce website development in Madurai</a>')
      .replace(/website design/gi, '<a href="https://www.godivatech.com/services/web-development" class="text-primary no-underline">best website design in Madurai</a>')
      .replace(/responsive website/gi, '<a href="https://www.godivatech.com/services/web-development" class="text-primary no-underline">responsive website design in Madurai</a>')
      .replace(/professional website/gi, '<a href="https://www.godivatech.com/services/web-development" class="text-primary no-underline">professional website development in Madurai</a>')
      .replace(/branding/gi, '<a href="https://www.godivatech.com/services/logo-brand-design" class="text-primary no-underline">branding services in Madurai</a>')
      .replace(/content marketing/gi, '<a href="https://www.godivatech.com/services/digital-marketing" class="text-primary no-underline">content marketing services in Madurai</a>')
      .replace(/Tamil Nadu/gi, '<a href="https://www.godivatech.com/about" class="text-primary no-underline">best IT company in Tamil Nadu</a>')
      
      // Replace GodivaTech mentions with SEO optimized links - WITHOUT underlines
      .replace(/GodivaTech/g, '<a href="https://www.godivatech.com/about" class="text-primary no-underline">GodivaTech - best software company in Madurai</a>')
      
      // Add external authoritative links - WITHOUT underlines
      .replace(/Google My Business/g, '<a href="https://business.google.com" target="_blank" rel="noopener noreferrer" class="text-primary no-underline">Google My Business for Madurai companies</a>')
      .replace(/Google Maps/g, '<a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" class="text-primary no-underline">Google Maps listing for Madurai</a>')
      .replace(/Facebook/g, '<a href="https://business.facebook.com" target="_blank" rel="noopener noreferrer" class="text-primary no-underline">Facebook marketing for Madurai</a>')
      .replace(/Instagram/g, '<a href="https://business.instagram.com" target="_blank" rel="noopener noreferrer" class="text-primary no-underline">Instagram marketing for Madurai</a>');
    
    return processed;
  };

  // Split content by paragraphs for better rendering
  const contentParagraphs = post.content.split("\n\n");

  // Detect if user is on mobile
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Check for mobile device on client side
    const checkMobile = () => {
      setIsMobile(
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        window.innerWidth <= 768
      );
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Create structured data for SEO, with mobile optimization if needed
  const structuredData = isMobile ? 
    // Mobile-optimized structured data
    [
      getOrganizationData(),
      getBlogPostData(
        post.title,
        post.excerpt,
        `https://godivatech.com/blog/${post.slug}`,
        post.coverImage || "https://godivatech.com/assets/blog-default.jpg",
        new Date(post.publishedAt).toISOString(),
        new Date(post.publishedAt).toISOString(),
        post.authorName,
        post.authorImage || undefined
      ),
      getBreadcrumbData([
        { name: "Home", item: "https://godivatech.com/" },
        { name: "Blog", item: "https://godivatech.com/blog" },
        { name: post.title, item: `https://godivatech.com/blog/${post.slug}` }
      ])
    ] : 
    // Desktop structured data
    [
      getOrganizationData(),
      getWebPageData(
        `${post.title} | Best ${category?.name || 'Digital Services'} in Madurai`,
        `${post.excerpt} GodivaTech provides the best ${category?.name || 'digital services'} in Madurai, Tamil Nadu for businesses looking to grow their online presence.`,
        `https://godivatech.com/blog/${post.slug}`
      ),
      getBreadcrumbData([
        { name: "Home", item: "https://godivatech.com/" },
        { name: "Blog", item: "https://godivatech.com/blog" },
        { name: post.title, item: `https://godivatech.com/blog/${post.slug}` }
      ]),
      getBlogPostData(
        post.title,
        post.excerpt,
        `https://godivatech.com/blog/${post.slug}`,
        post.coverImage || "https://godivatech.com/assets/blog-default.jpg",
        new Date(post.publishedAt).toISOString(),
        new Date(post.publishedAt).toISOString(),
        post.authorName,
        post.authorImage || undefined
      )
    ];

  // Create custom keywords for this blog post
  const customKeywords = `${category?.name?.toLowerCase() || 'digital services'} Madurai, 
    best ${category?.name?.toLowerCase() || 'digital services'} in Tamil Nadu,
    ${post.title.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, '')},
    GodivaTech Madurai, IT company Tamil Nadu, 
    web development Madurai, digital marketing Madurai, app development Madurai`;

  // Determine if we should show AMP version for mobile users
  const showAmpVersion = isMobile && window.location.search.includes('amp=1');
  
  // If we're on mobile and the ?amp=1 parameter is present, show AMP version
  if (showAmpVersion) {
    // Convert any null to undefined for AmpBlogPost props
    const safePost = {
      ...post,
      coverImage: post.coverImage || undefined,
      authorImage: post.authorImage || undefined,
      authorName: post.authorName || "GodivaTech",
      publishedAt: post.publishedAt.toString()
    };
    
    return (
      <AmpBlogPost
        post={safePost}
        category={category}
        canonicalUrl={`https://godivatech.com/blog/${post.slug}`}
      />
    );
  }
  
  return (
    <>
      <SEO
        title={`${post.title} | Best ${category?.name || 'Digital Services'} in Madurai | GodivaTech`}
        description={`${post.excerpt} GodivaTech provides the best ${category?.name || 'digital services'} in Madurai, Tamil Nadu for businesses looking to grow their online presence.`}
        keywords={customKeywords}
        canonicalUrl={formatCanonicalUrl(`/blog/${post.slug}`)}
        ogType="article"
        ogImage={post.coverImage || 'https://godivatech.com/images/blog-default-og-image.jpg'}
        imageWidth={1200}
        imageHeight={630}
        cityName="Madurai"
        regionName="Tamil Nadu"
        countryName="India"
        postalCode="625007"
        neighborhood="Anna Nagar"
        twitterCard="summary_large_image"
        twitterSite="@godivatech"
        twitterCreator={post.authorName ? `@${post.authorName.toLowerCase().replace(/\s+/g, '')}` : '@godivatech'}
        robots="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        ampUrl={`/blog/${post.slug}/amp`}
        publishedTime={new Date(post.publishedAt).toISOString()}
        modifiedTime={new Date(post.publishedAt).toISOString()}
        author={post.authorName}
        section={category?.name || 'Digital Services'}
        facebookAppId="107394345671850"
        structuredData={structuredData}
        ogLocale="en_IN"
        alternateUrls={[
          { hrefLang: "en-in", href: `https://godivatech.com/blog/${post.slug}` },
          { hrefLang: "ta-in", href: `https://godivatech.com/ta/blog/${post.slug}` }
        ]}
      >
        {/* Add AMP link for mobile users */}
        {isMobile && (
          <link rel="amphtml" href={`${formatCanonicalUrl(`/blog/${post.slug}`)}?amp=1`} />
        )}
        
        {/* Add alternate language links */}
        <link rel="alternate" hrefLang="en-IN" href={formatCanonicalUrl(`/blog/${post.slug}`)} />
        <link rel="alternate" hrefLang="ta-IN" href={`${formatCanonicalUrl(`/blog/${post.slug}`)}?lang=ta`} />
        <link rel="alternate" hrefLang="x-default" href={formatCanonicalUrl(`/blog/${post.slug}`)} />
      </SEO>

      <section className="bg-white pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Enhanced breadcrumb navigation with structured data */}
          <Breadcrumbs 
            location={{ 
              city: "Madurai", 
              neighborhood: category && ["Digital Marketing", "SEO", "Web Development"].includes(category.name) 
                ? "Anna Nagar" 
                : "Iyer Bungalow" 
            }}
            className="mb-4"
          />
          
          <div className="flex flex-wrap mb-4">
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
                  {category?.name || "Uncategorized"}
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
                <OptimizedImage 
                  src={post.authorImage || '/assets/placeholder-author.png'} 
                  alt={post.authorName} 
                  className="w-12 h-12 rounded-full mr-4"
                  width={48}
                  height={48}
                  priority={true}
                />
                <div>
                  <p className="font-semibold text-neutral-800">{post.authorName}</p>
                  <p className="text-neutral-500 text-sm">Published {timeAgo}</p>
                </div>
              </div>
            </div>
            
            <div className="mb-10">
              <figure>
                <OptimizedImage 
                  src={post.coverImage || '/assets/blog-default.jpg'} 
                  alt={`${post.title} - GodivaTech Madurai - ${category?.name || 'Blog'}`} 
                  className="w-full h-auto rounded-lg shadow-lg"
                  width={800}
                  height={450}
                  priority={true}
                  sizes="100vw"
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
                          <a href={`#section-${idx}`} className="no-underline">
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
              <h3 className="text-2xl font-bold text-primary mb-4">Need the Best {category?.name || "Digital Services"} in Madurai?</h3>
              <p className="text-neutral-700 mb-6">
                As the leading software company in Madurai, GodivaTech specializes in professional {category?.name?.toLowerCase() || "digital services"} for businesses across Tamil Nadu. 
                Our experienced Madurai-based team can help you implement all the strategies discussed in this article with affordable, result-driven solutions.
              </p>
              <p className="text-neutral-700 mb-6">
                From <a href="https://www.godivatech.com/services/web-development" className="text-primary no-underline">expert web development</a> and <a href="https://www.godivatech.com/services/digital-marketing" className="text-primary no-underline">digital marketing</a> to <a href="https://www.godivatech.com/services/logo-brand-design" className="text-primary no-underline">professional branding</a>, we provide all the technical services your Madurai business needs to succeed online.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact" className="bg-primary hover:bg-primary/90 text-white py-3 px-6 rounded-lg inline-block text-center font-medium">
                  Contact Best {category?.name || "Digital"} Agency in Madurai
                </Link>
                <Link href={`/services/${category?.slug || ''}`} className="bg-white border border-primary text-primary hover:bg-primary/5 py-3 px-6 rounded-lg inline-block text-center font-medium">
                  View Our {category?.name || "Services"} in Madurai
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
