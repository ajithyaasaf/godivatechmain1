import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, Home, Search, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import PageTransition from "@/components/PageTransition";
import { motion } from "framer-motion";

export default function NotFound() {
  const [lastVisited, setLastVisited] = useState<string | null>(null);
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    // Try to get the last visited page from session storage
    const lastPage = sessionStorage.getItem("lastVisitedPage");
    if (lastPage && lastPage !== window.location.pathname) {
      setLastVisited(lastPage);
    }
    
    // Check if browser history allows going back
    setCanGoBack(window.history.length > 1);
  }, []);

  return (
    <PageTransition>
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-16 bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="text-center max-w-xl">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center mb-6"
          >
            <div className="relative">
              <div className="absolute inset-0 animate-ping rounded-full bg-red-100 opacity-75"></div>
              <AlertCircle size={48} className="text-primary relative" />
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-5xl font-bold text-gray-900 mb-4"
          >
            404
          </motion.h1>
          
          <motion.h2 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-2xl font-semibold text-gray-800 mb-4"
          >
            Page Not Found
          </motion.h2>
          
          <motion.p 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-gray-600 mb-8 max-w-md mx-auto"
          >
            The page you're looking for doesn't exist or has been moved. 
            Let us help you find what you need.
          </motion.p>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button asChild className="gap-2">
              <Link to="/">
                <Home size={16} />
                Return Home
              </Link>
            </Button>
            
            {(lastVisited || canGoBack) && (
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => {
                  if (lastVisited) {
                    window.location.href = lastVisited;
                  } else if (canGoBack) {
                    window.history.back();
                  }
                }}
              >
                <ArrowLeft size={16} />
                Go Back
              </Button>
            )}
            
            <Button variant="outline" asChild className="gap-2">
              <Link to="/contact">
                <Search size={16} />
                Need Help?
              </Link>
            </Button>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-12 text-sm text-gray-500"
          >
            <p>Looking for something specific? Here are some helpful links:</p>
            <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2">
              <Link to="/services" className="text-primary hover:underline">Services</Link>
              <Link to="/portfolio" className="text-primary hover:underline">Portfolio</Link>
              <Link to="/about" className="text-primary hover:underline">About Us</Link>
              <Link to="/blog" className="text-primary hover:underline">Blog</Link>
              <Link to="/contact" className="text-primary hover:underline">Contact</Link>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
