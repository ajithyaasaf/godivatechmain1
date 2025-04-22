import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
// Initialize Firebase early in the application lifecycle
import "./lib/firebase";
// Initialize Firestore with sample data
import { initializeFirestoreWithSampleData } from "@/lib/firestore";

// Check and initialize Firestore sample data if needed
initializeFirestoreWithSampleData()
  .then(() => console.log("Firestore initialization check complete"))
  .catch(error => console.error("Error during Firestore initialization:", error));

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <App />
      <Toaster />
    </TooltipProvider>
  </QueryClientProvider>
);
