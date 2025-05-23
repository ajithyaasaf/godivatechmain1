// This file configures wouter to handle base URLs in Vercel

import { useState, useEffect } from 'react';

// Types for wouter hook
type NavigateFn = (to: string) => void;
type LocationHook = () => [string, NavigateFn];

// Hash-based routing for better compatibility with static deployments
export const useHashLocation: LocationHook = () => {
  // Get hash location (excluding the # symbol)
  const getHashPath = () => {
    const hash = window.location.hash;
    const path = hash.replace(/^#/, '') || '/';
    return path;
  };
  
  // State to track current location
  const [path, setPath] = useState(getHashPath());
  
  // Handle navigation
  const navigate: NavigateFn = (to) => {
    window.location.hash = to;
  };
  
  // Update path when hash changes
  useEffect(() => {
    const handleHashChange = () => setPath(getHashPath());
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return [path, navigate];
};

// Browser history-based routing for better SEO
export const useBrowserLocation: LocationHook = () => {
  // Get path from window.location
  const getPath = () => window.location.pathname || '/';
  
  // State to track current location
  const [path, setPath] = useState(getPath());
  
  // Handle navigation
  const navigate: NavigateFn = (to) => {
    // Use history API to change the URL without a page reload
    window.history.pushState(null, '', to);
    
    // Update the internal path state
    setPath(to);
    
    // Dispatch a custom event to notify other components of the navigation
    window.dispatchEvent(new CustomEvent('locationchange', { detail: { path: to } }));
  };
  
  // Update path when browser history changes
  useEffect(() => {
    // This handles the back/forward browser buttons
    const handlePopState = () => {
      const newPath = getPath();
      setPath(newPath);
      
      // Dispatch a custom event here too for consistency
      window.dispatchEvent(new CustomEvent('locationchange', { detail: { path: newPath } }));
    };
    
    // Listen for our custom event as well
    const handleLocationChange = () => {
      setPath(getPath());
    };
    
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('locationchange', handleLocationChange);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('locationchange', handleLocationChange);
    };
  }, []);

  return [path, navigate];
};