import { Switch, Route, useLocation } from "wouter";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "@/hooks/use-auth";
import { FirebaseAuthProvider } from "@/hooks/use-firebase-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import { FirebaseProtectedRoute } from "@/components/firebase-protected-route";
import Layout from "@/components/Layout";

// Public pages
import Home from "@/pages/Home";
import About from "@/pages/About";
import Services from "@/pages/Services";
import Portfolio from "@/pages/Portfolio";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import FirebaseAuthPage from "@/pages/firebase-auth";

// Admin pages
import AdminDashboard from "@/pages/admin";
import BlogPostsPage from "@/pages/admin/blog-posts";

/**
 * Modern App wrapper with advanced AnimatePresence for page transitions
 */
function App() {
  const [location] = useLocation();
  
  // Determine if we're on an admin route
  const isAdminRoute = location.startsWith("/admin");
  
  return (
    <FirebaseAuthProvider>
      <AuthProvider>
        {!isAdminRoute && (
          <Layout>
            {/* 
              AnimatePresence from framer-motion allows for exit animations
              The exitBeforeEnter prop ensures the exiting component finishes animating before the entering component starts
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
                <Route path="/portfolio" component={Portfolio} />
                <Route path="/blog" component={Blog} />
                <Route path="/blog/:slug" component={BlogPost} />
                <Route path="/contact" component={Contact} />
                <Route path="/auth" component={AuthPage} />
                <Route path="/firebase-auth" component={FirebaseAuthPage} />
                <Route component={NotFound} />
              </Switch>
            </AnimatePresence>
          </Layout>
        )}
        
        {/* Admin routes without Layout wrapper */}
        {isAdminRoute && (
          <Switch key={location}>
            {/* Legacy Passport.js Auth */}
            <ProtectedRoute path="/admin" component={AdminDashboard} />
            <ProtectedRoute path="/admin/blog-posts" component={BlogPostsPage} />
            
            {/* Firebase Auth - Uncomment the lines below to switch to Firebase Auth */}
            {/* <FirebaseProtectedRoute path="/admin">
              <AdminDashboard />
            </FirebaseProtectedRoute>
            <FirebaseProtectedRoute path="/admin/blog-posts">
              <BlogPostsPage />
            </FirebaseProtectedRoute> */}
            
            <Route component={NotFound} />
          </Switch>
        )}
      </AuthProvider>
    </FirebaseAuthProvider>
  );
}

export default App;
