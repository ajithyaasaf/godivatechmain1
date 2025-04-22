import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import BlogCard from "@/components/blog/BlogCard";
import CategoryFilter from "@/components/blog/CategoryFilter";
import NewsletterSection from "@/components/home/NewsletterSection";
import { Button } from "@/components/ui/button";
import PageTransition, { TransitionItem } from "@/components/PageTransition";
import type { BlogPost, Category } from "@shared/schema";
import { getAllBlogPosts, getAllCategories, getBlogPostsByCategoryId, searchBlogPosts } from "@/lib/firestore";

// Animated empty state component
const EmptyState = ({ onReset }: { onReset: () => void }) => (
  <motion.div 
    className="text-center py-20"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <motion.div 
      className="w-24 h-24 mx-auto mb-6 rounded-full bg-neutral-100 flex items-center justify-center"
      animate={{ 
        scale: [1, 1.05, 1],
        rotate: [0, 5, 0, -5, 0],
      }}
      transition={{ 
        duration: 4,
        repeat: Infinity,
        repeatType: "loop"
      }}
    >
      <Search className="h-10 w-10 text-neutral-400" />
    </motion.div>
    
    <h3 className="text-2xl font-semibold text-neutral-800 mb-4">No articles found</h3>
    <p className="text-neutral-600 mb-8 max-w-md mx-auto">
      Try adjusting your search or filter to find what you're looking for.
    </p>
    <Button 
      onClick={onReset}
      className="px-6 py-2 rounded-full"
    >
      View All Articles
    </Button>
  </motion.div>
);

// Pagination component with animations
const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: { 
  currentPage: number; 
  totalPages: number; 
  onPageChange: (page: number) => void 
}) => (
  <motion.div 
    className="flex justify-center mt-12"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
  >
    <nav className="inline-flex items-center gap-1">
      <Button
        onClick={() => onPageChange(currentPage > 1 ? currentPage - 1 : 1)}
        disabled={currentPage === 1}
        variant="outline"
        size="icon"
        className="rounded-full w-10 h-10"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      {[...Array(totalPages)].map((_, i) => (
        <motion.div
          key={i}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={() => onPageChange(i + 1)}
            variant={currentPage === i + 1 ? "default" : "outline"}
            className={`w-10 h-10 rounded-full ${currentPage === i + 1 ? "bg-primary text-white" : ""}`}
            aria-label={`Page ${i + 1}`}
          >
            {i + 1}
          </Button>
        </motion.div>
      ))}
      
      <Button
        onClick={() => onPageChange(currentPage < totalPages ? currentPage + 1 : totalPages)}
        disabled={currentPage === totalPages}
        variant="outline"
        size="icon"
        className="rounded-full w-10 h-10"
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  </motion.div>
);

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const postsPerPage = 6;
  const [categories, setCategories] = useState<Category[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [postsData, categoriesData] = await Promise.all([
          getAllBlogPosts(),
          getAllCategories()
        ]);
        
        setBlogPosts(postsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Handle category changes
  useEffect(() => {
    const filterByCategory = async () => {
      if (activeCategory === null) {
        // If no category filter, load all posts
        const posts = await getAllBlogPosts();
        setBlogPosts(posts);
      } else if (activeCategory > 0) {
        // If specific category selected, filter by category
        const filteredPosts = await getBlogPostsByCategoryId(activeCategory);
        setBlogPosts(filteredPosts);
      }
    };
    
    filterByCategory();
  }, [activeCategory]);
  
  // Handle search term changes
  useEffect(() => {
    const handleSearch = async () => {
      if (searchTerm.trim() === '') {
        // If search term is empty, reset to all posts or filtered by category
        if (activeCategory === null || activeCategory === 0) {
          const posts = await getAllBlogPosts();
          setBlogPosts(posts);
        } else {
          const filteredPosts = await getBlogPostsByCategoryId(activeCategory);
          setBlogPosts(filteredPosts);
        }
      } else {
        // Search posts
        const searchResults = await searchBlogPosts(searchTerm);
        
        // If category is also selected, filter the search results by category
        if (activeCategory !== null && activeCategory > 0) {
          setBlogPosts(searchResults.filter(post => post.categoryId === activeCategory));
        } else {
          setBlogPosts(searchResults);
        }
      }
    };
    
    // Debounce search for better performance
    const debounceTimer = setTimeout(handleSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, activeCategory]);

  // Filter posts by category and search term
  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = !activeCategory || post.categoryId === activeCategory;
    const matchesSearch = !searchTerm || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const displayPosts = filteredPosts.slice((page - 1) * postsPerPage, page * postsPerPage);

  // Default categories in case API doesn't return data
  const defaultCategories = [
    { id: 0, name: "All Topics", slug: "all" },
    { id: 1, name: "Technology Trends", slug: "technology-trends" },
    { id: 2, name: "Cloud Computing", slug: "cloud-computing" },
    { id: 3, name: "Cybersecurity", slug: "cybersecurity" },
    { id: 4, name: "AI & Machine Learning", slug: "ai-machine-learning" }
  ];

  const displayCategories = categories.length > 0 
    ? [{ id: 0, name: "All Topics", slug: "all" }, ...categories] 
    : defaultCategories;

  const handleCategoryChange = (categoryId: number | null) => {
    setActiveCategory(categoryId);
    setPage(1); // Reset to first page when changing category
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page when searching
  };

  const resetFilters = () => {
    setActiveCategory(null);
    setSearchTerm("");
    setPage(1);
  };

  return (
    <>
      <Helmet>
        <title>Digital Marketing & Web Development Blog | GodivaTech Madurai</title>
        <meta 
          name="description" 
          content="Get expert web development, digital marketing, and design tips from Madurai's leading tech company. Practical advice for local businesses to grow online." 
        />
        <meta name="keywords" content="web development Madurai, digital marketing Madurai, website design Madurai, social media marketing Madurai, mobile app development Tamil Nadu" />
        <meta property="og:title" content="Digital Marketing & Web Development Blog | GodivaTech Madurai" />
        <meta property="og:description" content="Expert web development and digital marketing tips for Madurai businesses. Learn how to grow your local business online with GodivaTech's practical guides." />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_IN" />
      </Helmet>

      <PageTransition>
        <div className="relative">
          {/* Hero section */}
          <TransitionItem>
            <section className="relative py-24 overflow-hidden">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-indigo-700"></div>
              
              {/* Animated patterns */}
              <motion.div 
                className="absolute inset-0"
                style={{ 
                  backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
                  backgroundSize: '20px 20px' 
                }}
                animate={{ 
                  backgroundPosition: ['0% 0%', '100% 100%'] 
                }}
                transition={{ 
                  duration: 25, 
                  ease: "linear", 
                  repeat: Infinity, 
                  repeatType: "reverse" 
                }}
              />
              
              {/* Content */}
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto text-white">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                  >
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">
                      Madurai <span className="text-blue-200">Digital Marketing</span> & Web Design Blog
                    </h1>
                    <p className="text-xl text-white/90 mb-8">
                      Expert tips and strategies for Madurai businesses to grow online with web development, digital marketing, and branding solutions.
                    </p>
                  </motion.div>
                  
                  {/* Search bar animation */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="max-w-md mx-auto"
                  >
                    <form onSubmit={handleSearch} className="relative">
                      <input
                        type="text"
                        placeholder="Search articles..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="py-3 px-6 pr-12 rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent w-full"
                      />
                      <button 
                        type="submit" 
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors"
                        aria-label="Search"
                      >
                        <Search className="h-5 w-5" />
                      </button>
                    </form>
                  </motion.div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -bottom-24 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-white/5 backdrop-blur-sm"></div>
              <motion.div 
                className="absolute top-1/3 right-10 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"
                animate={{ y: [0, -30, 0], opacity: [0.2, 0.3, 0.2] }}
                transition={{ duration: 8, repeat: Infinity }}
              />
              <motion.div 
                className="absolute bottom-0 left-10 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"
                animate={{ y: [0, 30, 0], opacity: [0.2, 0.3, 0.2] }}
                transition={{ duration: 8, repeat: Infinity, delay: 1 }}
              />
            </section>
          </TransitionItem>

          {/* Content section */}
          <TransitionItem delay={0.1}>
            <section className="py-20 bg-neutral-50/50 relative">
              {/* Subtle grid pattern */}
              <div className="absolute inset-0 
                [background-image:linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] 
                [background-size:4rem_4rem]" />
                
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Filter controls */}
                <motion.div 
                  className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <CategoryFilter 
                    categories={displayCategories}
                    activeCategory={activeCategory}
                    onCategoryChange={handleCategoryChange}
                  />
                </motion.div>

                <AnimatePresence mode="wait">
                  {filteredPosts.length > 0 ? (
                    <motion.div
                      key="results"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
                        {displayPosts.map((post, index) => (
                          <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ 
                              duration: 0.5, 
                              delay: index * 0.1,
                              ease: "easeOut"
                            }}
                          >
                            <BlogCard post={post} />
                          </motion.div>
                        ))}
                      </div>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <Pagination 
                          currentPage={page} 
                          totalPages={totalPages} 
                          onPageChange={setPage} 
                        />
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <EmptyState onReset={resetFilters} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </section>
          </TransitionItem>

          {/* Newsletter section */}
          <TransitionItem delay={0.2}>
            <NewsletterSection />
          </TransitionItem>
        </div>
      </PageTransition>
    </>
  );
};

export default Blog;
