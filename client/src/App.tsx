// This is app.tsx - Main application entry point
import { Switch, Route, useLocation } from "wouter";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/lib/protected-route";
import Layout from "@/components/Layout";
import { Suspense, lazy, useEffect } from "react";
import PerformanceMonitor from "@/components/PerformanceMonitor";
import ResourceHints from "@/components/ResourceHints";
import { trackLongTasks, preloadCriticalResources } from "@/lib/performance";
import LCPOptimizer from "@/components/performance/LCPOptimizer";
import FontOptimizer from "@/components/performance/FontOptimizer";
import CriticalCSSOptimizer from "@/components/performance/CriticalCSSOptimizer";
import { usePageHistory } from "@/hooks/use-page-history";
import { initializePerformanceOptimizations } from "@/lib/performance";
import { useAnalytics } from "@/hooks/use-analytics";

// Optimized loading component with minimal DOM updates and better UX
import OptimizedLoadingIndicator from "@/components/OptimizedLoadingIndicator";

const PageLoading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <OptimizedLoadingIndicator 
      isLoading={true}
      minDelay={200}
      loadingText="Loading page..."
      fallback={
        <div className="animate-pulse space-y-4 p-4">
          <div className="h-6 bg-gray-200 rounded w-1/4 mx-auto"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      }
    />
  </div>
);

// Lazy load all pages for code splitting
// Only the Home page is loaded eagerly for fast initial load
import Home from "@/pages/Home";

// Public pages - lazy loaded
const About = lazy(() => import("@/pages/About"));
const Services = lazy(() => import("@/pages/Services"));
const ServiceDetail = lazy(() => import("@/pages/ServiceDetail"));
const Portfolio = lazy(() => import("@/pages/Portfolio"));
const Blog = lazy(() => import("@/pages/Blog"));
const BlogPost = lazy(() => import("@/pages/BlogPost"));
const Contact = lazy(() => import("@/pages/Contact"));
const NotFound = lazy(() => import("@/pages/not-found"));
const AuthPage = lazy(() => import("@/pages/auth-page"));
// Diagnostics page removed for production

// Admin pages - lazy loaded
const AdminDashboard = lazy(() => import("@/pages/admin"));
const BlogPostsPage = lazy(() => import("@/pages/admin/blog-posts"));
const CategoriesPage = lazy(() => import("@/pages/admin/categories"));
const ServicesPage = lazy(() => import("@/pages/admin/services"));
const TeamMembersPage = lazy(() => import("@/pages/admin/team-members"));
const TestimonialsPage = lazy(() => import("@/pages/admin/testimonials"));
const ProjectsPage = lazy(() => import("@/pages/admin/projects"));
const ContactMessagesPage = lazy(
  () => import("@/pages/admin/contact-messages"),
);
const SubscribersPage = lazy(() => import("@/pages/admin/subscribers"));

/**
 * Modern App wrapper with advanced AnimatePresence for page transitions
 */
function App() {
  const [location] = useLocation();

  // Determine if we're on an admin route
  const isAdminRoute = location.startsWith("/admin");
  
  // Track page navigation for the 404 page history feature
  usePageHistory();
  
  // Initialize Google Analytics and track page views
  useAnalytics();
  
  // Initialize performance tracking and Core Web Vitals optimizations
  useEffect(() => {
    // Initialize Google Analytics if we have a measurement ID
    const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID;
    if (gaId) {
      // Analytics will be initialized by useAnalytics hook
      console.log("Google Analytics Measurement ID detected");
    } else {
      console.warn("Missing Google Analytics Measurement ID");
    }
    
    // Track long tasks to identify performance bottlenecks
    trackLongTasks((duration) => {
      if (import.meta.env.DEV) {
        console.warn(`Long task detected: ${duration.toFixed(2)}ms`);
      }
    });
    
    // Initialize all performance optimizations for Core Web Vitals
    initializePerformanceOptimizations();
    
    // Preload critical resources
    preloadCriticalResources([
      // Hero image
      '/home-hero.jpg',
      // Fonts
      '/fonts/main-font.woff2',
      // Critical CSS
      '/critical.css'
    ]);
    
    // Report Core Web Vitals to console in development
    if (import.meta.env.DEV) {
      setTimeout(() => {
        if ('performance' in window) {
          // Get the paint metrics
          const paintMetrics = performance.getEntriesByType('paint');
          paintMetrics.forEach(metric => {
            console.log(`${metric.name}: ${metric.startTime.toFixed(2)}ms`);
          });
          
          // Get LCP if available
          try {
            const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
            if (lcpEntries.length > 0) {
              console.log(`Largest Contentful Paint: ${lcpEntries[0].startTime.toFixed(2)}ms`);
            }
          } catch (e) {
            // LCP not supported
          }
        }
      }, 3000);
    }
    
    // Clean up event listeners on unmount
    return () => {
      // Cleanup code here if needed
    };
  }, []);

  return (
    <AuthProvider>
      {/* Add resource hints for performance optimization */}
      <ResourceHints />
      
      {/* Performance optimization components - CriticalCSSOptimizer temporarily removed to fix colors */}
      <LCPOptimizer />
      
      {/* Performance monitoring tool - only visible in development */}
      {import.meta.env.DEV && <PerformanceMonitor />}

      {!isAdminRoute && (
        <Layout>
          {/* 
            AnimatePresence from framer-motion allows for exit animations
            The mode="wait" ensures the exiting component finishes animating before the entering component starts
          */}
          <AnimatePresence mode="wait" initial={false}>
            {/* 
              Key is necessary for AnimatePresence to identify when the route changes
              Using location as a key forces re-render on route change
            */}
            <Suspense fallback={<PageLoading />}>
              <Switch key={location}>
                <Route path="/" component={Home} />
                <Route path="/about" component={About} />
                <Route path="/services" component={Services} />
                <Route path="/services/:slug" component={ServiceDetail} />
                <Route path="/portfolio" component={Portfolio} />
                <Route path="/blog" component={Blog} />
                <Route path="/blog/category/:categorySlug" component={Blog} />
                <Route path="/blog/:slug" component={BlogPost} />
                <Route path="/contact" component={Contact} />
                <Route path="/auth" component={AuthPage} />
                {/* Diagnostics route removed for production */}
                <Route component={NotFound} />
              </Switch>
            </Suspense>
          </AnimatePresence>
        </Layout>
      )}

      {/* Admin routes without Layout wrapper */}
      {isAdminRoute && (
        <Suspense fallback={<PageLoading />}>
          <Switch key={location}>
            {/* Admin routes protected by authentication */}
            <ProtectedRoute path="/admin" component={AdminDashboard} />
            <ProtectedRoute
              path="/admin/blog-posts"
              component={BlogPostsPage}
            />
            <ProtectedRoute
              path="/admin/categories"
              component={CategoriesPage}
            />
            <ProtectedRoute path="/admin/services" component={ServicesPage} />
            <ProtectedRoute
              path="/admin/team-members"
              component={TeamMembersPage}
            />
            <ProtectedRoute
              path="/admin/testimonials"
              component={TestimonialsPage}
            />
            <ProtectedRoute path="/admin/projects" component={ProjectsPage} />
            <ProtectedRoute
              path="/admin/contact-messages"
              component={ContactMessagesPage}
            />
            <ProtectedRoute
              path="/admin/subscribers"
              component={SubscribersPage}
            />

            <Route component={NotFound} />
          </Switch>
        </Suspense>
      )}
    </AuthProvider>
  );
}

export default App;
