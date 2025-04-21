import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Services from "@/pages/Services";
import Portfolio from "@/pages/Portfolio";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/not-found";

/**
 * Modern App wrapper with advanced AnimatePresence for page transitions
 */
function App() {
  const [location] = useLocation();
  
  // We don't need the explicit ScrollToTop component anymore as it's handled in PageTransition
  
  return (
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
          <Route component={NotFound} />
        </Switch>
      </AnimatePresence>
    </Layout>
  );
}

export default App;
