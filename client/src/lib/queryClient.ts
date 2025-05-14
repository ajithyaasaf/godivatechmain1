import { QueryClient, QueryFunction } from "@tanstack/react-query";

// Get the API base URL from environment or use the backend URL for production
// In order of preference: VITE_SERVER_URL -> VITE_API_URL -> default fallback
const API_BASE_URL = import.meta.env.VITE_SERVER_URL || import.meta.env.VITE_API_URL || 'https://godivatech-backend.onrender.com';
console.log('API Base URL:', API_BASE_URL);

// Function to construct full API URL with improved environment handling
function getFullApiUrl(urlPath: string): string {
  // If the URL already starts with http(s), it's a full URL
  if (urlPath.startsWith('http')) {
    return urlPath;
  }
  
  // For development in Replit, use relative URLs to avoid CORS issues
  if (import.meta.env.DEV && window.location.hostname.includes('replit')) {
    return urlPath;
  }
  
  // For Vercel preview/production deployments, always use the full URL
  // to ensure consistent API connectivity
  const baseWithTrailingSlash = API_BASE_URL.endsWith('/') 
    ? API_BASE_URL 
    : `${API_BASE_URL}/`;
  
  const pathWithoutLeadingSlash = urlPath.startsWith('/') 
    ? urlPath.substring(1) 
    : urlPath;
    
  return `${baseWithTrailingSlash}${pathWithoutLeadingSlash}`;
}

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // Get the full API URL
  const fullUrl = getFullApiUrl(url);
  
  console.log(`API Request: ${method} ${fullUrl}`, data ? { data } : '');
  
  try {
    const res = await fetch(fullUrl, {
      method,
      headers: data ? { "Content-Type": "application/json" } : {},
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
    });
    
    console.log(`API Response: ${res.status} ${res.statusText} for ${method} ${fullUrl}`);
    
    if (!res.ok) {
      console.error(`API Error: ${res.status} ${res.statusText} for ${method} ${fullUrl}`);
      let errorDetails = res.statusText;
      
      try {
        // Try to parse JSON error details
        const errorText = await res.text();
        if (errorText) {
          console.error(`Error response body: ${errorText}`);
          try {
            const errorJson = JSON.parse(errorText);
            errorDetails = errorJson.message || errorJson.error || errorText;
          } catch (e) {
            // Not JSON, use text as is
            errorDetails = errorText;
          }
        }
      } catch (e) {
        console.error('Could not read error details from response', e);
      }
      
      throw new Error(`${res.status}: ${errorDetails}`);
    }
    
    return res;
  } catch (error) {
    console.error(`API Request failed for ${method} ${fullUrl}:`, error);
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const urlPath = queryKey[0] as string;
    const fullUrl = getFullApiUrl(urlPath);
    
    console.log(`Query fetch: GET ${urlPath} (Full URL: ${fullUrl})`);
    
    try {
      const res = await fetch(fullUrl, {
        credentials: "include",
      });
      
      console.log(`Query response: ${res.status} ${res.statusText} for GET ${urlPath}`);
      
      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        console.log(`Returning null for 401 response on ${urlPath} (unauthorized behavior: returnNull)`);
        return null;
      }
      
      if (!res.ok) {
        console.error(`Query error: ${res.status} ${res.statusText} for GET ${urlPath}`);
        let errorDetails = res.statusText;
        
        try {
          // Try to parse JSON error details
          const errorText = await res.text();
          if (errorText) {
            console.error(`Error response body: ${errorText}`);
            try {
              const errorJson = JSON.parse(errorText);
              errorDetails = errorJson.message || errorJson.error || errorText;
            } catch (e) {
              // Not JSON, use text as is
              errorDetails = errorText;
            }
          }
        } catch (e) {
          console.error('Could not read error details from response', e);
        }
        
        throw new Error(`${res.status}: ${errorDetails}`);
      }
      
      const data = await res.json();
      console.log(`Query data received for ${urlPath}:`, typeof data === 'object' ? 'object' : data);
      return data;
    } catch (error) {
      console.error(`Query failed for GET ${urlPath} (${fullUrl}):`, error);
      throw error;
    }
  };

/**
 * Creates an optimized Query Client instance with improved caching settings
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      // Fine-tuned caching behavior
      staleTime: 1000 * 60 * 5, // 5 minutes before data is considered stale
      cacheTime: 1000 * 60 * 30, // 30 minutes before unused data is garbage collected
      // Only refetch when window is focused if data is stale
      refetchOnWindowFocus: 'always',
      // Retry 3 times with exponential backoff if a query fails
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Reduce unnecessary refetches
      refetchInterval: false,
      // Add structured keys for better cache management
      structuralSharing: true,
      // Prevent refetch on component mount if data is fresh
      refetchOnMount: true,
    },
    mutations: {
      // Don't retry mutations to prevent duplicate writes
      retry: false,
      // Notify all related queries to refetch after mutation
      onSuccess: () => {
        queryClient.invalidateQueries();
      },
    },
  },
});
