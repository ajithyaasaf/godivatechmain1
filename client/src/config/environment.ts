/**
 * Environment configuration with proper fallbacks for production deployment
 */

// Get environment mode
const mode = import.meta.env.MODE;
const isProd = mode === 'production';
const isDev = mode === 'development';

// Helper to get environment variable with logging
const getEnvVar = (key: string, fallback?: string): string => {
  const value = import.meta.env[key] || fallback || '';
  
  // Log environment variable status in development
  if (isDev) {
    console.log(`Environment variable ${key}: ${value ? 'Set' : 'Not set'}`);
  }
  
  return value;
};

// API Configuration
export const API_CONFIG = {
  // Primary API URL - defaults to same-origin relative URL for unified serverless deployment
  BASE_URL: (() => {
    // If VITE_API_URL is explicitly configured, use it (useful for custom staging/testing)
    const apiUrl = getEnvVar('VITE_API_URL');
    if (apiUrl) return apiUrl;
    
    // Try VITE_SERVER_URL as secondary override
    const serverUrl = getEnvVar('VITE_SERVER_URL');
    if (serverUrl) return serverUrl;
    
    // Default to same-origin relative URL for both dev and Vercel production
    return '';
  })(),
  
  // Timeout for API requests
  TIMEOUT: 30000, // 30 seconds
  
  // Whether to include credentials in requests
  CREDENTIALS: 'include' as RequestCredentials,
};

// Firebase Configuration
export const FIREBASE_CONFIG = {
  apiKey: getEnvVar('VITE_FIREBASE_API_KEY'),
  authDomain: getEnvVar('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnvVar('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: getEnvVar('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnvVar('VITE_FIREBASE_APP_ID'),
  measurementId: getEnvVar('VITE_GA_MEASUREMENT_ID'),
};

// Analytics Configuration
export const ANALYTICS_CONFIG = {
  GA_MEASUREMENT_ID: getEnvVar('VITE_GA_MEASUREMENT_ID'),
  ENABLED: isProd && !!getEnvVar('VITE_GA_MEASUREMENT_ID'),
};

// App Configuration
export const APP_CONFIG = {
  NAME: 'GodivaTech',
  DESCRIPTION: 'Professional technology services for your business',
  URL: isProd ? 'https://www.godivatech.com' : 'http://localhost:5000',
};

// Environment flags with better detection
export const ENV = {
  isDev,
  isProd,
  mode,
  isReplit: typeof window !== 'undefined' && window.location.hostname.includes('replit'),
  isProduction: isProd || (typeof window !== 'undefined' && 
    window.location.hostname.includes('godivatech.com')
  ),
};

// Log configuration in development
if (isDev) {
  console.log('Environment Configuration:', {
    mode,
    API_BASE_URL: API_CONFIG.BASE_URL,
    FIREBASE_PROJECT: FIREBASE_CONFIG.projectId,
    ANALYTICS_ENABLED: ANALYTICS_CONFIG.ENABLED,
  });
}