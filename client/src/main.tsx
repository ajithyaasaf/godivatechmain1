import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./critical.css";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Router } from "wouter";
// Initialize Firebase early in the application lifecycle
import "./lib/firebase";
// Performance monitoring
import { initPerformanceMonitoring } from "./lib/performance";
// React DOM Warning Shield - Global protection
import ReactDOMWarningShield from "./components/ReactDOMWarningShield";

// Initialize performance monitoring
if (typeof window !== 'undefined') {
  // Start monitoring performance metrics
  initPerformanceMonitoring();
  
  // Preload critical resources
  const preloadLinks = [
    { rel: 'preload', href: '/fonts/Inter-var.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
    // API preloading removed for production to prevent wrong URL calls
    // APIs will be fetched on-demand with proper backend URLs
  ];
  
  // Add preload links to head
  preloadLinks.forEach(attrs => {
    const link = document.createElement('link');
    Object.entries(attrs).forEach(([key, value]) => {
      link.setAttribute(key, value as string);
    });
    document.head.appendChild(link);
  });
}

// Sample data initialization removed for production
// Production environment should use real data from the database
  
// Firebase configuration testing removed for production
// Testing code was moved to dedicated test utilities

// Hydrate the React Query client with any server-provided data
const initialData = typeof window !== 'undefined' ? (window as any).__INITIAL_DATA__ : null;
if (initialData) {
  console.log('Hydrating with server data');
  try {
    // Process the dehydrated state and populate the query cache
    initialData.forEach((query: any) => {
      if (query.queryKey && query.data !== undefined) {
        queryClient.setQueryData(query.queryKey, query.data);
      }
    });
  } catch (error) {
    console.error('Error hydrating from server data:', error);
  }
}

const rootElement = document.getElementById("root")!;
const isServerRendered = rootElement.children.length > 0;

const AppWithProviders = () => (
  <ReactDOMWarningShield enableStrictMode={true} enableAutofix={true}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* Use browser history for better SEO */}
        <Router>
          <App />
        </Router>
        <Toaster />

      </TooltipProvider>
    </QueryClientProvider>
  </ReactDOMWarningShield>
);

// If the app was server-rendered, hydrate it, otherwise render from scratch
if (isServerRendered) {
  console.log('Hydrating server-rendered content');
  hydrateRoot(rootElement, <AppWithProviders />);
} else {
  console.log('Rendering client-side only');
  createRoot(rootElement).render(<AppWithProviders />);
}
