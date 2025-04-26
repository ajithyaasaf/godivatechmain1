import React, { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import BlogCard from "../blog/BlogCard";
import CategoryFilter from "../blog/CategoryFilter";

// Import the BlogPost type from schema
import type { BlogPost as BaseBlogPost } from "@shared/schema";

// Extend the BlogPost type to include a category property
interface ExtendedBlogPost extends BaseBlogPost {
  category?: {
    id: number;
    name: string;
    slug: string;
  };
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

const BlogSection = () => {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const { data: blogPosts = [] } = useQuery<ExtendedBlogPost[]>({
    queryKey: ['/api/blog-posts'],
  });

  // Filter posts by category if one is selected
  const filteredPosts = activeCategory
    ? blogPosts.filter(post => post.categoryId === activeCategory)
    : blogPosts;

  // Only show latest 3 posts on home page
  const displayPosts = filteredPosts.slice(0, 3);

  // Default blog posts in case API doesn't return data
  const defaultPosts = [
    {
      id: 1,
      title: "The Future of Edge Computing in 2023 and Beyond",
      slug: "future-of-edge-computing",
      excerpt: "Explore how edge computing is revolutionizing data processing and enabling new applications in IoT, autonomous vehicles, and more.",
      publishedAt: "2023-06-15T00:00:00.000Z",
      coverImage: "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      authorName: "Sarah Johnson",
      authorImage: "https://randomuser.me/api/portraits/women/76.jpg",
      categoryId: 1,
      category: {
        id: 1,
        name: "Technology Trends",
        slug: "technology-trends"
      }
    },
    {
      id: 2,
      title: "5 Essential Cybersecurity Measures Every Business Needs",
      slug: "essential-cybersecurity-measures",
      excerpt: "Learn about the critical security controls that can protect your organization from the most common cyber threats.",
      publishedAt: "2023-05-28T00:00:00.000Z",
      coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      authorName: "David Rodriguez",
      authorImage: "https://randomuser.me/api/portraits/men/22.jpg",
      categoryId: 2,
      category: {
        id: 2,
        name: "Cybersecurity",
        slug: "cybersecurity"
      }
    },
    {
      id: 3,
      title: "How AI is Transforming Customer Service Experiences",
      slug: "ai-transforming-customer-service",
      excerpt: "Discover how artificial intelligence is revolutionizing customer support through chatbots, sentiment analysis, and predictive service.",
      publishedAt: "2023-05-10T00:00:00.000Z",
      coverImage: "https://images.unsplash.com/photo-1607798748738-b15c40d33d57?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      authorName: "Emily Patel",
      authorImage: "https://randomuser.me/api/portraits/women/38.jpg",
      categoryId: 3,
      category: {
        id: 3,
        name: "AI & Machine Learning",
        slug: "ai-machine-learning"
      }
    }
  ];

  // Default categories in case API doesn't return data
  const defaultCategories = [
    { id: 0, name: "All Topics", slug: "all" },
    { id: 1, name: "Technology Trends", slug: "technology-trends" },
    { id: 2, name: "Cloud Computing", slug: "cloud-computing" },
    { id: 3, name: "Cybersecurity", slug: "cybersecurity" },
    { id: 4, name: "AI & Machine Learning", slug: "ai-machine-learning" }
  ];

  // Ensure "All Topics" category has a unique ID
  const allTopicsCategory = { id: -1, name: "All Topics", slug: "all" };
  const displayCategories = categories.length > 0 
    ? [allTopicsCategory, ...categories] 
    : defaultCategories;

  const finalPosts = displayPosts.length > 0 ? displayPosts : defaultPosts;

  const handleCategoryChange = (categoryId: number | null) => {
    // If the "All Topics" category is selected (-1), set to null
    setActiveCategory(categoryId === -1 ? null : categoryId);
  };

  return (
    <section id="blog" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-neutral-800 mb-4">Latest Insights</h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Stay up-to-date with the latest technology trends and insights from our experts.
          </p>
        </div>

        <CategoryFilter 
          categories={displayCategories}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {finalPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            asChild
            variant="outline"
            className="bg-white border border-primary text-primary hover:bg-primary hover:text-white"
          >
            <Link href="/blog">View All Articles</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
