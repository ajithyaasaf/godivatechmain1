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
            {/* Dual Authentication - accepts both traditional and Firebase auth */}
            <Route path="/admin" exact>
              {() => {
                // Use legacy auth first
                const legacyRoute = <ProtectedRoute path="/admin" exact component={AdminDashboard} />;
                // Use Firebase auth as a fallback
                const firebaseRoute = (
                  <FirebaseProtectedRoute>
                    <AdminDashboard />
                  </FirebaseProtectedRoute>
                );
                
                return (
                  <>
                    {legacyRoute}
                    {firebaseRoute}
                  </>
                );
              }}
            </Route>
            
            <Route path="/admin/blog-posts">
              {() => {
                const legacyRoute = <ProtectedRoute path="/admin/blog-posts" component={BlogPostsPage} />;
                const firebaseRoute = (
                  <FirebaseProtectedRoute>
                    <BlogPostsPage />
                  </FirebaseProtectedRoute>
                );
                
                return (
                  <>
                    {legacyRoute}
                    {firebaseRoute}
                  </>
                );
              }}
            </Route>
            
            <Route path="/admin/categories">
              {() => {
                const legacyRoute = <ProtectedRoute path="/admin/categories" component={CategoriesPage} />;
                const firebaseRoute = (
                  <FirebaseProtectedRoute>
                    <CategoriesPage />
                  </FirebaseProtectedRoute>
                );
                
                return (
                  <>
                    {legacyRoute}
                    {firebaseRoute}
                  </>
                );
              }}
            </Route>
            
            <Route path="/admin/services">
              {() => {
                const legacyRoute = <ProtectedRoute path="/admin/services" component={ServicesPage} />;
                const firebaseRoute = (
                  <FirebaseProtectedRoute>
                    <ServicesPage />
                  </FirebaseProtectedRoute>
                );
                
                return (
                  <>
                    {legacyRoute}
                    {firebaseRoute}
                  </>
                );
              }}
            </Route>
            
            <Route path="/admin/team-members">
              {() => {
                const legacyRoute = <ProtectedRoute path="/admin/team-members" component={TeamMembersPage} />;
                const firebaseRoute = (
                  <FirebaseProtectedRoute>
                    <TeamMembersPage />
                  </FirebaseProtectedRoute>
                );
                
                return (
                  <>
                    {legacyRoute}
                    {firebaseRoute}
                  </>
                );
              }}
            </Route>
            
            <Route path="/admin/testimonials">
              {() => {
                const legacyRoute = <ProtectedRoute path="/admin/testimonials" component={TestimonialsPage} />;
                const firebaseRoute = (
                  <FirebaseProtectedRoute>
                    <TestimonialsPage />
                  </FirebaseProtectedRoute>
                );
                
                return (
                  <>
                    {legacyRoute}
                    {firebaseRoute}
                  </>
                );
              }}
            </Route>
            
            <Route path="/admin/projects">
              {() => {
                const legacyRoute = <ProtectedRoute path="/admin/projects" component={ProjectsPage} />;
                const firebaseRoute = (
                  <FirebaseProtectedRoute>
                    <ProjectsPage />
                  </FirebaseProtectedRoute>
                );
                
                return (
                  <>
                    {legacyRoute}
                    {firebaseRoute}
                  </>
                );
              }}
            </Route>
            
            <Route path="/admin/contact-messages">
              {() => {
                const legacyRoute = <ProtectedRoute path="/admin/contact-messages" component={ContactMessagesPage} />;
                const firebaseRoute = (
                  <FirebaseProtectedRoute>
                    <ContactMessagesPage />
                  </FirebaseProtectedRoute>
                );
                
                return (
                  <>
                    {legacyRoute}
                    {firebaseRoute}
                  </>
                );
              }}
            </Route>
            
            <Route path="/admin/subscribers">
              {() => {
                const legacyRoute = <ProtectedRoute path="/admin/subscribers" component={SubscribersPage} />;
                const firebaseRoute = (
                  <FirebaseProtectedRoute>
                    <SubscribersPage />
                  </FirebaseProtectedRoute>
                );
                
                return (
                  <>
                    {legacyRoute}
                    {firebaseRoute}
                  </>
                );
              }}
            </Route>
            
            <Route component={NotFound} />
          </Switch>
        )}
      </AuthProvider>
    </FirebaseAuthProvider>
  );
}

export default App;
