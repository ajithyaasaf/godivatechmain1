// This file configures wouter to handle base URLs in Vercel

import { useState, useEffect } from 'react';

// Types for wouter hook
type NavigateFn = (to: string) => void;
type LocationHook = () => [string, NavigateFn];

// Custom hook for handling routing in the app
export const useHashLocation: LocationHook = () => {
  // Get current pathname
  const getPath = () => window.location.pathname || '/';
  
  // State to track current location
  const [path, setPath] = useState(getPath());
  
  // Handle navigation
  const navigate: NavigateFn = (to) => {
    window.history.pushState(null, '', to);
    setPath(to);
  };
  
  // Update path when browser history changes
  useEffect(() => {
    const handlePopState = () => setPath(getPath());
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return [path, navigate];
};