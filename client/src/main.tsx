import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Router } from "wouter";
import { useBrowserLocation } from "./lib/wouter-config";
// Initialize Firebase early in the application lifecycle
import "./lib/firebase";
// Initialize Firestore with sample data
import { initializeFirestoreWithSampleData } from "@/lib/firestore";
// Import Firebase configuration test
import { testFirebaseConfig } from "@/lib/firebase-env-test";

// Check and initialize Firestore sample data if needed
initializeFirestoreWithSampleData()
  .then(() => console.log("Firestore initialization check complete"))
  .catch(error => console.error("Error during Firestore initialization:", error));
  
// Test Firebase configuration (helpful for debugging deployment issues)
if (import.meta.env.DEV || import.meta.env.VITE_DEBUG_MODE === 'true') {
  testFirebaseConfig()
    .then(result => console.log("Firebase config test result:", result))
    .catch(error => console.error("Firebase config test error:", error));
}

// Hydrate the React Query client with any server-provided data
const initialData = (window as any).__INITIAL_DATA__;
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
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      {/* Use browser history for better SEO */}
      <Router hook={useBrowserLocation}>
        <App />
      </Router>
      <Toaster />
    </TooltipProvider>
  </QueryClientProvider>
);

// If the app was server-rendered, hydrate it, otherwise render from scratch
if (isServerRendered) {
  console.log('Hydrating server-rendered content');
  hydrateRoot(rootElement, <AppWithProviders />);
} else {
  console.log('Rendering client-side only');
  createRoot(rootElement).render(<AppWithProviders />);
}
