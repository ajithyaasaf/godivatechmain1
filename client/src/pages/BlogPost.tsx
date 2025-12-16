import React, { useEffect, useState, useMemo, memo } from "react";
import { useParams, Link, useLocation } from "wouter";
import { formatDistanceToNow, format } from "date-fns";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import NewsletterSection from "@/components/home/NewsletterSection";
import BlogCard from "@/components/blog/BlogCard";
import { Button } from "@/components/ui/button";
import type { BlogPost, Category } from "@/lib/schema";
import { useQuery } from "@tanstack/react-query";
import SEO from "@/components/SEO";
import AmpBlogPost from "@/components/AmpBlogPost";
import OptimizedImage from "@/components/ui/optimized-image";
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

  // Use React Query to fetch blog posts and categories
  const { data: allBlogPosts = [], isLoading: postsLoading } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog-posts'],
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const loading = postsLoading || categoriesLoading;

  // Find the current post by slug
  const post = allBlogPosts.find(p => p.slug === slug) || null;

  // Find the category for this post
  const category = post && post.categoryId
    ? categories.find(c => c.id === post.categoryId) || null
    : null;

  // Find related posts (same category, different post)
  const relatedPosts = post && post.categoryId
    ? allBlogPosts
      .filter(p => p.categoryId === post.categoryId && p.id !== post.id)
      .slice(0, 3)
    : [];

  // Get SEO fields with fallbacks
  const seoTitle = post?.metaTitle || post?.title || "";
  const seoDescription = post?.metaDescription || post?.excerpt || "";
  const seoImageAlt = post?.coverImageAlt || post?.title || "";
  const focusKeyword = post?.focusKeyword || "";
  const tags = post?.tags || [];

  useEffect(() => {
    // If we have posts loaded but can't find the post by slug, redirect to blog
    if (!loading && !post && slug) {
      navigate("/blog");
      return;
    }

    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [slug, navigate, post, loading]);

  if (loading) {
    return <div className="py-20 text-center">Loading...</div>;
  }

  if (!post) {
    return <div className="py-20 text-center">Blog post not found.</div>;
  }

  const formattedDate = format(new Date(post.publishedAt), "MMMM dd, yyyy");
  const timeAgo = formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true });

  // Custom link transformer to add SEO-optimized internal linking
  const transformKeywordsToLinks = (content: string) => {
    return content
      // Add internal links to services with targeted SEO keywords for Madurai
      .replace(/Web Development/g, '[best web development in Madurai](https://www.godivatech.com/services/web-development)')
      .replace(/Digital Marketing/g, '[top digital marketing agency in Madurai](https://www.godivatech.com/services/digital-marketing)')
      .replace(/Mobile App/g, '[mobile app development company in Madurai](https://www.godivatech.com/services/app-development)')
      .replace(/ SEO /g, ' [SEO services in Madurai](https://www.godivatech.com/services/digital-marketing) ')
      .replace(/Logo Design/g, '[professional logo design in Madurai](https://www.godivatech.com/services/logo-brand-design)')
      .replace(/UI\/UX Design/g, '[UI/UX design services in Madurai](https://www.godivatech.com/services/ui-ux-design)')
      .replace(/Brand Design/g, '[brand design company in Madurai](https://www.godivatech.com/services/logo-brand-design)')
      .replace(/Poster Design/g, '[poster design services in Madurai](https://www.godivatech.com/services/poster-design)')

      // Add Madurai-specific business keywords
      .replace(/business website/gi, '[business website development in Madurai](https://www.godivatech.com/services/web-development)')
      .replace(/online presence/gi, '[digital presence for Madurai businesses](https://www.godivatech.com/services/digital-marketing)')
      .replace(/social media/gi, '[social media marketing in Madurai](https://www.godivatech.com/services/digital-marketing)')
      .replace(/local business/gi, '[Madurai local business solutions](https://www.godivatech.com/about)')
      .replace(/ecommerce/gi, '[eCommerce website development in Madurai](https://www.godivatech.com/services/web-development)')
      .replace(/website design/gi, '[best website design in Madurai](https://www.godivatech.com/services/web-development)')
      .replace(/responsive website/gi, '[responsive website design in Madurai](https://www.godivatech.com/services/web-development)')
      .replace(/professional website/gi, '[professional website development in Madurai](https://www.godivatech.com/services/web-development)')
      .replace(/branding/gi, '[branding services in Madurai](https://www.godivatech.com/services/logo-brand-design)')
      .replace(/content marketing/gi, '[content marketing services in Madurai](https://www.godivatech.com/services/digital-marketing)')
      .replace(/Tamil Nadu/gi, '[best IT company in Tamil Nadu](https://www.godivatech.com/about)')

      // Replace GodivaTech mentions
      .replace(/GodivaTech/g, '[GodivaTech - best software company in Madurai](https://www.godivatech.com/about')

      // Add external authoritative links
      .replace(/Google My Business/g, '[Google My Business for Madurai companies](https://business.google.com)')
      .replace(/Google Maps/g, '[Google Maps listing for Madurai](https://maps.google.com)')
      .replace(/Facebook/g, '[Facebook marketing for Madurai](https://business.facebook.com)')
      .replace(/Instagram/g, '[Instagram marketing for Madurai](https://business.instagram.com)');
  };

  // Pre-process content with SEO keyword links
  const processedContent = transformKeywordsToLinks(post.content);

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

  // Create custom keywords for this blog post including focus keyword and tags
  const baseKeywords = `${category?.name?.toLowerCase() || 'digital services'} Madurai, 
    best ${category?.name?.toLowerCase() || 'digital services'} in Tamil Nadu,
    ${post.title.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, '')},
    GodivaTech Madurai, IT company Tamil Nadu, 
    web development Madurai, digital marketing Madurai, app development Madurai`;

  const customKeywords = [
    focusKeyword,
    ...tags,
    baseKeywords
  ].filter(Boolean).join(", ");

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
        title={seoTitle ? `${seoTitle} | GodivaTech` : `${post.title} | Best ${category?.name || 'Digital Services'} in Madurai | GodivaTech`}
        description={seoDescription || `${post.excerpt} GodivaTech provides the best ${category?.name || 'digital services'} in Madurai, Tamil Nadu for businesses looking to grow their online presence.`}
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
                  alt={seoImageAlt || `${post.title} - GodivaTech Madurai - ${category?.name || 'Blog'}`}
                  className="w-full h-auto rounded-lg shadow-lg"
                  width={800}
                  height={450}
                  sizes="100vw"
                />
                <figcaption className="text-center text-neutral-500 text-sm mt-2">
                  {post.title} | GodivaTech Madurai
                </figcaption>
              </figure>
            </div>


            {/* Blog Content with Proper Markdown Rendering */}
            <article className="prose prose-lg max-w-none mb-12">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  // Map H1 to H2 (enforce single H1 per page - page title only)
                  h1: ({ node, ...props }) => <h2 className="text-3xl font-bold text-neutral-800 mt-8 mb-4" {...props} />,
                  h2: ({ node, ...props }) => <h2 className="text-2xl font-bold text-neutral-800 mt-8 mb-4" {...props} />,
                  h3: ({ node, ...props }) => <h3 className="text-xl font-semibold text-neutral-800 mt-6 mb-3" {...props} />,
                  h4: ({ node, ...props }) => <h4 className="text-lg font-semibold text-neutral-700 mt-4 mb-2" {...props} />,
                  p: ({ node, ...props }) => <p className="text-neutral-700 mb-4 leading-relaxed" {...props} />,
                  ul: ({ node, ...props }) => <ul className="list-disc pl-5 my-4 space-y-2" {...props} />,
                  ol: ({ node, ...props }) => <ol className="list-decimal pl-5 my-4 space-y-2" {...props} />,
                  li: ({ node, ...props }) => <li className="text-neutral-700" {...props} />,
                  a: ({ node, ...props }) => (
                    <a
                      className="text-primary no-underline hover:underline"
                      target={props.href?.startsWith('http') ? '_blank' : undefined}
                      rel={props.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                      {...props}
                    />
                  ),
                  strong: ({ node, ...props }) => <strong className="font-semibold text-neutral-900" {...props} />,
                  em: ({ node, ...props }) => <em className="italic" {...props} />,
                  code: ({ node, inline, ...props }: any) =>
                    inline
                      ? <code className="bg-neutral-100 px-1.5 py-0.5 rounded text-sm font-mono text-neutral-800" {...props} />
                      : <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto my-4"><code {...props} />
                      </pre>,
                  blockquote: ({ node, ...props }) => (
                    <blockquote className="border-l-4 border-primary pl-4 italic text-neutral-600 my-4" {...props} />
                  ),
                }}
              >
                {processedContent}
              </ReactMarkdown>
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
