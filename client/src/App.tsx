import { Switch, Route, useLocation } from "wouter";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import Layout from "@/components/Layout";

// Public pages
import Home from "@/pages/Home";
import About from "@/pages/About";
import Services from "@/pages/Services";
import ServiceDetail from "@/pages/ServiceDetail";
import Portfolio from "@/pages/Portfolio";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";

// Admin pages
import AdminDashboard from "@/pages/admin";
import BlogPostsPage from "@/pages/admin/blog-posts";
import CategoriesPage from "@/pages/admin/categories";
import ServicesPage from "@/pages/admin/services";
import TeamMembersPage from "@/pages/admin/team-members";
import TestimonialsPage from "@/pages/admin/testimonials";
import ProjectsPage from "@/pages/admin/projects";
import ContactMessagesPage from "@/pages/admin/contact-messages";
import SubscribersPage from "@/pages/admin/subscribers";

/**
 * Modern App wrapper with advanced AnimatePresence for page transitions
 */
function App() {
  const [location] = useLocation();
  
  // Determine if we're on an admin route
  const isAdminRoute = location.startsWith("/admin");
  
  return (
    <AuthProvider>
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
            <Switch key={location}>
              <Route path="/" component={Home} />
              <Route path="/about" component={About} />
              <Route path="/services" component={Services} />
              <Route path="/services/:slug" component={ServiceDetail} />
              <Route path="/portfolio" component={Portfolio} />
              <Route path="/blog" component={Blog} />
              <Route path="/blog/:slug" component={BlogPost} />
              <Route path="/contact" component={Contact} />
              <Route path="/auth" component={AuthPage} />
              <Route component={NotFound} />
            </Switch>
          </AnimatePresence>
        </Layout>
      )}
      
      {/* Admin routes without Layout wrapper */}
      {isAdminRoute && (
        <Switch key={location}>
          {/* Admin routes protected by authentication */}
          <ProtectedRoute path="/admin" component={AdminDashboard} />
          <ProtectedRoute path="/admin/blog-posts" component={BlogPostsPage} />
          <ProtectedRoute path="/admin/categories" component={CategoriesPage} />
          <ProtectedRoute path="/admin/services" component={ServicesPage} />
          <ProtectedRoute path="/admin/team-members" component={TeamMembersPage} />
          <ProtectedRoute path="/admin/testimonials" component={TestimonialsPage} />
          <ProtectedRoute path="/admin/projects" component={ProjectsPage} />
          <ProtectedRoute path="/admin/contact-messages" component={ContactMessagesPage} />
          <ProtectedRoute path="/admin/subscribers" component={SubscribersPage} />
          
          <Route component={NotFound} />
        </Switch>
      )}
    </AuthProvider>
  );
}

export default App;
