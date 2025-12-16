import React, { useState, memo, useMemo, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import BlogCard from "../blog/BlogCard";
import CategoryFilter from "../blog/CategoryFilter";
import { LazyMotion, domAnimation, m } from "framer-motion";

// Import the ExtendedBlogPost type from schema
import type { ExtendedBlogPost } from "@/lib/schema";

interface Category {
  id: number;
  name: string;
  slug: string;
}

// Optimize BlogSection with memoization
const BlogSection = memo(() => {
  // Local state for tracking selected category
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [, setLocation] = useLocation();

  // Fetch categories and blog posts data
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const { data: blogPosts = [] } = useQuery<ExtendedBlogPost[]>({
    queryKey: ['/api/blog-posts'],
  });

  // Memoize default blog posts to prevent recreation on each render
  const defaultPosts = useMemo<ExtendedBlogPost[]>(() => [
    {
      id: 1,
      title: "The Future of Edge Computing in 2023 and Beyond",
      slug: "future-of-edge-computing",
      excerpt: "Explore how edge computing is revolutionizing data processing and enabling new applications in IoT, autonomous vehicles, and more.",
      content: "Full content of the article goes here...",
      published: true,
      publishedAt: "2023-06-15T00:00:00.000Z",
      coverImage: "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      coverImageAlt: "Edge computing network visualization",
      metaTitle: null,
      metaDescription: null,
      focusKeyword: null,
      tags: [],
      authorName: "Sarah Johnson",
      authorImage: "https://randomuser.me/api/portraits/women/76.jpg",
      categoryId: 1,
      category: {
        id: 1,
        name: "Web & Mobile Development",
        slug: "web-mobile-development"
      }
    },
    {
      id: 2,
      title: "Local SEO Guide for Tamil Nadu Businesses",
      slug: "local-seo-guide-tamil-nadu",
      excerpt: "Learn proven SEO strategies to rank higher on Google and attract more local customers in Madurai and across Tamil Nadu.",
      content: "Full content of the article goes here...",
      published: true,
      publishedAt: "2023-05-28T00:00:00.000Z",
      coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      coverImageAlt: "SEO analytics dashboard",
      metaTitle: null,
      metaDescription: null,
      focusKeyword: null,
      tags: [],
      authorName: "David Rodriguez",
      authorImage: "https://randomuser.me/api/portraits/men/22.jpg",
      categoryId: 2,
      category: {
        id: 2,
        name: "Digital Marketing & SEO",
        slug: "digital-marketing-seo"
      }
    },
    {
      id: 3,
      title: "How AI Chatbots Improve Your Website Customer Support",
      slug: "ai-chatbots-customer-support",
      excerpt: "Discover how AI-powered chatbots can transform your website's customer experience and reduce support costs.",
      content: "Full content of the article goes here...",
      published: true,
      publishedAt: "2023-05-10T00:00:00.000Z",
      coverImage: "https://images.unsplash.com/photo-1607798748738-b15c40d33d57?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      coverImageAlt: "AI chatbot customer service interface",
      metaTitle: null,
      metaDescription: null,
      focusKeyword: null,
      tags: [],
      authorName: "Emily Patel",
      authorImage: "https://randomuser.me/api/portraits/women/38.jpg",
      categoryId: 3,
      category: {
        id: 3,
        name: "ERP, Billing & Custom Software",
        slug: "erp-billing-custom-software"
      }
    }
  ], []);

  // Memoize default categories - aligned with GodivaTech services for SEO
  const defaultCategories = useMemo(() => [
    { id: -1, name: "All Topics", slug: "all" },
    { id: 1, name: "Web & Mobile Development", slug: "web-mobile-development" },
    { id: 2, name: "Digital Marketing & SEO", slug: "digital-marketing-seo" },
    { id: 3, name: "ERP, Billing & Custom Software", slug: "erp-billing-custom-software" },
    { id: 4, name: "Design & Branding", slug: "design-branding" }
  ], []);

  // Memoize computed values based on dependencies
  const allTopicsCategory = useMemo(() => ({ id: -1, name: "All Topics", slug: "all" }), []);

  const displayCategories = useMemo(() =>
    categories.length > 0
      ? [allTopicsCategory, ...categories]
      : defaultCategories
    , [categories, allTopicsCategory, defaultCategories]);

  // Filter and prepare posts based on active category
  const filteredPosts = useMemo(() =>
    activeCategory
      ? blogPosts.filter(post => post.categoryId === activeCategory)
      : blogPosts
    , [blogPosts, activeCategory]);

  // Only show latest 3 posts on home page
  const displayPosts = useMemo(() => filteredPosts.slice(0, 3), [filteredPosts]);

  const finalPosts = useMemo(() =>
    displayPosts.length > 0 ? displayPosts : defaultPosts
    , [displayPosts, defaultPosts]);

  // Memoize event handlers with useCallback
  const handleCategoryChange = useCallback((categoryId: number | null) => {
    setActiveCategory(categoryId === -1 ? null : categoryId);

    // If a category is selected (not All Topics), navigate to the category page
    if (categoryId !== null && categoryId !== -1) {
      const category = categories.find(c => c.id === categoryId);
      if (category) {
        setLocation(`/blog/category/${category.slug}`);
      }
    } else {
      // For "All Topics", navigate to the main blog page
      setLocation('/blog');
    }
  }, [categories, setLocation]);

  // Animation variants for section elements
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section id="blog" className="py-20 bg-white relative">
      {/* Subtle background pattern for visual interest */}
      <div className="absolute inset-0 opacity-5 
        [background-image:linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] 
        [background-size:8rem_8rem]"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <LazyMotion features={domAnimation} strict>
          <m.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={containerVariants}
          >
            <m.h2
              className="text-3xl font-bold text-neutral-800 mb-4"
              variants={itemVariants}
            >
              Latest Insights
            </m.h2>
            <m.p
              className="text-lg text-neutral-600 max-w-2xl mx-auto"
              variants={itemVariants}
            >
              Expert web development, digital marketing, and business software insights for Madurai businesses.
            </m.p>
          </m.div>

          <m.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <CategoryFilter
              categories={displayCategories}
              activeCategory={activeCategory}
              onCategoryChange={handleCategoryChange}
            />
          </m.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {finalPosts.map((post, index) => (
              <m.div
                key={post.id ? `post-${post.id}` : `post-${post.slug}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{
                  duration: 0.5,
                  delay: Math.min(0.1 * index, 0.3),
                  ease: "easeOut"
                }}
                style={{ willChange: "transform, opacity" }}
              >
                <BlogCard
                  post={post}
                  index={index}
                />
              </m.div>
            ))}
          </div>

          <m.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button
              asChild
              variant="outline"
              className="bg-white border border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-300"
            >
              <Link href="/blog">View All Articles</Link>
            </Button>
          </m.div>
        </LazyMotion>
      </div>
    </section>
  );
});

// Add displayName for React DevTools
BlogSection.displayName = "BlogSection";

export default BlogSection;
